# 📚 API Reference

Complete API documentation for Infrastructure Fix Citizen platform.

---

## 🌐 Interactive Documentation

Visit **`/api-docs`** in your running application for interactive Swagger UI with:
- 🧪 Try-it-out functionality
- 📋 Complete request/response examples
- 🔐 Authentication testing
- 📥 Download OpenAPI spec

---

## 🔗 Base URL

```
Production: https://vnnuxlxqbucchlapyem.supabase.co/rest/v1
Development: http://localhost:54321/rest/v1
```

---

## 🔐 Authentication

All protected endpoints require JWT token from Clerk:

```bash
Authorization: Bearer <your_clerk_jwt_token>
```

**Headers Required:**
```json
{
  "apikey": "your_supabase_anon_key",
  "Authorization": "Bearer your_jwt_token",
  "Content-Type": "application/json"
}
```

---

## 📍 Endpoints Overview

### Issues
- `GET /issues` - List all issues
- `GET /issues?id=eq.{id}` - Get single issue
- `POST /issues` - Create issue
- `PATCH /issues?id=eq.{id}` - Update issue
- `DELETE /issues?id=eq.{id}` - Delete issue
- `POST /rpc/toggle_issue_upvote` - Toggle upvote

### Profiles
- `GET /profiles` - List profiles
- `GET /profiles?clerk_user_id=eq.{id}` - Get user profile
- `PATCH /profiles?id=eq.{id}` - Update profile

### Categories
- `GET /categories` - List all categories

### Comments
- `GET /issue_comments?issue_id=eq.{id}` - Get issue comments
- `POST /issue_comments` - Add comment
- `DELETE /issue_comments?id=eq.{id}` - Delete comment

### Notifications
- `GET /notifications?user_id=eq.{id}` - Get user notifications
- `PATCH /notifications?id=eq.{id}` - Mark as read

### Statistics
- `POST /rpc/get_issue_statistics` - Get aggregated stats

### Admin (Requires admin role)
- `POST /rpc/get_admin_dashboard_analytics` - Admin analytics
- `POST /rpc/generate_admin_report` - Generate reports
- `POST /rpc/get_system_health` - System health check

---

## 📋 Detailed Endpoints

### 1. List Issues

**Endpoint**: `GET /issues`

**Query Parameters:**
- `status=eq.open` - Filter by status (open, in_progress, resolved, closed)
- `category=eq.pothole` - Filter by category
- `severity=eq.high` - Filter by severity (low, medium, high, critical)
- `select=*` - Select specific fields
- `order=created_at.desc` - Sort results
- `limit=20` - Pagination limit
- `offset=0` - Pagination offset

**Example Request:**
```bash
curl "https://your-project.supabase.co/rest/v1/issues?status=eq.open&limit=10" \
  -H "apikey: your_anon_key"
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Large pothole on Main Street",
    "description": "Deep pothole causing vehicle damage",
    "category": "pothole",
    "status": "open",
    "severity": "high",
    "location": "Victoria Island, Lagos",
    "latitude": 6.4281,
    "longitude": 3.4219,
    "reporter_id": "...",
    "upvotes_count": 23,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

---

### 2. Get Single Issue

**Endpoint**: `GET /issues?id=eq.{issue_id}`

**Headers**: Include `apikey`

**Response:**
```json
{
  "id": "...",
  "title": "...",
  "description": "...",
  // ... all issue fields
}
```

---

### 3. Create Issue

**Endpoint**: `POST /issues`

**Headers**: 
- `apikey: your_anon_key`
- `Authorization: Bearer {jwt_token}`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Broken streetlight on Allen Avenue",
  "description": "Streetlight has been out for 2 weeks",
  "category": "streetlight",
  "severity": "medium",
  "location": "Allen Avenue, Ikeja",
  "latitude": 6.6018,
  "longitude": 3.3515
}
```

**Response:** `201 Created`
```json
{
  "id": "new-uuid",
  "title": "Broken streetlight on Allen Avenue",
  "status": "open",
  "reporter_id": "your-user-id",
  "upvotes_count": 0,
  "created_at": "2025-01-15T14:20:00Z",
  // ... other fields
}
```

---

### 4. Update Issue

**Endpoint**: `PATCH /issues?id=eq.{issue_id}`

**Headers**: Auth required

**Request Body:**
```json
{
  "status": "in_progress",
  "assigned_to": "admin-user-id"
}
```

**Response:** `200 OK`

---

### 5. Delete Issue

**Endpoint**: `DELETE /issues?id=eq.{issue_id}`

**Headers**: Auth required (own issues or admin)

**Response:** `204 No Content`

---

### 6. Toggle Upvote

**Endpoint**: `POST /rpc/toggle_issue_upvote`

**Headers**: Auth required

**Request Body:**
```json
{
  "p_issue_id": "issue-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "action": "added",
  "new_count": 24
}
```

---

### 7. Get Issue Statistics

**Endpoint**: `POST /rpc/get_issue_statistics`

**Headers**: Include `apikey`

**Request Body** (optional):
```json
{
  "p_lat": 6.5244,
  "p_lng": 3.3792,
  "p_radius_km": 5
}
```

**Response:**
```json
{
  "total_issues": 156,
  "open_issues": 45,
  "in_progress_issues": 32,
  "resolved_issues": 79,
  "critical_issues": 12,
  "high_severity_issues": 28,
  "avg_resolution_time_hours": 72.5,
  "issues_by_category": {
    "pothole": 42,
    "streetlight": 35,
    "drainage": 28,
    "water_supply": 20,
    "road_damage": 18,
    "traffic_light": 8,
    "waste_management": 5
  }
}
```

---

### 8. Get User Profile

**Endpoint**: `GET /profiles?clerk_user_id=eq.{clerk_id}`

**Headers**: Auth required

**Response:**
```json
{
  "id": "...",
  "clerk_user_id": "user_...",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "citizen",
  "location": "Lagos",
  "avatar_url": "https://...",
  "bio": "Active community member",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 9. Get Categories

**Endpoint**: `GET /categories`

**Response:**
```json
[
  {
    "id": "...",
    "name": "pothole",
    "description": "Road potholes and damage",
    "icon": "🕳️",
    "color": "#ef4444",
    "is_active": true
  },
  // ... more categories
]
```

---

### 10. Get Issue Comments

**Endpoint**: `GET /issue_comments?issue_id=eq.{issue_id}&order=created_at.desc`

**Response:**
```json
[
  {
    "id": "...",
    "issue_id": "...",
    "user_id": "...",
    "comment": "This is still not fixed!",
    "is_official": false,
    "created_at": "2025-01-15T16:00:00Z"
  }
]
```

---

### 11. Create Comment

**Endpoint**: `POST /issue_comments`

**Headers**: Auth required

**Request Body:**
```json
{
  "issue_id": "issue-uuid",
  "comment": "Great to see this being addressed!"
}
```

**Response:** `201 Created`

---

### 12. Get Admin Analytics

**Endpoint**: `POST /rpc/get_admin_dashboard_analytics`

**Headers**: Auth required (admin role)

**Request Body:**
```json
{
  "period_days": 30
}
```

**Response:**
```json
{
  "total_issues": 156,
  "new_issues_this_period": 45,
  "resolved_this_period": 32,
  "avg_resolution_time_hours": 68.2,
  "top_categories": [
    { "category": "pothole", "count": 42 },
    { "category": "streetlight", "count": 35 }
  ],
  "issues_by_status": {
    "open": 45,
    "in_progress": 32,
    "resolved": 79
  },
  "active_users": 234,
  "response_rate_percent": 85.5
}
```

---

## 🔍 Query Operators

Supabase PostgREST supports powerful query operators:

### Comparison
- `eq` - Equals: `?status=eq.open`
- `neq` - Not equals: `?status=neq.closed`
- `gt` - Greater than: `?upvotes_count=gt.10`
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal

### Pattern Matching
- `like` - LIKE operator: `?title=like.*pothole*`
- `ilike` - Case-insensitive LIKE: `?title=ilike.*POTHOLE*`

### List
- `in` - In list: `?status=in.(open,in_progress)`

### Range
- `order` - Sort: `?order=created_at.desc`
- `limit` - Limit: `?limit=10`
- `offset` - Offset: `?offset=20`

### Full-text
- `fts` - Full-text search: `?description=fts.pothole`

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Deleted successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid auth |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Contact support |

---

## 🔒 Permission Matrix

| Endpoint | Citizen | Admin | Public |
|----------|---------|-------|--------|
| GET /issues | ✅ | ✅ | ✅ |
| POST /issues | ✅ | ✅ | ❌ |
| PATCH /issues (own) | ✅ | ✅ | ❌ |
| PATCH /issues (any) | ❌ | ✅ | ❌ |
| DELETE /issues (own) | ✅ | ✅ | ❌ |
| DELETE /issues (any) | ❌ | ✅ | ❌ |
| GET /profiles | ✅ | ✅ | ❌ |
| POST /issue_comments | ✅ | ✅ | ❌ |
| Admin endpoints | ❌ | ✅ | ❌ |

---

## 💡 Usage Examples

### JavaScript/TypeScript

```typescript
import { supabase } from '@/integrations/supabase/client';

// Get all open issues
const { data, error } = await supabase
  .from('issues')
  .select('*')
  .eq('status', 'open')
  .order('created_at', { ascending: false })
  .limit(10);

// Create new issue
const { data: newIssue, error } = await supabase
  .from('issues')
  .insert({
    title: 'New Issue',
    description: 'Description here',
    category: 'pothole',
    severity: 'medium',
    location: 'Location',
    latitude: 6.5244,
    longitude: 3.3792
  })
  .select()
  .single();

// Toggle upvote
const { data, error } = await supabase
  .rpc('toggle_issue_upvote', {
    p_issue_id: 'issue-uuid'
  });
```

### Python

```python
from supabase import create_client

supabase = create_client(url, key)

# Get issues
response = supabase.table('issues') \
    .select('*') \
    .eq('status', 'open') \
    .execute()

# Create issue
response = supabase.table('issues') \
    .insert({
        'title': 'New Issue',
        'category': 'pothole',
        'latitude': 6.5244,
        'longitude': 3.3792
    }) \
    .execute()
```

---

## 🚀 Rate Limits

- **Free Tier**: 500 requests/hour
- **Pro Tier**: Unlimited

Monitor usage in Supabase Dashboard → Settings → Usage

---

## 📞 Support

- **Documentation**: See `/api-docs` in app
- **Issues**: Check RLS policies in Supabase
- **Errors**: Review browser console and network tab

---

**API Version**: 1.0  
**Last Updated**: January 2025  
**Status**: ✅ Production Ready


