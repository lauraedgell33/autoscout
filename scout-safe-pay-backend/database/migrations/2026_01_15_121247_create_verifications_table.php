<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['identity', 'phone', 'address', 'vehicle_vin', 'dealer_business'])->index();
            $table->enum('status', ['pending', 'in_review', 'approved', 'rejected'])->default('pending')->index();
            
            // Verification data (JSON for flexibility)
            $table->json('submitted_data')->nullable();
            $table->json('verification_result')->nullable();
            
            // Document references
            $table->json('document_ids')->nullable(); // References to uploaded documents
            
            // KYC specific fields
            $table->string('document_type')->nullable(); // passport, id_card, driver_license
            $table->string('document_number')->nullable();
            $table->date('document_expiry')->nullable();
            
            // Vehicle VIN specific
            $table->foreignId('vehicle_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('vin_number')->nullable();
            $table->json('vin_check_result')->nullable();
            
            // Review information
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->text('rejection_reason')->nullable();
            
            // Expiry (for documents that expire)
            $table->timestamp('expires_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['user_id', 'type', 'status']);
            $table->index('vehicle_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verifications');
    }
};
