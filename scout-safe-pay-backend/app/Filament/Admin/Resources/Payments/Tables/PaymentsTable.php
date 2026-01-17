<?php

namespace App\Filament\Admin\Resources\Payments\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Malzariey\FilamentDaterangepickerFilter\Filters\DateRangeFilter;

class PaymentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('payment_reference')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold'),
                TextColumn::make('transaction.transaction_code')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->label('Transaction'),
                TextColumn::make('user.name')
                    ->searchable()
                    ->sortable()
                    ->label('Payer'),
                TextColumn::make('amount')
                    ->money('EUR')
                    ->sortable(),
                TextColumn::make('payment_method')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'bank_transfer' => 'primary',
                        'credit_card' => 'success',
                        'paypal' => 'info',
                        'stripe' => 'warning',
                        default => 'gray',
                    })
                    ->label('Method'),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'verified' => 'success',
                        'rejected' => 'danger',
                        'paid' => 'info',
                        default => 'gray',
                    }),
                TextColumn::make('verifiedBy.name')
                    ->label('Verified By')
                    ->toggleable()
                    ->default('-'),
                TextColumn::make('verified_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable()
                    ->since(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->since(),
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
                    ]),
                    
                DateRangeFilter::make('verified_at')
                    ->label('Verification Date')
                    ->placeholder('Select date range')
                    ->displayFormat('DD/MM/YYYY')
                    ->firstDayOfWeek(1),
                    
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
                    
                SelectFilter::make('payment_method')
                    ->options([
                        'bank_transfer' => 'Bank Transfer',
                        'credit_card' => 'Credit Card',
                        'paypal' => 'PayPal',
                        'stripe' => 'Stripe',
                    ])
                    ->multiple(),
                    
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'verified' => 'Verified',
                        'rejected' => 'Rejected',
                        'paid' => 'Paid',
                    ])
                    ->multiple(),
                    
                TrashedFilter::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
