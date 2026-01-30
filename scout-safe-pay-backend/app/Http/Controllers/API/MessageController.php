<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Transaction;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Get all conversations for authenticated user
     */
    public function conversations(Request $request)
    {
        $userId = auth()->id();
        
        // Get unique transaction IDs where user has messages
        $conversations = Message::where(function($query) use ($userId) {
                $query->where('sender_id', $userId)
                      ->orWhere('receiver_id', $userId);
            })
            ->with(['transaction.vehicle', 'sender', 'receiver'])
            ->select('transaction_id')
            ->selectRaw('MAX(created_at) as last_message_at')
            ->selectRaw('COUNT(CASE WHEN is_read = 0 AND receiver_id = ? THEN 1 END) as unread_count', [$userId])
            ->groupBy('transaction_id')
            ->orderBy('last_message_at', 'desc')
            ->get();

        // Get full conversation details
        $conversationsData = $conversations->map(function($conv) use ($userId) {
            $transaction = Transaction::with(['vehicle', 'buyer', 'seller'])->find($conv->transaction_id);
            
            if (!$transaction) {
                return null;
            }

            // Determine the other party
            $otherParty = $transaction->buyer_id === $userId 
                ? $transaction->seller 
                : $transaction->buyer;

            // Get last message
            $lastMessage = Message::where('transaction_id', $conv->transaction_id)
                ->where(function($query) use ($userId) {
                    $query->where('sender_id', $userId)
                          ->orWhere('receiver_id', $userId);
                })
                ->latest()
                ->first();

            return [
                'transaction_id' => $transaction->id,
                'transaction' => [
                    'id' => $transaction->id,
                    'amount' => $transaction->amount,
                    'status' => $transaction->status,
                    'vehicle' => [
                        'id' => $transaction->vehicle->id,
                        'make' => $transaction->vehicle->make,
                        'model' => $transaction->vehicle->model,
                        'year' => $transaction->vehicle->year,
                        'primary_image' => $transaction->vehicle->primary_image,
                    ],
                ],
                'other_party' => [
                    'id' => $otherParty->id,
                    'name' => $otherParty->name,
                    'email' => $otherParty->email,
                ],
                'last_message' => $lastMessage ? [
                    'message' => $lastMessage->message,
                    'created_at' => $lastMessage->created_at,
                    'is_from_me' => $lastMessage->sender_id === $userId,
                ] : null,
                'unread_count' => $conv->unread_count,
            ];
        })->filter();

        return response()->json([
            'conversations' => $conversationsData->values()
        ]);
    }

    /**
     * Get messages for a specific transaction
     */
    public function index(Request $request, $transactionId)
    {
        $userId = auth()->id();
        
        // Verify user is part of the transaction
        $transaction = Transaction::findOrFail($transactionId);
        
        if ($transaction->buyer_id !== $userId && $transaction->seller_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get messages
        $messages = Message::where('transaction_id', $transactionId)
            ->with(['sender:id,name,email', 'receiver:id,name,email'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function($message) use ($userId) {
                return [
                    'id' => $message->id,
                    'transaction_id' => $message->transaction_id,
                    'sender' => [
                        'id' => $message->sender->id,
                        'name' => $message->sender->name,
                        'email' => $message->sender->email,
                    ],
                    'receiver' => [
                        'id' => $message->receiver->id,
                        'name' => $message->receiver->name,
                        'email' => $message->receiver->email,
                    ],
                    'message' => $message->message,
                    'attachments' => $message->attachments,
                    'is_read' => $message->is_read,
                    'read_at' => $message->read_at,
                    'is_system_message' => $message->is_system_message,
                    'is_from_me' => $message->sender_id === $userId,
                    'created_at' => $message->created_at,
                    'updated_at' => $message->updated_at,
                ];
            });

        // Mark unread messages as read
        Message::where('transaction_id', $transactionId)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'messages' => $messages,
            'transaction' => [
                'id' => $transaction->id,
                'amount' => $transaction->amount,
                'status' => $transaction->status,
                'buyer' => [
                    'id' => $transaction->buyer->id,
                    'name' => $transaction->buyer->name,
                ],
                'seller' => [
                    'id' => $transaction->seller->id,
                    'name' => $transaction->seller->name,
                ],
                'vehicle' => [
                    'id' => $transaction->vehicle->id,
                    'make' => $transaction->vehicle->make,
                    'model' => $transaction->vehicle->model,
                    'year' => $transaction->vehicle->year,
                ],
            ],
        ]);
    }

    /**
     * Send a new message
     */
    public function store(Request $request, $transactionId)
    {
        $userId = auth()->id();
        
        // Verify transaction exists and user is part of it
        $transaction = Transaction::findOrFail($transactionId);
        
        if ($transaction->buyer_id !== $userId && $transaction->seller_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:5000',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'string|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Determine receiver
        $receiverId = $transaction->buyer_id === $userId 
            ? $transaction->seller_id 
            : $transaction->buyer_id;

        // Create message
        $message = Message::create([
            'transaction_id' => $transactionId,
            'sender_id' => $userId,
            'receiver_id' => $receiverId,
            'message' => $request->message,
            'attachments' => $request->attachments,
            'is_system_message' => false,
        ]);

        // Send email notification to receiver
        $receiver = $message->receiver;
        EmailNotificationService::sendNewMessageNotification($receiver, $message);

        // Load relationships
        $message->load(['sender:id,name,email', 'receiver:id,name,email']);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => [
                'id' => $message->id,
                'transaction_id' => $message->transaction_id,
                'sender' => [
                    'id' => $message->sender->id,
                    'name' => $message->sender->name,
                    'email' => $message->sender->email,
                ],
                'receiver' => [
                    'id' => $message->receiver->id,
                    'name' => $message->receiver->name,
                    'email' => $message->receiver->email,
                ],
                'message' => $message->message,
                'attachments' => $message->attachments,
                'is_read' => $message->is_read,
                'is_system_message' => $message->is_system_message,
                'is_from_me' => true,
                'created_at' => $message->created_at,
            ],
        ], 201);
    }

    /**
     * Mark message as read
     */
    public function markAsRead($transactionId, $messageId)
    {
        $userId = auth()->id();
        
        $message = Message::where('transaction_id', $transactionId)
            ->where('id', $messageId)
            ->firstOrFail();

        // Only receiver can mark as read
        if ($message->receiver_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message->markAsRead();

        return response()->json([
            'message' => 'Message marked as read',
        ]);
    }

    /**
     * Mark all messages in a conversation as read
     */
    public function markAllAsRead($transactionId)
    {
        $userId = auth()->id();
        
        // Verify user is part of transaction
        $transaction = Transaction::findOrFail($transactionId);
        
        if ($transaction->buyer_id !== $userId && $transaction->seller_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Mark all unread messages as read
        $updated = Message::where('transaction_id', $transactionId)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'All messages marked as read',
            'count' => $updated,
        ]);
    }

    /**
     * Get unread message count
     */
    public function unreadCount()
    {
        $userId = auth()->id();
        
        $count = Message::where('receiver_id', $userId)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'unread_count' => $count,
        ]);
    }

    /**
     * Delete a message (soft delete)
     */
    public function destroy($transactionId, $messageId)
    {
        $userId = auth()->id();
        
        $message = Message::where('transaction_id', $transactionId)
            ->where('id', $messageId)
            ->firstOrFail();

        // Only sender can delete their own messages
        if ($message->sender_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully',
        ]);
    }
}
