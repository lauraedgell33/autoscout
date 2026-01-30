<?php

namespace App\Services;

use App\Models\Payment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

/**
 * Service for generating PDF invoices for payments
 * Creates professional invoices for buyer payment records
 */
class InvoiceGenerator
{
    /**
     * Generate PDF invoice for payment
     * 
     * @param Payment $payment
     * @param string|null $savePath
     * @return string Path to saved PDF
     */
    public static function generate(Payment $payment, ?string $savePath = null): string
    {
        try {
            // Load relationships
            $payment->load(['user', 'transaction.vehicle', 'transaction.seller']);

            // Generate invoice number if not exists
            $invoiceNumber = self::getInvoiceNumber($payment);

            // Calculate line items
            $lineItems = self::calculateLineItems($payment);

            // Prepare data for PDF
            $data = [
                'invoiceNumber' => $invoiceNumber,
                'invoiceDate' => Carbon::now()->format('d/m/Y'),
                'invoiceDueDate' => Carbon::now()->addDays(30)->format('d/m/Y'),
                'payment' => $payment,
                'user' => $payment->user,
                'transaction' => $payment->transaction,
                'vehicle' => $payment->transaction->vehicle,
                'seller' => $payment->transaction->seller,
                'lineItems' => $lineItems,
                'subtotal' => $payment->amount,
                'platformFee' => $lineItems['platformFee'],
                'tax' => $lineItems['tax'],
                'total' => $lineItems['total'],
                'currency' => $payment->currency,
            ];

            // Generate PDF from view
            $pdf = Pdf::loadView('pdf.invoice', $data)
                ->setPaper('a4')
                ->setOption('margin-top', 15)
                ->setOption('margin-bottom', 15)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            // Determine save path
            if (!$savePath) {
                $filename = "invoice-{$invoiceNumber}-" . time() . '.pdf';
                $savePath = "documents/invoices/{$filename}";
            }

            // Save to storage
            Storage::disk('public')->put($savePath, $pdf->output());

            Log::info('Invoice generated successfully', [
                'payment_id' => $payment->id,
                'invoice_number' => $invoiceNumber,
                'save_path' => $savePath,
                'total' => $lineItems['total'],
            ]);

            return $savePath;
        } catch (\Exception $e) {
            Log::error('Invoice generation failed', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Get or create invoice number
     * Format: INV-YYYY-XXXXX (e.g., INV-2026-00001)
     * 
     * @param Payment $payment
     * @return string
     */
    public static function getInvoiceNumber(Payment $payment): string
    {
        $year = date('Y');
        $sequence = str_pad($payment->id, 5, '0', STR_PAD_LEFT);
        return "INV-{$year}-{$sequence}";
    }

    /**
     * Calculate line items, fees, taxes for invoice
     * 
     * @param Payment $payment
     * @return array
     */
    public static function calculateLineItems(Payment $payment): array
    {
        $subtotal = $payment->amount;
        
        // Calculate platform fee (2.5%)
        $platformFeePercentage = 0.025;
        $platformFee = $subtotal * $platformFeePercentage;
        
        // Calculate subtotal with fee
        $subtotalWithFee = $subtotal + $platformFee;
        
        // Calculate tax (19% of subtotal + fee, if applicable in your region)
        $taxPercentage = 0.19;
        $tax = $subtotalWithFee * $taxPercentage;
        
        // Calculate total
        $total = $subtotalWithFee + $tax;
        
        return [
            'subtotal' => $subtotal,
            'platformFee' => $platformFee,
            'tax' => $tax,
            'total' => $total,
            'platformFeePercentage' => $platformFeePercentage * 100,
            'taxPercentage' => $taxPercentage * 100,
        ];
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
     * Get invoice URL for download
     * 
     * @param string $invoicePath
     * @return string
     */
    public static function getInvoiceUrl(string $invoicePath): string
    {
        return asset("storage/{$invoicePath}");
    }

    /**
     * Delete invoice file
     * 
     * @param string $invoicePath
     * @return bool
     */
    public static function deleteInvoice(string $invoicePath): bool
    {
        try {
            if (Storage::disk('public')->exists($invoicePath)) {
                Storage::disk('public')->delete($invoicePath);
                Log::info('Invoice deleted', ['path' => $invoicePath]);
                return true;
            }
            return false;
        } catch (\Exception $e) {
            Log::error('Invoice deletion failed', [
                'path' => $invoicePath,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}
