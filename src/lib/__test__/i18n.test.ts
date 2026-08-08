import { describe, expect, it } from 'vitest';
import { getDictionary, resolveLocale } from '@/lib/i18n';
import ko from '@/i18n/dictionaries/ko.json';
import en from '@/i18n/dictionaries/en.json';
import { defaultLocale } from '@/i18n/config';

describe('resolveLocale', () => {
  it('returns the locale when it is supported', () => {
    expect(resolveLocale('ko')).toBe('ko');
    expect(resolveLocale('en')).toBe('en');
  });

  it('falls back to the default locale for unknown/empty input', () => {
    expect(resolveLocale('fr')).toBe(defaultLocale);
    expect(resolveLocale('')).toBe(defaultLocale);
    expect(resolveLocale(undefined)).toBe(defaultLocale);
    expect(resolveLocale(null)).toBe(defaultLocale);
  });
});

describe('getDictionary', () => {
  it('returns the correct dictionary per locale', () => {
    expect(getDictionary('ko')).toBe(ko);
    expect(getDictionary('en')).toBe(en);
  });

  it('falls back to the default (ko) dictionary for unknown locale', () => {
    expect(getDictionary('fr')).toBe(ko);
  });

  it('keeps ko and en dictionaries structurally identical (same keys)', () => {
    const collectKeys = (obj: unknown, prefix = ''): string[] => {
      if (obj === null || typeof obj !== 'object') return [prefix];
      return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
        collectKeys(v, prefix ? `${prefix}.${k}` : k),
      );
    };
    expect(collectKeys(en).sort()).toEqual(collectKeys(ko).sort());
  });

  it('exposes navigation labels used by the language switcher', () => {
    expect(getDictionary('ko').nav.home).toBe('홈');
    expect(getDictionary('en').nav.home).toBe('Home');
  });
});
