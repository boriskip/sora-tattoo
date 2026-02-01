# 🚀 Sora Tattoo - Setup Instrukcijos

## Pirmas paleidimas

### 1. Sukurkite .env failus

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend  
cp frontend/.env.example frontend/.env
```

### 2. Paleiskite Docker konteinerius

```bash
docker-compose up -d --build
```

### 3. Laravel setup (pirmą kartą)

```bash
# Įeikite į backend konteinerį
docker-compose exec backend bash

# Install dependencies
composer install

# Generate app key
php artisan key:generate

# Run migrations (kai bus sukurtos)
php artisan migrate

# Exit
exit
```

### 4. Next.js setup (pirmą kartą)

```bash
# Įeikite į frontend konteinerį
docker-compose exec frontend sh

# Install dependencies
npm install

# Exit
exit
```

## 📍 Prieiga

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8001
- **API Test**: http://localhost:8001/api/test
- **Nginx**: http://localhost:8080

## 🔧 Development komandos

### Backend (Laravel)

```bash
# Įeikite į konteinerį
docker-compose exec backend bash

# Artisan komandos
php artisan make:model Artist
php artisan make:migration create_artists_table
php artisan migrate
php artisan make:controller Api/ArtistController
```

### Frontend (Next.js)

```bash
# Įeikite į konteinerį
docker-compose exec frontend sh

# Development server (automatiškai veikia)
npm run dev

# Build
npm run build
```

## 🗄️ Database

**Connection details:**
- Host: `db` (Docker tinkle) arba `localhost` (iš lokalinės mašinos)
- Port: `3306` (viduje) arba `3307` (lokale)
- Database: `sora_tattoo`
- Username: `sora_user`
- Password: `sora_password`

## 🛠️ Troubleshooting

### Portai užimti
Jei portai užimti, pakeiskite `docker-compose.yml`:
```yaml
ports:
  - "3002:3000"  # vietoj 3001
  - "8002:8000"  # vietoj 8001
```

### Permissions klaidos
```bash
docker-compose exec backend bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Database connection
```bash
# Patikrinkite ar db veikia
docker-compose ps
docker-compose logs db
```

### Rebuild konteinerius
```bash
docker-compose down
docker-compose up -d --build
```

## 📝 Kiti naudingi komandos

```bash
# Peržiūrėti logus
docker-compose logs -f frontend
docker-compose logs -f backend

# Sustabdyti visus konteinerius
docker-compose down

# Sustabdyti ir pašalinti volume'us
docker-compose down -v

# Restart konkretų servisą
docker-compose restart backend
```

