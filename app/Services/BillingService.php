<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class BillingService
{
    public function __construct(
        protected PlanLimitService $planLimitService,
    ) {}

    /**
     * Retrieve defined application plan offerings.
     *
     * @return array<string, array{
     *     id: string,
     *     name: string,
     *     price: string,
     *     price_cents: int,
     *     interval: string,
     *     description: string,
     *     max_spaces: int,
     *     max_testimonials: int,
     *     features: list<string>,
     *     highlighted: bool
     * }>
     */
    public function getPlans(): array
    {
        return [
            'free' => [
                'id' => 'free',
                'name' => 'Free',
                'price' => '$0',
                'price_cents' => 0,
                'interval' => 'forever',
                'description' => 'For indie creators, personal projects, and simple feedback collection.',
                'max_spaces' => PlanLimitService::FREE_MAX_SPACES,
                'max_testimonials' => PlanLimitService::FREE_MAX_TESTIMONIALS,
                'features' => [
                    'Up to 3 active spaces',
                    '100 testimonials per space',
                    'Customizable public submission form',
                    'Masonry & carousel embed widgets',
                    'Wall of Love moderation tools',
                    'Honeypot spam protection',
                ],
                'highlighted' => false,
            ],
            'pro' => [
                'id' => 'pro',
                'name' => 'Pro',
                'price' => '$9.99',
                'price_cents' => 999,
                'interval' => 'per month',
                'description' => 'For growing teams and SaaS founders needing multi-space social proof at scale.',
                'max_spaces' => PlanLimitService::PRO_MAX_SPACES,
                'max_testimonials' => PlanLimitService::PRO_MAX_TESTIMONIALS,
                'features' => [
                    'Up to 25 active spaces',
                    '1,000 testimonials per space',
                    'Priority live embed runtime',
                    'Direct Stripe customer billing portal',
                    'Full embed theme customizer',
                    'Wall of Love curation controls',
                    'Standard email support',
                ],
                'highlighted' => true,
            ],
        ];
    }

    /**
     * Get the billing summary for a user.
     *
     * @return array{
     *     is_pro: bool,
     *     current_plan: string,
     *     on_grace_period: bool,
     *     ends_at: string|null,
     *     stripe_status: string,
     *     pm_type: string|null,
     *     pm_last_four: string|null,
     *     space_usage: array{
     *         current: int,
     *         max: int,
     *         remaining: int,
     *         can_create: bool,
     *         is_pro: bool
     *     }
     * }
     */
    public function getBillingSummary(User $user): array
    {
        $subscription = $user->subscription('default');
        $isPro = $this->planLimitService->isPro($user);

        return [
            'is_pro' => $isPro,
            'current_plan' => $isPro ? 'pro' : 'free',
            'on_grace_period' => $subscription ? $subscription->onGracePeriod() : false,
            'ends_at' => $subscription?->ends_at?->format('M j, Y'),
            'stripe_status' => $subscription ? $subscription->stripe_status : 'inactive',
            'pm_type' => $user->pm_type,
            'pm_last_four' => $user->pm_last_four,
            'space_usage' => $this->planLimitService->getSpaceUsage($user),
        ];
    }

    /**
     * Create a Stripe Checkout session for upgrading to Pro.
     */
    public function createCheckoutSession(User $user, string $successUrl, string $cancelUrl): string
    {
        $priceId = (string) config('services.stripe.pro_price_id', 'price_fake_pro_monthly');

        $checkout = $user->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => $successUrl,
                'cancel_url' => $cancelUrl,
                'client_reference_id' => (string) $user->id,
            ]);

        return (string) $checkout->asStripeCheckoutSession()->url;
    }

    /**
     * Retrieve the Stripe Customer Portal URL.
     */
    public function getBillingPortalUrl(User $user, string $returnUrl): string
    {
        if (! $user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }

        return $user->billingPortalUrl($returnUrl);
    }

    /**
     * Cancel an active subscription (sets grace period).
     */
    public function cancelSubscription(User $user): void
    {
        $subscription = $user->subscription('default');

        if ($subscription && ! $subscription->canceled()) {
            $subscription->cancel();
        }
    }

    /**
     * Resume a canceled subscription during its grace period.
     */
    public function resumeSubscription(User $user): void
    {
        $subscription = $user->subscription('default');

        if ($subscription && $subscription->onGracePeriod()) {
            $subscription->resume();
        }
    }

    /**
     * Synchronize customer subscriptions directly from the Stripe API.
     * Useful when webhooks cannot reach local development or for instant plan activation.
     */
    public function syncFromStripe(User $user): bool
    {
        if (! $user->hasStripeId()) {
            return false;
        }

        try {
            $stripe = $user->stripe();
            $subscriptions = $stripe->subscriptions->all([
                'customer' => $user->stripe_id,
                'status' => 'all',
                'limit' => 5,
            ]);

            foreach ($subscriptions->data as $data) {
                $firstItem = $data->items->data[0] ?? null;
                if (! $firstItem) {
                    continue;
                }

                $trialEndsAt = $data->trial_end ? Carbon::createFromTimestamp($data->trial_end) : null;
                $endsAt = $data->cancel_at_period_end && $data->current_period_end
                    ? Carbon::createFromTimestamp($data->current_period_end)
                    : ($data->ended_at ? Carbon::createFromTimestamp($data->ended_at) : null);

                $subscription = $user->subscriptions()->updateOrCreate([
                    'stripe_id' => $data->id,
                ], [
                    'type' => $data->metadata->type ?? $data->metadata->name ?? 'default',
                    'stripe_status' => $data->status,
                    'stripe_price' => $firstItem->price->id,
                    'quantity' => $firstItem->quantity ?? 1,
                    'trial_ends_at' => $trialEndsAt,
                    'ends_at' => $endsAt,
                ]);

                foreach ($data->items->data as $item) {
                    $subscription->items()->updateOrCreate([
                        'stripe_id' => $item->id,
                    ], [
                        'stripe_product' => $item->price->product,
                        'stripe_price' => $item->price->id,
                        'quantity' => $item->quantity ?? 1,
                    ]);
                }
            }

            try {
                $user->updateDefaultPaymentMethodFromStripe();
            } catch (\Throwable) {
                // Ignore payment method sync error if not set
            }

            return $user->refresh()->subscribed('default');
        } catch (\Throwable) {
            return false;
        }
    }
}
