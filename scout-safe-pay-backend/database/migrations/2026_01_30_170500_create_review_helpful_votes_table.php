<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('review_helpful_votes', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys
            $table->foreignId('review_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Vote type
            $table->boolean('is_helpful');
            
            $table->timestamps();
            
            // Indexes
            $table->index('review_id');
            $table->index('user_id');
            $table->index('is_helpful');
            
            // Unique constraint: one vote per user per review
            $table->unique(['review_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_helpful_votes');
    }
};
