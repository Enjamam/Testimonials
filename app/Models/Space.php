<?php

namespace App\Models;

use Database\Factories\SpaceFactory;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $title
 * @property string|null $subtitle
 * @property string|null $ask
 * @property string $slug
 * @property string $public_id
 * @property string $theme
 * @property bool $rating_enabled
 * @property array<string, array{enabled: bool, required: bool}>|null $field_configuration
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Collection<int, Testimonial> $testimonials
 * @property-read EmbedConfiguration|null $embedConfiguration
 */
#[Fillable([
    'name',
    'title',
    'subtitle',
    'ask',
    'slug',
    'public_id',
    'theme',
    'rating_enabled',
    'field_configuration',
])]
class Space extends Model
{
    /** @use HasFactory<SpaceFactory> */
    use HasFactory;

    /**
     * Predefined respondent fields configuration.
     *
     * @var array<string, array{enabled: bool, required: bool}>
     */
    public const array DEFAULT_FIELD_CONFIGURATION = [
        'name' => ['enabled' => true, 'required' => true],
        'email' => ['enabled' => true, 'required' => true],
        'company_name' => ['enabled' => false, 'required' => false],
        'social_url' => ['enabled' => false, 'required' => false],
        'profile_photo' => ['enabled' => false, 'required' => false],
    ];

    /**
     * Allowed themes for the public space.
     *
     * @var list<string>
     */
    public const array THEMES = [
        'minimal-light',
        'minimal-dark',
        'soft-color',
    ];

    /**
     * The model's default attribute values.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'theme' => 'minimal-light',
        'rating_enabled' => false,
    ];

    /**
     * Bootstrap the model and its events.
     */
    protected static function booted(): void
    {
        static::creating(function (Space $space): void {
            if (empty($space->public_id)) {
                $space->public_id = 'spc_'.Str::lower(Str::random(16));
            }

            if (empty($space->field_configuration)) {
                $space->field_configuration = self::DEFAULT_FIELD_CONFIGURATION;
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
            'rating_enabled' => 'boolean',
            'field_configuration' => 'array',
        ];
    }

    /**
     * Retrieve the model for a bound value by public_id or slug.
     *
     * @param  Builder  $query
     * @param  mixed  $value
     * @param  string|null  $field
     * @return Builder
     */
    public function resolveRouteBindingQuery($query, $value, $field = null)
    {
        if ($field) {
            return parent::resolveRouteBindingQuery($query, $value, $field);
        }

        return $query->where(function ($q) use ($value) {
            if (is_numeric($value)) {
                $q->where($this->getRouteKeyName(), $value)
                    ->orWhere('public_id', $value)
                    ->orWhere('slug', $value);
            } else {
                $q->where('public_id', $value)
                    ->orWhere('slug', $value);
            }
        });
    }

    /**
     * Validate a field configuration against the allowed schema and invariants.
     *
     * @param  array<string, mixed>  $config
     */
    public static function isValidFieldConfiguration(array $config): bool
    {
        $allowedKeys = array_keys(self::DEFAULT_FIELD_CONFIGURATION);

        // Check for unexpected keys
        if (array_diff(array_keys($config), $allowedKeys) !== []) {
            return false;
        }

        // Name and Email must always be enabled and required
        foreach (['name', 'email'] as $mandatoryField) {
            if (! isset($config[$mandatoryField])) {
                return false;
            }

            if (! is_array($config[$mandatoryField])) {
                return false;
            }

            if (empty($config[$mandatoryField]['enabled']) || empty($config[$mandatoryField]['required'])) {
                return false;
            }
        }

        // Optional fields must be well-formed booleans
        foreach ($config as $field => $settings) {
            if (! is_array($settings)) {
                return false;
            }

            if (! isset($settings['enabled']) || ! is_bool($settings['enabled'])) {
                return false;
            }

            if (! isset($settings['required']) || ! is_bool($settings['required'])) {
                return false;
            }
        }

        return true;
    }

    /**
     * The user that owns the Space.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Testimonials submitted to the Space.
     *
     * @return HasMany<Testimonial, $this>
     */
    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

    /**
     * The embed configuration for the Space.
     *
     * @return HasOne<EmbedConfiguration, $this>
     */
    public function embedConfiguration(): HasOne
    {
        return $this->hasOne(EmbedConfiguration::class);
    }
}
