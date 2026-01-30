<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // Verification fields
            $table->boolean('verified')->default(false)->after('status');
            $table->timestamp('verified_at')->nullable()->after('verified');
            $table->enum('verification_method', ['transaction', 'manual', 'automated', 'none'])->default('none')->after('verified_at');
            
            // Moderation fields
            $table->enum('moderation_status', ['pending', 'approved', 'rejected', 'flagged'])->default('pending')->after('verification_method');
            $table->text('moderation_notes')->nullable()->after('moderation_status');
            $table->foreignId('moderated_by')->nullable()->constrained('users')->onDelete('set null')->after('moderation_notes');
            $table->timestamp('moderated_at')->nullable()->after('moderated_by');
            
            // Flagging and helpfulness
            $table->boolean('flagged')->default(false)->after('moderated_at');
            $table->integer('flag_count')->default(0)->after('flagged');
            $table->integer('helpful_count')->default(0)->after('flag_count');
            $table->integer('not_helpful_count')->default(0)->after('helpful_count');
            
            // Indexes
            $table->index('verified');
            $table->index('verification_method');
            $table->index('moderation_status');
            $table->index('flagged');
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['moderated_by']);
            $table->dropIndex(['verified']);
            $table->dropIndex(['verification_method']);
            $table->dropIndex(['moderation_status']);
            $table->dropIndex(['flagged']);
            $table->dropColumn([
                'verified',
                'verified_at',
                'verification_method',
                'moderation_status',
                'moderation_notes',
                'moderated_by',
                'moderated_at',
                'flagged',
                'flag_count',
                'helpful_count',
                'not_helpful_count',
            ]);
        });
    }
};
