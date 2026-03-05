<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('style_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('style_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['style_id', 'locale']);
        });

        // Copy existing name/description into default locale
        $rows = \DB::table('styles')->get();
        foreach ($rows as $row) {
            \DB::table('style_translations')->insert([
                'style_id' => $row->id,
                'locale' => 'de',
                'name' => $row->name ?? $row->slug,
                'description' => $row->description,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('style_translations');
    }
};
