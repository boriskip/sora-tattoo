# Fix: "cd frontend && npm install" Error

## Problem
Vercel is still trying to run `cd frontend && npm install` even though Root Directory is set to `frontend`.

## Solution

### Check Install Command Override

1. Go to **Settings** → **Build & Development Settings**
2. Find **Install Command** field
3. Check if **Override** toggle is **ON** (blue)
4. If it's ON and shows `cd frontend && npm install`:
   - **Turn OFF the Override toggle** (switch to white/off)
   - OR change it to just `npm install` (without `cd frontend`)

### Why This Happens

When Root Directory = `frontend`, Vercel already runs commands from `frontend/` directory, so `cd frontend` is not needed and causes error.

### Correct Settings

- **Root Directory**: `frontend` ✅
- **Install Command Override**: **OFF** (use default) ✅
- **Build Command**: `npm run build` ✅

### After Fix

1. **Save** settings
2. **Redeploy** (Deployments → ... → Redeploy)

