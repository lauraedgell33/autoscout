<?php

namespace App\Imports;

use App\Models\Vehicle;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Validation\Rule;

class VehiclesImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        return new Vehicle([
            'seller_id' => $row['seller_id'],
            'dealer_id' => $row['dealer_id'] ?? null,
            'make' => $row['make'],
            'model' => $row['model'],
            'year' => $row['year'],
            'vin' => $row['vin'],
            'license_plate' => $row['license_plate'] ?? null,
            'mileage' => $row['mileage'] ?? 0,
            'fuel_type' => $row['fuel_type'] ?? null,
            'transmission' => $row['transmission'] ?? null,
            'color' => $row['color'] ?? null,
            'price' => $row['price'],
            'description' => $row['description'] ?? null,
            'status' => $row['status'] ?? 'draft',
        ]);
    }

    public function rules(): array
    {
        return [
            'seller_id' => ['required', 'exists:users,id'],
            'dealer_id' => ['nullable', 'exists:dealers,id'],
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'vin' => ['required', 'string', 'unique:vehicles,vin'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => [Rule::in(['draft', 'active', 'sold', 'reserved', 'removed'])],
        ];
    }
}
