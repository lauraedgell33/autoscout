<?php

namespace App\Filament\Resources\VehicleResource\Pages;

use App\Filament\Resources\VehicleResource;
use Filament\Resources\Pages\CreateRecord;

class CreateVehicle extends CreateRecord
{
    protected static string $resource = VehicleResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['seller_id'] = auth()->id();
        
        // Set dealer_id if user is a dealer
        if (auth()->user()->dealer_id) {
            $data['dealer_id'] = auth()->user()->dealer_id;
        }

        // Set primary image from first image
        if (!empty($data['images'])) {
            $data['primary_image'] = is_array($data['images']) ? $data['images'][0] : $data['images'];
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
