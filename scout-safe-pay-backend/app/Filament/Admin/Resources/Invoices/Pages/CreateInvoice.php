<?php

namespace App\Filament\Admin\Resources\Invoices\Pages;

use App\Filament\Admin\Resources\Invoices\InvoiceResource;
use Filament\Resources\Pages\CreateRecord;

class CreateInvoice extends CreateRecord
{
    protected static string $resource = InvoiceResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Generate invoice number if not provided
        if (empty($data['invoice_number'])) {
            $data['invoice_number'] = \App\Models\Invoice::generateInvoiceNumber();
        }

        // Calculate VAT and total
        if (isset($data['amount']) && isset($data['vat_percentage'])) {
            $data['vat_amount'] = round($data['amount'] * ($data['vat_percentage'] / 100), 2);
            $data['total_amount'] = round($data['amount'] + $data['vat_amount'], 2);
        }

        return $data;
    }
}
