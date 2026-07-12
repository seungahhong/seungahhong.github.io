import type { Locale } from '@/i18n/config';

/** `/ko`, `/en/posts` 같은 로케일 프리픽스 경로를 만든다. */
export function localePath(locale: Locale, sub = ''): string {
  const clean = sub.replace(/^\/+/, '');
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

export function postPath(locale: Locale, slug: string): string {
  return `/${locale}/posts/${slug}`;
}

export function tagPath(locale: Locale, tag: string): string {
  return `/${locale}/tags?tag=${encodeURIComponent(tag)}`;
}

export function categoryPath(locale: Locale, category: string): string {
  return `/${locale}/posts?category=${encodeURIComponent(category)}`;
}

/** 현재 pathname의 로케일 프리픽스를 target 로케일로 바꾼다(언어 스위처). */
export function swapLocaleInPath(pathname: string, target: Locale): string {
  const rest = pathname.replace(/^\/(ko|en)(?=\/|$)/, '');
  return `/${target}${rest || ''}`;
}

/** 페이지별 canonical + hreflang alternates (섹션 경로 sub 예: '/posts'). */
export function metadataAlternates(locale: Locale, sub = '') {
  return {
    canonical: localePath(locale, sub),
    languages: {
      ko: localePath('ko', sub),
      en: localePath('en', sub),
      'x-default': localePath('ko', sub),
    },
  };
}
