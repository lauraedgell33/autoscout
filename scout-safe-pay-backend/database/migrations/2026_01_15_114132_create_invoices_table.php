<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            
            // Relations
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            
            // Invoice Details
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('EUR');
            $table->decimal('vat_percentage', 5, 2)->default(19.00);
            $table->decimal('vat_amount', 12, 2);
            $table->decimal('total_amount', 12, 2);
            
            // Status
            $table->enum('status', ['pending', 'paid', 'confirmed', 'cancelled'])->default('pending');
            $table->timestamp('issued_at');
            $table->timestamp('due_at');
            $table->timestamp('paid_at')->nullable();
            
            // Bank Transfer Details
            $table->string('bank_name')->default('Deutsche Bank');
            $table->string('bank_iban')->default('DE89370400440532013000');
            $table->string('bank_bic')->default('COBADEFFXXX');
            $table->string('bank_account_holder')->default('AutoScout24 GmbH');
            
            // Payment Proof
            $table->string('payment_proof_path')->nullable();
            $table->timestamp('payment_proof_uploaded_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            $table->text('verification_notes')->nullable();
            
            // Additional Info
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('invoice_number');
            $table->index('status');
            $table->index(['buyer_id', 'created_at']);
            $table->index(['seller_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
