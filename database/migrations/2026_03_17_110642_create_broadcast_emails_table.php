<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('broadcast_emails')) {

            Schema::create('broadcast_emails', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->enum('user_type', ['superadmin', 'company']);
                $table->string('subject');
                $table->text('message');
                $table->integer('total_recipients')->default(0);
                $table->integer('sent_count')->default(0);
                $table->integer('failed_count')->default(0);
                $table->enum('status', ['scheduled', 'processing', 'completed', 'failed'])->default('scheduled');
                $table->timestamp('scheduled_at')->nullable();
                $table->timestamp('started_at')->nullable();
                $table->timestamp('completed_at')->nullable();
                $table->unsignedBigInteger('created_by');
                $table->timestamps();

                $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
                $table->index('created_by');
                $table->index('user_id');
                $table->index('status');
                $table->index('scheduled_at');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('broadcast_emails');
    }
};
