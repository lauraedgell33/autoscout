<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'transaction_id',
        'buyer_id',
        'seller_id',
        'vehicle_id',
        'amount',
        'currency',
        'vat_percentage',
        'vat_amount',
        'total_amount',
        'status',
        'issued_at',
        'due_at',
        'paid_at',
        'bank_name',
        'bank_iban',
        'bank_bic',
        'bank_account_holder',
        'payment_proof_path',
        'payment_proof_uploaded_at',
        'verified_by',
        'verified_at',
        'verification_notes',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'vat_percentage' => 'decimal:2',
        'vat_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'issued_at' => 'datetime',
        'due_at' => 'datetime',
        'paid_at' => 'datetime',
        'payment_proof_uploaded_at' => 'datetime',
        'verified_at' => 'datetime',
        'metadata' => 'array',
    ];

    // Relations
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // Helpers
    public static function generateInvoiceNumber(): string
    {
        $year = date('Y');
        $lastInvoice = self::whereYear('created_at', $year)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($lastInvoice) {
            $lastNumber = (int) substr($lastInvoice->invoice_number, -5);
            $newNumber = str_pad($lastNumber + 1, 5, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '00001';
        }

        return "INV-{$year}-{$newNumber}";
    }

    public function calculateAmounts(): void
    {
        $this->vat_amount = round($this->amount * ($this->vat_percentage / 100), 2);
        $this->total_amount = round($this->amount + $this->vat_amount, 2);
    }

    public function markAsPaid(): void
    {
        $this->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);
    }

    public function markAsConfirmed(User $verifier, ?string $notes = null): void
    {
        $this->update([
            'status' => 'confirmed',
            'verified_by' => $verifier->id,
            'verified_at' => now(),
            'verification_notes' => $notes,
        ]);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    public function hasPaymentProof(): bool
    {
        return !empty($this->payment_proof_path);
    }
}
