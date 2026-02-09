# Vercel Deployment Guide

This project is configured to deploy to **Vercel** (not GitHub Pages).

## Quick Start

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
# Test deployment
vercel

# Production deployment
vercel --prod
```

### 4. Add Environment Variables
```bash
vercel env add OPENAI_API_KEY
# Paste your OpenAI API key when prompted
# Select: Production
```

## Automatic Deployments

### Option 1: Connect GitHub to Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect SvelteKit
5. Add `OPENAI_API_KEY` in project settings
6. Every push to `main` will auto-deploy ✅

### Option 2: Manual Deployments
Use `vercel --prod` command whenever you want to deploy.

## GitHub Pages (Disabled)

The GitHub Pages workflow (`.github/workflows/deploy.yml`) is **disabled** because:
- This project uses `adapter-auto` for Vercel
- The `/api/chat` endpoint requires a serverless runtime
- GitHub Pages only supports static files

To re-enable GitHub Pages:
1. Change back to `adapter-static` in `svelte.config.js`
2. Remove `/api/chat` endpoint
3. Uncomment the `push` trigger in `deploy.yml`

## CI/CD

- **CI Tests**: Run on every push (`.github/workflows/ci.yml`)
- **Deployment**: Handled by Vercel (not GitHub Actions)

---

**Live URL**: Your Vercel deployment URL will be shown after running `vercel --prod`
