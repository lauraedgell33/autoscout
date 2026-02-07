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
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // If sender is logged in
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message');
            $table->enum('request_type', ['inquiry', 'test-drive', 'offer', 'inspection'])->default('inquiry');
            $table->enum('status', ['new', 'read', 'replied', 'closed'])->default('new');
            $table->text('admin_notes')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['vehicle_id', 'status']);
            $table->index(['email']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
