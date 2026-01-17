<?php

namespace App\Filament\Resources\KYCVerificationResource\Pages;

use App\Filament\Resources\KYCVerificationResource;
use Filament\Resources\Pages\ViewRecord;
use Filament\Actions;

class ViewKYCVerification extends ViewRecord
{
    protected static string $resource = KYCVerificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('approve')
                ->label('Approve KYC')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update([
                    'kyc_status' => 'approved',
                    'kyc_verified_at' => now(),
                ]))
                ->visible(fn () => $this->record->kyc_status === 'pending'),

            Actions\Action::make('reject')
                ->label('Reject KYC')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->form([
                    \Filament\Forms\Components\Textarea::make('reason')
                        ->label('Rejection Reason')
                        ->required(),
                ])
                ->action(fn (array $data) => $this->record->update([
                    'kyc_status' => 'rejected',
                    'kyc_rejection_reason' => $data['reason'],
                ]))
                ->visible(fn () => $this->record->kyc_status === 'pending'),
        ];
    }
}
