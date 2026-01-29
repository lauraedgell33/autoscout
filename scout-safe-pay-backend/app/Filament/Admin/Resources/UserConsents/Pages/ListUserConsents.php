<?php

namespace App\Filament\Admin\Resources\UserConsents\Pages;

use App\Filament\Admin\Resources\UserConsents\UserConsentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;

class ListUserConsents extends ListRecords
{
    protected static string $resource = UserConsentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Consents')
                ->badge(fn () => $this->getModel()::count()),

            'given' => Tab::make('Given')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_given', true))
                ->badge(fn () => $this->getModel()::where('is_given', true)->count())
                ->badgeColor('success'),

            'withdrawn' => Tab::make('Withdrawn')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_given', false)->whereNotNull('withdrawn_at'))
                ->badge(fn () => $this->getModel()::where('is_given', false)->whereNotNull('withdrawn_at')->count())
                ->badgeColor('danger'),

            'marketing' => Tab::make('Marketing')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_marketing', true))
                ->badge(fn () => $this->getModel()::where('is_marketing', true)->count())
                ->badgeColor('info'),

            'required' => Tab::make('Required')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_required', true))
                ->badge(fn () => $this->getModel()::where('is_required', true)->count())
                ->badgeColor('warning'),

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

            'terms' => Tab::make('Terms & Conditions')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('consent_type', 'terms_and_conditions'))
                ->badge(fn () => $this->getModel()::where('consent_type', 'terms_and_conditions')->count())
                ->badgeColor('primary'),

            'privacy' => Tab::make('Privacy Policy')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('consent_type', 'privacy_policy'))
                ->badge(fn () => $this->getModel()::where('consent_type', 'privacy_policy')->count())
                ->badgeColor('primary'),

            'gdpr' => Tab::make('Data Processing')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('consent_type', 'data_processing'))
                ->badge(fn () => $this->getModel()::where('consent_type', 'data_processing')->count())
                ->badgeColor('success'),
        ];
    }
}
