<?php

use App\Models\EmbedConfiguration;
use App\Models\Space;
use App\Models\Testimonial;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('owner can view embed builder studio with default configuration and public testimonials', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create([
        'title' => 'Product Reviews',
    ]);

    // 1 public Wall of Love testimonial
    $publicTestimonial = Testimonial::factory()->for($space)->create([
        'name' => 'John Doe',
        'email' => 'private@example.com',
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => false,
    ]);

    $response = $this->actingAs($user)->get(route('spaces.embed', $space));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('spaces/embed')
        ->where('space.id', $space->id)
        ->has('config')
        ->has('testimonials', 1)
        ->where('testimonials.0.id', $publicTestimonial->id)
        ->missing('testimonials.0.email') // Email must never be in testimonials list
        ->has('embedUrl')
        ->has('embedSnippet')
    );
});

test('owner can update embed configuration options', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();

    $response = $this->actingAs($user)->put(route('spaces.embed.update', $space), [
        'layout' => 'carousel',
        'dark_mode' => true,
        'animation_enabled' => false,
        'background_color' => '#0f172a',
        'item_limit' => 12,
        'display_options' => [
            'show_rating' => false,
            'show_profile_photo' => true,
            'show_company_name' => false,
        ],
    ]);

    $response->assertSessionHas('success');

    $config = $space->fresh()->embedConfiguration;
    expect($config->layout)->toBe('carousel')
        ->and($config->dark_mode)->toBeTrue()
        ->and($config->animation_enabled)->toBeFalse()
        ->and($config->background_color)->toBe('#0f172a')
        ->and($config->item_limit)->toBe(12)
        ->and($config->display_options['show_rating'])->toBeFalse()
        ->and($config->display_options['show_company_name'])->toBeFalse();
});

test('non-owner cannot view or update another users embed configuration', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $space = Space::factory()->for($owner)->create();

    $resView = $this->actingAs($intruder)->get(route('spaces.embed', $space));
    $resView->assertForbidden();

    $resUpdate = $this->actingAs($intruder)->put(route('spaces.embed.update', $space), [
        'layout' => 'carousel',
        'dark_mode' => true,
        'animation_enabled' => true,
        'background_color' => '#ffffff',
        'item_limit' => 20,
        'display_options' => EmbedConfiguration::DEFAULT_DISPLAY_OPTIONS,
    ]);
    $resUpdate->assertForbidden();
});

test('public embed wall renders standalone by public_id and by slug', function () {
    $space = Space::factory()->create([
        'slug' => 'saas-embed-slug',
    ]);

    // Query by public_id
    $resId = $this->get(route('public.embed.show', $space->public_id));
    $resId->assertOk();
    $resId->assertInertia(fn (Assert $page) => $page
        ->component('embed/wall')
        ->where('space.public_id', $space->public_id)
    );

    // Query by slug
    $resSlug = $this->get(route('public.embed.show', 'saas-embed-slug'));
    $resSlug->assertOk();
    $resSlug->assertInertia(fn (Assert $page) => $page
        ->component('embed/wall')
        ->where('space.public_id', $space->public_id)
    );
});

test('SECURITY INVARIANT: respondent email is NEVER returned in public embed HTML or JSON', function () {
    $space = Space::factory()->create();

    Testimonial::factory()->for($space)->create([
        'name' => 'Alice Secret',
        'email' => 'alicesecret123@private-domain.com',
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => false,
    ]);

    // 1. HTML / Inertia
    $resHtml = $this->get(route('public.embed.show', $space->public_id));
    $resHtml->assertOk();
    $resHtml->assertDontSee('alicesecret123@private-domain.com');
    $resHtml->assertInertia(fn (Assert $page) => $page
        ->has('testimonials', 1)
        ->missing('testimonials.0.email')
    );

    // 2. JSON endpoint
    $resJson = $this->get(route('public.embed.show', [$space->public_id, 'format' => 'json']));
    $resJson->assertOk();
    $resJson->assertJsonMissing(['email' => 'alicesecret123@private-domain.com']);
    $content = $resJson->getContent();
    expect($content)->not->toContain('alicesecret123@private-domain.com');
});

test('SECURITY INVARIANT: unconsented, hidden, and soft-deleted testimonials are strictly excluded', function () {
    $space = Space::factory()->create();

    // 1. Eligible testimonial
    $eligible = Testimonial::factory()->for($space)->create([
        'name' => 'Eligible User',
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => false,
    ]);

    // 2. Unconsented (consent_given = false)
    $unconsented = Testimonial::factory()->for($space)->create([
        'name' => 'Unconsented User',
        'is_wall_of_love' => true,
        'consent_given' => false,
        'is_hidden' => false,
    ]);

    // 3. Hidden (is_hidden = true)
    $hidden = Testimonial::factory()->for($space)->create([
        'name' => 'Hidden User',
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => true,
    ]);

    // 4. Not on Wall of Love (is_wall_of_love = false)
    $notOnWall = Testimonial::factory()->for($space)->create([
        'name' => 'Pending Review User',
        'is_wall_of_love' => false,
        'consent_given' => true,
        'is_hidden' => false,
    ]);

    // 5. Soft-deleted
    $deleted = Testimonial::factory()->for($space)->create([
        'name' => 'Deleted User',
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => false,
    ]);
    $deleted->delete();

    $response = $this->get(route('public.embed.show', $space->public_id));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('testimonials', 1)
        ->where('testimonials.0.id', $eligible->id)
    );
});

test('public embed respects item_limit configuration', function () {
    $space = Space::factory()->create();
    $space->embedConfiguration()->create([
        'item_limit' => 2,
    ]);

    Testimonial::factory()->count(5)->for($space)->create([
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => false,
    ]);

    $response = $this->get(route('public.embed.show', $space->public_id));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('testimonials', 2)
    );
});

test('public embed respects display_options by masking disabled fields', function () {
    $space = Space::factory()->create(['rating_enabled' => true]);
    $space->embedConfiguration()->create([
        'display_options' => [
            'show_rating' => false,
            'show_profile_photo' => false,
            'show_company_name' => false,
        ],
    ]);

    Testimonial::factory()->for($space)->create([
        'name' => 'Jane Smith',
        'company_name' => 'Acme Corporation',
        'profile_photo_path' => 'photos/jane.jpg',
        'rating' => 5,
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => false,
    ]);

    $response = $this->get(route('public.embed.show', $space->public_id));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('testimonials', 1)
        ->where('testimonials.0.name', 'Jane Smith')
        ->where('testimonials.0.company_name', null)
        ->where('testimonials.0.profile_photo_path', null)
        ->where('testimonials.0.rating', null)
    );
});

test('public embed wall filters out testimonials below min_rating', function () {
    $space = Space::factory()->create(['rating_enabled' => true]);
    $space->embedConfiguration()->create([
        'display_options' => [
            'show_rating' => true,
            'show_profile_photo' => true,
            'show_company_name' => true,
            'min_rating' => 4,
            'card_radius' => 'rounded-3xl',
            'card_shadow' => 'shadow-md',
        ],
    ]);

    // 5-star testimonial (should be visible)
    Testimonial::factory()->for($space)->create([
        'name' => 'High Rater',
        'rating' => 5,
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => false,
    ]);

    // 3-star testimonial (should be filtered out by min_rating = 4)
    Testimonial::factory()->for($space)->create([
        'name' => 'Low Rater',
        'rating' => 3,
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => false,
    ]);

    $response = $this->get(route('public.embed.show', $space->public_id));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('testimonials', 1)
        ->where('testimonials.0.name', 'High Rater')
        ->where('config.display_options.min_rating', 4)
        ->where('config.display_options.card_radius', 'rounded-3xl')
    );
});
