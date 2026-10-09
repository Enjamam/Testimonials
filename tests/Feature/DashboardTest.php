<?php

use App\Models\Space;
use App\Models\Testimonial;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guest is redirected from dashboard to login page', function () {
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('login'));
});

test('authenticated user can view dashboard with empty state metrics', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->where('metrics.total_spaces', 0)
        ->where('metrics.total_testimonials', 0)
        ->where('metrics.unique_respondents', 0)
        ->where('metrics.wall_of_love_count', 0)
        ->where('metrics.period_testimonials', 0)
        ->where('period', 30)
        ->has('timeline', 30)
        ->has('spaces', 0)
        ->where('usage.current', 0)
        ->where('usage.max', 3)
        ->where('usage.is_pro', false)
    );
});

test('dashboard computes accurate totals and distinct respondents across spaces', function () {
    $user = User::factory()->create();

    $space1 = Space::factory()->for($user)->create(['name' => 'Space One']);
    $space2 = Space::factory()->for($user)->create(['name' => 'Space Two']);

    // Space 1: 3 testimonials from 2 distinct emails
    Testimonial::factory()->for($space1)->create([
        'email' => 'client1@example.com',
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => false,
        'submitted_at' => now()->subDays(2),
    ]);
    Testimonial::factory()->for($space1)->create([
        'email' => 'client2@example.com',
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => false,
        'submitted_at' => now()->subDays(3),
    ]);
    Testimonial::factory()->for($space1)->create([
        'email' => 'client1@example.com', // Repeated respondent
        'is_wall_of_love' => false,
        'consent_given' => true,
        'submitted_at' => now()->subDays(4),
    ]);

    // Space 2: 1 testimonial from new email, 1 soft-deleted testimonial
    Testimonial::factory()->for($space2)->create([
        'email' => 'client3@example.com',
        'is_wall_of_love' => false,
        'consent_given' => true,
        'submitted_at' => now()->subDay(),
    ]);
    $deleted = Testimonial::factory()->for($space2)->create([
        'email' => 'deleted@example.com',
        'submitted_at' => now()->subDay(),
    ]);
    $deleted->delete(); // Soft delete

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->where('metrics.total_spaces', 2)
        ->where('metrics.total_testimonials', 4) // 4 active testimonials
        ->where('metrics.unique_respondents', 3) // client1, client2, client3
        ->where('metrics.wall_of_love_count', 2)
        ->where('metrics.period_testimonials', 4)
        ->has('spaces', 2)
    );
});

test('dashboard strictly isolates user data and ignores other users spaces', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $otherSpace = Space::factory()->for($otherUser)->create();
    Testimonial::factory()->count(5)->for($otherSpace)->create();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->where('metrics.total_spaces', 0)
        ->where('metrics.total_testimonials', 0)
        ->where('metrics.unique_respondents', 0)
    );
});

test('timeline grouping responds to 7d, 30d, and 90d period filters', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();

    // Testimonial 5 days ago
    Testimonial::factory()->for($space)->create([
        'submitted_at' => now()->subDays(5)->startOfDay()->addHours(2),
    ]);

    // Testimonial 40 days ago
    Testimonial::factory()->for($space)->create([
        'submitted_at' => now()->subDays(40)->startOfDay()->addHours(2),
    ]);

    // 7 days period
    $res7 = $this->actingAs($user)->get(route('dashboard', ['period' => 7]));
    $res7->assertOk();
    $res7->assertInertia(fn (Assert $page) => $page
        ->where('period', 7)
        ->has('timeline', 7)
        ->where('metrics.period_testimonials', 1) // only the 5d ago one
    );

    // 30 days period
    $res30 = $this->actingAs($user)->get(route('dashboard', ['period' => 30]));
    $res30->assertOk();
    $res30->assertInertia(fn (Assert $page) => $page
        ->where('period', 30)
        ->has('timeline', 30)
        ->where('metrics.period_testimonials', 1)
    );

    // 90 days period
    $res90 = $this->actingAs($user)->get(route('dashboard', ['period' => 90]));
    $res90->assertOk();
    $res90->assertInertia(fn (Assert $page) => $page
        ->where('period', 90)
        ->has('timeline', 90)
        ->where('metrics.period_testimonials', 2) // both are within 90 days
    );
});
