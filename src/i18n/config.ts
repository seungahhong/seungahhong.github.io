export const locales = ['ko', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

/** 로케일별 <html lang> 및 hreflang 값 */
export const localeHtmlLang: Record<Locale, string> = {
  ko: 'ko-KR',
  en: 'en',
};

/** 언어 스위처 표시 라벨 */
export const localeLabels: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
