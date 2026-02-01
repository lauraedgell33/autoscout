<?php

namespace App\Filament\Admin\Resources\Transactions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class TransactionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('transaction_code')
                    ->searchable(),
                TextColumn::make('buyer.name')
                    ->searchable(),
                TextColumn::make('seller.name')
                    ->searchable(),
                TextColumn::make('dealer.name')
                    ->searchable(),
                TextColumn::make('vehicle.id')
                    ->searchable(),
                TextColumn::make('amount')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('currency')
                    ->searchable(),
                TextColumn::make('service_fee')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('dealer_commission')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('escrow_account_iban')
                    ->searchable(),
                TextColumn::make('escrow_account_country')
                    ->searchable(),
                TextColumn::make('payment_reference')
                    ->searchable(),
                TextColumn::make('payment_proof_url')
                    ->searchable(),
                TextColumn::make('payment_proof_type')
                    ->searchable(),
                TextColumn::make('payment_proof_uploaded_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('status')
                    ->searchable(),
                TextColumn::make('payment_verified_by')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('payment_verified_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('payment_confirmed_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('inspection_date')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('ownership_transfer_date')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('completed_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('cancelled_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('payment_proof')
                    ->searchable(),
                TextColumn::make('contract_url')
                    ->searchable(),
                TextColumn::make('signed_contract_url')
                    ->searchable(),
                TextColumn::make('contract_generated_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('contract_signed_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('signature_type')
                    ->searchable(),
                TextColumn::make('bank_account_iban')
                    ->searchable(),
                TextColumn::make('bank_account_holder')
                    ->searchable(),
                TextColumn::make('bank_name')
                    ->searchable(),
                TextColumn::make('payment_deadline')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('invoice_number')
                    ->searchable(),
                TextColumn::make('invoice_url')
                    ->searchable(),
                TextColumn::make('invoice_issued_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('delivery_date')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('delivery_contact')
                    ->searchable(),
                TextColumn::make('delivered_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
