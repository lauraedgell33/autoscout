<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'iban' => 'encrypted',
    ];

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
