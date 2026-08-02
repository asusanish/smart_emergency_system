<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('emergency_logs', function (Blueprint $table) {

        $table->id();

        $table->foreignId('emergency_request_id')
              ->constrained()
              ->cascadeOnDelete();

        $table->string('status');

        $table->timestamps();

    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emergency_logs');
    }
};
