<?php

namespace App\Filament\Admin\Resources\LegalDocuments\Pages;

use App\Filament\Admin\Resources\LegalDocuments\LegalDocumentResource;
use App\Models\LegalDocument;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditLegalDocument extends EditRecord
{
    protected static string $resource = LegalDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('activate')
                ->label('Activate')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn () => !$this->record->is_active)
                ->action(function () {
                    // Deactivate other documents of same type and language
                    LegalDocument::where('type', $this->record->type)
                        ->where('language', $this->record->language)
                        ->where('id', '!=', $this->record->id)
                        ->update(['is_active' => false]);

                    $this->record->update(['is_active' => true]);

                    Notification::make()
                        ->title('Document activated')
                        ->success()
                        ->send();
                }),

            Actions\Action::make('new_version')
                ->label('Create New Version')
                ->icon('heroicon-o-document-duplicate')
                ->color('info')
                ->action(function () {
                    $newVersion = (float) $this->record->version + 0.1;
                    $newDoc = LegalDocument::create([
                        'type' => $this->record->type,
                        'title' => $this->record->title,
                        'version' => number_format($newVersion, 1),
                        'language' => $this->record->language,
                        'content' => $this->record->content,
                        'is_active' => false,
                        'effective_date' => now(),
                    ]);

                    Notification::make()
                        ->title('New version created: v' . number_format($newVersion, 1))
                        ->success()
                        ->send();

                    $this->redirect(static::getResource()::getUrl('edit', ['record' => $newDoc]));
                }),

            ViewAction::make(),
            DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
