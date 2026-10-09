<?php

use App\Models\EmbedConfiguration;
use App\Models\Space;
use App\Models\Testimonial;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\QueryException;

describe('Space Model', function () {
    test('a space belongs to a user and user has many spaces', function () {
        $user = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $user->id]);

        expect($space->user->id)->toBe($user->id)
            ->and($user->spaces)->toHaveCount(1)
            ->and($user->spaces->first()->id)->toBe($space->id);
    });

    test('a space has many testimonials and has one embed configuration', function () {
        $space = Space::factory()->create();
        $testimonial = Testimonial::factory()->create(['space_id' => $space->id]);
        $embedConfig = EmbedConfiguration::factory()->create(['space_id' => $space->id]);

        expect($space->testimonials)->toHaveCount(1)
            ->and($space->testimonials->first()->id)->toBe($testimonial->id)
            ->and($space->embedConfiguration->id)->toBe($embedConfig->id);
    });

    test('a space automatically generates a public_id on creation', function () {
        $space = Space::factory()->create(['public_id' => '']);

        expect($space->public_id)->not->toBeEmpty()
            ->and($space->public_id)->toStartWith('spc_');
    });

    test('a space casts attributes correctly', function () {
        $space = Space::factory()->create([
            'rating_enabled' => 1,
            'field_configuration' => Space::DEFAULT_FIELD_CONFIGURATION,
        ]);

        expect($space->rating_enabled)->toBeTrue()
            ->and($space->field_configuration)->toBeArray()
            ->and($space->field_configuration['name']['required'])->toBeTrue();
    });

    test('space slug must be unique', function () {
        Space::factory()->create(['slug' => 'duplicate-slug']);

        expect(fn () => Space::factory()->create(['slug' => 'duplicate-slug']))
            ->toThrow(QueryException::class);
    });

    test('space public_id must be unique', function () {
        Space::factory()->create(['public_id' => 'spc_duplicate_test']);

        expect(fn () => Space::factory()->create(['public_id' => 'spc_duplicate_test']))
            ->toThrow(QueryException::class);
    });

    test('spaces are cascade deleted when user is deleted', function () {
        $user = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $user->id]);

        $user->delete();

        expect(Space::find($space->id))->toBeNull();
    });

    test('field configuration validator accepts valid structure and rejects invalid', function () {
        // Valid default
        expect(Space::isValidFieldConfiguration(Space::DEFAULT_FIELD_CONFIGURATION))->toBeTrue();

        // Valid custom with optional fields enabled
        $validCustom = [
            'name' => ['enabled' => true, 'required' => true],
            'email' => ['enabled' => true, 'required' => true],
            'company_name' => ['enabled' => true, 'required' => false],
            'social_url' => ['enabled' => true, 'required' => true],
            'profile_photo' => ['enabled' => false, 'required' => false],
        ];
        expect(Space::isValidFieldConfiguration($validCustom))->toBeTrue();

        // Invalid: missing email
        $missingEmail = [
            'name' => ['enabled' => true, 'required' => true],
        ];
        expect(Space::isValidFieldConfiguration($missingEmail))->toBeFalse();

        // Invalid: name disabled
        $disabledName = [
            'name' => ['enabled' => false, 'required' => true],
            'email' => ['enabled' => true, 'required' => true],
        ];
        expect(Space::isValidFieldConfiguration($disabledName))->toBeFalse();

        // Invalid: unknown custom field
        $unknownField = array_merge(Space::DEFAULT_FIELD_CONFIGURATION, [
            'unsupported_field' => ['enabled' => true, 'required' => false],
        ]);
        expect(Space::isValidFieldConfiguration($unknownField))->toBeFalse();
    });
});

describe('Testimonial Model', function () {
    test('a testimonial belongs to a space', function () {
        $space = Space::factory()->create();
        $testimonial = Testimonial::factory()->create(['space_id' => $space->id]);

        expect($testimonial->space->id)->toBe($space->id);
    });

    test('a testimonial casts attributes correctly', function () {
        $testimonial = Testimonial::factory()->create([
            'rating' => '5',
            'consent_given' => 1,
            'is_favorite' => 1,
            'is_wall_of_love' => 1,
            'is_hidden' => 0,
            'submitted_at' => '2026-10-08 12:00:00',
        ]);

        expect($testimonial->rating)->toBe(5)
            ->and($testimonial->consent_given)->toBeTrue()
            ->and($testimonial->is_favorite)->toBeTrue()
            ->and($testimonial->is_wall_of_love)->toBeTrue()
            ->and($testimonial->is_hidden)->toBeFalse()
            ->and($testimonial->submitted_at)->toBeInstanceOf(CarbonInterface::class);
    });

    test('testimonials support soft deletion', function () {
        $testimonial = Testimonial::factory()->create();

        $testimonial->delete();

        expect(Testimonial::find($testimonial->id))->toBeNull()
            ->and(Testimonial::withTrashed()->find($testimonial->id))->not->toBeNull()
            ->and(Testimonial::withTrashed()->find($testimonial->id)->deleted_at)->not->toBeNull();

        $testimonial->restore();
        expect(Testimonial::find($testimonial->id))->not->toBeNull();
    });

    test('publicWallOfLove scope enforces all four visibility invariants', function () {
        $space = Space::factory()->create();

        // 1. Eligible testimonial
        $eligible = Testimonial::factory()->wallOfLove()->create(['space_id' => $space->id]);

        // 2. Not on Wall of Love
        $notOnWall = Testimonial::factory()->create([
            'space_id' => $space->id,
            'consent_given' => true,
            'is_wall_of_love' => false,
            'is_hidden' => false,
        ]);

        // 3. Hidden testimonial
        $hidden = Testimonial::factory()->hidden()->create([
            'space_id' => $space->id,
            'consent_given' => true,
            'is_wall_of_love' => true,
        ]);

        // 4. Unconsented testimonial
        $unconsented = Testimonial::factory()->withoutConsent()->create([
            'space_id' => $space->id,
            'is_wall_of_love' => true,
            'is_hidden' => false,
        ]);

        // 5. Soft-deleted testimonial
        $deleted = Testimonial::factory()->wallOfLove()->create(['space_id' => $space->id]);
        $deleted->delete();

        $wallOfLoveResults = Testimonial::query()->publicWallOfLove()->get();

        expect($wallOfLoveResults)->toHaveCount(1)
            ->and($wallOfLoveResults->first()->id)->toBe($eligible->id);
    });

    test('favorite and visible scopes work as expected', function () {
        $space = Space::factory()->create();

        $fav = Testimonial::factory()->favorite()->create(['space_id' => $space->id, 'is_hidden' => false]);
        $hidden = Testimonial::factory()->hidden()->create(['space_id' => $space->id]);

        expect(Testimonial::favorite()->pluck('id')->all())->toContain($fav->id)
            ->and(Testimonial::favorite()->pluck('id')->all())->not->toContain($hidden->id)
            ->and(Testimonial::visible()->pluck('id')->all())->toContain($fav->id)
            ->and(Testimonial::visible()->pluck('id')->all())->not->toContain($hidden->id);
    });

    test('testimonials are cascade deleted when space is deleted', function () {
        $space = Space::factory()->create();
        $testimonial = Testimonial::factory()->create(['space_id' => $space->id]);

        $space->delete();

        expect(Testimonial::withTrashed()->find($testimonial->id))->toBeNull();
    });
});

describe('EmbedConfiguration Model', function () {
    test('an embed configuration belongs to a space', function () {
        $space = Space::factory()->create();
        $config = EmbedConfiguration::factory()->create(['space_id' => $space->id]);

        expect($config->space->id)->toBe($space->id);
    });

    test('space_id must be unique for embed configuration', function () {
        $space = Space::factory()->create();
        EmbedConfiguration::factory()->create(['space_id' => $space->id]);

        expect(fn () => EmbedConfiguration::factory()->create(['space_id' => $space->id]))
            ->toThrow(QueryException::class);
    });

    test('embed configuration casts attributes correctly', function () {
        $config = EmbedConfiguration::factory()->create([
            'dark_mode' => 1,
            'animation_enabled' => 0,
            'item_limit' => '15',
            'display_options' => EmbedConfiguration::DEFAULT_DISPLAY_OPTIONS,
        ]);

        expect($config->dark_mode)->toBeTrue()
            ->and($config->animation_enabled)->toBeFalse()
            ->and($config->item_limit)->toBe(15)
            ->and($config->display_options)->toBeArray()
            ->and($config->display_options['show_rating'])->toBeTrue();
    });

    test('embed configuration is cascade deleted when space is deleted', function () {
        $space = Space::factory()->create();
        $config = EmbedConfiguration::factory()->create(['space_id' => $space->id]);

        $space->delete();

        expect(EmbedConfiguration::find($config->id))->toBeNull();
    });
});
