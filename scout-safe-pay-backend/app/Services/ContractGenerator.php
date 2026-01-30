<?php

namespace App\Services;

use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

/**
 * Service for generating PDF contracts for transactions
 * Creates professional purchase contracts for vehicle transactions
 */
class ContractGenerator
{
    /**
     * Generate PDF contract for transaction
     * 
     * @param Transaction $transaction
     * @param string|null $savePath
     * @return string Path to saved PDF
     */
    public static function generate(Transaction $transaction, ?string $savePath = null): string
    {
        try {
            // Load relationships
            $transaction->load(['buyer', 'seller', 'vehicle']);

            // Generate contract number if not exists
            $contractNumber = self::getContractNumber($transaction);

            // Prepare data for PDF
            $data = [
                'contractNumber' => $contractNumber,
                'contractDate' => Carbon::now()->format('d/m/Y'),
                'transaction' => $transaction,
                'buyer' => $transaction->buyer,
                'seller' => $transaction->seller,
                'vehicle' => $transaction->vehicle,
                'formattedAmount' => number_format($transaction->amount, 2, ',', '.'),
                'currency' => $transaction->currency,
            ];

            // Generate PDF from view
            $pdf = Pdf::loadView('pdf.contract', $data)
                ->setPaper('a4')
                ->setOption('margin-top', 15)
                ->setOption('margin-bottom', 15)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            // Determine save path
            if (!$savePath) {
                $filename = "contract-{$contractNumber}-" . time() . '.pdf';
                $savePath = "documents/contracts/{$filename}";
            }

            // Save to storage
            Storage::disk('public')->put($savePath, $pdf->output());

            Log::info('Contract generated successfully', [
                'transaction_id' => $transaction->id,
                'contract_number' => $contractNumber,
                'save_path' => $savePath,
            ]);

            return $savePath;
        } catch (\Exception $e) {
            Log::error('Contract generation failed', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Get or create contract number for transaction
     * Format: CONT-YYYY-XXXXX (e.g., CONT-2026-00001)
     * 
     * @param Transaction $transaction
     * @return string
     */
    public static function getContractNumber(Transaction $transaction): string
    {
        $year = date('Y');
        $sequence = str_pad($transaction->id, 5, '0', STR_PAD_LEFT);
        return "CONT-{$year}-{$sequence}";
    }

    /**
     * Format currency amount
     * 
     * @param float $amount
     * @param string $currency
     * @return string
     */
    public static function formatAmount(float $amount, string $currency): string
    {
        return number_format($amount, 2, ',', '.') . ' ' . $currency;
    }

    /**
     * Get contract URL for download
     * 
     * @param string $contractPath
     * @return string
     */
    public static function getContractUrl(string $contractPath): string
    {
        return asset("storage/{$contractPath}");
    }

    /**
     * Delete contract file
     * 
     * @param string $contractPath
     * @return bool
     */
    public static function deleteContract(string $contractPath): bool
    {
        try {
            if (Storage::disk('public')->exists($contractPath)) {
                Storage::disk('public')->delete($contractPath);
                Log::info('Contract deleted', ['path' => $contractPath]);
                return true;
            }
            return false;
        } catch (\Exception $e) {
            Log::error('Contract deletion failed', [
                'path' => $contractPath,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}
