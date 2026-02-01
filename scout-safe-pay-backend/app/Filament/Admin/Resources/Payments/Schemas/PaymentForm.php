<?php

namespace App\Filament\Admin\Resources\Payments\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PaymentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            // Payment Details Section
            Section::make('Payment Details')
                ->icon('heroicon-o-credit-card')
                ->schema([
                    Grid::make(4)->schema([
                        Select::make('transaction_id')
                            ->label('Transaction')
                            ->relationship('transaction', 'transaction_code')
                            ->required()
                            ->searchable()
                            ->preload(),
                        TextInput::make('amount')
                            ->required()
                            ->numeric()
                            ->prefix('€'),
                        Select::make('currency')
                            ->required()
                            ->options([
                                'EUR' => '🇪🇺 EUR',
                                'USD' => '🇺🇸 USD',
                                'GBP' => '🇬🇧 GBP',
                                'CHF' => '🇨🇭 CHF',
                            ])
                            ->default('EUR')
                            ->native(false),
                        Select::make('payment_method')
                            ->label('Payment Method')
                            ->options([
                                'bank_transfer' => '🏦 Bank Transfer',
                                'credit_card' => '💳 Credit Card',
                                'paypal' => '💰 PayPal',
                                'stripe' => '💎 Stripe',
                            ])
                            ->default('bank_transfer')
                            ->native(false),
                    ]),
                    Grid::make(4)->schema([
                        TextInput::make('payment_reference')
                            ->label('Payment Reference')
                            ->maxLength(100),
                    ]),
                ])
                ->columnSpanFull(),

            // Bank Account Section
            Section::make('Bank Account')
                ->icon('heroicon-o-building-library')
                ->schema([
                    Grid::make(4)->schema([
                        TextInput::make('bank_account_iban')
                            ->label('IBAN')
                            ->maxLength(50)
                            ->placeholder('DE89 3704 0044 0532 0130 00'),
                        TextInput::make('bank_account_bic')
                            ->label('BIC/SWIFT')
                            ->maxLength(20)
                            ->placeholder('COBADEFFXXX'),
                        TextInput::make('bank_account_holder')
                            ->label('Account Holder')
                            ->maxLength(255),
                    ]),
                ])
                ->columnSpanFull()
                ->collapsible(),

            // Status Section
            Section::make('Status')
                ->icon('heroicon-o-check-badge')
                ->schema([
                    Grid::make(4)->schema([
                        Select::make('status')
                            ->required()
                            ->options([
                                'pending' => '⏳ Pending',
                                'verified' => '✅ Verified',
                                'rejected' => '❌ Rejected',
                                'paid' => '💰 Paid',
                            ])
                            ->default('pending')
                            ->native(false),
                        Select::make('verified_by')
                            ->label('Verified By')
                            ->relationship('verifiedBy', 'name')
                            ->searchable()
                            ->preload(),
                        DateTimePicker::make('verified_at')
                            ->disabled(),
                        DateTimePicker::make('paid_at')
                            ->disabled(),
                    ]),
                ])
                ->columnSpanFull(),

            // Notes Section
            Section::make('Notes')
                ->icon('heroicon-o-document-text')
                ->schema([
                    Grid::make(2)->schema([
                        Textarea::make('verification_notes')
                            ->label('Verification Notes')
                            ->rows(2),
                        Textarea::make('rejection_reason')
                            ->label('Rejection Reason')
                            ->rows(2),
                    ]),
                ])
                ->columnSpanFull()
                ->collapsible(),
        ]);
    }
}
