<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserConsent;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserConsentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'support']);
    }

    public function view(User $user, UserConsent $userConsent): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'support']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function update(User $user, UserConsent $userConsent): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function delete(User $user, UserConsent $userConsent): bool
    {
        return $user->hasRole('super_admin');
    }

    public function forceDelete(User $user, UserConsent $userConsent): bool
    {
        return $user->hasRole('super_admin');
    }

    public function restore(User $user, UserConsent $userConsent): bool
    {
        return $user->hasRole('super_admin');
    }
}
