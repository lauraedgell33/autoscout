<?php

namespace App\Filament\Resources\PaymentVerificationResource\Pages;

use App\Filament\Resources\PaymentVerificationResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions;

class ListPaymentVerifications extends ListRecords
{
    protected static string $resource = PaymentVerificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('refresh')
                ->label('Refresh')
                ->icon('heroicon-o-arrow-path')
                ->action(fn () => $this->redirect(static::getUrl())),
        ];
    }
}
