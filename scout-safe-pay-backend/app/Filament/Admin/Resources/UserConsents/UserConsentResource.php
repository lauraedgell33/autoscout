<?php

namespace App\Filament\Admin\Resources\UserConsents;

use App\Filament\Admin\Resources\UserConsents\Pages\ListUserConsents;
use App\Filament\Admin\Resources\UserConsents\Pages\ViewUserConsent;
use App\Models\UserConsent;
use Filament\Actions\Action;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\Section as InfolistSection;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Actions\ActionGroup;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class UserConsentResource extends Resource
{
    protected static ?string $model = UserConsent::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-shield-check';

    public static function getNavigationGroup(): ?string
    {
        return 'Settings';
    }

    public static function getNavigationSort(): ?int
    {
        return 6;
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['user.name', 'user.email', 'legalDocument.title'];
    }

    public static function canCreate(): bool
    {
        return false; // Consents are created by users accepting documents
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                InfolistSection::make('Consent Details')
                    ->schema([
                        TextEntry::make('user.name')
                            ->label('User'),
                        TextEntry::make('user.email')
                            ->label('Email'),
                        TextEntry::make('legalDocument.title')
                            ->label('Document'),
                        TextEntry::make('legalDocument.type')
                            ->label('Document Type')
                            ->badge(),
                        TextEntry::make('legalDocument.version')
                            ->label('Version'),
                        IconEntry::make('accepted')
                            ->boolean()
                            ->label('Accepted'),
                    ])
                    ->columns(3),

                InfolistSection::make('Technical Details')
                    ->schema([
                        TextEntry::make('ip_address')
                            ->label('IP Address')
                            ->copyable(),
                        TextEntry::make('user_agent')
                            ->label('User Agent')
                            ->limit(100),
                        TextEntry::make('accepted_at')
                            ->dateTime()
                            ->label('Accepted At'),
                        TextEntry::make('revoked_at')
                            ->dateTime()
                            ->label('Revoked At'),
                    ])
                    ->columns(2),

                InfolistSection::make('Timestamps')
                    ->schema([
                        TextEntry::make('created_at')
                            ->dateTime(),
                        TextEntry::make('updated_at')
                            ->dateTime(),
                    ])
                    ->columns(2)
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->sortable(),

                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('legalDocument.title')
                    ->label('Document')
                    ->searchable()
                    ->sortable()
                    ->limit(30),

                TextColumn::make('legalDocument.type')
                    ->label('Type')
                    ->badge(),

                IconColumn::make('accepted')
                    ->boolean()
                    ->label('Accepted'),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->state(fn (UserConsent $record): bool => $record->isActive()),

                TextColumn::make('accepted_at')
                    ->dateTime()
                    ->sortable(),

                TextColumn::make('revoked_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('ip_address')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('accepted')
                    ->label('Accepted'),

                SelectFilter::make('legalDocument')
                    ->relationship('legalDocument', 'title')
                    ->searchable()
                    ->preload()
                    ->label('Document'),

                SelectFilter::make('user')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload(),

                TernaryFilter::make('revoked')
                    ->label('Revoked')
                    ->queries(
                        true: fn ($query) => $query->whereNotNull('revoked_at'),
                        false: fn ($query) => $query->whereNull('revoked_at'),
                    ),
            ])
            ->actions([
                ActionGroup::make([
                    ViewAction::make(),

                    Action::make('revoke')
                        ->label('Revoke Consent')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->visible(fn (UserConsent $record): bool => $record->isActive())
                        ->action(function (UserConsent $record) {
                            $record->update(['revoked_at' => now()]);
                            Notification::make()
                                ->title('Consent revoked')
                                ->warning()
                                ->send();
                        }),
                ]),
            ])
            ->defaultSort('accepted_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUserConsents::route('/'),
            'view' => ViewUserConsent::route('/{record}'),
        ];
    }
}
