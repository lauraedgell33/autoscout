<?php

namespace App\Filament\Admin\Resources\LegalDocuments\Pages;

use App\Filament\Admin\Resources\LegalDocuments\LegalDocumentResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLegalDocument extends CreateRecord
{
    protected static string $resource = LegalDocumentResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Auto-increment version if replacing another document
        if (!empty($data['replaces_document_id'])) {
            $previousDocument = \App\Models\LegalDocument::find($data['replaces_document_id']);
            
            if ($previousDocument && empty($data['version'])) {
                // Increment version (e.g., 1.0 -> 2.0, 1.5 -> 2.0)
                $currentVersion = (float) $previousDocument->version;
                $data['version'] = (string) (floor($currentVersion) + 1) . '.0';
            }
        }

        // Set default version if not set
        if (empty($data['version'])) {
            $data['version'] = '1.0';
        }

        // Set default effective_from if not set
        if (empty($data['effective_from'])) {
            $data['effective_from'] = now();
        }

        // If status is active, set approval data
        if ($data['status'] === 'active' && empty($data['approved_by'])) {
            $data['approved_by'] = auth()->id();
            $data['approved_at'] = now();
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('view', ['record' => $this->getRecord()]);
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'Legal document created successfully';
    }
}
