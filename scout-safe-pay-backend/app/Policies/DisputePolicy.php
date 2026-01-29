<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Dispute;
use Illuminate\Auth\Access\HandlesAuthorization;

class DisputePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator', 'support']);
    }

    public function view(User $user, Dispute $dispute): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator', 'support']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'support']);
    }

    public function update(User $user, Dispute $dispute): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator']);
    }

    public function delete(User $user, Dispute $dispute): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function forceDelete(User $user, Dispute $dispute): bool
    {
        return $user->hasRole('super_admin');
    }

    public function restore(User $user, Dispute $dispute): bool
    {
        return $user->hasRole('super_admin');
    }

    // Custom permissions for dispute resolution
    public function investigate(User $user, Dispute $dispute): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator']);
    }

    public function resolve(User $user, Dispute $dispute): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function escalate(User $user, Dispute $dispute): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'moderator']);
    }
}
