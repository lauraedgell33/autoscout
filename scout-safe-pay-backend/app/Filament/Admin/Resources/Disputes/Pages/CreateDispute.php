<?php

namespace App\Filament\Admin\Resources\Disputes\Pages;

use App\Filament\Admin\Resources\Disputes\DisputeResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDispute extends CreateRecord
{
    protected static string $resource = DisputeResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Generate dispute code if not provided
        if (empty($data['dispute_code'])) {
            $data['dispute_code'] = 'DSP-' . strtoupper(substr(md5(time() . rand()), 0, 8));
        }

        return $data;
    }
}
