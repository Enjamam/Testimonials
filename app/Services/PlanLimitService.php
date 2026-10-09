<?php

namespace App\Services;

use App\Models\Space;
use App\Models\User;

class PlanLimitService
{
    /**
     * Max spaces allowed on Free tier.
     */
    public const int FREE_MAX_SPACES = 3;

    /**
     * Max testimonials per space on Free tier.
     */
    public const int FREE_MAX_TESTIMONIALS = 100;

    /**
     * Max spaces allowed on Pro tier.
     */
    public const int PRO_MAX_SPACES = 25;

    /**
     * Max testimonials per space on Pro tier.
     */
    public const int PRO_MAX_TESTIMONIALS = 1000;

    /**
     * Determine if a user has an active Pro subscription.
     */
    public function isPro(User $user): bool
    {
        return $user->subscribed('default');
    }

    /**
     * Maximum number of spaces allowed for the user.
     */
    public function maxSpaces(User $user): int
    {
        return $this->isPro($user) ? self::PRO_MAX_SPACES : self::FREE_MAX_SPACES;
    }

    /**
     * Maximum number of testimonials allowed for a space.
     */
    public function maxTestimonials(Space $space): int
    {
        $owner = $space->relationLoaded('user') ? $space->user : $space->user()->first();

        if (! $owner) {
            return self::FREE_MAX_TESTIMONIALS;
        }

        return $this->isPro($owner) ? self::PRO_MAX_TESTIMONIALS : self::FREE_MAX_TESTIMONIALS;
    }

    /**
     * Determine if the user can create an additional space.
     */
    public function canCreateSpace(User $user): bool
    {
        return $user->spaces()->count() < $this->maxSpaces($user);
    }

    /**
     * Determine if a space can accept another testimonial.
     */
    public function canAcceptTestimonial(Space $space): bool
    {
        return $space->testimonials()->count() < $this->maxTestimonials($space);
    }

    /**
     * Retrieve space usage summary for a user.
     *
     * @return array{
     *     current: int,
     *     max: int,
     *     remaining: int,
     *     can_create: bool,
     *     is_pro: bool
     * }
     */
    public function getSpaceUsage(User $user): array
    {
        $current = $user->spaces()->count();
        $max = $this->maxSpaces($user);

        return [
            'current' => $current,
            'max' => $max,
            'remaining' => max(0, $max - $current),
            'can_create' => $current < $max,
            'is_pro' => $this->isPro($user),
        ];
    }
}
