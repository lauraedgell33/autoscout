<?php

namespace App\Filament\Admin\Resources\Dealers\RelationManagers;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class UsersRelationManager extends RelationManager
{
    protected static string $relationship = 'users';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                    
                TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                    
                TextInput::make('phone')
                    ->tel()
                    ->maxLength(20),
                    
                Select::make('user_type')
                    ->options([
                        'buyer' => 'Buyer',
                        'seller' => 'Seller',
                        'dealer' => 'Dealer',
                        'admin' => 'Admin',
                    ])
                    ->required(),
                    
                Select::make('status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                        'suspended' => 'Suspended',
                        'banned' => 'Banned',
                    ])
                    ->default('active')
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                    
                TextColumn::make('email')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-m-envelope'),
                    
                TextColumn::make('phone')
                    ->searchable()
                    ->icon('heroicon-m-phone')
                    ->default('-'),
                    
                TextColumn::make('user_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'admin' => '👑 Admin',
                        'dealer' => '🏢 Dealer',
                        'seller' => '📤 Seller',
                        'buyer' => '🛒 Buyer',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'dealer' => 'warning',
                        'seller' => 'info',
                        'buyer' => 'success',
                        default => 'gray',
                    }),
                    
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'active' => '✅ Active',
                        'inactive' => '⚫ Inactive',
                        'suspended' => '⚠️ Suspended',
                        'banned' => '🚫 Banned',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'inactive' => 'gray',
                        'suspended' => 'warning',
                        'banned' => 'danger',
                        default => 'gray',
                    }),
                    
                IconColumn::make('email_verified_at')
                    ->boolean()
                    ->label('Verified'),
                    
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->since()
                    ->label('Member Since'),
            ])
            ->filters([
                SelectFilter::make('user_type')
                    ->options([
                        'buyer' => 'Buyer',
                        'seller' => 'Seller',
                        'dealer' => 'Dealer',
                        'admin' => 'Admin',
                    ]),
                SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                        'suspended' => 'Suspended',
                        'banned' => 'Banned',
                    ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
