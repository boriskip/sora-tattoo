# SORA TATTOO

Modern tattoo portfolio website built with Next.js (frontend) and Laravel (backend).

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Laravel 11, PHP 8.2
- **Infrastructure**: Docker, Docker Compose, Nginx
- **Deployment**: 
  - Frontend: Vercel
  - Backend: (Railway/Render/DigitalOcean - to be configured)

## 📦 Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- PHP 8.2+ (for local backend development)

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd soraTattoo
```

2. Copy environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start Docker containers:
```bash
docker-compose up -d
```

4. Install dependencies:
```bash
# Backend
docker-compose exec backend composer install

# Frontend
cd frontend && npm install
```

5. Generate Laravel key:
```bash
docker-compose exec backend php artisan key:generate
```

6. Run migrations:
```bash
docker-compose exec backend php artisan migrate
```

7. Access the application:
- Frontend: http://localhost:3001
- Backend API: http://localhost:8001
- Nginx: http://localhost:8080

## 🌐 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL

### Backend (To be configured)

Backend needs to be deployed separately. Recommended options:
- Railway
- Render
- DigitalOcean App Platform
- VPS (DigitalOcean Droplet, AWS EC2)

## 📝 Environment Variables

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Backend (.env)
```
APP_NAME="Sora Tattoo"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8001

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=sora_tattoo
DB_USERNAME=root
DB_PASSWORD=root

CORS_ALLOWED_ORIGINS=http://localhost:3001
```

## 🛠️ Development

### Running migrations
```bash
docker-compose exec backend php artisan migrate
```

### Creating migrations
```bash
docker-compose exec backend php artisan make:migration create_table_name
```

### Running seeders
```bash
docker-compose exec backend php artisan db:seed
```

### Frontend development
```bash
cd frontend
npm run dev
```

## 📄 License

Private project - SORA TATTOO
