<?php

namespace App\Filament\Resources;

use App\Filament\Resources\KYCVerificationResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;

class KYCVerificationResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-identification';
    protected static ?string $navigationLabel = 'KYC Verification';
    protected static ?string $slug = 'kyc-verification';
    protected static ?int $navigationSort = 2;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->whereNotNull('kyc_submitted_at')
            ->where('user_type', 'buyer')
            ->orderBy('kyc_submitted_at', 'desc');
    }

    public static function form(Schema $schema): Schema
    {
        return $form
            ->schema([
                Forms\Components\Section::make('User Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->disabled(),
                        Forms\Components\TextInput::make('email')
                            ->disabled(),
                        Forms\Components\TextInput::make('phone')
                            ->disabled(),
                    ])->columns(3),

                Forms\Components\Section::make('KYC Documents')
                    ->schema([
                        Forms\Components\Select::make('id_document_type')
                            ->label('Document Type')
                            ->options([
                                'passport' => 'Passport',
                                'id_card' => 'ID Card',
                                'drivers_license' => 'Driver\'s License',
                            ])
                            ->disabled(),
                        
                        Forms\Components\TextInput::make('id_document_number')
                            ->label('Document Number')
                            ->disabled(),

                        Forms\Components\Placeholder::make('id_document_image')
                            ->label('ID Document Image')
                            ->content(fn ($record) => $record && $record->id_document_image 
                                ? view('filament.kyc-image', ['path' => $record->id_document_image])
                                : 'No image uploaded'
                            ),

                        Forms\Components\Placeholder::make('selfie_image')
                            ->label('Selfie with ID')
                            ->content(fn ($record) => $record && $record->selfie_image 
                                ? view('filament.kyc-image', ['path' => $record->selfie_image])
                                : 'No image uploaded'
                            ),
                    ])->columns(2),

                Forms\Components\Section::make('Verification')
                    ->schema([
                        Forms\Components\Select::make('kyc_status')
                            ->label('KYC Status')
                            ->options([
                                'pending' => 'Pending',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                            ])
                            ->required(),

                        Forms\Components\Textarea::make('kyc_rejection_reason')
                            ->label('Rejection Reason')
                            ->visible(fn ($get) => $get('kyc_status') === 'rejected')
                            ->required(fn ($get) => $get('kyc_status') === 'rejected'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('id_document_type')
                    ->label('Doc Type')
                    ->badge()
                    ->formatStateUsing(fn ($state) => match($state) {
                        'passport' => 'Passport',
                        'id_card' => 'ID Card',
                        'drivers_license' => 'Driver\'s License',
                        default => $state,
                    }),

                Tables\Columns\TextColumn::make('kyc_status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state) => match($state) {
                        'pending' => 'warning',
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('kyc_submitted_at')
                    ->label('Submitted')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('kyc_status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('view_documents')
                    ->label('View Docs')
                    ->icon('heroicon-o-eye')
                    ->url(fn ($record) => route('filament.admin.resources.kyc-verification.view', $record)),
                
                Tables\Actions\Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->update([
                            'kyc_status' => 'approved',
                            'kyc_verified_at' => now(),
                        ]);
                        
                        $record->notify(new \App\Notifications\KYCApprovedNotification());
                        
                        \Filament\Notifications\Notification::make()
                            ->title('KYC Approved')
                            ->success()
                            ->body('User has been notified via email.')
                            ->send();
                    })
                    ->visible(fn ($record) => $record->kyc_status === 'pending'),

                Tables\Actions\Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->form([
                        Forms\Components\Textarea::make('reason')
                            ->label('Rejection Reason')
                            ->required(),
                    ])
                    ->action(function ($record, array $data) {
                        $record->update([
                            'kyc_status' => 'rejected',
                            'kyc_rejection_reason' => $data['reason'],
                        ]);
                        
                        $record->notify(new \App\Notifications\KYCRejectedNotification($data['reason']));
                        
                        \Filament\Notifications\Notification::make()
                            ->title('KYC Rejected')
                            ->warning()
                            ->body('User has been notified via email.')
                            ->send();
                    })
                    ->visible(fn ($record) => $record->kyc_status === 'pending'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('approve_selected')
                        ->label('Approve Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update([
                            'kyc_status' => 'approved',
                            'kyc_verified_at' => now(),
                        ])),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListKYCVerifications::route('/'),
            'view' => Pages\ViewKYCVerification::route('/{record}'),
            'edit' => Pages\EditKYCVerification::route('/{record}/edit'),
        ];
    }
}
