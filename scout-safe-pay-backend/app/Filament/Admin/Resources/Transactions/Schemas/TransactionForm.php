<?php

namespace App\Filament\Admin\Resources\Transactions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TransactionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Transaction Details Section
                Section::make('Transaction Details')
                    ->icon('heroicon-o-document-text')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('transaction_code')
                                ->label('Transaction Code')
                                ->required()
                                ->disabled()
                                ->dehydrated(),
                            Select::make('status')
                                ->options([
                                    'pending' => '⏳ Pending',
                                    'payment_pending' => '💳 Payment Pending',
                                    'payment_uploaded' => '📄 Payment Uploaded',
                                    'payment_verified' => '✅ Payment Verified',
                                    'contract_pending' => '📝 Contract Pending',
                                    'contract_signed' => '✍️ Contract Signed',
                                    'in_delivery' => '🚚 In Delivery',
                                    'delivered' => '📦 Delivered',
                                    'completed' => '✅ Completed',
                                    'cancelled' => '❌ Cancelled',
                                    'refunded' => '💰 Refunded',
                                    'disputed' => '⚠️ Disputed',
                                ])
                                ->required()
                                ->native(false),
                            Select::make('vehicle_id')
                                ->relationship('vehicle', 'id')
                                ->label('Vehicle')
                                ->searchable()
                                ->preload()
                                ->required(),
                        ]),
                        Textarea::make('notes')
                            ->label('Admin Notes')
                            ->rows(2),
                    ])
                    ->columnSpanFull(),
                        
                // Parties Involved Section
                Section::make('Parties Involved')
                    ->icon('heroicon-o-users')
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('buyer_id')
                                ->relationship('buyer', 'name')
                                ->label('Buyer')
                                ->searchable()
                                ->preload()
                                ->required(),
                            Select::make('seller_id')
                                ->relationship('seller', 'name')
                                ->label('Seller')
                                ->searchable()
                                ->preload()
                                ->required(),
                            Select::make('dealer_id')
                                ->relationship('dealer', 'name')
                                ->label('Dealer (Optional)')
                                ->searchable()
                                ->preload(),
                        ]),
                    ])
                    ->columnSpanFull(),
                        
                // Financial Details Section
                Section::make('Financial Details')
                    ->icon('heroicon-o-currency-euro')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('amount')
                                ->label('Amount')
                                ->required()
                                ->numeric()
                                ->prefix('€'),
                            Select::make('currency')
                                ->options([
                                    'EUR' => '🇪🇺 EUR - Euro',
                                    'USD' => '🇺🇸 USD - US Dollar',
                                    'GBP' => '🇬🇧 GBP - British Pound',
                                    'CHF' => '🇨🇭 CHF - Swiss Franc',
                                    'RON' => '🇷🇴 RON - Romanian Leu',
                                    'PLN' => '🇵🇱 PLN - Polish Zloty',
                                ])
                                ->required()
                                ->default('EUR')
                                ->native(false),
                            TextInput::make('service_fee')
                                ->label('Service Fee')
                                ->numeric()
                                ->prefix('€')
                                ->default(0),
                            TextInput::make('dealer_commission')
                                ->label('Dealer Commission')
                                ->numeric()
                                ->prefix('€')
                                ->default(0),
                        ]),
                    ])
                    ->columnSpanFull(),
                
                // Payment Information Section
                Section::make('Payment Information')
                    ->icon('heroicon-o-credit-card')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('escrow_account_iban')
                                ->label('Escrow IBAN')
                                ->required(),
                            TextInput::make('escrow_account_country')
                                ->label('Escrow Country')
                                ->default('DE'),
                            TextInput::make('payment_reference')
                                ->label('Payment Reference')
                                ->required(),
                            DateTimePicker::make('payment_deadline')
                                ->label('Payment Deadline'),
                        ]),
                        Grid::make(4)->schema([
                            TextInput::make('payment_proof_url')
                                ->label('Payment Proof URL')
                                ->url(),
                            DateTimePicker::make('payment_verified_at')
                                ->label('Payment Verified At'),
                        ]),
                        Textarea::make('verification_notes')
                            ->label('Verification Notes')
                            ->rows(2),
                    ])
                    ->columnSpanFull()
                    ->collapsible(),
                        
                // Contract & Delivery Section
                Section::make('Contract & Delivery')
                    ->icon('heroicon-o-document-check')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('contract_url')
                                ->label('Contract URL')
                                ->url(),
                            TextInput::make('signed_contract_url')
                                ->label('Signed Contract URL')
                                ->url(),
                            DateTimePicker::make('contract_signed_at')
                                ->label('Contract Signed At'),
                            TextInput::make('signature_type')
                                ->label('Signature Type'),
                        ]),
                        Grid::make(4)->schema([
                            DateTimePicker::make('delivery_date')
                                ->label('Scheduled Delivery'),
                            TextInput::make('delivery_contact')
                                ->label('Delivery Contact'),
                            DateTimePicker::make('delivered_at')
                                ->label('Delivered At'),
                        ]),
                        Textarea::make('delivery_address')
                            ->label('Delivery Address')
                            ->rows(2),
                    ])
                    ->columnSpanFull()
                    ->collapsible(),
                
                // Seller Bank Details Section
                Section::make('Seller Bank Details')
                    ->icon('heroicon-o-building-library')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('bank_account_iban')
                                ->label('Seller IBAN'),
                            TextInput::make('bank_account_holder')
                                ->label('Account Holder'),
                            TextInput::make('bank_name')
                                ->label('Bank Name'),
                        ]),
                    ])
                    ->columnSpanFull()
                    ->collapsible()
                    ->collapsed(),
                        
                // Invoice Details Section
                Section::make('Invoice Details')
                    ->icon('heroicon-o-document-currency-euro')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('invoice_number')
                                ->label('Invoice Number'),
                            TextInput::make('invoice_url')
                                ->label('Invoice URL')
                                ->url(),
                            DateTimePicker::make('invoice_issued_at')
                                ->label('Invoice Issued At'),
                        ]),
                    ])
                    ->columnSpanFull()
                    ->collapsible()
                    ->collapsed(),
                
                // Transaction Timeline Section
                Section::make('Transaction Timeline')
                    ->icon('heroicon-o-clock')
                    ->schema([
                        Grid::make(4)->schema([
                            DateTimePicker::make('created_at')
                                ->label('Created')
                                ->disabled(),
                            DateTimePicker::make('payment_confirmed_at')
                                ->label('Payment Confirmed'),
                            DateTimePicker::make('completed_at')
                                ->label('Completed'),
                            DateTimePicker::make('cancelled_at')
                                ->label('Cancelled'),
                        ]),
                    ])
                    ->columnSpanFull()
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}
