<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Extend the NFC card catalog so each card type (Classic / Custom / Teams)
 * carries marketing copy the create-card wizard renders: a short description,
 * a feature list, and audience tag pills. Mirrors the plans.features JSON
 * pattern — strings pass through the frontend t() layer for translation.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nfc_cards', function (Blueprint $table) {
            $table->string('description')->nullable()->after('name');
            $table->json('features')->nullable()->after('description'); // feature list (checkmarks)
            $table->json('tags')->nullable()->after('features');        // audience pills
        });
    }

    public function down(): void
    {
        Schema::table('nfc_cards', function (Blueprint $table) {
            $table->dropColumn(['description', 'features', 'tags']);
        });
    }
};
