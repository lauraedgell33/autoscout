<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CookiePreferenceResource\Pages;
use App\Models\CookiePreference;
use Filament\Schemas;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;
use Filament\Support\Colors\Color;

class CookiePreferenceResource extends Resource
{
    protected static ?string $model = CookiePreference::class;
    
    protected static ?string $navigationIcon = 'heroicon-o-shield-check';
    
    protected static ?string $navigationGroup = 'User Management';
    
    protected static ?string $navigationLabel = 'Cookie Preferences';
    
    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Schemas\Components\Section::make('User Information')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('User')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->helperText('Leave empty for guest sessions'),
                        Forms\Components\TextInput::make('session_id')
                            ->label('Session ID')
                            ->maxLength(255)
                            ->disabled()
                            ->helperText('Automatically assigned for guest users'),
                    ])->columns(2),
                
                Schemas\Components\Section::make('Cookie Categories')
                    ->schema([
                        Forms\Components\Toggle::make('essential')
                            ->label('Essential Cookies')
                            ->default(true)
                            ->disabled()
                            ->helperText('Always enabled - required for basic site functionality'),
                        Forms\Components\Toggle::make('functional')
                            ->label('Functional Cookies')
                            ->helperText('Remember user preferences and settings'),
                        Forms\Components\Toggle::make('analytics')
                            ->label('Analytics Cookies')
                            ->helperText('Help us understand how visitors use the site'),
                        Forms\Components\Toggle::make('marketing')
                            ->label('Marketing Cookies')
                            ->helperText('Used for targeted advertising'),
                    ])->columns(2),
                
                Schemas\Components\Section::make('Tracking Information')
                    ->schema([
                        Forms\Components\TextInput::make('ip_address')
                            ->label('IP Address')
                            ->maxLength(45)
                            ->disabled(),
                        Forms\Components\Textarea::make('user_agent')
                            ->label('User Agent')
                            ->maxLength(65535)
                            ->rows(3)
                            ->disabled()
                            ->columnSpanFull(),
                    ])->columns(2),
                
                Schemas\Components\Section::make('Timestamps')
                    ->schema([
                        Forms\Components\DateTimePicker::make('accepted_at')
                            ->label('Accepted At')
                            ->disabled(),
                        Forms\Components\DateTimePicker::make('expires_at')
                            ->label('Expires At')
                            ->helperText('Preferences expire after 1 year'),
                        Forms\Components\DateTimePicker::make('last_refreshed_at')
                            ->label('Last Refreshed At')
                            ->disabled()
                            ->helperText('Auto-refreshed when expiring soon'),
                    ])->columns(3),
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
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable()
                    ->default('Guest')
                    ->description(fn ($record) => $record->user ? $record->user->email : 'Session: ' . substr($record->session_id, 0, 8) . '...')
                    ->wrap(),
                Tables\Columns\IconColumn::make('essential')
                    ->label('Essential')
                    ->boolean()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\IconColumn::make('functional')
                    ->label('Functional')
                    ->boolean()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\IconColumn::make('analytics')
                    ->label('Analytics')
                    ->boolean()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\IconColumn::make('marketing')
                    ->label('Marketing')
                    ->boolean()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('accepted_at')
                    ->label('Accepted')
                    ->dateTime('M d, Y H:i')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('expires_at')
                    ->label('Expires')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->color(fn ($record) => $record->isExpired() ? Color::Red : ($record->needsRefresh() ? Color::Orange : Color::Green))
                    ->badge()
                    ->formatStateUsing(fn ($record) => 
                        $record->isExpired() 
                            ? 'Expired' 
                            : ($record->needsRefresh() 
                                ? 'Expiring Soon' 
                                : $record->expires_at?->format('M d, Y')
                            )
                    ),
                Tables\Columns\TextColumn::make('last_refreshed_at')
                    ->label('Last Refresh')
                    ->dateTime('M d, Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('ip_address')
                    ->label('IP')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('essential')
                    ->label('Essential Cookies'),
                Tables\Filters\TernaryFilter::make('functional')
                    ->label('Functional Cookies'),
                Tables\Filters\TernaryFilter::make('analytics')
                    ->label('Analytics Cookies'),
                Tables\Filters\TernaryFilter::make('marketing')
                    ->label('Marketing Cookies'),
                Tables\Filters\Filter::make('expired')
                    ->label('Expired')
                    ->query(fn ($query) => $query->where('expires_at', '<=', now()))
                    ->toggle(),
                Tables\Filters\Filter::make('needs_refresh')
                    ->label('Needs Refresh')
                    ->query(fn ($query) => $query->needsRefresh())
                    ->toggle(),
                Tables\Filters\Filter::make('has_user')
                    ->label('Registered Users Only')
                    ->query(fn ($query) => $query->whereNotNull('user_id'))
                    ->toggle(),
            ])
            ->actions([
                Actions\Action::make('refresh')
                    ->label('Refresh')
                    ->icon('heroicon-o-arrow-path')
                    ->color(Color::Emerald)
                    ->action(function (CookiePreference $record) {
                        $record->refresh();
                        \Filament\Notifications\Notification::make()
                            ->success()
                            ->title('Cookie preference refreshed')
                            ->body('Expiration date extended by 1 year.')
                            ->send();
                    })
                    ->requiresConfirmation()
                    ->visible(fn (CookiePreference $record) => $record->needsRefresh() || $record->isExpired()),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\BulkAction::make('refresh_all')
                        ->label('Refresh All Selected')
                        ->icon('heroicon-o-arrow-path')
                        ->color(Color::Emerald)
                        ->action(function ($records) {
                            $count = 0;
                            foreach ($records as $record) {
                                $record->refresh();
                                $count++;
                            }
                            \Filament\Notifications\Notification::make()
                                ->success()
                                ->title('Preferences refreshed')
                                ->body("{$count} cookie preferences have been refreshed.")
                                ->send();
                        })
                        ->requiresConfirmation()
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
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
            'index' => Pages\ListCookiePreferences::route('/'),
            'create' => Pages\CreateCookiePreference::route('/create'),
            'view' => Pages\ViewCookiePreference::route('/{record}'),
            'edit' => Pages\EditCookiePreference::route('/{record}/edit'),
        ];
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::needsRefresh()->count() ?: null;
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        $count = static::getModel()::needsRefresh()->count();
        return $count > 0 ? Color::Orange : null;
    }
}
