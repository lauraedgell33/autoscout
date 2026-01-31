<?php

namespace App\Filament\Admin\Resources\Documents\Pages;

use App\Filament\Admin\Resources\Documents\DocumentResource;
use App\Models\Document;
use Filament\Actions;
use Filament\Schemas\Components\Tabs\Tab;
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
                ->badge(fn () => Document::count()),

            'verified' => Tab::make('Verified')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_verified', true))
                ->badge(fn () => Document::where('is_verified', true)->count())
                ->badgeColor('success'),

            'pending' => Tab::make('Pending Verification')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_verified', false))
                ->badge(fn () => Document::where('is_verified', false)->count())
                ->badgeColor('warning'),

            'contracts' => Tab::make('Contracts')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', Document::TYPE_SALES_CONTRACT))
                ->badge(fn () => Document::where('type', Document::TYPE_SALES_CONTRACT)->count())
                ->badgeColor('primary'),

            'vehicle_docs' => Tab::make('Vehicle Documents')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereIn('type', [
                    Document::TYPE_VEHICLE_REGISTRATION,
                    Document::TYPE_INSPECTION_REPORT,
                    Document::TYPE_OWNERSHIP_CERTIFICATE,
                ]))
                ->badge(fn () => Document::whereIn('type', [
                    Document::TYPE_VEHICLE_REGISTRATION,
                    Document::TYPE_INSPECTION_REPORT,
                    Document::TYPE_OWNERSHIP_CERTIFICATE,
                ])->count())
                ->badgeColor('info'),

            'trashed' => Tab::make('Trashed')
                ->modifyQueryUsing(fn (Builder $query) => $query->onlyTrashed())
                ->badge(fn () => Document::onlyTrashed()->count())
                ->badgeColor('danger'),
        ];
    }
}
