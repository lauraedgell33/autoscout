<?php

namespace App\Filament\Admin\Resources\Dealers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DealerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Company Information
                Section::make('Company Information')
                    ->icon('heroicon-o-building-office')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('name')
                                ->label('Contact Name')
                                ->required()
                                ->maxLength(255)
                                ->placeholder('John Doe'),
                            TextInput::make('company_name')
                                ->label('Company Name')
                                ->required()
                                ->maxLength(255)
                                ->placeholder('Auto GmbH'),
                            TextInput::make('email')
                                ->label('Email')
                                ->email()
                                ->required()
                                ->maxLength(255)
                                ->placeholder('contact@dealer.com'),
                            TextInput::make('phone')
                                ->tel()
                                ->required()
                                ->maxLength(50)
                                ->placeholder('+49 123 456789'),
                        ]),
                        Grid::make(4)->schema([
                            TextInput::make('website')
                                ->url()
                                ->maxLength(255)
                                ->placeholder('https://www.dealer.com'),
                            TextInput::make('vat_number')
                                ->label('VAT Number')
                                ->required()
                                ->maxLength(50)
                                ->placeholder('DE123456789'),
                            TextInput::make('registration_number')
                                ->label('Registration No.')
                                ->required()
                                ->maxLength(50),
                            Select::make('type')
                                ->label('Dealer Type')
                                ->required()
                                ->options([
                                    'independent' => '🏢 Independent',
                                    'franchise' => '🏪 Franchise',
                                    'brand' => '🏆 Brand Dealer',
                                ])
                                ->default('independent')
                                ->native(false),
                        ]),
                    ])
                    ->columnSpanFull(),

                // Address
                Section::make('Address')
                    ->icon('heroicon-o-map-pin')
                    ->schema([
                        Grid::make(4)->schema([
                            Textarea::make('address')
                                ->label('Street Address')
                                ->required()
                                ->rows(1)
                                ->maxLength(500)
                                ->placeholder('Hauptstraße 123'),
                            TextInput::make('city')
                                ->required()
                                ->maxLength(100)
                                ->placeholder('Berlin'),
                            TextInput::make('postal_code')
                                ->label('Postal Code')
                                ->required()
                                ->maxLength(20)
                                ->placeholder('10115'),
                            Select::make('country')
                                ->required()
                                ->searchable()
                                ->options([
                                    'DE' => '🇩🇪 Germany',
                                    'AT' => '🇦🇹 Austria',
                                    'CH' => '🇨🇭 Switzerland',
                                    'FR' => '🇫🇷 France',
                                    'IT' => '🇮🇹 Italy',
                                    'ES' => '🇪🇸 Spain',
                                    'NL' => '🇳🇱 Netherlands',
                                    'BE' => '🇧🇪 Belgium',
                                    'PL' => '🇵🇱 Poland',
                                    'CZ' => '🇨🇿 Czech Republic',
                                    'RO' => '🇷🇴 Romania',
                                    'GB' => '🇬🇧 United Kingdom',
                                ])
                                ->default('DE')
                                ->native(false),
                        ]),
                    ])
                    ->columnSpanFull(),

                // Bank Details
                Section::make('Bank Details')
                    ->icon('heroicon-o-building-library')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('bank_account_holder')
                                ->label('Account Holder')
                                ->maxLength(255)
                                ->placeholder('Auto GmbH'),
                            TextInput::make('bank_name')
                                ->label('Bank Name')
                                ->maxLength(255)
                                ->placeholder('Deutsche Bank'),
                            TextInput::make('bank_iban')
                                ->label('IBAN')
                                ->maxLength(50)
                                ->placeholder('DE89 3704 0044 0532 0130 00'),
                            TextInput::make('bank_swift')
                                ->label('SWIFT/BIC')
                                ->maxLength(20)
                                ->placeholder('COBADEFFXXX'),
                        ]),
                    ])
                    ->columnSpanFull()
                    ->collapsible(),

                // Status & Settings
                Section::make('Status & Settings')
                    ->icon('heroicon-o-cog-6-tooth')
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('status')
                                ->required()
                                ->options([
                                    'pending' => '⏳ Pending',
                                    'active' => '✅ Active',
                                    'suspended' => '⚠️ Suspended',
                                    'inactive' => '❌ Inactive',
                                ])
                                ->default('pending')
                                ->native(false),
                            TextInput::make('max_active_listings')
                                ->label('Max Listings')
                                ->required()
                                ->numeric()
                                ->default(50),
                            Toggle::make('is_verified')
                                ->label('Verified Dealer')
                                ->onColor('success')
                                ->default(false),
                            DateTimePicker::make('verified_at')
                                ->label('Verified At')
                                ->disabled(),
                        ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
