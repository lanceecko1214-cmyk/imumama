<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('building');
            $table->string('floor')->nullable();
            $table->string('room')->nullable();
            $table->string('custodian')->nullable()->comment('Person/department responsible for the area');
            $table->timestamps();

            $table->unique(['building', 'floor', 'room']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
