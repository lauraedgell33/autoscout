<?php

namespace App\Filament\Admin\Resources\Transactions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class TransactionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('transaction_code')->required()->unique(ignoreRecord: true)->maxLength(50),
            Select::make('buyer_id')->label('Buyer')->relationship('buyer', 'name')->required()->searchable(),
            Select::make('seller_id')->label('Seller')->relationship('seller', 'name')->required()->searchable(),
            Select::make('dealer_id')->label('Dealer')->relationship('dealer', 'name')->searchable(),
            TextInput::make('amount')->required()->numeric()->prefix('€'),
            Select::make('currency')->required()->options(['EUR' => 'EUR', 'USD' => 'USD', 'GBP' => 'GBP'])->default('EUR'),
            TextInput::make('service_fee')->numeric()->prefix('€'),
            TextInput::make('dealer_commission')->numeric()->prefix('€'),
            TextInput::make('payment_reference')->maxLength(100),
            Select::make('status')->required()->options([
                'pending' => 'Pending',
                'payment_pending' => 'Payment Pending',
                'payment_verified' => 'Payment Verified',
                'inspection_scheduled' => 'Inspection Scheduled',
                'completed' => 'Completed',
                'cancelled' => 'Cancelled',
            ])->default('pending'),
            DateTimePicker::make('inspection_date'),
            DateTimePicker::make('ownership_transfer_date'),
            DateTimePicker::make('completed_at')->disabled(),
            Textarea::make('notes')->rows(3)->columnSpanFull(),
            Textarea::make('verification_notes')->rows(3)->columnSpanFull(),
        ]);
    }
}
