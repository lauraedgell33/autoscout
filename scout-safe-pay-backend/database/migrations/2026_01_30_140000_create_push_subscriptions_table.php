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
        Schema::create('push_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Push subscription endpoint (unique per device/browser)
            $table->string('endpoint')->unique();
            
            // Encryption keys for push messages
            $table->string('p256dh');  // public key
            $table->string('auth');    // authentication secret
            
            // Device metadata
            $table->string('user_agent')->nullable();
            $table->string('device_name')->nullable();
            $table->string('browser_name')->nullable();
            $table->ipAddress('ip_address')->nullable();
            
            // Status tracking
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_used_at')->nullable();
            $table->integer('failed_attempts')->default(0);
            $table->timestamp('failed_at')->nullable();
            
            $table->timestamps();
            
            // Compound index for fast lookup
            $table->index(['user_id', 'is_active']);
            $table->index('endpoint');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('push_subscriptions');
    }
};
