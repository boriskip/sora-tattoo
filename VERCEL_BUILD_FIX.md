# Vercel SWC Binary Fix

## Problem
Next.js can't find SWC binary in Vercel build environment.

## Solution: Use Vercel Build Command Override

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/boriskip/sora-tattoo
2. Go to **Settings** → **Build & Development Settings**

### Step 2: Override Build Command
1. Find **Build Command** field
2. Turn **ON** the **Override** toggle
3. Change Build Command to:
   ```
   npm install --include=optional && npm run build
   ```
4. Click **Save**

### Step 3: Alternative - Add Environment Variable
If Build Command override doesn't work:

1. Go to **Settings** → **Environment Variables**
2. Add new variable:
   - **Key**: `NEXT_SWC_BINARY_PATH`
   - **Value**: (leave empty)
   - **Environment**: Production, Preview, Development (all)
3. Click **Save**
4. Redeploy

### Step 4: Redeploy
1. Go to **Deployments**
2. Click **"..."** on latest deployment
3. Click **Redeploy**
4. Uncheck **"Use existing Build Cache"**
5. Click **Redeploy**

## Why This Works

- `--include=optional` ensures optional dependencies (like SWC binaries) are installed
- Empty `NEXT_SWC_BINARY_PATH` tells Next.js to use fallback if binary not found
- Vercel's build environment should have SWC binaries available, but sometimes needs explicit installation

