<?php

namespace App\Filament\Admin\Resources\LegalDocuments\Pages;

use App\Filament\Admin\Resources\LegalDocuments\LegalDocumentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLegalDocument extends EditRecord
{
    protected static string $resource = LegalDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('publish')
                ->label('Publish')
                ->icon('heroicon-o-rocket-launch')
                ->color('success')
                ->requiresConfirmation()
                ->modalHeading('Publish Legal Document')
                ->modalDescription('This will make the document active and archive the previous version if applicable.')
                ->action(function () {
                    $this->record->update([
                        'status' => 'active',
                        'effective_from' => $this->record->effective_from ?? now(),
                        'approved_by' => auth()->id(),
                        'approved_at' => now(),
                    ]);
                    
                    // Archive previous version
                    if ($this->record->replaces_document_id) {
                        \App\Models\LegalDocument::find($this->record->replaces_document_id)?->update([
                            'status' => 'archived',
                            'effective_until' => now(),
                        ]);
                    }
                    
                    $this->notify('success', 'Document published successfully');
                })
                ->visible(fn () => in_array($this->record->status, ['draft', 'review'])),

            Actions\Action::make('new_version')
                ->label('Create New Version')
                ->icon('heroicon-o-document-duplicate')
                ->color('info')
                ->form([
                    \Filament\Forms\Components\TextInput::make('version')
                        ->label('New Version Number')
                        ->default(fn () => (string) (floor((float) $this->record->version) + 1) . '.0')
                        ->required(),
                    \Filament\Forms\Components\Textarea::make('change_log')
                        ->label('What changed?')
                        ->required()
                        ->rows(4),
                ])
                ->action(function (array $data) {
                    $newDocument = $this->record->replicate();
                    $newDocument->version = $data['version'];
                    $newDocument->change_log = $data['change_log'];
                    $newDocument->status = 'draft';
                    $newDocument->replaces_document_id = $this->record->id;
                    $newDocument->approved_by = null;
                    $newDocument->approved_at = null;
                    $newDocument->effective_from = null;
                    $newDocument->effective_until = null;
                    $newDocument->save();
                    
                    $this->notify('success', 'New version created: v' . $data['version']);
                    $this->redirect(static::getResource()::getUrl('edit', ['record' => $newDocument]));
                })
                ->visible(fn () => $this->record->status === 'active'),

            Actions\Action::make('preview')
                ->label('Preview')
                ->icon('heroicon-o-eye')
                ->color('info')
                ->url(fn () => route('legal.preview', $this->record))
                ->openUrlInNewTab(),

            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // If status changed to active, set approval data
        if ($data['status'] === 'active' && $this->record->status !== 'active') {
            $data['approved_by'] = auth()->id();
            $data['approved_at'] = now();
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('view', ['record' => $this->getRecord()]);
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Legal document updated successfully';
    }
}
