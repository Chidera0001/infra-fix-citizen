import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Book } from 'lucide-react';
import LoadingPage from '@/components/ui/LoadingPage';

interface ApiDocsProps {
  className?: string;
}

const ApiDocs: React.FC<ApiDocsProps> = ({ className }) => {
  const [apiSpec, setApiSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApiSpec = async () => {
      try {
        setLoading(true);
        
        // Load the API spec from the public directory
        const response = await fetch('/api-spec.yaml');
        if (!response.ok) {
          throw new Error('Failed to load API specification');
        }
        const yamlText = await response.text();
        
        // Set the YAML text directly - SwaggerUI can parse YAML
        setApiSpec(yamlText);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load API documentation');
      } finally {
        setLoading(false);
      }
    };

    loadApiSpec();
  }, []);

  const handleDownloadSpec = () => {
    if (apiSpec) {
      const blob = new Blob([apiSpec], { type: 'application/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'infra-fix-citizen-api-spec.yaml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return <LoadingPage text="Loading API Documentation..." subtitle="Fetching the latest API specifications" />;
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading API Docs</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Infrastructure Fix Citizen API
              </CardTitle>
              <CardDescription>
                Comprehensive API documentation for reporting and managing infrastructure issues
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">v1.0.0</Badge>
              <Button
                onClick={handleDownloadSpec}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Spec
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">REST API</Badge>
              <span className="text-sm text-muted-foreground">OpenAPI 3.0.3</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Authentication</Badge>
              <span className="text-sm text-muted-foreground">JWT Bearer Token</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Rate Limited</Badge>
              <span className="text-sm text-muted-foreground">100 req/min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="justify-start gap-2" 
              onClick={() => {
                const issuesSection = document.querySelector('[data-tag="Issues"]');
                if (issuesSection) {
                  issuesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Issues API
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => {
                const commentsSection = document.querySelector('[data-tag="Comments"]');
                if (commentsSection) {
                  commentsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Comments API
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => {
                const profilesSection = document.querySelector('[data-tag="Profiles"]');
                if (profilesSection) {
                  profilesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Profiles API
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => {
                const categoriesSection = document.querySelector('[data-tag="Categories"]');
                if (categoriesSection) {
                  categoriesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Categories API
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => {
                const statisticsSection = document.querySelector('[data-tag="Statistics"]');
                if (statisticsSection) {
                  statisticsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Statistics API
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => {
                const adminSection = document.querySelector('[data-tag="Admin"]');
                if (adminSection) {
                  adminSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Admin API
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Swagger UI */}
      <div className="swagger-ui-container">
        <SwaggerUI
          spec={apiSpec}
          docExpansion="list"
          defaultModelsExpandDepth={2}
          defaultModelExpandDepth={2}
          displayOperationId={false}
          displayRequestDuration={true}
          filter={true}
          showExtensions={false}
          showCommonExtensions={false}
          tryItOutEnabled={true}
          requestInterceptor={(req) => {
            // Add authentication header if available
            const token = localStorage.getItem('clerk-db-jwt');
            if (token) {
              req.headers.Authorization = `Bearer ${token}`;
            }
            return req;
          }}
          onComplete={() => {
            // Custom styling after SwaggerUI loads
            const style = document.createElement('style');
            style.textContent = `
              .swagger-ui .topbar { display: none; }
              .swagger-ui .info { margin: 0; }
              .swagger-ui .scheme-container { background: transparent; box-shadow: none; }
              .swagger-ui .info .title { color: hsl(var(--foreground)); }
              .swagger-ui .info .description { color: hsl(var(--muted-foreground)); }
              .swagger-ui .btn.authorize { background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
              .swagger-ui .btn.authorize:hover { background-color: hsl(var(--primary)); opacity: 0.9; }
            `;
            document.head.appendChild(style);
          }}
        />
      </div>
    </div>
  );
};

export default ApiDocs;
