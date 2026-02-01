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
        Schema::table('users', function (Blueprint $table) {
            $table->string('id_document_type')->nullable()->after('kyc_verified_by');
            $table->string('id_document_number')->nullable()->after('id_document_type');
            $table->string('id_document_image')->nullable()->after('id_document_number');
            $table->string('selfie_image')->nullable()->after('id_document_image');
            $table->timestamp('kyc_submitted_at')->nullable()->after('selfie_image');
            $table->date('date_of_birth')->nullable()->after('kyc_submitted_at');
            $table->string('street')->nullable()->after('address');
            $table->string('house_number')->nullable()->after('street');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'id_document_type',
                'id_document_number',
                'id_document_image',
                'selfie_image',
                'kyc_submitted_at',
                'date_of_birth',
                'street',
                'house_number',
            ]);
        });
    }
};
