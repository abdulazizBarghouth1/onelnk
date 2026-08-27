<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('broadcast_email_logs')) {
            Schema::create('broadcast_email_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('broadcast_email_id')->constrained('broadcast_emails')->onDelete('cascade');
                $table->string('recipient_email');
                $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
                $table->text('error_message')->nullable();
                $table->timestamp('sent_at')->nullable();
                $table->timestamps();

                $table->index('broadcast_email_id');
                $table->index('status');
                $table->index('recipient_email');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('broadcast_email_logs');
    }
};
