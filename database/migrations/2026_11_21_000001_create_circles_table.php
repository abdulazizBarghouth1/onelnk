<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('circles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('color', 20)->nullable();
            $table->timestamps();

            // A circle name is unique within a business (tenant surface).
            $table->unique(['business_id', 'name']);
            $table->index(['business_id', 'created_by']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('circles');
    }
};
