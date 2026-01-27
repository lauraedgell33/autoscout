<?php

namespace App\Filament\Admin\Resources\Vehicles\Pages;

use App\Filament\Admin\Resources\Vehicles\VehicleResource;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreateVehicle extends CreateRecord
{
    protected static string $resource = VehicleResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Vehicul creat')
            ->body('Vehiculul a fost adăugat cu succes în sistem.');
    }
}
