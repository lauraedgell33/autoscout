<?php

namespace App\Filament\Admin\Resources\Transactions\Pages;

use App\Filament\Admin\Resources\Transactions\TransactionResource;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Placeholder;
use Filament\Schemas\Schema;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\HtmlString;

class ViewTransaction extends ViewRecord
{
    protected static string $resource = TransactionResource::class;
    
    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
            
            Action::make('refresh_location')
                ->label('Refresh IP Location')
                ->icon('heroicon-o-map-pin')
                ->color('warning')
                ->requiresConfirmation()
                ->action(function () {
                    $ip = $this->record->metadata['created_from_ip'] ?? $this->record->metadata['location_info']['ip'] ?? null;
                    
                    if (!$ip) {
                        \Filament\Notifications\Notification::make()
                            ->danger()
                            ->title('No IP Found')
                            ->body('No IP address stored for this transaction.')
                            ->send();
                        return;
                    }
                    
                    // Re-lookup IP
                    try {
                        $response = \Illuminate\Support\Facades\Http::timeout(5)
                            ->get("http://ip-api.com/json/{$ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org");
                        
                        if ($response->successful() && $response->json('status') === 'success') {
                            $data = $response->json();
                            $locationInfo = [
                                'ip' => $ip,
                                'is_local' => false,
                                'city' => $data['city'] ?? null,
                                'region' => $data['regionName'] ?? null,
                                'country' => $data['country'] ?? null,
                                'country_code' => $data['countryCode'] ?? null,
                                'zip' => $data['zip'] ?? null,
                                'latitude' => $data['lat'] ?? null,
                                'longitude' => $data['lon'] ?? null,
                                'timezone' => $data['timezone'] ?? null,
                                'isp' => $data['isp'] ?? null,
                                'org' => $data['org'] ?? null,
                                'refreshed_at' => now()->toISOString(),
                            ];
                            
                            $this->record->update([
                                'metadata' => array_merge($this->record->metadata ?? [], [
                                    'location_info' => $locationInfo,
                                ])
                            ]);
                            
                            \Filament\Notifications\Notification::make()
                                ->success()
                                ->title('Location Refreshed')
                                ->body("{$data['city']}, {$data['country']}")
                                ->send();
                        }
                    } catch (\Exception $e) {
                        \Filament\Notifications\Notification::make()
                            ->danger()
                            ->title('Lookup Failed')
                            ->body($e->getMessage())
                            ->send();
                    }
                }),
        ];
    }
    
    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Transaction Overview
                Section::make('Transaction Overview')
                    ->icon('heroicon-o-banknotes')
                    ->schema([
                        Grid::make(4)->schema([
                            Placeholder::make('transaction_code')
                                ->label('Transaction Code')
                                ->content(fn ($record) => $record->transaction_code),
                            Placeholder::make('status')
                                ->label('Status')
                                ->content(fn ($record) => ucwords(str_replace('_', ' ', $record->status))),
                            Placeholder::make('amount')
                                ->label('Amount')
                                ->content(fn ($record) => '€' . number_format($record->amount, 2)),
                            Placeholder::make('created_at')
                                ->label('Created')
                                ->content(fn ($record) => $record->created_at->format('d/m/Y H:i')),
                        ]),
                    ]),
                    
                // Parties
                Section::make('Parties Involved')
                    ->icon('heroicon-o-users')
                    ->schema([
                        Grid::make(3)->schema([
                            Placeholder::make('buyer')
                                ->label('Buyer')
                                ->content(fn ($record) => new HtmlString(
                                    '<div class="space-y-1">' .
                                    '<div><strong>' . e($record->buyer?->name ?? 'N/A') . '</strong></div>' .
                                    '<div class="text-sm text-gray-500">' . e($record->buyer?->email ?? '') . '</div>' .
                                    '<div class="text-sm text-gray-500">' . e($record->buyer?->phone ?? '') . '</div>' .
                                    '</div>'
                                )),
                            Placeholder::make('seller')
                                ->label('Seller')
                                ->content(fn ($record) => new HtmlString(
                                    '<div class="space-y-1">' .
                                    '<div><strong>' . e($record->seller?->name ?? 'N/A') . '</strong></div>' .
                                    '<div class="text-sm text-gray-500">' . e($record->seller?->email ?? '') . '</div>' .
                                    '<div class="text-sm text-gray-500">' . e($record->seller?->phone ?? '') . '</div>' .
                                    '</div>'
                                )),
                            Placeholder::make('dealer')
                                ->label('Dealer')
                                ->content(fn ($record) => $record->dealer?->name ?? 'N/A'),
                        ]),
                    ]),
                    
                // Vehicle Info
                Section::make('Vehicle Information')
                    ->icon('heroicon-o-truck')
                    ->schema([
                        Grid::make(4)->schema([
                            Placeholder::make('vehicle_make')
                                ->label('Make')
                                ->content(fn ($record) => $record->vehicle?->make ?? 'N/A'),
                            Placeholder::make('vehicle_model')
                                ->label('Model')
                                ->content(fn ($record) => $record->vehicle?->model ?? 'N/A'),
                            Placeholder::make('vehicle_year')
                                ->label('Year')
                                ->content(fn ($record) => $record->vehicle?->year ?? 'N/A'),
                            Placeholder::make('vehicle_vin')
                                ->label('VIN')
                                ->content(fn ($record) => $record->vehicle?->vin ?? 'N/A'),
                        ]),
                    ]),
                    
                // Device Information
                Section::make('Device Information')
                    ->icon('heroicon-o-device-phone-mobile')
                    ->description('Information about the device used to create this transaction')
                    ->collapsed()
                    ->schema([
                        Grid::make(2)->schema([
                            Placeholder::make('device_info')
                                ->label('Device Details')
                                ->content(function ($record) {
                                    $device = $record->metadata['device_info'] ?? null;
                                    if (!$device) return 'Not collected';
                                    
                                    return new HtmlString(
                                        '<div class="space-y-1 text-sm">' .
                                        '<div><strong>Browser:</strong> ' . e($device['browser'] ?? 'Unknown') . '</div>' .
                                        '<div><strong>Platform:</strong> ' . e($device['platform'] ?? 'Unknown') . '</div>' .
                                        '<div><strong>Device Type:</strong> ' . e($device['device_type'] ?? 'Unknown') . '</div>' .
                                        '<div><strong>Language:</strong> ' . e(substr($device['language'] ?? 'Unknown', 0, 20)) . '</div>' .
                                        '</div>'
                                    );
                                }),
                            Placeholder::make('user_agent')
                                ->label('User Agent')
                                ->content(function ($record) {
                                    $ua = $record->metadata['device_info']['user_agent'] ?? null;
                                    if (!$ua) return 'N/A';
                                    return new HtmlString('<code class="text-xs break-all">' . e($ua) . '</code>');
                                }),
                        ]),
                    ]),
                    
                // Location Information
                Section::make('Location Information')
                    ->icon('heroicon-o-map-pin')
                    ->description('Geolocation data based on IP address')
                    ->collapsed()
                    ->schema([
                        Grid::make(2)->schema([
                            Placeholder::make('location_details')
                                ->label('Location Details')
                                ->content(function ($record) {
                                    $location = $record->metadata['location_info'] ?? null;
                                    if (!$location) return 'Not collected';
                                    
                                    $flag = isset($location['country_code']) ? $this->countryCodeToEmoji($location['country_code']) : '';
                                    
                                    return new HtmlString(
                                        '<div class="space-y-1 text-sm">' .
                                        '<div><strong>IP Address:</strong> ' . e($location['ip'] ?? 'Unknown') . '</div>' .
                                        '<div><strong>City:</strong> ' . e($location['city'] ?? 'Unknown') . '</div>' .
                                        '<div><strong>Region:</strong> ' . e($location['region'] ?? 'Unknown') . '</div>' .
                                        '<div><strong>Country:</strong> ' . $flag . ' ' . e($location['country'] ?? 'Unknown') . '</div>' .
                                        '<div><strong>Timezone:</strong> ' . e($location['timezone'] ?? 'Unknown') . '</div>' .
                                        '<div><strong>ISP:</strong> ' . e($location['isp'] ?? 'Unknown') . '</div>' .
                                        '</div>'
                                    );
                                }),
                            Placeholder::make('map_link')
                                ->label('Map')
                                ->content(function ($record) {
                                    $lat = $record->metadata['location_info']['latitude'] ?? null;
                                    $lon = $record->metadata['location_info']['longitude'] ?? null;
                                    if ($lat && $lon) {
                                        return new HtmlString(
                                            '<a href="https://www.google.com/maps?q=' . $lat . ',' . $lon . '" target="_blank" class="inline-flex items-center px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100">📍 View on Google Maps</a>'
                                        );
                                    }
                                    return 'Coordinates not available';
                                }),
                        ]),
                    ]),
                    
                // Financial Details
                Section::make('Financial Details')
                    ->icon('heroicon-o-currency-euro')
                    ->schema([
                        Grid::make(4)->schema([
                            Placeholder::make('amount_display')
                                ->label('Transaction Amount')
                                ->content(fn ($record) => new HtmlString('<span class="text-xl font-bold text-primary-600">€' . number_format($record->amount, 2) . '</span>')),
                            Placeholder::make('service_fee_display')
                                ->label('Service Fee')
                                ->content(fn ($record) => '€' . number_format($record->service_fee ?? 0, 2)),
                            Placeholder::make('dealer_commission_display')
                                ->label('Dealer Commission')
                                ->content(fn ($record) => '€' . number_format($record->dealer_commission ?? 0, 2)),
                            Placeholder::make('payment_reference_display')
                                ->label('Payment Reference')
                                ->content(fn ($record) => $record->payment_reference ?? 'N/A'),
                        ]),
                    ]),
                    
                // Timeline
                Section::make('Timeline')
                    ->icon('heroicon-o-calendar')
                    ->collapsed()
                    ->schema([
                        Grid::make(4)->schema([
                            Placeholder::make('created_display')
                                ->label('Created')
                                ->content(fn ($record) => $record->created_at?->format('d/m/Y H:i') ?? 'N/A'),
                            Placeholder::make('payment_verified_display')
                                ->label('Payment Verified')
                                ->content(fn ($record) => $record->payment_verified_at?->format('d/m/Y H:i') ?? 'Not yet'),
                            Placeholder::make('inspection_display')
                                ->label('Inspection Date')
                                ->content(fn ($record) => $record->inspection_date?->format('d/m/Y H:i') ?? 'Not scheduled'),
                            Placeholder::make('completed_display')
                                ->label('Completed')
                                ->content(fn ($record) => $record->completed_at?->format('d/m/Y H:i') ?? 'Not completed'),
                        ]),
                    ]),
                    
                // Notes
                Section::make('Notes')
                    ->icon('heroicon-o-document-text')
                    ->collapsed()
                    ->schema([
                        Placeholder::make('notes_display')
                            ->label('Transaction Notes')
                            ->content(fn ($record) => $record->notes ?? 'No notes'),
                        Placeholder::make('verification_notes_display')
                            ->label('Verification Notes')
                            ->content(fn ($record) => $record->verification_notes ?? 'No verification notes'),
                    ]),
                    
                // Raw Metadata
                Section::make('Raw Metadata')
                    ->icon('heroicon-o-code-bracket')
                    ->description('Complete metadata JSON')
                    ->collapsed()
                    ->schema([
                        Placeholder::make('metadata_raw')
                            ->label('')
                            ->content(function ($record) {
                                if (!$record->metadata) return 'No metadata';
                                return new HtmlString(
                                    '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-xs">' . 
                                    e(json_encode($record->metadata, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . 
                                    '</pre>'
                                );
                            })
                            ->columnSpanFull(),
                    ]),
            ]);
    }
    
    /**
     * Convert country code to flag emoji
     */
    protected function countryCodeToEmoji(string $countryCode): string
    {
        $countryCode = strtoupper($countryCode);
        if (strlen($countryCode) !== 2) return '';
        
        $regionalOffset = 0x1F1E6 - ord('A');
        $emoji = mb_chr(ord($countryCode[0]) + $regionalOffset) . 
                 mb_chr(ord($countryCode[1]) + $regionalOffset);
        return $emoji;
    }
}
