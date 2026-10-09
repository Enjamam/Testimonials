<?php

namespace App\Policies;

use App\Models\Space;
use App\Models\User;

class SpacePolicy
{
    /**
     * Determine whether the user can view any spaces.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the space.
     */
    public function view(User $user, Space $space): bool
    {
        return $user->id === $space->user_id;
    }

    /**
     * Determine whether the user can create spaces.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the space.
     */
    public function update(User $user, Space $space): bool
    {
        return $user->id === $space->user_id;
    }

    /**
     * Determine whether the user can delete the space.
     */
    public function delete(User $user, Space $space): bool
    {
        return $user->id === $space->user_id;
    }

    /**
     * Determine whether the user can restore the space.
     */
    public function restore(User $user, Space $space): bool
    {
        return $user->id === $space->user_id;
    }

    /**
     * Determine whether the user can permanently delete the space.
     */
    public function forceDelete(User $user, Space $space): bool
    {
        return $user->id === $space->user_id;
    }
}
