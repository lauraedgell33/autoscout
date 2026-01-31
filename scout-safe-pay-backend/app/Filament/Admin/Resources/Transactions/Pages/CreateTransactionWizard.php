<?php

namespace App\Filament\Admin\Resources\Transactions\Pages;

use App\Filament\Admin\Resources\Transactions\TransactionResource;
use App\Models\Transaction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Wizard;
use Filament\Schemas\Components\Wizard\Step;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\Page;
use Filament\Support\Exceptions\Halt;
use Illuminate\Support\Str;

class CreateTransactionWizard extends Page
{
    protected static string $resource = TransactionResource::class;
    
    protected string $view = 'filament.admin.resources.transactions.pages.create-transaction-wizard';
    
    protected static bool $shouldRegisterNavigation = false;
    
    protected static ?string $title = 'Create New Transaction';
    
    public ?array $data = [];
    
    public function mount(): void
    {
        $this->form->fill();
    }
    
    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Wizard::make([
                    Step::make('Parties')
                        ->description('Select buyer, seller and dealer')
                        ->icon('heroicon-o-users')
                        ->schema([
                            Select::make('buyer_id')
                                ->label('Buyer')
                                ->relationship('buyer', 'name')
                                ->searchable()
                                ->preload()
                                ->required()
                                ->createOptionForm([
                                    TextInput::make('name')->required(),
                                    TextInput::make('email')->email()->required(),
                                    TextInput::make('phone'),
                                    Select::make('user_type')
                                        ->options(['buyer' => 'Buyer', 'seller' => 'Seller'])
                                        ->default('buyer')
                                        ->required(),
                                ])
                                ->helperText('The person buying the vehicle'),
                                
                            Select::make('seller_id')
                                ->label('Seller')
                                ->relationship('seller', 'name')
                                ->searchable()
                                ->preload()
                                ->required()
                                ->createOptionForm([
                                    TextInput::make('name')->required(),
                                    TextInput::make('email')->email()->required(),
                                    TextInput::make('phone'),
                                    Select::make('user_type')
                                        ->options(['buyer' => 'Buyer', 'seller' => 'Seller'])
                                        ->default('seller')
                                        ->required(),
                                ])
                                ->helperText('The person selling the vehicle'),
                                
                            Select::make('dealer_id')
                                ->label('Dealer')
                                ->relationship('dealer', 'name')
                                ->searchable()
                                ->preload()
                                ->required()
                                ->helperText('The dealer facilitating the transaction'),
                        ])
                        ->columns(3),
                        
                    Step::make('Vehicle')
                        ->description('Vehicle information')
                        ->icon('heroicon-o-truck')
                        ->schema([
                            Select::make('vehicle_id')
                                ->label('Select Existing Vehicle')
                                ->relationship('vehicle', 'vin')
                                ->searchable()
                                ->preload()
                                ->required()
                                ->createOptionForm([
                                    TextInput::make('vin')
                                        ->label('VIN')
                                        ->required()
                                        ->maxLength(17)
                                        ->unique(),
                                    TextInput::make('make')->required(),
                                    TextInput::make('model')->required(),
                                    TextInput::make('year')->numeric()->required(),
                                    TextInput::make('price')->numeric()->prefix('€')->required(),
                                ])
                                ->helperText('Select the vehicle for this transaction'),
                        ]),
                        
                    Step::make('Transaction Details')
                        ->description('Amount and payment terms')
                        ->icon('heroicon-o-banknotes')
                        ->schema([
                            TextInput::make('transaction_code')
                                ->label('Transaction Code')
                                ->default(fn () => 'TXN-' . strtoupper(Str::random(8)))
                                ->disabled()
                                ->dehydrated()
                                ->required()
                                ->helperText('Auto-generated unique code'),
                                
                            TextInput::make('amount')
                                ->label('Transaction Amount')
                                ->numeric()
                                ->prefix('€')
                                ->required()
                                ->live()
                                ->helperText('Total transaction amount'),
                                
                            TextInput::make('commission_rate')
                                ->label('Commission Rate (%)')
                                ->numeric()
                                ->suffix('%')
                                ->default(5)
                                ->required()
                                ->live()
                                ->helperText('Platform commission percentage'),
                                
                            TextInput::make('commission_amount')
                                ->label('Commission Amount')
                                ->numeric()
                                ->prefix('€')
                                ->disabled()
                                ->dehydrated()
                                ->default(function ($get) {
                                    $amount = $get('amount') ?? 0;
                                    $rate = $get('commission_rate') ?? 0;
                                    return round($amount * ($rate / 100), 2);
                                })
                                ->helperText('Calculated automatically'),
                                
                            Select::make('payment_method')
                                ->label('Payment Method')
                                ->options([
                                    'bank_transfer' => 'Bank Transfer',
                                    'escrow' => 'Escrow Service',
                                    'card' => 'Credit Card',
                                    'financing' => 'Financing',
                                ])
                                ->required()
                                ->default('bank_transfer'),
                                
                            DatePicker::make('expected_completion_date')
                                ->label('Expected Completion Date')
                                ->default(now()->addDays(7))
                                ->required()
                                ->minDate(now())
                                ->helperText('When should this transaction complete?'),
                        ])
                        ->columns(2),
                        
                    Step::make('Additional Information')
                        ->description('Notes and special terms')
                        ->icon('heroicon-o-document-text')
                        ->schema([
                            Textarea::make('notes')
                                ->label('Transaction Notes')
                                ->rows(4)
                                ->helperText('Any special notes or terms for this transaction')
                                ->columnSpanFull(),
                                
                            Toggle::make('requires_inspection')
                                ->label('Requires Vehicle Inspection')
                                ->default(true)
                                ->helperText('Does this vehicle need inspection?'),
                                
                            Toggle::make('has_warranty')
                                ->label('Includes Warranty')
                                ->default(false)
                                ->helperText('Is warranty included?'),
                                
                            Toggle::make('notify_parties')
                                ->label('Notify All Parties')
                                ->default(true)
                                ->helperText('Send email notifications to buyer and seller'),
                        ])
                        ->columns(3),
                        
                    Step::make('Review')
                        ->description('Review and confirm')
                        ->icon('heroicon-o-check-circle')
                        ->schema([
                            \Filament\Schemas\Components\Placeholder::make('review_info')
                                ->label('')
                                ->content(fn ($get) => new \Illuminate\Support\HtmlString('
                                    <div class="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <h4 class="font-semibold text-lg">Review Transaction Details</h4>
                                        <div class="grid grid-cols-2 gap-4 text-sm">
                                            <div><strong>Transaction Code:</strong> ' . ($get('transaction_code') ?? 'Auto-generated') . '</div>
                                            <div><strong>Amount:</strong> €' . number_format($get('amount') ?? 0, 2) . '</div>
                                            <div><strong>Commission Rate:</strong> ' . ($get('commission_rate') ?? 0) . '%</div>
                                            <div><strong>Commission Amount:</strong> €' . number_format($get('commission_amount') ?? 0, 2) . '</div>
                                            <div><strong>Payment Method:</strong> ' . ucwords(str_replace('_', ' ', $get('payment_method') ?? 'N/A')) . '</div>
                                        </div>
                                    </div>
                                '))
                                ->columnSpanFull(),
                        ]),
                ])
                ->submitAction(new \Illuminate\Support\HtmlString(
                    '<button type="submit" class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Create Transaction
                    </button>'
                ))
                ->skippable()
                ->persistStepInQueryString()
                ->columnSpanFull()
            ])
            ->statePath('data');
    }
    
    public function create(): void
    {
        try {
            $data = $this->form->getState();
            
            $transaction = Transaction::create([
                'transaction_code' => $data['transaction_code'],
                'buyer_id' => $data['buyer_id'],
                'seller_id' => $data['seller_id'],
                'dealer_id' => $data['dealer_id'],
                'vehicle_id' => $data['vehicle_id'],
                'amount' => $data['amount'],
                'commission_rate' => $data['commission_rate'],
                'commission_amount' => $data['commission_amount'],
                'payment_method' => $data['payment_method'],
                'expected_completion_date' => $data['expected_completion_date'],
                'notes' => $data['notes'] ?? null,
                'status' => 'pending',
            ]);
            
            Notification::make()
                ->success()
                ->title('Transaction Created!')
                ->body("Transaction {$transaction->transaction_code} has been created successfully.")
                ->send();
                
            $this->redirect(TransactionResource::getUrl('edit', ['record' => $transaction]));
            
        } catch (Halt $exception) {
            return;
        }
    }
    
    protected function getHeaderActions(): array
    {
        return [];
    }
}
