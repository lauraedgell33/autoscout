<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserConsent extends Model
{
    protected $fillable = [
        'user_id',
        'legal_document_id',
        'accepted',
        'ip_address',
        'user_agent',
        'accepted_at',
        'revoked_at',
    ];

    protected $casts = [
        'accepted' => 'boolean',
        'accepted_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function legalDocument(): BelongsTo
    {
        return $this->belongsTo(LegalDocument::class);
    }

    public function isActive(): bool
    {
        return $this->accepted && is_null($this->revoked_at);
    }
}
