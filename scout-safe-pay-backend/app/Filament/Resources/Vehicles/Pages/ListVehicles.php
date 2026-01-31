<?php

namespace App\Filament\Resources\Vehicles\Pages;

use Filament\Forms;

use App\Filament\Resources\Vehicles\VehicleResource;
use App\Imports\VehiclesImport;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;
use Maatwebsite\Excel\Facades\Excel;

class ListVehicles extends ListRecords
{
    protected static string $resource = VehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('import')
                ->label('Import CSV')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('success')
                ->form([
                    FileUpload::make('file')
                        ->label('CSV File')
                        ->acceptedFileTypes(['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
                        ->required()
                        ->helperText('Upload a CSV/Excel file with columns: seller_id, dealer_id, make, model, year, vin, license_plate, mileage, fuel_type, transmission, color, price, description, status'),
                ])
                ->action(function (array $data) {
                    try {
                        Excel::import(new VehiclesImport, $data['file']);
                        
                        Notification::make()
                            ->success()
                            ->title('Vehicles Imported!')
                            ->body('Vehicles have been imported successfully.')
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
