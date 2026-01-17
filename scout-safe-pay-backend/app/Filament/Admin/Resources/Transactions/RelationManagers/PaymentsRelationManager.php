<?php

namespace App\Filament\Admin\Resources\Transactions\RelationManagers;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PaymentsRelationManager extends RelationManager
{
    protected static string $relationship = 'payments';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('payment_reference')
                    ->required()
                    ->maxLength(255)
                    ->default(fn () => 'PAY-' . strtoupper(uniqid())),
                    
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required()
                    ->label('Payer'),
                    
                Select::make('type')
                    ->options([
                        'bank_transfer' => 'Bank Transfer',
                        'card' => 'Card Payment',
                        'cash' => 'Cash',
                        'other' => 'Other',
                    ])
                    ->required(),
                    
                TextInput::make('amount')
                    ->numeric()
                    ->prefix('€')
                    ->required(),
                    
                TextInput::make('bank_transfer_reference')
                    ->maxLength(255)
                    ->label('Bank Reference'),
                    
                Textarea::make('proof_url')
                    ->maxLength(500)
                    ->label('Proof URL/Notes')
                    ->columnSpanFull(),
                    
                Toggle::make('is_verified')
                    ->label('Verified')
                    ->default(false),
                    
                Select::make('verified_by')
                    ->relationship('verifiedBy', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Verified By'),
                    
                DateTimePicker::make('verified_at')
                    ->label('Verification Date'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('payment_reference')
            ->columns([
                TextColumn::make('payment_reference')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold'),
                    
                TextColumn::make('user.name')
                    ->searchable()
                    ->sortable()
                    ->label('Payer'),
                    
                TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'bank_transfer' => 'info',
                        'card' => 'success',
                        'cash' => 'warning',
                        default => 'gray',
                    }),
                    
                TextColumn::make('amount')
                    ->money('EUR')
                    ->sortable(),
                    
                IconColumn::make('is_verified')
                    ->boolean()
                    ->label('Verified'),
                    
                TextColumn::make('verifiedBy.name')
                    ->label('Verified By')
                    ->default('-'),
                    
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->since()
                    ->label('Created'),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options([
                        'bank_transfer' => 'Bank Transfer',
                        'card' => 'Card Payment',
                        'cash' => 'Cash',
                        'other' => 'Other',
                    ]),
                SelectFilter::make('is_verified')
                    ->options([
                        '1' => 'Verified',
                        '0' => 'Not Verified',
                    ])
                    ->label('Verification Status'),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
