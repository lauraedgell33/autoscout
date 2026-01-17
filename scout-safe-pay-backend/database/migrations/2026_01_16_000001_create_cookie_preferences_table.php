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
        Schema::create('cookie_preferences', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->nullable();
            $table->string('session_id')->nullable()->index();
            $table->boolean('essential')->default(true);
            $table->boolean('functional')->default(false);
            $table->boolean('analytics')->default(false);
            $table->boolean('marketing')->default(false);
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('last_refreshed_at')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'expires_at']);
            $table->index(['session_id', 'expires_at']);
            $table->index(['expires_at', 'last_refreshed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cookie_preferences');
    }
};
