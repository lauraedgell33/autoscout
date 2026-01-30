<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Message extends Model
{
    use SoftDeletes, Searchable;

    protected $fillable = [
        'transaction_id',
        'sender_id',
        'receiver_id',
        'message',
        'attachments',
        'is_read',
        'read_at',
        'is_system_message',
        'metadata',
    ];

    protected $casts = [
        'attachments' => 'array',
        'metadata' => 'array',
        'is_read' => 'boolean',
        'is_system_message' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /**
     * Mark message as read
     */
    public function markAsRead(): void
    {
        if (!$this->is_read) {
            $this->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }
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
            'message' => $this->message,
            'transaction_id' => $this->transaction_id,
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'is_system_message' => $this->is_system_message,
            'created_at' => $this->created_at?->timestamp,
        ];
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return !$this->trashed();
    }

    /**
     * Check if message belongs to user
     */
    public function belongsToUser(int $userId): bool
    {
        return $this->sender_id === $userId || $this->receiver_id === $userId;
    }
}

