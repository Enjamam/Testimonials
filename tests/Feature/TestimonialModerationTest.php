<?php

use App\Models\Space;
use App\Models\Testimonial;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('owner can view their space inbox with counts and pagination', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create([
        'name' => 'My Product',
    ]);

    Testimonial::factory()->count(3)->for($space)->create([
        'consent_given' => true,
    ]);
    Testimonial::factory()->for($space)->create([
        'is_favorite' => true,
        'consent_given' => true,
    ]);
    Testimonial::factory()->for($space)->create([
        'is_wall_of_love' => true,
        'consent_given' => true,
    ]);
    Testimonial::factory()->for($space)->create([
        'is_hidden' => true,
        'consent_given' => true,
    ]);

    $response = $this->actingAs($user)->get(route('spaces.inbox', $space));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('spaces/inbox')
        ->where('space.id', $space->id)
        ->has('testimonials.data', 6)
        ->where('counts.all', 6)
        ->where('counts.favorites', 1)
        ->where('counts.wall_of_love', 1)
        ->where('counts.hidden', 1)
    );
});

test('non-owner cannot view another users space inbox', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $space = Space::factory()->for($owner)->create();

    $response = $this->actingAs($intruder)->get(route('spaces.inbox', $space));

    $response->assertForbidden();
});

test('guest cannot access space inbox', function () {
    $space = Space::factory()->create();

    $response = $this->get(route('spaces.inbox', $space));

    $response->assertRedirect(route('login'));
});

test('inbox orders favorites first, then newest submissions', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();

    $olderStandard = Testimonial::factory()->for($space)->create([
        'name' => 'Standard 1',
        'is_favorite' => false,
        'created_at' => now()->subDays(3),
    ]);

    $newerStandard = Testimonial::factory()->for($space)->create([
        'name' => 'Standard 2',
        'is_favorite' => false,
        'created_at' => now()->subDay(),
    ]);

    $olderFavorite = Testimonial::factory()->for($space)->create([
        'name' => 'Favorite 1',
        'is_favorite' => true,
        'created_at' => now()->subDays(5),
    ]);

    $response = $this->actingAs($user)->get(route('spaces.inbox', $space));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('spaces/inbox')
        ->where('testimonials.data.0.id', $olderFavorite->id)
        ->where('testimonials.data.1.id', $newerStandard->id)
        ->where('testimonials.data.2.id', $olderStandard->id)
    );
});

test('inbox filters by status correctly', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();

    $wall = Testimonial::factory()->for($space)->create([
        'name' => 'Wall Item',
        'is_wall_of_love' => true,
        'consent_given' => true,
    ]);

    $fav = Testimonial::factory()->for($space)->create([
        'name' => 'Fav Item',
        'is_favorite' => true,
    ]);

    $hidden = Testimonial::factory()->for($space)->create([
        'name' => 'Hidden Item',
        'is_hidden' => true,
    ]);

    // Filter Wall of Love
    $resWall = $this->actingAs($user)->get(route('spaces.inbox', [$space, 'filter' => 'wall_of_love']));
    $resWall->assertOk();
    $resWall->assertInertia(fn (Assert $page) => $page
        ->has('testimonials.data', 1)
        ->where('testimonials.data.0.id', $wall->id)
    );

    // Filter Favorites
    $resFav = $this->actingAs($user)->get(route('spaces.inbox', [$space, 'filter' => 'favorites']));
    $resFav->assertOk();
    $resFav->assertInertia(fn (Assert $page) => $page
        ->has('testimonials.data', 1)
        ->where('testimonials.data.0.id', $fav->id)
    );

    // Filter Hidden
    $resHidden = $this->actingAs($user)->get(route('spaces.inbox', [$space, 'filter' => 'hidden']));
    $resHidden->assertOk();
    $resHidden->assertInertia(fn (Assert $page) => $page
        ->has('testimonials.data', 1)
        ->where('testimonials.data.0.id', $hidden->id)
    );
});

test('inbox searches across name, email, company, and content', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();

    Testimonial::factory()->for($space)->create([
        'name' => 'Unique Johnathan',
        'email' => 'regular@example.com',
    ]);
    Testimonial::factory()->for($space)->create([
        'name' => 'Sarah Connor',
        'company_name' => 'Cyberdyne Systems',
    ]);
    Testimonial::factory()->for($space)->create([
        'name' => 'Kyle Reese',
        'testimonial' => 'The future is not set in stone.',
    ]);

    $response = $this->actingAs($user)->get(route('spaces.inbox', [$space, 'search' => 'Cyberdyne']));
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('testimonials.data', 1)
        ->where('testimonials.data.0.company_name', 'Cyberdyne Systems')
    );

    $resContent = $this->actingAs($user)->get(route('spaces.inbox', [$space, 'search' => 'future is not set']));
    $resContent->assertOk();
    $resContent->assertInertia(fn (Assert $page) => $page
        ->has('testimonials.data', 1)
        ->where('testimonials.data.0.name', 'Kyle Reese')
    );
});

test('owner can toggle favorite status', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();
    $testimonial = Testimonial::factory()->for($space)->create([
        'is_favorite' => false,
    ]);

    $response = $this->actingAs($user)->patch(route('spaces.testimonials.update', [$space, $testimonial]), [
        'is_favorite' => true,
    ]);

    $response->assertSessionHas('success');
    expect($testimonial->fresh()->is_favorite)->toBeTrue();

    // Toggle back
    $this->actingAs($user)->patch(route('spaces.testimonials.update', [$space, $testimonial]), [
        'is_favorite' => false,
    ]);
    expect($testimonial->fresh()->is_favorite)->toBeFalse();
});

test('owner can toggle wall of love when consent is granted', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();
    $testimonial = Testimonial::factory()->for($space)->create([
        'consent_given' => true,
        'is_wall_of_love' => false,
    ]);

    $response = $this->actingAs($user)->patch(route('spaces.testimonials.update', [$space, $testimonial]), [
        'is_wall_of_love' => true,
    ]);

    $response->assertSessionHas('success');
    expect($testimonial->fresh()->is_wall_of_love)->toBeTrue();
});

test('owner cannot add unconsented testimonial to Wall of Love', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();
    $testimonial = Testimonial::factory()->for($space)->create([
        'consent_given' => false,
        'is_wall_of_love' => false,
    ]);

    $response = $this->actingAs($user)->patch(route('spaces.testimonials.update', [$space, $testimonial]), [
        'is_wall_of_love' => true,
    ]);

    $response->assertSessionHasErrors(['is_wall_of_love']);
    expect($testimonial->fresh()->is_wall_of_love)->toBeFalse();
});

test('owner can toggle hidden status', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();
    $testimonial = Testimonial::factory()->for($space)->create([
        'is_hidden' => false,
    ]);

    $response = $this->actingAs($user)->patch(route('spaces.testimonials.update', [$space, $testimonial]), [
        'is_hidden' => true,
    ]);

    $response->assertSessionHas('success');
    expect($testimonial->fresh()->is_hidden)->toBeTrue();
});

test('owner can edit testimonial text and rating with sanitization', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create(['rating_enabled' => true]);
    $testimonial = Testimonial::factory()->for($space)->create([
        'testimonial' => 'Old testimonial',
        'rating' => 3,
    ]);

    $response = $this->actingAs($user)->patch(route('spaces.testimonials.update', [$space, $testimonial]), [
        'testimonial' => 'Updated content with <script>alert("hack")</script> <b>bold</b> text',
        'rating' => 5,
    ]);

    $response->assertSessionHas('success');
    $fresh = $testimonial->fresh();
    expect($fresh->rating)->toBe(5)
        ->and($fresh->testimonial)->not->toContain('<script>')
        ->and($fresh->testimonial)->not->toContain('<b>')
        ->and($fresh->testimonial)->toContain('Updated content with');
});

test('owner can soft delete testimonial', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();
    $testimonial = Testimonial::factory()->for($space)->create();

    $response = $this->actingAs($user)->delete(route('spaces.testimonials.destroy', [$space, $testimonial]));

    $response->assertSessionHas('success');
    expect(Testimonial::count())->toBe(0);
    expect(Testimonial::withTrashed()->count())->toBe(1);
    expect($testimonial->fresh()->deleted_at)->not->toBeNull();
});

test('non-owner cannot update or delete someone elses testimonial', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $space = Space::factory()->for($owner)->create();
    $testimonial = Testimonial::factory()->for($space)->create();

    // Attempt update
    $resUpdate = $this->actingAs($intruder)->patch(route('spaces.testimonials.update', [$space, $testimonial]), [
        'is_favorite' => true,
    ]);
    $resUpdate->assertForbidden();

    // Attempt delete
    $resDelete = $this->actingAs($intruder)->delete(route('spaces.testimonials.destroy', [$space, $testimonial]));
    $resDelete->assertForbidden();
});

test('updating testimonial with mismatched space returns 404', function () {
    $user = User::factory()->create();
    $space1 = Space::factory()->for($user)->create();
    $space2 = Space::factory()->for($user)->create();
    $testimonialInSpace2 = Testimonial::factory()->for($space2)->create();

    // Send update request passing space1 but testimonial from space2
    $response = $this->actingAs($user)->patch(route('spaces.testimonials.update', [$space1, $testimonialInSpace2]), [
        'is_favorite' => true,
    ]);

    $response->assertNotFound();
});

test('owner can export testimonials as a streamed CSV file', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create([
        'name' => 'Acme SaaS',
    ]);

    Testimonial::factory()->for($space)->create([
        'name' => 'Alice Walker',
        'email' => 'alice@example.com',
        'testimonial' => 'Fantastic product experience!',
        'rating' => 5,
        'consent_given' => true,
    ]);

    $response = $this->actingAs($user)->get(route('spaces.testimonials.export', $space));

    $response->assertOk();
    $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
    expect($response->headers->get('content-disposition'))->toContain('attachment; filename="testimonials-acme-saas-');

    $content = $response->streamedContent();
    expect($content)->toContain('Alice Walker')
        ->and($content)->toContain('alice@example.com')
        ->and($content)->toContain('Fantastic product experience!');
});

test('non-owner cannot export testimonials of another space', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $space = Space::factory()->for($owner)->create();

    $response = $this->actingAs($intruder)->get(route('spaces.testimonials.export', $space));

    $response->assertForbidden();
});
