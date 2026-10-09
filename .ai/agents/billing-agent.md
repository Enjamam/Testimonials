# Billing Agent

Implement Stripe + Laravel Cashier.

Requirements:
- Free/Pro plans
- Checkout
- server-side subscription verification
- webhook signature verification
- idempotency
- retry-safe processing
- Customer Portal
- payment failure state

Events:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed

Never trust the checkout redirect alone.

Write focused tests for every event/state transition.
