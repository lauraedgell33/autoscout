<?php

namespace App\Filament\Resources\VehicleResource\Pages;

use App\Filament\Resources\VehicleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Pages\ListRecords\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListVehicles extends ListRecords
{
    protected static string $resource = VehicleResource::class;

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
                ->badge(fn () => \App\Models\Vehicle::count()),
            
            'draft' => Tab::make('Draft')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'draft'))
                ->badge(fn () => \App\Models\Vehicle::where('status', 'draft')->count())
                ->badgeColor('secondary'),
            
            'active' => Tab::make('Active')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'active'))
                ->badge(fn () => \App\Models\Vehicle::where('status', 'active')->count())
                ->badgeColor('success'),
            
            'reserved' => Tab::make('Reserved')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'reserved'))
                ->badge(fn () => \App\Models\Vehicle::where('status', 'reserved')->count())
                ->badgeColor('warning'),
            
            'sold' => Tab::make('Sold')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'sold'))
                ->badge(fn () => \App\Models\Vehicle::where('status', 'sold')->count())
                ->badgeColor('info'),
        ];
    }
}
