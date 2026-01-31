<?php

namespace App\Filament\Admin\Resources\Disputes\Pages;

use App\Filament\Admin\Resources\Disputes\DisputeResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Filament\Infolists;
use Filament\Forms;
use Filament\Schemas\Schema;

class ViewDispute extends ViewRecord
{
    protected static string $resource = DisputeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('investigate')
                ->label('Start Investigation')
                ->icon('heroicon-o-magnifying-glass')
                ->color('warning')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update(['status' => 'investigating']))
                ->visible(fn () => $this->record->status === 'open'),

            Actions\Action::make('resolve')
                ->label('Resolve Dispute')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->form([
                    \Filament\Forms\Components\Select::make('resolution_type')
                        ->label('Resolution Type')
                        ->options([
                            'refund_full' => 'Full Refund',
                            'refund_partial' => 'Partial Refund',
                            'replacement' => 'Replacement',
                            'compensation' => 'Compensation',
                            'no_action' => 'No Action Required',
                            'dismissed' => 'Dismissed',
                        ])
                        ->required(),
                    \Filament\Forms\Components\Textarea::make('resolution')
                        ->label('Resolution Details')
                        ->required()
                        ->rows(4),
                ])
                ->action(function (array $data) {
                    $this->record->update([
                        'status' => 'resolved',
                        'resolution_type' => $data['resolution_type'],
                        'resolution' => $data['resolution'],
                        'resolved_by' => auth()->id(),
                        'resolved_at' => now(),
                    ]);
                })
                ->visible(fn () => !in_array($this->record->status, ['resolved', 'closed'])),

            Actions\Action::make('escalate')
                ->label('Escalate')
                ->icon('heroicon-o-arrow-up-circle')
                ->color('danger')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update(['status' => 'escalated']))
                ->visible(fn () => $this->record->status !== 'escalated'),

            EditAction::make(),
            DeleteAction::make(),
        ];
    }

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Infolists\Components\Section::make('Dispute Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('dispute_code')
                            ->label('Dispute Code')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'open' => 'danger',
                                'investigating' => 'warning',
                                'awaiting_response' => 'info',
                                'resolved' => 'success',
                                'closed' => 'gray',
                                'escalated' => 'danger',
                                default => 'gray',
                            }),
                        Infolists\Components\TextEntry::make('type')
                            ->badge(),
                        Infolists\Components\TextEntry::make('transaction.id')
                            ->label('Transaction ID'),
                        Infolists\Components\TextEntry::make('raisedBy.name')
                            ->label('Raised By'),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Created At')
                            ->dateTime(),
                    ])->columns(3),

                Infolists\Components\Section::make('Dispute Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('reason')
                            ->label('Reason')
                            ->columnSpanFull(),
                        Infolists\Components\TextEntry::make('description')
                            ->label('Description')
                            ->columnSpanFull()
                            ->prose(),
                    ]),

                Infolists\Components\Section::make('Evidence Files')
                    ->schema([
                        Infolists\Components\TextEntry::make('evidence_urls')
                            ->label('Uploaded Evidence')
                            ->listWithLineBreaks()
                            ->limitList(10)
                            ->columnSpanFull()
                            ->visible(fn ($record) => !empty($record->evidence_urls)),
                    ])
                    ->visible(fn ($record) => !empty($record->evidence_urls)),

                Infolists\Components\Section::make('Party Responses')
                    ->schema([
                        Infolists\Components\TextEntry::make('seller_response')
                            ->label('Seller Response')
                            ->prose()
                            ->visible(fn ($record) => !empty($record->seller_response)),
                        Infolists\Components\TextEntry::make('buyer_response')
                            ->label('Buyer Response')
                            ->prose()
                            ->visible(fn ($record) => !empty($record->buyer_response)),
                        Infolists\Components\TextEntry::make('admin_notes')
                            ->label('Admin Notes')
                            ->prose()
                            ->visible(fn ($record) => !empty($record->admin_notes)),
                    ])->columns(1),

                Infolists\Components\Section::make('Resolution')
                    ->schema([
                        Infolists\Components\TextEntry::make('resolution_type')
                            ->label('Resolution Type')
                            ->badge(),
                        Infolists\Components\TextEntry::make('resolver.name')
                            ->label('Resolved By'),
                        Infolists\Components\TextEntry::make('resolved_at')
                            ->label('Resolved At')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('resolution')
                            ->label('Resolution Details')
                            ->columnSpanFull()
                            ->prose(),
                    ])->columns(3)
                    ->visible(fn ($record) => in_array($record->status, ['resolved', 'closed'])),

                Infolists\Components\Section::make('Timestamps')
                    ->schema([
                        Infolists\Components\TextEntry::make('created_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('updated_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('deleted_at')
                            ->dateTime()
                            ->visible(fn ($record) => $record->deleted_at !== null),
                    ])->columns(3)
                    ->collapsed(),
            ]);
    }
}
