import { supabase } from '@/integrations/supabase/client';

/**
 * Wraps a Supabase query to handle session expiry and refresh
 */
export async function withSessionRefresh<T>(
  queryFn: () => Promise<T>
): Promise<T> {
  try {
    return await queryFn();
  } catch (error: any) {
    // Check if it's a JWT/session error
    if (
      error?.code === 'PGRST301' ||
      error?.message?.includes('JWT') ||
      error?.message?.includes('Invalid API key') ||
      error?.status === 401
    ) {
      // Try to refresh session
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw new Error('Session expired. Please sign in again.');
        }

        // Retry the query once
        return await queryFn();
      } catch (refreshError) {
        throw new Error('Session expired. Please sign in again.');
      }
    }
    throw error;
  }
}
