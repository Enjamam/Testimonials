<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\BillingService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class BillingController extends Controller
{
    public function __construct(
        protected BillingService $billingService,
    ) {}

    /**
     * Display the billing and subscription management page.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $statusMessage = session('status');
        $statusType = session('status') ? 'success' : null;

        // Automatically sync from Stripe if returning from checkout, if session_id is provided, or if requested
        if ($request->has('success') || $request->has('session_id') || $request->has('sync')) {
            if (! $user->subscribed('default')) {
                $this->billingService->syncFromStripe($user);
                $user->refresh();
            }

            if ($user->subscribed('default')) {
                $statusMessage = 'Welcome to Pro! Your subscription is active.';
                $statusType = 'success';
            } else {
                $statusMessage = 'Payment submitted. If your plan does not activate in a moment, click "Sync Plan".';
                $statusType = 'notice';
            }
        } elseif ($request->has('canceled')) {
            $statusMessage = 'Checkout was canceled. No charges were made.';
            $statusType = 'notice';
        }

        return Inertia::render('billing/index', [
            'plans' => $this->billingService->getPlans(),
            'summary' => $this->billingService->getBillingSummary($user),
            'status' => $statusMessage,
            'statusType' => $statusType,
            'errorMessage' => session('error'),
        ]);
    }

    /**
     * Synchronize customer subscriptions directly from Stripe.
     */
    public function sync(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $synced = $this->billingService->syncFromStripe($user);

        if ($synced) {
            return redirect()->route('billing.index')->with('status', 'Your Pro subscription was successfully synchronized from Stripe!');
        }

        return redirect()->route('billing.index')->with('status', 'Synchronized with Stripe. No active subscriptions found.');
    }

    /**
     * Initiate Stripe Checkout session for upgrading to Pro.
     */
    public function checkout(Request $request): SymfonyResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->subscribed('default') && ! $user->subscription('default')?->onGracePeriod()) {
            return redirect()->route('billing.index')->with('status', 'You already have an active Pro subscription.');
        }

        try {
            $successUrl = route('billing.index').'?success=1&session_id={CHECKOUT_SESSION_ID}';
            $cancelUrl = route('billing.index', ['canceled' => 1]);

            $checkoutUrl = $this->billingService->createCheckoutSession($user, $successUrl, $cancelUrl);

            return Inertia::location($checkoutUrl);
        } catch (Exception $e) {
            return redirect()->route('billing.index')->with('error', 'Unable to initiate checkout: '.$e->getMessage());
        }
    }

    /**
     * Redirect to the Stripe Customer Portal for managing payment methods and invoices.
     */
    public function portal(Request $request): SymfonyResponse
    {
        /** @var User $user */
        $user = $request->user();

        try {
            $portalUrl = $this->billingService->getBillingPortalUrl($user, route('billing.index'));

            return Inertia::location($portalUrl);
        } catch (Exception $e) {
            return redirect()->route('billing.index')->with('error', 'Unable to open billing portal: '.$e->getMessage());
        }
    }

    /**
     * Cancel an active subscription and place it on grace period.
     */
    public function cancel(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        try {
            $this->billingService->cancelSubscription($user);

            return redirect()->route('billing.index')->with(
                'status',
                'Your subscription has been canceled. You maintain Pro access until the end of your billing cycle.'
            );
        } catch (Exception $e) {
            return redirect()->route('billing.index')->with('error', 'Unable to cancel subscription: '.$e->getMessage());
        }
    }

    /**
     * Resume a canceled subscription during its grace period.
     */
    public function resume(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        try {
            $this->billingService->resumeSubscription($user);

            return redirect()->route('billing.index')->with('status', 'Your Pro subscription has been resumed.');
        } catch (Exception $e) {
            return redirect()->route('billing.index')->with('error', 'Unable to resume subscription: '.$e->getMessage());
        }
    }
}
