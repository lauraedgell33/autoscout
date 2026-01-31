<?php

namespace App\Filament\Admin\Resources\UserConsents\Pages;

use App\Filament\Admin\Resources\UserConsents\UserConsentResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewUserConsent extends ViewRecord
{
    protected static string $resource = UserConsentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('revoke')
                ->label('Revoke Consent')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->requiresConfirmation()
                ->visible(fn () => $this->record->isActive())
                ->action(function () {
                    $this->record->update(['revoked_at' => now()]);
                    Notification::make()
                        ->title('Consent revoked')
                        ->warning()
                        ->send();
                }),

            DeleteAction::make(),
        ];
    }
}
