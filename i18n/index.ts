import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './resources/en.json';
import es from './resources/es.json';
import zh from './resources/zh.json';
import ar from './resources/ar.json';
import pt from './resources/pt.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  ar: { translation: ar },
  pt: { translation: pt }
};

export type SupportedLanguage = 'en' | 'es' | 'zh' | 'ar' | 'pt';

export const setLanguage = async (language: SupportedLanguage): Promise<void> => {
  console.log('Setting i18n language to:', language);
  
  try {
    // Update i18n
    await i18n.changeLanguage(language);
    
    // Handle RTL for Arabic
    if (language === 'ar') {
      if (!I18nManager.isRTL) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
        console.log('RTL enabled for Arabic');
      }
    } else {
      if (I18nManager.isRTL) {
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
        console.log('RTL disabled for non-Arabic language');
      }
    }
    
    // Persist to AsyncStorage
    await AsyncStorage.setItem('appLanguage', language);
    
    console.log('Language set successfully to:', language);
  } catch (error) {
    console.error('Error setting language:', error);
    throw error;
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en',
    interpolation: {
      escapeValue: false
    },
    compatibilityJSON: 'v4',
    debug: false
  });

export default i18n;