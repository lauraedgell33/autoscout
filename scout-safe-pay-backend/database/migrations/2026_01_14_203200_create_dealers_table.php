<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dealers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company_name');
            $table->string('vat_number')->unique();
            $table->string('registration_number')->unique();
            $table->text('address');
            $table->string('city');
            $table->string('postal_code');
            $table->string('country', 2)->default('DE');
            $table->string('phone');
            $table->string('email')->unique();
            $table->string('website')->nullable();
            
            // Business Details
            $table->enum('type', ['independent', 'franchise', 'manufacturer'])->default('independent');
            $table->enum('status', ['pending', 'active', 'suspended', 'inactive'])->default('pending');
            $table->integer('max_active_listings')->default(50);
            
            // Bank Account (encrypted)
            $table->text('bank_account_holder')->nullable();
            $table->text('bank_iban')->nullable(); // Will be encrypted
            $table->text('bank_swift')->nullable();
            $table->text('bank_name')->nullable();
            
            // Verification
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users');
            
            // Documents
            $table->string('business_license_url')->nullable();
            $table->string('tax_certificate_url')->nullable();
            $table->string('logo_url')->nullable();
            
            // AutoScout24 Integration
            $table->string('autoscout_dealer_id')->nullable()->unique();
            $table->json('autoscout_settings')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'is_verified']);
            $table->index('country');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dealers');
    }
};
