<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBankAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        $bankAccount = $this->route('bank_account');
        
        return $bankAccount && (
            $bankAccount->accountable_id === auth()->id() ||
            auth()->user()->hasRole(['super_admin', 'admin'])
        );
    }

    public function rules(): array
    {
        $bankAccountId = $this->route('bank_account')->id;

        return [
            'iban' => [
                'sometimes',
                'required',
                'string',
                'regex:/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/',
                Rule::unique('bank_accounts')->where(function ($query) {
                    return $query->where('accountable_type', 'App\Models\User')
                                 ->where('accountable_id', auth()->id())
                                 ->whereNull('deleted_at');
                })->ignore($bankAccountId),
            ],
            'account_holder_name' => 'sometimes|required|string|max:255',
            'swift_bic' => 'nullable|string|regex:/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/',
            'bank_name' => 'sometimes|required|string|max:255',
            'bank_country' => 'sometimes|required|string|size:2|regex:/^[A-Z]{2}$/',
            'currency' => 'nullable|string|size:3|in:EUR,USD,GBP,CHF',
            'is_primary' => 'nullable|boolean',
            'bank_statement_url' => 'nullable|url',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('iban')) {
            $this->merge([
                'iban' => strtoupper(str_replace(' ', '', $this->input('iban'))),
            ]);
        }

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
