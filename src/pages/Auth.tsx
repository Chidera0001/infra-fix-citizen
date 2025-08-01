
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CitiznLogo from '@/components/CitiznLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, BarChart3 } from 'lucide-react';

const Auth = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Handle redirect after successful authentication
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Always redirect to citizen dashboard after successful authentication
      window.location.href = '/citizen';
    }
  }, [isLoaded, isSignedIn, user]);

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <CitiznLogo size="md" />
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 flex-col justify-center">
          <div className="max-w-md">
            <CitiznLogo size="lg" variant="icon" className="mb-8 bg-white/10 backdrop-blur-sm" />
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              Join Your Community
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Start reporting issues and making a real difference in your community through transparent reporting and collaborative problem-solving.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-blue-100">
                <Shield className="h-5 w-5" />
                <span>Secure & Professional Platform</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <Users className="h-5 w-5" />
                <span>Community-Driven Solutions</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <BarChart3 className="h-5 w-5" />
                <span>Real-Time Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="lg:hidden mb-4">
                  <CitiznLogo size="md" className="justify-center" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  {mode === 'signin' ? 'Welcome Back' : 'Join Citizn'}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {mode === 'signin' 
                    ? 'Sign in to your account to continue making a difference'
                    : 'Create your account to start reporting and tracking issues'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  {mode === 'signin' ? (
                    <SignIn 
                      appearance={{
                        elements: {
                          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                          card: 'bg-transparent shadow-none',
                          headerTitle: 'hidden',
                          headerSubtitle: 'hidden',
                        }
                      }}
                      fallbackRedirectUrl="/citizen"
                    />
                  ) : (
                    <SignUp 
                      appearance={{
                        elements: {
                          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                          card: 'bg-transparent shadow-none',
                          headerTitle: 'hidden',
                          headerSubtitle: 'hidden',
                        }
                      }}
                      fallbackRedirectUrl="/citizen"
                    />
                  )}
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {mode === 'signin' 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
