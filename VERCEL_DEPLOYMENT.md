# Deploying Cyberpunk Slot Machine to Vercel

This guide walks you through deploying your slot machine game to Vercel in just a few minutes.

## Prerequisites

- GitHub account (already done ✅)
- Vercel account (free at https://vercel.com)
- Your code already pushed to GitHub ✅

## Deployment Steps

### Step 1: Go to Vercel

1. Visit https://vercel.com
2. Click **"Sign Up"** or **"Log In"** with your GitHub account
3. Authorize Vercel to access your GitHub repositories

### Step 2: Import Your Project

1. Click **"New Project"** in the Vercel dashboard
2. Search for **"slot-machine"** in your repositories
3. Click **"Import"**

### Step 3: Configure Project

Vercel will auto-detect your project settings:

- **Framework Preset:** Vite ✅
- **Build Command:** `pnpm build` ✅
- **Output Directory:** `dist/public` ✅
- **Install Command:** `pnpm install` ✅

Everything should be pre-filled. Just click **"Deploy"**!

### Step 4: Wait for Deployment

Vercel will:
1. Clone your GitHub repository
2. Install dependencies
3. Build the project
4. Deploy to their CDN

This takes about 2-3 minutes.

### Step 5: Access Your Site

Once deployment completes, you'll get a URL like:
```
https://slot-machine.vercel.app
```

Click the link and your game is live! 🎉

## Custom Domain (Optional)

To use your own domain:

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables (Optional)

If you want to change the Google Apps Script API URL:

1. Go to **Settings** → **Environment Variables**
2. Add: `VITE_API_URL` = `your-api-url`
3. Redeploy

## Troubleshooting

### Build Fails

If the build fails:
1. Check the build logs in Vercel dashboard
2. Common issues:
   - Missing dependencies: Run `pnpm install` locally
   - TypeScript errors: Run `pnpm check` locally
   - Wrong Node version: Vercel uses Node 18+ (should be fine)

### Site Shows Blank Page

1. Check browser console for errors
2. Verify the build output directory is correct
3. Try clearing browser cache

### API Calls Fail

1. This is likely a CORS issue
2. The app has demo mode - it will work offline
3. Or use the CORS proxy in the code

## Redeployment

Every time you push to GitHub:
1. Vercel automatically detects the change
2. Rebuilds and redeploys automatically
3. No manual action needed!

## Rollback

To revert to a previous deployment:
1. Go to Vercel dashboard
2. Click **"Deployments"**
3. Find the previous version
4. Click the three dots and select **"Promote to Production"**

## Performance Tips

Your site will be fast because:
- ✅ Vite optimizes the build
- ✅ Vercel's global CDN serves content worldwide
- ✅ Static files are cached and minified
- ✅ No server-side rendering overhead

## Monitoring

In Vercel dashboard you can see:
- **Analytics:** Page views, response times
- **Logs:** Any errors or warnings
- **Deployments:** History of all builds

---

**That's it!** Your Cyberpunk Slot Machine is now live on Vercel! 🎰⚡

For questions, check the Vercel docs: https://vercel.com/docs
