<?php

namespace App\Filament\Admin\Resources\UserConsents;

use App\Filament\Admin\Resources\UserConsents\Pages\CreateUserConsent;
use App\Filament\Admin\Resources\UserConsents\Pages\EditUserConsent;
use App\Filament\Admin\Resources\UserConsents\Pages\ListUserConsents;
use App\Filament\Admin\Resources\UserConsents\Pages\ViewUserConsent;
use App\Models\UserConsent;
use Filament\Forms;
use Filament\Schemas\Schema as FilamentSchema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserConsentResource extends Resource
{
    protected static ?string $model = UserConsent::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-shield-check';
    
    protected static ?string $navigationLabel = 'User Consents';
    
    protected static ?string $recordTitleAttribute = 'consent_type';
    
    public static function getNavigationGroup(): ?string
    {
        return 'Legal & Compliance';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 2;
    }
    
    public static function getNavigationBadge(): ?string
    {
        if (Schema::hasColumn('user_consents', 'withdrawn_at')) {
            return static::getModel()::whereNotNull('withdrawn_at')->count() ?: null;
        } elseif (Schema::hasColumn('user_consents', 'revoked_at')) {
            return static::getModel()::whereNotNull('revoked_at')->count() ?: null;
        }
        return null;
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }

    public static function form(FilamentSchema $form): FilamentSchema
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Consent Information')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('User')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->required()
                            ->preload(),

                        Forms\Components\Select::make('consent_type')
                            ->label('Consent Type')
                            ->options([
                                'terms_and_conditions' => 'Terms & Conditions',
                                'privacy_policy' => 'Privacy Policy',
                                'cookie_policy' => 'Cookie Policy',
                                'marketing_emails' => 'Marketing Emails',
                                'marketing_sms' => 'Marketing SMS',
                                'data_processing' => 'Data Processing (GDPR)',
                                'analytics' => 'Analytics & Tracking',
                                'third_party_sharing' => 'Third-Party Data Sharing',
                                'newsletter' => 'Newsletter Subscription',
                                'push_notifications' => 'Push Notifications',
                            ])
                            ->required()
                            ->reactive(),

                        Forms\Components\Select::make('legal_document_id')
                            ->label('Related Legal Document')
                            ->relationship('legalDocument', 'title')
                            ->searchable()
                            ->helperText('Link to the specific document version accepted'),

                        Forms\Components\Toggle::make('is_given')
                            ->label('Consent Given')
                            ->default(true)
                            ->reactive()
                            ->helperText('Whether user has given or withdrawn consent'),
                    ])->columns(2),

                Forms\Components\Section::make('Consent Details')
                    ->schema([
                        Forms\Components\DateTimePicker::make('given_at')
                            ->label('Given At')
                            ->default(now())
                            ->required()
                            ->visible(fn ($get) => $get('is_given') === true),

                        Forms\Components\DateTimePicker::make('withdrawn_at')
                            ->label('Withdrawn At')
                            ->visible(fn ($get) => $get('is_given') === false)
                            ->helperText('When user withdrew consent'),

                        Forms\Components\Textarea::make('withdrawal_reason')
                            ->label('Withdrawal Reason')
                            ->rows(3)
                            ->visible(fn ($get) => $get('is_given') === false)
                            ->helperText('Optional: Why user withdrew consent')
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Context & Metadata')
                    ->schema([
                        Forms\Components\TextInput::make('ip_address')
                            ->label('IP Address')
                            ->maxLength(45)
                            ->helperText('IP address when consent was given'),

                        Forms\Components\TextInput::make('user_agent')
                            ->label('User Agent')
                            ->maxLength(255)
                            ->helperText('Browser/device used'),

                        Forms\Components\Select::make('consent_method')
                            ->label('Consent Method')
                            ->options([
                                'checkbox' => 'Checkbox',
                                'button' => 'Button Click',
                                'banner' => 'Banner Accept',
                                'popup' => 'Popup Modal',
                                'implicit' => 'Implicit (continued use)',
                                'verbal' => 'Verbal (phone)',
                                'written' => 'Written (paper)',
                                'admin' => 'Admin Override',
                            ])
                            ->default('checkbox'),

                        Forms\Components\TextInput::make('version')
                            ->label('Document Version')
                            ->maxLength(20)
                            ->helperText('Version of terms/policy accepted'),

                        Forms\Components\DateTimePicker::make('expires_at')
                            ->label('Consent Expires')
                            ->helperText('Optional: When consent needs renewal'),

                        Forms\Components\Toggle::make('is_verified')
                            ->label('Verified')
                            ->default(false)
                            ->helperText('Whether consent has been verified'),
                    ])->columns(3),

                Forms\Components\Section::make('GDPR Compliance')
                    ->schema([
                        Forms\Components\Toggle::make('is_required')
                            ->label('Required for Service')
                            ->default(false)
                            ->helperText('Cannot use service without this consent'),

                        Forms\Components\Toggle::make('is_marketing')
                            ->label('Marketing Consent')
                            ->default(false)
                            ->helperText('Related to marketing communications'),

                        Forms\Components\TextInput::make('legal_basis')
                            ->label('Legal Basis (GDPR)')
                            ->maxLength(100)
                            ->helperText('e.g., Legitimate interest, Contract, Consent')
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('notes')
                            ->label('Internal Notes')
                            ->rows(3)
                            ->helperText('Private admin notes')
                            ->columnSpanFull(),
                    ])->columns(2)
                    ->collapsed(),

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

                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->sortable()
                    ->searchable()
                    ->weight('bold')
                    ->limit(25),

                Tables\Columns\BadgeColumn::make('consent_type')
                    ->label('Type')
                    ->colors([
                        'primary' => fn ($state) => in_array($state, ['terms_and_conditions', 'privacy_policy']),
                        'warning' => 'cookie_policy',
                        'info' => fn ($state) => in_array($state, ['marketing_emails', 'marketing_sms', 'newsletter']),
                        'success' => fn ($state) => in_array($state, ['data_processing', 'analytics']),
                        'secondary' => fn ($state) => in_array($state, ['third_party_sharing', 'push_notifications']),
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'terms_and_conditions' => 'Terms & Conditions',
                        'privacy_policy' => 'Privacy Policy',
                        'cookie_policy' => 'Cookie Policy',
                        'marketing_emails' => 'Marketing Emails',
                        'marketing_sms' => 'Marketing SMS',
                        'data_processing' => 'Data Processing',
                        'analytics' => 'Analytics',
                        'third_party_sharing' => 'Third-Party Sharing',
                        'newsletter' => 'Newsletter',
                        'push_notifications' => 'Push Notifications',
                        default => ucwords(str_replace('_', ' ', $state)),
                    })
                    ->sortable()
                    ->searchable(),

                Tables\Columns\IconColumn::make('is_given')
                    ->label('Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->sortable(),

                Tables\Columns\TextColumn::make('given_at')
                    ->label('Given At')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('withdrawn_at')
                    ->label('Withdrawn At')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->color('danger')
                    ->toggleable()
                    ->visible(fn ($record) => !empty($record->withdrawn_at)),

                Tables\Columns\BadgeColumn::make('consent_method')
                    ->label('Method')
                    ->colors([
                        'primary' => fn ($state) => in_array($state, ['checkbox', 'button']),
                        'info' => fn ($state) => in_array($state, ['banner', 'popup']),
                        'secondary' => 'implicit',
                        'warning' => fn ($state) => in_array($state, ['verbal', 'written']),
                        'danger' => 'admin',
                    ])
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\IconColumn::make('is_required')
                    ->label('Required')
                    ->boolean()
                    ->trueIcon('heroicon-o-exclamation-triangle')
                    ->falseIcon('heroicon-o-minus')
                    ->trueColor('warning')
                    ->falseColor('gray')
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\IconColumn::make('is_marketing')
                    ->label('Marketing')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('expires_at')
                    ->label('Expires')
                    ->date('d M Y')
                    ->sortable()
                    ->color(fn ($record) => 
                        $record->expires_at && $record->expires_at->isPast() ? 'danger' : 'gray'
                    )
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('consent_type')
                    ->label('Consent Type')
                    ->options([
                        'terms_and_conditions' => 'Terms & Conditions',
                        'privacy_policy' => 'Privacy Policy',
                        'cookie_policy' => 'Cookie Policy',
                        'marketing_emails' => 'Marketing Emails',
                        'marketing_sms' => 'Marketing SMS',
                        'data_processing' => 'Data Processing',
                        'analytics' => 'Analytics',
                        'third_party_sharing' => 'Third-Party Sharing',
                        'newsletter' => 'Newsletter',
                        'push_notifications' => 'Push Notifications',
                    ])
                    ->multiple(),

                Tables\Filters\TernaryFilter::make('is_given')
                    ->label('Consent Status')
                    ->placeholder('All consents')
                    ->trueLabel('Given')
                    ->falseLabel('Withdrawn'),

                Tables\Filters\SelectFilter::make('consent_method')
                    ->label('Method')
                    ->options([
                        'checkbox' => 'Checkbox',
                        'button' => 'Button',
                        'banner' => 'Banner',
                        'popup' => 'Popup',
                        'implicit' => 'Implicit',
                        'verbal' => 'Verbal',
                        'written' => 'Written',
                        'admin' => 'Admin',
                    ])
                    ->multiple(),

                Tables\Filters\TernaryFilter::make('is_required')
                    ->label('Required for Service')
                    ->placeholder('All')
                    ->trueLabel('Required only')
                    ->falseLabel('Optional only'),

                Tables\Filters\TernaryFilter::make('is_marketing')
                    ->label('Marketing Consent')
                    ->placeholder('All')
                    ->trueLabel('Marketing only')
                    ->falseLabel('Non-marketing only'),

                Tables\Filters\Filter::make('expired')
                    ->label('Expired Consents')
                    ->query(fn (Builder $query) => 
                        $query->whereNotNull('expires_at')
                            ->whereDate('expires_at', '<', now())
                    ),

                Tables\Filters\Filter::make('expiring_soon')
                    ->label('Expiring Soon (30 days)')
                    ->query(fn (Builder $query) => 
                        $query->whereNotNull('expires_at')
                            ->whereDate('expires_at', '<=', now()->addDays(30))
                            ->whereDate('expires_at', '>=', now())
                    ),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\Action::make('withdraw')
                    ->label('Withdraw')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->form([
                        Forms\Components\Textarea::make('withdrawal_reason')
                            ->label('Reason for Withdrawal')
                            ->required()
                            ->rows(3),
                    ])
                    ->action(fn (UserConsent $record, array $data) => 
                        $record->update([
                            'is_given' => false,
                            'withdrawn_at' => now(),
                            'withdrawal_reason' => $data['withdrawal_reason'],
                        ])
                    )
                    ->visible(fn (UserConsent $record) => $record->is_given),

                Tables\Actions\Action::make('renew')
                    ->label('Renew')
                    ->icon('heroicon-o-arrow-path')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn (UserConsent $record) => 
                        $record->update([
                            'is_given' => true,
                            'given_at' => now(),
                            'withdrawn_at' => null,
                            'withdrawal_reason' => null,
                            'expires_at' => now()->addYear(),
                        ])
                    )
                    ->visible(fn (UserConsent $record) => !$record->is_given),

                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('withdraw_selected')
                        ->label('Withdraw Selected')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->form([
                            Forms\Components\Textarea::make('withdrawal_reason')
                                ->label('Reason for Withdrawal')
                                ->required()
                                ->rows(3),
                        ])
                        ->requiresConfirmation()
                        ->action(fn ($records, array $data) => 
                            $records->each->update([
                                'is_given' => false,
                                'withdrawn_at' => now(),
                                'withdrawal_reason' => $data['withdrawal_reason'],
                            ])
                        ),

                    Tables\Actions\BulkAction::make('renew_selected')
                        ->label('Renew Selected')
                        ->icon('heroicon-o-arrow-path')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => 
                            $records->each->update([
                                'is_given' => true,
                                'given_at' => now(),
                                'withdrawn_at' => null,
                                'expires_at' => now()->addYear(),
                            ])
                        ),

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
            'index' => ListUserConsents::route('/'),
            'create' => CreateUserConsent::route('/create'),
            'view' => ViewUserConsent::route('/{record}'),
            'edit' => EditUserConsent::route('/{record}/edit'),
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
        return ['user.name', 'consent_type', 'ip_address'];
    }
}
