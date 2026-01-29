<?php

namespace App\Filament\Admin\Resources\Disputes\Pages;

use App\Filament\Admin\Resources\Disputes\DisputeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListDisputes extends ListRecords
{
    protected static string $resource = DisputeResource::class;

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
                ->badge(fn () => \App\Models\Dispute::count()),
            
            'open' => Tab::make('Open')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'open'))
                ->badge(fn () => \App\Models\Dispute::where('status', 'open')->count())
                ->badgeColor('danger'),
            
            'investigating' => Tab::make('Investigating')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'investigating'))
                ->badge(fn () => \App\Models\Dispute::where('status', 'investigating')->count())
                ->badgeColor('warning'),
            
            'awaiting_response' => Tab::make('Awaiting Response')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'awaiting_response'))
                ->badge(fn () => \App\Models\Dispute::where('status', 'awaiting_response')->count())
                ->badgeColor('info'),
            
            'resolved' => Tab::make('Resolved')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'resolved'))
                ->badge(fn () => \App\Models\Dispute::where('status', 'resolved')->count())
                ->badgeColor('success'),
            
            'escalated' => Tab::make('Escalated')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'escalated'))
                ->badge(fn () => \App\Models\Dispute::where('status', 'escalated')->count())
                ->badgeColor('danger'),
            
            'fraud' => Tab::make('Fraud Cases')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'fraud'))
                ->badge(fn () => \App\Models\Dispute::where('type', 'fraud')->count())
                ->badgeColor('danger'),
        ];
    }
}
