<?php

namespace App\Filament\Admin\Resources\Documents;

use App\Filament\Admin\Resources\Documents\Pages\CreateDocument;
use App\Filament\Admin\Resources\Documents\Pages\EditDocument;
use App\Filament\Admin\Resources\Documents\Pages\ListDocuments;
use App\Models\Document;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DocumentResource extends Resource
{
    protected static ?string $model = Document::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $recordTitleAttribute = 'file_name';

    protected static ?string $modelLabel = 'Document';

    protected static ?string $pluralModelLabel = 'Documents';

    public static function getNavigationGroup(): ?string
    {
        return 'Management';
    }

    public static function getNavigationSort(): ?int
    {
        return 3;
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_verified', false)->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['file_name', 'description', 'transaction.transaction_code'];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Document Information Section
                Section::make('Document Information')
                    ->icon('heroicon-o-document-text')
                    ->schema([
                        Schemas\Components\Grid::make(4)->schema([
                            Select::make('transaction_id')
                                ->relationship('transaction', 'transaction_code')
                                ->searchable()
                                ->preload()
                                ->required(),

                            Select::make('uploaded_by')
                                ->relationship('uploader', 'name')
                                ->searchable()
                                ->preload()
                                ->required(),

                            Select::make('type')
                                ->options(Document::getTypes())
                                ->required()
                                ->native(false),

                            TextInput::make('file_name')
                                ->required()
                                ->maxLength(255),
                        ]),
                        Schemas\Components\Grid::make(2)->schema([
                            FileUpload::make('file_path')
                                ->label('Document File')
                                ->directory('documents')
                                ->visibility('private')
                                ->maxSize(10240),

                            Textarea::make('description')
                                ->rows(3)
                                ->maxLength(1000),
                        ]),
                    ])
                    ->columnSpanFull(),

                // Verification Section
                Section::make('Verification')
                    ->icon('heroicon-o-shield-check')
                    ->schema([
                        Schemas\Components\Grid::make(4)->schema([
                            Toggle::make('is_verified')
                                ->label('Verified')
                                ->onColor('success'),

                            Select::make('verified_by')
                                ->relationship('verifier', 'name')
                                ->searchable()
                                ->preload(),
                        ]),
                        Textarea::make('verification_notes')
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
                TextColumn::make('id')
                    ->sortable(),

                TextColumn::make('transaction.transaction_code')
                    ->label('Transaction')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => Document::getTypes()[$state] ?? $state),

                TextColumn::make('file_name')
                    ->searchable()
                    ->limit(30),

                TextColumn::make('uploader.name')
                    ->label('Uploaded By')
                    ->sortable(),

                IconColumn::make('is_verified')
                    ->boolean()
                    ->label('Verified'),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options(Document::getTypes())
                    ->multiple(),

                TernaryFilter::make('is_verified')
                    ->label('Verified'),

                TrashedFilter::make(),
            ])
            ->actions([
                ActionGroup::make([
                    ViewAction::make(),
                    EditAction::make(),

                    Action::make('verify')
                        ->label('Verify')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->visible(fn (Document $record): bool => !$record->is_verified)
                        ->action(function (Document $record) {
                            $record->verify(auth()->user());
                            Notification::make()
                                ->title('Document Verified')
                                ->success()
                                ->send();
                        }),

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
            'index' => ListDocuments::route('/'),
            'create' => CreateDocument::route('/create'),
            'edit' => EditDocument::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([SoftDeletingScope::class]);
    }
}
