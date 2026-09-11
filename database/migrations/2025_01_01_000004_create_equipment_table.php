<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('property_number')->unique()->comment('Auto-generated asset tag, e.g. DLSJBC-ICT-000123');
            $table->string('name');
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('location_id')->constrained()->restrictOnDelete();
            $table->enum('status', ['operational', 'under_maintenance', 'damaged', 'decommissioned'])->default('operational');
            $table->enum('condition', ['new', 'good', 'fair', 'poor'])->default('good');
            $table->date('acquisition_date')->nullable();
            $table->decimal('acquisition_cost', 12, 2)->nullable();
            $table->string('supplier')->nullable();
            $table->date('warranty_expiry')->nullable();
            $table->string('image_path')->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'condition']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
