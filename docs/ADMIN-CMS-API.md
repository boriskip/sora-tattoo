# Admin CMS & Public API – Sora Tattoo

Trumpa apžvalga: kokie blokai valdomi per backend, kokie API endpoint'ai ir kaip juos naudoti.

---

## 1. Kas valdoma (blokai)

| Blokas | Kas redaguojama | Pastabos |
|--------|------------------|----------|
| **Hero** | Fono nuotrauka, social ikonų tema (šviesios/tamsios), pagrindinė antraštė, po ja dvi antraštės (title_sub, subtitle), aprašymas, social nuorodos (FB, IG, WA) | Viena įrašas (`hero_settings`) |
| **About** | Atskiras blokas „About us“: antraštė, tekstas, **sliderio nuotraukų sąrašas** (masyvas) | Viena sekcija (`about_sections`) |
| **Masters** | Jau yra: **Artists** + **Works** (CRUD per admin) | Žiūrėk `ArtistController`, `Work` modelį |
| **Styles** | Kiekvienam stiliui: pavadinimas, aprašymas, **thumbnail slider** – nuotraukų sąrašas (style_images) | Lentelės `styles`, `style_images` |
| **Reviews** | Atsiliepimų **patvirtinimas** (pending → approved) ir **redagavimas** (autorius, tekstas, reitingas) | Lentelė `reviews`, laukas `status`: `pending` \| `approved` |

---

## 2. Vieši API (be auth)

Naudojami frontende, kad rodytų turinį.

| Method | Endpoint | Aprašymas |
|--------|----------|------------|
| GET | `/api/hero-settings` | Hero nustatymai (fonas, social theme, antraštės, nuorodos) |
| GET | `/api/about` | About sekcija (title, content, images[]) |
| GET | `/api/styles` | Visi stiliai su `images` (thumbnail slider) |
| GET | `/api/reviews` | Tik **approved** atsiliepimai |
| POST | `/api/reviews` | Pateikti naują atsiliepimą (body: `author`, `text`, `rating`) → sukuriamas su `status: pending` |

**Artists / Works** (jau buvo):

- GET `/api/artists`
- GET `/api/artists/{slug}`

---

## 3. Login (admin)

- **POST** `/api/login` — body: `{ "email": "...", "password": "..." }` → atsakyme `{ "token": "...", "user": { "id", "name", "email" } }`.
- **POST** `/api/logout` — reikia header `Authorization: Bearer <token>`; atsijungia (revokina token).
- **GET** `/api/user` — su token grąžina dabartinį vartotoją.

**Numatytas admin vartotojas** (po seed): `admin@sora-tattoo.local` / `admin123`.

**Frontend admin:** `/admin/login` — prisijungimo forma; `/admin` — dashboard (po prisijungimo). Token saugomas `sessionStorage`; visi admin API kvietimai turi siųsti headerį `Authorization: Bearer <token>`.

---

## 4. Admin API (reikia `Authorization: Bearer <token>`)

Visi admin maršrutai po prefiksu `/api/admin` apsaugoti `auth:sanctum`. Pirmiausia reikia **login** (žr. skyrių 3).

### Hero

| Method | Endpoint | Aprašymas |
|--------|----------|-----------|
| GET | `/api/admin/hero-settings` | Gauti dabartinius nustatymus |
| PUT | `/api/admin/hero-settings` | Atnaujinti (background_image, social_icons_theme, title_main, …) |
| POST | `/api/admin/hero-settings/upload-background` | Įkelti fono paveikslą iš failo (multipart `background`: JPEG/PNG/WebP, iki 5 MB). Atsakyme `{ "url": "…" }` — šį URL įrašyti į `background_image`. |

**Backend:** vieną kartą paleisti `php artisan storage:link`, kad `/storage` rodytų į `storage/app/public` (įkelti failai saugomi `storage/app/public/hero/`).

### About

| Method | Endpoint | Aprašymas |
|--------|----------|-----------|
| GET | `/api/admin/about` | Gauti about sekciją |
| PUT | `/api/admin/about` | Atnaujinti (title, content, images – masyvas kelio stringų) |

### Styles (stiliai + nuotraukos)

| Method | Endpoint | Aprašymas |
|--------|----------|-----------|
| GET | `/api/admin/styles` | Sąrašas stilių su images |
| POST | `/api/admin/styles` | Sukurti stilių (name, slug optional, description, sort_order) |
| GET | `/api/admin/styles/{id}` | Vienas stilius su images |
| PUT | `/api/admin/styles/{id}` | Atnaujinti stilių |
| DELETE | `/api/admin/styles/{id}` | Ištrinti stilių |
| POST | `/api/admin/styles/{id}/images` | Pridėti nuotrauką (body: `image` path, optional `sort_order`) |
| DELETE | `/api/admin/styles/{styleId}/images/{imageId}` | Ištrinti nuotrauką |

### Reviews (patvirtinimas + redagavimas)

| Method | Endpoint | Aprašymas |
|--------|----------|-----------|
| GET | `/api/admin/reviews` | Visi atsiliepimai (query: `?status=pending` arba `?status=approved`) |
| GET | `/api/admin/reviews/{id}` | Vienas atsiliepimas |
| PUT | `/api/admin/reviews/{id}` | Redaguoti (author, text, rating, **status**) |
| DELETE | `/api/admin/reviews/{id}` | Ištrinti |
| POST | `/api/admin/reviews/{id}/approve` | Patvirtinti (nustato `status: approved`) |

---

## 5. Backend struktūra (Laravel)

- **Migracijos**: `hero_settings`, `about_sections`, `styles`, `style_images`, `reviews`
- **Modeliai**: `HeroSetting`, `AboutSection`, `Style`, `StyleImage`, `Review`
- **Vieši kontroleriai**: `Api\HeroSettingsController`, `AboutController`, `StyleController`, `ReviewController`
- **Admin kontroleriai**: `Api\Admin\HeroSettingsController`, `AboutController`, `StyleController`, `ReviewController`
- **Seedai**: `HeroSettingSeeder`, `AboutSectionSeeder`, `StyleSeeder` (default reikšmės)

Failų upload (fonas, about/images, style_images) kol kas laukiami kaip **path stringai** (URL arba kelias). Galima vėliau pridėti POST endpoint'us su `multipart/form-data` ir `Storage::put()`.

---

## 6. Frontend: ką pritaikyti

1. **Hero** – naudoti `GET /api/hero-settings`:  
   fono paveikslas iš `background_image`, antraštės iš `title_main`, `title_sub`, `subtitle`, `description`, social nuorodos iš atitinkamų laukų.  
   Iš `social_icons_theme` (light/dark) rodyti atitinkamas **šviesias arba tamsias** social ikonas.

2. **About** – naudoti `GET /api/about`:  
   slideriui naudoti `data.images[]`, antraštei ir tekstui – `data.title`, `data.content`.

3. **Styles** – naudoti `GET /api/styles`:  
   kiekvienam stiliui rodyti `name`, `description` ir thumbnail slider iš `images[]`.

4. **Reviews** – naudoti `GET /api/reviews` (tik approved).  
   Forma „Palikti atsiliepimą“ – `POST /api/reviews` su `author`, `text`, `rating`.

5. **Admin panelė** – atskiras UI (pvz. Next.js `/admin`):  
   login → token → visi kvietimai su `Authorization: Bearer <token>`.  
   CRUD atitinka lenteles aukščiau (Hero 1 įrašas, About 1 įrašas, Styles + images, Reviews + approve).

---

## 7. Autentifikacija adminui

- **Login** įgyvendintas: POST `/api/login`, GET `/api/user`, POST `/api/logout`.
- Vartotojai saugomi Laravel `users` lentelėje; admin vartotojas sukuriamas per `AdminUserSeeder` (email: admin@sora-tattoo.local, password: admin123).
- Admin UI: `/admin/login` (forma), `/admin` (dashboard); token saugomas sessionStorage, siunčiamas su kiekvienu admin API request.
