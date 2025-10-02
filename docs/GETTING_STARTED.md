# 🚀 Getting Started - Infrastructure Fix Citizen

Complete setup guide to get your Infrastructure Fix Citizen platform running in minutes.

---

## 📋 Prerequisites

- **Node.js** v18+ and npm
- **Supabase Account** ([Sign up free](https://supabase.com))
- **Clerk Account** ([Sign up free](https://clerk.com))
- **Google Maps API Key** ([Get one here](https://console.cloud.google.com/))

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Clone and Install (1 min)

```bash
git clone <your-repo-url>
cd infra-fix-citizen
npm install
```

### Step 2: Environment Setup (2 min)

Create `.env` file in project root:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Supabase Backend
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Step 3: Deploy Database (2 min)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project or select existing
3. Go to **SQL Editor**
4. Copy and run: `supabase/migrations/004_complete_backend_setup.sql`
5. ✅ All tables, functions, and data created!

### Step 4: Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173` 🎉

---

## 🔧 Detailed Setup Instructions

### Google Maps API Configuration

1. **Create Project** at [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable APIs**:
   - Maps JavaScript API
   - Places API  
   - Geocoding API
3. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
4. **Restrict API Key**:
   - Application restrictions: HTTP referrers
   - Add: `localhost:5173`, `localhost:*`, your domain
   - API restrictions: Select only the 3 APIs above

**Cost**: $200/month free tier (~28,000 map loads)

### Clerk Authentication Setup

1. **Create Application** at [Clerk Dashboard](https://dashboard.clerk.com/)
2. **Configure Paths**:
   - Sign-in URL: `/auth`
   - Sign-up URL: `/auth`  
   - After sign-in: `/citizen`
   - After sign-up: `/citizen`
3. **Add Domains** (in Configure → Domains):
   ```
   http://localhost:5173
   https://localhost:5173
   http://localhost:3000
   ```
4. **Copy API Keys**:
   - Go to "API Keys"
   - Copy "Publishable Key" to `.env`

### Supabase Database Setup

#### Option 1: Direct SQL (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/004_complete_backend_setup.sql`
3. Done! ✅

#### Option 2: Supabase CLI

```bash
# Install Supabase CLI (Windows - use Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Login and link
npx supabase login
npx supabase link --project-ref your_project_ref

# Run migration
npx supabase db push
```

**Get Project Ref**: Supabase Dashboard → Settings → General → Reference ID

---

## ✅ Verify Setup

### 1. Check Database

Go to Supabase Dashboard → Table Editor

You should see **7 tables**:
- ✅ profiles
- ✅ categories (7 rows)
- ✅ issues (sample data)
- ✅ issue_comments
- ✅ issue_updates
- ✅ issue_upvotes
- ✅ notifications

### 2. Test Application

1. **Start app**: `npm run dev`
2. **Visit**: `http://localhost:5173`
3. **Sign up** with Clerk
4. **Create an issue** in the app
5. **Check Supabase** → `issues` table → New row appears! ✅

### 3. View API Docs

Visit: `http://localhost:5173/api-docs`

See all available API endpoints with Swagger UI.

---

## 🎯 What's Included

### Frontend Stack
- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS + shadcn/ui
- 🗺️ Google Maps Integration
- 📊 React Query for data fetching
- 🧭 React Router for navigation

### Backend Stack (Supabase)
- 🗄️ PostgreSQL Database (7 tables)
- 🔐 Row Level Security (RLS)
- 🔧 Custom Database Functions
- ⚡ Real-time Subscriptions
- 🔑 JWT Authentication

### Authentication
- 👤 Clerk for user management
- 🎭 Role-based access (citizen/admin)
- 🔒 Secure JWT tokens
- 📧 Email/social sign-in

### Features Ready to Use
- ✅ Issue reporting with photos
- ✅ Interactive maps (heatmap + markers)
- ✅ Real-time statistics
- ✅ Admin dashboard with analytics
- ✅ Citizen dashboard
- ✅ Upvoting system
- ✅ Comments and updates
- ✅ Notifications
- ✅ Complete API documentation

---

## 🐛 Troubleshooting

### "Clerk Error: redirect_uri_mismatch"

**Fix**: Add your domain to Clerk Dashboard → Configure → Domains

```
http://localhost:5173
http://localhost:3000
```

### "Supabase connection failed"

**Fix**: Check `.env` file has correct:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Find these in: Supabase Dashboard → Settings → API

### "Google Maps not loading"

**Fix**: 
1. Check API key in `.env`
2. Ensure billing enabled in Google Cloud
3. Verify APIs are enabled (Maps JS, Places, Geocoding)

### "npm install -g supabase not supported"

**Fix**: Use npx or install via Scoop (Windows):

```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### "Migration errors in Supabase"

**Fix**: Run the migration directly in SQL Editor instead of CLI:
1. Open `supabase/migrations/004_complete_backend_setup.sql`
2. Copy all content
3. Paste in Supabase SQL Editor
4. Click "Run"

---

## 📚 Next Steps

### Learn the Codebase
- Read: `docs/ARCHITECTURE.md` - Project structure
- Read: `docs/DEVELOPMENT.md` - Development workflow

### Deploy to Production
- Read: `docs/DEPLOYMENT.md` - Deployment guide

### Explore APIs
- Visit: `/api-docs` - Interactive API documentation
- Read: `docs/API_REFERENCE.md` - Complete API guide

### Customize
1. Update app name and branding
2. Add custom issue categories
3. Customize map styles
4. Add new features

---

## 🎊 You're Ready!

Your Infrastructure Fix Citizen platform is now fully set up with:
- ✅ Frontend running on Vite + React
- ✅ Backend deployed on Supabase
- ✅ Authentication via Clerk
- ✅ Maps via Google Maps API
- ✅ Complete database with sample data
- ✅ API documentation at `/api-docs`

**Start building!** 🚀

---

**Need Help?**
- Check other docs in `/docs` folder
- Review code comments
- Test with sample data
- Use the interactive API docs


