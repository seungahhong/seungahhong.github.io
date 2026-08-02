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
  /**
   * Google Analytics 측정 ID. 첫 번째 ID로 gtag.js를 불러오고 전체에 config를 보낸다.
   * (`GoogleAnalytics` 컴포넌트 참고 — 인기 글 정렬이 이 조회수를 기준으로 한다)
   *
   * 살아 있는 ID만 넣을 것. 삭제된 속성 ID를 넣으면 gtag.js가 404(HTML)를 반환하고
   * 크롬이 ERR_BLOCKED_BY_ORB로 차단해 gtag.js 자체가 실행되지 않는다. 그러면 뒤에
   * 오는 멀쩡한 ID의 히트까지 통째로 유실된다. (`G-TYGQRJE1B8`이 이 경우였다)
   */
  gaIds: ['G-G8Z1HZWWYL'],
  /**
   * 검색 콘솔 소유권 확인 토큰.
   * Gatsby 시절 `<meta>`로 심어 두었던 값이며, 이 태그가 사라지면 확인이 풀려
   * 서치 콘솔의 색인 요청·사이트맵 제출이 실패한다. 삭제 금지.
   */
  verification: {
    google: 'DafIPWtLpIjdEIuERhMFfutDl2IoaF8b6CQTBYF6qsQ',
    naver: 'ab246841529a97bcf76ac7ed42d5a5c457a381bc',
  },
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

/** 조회수 축약 표기 (1234 → ko `1.2천`, en `1.2K`) */
export function formatViews(views: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(views);
}

/** 로케일별 날짜 포맷 (YYYY-MM-DD → 표시용) */
export function formatDate(date: string, locale: Locale): string {
  const [y, m, d] = date.split('-');
  if (!y || !m || !d) return date;
  return locale === 'ko' ? `${y}.${m}.${d}` : `${m}/${d}/${y}`;
}
