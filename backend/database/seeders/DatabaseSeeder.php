<?php

namespace Database\Seeders;

use App\Models\Artist;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // In production we must never re-seed placeholder artists.
        // Seed artists only in local/testing OR when DB is empty.
        if (app()->environment(['local', 'testing']) || Artist::query()->count() === 0) {
            $this->call([ArtistSeeder::class]);
        }

        $this->call([
            HeroSettingSeeder::class,
            AboutSectionSeeder::class,
            StyleSeeder::class,
            InfoSectionSeeder::class,
            ReviewSeeder::class,
            LegalPageSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}
