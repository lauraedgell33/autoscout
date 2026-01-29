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
            Actions\Action::make('generatePDF')
                ->label('Generate PDF')
                ->icon('heroicon-o-document')
                ->color('primary')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update([
                    'pdf_url' => '/storage/invoices/' . $this->record->invoice_number . '.pdf',
                ])),

            Actions\Action::make('sendEmail')
                ->label('Send Email')
                ->icon('heroicon-o-envelope')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update(['status' => 'sent'])),

            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Recalculate total if amounts changed
        if (isset($data['amount']) || isset($data['tax_amount'])) {
            $data['total_amount'] = ($data['amount'] ?? $this->record->amount) + 
                                   ($data['tax_amount'] ?? $this->record->tax_amount);
        }

        return $data;
    }
}
