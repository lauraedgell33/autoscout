<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Vehicle;
use App\Models\BankAccount;
use App\Models\User;
use App\Models\Invoice;
use App\Services\EmailNotificationService;
use App\Services\PushNotificationService;
use App\Services\ContractGenerator;
use App\Services\InvoiceGenerator;
use App\Services\GeocodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Transaction::with(['buyer', 'seller', 'vehicle', 'dealer', 'invoice'])
            ->where(function($q) use ($user) {
                $q->where('buyer_id', $user->id)
                  ->orWhere('seller_id', $user->id);
                  
                if ($user->dealer_id) {
                    $q->orWhere('dealer_id', $user->dealer_id);
                }
            });

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $transactions = $query->latest()->paginate(15);

        return response()->json($transactions);
    }

    /**
     * Initiate purchase transaction
     * 
     * FLOW:
     * 1. Buyer initiates purchase
     * 2. System creates transaction with payment reference
     * 3. System generates invoice with escrow bank details
     * 4. Buyer makes bank transfer
     * 5. Buyer uploads proof of payment
     * 6. Admin verifies payment
     * 7. Transaction continues...
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'amount' => 'nullable|numeric',
            'payment_method' => 'nullable|string',
        ]);

        $user = $request->user();
        $vehicle = Vehicle::with('seller', 'dealer')->findOrFail($validated['vehicle_id']);
        
        // Check vehicle availability
        if ($vehicle->status !== 'active') {
            return response()->json([
                'message' => 'Vehicle is not available for purchase'
            ], 422);
        }

        // Calculate fees
        $amount = $vehicle->price;
        $serviceFee = max($amount * 0.025, 25); // 2.5% or €25 minimum
        $dealerCommission = $vehicle->dealer_id ? ($amount * 0.03) : 0; // 3% for dealers
        
        // Generate unique payment reference
        $paymentReference = 'AS24-' . strtoupper(Str::random(8)) . '-' . $vehicle->id;
        
        // Collect device info and location
        $deviceInfo = $this->collectDeviceInfo($request);
        $locationInfo = $this->collectLocationInfo($request);
        
        // Create transaction
        $transaction = Transaction::create([
            'transaction_code' => 'TXN-' . strtoupper(Str::random(10)),
            'buyer_id' => $user->id,
            'seller_id' => $vehicle->seller_id,
            'dealer_id' => $vehicle->dealer_id,
            'vehicle_id' => $vehicle->id,
            'amount' => $amount,
            'currency' => 'EUR',
            'service_fee' => $serviceFee,
            'dealer_commission' => $dealerCommission,
            'payment_reference' => $paymentReference,
            'status' => 'pending',
            'metadata' => [
                'buyer_name' => $user->name,
                'buyer_email' => $user->email,
                'buyer_phone' => $user->phone,
                'seller_name' => $vehicle->seller->name,
                'vehicle_title' => "{$vehicle->make} {$vehicle->model} ({$vehicle->year})",
                'device_info' => $deviceInfo,
                'location_info' => $locationInfo,
                'created_from_ip' => $request->ip(),
                'created_at_timestamp' => now()->toISOString(),
            ]
        ]);

        // Update vehicle status
        $vehicle->update(['status' => 'reserved']);

        // Load relationships
        $transaction->load(['buyer', 'seller', 'vehicle', 'dealer']);

        // Send notification to buyer
        $user->notify(new \App\Notifications\TransactionCreatedNotification($transaction));
        
        // Send notification to seller
        $vehicle->seller->notify(new \App\Notifications\NewPurchaseRequestNotification($transaction));

        return response()->json([
            'message' => 'Purchase request submitted successfully. The seller will contact you shortly.',
            'transaction' => $transaction,
        ], 201);
    }

    /**
     * Upload proof of payment
     */
    public function uploadPaymentProof(Request $request, $id)
    {
        $validated = $request->validate([
            'proof' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
            'payment_date' => 'nullable|date',
            'notes' => 'nullable|string|max:500'
        ]);

        $transaction = Transaction::findOrFail($id);
        $user = $request->user();

        // Authorization
        if ($transaction->buyer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Check status
        if ($transaction->status !== 'pending') {
            return response()->json([
                'message' => 'Cannot upload payment proof at this stage'
            ], 422);
        }

        // Store file
        $file = $request->file('proof');
        $path = $file->store("transactions/{$transaction->id}/payment-proofs", 'local');

        // Update transaction
        $transaction->update([
            'payment_proof' => $path,
            'payment_proof_type' => $file->getClientOriginalExtension(),
            'payment_proof_uploaded_at' => now(),
        ]);

        return response()->json([
            'message' => 'Payment proof uploaded successfully. Awaiting verification.',
            'transaction' => $transaction->fresh(['buyer', 'seller', 'vehicle'])
        ]);
    }

    /**
     * Verify payment (Admin only)
     */
    public function verifyPayment(Request $request, $id)
    {
        $validated = $request->validate([
            'verified' => 'required|boolean',
            'notes' => 'nullable|string|max:1000'
        ]);

        $transaction = Transaction::findOrFail($id);
        $user = $request->user();

        // Authorization - only admins
        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($validated['verified']) {
            $transaction->update([
                'payment_verified_by' => $user->id,
                'payment_verified_at' => now(),
                'payment_confirmed_at' => now(),
                'verification_notes' => $validated['notes'] ?? 'Payment verified successfully',
                'status' => 'payment_verified',
            ]);

            // Update invoice
            if ($transaction->invoice) {
                $transaction->invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);
            }

            // Send notifications to buyer
            EmailNotificationService::sendTransactionUpdate(
                $transaction->buyer,
                $transaction,
                'payment_verified',
                'Your payment has been verified and approved'
            );

            PushNotificationService::sendTransactionUpdate(
                $transaction->buyer,
                'payment_verified',
                [
                    'id' => $transaction->id,
                    'reference_number' => $transaction->reference_number,
                ]
            );

            $message = 'Payment verified successfully';
        } else {
            $transaction->update([
                'payment_verified_by' => $user->id,
                'payment_verified_at' => now(),
                'verification_notes' => $validated['notes'] ?? 'Payment verification failed',
                'status' => 'awaiting_payment',
                'payment_proof_url' => null,
                'payment_proof_uploaded_at' => null,
            ]);

            // Notify buyer of failed verification
            EmailNotificationService::sendTransactionUpdate(
                $transaction->buyer,
                $transaction,
                'payment_failed',
                $validated['notes'] ?? 'Payment verification was not successful. Please resubmit.'
            );

            PushNotificationService::sendTransactionUpdate(
                $transaction->buyer,
                'payment_failed',
                [
                    'id' => $transaction->id,
                    'reference_number' => $transaction->reference_number,
                ]
            );

            $message = 'Payment verification rejected. Buyer will be notified.';
        }

        return response()->json([
            'message' => $message,
            'transaction' => $transaction->fresh(['buyer', 'seller', 'vehicle', 'invoice'])
        ]);
    }

    /**
     * Release funds to seller (Admin only)
     */
    public function releaseFunds(Request $request, $id)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000'
        ]);

        $transaction = Transaction::findOrFail($id);
        $user = $request->user();

        // Authorization
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check status
        if ($transaction->status !== 'inspection_passed') {
            return response()->json([
                'message' => 'Cannot release funds. Inspection must be passed first.'
            ], 422);
        }

        $transaction->update([
            'status' => 'completed',
            'completed_at' => now(),
            'notes' => $validated['notes'] ?? 'Funds released to seller',
        ]);

        // Update vehicle
        $transaction->vehicle->update(['status' => 'sold']);

        // Generate contract PDF and attach to transaction
        try {
            $contractPath = ContractGenerator::generate($transaction);
            $transaction->update(['contract_path' => $contractPath]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Contract generation in releaseFunds failed', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage(),
            ]);
            // Continue even if contract generation fails
        }

        // Send notifications
        EmailNotificationService::sendTransactionUpdate(
            $transaction->seller,
            $transaction,
            'funds_released',
            'Funds have been released to your account'
        );

        EmailNotificationService::sendTransactionUpdate(
            $transaction->buyer,
            $transaction,
            'funds_released',
            'Funds have been released to the seller. Prepare for vehicle delivery.'
        );

        PushNotificationService::sendTransactionUpdate(
            $transaction->seller,
            'funds_released',
            ['id' => $transaction->id, 'reference_number' => $transaction->reference_number]
        );

        PushNotificationService::sendTransactionUpdate(
            $transaction->buyer,
            'funds_released',
            ['id' => $transaction->id, 'reference_number' => $transaction->reference_number]
        );

        return response()->json([
            'message' => 'Funds released successfully',
            'transaction' => $transaction->fresh(['buyer', 'seller', 'vehicle'])
        ]);
    }

    /**
     * Get transaction details
     */
    public function show($id)
    {
        $transaction = Transaction::with(['buyer', 'seller', 'vehicle', 'dealer', 'invoice'])
            ->findOrFail($id);

        // Authorization
        $user = request()->user();
        $canView = $transaction->buyer_id === $user->id 
                   || $transaction->seller_id === $user->id
                   || $user->role === 'admin'
                   || ($user->dealer_id && $transaction->dealer_id === $user->dealer_id);

        if (!$canView) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($transaction);
    }

    /**
     * Cancel transaction
     */
    public function cancel(Request $request, $id)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $transaction = Transaction::findOrFail($id);
        $user = $request->user();

        // Authorization
        if ($transaction->buyer_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if cancellable
        if (in_array($transaction->status, ['completed', 'cancelled', 'refunded'])) {
            return response()->json([
                'message' => 'Cannot cancel transaction at this stage'
            ], 422);
        }

        $transaction->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'notes' => $validated['reason'],
        ]);

        // Release vehicle
        if ($transaction->vehicle) {
            $transaction->vehicle->update(['status' => 'active']);
        }

        return response()->json([
            'message' => 'Transaction cancelled successfully',
            'transaction' => $transaction->fresh(['buyer', 'seller', 'vehicle'])
        ]);
    }

    /**
     * Upload receipt (alias for uploadPaymentProof for frontend compatibility)
     */
    public function uploadReceipt(Request $request, $id)
    {
        $validated = $request->validate([
            'receipt' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $transaction = Transaction::findOrFail($id);
        $user = $request->user();

        if ($transaction->buyer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($transaction->status, ['pending', 'pending_payment'])) {
            return response()->json([
                'message' => 'Cannot upload receipt at this stage'
            ], 422);
        }

        $file = $request->file('receipt');
        $path = $file->store("transactions/{$transaction->id}/receipts", 'local');

        $transaction->update([
            'payment_proof' => $path,
            'payment_proof_type' => $file->getClientOriginalExtension(),
            'payment_proof_uploaded_at' => now(),
            'status' => 'payment_received',
        ]);

        return response()->json($transaction->fresh(['buyer', 'seller', 'vehicle']));
    }

    /**
     * Confirm payment received (admin/seller)
     */
    public function confirmPayment(Request $request, $id)
    {
        $validated = $request->validate([
            'confirmation_notes' => 'nullable|string|max:1000'
        ]);

        $transaction = Transaction::findOrFail($id);
        $user = $request->user();

        // Authorization - admin or seller
        $isAuthorized = $user->user_type === 'admin' 
            || $transaction->seller_id === $user->id
            || ($user->dealer_id && $transaction->dealer_id === $user->dealer_id);

        if (!$isAuthorized) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($transaction->status, ['pending', 'pending_payment', 'payment_received'])) {
            return response()->json([
                'message' => 'Cannot confirm payment at this stage'
            ], 422);
        }

        $transaction->update([
            'status' => 'payment_received',
            'payment_confirmed_at' => now(),
            'payment_verified_by' => $user->id,
            'verification_notes' => $validated['confirmation_notes'] ?? 'Payment confirmed',
        ]);

        return response()->json($transaction->fresh(['buyer', 'seller', 'vehicle']));
    }

    /**
     * Schedule inspection
     */
    public function scheduleInspection(Request $request, $id)
    {
        $validated = $request->validate([
            'inspection_date' => 'required|date|after:now',
            'inspection_notes' => 'nullable|string|max:1000'
        ]);

        $transaction = Transaction::findOrFail($id);
        $user = $request->user();

        // Authorization - buyer, seller, or admin
        $isAuthorized = $transaction->buyer_id === $user->id
            || $transaction->seller_id === $user->id
            || $user->user_type === 'admin';

        if (!$isAuthorized) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($transaction->status, ['payment_received', 'payment_verified'])) {
            return response()->json([
                'message' => 'Cannot schedule inspection. Payment must be confirmed first.'
            ], 422);
        }

        $transaction->update([
            'status' => 'inspection_scheduled',
            'inspection_date' => $validated['inspection_date'],
            'notes' => $validated['inspection_notes'] ?? $transaction->notes,
        ]);

        return response()->json($transaction->fresh(['buyer', 'seller', 'vehicle']));
    }

    /**
     * Complete inspection
     */
    public function completeInspection(Request $request, $id)
    {
        $validated = $request->validate([
            'inspection_result' => 'required|in:approved,rejected',
            'inspection_notes' => 'nullable|string|max:1000'
        ]);

        $transaction = Transaction::findOrFail($id);
        $user = $request->user();

        // Authorization - buyer or admin
        $isAuthorized = $transaction->buyer_id === $user->id
            || $user->user_type === 'admin';

        if (!$isAuthorized) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($transaction->status !== 'inspection_scheduled') {
            return response()->json([
                'message' => 'Inspection must be scheduled first'
            ], 422);
        }

        $newStatus = $validated['inspection_result'] === 'approved' 
            ? 'inspection_completed' 
            : 'inspection_failed';

        $transaction->update([
            'status' => $newStatus,
            'notes' => $validated['inspection_notes'] ?? $transaction->notes,
            'metadata' => array_merge($transaction->metadata ?? [], [
                'inspection_result' => $validated['inspection_result'],
                'inspection_completed_at' => now()->toISOString(),
            ]),
        ]);

        return response()->json($transaction->fresh(['buyer', 'seller', 'vehicle']));
    }

    /**
     * Raise dispute
     */
    public function raiseDispute(Request $request, $id)
    {
        $validated = $request->validate([
            'dispute_reason' => 'required|string|max:1000'
        ]);

        $transaction = Transaction::findOrFail($id);
        $user = $request->user();

        // Authorization - buyer or seller
        $isAuthorized = $transaction->buyer_id === $user->id
            || $transaction->seller_id === $user->id;

        if (!$isAuthorized) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Cannot dispute completed/cancelled transactions
        if (in_array($transaction->status, ['completed', 'cancelled', 'refunded'])) {
            return response()->json([
                'message' => 'Cannot raise dispute for this transaction'
            ], 422);
        }

        $previousStatus = $transaction->status;
        
        $transaction->update([
            'status' => 'dispute',
            'metadata' => array_merge($transaction->metadata ?? [], [
                'dispute_reason' => $validated['dispute_reason'],
                'dispute_raised_by' => $user->id,
                'dispute_raised_at' => now()->toISOString(),
                'status_before_dispute' => $previousStatus,
            ]),
        ]);

        // Create dispute record if Dispute model exists
        if (class_exists('\App\Models\Dispute')) {
            \App\Models\Dispute::create([
                'transaction_id' => $transaction->id,
                'raised_by' => $user->id,
                'reason' => $validated['dispute_reason'],
                'status' => 'open',
            ]);
        }

        return response()->json($transaction->fresh(['buyer', 'seller', 'vehicle', 'dispute']));
    }

    /**
     * Refund transaction (Admin only)
     */
    public function refund(Request $request, $id)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000'
        ]);

        $transaction = Transaction::findOrFail($id);
        $user = $request->user();

        // Authorization - admin only
        if ($user->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Can only refund if payment was received
        if (!in_array($transaction->status, ['payment_received', 'payment_verified', 'inspection_scheduled', 'inspection_completed', 'inspection_failed', 'dispute'])) {
            return response()->json([
                'message' => 'Cannot refund at this stage'
            ], 422);
        }

        $transaction->update([
            'status' => 'refunded',
            'notes' => $validated['reason'] ?? 'Transaction refunded by admin',
            'metadata' => array_merge($transaction->metadata ?? [], [
                'refunded_by' => $user->id,
                'refunded_at' => now()->toISOString(),
                'refund_reason' => $validated['reason'] ?? 'Admin initiated refund',
            ]),
        ]);

        // Release vehicle
        if ($transaction->vehicle) {
            $transaction->vehicle->update(['status' => 'active']);
        }

        return response()->json($transaction->fresh(['buyer', 'seller', 'vehicle']));
    }

    /**
     * Get transaction statistics
     */
    public function statistics(Request $request)
    {
        $user = $request->user();
        
        $query = Transaction::query();
        
        // If not admin, only show user's transactions
        if ($user->user_type !== 'admin') {
            $query->where(function($q) use ($user) {
                $q->where('buyer_id', $user->id)
                  ->orWhere('seller_id', $user->id);
                if ($user->dealer_id) {
                    $q->orWhere('dealer_id', $user->dealer_id);
                }
            });
        }

        $total = $query->count();
        $pendingPayment = (clone $query)->whereIn('status', ['pending', 'pending_payment'])->count();
        $paymentReceived = (clone $query)->whereIn('status', ['payment_received', 'payment_verified'])->count();
        $completed = (clone $query)->where('status', 'completed')->count();
        $disputed = (clone $query)->where('status', 'dispute')->count();
        $totalValue = (clone $query)->where('status', 'completed')->sum('amount');

        return response()->json([
            'total' => $total,
            'pending_payment' => $pendingPayment,
            'payment_received' => $paymentReceived,
            'completed' => $completed,
            'disputed' => $disputed,
            'total_value' => number_format($totalValue, 2),
        ]);
    }
    
    /**
     * Collect device information from request
     */
    protected function collectDeviceInfo(Request $request): array
    {
        $userAgent = $request->userAgent() ?? 'Unknown';
        
        // Parse user agent
        $browser = 'Unknown';
        $platform = 'Unknown';
        $device = 'Desktop';
        
        // Detect browser
        if (preg_match('/Firefox\/([\d.]+)/i', $userAgent, $m)) {
            $browser = 'Firefox ' . $m[1];
        } elseif (preg_match('/Chrome\/([\d.]+)/i', $userAgent, $m)) {
            $browser = 'Chrome ' . $m[1];
        } elseif (preg_match('/Safari\/([\d.]+)/i', $userAgent, $m)) {
            $browser = 'Safari ' . $m[1];
        } elseif (preg_match('/Edge\/([\d.]+)/i', $userAgent, $m)) {
            $browser = 'Edge ' . $m[1];
        } elseif (preg_match('/MSIE ([\d.]+)/i', $userAgent, $m)) {
            $browser = 'IE ' . $m[1];
        }
        
        // Detect platform
        if (preg_match('/Windows NT ([\d.]+)/i', $userAgent, $m)) {
            $versions = ['10.0' => '10', '6.3' => '8.1', '6.2' => '8', '6.1' => '7'];
            $platform = 'Windows ' . ($versions[$m[1]] ?? $m[1]);
        } elseif (preg_match('/Mac OS X ([\d_]+)/i', $userAgent, $m)) {
            $platform = 'macOS ' . str_replace('_', '.', $m[1]);
        } elseif (preg_match('/Linux/i', $userAgent)) {
            $platform = 'Linux';
        } elseif (preg_match('/Android ([\d.]+)/i', $userAgent, $m)) {
            $platform = 'Android ' . $m[1];
            $device = 'Mobile';
        } elseif (preg_match('/iPhone|iPad/i', $userAgent)) {
            preg_match('/OS ([\d_]+)/i', $userAgent, $m);
            $platform = 'iOS ' . (isset($m[1]) ? str_replace('_', '.', $m[1]) : '');
            $device = preg_match('/iPad/i', $userAgent) ? 'Tablet' : 'Mobile';
        }
        
        // Detect if mobile
        if (preg_match('/Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i', $userAgent)) {
            $device = $device === 'Desktop' ? 'Mobile' : $device;
        }
        
        return [
            'user_agent' => $userAgent,
            'browser' => $browser,
            'platform' => $platform,
            'device_type' => $device,
            'language' => $request->header('Accept-Language', 'Unknown'),
            'referer' => $request->header('Referer'),
        ];
    }
    
    /**
     * Collect location information from IP
     */
    protected function collectLocationInfo(Request $request): array
    {
        $ip = $request->ip();
        
        // Skip for local IPs
        if (in_array($ip, ['127.0.0.1', '::1']) || str_starts_with($ip, '192.168.') || str_starts_with($ip, '10.')) {
            return [
                'ip' => $ip,
                'is_local' => true,
                'city' => 'Local Network',
                'country' => 'Local',
                'country_code' => 'LO',
            ];
        }
        
        try {
            // Use ip-api.com (free, no key required, 45 requests/minute)
            $response = Http::timeout(3)->get("http://ip-api.com/json/{$ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query");
            
            if ($response->successful() && $response->json('status') === 'success') {
                $data = $response->json();
                return [
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
                ];
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('IP geolocation failed', [
                'ip' => $ip,
                'error' => $e->getMessage()
            ]);
        }
        
        return [
            'ip' => $ip,
            'is_local' => false,
            'lookup_failed' => true,
        ];
    }
}
