<?php

namespace App\Filament\Admin\Resources\Vehicles\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class VehiclesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('primary_image')
                    ->label('Image')
                    ->circular()
                    ->disk('public')
                    ->visibility('public')
                    ->defaultImageUrl(url('/images/placeholder-vehicle.png'))
                    ->size(60)
                    ->state(fn ($record) => $record->getAttributes()['primary_image'] ?? null),
                
                TextColumn::make('make')
                    ->label('Make')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                
                TextColumn::make('model')
                    ->label('Model')
                    ->searchable()
                    ->sortable()
                    ->description(fn ($record) => $record->year),
                
                TextColumn::make('category')
                    ->label('Category')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'car' => 'primary',
                        'motorcycle' => 'danger',
                        'van' => 'info',
                        'truck' => 'warning',
                        'trailer' => 'gray',
                        'caravan' => 'success',
                        'motorhome' => 'success',
                        'construction_machinery' => 'warning',
                        'agricultural_machinery' => 'warning',
                        'forklift' => 'info',
                        'boat' => 'primary',
                        'atv' => 'danger',
                        'quad' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'car' => 'Car',
                        'motorcycle' => 'Motorcycle',
                        'van' => 'Van',
                        'truck' => 'Truck',
                        'trailer' => 'Trailer',
                        'caravan' => 'Caravan',
                        'motorhome' => 'Motorhome',
                        'construction_machinery' => 'Construction',
                        'agricultural_machinery' => 'Agricultural',
                        'forklift' => 'Forklift',
                        'boat' => 'Boat',
                        'atv' => 'ATV',
                        'quad' => 'Quad',
                        default => $state,
                    }),
                
                TextColumn::make('vin')
                    ->label('VIN')
                    ->searchable()
                    ->copyable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('price')
                    ->label('Price')
                    ->money(fn ($record) => $record->currency ?? 'EUR')
                    ->sortable()
                    ->weight('bold')
                    ->color('success'),
                
                TextColumn::make('mileage')
                    ->label('Mileage')
                    ->numeric()
                    ->sortable()
                    ->suffix(' km')
                    ->alignEnd(),
                
                TextColumn::make('fuel_type')
                    ->label('Fuel Type')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'petrol' => 'Petrol',
                        'diesel' => 'Diesel',
                        'electric' => 'Electric',
                        'hybrid' => 'Hybrid',
                        'plugin_hybrid' => 'Plug-in Hybrid',
                        'lpg' => 'LPG',
                        'cng' => 'CNG',
                        default => $state ?? 'N/A',
                    })
                    ->color(fn (?string $state): string => match ($state) {
                        'petrol' => 'warning',
                        'diesel' => 'info',
                        'electric' => 'success',
                        'hybrid' => 'primary',
                        'plugin_hybrid' => 'primary',
                        default => 'gray',
                    })
                    ->toggleable(),
                
                TextColumn::make('transmission')
                    ->label('Transmission')
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'manual' => 'Manual',
                        'automatic' => 'Automatic',
                        'semi_automatic' => 'Semi-Automatic',
                        default => $state ?? 'N/A',
                    })
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'draft' => 'Draft',
                        'active' => 'Active',
                        'pending' => 'Pending',
                        'sold' => 'Sold',
                        'reserved' => 'Reserved',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'draft' => 'gray',
                        'active' => 'success',
                        'pending' => 'warning',
                        'sold' => 'danger',
                        'reserved' => 'info',
                        default => 'gray',
                    })
                    ->sortable(),
                
                TextColumn::make('dealer.name')
                    ->label('Dealer')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('seller.name')
                    ->label('Seller')
                    ->searchable()
                    ->toggleable(),
                
                TextColumn::make('location_city')
                    ->label('City')
                    ->searchable()
                    ->toggleable(),
                
                TextColumn::make('location_country')
                    ->label('Country')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('power_hp')
                    ->label('Power')
                    ->numeric()
                    ->suffix(' HP')
                    ->alignEnd()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('updated_at')
                    ->label('Updated At')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('deleted_at')
                    ->label('Deleted At')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->label('Category')
                    ->options([
                        'car' => 'Car',
                        'motorcycle' => 'Motorcycle',
                        'van' => 'Van',
                        'truck' => 'Truck',
                        'trailer' => 'Trailer',
                        'caravan' => 'Caravan',
                        'motorhome' => 'Motorhome',
                        'construction_machinery' => 'Construction Machinery',
                        'agricultural_machinery' => 'Agricultural Machinery',
                        'forklift' => 'Forklift',
                        'boat' => 'Boat',
                        'atv' => 'ATV',
                        'quad' => 'Quad',
                    ])
                    ->multiple(),
                
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'draft' => 'Draft',
                        'active' => 'Active',
                        'pending' => 'Pending',
                        'sold' => 'Sold',
                        'reserved' => 'Reserved',
                    ])
                    ->multiple(),
                
                SelectFilter::make('fuel_type')
                    ->label('Fuel Type')
                    ->options([
                        'petrol' => 'Petrol',
                        'diesel' => 'Diesel',
                        'electric' => 'Electric',
                        'hybrid' => 'Hybrid',
                        'plugin_hybrid' => 'Plug-in Hybrid',
                        'lpg' => 'LPG',
                        'cng' => 'CNG',
                    ])
                    ->multiple(),
                
                SelectFilter::make('transmission')
                    ->label('Transmission')
                    ->options([
                        'manual' => 'Manual',
                        'automatic' => 'Automatic',
                        'semi_automatic' => 'Semi-Automatic',
                    ])
                    ->multiple(),
                
                TrashedFilter::make()
                    ->label('Record Status'),
            ])
            ->recordActions([
                Action::make('viewOnFrontend')
                    ->label('View on Site')
                    ->icon('heroicon-o-globe-alt')
                    ->color('info')
                    ->url(fn ($record) => config('app.frontend_url', 'http://localhost:3000') . '/en/vehicle/' . $record->id)
                    ->openUrlInNewTab(),
                ViewAction::make()
                    ->label('View'),
                EditAction::make()
                    ->label('Edit'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->label('Delete Selected'),
                    ForceDeleteBulkAction::make()
                        ->label('Force Delete'),
                    RestoreBulkAction::make()
                        ->label('Restore'),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->striped()
            ->poll('30s');
    }
}
