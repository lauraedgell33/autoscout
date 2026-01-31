<?php

namespace App\Filament\Admin\Resources\Invoices\Pages;

use App\Filament\Admin\Resources\Invoices\InvoiceResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditInvoice extends EditRecord
{
    protected static string $resource = InvoiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('mark_paid')
                ->label('Mark as Paid')
                ->icon('heroicon-o-banknotes')
                ->color('info')
                ->requiresConfirmation()
                ->visible(fn () => $this->record->isPending())
                ->action(fn () => $this->record->markAsPaid()),

            Actions\Action::make('confirm')
                ->label('Confirm Payment')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn () => $this->record->isPaid())
                ->action(fn () => $this->record->markAsConfirmed(auth()->user())),

            ViewAction::make(),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Recalculate VAT and total if amount changed
        if (isset($data['amount']) && isset($data['vat_percentage'])) {
            $data['vat_amount'] = round($data['amount'] * ($data['vat_percentage'] / 100), 2);
            $data['total_amount'] = round($data['amount'] + $data['vat_amount'], 2);
        }

        return $data;
    }
}
