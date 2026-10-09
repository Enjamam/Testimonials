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
        Schema::create('embed_configurations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('space_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('layout')->default('masonry');
            $table->boolean('dark_mode')->default(false);
            $table->boolean('animation_enabled')->default(true);
            $table->string('background_color')->nullable()->default('#ffffff');
            $table->unsignedInteger('item_limit')->default(20);
            $table->json('display_options')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('embed_configurations');
    }
};
