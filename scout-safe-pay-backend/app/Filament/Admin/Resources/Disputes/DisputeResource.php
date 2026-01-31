<?php

namespace App\Filament\Admin\Resources\Disputes;

use App\Filament\Admin\Resources\Disputes\Pages\CreateDispute;
use App\Filament\Admin\Resources\Disputes\Pages\EditDispute;
use App\Filament\Admin\Resources\Disputes\Pages\ListDisputes;
use App\Filament\Admin\Resources\Disputes\Pages\ViewDispute;
use App\Models\Dispute;
use Filament\Schemas;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\RestoreAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DisputeResource extends Resource
{
    protected static ?string $model = Dispute::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-shield-exclamation';
    
    protected static ?string $navigationLabel = 'Disputes';
    
    protected static ?string $recordTitleAttribute = 'dispute_code';
    
    public static function getNavigationGroup(): ?string
    {
        return 'Support & Resolution';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 1;
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::whereIn('status', ['open', 'investigating'])->count() ?: null;
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        $count = static::getModel()::whereIn('status', ['open', 'investigating'])->count();
        return $count > 10 ? 'danger' : ($count > 0 ? 'warning' : null);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Schemas\Components\Section::make('Dispute Information')
                    ->schema([
                        Forms\Components\TextInput::make('dispute_code')
                            ->label('Dispute Code')
                            ->default(fn () => 'DSP-' . strtoupper(substr(md5(time() . rand()), 0, 8)))
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(50),

                        Forms\Components\Select::make('transaction_id')
                            ->label('Transaction')
                            ->relationship('transaction', 'id')
                            ->searchable()
                            ->required()
                            ->helperText('The transaction this dispute is about'),

                        Forms\Components\Select::make('raised_by_user_id')
                            ->label('Raised By')
                            ->relationship('raisedBy', 'name')
                            ->searchable()
                            ->required(),

                        Forms\Components\Select::make('type')
                            ->label('Dispute Type')
                            ->options([
                                'payment' => 'Payment Issue',
                                'delivery' => 'Delivery Issue',
                                'vehicle_condition' => 'Vehicle Condition',
                                'documentation' => 'Documentation Issue',
                                'fraud' => 'Suspected Fraud',
                                'other' => 'Other',
                            ])
                            ->required()
                            ->reactive(),

                        Forms\Components\Textarea::make('reason')
                            ->label('Reason')
                            ->required()
                            ->rows(2)
                            ->maxLength(255),

                        Forms\Components\Textarea::make('description')
                            ->label('Detailed Description')
                            ->required()
                            ->rows(4)
                            ->maxLength(2000),
                    ])->columns(2),

                Schemas\Components\Section::make('Evidence')
                    ->schema([
                        Forms\Components\FileUpload::make('evidence_urls')
                            ->label('Evidence Files')
                            ->multiple()
                            ->directory('dispute-evidence')
                            ->acceptedFileTypes(['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'])
                            ->maxSize(10240)
                            ->maxFiles(10)
                            ->helperText('Upload photos, PDFs, or other evidence (max 10MB per file)')
                            ->downloadable()
                            ->openable()
                            ->previewable(),
                    ]),

                Schemas\Components\Section::make('Resolution')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Status')
                            ->options([
                                'open' => 'Open',
                                'investigating' => 'Investigating',
                                'awaiting_response' => 'Awaiting Response',
                                'resolved' => 'Resolved',
                                'closed' => 'Closed',
                                'escalated' => 'Escalated',
                            ])
                            ->default('open')
                            ->required()
                            ->reactive(),

                        Forms\Components\Select::make('resolution_type')
                            ->label('Resolution Type')
                            ->options([
                                'refund_full' => 'Full Refund',
                                'refund_partial' => 'Partial Refund',
                                'replacement' => 'Replacement',
                                'compensation' => 'Compensation',
                                'no_action' => 'No Action Required',
                                'dismissed' => 'Dismissed',
                            ])
                            ->visible(fn (callable $get) => in_array($get('status'), ['resolved', 'closed'])),

                        Forms\Components\Textarea::make('resolution')
                            ->label('Resolution Details')
                            ->rows(4)
                            ->visible(fn (callable $get) => in_array($get('status'), ['resolved', 'closed'])),

                        Forms\Components\Select::make('resolved_by')
                            ->label('Resolved By')
                            ->relationship('resolver', 'name')
                            ->searchable()
                            ->visible(fn (callable $get) => in_array($get('status'), ['resolved', 'closed'])),

                        Forms\Components\DateTimePicker::make('resolved_at')
                            ->label('Resolved At')
                            ->visible(fn (callable $get) => in_array($get('status'), ['resolved', 'closed'])),
                    ])->columns(2),

                Schemas\Components\Section::make('Party Responses')
                    ->schema([
                        Forms\Components\Textarea::make('seller_response')
                            ->label('Seller Response')
                            ->rows(3)
                            ->helperText('Response from the seller'),

                        Forms\Components\Textarea::make('buyer_response')
                            ->label('Buyer Response')
                            ->rows(3)
                            ->helperText('Response from the buyer'),

                        Forms\Components\Textarea::make('admin_notes')
                            ->label('Admin Notes')
                            ->rows(3)
                            ->helperText('Internal notes (not visible to users)'),
                    ])->columns(1),

                Schemas\Components\Section::make('Additional Data')
                    ->schema([
                        Forms\Components\KeyValue::make('metadata')
                            ->label('Metadata')
                            ->helperText('Additional JSON data'),
                    ])->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('dispute_code')
                    ->label('Code')
                    ->sortable()
                    ->searchable()
                    ->weight('bold')
                    ->copyable(),

                Tables\Columns\TextColumn::make('transaction.id')
                    ->label('Transaction')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('raisedBy.name')
                    ->label('Raised By')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\BadgeColumn::make('type')
                    ->label('Type')
                    ->colors([
                        'danger' => 'fraud',
                        'warning' => 'payment',
                        'info' => 'delivery',
                        'success' => 'documentation',
                        'primary' => fn ($state) => in_array($state, ['vehicle_condition', 'other']),
                    ])
                    ->sortable(),

                Tables\Columns\TextColumn::make('reason')
                    ->label('Reason')
                    ->limit(40)
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'danger' => 'open',
                        'warning' => fn ($state) => in_array($state, ['investigating', 'awaiting_response']),
                        'success' => 'resolved',
                        'gray' => 'closed',
                        'info' => 'escalated',
                    ])
                    ->sortable(),

                Tables\Columns\IconColumn::make('evidence_urls')
                    ->label('Evidence')
                    ->boolean()
                    ->trueIcon('heroicon-o-paper-clip')
                    ->falseIcon('heroicon-o-x-mark')
                    ->trueColor('success')
                    ->falseColor('gray')
                    ->getStateUsing(fn ($record) => !empty($record->evidence_urls)),

                Tables\Columns\TextColumn::make('resolved_at')
                    ->label('Resolved')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'open' => 'Open',
                        'investigating' => 'Investigating',
                        'awaiting_response' => 'Awaiting Response',
                        'resolved' => 'Resolved',
                        'closed' => 'Closed',
                        'escalated' => 'Escalated',
                    ])
                    ->multiple(),

                Tables\Filters\SelectFilter::make('type')
                    ->label('Type')
                    ->options([
                        'payment' => 'Payment Issue',
                        'delivery' => 'Delivery Issue',
                        'vehicle_condition' => 'Vehicle Condition',
                        'documentation' => 'Documentation',
                        'fraud' => 'Fraud',
                        'other' => 'Other',
                    ])
                    ->multiple(),

                Tables\Filters\SelectFilter::make('resolution_type')
                    ->label('Resolution Type')
                    ->options([
                        'refund_full' => 'Full Refund',
                        'refund_partial' => 'Partial Refund',
                        'replacement' => 'Replacement',
                        'compensation' => 'Compensation',
                        'no_action' => 'No Action',
                        'dismissed' => 'Dismissed',
                    ])
                    ->multiple(),

                Tables\Filters\Filter::make('unresolved')
                    ->label('Unresolved Only')
                    ->query(fn (Builder $query) => $query->whereNotIn('status', ['resolved', 'closed'])),

                Tables\Filters\Filter::make('high_priority')
                    ->label('High Priority (Fraud)')
                    ->query(fn (Builder $query) => $query->where('type', 'fraud')),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Actions\Action::make('investigate')
                    ->label('Investigate')
                    ->icon('heroicon-o-magnifying-glass')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->action(fn (Dispute $record) => $record->update(['status' => 'investigating']))
                    ->visible(fn (Dispute $record) => $record->status === 'open'),

                Actions\Action::make('resolve')
                    ->label('Resolve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->form([
                        Forms\Components\Select::make('resolution_type')
                            ->label('Resolution Type')
                            ->options([
                                'refund_full' => 'Full Refund',
                                'refund_partial' => 'Partial Refund',
                                'replacement' => 'Replacement',
                                'compensation' => 'Compensation',
                                'no_action' => 'No Action Required',
                                'dismissed' => 'Dismissed',
                            ])
                            ->required(),
                        Forms\Components\Textarea::make('resolution')
                            ->label('Resolution Details')
                            ->required()
                            ->rows(4),
                    ])
                    ->action(function (Dispute $record, array $data) {
                        $record->update([
                            'status' => 'resolved',
                            'resolution_type' => $data['resolution_type'],
                            'resolution' => $data['resolution'],
                            'resolved_by' => auth()->id(),
                            'resolved_at' => now(),
                        ]);
                    })
                    ->visible(fn (Dispute $record) => !in_array($record->status, ['resolved', 'closed'])),

                Actions\Action::make('escalate')
                    ->label('Escalate')
                    ->icon('heroicon-o-arrow-up-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn (Dispute $record) => $record->update(['status' => 'escalated']))
                    ->visible(fn (Dispute $record) => $record->status !== 'escalated'),

                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
                ForceDeleteAction::make(),
                RestoreAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    Actions\BulkAction::make('mark_investigating')
                        ->label('Mark as Investigating')
                        ->icon('heroicon-o-magnifying-glass')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'investigating'])),

                    Actions\BulkAction::make('assign_to_me')
                        ->label('Assign to Me')
                        ->icon('heroicon-o-user')
                        ->color('info')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['resolved_by' => auth()->id()])),

                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
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
            'index' => ListDisputes::route('/'),
            'create' => CreateDispute::route('/create'),
            'view' => ViewDispute::route('/{record}'),
            'edit' => EditDispute::route('/{record}/edit'),
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
        return ['dispute_code', 'reason', 'description', 'raisedBy.name'];
    }
}
