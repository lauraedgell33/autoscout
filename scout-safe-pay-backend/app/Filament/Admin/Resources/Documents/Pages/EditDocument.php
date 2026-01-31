<?php

namespace App\Filament\Admin\Resources\Documents\Pages;

use App\Filament\Admin\Resources\Documents\DocumentResource;
use Filament\Actions;
use Filament\Notifications\Notification;
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

            Actions\Action::make('verify')
                ->label('Verify Document')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->action(function () {
                    $this->record->verify(auth()->user());
                    Notification::make()
                        ->title('Document verified successfully')
                        ->success()
                        ->send();
                })
                ->visible(fn () => !$this->record->is_verified),

            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Update file details if file was re-uploaded
        if (!empty($data['file_path']) && $data['file_path'] !== $this->record->file_path) {
            $filePath = storage_path('app/public/' . $data['file_path']);
            
            if (file_exists($filePath)) {
                $data['file_size'] = filesize($filePath);
                $data['file_type'] = mime_content_type($filePath);
                $data['file_name'] = basename($filePath);
            }
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
