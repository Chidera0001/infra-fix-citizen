# 🚀 Deployment Guide

Production deployment guide for Infrastructure Fix Citizen platform.

---

## 🎯 Deployment Options

### Recommended Stack
- **Frontend**: Vercel or Netlify
- **Backend**: Supabase (already cloud-hosted)
- **Auth**: Clerk (already cloud-hosted)
- **Maps**: Google Maps API

---

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] API keys secured
- [ ] Domain/DNS configured
- [ ] SSL certificate ready
- [ ] Performance tested
- [ ] Security reviewed

---

## 🌐 Deploy to Vercel (Recommended)

### 1. Prerequisites

- Vercel account ([Sign up free](https://vercel.com))
- GitHub repository connected

### 2. Deploy Steps

#### A. Via Vercel Dashboard

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import from GitHub

2. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Add Environment Variables**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   VITE_SUPABASE_URL=https://....supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   VITE_GOOGLE_MAPS_API_KEY=AIza...
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Your app is live!

#### B. Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 3. Custom Domain

1. Go to Project Settings → Domains
2. Add your domain: `yourdomain.com`
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-60 minutes)
5. SSL certificate auto-configured ✅

---

## 🔷 Deploy to Netlify

### 1. Via Netlify Dashboard

1. **Create New Site**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Import from GitHub

2. **Build Settings**
   ```
   Build Command: npm run build
   Publish Directory: dist
   ```

3. **Environment Variables**
   - Site Settings → Environment → Add variables
   - Add all `VITE_*` variables

4. **Deploy**
   - Click "Deploy Site"
   - Wait 2-3 minutes

### 2. Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### 3. Custom Domain

1. Site Settings → Domain Management
2. Add custom domain
3. Configure DNS (similar to Vercel)

---

## 🗄️ Supabase Production Setup

### 1. Upgrade from Free Tier (if needed)

- Supabase Dashboard → Settings → Billing
- Choose Pro ($25/month) or Team plan
- Benefits:
  - No database pausing
  - 8GB database
  - 250GB bandwidth
  - Daily backups
  - Email support

### 2. Configure Production Settings

#### Enable Point-in-Time Recovery
```
Settings → Database → Point-in-Time Recovery → Enable
```

#### Set Connection Pooler
```
Settings → Database → Connection Pooler → Transaction Mode
```

#### Configure Auth Settings
```
Settings → Auth → Email → Production SMTP
```

### 3. Apply Migrations

```bash
# Ensure migrations are applied
npx supabase link --project-ref your-prod-ref
npx supabase db push
```

### 4. Secure API Keys

- **Never commit** `.env` to Git
- Use **Anon Key** for public access
- Use **Service Role Key** only in secure backend
- Enable RLS on all tables ✅

---

## 🔐 Clerk Production Setup

### 1. Update Domains

Clerk Dashboard → Configure → Domains:
```
https://yourdomain.com
https://www.yourdomain.com
```

### 2. Configure OAuth

For each OAuth provider (Google, GitHub, etc.):
1. Update Authorized Redirect URIs
2. Add production domain
3. Test OAuth flow

### 3. Production API Keys

- Use **Production** publishable key in `.env`
- Update webhook endpoints if used
- Configure email templates

---

## 🗺️ Google Maps Production

### 1. Update API Key Restrictions

Google Cloud Console → Credentials:

**HTTP Referrers:**
```
https://yourdomain.com/*
https://www.yourdomain.com/*
```

**API Restrictions:**
- Maps JavaScript API
- Places API
- Geocoding API

### 2. Set Billing Alerts

Google Cloud → Billing → Budgets:
```
Alert at: $50
Alert at: $100
Alert at: $200
```

### 3. Optimize Usage

- Enable map clustering
- Cache geocoding results
- Lazy load maps
- Monitor usage in GCP Dashboard

---

## ⚙️ Build Optimization

### 1. Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
      }
    }
  }
});
```

### 2. Environment Variables

**Production `.env`:**
```env
NODE_ENV=production
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

**Never include:**
- ❌ Service role keys
- ❌ Secret API keys
- ❌ Database passwords
- ❌ Private keys

---

## 🔒 Security Hardening

### 1. Headers Configuration

**`vercel.json`:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 2. Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' maps.googleapis.com;
               style-src 'self' 'unsafe-inline' fonts.googleapis.com;
               img-src 'self' data: https:;
               connect-src 'self' *.supabase.co clerk.com">
```

### 3. Supabase RLS

Verify all tables have RLS enabled:
```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- All should show: rowsecurity = true
```

---

## 📊 Monitoring & Analytics

### 1. Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to App.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 2. Supabase Monitoring

Dashboard → Reports:
- Database size
- API requests
- Active connections
- Query performance

### 3. Error Tracking

**Option A: Sentry**
```bash
npm install @sentry/react

# main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

**Option B: LogRocket**
```bash
npm install logrocket

# main.tsx
import LogRocket from 'logrocket';
LogRocket.init('your-app-id');
```

---

## 🚀 Performance Optimization

### 1. Lazy Loading

```typescript
// App.tsx
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CitizenDashboard = lazy(() => import('./pages/CitizenDashboard'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/citizen" element={<CitizenDashboard />} />
  </Routes>
</Suspense>
```

### 2. Image Optimization

```typescript
// Use optimized images
<img 
  src="/images/hero.webp" 
  alt="Hero" 
  loading="lazy"
  width={800}
  height={600}
/>
```

### 3. Code Splitting

Vite automatically code-splits by route. Verify in build output:
```bash
npm run build

# Output shows chunked files:
# dist/assets/AdminDashboard-abc123.js
# dist/assets/CitizenDashboard-def456.js
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_KEY }}
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🧪 Pre-Production Testing

### 1. Staging Environment

Create staging deployment:
```bash
# Vercel staging
vercel --env staging

# Use staging env vars
VITE_SUPABASE_URL=https://staging-project.supabase.co
```

### 2. Load Testing

```bash
# Install artillery
npm install -g artillery

# Create test script
# load-test.yml
artillery run load-test.yml
```

### 3. Security Audit

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix
```

---

## 📱 Mobile/PWA Setup

### Add PWA Support

```bash
npm install vite-plugin-pwa

# vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Infrastructure Fix Citizen',
        short_name: 'InfraFix',
        description: 'Report infrastructure issues',
        theme_color: '#16a34a',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

---

## 🔍 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All routes accessible
- [ ] Auth flow works
- [ ] Database connections successful
- [ ] Maps display correctly
- [ ] Forms submit properly
- [ ] Mobile responsive
- [ ] SSL certificate valid
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Performance metrics good
- [ ] SEO meta tags present

---

## 🆘 Troubleshooting

### "Build failed on Vercel"

**Fix**: Check build logs, ensure all env vars are set

### "Supabase connection timeout"

**Fix**: Check Supabase project is not paused (free tier)

### "Maps not loading"

**Fix**: Update Google Maps API key restrictions with production domain

### "Auth redirect error"

**Fix**: Add production domain to Clerk allowed domains

### "Large bundle size"

**Fix**: Enable code splitting, lazy loading, tree shaking

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Supabase Production**: https://supabase.com/docs/guides/platform/going-into-prod
- **Vite Build**: https://vitejs.dev/guide/build.html

---

**Deployment Status**: 🚀 Production Ready
