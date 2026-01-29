<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransactionPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'financial', 'support']);
    }

    public function view(User $user, Transaction $transaction): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'financial', 'support']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function update(User $user, Transaction $transaction): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'financial']);
    }

    public function delete(User $user, Transaction $transaction): bool
    {
        return $user->hasRole('super_admin');
    }

    public function forceDelete(User $user, Transaction $transaction): bool
    {
        return $user->hasRole('super_admin');
    }

    public function restore(User $user, Transaction $transaction): bool
    {
        return $user->hasRole('super_admin');
    }
}
