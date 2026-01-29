<?php

namespace App\Policies;

use App\Models\User;
use App\Models\LegalDocument;
use Illuminate\Auth\Access\HandlesAuthorization;

class LegalDocumentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function view(User $user, LegalDocument $legalDocument): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function update(User $user, LegalDocument $legalDocument): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function delete(User $user, LegalDocument $legalDocument): bool
    {
        return $user->hasRole('super_admin');
    }

    public function forceDelete(User $user, LegalDocument $legalDocument): bool
    {
        return $user->hasRole('super_admin');
    }

    public function restore(User $user, LegalDocument $legalDocument): bool
    {
        return $user->hasRole('super_admin');
    }

    // Custom permission for publishing
    public function publish(User $user, LegalDocument $legalDocument): bool
    {
        return $user->hasRole('super_admin');
    }
}
