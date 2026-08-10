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
 * 스냅샷에 적힌 순서 그대로 Top N.
 * - items 배열이 곧 순위다. 여기서 다시 정렬하지 않는다 —
 *   scripts/fetch-popular-posts.mjs가 조회수 내림차순(동률은 슬러그순)으로 굽고,
 *   그 순서가 화면 순서와 어긋나지 않게 하려는 것이다.
 * - 조회수가 잡힌 글이 N개보다 적으면 나머지는 최신순으로 채우고 views는 null이 된다.
 * - 데이터 자체가 없으면 전부 최신순 — 계측 이전 상태에서도 위젯이 비지 않는다.
 */
export function rankPostsByViews(
  posts: PostMeta[],
  count: number,
  data: PopularData | null,
): PopularPost[] {
  const latest = (list: PostMeta[]) =>
    list.map((post) => ({ ...post, views: null }));

  const items = data?.items ?? [];
  if (items.length === 0) return latest(posts.slice(0, count));

  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const ranked: PopularPost[] = [];
  for (const item of items) {
    if (ranked.length >= count) break;
    const post = bySlug.get(item.slug);
    // 지워졌거나 중복으로 적힌 슬러그는 건너뛴다.
    if (!post) continue;
    bySlug.delete(item.slug);
    ranked.push({ ...post, views: item.views });
  }

  if (ranked.length >= count) return ranked;

  const picked = new Set(ranked.map((post) => post.slug));
  const filler = posts
    .filter((post) => !picked.has(post.slug))
    .slice(0, count - ranked.length);
  return [...ranked, ...latest(filler)];
}
