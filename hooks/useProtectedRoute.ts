import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthContext } from '@/providers/AuthProvider';
import { ROUTES } from '@/constants/routes';

export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to welcome');
      router.replace(ROUTES.WELCOME);
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}