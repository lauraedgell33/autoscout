<?php

namespace App\Filament\Admin\Resources\UserConsents\Pages;

use App\Filament\Admin\Resources\UserConsents\UserConsentResource;
use App\Models\LegalDocument;
use App\Models\UserConsent;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;

class ListUserConsents extends ListRecords
{
    protected static string $resource = UserConsentResource::class;

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Consents')
                ->badge(fn () => UserConsent::count()),

            'active' => Tab::make('Active')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('accepted', true)->whereNull('revoked_at'))
                ->badge(fn () => UserConsent::where('accepted', true)->whereNull('revoked_at')->count())
                ->badgeColor('success'),

            'revoked' => Tab::make('Revoked')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereNotNull('revoked_at'))
                ->badge(fn () => UserConsent::whereNotNull('revoked_at')->count())
                ->badgeColor('danger'),

            'terms' => Tab::make('Terms of Service')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereHas('legalDocument', fn ($q) => $q->where('type', LegalDocument::TYPE_TERMS_OF_SERVICE)))
                ->badge(fn () => UserConsent::whereHas('legalDocument', fn ($q) => $q->where('type', LegalDocument::TYPE_TERMS_OF_SERVICE))->count())
                ->badgeColor('primary'),

            'privacy' => Tab::make('Privacy Policy')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereHas('legalDocument', fn ($q) => $q->where('type', LegalDocument::TYPE_PRIVACY_POLICY)))
                ->badge(fn () => UserConsent::whereHas('legalDocument', fn ($q) => $q->where('type', LegalDocument::TYPE_PRIVACY_POLICY))->count())
                ->badgeColor('info'),
        ];
    }
}
