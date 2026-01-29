<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Check and add columns only if they don't exist
            if (!Schema::hasColumn('transactions', 'contract_url')) {
                $table->string('contract_url')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'signed_contract_url')) {
                $table->string('signed_contract_url')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'contract_generated_at')) {
                $table->timestamp('contract_generated_at')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'contract_signed_at')) {
                $table->timestamp('contract_signed_at')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'signature_type')) {
                $table->string('signature_type')->nullable();
            }
            
            // Bank transfer fields
            if (!Schema::hasColumn('transactions', 'bank_account_iban')) {
                $table->string('bank_account_iban')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'bank_account_holder')) {
                $table->string('bank_account_holder')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'bank_name')) {
                $table->string('bank_name')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'payment_reference')) {
                $table->string('payment_reference')->unique()->nullable();
            }
            if (!Schema::hasColumn('transactions', 'payment_deadline')) {
                $table->timestamp('payment_deadline')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'payment_proof_url')) {
                $table->string('payment_proof_url')->nullable();
            }
            
            // Invoice fields
            if (!Schema::hasColumn('transactions', 'invoice_number')) {
                $table->string('invoice_number')->unique()->nullable();
            }
            if (!Schema::hasColumn('transactions', 'invoice_url')) {
                $table->string('invoice_url')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'invoice_issued_at')) {
                $table->timestamp('invoice_issued_at')->nullable();
            }
            
            // Delivery fields
            if (!Schema::hasColumn('transactions', 'delivery_date')) {
                $table->timestamp('delivery_date')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'delivery_address')) {
                $table->text('delivery_address')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'delivery_contact')) {
                $table->string('delivery_contact')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'delivered_at')) {
                $table->timestamp('delivered_at')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'contract_url',
                'signed_contract_url',
                'contract_generated_at',
                'contract_signed_at',
                'signature_type',
                'bank_account_iban',
                'bank_account_holder',
                'bank_name',
                'payment_reference',
                'payment_deadline',
                'payment_proof_url',
                'invoice_number',
                'invoice_url',
                'invoice_issued_at',
                'delivery_date',
                'delivery_address',
                'delivery_contact',
                'delivered_at',
            ]);
        });

        // Restore old status enum
        DB::statement("ALTER TABLE transactions MODIFY COLUMN status ENUM(
            'pending',
            'awaiting_payment',
            'payment_submitted',
            'payment_verified',
            'inspection_scheduled',
            'inspection_passed',
            'inspection_failed',
            'ownership_transferred',
            'completed',
            'cancelled',
            'disputed',
            'refunded'
        ) DEFAULT 'pending'");
    }
};
