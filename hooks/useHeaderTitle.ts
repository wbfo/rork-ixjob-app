import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function titleCase(input: string): string {
  if (!input) return input;
  return input
    .split(' ')
    .map((word) => (word.length ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}

export function useHeaderTitle(key: string, vars?: Record<string, unknown>) {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const set = useCallback(() => {
    const raw = t(key, vars);
    const title = typeof raw === 'string' && raw.length > 0 ? titleCase(raw) : raw;
    try {
      const navs: Array<{ setOptions?: (opts: unknown) => void; getParent?: () => any }> = [];
      let nav: any = navigation;
      let guard = 0;
      while (nav && guard < 10) {
        navs.push(nav);
        const next = nav.getParent?.();
        if (!next || next === nav) break;
        nav = next;
        guard += 1;
      }
      for (const n of navs) {
        n.setOptions?.({ title });
      }
    } catch (e) {
      console.log('[useHeaderTitle] setOptions error', e);
    }
  }, [navigation, t, key, vars, i18n.language]);

  useFocusEffect(useCallback(() => { set(); }, [set]));

  useEffect(() => {
    const handler = () => set();
    i18n.on('languageChanged', handler);
    return () => { i18n.off('languageChanged', handler); };
  }, [i18n, set]);
}

export function useHeaderTitleLiteral(rawTitle: string) {
  const navigation = useNavigation();
  const title = typeof rawTitle === 'string' && rawTitle.length > 0 ? titleCase(rawTitle) : rawTitle;

  const set = useCallback(() => {
    try {
      const navs: Array<{ setOptions?: (opts: unknown) => void; getParent?: () => any }> = [];
      let nav: any = navigation;
      let guard = 0;
      while (nav && guard < 10) {
        navs.push(nav);
        const next = nav.getParent?.();
        if (!next || next === nav) break;
        nav = next;
        guard += 1;
      }
      for (const n of navs) {
        n.setOptions?.({ title });
      }
    } catch (e) {
      console.log('[useHeaderTitleLiteral] setOptions error', e);
    }
  }, [navigation, title]);

  useFocusEffect(useCallback(() => { set(); }, [set]));
}
