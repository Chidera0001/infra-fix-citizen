# 🛠️ Development Guide

Complete development workflow and best practices for Infrastructure Fix Citizen.

---

## 🚀 Development Setup

### 1. Prerequisites

```bash
Node.js v18+
npm or yarn
Git
Supabase CLI (optional)
```

### 2. Initial Setup

```bash
# Clone repository
git clone <your-repo-url>
cd infra-fix-citizen

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### 3. Available Scripts

```json
{
  "dev": "vite",                    // Start dev server
  "build": "vite build",            // Production build
  "preview": "vite preview",        // Preview build
  "lint": "eslint .",               // Run linter
  "lint:fix": "eslint . --fix",     // Fix lint issues
  "format": "prettier --write",     // Format code
  "type-check": "tsc --noEmit",     // Type checking
  "db:push": "npx supabase db push",// Push migrations
  "db:reset": "npx supabase db reset" // Reset database
}
```

---

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base shadcn/ui components
│   ├── AdminDashboard.tsx
│   ├── IssueCard.tsx
│   ├── IssueMap.tsx
│   └── ReportForm.tsx
│
├── pages/              # Route components
│   ├── Index.tsx
│   ├── Auth.tsx
│   ├── CitizenDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── ApiDocs.tsx
│
├── hooks/              # Custom React hooks
│   ├── use-issues.ts   # Issue CRUD hooks
│   ├── use-profile.ts  # Profile hooks
│   └── use-toast.ts    # Toast notifications
│
├── lib/                # Core utilities
│   └── supabase-api.ts # Supabase API functions
│
├── integrations/       # External services
│   └── supabase/
│       ├── client.ts   # Supabase client setup
│       └── types.ts    # Generated types
│
└── App.tsx            # Root component
```

---

## 🎨 Code Style

### TypeScript

```typescript
// ✅ Good: Use TypeScript types
interface Issue {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'resolved';
}

// ✅ Good: Use proper typing for functions
const createIssue = async (data: IssueInsert): Promise<Issue> => {
  const { data: issue, error } = await supabase
    .from('issues')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return issue;
};

// ❌ Bad: Using 'any'
const getData = async (): Promise<any> => { ... }
```

### React Components

```tsx
// ✅ Good: Functional components with TypeScript
interface IssueCardProps {
  issue: Issue;
  onUpdate: (id: string) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onUpdate }) => {
  return (
    <div className="card">
      <h3>{issue.title}</h3>
      <button onClick={() => onUpdate(issue.id)}>Update</button>
    </div>
  );
};

// ❌ Bad: Props without types
export const IssueCard = ({ issue, onUpdate }) => { ... }
```

### Hooks

```typescript
// ✅ Good: Custom hook with proper types
export function useIssues(filters?: IssueFilters) {
  return useQuery({
    queryKey: ['issues', filters],
    queryFn: () => issuesApi.getIssues(filters),
    staleTime: 30000,
  });
}

// Usage
const { data: issues, isLoading, error } = useIssues({ status: 'open' });
```

---

## 🔧 Adding New Features

### 1. Create a New Component

```typescript
// src/components/NewFeature.tsx
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NewFeatureProps {
  data: string;
}

export const NewFeature: React.FC<NewFeatureProps> = ({ data }) => {
  const [state, setState] = useState('');
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: 'Success',
      description: 'Action completed',
    });
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

### 2. Create a New Hook

```typescript
// src/hooks/use-new-feature.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/supabase-api';

export function useNewFeature(id: string) {
  return useQuery({
    queryKey: ['new-feature', id],
    queryFn: () => api.getNewFeature(id),
    enabled: !!id,
  });
}
```

### 3. Add API Function

```typescript
// src/lib/supabase-api.ts
export const newFeatureApi = {
  async getItem(id: string) {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createItem(item: ItemInsert) {
    const { data, error } = await supabase
      .from('table_name')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

---

## 🗄️ Working with Database

### Local Development

```bash
# Start local Supabase (Docker required)
npx supabase start

# Create new migration
npx supabase migration new your_migration_name

# Apply migrations
npx supabase db push

# Reset database
npx supabase db reset
```

### Remote Database

```bash
# Link to remote project
npx supabase link --project-ref your-ref

# Push changes
npx supabase db push

# Pull schema
npx supabase db pull
```

### Creating Migrations

```sql
-- supabase/migrations/005_add_new_feature.sql

-- Add new column
ALTER TABLE issues 
ADD COLUMN new_field TEXT;

-- Create index
CREATE INDEX idx_issues_new_field 
ON issues(new_field);

-- Add RLS policy
CREATE POLICY "Users can view new field"
ON issues FOR SELECT
USING (true);
```

---

## 🧪 Testing

### Component Testing

```typescript
// src/components/__tests__/IssueCard.test.tsx
import { render, screen } from '@testing-library/react';
import { IssueCard } from '../IssueCard';

describe('IssueCard', () => {
  it('renders issue title', () => {
    const issue = {
      id: '1',
      title: 'Test Issue',
      status: 'open'
    };

    render(<IssueCard issue={issue} />);
    expect(screen.getByText('Test Issue')).toBeInTheDocument();
  });
});
```

### Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useIssues } from '../use-issues';

describe('useIssues', () => {
  it('fetches issues', async () => {
    const { result } = renderHook(() => useIssues());

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

### Run Tests

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## 🐛 Debugging

### React DevTools

Install React DevTools browser extension:
- View component tree
- Inspect props and state
- Profile performance

### React Query DevTools

```tsx
// Already included in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Shows in bottom right corner
// View cached queries, mutations, status
```

### Supabase Logs

```
Supabase Dashboard → Logs → All Logs
```

Filter by:
- API calls
- Database queries
- Errors
- Slow queries

### Browser DevTools

```javascript
// Log Supabase queries
localStorage.setItem('supabase.debug', 'true');

// View in console
```

---

## 🎨 Styling

### Tailwind CSS

```tsx
// Use utility classes
<div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
</div>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

### shadcn/ui Components

```tsx
// Import from @/components/ui
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

// Use with variants
<Button variant="default" size="lg">
  Click Me
</Button>
```

### Custom Styles

```tsx
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  "more-classes"
)}>
  Content
</div>
```

---

## 🔐 Authentication

### Get Current User

```typescript
import { useUser } from '@clerk/clerk-react';

const Component = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in</div>;

  return <div>Hello {user.firstName}</div>;
};
```

### Protected Routes

```tsx
// src/components/AuthGuard.tsx
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <Navigate to="/auth" />;

  return <>{children}</>;
};
```

---

## 📱 Maps Integration

### Google Maps Component

```tsx
import { GoogleMap, Marker } from '@googlemaps/react-wrapper';

<GoogleMap
  center={{ lat: 6.5244, lng: 3.3792 }}
  zoom={12}
>
  {issues.map(issue => (
    <Marker
      key={issue.id}
      position={{ lat: issue.latitude, lng: issue.longitude }}
      onClick={() => handleMarkerClick(issue)}
    />
  ))}
</GoogleMap>
```

---

## 🚨 Error Handling

### API Errors

```typescript
try {
  const data = await issuesApi.createIssue(newIssue);
  toast({ title: 'Success!' });
} catch (error) {
  console.error('Error creating issue:', error);
  toast({
    title: 'Error',
    description: error.message,
    variant: 'destructive'
  });
}
```

### React Query Errors

```typescript
const { data, error, isError } = useIssues();

if (isError) {
  return <ErrorComponent error={error} />;
}
```

---

## ⚡ Performance Tips

### 1. React Query Caching

```typescript
// Increase stale time for static data
useQuery({
  queryKey: ['categories'],
  queryFn: getCategories,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 2. Lazy Loading

```typescript
// Lazy load routes
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

<Suspense fallback={<Loading />}>
  <AdminDashboard />
</Suspense>
```

### 3. Memoization

```typescript
import { useMemo } from 'react';

const filteredIssues = useMemo(() => {
  return issues.filter(i => i.status === 'open');
}, [issues]);
```

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

### Commit Message Format

```
feat: add user profile page
fix: resolve map rendering issue
docs: update API documentation
style: format code with prettier
refactor: simplify issue creation logic
test: add tests for IssueCard
```

---

## 📦 Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview

# Output in dist/ directory
```

---

## 🔍 Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

### Formatting

```bash
# Format with Prettier
npm run format

# Check formatting
npm run format:check
```

---

## 📚 Resources

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Supabase**: https://supabase.com/docs
- **React Query**: https://tanstack.com/query/latest/docs
- **shadcn/ui**: https://ui.shadcn.com

---

**Happy Coding!** 🚀
