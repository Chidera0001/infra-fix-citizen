import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ApiDocsComponent from '@/components/api/SwaggerUI';

const ApiDocs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'API Documentation - Infrastructure Fix Citizen';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-green-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="text-sm text-muted-foreground">
              API Documentation
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApiDocsComponent />
      </main>
    </div>
  );
};

export default ApiDocs;
