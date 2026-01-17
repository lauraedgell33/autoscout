<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AutoScout24IntegrationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AutoScout24WebhookController extends Controller
{
    private AutoScout24IntegrationService $as24Service;

    public function __construct(AutoScout24IntegrationService $as24Service)
    {
        $this->as24Service = $as24Service;
    }

    /**
     * Handle AutoScout24 webhook events
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        if (!$this->verifyWebhookSignature($request)) {
            Log::warning('AS24 Webhook: Invalid signature', [
                'ip' => $request->ip(),
                'headers' => $request->headers->all(),
            ]);
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $event = $request->input('event');
        $payload = $request->input('data');

        Log::info('AS24 Webhook Received', ['event' => $event, 'payload' => $payload]);

        try {
            $result = match ($event) {
                'dealer.updated' => $this->handleDealerUpdated($payload),
                'dealer.verified' => $this->handleDealerVerified($payload),
                'listing.created' => $this->handleListingCreated($payload),
                'listing.updated' => $this->handleListingUpdated($payload),
                'listing.sold' => $this->handleListingSold($payload),
                'listing.deleted' => $this->handleListingDeleted($payload),
                'payment.verified' => $this->handlePaymentVerified($payload),
                'payment.guarantee_issued' => $this->handlePaymentGuarantee($payload),
                'transaction.status_changed' => $this->handleTransactionStatusChanged($payload),
                default => ['status' => 'ignored', 'message' => 'Event type not handled'],
            };

            return response()->json(['success' => true, 'result' => $result]);
        } catch (\Exception $e) {
            Log::error('AS24 Webhook Processing Error', [
                'event' => $event,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Processing failed'], 500);
        }
    }

    private function verifyWebhookSignature(Request $request): bool
    {
        $signature = $request->header('X-AutoScout24-Signature');
        $secret = config('services.autoscout24.webhook_secret');

        if (!$signature || !$secret) {
            return false;
        }

        $payload = $request->getContent();
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        return hash_equals($expectedSignature, $signature);
    }

    private function handleDealerUpdated(array $payload): array
    {
        $dealer = $this->as24Service->syncDealer($payload['dealer_id']);
        return ['action' => 'dealer_synced', 'dealer_id' => $dealer?->id];
    }

    private function handleDealerVerified(array $payload): array
    {
        $dealer = \App\Models\Dealer::where('autoscout_dealer_id', $payload['dealer_id'])->first();
        if ($dealer) {
            $dealer->update([
                'is_verified' => true,
                'verified_at' => now(),
                'status' => 'active',
            ]);
        }
        return ['action' => 'dealer_verified', 'dealer_id' => $dealer?->id];
    }

    private function handleListingCreated(array $payload): array
    {
        $dealer = \App\Models\Dealer::where('autoscout_dealer_id', $payload['dealer_id'])->first();
        if ($dealer) {
            $vehicle = $this->as24Service->importVehicle($payload['listing_id'], $dealer->id);
            return ['action' => 'listing_imported', 'vehicle_id' => $vehicle?->id];
        }
        return ['action' => 'skipped', 'reason' => 'dealer_not_found'];
    }

    private function handleListingUpdated(array $payload): array
    {
        $vehicle = \App\Models\Vehicle::where('autoscout_listing_id', $payload['listing_id'])->first();
        if ($vehicle) {
            $vehicle->update([
                'price' => $payload['price'] ?? $vehicle->price,
                'status' => $payload['status'] ?? $vehicle->status,
                'autoscout_data' => $payload,
            ]);
            return ['action' => 'listing_updated', 'vehicle_id' => $vehicle->id];
        }
        return ['action' => 'skipped', 'reason' => 'vehicle_not_found'];
    }

    private function handleListingSold(array $payload): array
    {
        $vehicle = \App\Models\Vehicle::where('autoscout_listing_id', $payload['listing_id'])->first();
        if ($vehicle) {
            $vehicle->update(['status' => 'sold']);
            return ['action' => 'listing_marked_sold', 'vehicle_id' => $vehicle->id];
        }
        return ['action' => 'skipped', 'reason' => 'vehicle_not_found'];
    }

    private function handleListingDeleted(array $payload): array
    {
        $vehicle = \App\Models\Vehicle::where('autoscout_listing_id', $payload['listing_id'])->first();
        if ($vehicle) {
            $vehicle->update(['status' => 'removed']);
            return ['action' => 'listing_removed', 'vehicle_id' => $vehicle->id];
        }
        return ['action' => 'skipped', 'reason' => 'vehicle_not_found'];
    }

    private function handlePaymentVerified(array $payload): array
    {
        $transaction = \App\Models\Transaction::where('payment_reference', $payload['reference'])->first();
        if ($transaction) {
            $transaction->update([
                'status' => 'payment_verified',
                'payment_verified_at' => now(),
            ]);
            return ['action' => 'payment_verified', 'transaction_id' => $transaction->id];
        }
        return ['action' => 'skipped', 'reason' => 'transaction_not_found'];
    }

    private function handlePaymentGuarantee(array $payload): array
    {
        $transaction = \App\Models\Transaction::where('transaction_code', $payload['transaction_code'])->first();
        if ($transaction) {
            $transaction->update([
                'metadata' => array_merge($transaction->metadata ?? [], [
                    'as24_guarantee' => [
                        'issued_at' => now()->toIso8601String(),
                        'amount' => $payload['guarantee_amount'],
                        'expires_at' => $payload['expires_at'],
                    ],
                ]),
            ]);
            return ['action' => 'guarantee_recorded', 'transaction_id' => $transaction->id];
        }
        return ['action' => 'skipped', 'reason' => 'transaction_not_found'];
    }

    private function handleTransactionStatusChanged(array $payload): array
    {
        $transaction = \App\Models\Transaction::where('transaction_code', $payload['transaction_code'])->first();
        if ($transaction) {
            Log::info('AS24 Transaction Status Update', [
                'transaction_id' => $transaction->id,
                'old_status' => $transaction->status,
                'new_status' => $payload['status'],
            ]);
            return ['action' => 'status_logged', 'transaction_id' => $transaction->id];
        }
        return ['action' => 'skipped', 'reason' => 'transaction_not_found'];
    }
}
