<?php

namespace App\Filament\Admin\Resources\Vehicles\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms;
use Filament\Schemas\Schema;

class VehicleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(3)->schema([
                    Select::make('category')
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
                        ->required()
                        ->default('car')
                        ->native(false)
                        ->searchable(),
                    
                    Select::make('status')
                        ->label('Status')
                        ->options([
                            'draft' => 'Draft',
                            'active' => 'Active',
                            'pending' => 'Pending',
                            'sold' => 'Sold',
                            'reserved' => 'Reserved',
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
                    ->label('Seller')
                    ->relationship('seller', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),

                Grid::make(3)->schema([
                    TextInput::make('make')
                        ->label('Make')
                        ->required()
                        ->maxLength(100)
                        ->placeholder('e.g. BMW, Audi, Mercedes'),
                    
                    TextInput::make('model')
                        ->label('Model')
                        ->required()
                        ->maxLength(100)
                        ->placeholder('e.g. X5, A4, C-Class'),
                    
                    TextInput::make('year')
                        ->label('Year')
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
                        ->placeholder('17 characters')
                        ->helperText('Vehicle Identification Number'),
                    
                    TextInput::make('color')
                        ->label('Color')
                        ->maxLength(50)
                        ->placeholder('e.g. Black, White, Red'),
                ]),

                Grid::make(3)->schema([
                    Select::make('fuel_type')
                        ->label('Fuel Type')
                        ->options([
                            'petrol' => 'Petrol',
                            'diesel' => 'Diesel',
                            'electric' => 'Electric',
                            'hybrid' => 'Hybrid',
                            'plugin_hybrid' => 'Plug-in Hybrid',
                            'lpg' => 'LPG',
                            'cng' => 'CNG',
                            'hydrogen' => 'Hydrogen',
                        ])
                        ->native(false),
                    
                    Select::make('transmission')
                        ->label('Transmission')
                        ->options([
                            'manual' => 'Manual',
                            'automatic' => 'Automatic',
                            'semi_automatic' => 'Semi-Automatic',
                        ])
                        ->native(false),
                    
                    TextInput::make('mileage')
                        ->label('Mileage')
                        ->numeric()
                        ->suffix('km')
                        ->minValue(0)
                        ->placeholder('0'),
                ]),
                
                Grid::make(3)->schema([
                    TextInput::make('engine_size')
                        ->label('Engine Size')
                        ->numeric()
                        ->suffix('cc')
                        ->minValue(0)
                        ->placeholder('2000'),
                    
                    TextInput::make('power_hp')
                        ->label('Power')
                        ->numeric()
                        ->suffix('HP')
                        ->minValue(0)
                        ->placeholder('150'),
                    
                    Select::make('body_type')
                        ->label('Body Type')
                        ->options([
                            'sedan' => 'Sedan',
                            'hatchback' => 'Hatchback',
                            'suv' => 'SUV',
                            'coupe' => 'Coupe',
                            'convertible' => 'Convertible',
                            'wagon' => 'Wagon',
                            'van' => 'Van',
                            'truck' => 'Truck',
                            'minivan' => 'Minivan',
                        ])
                        ->native(false),
                ]),
                
                Grid::make(2)->schema([
                    TextInput::make('doors')
                        ->label('Doors')
                        ->numeric()
                        ->minValue(2)
                        ->maxValue(5)
                        ->placeholder('4'),
                    
                    TextInput::make('seats')
                        ->label('Seats')
                        ->numeric()
                        ->minValue(1)
                        ->maxValue(9)
                        ->placeholder('5'),
                ]),

                Grid::make(3)->schema([
                    TextInput::make('price')
                        ->label('Price')
                        ->required()
                        ->numeric()
                        ->minValue(0)
                        ->prefix('€')
                        ->placeholder('25000'),
                    
                    Select::make('currency')
                        ->label('Currency')
                        ->options([
                            'EUR' => 'EUR (€)',
                            'USD' => 'USD ($)',
                            'GBP' => 'GBP (£)',
                            'RON' => 'RON',
                        ])
                        ->required()
                        ->default('EUR')
                        ->native(false),
                    
                    TextInput::make('location_city')
                        ->label('City')
                        ->maxLength(100)
                        ->placeholder('e.g. Berlin'),
                ]),
                
                TextInput::make('location_country')
                    ->label('Country')
                    ->required()
                    ->default('DE')
                    ->maxLength(2)
                    ->placeholder('Country code (DE, US, etc.)'),

                Textarea::make('description')
                    ->label('Description')
                    ->rows(4)
                    ->columnSpanFull()
                    ->placeholder('Detailed vehicle description...'),
                
                FileUpload::make('primary_image')
                    ->label('Primary Image')
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
                    ->label('Image Gallery')
                    ->image()
                    ->multiple()
                    ->reorderable()
                    ->maxFiles(20)
                    ->maxSize(5120)
                    ->directory('vehicles/gallery')
                    ->columnSpanFull()
                    ->helperText('You can add up to 20 images'),

                Grid::make(2)->schema([
                    TextInput::make('autoscout_listing_id')
                        ->label('AutoScout24 Listing ID')
                        ->maxLength(100)
                        ->placeholder('AutoScout24 listing ID'),
                    
                    Textarea::make('autoscout_data')
                        ->label('AutoScout24 Data (JSON)')
                        ->rows(3)
                        ->placeholder('Additional data in JSON format'),
                ]),
            ]);
    }
}
