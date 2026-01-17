<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        // Get some transactions
        $transactions = Transaction::with(['buyer', 'seller'])->take(5)->get();

        if ($transactions->isEmpty()) {
            $this->command->warn('No transactions found. Please seed transactions first.');
            return;
        }

        foreach ($transactions as $transaction) {
            // Create conversation between buyer and seller
            $messages = [
                [
                    'sender' => $transaction->buyer_id,
                    'receiver' => $transaction->seller_id,
                    'message' => 'Hi, I\'m interested in purchasing this vehicle. Is it still available?',
                    'created_at' => now()->subDays(2),
                ],
                [
                    'sender' => $transaction->seller_id,
                    'receiver' => $transaction->buyer_id,
                    'message' => 'Yes, the vehicle is still available! Would you like to schedule a viewing?',
                    'created_at' => now()->subDays(2)->addHours(1),
                ],
                [
                    'sender' => $transaction->buyer_id,
                    'receiver' => $transaction->seller_id,
                    'message' => 'That would be great! Are you available this weekend?',
                    'created_at' => now()->subDays(1),
                ],
                [
                    'sender' => $transaction->seller_id,
                    'receiver' => $transaction->buyer_id,
                    'message' => 'Yes, Saturday afternoon works for me. Shall we say 2 PM?',
                    'created_at' => now()->subDays(1)->addHours(2),
                    'is_read' => false,
                ],
            ];

            foreach ($messages as $messageData) {
                Message::create([
                    'transaction_id' => $transaction->id,
                    'sender_id' => $messageData['sender'],
                    'receiver_id' => $messageData['receiver'],
                    'message' => $messageData['message'],
                    'is_read' => $messageData['is_read'] ?? true,
                    'read_at' => isset($messageData['is_read']) && !$messageData['is_read'] ? null : now(),
                    'created_at' => $messageData['created_at'],
                    'updated_at' => $messageData['created_at'],
                ]);
            }
        }

        $this->command->info('Created messages for ' . $transactions->count() . ' transactions.');
    }
}
