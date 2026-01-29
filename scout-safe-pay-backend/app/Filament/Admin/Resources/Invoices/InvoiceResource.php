<?php

namespace App\Filament\Admin\Resources\Invoices;

use App\Filament\Admin\Resources\Invoices\Pages\CreateInvoice;
use App\Filament\Admin\Resources\Invoices\Pages\EditInvoice;
use App\Filament\Admin\Resources\Invoices\Pages\ListInvoices;
use App\Filament\Admin\Resources\Invoices\Pages\ViewInvoice;
use App\Models\Invoice;
use Filament\Forms;
use Filament\Schemas\Schema as FilamentSchema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InvoiceResource extends Resource
{
    protected static ?string $model = Invoice::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-document-text';
    
    protected static ?string $navigationLabel = 'Invoices';
    
    protected static ?string $recordTitleAttribute = 'invoice_number';
    
    public static function getNavigationGroup(): ?string
    {
        return 'Documents';
    }
    
    public static function getNavigationSort(): ?int
    {
        return 2;
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'draft')->count() ?: null;
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        $count = static::getModel()::where('status', 'draft')->count();
        return $count > 10 ? 'warning' : ($count > 0 ? 'info' : null);
    }

    public static function form(FilamentSchema $form): FilamentSchema
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Invoice Information')
                    ->schema([
                        Forms\Components\TextInput::make('invoice_number')
                            ->label('Invoice Number')
                            ->default(fn () => 'INV-' . date('Ymd') . '-' . strtoupper(substr(md5(time() . rand()), 0, 6)))
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(50),

                        Forms\Components\Select::make('transaction_id')
                            ->label('Transaction')
                            ->relationship('transaction', 'id')
                            ->searchable()
                            ->required(),

                        Forms\Components\Select::make('payment_id')
                            ->label('Payment')
                            ->relationship('payment', 'id')
                            ->searchable()
                            ->helperText('Optional: Link to payment'),

                        Forms\Components\TextInput::make('amount')
                            ->label('Amount')
                            ->numeric()
                            ->prefix('€')
                            ->required()
                            ->step(0.01),

                        Forms\Components\TextInput::make('tax_amount')
                            ->label('Tax Amount (VAT)')
                            ->numeric()
                            ->prefix('€')
                            ->default(0)
                            ->step(0.01),

                        Forms\Components\TextInput::make('total_amount')
                            ->label('Total Amount')
                            ->numeric()
                            ->prefix('€')
                            ->required()
                            ->step(0.01)
                            ->helperText('Amount + Tax'),
                    ])->columns(3),

                Forms\Components\Section::make('Dates')
                    ->schema([
                        Forms\Components\DatePicker::make('invoice_date')
                            ->label('Invoice Date')
                            ->default(now())
                            ->required(),

                        Forms\Components\DatePicker::make('due_date')
                            ->label('Due Date')
                            ->default(now()->addDays(30))
                            ->required(),

                        Forms\Components\DatePicker::make('paid_date')
                            ->label('Paid Date')
                            ->helperText('Date when payment was received'),
                    ])->columns(3),

                Forms\Components\Section::make('Status & Documents')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Status')
                            ->options([
                                'draft' => 'Draft',
                                'sent' => 'Sent',
                                'viewed' => 'Viewed',
                                'paid' => 'Paid',
                                'overdue' => 'Overdue',
                                'cancelled' => 'Cancelled',
                            ])
                            ->default('draft')
                            ->required()
                            ->reactive(),

                        Forms\Components\TextInput::make('pdf_url')
                            ->label('PDF URL')
                            ->url()
                            ->helperText('Generated PDF file URL'),

                        Forms\Components\Textarea::make('notes')
                            ->label('Notes')
                            ->rows(3)
                            ->columnSpanFull()
                            ->helperText('Internal notes (not shown on invoice)'),
                    ])->columns(2),

                Forms\Components\Section::make('Additional Data')
                    ->schema([
                        Forms\Components\KeyValue::make('metadata')
                            ->label('Metadata')
                            ->helperText('Additional JSON data'),
                    ])->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('invoice_number')
                    ->label('Invoice #')
                    ->sortable()
                    ->searchable()
                    ->weight('bold')
                    ->copyable(),

                Tables\Columns\TextColumn::make('transaction.id')
                    ->label('Transaction')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('total_amount')
                    ->label('Amount')
                    ->money('EUR')
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'secondary' => 'draft',
                        'info' => 'sent',
                        'warning' => fn ($state) => in_array($state, ['viewed', 'overdue']),
                        'success' => 'paid',
                        'danger' => 'cancelled',
                    ])
                    ->sortable(),

                Tables\Columns\TextColumn::make('invoice_date')
                    ->label('Invoice Date')
                    ->date('d M Y')
                    ->sortable(),

                Tables\Columns\TextColumn::make('due_date')
                    ->label('Due Date')
                    ->date('d M Y')
                    ->sortable()
                    ->color(fn (Invoice $record) => 
                        $record->status !== 'paid' && $record->due_date->isPast() ? 'danger' : 'gray'
                    ),

                Tables\Columns\TextColumn::make('paid_date')
                    ->label('Paid Date')
                    ->date('d M Y')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\IconColumn::make('pdf_url')
                    ->label('PDF')
                    ->boolean()
                    ->trueIcon('heroicon-o-document')
                    ->falseIcon('heroicon-o-x-mark')
                    ->trueColor('success')
                    ->falseColor('gray')
                    ->getStateUsing(fn ($record) => !empty($record->pdf_url)),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'draft' => 'Draft',
                        'sent' => 'Sent',
                        'viewed' => 'Viewed',
                        'paid' => 'Paid',
                        'overdue' => 'Overdue',
                        'cancelled' => 'Cancelled',
                    ])
                    ->multiple(),

                Tables\Filters\Filter::make('overdue')
                    ->label('Overdue Only')
                    ->query(fn (Builder $query) => 
                        $query->where('status', '!=', 'paid')
                            ->whereDate('due_date', '<', now())
                    ),

                Tables\Filters\Filter::make('unpaid')
                    ->label('Unpaid Only')
                    ->query(fn (Builder $query) => $query->where('status', '!=', 'paid')),

                Tables\Filters\Filter::make('this_month')
                    ->label('This Month')
                    ->query(fn (Builder $query) => $query->whereMonth('invoice_date', now()->month)),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\Action::make('generatePDF')
                    ->label('Generate PDF')
                    ->icon('heroicon-o-document')
                    ->color('primary')
                    ->requiresConfirmation()
                    ->action(function (Invoice $record) {
                        // TODO: Implement PDF generation
                        // This would use a package like dompdf or snappy
                        $record->update([
                            'pdf_url' => '/storage/invoices/' . $record->invoice_number . '.pdf',
                        ]);
                    })
                    ->visible(fn (Invoice $record) => empty($record->pdf_url)),

                Tables\Actions\Action::make('sendEmail')
                    ->label('Send Email')
                    ->icon('heroicon-o-envelope')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function (Invoice $record) {
                        // TODO: Implement email sending
                        $record->update(['status' => 'sent']);
                    })
                    ->visible(fn (Invoice $record) => in_array($record->status, ['draft', 'viewed'])),

                Tables\Actions\Action::make('markPaid')
                    ->label('Mark Paid')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn (Invoice $record) => $record->update([
                        'status' => 'paid',
                        'paid_date' => now(),
                    ]))
                    ->visible(fn (Invoice $record) => $record->status !== 'paid'),

                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('generate_pdfs')
                        ->label('Generate PDFs')
                        ->icon('heroicon-o-document')
                        ->color('primary')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            // TODO: Bulk PDF generation
                            $records->each(fn ($record) => $record->update([
                                'pdf_url' => '/storage/invoices/' . $record->invoice_number . '.pdf',
                            ]));
                        }),

                    Tables\Actions\BulkAction::make('send_emails')
                        ->label('Send Emails')
                        ->icon('heroicon-o-envelope')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'sent'])),

                    Tables\Actions\BulkAction::make('mark_paid')
                        ->label('Mark as Paid')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update([
                            'status' => 'paid',
                            'paid_date' => now(),
                        ])),

                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ])
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
            'index' => ListInvoices::route('/'),
            'create' => CreateInvoice::route('/create'),
            'view' => ViewInvoice::route('/{record}'),
            'edit' => EditInvoice::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['invoice_number', 'transaction.id'];
    }
}
