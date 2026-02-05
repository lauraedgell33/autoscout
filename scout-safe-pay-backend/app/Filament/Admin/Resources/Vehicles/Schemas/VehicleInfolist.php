<?php

namespace App\Filament\Admin\Resources\Vehicles\Schemas;

use App\Models\Vehicle;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;

class VehicleInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(3)->schema([
                    TextEntry::make('make')
                        ->label('Make')
                        ->size('lg')
                        ->weight('bold'),
                    
                    TextEntry::make('model')
                        ->label('Model')
                        ->size('lg')
                        ->weight('bold'),
                    
                    TextEntry::make('year')
                        ->label('Year')
                        ->badge()
                        ->color('info'),
                ]),
                
                Grid::make(3)->schema([
                    TextEntry::make('category')
                        ->label('Category')
                        ->badge()
                        ->formatStateUsing(fn (string $state): string => match ($state) {
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
                            default => $state,
                        })
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
                        }),
                    
                    TextEntry::make('status')
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
                        }),
                    
                    TextEntry::make('vin')
                        ->label('VIN')
                        ->placeholder('Not specified')
                        ->copyable(),
                ]),

                Grid::make(3)->schema([
                    TextEntry::make('price')
                        ->label('Price')
                        ->money(fn ($record) => $record->currency ?? 'EUR')
                        ->size('lg')
                        ->weight('bold')
                        ->color('success'),
                    
                    TextEntry::make('location_city')
                        ->label('City')
                        ->placeholder('Not specified')
                        ->icon('heroicon-o-map-pin'),
                    
                    TextEntry::make('location_country')
                        ->label('Country')
                        ->placeholder('Not specified'),
                ]),

                Grid::make(3)->schema([
                    TextEntry::make('fuel_type')
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
                            'hydrogen' => 'Hydrogen',
                            default => $state ?? 'Not specified',
                        })
                        ->color(fn (?string $state): string => match ($state) {
                            'petrol' => 'warning',
                            'diesel' => 'info',
                            'electric' => 'success',
                            'hybrid' => 'primary',
                            'plugin_hybrid' => 'primary',
                            'hydrogen' => 'success',
                            default => 'gray',
                        }),
                    
                    TextEntry::make('transmission')
                        ->label('Transmission')
                        ->formatStateUsing(fn (?string $state): string => match ($state) {
                            'manual' => 'Manual',
                            'automatic' => 'Automatic',
                            'semi_automatic' => 'Semi-Automatic',
                            default => $state ?? 'Not specified',
                        })
                        ->placeholder('Not specified'),
                    
                    TextEntry::make('body_type')
                        ->label('Body Type')
                        ->formatStateUsing(fn (?string $state): string => match ($state) {
                            'sedan' => 'Sedan',
                            'hatchback' => 'Hatchback',
                            'suv' => 'SUV',
                            'coupe' => 'Coupe',
                            'convertible' => 'Convertible',
                            'wagon' => 'Wagon',
                            'van' => 'Van',
                            'truck' => 'Truck',
                            'minivan' => 'Minivan',
                            default => $state ?? 'Not specified',
                        })
                        ->placeholder('Not specified'),
                ]),

                Grid::make(3)->schema([
                    TextEntry::make('mileage')
                        ->label('Mileage')
                        ->numeric()
                        ->suffix(' km')
                        ->placeholder('Not specified'),
                    
                    TextEntry::make('engine_size')
                        ->label('Engine Size')
                        ->numeric()
                        ->suffix(' cc')
                        ->placeholder('Not specified'),
                    
                    TextEntry::make('power_hp')
                        ->label('Power')
                        ->numeric()
                        ->suffix(' HP')
                        ->placeholder('Not specified'),
                ]),

                Grid::make(3)->schema([
                    TextEntry::make('color')
                        ->label('Color')
                        ->placeholder('Not specified'),
                    
                    TextEntry::make('doors')
                        ->label('Doors')
                        ->numeric()
                        ->placeholder('Not specified'),
                    
                    TextEntry::make('seats')
                        ->label('Seats')
                        ->numeric()
                        ->placeholder('Not specified'),
                ]),

                TextEntry::make('description')
                    ->label('Description')
                    ->placeholder('No description')
                    ->columnSpanFull()
                    ->html(),

                ImageEntry::make('primary_image')
                    ->label('Primary Image')
                    ->disk('public')
                    ->visibility('public')
                    ->defaultImageUrl(url('/images/placeholder-vehicle.png'))
                    ->size(300),

                ImageEntry::make('images')
                    ->label('Image Gallery')
                    ->disk('public')
                    ->visibility('public')
                    ->columnSpanFull()
                    ->limit(10)
                    ->size(150),

                Grid::make(2)->schema([
                    TextEntry::make('dealer.name')
                        ->label('Dealer')
                        ->placeholder('No dealer')
                        ->icon('heroicon-o-building-storefront'),
                    
                    TextEntry::make('seller.name')
                        ->label('Seller')
                        ->icon('heroicon-o-user'),
                ]),

                Grid::make(3)->schema([
                    TextEntry::make('created_at')
                        ->label('Created At')
                        ->dateTime('Y-m-d H:i')
                        ->icon('heroicon-o-clock'),
                    
                    TextEntry::make('updated_at')
                        ->label('Updated At')
                        ->dateTime('Y-m-d H:i')
                        ->icon('heroicon-o-arrow-path'),
                    
                    TextEntry::make('deleted_at')
                        ->label('Deleted At')
                        ->dateTime('Y-m-d H:i')
                        ->icon('heroicon-o-trash')
                        ->visible(fn (Vehicle $record): bool => $record->trashed())
                        ->color('danger'),
                ]),
            ]);
    }
}
