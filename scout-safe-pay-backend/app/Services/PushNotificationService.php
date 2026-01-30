<?php

namespace App\Services;

use App\Models\PushSubscription;
use App\Models\User;
use Illuminate\Support\Facades\Log;

/**
 * Service for sending Web Push Protocol notifications to subscribed devices
 * 
 * Uses the Web Push library to encrypt and send notifications
 * Install with: composer require minishlink/web-push
 */
class PushNotificationService
{
    /**
     * Send a push notification to all subscribed devices of a user
     * 
     * @param User $user
     * @param string $title Notification title
     * @param string $body Notification message body
     * @param array $options Additional options (icon, badge, tag, data, etc.)
     * @return array Results of send attempts
     */
    public static function sendToUser(
        User $user,
        string $title,
        string $body,
        array $options = []
    ): array {
        $subscriptions = $user->pushSubscriptions()->active()->get();

        if ($subscriptions->isEmpty()) {
            Log::debug("No active push subscriptions for user {$user->id}");
            return [];
        }

        $results = [];

        foreach ($subscriptions as $subscription) {
            $results[] = self::sendToSubscription($subscription, $title, $body, $options);
        }

        return $results;
    }

    /**
     * Send a push notification to a specific subscription
     */
    public static function sendToSubscription(
        PushSubscription $subscription,
        string $title,
        string $body,
        array $options = []
    ): array {
        try {
            // Prepare the payload
            $payload = self::buildPayload($title, $body, $options);

            // In production, use web-push library to encrypt and send
            // For now, we'll log the attempt
            Log::info("Sending push notification", [
                'user_id' => $subscription->user_id,
                'subscription_id' => $subscription->id,
                'title' => $title,
                'endpoint' => substr($subscription->endpoint, 0, 50) . '...',
            ]);

            // TODO: Uncomment when web-push is installed
            /*
            $webPush = new WebPush([
                'VAPID' => [
                    'subject' => config('services.push.subject'),
                    'publicKey' => config('services.push.public_key'),
                    'privateKey' => config('services.push.private_key'),
                ],
            ]);

            $report = $webPush->sendOneNotification(
                new Subscription(
                    $subscription->endpoint,
                    $subscription->p256dh,
                    $subscription->auth
                ),
                $payload
            );

            if ($report->isSuccess()) {
                $subscription->markAsUsed();
                return [
                    'success' => true,
                    'subscription_id' => $subscription->id,
                    'message' => 'Push notification sent successfully',
                ];
            } else {
                $subscription->recordFailedAttempt();
                return [
                    'success' => false,
                    'subscription_id' => $subscription->id,
                    'message' => 'Push notification failed: ' . $report->getReason(),
                ];
            }
            */

            // For now, just mark as used and return success
            $subscription->markAsUsed();
            return [
                'success' => true,
                'subscription_id' => $subscription->id,
                'message' => 'Push notification queued (web-push not configured)',
            ];
        } catch (\Exception $e) {
            Log::error("Failed to send push notification", [
                'user_id' => $subscription->user_id,
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);

            $subscription->recordFailedAttempt();

            return [
                'success' => false,
                'subscription_id' => $subscription->id,
                'message' => 'Error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Build the notification payload
     */
    private static function buildPayload(string $title, string $body, array $options = []): string
    {
        $payload = [
            'title' => $title,
            'body' => $body,
            'icon' => $options['icon'] ?? '/icon-192x192.png',
            'badge' => $options['badge'] ?? '/badge-72x72.png',
            'tag' => $options['tag'] ?? 'notification',
            'requireInteraction' => $options['requireInteraction'] ?? false,
        ];

        // Add click action URL if provided
        if (isset($options['url'])) {
            $payload['data'] = ['url' => $options['url']];
        }

        // Add any additional data
        if (isset($options['data'])) {
            $payload['data'] = array_merge($payload['data'] ?? [], $options['data']);
        }

        return json_encode($payload);
    }

    /**
     * Send transaction status update notification
     */
    public static function sendTransactionUpdate(
        User $user,
        string $status,
        array $transactionData
    ): array {
        $title = "Transaction Update";
        $statusText = match ($status) {
            'payment_received' => 'Payment Received',
            'payment_verified' => 'Payment Verified',
            'funds_released' => 'Funds Released',
            'delivery_confirmed' => 'Delivery Confirmed',
            'completed' => 'Transaction Completed',
            'cancelled' => 'Transaction Cancelled',
            'disputed' => 'Transaction Disputed',
            default => 'Transaction ' . ucfirst($status),
        };

        $referenceNumber = $transactionData['reference_number'] ?? 'Unknown';
        $body = "{$statusText}: {$referenceNumber}";

        return self::sendToUser($user, $title, $body, [
            'tag' => 'transaction_' . $transactionData['id'],
            'url' => "/en/transactions/{$transactionData['id']}",
            'data' => [
                'transaction_id' => $transactionData['id'],
                'status' => $status,
            ],
        ]);
    }

    /**
     * Send payment notification
     */
    public static function sendPaymentNotification(
        User $user,
        string $type,
        array $paymentData
    ): array {
        $title = match ($type) {
            'received' => 'Payment Received',
            'failed' => 'Payment Failed',
            'refunded' => 'Payment Refunded',
            default => 'Payment Update',
        };

        $referenceNumber = $paymentData['reference_number'] ?? 'Unknown';
        $body = "{$title}: {$referenceNumber}";

        return self::sendToUser($user, $title, $body, [
            'tag' => 'payment_' . $paymentData['id'],
            'url' => "/en/transactions/{$paymentData['transaction_id']}",
            'data' => [
                'payment_id' => $paymentData['id'],
                'type' => $type,
            ],
        ]);
    }

    /**
     * Send message notification
     */
    public static function sendMessageNotification(
        User $user,
        array $messageData
    ): array {
        $sender = $messageData['sender_name'] ?? 'Someone';
        $preview = $messageData['preview'] ?? 'New message';
        $body = "{$sender}: {$preview}";

        return self::sendToUser($user, 'New Message', $body, [
            'tag' => 'message_' . $messageData['transaction_id'],
            'url' => "/en/messages/{$messageData['transaction_id']}",
            'data' => [
                'message_id' => $messageData['id'],
                'transaction_id' => $messageData['transaction_id'],
            ],
        ]);
    }

    /**
     * Clean up failed subscriptions (those that have been inactive for too long)
     */
    public static function cleanupFailedSubscriptions(): int
    {
        $deletedCount = PushSubscription::where('is_active', false)
            ->where('failed_at', '<', now()->subDays(7))
            ->delete();

        Log::info("Cleaned up {$deletedCount} failed push subscriptions");
        return $deletedCount;
    }
}
