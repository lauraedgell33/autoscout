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
            // GDPR Consent tracking
            $table->boolean('marketing_consent')->default(false)->after('remember_token');
            $table->boolean('data_sharing_consent')->default(false)->after('marketing_consent');
            $table->timestamp('consent_updated_at')->nullable()->after('data_sharing_consent');
            
            // Account deletion (Right to Erasure)
            $table->timestamp('deletion_requested_at')->nullable()->after('consent_updated_at');
            $table->text('deletion_reason')->nullable()->after('deletion_requested_at');
            $table->timestamp('deletion_scheduled_at')->nullable()->after('deletion_reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'marketing_consent',
                'data_sharing_consent',
                'consent_updated_at',
                'deletion_requested_at',
                'deletion_reason',
                'deletion_scheduled_at',
            ]);
        });
    }
};
