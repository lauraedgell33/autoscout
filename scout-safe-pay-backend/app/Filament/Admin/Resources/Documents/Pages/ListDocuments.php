<?php

namespace App\Filament\Admin\Resources\Documents\Pages;

use App\Filament\Admin\Resources\Documents\DocumentResource;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;

class ListDocuments extends ListRecords
{
    protected static string $resource = DocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Documents')
                ->badge(fn () => $this->getModel()::count()),

            'active' => Tab::make('Active')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'active'))
                ->badge(fn () => $this->getModel()::where('status', 'active')->count())
                ->badgeColor('success'),

            'draft' => Tab::make('Draft')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'draft'))
                ->badge(fn () => $this->getModel()::where('status', 'draft')->count())
                ->badgeColor('secondary'),

            'expired' => Tab::make('Expired')
                ->modifyQueryUsing(fn (Builder $query) => 
                    $query->whereNotNull('expires_at')
                        ->whereDate('expires_at', '<', now())
                )
                ->badge(fn () => $this->getModel()::whereNotNull('expires_at')
                    ->whereDate('expires_at', '<', now())->count())
                ->badgeColor('danger'),

            'expiring_soon' => Tab::make('Expiring Soon')
                ->modifyQueryUsing(fn (Builder $query) => 
                    $query->whereNotNull('expires_at')
                        ->whereDate('expires_at', '<=', now()->addDays(30))
                        ->whereDate('expires_at', '>=', now())
                )
                ->badge(fn () => $this->getModel()::whereNotNull('expires_at')
                    ->whereDate('expires_at', '<=', now()->addDays(30))
                    ->whereDate('expires_at', '>=', now())->count())
                ->badgeColor('warning'),

            'contracts' => Tab::make('Contracts')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'contract'))
                ->badge(fn () => $this->getModel()::where('type', 'contract')->count())
                ->badgeColor('primary'),

            'certificates' => Tab::make('Certificates')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'certificate'))
                ->badge(fn () => $this->getModel()::where('type', 'certificate')->count())
                ->badgeColor('warning'),

            'archived' => Tab::make('Archived')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'archived'))
                ->badge(fn () => $this->getModel()::where('status', 'archived')->count())
                ->badgeColor('gray'),

            'trashed' => Tab::make('Trashed')
                ->modifyQueryUsing(fn (Builder $query) => $query->onlyTrashed())
                ->badge(fn () => $this->getModel()::onlyTrashed()->count())
                ->badgeColor('danger'),
        ];
    }
}
