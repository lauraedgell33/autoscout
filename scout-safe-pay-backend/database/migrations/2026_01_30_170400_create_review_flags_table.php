<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('review_flags', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys
            $table->foreignId('review_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Flag details
            $table->enum('reason', ['spam', 'inappropriate', 'fake', 'offensive', 'misleading', 'other'])->default('other');
            $table->text('details')->nullable();
            $table->string('ip_address', 45)->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('review_id');
            $table->index('user_id');
            $table->index('reason');
            
            // Unique constraint: one flag per user per review
            $table->unique(['review_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_flags');
    }
};
