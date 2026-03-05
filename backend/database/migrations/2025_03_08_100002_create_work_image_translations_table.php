<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_image_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_image_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('alt', 500)->nullable();
            $table->timestamps();

            $table->unique(['work_image_id', 'locale']);
        });

        $images = DB::table('work_images')->get();
        foreach ($images as $img) {
            if ($img->alt !== null && $img->alt !== '') {
                DB::table('work_image_translations')->insert([
                    'work_image_id' => $img->id,
                    'locale' => 'de',
                    'alt' => $img->alt,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('work_image_translations');
    }
};
