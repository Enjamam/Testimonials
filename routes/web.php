<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmbedController;
use App\Http\Controllers\PublicEmbedController;
use App\Http\Controllers\PublicSpaceController;
use App\Http\Controllers\SpaceController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\Route;
use Laravel\Cashier\Http\Controllers\PaymentController;

Route::inertia('/', 'welcome')->name('home');

// Cashier payment verification & webhook routes
Route::prefix(config('cashier.path', 'stripe'))
    ->name('cashier.')
    ->group(function () {
        Route::get('payment/{id}', [PaymentController::class, 'show'])->name('payment');
        Route::post('webhook', [StripeWebhookController::class, 'handleWebhook'])->name('webhook');
    });

// Public testimonial collection routes
Route::get('s/{space}', [PublicSpaceController::class, 'show'])->name('public.spaces.show');
Route::post('s/{space}/testimonials', [PublicSpaceController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('public.spaces.testimonials.store');

// Public embed runtime route (isolated from authenticated app)
Route::get('embed/{space}', [PublicEmbedController::class, 'show'])->name('public.embed.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('spaces/{space}/success', [SpaceController::class, 'success'])->name('spaces.success');
    Route::resource('spaces', SpaceController::class);

    // Testimonial Inbox & Moderation
    Route::get('spaces/{space}/inbox', [TestimonialController::class, 'index'])->name('spaces.inbox');
    Route::patch('spaces/{space}/testimonials/{testimonial}', [TestimonialController::class, 'update'])->name('spaces.testimonials.update');
    Route::delete('spaces/{space}/testimonials/{testimonial}', [TestimonialController::class, 'destroy'])->name('spaces.testimonials.destroy');

    // Embed Builder
    Route::get('spaces/{space}/embed', [EmbedController::class, 'show'])->name('spaces.embed');
    Route::put('spaces/{space}/embed', [EmbedController::class, 'update'])->name('spaces.embed.update');

    // Billing & Subscriptions
    Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
    Route::post('billing/checkout', [BillingController::class, 'checkout'])->name('billing.checkout');
    Route::post('billing/sync', [BillingController::class, 'sync'])->name('billing.sync');
    Route::get('billing/portal', [BillingController::class, 'portal'])->name('billing.portal');
    Route::post('billing/cancel', [BillingController::class, 'cancel'])->name('billing.cancel');
    Route::post('billing/resume', [BillingController::class, 'resume'])->name('billing.resume');
});

require __DIR__.'/settings.php';
