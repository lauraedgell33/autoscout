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
        Schema::create('legal_documents', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // terms_of_service, privacy_policy, cookie_policy, purchase_agreement, refund_policy
            $table->string('version');
            $table->string('language', 5)->default('en');
            $table->text('title');
            $table->longText('content');
            $table->boolean('is_active')->default(false);
            $table->timestamp('effective_date')->nullable();
            $table->timestamps();
            
            $table->unique(['type', 'version', 'language']);
            $table->index(['type', 'is_active', 'language']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legal_documents');
    }
};
