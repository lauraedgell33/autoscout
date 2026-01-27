<?php

namespace App\Filament\Admin\Resources\Vehicles\Pages;

use App\Filament\Admin\Resources\Vehicles\VehicleResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\ViewAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditVehicle extends EditRecord
{
    protected static string $resource = VehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make()
                ->label('Vizualizare'),
            DeleteAction::make()
                ->label('Șterge')
                ->successNotification(
                    Notification::make()
                        ->success()
                        ->title('Vehicul șters')
                        ->body('Vehiculul a fost șters cu succes.')
                ),
            ForceDeleteAction::make()
                ->label('Șterge permanent'),
            RestoreAction::make()
                ->label('Restaurează'),
        ];
    }

    protected function getSavedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Vehicul actualizat')
            ->body('Modificările au fost salvate cu succes.');
    }
}
