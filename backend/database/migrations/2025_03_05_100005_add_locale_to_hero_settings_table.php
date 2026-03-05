<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hero_settings', function (Blueprint $table) {
            $table->string('locale', 5)->default('de')->after('id');
        });
        \DB::table('hero_settings')->update(['locale' => 'de']);
        Schema::table('hero_settings', function (Blueprint $table) {
            $table->unique('locale');
        });
    }

    public function down(): void
    {
        Schema::table('hero_settings', function (Blueprint $table) {
            $table->dropUnique(['locale']);
            $table->dropColumn('locale');
        });
    }
};
