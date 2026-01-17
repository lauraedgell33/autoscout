<?php

namespace App\Filament\Resources\CookiePreferenceResource\Pages;

use App\Filament\Resources\CookiePreferenceResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCookiePreference extends CreateRecord
{
    protected static string $resource = CookiePreferenceResource::class;
    
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['accepted_at'] = $data['accepted_at'] ?? now();
        $data['expires_at'] = $data['expires_at'] ?? now()->addYear();
        
        return $data;
    }
}
