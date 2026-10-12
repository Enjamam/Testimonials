<?php

use App\Models\EmbedConfiguration;
use App\Models\Space;
use App\Models\User;
use App\Services\PlanLimitService;

describe('Space Listing', function () {
    test('unauthenticated users cannot view spaces', function () {
        $this->get(route('spaces.index'))
            ->assertRedirect(route('login'));
    });

    test('authenticated user can view their spaces and usage data', function () {
        $user = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->get(route('spaces.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('spaces/index')
                ->has('spaces', 1)
                ->where('spaces.0.id', $space->id)
                ->where('usage.current', 1)
                ->where('usage.max', PlanLimitService::FREE_MAX_SPACES)
                ->where('usage.can_create', true)
            );
    });
});

describe('Space Creation', function () {
    test('user can view space creation form when within limits', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('spaces.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('spaces/create')
                ->has('themes')
                ->has('defaultFieldConfiguration')
            );
    });

    test('valid space creation succeeds and initializes default embed configuration', function () {
        $user = User::factory()->create();

        $payload = [
            'name' => 'Acme Testimonials',
            'title' => 'What clients say about Acme',
            'subtitle' => 'Customer reviews',
            'ask' => 'How did we help you?',
            'slug' => 'acme-testimonials',
            'theme' => 'minimal-light',
            'rating_enabled' => true,
            'field_configuration' => Space::DEFAULT_FIELD_CONFIGURATION,
        ];

        $response = $this->actingAs($user)
            ->post(route('spaces.store'), $payload);

        $space = Space::where('slug', 'acme-testimonials')->first();

        expect($space)->not->toBeNull()
            ->and($space->user_id)->toBe($user->id)
            ->and($space->public_id)->not->toBeEmpty()
            ->and($space->embedConfiguration)->not->toBeNull()
            ->and($space->embedConfiguration->layout)->toBe('masonry');

        $response->assertRedirect(route('spaces.success', $space));
    });

    test('space creation fails with invalid input', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('spaces.store'), [
                'name' => '',
                'title' => '',
                'slug' => 'invalid slug with spaces!',
                'theme' => 'invalid-theme',
                'rating_enabled' => 'not-a-bool',
            ])
            ->assertSessionHasErrors(['name', 'title', 'slug', 'theme', 'rating_enabled']);

        expect(Space::count())->toBe(0);
    });

    test('space creation rejects duplicate slug', function () {
        $user = User::factory()->create();
        Space::factory()->create(['slug' => 'existing-slug']);

        $payload = [
            'name' => 'New Space',
            'title' => 'Title',
            'slug' => 'existing-slug',
            'theme' => 'minimal-light',
            'rating_enabled' => false,
            'field_configuration' => Space::DEFAULT_FIELD_CONFIGURATION,
        ];

        $this->actingAs($user)
            ->post(route('spaces.store'), $payload)
            ->assertSessionHasErrors(['slug']);
    });

    test('space creation rejects invalid respondent field configuration', function () {
        $user = User::factory()->create();

        $invalidConfig = [
            'name' => ['enabled' => false, 'required' => false], // Name must be enabled & required
            'email' => ['enabled' => true, 'required' => true],
        ];

        $payload = [
            'name' => 'New Space',
            'title' => 'Title',
            'slug' => 'unique-slug',
            'theme' => 'minimal-light',
            'rating_enabled' => false,
            'field_configuration' => $invalidConfig,
        ];

        $this->actingAs($user)
            ->post(route('spaces.store'), $payload)
            ->assertSessionHasErrors(['field_configuration']);
    });

    test('free plan limit prevents creating more than 3 spaces', function () {
        $user = User::factory()->create();

        // Create 3 existing spaces (max for free tier)
        Space::factory()->count(3)->create(['user_id' => $user->id]);

        // Attempt to view create page
        $this->actingAs($user)
            ->get(route('spaces.create'))
            ->assertRedirect(route('spaces.index'))
            ->assertSessionHas('error');

        // Attempt to post new space
        $payload = [
            'name' => 'Fourth Space',
            'title' => 'Title',
            'slug' => 'fourth-space',
            'theme' => 'minimal-light',
            'rating_enabled' => false,
            'field_configuration' => Space::DEFAULT_FIELD_CONFIGURATION,
        ];

        $this->actingAs($user)
            ->post(route('spaces.store'), $payload)
            ->assertForbidden();

        expect(Space::where('user_id', $user->id)->count())->toBe(3);
    });
});

describe('Space Update and Deletion', function () {
    test('owner can update space details and keep their own slug', function () {
        $user = User::factory()->create();
        $space = Space::factory()->create([
            'user_id' => $user->id,
            'slug' => 'original-slug',
            'name' => 'Original Name',
        ]);

        $updatePayload = [
            'name' => 'Updated Name',
            'title' => 'Updated Title',
            'subtitle' => 'Updated Subtitle',
            'ask' => 'Updated Ask',
            'slug' => 'original-slug', // Same slug
            'theme' => 'minimal-dark',
            'rating_enabled' => true,
            'field_configuration' => Space::DEFAULT_FIELD_CONFIGURATION,
        ];

        $this->actingAs($user)
            ->put(route('spaces.update', $space), $updatePayload)
            ->assertRedirect(route('spaces.show', $space));

        $space->refresh();
        expect($space->name)->toBe('Updated Name')
            ->and($space->theme)->toBe('minimal-dark')
            ->and($space->rating_enabled)->toBeTrue();
    });

    test('another user cannot update someone elses space (IDOR check)', function () {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($stranger)
            ->put(route('spaces.update', $space), [
                'name' => 'Hacked Name',
                'title' => 'Hacked Title',
                'slug' => $space->slug,
                'theme' => 'minimal-light',
                'rating_enabled' => false,
            ])
            ->assertForbidden();

        expect($space->fresh()->name)->not->toBe('Hacked Name');
    });

    test('owner can delete space and cascade deletes embed configuration', function () {
        $user = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $user->id]);
        $embedConfig = EmbedConfiguration::factory()->create(['space_id' => $space->id]);

        $this->actingAs($user)
            ->delete(route('spaces.destroy', $space))
            ->assertRedirect(route('spaces.index'));

        expect(Space::find($space->id))->toBeNull()
            ->and(EmbedConfiguration::find($embedConfig->id))->toBeNull();
    });

    test('another user cannot delete someone elses space', function () {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($stranger)
            ->delete(route('spaces.destroy', $space))
            ->assertForbidden();

        expect(Space::find($space->id))->not->toBeNull();
    });

    test('space can be created and updated with all supported themes', function (string $theme) {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('spaces.store'), [
            'name' => "Space {$theme}",
            'title' => "Title {$theme}",
            'slug' => "slug-{$theme}",
            'theme' => $theme,
            'rating_enabled' => true,
            'field_configuration' => Space::DEFAULT_FIELD_CONFIGURATION,
        ])->assertSessionHasNoErrors();

        $space = Space::where('slug', "slug-{$theme}")->first();
        expect($space)->not->toBeNull()
            ->and($space->theme)->toBe($theme);
    })->with(Space::THEMES);
});
