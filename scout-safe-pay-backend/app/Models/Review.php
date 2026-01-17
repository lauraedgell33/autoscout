<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'transaction_id',
        'reviewer_id',
        'reviewee_id',
        'vehicle_id',
        'rating',
        'comment',
        'review_type',
        'status',
        'admin_note',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'rating' => 'integer',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Scope to get approved reviews
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope to get reviews for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('reviewee_id', $userId);
    }

    /**
     * Scope to get reviews by a specific user
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('reviewer_id', $userId);
    }

    /**
     * Get average rating for a user
     */
    public static function getAverageRatingForUser($userId): float
    {
        return self::approved()
            ->forUser($userId)
            ->avg('rating') ?? 0.0;
    }

    /**
     * Get review count for a user
     */
    public static function getReviewCountForUser($userId): int
    {
        return self::approved()
            ->forUser($userId)
            ->count();
    }
}
