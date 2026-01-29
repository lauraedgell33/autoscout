<?php

namespace App\Filament\Admin\Resources\LegalDocuments\Pages;

use App\Filament\Admin\Resources\LegalDocuments\LegalDocumentResource;
use Filament\Actions;
use Filament\Infolists;
use Filament\Schemas\Schema;
use Filament\Resources\Pages\ViewRecord;

class ViewLegalDocument extends ViewRecord
{
    protected static string $resource = LegalDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('publish')
                ->label('Publish')
                ->icon('heroicon-o-rocket-launch')
                ->color('success')
                ->requiresConfirmation()
                ->action(function () {
                    $this->record->update([
                        'status' => 'active',
                        'effective_from' => $this->record->effective_from ?? now(),
                        'approved_by' => auth()->id(),
                        'approved_at' => now(),
                    ]);
                    
                    if ($this->record->replaces_document_id) {
                        \App\Models\LegalDocument::find($this->record->replaces_document_id)?->update([
                            'status' => 'archived',
                            'effective_until' => now(),
                        ]);
                    }
                })
                ->visible(fn () => in_array($this->record->status, ['draft', 'review'])),

            Actions\Action::make('preview')
                ->label('Preview')
                ->icon('heroicon-o-eye')
                ->color('info')
                ->url(fn () => route('legal.preview', $this->record))
                ->openUrlInNewTab(),

            Actions\Action::make('export_pdf')
                ->label('Export PDF')
                ->icon('heroicon-o-document-arrow-down')
                ->color('primary')
                ->action(function () {
                    // TODO: Implement PDF export with dompdf
                    $this->notify('info', 'PDF export feature coming soon');
                }),

            Actions\EditAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    public function infolist(Schema $schema): Schema
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Document Overview')
                    ->schema([
                        Infolists\Components\TextEntry::make('title')
                            ->label('Title')
                            ->weight('bold')
                            ->size('lg'),

                        Infolists\Components\TextEntry::make('type')
                            ->label('Type')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'terms' => 'primary',
                                'privacy' => 'success',
                                'cookies' => 'warning',
                                'gdpr' => 'info',
                                'user_agreement', 'dealer_agreement' => 'secondary',
                                'refund_policy' => 'danger',
                                default => 'gray',
                            })
                            ->formatStateUsing(fn (string $state): string => match ($state) {
                                'terms' => 'Terms & Conditions',
                                'privacy' => 'Privacy Policy',
                                'cookies' => 'Cookie Policy',
                                'gdpr' => 'GDPR Compliance',
                                'user_agreement' => 'User Agreement',
                                'dealer_agreement' => 'Dealer Agreement',
                                'refund_policy' => 'Refund Policy',
                                'disclaimer' => 'Disclaimer',
                                default => ucfirst($state),
                            }),

                        Infolists\Components\TextEntry::make('version')
                            ->label('Version')
                            ->badge()
                            ->color('secondary'),

                        Infolists\Components\TextEntry::make('language')
                            ->label('Language')
                            ->badge()
                            ->formatStateUsing(fn (string $state): string => strtoupper($state)),

                        Infolists\Components\TextEntry::make('status')
                            ->label('Status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'draft' => 'secondary',
                                'review' => 'warning',
                                'active' => 'success',
                                'archived' => 'gray',
                                default => 'gray',
                            }),
                    ])->columns(3),

                Infolists\Components\Section::make('Summary')
                    ->schema([
                        Infolists\Components\TextEntry::make('summary')
                            ->label('')
                            ->formatStateUsing(fn ($state) => $state ?: 'No summary provided')
                            ->columnSpanFull(),
                    ])
                    ->visible(fn () => !empty($this->record->summary)),

                Infolists\Components\Section::make('Document Content')
                    ->schema([
                        Infolists\Components\TextEntry::make('content')
                            ->label('')
                            ->html()
                            ->columnSpanFull(),
                    ]),

                Infolists\Components\Section::make('Effective Dates')
                    ->schema([
                        Infolists\Components\TextEntry::make('effective_from')
                            ->label('Effective From')
                            ->dateTime('d M Y, H:i')
                            ->badge()
                            ->color('success'),

                        Infolists\Components\TextEntry::make('effective_until')
                            ->label('Effective Until')
                            ->dateTime('d M Y, H:i')
                            ->badge()
                            ->color('warning')
                            ->formatStateUsing(fn ($state) => $state ?: 'No expiration')
                            ->default('No expiration'),

                        Infolists\Components\IconEntry::make('requires_acceptance')
                            ->label('Requires User Acceptance')
                            ->boolean()
                            ->trueIcon('heroicon-o-check-circle')
                            ->falseIcon('heroicon-o-x-circle')
                            ->trueColor('success')
                            ->falseColor('gray'),

                        Infolists\Components\IconEntry::make('force_reacceptance')
                            ->label('Force Re-acceptance')
                            ->boolean()
                            ->trueIcon('heroicon-o-exclamation-triangle')
                            ->falseIcon('heroicon-o-x-circle')
                            ->trueColor('warning')
                            ->falseColor('gray'),
                    ])->columns(2),

                Infolists\Components\Section::make('Acceptance Statistics')
                    ->schema([
                        Infolists\Components\TextEntry::make('acceptances_count')
                            ->label('Total Acceptances')
                            ->formatStateUsing(fn () => $this->record->acceptances()->count())
                            ->badge()
                            ->color('info')
                            ->size('lg'),

                        Infolists\Components\TextEntry::make('acceptance_rate')
                            ->label('Acceptance Rate')
                            ->formatStateUsing(function () {
                                $totalUsers = \App\Models\User::count();
                                $acceptances = $this->record->acceptances()->count();
                                $rate = $totalUsers > 0 ? round(($acceptances / $totalUsers) * 100, 1) : 0;
                                return $rate . '%';
                            })
                            ->badge()
                            ->color(fn () => 
                                $this->record->acceptances()->count() > 0 ? 'success' : 'gray'
                            )
                            ->size('lg'),
                    ])->columns(2)
                    ->visible(fn () => $this->record->requires_acceptance),

                Infolists\Components\Section::make('Version History')
                    ->schema([
                        Infolists\Components\TextEntry::make('replacesDocument.title')
                            ->label('Replaces Document')
                            ->formatStateUsing(fn ($state, $record) => 
                                $state ? $state . ' (v' . $record->replacesDocument->version . ')' : 'No previous version'
                            )
                            ->default('No previous version'),

                        Infolists\Components\TextEntry::make('change_log')
                            ->label('Change Log')
                            ->formatStateUsing(fn ($state) => $state ?: 'No changes documented')
                            ->columnSpanFull(),
                    ])
                    ->collapsed()
                    ->visible(fn () => !empty($this->record->replaces_document_id) || !empty($this->record->change_log)),

                Infolists\Components\Section::make('Approval & Legal')
                    ->schema([
                        Infolists\Components\TextEntry::make('approver.name')
                            ->label('Approved By')
                            ->formatStateUsing(fn ($state) => $state ?: 'Not yet approved')
                            ->default('Not yet approved'),

                        Infolists\Components\TextEntry::make('approved_at')
                            ->label('Approved At')
                            ->dateTime('d M Y, H:i')
                            ->formatStateUsing(fn ($state) => $state ?: 'Not yet approved')
                            ->default('Not yet approved'),

                        Infolists\Components\TextEntry::make('legal_reference')
                            ->label('Legal Reference')
                            ->formatStateUsing(fn ($state) => $state ?: 'None')
                            ->default('None')
                            ->columnSpanFull(),
                    ])->columns(2)
                    ->collapsed(),

                Infolists\Components\Section::make('Internal Notes')
                    ->schema([
                        Infolists\Components\TextEntry::make('internal_notes')
                            ->label('')
                            ->formatStateUsing(fn ($state) => $state ?: 'No internal notes')
                            ->columnSpanFull(),
                    ])
                    ->collapsed(),

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
