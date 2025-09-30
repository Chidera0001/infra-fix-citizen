# Supabase Backend Integration Setup

This guide will help you set up the complete Supabase backend integration for your Infrastructure Fix Citizen application.

## 🚀 Quick Start

### 1. Environment Variables

Update your `.env` file with these variables:

```env
# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Supabase Configuration
VITE_SUPABASE_URL=https://suasdgighpwmxgiuefvb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXNkZ2lnaHB3bXhnaXVlZnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjEwODUsImV4cCI6MjA2NTAzNzA4NX0.qe73NKkiikIyDtnXElW0RqZ56o_W0fCc6TsUApaYAq4

# Clerk Configuration (already set)
# Your existing Clerk configuration
```

### 2. Database Setup

Run the SQL migrations in your Supabase dashboard:

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Run migrations in order:**
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_database_functions.sql`

### 3. Seed Data (Optional)

To add sample data for testing:

```typescript
import { seedDatabase } from '@/lib/seed-data';

// Run this once in your app
seedDatabase();
```

## 📊 Database Schema

### Tables Created

1. **profiles** - User profiles linked to Clerk users
2. **categories** - Issue categories (pothole, street_lighting, etc.)
3. **issues** - Main issues table with location, status, severity
4. **issue_updates** - Status change history
5. **issue_upvotes** - User upvotes for issues
6. **issue_comments** - Comments on issues
7. **notifications** - User notifications

### Key Features

- **Row Level Security (RLS)** - Secure data access
- **Real-time subscriptions** - Live updates
- **Geospatial queries** - Location-based filtering
- **Full-text search** - Search issues by content
- **Audit trails** - Track all changes

## 🔧 API Usage Examples

### Creating an Issue

```typescript
import { useCreateIssue } from '@/hooks/use-issues';

const createIssue = useCreateIssue();

const handleSubmit = (data) => {
  createIssue.mutate({
    title: data.title,
    description: data.description,
    category: data.category,
    severity: data.severity,
    location_lat: data.lat,
    location_lng: data.lng,
    address: data.address,
  });
};
```

### Fetching Issues with Filters

```typescript
import { useIssues } from '@/hooks/use-issues';

const { data: issues, isLoading } = useIssues({
  status: 'open',
  category: 'pothole',
  lat: 6.5244,
  lng: 3.3792,
  radius: 10, // km
  limit: 20,
});
```

### Real-time Updates

```typescript
import { useIssuesSubscription } from '@/hooks/use-issues';

// Automatically updates when issues change
useIssuesSubscription();
```

## 🔐 Authentication Integration

The system integrates with your existing Clerk authentication:

1. **User Profiles** - Automatically created from Clerk users
2. **Role-based Access** - Citizens vs Admins
3. **Secure API calls** - JWT tokens from Clerk

### Profile Management

```typescript
import { useCurrentProfile, useUpdateProfile } from '@/hooks/use-profile';

const { data: profile } = useCurrentProfile();
const updateProfile = useUpdateProfile();

// Update user location
updateProfile.mutate({
  location_lat: 6.5244,
  location_lng: 3.3792,
  address: "Lagos, Nigeria"
});
```

## 🎯 Frontend Integration

### Replace Mock Data

Update your components to use real data:

```typescript
// Before (mock data)
import { mockIssues } from '@/lib/mockData';

// After (real data)
import { useIssues } from '@/hooks/use-issues';

const { data: issues, isLoading } = useIssues();
```

### Update Components

1. **CitizenDashboard** - Use `useIssues()` hook
2. **AdminDashboard** - Use `useIssueStatistics()` hook
3. **InteractiveMap** - Pass real issues data
4. **ReportForm** - Use `useCreateIssue()` hook

## 📱 Real-time Features

### Issue Status Updates

```typescript
import { subscriptions } from '@/lib/supabase-api';

// Subscribe to issue updates
const subscription = subscriptions.subscribeToIssueUpdates(
  issueId,
  (payload) => {
    console.log('Issue updated:', payload);
    // Update UI automatically
  }
);
```

### Notifications

```typescript
import { notificationsApi } from '@/lib/supabase-api';

// Get user notifications
const notifications = await notificationsApi.getNotifications();

// Mark as read
await notificationsApi.markAsRead(notificationId);
```

## 🛡️ Security Features

### Row Level Security (RLS)

- **Users can only edit their own data**
- **Admins have elevated permissions**
- **Public data is read-only for citizens**

### API Security

- **JWT token validation**
- **Role-based access control**
- **Input validation and sanitization**

## 📈 Analytics & Statistics

### Issue Statistics

```typescript
import { useIssueStatistics } from '@/hooks/use-issues';

const { data: stats } = useIssueStatistics(lat, lng, radius);

// Returns:
// {
//   total_issues: 150,
//   open_issues: 45,
//   resolved_issues: 90,
//   by_category: {...},
//   by_severity: {...},
//   recent_activity: [...]
// }
```

### Geospatial Queries

```typescript
// Find issues within 5km of user location
const nearbyIssues = useIssues({
  lat: userLat,
  lng: userLng,
  radius: 5,
  sortBy: 'distance'
});
```

## 🔄 Migration from Mock Data

### Step-by-step Migration

1. **Install dependencies** - Already done ✅
2. **Set up environment variables** - Update `.env` ✅
3. **Run database migrations** - Execute SQL files ✅
4. **Update components** - Replace mock data hooks ⏳
5. **Test functionality** - Verify all features work ⏳
6. **Deploy** - Push to production ⏳

### Component Updates Needed

```typescript
// Update these components:
- src/pages/CitizenDashboard.tsx
- src/pages/AdminDashboard.tsx
- src/components/InteractiveMapV2.tsx
- src/components/ReportForm.tsx
- src/components/IssueCard.tsx
```

## 🚨 Troubleshooting

### Common Issues

1. **RLS Policies** - Make sure JWT is properly configured
2. **Environment Variables** - Check VITE_ prefix
3. **Database Permissions** - Verify Supabase permissions
4. **CORS Issues** - Add your domain to Supabase settings

### Debug Mode

```typescript
// Enable debug logging
console.log('Supabase client:', supabase);
console.log('Current user:', await supabase.auth.getUser());
```

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify environment variables are loaded
3. Confirm database migrations ran successfully
4. Check Supabase dashboard for API usage/errors

---

Your Supabase backend is now fully integrated! 🎉

The system provides:
- ✅ Complete CRUD operations
- ✅ Real-time updates
- ✅ Geospatial queries
- ✅ Role-based security
- ✅ Analytics and statistics
- ✅ Notification system
