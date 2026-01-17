<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // User Type & Role
            $table->enum('user_type', ['super_admin', 'admin', 'dealer', 'seller', 'buyer'])->default('buyer')->after('password');
            $table->foreignId('dealer_id')->nullable()->constrained()->onDelete('cascade')->after('user_type');
            
            // Contact Info
            $table->string('phone')->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->string('city')->nullable()->after('address');
            $table->string('postal_code')->nullable()->after('city');
            $table->string('country', 2)->default('DE')->after('postal_code');
            
            // Verification
            $table->boolean('is_verified')->default(false)->after('country');
            $table->enum('kyc_status', ['pending', 'in_review', 'verified', 'rejected'])->default('pending')->after('is_verified');
            $table->timestamp('kyc_verified_at')->nullable()->after('kyc_status');
            $table->foreignId('kyc_verified_by')->nullable()->constrained('users')->after('kyc_verified_at');
            
            // Profile
            $table->string('avatar_url')->nullable()->after('kyc_verified_by');
            $table->string('locale', 5)->default('en')->after('avatar_url');
            $table->string('timezone')->default('Europe/Berlin')->after('locale');
            
            // Activity
            $table->timestamp('last_login_at')->nullable()->after('timezone');
            $table->string('last_login_ip')->nullable()->after('last_login_at');
            
            $table->index(['user_type', 'dealer_id']);
            $table->index('is_verified');
            $table->index('kyc_status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['dealer_id']);
            $table->dropForeign(['kyc_verified_by']);
            $table->dropColumn([
                'user_type', 'dealer_id', 'phone', 'address', 'city', 'postal_code', 'country',
                'is_verified', 'kyc_status', 'kyc_verified_at', 'kyc_verified_by',
                'avatar_url', 'locale', 'timezone', 'last_login_at', 'last_login_ip'
            ]);
        });
    }
};
