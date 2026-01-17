<?php

namespace App\Filament\Resources\PaymentVerificationResource\Pages;

use App\Filament\Resources\PaymentVerificationResource;
use App\Notifications\PaymentReceivedNotification;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewPaymentVerification extends ViewRecord
{
    protected static string $resource = PaymentVerificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('verify')
                ->label('Verify Payment')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->modalHeading('Verify Payment')
                ->modalDescription(fn () => 
                    'Verify payment of €' . number_format($this->record->amount, 2) . 
                    ' for this transaction?'
                )
                ->action(function () {
                    $this->record->update([
                        'status' => 'payment_received',
                        'payment_verified_at' => now(),
                    ]);

                    $this->record->buyer->notify(new PaymentReceivedNotification($this->record));

                    \Filament\Notifications\Notification::make()
                        ->title('Payment Verified Successfully')
                        ->success()
                        ->body('The buyer has been notified via email.')
                        ->send();

                    $this->redirect(PaymentVerificationResource::getUrl('index'));
                })
                ->visible(fn () => $this->record->status === 'pending'),

            Actions\Action::make('back')
                ->label('Back to List')
                ->url(PaymentVerificationResource::getUrl('index'))
                ->color('gray'),
        ];
    }
}
