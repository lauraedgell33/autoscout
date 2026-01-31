<?php

namespace App\Filament\Admin\Resources\LegalDocuments\Pages;

use App\Filament\Admin\Resources\LegalDocuments\LegalDocumentResource;
use App\Models\LegalDocument;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewLegalDocument extends ViewRecord
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

            Actions\Action::make('deactivate')
                ->label('Deactivate')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->requiresConfirmation()
                ->visible(fn () => $this->record->is_active)
                ->action(function () {
                    $this->record->update(['is_active' => false]);

                    Notification::make()
                        ->title('Document deactivated')
                        ->warning()
                        ->send();
                }),

            EditAction::make(),
            DeleteAction::make(),
        ];
    }
}
