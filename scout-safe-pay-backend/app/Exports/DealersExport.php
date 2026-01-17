<?php

namespace App\Exports;

use App\Models\Dealer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class DealersExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Dealer::all();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Company Name',
            'VAT Number',
            'Email',
            'Phone',
            'City',
            'Country',
            'Status',
            'Is Verified',
            'Commission Rate',
            'Created At',
        ];
    }

    public function map($dealer): array
    {
        return [
            $dealer->id,
            $dealer->name,
            $dealer->company_name,
            $dealer->vat_number,
            $dealer->email,
            $dealer->phone,
            $dealer->city,
            $dealer->country,
            $dealer->status,
            $dealer->is_verified ? 'Yes' : 'No',
            $dealer->commission_rate,
            $dealer->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
