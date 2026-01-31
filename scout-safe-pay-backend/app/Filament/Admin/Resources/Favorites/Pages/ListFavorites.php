<?php

namespace App\Filament\Admin\Resources\Favorites\Pages;

use App\Filament\Admin\Resources\Favorites\FavoriteResource;
use Filament\Resources\Pages\ListRecords;

class ListFavorites extends ListRecords
{
    protected static string $resource = FavoriteResource::class;
}
