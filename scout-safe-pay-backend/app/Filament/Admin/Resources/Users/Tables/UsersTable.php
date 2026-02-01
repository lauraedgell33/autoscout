<?php

namespace App\Filament\Admin\Resources\Users\Tables;

use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Malzariey\FilamentDaterangepickerFilter\Filters\DateRangeFilter;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('avatar')
                    ->label('Avatar')
                    ->circular()
                    ->defaultImageUrl('/images/default-avatar.png'),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('email')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-m-envelope'),
                TextColumn::make('phone')
                    ->searchable()
                    ->icon('heroicon-m-phone')
                    ->default('-'),
                TextColumn::make('user_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'admin' => '👑 Admin',
                        'dealer' => '🏢 Dealer',
                        'seller' => '📤 Seller',
                        'buyer' => '🛒 Buyer',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'dealer' => 'warning',
                        'seller' => 'info',
                        'buyer' => 'success',
                        default => 'gray',
                    }),
                TextColumn::make('dealer.name')
                    ->label('Dealer')
                    ->default('-')
                    ->toggleable(),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'active' => '✅ Active',
                        'inactive' => '⚫ Inactive',
                        'suspended' => '⚠️ Suspended',
                        'banned' => '🚫 Banned',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'inactive' => 'gray',
                        'suspended' => 'warning',
                        'banned' => 'danger',
                        default => 'gray',
                    }),
                IconColumn::make('email_verified_at')
                    ->boolean()
                    ->label('Verified'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->since()
                    ->toggleable(),
            ])
            ->filters([
                DateRangeFilter::make('created_at')
                    ->label('Registration Date')
                    ->placeholder('Select date range')
                    ->displayFormat('DD/MM/YYYY')
                    ->firstDayOfWeek(1)
                    ->ranges([
                        'Today' => [now(), now()],
                        'Last 7 Days' => [now()->subDays(6), now()],
                        'Last 30 Days' => [now()->subDays(29), now()],
                        'This Month' => [now()->startOfMonth(), now()->endOfMonth()],
                        'Last Month' => [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()],
                        'This Year' => [now()->startOfYear(), now()->endOfYear()],
                    ]),
                    
                DateRangeFilter::make('email_verified_at')
                    ->label('Email Verification Date')
                    ->placeholder('Select date range')
                    ->displayFormat('DD/MM/YYYY')
                    ->firstDayOfWeek(1),
                    
                SelectFilter::make('user_type')
                    ->options([
                        'buyer' => 'Buyer',
                        'seller' => 'Seller',
                        'dealer' => 'Dealer',
                        'admin' => 'Admin',
                    ])
                    ->multiple(),
                    
                SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                        'suspended' => 'Suspended',
                        'banned' => 'Banned',
                    ])
                    ->multiple(),
                    
                TernaryFilter::make('email_verified')
                    ->label('Email Verified')
                    ->placeholder('All users')
                    ->trueLabel('Verified only')
                    ->falseLabel('Unverified only')
                    ->queries(
                        true: fn ($query) => $query->whereNotNull('email_verified_at'),
                        false: fn ($query) => $query->whereNull('email_verified_at'),
                    ),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
