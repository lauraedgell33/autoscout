<?php

namespace App\Filament\Admin\Resources\Vehicles\Pages;

use App\Filament\Admin\Resources\Vehicles\VehicleResource;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewVehicle extends ViewRecord
{
    protected static string $resource = VehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('viewOnFrontend')
                ->label('View on Site')
                ->icon('heroicon-o-globe-alt')
                ->color('info')
                ->url(fn () => config('app.frontend_url', 'http://localhost:3000') . '/en/vehicle/' . $this->record->id)
                ->openUrlInNewTab(),
            EditAction::make(),
        ];
    }
}
