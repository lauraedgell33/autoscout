<?php

namespace App\Filament\Admin\Resources\Users\Pages;

use App\Filament\Admin\Resources\Users\UserResource;
use App\Imports\UsersImport;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;
use Maatwebsite\Excel\Facades\Excel;

class ListUsers extends ListRecords
{
    protected static string $resource = UserResource::class;

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
                        ->helperText('Upload a CSV/Excel file with columns: name, email, password (optional, defaults to "password"), phone, user_type (buyer/seller/dealer/admin), is_verified (0/1)'),
                ])
                ->action(function (array $data) {
                    try {
                        Excel::import(new UsersImport, $data['file']);
                        
                        Notification::make()
                            ->success()
                            ->title('Users Imported!')
                            ->body('Users have been imported successfully.')
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
