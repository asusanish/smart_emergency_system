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
        Schema::create('emergency_requests', function (Blueprint $table) {

    $table->id();

    $table->foreignId('patient_id')
          ->constrained('users')
          ->cascadeOnDelete();

    $table->foreignId('ambulance_id')
          ->nullable()
          ->constrained()
          ->nullOnDelete();

    $table->string('emergency_type');

    $table->string('severity')
          ->default('Medium');

    $table->string('status')
          ->default('Pending');

    $table->decimal('latitude',10,7);

    $table->decimal('longitude',10,7);

    $table->text('description')
          ->nullable();

    $table->timestamps();

});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emergency_requests');
    }
};
