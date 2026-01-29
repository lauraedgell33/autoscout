<?php

namespace App\Filament\Admin\Resources\Messages\Pages;

use App\Filament\Admin\Resources\Messages\MessageResource;
use Filament\Resources\Pages\CreateRecord;

class CreateMessage extends CreateRecord
{
    protected static string $resource = MessageResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // If sender not specified, set to current admin
        if (empty($data['sender_id'])) {
            $data['sender_id'] = auth()->id();
            $data['is_system_message'] = true;
        }

        return $data;
    }
}
