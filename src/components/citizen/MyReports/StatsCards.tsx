import { Card, CardContent } from '@/components/ui/card';
import type { Issue } from '@/lib/supabase-api';

interface StatsCardsProps {
  reports: Issue[];
}

export const StatsCards = ({ reports }: StatsCardsProps) => {
  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === 'open').length,
    inProgress: reports.filter(r => r.status === 'in_progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  return (
    <div className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-4'>
      <Card className='border-green-200 bg-gradient-to-r from-green-50 to-green-100 shadow-lg'>
        <CardContent className='flex flex-col items-center justify-center gap-2 p-4 text-center'>
          <p className='text-sm font-medium text-green-600'>Total Reports</p>
          <p className='text-2xl font-bold text-green-900'>{stats.total}</p>
        </CardContent>
      </Card>

      <Card className='border-green-200 bg-gradient-to-r from-green-50 to-green-100 shadow-lg '>
        <CardContent className='flex flex-col items-center justify-center gap-2 p-4 text-center'>
          <p className='text-sm font-medium text-green-600'>Open Issues</p>
          <p className='text-2xl font-bold text-green-900'>{stats.open}</p>
        </CardContent>
      </Card>

      <Card className='border-green-200 bg-gradient-to-r from-green-50 to-green-100 shadow-lg'>
        <CardContent className='flex flex-col items-center justify-center gap-2 p-4 text-center'>
          <p className='text-sm font-medium text-green-600'>In Progress</p>
          <p className='text-2xl font-bold text-green-900'>{stats.inProgress}</p>
        </CardContent>
      </Card>

      <Card className='border-green-200 bg-gradient-to-r from-green-50 to-green-100'>
        <CardContent className='flex flex-col items-center justify-center gap-2 p-4 text-center'>
          <p className='text-sm font-medium text-green-600'>Resolved</p>
          <p className='text-2xl font-bold text-green-900'>{stats.resolved}</p>
        </CardContent>
      </Card>
    </div>
  );
};
