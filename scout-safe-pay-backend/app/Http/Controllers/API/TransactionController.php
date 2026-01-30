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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
}
