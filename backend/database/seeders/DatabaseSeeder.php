<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ArtistSeeder::class,
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
