# Admin Dashboard - Setup Guide

## What You Need to Do (Step by Step)

### Step 1: Remove Static Export (REQUIRED)

The admin dashboard needs API routes, which don't work with static export.

**Edit `next.config.ts`:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❌ DELETE THIS LINE:
  // output: "export",
  
  trailingSlash: true,
  images: {
    // ❌ DELETE THIS LINE TOO:
    // unoptimized: true,
    remotePatterns: [
      // ... keep your existing patterns
    ],
  },
  // ... keep everything else the same
};
```

**Why?** Vercel automatically optimizes your site. You don't need static export.

---

### Step 2: Create Environment Variables

Create a file called `.env.local` in your project root:

```env
# Admin Password (choose a strong password)
ADMIN_PASSWORD=your-secure-password-here

# GitHub Settings
GITHUB_TOKEN=your-github-token-here
GITHUB_REPO=your-username/your-repo-name
GITHUB_BRANCH=main
GITHUB_EMAIL=your-email@example.com
GITHUB_NAME=Your Name
```

---

### Step 3: Get GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: `IPTV Admin Dashboard`
4. Check the box: **`repo`** (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Paste it in `.env.local` as `GITHUB_TOKEN`

---

### Step 4: Add to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add ALL the variables from `.env.local`:
   - `ADMIN_PASSWORD`
   - `GITHUB_TOKEN`
   - `GITHUB_REPO` (format: `username/repo-name`)
   - `GITHUB_BRANCH` (usually `main`)
   - `GITHUB_EMAIL`
   - `GITHUB_NAME`
4. Make sure to add them for **Production**, **Preview**, and **Development**

---

### Step 5: Deploy

1. Push your changes to GitHub (including the `next.config.ts` update)
2. Vercel will automatically deploy
3. Wait for deployment to finish

---

### Step 6: Use the Dashboard

1. Go to: `https://yourdomain.com/admin/login`
2. Enter your `ADMIN_PASSWORD`
3. You're in! You can now:
   - Edit translations in all languages
   - Change website settings
   - Save changes → automatically commits to GitHub → auto-deploys

---

## How It Works

1. **You edit** content in the dashboard
2. **You click "Save"** → Changes are committed to GitHub
3. **Vercel detects** the GitHub push
4. **Vercel deploys** automatically
5. **Your website updates** within 2-3 minutes

---

## Troubleshooting

### "Unauthorized" error?
- Check that `ADMIN_PASSWORD` is set correctly in Vercel
- Make sure you're using the same password you set

### "GitHub configuration missing" error?
- Verify all GitHub variables are in Vercel
- Check `GITHUB_REPO` format: `username/repo-name` (not a URL!)

### Changes not deploying?
- Check Vercel deployment logs
- Make sure Vercel is connected to your GitHub repo
- Verify `GITHUB_BRANCH` matches your main branch name

---

## That's It!

Once set up, you can manage your entire website from `/admin` without touching code.

