<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PushSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PushSubscriptionController extends Controller
{
    /**
     * Subscribe device to push notifications
     * POST /api/push-subscriptions/subscribe
     */
    public function subscribe(Request $request)
    {
        $user = Auth::user();

        // Validate push subscription data from Web Push Protocol
        $validated = $request->validate([
            'endpoint' => 'required|string|url|max:500',
            'p256dh' => 'required|string|max:500',
            'auth' => 'required|string|max:500',
            'device_name' => 'nullable|string|max:255',
            'browser_name' => 'nullable|string|max:255',
        ]);

        try {
            // Check if this endpoint already exists for this user
            $existing = PushSubscription::forUser($user->id)
                ->where('endpoint', $validated['endpoint'])
                ->first();

            if ($existing) {
                // Reactivate if it was deactivated
                if (!$existing->is_active) {
                    $existing->reactivate();
                }
                return response()->json([
                    'success' => true,
                    'message' => 'Device already subscribed to push notifications',
                    'subscription_id' => $existing->id,
                ]);
            }

            // Create new push subscription
            $subscription = PushSubscription::create([
                'user_id' => $user->id,
                'endpoint' => $validated['endpoint'],
                'p256dh' => $validated['p256dh'],
                'auth' => $validated['auth'],
                'device_name' => $validated['device_name'] ?? null,
                'browser_name' => $validated['browser_name'] ?? null,
                'user_agent' => $request->userAgent(),
                'ip_address' => $request->ip(),
                'is_active' => true,
                'last_used_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Device successfully subscribed to push notifications',
                'subscription_id' => $subscription->id,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Push subscription failed', [
                'user_id' => $user->id,
                'endpoint' => $validated['endpoint'] ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to subscribe to push notifications',
            ], 500);
        }
    }

    /**
     * Unsubscribe device from push notifications
     * POST /api/push-subscriptions/unsubscribe
     */
    public function unsubscribe(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'endpoint' => 'required|string|url|max:500',
        ]);

        try {
            $subscription = PushSubscription::forUser($user->id)
                ->where('endpoint', $validated['endpoint'])
                ->first();

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription not found',
                ], 404);
            }

            $subscription->delete();

            return response()->json([
                'success' => true,
                'message' => 'Device successfully unsubscribed from push notifications',
            ]);
        } catch (\Exception $e) {
            \Log::error('Push unsubscription failed', [
                'user_id' => $user->id,
                'endpoint' => $validated['endpoint'] ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to unsubscribe from push notifications',
            ], 500);
        }
    }

    /**
     * Get all subscriptions for current user
     * GET /api/push-subscriptions
     */
    public function list(Request $request)
    {
        $user = Auth::user();

        try {
            $subscriptions = PushSubscription::forUser($user->id)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($sub) => [
                    'id' => $sub->id,
                    'device_name' => $sub->device_name ?? 'Unknown Device',
                    'browser_name' => $sub->browser_name,
                    'is_active' => $sub->is_active,
                    'last_used_at' => $sub->last_used_at?->diffForHumans(),
                    'created_at' => $sub->created_at->format('Y-m-d H:i:s'),
                ]);

            return response()->json([
                'success' => true,
                'subscriptions' => $subscriptions,
                'total' => $subscriptions->count(),
                'active_count' => $subscriptions->where('is_active', true)->count(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Push subscriptions list failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve subscriptions',
            ], 500);
        }
    }

    /**
     * Remove a specific subscription
     * DELETE /api/push-subscriptions/{id}
     */
    public function destroy(Request $request, $id)
    {
        $user = Auth::user();

        try {
            $subscription = PushSubscription::forUser($user->id)
                ->findOrFail($id);

            $subscription->delete();

            return response()->json([
                'success' => true,
                'message' => 'Subscription removed',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Push subscription deletion failed', [
                'user_id' => $user->id,
                'subscription_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove subscription',
            ], 500);
        }
    }
}
