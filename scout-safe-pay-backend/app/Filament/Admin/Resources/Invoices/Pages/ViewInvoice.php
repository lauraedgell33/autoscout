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
            Actions\Action::make('downloadPDF')
                ->label('Download PDF')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('primary')
                ->url(fn () => $this->record->pdf_url ?? '#')
                ->openUrlInNewTab()
                ->visible(fn () => !empty($this->record->pdf_url)),

            Actions\Action::make('generatePDF')
                ->label('Generate PDF')
                ->icon('heroicon-o-document')
                ->color('primary')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update([
                    'pdf_url' => '/storage/invoices/' . $this->record->invoice_number . '.pdf',
                ]))
                ->visible(fn () => empty($this->record->pdf_url)),

            Actions\Action::make('sendEmail')
                ->label('Send Email')
                ->icon('heroicon-o-envelope')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update(['status' => 'sent'])),

            Actions\Action::make('markPaid')
                ->label('Mark as Paid')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->action(fn () => $this->record->update([
                    'status' => 'paid',
                    'paid_date' => now(),
                ]))
                ->visible(fn () => $this->record->status !== 'paid'),

            Actions\EditAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    public function infolist(Schema $schema): Schema
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Invoice Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('invoice_number')
                            ->label('Invoice Number')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'draft' => 'secondary',
                                'sent' => 'info',
                                'viewed' => 'warning',
                                'paid' => 'success',
                                'overdue' => 'danger',
                                'cancelled' => 'danger',
                                default => 'gray',
                            }),
                        Infolists\Components\TextEntry::make('transaction.id')
                            ->label('Transaction ID'),
                        Infolists\Components\TextEntry::make('payment.id')
                            ->label('Payment ID')
                            ->visible(fn ($record) => $record->payment_id !== null),
                    ])->columns(2),

                Infolists\Components\Section::make('Amounts')
                    ->schema([
                        Infolists\Components\TextEntry::make('amount')
                            ->money('EUR'),
                        Infolists\Components\TextEntry::make('tax_amount')
                            ->label('Tax (VAT)')
                            ->money('EUR'),
                        Infolists\Components\TextEntry::make('total_amount')
                            ->label('Total')
                            ->money('EUR')
                            ->weight('bold'),
                    ])->columns(3),

                Infolists\Components\Section::make('Dates')
                    ->schema([
                        Infolists\Components\TextEntry::make('invoice_date')
                            ->date('d M Y'),
                        Infolists\Components\TextEntry::make('due_date')
                            ->date('d M Y')
                            ->color(fn ($record) => 
                                $record->status !== 'paid' && $record->due_date->isPast() ? 'danger' : 'gray'
                            ),
                        Infolists\Components\TextEntry::make('paid_date')
                            ->date('d M Y')
                            ->visible(fn ($record) => $record->paid_date !== null),
                    ])->columns(3),

                Infolists\Components\Section::make('Notes')
                    ->schema([
                        Infolists\Components\TextEntry::make('notes')
                            ->prose()
                            ->columnSpanFull(),
                    ])
                    ->visible(fn ($record) => !empty($record->notes)),

                Infolists\Components\Section::make('Timestamps')
                    ->schema([
                        Infolists\Components\TextEntry::make('created_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('updated_at')
                            ->dateTime(),
                    ])->columns(2)
                    ->collapsed(),
            ]);
    }
}
