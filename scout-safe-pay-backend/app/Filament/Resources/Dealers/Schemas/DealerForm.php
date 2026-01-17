<?php

namespace App\Filament\Resources\Dealers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class DealerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('company_name')
                    ->required(),
                TextInput::make('vat_number')
                    ->required(),
                TextInput::make('registration_number')
                    ->required(),
                Textarea::make('address')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('city')
                    ->required(),
                TextInput::make('postal_code')
                    ->required(),
                TextInput::make('country')
                    ->required()
                    ->default('DE'),
                TextInput::make('phone')
                    ->tel()
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('website')
                    ->url(),
                TextInput::make('type')
                    ->required()
                    ->default('independent'),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                TextInput::make('max_active_listings')
                    ->required()
                    ->numeric()
                    ->default(50),
                Textarea::make('bank_account_holder')
                    ->columnSpanFull(),
                Textarea::make('bank_iban')
                    ->columnSpanFull(),
                Textarea::make('bank_swift')
                    ->columnSpanFull(),
                Textarea::make('bank_name')
                    ->columnSpanFull(),
                Toggle::make('is_verified')
                    ->required(),
                DateTimePicker::make('verified_at'),
                TextInput::make('verified_by')
                    ->numeric(),
                TextInput::make('business_license_url')
                    ->url(),
                TextInput::make('tax_certificate_url')
                    ->url(),
                TextInput::make('logo_url')
                    ->url(),
                TextInput::make('autoscout_dealer_id'),
                Textarea::make('autoscout_settings')
                    ->columnSpanFull(),
            ]);
    }
}
