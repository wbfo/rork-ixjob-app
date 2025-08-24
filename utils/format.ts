import { Platform } from 'react-native';

export function fDate(date: Date | number | string, lang: string): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(d);
  } catch (e) {
    console.log('fDate error', e);
    return String(date);
  }
}

export function fDateTime(date: Date | number | string, lang: string): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
  } catch (e) {
    console.log('fDateTime error', e);
    return String(date);
  }
}

export function fNum(n: number, lang: string): string {
  try {
    return new Intl.NumberFormat(lang).format(n);
  } catch (e) {
    console.log('fNum error', e);
    return String(n);
  }
}
