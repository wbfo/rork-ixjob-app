import { useCallback, useEffect, useMemo, useState } from 'react';
import { I18nManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import createContextHook from '@nkzw/create-context-hook';
import i18n, { type SupportedLanguage } from '@/i18n';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  isLoading: boolean;
  hasSelectedLanguage: boolean;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  getSuggestedLanguage: () => SupportedLanguage;
}

const STORAGE_KEY = 'appLanguage';

export const [LanguageProvider, useLanguage] = createContextHook<LanguageContextType>(() => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean>(false);

  const getSuggestedLanguage = useCallback((): SupportedLanguage => {
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    const supportedLanguages: SupportedLanguage[] = ['en', 'es', 'zh', 'ar', 'pt'];
    
    if (supportedLanguages.includes(deviceLanguage as SupportedLanguage)) {
      return deviceLanguage as SupportedLanguage;
    }
    
    return 'en';
  }, []);

  const setLanguage = useCallback(async (language: SupportedLanguage): Promise<void> => {
    console.log('Setting language to:', language);
    
    try {
      // Update i18n
      await i18n.changeLanguage(language);
      
      // Update local state
      setCurrentLanguage(language);
      setHasSelectedLanguage(true);
      
      // Persist to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, language);
      
      // Handle RTL for Arabic
      if (language === 'ar') {
        if (!I18nManager.isRTL) {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          if (Platform.OS !== 'web') {
            // On native platforms, we need to reload for RTL to take effect
            // For now, we'll just set it and let the user know
            console.log('RTL enabled for Arabic');
          }
        }
      } else {
        if (I18nManager.isRTL) {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
          if (Platform.OS !== 'web') {
            console.log('RTL disabled for non-Arabic language');
          }
        }
      }
      
      console.log('Language set successfully to:', language);
    } catch (error) {
      console.error('Error setting language:', error);
      throw error;
    }
  }, []);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        console.log('🌍 Initializing language...');
        
        // Check if language is stored
        const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        console.log('🔍 Stored language from AsyncStorage:', storedLanguage);
        
        if (storedLanguage && ['en', 'es', 'zh', 'ar', 'pt'].includes(storedLanguage)) {
          console.log('✅ Found valid stored language:', storedLanguage);
          // Set the language in i18n immediately
          await i18n.changeLanguage(storedLanguage);
          setCurrentLanguage(storedLanguage as SupportedLanguage);
          setHasSelectedLanguage(true);
          
          // Handle RTL for Arabic
          if (storedLanguage === 'ar') {
            if (!I18nManager.isRTL) {
              I18nManager.allowRTL(true);
              I18nManager.forceRTL(true);
            }
          } else {
            if (I18nManager.isRTL) {
              I18nManager.allowRTL(false);
              I18nManager.forceRTL(false);
            }
          }
        } else {
          console.log('❌ No stored language found, user needs to select');
          setHasSelectedLanguage(false);
          // Set default to English for i18n to work
          await i18n.changeLanguage('en');
          setCurrentLanguage('en');
        }
      } catch (error) {
        console.error('💥 Error initializing language:', error);
        setHasSelectedLanguage(false);
        // Fallback to English
        await i18n.changeLanguage('en');
        setCurrentLanguage('en');
      } finally {
        console.log('🏁 Language initialization complete, isLoading = false');
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  return useMemo(() => ({
    currentLanguage,
    isLoading,
    hasSelectedLanguage,
    setLanguage,
    getSuggestedLanguage
  }), [currentLanguage, isLoading, hasSelectedLanguage, setLanguage, getSuggestedLanguage]);
});