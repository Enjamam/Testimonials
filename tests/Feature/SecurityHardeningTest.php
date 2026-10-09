<?php

use App\Models\Space;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('unauthenticated users are redirected from all protected routes', function () {
    $space = Space::factory()->create();

    $this->get(route('dashboard'))->assertRedirect(route('login'));
    $this->get(route('spaces.index'))->assertRedirect(route('login'));
    $this->get(route('spaces.create'))->assertRedirect(route('login'));
    $this->get(route('spaces.show', $space))->assertRedirect(route('login'));
    $this->get(route('spaces.edit', $space))->assertRedirect(route('login'));
    $this->get(route('spaces.inbox', $space))->assertRedirect(route('login'));
    $this->get(route('spaces.embed', $space))->assertRedirect(route('login'));
    $this->get(route('billing.index'))->assertRedirect(route('login'));
});

test('cross-tenant isolation: user cannot access, modify, or delete another users space', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $spaceA = Space::factory()->for($userA)->create();

    $this->actingAs($userB)->get(route('spaces.show', $spaceA))->assertForbidden();
    $this->actingAs($userB)->get(route('spaces.edit', $spaceA))->assertForbidden();
    $this->actingAs($userB)->put(route('spaces.update', $spaceA), [
        'name' => 'Hacked',
        'title' => 'Hacked',
        'slug' => 'hacked-slug',
        'theme' => 'minimal-light',
        'rating_enabled' => true,
    ])->assertForbidden();
    $this->actingAs($userB)->delete(route('spaces.destroy', $spaceA))->assertForbidden();
    $this->actingAs($userB)->get(route('spaces.inbox', $spaceA))->assertForbidden();
    $this->actingAs($userB)->get(route('spaces.embed', $spaceA))->assertForbidden();
});

test('cross-tenant isolation: user cannot tamper with another users testimonials', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $spaceA = Space::factory()->for($userA)->create();
    $testimonialA = Testimonial::factory()->for($spaceA)->create([
        'is_favorite' => false,
        'testimonial' => 'Legitimate review',
    ]);

    // User B attempts to favorite User A's review
    $this->actingAs($userB)
        ->patch(route('spaces.testimonials.update', [$spaceA, $testimonialA]), [
            'is_favorite' => true,
        ])
        ->assertForbidden();

    expect($testimonialA->fresh()->is_favorite)->toBeFalse();

    // User B attempts to delete User A's review
    $this->actingAs($userB)
        ->delete(route('spaces.testimonials.destroy', [$spaceA, $testimonialA]))
        ->assertForbidden();

    expect($testimonialA->fresh()->deleted_at)->toBeNull();
});

test('public space collection form never exposes owner email, user id, or billing data', function () {
    $owner = User::factory()->create([
        'email' => 'supersecretfounder@company.com',
        'stripe_id' => 'cus_secret_123',
    ]);
    $space = Space::factory()->for($owner)->create([
        'title' => 'Public Feedback Space',
    ]);

    $response = $this->get(route('public.spaces.show', $space->public_id));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('public/space-form')
        ->where('space.title', 'Public Feedback Space')
        ->missing('space.user_id')
        ->missing('space.user')
        ->missing('space.owner')
    );

    $content = $response->getContent();
    expect($content)->not->toContain('supersecretfounder@company.com')
        ->and($content)->not->toContain('cus_secret_123');
});

test('public embed wall strictly excludes respondent emails in HTML and JSON views', function () {
    $space = Space::factory()->create();
    Testimonial::factory()->for($space)->wallOfLove()->create([
        'name' => 'John Public',
        'email' => 'sensitive-respondent-email@secret.test',
        'testimonial' => 'Great product that we love using.',
    ]);

    // HTML / Inertia view
    $htmlResponse = $this->get(route('public.embed.show', $space->public_id));
    $htmlResponse->assertOk();
    expect($htmlResponse->getContent())->not->toContain('sensitive-respondent-email@secret.test');

    // Direct JSON API view
    $jsonResponse = $this->getJson(route('public.embed.show', [$space->public_id, 'format' => 'json']));
    $jsonResponse->assertOk();
    $jsonResponse->assertJsonMissing(['email' => 'sensitive-respondent-email@secret.test']);
    $json = $jsonResponse->json('testimonials.0');
    expect(array_key_exists('email', $json))->toBeFalse();
});

test('public embed wall excludes unconsented, hidden, and soft-deleted testimonials', function () {
    $space = Space::factory()->create();

    // 1. Approved & consented
    $approved = Testimonial::factory()->for($space)->wallOfLove()->create([
        'testimonial' => 'Approved and loved',
    ]);

    // 2. Unconsented
    $unconsented = Testimonial::factory()->for($space)->create([
        'is_wall_of_love' => true,
        'consent_given' => false,
        'is_hidden' => false,
        'testimonial' => 'Unconsented review',
    ]);

    // 3. Hidden
    $hidden = Testimonial::factory()->for($space)->create([
        'is_wall_of_love' => true,
        'consent_given' => true,
        'is_hidden' => true,
        'testimonial' => 'Hidden review',
    ]);

    // 4. Soft deleted
    $deleted = Testimonial::factory()->for($space)->wallOfLove()->create([
        'testimonial' => 'Deleted review',
    ]);
    $deleted->delete();

    $response = $this->getJson(route('public.embed.show', [$space->public_id, 'format' => 'json']));

    $response->assertOk();
    $testimonials = $response->json('testimonials');

    expect($testimonials)->toHaveCount(1)
        ->and($testimonials[0]['id'])->toBe($approved->id)
        ->and(collect($testimonials)->pluck('id'))->not->toContain($unconsented->id)
        ->and(collect($testimonials)->pluck('id'))->not->toContain($hidden->id)
        ->and(collect($testimonials)->pluck('id'))->not->toContain($deleted->id);
});

test('xss payloads in respondent name, company, and testimonial are stripped', function () {
    $space = Space::factory()->create();

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => '<script>alert("xss")</script>Jane Doe',
        'email' => 'jane@example.com',
        'company_name' => '<b onmouseover=alert(1)>Cyberdyne</b>',
        'testimonial' => '<script>evil()</script><p>Awesome service!</p><iframe src="evil.com"></iframe>',
        'consent_given' => true,
    ]);

    $response->assertRedirect();

    $saved = Testimonial::where('email', 'jane@example.com')->firstOrFail();

    expect($saved->name)->not->toContain('<script>')
        ->and($saved->name)->not->toContain('</script>')
        ->and($saved->company_name)->toBe('Cyberdyne')
        ->and($saved->company_name)->not->toContain('onmouseover')
        ->and($saved->testimonial)->not->toContain('<script>')
        ->and($saved->testimonial)->not->toContain('<iframe>')
        ->and($saved->testimonial)->not->toContain('<p>');
});

test('social url rejects javascript and data schemes', function () {
    $space = Space::factory()->create([
        'field_configuration' => [
            'social_url' => ['enabled' => true, 'required' => false],
        ],
    ]);

    // javascript: pseudo-protocol
    $response1 = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Attacker',
        'email' => 'attacker@example.com',
        'testimonial' => 'Attempting XSS via link',
        'social_url' => 'javascript:alert(1)',
        'consent_given' => true,
    ]);
    $response1->assertSessionHasErrors('social_url');

    // data: scheme
    $response2 = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Attacker',
        'email' => 'attacker@example.com',
        'testimonial' => 'Attempting XSS via data URI',
        'social_url' => 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'consent_given' => true,
    ]);
    $response2->assertSessionHasErrors('social_url');
});

test('profile photo uploads reject non-image file types and oversized files', function () {
    Storage::fake('public');

    $space = Space::factory()->create([
        'field_configuration' => [
            'profile_photo' => ['enabled' => true, 'required' => false],
        ],
    ]);

    // Reject PHP file masquerading as image
    $badFile = UploadedFile::fake()->create('exploit.php', 10, 'text/x-php');
    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Attacker',
        'email' => 'attacker@example.com',
        'testimonial' => 'File upload attack',
        'profile_photo' => $badFile,
        'consent_given' => true,
    ]);
    $response->assertSessionHasErrors('profile_photo');

    // Reject oversized file (> 2MB)
    $hugeFile = UploadedFile::fake()->image('huge.jpg')->size(3000);
    $response2 = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Normal User',
        'email' => 'user@example.com',
        'testimonial' => 'Oversized photo upload',
        'profile_photo' => $hugeFile,
        'consent_given' => true,
    ]);
    $response2->assertSessionHasErrors('profile_photo');
});

test('public testimonial submission is rate limited to 6 per minute', function () {
    $space = Space::factory()->create();

    $validPayload = [
        'name' => 'Legit User',
        'email' => 'user@example.com',
        'testimonial' => 'Rate limit validation testing',
        'consent_given' => true,
    ];

    // Submit 6 times (within throttle:6,1)
    for ($i = 0; $i < 6; $i++) {
        $this->post(route('public.spaces.testimonials.store', $space->public_id), $validPayload)
            ->assertRedirect();
    }

    // 7th request should be throttled
    $this->post(route('public.spaces.testimonials.store', $space->public_id), $validPayload)
        ->assertStatus(429);
});

test('honeypot spam submission is silently absorbed with zero database records', function () {
    $space = Space::factory()->create();

    $response = $this->post(route('public.spaces.testimonials.store', $space->public_id), [
        'name' => 'Bot Crawler',
        'email' => 'crawler@botnet.test',
        'testimonial' => 'Spam content linking to casino site',
        'website_hp' => 'https://hidden-bot-trap.test',
        'consent_given' => true,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
    $this->assertDatabaseMissing('testimonials', ['email' => 'crawler@botnet.test']);
});

test('unconsented testimonials cannot be added to wall of love', function () {
    $user = User::factory()->create();
    $space = Space::factory()->for($user)->create();

    $testimonial = Testimonial::factory()->for($space)->create([
        'consent_given' => false,
        'is_wall_of_love' => false,
    ]);

    $response = $this->actingAs($user)
        ->patch(route('spaces.testimonials.update', [$space, $testimonial]), [
            'is_wall_of_love' => true,
        ]);

    $response->assertSessionHasErrors('is_wall_of_love');
    expect($testimonial->fresh()->is_wall_of_love)->toBeFalse();
});
