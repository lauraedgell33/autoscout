<?php

namespace App\Filament\Admin\Resources\BankAccounts\Pages;

use App\Filament\Admin\Resources\BankAccounts\BankAccountResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListBankAccounts extends ListRecords
{
    protected static string $resource = BankAccountResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All')
                ->badge(fn () => \App\Models\BankAccount::count()),
            
            'unverified' => Tab::make('Unverified')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_verified', false))
                ->badge(fn () => \App\Models\BankAccount::where('is_verified', false)->count())
                ->badgeColor('danger'),
            
            'verified' => Tab::make('Verified')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_verified', true))
                ->badge(fn () => \App\Models\BankAccount::where('is_verified', true)->count())
                ->badgeColor('success'),
            
            'primary' => Tab::make('Primary Accounts')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_primary', true))
                ->badge(fn () => \App\Models\BankAccount::where('is_primary', true)->count())
                ->badgeColor('warning'),
            
            'users' => Tab::make('User Accounts')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('accountable_type', 'App\Models\User'))
                ->badge(fn () => \App\Models\BankAccount::where('accountable_type', 'App\Models\User')->count())
                ->badgeColor('info'),
            
            'dealers' => Tab::make('Dealer Accounts')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('accountable_type', 'App\Models\Dealer'))
                ->badge(fn () => \App\Models\BankAccount::where('accountable_type', 'App\Models\Dealer')->count())
                ->badgeColor('success'),
        ];
    }
}
