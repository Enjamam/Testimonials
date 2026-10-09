<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Cashier\Billable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $avatar
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property string|null $stripe_id
 * @property string|null $pm_type
 * @property string|null $pm_last_four
 * @property Carbon|null $trial_ends_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Space> $spaces
 */
#[Fillable(['name', 'email', 'avatar', 'password', 'stripe_id', 'pm_type', 'pm_last_four', 'trial_ends_at'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use Billable, HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the user's avatar URL.
     */
    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? (str_starts_with($value, 'http') || str_starts_with($value, '/') ? $value : '/storage/'.$value) : null,
        );
    }

    /**
     * Spaces owned by the user.
     *
     * @return HasMany<Space, $this>
     */
    public function spaces(): HasMany
    {
        return $this->hasMany(Space::class);
    }

    /**
     * Testimonials across all spaces owned by the user.
     *
     * @return HasManyThrough<Testimonial, Space, $this>
     */
    public function testimonials(): HasManyThrough
    {
        return $this->hasManyThrough(Testimonial::class, Space::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'trial_ends_at' => 'datetime',
        ];
    }
}
