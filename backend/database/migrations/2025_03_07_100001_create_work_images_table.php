<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_id')->constrained()->cascadeOnDelete();
            $table->string('image', 500);
            $table->string('alt', 500)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Perkelti esamus works.image ir works.alt į work_images (po vieną įrašą per work)
        if (Schema::hasColumn('works', 'image')) {
            $works = DB::table('works')->get();
            foreach ($works as $work) {
                if ($work->image ?? null) {
                    DB::table('work_images')->insert([
                        'work_id' => $work->id,
                        'image' => $work->image,
                        'alt' => $work->alt ?? null,
                        'sort_order' => 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        Schema::table('works', function (Blueprint $table) {
            if (Schema::hasColumn('works', 'image')) {
                $table->dropColumn('image');
            }
        });
        if (Schema::hasColumn('works', 'alt')) {
            Schema::table('works', function (Blueprint $table) {
                $table->dropColumn('alt');
            });
        }
    }

    public function down(): void
    {
        Schema::table('works', function (Blueprint $table) {
            $table->string('image', 500)->nullable()->after('title');
            $table->string('alt', 500)->nullable()->after('image');
        });

        $works = DB::table('works')->get();
        foreach ($works as $work) {
            $first = DB::table('work_images')->where('work_id', $work->id)->orderBy('sort_order')->orderBy('id')->first();
            if ($first) {
                DB::table('works')->where('id', $work->id)->update([
                    'image' => $first->image,
                    'alt' => $first->alt,
                ]);
            }
        }

        Schema::dropIfExists('work_images');
    }
};
