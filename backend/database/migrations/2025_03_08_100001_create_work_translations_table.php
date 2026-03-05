<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('title', 255)->nullable();
            $table->timestamps();

            $table->unique(['work_id', 'locale']);
        });

        $works = DB::table('works')->get();
        foreach ($works as $work) {
            if ($work->title !== null && $work->title !== '') {
                DB::table('work_translations')->insert([
                    'work_id' => $work->id,
                    'locale' => 'de',
                    'title' => $work->title,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('work_translations');
    }
};
