<?php

namespace App\Services;

use App\Models\Dealer;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AutoScout24IntegrationService
{
    private string $apiUrl;
    private string $apiKey;

    public function __construct()
    {
        $this->apiUrl = config('services.autoscout24.api_url', 'https://api.autoscout24.com');
        $this->apiKey = config('services.autoscout24.api_key', '');
    }

    /**
     * Sync dealer from AutoScout24
     */
    public function syncDealer(string $autoscout24DealerId): ?Dealer
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get("{$this->apiUrl}/dealers/{$autoscout24DealerId}");

            if (!$response->successful()) {
                Log::error('AS24 Dealer Sync Failed', ['dealer_id' => $autoscout24DealerId, 'response' => $response->json()]);
                return null;
            }

            $dealerData = $response->json();

            $dealer = Dealer::updateOrCreate(
                ['autoscout_dealer_id' => $autoscout24DealerId],
                [
                    'company_name' => $dealerData['company_name'] ?? '',
                    'contact_email' => $dealerData['email'] ?? '',
                    'phone_number' => $dealerData['phone'] ?? '',
                    'address' => $dealerData['address']['street'] ?? '',
                    'city' => $dealerData['address']['city'] ?? '',
                    'postal_code' => $dealerData['address']['zip'] ?? '',
                    'country' => $dealerData['address']['country'] ?? 'DE',
                    'website' => $dealerData['website'] ?? null,
                    'type' => $dealerData['dealer_type'] ?? 'professional',
                    'autoscout_settings' => $dealerData['settings'] ?? [],
                ]
            );

            Log::info('AS24 Dealer Synced', ['dealer_id' => $dealer->id, 'as24_id' => $autoscout24DealerId]);
            return $dealer;
        } catch (\Exception $e) {
            Log::error('AS24 Dealer Sync Exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Import vehicle from AutoScout24 listing
     */
    public function importVehicle(string $autoscout24ListingId, int $dealerId): ?Vehicle
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get("{$this->apiUrl}/listings/{$autoscout24ListingId}");

            if (!$response->successful()) {
                Log::error('AS24 Vehicle Import Failed', ['listing_id' => $autoscout24ListingId]);
                return null;
            }

            $data = $response->json();

            $vehicle = Vehicle::updateOrCreate(
                ['autoscout_listing_id' => $autoscout24ListingId],
                [
                    'dealer_id' => $dealerId,
                    'seller_id' => Dealer::find($dealerId)->user_id ?? null,
                    'make' => $data['make'] ?? '',
                    'model' => $data['model'] ?? '',
                    'year' => $data['year'] ?? now()->year,
                    'price' => $data['price'] ?? 0,
                    'currency' => $data['currency'] ?? 'EUR',
                    'mileage' => $data['mileage'] ?? 0,
                    'fuel_type' => $data['fuel_type'] ?? 'petrol',
                    'transmission' => $data['transmission'] ?? 'manual',
                    'body_type' => $data['body_type'] ?? 'sedan',
                    'engine_size' => $data['engine_size'] ?? null,
                    'power_hp' => $data['power_hp'] ?? null,
                    'color' => $data['color'] ?? null,
                    'vin' => $data['vin'] ?? null,
                    'description' => $data['description'] ?? '',
                    'location_city' => $data['location']['city'] ?? '',
                    'location_country' => $data['location']['country'] ?? 'DE',
                    'status' => 'active',
                    'autoscout_data' => $data,
                ]
            );

            Log::info('AS24 Vehicle Imported', ['vehicle_id' => $vehicle->id, 'as24_listing_id' => $autoscout24ListingId]);
            return $vehicle;
        } catch (\Exception $e) {
            Log::error('AS24 Vehicle Import Exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Export vehicle to AutoScout24
     */
    public function exportVehicle(Vehicle $vehicle): ?string
    {
        try {
            $payload = [
                'dealer_id' => $vehicle->dealer->autoscout_dealer_id ?? null,
                'make' => $vehicle->make,
                'model' => $vehicle->model,
                'year' => $vehicle->year,
                'price' => $vehicle->price,
                'currency' => $vehicle->currency,
                'mileage' => $vehicle->mileage,
                'fuel_type' => $vehicle->fuel_type,
                'transmission' => $vehicle->transmission,
                'body_type' => $vehicle->body_type,
                'description' => $vehicle->description,
                'location' => [
                    'city' => $vehicle->location_city,
                    'country' => $vehicle->location_country,
                ],
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->post("{$this->apiUrl}/listings", $payload);

            if (!$response->successful()) {
                Log::error('AS24 Vehicle Export Failed', ['vehicle_id' => $vehicle->id]);
                return null;
            }

            $listingId = $response->json('listing_id');
            $vehicle->update(['autoscout_listing_id' => $listingId]);

            Log::info('AS24 Vehicle Exported', ['vehicle_id' => $vehicle->id, 'as24_listing_id' => $listingId]);
            return $listingId;
        } catch (\Exception $e) {
            Log::error('AS24 Vehicle Export Exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Notify AutoScout24 of transaction status
     */
    public function notifyTransactionStatus(string $transactionCode, string $status): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->post("{$this->apiUrl}/transactions/notify", [
                'transaction_code' => $transactionCode,
                'status' => $status,
                'timestamp' => now()->toIso8601String(),
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('AS24 Transaction Notification Failed', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Verify bank account with AutoScout24
     */
    public function verifyBankAccount(string $iban, string $dealerId): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->post("{$this->apiUrl}/bank-accounts/verify", [
                'iban' => $iban,
                'dealer_id' => $dealerId,
            ]);

            if ($response->successful()) {
                return [
                    'verified' => true,
                    'account_holder' => $response->json('account_holder'),
                    'bank_name' => $response->json('bank_name'),
                ];
            }

            return ['verified' => false, 'error' => 'Verification failed'];
        } catch (\Exception $e) {
            return ['verified' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Get payment guarantee status from AutoScout24
     */
    public function getPaymentGuarantee(string $transactionCode): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get("{$this->apiUrl}/payment-guarantee/{$transactionCode}");

            if ($response->successful()) {
                return [
                    'guaranteed' => true,
                    'guarantee_amount' => $response->json('amount'),
                    'expires_at' => $response->json('expires_at'),
                    'status' => $response->json('status'),
                ];
            }

            return ['guaranteed' => false];
        } catch (\Exception $e) {
            Log::error('AS24 Payment Guarantee Check Failed', ['error' => $e->getMessage()]);
            return ['guaranteed' => false];
        }
    }
}
