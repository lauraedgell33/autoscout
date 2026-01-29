<?php

namespace App\Filament\Admin\Resources\Messages;

use App\Filament\Admin\Resources\Messages\Pages\CreateMessage;
use App\Filament\Admin\Resources\Messages\Pages\EditMessage;
use App\Filament\Admin\Resources\Messages\Pages\ListMessages;
use App\Filament\Admin\Resources\Messages\Pages\ViewMessage;
use App\Models\Message;
use Filament\Forms;
use Filament\Schemas\Schema as FilamentSchema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class MessageResource extends Resource
{
    protected static ?string $model = Message::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    
    protected static ?string $navigationLabel = 'Messages';
    
    protected static ?string $recordTitleAttribute = 'message';
    
    public static function getNavigationGroup(): ?string
    {
        return 'Communication';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 1;
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_read', false)
            ->where('is_system_message', false)
            ->count() ?: null;
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        $count = static::getModel()::where('is_read', false)->count();
        return $count > 20 ? 'danger' : ($count > 0 ? 'warning' : null);
    }

    public static function form(FilamentSchema $form): FilamentSchema
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Message Information')
                    ->schema([
                        Forms\Components\Select::make('transaction_id')
                            ->label('Transaction')
                            ->relationship('transaction', 'id')
                            ->searchable()
                            ->helperText('Optional: Link to a transaction'),

                        Forms\Components\Select::make('sender_id')
                            ->label('Sender')
                            ->relationship('sender', 'name')
                            ->searchable()
                            ->required(),

                        Forms\Components\Select::make('receiver_id')
                            ->label('Receiver')
                            ->relationship('receiver', 'name')
                            ->searchable()
                            ->required(),

                        Forms\Components\Textarea::make('message')
                            ->label('Message')
                            ->required()
                            ->rows(5)
                            ->maxLength(2000)
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Attachments')
                    ->schema([
                        Forms\Components\FileUpload::make('attachments')
                            ->label('Attachments')
                            ->multiple()
                            ->directory('message-attachments')
                            ->acceptedFileTypes(['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/zip'])
                            ->maxSize(5120)
                            ->maxFiles(5)
                            ->helperText('Upload files (max 5MB per file, up to 5 files)')
                            ->downloadable()
                            ->openable()
                            ->previewable(),
                    ]),

                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Toggle::make('is_read')
                            ->label('Marked as Read')
                            ->default(false),

                        Forms\Components\DateTimePicker::make('read_at')
                            ->label('Read At')
                            ->visible(fn (callable $get) => $get('is_read')),

                        Forms\Components\Toggle::make('is_system_message')
                            ->label('System Message')
                            ->default(false)
                            ->helperText('Automated message from system'),

                        Forms\Components\KeyValue::make('metadata')
                            ->label('Metadata')
                            ->helperText('Additional JSON data'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('sender.name')
                    ->label('From')
                    ->sortable()
                    ->searchable()
                    ->weight('bold')
                    ->description(fn (Message $record) => $record->sender?->email),

                Tables\Columns\IconColumn::make('arrow')
                    ->label('')
                    ->icon('heroicon-o-arrow-right')
                    ->color('gray'),

                Tables\Columns\TextColumn::make('receiver.name')
                    ->label('To')
                    ->sortable()
                    ->searchable()
                    ->description(fn (Message $record) => $record->receiver?->email),

                Tables\Columns\TextColumn::make('message')
                    ->label('Message')
                    ->limit(50)
                    ->wrap()
                    ->searchable(),

                Tables\Columns\TextColumn::make('transaction.id')
                    ->label('Transaction')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\IconColumn::make('is_read')
                    ->label('Read')
                    ->boolean()
                    ->trueIcon('heroicon-o-envelope-open')
                    ->falseIcon('heroicon-o-envelope')
                    ->trueColor('success')
                    ->falseColor('warning')
                    ->sortable(),

                Tables\Columns\IconColumn::make('attachments')
                    ->label('Files')
                    ->boolean()
                    ->trueIcon('heroicon-o-paper-clip')
                    ->falseIcon('heroicon-o-x-mark')
                    ->trueColor('info')
                    ->falseColor('gray')
                    ->getStateUsing(fn ($record) => !empty($record->attachments)),

                Tables\Columns\BadgeColumn::make('is_system_message')
                    ->label('Type')
                    ->formatStateUsing(fn (bool $state): string => $state ? 'System' : 'User')
                    ->colors([
                        'primary' => true,
                        'secondary' => false,
                    ])
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Sent')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->description(fn (Message $record) => $record->created_at->diffForHumans()),

                Tables\Columns\TextColumn::make('read_at')
                    ->label('Read')
                    ->dateTime('d M H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_read')
                    ->label('Read Status')
                    ->placeholder('All messages')
                    ->trueLabel('Read only')
                    ->falseLabel('Unread only'),

                Tables\Filters\TernaryFilter::make('is_system_message')
                    ->label('Message Type')
                    ->placeholder('All types')
                    ->trueLabel('System messages')
                    ->falseLabel('User messages'),

                Tables\Filters\SelectFilter::make('sender_id')
                    ->label('Sender')
                    ->relationship('sender', 'name')
                    ->searchable()
                    ->multiple(),

                Tables\Filters\SelectFilter::make('receiver_id')
                    ->label('Receiver')
                    ->relationship('receiver', 'name')
                    ->searchable()
                    ->multiple(),

                Tables\Filters\SelectFilter::make('transaction_id')
                    ->label('Transaction')
                    ->relationship('transaction', 'id')
                    ->searchable(),

                Tables\Filters\Filter::make('has_attachments')
                    ->label('Has Attachments')
                    ->query(fn (Builder $query) => $query->whereNotNull('attachments')->where('attachments', '!=', '[]')),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\Action::make('markRead')
                    ->label('Mark Read')
                    ->icon('heroicon-o-envelope-open')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn (Message $record) => $record->markAsRead())
                    ->visible(fn (Message $record) => !$record->is_read),

                Tables\Actions\Action::make('markUnread')
                    ->label('Mark Unread')
                    ->icon('heroicon-o-envelope')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->action(fn (Message $record) => $record->update([
                        'is_read' => false,
                        'read_at' => null,
                    ]))
                    ->visible(fn (Message $record) => $record->is_read),

                Tables\Actions\Action::make('reply')
                    ->label('Reply')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->color('primary')
                    ->form([
                        Forms\Components\Textarea::make('message')
                            ->label('Reply Message')
                            ->required()
                            ->rows(4),
                    ])
                    ->action(function (Message $record, array $data) {
                        Message::create([
                            'transaction_id' => $record->transaction_id,
                            'sender_id' => auth()->id(),
                            'receiver_id' => $record->sender_id,
                            'message' => $data['message'],
                            'is_system_message' => false,
                        ]);
                    }),

                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('markReadSelected')
                        ->label('Mark as Read')
                        ->icon('heroicon-o-envelope-open')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->markAsRead()),

                    Tables\Actions\BulkAction::make('markUnreadSelected')
                        ->label('Mark as Unread')
                        ->icon('heroicon-o-envelope')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update([
                            'is_read' => false,
                            'read_at' => null,
                        ])),

                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ])
            ->poll('30s');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMessages::route('/'),
            'create' => CreateMessage::route('/create'),
            'view' => ViewMessage::route('/{record}'),
            'edit' => EditMessage::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['message', 'sender.name', 'receiver.name'];
    }
}
