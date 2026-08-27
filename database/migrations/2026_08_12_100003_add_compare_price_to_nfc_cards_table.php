<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds an optional "compare at" price to the NFC card catalog so the public
 * product-details page can show the design's strikethrough "was" price + savings
 * badge. Null = no discount shown.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nfc_cards', function (Blueprint $table) {
            $table->decimal('compare_price', 10, 2)->nullable()->after('price');
        });
    }

    public function down(): void
    {
        Schema::table('nfc_cards', function (Blueprint $table) {
            $table->dropColumn('compare_price');
        });
    }
};
