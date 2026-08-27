<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * OneLnk marketing "Card Gallery" — admin-managed, image-only entries.
 * Each row is a single uploaded image that IS the whole design (front+back,
 * styling, etc.), rendered in the homepage GallerySection + the /gallery page.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->string('image');                 // relative asset path (storageType:path)
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
