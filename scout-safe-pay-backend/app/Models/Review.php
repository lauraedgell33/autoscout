<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

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
        'verified',
        'verified_at',
        'verification_method',
        'moderation_status',
        'moderation_notes',
        'moderated_by',
        'moderated_at',
        'flagged',
        'flag_count',
        'helpful_count',
        'not_helpful_count',
    ];

    protected $casts = [
        'metadata' => 'array',
        'rating' => 'integer',
        'verified' => 'boolean',
        'verified_at' => 'datetime',
        'moderated_at' => 'datetime',
        'flagged' => 'boolean',
        'flag_count' => 'integer',
        'helpful_count' => 'integer',
        'not_helpful_count' => 'integer',
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

    public function flags()
    {
        return $this->hasMany(ReviewFlag::class);
    }

    public function helpfulVotes()
    {
        return $this->hasMany(ReviewHelpfulVote::class);
    }

    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    /**
     * Scope to get verified reviews
     */
    public function scopeVerified($query)
    {
        return $query->where('verified', true);
    }

    /**
     * Scope to get approved reviews
     */
    public function scopeApproved($query)
    {
        return $query->where('moderation_status', 'approved');
    }

    /**
     * Scope to get pending reviews
     */
    public function scopePending($query)
    {
        return $query->where('moderation_status', 'pending');
    }

    /**
     * Scope to get flagged reviews
     */
    public function scopeFlagged($query)
    {
        return $query->where('flagged', true);
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
