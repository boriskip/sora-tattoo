<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('info_sections', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 5);
            $table->string('title', 255)->nullable();
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
            $table->unique('locale');
        });

        Schema::create('info_guides', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100);
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('info_guide_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('info_guide_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('title', 500);
            $table->text('content')->nullable();
            $table->timestamps();
            $table->unique(['info_guide_id', 'locale']);
        });

        Schema::create('info_guide_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('info_guide_id')->constrained()->cascadeOnDelete();
            $table->string('image', 500);
            $table->string('alt', 500)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('info_guide_images');
        Schema::dropIfExists('info_guide_translations');
        Schema::dropIfExists('info_guides');
        Schema::dropIfExists('info_sections');
    }
};
