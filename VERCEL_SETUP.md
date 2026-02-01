# Vercel Setup Instructions

## ⚠️ IMPORTANT: Root Directory Configuration

Vercel negali rasti Next.js, nes Root Directory nėra nustatytas į `frontend`.

## ✅ Solution: Configure in Vercel Dashboard

### Step 1: Go to Project Settings

1. Open your Vercel project: https://vercel.com/boriskip/sora-tattoo
2. Go to **Settings** → **General**

### Step 2: Set Root Directory

1. Scroll down to **Root Directory**
2. Click **Edit**
3. Set to: `frontend`
4. Click **Save**

### Step 3: Verify Build Settings

Go to **Settings** → **Build & Development Settings**

Verify these settings:
- **Framework Preset**: Next.js (should auto-detect)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)
- **Development Command**: `npm run dev` (default)

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**

OR

1. Make a small change and push to GitHub
2. Vercel will auto-deploy

## ✅ Alternative: Use vercel.json (if you prefer)

If you want to use `vercel.json` instead of Project Settings, use this:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

But you still need to set **Root Directory** to `frontend` in Project Settings!

## 🔍 Why This Happens

Vercel looks for `package.json` in the root directory. Since your Next.js app is in `frontend/` folder, Vercel can't find it unless you set Root Directory.

## ✅ After Configuration

Once Root Directory is set to `frontend`, Vercel will:
1. Find `frontend/package.json`
2. Detect Next.js framework
3. Install dependencies from `frontend/package.json`
4. Build successfully

