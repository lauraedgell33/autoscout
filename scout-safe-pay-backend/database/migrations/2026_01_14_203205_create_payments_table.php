<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained();
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('EUR');
            
            // Type
            $table->enum('type', [
                'deposit',          // Buyer deposits to escrow
                'release',          // Release to seller
                'refund',           // Refund to buyer
                'service_fee',      // AutoScout24 service fee
                'dealer_commission' // Dealer commission
            ])->default('deposit');
            
            // Bank Transfer Details
            $table->string('bank_transfer_reference')->nullable();
            $table->string('payment_proof_url')->nullable();
            $table->text('bank_transaction_details')->nullable(); // JSON with bank response
            
            // Status
            $table->enum('status', [
                'pending',
                'submitted',
                'in_review',
                'verified',
                'rejected',
                'completed',
                'failed'
            ])->default('pending');
            
            // Verification
            $table->foreignId('verified_by_admin_id')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->string('rejection_reason')->nullable();
            
            // Processing
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            // Metadata
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('transaction_id');
            $table->index('user_id');
            $table->index(['status', 'type']);
            $table->index('bank_transfer_reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
