import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthContext } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';
import { LoadingView } from '@/components/LoadingView';

export default function IndexScreen() {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const { hasSelectedLanguage, isLoading: languageLoading } = useLanguage();

  useEffect(() => {
    console.log('🚀 Index screen effect triggered:', {
      authLoading,
      languageLoading,
      hasSelectedLanguage,
      isAuthenticated
    });
    
    if (!authLoading && !languageLoading) {
      console.log('📍 Both loading states are false, making routing decision...');
      
      // First check if language has been selected
      if (!hasSelectedLanguage) {
        console.log('🌍 No language selected, redirecting to language selection');
        router.replace('/language');
        return;
      }

      // Then check authentication
      if (isAuthenticated) {
        console.log('🔐 User authenticated, redirecting to dashboard');
        router.replace(ROUTES.TABS.DASHBOARD);
      } else {
        console.log('👋 User not authenticated, redirecting to welcome');
        router.replace(ROUTES.WELCOME);
      }
    } else {
      console.log('⏳ Still loading - authLoading:', authLoading, 'languageLoading:', languageLoading);
    }
  }, [isAuthenticated, authLoading, hasSelectedLanguage, languageLoading]);

  return <LoadingView message="Initializing..." />;
}