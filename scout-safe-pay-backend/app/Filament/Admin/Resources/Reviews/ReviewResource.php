<?php

namespace App\Filament\Admin\Resources\Reviews;

use App\Filament\Admin\Resources\Reviews\Pages\CreateReview;
use App\Filament\Admin\Resources\Reviews\Pages\EditReview;
use App\Filament\Admin\Resources\Reviews\Pages\ListReviews;
use App\Filament\Admin\Resources\Reviews\Pages\ViewReview;
use App\Models\Review;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-star';
    
    protected static ?string $navigationLabel = 'Reviews';
    
    protected static ?string $recordTitleAttribute = 'id';
    
    public static function getNavigationGroup(): ?string
    {
        return 'Content Moderation';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 1;
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        $count = static::getModel()::where('status', 'pending')->count();
        return $count > 10 ? 'danger' : ($count > 0 ? 'warning' : null);
    }

    public static function form(Schema $schema): Schema
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Review Information')
                    ->schema([
                        Forms\Components\Select::make('transaction_id')
                            ->label('Transaction')
                            ->relationship('transaction', 'id')
                            ->searchable()
                            ->required()
                            ->helperText('The transaction this review is for'),

                        Forms\Components\Select::make('reviewer_id')
                            ->label('Reviewer')
                            ->relationship('reviewer', 'name')
                            ->searchable()
                            ->required(),

                        Forms\Components\Select::make('reviewee_id')
                            ->label('Reviewee')
                            ->relationship('reviewee', 'name')
                            ->searchable()
                            ->required(),

                        Forms\Components\Select::make('vehicle_id')
                            ->label('Vehicle')
                            ->relationship('vehicle', 'make')
                            ->searchable()
                            ->helperText('Optional: Link to specific vehicle'),

                        Forms\Components\Select::make('rating')
                            ->label('Rating')
                            ->options([
                                1 => '⭐ 1 Star',
                                2 => '⭐⭐ 2 Stars',
                                3 => '⭐⭐⭐ 3 Stars',
                                4 => '⭐⭐⭐⭐ 4 Stars',
                                5 => '⭐⭐⭐⭐⭐ 5 Stars',
                            ])
                            ->required()
                            ->default(5),

                        Forms\Components\Select::make('review_type')
                            ->label('Review Type')
                            ->options([
                                'seller' => 'Seller Review',
                                'buyer' => 'Buyer Review',
                                'vehicle' => 'Vehicle Review',
                                'platform' => 'Platform Review',
                            ])
                            ->required()
                            ->default('seller'),

                        Forms\Components\Textarea::make('comment')
                            ->label('Comment')
                            ->required()
                            ->rows(4)
                            ->maxLength(1000),
                    ])->columns(2),

                Forms\Components\Section::make('Moderation')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Status')
                            ->options([
                                'pending' => 'Pending Review',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                                'flagged' => 'Flagged for Review',
                            ])
                            ->default('pending')
                            ->required()
                            ->reactive(),

                        Forms\Components\Textarea::make('admin_note')
                            ->label('Admin Note')
                            ->rows(3)
                            ->helperText('Internal note (not visible to users)')
                            ->visible(fn (callable $get) => in_array($get('status'), ['rejected', 'flagged'])),

                        Forms\Components\KeyValue::make('metadata')
                            ->label('Additional Data')
                            ->helperText('JSON metadata for extra information'),
                    ])->columns(1),
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

                Tables\Columns\TextColumn::make('reviewer.name')
                    ->label('Reviewer')
                    ->sortable()
                    ->searchable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('reviewee.name')
                    ->label('Reviewee')
                    ->sortable()
                    ->searchable()
                    ->description(fn (Review $record) => $record->review_type),

                Tables\Columns\TextColumn::make('rating')
                    ->label('Rating')
                    ->formatStateUsing(fn (int $state): string => str_repeat('⭐', $state))
                    ->sortable(),

                Tables\Columns\TextColumn::make('comment')
                    ->label('Comment')
                    ->limit(50)
                    ->wrap()
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\BadgeColumn::make('review_type')
                    ->label('Type')
                    ->colors([
                        'info' => 'seller',
                        'success' => 'buyer',
                        'warning' => 'vehicle',
                        'primary' => 'platform',
                    ])
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'rejected',
                        'info' => 'flagged',
                    ])
                    ->sortable(),

                Tables\Columns\TextColumn::make('transaction.id')
                    ->label('Transaction')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                        'flagged' => 'Flagged',
                    ])
                    ->multiple(),

                Tables\Filters\SelectFilter::make('review_type')
                    ->label('Type')
                    ->options([
                        'seller' => 'Seller Review',
                        'buyer' => 'Buyer Review',
                        'vehicle' => 'Vehicle Review',
                        'platform' => 'Platform Review',
                    ])
                    ->multiple(),

                Tables\Filters\SelectFilter::make('rating')
                    ->label('Rating')
                    ->options([
                        1 => '⭐ 1 Star',
                        2 => '⭐⭐ 2 Stars',
                        3 => '⭐⭐⭐ 3 Stars',
                        4 => '⭐⭐⭐⭐ 4 Stars',
                        5 => '⭐⭐⭐⭐⭐ 5 Stars',
                    ])
                    ->multiple(),

                Tables\Filters\Filter::make('low_ratings')
                    ->label('Low Ratings (1-2 stars)')
                    ->query(fn (Builder $query) => $query->whereIn('rating', [1, 2])),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn (Review $record) => $record->update(['status' => 'approved']))
                    ->visible(fn (Review $record) => $record->status !== 'approved'),

                Tables\Actions\Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->form([
                        Forms\Components\Textarea::make('admin_note')
                            ->label('Rejection Reason')
                            ->required()
                            ->helperText('Explain why this review is being rejected'),
                    ])
                    ->action(function (Review $record, array $data) {
                        $record->update([
                            'status' => 'rejected',
                            'admin_note' => $data['admin_note'],
                        ]);
                    })
                    ->visible(fn (Review $record) => $record->status !== 'rejected'),

                Tables\Actions\Action::make('flag')
                    ->label('Flag')
                    ->icon('heroicon-o-flag')
                    ->color('warning')
                    ->form([
                        Forms\Components\Textarea::make('admin_note')
                            ->label('Flag Reason')
                            ->required()
                            ->helperText('Why is this review flagged?'),
                    ])
                    ->action(function (Review $record, array $data) {
                        $record->update([
                            'status' => 'flagged',
                            'admin_note' => $data['admin_note'],
                        ]);
                    })
                    ->visible(fn (Review $record) => $record->status !== 'flagged'),

                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('approve_selected')
                        ->label('Approve Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'approved'])),

                    Tables\Actions\BulkAction::make('reject_selected')
                        ->label('Reject Selected')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->form([
                            Forms\Components\Textarea::make('admin_note')
                                ->label('Rejection Reason')
                                ->required(),
                        ])
                        ->action(fn ($records, array $data) => $records->each->update([
                            'status' => 'rejected',
                            'admin_note' => $data['admin_note'],
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

    public static function getGloballySearchableAttributes(): array
    {
        return ['comment', 'reviewer.name', 'reviewee.name'];
    }
}
