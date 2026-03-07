# SORA TATTOO

Tattoo portfolio svetainė: Next.js (frontend) ir Laravel (backend API). Lokaliai – Docker; produkcijoje – Vercel + Hetzner.

---

## Projektas

- **Svetainė:** [soratattoo.de](https://soratattoo.de) (DE, EN, RU, IT)
- **API:** [api.soratattoo.de](https://api.soratattoo.de)
- **Admin:** soratattoo.de/de/admin (arba /en/admin, …) – turinio valdymas

Funkcionalumas: hero, apie mus, meistrai, darbai, stiliai, informacija, atsiliepimai, kontaktas, Impressum/Privacy, admin panelė (hero, about, artists, works, styles, reviews, info, contact, legal).

---

## Stekas (tech stack)

| Sluoksnis   | Technologijos |
|------------|----------------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion, next-intl (i18n) |
| **Backend**  | Laravel 11, PHP 8.2, MySQL 8, Sanctum (auth) |
| **Hosting**  | Frontend: Vercel. Backend: Hetzner Cloud (Ubuntu 24.04, Nginx, PHP-FPM) |
| **SSL**      | Let's Encrypt (Vercel ir Certbot serveryje) |
| **CI/CD**    | Vercel auto-deploy (frontend). GitHub Actions – backend deploy į Hetzner |

---

## Deploy (klientui)

### Kaip veikia

- **Frontend:** Kiekvienas `git push` į `main` → Vercel automatiškai buildina ir atnaujina [soratattoo.de](https://soratattoo.de). Nustatymai ir domenas – Vercel dashboard.
- **Backend:** Keičiant `backend/` arba `deploy/` ir pushinant į `main` → GitHub Actions prisijungia prie serverio (SSH), atsisiunčia kodą, paleidžia `composer install`, `artisan migrate`, cache. Serveryje kodas: `/var/www/repo`, API: [api.soratattoo.de](https://api.soratattoo.de).

### Domenai ir serveriai

| Domenas | Kur hostinama | Pastaba |
|---------|----------------|--------|
| soratattoo.de, www.soratattoo.de | Vercel | Frontend |
| api.soratattoo.de | Hetzner VPS (77.42.43.45) | Laravel API |

DNS (pas domeno registratorių): @ ir www → Vercel; api → Hetzner serverio IP.

### Kas reikalinga klientui

- **GitHub:** prieiga prie repo (boriskip/sora-tattoo), jei nori matyti Actions / istoriją.
- **Vercel:** prieiga prie projekto (soratattoo.de), env kintamieji (pvz. `NEXT_PUBLIC_API_URL`).
- **Hetzner Cloud:** prieiga prie serverio (SSH arba konsolė) – tik jei reikia rankinio deploy ar logų. Kasdieniam atnaujinimui pakanka GitHub Actions (secrets jau nustatyti).

### Atnaujinti turinį

- **Kodas / funkcionalumas:** pakeitimai lokaliai → `git push` į `main`. Frontend atnaujina Vercel, backend – GitHub Action.
- **Tik turinys (tekstai, nuotraukos):** per admin panelę [soratattoo.de/de/admin](https://soratattoo.de/de/admin) – nereikia deploy.

---

## Lokalūs development

### Reikalavimai

- Docker & Docker Compose  
- Node.js 18+  
- PHP 8.2+ (jei backend paleidžiamas ne per Docker)

### Paleidimas

1. Klonuoti repozitoriją ir įeiti į katalogą.
2. Nukopijuoti env failus: `backend/.env.example` → `backend/.env`, `frontend/.env.example` → `frontend/.env`.
3. Paleisti: `docker-compose up -d`.
4. Backend: `docker-compose exec backend composer install`, `php artisan key:generate`, `php artisan migrate`.
5. Frontend: `cd frontend && npm install && npm run dev`.

**Adresai lokaliai:** Frontend – http://localhost:3001, API – http://localhost:8001 (arba per Nginx http://localhost:8080).

### Env kintamieji (lokaliai)

- **Frontend:** `NEXT_PUBLIC_API_URL=http://localhost:8001/api`
- **Backend:** `.env` – DB (pvz. `DB_HOST=db` Docker), `APP_URL`, CORS – pagal `config/cors.php`

---

## Dokumentacija repozitorijoje

| Failas / katalogas | Paskirtis |
|--------------------|-----------|
| **README.md** (šis failas) | Projektas, stekas, deploy santrauka, lokalus setup |
| **docs/PROJEKTAS-STEKAS-DEPLOY.md** | Trumpa projekto, steko ir deploy apžvalga (klientui) |
| **docs/ADMIN-INSTRUKCIJA.md** | Admin panelė: prisijungimas (admin@sora-tattoo.local / admin123), naudojimas, skiltys |
| **deploy/README.md** | Detalus serverio (Hetzner) setup: PHP, Nginx, MySQL, SSL, Fail2ban, Laravel |
| **.github/workflows/deploy-backend.yml** | GitHub Action – backend deploy į serverį po push į main |

---

## Licencija

Privatus projektas – SORA TATTOO.
