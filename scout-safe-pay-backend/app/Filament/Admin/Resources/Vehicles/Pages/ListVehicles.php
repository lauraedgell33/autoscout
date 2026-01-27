<?php

namespace App\Filament\Admin\Resources\Vehicles\Pages;

use App\Filament\Admin\Resources\Vehicles\VehicleResource;
use App\Filament\Admin\Widgets\VehicleStatsOverview;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListVehicles extends ListRecords
{
    protected static string $resource = VehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Adaugă vehicul')
                ->icon('heroicon-o-plus'),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            VehicleStatsOverview::class,
        ];
    }
}
