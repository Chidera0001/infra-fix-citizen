# Development Guide

This guide covers everything you need to know to develop and contribute to the Infrastructure Fix Citizen application.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Supabase CLI** (optional but recommended)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd infra-fix-citizen
   ```

2. **Run the setup script**
   ```bash
   npm run setup
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   └── layout/          # Layout components
├── features/            # Feature-based modules
│   ├── auth/           # Authentication
│   ├── issues/         # Issue management
│   ├── maps/           # Map functionality
│   └── admin/          # Admin features
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── pages/              # Page components
├── services/           # API services
└── types/              # TypeScript definitions
```

## 🛠️ Development Workflow

### 1. **Feature Development**

When adding a new feature:

1. Create a new directory in `src/features/`
2. Follow the feature structure:
   ```
   features/my-feature/
   ├── components/
   ├── hooks/
   ├── services/
   ├── types.ts
   └── index.ts
   ```
3. Export everything through `index.ts`
4. Add comprehensive tests

### 2. **Component Development**

- Use TypeScript for all components
- Follow the atomic design principles
- Include prop types and documentation
- Write tests for complex components

Example component structure:
```typescript
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onAction 
}) => {
  return (
    <div>
      <h2>{title}</h2>
      {onAction && (
        <button onClick={onAction}>Action</button>
      )}
    </div>
  );
};

export default MyComponent;
```

### 3. **API Integration**

- Use React Query for data fetching
- Create custom hooks for API operations
- Handle loading and error states
- Implement optimistic updates where appropriate

Example API hook:
```typescript
export function useCreateIssue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: issuesApi.createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries(['issues']);
    },
  });
}
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Component Tests
```bash
npm run test:components
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 🎨 Styling

### Tailwind CSS
- Use Tailwind utility classes
- Create custom components for repeated patterns
- Follow the design system

### Component Styling
```typescript
const Button = ({ variant = 'primary', size = 'md', children }) => {
  const baseClasses = 'font-semibold rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </button>
  );
};
```

## 📦 State Management

### Local State
- Use `useState` for simple component state
- Use `useReducer` for complex state logic

### Server State
- Use React Query for API data
- Implement proper cache invalidation
- Handle optimistic updates

### Global State
- Use React Context for app-wide state
- Keep context focused and minimal

## 🔧 Development Tools

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
npm run setup        # Initial project setup
npm run seed-db      # Seed database with initial data
```

### VS Code Extensions

Recommended extensions:
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

### Browser Extensions

For development:
- React Developer Tools
- Redux DevTools (if using Redux)
- Apollo Client DevTools (if using GraphQL)

## 🗄️ Database Development

### Migrations

Create new migrations:
```bash
supabase migration new migration_name
```

Apply migrations:
```bash
supabase db push
```

### Seed Data

Run the seeding script:
```bash
npm run seed-db
```

### Local Development

Start local Supabase:
```bash
supabase start
```

## 🔍 Debugging

### Client-side Debugging
- Use React DevTools
- Console logging with proper levels
- Network tab for API calls

### Server-side Debugging
- Check Supabase logs
- Use database query analyzer
- Monitor real-time subscriptions

## 📝 Code Style

### TypeScript Guidelines
- Use strict mode
- Define proper interfaces
- Avoid `any` type
- Use meaningful variable names

### React Guidelines
- Use functional components
- Implement proper error boundaries
- Use React.memo for expensive components
- Follow hooks rules

### Git Guidelines
- Use conventional commits
- Create feature branches
- Write descriptive commit messages
- Keep commits atomic

Example commit message:
```
feat(issues): add issue filtering by location

- Add geospatial filtering to issues API
- Implement radius-based search
- Update UI with location filter controls
```

## 🚀 Performance

### Optimization Techniques
- Code splitting with lazy loading
- Image optimization
- Bundle analysis
- Memoization where appropriate

### Monitoring
- Use React Profiler
- Monitor bundle size
- Track Core Web Vitals

## 🔒 Security

### Best Practices
- Validate all inputs
- Sanitize data before display
- Use environment variables for secrets
- Implement proper authentication

### Supabase Security
- Use Row Level Security (RLS)
- Validate permissions
- Monitor API usage

## 📱 Mobile Development

### Responsive Design
- Mobile-first approach
- Test on various screen sizes
- Use appropriate touch targets

### PWA Features
- Service worker implementation
- Offline functionality
- App manifest

## 🤝 Contributing

### Pull Request Process
1. Create a feature branch
2. Make your changes
3. Add tests
4. Update documentation
5. Submit pull request

### Code Review Guidelines
- Review for functionality
- Check code style
- Verify tests
- Ensure documentation is updated

## 📞 Getting Help

### Resources
- Check the documentation
- Search existing issues
- Ask in team chat
- Create a new issue if needed

### Common Issues
- Environment variable problems
- Database connection issues
- Build failures
- Type errors

---

Happy coding! 🎉
