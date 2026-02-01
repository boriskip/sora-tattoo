# Git Setup & Vercel Deployment Guide

## 📦 Step 1: Git Repository Setup

### 1.1 Initialize Git (Already Done ✅)
```bash
git init
git branch -m main
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - Repository name: `sora-tattoo`
   - Description: "Modern tattoo portfolio website"
   - Visibility: Private (or Public)
   - **DO NOT** initialize with README, .gitignore, or license
3. Click "Create repository"

### 1.3 Connect Local Repository to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sora-tattoo.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/sora-tattoo.git

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Sora Tattoo website"

# Push to GitHub
git push -u origin main
```

## 🚀 Step 2: Vercel Deployment

### 2.1 Connect to Vercel

1. Go to https://vercel.com
2. Sign up/Login (use GitHub account for easy integration)
3. Click **"Add New"** → **"Project"**
4. Import your GitHub repository: `sora-tattoo`

### 2.2 Configure Vercel Project

**Project Settings:**
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `frontend` ⚠️ **IMPORTANT**
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

**Environment Variables:**
Add these variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```
(You'll update this later with your backend URL)

### 2.3 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Your site will be live at: `https://sora-tattoo-xxxxx.vercel.app`

### 2.4 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## 🔧 Step 3: Update Backend CORS

After deploying frontend, update backend CORS to allow Vercel domain:

```php
// backend/config/cors.php
'allowed_origins' => [
    'http://localhost:3001',
    'https://your-app.vercel.app',
    'https://*.vercel.app', // Allow all Vercel preview deployments
],
```

## 📝 Step 4: Continuous Deployment

Every time you push to `main` branch, Vercel will automatically:
1. Detect the push
2. Build the frontend
3. Deploy to production

For preview deployments, Vercel creates a unique URL for each pull request.

## 🐛 Troubleshooting

### Build fails on Vercel
- Check that **Root Directory** is set to `frontend`
- Verify `frontend/package.json` exists
- Check build logs in Vercel dashboard

### Environment variables not working
- Make sure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new variables

### Frontend can't connect to backend
- Update `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Check backend CORS configuration
- Verify backend is deployed and accessible

## 📋 Quick Commands

```bash
# Check git status
git status

# Add files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Check remote
git remote -v

# View commit history
git log --oneline
```

## ✅ Checklist

- [ ] GitHub repository created
- [ ] Local repo connected to GitHub
- [ ] Initial commit pushed
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Custom domain configured (optional)
- [ ] Backend CORS updated

