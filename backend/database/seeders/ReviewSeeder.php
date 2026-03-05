<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = [
            [
                'de' => 'Absolut fantastische Erfahrung! Der Artist hat genau verstanden, was ich wollte, und das Ergebnis ist noch besser als erwartet.',
                'en' => 'Absolutely fantastic experience! The artist understood exactly what I wanted, and the result is even better than expected.',
                'ru' => 'Абсолютно потрясающий опыт! Художник точно понял, что я хотела, и результат превзошёл ожидания.',
                'it' => 'Esperienza fantastica! L\'artista ha capito esattamente cosa volevo e il risultato è ancora migliore del previsto.',
                'author' => 'Sarah M.',
            ],
            [
                'de' => 'Professionell, sauber und sehr talentiert. Das Studio ist wunderschön und die Atmosphäre ist entspannt.',
                'en' => 'Professional, clean, and very talented. The studio is beautiful and the atmosphere is relaxed.',
                'ru' => 'Профессионально, чисто и очень талантливо. Студия прекрасная, атмосфера спокойная.',
                'it' => 'Professionale, pulito e molto talentuoso. Lo studio è bellissimo e l\'atmosfera è rilassata.',
                'author' => 'Michael K.',
            ],
            [
                'de' => 'Mein erstes Tattoo und ich fühle mich so gut aufgehoben. Die Beratung war ausführlich und das Ergebnis ist perfekt.',
                'en' => 'My first tattoo and I felt so well looked after. The consultation was thorough and the result is perfect.',
                'ru' => 'Моя первая татуировка, и я чувствовала себя в надёжных руках. Консультация была подробной, результат идеален.',
                'it' => 'Il mio primo tatuaggio e mi sono sentita così accudita. La consulenza è stata approfondita e il risultato è perfetto.',
                'author' => 'Lisa T.',
            ],
            [
                'de' => 'Hervorragende Arbeit! Die Details sind unglaublich und die Heilung verlief problemlos.',
                'en' => 'Outstanding work! The details are incredible and the healing went smoothly.',
                'ru' => 'Превосходная работа! Детали невероятные, заживление прошло легко.',
                'it' => 'Lavoro eccellente! I dettagli sono incredibili e la guarigione è andata liscio.',
                'author' => 'David R.',
            ],
            [
                'de' => 'Ich bin so glücklich mit meinem neuen Tattoo. Der Artist ist sehr geduldig und erklärt alles genau.',
                'en' => 'I\'m so happy with my new tattoo. The artist is very patient and explains everything clearly.',
                'ru' => 'Я так довольна новой татуировкой. Мастер очень терпеливый и всё объясняет понятно.',
                'it' => 'Sono così felice del mio nuovo tatuaggio. L\'artista è molto paziente e spiega tutto nel dettaglio.',
                'author' => 'Emma L.',
            ],
            [
                'de' => 'Top Qualität und Service! Kann ich nur weiterempfehlen. Werde definitiv wieder kommen.',
                'en' => 'Top quality and service! Can only recommend. Will definitely come again.',
                'ru' => 'Отличное качество и сервис! Рекомендую. Обязательно приду ещё.',
                'it' => 'Qualità e servizio top! Lo consiglio vivamente. Tornerò sicuramente.',
                'author' => 'Tom H.',
            ],
        ];

        $baseDate = now()->subDays(30);
        foreach ($reviews as $index => $r) {
            foreach (['de', 'en', 'ru', 'it'] as $localeIndex => $locale) {
                $createdAt = $baseDate->copy()->addDays($index * 4 + $localeIndex);
                $review = Review::firstOrCreate(
                    [
                        'locale' => $locale,
                        'author' => $r['author'],
                    ],
                    [
                        'text' => $r[$locale],
                        'rating' => 5,
                        'status' => 'approved',
                        'email' => null,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]
                );
                if (!$review->wasRecentlyCreated) {
                    $review->update(['text' => $r[$locale], 'rating' => 5, 'status' => 'approved']);
                }
            }
        }
    }
}
