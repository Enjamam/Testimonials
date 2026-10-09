<?php

namespace App\Policies;

use App\Models\EmbedConfiguration;
use App\Models\User;

class EmbedConfigurationPolicy
{
    /**
     * Determine whether the user can view any embed configurations.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the embed configuration.
     */
    public function view(User $user, EmbedConfiguration $embedConfiguration): bool
    {
        return $user->id === $embedConfiguration->space->user_id;
    }

    /**
     * Determine whether the user can create embed configurations.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the embed configuration.
     */
    public function update(User $user, EmbedConfiguration $embedConfiguration): bool
    {
        return $user->id === $embedConfiguration->space->user_id;
    }

    /**
     * Determine whether the user can delete the embed configuration.
     */
    public function delete(User $user, EmbedConfiguration $embedConfiguration): bool
    {
        return $user->id === $embedConfiguration->space->user_id;
    }

    /**
     * Determine whether the user can restore the embed configuration.
     */
    public function restore(User $user, EmbedConfiguration $embedConfiguration): bool
    {
        return $user->id === $embedConfiguration->space->user_id;
    }

    /**
     * Determine whether the user can permanently delete the embed configuration.
     */
    public function forceDelete(User $user, EmbedConfiguration $embedConfiguration): bool
    {
        return $user->id === $embedConfiguration->space->user_id;
    }
}
