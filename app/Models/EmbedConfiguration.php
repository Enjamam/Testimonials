<?php

namespace App\Models;

use Database\Factories\EmbedConfigurationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $space_id
 * @property string $layout
 * @property bool $dark_mode
 * @property bool $animation_enabled
 * @property string|null $background_color
 * @property int $item_limit
 * @property array<string, bool>|null $display_options
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Space $space
 */
#[Fillable([
    'space_id',
    'layout',
    'dark_mode',
    'animation_enabled',
    'background_color',
    'item_limit',
    'display_options',
])]
class EmbedConfiguration extends Model
{
    /** @use HasFactory<EmbedConfigurationFactory> */
    use HasFactory;

    /**
     * Default display options.
     *
     * @var array<string, mixed>
     */
    public const array DEFAULT_DISPLAY_OPTIONS = [
        'show_rating' => true,
        'show_profile_photo' => true,
        'show_company_name' => true,
        'min_rating' => 0,
        'card_radius' => 'rounded-2xl',
        'card_shadow' => 'shadow-xs',
    ];

    /**
     * Supported embed layouts.
     *
     * @var list<string>
     */
    public const array LAYOUTS = [
        'masonry',
        'carousel',
    ];

    /**
     * The model's default attribute values.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'layout' => 'masonry',
        'dark_mode' => false,
        'animation_enabled' => true,
        'background_color' => '#ffffff',
        'item_limit' => 20,
    ];

    /**
     * Bootstrap the model and its events.
     */
    protected static function booted(): void
    {
        static::creating(function (EmbedConfiguration $config): void {
            if (empty($config->display_options)) {
                $config->display_options = self::DEFAULT_DISPLAY_OPTIONS;
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'dark_mode' => 'boolean',
            'animation_enabled' => 'boolean',
            'item_limit' => 'integer',
            'display_options' => 'array',
        ];
    }

    /**
     * The space to which the embed configuration belongs.
     *
     * @return BelongsTo<Space, $this>
     */
    public function space(): BelongsTo
    {
        return $this->belongsTo(Space::class);
    }
}
