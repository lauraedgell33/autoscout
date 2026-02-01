<?php

namespace App\Models;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Crypt;

class BankAccount extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'accountable_type',
        'accountable_id',
        'account_holder_name',
        'iban',
        'swift_bic',
        'bank_name',
        'bank_country',
        'currency',
        'is_verified',
        'is_primary',
        'verified_by',
        'verified_at',
        'verification_notes',
        'bank_statement_url',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_primary' => 'boolean',
        'verified_at' => 'datetime',
        // Note: iban encryption is handled by the accessor below
    ];

    /**
     * Get the IBAN attribute with safe decryption.
     */
    protected function iban(): Attribute
    {
        return Attribute::make(
            get: function (?string $value) {
                if ($value === null) {
                    return null;
                }
                try {
                    return Crypt::decryptString($value);
                } catch (DecryptException $e) {
                    // Return masked value if decryption fails (wrong APP_KEY)
                    return '****' . substr($value, -4);
                }
            },
            set: function (?string $value) {
                if ($value === null) {
                    return null;
                }
                // Don't re-encrypt if already encrypted
                if (str_starts_with($value, 'eyJ')) {
                    return $value;
                }
                return Crypt::encryptString($value);
            },
        );
    }

    protected $hidden = [
        'iban',
    ];

    public function accountable(): MorphTo
    {
        return $this->morphTo();
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
