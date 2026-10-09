<?php

namespace Database\Factories;

use App\Models\Space;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'space_id' => Space::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'company_name' => fake()->optional()->company(),
            'social_url' => fake()->optional()->url(),
            'profile_photo_path' => null,
            'testimonial' => fake()->paragraph(),
            'rating' => fake()->numberBetween(1, 5),
            'consent_given' => true,
            'is_favorite' => false,
            'is_wall_of_love' => false,
            'is_hidden' => false,
            'submitted_at' => now(),
        ];
    }

    /**
     * Indicate that the testimonial is published to the Wall of Love.
     */
    public function wallOfLove(): static
    {
        return $this->state(fn (array $attributes) => [
            'consent_given' => true,
            'is_wall_of_love' => true,
            'is_hidden' => false,
        ]);
    }

    /**
     * Indicate that the testimonial is hidden.
     */
    public function hidden(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_hidden' => true,
        ]);
    }

    /**
     * Indicate that consent was not given.
     */
    public function withoutConsent(): static
    {
        return $this->state(fn (array $attributes) => [
            'consent_given' => false,
            'is_wall_of_love' => false,
        ]);
    }

    /**
     * Indicate that the testimonial is favorited.
     */
    public function favorite(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_favorite' => true,
        ]);
    }
}
