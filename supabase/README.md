# Supabase Database Documentation

## 📊 Database Schema Overview

This directory contains all database migrations and schema definitions for the Infrastructure Fix Citizen platform.

## 📁 Structure

```
supabase/
├── config.toml                          # Supabase configuration
├── migrations/
│   ├── 001_initial_schema.sql          # Initial tables and types
│   ├── 002_rls_policies.sql            # Row Level Security policies
│   ├── 003_database_functions.sql      # Database functions and triggers
│   └── 004_complete_backend_setup.sql  # Complete setup (latest)
└── README.md                            # This file
```

## 🗄️ Database Tables

### Core Tables

#### `profiles`
User profiles extending Clerk authentication
- **Fields**: id, clerk_user_id, email, full_name, phone_number, role, location, address, is_active, avatar_url, bio
- **Roles**: citizen, admin, moderator
- **Indexes**: clerk_user_id, email, role, is_active

#### `categories`
Infrastructure issue categories
- **Fields**: id, name, description, icon, color, is_active, sort_order
- **Default Categories**: pothole, street_lighting, water_supply, traffic_signal, drainage, sidewalk, other

#### `issues`
Infrastructure problem reports
- **Fields**: id, title, description, category, status, severity, location (lat/lng), address, image_urls, upvotes, reporter_id, assigned_to, priority, due_date, costs, resolution_notes
- **Statuses**: open, in_progress, resolved, closed
- **Severities**: low, medium, high, critical
- **Indexes**: status, category, severity, reporter_id, assigned_to, location (spatial), created_at, upvotes

#### `issue_comments`
Comments on issues
- **Fields**: id, issue_id, user_id, comment, is_official, parent_id, created_at, updated_at
- **Features**: Nested comments support, official admin comments
- **Indexes**: issue_id, user_id, created_at

#### `issue_updates`
Status change history
- **Fields**: id, issue_id, user_id, old_status, new_status, comment, is_public, created_at
- **Purpose**: Track all status changes with audit trail

#### `issue_upvotes`
User votes on issues
- **Fields**: id, issue_id, user_id, created_at
- **Constraints**: Unique per user per issue
- **Indexes**: issue_id, user_id

#### `notifications`
User notifications
- **Fields**: id, user_id, issue_id, type, title, message, read, action_url, metadata, created_at
- **Types**: status_update, comment_added, issue_assigned, issue_resolved, system_announcement
- **Indexes**: user_id, read, type, created_at

## 🔧 Database Functions

### User Functions

#### `get_current_user_profile()`
Returns the UUID of the current authenticated user's profile.

#### `is_admin()`
Returns boolean indicating if current user is admin or moderator.

### Issue Functions

#### `get_issues_with_filters(...)`
Advanced issue filtering with pagination and sorting.

**Parameters:**
- `p_status` - Filter by status
- `p_category` - Filter by category
- `p_severity` - Filter by severity
- `p_lat`, `p_lng`, `p_radius_km` - Location-based filtering
- `p_limit`, `p_offset` - Pagination
- `p_sort_by`, `p_sort_order` - Sorting options

**Returns:** Issues with reporter info and distance calculations

#### `toggle_issue_upvote(p_issue_id)`
Toggle upvote for an issue (add if not exists, remove if exists).

**Returns:** JSON with action, upvoted status, and upvote count

#### `get_issue_statistics(p_lat, p_lng, p_radius_km)`
Get comprehensive statistics about issues.

**Returns:** JSON with:
- Total, open, in progress, resolved, closed counts
- Breakdown by category and severity
- Recent activity (last 30 days)

### Admin Functions

#### `get_admin_dashboard_analytics(p_period, p_area)`
Get comprehensive analytics for admin dashboard.

**Parameters:**
- `p_period` - Time period: '7d', '30d', '90d', '1y'
- `p_area` - Geographic area filter (optional)

**Returns:** JSON with:
- User statistics
- Issue counts by status and category
- Resolution rate and average resolution time
- Top reporters
- Recent activity trends

#### `get_system_health()`
Check system health and performance metrics.

**Returns:** JSON with system status and metrics

### Utility Functions

#### `create_notification(...)`
Create a new notification for a user.

#### `handle_new_user()`
Trigger function to auto-create profile on user registration.

#### `update_updated_at_column()`
Trigger function to automatically update updated_at timestamps.

#### `update_issue_upvote_count()`
Trigger function to maintain upvote count on issues.

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Profiles
- ✅ **SELECT**: Anyone can view all profiles
- ✅ **INSERT**: Users can insert their own profile
- ✅ **UPDATE**: Users can update own profile, admins can update any
- ✅ **DELETE**: Admins only

### Categories
- ✅ **SELECT**: Anyone can view categories
- ✅ **ALL**: Admins only for management

### Issues
- ✅ **SELECT**: Anyone can view issues
- ✅ **INSERT**: Authenticated users can create issues
- ✅ **UPDATE**: Users can update own issues, admins can update any
- ✅ **DELETE**: Admins only

### Comments
- ✅ **SELECT**: Anyone can view comments
- ✅ **INSERT**: Authenticated users can create comments
- ✅ **UPDATE**: Users can update own comments, admins can update any
- ✅ **DELETE**: Users can delete own comments, admins can delete any

### Upvotes
- ✅ **SELECT**: Users can view their own upvotes
- ✅ **INSERT**: Authenticated users can create upvotes
- ✅ **DELETE**: Users can delete their own upvotes

### Notifications
- ✅ **SELECT**: Users can view only their own notifications
- ✅ **UPDATE**: Users can update only their own notifications

## 🚀 Running Migrations

### Using Supabase CLI

```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations to Supabase
supabase db push

# Check status
supabase db status

# View migration history
supabase migration list
```

### Creating New Migrations

```bash
# Create a new migration file
supabase migration new your_migration_name

# This creates a new file in supabase/migrations/
# Add your SQL code to the file
# Then push with: supabase db push
```

### Resetting Database (Development Only)

```bash
# WARNING: This deletes all data
supabase db reset

# Confirm and it will re-run all migrations
```

## 📝 Sample Queries

### Get All Issues with Reporter Info
```sql
SELECT 
    i.*,
    p.full_name as reporter_name,
    p.email as reporter_email
FROM issues i
JOIN profiles p ON i.reporter_id = p.id
ORDER BY i.created_at DESC;
```

### Get Issue Statistics
```sql
SELECT * FROM get_issue_statistics(NULL, NULL, NULL);
```

### Get Admin Dashboard Data
```sql
SELECT * FROM get_admin_dashboard_analytics('30d', NULL);
```

### Find Nearby Issues
```sql
SELECT * FROM get_issues_with_filters(
    NULL,           -- status
    NULL,           -- category
    NULL,           -- severity
    6.5244,         -- latitude (Lagos)
    3.3792,         -- longitude (Lagos)
    10,             -- radius (10km)
    20,             -- limit
    0,              -- offset
    'distance',     -- sort by
    'ASC'           -- sort order
);
```

### User Activity Report
```sql
SELECT 
    p.full_name,
    COUNT(i.id) as issues_reported,
    COUNT(c.id) as comments_made,
    COUNT(u.id) as upvotes_given
FROM profiles p
LEFT JOIN issues i ON i.reporter_id = p.id
LEFT JOIN issue_comments c ON c.user_id = p.id
LEFT JOIN issue_upvotes u ON u.user_id = p.id
WHERE p.is_active = true
GROUP BY p.id, p.full_name
ORDER BY issues_reported DESC;
```

## 🔍 Indexes

All tables have optimized indexes for:
- Primary keys (automatic)
- Foreign keys (automatic)
- Frequently queried fields
- Spatial queries (PostGIS)
- Sorting and filtering

## 🔄 Triggers

### Auto-Update Timestamps
- Tables: profiles, issues, issue_comments
- Trigger: `update_updated_at_column()`
- Updates `updated_at` on every row update

### Upvote Count Maintenance
- Table: issue_upvotes
- Trigger: `update_issue_upvote_count()`
- Maintains accurate upvote count on issues

## 📊 Sample Data

The database includes sample data for testing:
- 2 test users (admin and citizen)
- 20 sample issues across all categories
- Sample comments and notifications
- Various statuses and severities

## 🛠️ Maintenance

### Vacuum and Analyze
```sql
VACUUM ANALYZE;
```

### Check Table Sizes
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Index Usage
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Troubleshooting

### Migration Fails
1. Check error message in console
2. Verify syntax in SQL file
3. Check if table/column already exists
4. Try: `supabase db reset` (loses data)

### RLS Policy Issues
1. Check if policies are enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. Verify JWT token is valid
3. Check user role in profiles table

### Performance Issues
1. Check slow queries: `SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC;`
2. Add missing indexes
3. Run VACUUM ANALYZE
4. Check connection pool settings

## ✅ Best Practices

1. **Always test migrations** in development first
2. **Backup your data** before major changes
3. **Use transactions** for multiple related changes
4. **Document your changes** in migration files
5. **Keep migrations small** and focused
6. **Use semantic versioning** for migration names
7. **Test RLS policies** thoroughly
8. **Monitor query performance** regularly

## 🔐 Security Checklist

- [ ] RLS enabled on all tables
- [ ] Policies tested for all user roles
- [ ] API keys stored securely
- [ ] Service role key used only server-side
- [ ] Input validation in triggers
- [ ] Sensitive data encrypted
- [ ] Regular security audits
- [ ] Connection limits configured
