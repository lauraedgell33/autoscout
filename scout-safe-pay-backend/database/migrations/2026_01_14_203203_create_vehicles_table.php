<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dealer_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            
            // Basic Info
            $table->string('make');
            $table->string('model');
            $table->integer('year');
            $table->string('vin')->unique()->nullable();
            $table->decimal('price', 10, 2);
            $table->string('currency', 3)->default('EUR');
            
            // Details
            $table->text('description')->nullable();
            $table->integer('mileage')->nullable();
            $table->string('fuel_type')->nullable();
            $table->string('transmission')->nullable();
            $table->string('color')->nullable();
            $table->integer('doors')->nullable();
            $table->integer('seats')->nullable();
            $table->string('body_type')->nullable();
            $table->integer('engine_size')->nullable();
            $table->integer('power_hp')->nullable();
            
            // Location
            $table->string('location_city')->nullable();
            $table->string('location_country', 2)->default('DE');
            
            // Status
            $table->enum('status', ['draft', 'active', 'sold', 'reserved', 'removed'])->default('draft');
            
            // AutoScout24
            $table->string('autoscout_listing_id')->nullable()->unique();
            $table->json('autoscout_data')->nullable();
            
            // Images
            $table->json('images')->nullable(); // Array of image URLs
            $table->string('primary_image')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['dealer_id', 'status']);
            $table->index(['seller_id', 'status']);
            $table->index('vin');
            $table->index('autoscout_listing_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
