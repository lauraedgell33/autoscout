<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PushSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'endpoint',
        'p256dh',
        'auth',
        'user_agent',
        'device_name',
        'browser_name',
        'ip_address',
        'is_active',
        'last_used_at',
        'failed_attempts',
        'failed_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'failed_attempts' => 'integer',
        'last_used_at' => 'datetime',
        'failed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns this push subscription
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get only active subscriptions
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get subscriptions for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Mark subscription as used successfully
     */
    public function markAsUsed(): void
    {
        $this->update([
            'last_used_at' => now(),
            'failed_attempts' => 0,
            'failed_at' => null,
        ]);
    }

    /**
     * Record a failed push attempt
     */
    public function recordFailedAttempt(): void
    {
        $attempts = $this->failed_attempts + 1;

        // Deactivate after 5 failed attempts
        if ($attempts >= 5) {
            $this->update([
                'is_active' => false,
                'failed_attempts' => $attempts,
                'failed_at' => now(),
            ]);
        } else {
            $this->update([
                'failed_attempts' => $attempts,
                'failed_at' => now(),
            ]);
        }
    }

    /**
     * Reactivate a previously deactivated subscription
     */
    public function reactivate(): void
    {
        $this->update([
            'is_active' => true,
            'failed_attempts' => 0,
            'failed_at' => null,
        ]);
    }
}
