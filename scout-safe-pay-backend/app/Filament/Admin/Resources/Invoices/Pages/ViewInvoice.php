<?php

namespace App\Filament\Admin\Resources\Invoices\Pages;

use App\Filament\Admin\Resources\Invoices\InvoiceResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Filament\Infolists;
use Filament\Schemas\Schema;

class ViewInvoice extends ViewRecord
{
    protected static string $resource = InvoiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('mark_paid')
                ->label('Mark as Paid')
                ->icon('heroicon-o-banknotes')
                ->color('info')
                ->requiresConfirmation()
                ->visible(fn () => $this->record->isPending())
                ->action(fn () => $this->record->markAsPaid()),

            Actions\Action::make('confirm')
                ->label('Confirm Payment')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn () => $this->record->isPaid())
                ->action(fn () => $this->record->markAsConfirmed(auth()->user())),

            Actions\Action::make('download_proof')
                ->label('Download Payment Proof')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('primary')
                ->url(fn () => $this->record->payment_proof_path ? asset('storage/' . $this->record->payment_proof_path) : '#')
                ->openUrlInNewTab()
                ->visible(fn () => $this->record->hasPaymentProof()),

            EditAction::make(),
            DeleteAction::make(),
        ];
    }

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                Infolists\Components\Section::make('Invoice Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('invoice_number')
                            ->label('Invoice Number')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'pending' => 'warning',
                                'paid' => 'info',
                                'confirmed' => 'success',
                                'cancelled' => 'danger',
                                default => 'gray',
                            }),
                        Infolists\Components\TextEntry::make('transaction.transaction_code')
                            ->label('Transaction'),
                        Infolists\Components\TextEntry::make('buyer.name')
                            ->label('Buyer'),
                        Infolists\Components\TextEntry::make('seller.name')
                            ->label('Seller'),
                        Infolists\Components\TextEntry::make('vehicle.title')
                            ->label('Vehicle'),
                    ])->columns(3),

                Infolists\Components\Section::make('Amounts')
                    ->schema([
                        Infolists\Components\TextEntry::make('amount')
                            ->money('EUR'),
                        Infolists\Components\TextEntry::make('vat_percentage')
                            ->label('VAT %')
                            ->suffix('%'),
                        Infolists\Components\TextEntry::make('vat_amount')
                            ->label('VAT Amount')
                            ->money('EUR'),
                        Infolists\Components\TextEntry::make('total_amount')
                            ->label('Total')
                            ->money('EUR')
                            ->weight('bold'),
                    ])->columns(4),

                Infolists\Components\Section::make('Dates')
                    ->schema([
                        Infolists\Components\TextEntry::make('issued_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('due_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('paid_at')
                            ->dateTime(),
                    ])->columns(3),

                Infolists\Components\Section::make('Verification')
                    ->schema([
                        Infolists\Components\TextEntry::make('verifier.name')
                            ->label('Verified By'),
                        Infolists\Components\TextEntry::make('verified_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('verification_notes'),
                    ])->columns(3)
                    ->visible(fn ($record) => $record->verified_at !== null),

                Infolists\Components\Section::make('Notes')
                    ->schema([
                        Infolists\Components\TextEntry::make('notes')
                            ->columnSpanFull(),
                    ])
                    ->visible(fn ($record) => !empty($record->notes)),
            ]);
    }
}
