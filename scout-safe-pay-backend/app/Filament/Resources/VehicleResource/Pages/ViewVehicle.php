<?php

namespace App\Filament\Resources\VehicleResource\Pages;

use App\Filament\Resources\VehicleResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewVehicle extends ViewRecord
{
    protected static string $resource = VehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            
            Actions\Action::make('view_on_site')
                ->label('View on Website')
                ->icon('heroicon-o-eye')
                ->url(fn () => url("/vehicle/{$this->record->id}"))
                ->openUrlInNewTab()
                ->color('info'),

            Actions\Action::make('publish')
                ->label('Publish')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update(['status' => 'active']))
                ->visible(fn () => $this->record->status === 'draft'),

            Actions\DeleteAction::make(),
        ];
    }
}
