<?php

namespace App\Imports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class TransactionsImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        return new Transaction([
            'transaction_code' => $row['transaction_code'] ?? 'TXN-' . strtoupper(Str::random(8)),
            'buyer_id' => $row['buyer_id'],
            'seller_id' => $row['seller_id'],
            'dealer_id' => $row['dealer_id'] ?? null,
            'vehicle_id' => $row['vehicle_id'],
            'amount' => $row['amount'],
            'commission_rate' => $row['commission_rate'] ?? 2.5,
            'commission_amount' => $row['commission_amount'] ?? ($row['amount'] * ($row['commission_rate'] ?? 2.5) / 100),
            'payment_method' => $row['payment_method'] ?? 'bank_transfer',
            'status' => $row['status'] ?? 'pending',
            'notes' => $row['notes'] ?? null,
        ]);
    }

    public function rules(): array
    {
        return [
            'buyer_id' => ['required', 'exists:users,id'],
            'seller_id' => ['required', 'exists:users,id'],
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => [Rule::in(['bank_transfer', 'credit_card', 'paypal', 'crypto', 'cash', 'other'])],
            'status' => [Rule::in(['pending', 'payment_pending', 'payment_verified', 'in_progress', 'completed', 'cancelled', 'disputed'])],
        ];
    }
}
