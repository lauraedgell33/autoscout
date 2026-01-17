<?php

namespace App\Filament\Admin\Resources\Payments\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class PaymentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('transaction_id')->label('Transaction')->relationship('transaction', 'transaction_code')->required()->searchable(),
            TextInput::make('amount')->required()->numeric()->prefix('€'),
            Select::make('currency')->required()->options(['EUR' => 'EUR', 'USD' => 'USD', 'GBP' => 'GBP'])->default('EUR'),
            Select::make('payment_method')->options([
                'bank_transfer' => 'Bank Transfer',
                'credit_card' => 'Credit Card',
                'paypal' => 'PayPal',
                'stripe' => 'Stripe',
            ])->default('bank_transfer'),
            TextInput::make('payment_reference')->maxLength(100),
            TextInput::make('bank_account_iban')->label('IBAN')->maxLength(50),
            TextInput::make('bank_account_bic')->label('BIC/SWIFT')->maxLength(20),
            TextInput::make('bank_account_holder')->maxLength(255),
            Select::make('status')->required()->options([
                'pending' => 'Pending',
                'verified' => 'Verified',
                'rejected' => 'Rejected',
                'paid' => 'Paid',
            ])->default('pending'),
            Select::make('verified_by')->label('Verified By')->relationship('verifiedBy', 'name')->searchable(),
            DateTimePicker::make('verified_at')->disabled(),
            DateTimePicker::make('paid_at')->disabled(),
            Textarea::make('verification_notes')->rows(2)->columnSpanFull(),
            Textarea::make('rejection_reason')->rows(2)->columnSpanFull(),
        ]);
    }
}
