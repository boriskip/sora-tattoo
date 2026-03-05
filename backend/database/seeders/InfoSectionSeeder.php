<?php

namespace Database\Seeders;

use App\Models\InfoGuide;
use App\Models\InfoGuideImage;
use App\Models\InfoGuideTranslation;
use App\Models\InfoSection;
use Illuminate\Database\Seeder;

class InfoSectionSeeder extends Seeder
{
    public function run(): void
    {
        $sectionTitles = [
            'de' => 'Information',
            'en' => 'Information',
            'ru' => 'Информация',
            'it' => 'Informazioni',
        ];
        foreach ($sectionTitles as $locale => $title) {
            InfoSection::firstOrCreate(
                ['locale' => $locale],
                ['title' => $title, 'sort_order' => 0]
            );
        }

        $guideSlugs = [
            ['slug' => 'chooseArtist', 'sort_order' => 1],
            ['slug' => 'prepare', 'sort_order' => 2],
            ['slug' => 'session', 'sort_order' => 3],
            ['slug' => 'aftercare', 'sort_order' => 4],
        ];
        $titlesBySlug = [
            'chooseArtist' => ['de' => 'Wie wählt man den richtigen Tattoo-Artist?', 'en' => 'How to Choose the Right Tattoo Artist?', 'ru' => 'Как выбрать своего мастера тату?', 'it' => 'Come scegliere il maestro giusto?'],
            'prepare' => ['de' => 'Wie bereite ich mich auf einen Tattoo-Termin vor?', 'en' => 'How Do I Prepare for a Tattoo Appointment?', 'ru' => 'Как подготовиться к сеансу тату?', 'it' => 'Come prepararsi all\'appuntamento?'],
            'session' => ['de' => 'Was erwartet mich während der Tattoo-Session?', 'en' => 'What to Expect During the Tattoo Session?', 'ru' => 'Что ожидать во время сеанса?', 'it' => 'Cosa aspettarsi durante la seduta?'],
            'aftercare' => ['de' => 'Tattoo-Pflege & Heilung', 'en' => 'Tattoo Care & Healing', 'ru' => 'Уход и заживление тату', 'it' => 'Cura e guarigione del tatuaggio'],
        ];
        $contentBySlugLocale = [
            'chooseArtist' => [
                'de' => "Jeder Artist bei SORA hat eine eigene Handschrift und arbeitet in unterschiedlichen Stilrichtungen.\nAchte auf den Stil, die Linienführung und darauf, wie Motive aufgebaut sind.\nEbenso wichtig ist das persönliche Gefühl — ob du dich verstanden und gut aufgehoben fühlst.\nEin Tattoo ist ein gemeinsamer Prozess, der Zeit, Vertrauen und Ruhe braucht.\nNimm dir diese Zeit — wir begleiten dich gerne dabei.",
                'en' => "Each artist at SORA has their own signature and works in different styles.\nPay attention to the style, line work, and how motifs are structured.\nEqually important is the personal feeling – whether you feel understood and well taken care of.\nA tattoo is a collaborative process that requires time, trust, and calm.\nTake that time – we're happy to guide you through it.",
                'ru' => "У каждого мастера SORA свой почерк и стиль.\nОбращайте внимание на стиль, линию и то, как строятся мотивы.\nНе менее важно личное ощущение — чувствуете ли вы себя понятым и в надёжных руках.\nТату — совместный процесс, которому нужны время, доверие и спокойствие.\nНе торопитесь — мы с радостью проведём вас через этот путь.",
                'it' => "Ogni artista SORA ha la propria firma e lavora in stili diversi.\nFai attenzione allo stile, al tratto e a come sono costruiti i motivi.\nImportante è anche la sensazione personale — se ti senti compreso e a tuo agio.\nUn tatuaggio è un processo condiviso che richiede tempo, fiducia e calma.\nPrenditi questo tempo — siamo felici di accompagnarti.",
            ],
            'prepare' => [
                'de' => "Eine gute Vorbereitung hilft, den Tattoo-Termin entspannt zu erleben.\nSorge dafür, dass du ausgeschlafen bist, gut gegessen hast und ausreichend Wasser trinkst.\nVermeide Alkohol und Drogen mindestens 24 Stunden vor dem Termin.\nTrage bequeme Kleidung und nimm dir Zeit — Ruhe und ein gutes Gefühl sind Teil des Prozesses.\nWenn du Fragen hast, sind wir jederzeit für dich da.",
                'en' => "Good preparation helps you experience the tattoo appointment relaxed.\nMake sure you're well-rested, have eaten well, and drink enough water.\nAvoid alcohol and drugs at least 24 hours before the appointment.\nWear comfortable clothing and take your time – calm and a good feeling are part of the process.\nIf you have questions, we're always here for you.",
                'ru' => "Хорошая подготовка помогает провести сеанс спокойно.\nВысыпайтесь, ешьте нормально, пейте достаточно воды.\nИзбегайте алкоголя и веществ минимум за 24 часа до сеанса.\nНосите удобную одежду и не спешите — спокойствие и комфорт часть процесса.\nЕсли есть вопросы — мы всегда на связи.",
                'it' => "Una buona preparazione aiuta a vivere l'appuntamento con serenità.\nAssicurati di aver riposato, mangiato bene e bevuto a sufficienza.\nEvita alcol e sostanze almeno 24 ore prima.\nIndossa abiti comodi e prenditi il tuo tempo — calma e benessere fanno parte del processo.\nSe hai domande, siamo sempre a disposizione.",
            ],
            'session' => [
                'de' => "Der Tattoo-Termin beginnt mit einem ruhigen Gespräch über dein Motiv und die Platzierung.\nGemeinsam gehen wir die Details durch, bevor der Prozess startet.\nWährend der Session nehmen wir uns Zeit, machen Pausen und achten auf dein Wohlbefinden.\nDu kannst jederzeit Fragen stellen oder Bescheid sagen, wenn du eine Pause brauchst.\nDein Komfort und ein gutes Gefühl stehen für uns an erster Stelle.",
                'en' => "The tattoo appointment begins with a calm conversation about your motif and placement.\nTogether we go through the details before the process starts.\nDuring the session, we take our time, take breaks, and pay attention to your well-being.\nYou can ask questions at any time or let us know if you need a break.\nYour comfort and a good feeling are our top priority.",
                'ru' => "Сеанс начинается с спокойного разговора о мотиве и месте.\nВместе пройдём по деталям перед началом.\nВо время сеанса мы не спешим, делаем паузы и следим за вашим состоянием.\nВы можете в любой момент задать вопрос или попросить паузу.\nВаш комфорт и хорошее самочувствие для нас в приоритете.",
                'it' => "L'appuntamento inizia con una conversazione tranquilla su motivo e posizione.\nInsieme affrontiamo i dettagli prima di iniziare.\nDurante la seduta ci prendiamo tempo, facciamo pause e badiamo al tuo benessere.\nPuoi fare domande in qualsiasi momento o chiedere una pausa.\nIl tuo comfort e una buona sensazione sono la nostra priorità.",
            ],
            'aftercare' => [
                'de' => "Eine gute Nachsorge ist entscheidend für ein schönes und dauerhaftes Ergebnis.\nBitte halte dich an die folgenden Hinweise — sie helfen deiner Haut, optimal zu heilen.\n\nVariante 1 — Heilung mit Schutzfolie (Second Skin)\nNach dem Tattoo wird eine spezielle Schutzfolie auf die Haut aufgebracht.\n• Die Folie bleibt 3–5 Tage auf der Haut, je nach Empfehlung deines Artists.\n• In dieser Zeit schützt sie das Tattoo vor Bakterien, Reibung und Schmutz.\n• Sollte sich Flüssigkeit unter der Folie sammeln, ist das normal.\n• Wenn sich die Folie vorzeitig löst oder stark unangenehm wird, entferne sie vorsichtig.\nNach dem Entfernen der Folie:\n• Wasche das Tattoo mit lauwarmem Wasser und einer milden, unparfümierten Seife.\n• Tupfe die Haut vorsichtig trocken (nicht reiben).\n• Trage eine dünne Schicht Tattoo-Pflegecreme auf.\n• Pflege das Tattoo 2–3 Mal täglich.\n\nVariante 2 — Heilung mit Kompresse\nNach dem Termin wird das Tattoo mit einer Kompresse abgedeckt.\n• Entferne die Kompresse nach 1,5–2 Stunden.\n• Wasche das Tattoo gründlich mit lauwarmem Wasser und einer milden Seife.\n• Tupfe es vorsichtig trocken.\n• Trage eine dünne Schicht Pflegecreme auf.\nIn den folgenden Tagen:\n• Wasche das Tattoo 2–3 Mal täglich.\n• Trage jedes Mal eine dünne Schicht Creme auf.\n• Die Haut darf nicht austrocknen, aber auch nicht \"ersticken\".\n\nWichtige Hinweise für beide Varianten\n• Kratzen oder Reiben vermeiden.\n• Nicht an Schorf oder Hautschuppen ziehen.\n• Kein Baden, Sauna, Solarium oder Schwimmen für mindestens 2–3 Wochen.\n• Direkte Sonneneinstrahlung vermeiden.\n• Trage lockere, saubere Kleidung über dem Tattoo.\n\nHeilungsprozess\n• In den ersten Tagen kann die Haut gerötet, empfindlich oder leicht geschwollen sein — das ist normal.\n• Juckreiz gehört zum Heilungsprozess, bitte nicht kratzen.\n• Die vollständige Heilung dauert ca. 2–4 Wochen, tieferliegende Hautschichten länger.\n\nWenn du unsicher bist oder Fragen hast, melde dich jederzeit bei uns.\nWir begleiten dich auch nach dem Tattoo — dein Wohlbefinden ist uns wichtig.",
                'en' => "Good aftercare is crucial for a beautiful and lasting result.\nPlease follow these guidelines – they help your skin heal optimally.\n\nOption 1 — Healing with Protective Film (Second Skin)\nAfter the tattoo, a special protective film is applied to the skin.\n• The film stays on the skin for 3–5 days, depending on your artist's recommendation.\n• During this time, it protects the tattoo from bacteria, friction, and dirt.\n• If fluid collects under the film, this is normal.\n• If the film comes off prematurely or becomes very uncomfortable, remove it carefully.\nAfter removing the film:\n• Wash the tattoo with lukewarm water and a mild, unscented soap.\n• Gently pat the skin dry (do not rub).\n• Apply a thin layer of tattoo care cream.\n• Care for the tattoo 2–3 times daily.\n\nOption 2 — Healing with Compress\nAfter the appointment, the tattoo is covered with a compress.\n• Remove the compress after 1.5–2 hours.\n• Wash the tattoo thoroughly with lukewarm water and mild soap.\n• Gently pat it dry.\n• Apply a thin layer of care cream.\nIn the following days:\n• Wash the tattoo 2–3 times daily.\n• Apply a thin layer of cream each time.\n• The skin should not dry out, but also not 'suffocate'.\n\nImportant Notes for Both Options\n• Avoid scratching or rubbing.\n• Do not pull on scabs or skin flakes.\n• No bathing, sauna, tanning, or swimming for at least 2–3 weeks.\n• Avoid direct sunlight.\n• Wear loose, clean clothing over the tattoo.\n\nHealing Process\n• In the first days, the skin may be red, sensitive, or slightly swollen – this is normal.\n• Itching is part of the healing process, please do not scratch.\n• Complete healing takes about 2–4 weeks, deeper skin layers longer.\n\nIf you're unsure or have questions, feel free to contact us anytime.\nWe'll support you even after the tattoo – your well-being is important to us.",
                'ru' => "Правильный уход важен для красивого и стойкого результата.\nСледуйте этим рекомендациям — они помогут коже зажить оптимально.\n\nВариант 1 — Заживление с защитной плёнкой (Second Skin)\nПосле сеанса на кожу наклеивается специальная защитная плёнка.\n• Плёнка остаётся на коже 3–5 дней по рекомендации мастера.\n• В это время она защищает тату от бактерий, трения и грязи.\n• Скопление жидкости под плёнкой — нормально.\n• Если плёнка отклеилась раньше или сильно мешает — аккуратно снимите её.\nПосле снятия плёнки:\n• Мойте тату тёплой водой и мягким мылом без отдушек.\n• Аккуратно промокайте кожу (не трите).\n• Наносите тонкий слой крема для тату.\n• Ухаживайте за тату 2–3 раза в день.\n\nВариант 2 — Заживление с повязкой\nПосле сеанса тату закрывается повязкой.\n• Снимите повязку через 1,5–2 часа.\n• Тщательно вымойте тату тёплой водой и мягким мылом.\n• Аккуратно промокните.\n• Нанесите тонкий слой крема.\nВ последующие дни:\n• Мойте тату 2–3 раза в день.\n• Каждый раз наносите тонкий слой крема.\n• Кожа не должна пересыхать, но и не «задыхаться».\n\nВажно для обоих вариантов\n• Не чешите и не трите.\n• Не сдирайте корочки и шелушения.\n• Не принимайте ванну, не ходите в сауну, солярий и бассейн минимум 2–3 недели.\n• Избегайте прямого солнца.\n• Носите свободную, чистую одежду поверх тату.\n\nПроцесс заживления\n• В первые дни кожа может краснеть, быть чувствительной или слегка опухшей — это нормально.\n• Зуд — часть заживления, не чешите.\n• Полное заживление около 2–4 недель, глубокие слои — дольше.\n\nЕсли сомневаетесь или есть вопросы — пишите в любое время.\nМы поддерживаем вас и после сеанса — ваше самочувствие важно для нас.",
                'it' => "Una buona cura è decisiva per un risultato bello e duraturo.\nSegui queste indicazioni — aiutano la pelle a guarire al meglio.\n\nOpzione 1 — Guarigione con pellicola protettiva (Second Skin)\nDopo il tatuaggio viene applicata una pellicola protettiva sulla pelle.\n• La pellicola resta sulla pelle 3–5 giorni, in base alla raccomandazione del maestro.\n• In questo periodo protegge il tatuaggio da batteri, sfregamento e sporco.\n• Se si raccoglie liquido sotto la pellicola, è normale.\n• Se la pellicola si stacca prima o dà fastidio, rimuovila con delicatezza.\nDopo la rimozione:\n• Lava il tatuaggio con acqua tiepida e sapone delicato senza profumo.\n• Asciuga la pelle tamponando (non strofinare).\n• Applica uno strato sottile di crema per tatuaggi.\n• Cura il tatuaggio 2–3 volte al giorno.\n\nOpzione 2 — Guarigione con compressa\nDopo l'appuntamento il tatuaggio viene coperto con una compressa.\n• Rimuovi la compressa dopo 1,5–2 ore.\n• Lava bene il tatuaggio con acqua tiepida e sapone delicato.\n• Asciuga tamponando.\n• Applica uno strato sottile di crema.\nNei giorni seguenti:\n• Lava il tatuaggio 2–3 volte al giorno.\n• Applica ogni volta uno strato sottile di crema.\n• La pelle non deve seccarsi né \"soffocare\".\n\nNote importanti per entrambe le opzioni\n• Evita di grattarti o strofinare.\n• Non tirare croste o desquamazioni.\n• Niente bagno, sauna, lettini o piscina per almeno 2–3 settimane.\n• Evita il sole diretto.\n• Indossa indumenti larghi e puliti sul tatuaggio.\n\nProcesso di guarigione\n• Nei primi giorni la pelle può essere arrossata, sensibile o leggermente gonfia — è normale.\n• Il prurito fa parte della guarigione, evita di grattarti.\n• La guarigione completa richiede circa 2–4 settimane, gli strati più profondi più a lungo.\n\nSe hai dubbi o domande, contattaci quando vuoi.\nTi seguiamo anche dopo il tatuaggio — il tuo benessere ci sta a cuore.",
            ],
        ];
        $defaultImages = [
            '/about/uberuns-1.png', '/about/uberuns-2.png', '/about/uberuns-3.png',
            '/about/uberuns-4.png', '/about/uberuns-5.png', '/about/uberuns-6.png',
            '/about/uberuns-7.png', '/about/uberuns-8.png', '/about/uberuns-9.png',
            '/about/uberuns-10.png',
        ];
        $locales = ['de', 'en', 'ru', 'it'];
        $imageIndex = 0;
        foreach ($guideSlugs as $g) {
            $guide = InfoGuide::firstOrCreate(
                ['slug' => $g['slug']],
                ['sort_order' => $g['sort_order']]
            );
            foreach ($locales as $locale) {
                $title = $titlesBySlug[$g['slug']][$locale] ?? $g['slug'];
                $content = $contentBySlugLocale[$g['slug']][$locale] ?? 'Content for ' . $g['slug'] . ' (' . $locale . '). Edit in admin.';
                InfoGuideTranslation::updateOrCreate(
                    ['info_guide_id' => $guide->id, 'locale' => $locale],
                    ['title' => $title, 'content' => $content]
                );
            }
            if ($guide->images()->count() === 0) {
                for ($i = 0; $i < 3; $i++) {
                    $guide->images()->create([
                        'image' => $defaultImages[$imageIndex % count($defaultImages)],
                        'alt' => null,
                        'sort_order' => $i,
                    ]);
                    $imageIndex++;
                }
            }
        }
    }
}
