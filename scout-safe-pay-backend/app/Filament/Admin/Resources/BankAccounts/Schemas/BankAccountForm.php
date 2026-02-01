<?php

namespace App\Filament\Admin\Resources\BankAccounts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BankAccountForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Account Information Section
                Section::make('Account Information')
                    ->icon('heroicon-o-credit-card')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('account_holder_name')
                                ->label('Account Holder Name')
                                ->required()
                                ->placeholder('John Doe'),
                            TextInput::make('iban')
                                ->label('IBAN')
                                ->required()
                                ->placeholder('DE89 3704 0044 0532 0130 00')
                                ->mask('AA99 9999 9999 9999 9999 99'),
                            TextInput::make('swift_bic')
                                ->label('SWIFT/BIC Code')
                                ->placeholder('COBADEFFXXX'),
                            TextInput::make('bank_name')
                                ->label('Bank Name')
                                ->required()
                                ->placeholder('Deutsche Bank'),
                        ]),
                    ])
                    ->columnSpanFull(),
                        
                // Bank Location & Currency Section
                Section::make('Bank Location & Currency')
                    ->icon('heroicon-o-building-library')
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('bank_country')
                                ->label('Bank Country')
                                ->options([
                                    'DE' => '🇩🇪 Germany',
                                    'AT' => '🇦🇹 Austria',
                                    'CH' => '🇨🇭 Switzerland',
                                    'NL' => '🇳🇱 Netherlands',
                                    'BE' => '🇧🇪 Belgium',
                                    'FR' => '🇫🇷 France',
                                    'IT' => '🇮🇹 Italy',
                                    'ES' => '🇪🇸 Spain',
                                    'PL' => '🇵🇱 Poland',
                                    'RO' => '🇷🇴 Romania',
                                    'GB' => '🇬🇧 United Kingdom',
                                    'US' => '🇺🇸 United States',
                                ])
                                ->required()
                                ->default('DE')
                                ->searchable()
                                ->native(false),
                            Select::make('currency')
                                ->label('Currency')
                                ->options([
                                    'EUR' => '🇪🇺 EUR - Euro',
                                    'USD' => '🇺🇸 USD - US Dollar',
                                    'GBP' => '🇬🇧 GBP - British Pound',
                                    'CHF' => '🇨🇭 CHF - Swiss Franc',
                                    'RON' => '🇷🇴 RON - Romanian Leu',
                                    'PLN' => '🇵🇱 PLN - Polish Zloty',
                                    'CZK' => '🇨🇿 CZK - Czech Koruna',
                                    'HUF' => '🇭🇺 HUF - Hungarian Forint',
                                ])
                                ->required()
                                ->default('EUR')
                                ->native(false),
                        ]),
                    ])
                    ->columnSpanFull(),
                
                // Account Owner & Status Section
                Section::make('Account Owner & Status')
                    ->icon('heroicon-o-user')
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('accountable_type')
                                ->label('Owner Type')
                                ->options([
                                    'App\\Models\\User' => '👤 User',
                                    'App\\Models\\Company' => '🏢 Company',
                                ])
                                ->required()
                                ->native(false),
                            TextInput::make('accountable_id')
                                ->label('Owner ID')
                                ->required()
                                ->numeric(),
                            Toggle::make('is_verified')
                                ->label('Verified Account')
                                ->helperText('Mark this account as verified')
                                ->onColor('success')
                                ->offColor('danger'),
                            Toggle::make('is_primary')
                                ->label('Primary Account')
                                ->helperText('Set as primary bank account')
                                ->onColor('warning'),
                        ]),
                    ])
                    ->columnSpanFull(),
                
                // Verification Details Section
                Section::make('Verification Details')
                    ->icon('heroicon-o-clipboard-document-check')
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('verified_by')
                                ->label('Verified By')
                                ->relationship('verifier', 'name')
                                ->searchable()
                                ->preload(),
                            DateTimePicker::make('verified_at')
                                ->label('Verified At'),
                            TextInput::make('bank_statement_url')
                                ->label('Bank Statement URL')
                                ->url()
                                ->placeholder('https://...'),
                        ]),
                        Textarea::make('verification_notes')
                            ->label('Verification Notes')
                            ->rows(2)
                            ->placeholder('Add any notes about the verification process...'),
                    ])
                    ->columnSpanFull()
                    ->collapsible(),
            ]);
    }
}
