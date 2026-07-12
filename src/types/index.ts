import type { Locale } from '@/i18n/config';

/** 마크다운 파일 상단 frontmatter 원본 형태 */
export interface PostFrontmatter {
  title: string;
  date: string;
  published?: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
  github?: string;
  comments?: boolean;
  summary?: string;
  slug?: string;
  lang?: Locale;
}

/** 목차(TOC) 항목 */
export interface TocHeading {
  id: string;
  text: string;
  depth: number; // 1 | 2 | 3
}

/** 목록/카드에 쓰이는 포스트 메타데이터 (본문 미포함) */
export interface PostMeta {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  tags: string[];
  thumbnail: string | null;
  github: string | null;
  excerpt: string;
  readingTime: number; // 분
  relDir: string; // contents/blog 기준 상대 디렉토리 (예: 2024/03)
  year: string;
  /** 이 메타가 실제로 어떤 언어 파일에서 왔는지 (번역 폴백 추적용) */
  contentLocale: Locale;
}

/** 상세 페이지용: 메타 + 렌더된 본문 + 목차 */
export interface Post extends PostMeta {
  html: string;
  headings: TocHeading[];
}

/** 이전/다음 글 네비게이션 */
export interface AdjacentPost {
  slug: string;
  title: string;
}

export interface PostAdjacency {
  previous: AdjacentPost | null;
  next: AdjacentPost | null;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface CategoryGroup {
  category: string;
  posts: PostMeta[];
}

/** 클라이언트 검색 인덱스 항목(경량, 직렬화 가능) */
export interface SearchDoc {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
  date: string;
}
