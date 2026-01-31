<?php

namespace App\Filament\Admin\Resources\Transactions\Tables;

use Filament\Forms;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Builder;
use Malzariey\FilamentDaterangepickerFilter\Filters\DateRangeFilter;

class TransactionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('transaction_code')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->copyable(),
                TextColumn::make('buyer.name')
                    ->searchable()
                    ->sortable()
                    ->label('Buyer'),
                TextColumn::make('seller.name')
                    ->searchable()
                    ->sortable()
                    ->label('Seller'),
                TextColumn::make('vehicle.make')
                    ->label('Vehicle')
                    ->searchable(),
                TextColumn::make('amount')
                    ->money('EUR')
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'gray',
                        'payment_pending' => 'warning',
                        'payment_verified' => 'info',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                DateRangeFilter::make('created_at')
                    ->label('Created Date')
                    ->placeholder('Select date range')
                    ->displayFormat('DD/MM/YYYY')
                    ->firstDayOfWeek(1)
                    ->ranges([
                        'Today' => [now(), now()],
                        'Yesterday' => [now()->subDay(), now()->subDay()],
                        'Last 7 Days' => [now()->subDays(6), now()],
                        'Last 30 Days' => [now()->subDays(29), now()],
                        'This Month' => [now()->startOfMonth(), now()->endOfMonth()],
                        'Last Month' => [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()],
                        'This Year' => [now()->startOfYear(), now()->endOfYear()],
                    ]),
                    
                Filter::make('amount_range')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('amount_from')
                            ->numeric()
                            ->prefix('€')
                            ->placeholder('Min amount'),
                        \Filament\Forms\Components\TextInput::make('amount_to')
                            ->numeric()
                            ->prefix('€')
                            ->placeholder('Max amount'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['amount_from'],
                                fn (Builder $query, $amount): Builder => $query->where('amount', '>=', $amount),
                            )
                            ->when(
                                $data['amount_to'],
                                fn (Builder $query, $amount): Builder => $query->where('amount', '<=', $amount),
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['amount_from'] ?? null) {
                            $indicators[] = 'Min: €' . number_format($data['amount_from'], 2);
                        }
                        if ($data['amount_to'] ?? null) {
                            $indicators[] = 'Max: €' . number_format($data['amount_to'], 2);
                        }
                        return $indicators;
                    }),
                    
                SelectFilter::make('status')->options([
                    'pending' => 'Pending',
                    'payment_pending' => 'Payment Pending',
                    'payment_verified' => 'Payment Verified',
                    'completed' => 'Completed',
                    'cancelled' => 'Cancelled',
                ]),
                TrashedFilter::make(),
            ])
            ->actions([
                Action::make('verify_payment')
                    ->label('Verify Payment')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => $record->status === 'payment_pending')
                    ->requiresConfirmation()
                    ->modalHeading('Verify Bank Transfer Payment')
                    ->modalDescription('Confirm that you have received the bank transfer from the buyer.')
                    ->action(function ($record) {
                        $record->update(['status' => 'payment_verified']);
                        
                        Notification::make()
                            ->title('Payment Verified')
                            ->success()
                            ->send();
                    }),
                    
                Action::make('release_funds')
                    ->label('Release to Seller')
                    ->icon('heroicon-o-banknotes')
                    ->color('primary')
                    ->visible(fn ($record) => $record->status === 'payment_verified')
                    ->requiresConfirmation()
                    ->modalHeading('Release Funds to Seller')
                    ->modalDescription('Transfer the escrow funds to the seller. This action cannot be undone.')
                    ->action(function ($record) {
                        $record->update([
                            'status' => 'completed',
                            'completed_at' => now(),
                        ]);
                        
                        Notification::make()
                            ->title('Funds Released')
                            ->body('Funds have been released to the seller.')
                            ->success()
                            ->send();
                    }),
                    
                Action::make('refund')
                    ->label('Refund Buyer')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->color('warning')
                    ->visible(fn ($record) => in_array($record->status, ['payment_verified', 'payment_pending']))
                    ->requiresConfirmation()
                    ->modalHeading('Refund Buyer')
                    ->modalDescription('Return the escrow funds to the buyer. This will cancel the transaction.')
                    ->form([
                        \Filament\Forms\Components\Textarea::make('refund_reason')
                            ->label('Refund Reason')
                            ->required()
                            ->placeholder('Enter the reason for refund...'),
                    ])
                    ->action(function ($record, array $data) {
                        $record->update([
                            'status' => 'cancelled',
                            'notes' => 'Refund: ' . $data['refund_reason'],
                        ]);
                        
                        Notification::make()
                            ->title('Refund Processed')
                            ->body('Transaction cancelled and buyer refunded.')
                            ->success()
                            ->send();
                    }),
                    
                Action::make('view_invoice')
                    ->label('View Invoice')
                    ->icon('heroicon-o-document-text')
                    ->color('gray')
                    ->url(fn ($record) => route('filament.admin.resources.invoices.view', $record->invoice_id)),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
