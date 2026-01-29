<?php

namespace App\Filament\Admin\Resources\UserConsents\Pages;

use App\Filament\Admin\Resources\UserConsents\UserConsentResource;
use Filament\Actions;
use Filament\Infolists;
use Filament\Schemas\Schema;
use Filament\Resources\Pages\ViewRecord;

class ViewUserConsent extends ViewRecord
{
    protected static string $resource = UserConsentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('withdraw')
                ->label('Withdraw Consent')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->form([
                    \Filament\Forms\Components\Textarea::make('withdrawal_reason')
                        ->label('Reason')
                        ->required()
                        ->rows(3),
                ])
                ->action(function (array $data) {
                    $this->record->update([
                        'is_given' => false,
                        'withdrawn_at' => now(),
                        'withdrawal_reason' => $data['withdrawal_reason'],
                    ]);
                })
                ->visible(fn () => $this->record->is_given),

            Actions\Action::make('renew')
                ->label('Renew Consent')
                ->icon('heroicon-o-arrow-path')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update([
                    'is_given' => true,
                    'given_at' => now(),
                    'withdrawn_at' => null,
                    'expires_at' => now()->addYear(),
                ]))
                ->visible(fn () => !$this->record->is_given),

            Actions\EditAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    public function infolist(Schema $schema): Schema
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('User & Consent Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('user.name')
                            ->label('User')
                            ->weight('bold')
                            ->size('lg'),

                        Infolists\Components\TextEntry::make('user.email')
                            ->label('Email')
                            ->copyable(),

                        Infolists\Components\TextEntry::make('consent_type')
                            ->label('Consent Type')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'terms_and_conditions', 'privacy_policy' => 'primary',
                                'cookie_policy' => 'warning',
                                'marketing_emails', 'marketing_sms', 'newsletter' => 'info',
                                'data_processing', 'analytics' => 'success',
                                default => 'secondary',
                            })
                            ->formatStateUsing(fn (string $state): string => match ($state) {
                                'terms_and_conditions' => 'Terms & Conditions',
                                'privacy_policy' => 'Privacy Policy',
                                'cookie_policy' => 'Cookie Policy',
                                'marketing_emails' => 'Marketing Emails',
                                'marketing_sms' => 'Marketing SMS',
                                'data_processing' => 'Data Processing (GDPR)',
                                'analytics' => 'Analytics & Tracking',
                                'third_party_sharing' => 'Third-Party Data Sharing',
                                'newsletter' => 'Newsletter',
                                'push_notifications' => 'Push Notifications',
                                default => ucwords(str_replace('_', ' ', $state)),
                            }),

                        Infolists\Components\IconEntry::make('is_given')
                            ->label('Status')
                            ->boolean()
                            ->trueIcon('heroicon-o-check-circle')
                            ->falseIcon('heroicon-o-x-circle')
                            ->trueColor('success')
                            ->falseColor('danger')
                            ->formatStateUsing(fn ($state) => $state ? 'Consent Given' : 'Consent Withdrawn'),
                    ])->columns(2),

                Infolists\Components\Section::make('Consent Timeline')
                    ->schema([
                        Infolists\Components\TextEntry::make('given_at')
                            ->label('Given At')
                            ->dateTime('d M Y, H:i')
                            ->badge()
                            ->color('success')
                            ->visible(fn () => !empty($this->record->given_at)),

                        Infolists\Components\TextEntry::make('withdrawn_at')
                            ->label('Withdrawn At')
                            ->dateTime('d M Y, H:i')
                            ->badge()
                            ->color('danger')
                            ->visible(fn () => !empty($this->record->withdrawn_at)),

                        Infolists\Components\TextEntry::make('expires_at')
                            ->label('Expires At')
                            ->dateTime('d M Y, H:i')
                            ->badge()
                            ->color(fn ($record) => 
                                $record->expires_at && $record->expires_at->isPast() ? 'danger' : 
                                ($record->expires_at && $record->expires_at->diffInDays() < 30 ? 'warning' : 'success')
                            )
                            ->formatStateUsing(fn ($state, $record) => 
                                $state ? 
                                    ($record->expires_at->isPast() ? 
                                        '⚠️ Expired: ' . $state->format('d M Y') : 
                                        $state->format('d M Y') . ' (' . $state->diffForHumans() . ')'
                                    ) : 
                                    'No expiration'
                            )
                            ->default('No expiration'),
                    ])->columns(3),

                Infolists\Components\Section::make('Withdrawal Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('withdrawal_reason')
                            ->label('Reason for Withdrawal')
                            ->columnSpanFull(),
                    ])
                    ->visible(fn () => !empty($this->record->withdrawal_reason)),

                Infolists\Components\Section::make('Context & Method')
                    ->schema([
                        Infolists\Components\TextEntry::make('consent_method')
                            ->label('Consent Method')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'checkbox', 'button' => 'primary',
                                'banner', 'popup' => 'info',
                                'implicit' => 'secondary',
                                'verbal', 'written' => 'warning',
                                'admin' => 'danger',
                                default => 'gray',
                            })
                            ->formatStateUsing(fn ($state) => ucwords($state)),

                        Infolists\Components\TextEntry::make('ip_address')
                            ->label('IP Address')
                            ->copyable()
                            ->formatStateUsing(fn ($state) => $state ?: 'Not recorded')
                            ->default('Not recorded'),

                        Infolists\Components\TextEntry::make('user_agent')
                            ->label('User Agent')
                            ->limit(50)
                            ->tooltip(fn ($state) => $state)
                            ->formatStateUsing(fn ($state) => $state ?: 'Not recorded')
                            ->default('Not recorded')
                            ->columnSpanFull(),
                    ])->columns(2),

                Infolists\Components\Section::make('Related Document')
                    ->schema([
                        Infolists\Components\TextEntry::make('legalDocument.title')
                            ->label('Legal Document')
                            ->formatStateUsing(fn ($state, $record) => 
                                $state ? $state . ' (v' . $record->legalDocument->version . ')' : 'No document linked'
                            )
                            ->default('No document linked'),

                        Infolists\Components\TextEntry::make('version')
                            ->label('Document Version')
                            ->badge()
                            ->color('secondary')
                            ->formatStateUsing(fn ($state) => $state ?: 'Not specified')
                            ->default('Not specified'),
                    ])->columns(2)
                    ->collapsed(),

                Infolists\Components\Section::make('GDPR & Compliance')
                    ->schema([
                        Infolists\Components\IconEntry::make('is_required')
                            ->label('Required for Service')
                            ->boolean()
                            ->trueIcon('heroicon-o-exclamation-triangle')
                            ->falseIcon('heroicon-o-information-circle')
                            ->trueColor('warning')
                            ->falseColor('gray'),

                        Infolists\Components\IconEntry::make('is_marketing')
                            ->label('Marketing Consent')
                            ->boolean()
                            ->trueIcon('heroicon-o-megaphone')
                            ->falseIcon('heroicon-o-minus')
                            ->trueColor('info')
                            ->falseColor('gray'),

                        Infolists\Components\IconEntry::make('is_verified')
                            ->label('Verified')
                            ->boolean()
                            ->trueIcon('heroicon-o-shield-check')
                            ->falseIcon('heroicon-o-shield-exclamation')
                            ->trueColor('success')
                            ->falseColor('warning'),

                        Infolists\Components\TextEntry::make('legal_basis')
                            ->label('Legal Basis (GDPR)')
                            ->formatStateUsing(fn ($state) => $state ?: 'Not specified')
                            ->default('Not specified')
                            ->columnSpanFull(),
                    ])->columns(3),

                Infolists\Components\Section::make('Internal Notes')
                    ->schema([
                        Infolists\Components\TextEntry::make('notes')
                            ->label('')
                            ->formatStateUsing(fn ($state) => $state ?: 'No notes')
                            ->columnSpanFull(),
                    ])
                    ->collapsed()
                    ->visible(fn () => !empty($this->record->notes)),

                Infolists\Components\Section::make('Metadata')
                    ->schema([
                        Infolists\Components\KeyValueEntry::make('metadata')
                            ->label('Additional Data')
                            ->columnSpanFull(),
                    ])
                    ->collapsed()
                    ->visible(fn () => !empty($this->record->metadata)),

                Infolists\Components\Section::make('System Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Created At')
                            ->dateTime('d M Y, H:i'),

                        Infolists\Components\TextEntry::make('updated_at')
                            ->label('Updated At')
                            ->dateTime('d M Y, H:i')
                            ->since(),
                    ])->columns(2)
                    ->collapsed(),
            ]);
    }
}
