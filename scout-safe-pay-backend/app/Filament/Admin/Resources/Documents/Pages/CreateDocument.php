<?php

namespace App\Filament\Admin\Resources\Documents\Pages;

use App\Filament\Admin\Resources\Documents\DocumentResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDocument extends CreateRecord
{
    protected static string $resource = DocumentResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Set uploaded_by to current user if not set
        if (empty($data['uploaded_by'])) {
            $data['uploaded_by'] = auth()->id();
        }

        // Auto-detect file details from uploaded file
        if (!empty($data['file_path'])) {
            $filePath = storage_path('app/public/' . $data['file_path']);
            
            if (file_exists($filePath)) {
                // Get file size
                if (empty($data['file_size'])) {
                    $data['file_size'] = filesize($filePath);
                }

                // Get file type
                if (empty($data['file_type'])) {
                    $data['file_type'] = mime_content_type($filePath);
                }

                // Get file name from path if not set
                if (empty($data['file_name'])) {
                    $data['file_name'] = basename($filePath);
                }
            }
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
