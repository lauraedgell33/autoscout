<?php

namespace App\Filament\Admin\Resources\LegalDocuments;

use App\Filament\Admin\Resources\LegalDocuments\Pages\CreateLegalDocument;
use App\Filament\Admin\Resources\LegalDocuments\Pages\EditLegalDocument;
use App\Filament\Admin\Resources\LegalDocuments\Pages\ListLegalDocuments;
use App\Filament\Admin\Resources\LegalDocuments\Pages\ViewLegalDocument;
use App\Models\LegalDocument;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LegalDocumentResource extends Resource
{
    protected static ?string $model = LegalDocument::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-scale';
    
    protected static ?string $navigationLabel = 'Legal Documents';
    
    protected static ?string $recordTitleAttribute = 'title';
    
    public static function getNavigationGroup(): ?string
    {
        return 'Legal & Compliance';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 1;
    }
    
    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::where('status', 'draft')->count();
        return $count ?: null;
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Document Information')
                    ->schema([
                        Forms\Components\Select::make('type')
                            ->label('Document Type')
                            ->options([
                                'terms' => 'Terms & Conditions',
                                'privacy' => 'Privacy Policy',
                                'cookies' => 'Cookie Policy',
                                'gdpr' => 'GDPR Compliance',
                                'user_agreement' => 'User Agreement',
                                'dealer_agreement' => 'Dealer Agreement',
                                'refund_policy' => 'Refund Policy',
                                'disclaimer' => 'Disclaimer',
                                'other' => 'Other',
                            ])
                            ->required()
                            ->reactive(),

                        Forms\Components\TextInput::make('title')
                            ->label('Title')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('version')
                            ->label('Version')
                            ->default(fn () => '1.0')
                            ->required()
                            ->maxLength(20)
                            ->helperText('e.g., 1.0, 2.0, 2.1'),

                        Forms\Components\Select::make('language')
                            ->label('Language')
                            ->options([
                                'en' => 'English',
                                'ro' => 'Romanian',
                                'de' => 'German',
                                'fr' => 'French',
                                'es' => 'Spanish',
                            ])
                            ->default('en')
                            ->required(),
                    ])->columns(2),

                Forms\Components\Section::make('Content')
                    ->schema([
                        Forms\Components\RichEditor::make('content')
                            ->label('Document Content')
                            ->required()
                            ->columnSpanFull()
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'underline',
                                'strike',
                                'link',
                                'heading',
                                'bulletList',
                                'orderedList',
                                'blockquote',
                                'codeBlock',
                                'undo',
                                'redo',
                            ]),

                        Forms\Components\Textarea::make('summary')
                            ->label('Summary')
                            ->rows(3)
                            ->helperText('Brief summary of changes in this version')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Status & Dates')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Status')
                            ->options([
                                'draft' => 'Draft',
                                'review' => 'Under Review',
                                'active' => 'Active',
                                'archived' => 'Archived',
                            ])
                            ->default('draft')
                            ->required()
                            ->reactive(),

                        Forms\Components\DateTimePicker::make('effective_from')
                            ->label('Effective From')
                            ->default(now())
                            ->required()
                            ->helperText('When this version becomes active'),

                        Forms\Components\DateTimePicker::make('effective_until')
                            ->label('Effective Until')
                            ->helperText('Optional: When this version expires'),

                        Forms\Components\Toggle::make('requires_acceptance')
                            ->label('Requires User Acceptance')
                            ->default(true)
                            ->helperText('Users must accept this document'),

                        Forms\Components\Toggle::make('force_reacceptance')
                            ->label('Force Re-acceptance')
                            ->default(false)
                            ->helperText('Force existing users to re-accept on next login')
                            ->visible(fn ($get) => $get('requires_acceptance')),
                    ])->columns(2),

                Forms\Components\Section::make('Related Documents')
                    ->schema([
                        Forms\Components\Select::make('replaces_document_id')
                            ->label('Replaces Document')
                            ->relationship('replacesDocument', 'title')
                            ->searchable()
                            ->helperText('Select the previous version this document replaces'),

                        Forms\Components\Textarea::make('change_log')
                            ->label('Change Log')
                            ->rows(4)
                            ->helperText('Detailed list of changes from previous version')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Metadata')
                    ->schema([
                        Forms\Components\Select::make('approved_by')
                            ->label('Approved By')
                            ->relationship('approver', 'name')
                            ->searchable()
                            ->helperText('Admin who approved this document'),

                        Forms\Components\DateTimePicker::make('approved_at')
                            ->label('Approved At')
                            ->helperText('Date and time of approval'),

                        Forms\Components\TextInput::make('legal_reference')
                            ->label('Legal Reference')
                            ->maxLength(255)
                            ->helperText('e.g., GDPR Article 13, CCPA Section 1798.100'),

                        Forms\Components\Textarea::make('internal_notes')
                            ->label('Internal Notes')
                            ->rows(3)
                            ->helperText('Private notes (not visible to users)')
                            ->columnSpanFull(),
                    ])->columns(2)
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('type')
                    ->label('Type')
                    ->colors([
                        'primary' => 'terms',
                        'success' => 'privacy',
                        'warning' => 'cookies',
                        'info' => 'gdpr',
                        'secondary' => fn ($state) => in_array($state, ['user_agreement', 'dealer_agreement']),
                        'danger' => 'refund_policy',
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'terms' => 'Terms & Conditions',
                        'privacy' => 'Privacy Policy',
                        'cookies' => 'Cookie Policy',
                        'gdpr' => 'GDPR',
                        'user_agreement' => 'User Agreement',
                        'dealer_agreement' => 'Dealer Agreement',
                        'refund_policy' => 'Refund Policy',
                        'disclaimer' => 'Disclaimer',
                        default => ucfirst($state),
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('title')
                    ->label('Title')
                    ->sortable()
                    ->searchable()
                    ->weight('bold')
                    ->limit(40),

                Tables\Columns\BadgeColumn::make('version')
                    ->label('Version')
                    ->color('secondary')
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('language')
                    ->label('Lang')
                    ->colors([
                        'primary' => 'en',
                        'success' => 'ro',
                        'warning' => 'de',
                        'info' => fn ($state) => in_array($state, ['fr', 'es']),
                    ])
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'secondary' => 'draft',
                        'warning' => 'review',
                        'success' => 'active',
                        'gray' => 'archived',
                    ])
                    ->sortable(),

                Tables\Columns\IconColumn::make('requires_acceptance')
                    ->label('Required')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('gray'),

                Tables\Columns\TextColumn::make('effective_from')
                    ->label('Effective From')
                    ->date('d M Y')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('acceptances_count')
                    ->label('Acceptances')
                    ->counts('acceptances')
                    ->sortable()
                    ->badge()
                    ->color('info')
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
                        'terms' => 'Terms & Conditions',
                        'privacy' => 'Privacy Policy',
                        'cookies' => 'Cookie Policy',
                        'gdpr' => 'GDPR',
                        'user_agreement' => 'User Agreement',
                        'dealer_agreement' => 'Dealer Agreement',
                        'refund_policy' => 'Refund Policy',
                        'disclaimer' => 'Disclaimer',
                        'other' => 'Other',
                    ])
                    ->multiple(),

                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'draft' => 'Draft',
                        'review' => 'Under Review',
                        'active' => 'Active',
                        'archived' => 'Archived',
                    ])
                    ->multiple(),

                Tables\Filters\SelectFilter::make('language')
                    ->label('Language')
                    ->options([
                        'en' => 'English',
                        'ro' => 'Romanian',
                        'de' => 'German',
                        'fr' => 'French',
                        'es' => 'Spanish',
                    ]),

                Tables\Filters\TernaryFilter::make('requires_acceptance')
                    ->label('Requires Acceptance')
                    ->placeholder('All documents')
                    ->trueLabel('Required only')
                    ->falseLabel('Not required'),

                Tables\Filters\Filter::make('active_now')
                    ->label('Currently Active')
                    ->query(fn (Builder $query) => 
                        $query->where('status', 'active')
                            ->where('effective_from', '<=', now())
                            ->where(fn ($q) => $q->whereNull('effective_until')->orWhere('effective_until', '>=', now()))
                    ),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\Action::make('publish')
                    ->label('Publish')
                    ->icon('heroicon-o-rocket-launch')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Publish Legal Document')
                    ->modalDescription('This will make the document active and notify users if required.')
                    ->action(function (LegalDocument $record) {
                        $record->update([
                            'status' => 'active',
                            'effective_from' => $record->effective_from ?? now(),
                        ]);
                        
                        // Archive previous version
                        if ($record->replaces_document_id) {
                            LegalDocument::find($record->replaces_document_id)?->update([
                                'status' => 'archived',
                                'effective_until' => now(),
                            ]);
                        }
                    })
                    ->visible(fn (LegalDocument $record) => in_array($record->status, ['draft', 'review'])),

                Tables\Actions\Action::make('archive')
                    ->label('Archive')
                    ->icon('heroicon-o-archive-box')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->action(fn (LegalDocument $record) => $record->update(['status' => 'archived', 'effective_until' => now()]))
                    ->visible(fn (LegalDocument $record) => $record->status === 'active'),

                Tables\Actions\Action::make('preview')
                    ->label('Preview')
                    ->icon('heroicon-o-eye')
                    ->color('info')
                    ->url(fn (LegalDocument $record) => route('legal.preview', $record))
                    ->openUrlInNewTab(),

                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('publish_selected')
                        ->label('Publish Selected')
                        ->icon('heroicon-o-rocket-launch')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'active', 'effective_from' => now()])),

                    Tables\Actions\BulkAction::make('archive_selected')
                        ->label('Archive Selected')
                        ->icon('heroicon-o-archive-box')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'archived', 'effective_until' => now()])),

                    Tables\Actions\DeleteBulkAction::make(),
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
            'index' => ListLegalDocuments::route('/'),
            'create' => CreateLegalDocument::route('/create'),
            'view' => ViewLegalDocument::route('/{record}'),
            'edit' => EditLegalDocument::route('/{record}/edit'),
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
        return ['title', 'content', 'summary'];
    }
}
