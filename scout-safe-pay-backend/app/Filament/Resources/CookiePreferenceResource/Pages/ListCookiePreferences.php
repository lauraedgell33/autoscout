<?php

namespace App\Filament\Resources\CookiePreferenceResource\Pages;

use App\Filament\Resources\CookiePreferenceResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Colors\Color;
use App\Services\CookieService;

class ListCookiePreferences extends ListRecords
{
    protected static string $resource = CookiePreferenceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('refresh_all')
                ->label('Refresh All Expiring')
                ->icon('heroicon-o-arrow-path')
                ->color(Color::Emerald)
                ->action(function (CookieService $cookieService) {
                    $count = $cookieService->autoRefreshPreferences();
                    \Filament\Notifications\Notification::make()
                        ->success()
                        ->title('Bulk refresh completed')
                        ->body("Refreshed {$count} cookie preferences.")
                        ->send();
                })
                ->requiresConfirmation(),
            Actions\Action::make('cleanup')
                ->label('Cleanup Expired')
                ->icon('heroicon-o-trash')
                ->color(Color::Red)
                ->action(function (CookieService $cookieService) {
                    $count = $cookieService->cleanupExpired();
                    \Filament\Notifications\Notification::make()
                        ->success()
                        ->title('Cleanup completed')
                        ->body("Removed {$count} expired preferences.")
                        ->send();
                })
                ->requiresConfirmation(),
            Actions\Action::make('statistics')
                ->label('Statistics')
                ->icon('heroicon-o-chart-bar')
                ->color(Color::Blue)
                ->modalContent(function (CookieService $cookieService) {
                    $stats = $cookieService->getStatistics();
                    return view('filament.resources.cookie-preference.statistics', compact('stats'));
                })
                ->modalSubmitAction(false)
                ->modalCancelActionLabel('Close'),
            Actions\CreateAction::make(),
        ];
    }
}
