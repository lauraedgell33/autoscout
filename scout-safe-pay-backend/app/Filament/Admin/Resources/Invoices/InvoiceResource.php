<?php

namespace App\Filament\Admin\Resources\Invoices;

use App\Filament\Admin\Resources\Invoices\Pages\CreateInvoice;
use App\Filament\Admin\Resources\Invoices\Pages\EditInvoice;
use App\Filament\Admin\Resources\Invoices\Pages\ListInvoices;
use App\Filament\Admin\Resources\Invoices\Pages\ViewInvoice;
use App\Models\Invoice;
use Filament\Actions\Action;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\Section as InfolistSection;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InvoiceResource extends Resource
{
    protected static ?string $model = Invoice::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-document-currency-euro';

    protected static ?string $recordTitleAttribute = 'invoice_number';

    public static function getNavigationGroup(): ?string
    {
        return 'Finance';
    }

    public static function getNavigationSort(): ?int
    {
        return 2;
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['invoice_number', 'buyer.name', 'seller.name', 'transaction.transaction_code'];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Invoice Information')
                    ->schema([
                        TextInput::make('invoice_number')
                            ->default(fn () => Invoice::generateInvoiceNumber())
                            ->required()
                            ->unique(ignoreRecord: true),

                        Select::make('transaction_id')
                            ->relationship('transaction', 'transaction_code')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Select::make('buyer_id')
                            ->relationship('buyer', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Select::make('seller_id')
                            ->relationship('seller', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Select::make('vehicle_id')
                            ->relationship('vehicle', 'make')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->make} {$record->model} ({$record->year})")
                            ->searchable()
                            ->preload(),

                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'paid' => 'Paid',
                                'confirmed' => 'Confirmed',
                                'cancelled' => 'Cancelled',
                            ])
                            ->default('pending')
                            ->required(),
                    ])
                    ->columns(2),

                Section::make('Amount Details')
                    ->schema([
                        TextInput::make('amount')
                            ->numeric()
                            ->prefix('€')
                            ->required(),

                        TextInput::make('currency')
                            ->default('EUR')
                            ->required(),

                        TextInput::make('vat_percentage')
                            ->numeric()
                            ->suffix('%')
                            ->default(19),

                        TextInput::make('vat_amount')
                            ->numeric()
                            ->prefix('€')
                            ->disabled(),

                        TextInput::make('total_amount')
                            ->numeric()
                            ->prefix('€')
                            ->disabled(),
                    ])
                    ->columns(3),

                Section::make('Dates')
                    ->schema([
                        DateTimePicker::make('issued_at')
                            ->default(now()),

                        DateTimePicker::make('due_at'),

                        DateTimePicker::make('paid_at'),
                    ])
                    ->columns(3),

                Section::make('Bank Details')
                    ->schema([
                        TextInput::make('bank_name'),
                        TextInput::make('bank_iban'),
                        TextInput::make('bank_bic'),
                        TextInput::make('bank_account_holder'),
                    ])
                    ->columns(2)
                    ->collapsed(),

                Section::make('Payment Proof')
                    ->schema([
                        FileUpload::make('payment_proof_path')
                            ->label('Payment Proof')
                            ->directory('invoices/proofs')
                            ->visibility('private'),

                        Textarea::make('notes')
                            ->rows(3),
                    ])
                    ->columns(1),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                InfolistSection::make('Invoice Details')
                    ->schema([
                        TextEntry::make('invoice_number'),
                        TextEntry::make('transaction.transaction_code')
                            ->label('Transaction'),
                        TextEntry::make('buyer.name')
                            ->label('Buyer'),
                        TextEntry::make('seller.name')
                            ->label('Seller'),
                        TextEntry::make('vehicle')
                            ->label('Vehicle')
                            ->formatStateUsing(fn ($record) => $record->vehicle ? "{$record->vehicle->make} {$record->vehicle->model} ({$record->vehicle->year})" : 'N/A'),
                        TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'pending' => 'warning',
                                'paid' => 'info',
                                'confirmed' => 'success',
                                'cancelled' => 'danger',
                                default => 'gray',
                            }),
                    ])
                    ->columns(3),

                InfolistSection::make('Amounts')
                    ->schema([
                        TextEntry::make('amount')
                            ->money('EUR'),
                        TextEntry::make('vat_percentage')
                            ->suffix('%'),
                        TextEntry::make('vat_amount')
                            ->money('EUR'),
                        TextEntry::make('total_amount')
                            ->money('EUR')
                            ->weight('bold'),
                    ])
                    ->columns(4),

                InfolistSection::make('Dates')
                    ->schema([
                        TextEntry::make('issued_at')
                            ->dateTime(),
                        TextEntry::make('due_at')
                            ->dateTime(),
                        TextEntry::make('paid_at')
                            ->dateTime(),
                    ])
                    ->columns(3),

                InfolistSection::make('Verification')
                    ->schema([
                        TextEntry::make('verifier.name')
                            ->label('Verified By'),
                        TextEntry::make('verified_at')
                            ->dateTime(),
                        TextEntry::make('verification_notes'),
                    ])
                    ->columns(3)
                    ->visible(fn ($record) => $record->verified_at),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('invoice_number')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('transaction.transaction_code')
                    ->label('Transaction')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('buyer.name')
                    ->label('Buyer')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('seller.name')
                    ->label('Seller')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('total_amount')
                    ->money('EUR')
                    ->sortable(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'paid' => 'info',
                        'confirmed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('issued_at')
                    ->dateTime()
                    ->sortable(),

                TextColumn::make('due_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'confirmed' => 'Confirmed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->multiple(),

                SelectFilter::make('buyer')
                    ->relationship('buyer', 'name')
                    ->searchable()
                    ->preload(),

                TrashedFilter::make(),
            ])
            ->actions([
                ActionGroup::make([
                    ViewAction::make(),
                    EditAction::make(),

                    Action::make('mark_paid')
                        ->label('Mark as Paid')
                        ->icon('heroicon-o-banknotes')
                        ->color('info')
                        ->requiresConfirmation()
                        ->visible(fn (Invoice $record): bool => $record->isPending())
                        ->action(function (Invoice $record) {
                            $record->markAsPaid();
                            Notification::make()
                                ->title('Invoice marked as paid')
                                ->success()
                                ->send();
                        }),

                    Action::make('confirm')
                        ->label('Confirm Payment')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->visible(fn (Invoice $record): bool => $record->isPaid())
                        ->action(function (Invoice $record) {
                            $record->markAsConfirmed(auth()->user());
                            Notification::make()
                                ->title('Payment confirmed')
                                ->success()
                                ->send();
                        }),

                    DeleteAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
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
            ->withoutGlobalScopes([SoftDeletingScope::class]);
    }
}
