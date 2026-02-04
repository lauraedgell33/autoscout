<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\App;

class SendTestEmails extends Command
{
    protected $signature = 'emails:test {email} {--locale=en}';
    protected $description = 'Send all email templates to a specified email address for testing';

    public function handle()
    {
        $email = $this->argument('email');
        $locale = $this->option('locale');
        
        $this->info("Sending all test emails to: {$email} (locale: {$locale})");
        $this->newLine();

        // Set locale
        App::setLocale($locale);

        // Mock data
        $data = $this->getMockData();

        $templates = [
            '1. Contract Generated' => [
                'view' => 'emails.contract-generated',
                'subject' => __('emails.contract_generated.subject'),
                'data' => $data['contract'],
            ],
            '2. Payment Instructions' => [
                'view' => 'emails.payment-instructions', 
                'subject' => __('emails.payment_instructions.subject'),
                'data' => $data['payment_instructions'],
            ],
            '3. Payment Confirmed' => [
                'view' => 'emails.payment-confirmed',
                'subject' => __('emails.payment_confirmed.subject'),
                'data' => $data['payment_confirmed'],
            ],
            '4. Ready For Delivery' => [
                'view' => 'emails.ready-for-delivery',
                'subject' => __('emails.ready_for_delivery.subject'),
                'data' => $data['ready_delivery'],
            ],
            '5. Delivery Confirmed' => [
                'view' => 'emails.delivery-confirmed',
                'subject' => __('emails.delivery_confirmed.subject'),
                'data' => $data['delivery_confirmed'],
            ],
            '6. Order Completed' => [
                'view' => 'emails.order-completed',
                'subject' => __('emails.order_completed.subject'),
                'data' => $data['order_completed'],
            ],
            '7. Order Cancelled' => [
                'view' => 'emails.order-cancelled',
                'subject' => __('emails.order_cancelled.subject'),
                'data' => $data['order_cancelled'],
            ],
            '8. KYC Approved' => [
                'view' => 'emails.kyc-result',
                'subject' => __('emails.kyc_result.verified_subject'),
                'data' => $data['kyc_approved'],
            ],
            '9. KYC Rejected' => [
                'view' => 'emails.kyc-result',
                'subject' => __('emails.kyc_result.rejected_subject'),
                'data' => $data['kyc_rejected'],
            ],
            '10. Payment Reminder' => [
                'view' => 'emails.transactions.payment-reminder',
                'subject' => __('emails.payment_reminder.title'),
                'data' => $data['payment_reminder'],
            ],
            '11. Transaction Status' => [
                'view' => 'emails.transaction-status',
                'subject' => __('emails.transaction_status.title'),
                'data' => $data['transaction_status'],
            ],
            '12. Payment Status' => [
                'view' => 'emails.payment-status',
                'subject' => __('emails.payment_status.title'),
                'data' => $data['payment_status'],
            ],
            '13. New Message' => [
                'view' => 'emails.new-message',
                'subject' => __('emails.new_message.title'),
                'data' => $data['new_message'],
            ],
        ];

        $sent = 0;
        $failed = 0;

        foreach ($templates as $name => $config) {
            try {
                Mail::send($config['view'], $config['data'], function($message) use ($email, $config, $name) {
                    $message->to($email)
                        ->subject("[TEST] {$name} - " . ($config['subject'] ?? 'AutoScout24 SafeTrade'));
                });
                
                $this->info("✓ {$name}");
                $sent++;
                
                // Delay to avoid rate limiting
                usleep(800000); // 0.8 seconds
            } catch (\Exception $e) {
                $this->error("✗ {$name}: " . $e->getMessage());
                $failed++;
            }
        }

        $this->newLine();
        $this->info("================================");
        $this->info("Sent: {$sent} | Failed: {$failed}");
        $this->info("================================");
        
        if ($sent > 0) {
            $this->newLine();
            $this->info("📧 Check your inbox at: {$email}");
            $this->info("Note: Some emails may be in your spam folder.");
        }

        return $failed > 0 ? 1 : 0;
    }

    private function getMockData(): array
    {
        $buyerName = 'John Doe';
        $vehicleTitle = 'BMW 320i M Sport';
        $vehicleYear = 2023;
        $vin = 'WBAPH5C55BA123456';
        $amount = '45,990.00';
        $currency = 'EUR';
        $reference = 'AS24-REF-2024ABC123';
        $orderNumber = 'TXN-ABC123XYZ';
        $dealerName = 'AutoHaus München GmbH';
        $deadline = now()->addDays(3)->format('d.m.Y H:i');
        $deliveryDate = now()->addDays(7)->format('d.m.Y');
        $completionDate = now()->format('d.m.Y H:i');
        $cancelledAt = now()->format('d.m.Y H:i');
        $deliveredAt = now()->format('d.m.Y H:i');
        $senderName = 'AutoHaus München Support';

        return [
            'contract' => [
                'buyerName' => $buyerName,
                'vehicleTitle' => $vehicleTitle,
                'vehicleYear' => $vehicleYear,
                'amount' => $amount,
                'currency' => $currency,
                'reference' => $reference,
                'contractUrl' => 'https://example.com/contracts/12345.pdf',
                'dealerName' => $dealerName,
            ],
            'payment_instructions' => [
                'buyerName' => $buyerName,
                'vehicleTitle' => $vehicleTitle,
                'amount' => $amount,
                'currency' => $currency,
                'reference' => $reference,
                'iban' => 'DE89 3704 0044 0532 0130 00',
                'accountHolder' => $dealerName,
                'bankName' => 'Commerzbank',
                'bic' => 'COBADEFFXXX',
                'deadline' => $deadline,
            ],
            'payment_confirmed' => [
                'buyerName' => $buyerName,
                'vehicleTitle' => $vehicleTitle,
                'amount' => $amount,
                'currency' => $currency,
                'reference' => $reference,
                'invoiceUrl' => 'https://example.com/invoices/12345.pdf',
                'paymentDate' => now()->format('d.m.Y'),
            ],
            'ready_delivery' => [
                'buyerName' => $buyerName,
                'vehicleTitle' => $vehicleTitle,
                'deliveryDate' => $deliveryDate,
                'dealerName' => $dealerName,
                'dealerAddress' => 'Leopoldstraße 123, 80802 München, Germany',
                'dealerPhone' => '+49 89 123 4567',
                'reference' => $reference,
            ],
            'delivery_confirmed' => [
                'buyerName' => $buyerName,
                'vehicleTitle' => $vehicleTitle,
                'vehicleYear' => $vehicleYear,
                'vin' => $vin,
                'transactionCode' => $orderNumber,
                'deliveredAt' => $deliveredAt,
                'dealerName' => $dealerName,
                'reviewUrl' => 'https://example.com/reviews/create/1',
                'documentsUrl' => 'https://example.com/transactions/12345/documents',
                'supportUrl' => 'https://example.com/support',
            ],
            'order_completed' => [
                'buyerName' => $buyerName,
                'vehicleTitle' => $vehicleTitle,
                'dealerName' => $dealerName,
                'orderNumber' => $orderNumber,
                'totalAmount' => "{$currency} {$amount}",
                'completionDate' => $completionDate,
                'reviewUrl' => 'https://example.com/reviews/create/1',
            ],
            'order_cancelled' => [
                'buyerName' => $buyerName,
                'vehicleTitle' => $vehicleTitle,
                'vehicleYear' => $vehicleYear,
                'transactionCode' => $orderNumber,
                'cancellationReason' => 'Buyer requested cancellation - changed mind about vehicle color',
                'cancelledAt' => $cancelledAt,
                'supportUrl' => 'https://example.com/support',
                'searchUrl' => 'https://example.com/vehicles/search',
            ],
            'kyc_approved' => [
                'userName' => $buyerName,
                'status' => 'verified',
                'rejectionReason' => null,
            ],
            'kyc_rejected' => [
                'userName' => $buyerName,
                'status' => 'rejected',
                'rejectionReason' => 'Document quality was insufficient. Please resubmit clearer photos of your ID document.',
            ],
            'payment_reminder' => [
                'userName' => $buyerName,
                'vehicleTitle' => $vehicleTitle,
                'vehicleYear' => $vehicleYear,
                'amount' => $amount,
                'currency' => $currency,
                'deadline' => $deadline,
                'reference' => $reference,
                'iban' => 'DE89 3704 0044 0532 0130 00',
                'bic' => 'COBADEFFXXX',
                'bankName' => 'Commerzbank',
            ],
            'transaction_status' => [
                'userName' => $buyerName,
                'vehicleTitle' => $vehicleTitle,
                'status' => 'payment_verified',
                'message' => 'Your payment has been verified successfully. The seller will now prepare the vehicle for delivery.',
                'reference' => $reference,
                'transactionUrl' => 'https://example.com/transactions/12345',
            ],
            'payment_status' => [
                'userName' => $buyerName,
                'amount' => $amount,
                'currency' => $currency,
                'status' => 'completed',
                'message' => 'Payment processed successfully.',
                'reference' => 'PAY-2024-001234',
            ],
            'new_message' => [
                'recipientName' => $buyerName,
                'senderName' => $senderName,
                'subject' => 'Question about your BMW 320i M Sport order',
                'messagePreview' => 'Dear John, thank you for your order. We wanted to confirm the delivery address and preferred time slot...',
                'messageUrl' => 'https://example.com/messages/1',
            ],
        ];
    }
}
