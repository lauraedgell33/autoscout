<?php

namespace App\Filament\Admin\Resources\Dealers;

use App\Filament\Admin\Resources\Dealers\Pages\CreateDealer;
use App\Filament\Admin\Resources\Dealers\Pages\EditDealer;
use App\Filament\Admin\Resources\Dealers\Pages\ListDealers;
use App\Filament\Admin\Resources\Dealers\Schemas\DealerForm;
use App\Filament\Admin\Resources\Dealers\Tables\DealersTable;
use App\Models\Dealer;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DealerResource extends Resource
{
    protected static ?string $model = Dealer::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    
    protected static ?string $recordTitleAttribute = 'name';
    
    public static function getNavigationGroup(): ?string
    {
        return 'Management';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 1;
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
