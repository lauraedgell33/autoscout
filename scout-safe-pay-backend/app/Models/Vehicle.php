<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;

class Vehicle extends Model
{
    use SoftDeletes, Searchable, HasFactory;

    protected $fillable = [
        'dealer_id',
        'seller_id',
        'category',
        'make',
        'model',
        'year',
        'vin',
        'price',
        'currency',
        'description',
        'mileage',
        'fuel_type',
        'transmission',
        'color',
        'doors',
        'seats',
        'body_type',
        'engine_size',
        'power_hp',
        'location_city',
        'location_country',
        'latitude',
        'longitude',
        'status',
        'autoscout_listing_id',
        'autoscout_data',
        'images',
        'primary_image',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'autoscout_data' => 'array',
        'images' => 'array',
    ];

    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function categoryRelation(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
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
            'make' => $this->make,
            'model' => $this->model,
            'year' => $this->year,
            'description' => $this->description,
            'category' => $this->category,
            'fuel_type' => $this->fuel_type,
            'transmission' => $this->transmission,
            'body_type' => $this->body_type,
            'location_city' => $this->location_city,
            'location_country' => $this->location_country,
            'status' => $this->status,
            'price' => (float) $this->price,
            'mileage' => $this->mileage,
        ];
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return $this->status === 'active';
    }
}

