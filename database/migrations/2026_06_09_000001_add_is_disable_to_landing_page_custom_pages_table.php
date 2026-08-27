<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('landing_page_custom_pages', function (Blueprint $table) {
            if (!Schema::hasColumn('landing_page_custom_pages', 'is_disable')) {
                $table->boolean('is_disable')->default(false)->after('is_active');
            }
        });
    }

    public function down(): void
    {
        Schema::table('landing_page_custom_pages', function (Blueprint $table) {
            if (Schema::hasColumn('landing_page_custom_pages', 'is_disable')) {
                $table->dropColumn('is_disable');
            }
        });
    }
};
