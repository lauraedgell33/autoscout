<?php

namespace App\Filament\Admin\Resources\Transactions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class TransactionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                // Primary Info
                TextColumn::make('transaction_code')
                    ->label('Code')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold')
                    ->color('primary'),
                    
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'payment_pending' => 'warning',
                        'payment_uploaded' => 'info',
                        'payment_verified' => 'success',
                        'contract_pending' => 'info',
                        'contract_signed' => 'success',
                        'in_delivery' => 'info',
                        'delivered' => 'success',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        'refunded' => 'danger',
                        'disputed' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                    
                // Parties
                TextColumn::make('buyer.name')
                    ->label('Buyer')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                    
                TextColumn::make('seller.name')
                    ->label('Seller')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                    
                TextColumn::make('dealer.name')
                    ->label('Dealer')
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                // Financial
                TextColumn::make('amount')
                    ->money(fn ($record) => $record->currency ?? 'EUR')
                    ->sortable()
                    ->weight('bold'),
                    
                TextColumn::make('service_fee')
                    ->money(fn ($record) => $record->currency ?? 'EUR')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                // Payment
                TextColumn::make('payment_reference')
                    ->label('Payment Ref')
                    ->searchable()
                    ->copyable()
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                TextColumn::make('payment_deadline')
                    ->label('Deadline')
                    ->date()
                    ->sortable()
                    ->color(fn ($record) => $record->payment_deadline && $record->payment_deadline < now() && $record->status === 'payment_pending' ? 'danger' : null),
                    
                // Contract
                TextColumn::make('contract_signed_at')
                    ->label('Contract Signed')
                    ->date()
                    ->sortable()
                    ->placeholder('Not signed')
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                // Dates
                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M j, Y H:i')
                    ->sortable()
                    ->toggleable(),
                    
                TextColumn::make('completed_at')
                    ->label('Completed')
                    ->dateTime('M j, Y')
                    ->sortable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'payment_pending' => 'Payment Pending',
                        'payment_uploaded' => 'Payment Uploaded',
                        'payment_verified' => 'Payment Verified',
                        'contract_pending' => 'Contract Pending',
                        'contract_signed' => 'Contract Signed',
                        'in_delivery' => 'In Delivery',
                        'delivered' => 'Delivered',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                        'refunded' => 'Refunded',
                        'disputed' => 'Disputed',
                    ])
                    ->multiple(),
                TrashedFilter::make(),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ])
            ->striped()
            ->paginated([10, 25, 50, 100]);
    }
}
