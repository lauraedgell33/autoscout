<?php

namespace App\Filament\Admin\Resources\ActivityLog;

use App\Filament\Admin\Resources\ActivityLog\Pages\ListActivityLogs;
use App\Filament\Admin\Resources\ActivityLog\Pages\ViewActivityLog;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Malzariey\FilamentDaterangepickerFilter\Filters\DateRangeFilter;
use Spatie\Activitylog\Models\Activity;

class ActivityLogResource extends Resource
{
    protected static ?string $model = Activity::class;

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;
    
    protected static ?string $navigationLabel = 'Activity Log';
    
    protected static ?string $modelLabel = 'Activity';
    
    public static function getNavigationGroup(): ?string
    {
        return 'System';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 99;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('log_name')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'default' => 'gray',
                        'transaction' => 'warning',
                        'payment' => 'success',
                        'dealer' => 'info',
                        'user' => 'primary',
                        default => 'gray',
                    })
                    ->sortable()
                    ->searchable()
                    ->label('Type'),
                    
                TextColumn::make('description')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'created' => 'success',
                        'updated' => 'info',
                        'deleted' => 'danger',
                        'restored' => 'warning',
                        default => 'gray',
                    })
                    ->sortable()
                    ->searchable()
                    ->label('Action'),
                    
                TextColumn::make('subject_type')
                    ->formatStateUsing(fn ($state) => class_basename($state))
                    ->label('Model')
                    ->sortable()
                    ->toggleable(),
                    
                TextColumn::make('subject_id')
                    ->label('ID')
                    ->sortable()
                    ->toggleable(),
                    
                TextColumn::make('causer.name')
                    ->label('User')
                    ->searchable()
                    ->sortable()
                    ->default('System')
                    ->weight('bold'),
                    
                TextColumn::make('causer.email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable()
                    ->default('-'),
                    
                TextColumn::make('properties')
                    ->formatStateUsing(function ($state) {
                        if (empty($state)) {
                            return '-';
                        }
                        
                        $changes = [];
                        if (isset($state['attributes']) && isset($state['old'])) {
                            $changed = array_diff_assoc($state['attributes'], $state['old']);
                            foreach ($changed as $key => $value) {
                                $changes[] = $key;
                            }
                        }
                        
                        return empty($changes) ? '-' : implode(', ', $changes);
                    })
                    ->label('Changed Fields')
                    ->limit(50)
                    ->tooltip(function ($state) {
                        if (empty($state)) {
                            return null;
                        }
                        return 'Click to view full details';
                    })
                    ->toggleable(),
                    
                TextColumn::make('created_at')
                    ->dateTime('d M Y, H:i:s')
                    ->sortable()
                    ->since()
                    ->label('Time'),
            ])
            ->filters([
                DateRangeFilter::make('created_at')
                    ->label('Date Range')
                    ->placeholder('Select date range')
                    ->displayFormat('DD/MM/YYYY')
                    ->firstDayOfWeek(1)
                    ->ranges([
                        'Today' => [now(), now()],
                        'Last 7 Days' => [now()->subDays(6), now()],
                        'Last 30 Days' => [now()->subDays(29), now()],
                        'This Month' => [now()->startOfMonth(), now()->endOfMonth()],
                    ]),
                    
                SelectFilter::make('log_name')
                    ->options([
                        'default' => 'Default',
                        'transaction' => 'Transaction',
                        'payment' => 'Payment',
                        'dealer' => 'Dealer',
                        'user' => 'User',
                    ])
                    ->label('Type')
                    ->multiple(),
                    
                SelectFilter::make('description')
                    ->options([
                        'created' => 'Created',
                        'updated' => 'Updated',
                        'deleted' => 'Deleted',
                        'restored' => 'Restored',
                    ])
                    ->label('Action')
                    ->multiple(),
                    
                SelectFilter::make('subject_type')
                    ->options([
                        'App\Models\Transaction' => 'Transaction',
                        'App\Models\Payment' => 'Payment',
                        'App\Models\Dealer' => 'Dealer',
                        'App\Models\User' => 'User',
                        'App\Models\Vehicle' => 'Vehicle',
                    ])
                    ->label('Model')
                    ->multiple(),
                    
                SelectFilter::make('causer_id')
                    ->options(function () {
                        return \App\Models\User::pluck('name', 'id')->toArray();
                    })
                    ->searchable()
                    ->label('User'),
            ])
            ->defaultSort('created_at', 'desc')
            ->poll('30s');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListActivityLogs::route('/'),
            'view' => ViewActivityLog::route('/{record}'),
        ];
    }
    
    public static function canCreate(): bool
    {
        return false;
    }
    
    public static function canEdit($record): bool
    {
        return false;
    }
    
    public static function canDelete($record): bool
    {
        return false;
    }
}
