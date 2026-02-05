<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Document;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    public function generate(Transaction $transaction)
    {
        if ($transaction->buyer_id !== auth()->id() && 
            $transaction->vehicle->seller_id !== auth()->id() &&
            auth()->user()->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $buyer = $transaction->buyer;
        $seller = $transaction->vehicle->seller;
        $vehicle = $transaction->vehicle;
        $dealer = $vehicle->dealer;

        $contractData = [
            'contract_number' => 'AST-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT),
            'contract_date' => now()->format('d.m.Y'),
            'transaction' => $transaction,
            'buyer' => $buyer,
            'seller' => $seller,
            'dealer' => $dealer,
            'vehicle' => $vehicle,
            'total_amount' => $transaction->amount * 1.19, // with VAT
            'vat_amount' => $transaction->amount * 0.19,
            'net_amount' => $transaction->amount,
        ];

        $pdf = Pdf::loadView('contracts.purchase', $contractData);
        
        $filename = "contract_{$transaction->id}_" . now()->format('YmdHis') . ".pdf";
        $path = "contracts/{$transaction->id}/{$filename}";
        
        Storage::disk('local')->put($path, $pdf->output());

        Document::create([
            'transaction_id' => $transaction->id,
            'type' => 'sales_contract',
            'file_path' => $path,
            'file_name' => $filename,
            'file_size' => strlen($pdf->output()),
            'uploaded_by' => auth()->id(),
            'metadata' => json_encode([
                'generated_at' => now()->toIso8601String(),
                'contract_number' => $contractData['contract_number'],
            ]),
        ]);

        return response()->json([
            'message' => 'Contract generated successfully',
            'contract_number' => $contractData['contract_number'],
            'download_url' => route('api.contracts.download', $transaction),
        ]);
    }

    public function download(Transaction $transaction)
    {
        if ($transaction->buyer_id !== auth()->id() && 
            $transaction->vehicle->seller_id !== auth()->id() &&
            auth()->user()->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $document = Document::where('transaction_id', $transaction->id)
            ->where('type', 'sales_contract')
            ->latest()
            ->first();

        if (!$document) {
            return response()->json(['message' => 'Contract not found'], 404);
        }

        if (!Storage::disk('local')->exists($document->file_path)) {
            return response()->json(['message' => 'Contract file not found'], 404);
        }

        return Storage::disk('local')->download($document->file_path, $document->file_name);
    }

    public function preview(Transaction $transaction)
    {
        if ($transaction->buyer_id !== auth()->id() && 
            $transaction->vehicle->seller_id !== auth()->id() &&
            auth()->user()->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $buyer = $transaction->buyer;
        $seller = $transaction->vehicle->seller;
        $vehicle = $transaction->vehicle;
        $dealer = $vehicle->dealer;

        $contractData = [
            'contract_number' => 'AST-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT),
            'contract_date' => now()->format('d.m.Y'),
            'transaction' => $transaction,
            'buyer' => $buyer,
            'seller' => $seller,
            'dealer' => $dealer,
            'vehicle' => $vehicle,
            'total_amount' => $transaction->amount * 1.19,
            'vat_amount' => $transaction->amount * 0.19,
            'net_amount' => $transaction->amount,
        ];

        $pdf = Pdf::loadView('contracts.purchase', $contractData);
        
        return $pdf->stream("contract_preview.pdf");
    }
}
