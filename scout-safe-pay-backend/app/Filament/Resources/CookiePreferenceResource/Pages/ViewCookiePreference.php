<?php

namespace App\Filament\Resources\CookiePreferenceResource\Pages;

use App\Filament\Resources\CookiePreferenceResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Filament\Infolists;
use Filament\Schemas\Schema;

class ViewCookiePreference extends ViewRecord
{
    protected static string $resource = CookiePreferenceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('refresh')
                ->label('Refresh Expiration')
                ->icon('heroicon-o-arrow-path')
                ->action(function () {
                    $this->record->refresh();
                    \Filament\Notifications\Notification::make()
                        ->success()
                        ->title('Preference refreshed')
                        ->body('Expiration date extended by 1 year.')
                        ->send();
                })
                ->requiresConfirmation()
                ->visible(fn () => $this->record->needsRefresh() || $this->record->isExpired()),
            Actions\EditAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
    
    public function infolist(Schema $schema): Schema
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('User Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('user.name')
                            ->label('User')
                            ->default('Guest User'),
                        Infolists\Components\TextEntry::make('user.email')
                            ->label('Email')
                            ->visible(fn ($record) => $record->user_id),
                        Infolists\Components\TextEntry::make('session_id')
                            ->label('Session ID')
                            ->visible(fn ($record) => !$record->user_id),
                    ])->columns(2),
                
                Infolists\Components\Section::make('Cookie Preferences')
                    ->schema([
                        Infolists\Components\IconEntry::make('essential')
                            ->label('Essential Cookies')
                            ->boolean(),
                        Infolists\Components\IconEntry::make('functional')
                            ->label('Functional Cookies')
                            ->boolean(),
                        Infolists\Components\IconEntry::make('analytics')
                            ->label('Analytics Cookies')
                            ->boolean(),
                        Infolists\Components\IconEntry::make('marketing')
                            ->label('Marketing Cookies')
                            ->boolean(),
                    ])->columns(4),
                
                Infolists\Components\Section::make('Status')
                    ->schema([
                        Infolists\Components\TextEntry::make('status')
                            ->label('Current Status')
                            ->formatStateUsing(fn ($record) => 
                                $record->isExpired() 
                                    ? '🔴 Expired' 
                                    : ($record->needsRefresh() 
                                        ? '🟡 Expiring Soon' 
                                        : '🟢 Active'
                                    )
                            ),
                        Infolists\Components\TextEntry::make('accepted_categories')
                            ->label('Accepted Categories')
                            ->formatStateUsing(fn ($record) => implode(', ', $record->getAcceptedCategories())),
                    ])->columns(2),
                
                Infolists\Components\Section::make('Tracking Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('ip_address')
                            ->label('IP Address'),
                        Infolists\Components\TextEntry::make('user_agent')
                            ->label('User Agent')
                            ->columnSpanFull(),
                    ])->columns(2),
                
                Infolists\Components\Section::make('Timestamps')
                    ->schema([
                        Infolists\Components\TextEntry::make('accepted_at')
                            ->label('Accepted At')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('expires_at')
                            ->label('Expires At')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('last_refreshed_at')
                            ->label('Last Refreshed At')
                            ->dateTime()
                            ->placeholder('Never refreshed'),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Created At')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('updated_at')
                            ->label('Updated At')
                            ->dateTime(),
                    ])->columns(3),
            ]);
    }
}
