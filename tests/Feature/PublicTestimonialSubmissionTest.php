<?php

use App\Models\Space;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('public');
});

test('public space collection page can be rendered by public_id', function () {
    $space = Space::factory()->create([
        'title' => 'Acme Testimonials',
        'subtitle' => 'Tell us what you think',
        'ask' => 'How did our product change your daily workflow?',
        'theme' => 'minimal-dark',
        'rating_enabled' => true,
    ]);

    $response = $this->get(route('public.spaces.show', $space->public_id));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('public/space-form')
        ->where('space.public_id', $space->public_id)
        ->where('space.title', 'Acme Testimonials')
        ->where('space.subtitle', 'Tell us what you think')
        ->where('space.ask', 'How did our product change your daily workflow?')
        ->where('space.theme', 'minimal-dark')
        ->where('space.rating_enabled', true)
        ->where('can_accept_testimonials', true)
    );
});

test('public space collection page can be rendered by slug', function () {
    $space = Space::factory()->create([
        'slug' => 'awesome-app',
        'title' => 'Awesome App Reviews',
    ]);

    $response = $this->get(route('public.spaces.show', 'awesome-app'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('public/space-form')
        ->where('space.slug', 'awesome-app')
        ->where('space.title', 'Awesome App Reviews')
    );
});

test('public space endpoint only exposes deliberate public fields and hides owner data', function () {
    $owner = User::factory()->create(['email' => 'supersecretowner@example.com']);
    $space = Space::factory()->for($owner)->create();

    $response = $this->get(route('public.spaces.show', $space->public_id));

    $response->assertOk();
    $response->assertDontSee('supersecretowner@example.com');
    $response->assertInertia(fn (Assert $page) => $page
        ->component('public/space-form')
        ->missing('space.user')
        ->missing('space.user_id')
        ->missing('space.id')
    );
});

test('respondent can submit a valid testimonial with minimal required fields', function () {
    $space = Space::factory()->create([
        'rating_enabled' => false,
    ]);

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Alice Customer',
        'email' => 'alice@example.com',
        'testimonial' => 'This software completely transformed how our team collaborates!',
        'consent_given' => true,
    ]);

    $response->assertSessionHas('success', "Your kind words have officially made someone's day.");

    $this->assertDatabaseHas('testimonials', [
        'space_id' => $space->id,
        'name' => 'Alice Customer',
        'email' => 'alice@example.com',
        'testimonial' => 'This software completely transformed how our team collaborates!',
        'rating' => null,
        'consent_given' => true,
        'is_favorite' => false,
        'is_wall_of_love' => false,
        'is_hidden' => false,
    ]);

    $testimonial = Testimonial::first();
    expect($testimonial->submitted_at)->not->toBeNull();
});

test('submission fails when required fields are missing', function () {
    $space = Space::factory()->create();

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), []);

    $response->assertSessionHasErrors(['name', 'email', 'testimonial', 'consent_given']);
    expect(Testimonial::count())->toBe(0);
});

test('submission fails when consent is not granted', function () {
    $space = Space::factory()->create();

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Bob Smith',
        'email' => 'bob@example.com',
        'testimonial' => 'Great product!',
        'consent_given' => false,
    ]);

    $response->assertSessionHasErrors(['consent_given']);
    expect(Testimonial::count())->toBe(0);
});

test('rating is strictly validated when rating_enabled is true', function () {
    $space = Space::factory()->create([
        'rating_enabled' => true,
    ]);

    // Missing rating fails
    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Charlie',
        'email' => 'charlie@example.com',
        'testimonial' => 'Loved everything!',
        'consent_given' => true,
    ]);
    $response->assertSessionHasErrors(['rating']);

    // Invalid rating fails
    $responseInvalid = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Charlie',
        'email' => 'charlie@example.com',
        'testimonial' => 'Loved everything!',
        'consent_given' => true,
        'rating' => 6,
    ]);
    $responseInvalid->assertSessionHasErrors(['rating']);

    // Valid rating succeeds
    $responseValid = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Charlie',
        'email' => 'charlie@example.com',
        'testimonial' => 'Loved everything!',
        'consent_given' => true,
        'rating' => 5,
    ]);
    $responseValid->assertSessionHas('success');

    $this->assertDatabaseHas('testimonials', [
        'space_id' => $space->id,
        'name' => 'Charlie',
        'rating' => 5,
    ]);
});

test('enforces optional fields when enabled and required by space configuration', function () {
    $space = Space::factory()->create([
        'field_configuration' => [
            'name' => ['enabled' => true, 'required' => true],
            'email' => ['enabled' => true, 'required' => true],
            'company_name' => ['enabled' => true, 'required' => true],
            'social_url' => ['enabled' => true, 'required' => true],
            'profile_photo' => ['enabled' => true, 'required' => false],
        ],
    ]);

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Dave',
        'email' => 'dave@example.com',
        'testimonial' => 'Fantastic service',
        'consent_given' => true,
    ]);

    $response->assertSessionHasErrors(['company_name', 'social_url']);

    // Now submit with valid required fields
    $responseSuccess = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Dave',
        'email' => 'dave@example.com',
        'company_name' => 'Tech Corp',
        'social_url' => 'https://twitter.com/dave',
        'testimonial' => 'Fantastic service',
        'consent_given' => true,
    ]);

    $responseSuccess->assertSessionHas('success');
    $this->assertDatabaseHas('testimonials', [
        'space_id' => $space->id,
        'company_name' => 'Tech Corp',
        'social_url' => 'https://twitter.com/dave',
    ]);
});

test('processes and safely stores valid profile photo upload', function () {
    $space = Space::factory()->create([
        'field_configuration' => [
            'name' => ['enabled' => true, 'required' => true],
            'email' => ['enabled' => true, 'required' => true],
            'company_name' => ['enabled' => false, 'required' => false],
            'social_url' => ['enabled' => false, 'required' => false],
            'profile_photo' => ['enabled' => true, 'required' => false],
        ],
    ]);

    $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Eve',
        'email' => 'eve@example.com',
        'testimonial' => 'High quality result!',
        'consent_given' => true,
        'profile_photo' => $file,
    ]);

    $response->assertSessionHas('success');

    $testimonial = Testimonial::first();
    expect($testimonial->profile_photo_path)->not->toBeNull();
    Storage::disk('public')->assertExists($testimonial->profile_photo_path);
});

test('rejects invalid image uploads', function () {
    $space = Space::factory()->create([
        'field_configuration' => [
            'name' => ['enabled' => true, 'required' => true],
            'email' => ['enabled' => true, 'required' => true],
            'company_name' => ['enabled' => false, 'required' => false],
            'social_url' => ['enabled' => false, 'required' => false],
            'profile_photo' => ['enabled' => true, 'required' => false],
        ],
    ]);

    // Test non-image file
    $pdf = UploadedFile::fake()->create('document.pdf', 500);

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Frank',
        'email' => 'frank@example.com',
        'testimonial' => 'Great product',
        'consent_given' => true,
        'profile_photo' => $pdf,
    ]);

    $response->assertSessionHasErrors(['profile_photo']);

    // Test oversized image (>2MB)
    $hugeImage = UploadedFile::fake()->image('huge.png')->size(3000);

    $responseHuge = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Frank',
        'email' => 'frank@example.com',
        'testimonial' => 'Great product',
        'consent_given' => true,
        'profile_photo' => $hugeImage,
    ]);

    $responseHuge->assertSessionHasErrors(['profile_photo']);
});

test('sanitizes HTML and script tags from testimonial content', function () {
    $space = Space::factory()->create();

    $xssContent = 'I love this! <script>alert("hacked")</script> <b>Bold text</b> <img src=x onerror=alert(1)>';

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Grace',
        'email' => 'grace@example.com',
        'testimonial' => $xssContent,
        'consent_given' => true,
    ]);

    $response->assertSessionHas('success');

    $testimonial = Testimonial::first();
    expect($testimonial->testimonial)->not->toContain('<script>')
        ->and($testimonial->testimonial)->not->toContain('<b>')
        ->and($testimonial->testimonial)->not->toContain('<img');
});

test('silently mitigates spam when honeypot field is filled', function () {
    $space = Space::factory()->create();

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Spam Bot',
        'email' => 'bot@spammer.com',
        'testimonial' => 'Buy cheap watches here at http://spam.com',
        'consent_given' => true,
        'website_hp' => 'http://spam.com',
    ]);

    // Should return success message to trick the bot without creating a record
    $response->assertSessionHas('success');
    expect(Testimonial::count())->toBe(0);
});

test('rejects submissions when space has reached the plan testimonial limit', function () {
    $owner = User::factory()->create();
    $space = Space::factory()->for($owner)->create();

    // Create 100 testimonials (the Free tier maximum)
    Testimonial::factory()->count(100)->create([
        'space_id' => $space->id,
    ]);

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Late Customer',
        'email' => 'late@example.com',
        'testimonial' => 'Will this be saved?',
        'consent_given' => true,
    ]);

    $response->assertSessionHasErrors(['testimonial']);
    expect(Testimonial::count())->toBe(100);
});

test('throttles excessive submissions under rate limiting', function () {
    $space = Space::factory()->create();

    // The route has throttle:6,1 middleware
    for ($i = 0; $i < 6; $i++) {
        $this->post(route('public.spaces.testimonials.store', $space->public_id), [
            'name' => "User {$i}",
            'email' => "user{$i}@example.com",
            'testimonial' => 'Positive feedback here',
            'consent_given' => true,
        ]);
    }

    // The 7th request in the same minute should be throttled (429 Too Many Requests)
    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'User 7',
        'email' => 'user7@example.com',
        'testimonial' => 'Positive feedback here',
        'consent_given' => true,
    ]);

    $response->assertStatus(429);
});
