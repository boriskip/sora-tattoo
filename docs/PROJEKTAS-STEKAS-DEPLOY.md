# SORA TATTOO – Projekto aprašas, stekas ir deploy (klientui)

## Projekto aprašas

**SORA TATTOO** – tattoo studijos svetainė su administravimo panelė.

- **Svetainė:** https://soratattoo.de (kalbos: DE, EN, RU, IT)
- **Admin:** https://soratattoo.de/de/admin – prisijungus galima keisti hero, apie mus, meistrus, darbus, stilius, atsiliepimus, informaciją, kontaktus, Impressum/Privacy.
- **API:** https://api.soratattoo.de – backend, kurį naudoja svetainė ir admin.

---

## Stekas (technologijos)

| Komponentas | Technologijos |
|-------------|----------------|
| **Frontend (svetainė)** | Next.js 14, React, TypeScript, Tailwind CSS, next-intl (kalbos) |
| **Backend (API)** | Laravel 11, PHP 8.2, MySQL |
| **Svetainės hostingas** | Vercel (soratattoo.de, www) |
| **API hostingas** | Hetzner Cloud – vienas VPS (Ubuntu, Nginx, SSL) |
| **Automatinis atnaujinimas** | Vercel (frontend) + GitHub Actions (backend) |

---

## Deploy – kaip atnaujinai svetainę ir API

### Automatinis deploy (po git push)

- **Frontend:** Kai į **main** šaką daromas **push**, Vercel automatiškai perbuildina ir atnaujina https://soratattoo.de. Nieko papildomai daryti nereikia.
- **Backend:** Kai į **main** daromas **push** ir keičiami failai **backend/** arba **deploy/**, GitHub Actions prisijungia prie serverio ir atnaujina API (api.soratattoo.de). Tai taip pat vyksta automatiškai.

### Rankinis atnaujinimas (jei reikia)

- **Tik turinys (tekstai, nuotraukos):** per **Admin** – https://soratattoo.de/de/admin. Deploy nereikia.
- **Kodo pakeitimai:** lokaliai atlikti pakeitimus → **git push** į **main**. Frontend ir/arba backend atnaujins pagal tai, kas keitėsi.

### Domenai ir serveriai

- **soratattoo.de** ir **www.soratattoo.de** → Vercel (svetainė).
- **api.soratattoo.de** → Hetzner serveris (API).

DNS valdomas pas domeno registratorių; šie adresai jau nukreipti į atitinkamus hostus.

---

## Kas klientui gali būti naudinga

- **Vercel:** prieiga prie projekto (soratattoo.de), jei reikia keisti nustatymus ar env kintamuosius.
- **GitHub:** prieiga prie repozitorijos (sora-tattoo), jei norima matyti commit istoriją arba Actions (deploy istoriją).
- **Hetzner Cloud:** prieiga prie serverio (API) – tik jei reikia techninės priežiūros ar logų; kasdieniam naudojimui pakanka admin panelės ir git push.

---

*Dokumentas atnaujintas atsižvelgiant į dabartinį Vercel + Hetzner deploy.*
