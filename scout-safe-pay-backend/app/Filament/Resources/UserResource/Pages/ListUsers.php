<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Pages\ListRecords\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListUsers extends ListRecords
{
    protected static string $resource = UserResource::class;

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
                ->badge(fn () => \App\Models\User::count()),
            
            'buyers' => Tab::make('Buyers')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('user_type', 'buyer'))
                ->badge(fn () => \App\Models\User::where('user_type', 'buyer')->count())
                ->badgeColor('info'),
            
            'sellers' => Tab::make('Sellers')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('user_type', 'seller'))
                ->badge(fn () => \App\Models\User::where('user_type', 'seller')->count())
                ->badgeColor('warning'),
            
            'admins' => Tab::make('Admins')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('user_type', 'admin'))
                ->badge(fn () => \App\Models\User::where('user_type', 'admin')->count())
                ->badgeColor('danger'),
            
            'verified' => Tab::make('Verified')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_verified', true))
                ->badge(fn () => \App\Models\User::where('is_verified', true)->count())
                ->badgeColor('success'),
            
            'unverified' => Tab::make('Unverified')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_verified', false))
                ->badge(fn () => \App\Models\User::where('is_verified', false)->count())
                ->badgeColor('gray'),
            
            'kyc_pending' => Tab::make('KYC Pending')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('kyc_status', 'pending'))
                ->badge(fn () => \App\Models\User::where('kyc_status', 'pending')->count())
                ->badgeColor('warning'),
        ];
    }
}
