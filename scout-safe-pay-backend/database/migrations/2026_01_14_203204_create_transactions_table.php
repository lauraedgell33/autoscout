<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_code')->unique();
            
            // Parties
            $table->foreignId('buyer_id')->constrained('users');
            $table->foreignId('seller_id')->constrained('users');
            $table->foreignId('dealer_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            
            // Financial
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('EUR');
            $table->decimal('service_fee', 10, 2)->default(0);
            $table->decimal('dealer_commission', 10, 2)->default(0);
            
            // Bank Transfer Details
            $table->string('escrow_account_iban')->comment('AutoScout24 dedicated account');
            $table->string('escrow_account_country', 2)->default('DE');
            $table->string('payment_reference')->unique()->comment('Unique reference for bank transfer');
            
            // Payment Proof
            $table->string('payment_proof_url')->nullable();
            $table->string('payment_proof_type')->nullable(); // 'screenshot', 'pdf', 'bank_statement'
            $table->timestamp('payment_proof_uploaded_at')->nullable();
            
            // Status
            $table->enum('status', [
                'pending',
                'awaiting_payment',
                'payment_submitted',
                'payment_verified',
                'inspection_scheduled',
                'inspection_passed',
                'inspection_failed',
                'ownership_transferred',
                'completed',
                'cancelled',
                'disputed',
                'refunded'
            ])->default('pending');
            
            // Verification
            $table->foreignId('payment_verified_by')->nullable()->constrained('users');
            $table->timestamp('payment_verified_at')->nullable();
            $table->text('verification_notes')->nullable();
            
            // Important Dates
            $table->timestamp('payment_confirmed_at')->nullable();
            $table->timestamp('inspection_date')->nullable();
            $table->timestamp('ownership_transfer_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            
            // Metadata
            $table->json('metadata')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['buyer_id', 'status']);
            $table->index(['seller_id', 'status']);
            $table->index(['dealer_id', 'status']);
            $table->index('transaction_code');
            $table->index('payment_reference');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
