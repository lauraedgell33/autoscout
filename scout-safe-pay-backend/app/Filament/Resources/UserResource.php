<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationLabel = 'Users';
    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $form
            ->schema([
                Forms\Components\Section::make('User Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),

                        Forms\Components\TextInput::make('phone')
                            ->tel()
                            ->maxLength(20),

                        Forms\Components\TextInput::make('password')
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $context): bool => $context === 'create')
                            ->maxLength(255)
                            ->hint('Leave blank to keep current password'),
                    ])->columns(2),

                Forms\Components\Section::make('Role & Permissions')
                    ->schema([
                        Forms\Components\Select::make('user_type')
                            ->options([
                                'buyer' => 'Buyer',
                                'seller' => 'Seller',
                                'admin' => 'Admin',
                            ])
                            ->required()
                            ->default('buyer'),

                        Forms\Components\Select::make('dealer_id')
                            ->relationship('dealer', 'company_name')
                            ->searchable()
                            ->preload()
                            ->hint('Assign to a dealer (only for sellers)'),

                        Forms\Components\Toggle::make('is_verified')
                            ->label('Email Verified')
                            ->default(false),
                    ])->columns(3),

                Forms\Components\Section::make('Address')
                    ->schema([
                        Forms\Components\TextInput::make('address')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('city')
                            ->maxLength(100),

                        Forms\Components\TextInput::make('postal_code')
                            ->maxLength(20),

                        Forms\Components\Select::make('country')
                            ->options([
                                'DE' => 'Germany',
                                'AT' => 'Austria',
                                'CH' => 'Switzerland',
                                'FR' => 'France',
                                'IT' => 'Italy',
                                'NL' => 'Netherlands',
                            ])
                            ->default('DE')
                            ->searchable(),
                    ])->columns(2),

                Forms\Components\Section::make('KYC Status')
                    ->schema([
                        Forms\Components\Select::make('kyc_status')
                            ->options([
                                'pending' => 'Pending',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                            ])
                            ->disabled(),

                        Forms\Components\DateTimePicker::make('kyc_submitted_at')
                            ->disabled(),

                        Forms\Components\DateTimePicker::make('kyc_verified_at')
                            ->disabled(),

                        Forms\Components\Textarea::make('kyc_rejection_reason')
                            ->rows(2)
                            ->disabled(),
                    ])->columns(2)
                    ->visible(fn ($record) => $record?->kyc_submitted_at !== null),

                Forms\Components\Section::make('Metadata')
                    ->schema([
                        Forms\Components\TextInput::make('locale')
                            ->maxLength(10)
                            ->default('en'),

                        Forms\Components\TextInput::make('timezone')
                            ->maxLength(50)
                            ->default('UTC'),

                        Forms\Components\DateTimePicker::make('last_login_at')
                            ->disabled(),

                        Forms\Components\TextInput::make('last_login_ip')
                            ->disabled(),
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
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->copyable(),

                Tables\Columns\BadgeColumn::make('user_type')
                    ->label('Role')
                    ->colors([
                        'info' => 'buyer',
                        'warning' => 'seller',
                        'danger' => 'admin',
                    ])
                    ->formatStateUsing(fn ($state) => ucfirst($state)),

                Tables\Columns\TextColumn::make('dealer.company_name')
                    ->label('Dealer')
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\IconColumn::make('is_verified')
                    ->label('Verified')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),

                Tables\Columns\BadgeColumn::make('kyc_status')
                    ->label('KYC')
                    ->colors([
                        'secondary' => fn ($state) => $state === null,
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ])
                    ->formatStateUsing(fn ($state) => $state ? ucfirst($state) : 'N/A')
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('last_login_at')
                    ->label('Last Login')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('user_type')
                    ->label('Role')
                    ->options([
                        'buyer' => 'Buyer',
                        'seller' => 'Seller',
                        'admin' => 'Admin',
                    ]),

                Tables\Filters\SelectFilter::make('kyc_status')
                    ->label('KYC Status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),

                Tables\Filters\TernaryFilter::make('is_verified')
                    ->label('Email Verified')
                    ->boolean()
                    ->trueLabel('Verified')
                    ->falseLabel('Not Verified')
                    ->nullable(),

                Tables\Filters\TernaryFilter::make('dealer_id')
                    ->label('Has Dealer')
                    ->boolean()
                    ->queries(
                        true: fn (Builder $query) => $query->whereNotNull('dealer_id'),
                        false: fn (Builder $query) => $query->whereNull('dealer_id'),
                    ),

                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from')
                            ->label('Registered From'),
                        Forms\Components\DatePicker::make('created_until')
                            ->label('Registered Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\Action::make('impersonate')
                    ->label('Login As')
                    ->icon('heroicon-o-arrow-right-on-rectangle')
                    ->color('info')
                    ->requiresConfirmation()
                    ->modalHeading('Login as this user?')
                    ->modalDescription(fn ($record) => "You will be logged in as {$record->name} ({$record->email})")
                    ->action(fn () => null)
                    ->visible(fn ($record) => auth()->user()->user_type === 'admin' && $record->id !== auth()->id()),

                Tables\Actions\Action::make('view_kyc')
                    ->label('View KYC')
                    ->icon('heroicon-o-identification')
                    ->color('warning')
                    ->url(fn ($record) => route('filament.admin.resources.kyc-verification.view', $record))
                    ->visible(fn ($record) => $record->kyc_submitted_at !== null),

                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),

                Tables\Actions\Action::make('verify_email')
                    ->label('Verify Email')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['is_verified' => true]))
                    ->visible(fn ($record) => !$record->is_verified),

                Tables\Actions\DeleteAction::make()
                    ->visible(fn ($record) => $record->id !== auth()->id()),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('verify_emails')
                        ->label('Verify Emails')
                        ->icon('heroicon-o-check-badge')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['is_verified' => true])),

                    Tables\Actions\BulkAction::make('make_sellers')
                        ->label('Make Sellers')
                        ->icon('heroicon-o-building-storefront')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['user_type' => 'seller'])),

                    Tables\Actions\DeleteBulkAction::make(),
                ]),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'view' => Pages\ViewUser::route('/{record}'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        $today = now()->startOfDay();
        return static::getModel()::where('created_at', '>=', $today)->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }
}
