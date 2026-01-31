<?php

namespace App\Filament\Admin\Resources\Users\RelationManagers;
use Filament\Actions\ViewAction;

use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class TransactionsRelationManager extends RelationManager
{
    protected static string $relationship = 'buyerTransactions';

    protected static ?string $title = 'Transactions (as Buyer)';

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
                Tables\Columns\TextColumn::make('vehicle.make')
                    ->label('Vehicle')
                    ->formatStateUsing(fn ($record) => $record->vehicle ? "{$record->vehicle->make} {$record->vehicle->model}" : 'N/A'),
                Tables\Columns\TextColumn::make('seller.name')
                    ->label('Seller')
                    ->searchable(),
                Tables\Columns\TextColumn::make('amount')
                    ->money('EUR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
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
            ->headerActions([])
            ->actions([
                ViewAction::make()
                    ->url(fn ($record) => route('filament.admin.resources.transactions.edit', $record)),
            ])
            ->bulkActions([]);
    }
}
