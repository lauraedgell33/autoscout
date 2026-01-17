<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TransactionResource\Pages;
use App\Models\Transaction;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class TransactionResource extends Resource
{
    protected static ?string $model = Transaction::class;
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Transactions';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Transaction Information')
                    ->schema([
                        Forms\Components\TextInput::make('id')
                            ->label('Transaction ID')
                            ->disabled(),
                        
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'payment_received' => 'Payment Received',
                                'in_delivery' => 'In Delivery',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                            ])
                            ->required(),

                        Forms\Components\TextInput::make('amount')
                            ->prefix('€')
                            ->numeric()
                            ->disabled(),

                        Forms\Components\TextInput::make('payment_reference')
                            ->disabled(),
                    ])->columns(2),

                Forms\Components\Section::make('Buyer & Seller')
                    ->schema([
                        Forms\Components\TextInput::make('buyer.name')
                            ->label('Buyer')
                            ->disabled(),
                        
                        Forms\Components\TextInput::make('buyer.email')
                            ->label('Buyer Email')
                            ->disabled(),

                        Forms\Components\TextInput::make('seller.name')
                            ->label('Seller')
                            ->disabled(),

                        Forms\Components\TextInput::make('seller.email')
                            ->label('Seller Email')
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

                        Forms\Components\TextInput::make('vehicle.vin')
                            ->label('VIN')
                            ->disabled(),
                    ])->columns(2),

                Forms\Components\Section::make('Dates')
                    ->schema([
                        Forms\Components\DateTimePicker::make('created_at')
                            ->disabled(),

                        Forms\Components\DateTimePicker::make('payment_verified_at')
                            ->disabled(),

                        Forms\Components\DateTimePicker::make('completed_at')
                            ->disabled(),

                        Forms\Components\DateTimePicker::make('cancelled_at')
                            ->disabled(),
                    ])->columns(2),

                Forms\Components\Section::make('Notes')
                    ->schema([
                        Forms\Components\Textarea::make('notes')
                            ->rows(3),

                        Forms\Components\Textarea::make('verification_notes')
                            ->rows(3),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('buyer.name')
                    ->label('Buyer')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('vehicle.make')
                    ->label('Vehicle')
                    ->formatStateUsing(fn ($record) => 
                        $record->vehicle->make . ' ' . $record->vehicle->model . ' (' . $record->vehicle->year . ')'
                    )
                    ->searchable(['vehicle.make', 'vehicle.model']),

                Tables\Columns\TextColumn::make('amount')
                    ->money('EUR')
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'payment_received',
                        'primary' => 'in_delivery',
                        'success' => 'completed',
                        'danger' => 'cancelled',
                    ])
                    ->formatStateUsing(fn ($state) => ucfirst(str_replace('_', ' ', $state))),

                Tables\Columns\IconColumn::make('payment_proof')
                    ->label('Proof')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('gray'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'payment_received' => 'Payment Received',
                        'in_delivery' => 'In Delivery',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),

                Tables\Filters\SelectFilter::make('vehicle.category')
                    ->label('Vehicle Category')
                    ->relationship('vehicle', 'category'),

                Tables\Filters\Filter::make('has_payment_proof')
                    ->label('Has Payment Proof')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('payment_proof')),

                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from')
                            ->label('Created From'),
                        Forms\Components\DatePicker::make('created_until')
                            ->label('Created Until'),
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
                Tables\Actions\Action::make('view_contract')
                    ->label('Contract')
                    ->icon('heroicon-o-document')
                    ->url(fn ($record) => route('api.contracts.preview', $record))
                    ->openUrlInNewTab(),

                Tables\Actions\Action::make('view_invoice')
                    ->label('Invoice')
                    ->icon('heroicon-o-receipt-percent')
                    ->url(fn ($record) => route('api.invoices.preview', $record))
                    ->openUrlInNewTab(),

                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),

                Tables\Actions\Action::make('complete')
                    ->label('Mark Completed')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update([
                        'status' => 'completed',
                        'completed_at' => now(),
                    ]))
                    ->visible(fn ($record) => $record->status === 'payment_received'),

                Tables\Actions\Action::make('cancel')
                    ->label('Cancel')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->form([
                        Forms\Components\Textarea::make('reason')
                            ->label('Cancellation Reason')
                            ->required(),
                    ])
                    ->action(function ($record, array $data) {
                        $record->update([
                            'status' => 'cancelled',
                            'cancelled_at' => now(),
                            'notes' => ($record->notes ? $record->notes . "\n\n" : '') . 
                                      "Cancelled: " . $data['reason'],
                        ]);

                        // Update vehicle status back to active
                        $record->vehicle->update(['status' => 'active']);
                    })
                    ->visible(fn ($record) => !in_array($record->status, ['completed', 'cancelled'])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
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
            'index' => Pages\ListTransactions::route('/'),
            'create' => Pages\CreateTransaction::route('/create'),
            'view' => Pages\ViewTransaction::route('/{record}'),
            'edit' => Pages\EditTransaction::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        $count = static::getNavigationBadge();
        return $count > 5 ? 'danger' : ($count > 0 ? 'warning' : null);
    }
}
