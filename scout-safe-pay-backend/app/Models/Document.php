<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'transaction_id',
        'uploaded_by',
        'type',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'is_verified',
        'verified_by',
        'verified_at',
        'verification_notes',
        'description',
        'metadata',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
        'metadata' => 'array',
        'file_size' => 'integer',
    ];

    const TYPE_VEHICLE_REGISTRATION = 'vehicle_registration';
    const TYPE_INSURANCE_CERTIFICATE = 'insurance_certificate';
    const TYPE_INSPECTION_REPORT = 'inspection_report';
    const TYPE_IDENTITY_PROOF = 'identity_proof';
    const TYPE_BANK_STATEMENT = 'bank_statement';
    const TYPE_PAYMENT_PROOF = 'payment_proof';
    const TYPE_OWNERSHIP_CERTIFICATE = 'ownership_certificate';
    const TYPE_SALES_CONTRACT = 'sales_contract';
    const TYPE_OTHER = 'other';

    public static function getTypes(): array
    {
        return [
            self::TYPE_VEHICLE_REGISTRATION => 'Vehicle Registration',
            self::TYPE_INSURANCE_CERTIFICATE => 'Insurance Certificate',
            self::TYPE_INSPECTION_REPORT => 'Inspection Report',
            self::TYPE_IDENTITY_PROOF => 'Identity Proof',
            self::TYPE_BANK_STATEMENT => 'Bank Statement',
            self::TYPE_PAYMENT_PROOF => 'Payment Proof',
            self::TYPE_OWNERSHIP_CERTIFICATE => 'Ownership Certificate',
            self::TYPE_SALES_CONTRACT => 'Sales Contract',
            self::TYPE_OTHER => 'Other',
        ];
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function verify(User $verifier, ?string $notes = null): void
    {
        $this->update([
            'is_verified' => true,
            'verified_by' => $verifier->id,
            'verified_at' => now(),
            'verification_notes' => $notes,
        ]);
    }

    public function getFileSizeForHumans(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
