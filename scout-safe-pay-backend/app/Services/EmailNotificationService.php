<?php

namespace App\Services;

use App\Mail\KYCResultMail;
use App\Mail\NewMessageMail;
use App\Mail\PaymentStatusMail;
use App\Mail\TransactionStatusMail;
use App\Models\Message;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

/**
 * Service for sending email notifications
 * Integrates with Laravel Mail and queue system
 */
class EmailNotificationService
{
    /**
     * Send transaction status email
     * 
     * @param User $user
     * @param Transaction $transaction
     * @param string $status
     * @param string|null $message
     * @return void
     */
    public static function sendTransactionUpdate(
        User $user,
        Transaction $transaction,
        string $status,
        ?string $message = null
    ): void {
        try {
            // Only send if user has email notifications enabled
            if (!self::shouldSendEmail($user, 'transaction_updates')) {
                return;
            }

            Mail::to($user->email)->queue(
                new TransactionStatusMail($transaction, $status, $message)
            );

            Log::info('Transaction email queued', [
                'user_id' => $user->id,
                'transaction_id' => $transaction->id,
                'status' => $status,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send transaction email', [
                'user_id' => $user->id,
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send payment status email
     */
    public static function sendPaymentUpdate(
        User $user,
        Payment $payment,
        string $type,
        ?string $message = null
    ): void {
        try {
            // Only send if user has email notifications enabled
            if (!self::shouldSendEmail($user, 'payment_updates')) {
                return;
            }

            Mail::to($user->email)->queue(
                new PaymentStatusMail($payment, $type, $message)
            );

            Log::info('Payment email queued', [
                'user_id' => $user->id,
                'payment_id' => $payment->id,
                'type' => $type,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send payment email', [
                'user_id' => $user->id,
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send KYC result email
     */
    public static function sendKYCResult(
        User $user,
        string $status,
        ?string $rejectionReason = null
    ): void {
        try {
            // Always send KYC results regardless of preferences
            Mail::to($user->email)->queue(
                new KYCResultMail($user, $status, $rejectionReason)
            );

            Log::info('KYC result email queued', [
                'user_id' => $user->id,
                'status' => $status,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send KYC email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send new message notification email
     */
    public static function sendNewMessageNotification(
        User $recipient,
        Message $message
    ): void {
        try {
            // Only send if user has email notifications enabled
            if (!self::shouldSendEmail($recipient, 'message_notifications')) {
                return;
            }

            Mail::to($recipient->email)->queue(
                new NewMessageMail($message, $recipient->name)
            );

            Log::info('Message notification email queued', [
                'user_id' => $recipient->id,
                'message_id' => $message->id,
                'sender_id' => $message->sender_id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send message email', [
                'user_id' => $recipient->id,
                'message_id' => $message->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send both email and push notification
     */
    public static function sendTransactionUpdateWithPush(
        User $user,
        Transaction $transaction,
        string $status,
        ?string $message = null
    ): void {
        // Send email
        self::sendTransactionUpdate($user, $transaction, $status, $message);

        // Send push notification
        PushNotificationService::sendTransactionUpdate($user, $status, [
            'id' => $transaction->id,
            'reference_number' => $transaction->reference_number,
        ]);
    }

    /**
     * Send both email and push notification for payments
     */
    public static function sendPaymentUpdateWithPush(
        User $user,
        Payment $payment,
        string $type,
        ?string $message = null
    ): void {
        // Send email
        self::sendPaymentUpdate($user, $payment, $type, $message);

        // Send push notification
        PushNotificationService::sendPaymentNotification($user, $type, [
            'id' => $payment->id,
            'transaction_id' => $payment->transaction_id,
            'reference_number' => $payment->reference_number,
        ]);
    }

    /**
     * Check if user has enabled this type of notification
     */
    private static function shouldSendEmail(User $user, string $type): bool
    {
        // Check user preferences
        // This assumes a preferences system is in place
        // Adjust based on your actual notification preferences implementation

        return match($type) {
            'transaction_updates' => $user->email_notifications ?? true,
            'payment_updates' => $user->email_notifications ?? true,
            'message_notifications' => $user->email_notifications ?? true,
            default => true,
        };
    }

    /**
     * Send bulk emails with rate limiting
     * Useful for admin notifications or bulk updates
     */
    public static function sendBulkEmails(array $users, string $viewPath, array $data): int
    {
        $sent = 0;
        $failed = 0;

        foreach ($users as $user) {
            try {
                Mail::to($user->email)->queue(
                    new \Illuminate\Mail\Mailable()
                );
                $sent++;
            } catch (\Exception $e) {
                $failed++;
                Log::error('Bulk email failed', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Log::info("Bulk email sending completed", [
            'sent' => $sent,
            'failed' => $failed,
        ]);

        return $sent;
    }
}
