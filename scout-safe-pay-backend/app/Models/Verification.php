<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Verification extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'type',
        'status',
        'submitted_data',
        'verification_result',
        'document_ids',
        'document_type',
        'document_number',
        'document_expiry',
        'vehicle_id',
        'vin_number',
        'vin_check_result',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
        'rejection_reason',
        'expires_at',
    ];

    protected $casts = [
        'submitted_data' => 'array',
        'verification_result' => 'array',
        'document_ids' => 'array',
        'vin_check_result' => 'array',
        'document_expiry' => 'date',
        'reviewed_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
