<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Turn the NFC card "order request" into a full public checkout order:
 * design choices (colors + printed fields), a selected digital plan,
 * structured delivery details, pricing breakdown (subtotal + shipping),
 * payment (COD / manual for launch), a unique order number, and a wider
 * fulfilment status set. Kept on the same table per the approved plan so the
 * existing admin order-requests screen + approve/stock flow are reused.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nfc_card_order_requests', function (Blueprint $table) {
            $table->string('order_number')->nullable()->unique()->after('id');

            // Physical card design (from wizard steps 1-2)
            $table->string('card_color')->nullable()->after('logo');
            $table->string('text_color')->nullable()->after('card_color');
            $table->json('card_design')->nullable()->after('text_color'); // printed name/title/phone/email/website + extras

            // Selected digital plan (wizard step 5) — separate from the paid card
            $table->foreignId('plan_id')->nullable()->after('business_id')->constrained('plans')->onDelete('set null');

            // Structured delivery (wizard step 7) — shipping_address text already exists
            $table->string('recipient_name')->nullable()->after('plan_id');
            $table->string('recipient_phone')->nullable()->after('recipient_name');
            $table->string('recipient_email')->nullable()->after('recipient_phone');
            $table->string('city')->nullable()->after('recipient_email');
            $table->text('delivery_notes')->nullable()->after('shipping_address');

            // Pricing breakdown (total_price already exists = grand total)
            $table->decimal('subtotal', 10, 2)->default(0)->after('original_price');
            $table->decimal('shipping_fee', 10, 2)->default(0)->after('subtotal');

            // Payment (COD / manual for launch)
            $table->string('payment_method')->nullable()->after('shipping_fee');
            $table->string('payment_status')->default('pending')->after('payment_method'); // pending | paid
        });

        // Widen the status enum with e-commerce fulfilment states (keep the old values).
        DB::statement("ALTER TABLE nfc_card_order_requests MODIFY COLUMN status ENUM('pending','approved','rejected','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        // Revert the enum first (rows using new states would block the change; map them back to pending).
        DB::statement("UPDATE nfc_card_order_requests SET status = 'pending' WHERE status IN ('processing','shipped','delivered','cancelled')");
        DB::statement("ALTER TABLE nfc_card_order_requests MODIFY COLUMN status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending'");

        Schema::table('nfc_card_order_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('plan_id');
            $table->dropColumn([
                'order_number', 'card_color', 'text_color', 'card_design',
                'recipient_name', 'recipient_phone', 'recipient_email', 'city', 'delivery_notes',
                'subtotal', 'shipping_fee', 'payment_method', 'payment_status',
            ]);
        });
    }
};
