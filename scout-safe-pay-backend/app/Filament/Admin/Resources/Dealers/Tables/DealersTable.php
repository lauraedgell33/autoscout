<?php

namespace App\Filament\Admin\Resources\Dealers\Tables;

use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Malzariey\FilamentDaterangepickerFilter\Filters\DateRangeFilter;

class DealersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('logo_url')
                    ->label('Logo')
                    ->circular()
                    ->defaultImageUrl('/images/default-dealer.png'),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('company_name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-m-envelope'),
                TextColumn::make('phone')
                    ->searchable()
                    ->icon('heroicon-m-phone')
                    ->default('-'),
                TextColumn::make('vat_number')
                    ->searchable()
                    ->label('VAT')
                    ->toggleable(),
                IconColumn::make('is_verified')
                    ->boolean()
                    ->label('Verified'),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'inactive' => 'gray',
                        'suspended' => 'warning',
                        'pending' => 'info',
                        default => 'gray',
                    }),
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
                        'This Quarter' => [now()->startOfQuarter(), now()->endOfQuarter()],
                        'This Year' => [now()->startOfYear(), now()->endOfYear()],
                    ]),
                    
                SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                        'suspended' => 'Suspended',
                        'pending' => 'Pending',
                    ])
                    ->multiple(),
                    
                SelectFilter::make('is_verified')
                    ->options([
                        '1' => 'Verified',
                        '0' => 'Not Verified',
                    ])
                    ->label('Verification Status'),
                    
                TrashedFilter::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
