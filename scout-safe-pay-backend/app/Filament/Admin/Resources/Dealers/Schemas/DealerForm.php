<?php

namespace App\Filament\Admin\Resources\Dealers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Forms;
use Filament\Schemas\Schema;

class DealerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('company_name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required()
                    ->maxLength(255),
                TextInput::make('phone')
                    ->tel()
                    ->required()
                    ->maxLength(50),
                TextInput::make('website')
                    ->url()
                    ->maxLength(255),
                TextInput::make('vat_number')
                    ->label('VAT Number')
                    ->required()
                    ->maxLength(50),
                TextInput::make('registration_number')
                    ->required()
                    ->maxLength(50),
                Select::make('type')
                    ->required()
                    ->options([
                        'independent' => 'Independent',
                        'franchise' => 'Franchise',
                        'brand' => 'Brand Dealer',
                    ])
                    ->default('independent'),
                Textarea::make('address')
                    ->required()
                    ->rows(2)
                    ->maxLength(500)
                    ->columnSpanFull(),
                TextInput::make('city')
                    ->required()
                    ->maxLength(100),
                TextInput::make('postal_code')
                    ->required()
                    ->maxLength(20),
                Select::make('country')
                    ->required()
                    ->searchable()
                    ->options([
                        'DE' => 'Germany',
                        'AT' => 'Austria',
                        'CH' => 'Switzerland',
                        'FR' => 'France',
                        'IT' => 'Italy',
                        'ES' => 'Spain',
                        'NL' => 'Netherlands',
                        'BE' => 'Belgium',
                        'PL' => 'Poland',
                        'CZ' => 'Czech Republic',
                    ])
                    ->default('DE'),
                TextInput::make('bank_account_holder')
                    ->maxLength(255),
                TextInput::make('bank_name')
                    ->maxLength(255),
                TextInput::make('bank_iban')
                    ->label('IBAN')
                    ->maxLength(50),
                TextInput::make('bank_swift')
                    ->label('SWIFT/BIC')
                    ->maxLength(20),
                Select::make('status')
                    ->required()
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'suspended' => 'Suspended',
                        'inactive' => 'Inactive',
                    ])
                    ->default('pending'),
                TextInput::make('max_active_listings')
                    ->required()
                    ->numeric()
                    ->default(50),
                Toggle::make('is_verified')
                    ->label('Verified')
                    ->default(false),
                DateTimePicker::make('verified_at')
                    ->label('Verified At')
                    ->disabled(),
            ]);
    }
}
