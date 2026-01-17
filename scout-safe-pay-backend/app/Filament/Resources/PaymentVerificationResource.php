<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentVerificationResource\Pages;
use App\Models\Transaction;
use App\Notifications\PaymentReceivedNotification;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;

class PaymentVerificationResource extends Resource
{
    protected static ?string $model = Transaction::class;
    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    protected static ?string $navigationLabel = 'Payment Verification';
    protected static ?string $slug = 'payment-verification';
    protected static ?int $navigationSort = 3;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->whereNotNull('payment_proof')
            ->where('status', 'pending')
            ->with(['buyer', 'vehicle', 'seller'])
            ->orderBy('created_at', 'desc');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Transaction Information')
                    ->schema([
                        Forms\Components\TextInput::make('id')
                            ->label('Transaction ID')
                            ->disabled(),
                        
                        Forms\Components\TextInput::make('amount')
                            ->label('Amount')
                            ->prefix('€')
                            ->disabled(),

                        Forms\Components\TextInput::make('status')
                            ->disabled(),

                        Forms\Components\DateTimePicker::make('created_at')
                            ->label('Created At')
                            ->disabled(),
                    ])->columns(2),

                Forms\Components\Section::make('Buyer Information')
                    ->schema([
                        Forms\Components\TextInput::make('buyer.name')
                            ->label('Buyer Name')
                            ->disabled(),
                        
                        Forms\Components\TextInput::make('buyer.email')
                            ->label('Buyer Email')
                            ->disabled(),
                    ])->columns(2),

                Forms\Components\Section::make('Vehicle Information')
                    ->schema([
                        Forms\Components\TextInput::make('vehicle.make')
                            ->label('Make')
                            ->disabled(),
                        
                        Forms\Components\TextInput::make('vehicle.model')
                            ->label('Model')
                            ->disabled(),

                        Forms\Components\TextInput::make('vehicle.year')
                            ->label('Year')
                            ->disabled(),
                    ])->columns(3),

                Forms\Components\Section::make('Payment Proof')
                    ->schema([
                        Forms\Components\Placeholder::make('payment_proof')
                            ->label('Uploaded Payment Receipt')
                            ->content(fn ($record) => $record && $record->payment_proof 
                                ? view('filament.payment-proof', ['path' => $record->payment_proof])
                                : 'No payment proof uploaded'
                            ),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('Transaction ID')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('buyer.name')
                    ->label('Buyer')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('vehicle.make')
                    ->label('Vehicle')
                    ->formatStateUsing(fn ($record) => 
                        $record->vehicle->make . ' ' . $record->vehicle->model
                    )
                    ->searchable(),

                Tables\Columns\TextColumn::make('amount')
                    ->label('Amount')
                    ->money('EUR')
                    ->sortable(),

                Tables\Columns\IconColumn::make('payment_proof')
                    ->label('Has Proof')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Submitted')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('vehicle.category')
                    ->label('Vehicle Category')
                    ->relationship('vehicle', 'category'),
            ])
            ->actions([
                Tables\Actions\Action::make('view_proof')
                    ->label('View Proof')
                    ->icon('heroicon-o-eye')
                    ->modalHeading('Payment Proof')
                    ->modalContent(fn ($record) => view('filament.payment-proof-modal', ['transaction' => $record]))
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('Close'),

                Tables\Actions\Action::make('verify')
                    ->label('Verify Payment')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Verify Payment')
                    ->modalDescription(fn ($record) => 
                        'Are you sure you want to verify the payment of €' . 
                        number_format($record->amount, 2) . 
                        ' for Transaction #' . $record->id . '?'
                    )
                    ->action(function ($record) {
                        $record->update([
                            'status' => 'payment_received',
                            'payment_verified_at' => now(),
                        ]);

                        // Send notification to buyer
                        $record->buyer->notify(new PaymentReceivedNotification($record));

                        \Filament\Notifications\Notification::make()
                            ->title('Payment Verified')
                            ->success()
                            ->body('Buyer has been notified via email.')
                            ->send();
                    }),

                Tables\Actions\Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->form([
                        Forms\Components\Textarea::make('reason')
                            ->label('Rejection Reason')
                            ->required()
                            ->placeholder('Please provide a reason for rejection...'),
                    ])
                    ->action(function ($record, array $data) {
                        $record->update([
                            'payment_proof' => null,
                            'metadata' => array_merge($record->metadata ?? [], [
                                'payment_rejection_reason' => $data['reason'],
                                'payment_rejected_at' => now()->toIso8601String(),
                            ]),
                        ]);

                        \Filament\Notifications\Notification::make()
                            ->title('Payment Rejected')
                            ->warning()
                            ->body('The buyer needs to upload a new payment proof.')
                            ->send();
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('verify_selected')
                        ->label('Verify Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            foreach ($records as $record) {
                                $record->update([
                                    'status' => 'payment_received',
                                    'payment_verified_at' => now(),
                                ]);
                                
                                $record->buyer->notify(new PaymentReceivedNotification($record));
                            }

                            \Filament\Notifications\Notification::make()
                                ->title('Payments Verified')
                                ->success()
                                ->body(count($records) . ' payments have been verified.')
                                ->send();
                        }),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPaymentVerifications::route('/'),
            'view' => Pages\ViewPaymentVerification::route('/{record}'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::whereNotNull('payment_proof')
            ->where('status', 'pending')
            ->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        $count = static::getNavigationBadge();
        return $count > 0 ? 'warning' : 'success';
    }
}
