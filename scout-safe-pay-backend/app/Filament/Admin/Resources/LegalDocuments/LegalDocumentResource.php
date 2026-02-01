<?php

namespace App\Filament\Admin\Resources\LegalDocuments;

use App\Filament\Admin\Resources\LegalDocuments\Pages\CreateLegalDocument;
use App\Filament\Admin\Resources\LegalDocuments\Pages\EditLegalDocument;
use App\Filament\Admin\Resources\LegalDocuments\Pages\ListLegalDocuments;
use App\Filament\Admin\Resources\LegalDocuments\Pages\ViewLegalDocument;
use App\Models\LegalDocument;
use Filament\Actions\Action;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\Section as InfolistSection;
use Filament\Infolists\Components\TextEntry;
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
use Filament\Tables\Table;

class LegalDocumentResource extends Resource
{
    protected static ?string $model = LegalDocument::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-scale';

    protected static ?string $recordTitleAttribute = 'title';

    protected static ?string $modelLabel = 'Legal Document';

    protected static ?string $pluralModelLabel = 'Legal Documents';

    public static function getNavigationGroup(): ?string
    {
        return 'Settings';
    }

    public static function getNavigationSort(): ?int
    {
        return 2;
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['title', 'type', 'version'];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Document Information Section
                Section::make('Document Information')
                    ->icon('heroicon-o-scale')
                    ->schema([
                        Schemas\Components\Grid::make(4)->schema([
                            Select::make('type')
                                ->options([
                                    LegalDocument::TYPE_TERMS_OF_SERVICE => '📄 Terms of Service',
                                    LegalDocument::TYPE_PRIVACY_POLICY => '🔒 Privacy Policy',
                                    LegalDocument::TYPE_COOKIE_POLICY => '🍪 Cookie Policy',
                                    LegalDocument::TYPE_PURCHASE_AGREEMENT => '📝 Purchase Agreement',
                                    LegalDocument::TYPE_REFUND_POLICY => '💰 Refund Policy',
                                ])
                                ->required()
                                ->native(false),

                            TextInput::make('title')
                                ->required()
                                ->maxLength(255),

                            TextInput::make('version')
                                ->required()
                                ->default('1.0'),

                            Select::make('language')
                                ->options([
                                    'en' => '🇬🇧 English',
                                    'de' => '🇩🇪 German',
                                    'ro' => '🇷🇴 Romanian',
                                    'fr' => '🇫🇷 French',
                                ])
                                ->default('en')
                                ->required()
                                ->native(false),
                        ]),
                        Schemas\Components\Grid::make(4)->schema([
                            Toggle::make('is_active')
                                ->label('Active')
                                ->default(false)
                                ->onColor('success'),

                            DateTimePicker::make('effective_date')
                                ->default(now()),
                        ]),
                    ])
                    ->columnSpanFull(),

                // Content Section
                Section::make('Content')
                    ->icon('heroicon-o-document-text')
                    ->schema([
                        RichEditor::make('content')
                            ->required(),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                InfolistSection::make('Document Details')
                    ->schema([
                        TextEntry::make('title'),
                        TextEntry::make('type')
                            ->badge()
                            ->formatStateUsing(fn (string $state): string => match ($state) {
                                LegalDocument::TYPE_TERMS_OF_SERVICE => 'Terms of Service',
                                LegalDocument::TYPE_PRIVACY_POLICY => 'Privacy Policy',
                                LegalDocument::TYPE_COOKIE_POLICY => 'Cookie Policy',
                                LegalDocument::TYPE_PURCHASE_AGREEMENT => 'Purchase Agreement',
                                LegalDocument::TYPE_REFUND_POLICY => 'Refund Policy',
                                default => $state,
                            }),
                        TextEntry::make('version'),
                        TextEntry::make('language')
                            ->formatStateUsing(fn (string $state): string => match ($state) {
                                'en' => 'English',
                                'de' => 'German',
                                'ro' => 'Romanian',
                                'fr' => 'French',
                                default => $state,
                            }),
                        IconEntry::make('is_active')
                            ->boolean()
                            ->label('Active'),
                        TextEntry::make('effective_date')
                            ->dateTime(),
                    ])
                    ->columns(3),

                InfolistSection::make('Content')
                    ->schema([
                        TextEntry::make('content')
                            ->html()
                            ->columnSpanFull(),
                    ]),

                InfolistSection::make('Statistics')
                    ->schema([
                        TextEntry::make('consents_count')
                            ->label('Total Consents')
                            ->state(fn (LegalDocument $record): int => $record->consents()->count()),
                        TextEntry::make('created_at')
                            ->dateTime(),
                        TextEntry::make('updated_at')
                            ->dateTime(),
                    ])
                    ->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        LegalDocument::TYPE_TERMS_OF_SERVICE => 'Terms',
                        LegalDocument::TYPE_PRIVACY_POLICY => 'Privacy',
                        LegalDocument::TYPE_COOKIE_POLICY => 'Cookies',
                        LegalDocument::TYPE_PURCHASE_AGREEMENT => 'Purchase',
                        LegalDocument::TYPE_REFUND_POLICY => 'Refund',
                        default => $state,
                    }),

                TextColumn::make('version')
                    ->sortable(),

                TextColumn::make('language')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => strtoupper($state)),

                IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),

                TextColumn::make('effective_date')
                    ->dateTime()
                    ->sortable(),

                TextColumn::make('consents_count')
                    ->label('Consents')
                    ->counts('consents')
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options([
                        LegalDocument::TYPE_TERMS_OF_SERVICE => 'Terms of Service',
                        LegalDocument::TYPE_PRIVACY_POLICY => 'Privacy Policy',
                        LegalDocument::TYPE_COOKIE_POLICY => 'Cookie Policy',
                        LegalDocument::TYPE_PURCHASE_AGREEMENT => 'Purchase Agreement',
                        LegalDocument::TYPE_REFUND_POLICY => 'Refund Policy',
                    ]),

                SelectFilter::make('language')
                    ->options([
                        'en' => 'English',
                        'de' => 'German',
                        'ro' => 'Romanian',
                        'fr' => 'French',
                    ]),

                TernaryFilter::make('is_active')
                    ->label('Active'),
            ])
            ->actions([
                ActionGroup::make([
                    ViewAction::make(),
                    EditAction::make(),

                    Action::make('activate')
                        ->label('Activate')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->visible(fn (LegalDocument $record): bool => !$record->is_active)
                        ->action(function (LegalDocument $record) {
                            // Deactivate other documents of same type and language
                            LegalDocument::where('type', $record->type)
                                ->where('language', $record->language)
                                ->where('id', '!=', $record->id)
                                ->update(['is_active' => false]);

                            $record->update(['is_active' => true]);

                            Notification::make()
                                ->title('Document activated')
                                ->success()
                                ->send();
                        }),

                    Action::make('deactivate')
                        ->label('Deactivate')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->visible(fn (LegalDocument $record): bool => $record->is_active)
                        ->action(function (LegalDocument $record) {
                            $record->update(['is_active' => false]);
                            Notification::make()
                                ->title('Document deactivated')
                                ->warning()
                                ->send();
                        }),

                    Action::make('duplicate')
                        ->label('Create New Version')
                        ->icon('heroicon-o-document-duplicate')
                        ->color('info')
                        ->action(function (LegalDocument $record) {
                            $newVersion = (float) $record->version + 0.1;
                            LegalDocument::create([
                                'type' => $record->type,
                                'title' => $record->title,
                                'version' => number_format($newVersion, 1),
                                'language' => $record->language,
                                'content' => $record->content,
                                'is_active' => false,
                                'effective_date' => now(),
                            ]);
                            Notification::make()
                                ->title('New version created')
                                ->success()
                                ->send();
                        }),

                    DeleteAction::make(),
                ]),
            ])
            ->defaultSort('updated_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLegalDocuments::route('/'),
            'create' => CreateLegalDocument::route('/create'),
            'view' => ViewLegalDocument::route('/{record}'),
            'edit' => EditLegalDocument::route('/{record}/edit'),
        ];
    }
}
