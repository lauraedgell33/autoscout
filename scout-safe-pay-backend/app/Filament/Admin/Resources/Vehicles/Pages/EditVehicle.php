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
                ->label('View'),
            DeleteAction::make()
                ->label('Delete')
                ->successNotification(
                    Notification::make()
                        ->success()
                        ->title('Vehicle Deleted')
                        ->body('The vehicle has been deleted successfully.')
                ),
            ForceDeleteAction::make()
                ->label('Force Delete'),
            RestoreAction::make()
                ->label('Restore'),
        ];
    }

    protected function getSavedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Vehicle Updated')
            ->body('Changes have been saved successfully.');
    }
}
