<?php

use App\Jobs\SendNewTestimonialNotificationJob;
use App\Mail\NewTestimonialReceivedMail;
use App\Models\Space;
use App\Models\Testimonial;
use App\Models\User;
use App\Services\BillingService;
use App\Services\PlanLimitService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

test('full end-to-end customer journey: space creation, public submission, notification, moderation, embed, and billing', function () {
    Storage::fake('public');
    Queue::fake();
    Mail::fake();

    // 1. User registers & creates Space
    $user = User::factory()->create(['email' => 'founder@startup.test']);

    $spaceResponse = $this->actingAs($user)->post(route('spaces.store'), [
        'name' => 'Acme Cloud Platform',
        'slug' => 'acme-cloud',
        'title' => 'Share your love for Acme Cloud',
        'theme' => 'minimal-dark',
        'rating_enabled' => true,
        'field_configuration' => [
            'name' => ['enabled' => true, 'required' => true],
            'email' => ['enabled' => true, 'required' => true],
            'company_name' => ['enabled' => true, 'required' => false],
            'social_url' => ['enabled' => true, 'required' => false],
            'profile_photo' => ['enabled' => true, 'required' => false],
        ],
    ]);

    $space = Space::where('slug', 'acme-cloud')->firstOrFail();
    $spaceResponse->assertRedirect(route('spaces.success', $space));
    expect($space->user_id)->toBe($user->id);

    // 2. Unauthenticated customer submits testimonial
    $publicSubmissionResponse = $this->from(route('public.spaces.show', $space->public_id))
        ->post(route('public.spaces.testimonials.store', $space->public_id), [
            'name' => 'Jane Developer',
            'email' => 'jane@techcorp.test',
            'company_name' => 'TechCorp Global',
            'social_url' => 'https://twitter.com/janedev',
            'rating' => 5,
            'testimonial' => 'Acme Cloud revolutionized our backend workflows! 10/10.',
            'consent_given' => '1',
            'profile_photo' => UploadedFile::fake()->image('jane.jpg', 300, 300),
            'website_hp' => '', // honeypot empty
        ]);

    $publicSubmissionResponse->assertSessionHas('success', "Your kind words have officially made someone's day.");
    Queue::assertPushed(SendNewTestimonialNotificationJob::class);

    $testimonial = Testimonial::where('space_id', $space->id)->firstOrFail();
    expect($testimonial->name)->toBe('Jane Developer')
        ->and($testimonial->email)->toBe('jane@techcorp.test')
        ->and($testimonial->rating)->toBe(5)
        ->and($testimonial->profile_photo_path)->not->toBeNull();

    // 3. Notification Job processing
    $job = new SendNewTestimonialNotificationJob($testimonial);
    $job->handle();

    Mail::assertSent(NewTestimonialReceivedMail::class, function ($mail) use ($user, $testimonial) {
        return $mail->hasTo($user->email) &&
               $mail->testimonial->id === $testimonial->id;
    });

    // 4. Owner views dashboard & moderates testimonial
    $this->actingAs($user)->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('metrics.total_spaces', 1)
            ->where('metrics.total_testimonials', 1)
        );

    // Approve for Wall of Love & favorite
    $moderationResponse = $this->actingAs($user)->patch(
        route('spaces.testimonials.update', [$space, $testimonial]),
        [
            'is_favorite' => true,
            'is_wall_of_love' => true,
            'is_hidden' => false,
        ]
    );

    $moderationResponse->assertRedirect();
    $testimonial->refresh();
    expect($testimonial->is_favorite)->toBeTrue()
        ->and($testimonial->is_wall_of_love)->toBeTrue();

    // 5. Public embed verification
    // 5a. Standalone HTML embed runtime
    $embedHtmlResponse = $this->get(route('public.embed.show', $space));
    $embedHtmlResponse->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('embed/wall')
            ->has('testimonials', 1)
            ->where('testimonials.0.name', 'Jane Developer')
            ->missing('testimonials.0.email') // strictly redacted
        );

    // 5b. Standalone JSON embed API
    $embedJsonResponse = $this->getJson(route('public.embed.show', $space));
    $embedJsonResponse->assertOk()
        ->assertJsonStructure([
            'space' => ['public_id', 'title', 'rating_enabled'],
            'config' => ['layout', 'dark_mode', 'animation_enabled', 'background_color', 'item_limit', 'display_options'],
            'testimonials' => [
                '*' => ['id', 'name', 'company_name', 'social_url', 'profile_photo_path', 'testimonial', 'rating', 'created_at'],
            ],
        ])
        ->assertJsonMissing(['email' => 'jane@techcorp.test']);

    // 6. Free Plan limits enforcement
    $planService = app(PlanLimitService::class);
    expect($planService->isPro($user))->toBeFalse()
        ->and($planService->maxSpaces($user))->toBe(3)
        ->and($planService->maxTestimonials($space))->toBe(100);

    // 7. Stripe Checkout Initiation & Pro Upgrade
    config(['services.stripe.pro_price_id' => 'price_test_pro_plan']);
    $this->mock(BillingService::class, function ($mock) {
        $mock->shouldReceive('createCheckoutSession')
            ->once()
            ->andReturn('https://checkout.stripe.com/c/pay/cs_test_sample');
    });

    $checkoutResponse = $this->actingAs($user)->post(route('billing.checkout'), [], [
        'X-Inertia' => 'true',
    ]);
    $checkoutResponse->assertStatus(409);
    $checkoutResponse->assertHeader('X-Inertia-Location', 'https://checkout.stripe.com/c/pay/cs_test_sample');

    // Simulate Stripe Webhook activating subscription
    $user->subscriptions()->create([
        'type' => 'default',
        'stripe_id' => 'sub_test_active_123',
        'stripe_status' => 'active',
        'stripe_price' => 'price_test_pro_plan',
        'quantity' => 1,
        'trial_ends_at' => null,
        'ends_at' => null,
    ]);

    $user->refresh();
    expect($planService->isPro($user))->toBeTrue()
        ->and($planService->maxSpaces($user))->toBe(25)
        ->and($planService->maxTestimonials($space))->toBe(1000);
});
