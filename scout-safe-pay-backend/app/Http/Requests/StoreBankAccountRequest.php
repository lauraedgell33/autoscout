<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBankAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'iban' => [
                'required',
                'string',
                'regex:/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/',
                Rule::unique('bank_accounts')->where(function ($query) {
                    return $query->where('accountable_type', $this->input('accountable_type', 'App\Models\User'))
                                 ->where('accountable_id', auth()->id())
                                 ->whereNull('deleted_at');
                }),
            ],
            'account_holder_name' => 'required|string|max:255',
            'swift_bic' => 'nullable|string|regex:/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/',
            'bank_name' => 'required|string|max:255',
            'bank_country' => 'required|string|size:2|regex:/^[A-Z]{2}$/',
            'currency' => 'nullable|string|size:3|in:EUR,USD,GBP,CHF',
            'is_primary' => 'nullable|boolean',
            'bank_statement_url' => 'nullable|url',
        ];
    }

    public function messages(): array
    {
        return [
            'iban.required' => 'IBAN is required for bank account verification.',
            'iban.regex' => 'Invalid IBAN format. Must follow international standard (e.g., DE89370400440532013000).',
            'iban.unique' => 'This IBAN is already registered to your account.',
            'account_holder_name.required' => 'Account holder name is required.',
            'swift_bic.regex' => 'Invalid SWIFT/BIC code format (e.g., COBADEFFXXX).',
            'bank_name.required' => 'Bank name is required.',
            'bank_country.regex' => 'Bank country must be a valid 2-letter ISO code (e.g., DE, AT, CH).',
            'currency.in' => 'Currency must be one of: EUR, USD, GBP, CHF.',
        ];
    }

    protected function prepareForValidation()
    {
        // Remove spaces from IBAN for validation
        if ($this->has('iban')) {
            $this->merge([
                'iban' => strtoupper(str_replace(' ', '', $this->input('iban'))),
            ]);
        }

        // Uppercase country code and SWIFT
        if ($this->has('bank_country')) {
            $this->merge([
                'bank_country' => strtoupper($this->input('bank_country')),
            ]);
        }

        if ($this->has('swift_bic')) {
            $this->merge([
                'swift_bic' => strtoupper(str_replace(' ', '', $this->input('swift_bic'))),
            ]);
        }
    }
}
