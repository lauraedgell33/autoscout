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
                        'awaiting_payment' => 'warning',
                        'payment_pending' => 'warning',
                        'payment_submitted' => 'info',
                        'payment_received' => 'info',
                        'payment_verified' => 'success',
                        'inspection_scheduled' => 'info',
                        'inspection_passed' => 'success',
                        'inspection_failed' => 'danger',
                        'ownership_transferred' => 'success',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        'disputed' => 'danger',
                        'refunded' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucwords(str_replace('_', ' ', $state))),
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
                // Approve pending transaction - mark as awaiting payment
                Action::make('approve_transaction')
                    ->label('Approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->modalHeading('Approve Transaction')
                    ->modalDescription('Approve this transaction and notify buyer to make payment.')
                    ->action(function ($record) {
                        $record->update(['status' => 'awaiting_payment']);
                        
                        Notification::make()
                            ->title('Transaction Approved')
                            ->body('Buyer has been notified to make payment.')
                            ->success()
                            ->send();
                    }),

                // Reject pending transaction
                Action::make('reject_transaction')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->modalHeading('Reject Transaction')
                    ->modalDescription('Reject this transaction request.')
                    ->form([
                        \Filament\Forms\Components\Textarea::make('rejection_reason')
                            ->label('Rejection Reason')
                            ->required()
                            ->placeholder('Enter the reason for rejection...'),
                    ])
                    ->action(function ($record, array $data) {
                        $record->update([
                            'status' => 'cancelled',
                            'notes' => 'Rejected: ' . $data['rejection_reason'],
                            'cancelled_at' => now(),
                        ]);
                        
                        // Release vehicle back to active
                        if ($record->vehicle) {
                            $record->vehicle->update(['status' => 'active']);
                        }
                        
                        Notification::make()
                            ->title('Transaction Rejected')
                            ->body('Transaction has been rejected.')
                            ->warning()
                            ->send();
                    }),

                // Confirm payment received
                Action::make('confirm_payment')
                    ->label('Confirm Payment')
                    ->icon('heroicon-o-banknotes')
                    ->color('info')
                    ->visible(fn ($record) => in_array($record->status, ['awaiting_payment', 'payment_submitted']))
                    ->requiresConfirmation()
                    ->modalHeading('Confirm Payment Received')
                    ->modalDescription('Confirm that you have received the bank transfer from the buyer.')
                    ->action(function ($record) {
                        $record->update([
                            'status' => 'payment_received',
                            'payment_confirmed_at' => now(),
                        ]);
                        
                        Notification::make()
                            ->title('Payment Confirmed')
                            ->body('Payment has been marked as received.')
                            ->success()
                            ->send();
                    }),

                // Verify payment (after confirmation)
                Action::make('verify_payment')
                    ->label('Verify Payment')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => in_array($record->status, ['payment_received', 'payment_pending']))
                    ->requiresConfirmation()
                    ->modalHeading('Verify Bank Transfer Payment')
                    ->modalDescription('Verify that the payment amount is correct and complete.')
                    ->action(function ($record) {
                        $record->update([
                            'status' => 'payment_verified',
                            'payment_verified_at' => now(),
                        ]);
                        
                        Notification::make()
                            ->title('Payment Verified')
                            ->success()
                            ->send();
                    }),
                    
                // Release funds to seller
                Action::make('release_funds')
                    ->label('Release to Seller')
                    ->icon('heroicon-o-paper-airplane')
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
                        
                        // Mark vehicle as sold
                        if ($record->vehicle) {
                            $record->vehicle->update(['status' => 'sold']);
                        }
                        
                        Notification::make()
                            ->title('Funds Released')
                            ->body('Funds have been released to the seller.')
                            ->success()
                            ->send();
                    }),
                    
                // Refund buyer
                Action::make('refund')
                    ->label('Refund')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->color('warning')
                    ->visible(fn ($record) => in_array($record->status, ['payment_verified', 'payment_received', 'payment_pending', 'awaiting_payment']))
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
                            'status' => 'refunded',
                            'notes' => 'Refund: ' . $data['refund_reason'],
                        ]);
                        
                        // Release vehicle back to active
                        if ($record->vehicle) {
                            $record->vehicle->update(['status' => 'active']);
                        }
                        
                        Notification::make()
                            ->title('Refund Processed')
                            ->body('Transaction refunded and vehicle released.')
                            ->success()
                            ->send();
                    }),
                    
                // View invoice
                Action::make('view_invoice')
                    ->label('Invoice')
                    ->icon('heroicon-o-document-text')
                    ->color('gray')
                    ->visible(fn ($record) => $record->invoice_id !== null)
                    ->url(fn ($record) => $record->invoice_id ? route('filament.admin.resources.invoices.view', $record->invoice_id) : null),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
