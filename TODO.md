# SORA TATTOO - Projekto TODO ir Specifikacija

## 📋 Projekto tikslas ir principai

### Tikslas
Sukurti modernų, estetišką tattoo/portfolio tipo puslapį, kuris:
- Gražiai pristato meistrą (-us) ir darbus
- Turi informacinę dalį "mėgstantiems paskaityti"
- Skatina registraciją (CTA), kontaktą per formą ir/ar messenger
- Yra paruoštas plėtrai: dabar 1 meistras, vėliau 2–6 meistrai be perstatymo

### Dizaino kryptis
- **Fonas**: molinis/melžinis (šiltas), tekstai nuo tamsiai pilko iki švelniai pilko
- **Subtilus "tūmo" efektas**: šiltas, ne šaltas, ne per stiprus (išlaikyti skaitomumą)
- **Tipografika**: Cormorant Garamond antraštėms (ir galima daliai teksto)
- **UX taisyklė**: Animacijos matomos, bet negali lėtinti, negali trukdyti skaityti, turi gerbti `prefers-reduced-motion`

### Daugiakalbystė (i18n)
- **Pagrindinė kalba**: Vokiečių (DE) - `/de` arba default
- **Sekanti kalba**: Anglų (EN) - `/en`
- **Kalbos perjungimas**: Header'e (DE/EN selector)
- **SEO**: Kiekvienas puslapis turi hreflang tags
- **URL struktūra**: `/de/`, `/en/`, `/de/masters/[slug]`, `/en/masters/[slug]`
- **Backend**: Laravel turi palaikyti daugiakalbius laukus (JSON arba atskiros lentelės)
- **Frontend**: Next.js i18n routing (next-intl arba next-i18next)

---

## 🏗️ Svetainės struktūra (puslapiai / maršrutai)

### 2.1. Pagrindinis puslapis (Landing / Home)
- Vieno puslapio struktūra su sekcijomis ir anchor menu (greitas navigavimas)

### 2.2. Meistro puslapiai (SEO + dalinimasis nuoroda)
- `/masters/[slug]` – kiekvienam meistrui atskiras puslapis su darbais, stiliais, kontaktu, registracija
- Net jei naudojama modalka (pop-up) pagrindiniame puslapyje, puslapiai reikalingi SEO ir nuorodoms

### 2.3. Informaciniai puslapiai (optional, bet rekomenduojama SEO)
- `/info/[slug]` (pvz. kaip pasiruošti, aftercare ir t. t.)
- Jei pradžioje nenori daug puslapių – galima pradėti nuo "Info" sekcijos Home, o vėliau išplėsti į atskirus puslapius

---

## 🎨 Pagrindinio puslapio karkasas (sekcijos)

### 0) Header (fiksuotas)
- [x] Logotipas (round, w-16 h-16)
- [x] Anchor nuorodos: Darbai / Meistrai / Stiliai / Informacija / Atsiliepimai / Kontaktai
- [x] CTA mygtukas: „Užsirašyti" (visada matomas)
- [x] Kalbos perjungiklis (DE/EN)
- [x] Social ikonos (Facebook, WhatsApp, Instagram)
- [x] Responsive burger menu
- [x] Scroll efektas: dingsta scroll down, atsiranda scroll up

### 1) Hero (pirmas ekranas)
- [x] Background image (hero-background.png)
- [x] Pavadinimas: SORA TATTOO
- [x] 1–2 sakiniai apie stilių/požiūrį
- [x] Mygtukai: Užsirašyti + Žiūrėti darbus
- [x] Kontaktų ikonėlės (Facebook, WhatsApp, Instagram)
- [x] **Scroll efektas**: Hero dingsta kai scrollini
  - Desktop: fullscreen su scroll fade
  - Mobile: optimizuotas aukštis
  - Technika: `useScroll` hook + `opacity`/`transform` animacija
  - Content (text + buttons) fade out on scroll
  - Background fade out completely when About section covers it
- [x] **"Tūmo" efektas**: Gradient overlay (šiltas tonas)
  - Užtikrina teksto skaitomumą ant background
- [x] **Performance**: Statinis background image, optimizuotas

### 2) Meistrai (1/2/3 kortelės – dabar 1, vėliau daugiau)
- [x] Kortelės (vertikali struktūra, paruoštas plėtrai):
  - Foto, vardas
  - Stilių "badge": Japanese Style / Japanese · Realism · Graphic / Minimal · Fine Line · Micro Realism
  - 1 trumpas aprašymas
  - Mygtukai: Darbai / Užsirašyti (veikia, naviguoja į works/contact sekcijas)
- [x] Horizontalus scroll galerija su darbais (viršuje, prieš artist korteles)
  - Scroll mygtukai (kairė/dešinė) - veikia
  - 20 placeholder darbų
  - Smooth scroll, touch scroll support
- [ ] Elgsena paspaudus „Darbai":
  - Atsidaro modalka (pop-up) su meistro profiliu ir jo darbų slideriu
  - Modal'ui viduje: CTA „Užsirašyti", filtras pagal stilių, mini info
- [ ] Papildomai: modal'e mygtukas „Atidaryti meistro puslapį" → `/masters/[slug]`

### 3) Bendra galerija (visi darbai)
- [x] Grid (3 stulpeliai desktop, 2 tablet, 1 mobile)
- [x] Filtrai: stilius (All, Japanese, Realism, Minimal, Graphic) - veikia
- [x] Animacijos: re-trigger on every scroll
- [ ] Paspaudus darbą: lightbox / slider su pilnu vaizdu, aprašu, tagais, ir mygtuku Užsirašyti pas meistrą

### 4) Stiliai (3 kortelės)
- [x] Trys aiškios kategorijos:
  - Realizmas
  - Japoniškas
  - Grafika
- [x] Kiekvienoje:
  - 2–3 eilutės aprašymo
  - „Žiūrėti pavyzdžius" mygtukas
- [ ] Automatiškai filtruoti galeriją paspaudus

### 5) Informacija (žmonėms, kurie nori suprasti)
- [x] Sekcija su akordeonu/tabais:
  - Kaip išsirinkti meistrą (Wie wählt man den richtigen Tattoo-Artist?)
  - Kaip pasiruošti seansui (Wie bereite ich mich auf einen Tattoo-Termin vor?)
  - Kas bus per seansą (Was erwartet mich während des Tattoo-Session?)
  - Priežiūra po tatuiruotės (Tattoo-Pflege & Heilung) - su 2 variantais
- [x] Kiekvienam punktui:
  - Aiškūs bullet'ai
  - Vokiečių tekstai (kliento pateikti)
- [ ] Jei vėliau nori SEO: kiekvienas punktas turi "Skaityti daugiau" į `/info/[slug]`

### 6) Laisvos datos
- [ ] Horizontalus artimiausių datų sąrašas (slideris)
- [ ] Paspaudus datą → atidaro registracijos formą / scroll į registraciją
- [ ] Alternatyviai: rodyti "artimiausios vietos" + "rašyk, jei skubu"

### 7) Atsiliepimai
- [x] Grid su atsiliepimų kortelėmis (6 kortelės)
- [x] Mygtukas "Bewertung hinterlassen" (Leave Review)
- [x] Modal forma su atsiliepimo laukais (Name, Rating, Message)
- [ ] Jei turėsi šaltinius: Google / IG screenshot'ai – galima vėliau pridėti

### 8) Kontaktai + Registracija
- [x] Kontaktai (Berlin, Deutschland, Öffnungszeiten: Nach Vereinbarung)
- [x] Forma su:
  - Vardas
  - Kontaktas (tel/IG)
  - Norima vieta ant kūno
  - Stilius (realizmas/japon/grafika)
  - Pageidaujama data
  - Žinutė
  - CTA: Užsirašyti
- [ ] Failų įkėlimas (ref foto) - TODO

### 9) Footer
- [x] Social ikonos, kontaktai, minimalios nuorodos

---

## 🔧 Backend (Laravel) – duomenų modelis ir admin logika

### 4.1. Pagrindinės lentelės / modeliai

#### artists (meistrai)
- [ ] `id`, `name`, `slug`, `avatar`, `bio_short`, `bio_full`
- [ ] **Daugiakalbystė**: `name`, `bio_short`, `bio_full` kaip JSON: `{"de": "...", "en": "..."}` arba atskiros lentelės
- [ ] `styles` (gal per pivot)
- [ ] `contacts` (json: IG, telegram, whatsapp)
- [ ] `is_active`, `sort_order`

#### works (darbai)
- [ ] `id`, `artist_id`
- [ ] `title` (optional), `description` (optional) - **Daugiakalbystė**: JSON arba atskiros lentelės
- [ ] `media` (nuotraukos/video) – galima per atskirą lentelę
- [ ] `tags`: style, body_part, size (optional)
- [ ] `is_featured` (rodyti ant home), `created_at`

#### styles (stiliai)
- [ ] `id`, `name`, `slug` (realism, japanese, graphic)
- [ ] `short_description` - **Daugiakalbystė**: JSON arba atskiros lentelės

#### guides (info straipsniai / blokai)
- [ ] `id`, `title`, `slug`, `category`, `content` (rich text / markdown)
- [ ] **Daugiakalbystė**: `title`, `content` kaip JSON arba atskiros lentelės
- [ ] `cover_image`, `gallery_images`
- [ ] `is_published`, `sort_order`

#### reviews (atsiliepimai)
- [ ] `id`, `author_name`, `rating` (optional), `text`, `source` (optional), `image` (optional), `is_published`

#### availability (laisvos datos)
- [ ] `id`, `date`, `is_available`, `note` (optional)

#### bookings (užklausos)
- [ ] `id`, `name`, `contact`, `message`, `style_id`, `preferred_date`
- [ ] `attachments` (refs), `status` (new/in_progress/done)
- [ ] `created_at`

### 4.2. Admin panelė
- [ ] CRUD: Meistrai
- [ ] CRUD: Darbai
- [ ] CRUD: Info
- [ ] CRUD: Atsiliepimai
- [ ] CRUD: Laisvos datos
- [ ] CRUD: Registracijos užklausos
- [ ] Svarbu: kad pridėti naują meistrą būtų „+1 įrašas" ir viskas automatiškai atsirastų front'e

### 4.3. API (REST)
- [ ] `GET /api/artists?locale=de|en` (arba per Accept-Language header)
- [ ] `GET /api/artists/{slug}?locale=de|en`
- [ ] `GET /api/works?artist=&style=&locale=de|en`
- [ ] `GET /api/styles?locale=de|en`
- [ ] `GET /api/guides?locale=de|en`
- [ ] `GET /api/availability`
- [ ] `POST /api/bookings` (su failais)
- [ ] **Daugiakalbystė**: Visi API endpoint'ai turi grąžinti turinį pagal `locale` parametrą

---

## ⚛️ Frontend (Next.js) – komponentai ir puslapių struktūra

### 5.1. Puslapiai
- [ ] `/` arba `/de` – Home (sekcijos) - vokiečių kalba (default)
- [ ] `/en` – Home (sekcijos) - anglų kalba
- [ ] `/de/masters/[slug]` – meistro puslapis (vokiečių)
- [ ] `/en/masters/[slug]` – meistro puslapis (anglų)
- [ ] `/de/info/[slug]` – info straipsnis (optional, vokiečių)
- [ ] `/en/info/[slug]` – info straipsnis (optional, anglų)
- [ ] `sitemap.xml`, `robots.txt` (SEO su hreflang)
- [ ] **Daugiakalbystė**: Next.js i18n routing (next-intl arba next-i18next)

### 5.2. Komponentai
- [ ] `Header` (anchor + CTA + **kalbos perjungiklis DE/EN**)
- [ ] `Logo` (mėnulis SVG)
  - SVG komponentas su animacija (tik mėnulis, be debesų)
  - Responsive skaliuojimas
  - Mėnulis su subtili animacija (fade-in, pulsavimas)
- [ ] `Hero` (su background video/animacija - žr. Hero sekciją)
  - Video background su vėju, debesimis, mėnuliu
  - Scroll fade efektas (dingsta kai scrollini)
  - Parallax efektas (optional)
  - Responsive: mobile optimizacija (galbūt statinis background)
  - `useScroll` hook scroll animacijai
- [ ] `ArtistGrid` + `ArtistCard`
- [ ] `ArtistModal` (profilis + slider)
- [ ] `GalleryGrid` + `WorkLightbox`
- [ ] `StyleCards`
- [ ] `InfoAccordion/Tabs`
- [ ] `AvailabilitySlider`
- [ ] `ReviewsSlider`
- [ ] `BookingForm`
- [ ] `Footer`
- [ ] **Daugiakalbystė**: Visi komponentai naudoja i18n hook'us/context'ą

### 5.3. Media
- [ ] `next/image` su tinkamais sizes
- [ ] Lazy-load galerijoms
- [ ] Optimizacija: WebP/AVIF

---

## 🎬 Animacijos (įtraukiam į planą kaip atskirą sluoksnį)

### 6.1. Bazinis animacijų sprendimas (rekomenduojamas)
- [ ] Framer Motion visoms reveal / stagger / modal animacijoms
- [ ] Scroll trigger: IntersectionObserver (arba framer viewport props)

### 6.2. "WOW" animacijos (tik 1–2 vietose)
- [ ] Optional: GSAP + ScrollTrigger hero arba vienai premium sekcijai (pvz. galerijos įžangai)
- [ ] Naudoti ribotai, kad nebūtų per sunku

### 6.3. Animacijų preset'ai (vienodi visur)
- [ ] **Hero Scroll Fade**: Hero sekcija dingsta kai scrollini
  - Technika: `useScroll` hook + Framer Motion `useTransform`
  - Efektas: `opacity` 1→0, galbūt `y` transformacija
  - Desktop: hero gali būti per pusę ekrano (50vh) arba fullscreen su fade
  - Mobile: optimizuotas aukštis
- [ ] **Logo Animation** (mėnulis):
  - Mėnulis: `opacity` 0→1 fade-in, `scale` 0→1, švelnus pulsavimas
  - SVG `animate` su opacity animacija
  - Subtili, elegantiška animacija
- [ ] **Parallax Background** (optional hero video):
  - Video background lėčiau juda nei foreground content
  - Technika: `useScroll` + `transform: translateY()` su skirtingais greičiais
- [ ] **Section Reveal**: opacity 0→1, y 18→0, 0.6–0.9s, easeOut
- [ ] **Split Reveal**: tekstas iš kairės, foto iš dešinės, su stagger viduje
- [ ] **Grid Stagger**: kortelės įeina viena po kitos (meistrai, atsiliepimai)
- [ ] **Modal Motion**: švelnus scale + fade, uždarymas atgal

### 6.4. Accessibility ir performance
- [ ] `prefers-reduced-motion` → minimalios animacijos
- [ ] Blur/tūmas ne per stiprus (iPhone performance)
- [ ] Jokių sunkių efektų ant kiekvienos nuotraukos scroll'e

---

## 🎨 UI stiliaus gairės (kad būtų vieninga)

- [ ] Fonas: melžinis/šiltas, sekcijų alternavimas vos matomu tonu
- [ ] Tekstas: pastraipos tik tamsiai pilkos (ne šviesios)
- [ ] Cormorant Garamond: antraštėms ir akcentams
- [ ] Mygtukai: šiltas akcentas, aiškus hover
- [ ] Daug "oro": tvarkingi spacing (12/16/24/32/48/64)

---

## 🚀 MVP įgyvendinimo etapai (praktinis planas)

### Etapas 1 – Bazinis karkasas (MVP)
- [x] Home su visomis sekcijomis (placeholder foto)
- [x] **Hero sekcija**: Background image, scroll fade efektas
- [x] 1 meistras, darbai, galerija, info, kontaktai, booking form
- [ ] Admin: meistrai + darbai + info + bookings
- [x] **Daugiakalbystės bazė**: i18n setup, kalbos perjungiklis, baziniai vertimai (DE/EN)

### Etapas 2 – Modalka + slideriai + filtrai + Hero poliravimas
- [ ] Artist modal su slideriu (pagal meistrą)
- [ ] Work lightbox
- [ ] Filtrai pagal stilių/meistrą
- [ ] **Hero scroll efektas**: Hero dingsta kai scrollini (useScroll hook)
- [ ] **Hero video optimizacija**: WebM/MP4, poster image, mobile fallback

### Etapas 3 – Animacijos
- [ ] **Logo animacija**: mėnulis animacija (SVG/CSS)
- [ ] Framer Motion preset'ai visoms sekcijoms
- [ ] Modal animacijos
- [ ] Hero parallax efektas (optional)
- [ ] 1 wow sekcija (optional GSAP)

### Etapas 4 – SEO / turinio plėtra
- [ ] Meistrų puslapiai `/masters/[slug]`
- [ ] Info puslapiai `/info/[slug]` (jei norėsi)
- [ ] Struktūriniai meta, sitemap

### Etapas 5 – Poliravimas
- [ ] Performance optimizacijos
- [ ] Mobilus UI
- [ ] Formos patogumas, validacijos, failų įkėlimas

---

## 📦 Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Laravel (PHP)
- **Infrastructure**: Docker + Nginx
- **Deployment**: GitHub Actions
- **Animations**: Framer Motion (+ optional GSAP)
- **Styling**: (nustatyti: Tailwind CSS / CSS Modules / Styled Components)
- **i18n**: next-intl (Next.js) + Laravel localization
- **Hero Background**: CSS animations (rekomenduojama) arba optimizuotas video

---

## ✅ Rezultatas (ką gausi "ant išėjimo")

Pilnai veikiantis modernus tattoo landing su:
- [ ] Meistrų kortelėmis (dabar 1, paruošta daugiau)
- [ ] Darbų galerija + lightbox
- [ ] Informacine sekcija "mėgstantiems skaityti"
- [ ] Laisvų datų juosta
- [ ] Atsiliepimai
- [ ] Registracijos forma + kontaktai
- [ ] Admin panelė, kur:
  - Pridedi meistrą → automatiškai atsiranda kortelė ir jo darbai
  - Pridedi darbą → atsiranda galerijoje ir meistro slider'yje
  - Valdai info tekstus ir datas
- [ ] Matomos, gražios scroll animacijos (neperkrautos)

---

## 📝 Pastabos

- Visi komponentai turi būti responsive
- SEO optimizacija kiekvienam puslapiui (su hreflang tags)
- Formos validacija ir error handling
- Loading states visur, kur reikia
- Error boundaries kritinėms sekcijoms
- **Daugiakalbystė**: Visi tekstai turi būti per i18n, jokių hardcoded string'ų
- **Hero background**: Testuoti performance (Lighthouse), ypač mobiliuose įrenginiuose

