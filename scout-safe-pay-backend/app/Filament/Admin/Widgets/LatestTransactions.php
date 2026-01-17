<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Transaction;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestTransactions extends BaseWidget
{
    protected static ?int $sort = 3;
    
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Transaction::query()
                    ->latest()
                    ->limit(10)
            )
            ->columns([
                Tables\Columns\TextColumn::make('transaction_code')
                    ->label('Transaction Code')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('buyer.name')
                    ->label('Buyer')
                    ->searchable(),
                Tables\Columns\TextColumn::make('seller.name')
                    ->label('Seller')
                    ->searchable(),
                Tables\Columns\TextColumn::make('amount')
                    ->money('EUR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'payment_pending',
                        'primary' => 'payment_verified',
                        'success' => 'completed',
                        'danger' => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ]);
    }
}
