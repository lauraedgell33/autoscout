<?php

namespace App\Filament\Admin\Resources\Dealers\Pages;

use App\Filament\Admin\Resources\Dealers\DealerResource;
use Barryvdh\DomPDF\Facade\Pdf;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditDealer extends EditRecord
{
    protected static string $resource = DealerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('download_pdf')
                ->label('Download Report PDF')
                ->icon('heroicon-o-document-text')
                ->color('danger')
                ->action(function () {
                    $dealer = $this->record;
                    $dealer->load(['transactions.buyer']);
                    
                    $pdf = Pdf::loadView('pdf.dealer-report', compact('dealer'));
                    
                    return response()->streamDownload(function () use ($pdf) {
                        echo $pdf->output();
                    }, 'dealer-report-' . $dealer->id . '-' . now()->format('Y-m-d') . '.pdf');
                }),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
