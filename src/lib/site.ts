import type { Locale } from '@/i18n/config';

export const siteConfig = {
  url: 'https://seungahhong.github.io',
  repo: 'https://github.com/seungahhong/seungahhong.github.io',
  since: 2020,
  social: {
    github: 'https://github.com/seungahhong',
    linkedin: 'https://www.linkedin.com/in/seungahhong/',
    notion:
      'https://material-debt-c1c.notion.site/39b2a3cc75bb80b1a4c0cacbf6af8cd1',
    portfolio: 'https://seungah-portfolio.vercel.app',
    email: 'gmm117@naver.com',
  },
  /** Google Analytics 측정 ID (다음 라운드에서 스크립트 연결) */
  gaIds: ['G-TYGQRJE1B8', 'G-G8Z1HZWWYL'],
} as const;

/** 로케일별 기본 소셜 공유 이미지(1200×630). 썸네일이 없는 페이지의 og:image. */
export const ogImagePath: Record<Locale, string> = {
  ko: '/og/ko.png',
  en: '/og/en.png',
};

/** 상단 내비게이션 항목 (라벨은 사전에서 dict.nav[key]) */
export const navItems = [
  { key: 'home', sub: '' },
  { key: 'posts', sub: '/posts' },
  { key: 'tags', sub: '/tags' },
  { key: 'about', sub: '/about' },
] as const;

export type NavKey = (typeof navItems)[number]['key'];

/** 카드 커버 그래픽을 슬러그로 안정적으로 선택 */
export function coverVariant(slug: string): 1 | 2 | 3 | 4 | 5 {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return ((hash % 5) + 1) as 1 | 2 | 3 | 4 | 5;
}

const GLYPHS = ['∞', '{ }', '◱', '⌕', '▲', '✦', '❋', '⧉'];

export function coverGlyph(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 17 + slug.charCodeAt(i)) >>> 0;
  }
  return GLYPHS[hash % GLYPHS.length];
}

/** 로케일별 날짜 포맷 (YYYY-MM-DD → 표시용) */
export function formatDate(date: string, locale: Locale): string {
  const [y, m, d] = date.split('-');
  if (!y || !m || !d) return date;
  return locale === 'ko' ? `${y}.${m}.${d}` : `${m}/${d}/${y}`;
}
