import fs from 'node:fs';
import path from 'node:path';
import type { PostMeta } from '@/types';

/**
 * GA4 조회수 스냅샷. scripts/fetch-popular-posts.mjs가 CI 크론에서 굽고 커밋한다.
 * 빌드는 이 파일만 읽으므로 네트워크 없이도 성공하고, 파일이 없으면 최신순으로 폴백한다.
 */
export const POPULAR_DATA_FILE = path.join(
  process.cwd(),
  'data',
  'popular.json',
);

export interface PopularEntry {
  slug: string;
  /** ko/en 합산 페이지뷰 */
  views: number;
}

export interface PopularData {
  /** 데이터가 마지막으로 바뀐 날(YYYY-MM-DD). 아직 한 번도 수집되지 않았으면 null. */
  updatedAt: string | null;
  rangeDays: number;
  items: PopularEntry[];
}

/** 인기 글 항목. views가 null이면 조회수가 없어 최신순으로 채운 자리다. */
export interface PopularPost extends PostMeta {
  views: number | null;
}

const cache = new Map<string, PopularData | null>();

/** 손상된 필드는 통째로 버리지 않고 걸러 낸다 — 순위가 비는 것보다 낫다. */
function parsePopularData(raw: string): PopularData | null {
  const data: unknown = JSON.parse(raw);
  if (typeof data !== 'object' || data === null) return null;
  const { updatedAt, rangeDays, items } = data as Record<string, unknown>;
  if (!Array.isArray(items)) return null;

  return {
    updatedAt: typeof updatedAt === 'string' ? updatedAt : null,
    rangeDays: typeof rangeDays === 'number' ? rangeDays : 0,
    items: items.flatMap((item) => {
      if (typeof item !== 'object' || item === null) return [];
      const { slug, views } = item as Record<string, unknown>;
      if (typeof slug !== 'string' || typeof views !== 'number') return [];
      if (!Number.isFinite(views) || views <= 0) return [];
      return [{ slug, views }];
    }),
  };
}

/** 조회수 스냅샷을 읽는다(파일이 없거나 깨졌으면 null). 빌드 중 로케일마다 호출되므로 메모한다. */
export function readPopularData(
  file: string = POPULAR_DATA_FILE,
): PopularData | null {
  const cached = cache.get(file);
  if (cached !== undefined) return cached;

  let data: PopularData | null = null;
  try {
    data = parsePopularData(fs.readFileSync(file, 'utf-8'));
  } catch {
    data = null;
  }
  cache.set(file, data);
  return data;
}

/** 테스트용 — 메모된 스냅샷을 비운다. */
export function clearPopularCache(): void {
  cache.clear();
}

/**
 * 조회수 내림차순 Top N.
 * - 동률이면 최신 글이 앞선다(posts는 이미 최신순).
 * - 조회수가 잡힌 글이 N개보다 적으면 나머지는 최신순으로 채우고 views는 null이 된다.
 * - 데이터 자체가 없으면 전부 최신순 — 계측 이전 상태에서도 위젯이 비지 않는다.
 */
export function rankPostsByViews(
  posts: PostMeta[],
  count: number,
  data: PopularData | null,
): PopularPost[] {
  const views = new Map(data?.items.map((item) => [item.slug, item.views]));
  const latest = (list: PostMeta[]) =>
    list.map((post) => ({ ...post, views: null }));

  if (views.size === 0) return latest(posts.slice(0, count));

  const recency = new Map(posts.map((post, index) => [post.slug, index]));
  const viewsOf = (slug: string) => views.get(slug) ?? 0;
  const recencyOf = (slug: string) => recency.get(slug) ?? Infinity;

  const ranked = posts
    .filter((post) => views.has(post.slug))
    .sort(
      (a, b) =>
        viewsOf(b.slug) - viewsOf(a.slug) ||
        recencyOf(a.slug) - recencyOf(b.slug),
    )
    .slice(0, count)
    .map((post) => ({ ...post, views: viewsOf(post.slug) }));

  if (ranked.length >= count) return ranked;

  const picked = new Set(ranked.map((post) => post.slug));
  const filler = posts
    .filter((post) => !picked.has(post.slug))
    .slice(0, count - ranked.length);
  return [...ranked, ...latest(filler)];
}
