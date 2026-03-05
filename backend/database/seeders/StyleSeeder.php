<?php

namespace Database\Seeders;

use App\Models\Style;
use App\Models\StyleTranslation;
use Illuminate\Database\Seeder;

class StyleSeeder extends Seeder
{
    /** Translations per slug, same as frontend messages (de, en, ru, it) */
    private const TRANSLATIONS = [
        'realism' => [
            'de' => [
                'name' => 'Realismus',
                'description' => 'Lebensechte Darstellungen mit tiefem Schatten und detailreichen Motiven. Perfekt für Porträts, Natur und realistische Kunstwerke.',
            ],
            'en' => [
                'name' => 'Realism',
                'description' => 'Lifelike representations with deep shadows and detailed motifs. Perfect for portraits, nature, and realistic artworks.',
            ],
            'ru' => [
                'name' => 'Реализм',
                'description' => 'Правдоподобные изображения с глубокими тенями и детальными мотивами. Идеально для портретов, природы и реалистичных сюжетов.',
            ],
            'it' => [
                'name' => 'Realismo',
                'description' => 'Rappresentazioni fedeli con ombre profonde e motivi dettagliati. Perfetto per ritratti, natura e opere realistiche.',
            ],
        ],
        'japanese' => [
            'de' => [
                'name' => 'Japanisch',
                'description' => 'Traditionelle japanische Motive mit Symbolik und Balance. Zeitlose Formen, die innere Stärke und Bedeutung tragen.',
            ],
            'en' => [
                'name' => 'Japanese',
                'description' => 'Traditional Japanese motifs with symbolism and balance. Timeless forms that carry inner strength and meaning.',
            ],
            'ru' => [
                'name' => 'Японский',
                'description' => 'Традиционные японские мотивы с символикой и балансом. Вневременные формы с внутренней силой и смыслом.',
            ],
            'it' => [
                'name' => 'Giapponese',
                'description' => 'Motivi tradizionali giapponesi con simbolismo e equilibrio. Forme senza tempo che portano forza interiore e significato.',
            ],
        ],
        'graphic' => [
            'de' => [
                'name' => 'Grafik',
                'description' => 'Moderne grafische Elemente mit starken Kompositionen und ausdrucksstarken Details. Wo Tradition auf moderne Vision trifft.',
            ],
            'en' => [
                'name' => 'Graphic',
                'description' => 'Modern graphic elements with strong compositions and expressive details. Where tradition meets modern vision.',
            ],
            'ru' => [
                'name' => 'Графика',
                'description' => 'Современная графика с сильными композициями и выразительными деталями. Традиция встречается с современным видением.',
            ],
            'it' => [
                'name' => 'Grafica',
                'description' => 'Elementi grafici moderni con composizioni forti e dettagli espressivi. Dove la tradizione incontra la visione moderna.',
            ],
        ],
    ];

    public function run(): void
    {
        $sortOrder = 1;
        foreach (array_keys(self::TRANSLATIONS) as $slug) {
            $first = self::TRANSLATIONS[$slug]['en'];
            $style = Style::firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => $first['name'],
                    'description' => $first['description'],
                    'sort_order' => $sortOrder++,
                ]
            );

            foreach (['de', 'en', 'ru', 'it'] as $locale) {
                $t = self::TRANSLATIONS[$slug][$locale];
                StyleTranslation::updateOrCreate(
                    ['style_id' => $style->id, 'locale' => $locale],
                    ['name' => $t['name'], 'description' => $t['description']]
                );
            }
        }
    }
}
