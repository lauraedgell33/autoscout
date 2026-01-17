<?php

namespace App\Filament\Resources\TransactionResource\Pages;

use App\Filament\Resources\TransactionResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewTransaction extends ViewRecord
{
    protected static string $resource = TransactionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            
            Actions\Action::make('download_contract')
                ->label('Download Contract')
                ->icon('heroicon-o-document-arrow-down')
                ->color('info')
                ->url(fn () => route('api.contracts.download', $this->record))
                ->openUrlInNewTab(),

            Actions\Action::make('download_invoice')
                ->label('Download Invoice')
                ->icon('heroicon-o-receipt-percent')
                ->color('warning')
                ->url(fn () => route('api.invoices.download', $this->record))
                ->openUrlInNewTab(),

            Actions\Action::make('view_vehicle')
                ->label('View Vehicle')
                ->icon('heroicon-o-truck')
                ->url(fn () => url("/admin/vehicles/{$this->record->vehicle_id}"))
                ->color('gray'),
        ];
    }
}
