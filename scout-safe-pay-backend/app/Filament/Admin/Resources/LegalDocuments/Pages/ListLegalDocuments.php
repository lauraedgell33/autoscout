<?php

namespace App\Filament\Admin\Resources\LegalDocuments\Pages;

use App\Filament\Admin\Resources\LegalDocuments\LegalDocumentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords\Tab;
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
                ->badge(fn () => $this->getModel()::count()),

            'active' => Tab::make('Active')
                ->modifyQueryUsing(fn (Builder $query) => 
                    $query->where('status', 'active')
                        ->where('effective_from', '<=', now())
                        ->where(fn ($q) => $q->whereNull('effective_until')->orWhere('effective_until', '>=', now()))
                )
                ->badge(fn () => $this->getModel()::where('status', 'active')
                    ->where('effective_from', '<=', now())
                    ->where(fn ($q) => $q->whereNull('effective_until')->orWhere('effective_until', '>=', now()))
                    ->count())
                ->badgeColor('success'),

            'draft' => Tab::make('Draft')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'draft'))
                ->badge(fn () => $this->getModel()::where('status', 'draft')->count())
                ->badgeColor('warning'),

            'review' => Tab::make('Under Review')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'review'))
                ->badge(fn () => $this->getModel()::where('status', 'review')->count())
                ->badgeColor('info'),

            'terms' => Tab::make('Terms & Conditions')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'terms'))
                ->badge(fn () => $this->getModel()::where('type', 'terms')->count())
                ->badgeColor('primary'),

            'privacy' => Tab::make('Privacy Policy')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'privacy'))
                ->badge(fn () => $this->getModel()::where('type', 'privacy')->count())
                ->badgeColor('success'),

            'cookies' => Tab::make('Cookie Policy')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'cookies'))
                ->badge(fn () => $this->getModel()::where('type', 'cookies')->count())
                ->badgeColor('warning'),

            'gdpr' => Tab::make('GDPR')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'gdpr'))
                ->badge(fn () => $this->getModel()::where('type', 'gdpr')->count())
                ->badgeColor('info'),

            'archived' => Tab::make('Archived')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'archived'))
                ->badge(fn () => $this->getModel()::where('status', 'archived')->count())
                ->badgeColor('gray'),
        ];
    }
}
