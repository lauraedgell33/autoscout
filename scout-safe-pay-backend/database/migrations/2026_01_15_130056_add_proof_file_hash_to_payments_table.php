<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('proof_file_hash', 64)->nullable()->after('payment_proof_url');
            $table->timestamp('payment_date')->nullable()->after('proof_file_hash');
            $table->index('proof_file_hash');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['proof_file_hash']);
            $table->dropColumn(['proof_file_hash', 'payment_date']);
        });
    }
};
