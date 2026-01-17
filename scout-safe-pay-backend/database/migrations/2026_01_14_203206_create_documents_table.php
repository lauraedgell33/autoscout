<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade');
            $table->foreignId('uploaded_by')->constrained('users');
            
            // Document Info
            $table->enum('type', [
                'vehicle_registration',
                'insurance_certificate',
                'inspection_report',
                'identity_proof',
                'bank_statement',
                'payment_proof',
                'ownership_certificate',
                'sales_contract',
                'other'
            ]);
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_type')->nullable();
            $table->integer('file_size')->nullable();
            
            // Verification
            $table->boolean('is_verified')->default(false);
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            $table->text('verification_notes')->nullable();
            
            // Metadata
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['transaction_id', 'type']);
            $table->index('uploaded_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
