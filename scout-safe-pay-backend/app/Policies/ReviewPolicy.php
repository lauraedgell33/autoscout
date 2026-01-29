<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Review;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReviewPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator', 'support']);
    }

    public function view(User $user, Review $review): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator', 'support']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function update(User $user, Review $review): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator']);
    }

    public function delete(User $user, Review $review): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator']);
    }

    public function forceDelete(User $user, Review $review): bool
    {
        return $user->hasRole('super_admin');
    }

    public function restore(User $user, Review $review): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    // Custom permissions for moderation actions
    public function approve(User $user, Review $review): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator']);
    }

    public function reject(User $user, Review $review): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator']);
    }

    public function flag(User $user, Review $review): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator', 'support']);
    }
}
