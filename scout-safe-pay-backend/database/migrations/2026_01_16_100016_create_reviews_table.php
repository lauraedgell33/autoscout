<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reviewee_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('vehicle_id')->nullable()->constrained()->onDelete('set null');
            
            // Review content
            $table->enum('rating', ['1', '2', '3', '4', '5']); // 1-5 stars
            $table->text('comment')->nullable();
            $table->enum('review_type', ['buyer', 'seller', 'vehicle'])->default('seller');
            
            // Status
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');
            $table->text('admin_note')->nullable();
            
            // Metadata
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('transaction_id');
            $table->index('reviewer_id');
            $table->index('reviewee_id');
            $table->index('vehicle_id');
            $table->index('rating');
            $table->index('status');
            
            // Unique constraint: one review per transaction per reviewer
            $table->unique(['transaction_id', 'reviewer_id', 'review_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
