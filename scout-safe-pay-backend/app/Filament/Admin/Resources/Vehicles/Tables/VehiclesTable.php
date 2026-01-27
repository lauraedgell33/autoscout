<?php

namespace App\Filament\Admin\Resources\Vehicles\Tables;

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
                    ->label('Imagine')
                    ->circular()
                    ->defaultImageUrl(url('/images/placeholder-vehicle.png'))
                    ->size(60),
                
                TextColumn::make('make')
                    ->label('Marcă')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                
                TextColumn::make('model')
                    ->label('Model')
                    ->searchable()
                    ->sortable()
                    ->description(fn ($record) => $record->year),
                
                TextColumn::make('category')
                    ->label('Categorie')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'car' => 'primary',
                        'suv' => 'success',
                        'truck' => 'warning',
                        'van' => 'info',
                        'motorcycle' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'car' => 'Autoturism',
                        'suv' => 'SUV',
                        'truck' => 'Camion',
                        'van' => 'Dubă',
                        'motorcycle' => 'Motocicletă',
                        default => $state,
                    }),
                
                TextColumn::make('vin')
                    ->label('VIN')
                    ->searchable()
                    ->copyable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('price')
                    ->label('Preț')
                    ->money(fn ($record) => $record->currency ?? 'EUR')
                    ->sortable()
                    ->weight('bold')
                    ->color('success'),
                
                TextColumn::make('mileage')
                    ->label('Kilometraj')
                    ->numeric()
                    ->sortable()
                    ->suffix(' km')
                    ->alignEnd(),
                
                TextColumn::make('fuel_type')
                    ->label('Combustibil')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'petrol' => 'Benzină',
                        'diesel' => 'Motorină',
                        'electric' => 'Electric',
                        'hybrid' => 'Hibrid',
                        'plugin_hybrid' => 'Hibrid Plug-in',
                        'lpg' => 'GPL',
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
                    ->label('Transmisie')
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'manual' => 'Manuală',
                        'automatic' => 'Automată',
                        'semi_automatic' => 'Semi-automată',
                        default => $state ?? 'N/A',
                    })
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'draft' => 'Ciornă',
                        'active' => 'Activ',
                        'pending' => 'În așteptare',
                        'sold' => 'Vândut',
                        'reserved' => 'Rezervat',
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
                    ->label('Vânzător')
                    ->searchable()
                    ->toggleable(),
                
                TextColumn::make('location_city')
                    ->label('Oraș')
                    ->searchable()
                    ->toggleable(),
                
                TextColumn::make('location_country')
                    ->label('Țară')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('power_hp')
                    ->label('Putere')
                    ->numeric()
                    ->suffix(' CP')
                    ->alignEnd()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('created_at')
                    ->label('Creat la')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('updated_at')
                    ->label('Actualizat la')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('deleted_at')
                    ->label('Șters la')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->label('Categorie')
                    ->options([
                        'car' => 'Autoturism',
                        'suv' => 'SUV',
                        'truck' => 'Camion',
                        'van' => 'Dubă',
                        'motorcycle' => 'Motocicletă',
                    ])
                    ->multiple(),
                
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'draft' => 'Ciornă',
                        'active' => 'Activ',
                        'pending' => 'În așteptare',
                        'sold' => 'Vândut',
                        'reserved' => 'Rezervat',
                    ])
                    ->multiple(),
                
                SelectFilter::make('fuel_type')
                    ->label('Combustibil')
                    ->options([
                        'petrol' => 'Benzină',
                        'diesel' => 'Motorină',
                        'electric' => 'Electric',
                        'hybrid' => 'Hibrid',
                        'plugin_hybrid' => 'Hibrid Plug-in',
                        'lpg' => 'GPL',
                        'cng' => 'CNG',
                    ])
                    ->multiple(),
                
                SelectFilter::make('transmission')
                    ->label('Transmisie')
                    ->options([
                        'manual' => 'Manuală',
                        'automatic' => 'Automată',
                        'semi_automatic' => 'Semi-automată',
                    ])
                    ->multiple(),
                
                TrashedFilter::make()
                    ->label('Status înregistrări'),
            ])
            ->recordActions([
                ViewAction::make()
                    ->label('Vizualizare'),
                EditAction::make()
                    ->label('Editare'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->label('Șterge selecționate'),
                    ForceDeleteBulkAction::make()
                        ->label('Șterge permanent'),
                    RestoreBulkAction::make()
                        ->label('Restaurează'),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->striped()
            ->poll('30s');
    }
}
