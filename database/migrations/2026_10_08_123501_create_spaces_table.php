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
        Schema::create('spaces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('ask')->nullable();
            $table->string('slug')->unique();
            $table->string('public_id')->unique();
            $table->string('theme')->default('minimal-light');
            $table->boolean('rating_enabled')->default(false);
            $table->json('field_configuration')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spaces');
    }
};
