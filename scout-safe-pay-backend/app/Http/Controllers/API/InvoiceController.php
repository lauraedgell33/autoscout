<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InvoiceController extends Controller
{
    public function generate(Transaction $transaction)
    {
        if ($transaction->buyer_id !== auth()->id() && 
            $transaction->vehicle->seller_id !== auth()->id() &&
            auth()->user()->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $existingInvoice = Invoice::where('transaction_id', $transaction->id)->first();
        if ($existingInvoice) {
            return response()->json([
                'message' => 'Invoice already exists',
                'invoice' => $existingInvoice,
                'download_url' => route('api.invoices.download', $transaction),
            ]);
        }

        $invoice = new Invoice();
        $invoice->invoice_number = $this->generateInvoiceNumber();
        $invoice->transaction_id = $transaction->id;
        $invoice->buyer_id = $transaction->buyer_id;
        $invoice->seller_id = $transaction->vehicle->seller_id;
        $invoice->vehicle_id = $transaction->vehicle_id;
        $invoice->amount = $transaction->amount;
        $invoice->currency = 'EUR';
        $invoice->vat_percentage = 19.00;
        $invoice->issued_at = now();
        $invoice->due_at = now()->addDays(7);
        $invoice->status = 'pending';
        
        $invoice->vat_amount = $invoice->amount * ($invoice->vat_percentage / 100);
        $invoice->total_amount = $invoice->amount + $invoice->vat_amount;
        $invoice->save();

        $buyer = $transaction->buyer;
        $seller = $transaction->vehicle->seller;
        $vehicle = $transaction->vehicle;
        $dealer = $vehicle->dealer;

        $invoiceData = [
            'invoice' => $invoice,
            'transaction' => $transaction,
            'buyer' => $buyer,
            'seller' => $seller,
            'dealer' => $dealer,
            'vehicle' => $vehicle,
        ];

        $pdf = Pdf::loadView('invoices.purchase', $invoiceData);
        
        $filename = "invoice_{$invoice->invoice_number}.pdf";
        $path = "invoices/{$transaction->id}/{$filename}";
        
        Storage::disk('local')->put($path, $pdf->output());

        $invoice->update(['file_path' => $path]);

        return response()->json([
            'message' => 'Invoice generated successfully',
            'invoice' => $invoice,
            'download_url' => route('api.invoices.download', $transaction),
        ]);
    }

    public function download(Transaction $transaction)
    {
        if ($transaction->buyer_id !== auth()->id() && 
            $transaction->vehicle->seller_id !== auth()->id() &&
            auth()->user()->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $invoice = Invoice::where('transaction_id', $transaction->id)->latest()->first();

        if (!$invoice || !$invoice->file_path) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        if (!Storage::disk('local')->exists($invoice->file_path)) {
            return response()->json(['message' => 'Invoice file not found'], 404);
        }

        return Storage::disk('local')->download($invoice->file_path, "invoice_{$invoice->invoice_number}.pdf");
    }

    public function preview(Transaction $transaction)
    {
        if ($transaction->buyer_id !== auth()->id() && 
            $transaction->vehicle->seller_id !== auth()->id() &&
            auth()->user()->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $invoice = Invoice::where('transaction_id', $transaction->id)->latest()->first();
        
        if (!$invoice) {
            $invoice = new Invoice();
            $invoice->invoice_number = 'PREVIEW';
            $invoice->amount = $transaction->amount;
            $invoice->vat_percentage = 19.00;
            $invoice->vat_amount = $invoice->amount * 0.19;
            $invoice->total_amount = $invoice->amount * 1.19;
            $invoice->issued_at = now();
            $invoice->due_at = now()->addDays(7);
        }

        $buyer = $transaction->buyer;
        $seller = $transaction->vehicle->seller;
        $vehicle = $transaction->vehicle;
        $dealer = $vehicle->dealer;

        $invoiceData = [
            'invoice' => $invoice,
            'transaction' => $transaction,
            'buyer' => $buyer,
            'seller' => $seller,
            'dealer' => $dealer,
            'vehicle' => $vehicle,
        ];

        $pdf = Pdf::loadView('invoices.purchase', $invoiceData);
        
        return $pdf->stream("invoice_preview.pdf");
    }

    public function index(Request $request)
    {
        $query = Invoice::with(['transaction', 'buyer', 'seller', 'vehicle']);

        if (auth()->user()->user_type === 'buyer') {
            $query->where('buyer_id', auth()->id());
        } elseif (auth()->user()->user_type === 'seller') {
            $query->where('seller_id', auth()->id());
        }

        $invoices = $query->latest()->paginate(20);

        return response()->json($invoices);
    }

    private function generateInvoiceNumber()
    {
        $year = date('Y');
        $lastInvoice = Invoice::whereYear('created_at', $year)->latest()->first();
        $number = $lastInvoice ? intval(substr($lastInvoice->invoice_number, -4)) + 1 : 1;
        
        return 'INV-' . $year . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
