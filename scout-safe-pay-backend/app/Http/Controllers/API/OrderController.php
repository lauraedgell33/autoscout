<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Vehicle;
use App\Models\Dealer;
use App\Mail\ContractGenerated;
use App\Mail\PaymentInstructions;
use App\Mail\PaymentConfirmed;
use App\Mail\ReadyForDelivery;
use App\Mail\OrderCompleted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    /**
     * Create initial order/reservation
     */
    public function createOrder(Request $request)
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'delivery_address' => 'required|string|max:500',
            'delivery_contact' => 'required|string|max:100',
        ]);

        $vehicle = Vehicle::with('dealer')->findOrFail($request->vehicle_id);
        
        // Check if vehicle is available
        if ($vehicle->status !== 'active') {
            return response()->json([
                'message' => 'Vehicle is not available for purchase'
            ], 422);
        }

        // Create transaction
        $transaction = Transaction::create([
            'transaction_code' => 'TXN-' . strtoupper(Str::random(10)),
            'buyer_id' => Auth::id(),
            'seller_id' => $vehicle->seller_id,
            'vehicle_id' => $vehicle->id,
            'dealer_id' => $vehicle->dealer_id,
            'amount' => $vehicle->price,
            'currency' => 'EUR',
            'status' => 'draft',
            'delivery_address' => $request->delivery_address,
            'delivery_contact' => $request->delivery_contact,
            'metadata' => [
                'buyer_name' => Auth::user()->name,
                'buyer_email' => Auth::user()->email,
                'vehicle_title' => $vehicle->make . ' ' . $vehicle->model,
            ],
        ]);

        // Update vehicle status
        $vehicle->update(['status' => 'reserved']);

        return response()->json([
            'message' => 'Order created successfully',
            'transaction' => $transaction->load(['vehicle', 'buyer', 'dealer'])
        ], 201);
    }

    /**
     * Generate contract PDF (Dealer/Admin only)
     */
    public function generateContract(Request $request, Transaction $transaction)
    {
        // Authorization check
        if (!Auth::user()->hasRole(['admin', 'dealer']) && Auth::id() !== $transaction->seller_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($transaction->status !== 'draft' && $transaction->status !== 'pending') {
            return response()->json([
                'message' => 'Contract can only be generated for draft or pending orders'
            ], 422);
        }

        $dealer = $transaction->dealer;
        
        // Generate unique payment reference
        $paymentReference = 'ORDER-' . strtoupper(Str::random(8));
        $paymentDeadline = now()->addDays(3);

        // Set dealer bank details
        $transaction->update([
            'bank_account_iban' => $dealer->bank_account_iban ?? 'RO49AAAA1B31007593840000',
            'bank_account_holder' => $dealer->company_name,
            'bank_name' => $dealer->bank_name ?? 'BCR',
            'payment_reference' => $paymentReference,
            'payment_deadline' => $paymentDeadline,
        ]);

        // Generate contract PDF
        $pdf = Pdf::loadView('contracts.sale', [
            'transaction' => $transaction->load(['buyer', 'vehicle', 'dealer']),
            'contractNumber' => 'CONTRACT-' . now()->format('Y') . '-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT),
            'generatedDate' => now()->format('d.m.Y'),
        ]);

        $filename = "contract-{$transaction->id}-{$paymentReference}.pdf";
        $path = "contracts/{$filename}";
        
        Storage::disk('public')->put($path, $pdf->output());

        $transaction->update([
            'contract_url' => Storage::url($path),
            'contract_generated_at' => now(),
            'status' => 'contract_generated',
        ]);

        // Send email to buyer
        Mail::to($transaction->buyer->email)->send(new ContractGenerated($transaction));

        return response()->json([
            'message' => 'Contract generated successfully',
            'contract_url' => $transaction->contract_url,
            'payment_reference' => $paymentReference,
        ]);
    }

    /**
     * Upload signed contract (Buyer)
     */
    public function uploadSignedContract(Request $request, Transaction $transaction)
    {
        // Authorization check
        if (Auth::id() !== $transaction->buyer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'signed_contract' => 'required|file|mimes:pdf|max:10240', // 10MB max
            'signature_type' => 'required|in:physical,electronic',
        ]);

        if ($transaction->status !== 'contract_generated') {
            return response()->json([
                'message' => 'Contract must be generated first'
            ], 422);
        }

        // Store signed contract
        $path = $request->file('signed_contract')->store('signed_contracts', 'public');

        $transaction->update([
            'signed_contract_url' => Storage::url($path),
            'contract_signed_at' => now(),
            'signature_type' => $request->signature_type,
            'status' => 'awaiting_bank_transfer',
        ]);

        // Send payment instructions email
        Mail::to($transaction->buyer->email)->send(new PaymentInstructions($transaction));

        return response()->json([
            'message' => 'Contract signed successfully. Please proceed with payment.',
            'payment_details' => [
                'iban' => $transaction->bank_account_iban,
                'holder' => $transaction->bank_account_holder,
                'bank' => $transaction->bank_name,
                'amount' => number_format($transaction->amount, 2) . ' ' . $transaction->currency,
                'reference' => $transaction->payment_reference,
                'deadline' => $transaction->payment_deadline->format('d.m.Y H:i'),
            ]
        ]);
    }

    /**
     * Get payment instructions (for display)
     */
    public function getPaymentInstructions(Transaction $transaction)
    {
        // Authorization check
        if (Auth::id() !== $transaction->buyer_id && !Auth::user()->hasRole(['admin', 'dealer'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($transaction->status !== 'awaiting_bank_transfer') {
            return response()->json([
                'message' => 'Payment instructions not available for this order status'
            ], 422);
        }

        return response()->json([
            'payment_details' => [
                'iban' => $transaction->bank_account_iban,
                'holder' => $transaction->bank_account_holder,
                'bank' => $transaction->bank_name,
                'amount' => number_format($transaction->amount, 2),
                'currency' => $transaction->currency,
                'reference' => $transaction->payment_reference,
                'deadline' => $transaction->payment_deadline,
                'days_remaining' => now()->diffInDays($transaction->payment_deadline, false),
            ],
            'instructions' => [
                'step_1' => 'Log into your online banking',
                'step_2' => 'Create a new transfer with the details above',
                'step_3' => 'IMPORTANT: Include the payment reference in the description',
                'step_4' => 'Payment will be confirmed within 24 hours',
            ]
        ]);
    }

    /**
     * Confirm payment received (Admin/Dealer only - MANUAL)
     */
    public function confirmPayment(Request $request, Transaction $transaction)
    {
        // Authorization check
        if (!Auth::user()->hasRole(['admin', 'dealer'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'payment_date' => 'required|date|before_or_equal:today',
            'payment_proof' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($transaction->status !== 'awaiting_bank_transfer') {
            return response()->json([
                'message' => 'Cannot confirm payment for this order status'
            ], 422);
        }

        // Store payment proof if provided
        $proofUrl = null;
        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');
            $proofUrl = Storage::url($path);
        }

        $transaction->update([
            'status' => 'paid',
            'payment_confirmed_at' => $request->payment_date,
            'payment_verified_by' => Auth::id(),
            'payment_proof_url' => $proofUrl,
            'verification_notes' => $request->notes,
        ]);

        // Generate invoice automatically
        $this->generateInvoice($transaction);

        // Send confirmation email with invoice
        Mail::to($transaction->buyer->email)->send(new PaymentConfirmed($transaction));

        // Notify dealer if admin confirmed
        if (Auth::user()->hasRole('admin') && $transaction->seller_id !== Auth::id()) {
            // Notify dealer about payment confirmation
        }

        return response()->json([
            'message' => 'Payment confirmed successfully',
            'invoice_url' => $transaction->invoice_url,
        ]);
    }

    /**
     * Generate invoice PDF (automatic after payment confirmation)
     */
    protected function generateInvoice(Transaction $transaction)
    {
        $invoiceNumber = 'INV-' . now()->format('Y') . '-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT);
        $invoiceDate = now();

        // Calculate VAT (19% for Romania)
        $vatRate = 0.19;
        $amountWithoutVat = $transaction->amount / (1 + $vatRate);
        $vatAmount = $transaction->amount - $amountWithoutVat;

        $pdf = Pdf::loadView('invoices.sale', [
            'transaction' => $transaction->load(['buyer', 'vehicle', 'dealer']),
            'invoiceNumber' => $invoiceNumber,
            'invoiceDate' => $invoiceDate->format('d.m.Y'),
            'dueDate' => $invoiceDate->format('d.m.Y'), // Already paid
            'amountWithoutVat' => $amountWithoutVat,
            'vatAmount' => $vatAmount,
            'totalAmount' => $transaction->amount,
            'vatRate' => $vatRate * 100,
        ]);

        $filename = "invoice-{$invoiceNumber}.pdf";
        $path = "invoices/{$filename}";
        
        Storage::disk('public')->put($path, $pdf->output());

        $transaction->update([
            'invoice_number' => $invoiceNumber,
            'invoice_url' => Storage::url($path),
            'invoice_issued_at' => now(),
            'status' => 'invoice_issued',
        ]);
    }

    /**
     * Mark ready for delivery (Dealer)
     */
    public function markReadyForDelivery(Request $request, Transaction $transaction)
    {
        // Authorization check
        if (!Auth::user()->hasRole(['admin', 'dealer']) && Auth::id() !== $transaction->seller_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'delivery_date' => 'required|date|after_or_equal:today',
            'delivery_notes' => 'nullable|string|max:1000',
        ]);

        if (!in_array($transaction->status, ['invoice_issued', 'paid'])) {
            return response()->json([
                'message' => 'Invoice must be issued first'
            ], 422);
        }

        $transaction->update([
            'status' => 'ready_for_delivery',
            'delivery_date' => $request->delivery_date,
            'metadata' => array_merge($transaction->metadata ?? [], [
                'delivery_notes' => $request->delivery_notes,
            ]),
        ]);

        // Send delivery details email
        Mail::to($transaction->buyer->email)->send(new ReadyForDelivery($transaction));

        return response()->json([
            'message' => 'Order marked as ready for delivery',
            'delivery_date' => $transaction->delivery_date,
        ]);
    }

    /**
     * Mark as delivered (Dealer/Admin)
     */
    public function markAsDelivered(Request $request, Transaction $transaction)
    {
        // Authorization check
        if (!Auth::user()->hasRole(['admin', 'dealer']) && Auth::id() !== $transaction->seller_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($transaction->status !== 'ready_for_delivery') {
            return response()->json([
                'message' => 'Order must be ready for delivery first'
            ], 422);
        }

        $transaction->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);

        // Update vehicle status
        $transaction->vehicle->update(['status' => 'sold']);

        return response()->json([
            'message' => 'Order marked as delivered successfully',
        ]);
    }

    /**
     * Complete order (after delivery confirmation)
     */
    public function completeOrder(Transaction $transaction)
    {
        // Authorization check
        if (!Auth::user()->hasRole(['admin', 'dealer']) && Auth::id() !== $transaction->seller_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($transaction->status !== 'delivered') {
            return response()->json([
                'message' => 'Order must be delivered first'
            ], 422);
        }

        $transaction->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Send completion email (with review request)
        Mail::to($transaction->buyer->email)->send(new OrderCompleted($transaction));

        return response()->json([
            'message' => 'Order completed successfully',
        ]);
    }

    /**
     * Cancel order
     */
    public function cancelOrder(Request $request, Transaction $transaction)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        // Check if cancellation is allowed
        if (in_array($transaction->status, ['paid', 'invoice_issued', 'ready_for_delivery', 'delivered', 'completed'])) {
            return response()->json([
                'message' => 'Cannot cancel order after payment confirmation'
            ], 422);
        }

        $transaction->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $request->reason,
        ]);

        // Release vehicle
        $transaction->vehicle->update(['status' => 'active']);

        return response()->json([
            'message' => 'Order cancelled successfully',
        ]);
    }
}
