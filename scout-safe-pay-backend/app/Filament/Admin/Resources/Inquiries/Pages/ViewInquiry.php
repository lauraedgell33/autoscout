<?php

namespace App\Filament\Admin\Resources\Inquiries\Pages;

use App\Filament\Admin\Resources\Inquiries\InquiryResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewInquiry extends ViewRecord
{
    protected static string $resource = InquiryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('markAsRead')
                ->label('Mark as Read')
                ->icon('heroicon-o-eye')
                ->color('info')
                ->visible(fn () => $this->record->status === 'new')
                ->action(fn () => $this->record->markAsRead()),

            Actions\Action::make('markAsReplied')
                ->label('Mark as Replied')
                ->icon('heroicon-o-check')
                ->color('success')
                ->visible(fn () => in_array($this->record->status, ['new', 'read']))
                ->action(fn () => $this->record->markAsReplied()),

            Actions\Action::make('emailReply')
                ->label('Reply via Email')
                ->icon('heroicon-o-envelope')
                ->color('primary')
                ->url(fn () => 'mailto:' . $this->record->email . '?subject=Re: Your inquiry about ' . urlencode($this->record->vehicle->make . ' ' . $this->record->vehicle->model))
                ->openUrlInNewTab(),

            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Mark as read when viewing
        if ($this->record->status === 'new') {
            $this->record->markAsRead();
        }

        return $data;
    }
}
