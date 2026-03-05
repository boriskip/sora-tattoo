<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artist_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('name');
            $table->string('style', 255)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['artist_id', 'locale']);
        });

        $artists = DB::table('artists')->get();
        foreach ($artists as $a) {
            DB::table('artist_translations')->insert([
                'artist_id' => $a->id,
                'locale' => 'de',
                'name' => $a->name ?? $a->slug,
                'style' => $a->style,
                'description' => $a->description,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('artist_translations');
    }
};
