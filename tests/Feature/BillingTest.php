<?php

use App\Models\Space;
use App\Models\User;
use App\Services\BillingService;
use App\Services\PlanLimitService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests cannot access billing routes', function () {
    $this->get(route('billing.index'))->assertRedirect(route('login'));
    $this->post(route('billing.checkout'))->assertRedirect(route('login'));
    $this->get(route('billing.portal'))->assertRedirect(route('login'));
    $this->post(route('billing.cancel'))->assertRedirect(route('login'));
    $this->post(route('billing.resume'))->assertRedirect(route('login'));
});

test('authenticated user on free tier can view billing page with usage summary', function () {
    $user = User::factory()->create();
    Space::factory()->count(2)->for($user)->create();

    $this->actingAs($user)
        ->get(route('billing.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('billing/index')
            ->has('plans.free')
            ->has('plans.pro')
            ->where('summary.is_pro', false)
            ->where('summary.current_plan', 'free')
            ->where('summary.space_usage.current', 2)
            ->where('summary.space_usage.max', 3)
            ->where('summary.space_usage.remaining', 1)
        );
});

test('pro subscriber sees pro plan active on billing page', function () {
    $user = User::factory()->pro()->create();

    $this->actingAs($user)
        ->get(route('billing.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('billing/index')
            ->where('summary.is_pro', true)
            ->where('summary.current_plan', 'pro')
            ->where('summary.space_usage.max', 25)
        );
});

test('initiating checkout redirects user to stripe checkout url', function () {
    $user = User::factory()->create();

    $this->mock(BillingService::class, function ($mock) {
        $mock->shouldReceive('createCheckoutSession')
            ->once()
            ->andReturn('https://checkout.stripe.com/c/pay/cs_test_mock_session');
    });

    $response = $this->actingAs($user)->post(route('billing.checkout'), [], [
        'X-Inertia' => 'true',
    ]);

    $response->assertStatus(409); // Inertia external redirect uses 409 Conflict with X-Inertia-Location header
    $response->assertHeader('X-Inertia-Location', 'https://checkout.stripe.com/c/pay/cs_test_mock_session');
});

test('already subscribed active user cannot start another checkout', function () {
    $user = User::factory()->pro()->create();

    $this->actingAs($user)
        ->post(route('billing.checkout'))
        ->assertRedirect(route('billing.index'))
        ->assertSessionHas('status', 'You already have an active Pro subscription.');
});

test('portal action redirects user to stripe billing portal url', function () {
    $user = User::factory()->pro()->create();

    $this->mock(BillingService::class, function ($mock) {
        $mock->shouldReceive('getBillingPortalUrl')
            ->once()
            ->andReturn('https://billing.stripe.com/p/session/portal_test_mock');
    });

    $response = $this->actingAs($user)->get(route('billing.portal'));

    $response->assertRedirect('https://billing.stripe.com/p/session/portal_test_mock');
});

test('user can cancel active subscription and remain on grace period', function () {
    $user = User::factory()->pro()->create();
    $subscription = $user->subscription('default');

    $this->mock(BillingService::class, function ($mock) {
        $mock->shouldReceive('cancelSubscription')
            ->once();
    });

    $this->actingAs($user)
        ->post(route('billing.cancel'))
        ->assertRedirect(route('billing.index'))
        ->assertSessionHas('status');

    // Simulate Stripe webhook setting ends_at in future
    $subscription->update(['ends_at' => now()->addDays(20)]);

    $planLimitService = app(PlanLimitService::class);
    expect($user->fresh()->subscribed('default'))->toBeTrue()
        ->and($planLimitService->isPro($user->fresh()))->toBeTrue()
        ->and($planLimitService->maxSpaces($user->fresh()))->toBe(25);
});

test('user can resume subscription while on grace period', function () {
    $user = User::factory()->pro()->create();
    $subscription = $user->subscription('default');
    $subscription->update(['ends_at' => now()->addDays(15)]);

    $this->mock(BillingService::class, function ($mock) {
        $mock->shouldReceive('resumeSubscription')
            ->once();
    });

    $this->actingAs($user)
        ->post(route('billing.resume'))
        ->assertRedirect(route('billing.index'))
        ->assertSessionHas('status');
});

test('plan limits drop to free tier after subscription ends', function () {
    $user = User::factory()->pro()->create();
    $space = Space::factory()->for($user)->create();

    $planLimitService = app(PlanLimitService::class);
    expect($planLimitService->isPro($user))->toBeTrue()
        ->and($planLimitService->maxSpaces($user))->toBe(25)
        ->and($planLimitService->maxTestimonials($space))->toBe(1000);

    // End subscription (ends_at in past)
    $user->subscription('default')->update([
        'ends_at' => now()->subDay(),
        'stripe_status' => 'canceled',
    ]);

    expect($planLimitService->isPro($user->fresh()))->toBeFalse()
        ->and($planLimitService->maxSpaces($user->fresh()))->toBe(3)
        ->and($planLimitService->maxTestimonials($space->fresh()))->toBe(100);
});

test('webhook rejects requests with invalid signature when secret is set', function () {
    config(['cashier.webhook.secret' => 'whsec_test_secret_key_12345']);

    $payload = [
        'id' => 'evt_test_123',
        'type' => 'invoice.paid',
        'data' => ['object' => ['id' => 'in_123']],
    ];

    $response = $this->postJson(route('cashier.webhook'), $payload, [
        'Stripe-Signature' => 't=12345,v1=invalid_signature',
    ]);

    $response->assertStatus(403);
});

test('webhook handles customer.subscription.created event and syncs database', function () {
    config(['cashier.webhook.secret' => null]);

    $user = User::factory()->create(['stripe_id' => 'cus_stripe_abc123']);

    $payload = [
        'id' => 'evt_sub_created_123',
        'type' => 'customer.subscription.created',
        'data' => [
            'object' => [
                'id' => 'sub_stripe_test_123',
                'customer' => 'cus_stripe_abc123',
                'status' => 'active',
                'metadata' => ['name' => 'default'],
                'items' => [
                    'data' => [
                        [
                            'id' => 'si_test_item_123',
                            'price' => [
                                'id' => 'price_pro_monthly',
                                'product' => 'prod_pro_123',
                            ],
                            'quantity' => 1,
                        ],
                    ],
                ],
            ],
        ],
    ];

    $response = $this->postJson(route('cashier.webhook'), $payload);
    $response->assertOk();

    $this->assertDatabaseHas('subscriptions', [
        'user_id' => $user->id,
        'stripe_id' => 'sub_stripe_test_123',
        'type' => 'default',
        'stripe_status' => 'active',
    ]);

    $this->assertDatabaseHas('subscription_items', [
        'stripe_id' => 'si_test_item_123',
        'stripe_price' => 'price_pro_monthly',
    ]);

    expect($user->fresh()->subscribed('default'))->toBeTrue();
});

test('webhook handles duplicate events idempotently without throwing error', function () {
    config(['cashier.webhook.secret' => null]);

    $user = User::factory()->create(['stripe_id' => 'cus_duplicate_test']);

    $payload = [
        'id' => 'evt_duplicate_test_1',
        'type' => 'customer.subscription.created',
        'data' => [
            'object' => [
                'id' => 'sub_duplicate_test',
                'customer' => 'cus_duplicate_test',
                'status' => 'active',
                'metadata' => ['name' => 'default'],
                'items' => [
                    'data' => [
                        [
                            'id' => 'si_dup_item',
                            'price' => [
                                'id' => 'price_pro_monthly',
                                'product' => 'prod_dup',
                            ],
                            'quantity' => 1,
                        ],
                    ],
                ],
            ],
        ],
    ];

    // First delivery
    $response1 = $this->postJson(route('cashier.webhook'), $payload);
    $response1->assertOk();

    // Duplicate delivery
    $response2 = $this->postJson(route('cashier.webhook'), $payload);
    $response2->assertOk();

    // Ensure exactly 1 subscription record exists
    expect($user->subscriptions()->count())->toBe(1);
});

test('webhook handles customer.subscription.updated event', function () {
    config(['cashier.webhook.secret' => null]);

    $user = User::factory()->pro()->create();
    $subscription = $user->subscription('default');

    $payload = [
        'id' => 'evt_sub_updated_1',
        'type' => 'customer.subscription.updated',
        'data' => [
            'object' => [
                'id' => $subscription->stripe_id,
                'customer' => $user->stripe_id,
                'status' => 'past_due',
                'metadata' => ['name' => 'default'],
                'items' => [
                    'data' => [
                        [
                            'id' => 'si_updated_item',
                            'price' => [
                                'id' => 'price_pro_monthly',
                                'product' => 'prod_updated',
                            ],
                            'quantity' => 1,
                        ],
                    ],
                ],
            ],
        ],
    ];

    $response = $this->postJson(route('cashier.webhook'), $payload);
    $response->assertOk();

    expect($subscription->fresh()->stripe_status)->toBe('past_due');
});

test('webhook handles customer.subscription.deleted event', function () {
    config(['cashier.webhook.secret' => null]);

    $user = User::factory()->pro()->create();
    $subscription = $user->subscription('default');

    $payload = [
        'id' => 'evt_sub_deleted_1',
        'type' => 'customer.subscription.deleted',
        'data' => [
            'object' => [
                'id' => $subscription->stripe_id,
                'customer' => $user->stripe_id,
                'status' => 'canceled',
                'ended_at' => Carbon::now()->timestamp,
                'metadata' => ['name' => 'default'],
                'items' => [
                    'data' => [
                        [
                            'id' => 'si_deleted_item',
                            'price' => [
                                'id' => 'price_pro_monthly',
                                'product' => 'prod_deleted',
                            ],
                            'quantity' => 1,
                        ],
                    ],
                ],
            ],
        ],
    ];

    $response = $this->postJson(route('cashier.webhook'), $payload);
    $response->assertOk();

    expect($subscription->fresh()->stripe_status)->toBe('canceled')
        ->and($user->fresh()->subscribed('default'))->toBeFalse();
});

test('webhook links customer stripe_id from checkout.session.completed', function () {
    config(['cashier.webhook.secret' => null]);

    $user = User::factory()->create(['stripe_id' => null]);

    $payload = [
        'id' => 'evt_checkout_completed',
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'id' => 'cs_completed_123',
                'customer' => 'cus_linked_from_checkout',
                'client_reference_id' => (string) $user->id,
                'mode' => 'subscription',
            ],
        ],
    ];

    $response = $this->postJson(route('cashier.webhook'), $payload);
    $response->assertOk();

    expect($user->fresh()->stripe_id)->toBe('cus_linked_from_checkout');
});

test('webhook processes invoice.paid and invoice.payment_failed successfully', function () {
    config(['cashier.webhook.secret' => null]);

    $paidPayload = [
        'id' => 'evt_inv_paid',
        'type' => 'invoice.paid',
        'data' => [
            'object' => [
                'id' => 'in_paid_123',
                'customer' => 'cus_paid_test',
                'amount_paid' => 999,
            ],
        ],
    ];

    $this->postJson(route('cashier.webhook'), $paidPayload)->assertOk();

    $failedPayload = [
        'id' => 'evt_inv_failed',
        'type' => 'invoice.payment_failed',
        'data' => [
            'object' => [
                'id' => 'in_failed_123',
                'customer' => 'cus_failed_test',
                'amount_due' => 999,
            ],
        ],
    ];

    $this->postJson(route('cashier.webhook'), $failedPayload)->assertOk();
});
