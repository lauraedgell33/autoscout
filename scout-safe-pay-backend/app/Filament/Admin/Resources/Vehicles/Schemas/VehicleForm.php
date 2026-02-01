<?php

namespace App\Filament\Admin\Resources\Vehicles\Schemas;

use Closure;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Utilities\Get;

class VehicleForm
{
    // Categories that use operating hours instead of mileage (km)
    private static array $hoursCategories = [
        'agricultural_machinery',
        'construction_machinery',
        'forklift',
        'boat',
    ];

    // Categories that typically have doors/seats
    private static array $passengerCategories = [
        'car',
        'van',
        'motorhome',
        'caravan',
    ];

    // Categories that have engine/fuel
    private static array $motorizedCategories = [
        'car',
        'motorcycle',
        'van',
        'truck',
        'motorhome',
        'caravan',
        'agricultural_machinery',
        'construction_machinery',
        'forklift',
        'boat',
        'atv',
        'quad',
    ];

    // Categories that don't have VIN
    private static array $noVinCategories = [
        'trailer',
        'boat',
    ];

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(3)->schema([
                    Select::make('category')
                        ->label('Category')
                        ->options([
                            'car' => '🚗 Car',
                            'motorcycle' => '🏍️ Motorcycle',
                            'van' => '🚐 Van',
                            'truck' => '🚚 Truck',
                            'trailer' => '🚛 Trailer',
                            'caravan' => '🚙 Caravan',
                            'motorhome' => '🏕️ Motorhome',
                            'construction_machinery' => '🏗️ Construction Machinery',
                            'agricultural_machinery' => '🚜 Agricultural Machinery',
                            'forklift' => '🔧 Forklift',
                            'boat' => '⛵ Boat',
                            'atv' => '🛞 ATV',
                            'quad' => '🏁 Quad',
                        ])
                        ->required()
                        ->default('car')
                        ->native(false)
                        ->searchable()
                        ->live(),
                    
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
                        ->helperText('Vehicle Identification Number')
                        ->visible(fn (Get $get): bool => !in_array($get('category'), self::$noVinCategories)),
                    
                    TextInput::make('color')
                        ->label('Color')
                        ->maxLength(50)
                        ->placeholder('e.g. Black, White, Red'),
                ]),

                // Technical Details Section - Dynamic based on category
                Section::make('Technical Details')
                    ->description(fn (Get $get): string => match($get('category')) {
                        'agricultural_machinery' => 'Specifications for agricultural machinery',
                        'construction_machinery' => 'Specifications for construction equipment',
                        'boat' => 'Specifications for watercraft',
                        'trailer' => 'Specifications for trailer',
                        default => 'Vehicle technical specifications',
                    })
                    ->schema([
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
                                ->native(false)
                                ->visible(fn (Get $get): bool => in_array($get('category'), self::$motorizedCategories)),
                            
                            Select::make('transmission')
                                ->label('Transmission')
                                ->options([
                                    'manual' => 'Manual',
                                    'automatic' => 'Automatic',
                                    'semi_automatic' => 'Semi-Automatic',
                                ])
                                ->native(false)
                                ->visible(fn (Get $get): bool => in_array($get('category'), ['car', 'van', 'truck', 'motorcycle', 'atv', 'quad'])),
                            
                            // Dynamic mileage/hours field
                            TextInput::make('mileage')
                                ->label(fn (Get $get): string => in_array($get('category'), self::$hoursCategories) ? 'Operating Hours' : 'Mileage')
                                ->numeric()
                                ->suffix(fn (Get $get): string => in_array($get('category'), self::$hoursCategories) ? 'hours' : 'km')
                                ->minValue(0)
                                ->placeholder(fn (Get $get): string => in_array($get('category'), self::$hoursCategories) ? '500' : '50000')
                                ->helperText(fn (Get $get): string => in_array($get('category'), self::$hoursCategories) 
                                    ? 'Total operating hours' 
                                    : 'Odometer reading in kilometers'),
                        ]),
                        
                        Grid::make(3)->schema([
                            TextInput::make('engine_size')
                                ->label(fn (Get $get): string => $get('category') === 'boat' ? 'Engine Displacement' : 'Engine Size')
                                ->numeric()
                                ->suffix('cc')
                                ->minValue(0)
                                ->placeholder('2000')
                                ->visible(fn (Get $get): bool => in_array($get('category'), self::$motorizedCategories) && $get('category') !== 'trailer'),
                            
                            TextInput::make('power_hp')
                                ->label(fn (Get $get): string => $get('category') === 'boat' ? 'Engine Power' : 'Power')
                                ->numeric()
                                ->suffix('HP')
                                ->minValue(0)
                                ->placeholder('150')
                                ->visible(fn (Get $get): bool => in_array($get('category'), self::$motorizedCategories) && $get('category') !== 'trailer'),
                            
                            Select::make('body_type')
                                ->label('Body Type')
                                ->options(fn (Get $get): array => match($get('category')) {
                                    'car' => [
                                        'sedan' => 'Sedan',
                                        'hatchback' => 'Hatchback',
                                        'suv' => 'SUV',
                                        'coupe' => 'Coupe',
                                        'convertible' => 'Convertible',
                                        'wagon' => 'Wagon',
                                        'minivan' => 'Minivan',
                                    ],
                                    'truck' => [
                                        'pickup' => 'Pickup',
                                        'flatbed' => 'Flatbed',
                                        'box_truck' => 'Box Truck',
                                        'semi' => 'Semi Truck',
                                    ],
                                    'van' => [
                                        'cargo' => 'Cargo Van',
                                        'passenger' => 'Passenger Van',
                                        'minivan' => 'Minivan',
                                    ],
                                    'boat' => [
                                        'motorboat' => 'Motorboat',
                                        'sailboat' => 'Sailboat',
                                        'yacht' => 'Yacht',
                                        'fishing' => 'Fishing Boat',
                                        'pontoon' => 'Pontoon',
                                    ],
                                    'trailer' => [
                                        'enclosed' => 'Enclosed',
                                        'open' => 'Open/Flatbed',
                                        'car_hauler' => 'Car Hauler',
                                        'utility' => 'Utility',
                                    ],
                                    default => [
                                        'standard' => 'Standard',
                                    ],
                                })
                                ->native(false)
                                ->visible(fn (Get $get): bool => in_array($get('category'), ['car', 'truck', 'van', 'boat', 'trailer'])),
                        ]),
                        
                        // Doors/Seats - only for passenger vehicles
                        Grid::make(2)->schema([
                            TextInput::make('doors')
                                ->label('Doors')
                                ->numeric()
                                ->minValue(2)
                                ->maxValue(5)
                                ->placeholder('4')
                                ->visible(fn (Get $get): bool => in_array($get('category'), self::$passengerCategories)),
                            
                            TextInput::make('seats')
                                ->label('Seats')
                                ->numeric()
                                ->minValue(1)
                                ->maxValue(50)
                                ->placeholder('5')
                                ->visible(fn (Get $get): bool => in_array($get('category'), self::$passengerCategories)),
                        ]),
                        
                        // Special fields for specific categories
                        Grid::make(2)->schema([
                            TextInput::make('lifting_capacity')
                                ->label('Lifting Capacity')
                                ->numeric()
                                ->suffix('kg')
                                ->minValue(0)
                                ->placeholder('3000')
                                ->helperText('Maximum lifting capacity in kilograms')
                                ->visible(fn (Get $get): bool => in_array($get('category'), ['forklift', 'construction_machinery'])),
                            
                            TextInput::make('working_width')
                                ->label('Working Width')
                                ->numeric()
                                ->suffix('m')
                                ->minValue(0)
                                ->placeholder('3.5')
                                ->helperText('For harvesters, plows, etc.')
                                ->visible(fn (Get $get): bool => $get('category') === 'agricultural_machinery'),
                        ]),
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
                    ->disk('public')
                    ->maxSize(5120)
                    ->directory('vehicles/primary')
                    ->visibility('public')
                    ->columnSpanFull(),
                
                FileUpload::make('images')
                    ->label('Image Gallery')
                    ->image()
                    ->multiple()
                    ->reorderable()
                    ->disk('public')
                    ->maxFiles(20)
                    ->maxSize(5120)
                    ->directory('vehicles/gallery')
                    ->visibility('public')
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
