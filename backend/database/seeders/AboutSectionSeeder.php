<?php

namespace Database\Seeders;

use App\Models\AboutSection;
use Illuminate\Database\Seeder;

class AboutSectionSeeder extends Seeder
{
    private const LOCALES = ['de', 'en', 'ru', 'it'];

    private const DEFAULTS = [
        'de' => [
            'title' => 'Über uns',
            'content' => "SORA Tattoo steht für Klarheit, Präzision und künstlerische Freiheit.\n\nUnser Studio in Berlin ist ein Ort, an dem Ideen Form annehmen und persönliche Geschichten sichtbar werden.\n\nWir arbeiten nicht mit einer starren Fläche, sondern mit dem Körper in Bewegung – Linien folgen dem Rhythmus, dem Fluss und der natürlichen Dynamik.\n\nFür uns ist Haut kein Leinwandersatz, sondern Teil der Komposition.\n\nLeere bedeutet nicht Abwesenheit, sondern Balance – eine bewusste Pause innerhalb des gesamten visuellen Dialogs.\n\nMit Sorgfalt, Transparenz und höchstem Anspruch an Qualität und Sicherheit entsteht jedes Tattoo als Teil eines größeren Ganzen.",
        ],
        'en' => [
            'title' => 'About us',
            'content' => "SORA Tattoo stands for clarity, precision, and artistic freedom.\n\nOur studio in Berlin is a place where ideas take shape and personal stories become visible.\n\nWe don't work with a rigid surface, but with the body in motion – lines follow rhythm, flow, and natural dynamics.\n\nFor us, skin is not a canvas substitute, but part of the composition.\n\nEmptiness doesn't mean absence, but balance – a conscious pause within the entire visual dialogue.\n\nWith care, transparency, and the highest standards of quality and safety, each tattoo emerges as part of a greater whole.",
        ],
        'ru' => [
            'title' => 'О нас',
            'content' => "SORA Tattoo — это ясность, точность и творческая свобода.\n\nНаша студия в Берлине — место, где идеи обретают форму, а личные истории становятся видимыми.\n\nМы работаем не с неподвижной поверхностью, а с телом в движении — линии следуют ритму, потоку и естественной динамике.\n\nДля нас кожа — не замена холста, а часть композиции.\n\nПустота — не отсутствие, а баланс, осознанная пауза в визуальном диалоге.\n\nС заботой, прозрачностью и высокими стандартами качества и безопасности каждое тату становится частью целого.",
        ],
        'it' => [
            'title' => 'Chi siamo',
            'content' => "SORA Tattoo significa chiarezza, precisione e libertà artistica.\n\nIl nostro studio a Berlino è un luogo dove le idee prendono forma e le storie personali diventano visibili.\n\nNon lavoriamo su una superficie rigida, ma sul corpo in movimento — le linee seguono ritmo, flusso e dinamica naturale.\n\nPer noi la pelle non è un sostituto della tela, ma parte della composizione.\n\nIl vuoto non è assenza, ma equilibrio — una pausa consapevole nel dialogo visivo.\n\nCon cura, trasparenza e i massimi standard di qualità e sicurezza, ogni tatuaggio nasce come parte di un insieme più grande.",
        ],
    ];

    public function run(): void
    {
        $images = [
            '/about/uberuns-1.png', '/about/uberuns-2.png', '/about/uberuns-3.png',
            '/about/uberuns-4.png', '/about/uberuns-5.png', '/about/uberuns-6.png',
            '/about/uberuns-7.png', '/about/uberuns-8.png', '/about/uberuns-9.png', '/about/uberuns-10.png',
        ];

        foreach (self::LOCALES as $locale) {
            $defaults = self::DEFAULTS[$locale] ?? self::DEFAULTS['de'];
            AboutSection::updateOrCreate(
                ['locale' => $locale],
                [
                    'title' => $defaults['title'],
                    'content' => $defaults['content'],
                    'images' => $images,
                    'sort_order' => 0,
                ]
            );
        }
    }
}
