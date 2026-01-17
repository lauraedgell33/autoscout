<?php

namespace App\Filament\Admin\Resources\Transactions\Pages;

use App\Filament\Admin\Resources\Transactions\TransactionResource;
use App\Imports\TransactionsImport;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;
use Maatwebsite\Excel\Facades\Excel;

class ListTransactions extends ListRecords
{
    protected static string $resource = TransactionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('import')
                ->label('Import CSV')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('gray')
                ->form([
                    FileUpload::make('file')
                        ->label('CSV File')
                        ->acceptedFileTypes(['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
                        ->required()
                        ->helperText('Upload a CSV/Excel file with columns: transaction_code (optional), buyer_id, seller_id, dealer_id, vehicle_id, amount, commission_rate, payment_method, status, notes'),
                ])
                ->action(function (array $data) {
                    try {
                        Excel::import(new TransactionsImport, $data['file']);
                        
                        Notification::make()
                            ->success()
                            ->title('Transactions Imported!')
                            ->body('Transactions have been imported successfully.')
                            ->send();
                    } catch (\Exception $e) {
                        Notification::make()
                            ->danger()
                            ->title('Import Failed')
                            ->body('Error: ' . $e->getMessage())
                            ->send();
                    }
                }),
            Action::make('wizard')
                ->label('New Transaction (Wizard)')
                ->icon('heroicon-o-sparkles')
                ->color('success')
                ->url(TransactionResource::getUrl('wizard')),
            CreateAction::make()
                ->label('Quick Create'),
        ];
    }
}
