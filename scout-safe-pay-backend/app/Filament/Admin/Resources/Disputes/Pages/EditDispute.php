<?php

namespace App\Filament\Admin\Resources\Disputes\Pages;

use App\Filament\Admin\Resources\Disputes\DisputeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDispute extends EditRecord
{
    protected static string $resource = DisputeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('investigate')
                ->label('Mark as Investigating')
                ->icon('heroicon-o-magnifying-glass')
                ->color('warning')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update(['status' => 'investigating']))
                ->visible(fn () => $this->record->status === 'open'),

            Actions\Action::make('resolve')
                ->label('Resolve Dispute')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update([
                    'status' => 'resolved',
                    'resolved_by' => auth()->id(),
                    'resolved_at' => now(),
                ]))
                ->visible(fn () => !in_array($this->record->status, ['resolved', 'closed'])),

            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Update resolved_by if status changed to resolved
        if ($data['status'] === 'resolved' && $this->record->status !== 'resolved') {
            $data['resolved_by'] = auth()->id();
            $data['resolved_at'] = now();
        }

        return $data;
    }
}
