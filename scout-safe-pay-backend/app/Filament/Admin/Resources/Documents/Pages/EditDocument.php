<?php

namespace App\Filament\Admin\Resources\Documents\Pages;

use App\Filament\Admin\Resources\Documents\DocumentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDocument extends EditRecord
{
    protected static string $resource = DocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('download')
                ->label('Download File')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('primary')
                ->url(fn () => $this->record->file_path ? asset('storage/' . $this->record->file_path) : '#')
                ->openUrlInNewTab()
                ->visible(fn () => !empty($this->record->file_path)),

            Actions\Action::make('new_version')
                ->label('Create New Version')
                ->icon('heroicon-o-document-duplicate')
                ->color('info')
                ->requiresConfirmation()
                ->action(function () {
                    // Increment version (e.g., 1.0 -> 2.0, 1.5 -> 2.5)
                    $currentVersion = (float) $this->record->version;
                    $newVersion = ceil($currentVersion) + 1 . '.0';
                    
                    $this->record->update([
                        'version' => $newVersion,
                        'status' => 'draft',
                    ]);
                    
                    $this->notify('success', 'New version created: v' . $newVersion);
                })
                ->visible(fn () => $this->record->status === 'active'),

            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Update file details if file was re-uploaded
        if (!empty($data['file_path']) && $data['file_path'] !== $this->record->file_path) {
            $filePath = storage_path('app/public/' . $data['file_path']);
            
            if (file_exists($filePath)) {
                // Update file size
                $data['file_size'] = round(filesize($filePath) / 1024, 2);
                
                // Update MIME type
                $data['mime_type'] = mime_content_type($filePath);
                
                // Update file name
                $data['file_name'] = basename($filePath);
            }
        }

        // Auto-expire if expiration date passed
        if (!empty($data['expires_at']) && strtotime($data['expires_at']) < time() && $data['status'] !== 'expired') {
            $data['status'] = 'expired';
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('view', ['record' => $this->getRecord()]);
    }
}
