<?php

namespace App\Filament\Resources\Transactions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class TransactionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('transaction_code')
                    ->required(),
                Select::make('buyer_id')
                    ->relationship('buyer', 'name')
                    ->required(),
                Select::make('seller_id')
                    ->relationship('seller', 'name')
                    ->required(),
                Select::make('dealer_id')
                    ->relationship('dealer', 'name'),
                Select::make('vehicle_id')
                    ->relationship('vehicle', 'id')
                    ->required(),
                TextInput::make('amount')
                    ->required()
                    ->numeric(),
                TextInput::make('currency')
                    ->required()
                    ->default('EUR'),
                TextInput::make('service_fee')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('dealer_commission')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('escrow_account_iban')
                    ->required(),
                TextInput::make('escrow_account_country')
                    ->required()
                    ->default('DE'),
                TextInput::make('payment_reference')
                    ->required(),
                TextInput::make('payment_proof_url')
                    ->url(),
                TextInput::make('payment_proof_type'),
                DateTimePicker::make('payment_proof_uploaded_at'),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                TextInput::make('payment_verified_by')
                    ->numeric(),
                DateTimePicker::make('payment_verified_at'),
                Textarea::make('verification_notes')
                    ->columnSpanFull(),
                DateTimePicker::make('payment_confirmed_at'),
                DateTimePicker::make('inspection_date'),
                DateTimePicker::make('ownership_transfer_date'),
                DateTimePicker::make('completed_at'),
                DateTimePicker::make('cancelled_at'),
                Textarea::make('metadata')
                    ->columnSpanFull(),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
