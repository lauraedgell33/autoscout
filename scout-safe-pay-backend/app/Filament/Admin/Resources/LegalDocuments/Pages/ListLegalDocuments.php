<?php

namespace App\Filament\Admin\Resources\LegalDocuments\Pages;

use App\Filament\Admin\Resources\LegalDocuments\LegalDocumentResource;
use App\Models\LegalDocument;
use Filament\Actions;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;

class ListLegalDocuments extends ListRecords
{
    protected static string $resource = LegalDocumentResource::class;

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
                ->badge(fn () => LegalDocument::count()),

            'active' => Tab::make('Active')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_active', true))
                ->badge(fn () => LegalDocument::where('is_active', true)->count())
                ->badgeColor('success'),

            'inactive' => Tab::make('Inactive')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_active', false))
                ->badge(fn () => LegalDocument::where('is_active', false)->count())
                ->badgeColor('warning'),

            'terms' => Tab::make('Terms of Service')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', LegalDocument::TYPE_TERMS_OF_SERVICE))
                ->badge(fn () => LegalDocument::where('type', LegalDocument::TYPE_TERMS_OF_SERVICE)->count())
                ->badgeColor('primary'),

            'privacy' => Tab::make('Privacy Policy')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', LegalDocument::TYPE_PRIVACY_POLICY))
                ->badge(fn () => LegalDocument::where('type', LegalDocument::TYPE_PRIVACY_POLICY)->count())
                ->badgeColor('info'),

            'cookies' => Tab::make('Cookie Policy')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', LegalDocument::TYPE_COOKIE_POLICY))
                ->badge(fn () => LegalDocument::where('type', LegalDocument::TYPE_COOKIE_POLICY)->count())
                ->badgeColor('warning'),
        ];
    }
}
