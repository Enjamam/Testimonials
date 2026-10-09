<?php

namespace Database\Factories;

use App\Models\EmbedConfiguration;
use App\Models\Space;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmbedConfiguration>
 */
class EmbedConfigurationFactory extends Factory
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
            'layout' => 'masonry',
            'dark_mode' => false,
            'animation_enabled' => true,
            'background_color' => '#ffffff',
            'item_limit' => 20,
            'display_options' => EmbedConfiguration::DEFAULT_DISPLAY_OPTIONS,
        ];
    }
}
