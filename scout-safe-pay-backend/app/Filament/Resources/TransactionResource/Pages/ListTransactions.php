<?php

namespace App\Filament\Resources\TransactionResource\Pages;

use App\Filament\Resources\TransactionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Pages\ListRecords\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListTransactions extends ListRecords
{
    protected static string $resource = TransactionResource::class;

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
                ->badge(fn () => \App\Models\Transaction::count()),
            
            'pending' => Tab::make('Pending')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'pending'))
                ->badge(fn () => \App\Models\Transaction::where('status', 'pending')->count())
                ->badgeColor('warning'),
            
            'payment_received' => Tab::make('Payment Received')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'payment_received'))
                ->badge(fn () => \App\Models\Transaction::where('status', 'payment_received')->count())
                ->badgeColor('info'),
            
            'completed' => Tab::make('Completed')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'completed'))
                ->badge(fn () => \App\Models\Transaction::where('status', 'completed')->count())
                ->badgeColor('success'),
            
            'cancelled' => Tab::make('Cancelled')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'cancelled'))
                ->badge(fn () => \App\Models\Transaction::where('status', 'cancelled')->count())
                ->badgeColor('danger'),
        ];
    }
}
