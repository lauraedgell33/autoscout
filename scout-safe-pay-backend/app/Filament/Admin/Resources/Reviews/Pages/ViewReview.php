<?php

namespace App\Filament\Admin\Resources\Reviews\Pages;

use App\Filament\Admin\Resources\Reviews\ReviewResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Filament\Infolists;
use Filament\Schemas\Schema;

class ViewReview extends ViewRecord
{
    protected static string $resource = ReviewResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('approve')
                ->label('Approve Review')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update(['status' => 'approved']))
                ->visible(fn () => $this->record->status !== 'approved'),

            Actions\Action::make('reject')
                ->label('Reject Review')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update(['status' => 'rejected']))
                ->visible(fn () => $this->record->status !== 'rejected'),

            Actions\EditAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    public function infolist(Schema $schema): Schema
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Review Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('reviewer.name')
                            ->label('Reviewer'),
                        Infolists\Components\TextEntry::make('reviewee.name')
                            ->label('Reviewee'),
                        Infolists\Components\TextEntry::make('rating')
                            ->label('Rating')
                            ->formatStateUsing(fn (int $state): string => str_repeat('⭐', $state)),
                        Infolists\Components\TextEntry::make('review_type')
                            ->label('Type')
                            ->badge(),
                        Infolists\Components\TextEntry::make('comment')
                            ->label('Comment')
                            ->columnSpanFull(),
                    ])->columns(2),

                Infolists\Components\Section::make('Transaction & Vehicle')
                    ->schema([
                        Infolists\Components\TextEntry::make('transaction.id')
                            ->label('Transaction ID'),
                        Infolists\Components\TextEntry::make('vehicle.make')
                            ->label('Vehicle')
                            ->formatStateUsing(fn ($record) => $record->vehicle ? 
                                "{$record->vehicle->make} {$record->vehicle->model} ({$record->vehicle->year})" : 
                                'N/A'),
                    ])->columns(2),

                Infolists\Components\Section::make('Moderation')
                    ->schema([
                        Infolists\Components\TextEntry::make('status')
                            ->label('Status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'pending' => 'warning',
                                'approved' => 'success',
                                'rejected' => 'danger',
                                'flagged' => 'info',
                                default => 'gray',
                            }),
                        Infolists\Components\TextEntry::make('admin_note')
                            ->label('Admin Note')
                            ->columnSpanFull()
                            ->visible(fn ($record) => !empty($record->admin_note)),
                    ])->columns(2),

                Infolists\Components\Section::make('Timestamps')
                    ->schema([
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Created At')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('updated_at')
                            ->label('Updated At')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('deleted_at')
                            ->label('Deleted At')
                            ->dateTime()
                            ->visible(fn ($record) => $record->deleted_at !== null),
                    ])->columns(3),
            ]);
    }
}
