<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;
use Symfony\Component\HttpFoundation\Response;

class StripeWebhookController extends CashierWebhookController
{
    /**
     * Handle checkout.session.completed.
     *
     * @param  array<string, mixed>  $payload
     */
    protected function handleCheckoutSessionCompleted(array $payload): Response
    {
        /** @var array<string, mixed> $session */
        $session = $payload['data']['object'] ?? [];

        Log::info('Stripe webhook: checkout.session.completed', [
            'event_id' => $payload['id'] ?? null,
            'customer' => $session['customer'] ?? null,
            'subscription' => $session['subscription'] ?? null,
        ]);

        if (! empty($session['customer']) && ! empty($session['client_reference_id'])) {
            $user = User::query()->whereKey($session['client_reference_id'])->first();
            if ($user instanceof User && ! $user->stripe_id) {
                $user->stripe_id = (string) $session['customer'];
                $user->save();
            }
        }

        return $this->successMethod();
    }

    /**
     * Handle customer.subscription.created.
     *
     * @param  array<string, mixed>  $payload
     */
    protected function handleCustomerSubscriptionCreated(array $payload): Response
    {
        /** @var array<string, mixed> $data */
        $data = $payload['data']['object'] ?? [];

        Log::info('Stripe webhook: customer.subscription.created', [
            'event_id' => $payload['id'] ?? null,
            'customer' => $data['customer'] ?? null,
            'subscription_id' => $data['id'] ?? null,
        ]);

        return parent::handleCustomerSubscriptionCreated($payload);
    }

    /**
     * Handle customer.subscription.updated.
     *
     * @param  array<string, mixed>  $payload
     */
    protected function handleCustomerSubscriptionUpdated(array $payload): Response
    {
        /** @var array<string, mixed> $data */
        $data = $payload['data']['object'] ?? [];

        Log::info('Stripe webhook: customer.subscription.updated', [
            'event_id' => $payload['id'] ?? null,
            'customer' => $data['customer'] ?? null,
            'subscription_id' => $data['id'] ?? null,
            'status' => $data['status'] ?? null,
        ]);

        return parent::handleCustomerSubscriptionUpdated($payload);
    }

    /**
     * Handle customer.subscription.deleted.
     *
     * @param  array<string, mixed>  $payload
     */
    protected function handleCustomerSubscriptionDeleted(array $payload): Response
    {
        /** @var array<string, mixed> $data */
        $data = $payload['data']['object'] ?? [];

        Log::info('Stripe webhook: customer.subscription.deleted', [
            'event_id' => $payload['id'] ?? null,
            'customer' => $data['customer'] ?? null,
            'subscription_id' => $data['id'] ?? null,
        ]);

        return parent::handleCustomerSubscriptionDeleted($payload);
    }

    /**
     * Handle invoice.paid.
     *
     * @param  array<string, mixed>  $payload
     */
    protected function handleInvoicePaid(array $payload): Response
    {
        /** @var array<string, mixed> $invoice */
        $invoice = $payload['data']['object'] ?? [];

        Log::info('Stripe webhook: invoice.paid', [
            'event_id' => $payload['id'] ?? null,
            'customer' => $invoice['customer'] ?? null,
            'invoice_id' => $invoice['id'] ?? null,
            'amount_paid' => $invoice['amount_paid'] ?? 0,
        ]);

        return $this->successMethod();
    }

    /**
     * Handle invoice.payment_failed.
     *
     * @param  array<string, mixed>  $payload
     */
    protected function handleInvoicePaymentFailed(array $payload): Response
    {
        /** @var array<string, mixed> $invoice */
        $invoice = $payload['data']['object'] ?? [];

        Log::warning('Stripe webhook: invoice.payment_failed', [
            'event_id' => $payload['id'] ?? null,
            'customer' => $invoice['customer'] ?? null,
            'invoice_id' => $invoice['id'] ?? null,
            'amount_due' => $invoice['amount_due'] ?? 0,
        ]);

        return $this->successMethod();
    }
}
