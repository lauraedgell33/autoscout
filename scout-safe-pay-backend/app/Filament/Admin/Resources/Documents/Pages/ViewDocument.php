<?php

namespace App\Filament\Admin\Resources\Documents\Pages;

use App\Filament\Admin\Resources\Documents\DocumentResource;
use Filament\Actions;
use Filament\Infolists;
use Filament\Schemas\Schema;
use Filament\Resources\Pages\ViewRecord;

class ViewDocument extends ViewRecord
{
    protected static string $resource = DocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('download')
                ->label('Download File')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('primary')
                ->url(fn () => $this->record->file_path ? asset('storage/' . $this->record->file_path) : '#')
                ->openUrlInNewTab()
                ->visible(fn () => !empty($this->record->file_path)),

            Actions\Action::make('preview')
                ->label('Preview')
                ->icon('heroicon-o-eye')
                ->color('info')
                ->modalContent(fn () => view('filament.modals.document-preview', [
                    'document' => $this->record,
                ]))
                ->modalWidth('4xl')
                ->visible(fn () => !empty($this->record->file_path) && 
                    in_array($this->record->mime_type, ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'])),

            Actions\Action::make('archive')
                ->label('Archive')
                ->icon('heroicon-o-archive-box')
                ->color('warning')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update(['status' => 'archived']))
                ->visible(fn () => $this->record->status !== 'archived'),

            Actions\Action::make('activate')
                ->label('Activate')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update(['status' => 'active']))
                ->visible(fn () => $this->record->status !== 'active'),

            EditAction::make(),
            DeleteAction::make(),
        ];
    }

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Infolists\Components\Section::make('Document Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('title')
                            ->label('Title')
                            ->weight('bold'),

                        Infolists\Components\TextEntry::make('type')
                            ->label('Type')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'contract' => 'primary',
                                'agreement' => 'success',
                                'invoice', 'receipt' => 'info',
                                'certificate', 'license' => 'warning',
                                default => 'secondary',
                            }),

                        Infolists\Components\TextEntry::make('status')
                            ->label('Status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'draft' => 'secondary',
                                'active' => 'success',
                                'archived' => 'warning',
                                'expired' => 'danger',
                                default => 'gray',
                            }),

                        Infolists\Components\TextEntry::make('version')
                            ->label('Version')
                            ->badge()
                            ->color('secondary'),

                        Infolists\Components\TextEntry::make('description')
                            ->label('Description')
                            ->columnSpanFull(),
                    ])->columns(2),

                Infolists\Components\Section::make('File Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('file_name')
                            ->label('File Name')
                            ->copyable(),

                        Infolists\Components\TextEntry::make('file_size')
                            ->label('File Size')
                            ->formatStateUsing(fn ($state) => $state ? round($state / 1024, 2) . ' MB' : 'N/A'),

                        Infolists\Components\TextEntry::make('mime_type')
                            ->label('File Type')
                            ->badge()
                            ->color('info'),

                        Infolists\Components\TextEntry::make('file_path')
                            ->label('Storage Path')
                            ->copyable()
                            ->visible(fn ($state) => !empty($state)),
                    ])->columns(2),

                Infolists\Components\Section::make('Related Entity')
                    ->schema([
                        Infolists\Components\TextEntry::make('documentable_type')
                            ->label('Related To')
                            ->formatStateUsing(fn ($state) => $state ? class_basename($state) : 'None'),

                        Infolists\Components\TextEntry::make('documentable_id')
                            ->label('Related ID')
                            ->formatStateUsing(fn ($state) => $state ?: 'N/A'),

                        Infolists\Components\TextEntry::make('documentable.name')
                            ->label('Related Name')
                            ->formatStateUsing(fn ($state) => $state ?: 'N/A')
                            ->visible(fn () => $this->record->documentable),
                    ])->columns(3),

                Infolists\Components\Section::make('Access & Security')
                    ->schema([
                        Infolists\Components\IconEntry::make('is_public')
                            ->label('Public Access')
                            ->boolean()
                            ->trueIcon('heroicon-o-check-circle')
                            ->falseIcon('heroicon-o-x-circle')
                            ->trueColor('success')
                            ->falseColor('danger'),

                        Infolists\Components\TextEntry::make('access_code')
                            ->label('Access Code')
                            ->formatStateUsing(fn ($state) => $state ? '••••••' : 'None')
                            ->copyable()
                            ->copyableState(fn ($state) => $state),

                        Infolists\Components\TextEntry::make('uploader.name')
                            ->label('Uploaded By'),

                        Infolists\Components\TextEntry::make('expires_at')
                            ->label('Expiration Date')
                            ->date('d M Y, H:i')
                            ->color(fn ($record) => 
                                $record->expires_at && $record->expires_at->isPast() ? 'danger' : 
                                ($record->expires_at && $record->expires_at->diffInDays() < 30 ? 'warning' : 'success')
                            )
                            ->badge()
                            ->formatStateUsing(fn ($state, $record) => 
                                $state ? 
                                    ($record->expires_at->isPast() ? 
                                        '⚠️ Expired: ' . $state->format('d M Y') : 
                                        $state->format('d M Y') . ' (' . $state->diffForHumans() . ')'
                                    ) : 
                                    'No expiration'
                            ),
                    ])->columns(2),

                Infolists\Components\Section::make('Internal Notes')
                    ->schema([
                        Infolists\Components\TextEntry::make('notes')
                            ->label('Notes')
                            ->formatStateUsing(fn ($state) => $state ?: 'No notes')
                            ->columnSpanFull(),
                    ])
                    ->collapsed(),

                Infolists\Components\Section::make('Metadata')
                    ->schema([
                        Infolists\Components\KeyValueEntry::make('metadata')
                            ->label('Additional Data')
                            ->columnSpanFull(),
                    ])
                    ->collapsed()
                    ->visible(fn () => !empty($this->record->metadata)),

                Infolists\Components\Section::make('System Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Created At')
                            ->dateTime('d M Y, H:i'),

                        Infolists\Components\TextEntry::make('updated_at')
                            ->label('Updated At')
                            ->dateTime('d M Y, H:i')
                            ->since(),

                        Infolists\Components\TextEntry::make('deleted_at')
                            ->label('Deleted At')
                            ->dateTime('d M Y, H:i')
                            ->visible(fn () => $this->record->trashed()),
                    ])->columns(3)
                    ->collapsed(),
            ]);
    }
}
