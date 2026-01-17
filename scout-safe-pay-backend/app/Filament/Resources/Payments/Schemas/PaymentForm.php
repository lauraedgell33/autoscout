<?php

namespace App\Filament\Resources\Payments\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PaymentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('transaction_id')
                    ->required()
                    ->numeric(),
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('amount')
                    ->required()
                    ->numeric(),
                TextInput::make('currency')
                    ->required()
                    ->default('EUR'),
                TextInput::make('type')
                    ->required()
                    ->default('deposit'),
                TextInput::make('bank_transfer_reference'),
                TextInput::make('payment_proof_url')
                    ->url(),
                Textarea::make('bank_transaction_details')
                    ->columnSpanFull(),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                TextInput::make('verified_by_admin_id')
                    ->numeric(),
                DateTimePicker::make('verified_at'),
                Textarea::make('admin_notes')
                    ->columnSpanFull(),
                TextInput::make('rejection_reason'),
                DateTimePicker::make('processed_at'),
                DateTimePicker::make('completed_at'),
                Textarea::make('metadata')
                    ->columnSpanFull(),
            ]);
    }
}
