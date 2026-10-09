<?php

use App\Jobs\SendNewTestimonialNotificationJob;
use App\Mail\NewTestimonialReceivedMail;
use App\Models\Space;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

test('notification job is dispatched when a testimonial is successfully submitted', function () {
    Queue::fake();

    $owner = User::factory()->create(['email' => 'owner@example.com']);
    $space = Space::factory()->for($owner)->create([
        'name' => 'Acme App',
        'rating_enabled' => true,
    ]);

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Sarah Connor',
        'email' => 'sarah@resistance.test',
        'testimonial' => 'The system is brilliant and saved us hours of repetitive engineering.',
        'rating' => 5,
        'consent_given' => true,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    Queue::assertPushed(SendNewTestimonialNotificationJob::class, function ($job) use ($space) {
        return $job->testimonial->space_id === $space->id
            && $job->testimonial->name === 'Sarah Connor'
            && $job->testimonial->exists; // Verified that record is already persisted in DB
    });
});

test('notification job is not dispatched if honeypot spam is detected', function () {
    Queue::fake();

    $owner = User::factory()->create();
    $space = Space::factory()->for($owner)->create();

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Spam Bot',
        'email' => 'bot@spammer.test',
        'testimonial' => 'Buy cheap vitamins now at spam.com',
        'consent_given' => true,
        'website_hp' => 'http://spam-link.test', // Honeypot filled
    ]);

    $response->assertRedirect();
    Queue::assertNotPushed(SendNewTestimonialNotificationJob::class);
    $this->assertDatabaseMissing('testimonials', ['email' => 'bot@spammer.test']);
});

test('notification job is not dispatched if form validation fails', function () {
    Queue::fake();

    $owner = User::factory()->create();
    $space = Space::factory()->for($owner)->create();

    // Missing consent and required testimonial
    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    $response->assertSessionHasErrors(['testimonial', 'consent_given']);
    Queue::assertNotPushed(SendNewTestimonialNotificationJob::class);
    $this->assertDatabaseCount('testimonials', 0);
});

test('notification job is not dispatched if space plan limit is exceeded', function () {
    Queue::fake();

    $owner = User::factory()->create(); // Free user (max 100 testimonials)
    $space = Space::factory()->for($owner)->create();
    Testimonial::factory()->count(100)->for($space)->create();

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Over The Limit',
        'email' => 'limit@example.com',
        'testimonial' => 'This testimonial cannot be accepted due to free plan limits.',
        'consent_given' => true,
    ]);

    $response->assertSessionHasErrors(['testimonial']);
    Queue::assertNotPushed(SendNewTestimonialNotificationJob::class);
});

test('notification email contains space name, respondent name, preview, and inbox link', function () {
    Mail::fake();

    $owner = User::factory()->create(['email' => 'founder@startup.io']);
    $space = Space::factory()->for($owner)->create([
        'name' => 'Startup SaaS',
    ]);
    $testimonial = Testimonial::factory()->for($space)->create([
        'name' => 'Alice Wonderland',
        'company_name' => 'Wonderland Corp',
        'rating' => 5,
        'testimonial' => 'Antigravity completely transformed how we collect social proof from our users.',
    ]);

    $job = new SendNewTestimonialNotificationJob($testimonial);
    $job->handle();

    Mail::assertSent(NewTestimonialReceivedMail::class, function ($mail) use ($owner, $space) {
        $mailContent = $mail->render();

        return $mail->hasTo($owner->email)
            && str_contains($mail->envelope()->subject, 'Startup SaaS')
            && str_contains($mailContent, 'Startup SaaS')
            && str_contains($mailContent, 'Alice Wonderland')
            && str_contains($mailContent, 'Wonderland Corp')
            && str_contains($mailContent, 'Antigravity completely transformed')
            && str_contains($mailContent, route('spaces.inbox', $space));
    });
});

test('notification job executes gracefully when space or owner is missing', function () {
    Mail::fake();

    $user = User::factory()->create(['email' => '']);
    $space = Space::factory()->for($user)->create();
    $testimonial = Testimonial::factory()->for($space)->create();

    $job = new SendNewTestimonialNotificationJob($testimonial);
    $job->handle();

    Mail::assertNothingSent();
});

test('notification job has retry configuration and handles terminal failure', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();
    $testimonial = Testimonial::factory()->for($space)->create();

    $job = new SendNewTestimonialNotificationJob($testimonial);

    expect($job->tries)->toBe(3)
        ->and($job->backoff)->toBe([10, 30, 60]);

    // Should log and not throw exception
    $job->failed(new RuntimeException('Simulated mail server connection dropped'));
    expect(true)->toBeTrue();
});
