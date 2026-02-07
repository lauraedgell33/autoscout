<?php

namespace App\Filament\Admin\Resources\Transactions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\KeyValue;
use Filament\Forms;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;

class TransactionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            // Main Transaction Info
            Section::make('Transaction Details')
                ->icon('heroicon-o-banknotes')
                ->schema([
                    Grid::make(3)->schema([
                        TextInput::make('transaction_code')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(50),
                        TextInput::make('payment_reference')
                            ->maxLength(100),
                        Select::make('status')
                            ->required()
                            ->options([
                                'pending' => 'Pending',
                                'payment_pending' => 'Payment Pending',
                                'payment_received' => 'Payment Received',
                                'payment_verified' => 'Payment Verified',
                                'inspection_scheduled' => 'Inspection Scheduled',
                                'inspection_completed' => 'Inspection Completed',
                                'inspection_passed' => 'Inspection Passed',
                                'inspection_failed' => 'Inspection Failed',
                                'completed' => 'Completed',
                                'dispute' => 'Dispute',
                                'refunded' => 'Refunded',
                                'cancelled' => 'Cancelled',
                            ])
                            ->default('pending')
                            ->native(false),
                    ]),
                ]),
            
            // Parties
            Section::make('Parties')
                ->icon('heroicon-o-users')
                ->schema([
                    Grid::make(3)->schema([
                        Select::make('buyer_id')
                            ->label('Buyer')
                            ->relationship('buyer', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Select::make('seller_id')
                            ->label('Seller')
                            ->relationship('seller', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Select::make('dealer_id')
                            ->label('Dealer')
                            ->relationship('dealer', 'name')
                            ->searchable()
                            ->preload(),
                    ]),
                ]),
            
            // Financial Info
            Section::make('Financial Details')
                ->icon('heroicon-o-currency-euro')
                ->schema([
                    Grid::make(4)->schema([
                        TextInput::make('amount')
                            ->required()
                            ->numeric()
                            ->prefix('€'),
                        Select::make('currency')
                            ->required()
                            ->options(['EUR' => 'EUR', 'USD' => 'USD', 'GBP' => 'GBP'])
                            ->default('EUR'),
                        TextInput::make('service_fee')
                            ->numeric()
                            ->prefix('€'),
                        TextInput::make('dealer_commission')
                            ->numeric()
                            ->prefix('€'),
                    ]),
                ]),
            
            // Dates
            Section::make('Timeline')
                ->icon('heroicon-o-calendar')
                ->schema([
                    Grid::make(4)->schema([
                        DateTimePicker::make('created_at')
                            ->disabled(),
                        DateTimePicker::make('inspection_date'),
                        DateTimePicker::make('ownership_transfer_date'),
                        DateTimePicker::make('completed_at')
                            ->disabled(),
                    ]),
                ]),
            
            // Device & Location Info (Read-only, from metadata)
            Section::make('Device & Location Info')
                ->icon('heroicon-o-device-phone-mobile')
                ->description('Information collected when transaction was created')
                ->collapsed()
                ->schema([
                    Grid::make(2)->schema([
                        Placeholder::make('device_info_display')
                            ->label('Device Information')
                            ->content(function ($record) {
                                if (!$record || !$record->metadata) return 'N/A';
                                $device = $record->metadata['device_info'] ?? null;
                                if (!$device) return 'Not collected';
                                
                                return new HtmlString(
                                    '<div class="space-y-1 text-sm">' .
                                    '<div><strong>Browser:</strong> ' . e($device['browser'] ?? 'Unknown') . '</div>' .
                                    '<div><strong>Platform:</strong> ' . e($device['platform'] ?? 'Unknown') . '</div>' .
                                    '<div><strong>Device Type:</strong> ' . e($device['device_type'] ?? 'Unknown') . '</div>' .
                                    '<div><strong>Language:</strong> ' . e(substr($device['language'] ?? 'Unknown', 0, 20)) . '</div>' .
                                    '<div class="text-xs text-gray-500 mt-2 break-all"><strong>User Agent:</strong><br>' . e($device['user_agent'] ?? 'Unknown') . '</div>' .
                                    '</div>'
                                );
                            }),
                        
                        Placeholder::make('location_info_display')
                            ->label('Location Information')
                            ->content(function ($record) {
                                if (!$record || !$record->metadata) return 'N/A';
                                $location = $record->metadata['location_info'] ?? null;
                                if (!$location) return 'Not collected';
                                
                                $flag = $location['country_code'] ?? '';
                                $flagEmoji = $flag ? self::countryCodeToEmoji($flag) : '';
                                
                                return new HtmlString(
                                    '<div class="space-y-1 text-sm">' .
                                    '<div><strong>IP Address:</strong> ' . e($location['ip'] ?? 'Unknown') . '</div>' .
                                    '<div><strong>City:</strong> ' . e($location['city'] ?? 'Unknown') . '</div>' .
                                    '<div><strong>Region:</strong> ' . e($location['region'] ?? 'Unknown') . '</div>' .
                                    '<div><strong>Country:</strong> ' . $flagEmoji . ' ' . e($location['country'] ?? 'Unknown') . ' (' . e($location['country_code'] ?? '') . ')</div>' .
                                    '<div><strong>Timezone:</strong> ' . e($location['timezone'] ?? 'Unknown') . '</div>' .
                                    '<div><strong>ISP:</strong> ' . e($location['isp'] ?? 'Unknown') . '</div>' .
                                    (isset($location['latitude']) && isset($location['longitude']) ? 
                                        '<div class="mt-2"><a href="https://www.google.com/maps?q=' . $location['latitude'] . ',' . $location['longitude'] . '" target="_blank" class="text-primary-600 hover:underline">📍 View on Map</a></div>' : '') .
                                    '</div>'
                                );
                            }),
                    ]),
                ]),
            
            // Raw Metadata (for debugging)
            Section::make('Raw Metadata')
                ->icon('heroicon-o-code-bracket')
                ->description('Complete metadata JSON')
                ->collapsed()
                ->schema([
                    Placeholder::make('metadata_raw')
                        ->label('')
                        ->content(function ($record) {
                            if (!$record || !$record->metadata) return 'No metadata';
                            return new HtmlString(
                                '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-xs">' . 
                                e(json_encode($record->metadata, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . 
                                '</pre>'
                            );
                        })
                        ->columnSpanFull(),
                ]),
            
            // Notes
            Section::make('Notes')
                ->icon('heroicon-o-document-text')
                ->schema([
                    Textarea::make('notes')
                        ->rows(3)
                        ->columnSpanFull(),
                    Textarea::make('verification_notes')
                        ->rows(3)
                        ->columnSpanFull(),
                ]),
        ]);
    }
    
    /**
     * Convert country code to flag emoji
     */
    protected static function countryCodeToEmoji(string $countryCode): string
    {
        $countryCode = strtoupper($countryCode);
        if (strlen($countryCode) !== 2) return '';
        
        $regionalOffset = 0x1F1E6 - ord('A');
        $emoji = mb_chr(ord($countryCode[0]) + $regionalOffset) . 
                 mb_chr(ord($countryCode[1]) + $regionalOffset);
        return $emoji;
    }
}
