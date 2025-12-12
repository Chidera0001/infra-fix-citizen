import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import LoadingPage from '@/components/ui/LoadingPage';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, signUp, signIn, signInWithGoogle } = useAuth();

  // Set initial mode from URL parameter, default to signin
  const initialMode = (
    searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  ) as 'signin' | 'signup';
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    nickname: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState(false);

  // Sync mode with URL parameter
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'signup') {
      setMode('signup');
    } else if (urlMode === 'signin') {
      setMode('signin');
    }
  }, [searchParams]);

  // Redirect if already authenticated or after successful sign-in
  useEffect(() => {
    if (!loading && user) {
      if (pendingNavigation) {
        setPendingNavigation(false);
      }
      navigate('/citizen');
    }
  }, [user, loading, navigate, pendingNavigation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        // Validate nickname is not the same as full name
        if (
          formData.nickname.trim().toLowerCase() ===
          formData.fullName.trim().toLowerCase()
        ) {
          setError('Nickname must be different from your real name');
          setIsSubmitting(false);
          return;
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          formData.nickname
        );
        if (error) {
          setError(error.message);
        } else {
          // Store email and password before switching modes
          const userEmail = formData.email;
          const userPassword = formData.password;

          setSuccess(
            'Account created successfully! Please check your email to verify your account. You can sign in once verified.'
          );

          // Clear fullName and nickname, switch to signin mode
          setFormData({
            email: userEmail,
            password: userPassword,
            fullName: '',
            nickname: '',
          });

          // Switch to signin mode
          setMode('signin');

          // Update URL to reflect signin mode without navigation (to preserve form state)
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('mode', 'signin');
          window.history.replaceState({}, '', newUrl.toString());
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message);
        } else {
          // Set flag to wait for user state update before navigating
          // The useEffect will handle navigation when user becomes available
          setPendingNavigation(true);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <LoadingPage
        text='Loading Citizn...'
        subtitle='Preparing your authentication experience'
      />
    );
  }

  return (
    <div className='h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
      <div className='flex h-screen'>
        {/* Left side - Image */}
        <div className='relative hidden overflow-hidden lg:flex lg:w-1/2'>
          <img
            src='/Assets/Images/LoginSignUp.jpg'
            alt='Citizn Platform'
            className='h-full w-full object-cover'
          />
        </div>

        {/* Right side - Auth Form */}
        <div className='flex flex-1 overflow-y-auto scrollbar-hide'>
          <div className='flex w-full justify-center p-4 sm:p-8'>
            <div className='w-full max-w-md'>
              {/* Logo */}
              <div className='mb-4 mt-8 flex justify-center sm:mt-0'>
                <img
                  src='/Assets/logo/Trademark.png'
                  alt='Citizn Logo'
                  className='h-10 w-auto'
                />
              </div>

              {/* Mode Toggle */}
              <div className='mb-4 flex rounded-xl bg-gray-100 p-1'>
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    mode === 'signin'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    mode === 'signup'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>
              <Card className='border-0 shadow-2xl'>
                <CardHeader className='pb-4 text-center'>
                  <CardTitle className='text-xl font-bold text-gray-900'>
                    {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 pt-0'>
                  {error && (
                    <Alert variant='destructive'>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className='border-green-200 bg-green-50'>
                      <AlertDescription className='text-green-800'>
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className='space-y-4'>
                    {mode === 'signup' && (
                      <>
                        <div className='space-y-2'>
                          <Label htmlFor='fullName'>Full Name</Label>
                          <Input
                            id='fullName'
                            name='fullName'
                            type='text'
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder='Enter your full name'
                            required
                            className='rounded-xl border-green-300 focus:border-green-500 focus:ring-green-500'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='nickname'>Nickname</Label>
                          <Input
                            id='nickname'
                            name='nickname'
                            type='text'
                            value={formData.nickname}
                            onChange={handleInputChange}
                            placeholder='Choose a fun nickname for the leaderboard'
                            required
                            className='rounded-xl border-green-300 focus:border-green-500 focus:ring-green-500'
                          />
                        </div>
                      </>
                    )}

                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder='Enter your email'
                        required
                        className='rounded-xl border-green-300 focus:border-green-500 focus:ring-green-500'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='password'>Password</Label>
                      <div className='relative'>
                        <Input
                          id='password'
                          name='password'
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder='Enter your password'
                          required
                          className='rounded-xl border-green-300 pr-10 focus:border-green-500 focus:ring-green-500'
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600'
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type='submit'
                      disabled={isSubmitting}
                      className='w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          {mode === 'signin'
                            ? 'Signing In...'
                            : 'Creating Account...'}
                        </>
                      ) : mode === 'signin' ? (
                        'Sign In'
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>

                  <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                      <span className='w-full border-t border-gray-300' />
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                      <span className='bg-white px-2 text-gray-500'>
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className='w-full rounded-xl border-gray-300 hover:bg-gray-50'
                  >
                    <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                      <path
                        fill='#4285F4'
                        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                      />
                      <path
                        fill='#34A853'
                        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                      />
                      <path
                        fill='#FBBC05'
                        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                      />
                      <path
                        fill='#EA4335'
                        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => navigate('/report-now?mode=anonymous')}
                    disabled={isSubmitting}
                    className='w-full rounded-xl border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                  >
                    Report Anonymously
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
