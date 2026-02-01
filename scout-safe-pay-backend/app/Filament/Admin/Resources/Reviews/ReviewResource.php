<?php

namespace App\Filament\Admin\Resources\Reviews;

use App\Filament\Admin\Resources\Reviews\Pages\CreateReview;
use App\Filament\Admin\Resources\Reviews\Pages\EditReview;
use App\Filament\Admin\Resources\Reviews\Pages\ListReviews;
use App\Filament\Admin\Resources\Reviews\Pages\ViewReview;
use App\Models\Review;
use App\Models\User;
use Filament\Schemas;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\Section as InfolistSection;
use Filament\Resources\Resource;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\RestoreAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-star';

    protected static ?string $recordTitleAttribute = 'id';

    protected static ?string $modelLabel = 'Review';

    protected static ?string $pluralModelLabel = 'Reviews';

    public static function getNavigationGroup(): ?string
    {
        return 'Marketplace';
    }

    public static function getNavigationSort(): ?int
    {
        return 2;
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('moderation_status', 'pending')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['reviewer.name', 'reviewee.name', 'comment'];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Review Details Section
                Schemas\Components\Section::make('Review Details')
                    ->icon('heroicon-o-star')
                    ->schema([
                        Schemas\Components\Grid::make(4)->schema([
                            Forms\Components\Select::make('reviewer_id')
                                ->label('Reviewer')
                                ->relationship('reviewer', 'name')
                                ->searchable()
                                ->preload()
                                ->required(),

                            Forms\Components\Select::make('reviewee_id')
                                ->label('Reviewee')
                                ->relationship('reviewee', 'name')
                                ->searchable()
                                ->preload()
                                ->required(),

                            Forms\Components\Select::make('transaction_id')
                                ->label('Transaction')
                                ->relationship('transaction', 'transaction_code')
                                ->searchable()
                                ->preload(),

                            Forms\Components\Select::make('vehicle_id')
                                ->label('Vehicle')
                                ->relationship('vehicle', 'id')
                                ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->make} {$record->model} ({$record->year})")
                                ->searchable()
                                ->preload(),
                        ]),
                        Schemas\Components\Grid::make(4)->schema([
                            Forms\Components\Select::make('review_type')
                                ->options([
                                    'buyer' => '💳 Buyer Review',
                                    'seller' => '🏠 Seller Review',
                                    'vehicle' => '🚗 Vehicle Review',
                                ])
                                ->required()
                                ->native(false),

                            Forms\Components\Select::make('rating')
                                ->options([
                                    1 => '⭐ 1 Star',
                                    2 => '⭐⭐ 2 Stars',
                                    3 => '⭐⭐⭐ 3 Stars',
                                    4 => '⭐⭐⭐⭐ 4 Stars',
                                    5 => '⭐⭐⭐⭐⭐ 5 Stars',
                                ])
                                ->required()
                                ->native(false),
                        ]),
                        Forms\Components\Textarea::make('comment')
                            ->rows(3)
                            ->maxLength(1000),
                    ])
                    ->columnSpanFull(),

                // Moderation Section
                Schemas\Components\Section::make('Moderation')
                    ->icon('heroicon-o-shield-check')
                    ->schema([
                        Schemas\Components\Grid::make(4)->schema([
                            Forms\Components\Select::make('moderation_status')
                                ->options([
                                    'pending' => '⏳ Pending',
                                    'approved' => '✅ Approved',
                                    'rejected' => '❌ Rejected',
                                ])
                                ->default('pending')
                                ->required()
                                ->native(false),

                            Forms\Components\Toggle::make('verified')
                                ->label('Verified Purchase')
                                ->onColor('success'),

                            Forms\Components\Toggle::make('flagged')
                                ->label('Flagged for Review')
                                ->onColor('danger'),
                        ]),
                        Forms\Components\Textarea::make('moderation_notes')
                            ->label('Admin Notes')
                            ->rows(2),
                    ])
                    ->columnSpanFull()
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),

                Tables\Columns\TextColumn::make('reviewer.name')
                    ->label('Reviewer')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('reviewee.name')
                    ->label('Reviewee')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('rating')
                    ->badge()
                    ->color(fn (int $state): string => match (true) {
                        $state >= 4 => 'success',
                        $state >= 3 => 'warning',
                        default => 'danger',
                    })
                    ->formatStateUsing(fn (int $state): string => str_repeat('*', $state))
                    ->sortable(),

                Tables\Columns\TextColumn::make('review_type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'buyer' => 'info',
                        'seller' => 'success',
                        'vehicle' => 'warning',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('moderation_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'approved' => 'success',
                        'rejected' => 'danger',
                        'pending' => 'warning',
                        default => 'gray',
                    }),

                Tables\Columns\IconColumn::make('verified')
                    ->boolean()
                    ->label('Verified'),

                Tables\Columns\IconColumn::make('flagged')
                    ->boolean()
                    ->label('Flagged')
                    ->trueColor('danger')
                    ->falseColor('gray'),

                Tables\Columns\TextColumn::make('helpful_count')
                    ->label('Helpful')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('moderation_status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),

                Tables\Filters\SelectFilter::make('review_type')
                    ->options([
                        'buyer' => 'Buyer Review',
                        'seller' => 'Seller Review',
                        'vehicle' => 'Vehicle Review',
                    ]),

                Tables\Filters\SelectFilter::make('rating')
                    ->options([
                        1 => '1 Star',
                        2 => '2 Stars',
                        3 => '3 Stars',
                        4 => '4 Stars',
                        5 => '5 Stars',
                    ]),

                Tables\Filters\TernaryFilter::make('verified'),

                Tables\Filters\TernaryFilter::make('flagged'),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Actions\ActionGroup::make([
                    ViewAction::make(),
                    EditAction::make(),

                    Actions\Action::make('approve')
                        ->label('Approve')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->visible(fn (Review $record): bool => $record->moderation_status !== 'approved')
                        ->action(fn (Review $record) => $record->update([
                            'moderation_status' => 'approved',
                            'moderated_by' => auth()->id(),
                            'moderated_at' => now(),
                        ])),

                    Actions\Action::make('reject')
                        ->label('Reject')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->form([
                            Forms\Components\Textarea::make('moderation_notes')
                                ->label('Rejection Reason')
                                ->required(),
                        ])
                        ->visible(fn (Review $record): bool => $record->moderation_status !== 'rejected')
                        ->action(fn (Review $record, array $data) => $record->update([
                            'moderation_status' => 'rejected',
                            'moderation_notes' => $data['moderation_notes'],
                            'moderated_by' => auth()->id(),
                            'moderated_at' => now(),
                        ])),

                    DeleteAction::make(),
                    RestoreAction::make(),
                ]),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    Actions\BulkAction::make('approve_selected')
                        ->label('Approve Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each(fn ($record) => $record->update([
                            'moderation_status' => 'approved',
                            'moderated_by' => auth()->id(),
                            'moderated_at' => now(),
                        ]))),

                    Actions\BulkAction::make('reject_selected')
                        ->label('Reject Selected')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each(fn ($record) => $record->update([
                            'moderation_status' => 'rejected',
                            'moderated_by' => auth()->id(),
                            'moderated_at' => now(),
                        ]))),

                    DeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                InfolistSection::make('Review Information')
                    ->schema([
                        TextEntry::make('reviewer.name')
                            ->label('Reviewer'),
                        TextEntry::make('reviewee.name')
                            ->label('Reviewee'),
                        TextEntry::make('rating')
                            ->formatStateUsing(fn (int $state): string => str_repeat('*', $state) . " ({$state}/5)"),
                        TextEntry::make('review_type')
                            ->badge(),
                        TextEntry::make('comment')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                InfolistSection::make('Moderation Status')
                    ->schema([
                        TextEntry::make('moderation_status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'approved' => 'success',
                                'rejected' => 'danger',
                                'pending' => 'warning',
                                default => 'gray',
                            }),
                        IconEntry::make('verified')
                            ->boolean(),
                        IconEntry::make('flagged')
                            ->boolean(),
                        TextEntry::make('moderation_notes'),
                        TextEntry::make('moderator.name')
                            ->label('Moderated By'),
                        TextEntry::make('moderated_at')
                            ->dateTime(),
                    ])
                    ->columns(3),

                InfolistSection::make('Statistics')
                    ->schema([
                        TextEntry::make('helpful_count')
                            ->label('Helpful Votes'),
                        TextEntry::make('not_helpful_count')
                            ->label('Not Helpful Votes'),
                        TextEntry::make('flag_count')
                            ->label('Times Flagged'),
                    ])
                    ->columns(3),
            ]);
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
            'index' => ListReviews::route('/'),
            'create' => CreateReview::route('/create'),
            'view' => ViewReview::route('/{record}'),
            'edit' => EditReview::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}