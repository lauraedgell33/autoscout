<?php

namespace App\Filament\Admin\Resources\Documents;

use App\Filament\Admin\Resources\Documents\Pages\CreateDocument;
use App\Filament\Admin\Resources\Documents\Pages\EditDocument;
use App\Filament\Admin\Resources\Documents\Pages\ListDocuments;
use App\Filament\Admin\Resources\Documents\Pages\ViewDocument;
use App\Models\Document;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DocumentResource extends Resource
{
    protected static ?string $model = Document::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-folder';
    
    protected static ?string $navigationLabel = 'Documents';
    
    protected static ?string $recordTitleAttribute = 'title';
    
    public static function getNavigationGroup(): ?string
    {
        return 'Content Management';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 1;
    }
    
    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::whereNotNull('expires_at')
            ->whereDate('expires_at', '<', now()->addDays(30))
            ->count();
        return $count ?: null;
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        $count = static::getModel()::whereNotNull('expires_at')
            ->whereDate('expires_at', '<', now()->addDays(7))
            ->count();
        return $count > 0 ? 'danger' : 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Document Information')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Title')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\Select::make('type')
                            ->label('Document Type')
                            ->options([
                                'contract' => 'Contract',
                                'agreement' => 'Agreement',
                                'invoice' => 'Invoice',
                                'receipt' => 'Receipt',
                                'certificate' => 'Certificate',
                                'license' => 'License',
                                'proof' => 'Proof Document',
                                'identification' => 'Identification',
                                'other' => 'Other',
                            ])
                            ->required()
                            ->reactive(),

                        Forms\Components\Textarea::make('description')
                            ->label('Description')
                            ->rows(3)
                            ->columnSpanFull(),

                        Forms\Components\Select::make('documentable_type')
                            ->label('Related To')
                            ->options([
                                'App\Models\Transaction' => 'Transaction',
                                'App\Models\User' => 'User',
                                'App\Models\Dealer' => 'Dealer',
                                'App\Models\Vehicle' => 'Vehicle',
                            ])
                            ->reactive()
                            ->searchable(),

                        Forms\Components\TextInput::make('documentable_id')
                            ->label('Related ID')
                            ->numeric()
                            ->helperText('ID of the related entity'),
                    ])->columns(2),

                Forms\Components\Section::make('File Upload')
                    ->schema([
                        Forms\Components\FileUpload::make('file_path')
                            ->label('Document File')
                            ->directory('documents')
                            ->acceptedFileTypes(['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
                            ->maxSize(10240)
                            ->helperText('Accepted: PDF, Images, Word (max 10MB)')
                            ->downloadable()
                            ->openable()
                            ->previewable()
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('file_name')
                            ->label('File Name')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('file_size')
                            ->label('File Size (KB)')
                            ->numeric(),

                        Forms\Components\TextInput::make('mime_type')
                            ->label('MIME Type')
                            ->maxLength(100),
                    ])->columns(3),

                Forms\Components\Section::make('Version & Status')
                    ->schema([
                        Forms\Components\TextInput::make('version')
                            ->label('Version')
                            ->default('1.0')
                            ->maxLength(20)
                            ->helperText('e.g., 1.0, 2.1, 3.0'),

                        Forms\Components\Select::make('status')
                            ->label('Status')
                            ->options([
                                'draft' => 'Draft',
                                'active' => 'Active',
                                'archived' => 'Archived',
                                'expired' => 'Expired',
                            ])
                            ->default('draft')
                            ->required(),

                        Forms\Components\DatePicker::make('expires_at')
                            ->label('Expiration Date')
                            ->helperText('Optional: Set expiration date for document'),

                        Forms\Components\Toggle::make('is_public')
                            ->label('Public Access')
                            ->default(false)
                            ->helperText('Can be accessed without authentication'),
                    ])->columns(2),

                Forms\Components\Section::make('Access Control')
                    ->schema([
                        Forms\Components\Select::make('uploaded_by')
                            ->label('Uploaded By')
                            ->relationship('uploader', 'name')
                            ->searchable()
                            ->default(fn () => auth()->id()),

                        Forms\Components\TextInput::make('access_code')
                            ->label('Access Code')
                            ->maxLength(50)
                            ->helperText('Optional: Require code to view'),

                        Forms\Components\Textarea::make('notes')
                            ->label('Internal Notes')
                            ->rows(3)
                            ->columnSpanFull()
                            ->helperText('Private notes (not visible to users)'),
                    ])->columns(2),

                Forms\Components\Section::make('Additional Data')
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
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),

                Tables\Columns\TextColumn::make('title')
                    ->label('Title')
                    ->sortable()
                    ->searchable()
                    ->weight('bold')
                    ->limit(40),

                Tables\Columns\BadgeColumn::make('type')
                    ->label('Type')
                    ->colors([
                        'primary' => 'contract',
                        'success' => 'agreement',
                        'info' => fn ($state) => in_array($state, ['invoice', 'receipt']),
                        'warning' => fn ($state) => in_array($state, ['certificate', 'license']),
                        'secondary' => 'other',
                    ])
                    ->sortable(),

                Tables\Columns\TextColumn::make('documentable_type')
                    ->label('Related To')
                    ->formatStateUsing(fn (string $state): string => class_basename($state))
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('version')
                    ->label('Version')
                    ->badge()
                    ->color('secondary')
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'secondary' => 'draft',
                        'success' => 'active',
                        'warning' => 'archived',
                        'danger' => 'expired',
                    ])
                    ->sortable(),

                Tables\Columns\IconColumn::make('file_path')
                    ->label('File')
                    ->boolean()
                    ->trueIcon('heroicon-o-document')
                    ->falseIcon('heroicon-o-x-mark')
                    ->trueColor('success')
                    ->falseColor('gray')
                    ->getStateUsing(fn ($record) => !empty($record->file_path)),

                Tables\Columns\TextColumn::make('expires_at')
                    ->label('Expires')
                    ->date('d M Y')
                    ->sortable()
                    ->color(fn ($record) => 
                        $record->expires_at && $record->expires_at->isPast() ? 'danger' : 
                        ($record->expires_at && $record->expires_at->diffInDays() < 30 ? 'warning' : 'gray')
                    )
                    ->toggleable(),

                Tables\Columns\TextColumn::make('uploader.name')
                    ->label('Uploaded By')
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
                Tables\Filters\SelectFilter::make('type')
                    ->label('Type')
                    ->options([
                        'contract' => 'Contract',
                        'agreement' => 'Agreement',
                        'invoice' => 'Invoice',
                        'receipt' => 'Receipt',
                        'certificate' => 'Certificate',
                        'license' => 'License',
                        'proof' => 'Proof',
                        'identification' => 'ID',
                        'other' => 'Other',
                    ])
                    ->multiple(),

                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'draft' => 'Draft',
                        'active' => 'Active',
                        'archived' => 'Archived',
                        'expired' => 'Expired',
                    ])
                    ->multiple(),

                Tables\Filters\SelectFilter::make('documentable_type')
                    ->label('Related To')
                    ->options([
                        'App\Models\Transaction' => 'Transaction',
                        'App\Models\User' => 'User',
                        'App\Models\Dealer' => 'Dealer',
                        'App\Models\Vehicle' => 'Vehicle',
                    ]),

                Tables\Filters\Filter::make('expiring_soon')
                    ->label('Expiring Soon (30 days)')
                    ->query(fn (Builder $query) => 
                        $query->whereNotNull('expires_at')
                            ->whereDate('expires_at', '<=', now()->addDays(30))
                            ->whereDate('expires_at', '>=', now())
                    ),

                Tables\Filters\Filter::make('expired')
                    ->label('Expired')
                    ->query(fn (Builder $query) => 
                        $query->whereNotNull('expires_at')
                            ->whereDate('expires_at', '<', now())
                    ),

                Tables\Filters\TernaryFilter::make('is_public')
                    ->label('Public Access')
                    ->placeholder('All documents')
                    ->trueLabel('Public only')
                    ->falseLabel('Private only'),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\Action::make('download')
                    ->label('Download')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('primary')
                    ->url(fn (Document $record) => $record->file_path ? asset('storage/' . $record->file_path) : '#')
                    ->openUrlInNewTab()
                    ->visible(fn (Document $record) => !empty($record->file_path)),

                Tables\Actions\Action::make('archive')
                    ->label('Archive')
                    ->icon('heroicon-o-archive-box')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->action(fn (Document $record) => $record->update(['status' => 'archived']))
                    ->visible(fn (Document $record) => $record->status !== 'archived'),

                Tables\Actions\Action::make('activate')
                    ->label('Activate')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn (Document $record) => $record->update(['status' => 'active']))
                    ->visible(fn (Document $record) => $record->status !== 'active'),

                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('archive_selected')
                        ->label('Archive Selected')
                        ->icon('heroicon-o-archive-box')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'archived'])),

                    Tables\Actions\BulkAction::make('activate_selected')
                        ->label('Activate Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'active'])),

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
            'index' => ListDocuments::route('/'),
            'create' => CreateDocument::route('/create'),
            'view' => ViewDocument::route('/{record}'),
            'edit' => EditDocument::route('/{record}/edit'),
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
        return ['title', 'description', 'file_name'];
    }
}
