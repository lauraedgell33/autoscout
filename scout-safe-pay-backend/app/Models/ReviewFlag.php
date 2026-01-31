<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewFlag extends Model
{
    use HasFactory;
    protected $fillable = [
        'review_id',
        'user_id',
        'reason',
        'details',
        'ip_address',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the review that was flagged
     */
    public function review(): BelongsTo
    {
        return $this->belongsTo(Review::class);
    }

    /**
     * Get the user who flagged the review
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
