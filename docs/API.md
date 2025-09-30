# API Documentation

This document provides comprehensive information about the Infrastructure Fix Citizen API.

## 🌐 Accessing the API Documentation

### Interactive Documentation
Visit the interactive API documentation at: **[/api-docs](http://localhost:3000/api-docs)**

The interactive documentation includes:
- 📋 Complete API reference
- 🧪 Try-it-out functionality
- 🔐 Authentication testing
- 📥 Request/response examples
- 📊 Schema definitions

### OpenAPI Specification
- **YAML Format**: [/api-spec.yaml](http://localhost:3000/api-spec.yaml)
- **JSON Format**: Available via generation script

## 🚀 Quick Start

### 1. Authentication
All protected endpoints require a JWT token from Clerk authentication:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://suasdgighpwmxgiuefvb.supabase.co/rest/v1/issues
```

### 2. Basic Usage Examples

#### Get All Issues
```bash
curl -X GET "https://suasdgighpwmxgiuefvb.supabase.co/rest/v1/issues" \
     -H "apikey: YOUR_SUPABASE_ANON_KEY"
```

#### Create an Issue
```bash
curl -X POST "https://suasdgighpwmxgiuefvb.supabase.co/rest/v1/issues" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "apikey: YOUR_SUPABASE_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Pothole on Main Street",
       "description": "Large pothole causing traffic issues",
       "category": "pothole",
       "location_lat": 6.5244,
       "location_lng": 3.3792
     }'
```

## 📊 API Overview

### Base URLs
- **Production**: `https://suasdgighpwmxgiuefvb.supabase.co/rest/v1`
- **Local Development**: `http://localhost:54321/rest/v1`

### Authentication
- **Type**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`
- **Provider**: Clerk Authentication

### Rate Limits
- **Authenticated Users**: 100 requests/minute
- **Unauthenticated Users**: 20 requests/minute

## 🗂️ API Endpoints

### Issues Management

#### `GET /issues`
Retrieve all infrastructure issues with optional filtering.

**Query Parameters:**
- `status`: Filter by status (`open`, `in_progress`, `resolved`, `closed`)
- `category`: Filter by category (`pothole`, `street_lighting`, etc.)
- `lat`, `lng`, `radius`: Location-based filtering
- `limit`, `offset`: Pagination

#### `POST /issues`
Create a new infrastructure issue.

**Required Fields:**
- `title`: Issue title (10-100 characters)
- `description`: Detailed description (20-1000 characters)
- `category`: Issue category
- `location_lat`, `location_lng`: GPS coordinates

#### `GET /issues/{id}`
Get a specific issue with full details including comments and updates.

#### `PATCH /issues/{id}`
Update an existing issue (admin or reporter only).

#### `DELETE /issues/{id}`
Delete an issue (admin or reporter only).

#### `POST /issues/{id}/upvote`
Toggle upvote for an issue.

### Comments

#### `GET /issues/{id}/comments`
Get all comments for a specific issue.

#### `POST /issues/{id}/comments`
Add a comment to an issue.

### User Profiles

#### `GET /profiles`
Get current user's profile.

#### `PATCH /profiles`
Update current user's profile.

### Categories

#### `GET /categories`
Get all available issue categories.

### Statistics

#### `POST /rpc/get_issue_statistics`
Get comprehensive statistics about issues.

## 📋 Data Models

### Issue
```typescript
interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  severity: IssueSeverity;
  location_lat: number;
  location_lng: number;
  address?: string;
  image_urls: string[];
  upvotes: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}
```

### Comment
```typescript
interface Comment {
  id: string;
  issue_id: string;
  comment: string;
  is_official: boolean;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}
```

### Profile
```typescript
interface Profile {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  role: UserRole;
  location_lat?: number;
  location_lng?: number;
  address?: string;
}
```

## 🔒 Security

### Authentication Flow
1. User signs in through Clerk
2. Clerk provides JWT token
3. Include token in `Authorization` header
4. Supabase validates token via RLS policies

### Row Level Security (RLS)
All database tables have RLS policies that ensure:
- Users can only access their own data
- Admins have elevated permissions
- Public data is accessible to all authenticated users

### API Key Requirements
- All requests require `apikey` header with Supabase anon key
- Protected endpoints also require `Authorization` header

## 📈 Response Formats

### Success Response
```json
{
  "data": [...],
  "status": 200,
  "statusText": "OK"
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "title",
      "message": "Title must be at least 10 characters long"
    }
  },
  "status": 400
}
```

## 🛠️ Development Tools

### Generate API Specification
```bash
npm run generate-api-spec
```
This script connects to your Supabase database and generates an OpenAPI specification based on your current schema.

### Test API Endpoints
Use the interactive documentation at `/api-docs` to test all endpoints with real data.

### Postman Collection
A Postman collection is available in the `docs/` directory for comprehensive API testing.

## 🐛 Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input data |
| `UNAUTHORIZED` | Missing or invalid authentication |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## 📚 Additional Resources

- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Clerk Authentication**: [clerk.com/docs](https://clerk.com/docs)
- **OpenAPI Specification**: [swagger.io/specification](https://swagger.io/specification/)

## 🤝 Contributing

When adding new API endpoints:
1. Update the OpenAPI specification
2. Add proper TypeScript types
3. Include comprehensive tests
4. Update this documentation
5. Generate new API spec with `npm run generate-api-spec`

---

For more detailed information, visit the interactive API documentation at [/api-docs](http://localhost:3000/api-docs).
