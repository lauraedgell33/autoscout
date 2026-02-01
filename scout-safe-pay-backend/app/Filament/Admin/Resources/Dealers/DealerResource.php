<?php

namespace App\Filament\Admin\Resources\Dealers;

use App\Filament\Admin\Resources\Dealers\Pages\CreateDealer;
use App\Filament\Admin\Resources\Dealers\Pages\EditDealer;
use App\Filament\Admin\Resources\Dealers\Pages\ListDealers;
use App\Filament\Admin\Resources\Dealers\Schemas\DealerForm;
use App\Filament\Admin\Resources\Dealers\Tables\DealersTable;
use App\Models\Dealer;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DealerResource extends Resource
{
    protected static ?string $model = Dealer::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-building-storefront';
    
    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $modelLabel = 'Dealer';

    protected static ?string $pluralModelLabel = 'Dealers';
    
    public static function getNavigationGroup(): ?string
    {
        return 'Management';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 4;
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }
    
    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'company_name', 'email', 'vat_number'];
    }

    public static function form(Schema $schema): Schema
    {
        return DealerForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DealersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\UsersRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListDealers::route('/'),
            'create' => CreateDealer::route('/create'),
            'edit' => EditDealer::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
