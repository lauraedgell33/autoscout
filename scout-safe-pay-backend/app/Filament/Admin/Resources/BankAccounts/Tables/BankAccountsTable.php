<?php

namespace App\Filament\Admin\Resources\BankAccounts\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class BankAccountsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                // Account Info
                TextColumn::make('account_holder_name')
                    ->label('Account Holder')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                    
                TextColumn::make('iban')
                    ->label('IBAN')
                    ->searchable()
                    ->copyable()
                    ->fontFamily('mono')
                    ->limit(20),
                    
                TextColumn::make('swift_bic')
                    ->label('SWIFT/BIC')
                    ->searchable()
                    ->copyable()
                    ->fontFamily('mono')
                    ->placeholder('—'),
                    
                // Bank Info
                TextColumn::make('bank_name')
                    ->label('Bank')
                    ->searchable()
                    ->sortable(),
                    
                TextColumn::make('bank_country')
                    ->label('Country')
                    ->badge()
                    ->sortable(),
                    
                TextColumn::make('currency')
                    ->badge()
                    ->color('info')
                    ->sortable(),
                    
                // Status
                IconColumn::make('is_verified')
                    ->label('Verified')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-badge')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
                    
                IconColumn::make('is_primary')
                    ->label('Primary')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-minus')
                    ->trueColor('warning')
                    ->falseColor('gray'),
                    
                // Owner Info
                TextColumn::make('accountable_type')
                    ->label('Owner Type')
                    ->formatStateUsing(fn (string $state): string => class_basename($state))
                    ->badge()
                    ->color('gray')
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                // Verification
                TextColumn::make('verified_at')
                    ->label('Verified At')
                    ->dateTime('M j, Y')
                    ->sortable()
                    ->placeholder('Not verified')
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                // Timestamps
                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M j, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                TernaryFilter::make('is_verified')
                    ->label('Verification Status')
                    ->trueLabel('Verified')
                    ->falseLabel('Not Verified'),
                TernaryFilter::make('is_primary')
                    ->label('Primary Account')
                    ->trueLabel('Primary')
                    ->falseLabel('Secondary'),
                SelectFilter::make('currency')
                    ->options([
                        'EUR' => 'EUR',
                        'USD' => 'USD',
                        'GBP' => 'GBP',
                        'CHF' => 'CHF',
                        'RON' => 'RON',
                        'PLN' => 'PLN',
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
