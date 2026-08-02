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
        Schema::create('ambulances', function (Blueprint $table) {

    $table->id();

    $table->foreignId('driver_id')
          ->nullable()
          ->constrained('users')
          ->nullOnDelete();

    $table->string('vehicle_number');

    $table->string('type')
          ->default('Basic');

    $table->string('status')
          ->default('Available');

    $table->decimal('latitude',10,7)
          ->nullable();

    $table->decimal('longitude',10,7)
          ->nullable();

    $table->timestamps();

});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ambulances');
    }
};
