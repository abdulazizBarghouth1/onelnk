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
        Schema::table('plan_orders', function (Blueprint $table) {
            if (!Schema::hasColumn('plan_orders', 'receipt')) {
                $table->string('receipt')->nullable()->after('payment_id');
            }
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plan_orders', function (Blueprint $table) {
            if (Schema::hasColumn('plan_orders', 'receipt')) {
                $table->dropColumn('receipt');
            }
        });
    }
};
