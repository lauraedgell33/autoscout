<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->morphs('accountable'); // Can belong to User or Dealer
            $table->string('account_holder_name');
            $table->text('iban'); // Encrypted
            $table->string('swift_bic')->nullable();
            $table->string('bank_name');
            $table->string('bank_country', 2)->default('DE');
            $table->string('currency', 3)->default('EUR');
            
            // Verification
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_primary')->default(false);
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            $table->text('verification_notes')->nullable();
            
            // Documents
            $table->string('bank_statement_url')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('is_verified');
            $table->index('is_primary');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_accounts');
    }
};
