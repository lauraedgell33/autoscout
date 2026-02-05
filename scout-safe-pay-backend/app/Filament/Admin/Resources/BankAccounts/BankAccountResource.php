<?php

namespace App\Filament\Admin\Resources\BankAccounts;

use App\Filament\Admin\Resources\BankAccounts\Pages\CreateBankAccount;
use App\Filament\Admin\Resources\BankAccounts\Pages\EditBankAccount;
use App\Filament\Admin\Resources\BankAccounts\Pages\ListBankAccounts;
use App\Models\BankAccount;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components as FormComponents;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class BankAccountResource extends Resource
{
    protected static ?string $model = BankAccount::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-building-library';
    
    protected static ?string $navigationLabel = 'Bank Accounts';
    
    protected static ?string $recordTitleAttribute = 'account_holder_name';
    
    public static function getNavigationGroup(): ?string
    {
        return 'Financial';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 1;
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_verified', false)->count() ?: null;
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        $count = static::getModel()::where('is_verified', false)->count();
        return $count > 5 ? 'danger' : ($count > 0 ? 'warning' : null);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                SchemaComponents\Section::make('Account Information')
                    ->schema([
                        FormComponents\Select::make('accountable_type')
                            ->label('Account Owner Type')
                            ->options([
                                'App\Models\User' => 'User',
                                'App\Models\Dealer' => 'Dealer',
                            ])
                            ->required()
                            ->reactive()
                            ->searchable(),

                        FormComponents\Select::make('accountable_id')
                            ->label('Account Owner')
                            ->options(function (callable $get) {
                                $type = $get('accountable_type');
                                if ($type === 'App\Models\User') {
                                    return \App\Models\User::pluck('name', 'id');
                                } elseif ($type === 'App\Models\Dealer') {
                                    return \App\Models\Dealer::pluck('name', 'id');
                                }
                                return [];
                            })
                            ->required()
                            ->searchable(),

                        FormComponents\TextInput::make('account_holder_name')
                            ->label('Account Holder Name')
                            ->required()
                            ->maxLength(255),

                        FormComponents\TextInput::make('iban')
                            ->label('IBAN')
                            ->required()
                            ->maxLength(34)
                            ->placeholder('DE89370400440532013000')
                            ->helperText('Will be encrypted in database'),

                        FormComponents\TextInput::make('swift_bic')
                            ->label('SWIFT/BIC Code')
                            ->maxLength(11)
                            ->placeholder('COBADEFFXXX'),

                        FormComponents\TextInput::make('bank_name')
                            ->label('Bank Name')
                            ->required()
                            ->maxLength(255),

                        FormComponents\Select::make('bank_country')
                            ->label('Bank Country')
                            ->options([
                                'DE' => 'Germany',
                                'RO' => 'Romania',
                                'AT' => 'Austria',
                                'CH' => 'Switzerland',
                                'FR' => 'France',
                                'IT' => 'Italy',
                                'NL' => 'Netherlands',
                                'BE' => 'Belgium',
                                'ES' => 'Spain',
                                'PL' => 'Poland',
                            ])
                            ->required()
                            ->searchable(),

                        FormComponents\Select::make('currency')
                            ->label('Currency')
                            ->options([
                                'EUR' => 'Euro (EUR)',
                                'RON' => 'Romanian Leu (RON)',
                                'CHF' => 'Swiss Franc (CHF)',
                                'GBP' => 'British Pound (GBP)',
                            ])
                            ->default('EUR')
                            ->required(),
                    ])->columns(2),

                SchemaComponents\Section::make('Verification')
                    ->schema([
                        FormComponents\Toggle::make('is_verified')
                            ->label('Verified')
                            ->default(false)
                            ->reactive(),

                        FormComponents\Toggle::make('is_primary')
                            ->label('Primary Account')
                            ->default(false)
                            ->helperText('Only one primary account per owner'),

                        FormComponents\Select::make('verified_by')
                            ->label('Verified By')
                            ->relationship('verifier', 'name')
                            ->searchable()
                            ->visible(fn (callable $get) => $get('is_verified')),

                        FormComponents\DateTimePicker::make('verified_at')
                            ->label('Verified At')
                            ->visible(fn (callable $get) => $get('is_verified')),

                        FormComponents\Textarea::make('verification_notes')
                            ->label('Verification Notes')
                            ->rows(3)
                            ->visible(fn (callable $get) => $get('is_verified')),

                        FormComponents\FileUpload::make('bank_statement_url')
                            ->label('Bank Statement')
                            ->directory('bank-statements')
                            ->acceptedFileTypes(['application/pdf', 'image/jpeg', 'image/png'])
                            ->maxSize(5120)
                            ->helperText('Upload bank statement for verification (PDF or image, max 5MB)'),
                    ])->columns(2),
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

                Tables\Columns\TextColumn::make('account_holder_name')
                    ->label('Account Holder')
                    ->sortable()
                    ->searchable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('accountable_type')
                    ->label('Owner Type')
                    ->formatStateUsing(fn (string $state): string => class_basename($state))
                    ->badge()
                    ->color(fn (string $state): string => match (class_basename($state)) {
                        'User' => 'info',
                        'Dealer' => 'success',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('accountable.name')
                    ->label('Owner')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('iban')
                    ->label('IBAN')
                    ->formatStateUsing(function ($state) {
                        try {
                            // Show only last 4 characters for security
                            return $state ? '****' . substr($state, -4) : '—';
                        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                            return '[Decryption Error]';
                        }
                    })
                    ->copyable()
                    ->copyMessage('IBAN copied')
                    ->copyMessageDuration(1500),

                Tables\Columns\TextColumn::make('bank_name')
                    ->label('Bank')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('bank_country')
                    ->label('Country')
                    ->badge()
                    ->sortable(),

                Tables\Columns\TextColumn::make('currency')
                    ->label('Currency')
                    ->badge()
                    ->color('primary'),

                Tables\Columns\IconColumn::make('is_verified')
                    ->label('Verified')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_primary')
                    ->label('Primary')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-star')
                    ->trueColor('warning')
                    ->falseColor('gray')
                    ->sortable(),

                Tables\Columns\TextColumn::make('verified_at')
                    ->label('Verified')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Added')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('accountable_type')
                    ->label('Owner Type')
                    ->options([
                        'App\Models\User' => 'User',
                        'App\Models\Dealer' => 'Dealer',
                    ]),

                Tables\Filters\TernaryFilter::make('is_verified')
                    ->label('Verification Status')
                    ->placeholder('All accounts')
                    ->trueLabel('Verified only')
                    ->falseLabel('Unverified only'),

                Tables\Filters\TernaryFilter::make('is_primary')
                    ->label('Primary Account')
                    ->placeholder('All accounts')
                    ->trueLabel('Primary only')
                    ->falseLabel('Secondary only'),

                Tables\Filters\SelectFilter::make('bank_country')
                    ->label('Country')
                    ->options([
                        'DE' => 'Germany',
                        'RO' => 'Romania',
                        'AT' => 'Austria',
                        'CH' => 'Switzerland',
                        'FR' => 'France',
                        'IT' => 'Italy',
                        'NL' => 'Netherlands',
                    ])
                    ->multiple(),

                Tables\Filters\SelectFilter::make('currency')
                    ->label('Currency')
                    ->options([
                        'EUR' => 'Euro',
                        'RON' => 'Romanian Leu',
                        'CHF' => 'Swiss Franc',
                        'GBP' => 'British Pound',
                    ])
                    ->multiple(),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Action::make('verify')
                    ->label('Verify')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn (BankAccount $record) => $record->update([
                        'is_verified' => true,
                        'verified_by' => auth()->id(),
                        'verified_at' => now(),
                    ]))
                    ->visible(fn (BankAccount $record) => !$record->is_verified),

                Action::make('unverify')
                    ->label('Unverify')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn (BankAccount $record) => $record->update([
                        'is_verified' => false,
                        'verified_by' => null,
                        'verified_at' => null,
                    ]))
                    ->visible(fn (BankAccount $record) => $record->is_verified),

                Action::make('setPrimary')
                    ->label('Set Primary')
                    ->icon('heroicon-o-star')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->action(function (BankAccount $record) {
                        // Unset other primary accounts for same owner
                        BankAccount::where('accountable_type', $record->accountable_type)
                            ->where('accountable_id', $record->accountable_id)
                            ->update(['is_primary' => false]);
                        
                        // Set this as primary
                        $record->update(['is_primary' => true]);
                    })
                    ->visible(fn (BankAccount $record) => !$record->is_primary),

                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
                ForceDeleteAction::make(),
                RestoreAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    BulkAction::make('verify_selected')
                        ->label('Verify Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update([
                            'is_verified' => true,
                            'verified_by' => auth()->id(),
                            'verified_at' => now(),
                        ])),

                    BulkAction::make('unverify_selected')
                        ->label('Unverify Selected')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update([
                            'is_verified' => false,
                            'verified_by' => null,
                            'verified_at' => null,
                        ])),

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
            'index' => ListBankAccounts::route('/'),
            'create' => CreateBankAccount::route('/create'),
            'edit' => EditBankAccount::route('/{record}/edit'),
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
