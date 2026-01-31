<?php

namespace App\Filament\Admin\Resources\Messages;

use App\Filament\Admin\Resources\Messages\Pages\ListMessages;
use App\Filament\Admin\Resources\Messages\Pages\ViewMessage;
use App\Models\Message;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\Section as InfolistSection;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class MessageResource extends Resource
{
    protected static ?string $model = Message::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?string $recordTitleAttribute = 'message';

    public static function getNavigationGroup(): ?string
    {
        return 'Communication';
    }

    public static function getNavigationSort(): ?int
    {
        return 1;
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['message', 'sender.name', 'receiver.name', 'transaction.transaction_code'];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                InfolistSection::make('Message Details')
                    ->schema([
                        TextEntry::make('transaction.transaction_code')
                            ->label('Transaction'),
                        TextEntry::make('sender.name')
                            ->label('From'),
                        TextEntry::make('receiver.name')
                            ->label('To'),
                        TextEntry::make('message')
                            ->columnSpanFull(),
                        IconEntry::make('is_read')
                            ->boolean()
                            ->label('Read'),
                        TextEntry::make('read_at')
                            ->dateTime()
                            ->label('Read At'),
                        IconEntry::make('is_system_message')
                            ->boolean()
                            ->label('System Message'),
                        TextEntry::make('created_at')
                            ->dateTime(),
                    ])
                    ->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->sortable(),

                TextColumn::make('transaction.transaction_code')
                    ->label('Transaction')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('sender.name')
                    ->label('From')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('receiver.name')
                    ->label('To')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('message')
                    ->limit(50)
                    ->searchable(),

                IconColumn::make('is_read')
                    ->boolean()
                    ->label('Read'),

                IconColumn::make('is_system_message')
                    ->boolean()
                    ->label('System'),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                TernaryFilter::make('is_read')
                    ->label('Read Status'),

                TernaryFilter::make('is_system_message')
                    ->label('System Messages'),

                SelectFilter::make('transaction')
                    ->relationship('transaction', 'transaction_code')
                    ->searchable()
                    ->preload(),

                TrashedFilter::make(),
            ])
            ->actions([
                ActionGroup::make([
                    ViewAction::make(),
                    DeleteAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMessages::route('/'),
            'view' => ViewMessage::route('/{record}'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([SoftDeletingScope::class]);
    }
}
