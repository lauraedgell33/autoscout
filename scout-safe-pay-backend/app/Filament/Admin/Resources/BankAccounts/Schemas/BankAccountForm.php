<?php

namespace App\Filament\Admin\Resources\BankAccounts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class BankAccountForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('accountable_type')
                    ->required(),
                TextInput::make('accountable_id')
                    ->required()
                    ->numeric(),
                TextInput::make('account_holder_name')
                    ->required(),
                Textarea::make('iban')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('swift_bic'),
                TextInput::make('bank_name')
                    ->required(),
                TextInput::make('bank_country')
                    ->required()
                    ->default('DE'),
                TextInput::make('currency')
                    ->required()
                    ->default('EUR'),
                Toggle::make('is_verified')
                    ->required(),
                Toggle::make('is_primary')
                    ->required(),
                TextInput::make('verified_by')
                    ->numeric(),
                DateTimePicker::make('verified_at'),
                Textarea::make('verification_notes')
                    ->columnSpanFull(),
                TextInput::make('bank_statement_url')
                    ->url(),
            ]);
    }
}
