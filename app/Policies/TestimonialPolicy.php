<?php

namespace App\Policies;

use App\Models\Testimonial;
use App\Models\User;

class TestimonialPolicy
{
    /**
     * Determine whether the user can view any testimonials.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the testimonial.
     */
    public function view(User $user, Testimonial $testimonial): bool
    {
        return $user->id === $testimonial->space->user_id;
    }

    /**
     * Determine whether the user can create testimonials.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the testimonial.
     */
    public function update(User $user, Testimonial $testimonial): bool
    {
        return $user->id === $testimonial->space->user_id;
    }

    /**
     * Determine whether the user can delete the testimonial.
     */
    public function delete(User $user, Testimonial $testimonial): bool
    {
        return $user->id === $testimonial->space->user_id;
    }

    /**
     * Determine whether the user can restore the testimonial.
     */
    public function restore(User $user, Testimonial $testimonial): bool
    {
        return $user->id === $testimonial->space->user_id;
    }

    /**
     * Determine whether the user can permanently delete the testimonial.
     */
    public function forceDelete(User $user, Testimonial $testimonial): bool
    {
        return $user->id === $testimonial->space->user_id;
    }
}
