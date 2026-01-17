<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->string('dispute_code')->unique();
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade');
            $table->foreignId('raised_by_user_id')->constrained('users');
            
            // Dispute Info
            $table->enum('type', [
                'payment_not_received',
                'vehicle_condition',
                'missing_documents',
                'fraudulent_listing',
                'other'
            ]);
            $table->string('reason');
            $table->text('description');
            
            // Status
            $table->enum('status', [
                'open',
                'in_review',
                'investigating',
                'awaiting_response',
                'resolved',
                'closed',
                'escalated'
            ])->default('open');
            
            // Resolution
            $table->text('resolution')->nullable();
            $table->enum('resolution_type', [
                'refund_buyer',
                'release_seller',
                'partial_refund',
                'relist_vehicle',
                'dismissed'
            ])->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users');
            $table->timestamp('resolved_at')->nullable();
            
            // Parties Response
            $table->text('seller_response')->nullable();
            $table->text('buyer_response')->nullable();
            $table->text('admin_notes')->nullable();
            
            // Evidence
            $table->json('evidence_urls')->nullable();
            
            // Metadata
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('transaction_id');
            $table->index('raised_by_user_id');
            $table->index('dispute_code');
            $table->index(['status', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disputes');
    }
};
