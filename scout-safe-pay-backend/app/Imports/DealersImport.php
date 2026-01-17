<?php

namespace App\Imports;

use App\Models\Dealer;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Validation\Rule;

class DealersImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        return new Dealer([
            'name' => $row['name'],
            'company_name' => $row['company_name'],
            'vat_number' => $row['vat_number'],
            'registration_number' => $row['registration_number'] ?? null,
            'email' => $row['email'],
            'phone' => $row['phone'] ?? null,
            'address' => $row['address'] ?? null,
            'city' => $row['city'] ?? null,
            'postal_code' => $row['postal_code'] ?? null,
            'country' => $row['country'] ?? 'Germany',
            'status' => $row['status'] ?? 'pending',
            'is_verified' => isset($row['is_verified']) ? (bool)$row['is_verified'] : false,
            'commission_rate' => $row['commission_rate'] ?? 2.5,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'company_name' => ['required', 'string', 'max:255'],
            'vat_number' => ['required', 'string', 'unique:dealers,vat_number'],
            'email' => ['required', 'email', 'unique:dealers,email'],
            'status' => [Rule::in(['pending', 'active', 'suspended', 'inactive'])],
        ];
    }
}
