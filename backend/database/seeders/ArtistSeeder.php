<?php

namespace Database\Seeders;

use App\Models\Artist;
use App\Models\Work;
use Illuminate\Database\Seeder;

class ArtistSeeder extends Seeder
{
    public function run(): void
    {
        $artists = [
            [
                'slug' => 'artist-01',
                'name' => 'Artist 01',
                'style' => 'Japanese Style',
                'description' => "Arbeitet im traditionellen japanischen Tattoo-Stil.\nInspiriert von Symbolik, Balance und zeitlosen Formen.",
                'avatar' => '/placeholder-avatar.svg',
                'sort_order' => 1,
                'works' => [
                    ['image' => '/placeholder-work.svg', 'style' => 'japanese'],
                    ['image' => '/placeholder-work.svg', 'style' => 'japanese'],
                    ['image' => '/placeholder-work.svg', 'style' => 'japanese'],
                    ['image' => '/placeholder-work.svg', 'style' => 'japanese'],
                    ['image' => '/placeholder-work.svg', 'style' => 'japanese'],
                ],
            ],
            [
                'slug' => 'artist-02',
                'name' => 'Artist 02',
                'style' => 'Japanese · Realismus · Grafik',
                'description' => "Vereint japanische Motive mit Realismus und grafischen Elementen.\nStarke Kompositionen, tiefer Kontrast.",
                'avatar' => '/placeholder-avatar.svg',
                'sort_order' => 2,
                'works' => [
                    ['image' => '/placeholder-work.svg', 'style' => 'realism'],
                    ['image' => '/placeholder-work.svg', 'style' => 'graphic'],
                    ['image' => '/placeholder-work.svg', 'style' => 'japanese'],
                    ['image' => '/placeholder-work.svg', 'style' => 'realism'],
                    ['image' => '/placeholder-work.svg', 'style' => 'graphic'],
                ],
            ],
            [
                'slug' => 'artist-03',
                'name' => 'Artist 03',
                'style' => 'Minimal · Fine Line · Micro Realism',
                'description' => "Spezialisiert auf minimalistische Tattoos, Fine Line und Micro Realism.\nFeine Linien, klare Formen.",
                'avatar' => '/placeholder-avatar.svg',
                'sort_order' => 3,
                'works' => [
                    ['image' => '/placeholder-work.svg', 'style' => 'minimal'],
                    ['image' => '/placeholder-work.svg', 'style' => 'minimal'],
                    ['image' => '/placeholder-work.svg', 'style' => 'minimal'],
                    ['image' => '/placeholder-work.svg', 'style' => 'minimal'],
                ],
            ],
        ];

        foreach ($artists as $index => $data) {
            $worksData = $data['works'];
            unset($data['works']);
            $artist = Artist::create($data);
            foreach ($worksData as $i => $work) {
                Work::create([
                    'artist_id' => $artist->id,
                    'image' => $work['image'],
                    'style' => $work['style'] ?? null,
                    'sort_order' => $i + 1,
                ]);
            }
        }
    }
}
