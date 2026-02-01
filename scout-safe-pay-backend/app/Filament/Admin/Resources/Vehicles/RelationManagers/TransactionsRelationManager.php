<?php

namespace App\Filament\Admin\Resources\Vehicles\RelationManagers;
use Filament\Actions\ViewAction;

use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class TransactionsRelationManager extends RelationManager
{
    protected static string $relationship = 'transactions';

    protected static ?string $recordTitleAttribute = 'transaction_code';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('transaction_code')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('transaction_code')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('buyer.name')
                    ->label('Buyer')
                    ->searchable(),
                Tables\Columns\TextColumn::make('amount')
                    ->money('EUR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => '⏳ Pending',
                        'pending_payment' => '💳 Payment Pending',
                        'payment_verified' => '✅ Payment Verified',
                        'completed' => '✅ Completed',
                        'cancelled' => '❌ Cancelled',
                        'refunded' => '💰 Refunded',
                        'dispute' => '⚠️ Disputed',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'payment_verified' => 'success',
                        'pending', 'pending_payment' => 'warning',
                        'cancelled', 'refunded' => 'danger',
                        'dispute' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'payment_received' => 'Payment Received',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                        'dispute' => 'Disputed',
                    ]),
            ])
            ->headerActions([
                // No create action - transactions should be created through the flow
            ])
            ->actions([
                ViewAction::make()
                    ->url(fn ($record) => route('filament.admin.resources.transactions.edit', $record)),
            ])
            ->bulkActions([]);
    }
}
