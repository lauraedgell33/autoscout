<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Payment extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'transaction_id',
        'user_id',
        'type',
        'amount',
        'currency',
        'payment_method',
        'payment_reference',
        'bank_transfer_reference',
        'proof_url',
        'status',
        'is_verified',
        'verified_by',
        'verified_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'amount', 'payment_method', 'is_verified', 'verified_by'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Payment {$eventName}")
            ->useLogName('payment');
    }
}
