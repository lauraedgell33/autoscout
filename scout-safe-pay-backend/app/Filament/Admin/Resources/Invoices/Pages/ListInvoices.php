<?php

namespace App\Filament\Admin\Resources\Invoices\Pages;

use App\Filament\Admin\Resources\Invoices\InvoiceResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListInvoices extends ListRecords
{
    protected static string $resource = InvoiceResource::class;

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
                ->badge(fn () => \App\Models\Invoice::count()),
            
            'draft' => Tab::make('Draft')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'draft'))
                ->badge(fn () => \App\Models\Invoice::where('status', 'draft')->count())
                ->badgeColor('secondary'),
            
            'sent' => Tab::make('Sent')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'sent'))
                ->badge(fn () => \App\Models\Invoice::where('status', 'sent')->count())
                ->badgeColor('info'),
            
            'paid' => Tab::make('Paid')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'paid'))
                ->badge(fn () => \App\Models\Invoice::where('status', 'paid')->count())
                ->badgeColor('success'),
            
            'overdue' => Tab::make('Overdue')
                ->modifyQueryUsing(fn (Builder $query) => 
                    $query->where('status', '!=', 'paid')
                        ->whereDate('due_date', '<', now())
                )
                ->badge(fn () => \App\Models\Invoice::where('status', '!=', 'paid')
                    ->whereDate('due_date', '<', now())
                    ->count())
                ->badgeColor('danger'),
            
            'this_month' => Tab::make('This Month')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereMonth('invoice_date', now()->month))
                ->badge(fn () => \App\Models\Invoice::whereMonth('invoice_date', now()->month)->count())
                ->badgeColor('warning'),
        ];
    }
}
