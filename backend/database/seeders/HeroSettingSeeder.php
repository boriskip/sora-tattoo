<?php

namespace Database\Seeders;

use App\Models\HeroSetting;
use Illuminate\Database\Seeder;

class HeroSettingSeeder extends Seeder
{
    private const LOCALES = ['de', 'en', 'ru', 'it'];

    private const DEFAULTS = [
        'de' => [
            'title_main' => 'SORA',
            'title_sub' => 'Tattoo',
            'subtitle' => 'Kunstvolle Tattoos mit Leidenschaft',
            'description' => 'Wir schaffen einzigartige Tattoo-Kunstwerke, die Ihre Persönlichkeit widerspiegeln',
        ],
        'en' => [
            'title_main' => 'SORA',
            'title_sub' => 'Tattoo',
            'subtitle' => 'Artistic Tattoos with Passion',
            'description' => 'We create unique tattoo artworks that reflect your personality',
        ],
        'ru' => [
            'title_main' => 'SORA',
            'title_sub' => 'Tattoo',
            'subtitle' => 'Художественные тату с душой',
            'description' => 'Мы создаём уникальные тату-работы, отражающие вашу индивидуальность',
        ],
        'it' => [
            'title_main' => 'SORA',
            'title_sub' => 'Tattoo',
            'subtitle' => 'Tatuaggi artistici con passione',
            'description' => 'Creiamo opere uniche che riflettono la tua personalità',
        ],
    ];

    public function run(): void
    {
        foreach (self::LOCALES as $locale) {
            $defaults = self::DEFAULTS[$locale] ?? self::DEFAULTS['de'];
            HeroSetting::updateOrCreate(
                ['locale' => $locale],
                [
                    'background_image' => '/hero-background.png',
                    'social_icons_theme' => 'light',
                    'title_main' => $defaults['title_main'],
                    'title_sub' => $defaults['title_sub'],
                    'subtitle' => $defaults['subtitle'],
                    'description' => $defaults['description'],
                    'facebook_url' => 'https://facebook.com',
                    'instagram_url' => 'https://instagram.com',
                    'whatsapp_url' => 'https://wa.me',
                ]
            );
        }
    }
}
