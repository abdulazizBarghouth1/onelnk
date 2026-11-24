<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Phase 1 — turn the lead-capture `contacts` row into a real address-book
 * contact. Primary email/phone stay as columns (search & dedupe); extra
 * entries live in JSON. `source` records where the contact came from.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            // Who added it (useful in company teams). After organization_id
            // which was added in an earlier migration.
            $table->foreignId('created_by')
                ->nullable()
                ->after('organization_id')
                ->constrained('users')
                ->nullOnDelete();

            // Standard vCard fields.
            $table->string('job_title')->nullable()->after('phone');
            $table->string('website')->nullable()->after('job_title');
            $table->text('address')->nullable()->after('website');
            $table->string('avatar')->nullable()->after('address');

            // Additional emails / phones a card often carries (2–3).
            $table->json('emails')->nullable()->after('email');
            $table->json('phones')->nullable()->after('emails');

            // manual · import · scan — where the contact originated.
            $table->string('source', 20)->default('manual')->after('avatar');
        });
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('created_by');
            $table->dropColumn([
                'job_title', 'website', 'address', 'avatar',
                'emails', 'phones', 'source',
            ]);
        });
    }
};
