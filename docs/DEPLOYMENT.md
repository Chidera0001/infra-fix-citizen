# Deployment Guide

This guide covers how to deploy the Infrastructure Fix Citizen application to production environments.

## 🚀 Deployment Options

### 1. Vercel (Recommended for Frontend)

#### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

#### Steps
1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   
2. **Configure Environment Variables**
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_production_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
3. **Deploy**
   - Vercel will automatically build and deploy
   - Every push to main branch triggers deployment

#### Vercel Configuration File
Create `vercel.json`:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### 2. Netlify

#### Steps
1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Connect your GitHub repository
   
2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   
3. **Environment Variables**
   Set the same environment variables as Vercel
   
#### Netlify Configuration File
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

### 3. AWS S3 + CloudFront

#### Prerequisites
- AWS Account
- AWS CLI configured
- S3 bucket created
- CloudFront distribution set up

#### Deployment Script
```bash
#!/bin/bash

# Build the application
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 4. Docker Deployment

#### Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
}
```

## 🗄️ Database Deployment (Supabase)

### Production Setup
1. **Create Production Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project for production
   
2. **Run Migrations**
   ```bash
   # Link to production project
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Push migrations
   supabase db push
   ```
   
3. **Set Environment Variables**
   Update your deployment platform with production Supabase URLs and keys

### Database Security
- Enable Row Level Security (RLS)
- Configure proper API limits
- Set up monitoring and alerts
- Regular backups

## 🔐 Environment Configuration

### Production Environment Variables
```bash
# Required
VITE_GOOGLE_MAPS_API_KEY=your_production_maps_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Optional
VITE_APP_ENV=production
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

### Security Considerations
- Use different API keys for production
- Restrict API keys to production domains
- Enable HTTPS only
- Set up proper CORS policies

## 📊 Monitoring and Analytics

### Error Tracking (Sentry)
1. **Install Sentry**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```
   
2. **Configure Sentry**
   ```typescript
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: import.meta.env.VITE_SENTRY_DSN,
     integrations: [
       new Sentry.BrowserTracing(),
     ],
     tracesSampleRate: 1.0,
   });
   ```

### Performance Monitoring
- Use Lighthouse CI for performance audits
- Monitor Core Web Vitals
- Set up uptime monitoring

### Analytics
- Google Analytics 4
- Supabase Analytics
- Custom event tracking

## 🔄 CI/CD Pipeline

### GitHub Actions
The repository includes a GitHub Actions workflow that:
- Runs tests on multiple Node.js versions
- Performs type checking and linting
- Builds the application
- Deploys to production (main branch only)

### Secrets Configuration
Add these secrets to your GitHub repository:
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VERCEL_TOKEN` (if using Vercel)

## 🚨 Troubleshooting

### Common Issues
1. **Build Failures**
   - Check environment variables
   - Verify Node.js version
   - Clear cache and reinstall dependencies
   
2. **Runtime Errors**
   - Check browser console
   - Verify API endpoints
   - Check network requests
   
3. **Performance Issues**
   - Analyze bundle size
   - Check for memory leaks
   - Optimize images and assets

### Health Checks
- API endpoint health checks
- Database connection tests
- External service availability

## 📈 Scaling Considerations

### Performance Optimization
- Enable CDN
- Implement caching strategies
- Use code splitting
- Optimize images

### Infrastructure Scaling
- Load balancing
- Database read replicas
- Caching layers (Redis)
- Monitoring and alerting

## 🔙 Rollback Strategy

### Quick Rollback
- Keep previous builds available
- Use feature flags for gradual rollouts
- Database migration rollback procedures
- Monitoring for immediate issues

### Disaster Recovery
- Regular database backups
- Infrastructure as Code
- Documentation of all procedures
- Testing of recovery processes

---

Choose the deployment strategy that best fits your needs and infrastructure requirements. For most applications, Vercel or Netlify provide the simplest deployment experience with excellent performance.
