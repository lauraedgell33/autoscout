<?php

namespace App\Filament\Resources\Vehicles\Schemas;

use Filament\Forms\Components\FileUpload;
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
                Select::make('dealer_id')
                    ->relationship('dealer', 'name'),
                Select::make('seller_id')
                    ->relationship('seller', 'name')
                    ->required(),
                TextInput::make('make')
                    ->required(),
                TextInput::make('model')
                    ->required(),
                TextInput::make('year')
                    ->required()
                    ->numeric(),
                TextInput::make('vin'),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('currency')
                    ->required()
                    ->default('EUR'),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('mileage')
                    ->numeric(),
                TextInput::make('fuel_type'),
                TextInput::make('transmission'),
                TextInput::make('color'),
                TextInput::make('doors')
                    ->numeric(),
                TextInput::make('seats')
                    ->numeric(),
                TextInput::make('body_type'),
                TextInput::make('engine_size')
                    ->numeric(),
                TextInput::make('power_hp')
                    ->numeric(),
                TextInput::make('location_city'),
                TextInput::make('location_country')
                    ->required()
                    ->default('DE'),
                TextInput::make('status')
                    ->required()
                    ->default('draft'),
                TextInput::make('autoscout_listing_id'),
                Textarea::make('autoscout_data')
                    ->columnSpanFull(),
                Textarea::make('images')
                    ->columnSpanFull(),
                FileUpload::make('primary_image')
                    ->image(),
            ]);
    }
}
