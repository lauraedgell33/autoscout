<?php

namespace App\Filament\Resources\CookiePreferenceResource\Pages;

use App\Filament\Resources\CookiePreferenceResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCookiePreference extends EditRecord
{
    protected static string $resource = CookiePreferenceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('refresh')
                ->label('Refresh Expiration')
                ->icon('heroicon-o-arrow-path')
                ->action(function () {
                    $this->record->refresh();
                    \Filament\Notifications\Notification::make()
                        ->success()
                        ->title('Preference refreshed')
                        ->body('Expiration date extended by 1 year.')
                        ->send();
                })
                ->requiresConfirmation(),
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
