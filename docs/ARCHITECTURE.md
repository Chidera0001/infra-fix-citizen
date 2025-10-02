# 🏗️ Architecture Documentation

Complete technical architecture for Infrastructure Fix Citizen platform.

---

## 📐 System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        USER LAYER                            │
│  👤 Citizens          👔 Admins          🔧 Moderators       │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────┴─────────────────────────────────────┐
│                   FRONTEND (React + Vite)                    │
├──────────────────────────────────────────────────────────────┤
│  Components → Hooks → API Layer → Supabase Client           │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────┴─────────────────────────────────────┐
│              AUTHENTICATION (Clerk)                          │
│  JWT Tokens • Social Login • Role Management                │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────┴─────────────────────────────────────┐
│              BACKEND (Supabase)                              │
├──────────────────────────────────────────────────────────────┤
│  PostgreSQL • Row Level Security • Functions • Triggers      │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
infra-fix-citizen/
├── docs/                          # Documentation
│   ├── GETTING_STARTED.md         # Setup guide
│   ├── ARCHITECTURE.md            # This file
│   ├── API_REFERENCE.md           # API docs
│   ├── DEVELOPMENT.md             # Dev guide
│   └── DEPLOYMENT.md              # Deploy guide
│
├── public/                        # Static assets
│   ├── api-spec.yaml              # OpenAPI specification
│   └── assets/                    # Images, icons
│
├── src/
│   ├── components/                # React components
│   │   ├── ui/                    # Base UI (shadcn/ui)
│   │   ├── layout/                # Headers, navigation
│   │   ├── api/                   # API documentation UI
│   │   ├── AdminDashboard.tsx     # Admin panel
│   │   ├── IssueCard.tsx          # Issue display
│   │   ├── IssueMap.tsx           # Map wrapper
│   │   ├── InteractiveMap.tsx     # Google Maps
│   │   ├── ReportForm.tsx         # Issue creation
│   │   └── ...
│   │
│   ├── pages/                     # Route pages
│   │   ├── Index.tsx              # Landing page
│   │   ├── Auth.tsx               # Login/signup
│   │   ├── CitizenDashboard.tsx   # Citizen view
│   │   ├── AdminDashboard.tsx     # Admin view
│   │   ├── AdminLogin.tsx         # Admin auth
│   │   ├── ApiDocs.tsx            # Swagger UI
│   │   └── NotFound.tsx           # 404 page
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-issues.ts          # Issue CRUD
│   │   ├── use-profile.ts         # User profile
│   │   ├── use-toast.ts           # Notifications
│   │   └── ...
│   │
│   ├── lib/                       # Core utilities
│   │   ├── supabase-api.ts        # API functions ⭐
│   │   ├── seed-data.ts           # Sample data
│   │   └── utils.ts               # Helpers
│   │
│   ├── integrations/              # External services
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client
│   │       └── types.ts           # Generated types
│   │
│   ├── constants/                 # App constants
│   ├── types/                     # TypeScript types
│   ├── utils/                     # Helper functions
│   ├── App.tsx                    # Root component
│   └── main.tsx                   # Entry point
│
├── supabase/
│   └── migrations/
│       └── 004_complete_backend_setup.sql  # Complete DB schema
│
├── scripts/                       # Automation
│   ├── setup-supabase.js          # DB setup
│   └── generate-api-spec.js       # API docs generator
│
└── Configuration Files
    ├── package.json               # Dependencies
    ├── vite.config.ts             # Vite config
    ├── tailwind.config.ts         # Tailwind CSS
    ├── tsconfig.json              # TypeScript
    └── .env                       # Environment vars
```

---

## 🗄️ Database Schema

### Tables (7 Total)

#### 1. **profiles**
User account data linked to Clerk authentication.

```sql
profiles (
  id UUID PRIMARY KEY,
  clerk_user_id TEXT UNIQUE,
  email TEXT,
  full_name TEXT,
  role TEXT (citizen|admin|moderator),
  location TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 2. **categories**
Issue classification types.

```sql
categories (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN
)
```

**Pre-populated**: pothole, streetlight, drainage, water_supply, road_damage, traffic_light, waste_management

#### 3. **issues** ⭐
Main table for infrastructure reports.

```sql
issues (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  category TEXT,
  status TEXT (open|in_progress|resolved|closed),
  severity TEXT (low|medium|high|critical),
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  reporter_id UUID → profiles(id),
  assigned_to UUID → profiles(id),
  image_url TEXT,
  upvotes_count INTEGER,
  priority INTEGER,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Indexes**:
- `idx_issues_status` on `status`
- `idx_issues_category` on `category`
- `idx_issues_location` on `latitude, longitude`

#### 4. **issue_comments**
User comments and discussions.

```sql
issue_comments (
  id UUID PRIMARY KEY,
  issue_id UUID → issues(id),
  user_id UUID → profiles(id),
  comment TEXT,
  is_official BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 5. **issue_updates**
Status change history and audit trail.

```sql
issue_updates (
  id UUID PRIMARY KEY,
  issue_id UUID → issues(id),
  user_id UUID → profiles(id),
  old_status TEXT,
  new_status TEXT,
  note TEXT,
  is_public BOOLEAN,
  created_at TIMESTAMP
)
```

#### 6. **issue_upvotes**
Voting system for prioritization.

```sql
issue_upvotes (
  id UUID PRIMARY KEY,
  issue_id UUID → issues(id),
  user_id UUID → profiles(id),
  created_at TIMESTAMP,
  UNIQUE(issue_id, user_id)
)
```

#### 7. **notifications**
User alert system.

```sql
notifications (
  id UUID PRIMARY KEY,
  user_id UUID → profiles(id),
  type TEXT,
  title TEXT,
  message TEXT,
  reference_id UUID,
  is_read BOOLEAN,
  created_at TIMESTAMP
)
```

### Database Functions

1. **`get_issues_with_filters()`** - Advanced issue search with filters
2. **`get_issue_statistics()`** - Real-time aggregated stats
3. **`toggle_issue_upvote()`** - Upvote/downvote logic
4. **`create_notification()`** - Generate user notifications
5. **`get_admin_dashboard_analytics()`** - Admin metrics
6. **`generate_admin_report()`** - Custom reports
7. **`get_system_health()`** - System status check
8. **`handle_new_user()`** - Auto-create profiles on signup

### Triggers

1. **`on_auth_user_created`** → Calls `handle_new_user()` when Clerk user signs up
2. **`update_issue_upvotes_count`** → Updates count when upvote added/removed

---

## 🔐 Security Architecture

### Row Level Security (RLS)

All tables have RLS enabled with policies:

#### **Issues Table**
```sql
-- Anyone can view issues
CREATE POLICY "Anyone can view issues"
  ON issues FOR SELECT
  USING (true);

-- Authenticated users can create issues
CREATE POLICY "Authenticated users can create"
  ON issues FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Users can update their own issues
CREATE POLICY "Users can update own issues"
  ON issues FOR UPDATE
  USING (auth.uid() = reporter_id);

-- Admins can update any issue
CREATE POLICY "Admins can update any issue"
  ON issues FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### **Comments Table**
- Anyone: View all
- Authenticated: Create comments
- Own comments: Update/delete

#### **Profiles Table**
- Anyone: View public info
- Self: Full CRUD on own profile
- Admin: View all profiles

### Authentication Flow

```
1. User signs in via Clerk
     ↓
2. Clerk generates JWT token
     ↓
3. Token stored in browser
     ↓
4. Frontend includes token in API calls
     ↓
5. Supabase verifies JWT
     ↓
6. RLS policies check user permissions
     ↓
7. Query executes with proper access
```

---

## 🔄 Data Flow Architecture

### Creating an Issue

```
ReportForm (User Input)
    ↓
useCreateIssue() hook
    ↓
issuesApi.createIssue()
    ↓
supabase.from('issues').insert()
    ↓
[HTTPS POST with JWT]
    ↓
Supabase RLS Check
    ↓
PostgreSQL INSERT
    ↓
Trigger: create_notification()
    ↓
React Query cache invalidation
    ↓
Dashboard auto-refreshes ✅
```

### Viewing Dashboard

```
AdminDashboard Component Mounts
    ↓
useIssues() + useIssueStatistics()
    ↓
issuesApi.getIssues() + getStatistics()
    ↓
supabase.rpc('get_issue_statistics')
    ↓
[HTTPS POST]
    ↓
PostgreSQL Function Execution
    ↓
Aggregated Data Returned
    ↓
React Query Caches (30s)
    ↓
Component Renders with Real Data ✅
```

---

## 🎨 Frontend Architecture

### State Management

**React Query** for server state:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

**React Hooks** for UI state:
- `useState` for local component state
- `useEffect` for side effects
- Custom hooks for reusable logic

### Component Hierarchy

```
App
├── ClerkProvider (Auth)
├── QueryClientProvider (Data)
└── BrowserRouter (Routing)
    ├── Routes
    │   ├── Index (Landing)
    │   ├── Auth (Login/Signup)
    │   ├── CitizenDashboard
    │   │   ├── IssueCard
    │   │   ├── ReportForm
    │   │   └── IssueMap
    │   ├── AdminDashboard
    │   │   ├── IssueCard
    │   │   ├── AdminAnalytics
    │   │   └── IssueMap
    │   └── ApiDocs (Swagger)
    └── NotFound
```

### API Integration Layer

**`src/lib/supabase-api.ts`** - Central API hub

```typescript
export const issuesApi = {
  createIssue(),
  getIssues(),
  getIssueById(),
  updateIssue(),
  deleteIssue(),
  toggleUpvote(),
  getIssueStatistics()
}

export const profileApi = { ... }
export const categoriesApi = { ... }
export const commentsApi = { ... }
export const notificationsApi = { ... }
export const adminApi = { ... }
```

---

## 🚀 Performance Optimizations

### Frontend
- ⚡ Vite for instant HMR
- 📦 Code splitting by route
- 🖼️ Lazy loading for images
- 💾 React Query caching (30s stale time)
- 🔄 Optimistic UI updates

### Backend
- 📊 Database indexes on frequently queried columns
- 🔍 Efficient RLS policies
- ⚙️ Database functions for complex queries
- 🎯 Selective field fetching
- 📄 Pagination (limit/offset)

### Maps
- 🗺️ Marker clustering for large datasets
- 🎨 Custom map styles cached
- 📍 Lazy loading of map tiles

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Hook behavior
- Utility functions

### Integration Tests
- API calls
- Authentication flow
- Database operations

### E2E Tests
- User journeys
- Form submissions
- Dashboard interactions

---

## 📊 Monitoring & Analytics

### Frontend Monitoring
- React DevTools
- Network requests
- Console errors

### Backend Monitoring
- Supabase Dashboard
- Query performance
- Database size
- API usage

### User Analytics
- Issue creation rate
- Resolution time
- User engagement
- Geographic distribution

---

## 🔮 Scalability Considerations

### Current Limits
- **Free Tier**: 500MB database, 2GB bandwidth
- **Maps**: $200/month free ($7/1k loads after)
- **Clerk**: 10k MAU free

### Scaling Path
1. **Database**: Upgrade Supabase plan
2. **CDN**: Add Cloudflare for static assets
3. **Caching**: Redis for frequently accessed data
4. **Search**: Algolia for advanced search
5. **Storage**: Supabase Storage for images

---

## 🎯 Key Design Decisions

### Why Supabase?
- ✅ PostgreSQL (proven, powerful)
- ✅ Built-in auth and RLS
- ✅ Real-time subscriptions
- ✅ Auto-generated REST API
- ✅ Generous free tier

### Why Clerk?
- ✅ Best-in-class auth UX
- ✅ Social login support
- ✅ JWT tokens for Supabase
- ✅ User management UI
- ✅ Easy integration

### Why React Query?
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Devtools included
- ✅ TypeScript support

### Why Vite?
- ✅ Instant server start
- ✅ Lightning-fast HMR
- ✅ Optimized builds
- ✅ ESM native
- ✅ Great DX

---

**Architecture Status**: ✅ Production-Ready
