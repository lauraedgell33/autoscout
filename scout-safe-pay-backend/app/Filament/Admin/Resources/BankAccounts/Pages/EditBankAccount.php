<?php

namespace App\Filament\Admin\Resources\BankAccounts\Pages;

use App\Filament\Admin\Resources\BankAccounts\BankAccountResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditBankAccount extends EditRecord
{
    protected static string $resource = BankAccountResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('verify')
                ->label('Verify Account')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update([
                    'is_verified' => true,
                    'verified_by' => auth()->id(),
                    'verified_at' => now(),
                ]))
                ->visible(fn () => !$this->record->is_verified),

            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Update verified_by if verification status changed
        if ($data['is_verified'] && !$this->record->is_verified) {
            $data['verified_by'] = auth()->id();
            $data['verified_at'] = now();
        } elseif (!$data['is_verified']) {
            $data['verified_by'] = null;
            $data['verified_at'] = null;
        }

        return $data;
    }

    protected function afterSave(): void
    {
        // If this is set as primary, unset other primary accounts
        if ($this->record->is_primary) {
            \App\Models\BankAccount::where('accountable_type', $this->record->accountable_type)
                ->where('accountable_id', $this->record->accountable_id)
                ->where('id', '!=', $this->record->id)
                ->update(['is_primary' => false]);
        }
    }
}
