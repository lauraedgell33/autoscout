<?php

namespace App\Filament\Admin\Resources\Vehicles\Schemas;

use App\Models\Vehicle;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\Group;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class VehicleInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(3)->schema([
                    TextEntry::make('make')
                        ->label('Marcă')
                        ->size('lg')
                        ->weight('bold'),
                    
                    TextEntry::make('model')
                        ->label('Model')
                        ->size('lg')
                        ->weight('bold'),
                    
                    TextEntry::make('year')
                        ->label('An fabricație')
                        ->badge()
                        ->color('info'),
                ]),
                
                Grid::make(3)->schema([
                    TextEntry::make('category')
                        ->label('Categorie')
                        ->badge()
                        ->formatStateUsing(fn (string $state): string => match ($state) {
                            'car' => 'Autoturism',
                            'suv' => 'SUV',
                            'truck' => 'Camion',
                            'van' => 'Dubă',
                            'motorcycle' => 'Motocicletă',
                            default => $state,
                        })
                        ->color(fn (string $state): string => match ($state) {
                            'car' => 'primary',
                            'suv' => 'success',
                            'truck' => 'warning',
                            'van' => 'info',
                            'motorcycle' => 'danger',
                            default => 'gray',
                        }),
                    
                    TextEntry::make('status')
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
                        }),
                    
                    TextEntry::make('vin')
                        ->label('VIN')
                        ->placeholder('Nespecificat')
                        ->copyable(),
                ]),

                Grid::make(3)->schema([
                    TextEntry::make('price')
                        ->label('Preț')
                        ->money(fn ($record) => $record->currency ?? 'EUR')
                        ->size('lg')
                        ->weight('bold')
                        ->color('success'),
                    
                    TextEntry::make('location_city')
                        ->label('Oraș')
                        ->placeholder('Nespecificat')
                        ->icon('heroicon-o-map-pin'),
                    
                    TextEntry::make('location_country')
                        ->label('Țară')
                        ->placeholder('Nespecificat'),
                ]),

                Grid::make(3)->schema([
                    TextEntry::make('fuel_type')
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
                            default => $state ?? 'Nespecificat',
                        })
                        ->color(fn (?string $state): string => match ($state) {
                            'petrol' => 'warning',
                            'diesel' => 'info',
                            'electric' => 'success',
                            'hybrid' => 'primary',
                            'plugin_hybrid' => 'primary',
                            default => 'gray',
                        }),
                    
                    TextEntry::make('transmission')
                        ->label('Transmisie')
                        ->formatStateUsing(fn (?string $state): string => match ($state) {
                            'manual' => 'Manuală',
                            'automatic' => 'Automată',
                            'semi_automatic' => 'Semi-automată',
                            default => $state ?? 'Nespecificat',
                        })
                        ->placeholder('Nespecificat'),
                    
                    TextEntry::make('body_type')
                        ->label('Tip caroserie')
                        ->formatStateUsing(fn (?string $state): string => match ($state) {
                            'sedan' => 'Sedan',
                            'hatchback' => 'Hatchback',
                            'suv' => 'SUV',
                            'coupe' => 'Coupe',
                            'convertible' => 'Cabrio',
                            'wagon' => 'Break',
                            'van' => 'Dubă',
                            'pickup' => 'Pickup',
                            default => $state ?? 'Nespecificat',
                        })
                        ->placeholder('Nespecificat'),
                ]),

                Grid::make(3)->schema([
                    TextEntry::make('mileage')
                        ->label('Kilometraj')
                        ->numeric()
                        ->suffix(' km')
                        ->placeholder('Nespecificat'),
                    
                    TextEntry::make('engine_size')
                        ->label('Capacitate motor')
                        ->numeric()
                        ->suffix(' cc')
                        ->placeholder('Nespecificat'),
                    
                    TextEntry::make('power_hp')
                        ->label('Putere')
                        ->numeric()
                        ->suffix(' CP')
                        ->placeholder('Nespecificat'),
                ]),

                Grid::make(3)->schema([
                    TextEntry::make('color')
                        ->label('Culoare')
                        ->placeholder('Nespecificat'),
                    
                    TextEntry::make('doors')
                        ->label('Număr uși')
                        ->numeric()
                        ->placeholder('Nespecificat'),
                    
                    TextEntry::make('seats')
                        ->label('Număr locuri')
                        ->numeric()
                        ->placeholder('Nespecificat'),
                ]),

                TextEntry::make('description')
                    ->label('Descriere')
                    ->placeholder('Fără descriere')
                    ->columnSpanFull()
                    ->html(),

                ImageEntry::make('primary_image')
                    ->label('Imagine principală')
                    ->defaultImageUrl(url('/images/placeholder-vehicle.png'))
                    ->size(300),

                ImageEntry::make('images')
                    ->label('Galerie imagini')
                    ->columnSpanFull()
                    ->limit(10)
                    ->size(150),

                Grid::make(2)->schema([
                    TextEntry::make('dealer.name')
                        ->label('Dealer')
                        ->placeholder('Fără dealer')
                        ->icon('heroicon-o-building-storefront'),
                    
                    TextEntry::make('seller.name')
                        ->label('Vânzător')
                        ->icon('heroicon-o-user'),
                ]),

                Grid::make(3)->schema([
                    TextEntry::make('created_at')
                        ->label('Creat la')
                        ->dateTime('d/m/Y H:i')
                        ->icon('heroicon-o-clock'),
                    
                    TextEntry::make('updated_at')
                        ->label('Actualizat la')
                        ->dateTime('d/m/Y H:i')
                        ->icon('heroicon-o-arrow-path'),
                    
                    TextEntry::make('deleted_at')
                        ->label('Șters la')
                        ->dateTime('d/m/Y H:i')
                        ->icon('heroicon-o-trash')
                        ->visible(fn (Vehicle $record): bool => $record->trashed())
                        ->color('danger'),
                ]),
            ]);
    }
}
