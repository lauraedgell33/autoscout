<?php

namespace App\Filament\Admin\Resources\Favorites;

use App\Filament\Admin\Resources\Favorites\Pages\ListFavorites;
use App\Models\Favorite;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class FavoriteResource extends Resource
{
    protected static ?string $model = Favorite::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-heart';

    protected static ?string $recordTitleAttribute = 'id';

    protected static ?string $navigationLabel = 'Favorites';

    protected static ?string $modelLabel = 'Favorite';

    protected static ?string $pluralModelLabel = 'Favorites';

    public static function getNavigationGroup(): ?string
    {
        return 'Marketplace';
    }

    public static function getNavigationSort(): ?int
    {
        return 3;
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['user.name', 'user.email', 'vehicle.make', 'vehicle.model'];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->sortable(),

                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('vehicle.make')
                    ->label('Vehicle Make')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('vehicle.model')
                    ->label('Vehicle Model')
                    ->searchable(),

                TextColumn::make('vehicle.year')
                    ->label('Year')
                    ->sortable(),

                TextColumn::make('vehicle.price')
                    ->label('Price')
                    ->money('EUR')
                    ->sortable(),

                TextColumn::make('vehicle.seller.name')
                    ->label('Seller')
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->label('Favorited At')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('user')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload(),
            ])
            ->actions([])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFavorites::route('/'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
