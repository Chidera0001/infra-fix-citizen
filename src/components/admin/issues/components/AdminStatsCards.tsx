import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock, CheckCircle, Users } from 'lucide-react';
import type { Issue } from '@/lib/supabase-api';

interface AdminStatsCardsProps {
  issues: Issue[];
}

export const AdminStatsCards = ({ issues }: AdminStatsCardsProps) => {
  const stats = {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    inProgress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  };

  return (
    <div className='mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4'>
      <Card className='border-green-200 bg-gradient-to-r from-green-50 to-green-100 shadow-lg'>
        <CardContent className='p-3 sm:p-4'>
          <div className='text-center'>
            <p className='text-xs font-medium text-green-600 sm:text-sm'>
              Total Issues
            </p>
            <p className='text-lg font-bold text-green-900 sm:text-2xl'>
              {stats.total}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className='border-green-200 bg-gradient-to-r from-green-50 to-green-100 shadow-lg'>
        <CardContent className='p-3 sm:p-4'>
          <div className='text-center'>
            <p className='text-xs font-medium text-green-600 sm:text-sm'>
              Open Issues
            </p>
            <p className='text-lg font-bold text-green-900 sm:text-2xl'>
              {stats.open}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className='border-green-200 bg-gradient-to-r from-green-50 to-green-100 shadow-lg'>
        <CardContent className='p-3 sm:p-4'>
          <div className='text-center'>
            <p className='text-xs font-medium text-green-600 sm:text-sm'>
              In Progress
            </p>
            <p className='text-lg font-bold text-green-900 sm:text-2xl'>
              {stats.inProgress}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className='border-green-200 bg-gradient-to-r from-green-50 to-green-100'>
        <CardContent className='p-3 sm:p-4'>
          <div className='text-center'>
            <p className='text-xs font-medium text-green-600 sm:text-sm'>
              Resolved
            </p>
            <p className='text-lg font-bold text-green-900 sm:text-2xl'>
              {stats.resolved}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
