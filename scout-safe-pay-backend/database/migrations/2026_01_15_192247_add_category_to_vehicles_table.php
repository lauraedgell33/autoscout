<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->enum('category', [
                'car',
                'motorcycle',
                'van',
                'truck',
                'trailer',
                'caravan',
                'motorhome',
                'construction_machinery',
                'agricultural_machinery',
                'forklift',
                'boat',
                'atv',
                'quad',
            ])->default('car')->after('seller_id');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
