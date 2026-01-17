<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Dealer extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'name',
        'company_name',
        'vat_number',
        'registration_number',
        'address',
        'city',
        'postal_code',
        'country',
        'phone',
        'email',
        'website',
        'type',
        'status',
        'max_active_listings',
        'bank_account_holder',
        'bank_iban',
        'bank_swift',
        'bank_name',
        'is_verified',
        'verified_at',
        'verified_by',
        'business_license_url',
        'tax_certificate_url',
        'logo_url',
        'autoscout_dealer_id',
        'autoscout_settings',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
        'autoscout_settings' => 'array',
        'bank_iban' => 'encrypted',
    ];

    protected $hidden = [
        'bank_iban',
        'bank_swift',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function bankAccounts(): MorphMany
    {
        return $this->morphMany(BankAccount::class, 'accountable');
    }

    public function primaryBankAccount()
    {
        return $this->morphOne(BankAccount::class, 'accountable')
            ->where('is_primary', true);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'company_name', 'email', 'status', 'is_verified'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Dealer {$eventName}")
            ->useLogName('dealer');
    }
}
