<?php

namespace App\Filament\Admin\Resources\Inquiries;

use App\Filament\Admin\Resources\Inquiries\Pages\ListInquiries;
use App\Filament\Admin\Resources\Inquiries\Pages\ViewInquiry;
use App\Models\Inquiry;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Infolists\Components\IconEntry;
use Filament\Schemas\Components\Section as InfolistSection;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InquiryResource extends Resource
{
    protected static ?string $model = Inquiry::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $navigationLabel = 'Vehicle Inquiries';

    protected static ?string $pluralLabel = 'Vehicle Inquiries';

    protected static ?string $modelLabel = 'Inquiry';

    public static function getNavigationGroup(): ?string
    {
        return 'Communication';
    }

    public static function getNavigationSort(): ?int
    {
        return 0; // Before Messages
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'new')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'email', 'phone', 'message', 'vehicle.make', 'vehicle.model'];
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
                InfolistSection::make('Contact Information')
                    ->schema([
                        TextEntry::make('name')
                            ->label('Name'),
                        TextEntry::make('email')
                            ->label('Email')
                            ->copyable(),
                        TextEntry::make('phone')
                            ->label('Phone')
                            ->copyable(),
                        TextEntry::make('request_type')
                            ->label('Request Type')
                            ->badge()
                            ->formatStateUsing(fn ($state) => match($state) {
                                'inquiry' => 'General Inquiry',
                                'test-drive' => 'Test Drive Request',
                                'offer' => 'Make an Offer',
                                'inspection' => 'Inspection Request',
                                default => ucfirst($state),
                            }),
                    ])
                    ->columns(4),

                InfolistSection::make('Vehicle')
                    ->schema([
                        TextEntry::make('vehicle.make')
                            ->label('Make'),
                        TextEntry::make('vehicle.model')
                            ->label('Model'),
                        TextEntry::make('vehicle.year')
                            ->label('Year'),
                        TextEntry::make('vehicle.price')
                            ->label('Price')
                            ->money('EUR'),
                    ])
                    ->columns(4),

                InfolistSection::make('Message')
                    ->schema([
                        TextEntry::make('message')
                            ->label('')
                            ->columnSpanFull(),
                    ]),

                InfolistSection::make('Status')
                    ->schema([
                        TextEntry::make('status')
                            ->badge()
                            ->color(fn ($state) => match($state) {
                                'new' => 'warning',
                                'read' => 'info',
                                'replied' => 'success',
                                'closed' => 'gray',
                                default => 'gray',
                            }),
                        TextEntry::make('created_at')
                            ->label('Received At')
                            ->dateTime(),
                        TextEntry::make('read_at')
                            ->label('Read At')
                            ->dateTime()
                            ->placeholder('Not read yet'),
                        TextEntry::make('replied_at')
                            ->label('Replied At')
                            ->dateTime()
                            ->placeholder('Not replied yet'),
                    ])
                    ->columns(4),

                InfolistSection::make('Admin Notes')
                    ->schema([
                        TextEntry::make('admin_notes')
                            ->label('')
                            ->placeholder('No admin notes')
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->sortable(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn ($state) => match($state) {
                        'new' => 'warning',
                        'read' => 'info',
                        'replied' => 'success',
                        'closed' => 'gray',
                        default => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('name')
                    ->label('From')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('phone')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('vehicle.make')
                    ->label('Vehicle')
                    ->formatStateUsing(fn ($record) => $record->vehicle 
                        ? "{$record->vehicle->make} {$record->vehicle->model}" 
                        : 'N/A')
                    ->sortable(),

                TextColumn::make('request_type')
                    ->label('Type')
                    ->badge()
                    ->color('gray')
                    ->formatStateUsing(fn ($state) => match($state) {
                        'inquiry' => 'Inquiry',
                        'test-drive' => 'Test Drive',
                        'offer' => 'Offer',
                        'inspection' => 'Inspection',
                        default => ucfirst($state),
                    }),

                TextColumn::make('message')
                    ->limit(40)
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'new' => 'New',
                        'read' => 'Read',
                        'replied' => 'Replied',
                        'closed' => 'Closed',
                    ]),

                SelectFilter::make('request_type')
                    ->options([
                        'inquiry' => 'General Inquiry',
                        'test-drive' => 'Test Drive',
                        'offer' => 'Make an Offer',
                        'inspection' => 'Inspection',
                    ]),

                TrashedFilter::make(),
            ])
            ->actions([
                Action::make('markAsRead')
                    ->label('Mark Read')
                    ->icon('heroicon-o-eye')
                    ->color('info')
                    ->visible(fn ($record) => $record->status === 'new')
                    ->action(fn ($record) => $record->markAsRead()),

                Action::make('markAsReplied')
                    ->label('Mark Replied')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn ($record) => in_array($record->status, ['new', 'read']))
                    ->action(fn ($record) => $record->markAsReplied()),

                ActionGroup::make([
                    ViewAction::make(),
                    DeleteAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->poll('30s'); // Auto-refresh every 30 seconds
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListInquiries::route('/'),
            'view' => ViewInquiry::route('/{record}'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([SoftDeletingScope::class]);
    }
}
