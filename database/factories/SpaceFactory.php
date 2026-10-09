<?php

namespace Database\Factories;

use App\Models\Space;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Space>
 */
class SpaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'user_id' => User::factory(),
            'name' => $name,
            'title' => 'What our customers say about '.$name,
            'subtitle' => fake()->sentence(),
            'ask' => 'How has our product helped you succeed?',
            'slug' => fake()->unique()->slug(),
            'public_id' => 'spc_'.Str::lower(Str::random(16)),
            'theme' => 'minimal-light',
            'rating_enabled' => false,
            'field_configuration' => Space::DEFAULT_FIELD_CONFIGURATION,
        ];
    }
}
