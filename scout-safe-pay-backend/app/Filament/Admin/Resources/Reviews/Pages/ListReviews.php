<?php

namespace App\Filament\Admin\Resources\Reviews\Pages;

use App\Filament\Admin\Resources\Reviews\ReviewResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListReviews extends ListRecords
{
    protected static string $resource = ReviewResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All')
                ->badge(fn () => \App\Models\Review::count()),
            
            'pending' => Tab::make('Pending')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'pending'))
                ->badge(fn () => \App\Models\Review::where('status', 'pending')->count())
                ->badgeColor('warning'),
            
            'approved' => Tab::make('Approved')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'approved'))
                ->badge(fn () => \App\Models\Review::where('status', 'approved')->count())
                ->badgeColor('success'),
            
            'rejected' => Tab::make('Rejected')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'rejected'))
                ->badge(fn () => \App\Models\Review::where('status', 'rejected')->count())
                ->badgeColor('danger'),
            
            'flagged' => Tab::make('Flagged')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'flagged'))
                ->badge(fn () => \App\Models\Review::where('status', 'flagged')->count())
                ->badgeColor('info'),
            
            'low_ratings' => Tab::make('Low Ratings')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereIn('rating', [1, 2]))
                ->badge(fn () => \App\Models\Review::whereIn('rating', [1, 2])->count())
                ->badgeColor('danger'),
            
            'high_ratings' => Tab::make('High Ratings')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereIn('rating', [4, 5]))
                ->badge(fn () => \App\Models\Review::whereIn('rating', [4, 5])->count())
                ->badgeColor('success'),
        ];
    }
}
