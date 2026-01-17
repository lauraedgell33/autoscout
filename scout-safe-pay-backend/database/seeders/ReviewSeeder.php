<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\Transaction;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Get completed transactions
        $transactions = Transaction::where('status', 'completed')
            ->with(['buyer', 'seller', 'vehicle'])
            ->take(10)
            ->get();

        if ($transactions->isEmpty()) {
            $this->command->warn('No completed transactions found. Please complete some transactions first.');
            return;
        }

        $comments = [
            5 => [
                'Excellent transaction! Very professional and smooth process.',
                'Outstanding seller, highly recommend! Vehicle exactly as described.',
                'Perfect experience from start to finish. Would buy again!',
                'Amazing vehicle and great communication throughout.',
                'Superb service! The vehicle exceeded my expectations.',
            ],
            4 => [
                'Great experience overall, minor delay in delivery.',
                'Good transaction, vehicle as described. Recommend.',
                'Very satisfied with the purchase. Quick response.',
                'Smooth process, would do business again.',
                'Good seller, fair price, and reliable.',
            ],
            3 => [
                'Average experience. Vehicle okay but needs some work.',
                'Transaction was fine, nothing special.',
                'Decent seller, communication could be better.',
                'Vehicle condition acceptable, price was fair.',
            ],
            2 => [
                'Below expectations. Vehicle had some undisclosed issues.',
                'Communication was slow, vehicle not as described.',
                'Disappointed with the condition of the vehicle.',
            ],
            1 => [
                'Very poor experience. Would not recommend.',
                'Major issues with the vehicle not mentioned in listing.',
            ],
        ];

        $reviewCount = 0;

        foreach ($transactions as $transaction) {
            // Buyer reviews seller
            $buyerRating = collect([5, 5, 5, 4, 4, 4, 3, 2])->random();
            Review::create([
                'transaction_id' => $transaction->id,
                'reviewer_id' => $transaction->buyer_id,
                'reviewee_id' => $transaction->seller_id,
                'vehicle_id' => $transaction->vehicle_id,
                'rating' => $buyerRating,
                'comment' => collect($comments[$buyerRating])->random(),
                'review_type' => 'seller',
                'status' => 'approved',
            ]);
            $reviewCount++;

            // Seller reviews buyer
            $sellerRating = collect([5, 5, 4, 4, 4, 3])->random();
            Review::create([
                'transaction_id' => $transaction->id,
                'reviewer_id' => $transaction->seller_id,
                'reviewee_id' => $transaction->buyer_id,
                'vehicle_id' => $transaction->vehicle_id,
                'rating' => $sellerRating,
                'comment' => collect($comments[$sellerRating])->random(),
                'review_type' => 'buyer',
                'status' => 'approved',
            ]);
            $reviewCount++;

            // Sometimes add vehicle review
            if (rand(0, 1)) {
                $vehicleRating = collect([5, 5, 4, 4, 3])->random();
                Review::create([
                    'transaction_id' => $transaction->id,
                    'reviewer_id' => $transaction->buyer_id,
                    'reviewee_id' => $transaction->seller_id,
                    'vehicle_id' => $transaction->vehicle_id,
                    'rating' => $vehicleRating,
                    'comment' => collect($comments[$vehicleRating])->random(),
                    'review_type' => 'vehicle',
                    'status' => 'approved',
                ]);
                $reviewCount++;
            }
        }

        $this->command->info("Created {$reviewCount} reviews for " . $transactions->count() . ' transactions.');
    }
}
