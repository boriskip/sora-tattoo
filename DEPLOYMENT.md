# Deployment Guide - SORA TATTOO

## 🚀 Vercel Deployment (Frontend)

### Step 1: Prepare Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote repository
git remote add origin <your-github-repo-url>

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Import Project**: Click "Add New" → "Project"
3. **Import Git Repository**: Select your GitHub repository
4. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm install`

5. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
   ```

6. **Deploy**: Click "Deploy"

### Step 3: Update Backend CORS

After deploying frontend, update backend CORS to allow your Vercel domain:

```php
// backend/config/cors.php
'allowed_origins' => [
    'http://localhost:3001',
    'https://your-vercel-app.vercel.app',
],
```

## 🔧 Backend Deployment Options

### Option 1: Railway (Recommended - Easy)

1. **Sign up**: https://railway.app
2. **New Project** → **Deploy from GitHub**
3. **Select repository** → **Add Service** → **Database** (MySQL)
4. **Add Service** → **GitHub Repo** → Select `backend` folder
5. **Configure**:
   - Build Command: `composer install --optimize-autoloader --no-dev`
   - Start Command: `php artisan serve --host=0.0.0.0 --port=$PORT`
   - Root Directory: `backend`

6. **Environment Variables**:
   ```
   APP_ENV=production
   APP_DEBUG=false
   DB_HOST=${{MySQL.HOSTNAME}}
   DB_DATABASE=${{MySQL.DATABASE}}
   DB_USERNAME=${{MySQL.USERNAME}}
   DB_PASSWORD=${{MySQL.PASSWORD}}
   ```

### Option 2: Render

1. **Sign up**: https://render.com
2. **New** → **Web Service**
3. **Connect GitHub** → Select repository
4. **Configure**:
   - Name: `sora-tattoo-backend`
   - Environment: `PHP`
   - Build Command: `composer install --no-dev --optimize-autoloader`
   - Start Command: `php -S 0.0.0.0:$PORT -t public`
   - Root Directory: `backend`

5. **Add Database**: New → PostgreSQL/MySQL

### Option 3: DigitalOcean App Platform

1. **Sign up**: https://www.digitalocean.com
2. **Create App** → **GitHub**
3. **Select repository** → **Backend folder**
4. **Configure**:
   - Type: PHP
   - Build Command: `composer install --no-dev --optimize-autoloader`
   - Run Command: `php artisan serve --host=0.0.0.0 --port=$PORT`
   - Add Database: Managed Database (MySQL)

## 📋 Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed (Railway/Render/DigitalOcean)
- [ ] Database created and migrations run
- [ ] Environment variables configured
- [ ] CORS configured for frontend domain
- [ ] API endpoints tested
- [ ] Frontend connected to backend API
- [ ] SSL certificates active (HTTPS)
- [ ] Domain configured (if custom domain)

## 🔗 Update Frontend API URL

After backend is deployed, update Vercel environment variable:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to your backend URL
3. Redeploy

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check CORS configuration in backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend logs

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Check Node.js version compatibility

### Backend deployment issues
- Verify PHP version (8.2+)
- Check database connection
- Review application logs

