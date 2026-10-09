<?php

use App\Models\EmbedConfiguration;
use App\Models\Space;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

describe('Space Authorization', function () {
    test('owner can access, update, and delete their own space', function () {
        $owner = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $owner->id]);

        expect($owner->can('view', $space))->toBeTrue()
            ->and($owner->can('update', $space))->toBeTrue()
            ->and($owner->can('delete', $space))->toBeTrue()
            ->and(Gate::forUser($owner)->allows('view', $space))->toBeTrue()
            ->and(Gate::forUser($owner)->allows('update', $space))->toBeTrue()
            ->and(Gate::forUser($owner)->allows('delete', $space))->toBeTrue();
    });

    test('another user cannot view, update, or delete the space (IDOR protection)', function () {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $owner->id]);

        expect($stranger->can('view', $space))->toBeFalse()
            ->and($stranger->can('update', $space))->toBeFalse()
            ->and($stranger->can('delete', $space))->toBeFalse()
            ->and(Gate::forUser($stranger)->denies('view', $space))->toBeTrue()
            ->and(Gate::forUser($stranger)->denies('update', $space))->toBeTrue()
            ->and(Gate::forUser($stranger)->denies('delete', $space))->toBeTrue();
    });
});

describe('Testimonial Authorization', function () {
    test('owner of the space can view, update, and delete testimonials', function () {
        $owner = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $owner->id]);
        $testimonial = Testimonial::factory()->create(['space_id' => $space->id]);

        expect($owner->can('view', $testimonial))->toBeTrue()
            ->and($owner->can('update', $testimonial))->toBeTrue()
            ->and($owner->can('delete', $testimonial))->toBeTrue()
            ->and($owner->can('restore', $testimonial))->toBeTrue()
            ->and($owner->can('forceDelete', $testimonial))->toBeTrue();
    });

    test('another user cannot access, modify, or delete testimonials from another users space', function () {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $owner->id]);
        $testimonial = Testimonial::factory()->create(['space_id' => $space->id]);

        expect($stranger->can('view', $testimonial))->toBeFalse()
            ->and($stranger->can('update', $testimonial))->toBeFalse()
            ->and($stranger->can('delete', $testimonial))->toBeFalse()
            ->and($stranger->can('restore', $testimonial))->toBeFalse()
            ->and($stranger->can('forceDelete', $testimonial))->toBeFalse()
            ->and(Gate::forUser($stranger)->denies('view', $testimonial))->toBeTrue()
            ->and(Gate::forUser($stranger)->denies('update', $testimonial))->toBeTrue()
            ->and(Gate::forUser($stranger)->denies('delete', $testimonial))->toBeTrue();
    });
});

describe('EmbedConfiguration Authorization', function () {
    test('owner of the space can view and update embed configuration', function () {
        $owner = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $owner->id]);
        $embedConfig = EmbedConfiguration::factory()->create(['space_id' => $space->id]);

        expect($owner->can('view', $embedConfig))->toBeTrue()
            ->and($owner->can('update', $embedConfig))->toBeTrue()
            ->and(Gate::forUser($owner)->allows('view', $embedConfig))->toBeTrue()
            ->and(Gate::forUser($owner)->allows('update', $embedConfig))->toBeTrue();
    });

    test('another user cannot view or update embed configuration for another users space', function () {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $space = Space::factory()->create(['user_id' => $owner->id]);
        $embedConfig = EmbedConfiguration::factory()->create(['space_id' => $space->id]);

        expect($stranger->can('view', $embedConfig))->toBeFalse()
            ->and($stranger->can('update', $embedConfig))->toBeFalse()
            ->and(Gate::forUser($stranger)->denies('view', $embedConfig))->toBeTrue()
            ->and(Gate::forUser($stranger)->denies('update', $embedConfig))->toBeTrue();
    });
});
