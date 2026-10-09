<?php

namespace App\Models;

use Database\Factories\TestimonialFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $space_id
 * @property string $name
 * @property string $email
 * @property string|null $company_name
 * @property string|null $social_url
 * @property string|null $profile_photo_path
 * @property string $testimonial
 * @property int|null $rating
 * @property bool $consent_given
 * @property bool $is_favorite
 * @property bool $is_wall_of_love
 * @property bool $is_hidden
 * @property Carbon|null $submitted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Space $space
 */
#[Fillable([
    'name',
    'email',
    'company_name',
    'social_url',
    'profile_photo_path',
    'testimonial',
    'rating',
    'consent_given',
    'is_favorite',
    'is_wall_of_love',
    'is_hidden',
    'submitted_at',
])]
class Testimonial extends Model
{
    /** @use HasFactory<TestimonialFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The model's default attribute values.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'consent_given' => false,
        'is_favorite' => false,
        'is_wall_of_love' => false,
        'is_hidden' => false,
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'consent_given' => 'boolean',
            'is_favorite' => 'boolean',
            'is_wall_of_love' => 'boolean',
            'is_hidden' => 'boolean',
            'submitted_at' => 'datetime',
        ];
    }

    /**
     * Scope query to testimonials eligible for public display on the Wall of Love.
     *
     * Invariants from CONTEXT.md Section 11:
     * - consent_given = true
     * - is_wall_of_love = true
     * - is_hidden = false
     * - deleted_at IS NULL (handled by SoftDeletes)
     *
     * @param  Builder<Testimonial>  $query
     * @return Builder<Testimonial>
     */
    #[Scope]
    public function scopePublicWallOfLove(Builder $query): Builder
    {
        return $query->where('consent_given', true)
            ->where('is_wall_of_love', true)
            ->where('is_hidden', false);
    }

    /**
     * Scope query to favorite testimonials.
     *
     * @param  Builder<Testimonial>  $query
     * @return Builder<Testimonial>
     */
    #[Scope]
    public function scopeFavorite(Builder $query): Builder
    {
        return $query->where('is_favorite', true);
    }

    /**
     * Scope query to non-hidden testimonials.
     *
     * @param  Builder<Testimonial>  $query
     * @return Builder<Testimonial>
     */
    #[Scope]
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_hidden', false);
    }

    /**
     * The space to which the testimonial belongs.
     *
     * @return BelongsTo<Space, $this>
     */
    public function space(): BelongsTo
    {
        return $this->belongsTo(Space::class);
    }
}
