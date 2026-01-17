<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Filament\Infolists;
use Filament\Infolists\Infolist;

class ViewUser extends ViewRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            
            Actions\Action::make('view_transactions')
                ->label('View Transactions')
                ->icon('heroicon-o-document-text')
                ->color('info')
                ->url(fn () => route('filament.admin.resources.transactions.index', [
                    'tableFilters' => [
                        'buyer_id' => ['value' => $this->record->id]
                    ]
                ]))
                ->visible(fn () => $this->record->user_type === 'buyer'),

            Actions\Action::make('view_vehicles')
                ->label('View Vehicles')
                ->icon('heroicon-o-truck')
                ->color('success')
                ->url(fn () => route('filament.admin.resources.vehicles.index'))
                ->visible(fn () => $this->record->user_type === 'seller'),

            Actions\Action::make('view_kyc')
                ->label('View KYC')
                ->icon('heroicon-o-identification')
                ->color('warning')
                ->url(fn () => route('filament.admin.resources.kyc-verification.view', $this->record))
                ->visible(fn () => $this->record->kyc_submitted_at !== null),

            Actions\DeleteAction::make()
                ->visible(fn () => $this->record->id !== auth()->id()),
        ];
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('User Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('id')
                            ->label('User ID'),
                        Infolists\Components\TextEntry::make('name'),
                        Infolists\Components\TextEntry::make('email')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('phone')
                            ->default('N/A'),
                        Infolists\Components\TextEntry::make('user_type')
                            ->label('Role')
                            ->badge()
                            ->color(fn ($state) => match($state) {
                                'buyer' => 'info',
                                'seller' => 'warning',
                                'admin' => 'danger',
                                default => 'gray',
                            })
                            ->formatStateUsing(fn ($state) => ucfirst($state)),
                        Infolists\Components\IconEntry::make('is_verified')
                            ->label('Email Verified')
                            ->boolean(),
                    ])->columns(3),

                Infolists\Components\Section::make('Statistics')
                    ->schema([
                        Infolists\Components\TextEntry::make('transactions_count')
                            ->label('Total Transactions')
                            ->state(fn ($record) => $record->purchasedTransactions()->count()),
                        Infolists\Components\TextEntry::make('vehicles_count')
                            ->label('Vehicles Listed')
                            ->state(fn ($record) => $record->vehicles()->count())
                            ->visible(fn ($record) => $record->user_type === 'seller'),
                    ])->columns(2),

                Infolists\Components\Section::make('Address')
                    ->schema([
                        Infolists\Components\TextEntry::make('address')
                            ->default('N/A'),
                        Infolists\Components\TextEntry::make('city')
                            ->default('N/A'),
                        Infolists\Components\TextEntry::make('postal_code')
                            ->default('N/A'),
                        Infolists\Components\TextEntry::make('country')
                            ->default('N/A'),
                    ])->columns(2),

                Infolists\Components\Section::make('KYC Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('kyc_status')
                            ->badge()
                            ->color(fn ($state) => match($state) {
                                'pending' => 'warning',
                                'approved' => 'success',
                                'rejected' => 'danger',
                                default => 'gray',
                            })
                            ->formatStateUsing(fn ($state) => $state ? ucfirst($state) : 'Not Submitted'),
                        Infolists\Components\TextEntry::make('kyc_submitted_at')
                            ->dateTime()
                            ->default('N/A'),
                        Infolists\Components\TextEntry::make('kyc_verified_at')
                            ->dateTime()
                            ->default('N/A'),
                    ])->columns(3)
                    ->visible(fn ($record) => $record->kyc_submitted_at !== null),

                Infolists\Components\Section::make('Activity')
                    ->schema([
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Registered At')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('last_login_at')
                            ->dateTime()
                            ->default('Never'),
                        Infolists\Components\TextEntry::make('last_login_ip')
                            ->label('Last IP')
                            ->default('N/A'),
                    ])->columns(3),
            ]);
    }
}
