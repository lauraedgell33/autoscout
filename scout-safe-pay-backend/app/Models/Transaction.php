<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Transaction extends Model
{
    use SoftDeletes, LogsActivity, HasFactory, Searchable;

    protected $fillable = [
        'transaction_code',
        'buyer_id',
        'seller_id',
        'dealer_id',
        'vehicle_id',
        'amount',
        'currency',
        'service_fee',
        'dealer_commission',
        'escrow_account_iban',
        'escrow_account_country',
        'payment_reference',
        'payment_proof',
        'payment_proof_url',
        'payment_proof_type',
        'payment_proof_uploaded_at',
        'status',
        'payment_verified_by',
        'payment_verified_at',
        'verification_notes',
        'payment_confirmed_at',
        'inspection_date',
        'ownership_transfer_date',
        'completed_at',
        'cancelled_at',
        'metadata',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'service_fee' => 'decimal:2',
        'dealer_commission' => 'decimal:2',
        'metadata' => 'array',
        'payment_proof_uploaded_at' => 'datetime',
        'payment_verified_at' => 'datetime',
        'payment_confirmed_at' => 'datetime',
        'inspection_date' => 'datetime',
        'ownership_transfer_date' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($transaction) {
            if (!$transaction->transaction_code) {
                $transaction->transaction_code = 'AS24-TXN-' . date('Y') . '-' . strtoupper(Str::random(6));
            }
            if (!$transaction->payment_reference) {
                $transaction->payment_reference = 'AS24-REF-' . strtoupper(Str::random(12));
            }
        });
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payment_verified_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function dispute(): HasOne
    {
        return $this->hasOne(Dispute::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'amount', 'buyer_id', 'seller_id', 'dealer_id', 'vehicle_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Transaction {$eventName}")
            ->useLogName('transaction');
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'transaction_code' => $this->transaction_code,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'status' => $this->status,
            'buyer_id' => $this->buyer_id,
            'seller_id' => $this->seller_id,
            'vehicle_id' => $this->vehicle_id,
            'payment_reference' => $this->payment_reference,
            'verification_notes' => $this->verification_notes,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->timestamp,
            'updated_at' => $this->updated_at?->timestamp,
        ];
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return !$this->trashed();
    }
}
