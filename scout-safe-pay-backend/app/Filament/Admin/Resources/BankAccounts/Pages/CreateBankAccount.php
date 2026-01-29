<?php

namespace App\Filament\Admin\Resources\BankAccounts\Pages;

use App\Filament\Admin\Resources\BankAccounts\BankAccountResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBankAccount extends CreateRecord
{
    protected static string $resource = BankAccountResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Set verified_by if is_verified is true
        if ($data['is_verified']) {
            $data['verified_by'] = auth()->id();
            $data['verified_at'] = now();
        }

        return $data;
    }

    protected function afterCreate(): void
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
