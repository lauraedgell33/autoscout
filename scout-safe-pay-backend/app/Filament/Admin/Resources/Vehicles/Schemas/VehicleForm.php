<?php

namespace App\Filament\Admin\Resources\Vehicles\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class VehicleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(3)->schema([
                    Select::make('category')
                        ->label('Categorie')
                        ->options([
                            'car' => 'Autoturism',
                            'suv' => 'SUV',
                            'truck' => 'Camion',
                            'van' => 'Dubă',
                            'motorcycle' => 'Motocicletă',
                        ])
                        ->required()
                        ->default('car')
                        ->native(false),
                    
                    Select::make('status')
                        ->label('Status')
                        ->options([
                            'draft' => 'Ciornă',
                            'active' => 'Activ',
                            'pending' => 'În așteptare',
                            'sold' => 'Vândut',
                            'reserved' => 'Rezervat',
                        ])
                        ->required()
                        ->default('draft')
                        ->native(false),
                    
                    Select::make('dealer_id')
                        ->label('Dealer')
                        ->relationship('dealer', 'name')
                        ->searchable()
                        ->preload(),
                ]),
                
                Select::make('seller_id')
                    ->label('Vânzător')
                    ->relationship('seller', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),

                Grid::make(3)->schema([
                    TextInput::make('make')
                        ->label('Marcă')
                        ->required()
                        ->maxLength(100)
                        ->placeholder('Ex: BMW, Audi, Mercedes'),
                    
                    TextInput::make('model')
                        ->label('Model')
                        ->required()
                        ->maxLength(100)
                        ->placeholder('Ex: X5, A4, C-Class'),
                    
                    TextInput::make('year')
                        ->label('An fabricație')
                        ->required()
                        ->numeric()
                        ->minValue(1900)
                        ->maxValue(date('Y') + 1)
                        ->placeholder(date('Y')),
                ]),
                
                Grid::make(2)->schema([
                    TextInput::make('vin')
                        ->label('VIN')
                        ->maxLength(17)
                        ->unique(ignoreRecord: true)
                        ->placeholder('17 caractere')
                        ->helperText('Numărul de identificare al vehiculului'),
                    
                    TextInput::make('color')
                        ->label('Culoare')
                        ->maxLength(50)
                        ->placeholder('Ex: Negru, Alb, Roșu'),
                ]),

                Grid::make(3)->schema([
                    Select::make('fuel_type')
                        ->label('Tip combustibil')
                        ->options([
                            'petrol' => 'Benzină',
                            'diesel' => 'Motorină',
                            'electric' => 'Electric',
                            'hybrid' => 'Hibrid',
                            'plugin_hybrid' => 'Hibrid Plug-in',
                            'lpg' => 'GPL',
                            'cng' => 'CNG',
                        ])
                        ->native(false),
                    
                    Select::make('transmission')
                        ->label('Transmisie')
                        ->options([
                            'manual' => 'Manuală',
                            'automatic' => 'Automată',
                            'semi_automatic' => 'Semi-automată',
                        ])
                        ->native(false),
                    
                    TextInput::make('mileage')
                        ->label('Kilometraj')
                        ->numeric()
                        ->suffix('km')
                        ->minValue(0)
                        ->placeholder('0'),
                ]),
                
                Grid::make(3)->schema([
                    TextInput::make('engine_size')
                        ->label('Capacitate motor')
                        ->numeric()
                        ->suffix('cc')
                        ->minValue(0)
                        ->placeholder('2000'),
                    
                    TextInput::make('power_hp')
                        ->label('Putere')
                        ->numeric()
                        ->suffix('CP')
                        ->minValue(0)
                        ->placeholder('150'),
                    
                    Select::make('body_type')
                        ->label('Tip caroserie')
                        ->options([
                            'sedan' => 'Sedan',
                            'hatchback' => 'Hatchback',
                            'suv' => 'SUV',
                            'coupe' => 'Coupe',
                            'convertible' => 'Cabrio',
                            'wagon' => 'Break',
                            'van' => 'Dubă',
                            'pickup' => 'Pickup',
                        ])
                        ->native(false),
                ]),
                
                Grid::make(2)->schema([
                    TextInput::make('doors')
                        ->label('Număr uși')
                        ->numeric()
                        ->minValue(2)
                        ->maxValue(5)
                        ->placeholder('4'),
                    
                    TextInput::make('seats')
                        ->label('Număr locuri')
                        ->numeric()
                        ->minValue(1)
                        ->maxValue(9)
                        ->placeholder('5'),
                ]),

                Grid::make(3)->schema([
                    TextInput::make('price')
                        ->label('Preț')
                        ->required()
                        ->numeric()
                        ->minValue(0)
                        ->prefix('€')
                        ->placeholder('25000'),
                    
                    Select::make('currency')
                        ->label('Monedă')
                        ->options([
                            'EUR' => 'EUR (€)',
                            'USD' => 'USD ($)',
                            'GBP' => 'GBP (£)',
                            'RON' => 'RON (lei)',
                        ])
                        ->required()
                        ->default('EUR')
                        ->native(false),
                    
                    TextInput::make('location_city')
                        ->label('Oraș')
                        ->maxLength(100)
                        ->placeholder('Ex: București'),
                ]),
                
                TextInput::make('location_country')
                    ->label('Țară')
                    ->required()
                    ->default('DE')
                    ->maxLength(2)
                    ->placeholder('Cod țară (DE, RO, etc.)'),

                Textarea::make('description')
                    ->label('Descriere')
                    ->rows(4)
                    ->columnSpanFull()
                    ->placeholder('Descriere detaliată a vehiculului...'),
                
                FileUpload::make('primary_image')
                    ->label('Imagine principală')
                    ->image()
                    ->imageEditor()
                    ->imageEditorAspectRatios([
                        '16:9',
                        '4:3',
                        '1:1',
                    ])
                    ->maxSize(5120)
                    ->directory('vehicles/primary')
                    ->columnSpanFull(),
                
                FileUpload::make('images')
                    ->label('Galerie imagini')
                    ->image()
                    ->multiple()
                    ->reorderable()
                    ->maxFiles(20)
                    ->maxSize(5120)
                    ->directory('vehicles/gallery')
                    ->columnSpanFull()
                    ->helperText('Poți adăuga până la 20 de imagini'),

                Grid::make(2)->schema([
                    TextInput::make('autoscout_listing_id')
                        ->label('ID Listing AutoScout24')
                        ->maxLength(100)
                        ->placeholder('ID-ul anunțului pe AutoScout24'),
                    
                    Textarea::make('autoscout_data')
                        ->label('Date AutoScout24 (JSON)')
                        ->rows(3)
                        ->placeholder('Date suplimentare în format JSON'),
                ]),
            ]);
    }
}
