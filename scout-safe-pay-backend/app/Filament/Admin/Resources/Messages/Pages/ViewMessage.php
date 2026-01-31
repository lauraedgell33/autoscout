<?php

namespace App\Filament\Admin\Resources\Messages\Pages;

use App\Filament\Admin\Resources\Messages\MessageResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Filament\Infolists;
use Filament\Forms;
use Filament\Schemas\Schema;

class ViewMessage extends ViewRecord
{
    protected static string $resource = MessageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('markRead')
                ->label('Mark as Read')
                ->icon('heroicon-o-envelope-open')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->markAsRead())
                ->visible(fn () => !$this->record->is_read),

            Actions\Action::make('reply')
                ->label('Reply')
                ->icon('heroicon-o-arrow-uturn-left')
                ->color('primary')
                ->form([
                    \Filament\Forms\Components\Textarea::make('message')
                        ->label('Reply Message')
                        ->required()
                        ->rows(4),
                ])
                ->action(function (array $data) {
                    \App\Models\Message::create([
                        'transaction_id' => $this->record->transaction_id,
                        'sender_id' => auth()->id(),
                        'receiver_id' => $this->record->sender_id,
                        'message' => $data['message'],
                        'is_system_message' => false,
                    ]);
                }),

            EditAction::make(),
            DeleteAction::make(),
        ];
    }

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                Infolists\Components\Section::make('Message Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('sender.name')
                            ->label('From'),
                        Infolists\Components\TextEntry::make('receiver.name')
                            ->label('To'),
                        Infolists\Components\TextEntry::make('transaction.id')
                            ->label('Transaction ID')
                            ->visible(fn ($record) => $record->transaction_id !== null),
                        Infolists\Components\TextEntry::make('is_read')
                            ->label('Status')
                            ->badge()
                            ->formatStateUsing(fn (bool $state): string => $state ? 'Read' : 'Unread')
                            ->color(fn (bool $state): string => $state ? 'success' : 'warning'),
                        Infolists\Components\TextEntry::make('is_system_message')
                            ->label('Type')
                            ->badge()
                            ->formatStateUsing(fn (bool $state): string => $state ? 'System Message' : 'User Message')
                            ->color(fn (bool $state): string => $state ? 'primary' : 'secondary'),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Sent At')
                            ->dateTime(),
                    ])->columns(3),

                Infolists\Components\Section::make('Message Content')
                    ->schema([
                        Infolists\Components\TextEntry::make('message')
                            ->label('Message')
                            ->prose()
                            ->columnSpanFull(),
                    ]),

                Infolists\Components\Section::make('Attachments')
                    ->schema([
                        Infolists\Components\TextEntry::make('attachments')
                            ->label('Files')
                            ->listWithLineBreaks()
                            ->columnSpanFull(),
                    ])
                    ->visible(fn ($record) => !empty($record->attachments)),

                Infolists\Components\Section::make('Timeline')
                    ->schema([
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Sent At')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('read_at')
                            ->label('Read At')
                            ->dateTime()
                            ->visible(fn ($record) => $record->read_at !== null),
                        Infolists\Components\TextEntry::make('updated_at')
                            ->label('Updated At')
                            ->dateTime(),
                    ])->columns(3)
                    ->collapsed(),
            ]);
    }

    protected function afterFill(): void
    {
        // Auto-mark as read when viewing
        if (!$this->record->is_read) {
            $this->record->markAsRead();
        }
    }
}
