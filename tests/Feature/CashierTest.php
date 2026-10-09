<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Laravel\Cashier\Billable;

test('user model includes the billable trait', function () {
    expect(class_uses_recursive(User::class))->toContain(Billable::class);
});

test('user model casts trial_ends_at to datetime', function () {
    $user = new User([
        'trial_ends_at' => '2026-10-08 12:00:00',
    ]);

    expect($user->hasCast('trial_ends_at', 'datetime'))->toBeTrue();
});

test('cashier customer columns exist on users table', function () {
    expect(Schema::hasColumns('users', [
        'stripe_id',
        'pm_type',
        'pm_last_four',
        'trial_ends_at',
    ]))->toBeTrue();
});

test('cashier subscriptions and items tables exist', function () {
    expect(Schema::hasTable('subscriptions'))->toBeTrue()
        ->and(Schema::hasTable('subscription_items'))->toBeTrue();
});

test('cashier routes are registered', function () {
    expect(Route::has('cashier.payment'))->toBeTrue()
        ->and(Route::has('cashier.webhook'))->toBeTrue();
});

test('stripe webhook endpoint is accessible without csrf rejection', function () {
    $response = $this->postJson(route('cashier.webhook'), [
        'type' => 'invoice.payment_succeeded',
        'id' => 'evt_test_123',
    ]);

    $response->assertOk();
});
