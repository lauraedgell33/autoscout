<?php

namespace App\Filament\Admin\Resources\Verifications;

use App\Filament\Admin\Resources\Verifications\Pages\ListVerifications;
use App\Filament\Admin\Resources\Verifications\Pages\ViewVerification;
use App\Models\Verification;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\Section as InfolistSection;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class VerificationResource extends Resource
{
    protected static ?string $model = Verification::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-identification';

    protected static ?string $recordTitleAttribute = 'id';

    protected static ?string $navigationLabel = 'KYC Verifications';

    protected static ?string $modelLabel = 'Verification';

    protected static ?string $pluralModelLabel = 'Verifications';

    public static function getNavigationGroup(): ?string
    {
        return 'Management';
    }

    public static function getNavigationSort(): ?int
    {
        return 2;
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['user.name', 'user.email', 'document_number', 'vin_number'];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Verification Details')
                    ->schema([
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Select::make('type')
                            ->options([
                                'identity' => 'Identity Verification',
                                'address' => 'Address Verification',
                                'vehicle' => 'Vehicle Verification',
                                'dealer' => 'Dealer Verification',
                            ])
                            ->required(),

                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'in_review' => 'In Review',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                                'expired' => 'Expired',
                            ])
                            ->default('pending')
                            ->required(),

                        Select::make('document_type')
                            ->options([
                                'passport' => 'Passport',
                                'id_card' => 'ID Card',
                                'driving_license' => 'Driving License',
                                'residence_permit' => 'Residence Permit',
                            ]),

                        TextInput::make('document_number')
                            ->maxLength(100),

                        DatePicker::make('document_expiry')
                            ->label('Document Expiry Date'),

                        TextInput::make('vin_number')
                            ->label('VIN Number')
                            ->maxLength(17)
                            ->visible(fn ($get) => $get('type') === 'vehicle'),

                        Textarea::make('review_notes')
                            ->label('Review Notes')
                            ->rows(3)
                            ->columnSpanFull(),

                        Textarea::make('rejection_reason')
                            ->label('Rejection Reason')
                            ->rows(2)
                            ->columnSpanFull()
                            ->visible(fn ($get) => $get('status') === 'rejected'),

                        DatePicker::make('expires_at')
                            ->label('Verification Expires At'),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->searchable()
                    ->limit(8),

                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'identity' => '🆔 Identity',
                        'address' => '🏠 Address',
                        'vehicle' => '🚗 Vehicle',
                        'dealer' => '🏢 Dealer',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'identity' => 'info',
                        'address' => 'success',
                        'vehicle' => 'warning',
                        'dealer' => 'primary',
                        default => 'gray',
                    }),

                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'approved' => '✅ Approved',
                        'rejected' => '❌ Rejected',
                        'pending' => '⏳ Pending',
                        'in_review' => '🔍 In Review',
                        'expired' => '⌛ Expired',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'approved' => 'success',
                        'rejected' => 'danger',
                        'pending' => 'warning',
                        'in_review' => 'info',
                        'expired' => 'gray',
                        default => 'gray',
                    }),

                TextColumn::make('document_type')
                    ->toggleable(),

                TextColumn::make('reviewer.name')
                    ->label('Reviewed By')
                    ->toggleable(),

                TextColumn::make('reviewed_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'in_review' => 'In Review',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                        'expired' => 'Expired',
                    ])
                    ->multiple(),

                SelectFilter::make('type')
                    ->options([
                        'identity' => 'Identity',
                        'address' => 'Address',
                        'vehicle' => 'Vehicle',
                        'dealer' => 'Dealer',
                    ])
                    ->multiple(),
            ])
            ->actions([
                ActionGroup::make([
                    ViewAction::make(),

                    Action::make('approve')
                        ->label('Approve')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->visible(fn (Verification $record): bool => in_array($record->status, ['pending', 'in_review']))
                        ->action(function (Verification $record) {
                            $record->update([
                                'status' => 'approved',
                                'reviewed_by' => auth()->id(),
                                'reviewed_at' => now(),
                                'expires_at' => now()->addYear(),
                            ]);

                            // Update user KYC status if identity verification
                            if ($record->type === 'identity' && $record->user) {
                                $record->user->update([
                                    'kyc_status' => 'verified',
                                    'kyc_verified_at' => now(),
                                    'kyc_verified_by' => auth()->id(),
                                    'is_verified' => true,
                                ]);
                            }

                            Notification::make()
                                ->title('Verification Approved')
                                ->success()
                                ->send();
                        }),

                    Action::make('reject')
                        ->label('Reject')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->form([
                            Textarea::make('rejection_reason')
                                ->label('Rejection Reason')
                                ->required()
                                ->rows(3),
                        ])
                        ->visible(fn (Verification $record): bool => in_array($record->status, ['pending', 'in_review']))
                        ->action(function (Verification $record, array $data) {
                            $record->update([
                                'status' => 'rejected',
                                'rejection_reason' => $data['rejection_reason'],
                                'reviewed_by' => auth()->id(),
                                'reviewed_at' => now(),
                            ]);

                            // Update user KYC status if identity verification
                            if ($record->type === 'identity' && $record->user) {
                                $record->user->update([
                                    'kyc_status' => 'rejected',
                                    'kyc_rejection_reason' => $data['rejection_reason'],
                                ]);
                            }

                            Notification::make()
                                ->title('Verification Rejected')
                                ->danger()
                                ->send();
                        }),

                    Action::make('start_review')
                        ->label('Start Review')
                        ->icon('heroicon-o-eye')
                        ->color('info')
                        ->visible(fn (Verification $record): bool => $record->status === 'pending')
                        ->action(function (Verification $record) {
                            $record->update([
                                'status' => 'in_review',
                                'reviewed_by' => auth()->id(),
                            ]);

                            Notification::make()
                                ->title('Review Started')
                                ->info()
                                ->send();
                        }),
                ]),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    BulkAction::make('approve_selected')
                        ->label('Approve Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function (Collection $records) {
                            $records->each(function (Verification $record) {
                                if (in_array($record->status, ['pending', 'in_review'])) {
                                    $record->update([
                                        'status' => 'approved',
                                        'reviewed_by' => auth()->id(),
                                        'reviewed_at' => now(),
                                        'expires_at' => now()->addYear(),
                                    ]);

                                    if ($record->type === 'identity' && $record->user) {
                                        $record->user->update([
                                            'kyc_status' => 'verified',
                                            'kyc_verified_at' => now(),
                                            'kyc_verified_by' => auth()->id(),
                                            'is_verified' => true,
                                        ]);
                                    }
                                }
                            });

                            Notification::make()
                                ->title('Selected verifications approved')
                                ->success()
                                ->send();
                        }),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                InfolistSection::make('User Information')
                    ->schema([
                        TextEntry::make('user.name')
                            ->label('Name'),
                        TextEntry::make('user.email')
                            ->label('Email'),
                        TextEntry::make('user.phone')
                            ->label('Phone'),
                        TextEntry::make('user.kyc_status')
                            ->label('KYC Status')
                            ->badge(),
                    ])
                    ->columns(2),

                InfolistSection::make('Verification Details')
                    ->schema([
                        TextEntry::make('type')
                            ->badge(),
                        TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'approved' => 'success',
                                'rejected' => 'danger',
                                'pending' => 'warning',
                                'in_review' => 'info',
                                default => 'gray',
                            }),
                        TextEntry::make('document_type'),
                        TextEntry::make('document_number'),
                        TextEntry::make('document_expiry')
                            ->date(),
                        TextEntry::make('vin_number')
                            ->label('VIN'),
                        TextEntry::make('expires_at')
                            ->dateTime(),
                    ])
                    ->columns(3),

                InfolistSection::make('Review Information')
                    ->schema([
                        TextEntry::make('reviewer.name')
                            ->label('Reviewed By'),
                        TextEntry::make('reviewed_at')
                            ->dateTime(),
                        TextEntry::make('review_notes')
                            ->columnSpanFull(),
                        TextEntry::make('rejection_reason')
                            ->columnSpanFull()
                            ->visible(fn ($record) => $record->status === 'rejected'),
                    ])
                    ->columns(2),

                InfolistSection::make('Submitted Data')
                    ->schema([
                        KeyValueEntry::make('submitted_data')
                            ->columnSpanFull(),
                    ])
                    ->collapsed(),

                InfolistSection::make('Verification Result')
                    ->schema([
                        KeyValueEntry::make('verification_result')
                            ->columnSpanFull(),
                    ])
                    ->collapsed(),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListVerifications::route('/'),
            'view' => ViewVerification::route('/{record}'),
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
