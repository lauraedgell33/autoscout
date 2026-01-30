<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Transaction;
use App\Services\EmailNotificationService;
use App\Services\InvoiceGenerator;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Get payment history
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $payments = Payment::with(['transaction', 'user'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(20);

        return response()->json($payments);
    }

    /**
     * Initiate payment (get bank details)
     */
    public function initiate(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
        ]);

        $transaction = Transaction::findOrFail($validated['transaction_id']);
        
        // Check authorization
        if ($transaction->buyer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Create pending payment record
        $payment = Payment::create([
            'transaction_id' => $transaction->id,
            'user_id' => $request->user()->id,
            'amount' => $transaction->amount,
            'currency' => $transaction->currency,
            'type' => 'deposit',
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Payment initiated',
            'payment' => $payment,
            'bank_details' => [
                'account_holder' => 'AutoScout24 Escrow Services',
                'iban' => $transaction->escrow_account_iban,
                'bic' => 'COBADEFFXXX',
                'bank_name' => 'AutoScout24 GmbH',
                'reference' => $transaction->payment_reference,
                'amount' => $transaction->amount,
                'currency' => $transaction->currency,
            ],
        ]);
    }

    /**
     * Upload payment proof
     */
    public function uploadProof(Request $request)
    {
        $validated = $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'proof' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $payment = Payment::findOrFail($validated['payment_id']);
        
        if ($payment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $path = $request->file('proof')->store('payment-proofs', 'public');

        $payment->update([
            'payment_proof_url' => $path,
            'status' => 'submitted',
        ]);

        // Update transaction status
        $payment->transaction->update([
            'status' => 'payment_submitted',
        ]);

        return response()->json([
            'message' => 'Payment proof uploaded successfully',
            'payment' => $payment,
        ]);
    }

    /**
     * Get specific payment
     */
    public function show(Payment $payment)
    {
        if ($payment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'payment' => $payment->load(['transaction', 'user']),
        ]);
    }

    /**
     * Admin: Verify payment
     */
    public function verify(Request $request, Payment $payment)
    {
        // Only admins can verify
        if (!$request->user()->hasRole(['super_admin', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:verified,rejected',
            'admin_notes' => 'nullable|string',
            'rejection_reason' => 'required_if:status,rejected',
        ]);

        $payment->update([
            'status' => $validated['status'],
            'verified_by_admin_id' => $request->user()->id,
            'verified_at' => now(),
            'admin_notes' => $validated['admin_notes'] ?? null,
            'rejection_reason' => $validated['rejection_reason'] ?? null,
        ]);

        // Update transaction
        if ($validated['status'] === 'verified') {
            $payment->transaction->update([
                'status' => 'payment_verified',
                'payment_confirmed_at' => now(),
                'payment_verified_by' => $request->user()->id,
                'payment_verified_at' => now(),
            ]);

            // Generate invoice PDF and attach to payment
            try {
                $invoicePath = InvoiceGenerator::generate($payment);
                $payment->update(['invoice_path' => $invoicePath]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Invoice generation in payment verification failed', [
                    'payment_id' => $payment->id,
                    'error' => $e->getMessage(),
                ]);
                // Continue even if invoice generation fails
            }
        }

