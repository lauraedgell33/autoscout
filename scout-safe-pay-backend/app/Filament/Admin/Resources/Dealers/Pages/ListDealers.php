<?php

namespace App\Filament\Admin\Resources\Dealers\Pages;

use App\Filament\Admin\Resources\Dealers\DealerResource;
use App\Imports\DealersImport;
use App\Exports\DealersExport;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;
use Maatwebsite\Excel\Facades\Excel;

class ListDealers extends ListRecords
{
    protected static string $resource = DealerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('export')
                ->label('Export CSV')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('info')
                ->action(function () {
                    return Excel::download(new DealersExport, 'dealers_' . date('Y-m-d') . '.xlsx');
                }),
            Action::make('import')
                ->label('Import CSV')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('success')
                ->form([
                    FileUpload::make('file')
                        ->label('CSV File')
                        ->acceptedFileTypes(['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
                        ->required()
                        ->helperText('Upload a CSV/Excel file with columns: name, company_name, vat_number, email, phone, address, city, postal_code, country, status, is_verified, commission_rate'),
                ])
                ->action(function (array $data) {
                    try {
                        Excel::import(new DealersImport, $data['file']);
                        
                        Notification::make()
                            ->success()
                            ->title('Dealers Imported!')
                            ->body('Dealers have been imported successfully.')
                            ->send();
                    } catch (\Exception $e) {
                        Notification::make()
                            ->danger()
                            ->title('Import Failed')
                            ->body('Error: ' . $e->getMessage())
                            ->send();
                    }
                }),
            CreateAction::make(),
        ];
    }
}
