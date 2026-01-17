<?php

namespace App\Imports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class UsersImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        return new User([
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password'] ?? 'password'),
            'phone' => $row['phone'] ?? null,
            'user_type' => $row['user_type'] ?? 'buyer',
            'is_verified' => isset($row['is_verified']) ? (bool)$row['is_verified'] : false,
            'email_verified_at' => isset($row['is_verified']) && $row['is_verified'] ? now() : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'user_type' => [Rule::in(['buyer', 'seller', 'dealer', 'admin'])],
        ];
    }
}
