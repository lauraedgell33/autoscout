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
        // Note: 'images' cast removed - handled by custom accessor to ensure proper formatting
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

    /**
     * Get the images with /storage/ prefix for API responses
     * Ensures image paths are properly formatted for frontend consumption
     */
    protected function images(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: function ($value) {
                if (!$value) {
                    return [];
                }
                // Handle both JSON string (raw from DB) and already-decoded array
                $arr = is_string($value) ? json_decode($value, true) : $value;
                if (!is_array($arr)) {
                    return [];
                }
                return array_map(fn($path) => $this->formatImagePath($path), $arr);
            }
        );
    }

    /**
     * Get the primary image with /storage/ prefix for API responses
     */
    protected function primaryImage(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn($value) => $value ? $this->formatImagePath($value) : null
        );
    }

    /**
     * Format image path to include /storage/ prefix if needed
     */
    private function formatImagePath(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        // If already a full URL, return as is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // If already starts with /storage/, return as is
        if (str_starts_with($path, '/storage/')) {
            return $path;
        }

        // Otherwise prepend /storage/
        return '/storage/' . $path;
    }
}

