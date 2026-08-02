import type { Locale } from '@/i18n/config';
import { siteConfig } from '@/lib/site';

/** siteConfig.url 기준 절대 URL (trailingSlash: true에 맞춰 끝에 `/` 보장). */
export function absoluteUrl(pathname: string): string {
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withSlash =
    clean === '/' ? '/' : clean.endsWith('/') ? clean : `${clean}/`;
  return `${siteConfig.url}${withSlash}`;
}

/**
 * 라우트 파라미터로 들어온 슬러그를 콘텐츠 슬러그로 되돌린다.
 * 정적 익스포트에서 `2020-02-17-c-c++`처럼 특수문자가 든 슬러그는
 * 페이지 컴포넌트에 퍼센트 인코딩된 채(`...c-c%2B%2B`) 들어오는 반면
 * `generateMetadata`에는 디코딩된 채 들어온다. 양쪽에서 이 함수를 거치면
 * 어느 쪽이든 파일 슬러그와 같은 문자열이 된다.
 */
export function decodeSlugParam(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    // 잘못된 퍼센트 시퀀스면 원본을 그대로 쓴다(어차피 조회에 실패해 404).
    return slug;
  }
}

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

/**
 * 페이지별 canonical + hreflang alternates (섹션 경로 sub 예: '/posts').
 *
 * 상대 경로를 넘기면 Next가 metadataBase에 붙이면서 마지막 세그먼트에 `.`이 있는 경로
 * (`.../2025-06-29-vite6.0`)를 파일로 보고 끝의 `/`를 생략한다. 그러면 실제 서빙 URL·
 * 사이트맵(`.../vite6.0/`)과 canonical이 어긋나 리다이렉트되는 URL이 된다.
 * 그래서 여기서 `absoluteUrl`로 끝의 `/`까지 확정한 절대 URL을 넘긴다.
 */
export function metadataAlternates(locale: Locale, sub = '') {
  return {
    canonical: absoluteUrl(localePath(locale, sub)),
    languages: {
      ko: absoluteUrl(localePath('ko', sub)),
      en: absoluteUrl(localePath('en', sub)),
      'x-default': absoluteUrl(localePath('ko', sub)),
    },
  };
}
