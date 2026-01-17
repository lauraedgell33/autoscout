<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dispute extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'dispute_code',
        'transaction_id',
        'raised_by_user_id',
        'type',
        'reason',
        'description',
        'status',
        'resolution',
        'resolution_type',
        'resolved_by',
        'resolved_at',
        'seller_response',
        'buyer_response',
        'admin_notes',
        'evidence_urls',
        'metadata',
    ];

    protected $casts = [
        'evidence_urls' => 'array',
        'metadata' => 'array',
        'resolved_at' => 'datetime',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function raisedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'raised_by_user_id');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function isResolved(): bool
    {
        return in_array($this->status, ['resolved', 'closed']);
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', ['open', 'in_review', 'investigating', 'awaiting_response']);
    }

    public function scopeResolved($query)
    {
        return $query->whereIn('status', ['resolved', 'closed']);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($dispute) {
            if (!$dispute->dispute_code) {
                $dispute->dispute_code = 'DSP-' . strtoupper(uniqid());
            }
        });
    }
}
