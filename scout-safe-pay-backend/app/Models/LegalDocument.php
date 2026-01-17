<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LegalDocument extends Model
{
    protected $fillable = [
        'type',
        'version',
        'language',
        'title',
        'content',
        'is_active',
        'effective_date',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'effective_date' => 'datetime',
    ];

    const TYPE_TERMS_OF_SERVICE = 'terms_of_service';
    const TYPE_PRIVACY_POLICY = 'privacy_policy';
    const TYPE_COOKIE_POLICY = 'cookie_policy';
    const TYPE_PURCHASE_AGREEMENT = 'purchase_agreement';
    const TYPE_REFUND_POLICY = 'refund_policy';

    public function consents(): HasMany
    {
        return $this->hasMany(UserConsent::class);
    }

    public static function getActiveDocument(string $type, string $language = 'en'): ?self
    {
        return self::where('type', $type)
            ->where('language', $language)
            ->where('is_active', true)
            ->latest('effective_date')
            ->first();
    }
}
