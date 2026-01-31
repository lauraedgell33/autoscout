<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends AdminPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, $model): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, $model): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, $model): bool
    {
        // Prevent admin from deleting themselves
        if ($user->id === $model->id) {
            return false;
        }
        
        return $user->isAdmin();
    }
}
