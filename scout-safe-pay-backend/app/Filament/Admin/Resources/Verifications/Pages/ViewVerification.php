<?php

namespace App\Filament\Admin\Resources\Verifications\Pages;

use Filament\Forms;

use App\Filament\Admin\Resources\Verifications\VerificationResource;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewVerification extends ViewRecord
{
    protected static string $resource = VerificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('approve')
                ->label('Approve')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn () => in_array($this->record->status, ['pending', 'in_review']))
                ->action(function () {
                    $this->record->update([
                        'status' => 'approved',
                        'reviewed_by' => auth()->id(),
                        'reviewed_at' => now(),
                        'expires_at' => now()->addYear(),
                    ]);

                    if ($this->record->type === 'identity' && $this->record->user) {
                        $this->record->user->update([
                            'kyc_status' => 'verified',
                            'kyc_verified_at' => now(),
                            'kyc_verified_by' => auth()->id(),
                            'is_verified' => true,
                        ]);
                    }

                    Notification::make()
                        ->title('Verification Approved')
                        ->success()
                        ->send();

                    $this->refreshFormData(['status', 'reviewed_by', 'reviewed_at', 'expires_at']);
                }),

            Action::make('reject')
                ->label('Reject')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->requiresConfirmation()
                ->form([
                    Textarea::make('rejection_reason')
                        ->label('Rejection Reason')
                        ->required()
                        ->rows(3),
                ])
                ->visible(fn () => in_array($this->record->status, ['pending', 'in_review']))
                ->action(function (array $data) {
                    $this->record->update([
                        'status' => 'rejected',
                        'rejection_reason' => $data['rejection_reason'],
                        'reviewed_by' => auth()->id(),
                        'reviewed_at' => now(),
                    ]);

                    if ($this->record->type === 'identity' && $this->record->user) {
                        $this->record->user->update([
                            'kyc_status' => 'rejected',
                            'kyc_rejection_reason' => $data['rejection_reason'],
                        ]);
                    }

                    Notification::make()
                        ->title('Verification Rejected')
                        ->danger()
                        ->send();

                    $this->refreshFormData(['status', 'rejection_reason', 'reviewed_by', 'reviewed_at']);
                }),
        ];
    }
}
