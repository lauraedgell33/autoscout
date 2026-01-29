<?php

namespace App\Filament\Admin\Resources\Settings\Tables;

use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->icon('heroicon-o-key')
                    ->weight('bold'),
                
                TextColumn::make('label')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('value')
                    ->limit(50)
                    ->searchable()
                    ->formatStateUsing(function ($state, $record) {
                        return match ($record->type) {
                            'boolean' => $state === 'true' ? '✓ Yes' : '✗ No',
                            'json' => 'JSON Data',
                            'text' => strlen($state) > 50 ? substr($state, 0, 50) . '...' : $state,
                            default => $state,
                        };
                    }),
                
                TextColumn::make('group')
                    ->badge()
                    ->sortable()
                    ->color(fn($state) => match ($state) {
                        'general' => 'gray',
                        'frontend' => 'blue',
                        'email' => 'purple',
                        'contact' => 'green',
                        'api' => 'orange',
                        'payment' => 'yellow',
                        'security' => 'red',
                        default => 'gray',
                    }),
                
                TextColumn::make('type')
                    ->badge()
                    ->color('info'),
                
                IconColumn::make('is_public')
                    ->label('Public')
                    ->boolean()
                    ->sortable(),
                
                TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('group')
                    ->options([
                        'general' => 'General',
                        'frontend' => 'Frontend',
                        'email' => 'Email',
                        'contact' => 'Contact',
                        'api' => 'API',
                        'payment' => 'Payment',
                        'security' => 'Security',
                    ])
                    ->multiple(),
                
                SelectFilter::make('type')
                    ->options([
                        'string' => 'String',
                        'text' => 'Text',
                        'number' => 'Number',
                        'boolean' => 'Boolean',
                        'url' => 'URL',
                        'email' => 'Email',
                        'json' => 'JSON',
                    ])
                    ->multiple(),
                
                SelectFilter::make('is_public')
                    ->label('Visibility')
                    ->options([
                        '1' => 'Public',
                        '0' => 'Private',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('group')
            ->groups([
                'group',
                'type',
            ]);
    }
}
