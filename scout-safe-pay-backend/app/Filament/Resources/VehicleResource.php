<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VehicleResource\Pages;
use App\Models\Vehicle;
use Filament\Schemas;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class VehicleResource extends Resource
{
    protected static ?string $model = Vehicle::class;
    protected static ?string $navigationIcon = 'heroicon-o-truck';
    protected static ?string $navigationLabel = 'Vehicles';
    protected static ?int $navigationSort = 4;

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

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\Select::make('category')
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
                            ->searchable()
                            ->live(),

                        Forms\Components\TextInput::make('make')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('model')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('year')
                            ->required()
                            ->numeric()
                            ->minValue(1900)
                            ->maxValue(date('Y') + 1),

                        Forms\Components\TextInput::make('vin')
                            ->label('VIN')
                            ->maxLength(17)
                            ->unique(ignoreRecord: true)
                            ->visible(fn (Forms\Get $get): bool => !in_array($get('category'), ['trailer', 'boat'])),
                    ])->columns(2),

                Forms\Components\Section::make('Pricing')
                    ->schema([
                        Forms\Components\TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->prefix('€')
                            ->minValue(0),

                        Forms\Components\Select::make('currency')
                            ->options([
                                'EUR' => 'EUR (€)',
                                'USD' => 'USD ($)',
                                'GBP' => 'GBP (£)',
                            ])
                            ->default('EUR')
                            ->required(),
                    ])->columns(2),

                Forms\Components\Section::make('Technical Details')
                    ->description(fn (Forms\Get $get): string => match($get('category')) {
                        'agricultural_machinery' => 'Specifications for agricultural machinery',
                        'construction_machinery' => 'Specifications for construction equipment',
                        'boat' => 'Specifications for watercraft',
                        'trailer' => 'Specifications for trailer',
                        default => 'Vehicle technical specifications',
                    })
                    ->schema([
                        Forms\Components\TextInput::make('mileage')
                            ->label(fn (Forms\Get $get): string => in_array($get('category'), self::$hoursCategories) ? 'Operating Hours' : 'Mileage')
                            ->numeric()
                            ->suffix(fn (Forms\Get $get): string => in_array($get('category'), self::$hoursCategories) ? 'hours' : 'km')
                            ->minValue(0)
                            ->helperText(fn (Forms\Get $get): string => in_array($get('category'), self::$hoursCategories) 
                                ? 'Total operating hours' 
                                : 'Odometer reading in kilometers'),

                        Forms\Components\Select::make('fuel_type')
                            ->options([
                                'petrol' => 'Petrol',
                                'diesel' => 'Diesel',
                                'electric' => 'Electric',
                                'hybrid' => 'Hybrid',
                                'lpg' => 'LPG',
                                'cng' => 'CNG',
                            ])
                            ->searchable()
                            ->visible(fn (Forms\Get $get): bool => in_array($get('category'), self::$motorizedCategories)),

                        Forms\Components\Select::make('transmission')
                            ->options([
                                'manual' => 'Manual',
                                'automatic' => 'Automatic',
                                'semi-automatic' => 'Semi-Automatic',
                            ])
                            ->searchable()
                            ->visible(fn (Forms\Get $get): bool => in_array($get('category'), ['car', 'van', 'truck', 'motorcycle', 'atv', 'quad'])),

                        Forms\Components\TextInput::make('color')
                            ->maxLength(50),

                        Forms\Components\TextInput::make('doors')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(10)
                            ->visible(fn (Forms\Get $get): bool => in_array($get('category'), self::$passengerCategories)),

                        Forms\Components\TextInput::make('seats')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(100)
                            ->visible(fn (Forms\Get $get): bool => in_array($get('category'), self::$passengerCategories)),

                        Forms\Components\Select::make('body_type')
                            ->options(fn (Forms\Get $get): array => match($get('category')) {
                                'car' => [
                                    'sedan' => 'Sedan',
                                    'hatchback' => 'Hatchback',
                                    'suv' => 'SUV',
                                    'coupe' => 'Coupe',
                                    'convertible' => 'Convertible',
                                    'wagon' => 'Wagon',
                                ],
                                'truck' => [
                                    'pickup' => 'Pickup',
                                    'flatbed' => 'Flatbed',
                                    'box_truck' => 'Box Truck',
                                ],
                                'van' => [
                                    'cargo' => 'Cargo Van',
                                    'passenger' => 'Passenger Van',
                                ],
                                default => [
                                    'standard' => 'Standard',
                                ],
                            })
                            ->searchable()
                            ->visible(fn (Forms\Get $get): bool => in_array($get('category'), ['car', 'truck', 'van'])),

                        Forms\Components\TextInput::make('engine_size')
                            ->numeric()
                            ->suffix('cc')
                            ->minValue(0)
                            ->visible(fn (Forms\Get $get): bool => in_array($get('category'), self::$motorizedCategories) && $get('category') !== 'trailer'),

                        Forms\Components\TextInput::make('power_hp')
                            ->label('Power (HP)')
                            ->numeric()
                            ->suffix('HP')
                            ->minValue(0)
                            ->visible(fn (Forms\Get $get): bool => in_array($get('category'), self::$motorizedCategories) && $get('category') !== 'trailer'),
                    ])->columns(3),

                Forms\Components\Section::make('Description')
                    ->schema([
                        Forms\Components\Textarea::make('description')
                            ->rows(4)
                            ->maxLength(5000),
                    ]),

                Forms\Components\Section::make('Location')
                    ->schema([
                        Forms\Components\TextInput::make('location_city')
                            ->maxLength(100),

                        Forms\Components\Select::make('location_country')
                            ->options([
                                'DE' => 'Germany',
                                'AT' => 'Austria',
                                'CH' => 'Switzerland',
                                'FR' => 'France',
                                'IT' => 'Italy',
                                'NL' => 'Netherlands',
                            ])
                            ->default('DE')
                            ->searchable(),
                    ])->columns(2),

                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'active' => 'Active',
                                'reserved' => 'Reserved',
                                'sold' => 'Sold',
                                'removed' => 'Removed',
                            ])
                            ->default('draft')
                            ->required(),
                    ]),

                Forms\Components\Section::make('Images')
                    ->schema([
                        Forms\Components\FileUpload::make('images')
                            ->image()
                            ->multiple()
                            ->maxFiles(10)
                            ->directory('vehicles')
                            ->imageEditor()
                            ->reorderable(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('primary_image')
                    ->label('Image')
                    ->circular()
                    ->defaultImageUrl(url('/images/no-vehicle.png')),

                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->formatStateUsing(fn ($state) => match($state) {
                        'car' => '🚗 Car',
                        'motorcycle' => '🏍️ Motorcycle',
                        'van' => '🚐 Van',
                        'truck' => '🚚 Truck',
                        'trailer' => '🚛 Trailer',
                        'caravan' => '🚙 Caravan',
                        'motorhome' => '🏕️ Motorhome',
                        'construction_machinery' => '🏗️ Construction',
                        'agricultural_machinery' => '🚜 Agricultural',
                        'forklift' => '🔧 Forklift',
                        'boat' => '⛵ Boat',
                        'atv' => '🛞 ATV',
                        'quad' => '🏁 Quad',
                        default => $state,
                    }),

                Tables\Columns\TextColumn::make('make')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('model')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('year')
                    ->sortable(),

                Tables\Columns\TextColumn::make('price')
                    ->money('EUR')
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->colors([
                        'secondary' => 'draft',
                        'success' => 'active',
                        'warning' => 'reserved',
                        'info' => 'sold',
                        'danger' => 'removed',
                    ]),

                Tables\Columns\TextColumn::make('seller.name')
                    ->label('Seller')
                    ->searchable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('category')
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
                    ]),

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'active' => 'Active',
                        'reserved' => 'Reserved',
                        'sold' => 'Sold',
                        'removed' => 'Removed',
                    ]),

                Tables\Filters\SelectFilter::make('fuel_type')
                    ->options([
                        'petrol' => 'Petrol',
                        'diesel' => 'Diesel',
                        'electric' => 'Electric',
                        'hybrid' => 'Hybrid',
                    ]),

                Tables\Filters\Filter::make('price')
                    ->form([
                        Forms\Components\TextInput::make('price_from')
                            ->numeric()
                            ->prefix('€'),
                        Forms\Components\TextInput::make('price_to')
                            ->numeric()
                            ->prefix('€'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['price_from'],
                                fn (Builder $query, $price): Builder => $query->where('price', '>=', $price),
                            )
                            ->when(
                                $data['price_to'],
                                fn (Builder $query, $price): Builder => $query->where('price', '<=', $price),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                
                Actions\Action::make('publish')
                    ->label('Publish')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['status' => 'active']))
                    ->visible(fn ($record) => $record->status === 'draft'),

                Actions\Action::make('unpublish')
                    ->label('Unpublish')
                    ->icon('heroicon-o-x-circle')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['status' => 'draft']))
                    ->visible(fn ($record) => $record->status === 'active'),

                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\BulkAction::make('publish')
                        ->label('Publish Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'active'])),

                    Actions\BulkAction::make('unpublish')
                        ->label('Unpublish Selected')
                        ->icon('heroicon-o-x-circle')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'draft'])),

                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVehicles::route('/'),
            'create' => Pages\CreateVehicle::route('/create'),
            'view' => Pages\ViewVehicle::route('/{record}'),
            'edit' => Pages\EditVehicle::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'draft')->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }
}
