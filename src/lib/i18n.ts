import ko from '@/i18n/dictionaries/ko.json';
import en from '@/i18n/dictionaries/en.json';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';

/** ko 사전을 기준으로 사전 구조 타입을 유도한다(en도 동일 구조를 가진다). */
export type Dictionary = typeof ko;

const dictionaries: Record<Locale, Dictionary> = {
  ko,
  en: en as Dictionary,
};

/** 알 수 없는 로케일은 기본 로케일로 폴백한다. */
export function resolveLocale(locale: string | undefined | null): Locale {
  if (locale && isLocale(locale)) {
    return locale;
  }
  return defaultLocale;
}

/** 로케일에 해당하는 UI 사전을 반환한다(없으면 기본 로케일). */
export function getDictionary(locale: string | undefined | null): Dictionary {
  return dictionaries[resolveLocale(locale)];
}
