<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CookiePreference extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'essential',
        'functional',
        'analytics',
        'marketing',
        'ip_address',
        'user_agent',
        'accepted_at',
        'expires_at',
        'last_refreshed_at',
    ];

    protected $casts = [
        'essential' => 'boolean',
        'functional' => 'boolean',
        'analytics' => 'boolean',
        'marketing' => 'boolean',
        'accepted_at' => 'datetime',
        'expires_at' => 'datetime',
        'last_refreshed_at' => 'datetime',
    ];

    /**
     * Get the user that owns the cookie preference.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if the cookie preference is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if the cookie preference needs refresh (within 7 days of expiry).
     */
    public function needsRefresh(): bool
    {
        if (!$this->expires_at) {
            return false;
        }
        
        return $this->expires_at->diffInDays(now()) <= 7;
    }

    /**
     * Refresh the cookie preference expiration.
     */
    public function refresh(): void
    {
        $this->update([
            'expires_at' => now()->addYear(),
            'last_refreshed_at' => now(),
        ]);
    }

    /**
     * Auto-refresh if needed (called on every request).
     */
    public function autoRefresh(): void
    {
        if ($this->needsRefresh() && !$this->isExpired()) {
            $this->refresh();
        }
    }

    /**
     * Get all accepted cookie categories.
     */
    public function getAcceptedCategories(): array
    {
        $categories = [];
        
        if ($this->essential) $categories[] = 'essential';
        if ($this->functional) $categories[] = 'functional';
        if ($this->analytics) $categories[] = 'analytics';
        if ($this->marketing) $categories[] = 'marketing';
        
        return $categories;
    }

    /**
     * Check if all non-essential cookies are accepted.
     */
    public function hasAcceptedAll(): bool
    {
        return $this->functional && $this->analytics && $this->marketing;
    }

    /**
     * Accept all cookie categories.
     */
    public function acceptAll(): void
    {
        $this->update([
            'essential' => true,
            'functional' => true,
            'analytics' => true,
            'marketing' => true,
            'accepted_at' => now(),
            'expires_at' => now()->addYear(),
        ]);
    }

    /**
     * Accept only essential cookies.
     */
    public function acceptEssentialOnly(): void
    {
        $this->update([
            'essential' => true,
            'functional' => false,
            'analytics' => false,
            'marketing' => false,
            'accepted_at' => now(),
            'expires_at' => now()->addYear(),
        ]);
    }

    /**
     * Scope to get active (non-expired) preferences.
     */
    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', now())
                     ->orWhereNull('expires_at');
    }

    /**
     * Scope to get expired preferences.
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    /**
     * Scope to get preferences needing refresh.
     */
    public function scopeNeedsRefresh($query)
    {
        return $query->whereNotNull('expires_at')
                     ->where('expires_at', '<=', now()->addDays(7))
                     ->where('expires_at', '>', now());
    }
}
