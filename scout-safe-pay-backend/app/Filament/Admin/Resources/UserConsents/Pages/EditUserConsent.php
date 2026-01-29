<?php

namespace App\Filament\Admin\Resources\UserConsents\Pages;

use App\Filament\Admin\Resources\UserConsents\UserConsentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserConsent extends EditRecord
{
    protected static string $resource = UserConsentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('withdraw')
                ->label('Withdraw Consent')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->form([
                    \Filament\Forms\Components\Textarea::make('withdrawal_reason')
                        ->label('Reason for Withdrawal')
                        ->required()
                        ->rows(3),
                ])
                ->action(function (array $data) {
                    $this->record->update([
                        'is_given' => false,
                        'withdrawn_at' => now(),
                        'withdrawal_reason' => $data['withdrawal_reason'],
                    ]);
                    $this->notify('success', 'Consent withdrawn successfully');
                })
                ->visible(fn () => $this->record->is_given),

            Actions\Action::make('renew')
                ->label('Renew Consent')
                ->icon('heroicon-o-arrow-path')
                ->color('success')
                ->requiresConfirmation()
                ->action(function () {
                    $this->record->update([
                        'is_given' => true,
                        'given_at' => now(),
                        'withdrawn_at' => null,
                        'withdrawal_reason' => null,
                        'expires_at' => now()->addYear(),
                    ]);
                    $this->notify('success', 'Consent renewed successfully');
                })
                ->visible(fn () => !$this->record->is_given),

            Actions\Action::make('export')
                ->label('Export Consent Record')
                ->icon('heroicon-o-document-arrow-down')
                ->color('info')
                ->action(function () {
                    // TODO: Implement consent record export (GDPR requirement)
                    $this->notify('info', 'Export feature coming soon');
                }),

            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Update given_at when consent is re-given
        if ($data['is_given'] && !$this->record->is_given) {
            $data['given_at'] = now();
            $data['withdrawn_at'] = null;
            $data['withdrawal_reason'] = null;
        }

        // Update withdrawn_at when consent is withdrawn
        if (!$data['is_given'] && $this->record->is_given) {
            $data['withdrawn_at'] = now();
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('view', ['record' => $this->getRecord()]);
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Consent updated successfully';
    }
}
