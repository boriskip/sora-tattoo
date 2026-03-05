<?php

namespace Database\Seeders;

use App\Models\LegalPage;
use Illuminate\Database\Seeder;

class LegalPageSeeder extends Seeder
{
    public function run(): void
    {
        $locales = [
            'de' => [
                'impressum_title' => 'Impressum',
                'impressum_content' => "Angaben gemäß § 5 TMG\n\n[Name/Unternehmen]\n[Adresse]\n[PLZ und Ort]\n\nKontakt: [E-Mail oder Telefon]\n\nVerantwortlich für den Inhalt nach § 55 Abs. 2 RStV: [Name], [Adresse]\n\nHinweis: Bitte ersetzen Sie die Platzhalter in Klammern durch Ihre tatsächlichen Angaben. Bei Gewerbetreibenden ggf. USt-IdNr., Handelsregister, Berufsbezeichnung und -kammer angeben.",
                'privacy_title' => 'Datenschutzerklärung',
                'privacy_content' => "Verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist [Name/Anschrift].\n\nKontaktformular: Die über das Kontaktformular übermittelten Daten (Name, Kontaktangaben, Nachricht) werden ausschließlich zur Bearbeitung Ihrer Anfrage verarbeitet und gespeichert. Rechtsgrundlage ist Ihre Einwilligung bzw. unser berechtigtes Interesse an der Beantwortung von Anfragen. Die Daten werden gelöscht, sobald die Anfrage abgeschlossen ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.\n\nCookies: Diese Website setzt derzeit nur technisch notwendige Cookies (z. B. für die Session). Es erfolgt kein Tracking ohne Ihre Einwilligung.\n\nIhre Rechte: Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten sowie auf Datenübertragbarkeit. Sie können sich bei der zuständigen Aufsichtsbehörde beschweren.\n\nHinweis: Bitte passen Sie die Angaben an Ihre tatsächliche Datenverarbeitung an. Bei Nutzung von Google Analytics o. Ä. muss die Datenschutzerklärung entsprechend ergänzt werden.",
            ],
            'en' => [
                'impressum_title' => 'Imprint',
                'impressum_content' => "Information according to § 5 TMG (Germany)\n\n[Company/Name]\n[Address]\n[Postal code and city]\n\nContact: [Email or phone]\n\nResponsible for content per § 55 Abs. 2 RStV: [Name], [Address]\n\nPlease replace the placeholders with your actual details. For businesses, add VAT ID, trade register, and professional body if applicable.",
                'privacy_title' => 'Privacy Policy',
                'privacy_content' => "The data controller for this website is [Name/Address].\n\nContact form: Data submitted via the contact form (name, contact details, message) is processed and stored only to handle your request. Legal basis is your consent or our legitimate interest in responding to enquiries. Data is deleted once the request is completed, unless legal retention obligations apply.\n\nCookies: This site currently uses only technically necessary cookies (e.g. for session). No tracking takes place without your consent.\n\nYour rights: You have the right to access, rectify, erase, and restrict processing of your personal data, and to data portability. You may lodge a complaint with a supervisory authority.\n\nPlease adapt this text to your actual data processing. If you use Google Analytics or similar, the privacy policy must be updated accordingly.",
            ],
            'ru' => [
                'impressum_title' => 'Импрессум',
                'impressum_content' => "Информация согласно § 5 TMG (Германия)\n\n[Название/Имя]\n[Адрес]\n[Индекс и город]\n\nКонтакт: [Email или телефон]\n\nОтветственный за контент по § 55 Abs. 2 RStV: [Имя], [Адрес]\n\nЗамените плейсхолдеры на ваши данные. Для предпринимателей укажите USt-IdNr., реестр, проф. объединение при необходимости.",
                'privacy_title' => 'Политика конфиденциальности',
                'privacy_content' => "Ответственный за обработку данных на этом сайте: [Имя/Адрес].\n\nКонтактная форма: данные, отправленные через форму (имя, контакты, сообщение), обрабатываются только для ответа на запрос. Основание — ваше согласие или наш законный интерес. Данные удаляются после завершения запроса, если нет обязанности хранения.\n\nCookies: сайт использует только технически необходимые cookies. Трекинг не применяется без вашего согласия.\n\nВаши права: доступ, исправление, удаление, ограничение обработки, переносимость данных, право на жалобу в надзорный орган.\n\nАдаптируйте текст под вашу практику. При использовании Google Analytics и т.п. дополните политику.",
            ],
            'it' => [
                'impressum_title' => 'Impronta legale',
                'impressum_content' => "Informazioni secondo § 5 TMG (Germania)\n\n[Nome/Azienda]\n[Indirizzo]\n[CAP e città]\n\nContatto: [Email o telefono]\n\nResponsabile dei contenuti (§ 55 Abs. 2 RStV): [Nome], [Indirizzo]\n\nSostituire i segnaposto con i dati reali. Per attività commerciali indicare P.IVA, registro, ordine professionale se richiesto.",
                'privacy_title' => 'Privacy',
                'privacy_content' => "Titolare del trattamento per questo sito: [Nome/Indirizzo].\n\nModulo di contatto: i dati inviati (nome, contatto, messaggio) sono trattati solo per rispondere alla richiesta. Base giuridica: consenso o legittimo interesse. I dati sono eliminati a richiesta conclusa, salvo obblighi di conservazione.\n\nCookie: il sito utilizza solo cookie tecnici necessari. Nessun tracking senza consenso.\n\nDiritti: accesso, rettifica, cancellazione, limitazione, portabilità, reclamo all'autorità.\n\nAdattare il testo alla propria pratica. In caso di uso di Google Analytics ecc., integrare la privacy policy.",
            ],
        ];

        foreach ($locales as $locale => $content) {
            LegalPage::updateOrCreate(
                ['locale' => $locale],
                array_merge($content, ['locale' => $locale])
            );
        }
    }
}
