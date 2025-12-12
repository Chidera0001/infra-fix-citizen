import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAnonymous = searchParams.get('anonymous') === 'true';

  return (
    <MainLayout>
      <div className='flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <Card className='w-full max-w-md border-0 shadow-2xl'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
              <CheckCircle2 className='h-10 w-10 text-green-600' />
            </div>
            <CardTitle className='text-2xl font-bold text-gray-900'>
              Thank You!
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='text-center'>
              <p className='text-gray-600'>
                {isAnonymous
                  ? 'Your anonymous report has been submitted successfully. We appreciate you taking the time to help improve our community!'
                  : 'Your report has been submitted successfully. We appreciate you taking the time to help improve our community!'}
              </p>
            </div>

            {isAnonymous && (
              <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                <p className='text-sm text-green-800'>
                  <strong>Note:</strong> Since you reported anonymously, you
                  won't be able to track the status of this report. Consider
                  creating an account to track your reports and contribute to
                  the community!
                </p>
              </div>
            )}

            <div className='flex flex-col gap-3'>
              {isAnonymous && (
                <Button
                  onClick={() => navigate('/auth?mode=signup')}
                  className='w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
                >
                  Create Account
                </Button>
              )}
              <Button
                onClick={() => navigate('/')}
                variant='outline'
                className='w-full rounded-xl border-green-300 hover:bg-green-50'
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ThankYou;
