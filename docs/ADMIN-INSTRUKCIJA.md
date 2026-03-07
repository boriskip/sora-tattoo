# SORA TATTOO – Admin panelės naudojimo instrukcija

## Prisijungimas

### Adresas

- **DE:** https://soratattoo.de/de/admin/login  
- **EN:** https://soratattoo.de/en/admin/login  
- **RU:** https://soratattoo.de/ru/admin/login  
- **IT:** https://soratattoo.de/it/admin/login  

Arba atidarykite https://soratattoo.de, pasirinkite kalbą, tada meniu / nuorodoje įeikite į **Admin** (jei yra) arba tiesiog į adresą su savo kalba: `https://soratattoo.de/de/admin/login`.

### Numatyti duomenys (pirmą kartą)

| Laukas   | Reikšmė                    |
|----------|----------------------------|
| **El. paštas** | `admin@sora-tattoo.local` |
| **Slaptažodis** | `admin123`              |

Įveskite šiuos duomenis ir paspauskite **Войти** / **Log in** (priklauso nuo kalbos). Po sėkmingo prisijungimo atsidursite admin dashboard.

**Svarbu:** Po pirmo prisijungimo rekomenduojama **pakeisti slaptažodį** (žr. skyrių „Slaptažodžio keitimas“).

---

## Slaptažodžio keitimas

Admin panelėje slaptažodžio keitimo mygtuko nėra. Slaptažodį keičia **techninis administratorius** per backend (duomenų bazę arba būsimą funkciją).  

Jei reikia pakeisti slaptažodį – kreipkitės į tą, kas tvarko serverį/backend. Galima sukurti naują admin vartotoją arba atnaujinti esamo slaptažodį per Laravel/MySQL.

---

## Naudojimas – kas yra admin skiltyse

Po prisijungimo matote **dashboard** su nuorodomis į skirtingas turinio sritis. Kiekviena nuoroda atidaro atitinkamą redagavimo puslapį.

| Skirtis | Ką redaguojate |
|--------|----------------------------------|
| **Hero (Startbild)** | Pradinis ekranas: fonas, pavadinimai, aprašymas, social nuorodos, blokų spalvos. |
| **About (Über uns)** | Sekcija „Apie mus“: antraštės, tekstai, nuotraukos. |
| **Artists (Künstler)** | Meistrai: vardas, aprašymas, avataras, stilius, eilės tvarka. |
| **Works (Arbeiten)** | Darbų galerija: nuotraukos, pavadinimai, susiejimas su meistru ir stiliais. |
| **Styles (Stile)** | Stiliai (pvz. Japanese, Realism): pavadinimai, aprašymai, nuotraukos. |
| **Info (Information)** | Informacijos gidai (pvz. kaip rinktis meistrą, pasiruošimas): skyriai, tekstai, nuotraukos. |
| **Contact** | Kontaktai: adresas, darbo laikas, telefonas, el. paštas. |
| **Legal (Impressum & Datenschutz)** | Impressum ir Privatumo politika: antraštės ir turinys. |
| **Reviews (Bewertungen)** | Atsiliepimai: peržiūra, patvirtinimas arba redagavimas (jei įjungta). |

- Redagavimai dažniausiai **išsaugomi** mygtuku **Speichern** / **Save** (ar panašiu) atitinkamo puslapio apačioje.  
- Kai kuriuose blokuose galima keisti turinį **keliomis kalbomis** (DE, EN, RU, IT) – pasirinkite kalbą arba atitinkamą skirtuką, jei toks yra.

---

## Atsijungimas

Dashboard arba bet kuriame admin puslapyje – nuoroda **Abmelden** / **Log out** (priklauso nuo kalbos). Paspaudus sesija nutraukiama; norint vėl įeiti, reikės dar kartą atidaryti prisijungimo puslapį ir įvesti el. paštą bei slaptažodį.

---

## Dažnos problemos

- **„Ошибка входа“ / klaida prisijungiant:** Patikrinkite el. paštą ir slaptažodį (įvedimas be tarpų). Jei pamiršote slaptažodį – reikia jo atstatymo per techninį administratorių.
- **Puslapis neatsidaro arba rodo klaidą:** Patikrinkite, ar naudojate teisingą adresą (https://soratattoo.de/…/admin/login) ir ar yra interneto ryšys. Jei problema kartojasi – kreipkitės į techninį administratorių.
- **Pakeitimai nematomi svetainėje:** Po **Save** pakeitimai turėtų būti matomi iš karto. Jei matote seną versiją – pabandykite atnaujinti puslapį (F5) arba atsidaryti svetainę inkognito lange.

---

*Dokumentas skirias SORA TATTOO admin panelės naudotojams.*
