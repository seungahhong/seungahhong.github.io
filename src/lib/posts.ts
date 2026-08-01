import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';
import type {
  CategoryCount,
  CategoryGroup,
  Post,
  PostAdjacency,
  PostFrontmatter,
  PostMeta,
  TagCount,
} from '@/types';
import { makeExcerpt, renderMarkdown, rewriteAssetSrc } from './markdown';
import { readingTime, wordCount } from './reading-time';

export const CONTENT_ROOT = path.join(process.cwd(), 'contents', 'blog');

interface PostSource {
  slug: string;
  contentLocale: Locale;
  filePath: string;
  relDir: string;
  frontmatter: PostFrontmatter;
  body: string;
}

type LocaleSources = Partial<Record<Locale, PostSource>>;

/**
 * 파일명에서 슬러그 베이스와 언어를 추출한다.
 * - `2024-03-18-pnpm.md`      → { base: '2024-03-18-pnpm', locale: ko(기본) }
 * - `2024-03-18-pnpm.en.md`   → { base: '2024-03-18-pnpm', locale: en }
 * - `2025-06-29-vite6.0.md`   → { base: '2025-06-29-vite6.0', locale: ko } ('.0'을 로케일로 오인하지 않음)
 */
export function deriveSlugAndLocale(fileName: string): {
  base: string;
  locale: Locale;
} {
  const withoutExt = fileName.replace(/\.md$/i, '');
  const parts = withoutExt.split('.');
  if (parts.length > 1) {
    const maybeLocale = parts[parts.length - 1];
    if (isLocale(maybeLocale)) {
      return { base: parts.slice(0, -1).join('.'), locale: maybeLocale };
    }
  }
  return { base: withoutExt, locale: defaultLocale };
}

/** contents/blog 하위의 모든 .md 파일 경로(assets 디렉토리 제외). */
export function listMarkdownFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'assets') continue;
        walk(full);
      } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
        out.push(full);
      }
    }
  };
  walk(root);
  return out.sort();
}

function normalizeDate(input: unknown): string {
  if (input instanceof Date) {
    return input.toISOString().slice(0, 10);
  }
  const str = String(input ?? '');
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : str;
}

function readPostSource(filePath: string, root: string): PostSource {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;
  const { base, locale } = deriveSlugAndLocale(path.basename(filePath));
  const relDir = path
    .dirname(path.relative(root, filePath))
    .split(path.sep)
    .join('/');
  const slug = frontmatter.slug ? String(frontmatter.slug) : base;
  return {
    slug,
    contentLocale: locale,
    filePath,
    relDir,
    frontmatter,
    body: content,
  };
}

let cache: { root: string; value: Map<string, LocaleSources> } | null = null;

function buildSources(root: string): Map<string, LocaleSources> {
  const map = new Map<string, LocaleSources>();
  for (const file of listMarkdownFiles(root)) {
    const src = readPostSource(file, root);
    const entry = map.get(src.slug) ?? {};
    entry[src.contentLocale] = src;
    map.set(src.slug, entry);
  }
  return map;
}

/** 슬러그별로 언어 변형을 묶은 소스 맵. 실 콘텐츠 루트만 캐시한다. */
export function getPostSources(
  root = CONTENT_ROOT,
): Map<string, LocaleSources> {
  if (root === CONTENT_ROOT && cache && cache.root === root) {
    return cache.value;
  }
  const value = buildSources(root);
  if (root === CONTENT_ROOT) {
    cache = { root, value };
  }
  return value;
}

/** 테스트용 캐시 초기화. */
export function __clearPostCache(): void {
  cache = null;
}

/** 요청 로케일 소스를 고르되, 없으면 기본 로케일 → 존재하는 첫 언어로 폴백. */
function pickSource(
  entry: LocaleSources,
  locale: Locale,
): PostSource | undefined {
  return entry[locale] ?? entry[defaultLocale] ?? Object.values(entry)[0];
}

function toMeta(src: PostSource): PostMeta {
  const fm = src.frontmatter;
  const date = normalizeDate(fm.date);
  const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : [];
  const excerpt = fm.summary ? String(fm.summary) : makeExcerpt(src.body);
  const thumbnail = fm.thumbnail
    ? rewriteAssetSrc(String(fm.thumbnail), src.relDir)
    : null;
  return {
    slug: src.slug,
    title: String(fm.title ?? src.slug),
    date,
    category: String(fm.category ?? '기타'),
    tags,
    thumbnail,
    github: fm.github ? String(fm.github) : null,
    excerpt,
    readingTime: readingTime(src.body),
    wordCount: wordCount(src.body),
    relDir: src.relDir,
    year: date.slice(0, 4),
    contentLocale: src.contentLocale,
  };
}

/** 날짜 내림차순, 동일 날짜는 제목 오름차순. */
export function sortPosts(posts: PostMeta[]): PostMeta[] {
  return [...posts].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.title.localeCompare(b.title);
  });
}

/** 로케일별 전체 포스트 메타(번역 없으면 기본 로케일로 폴백). */
export function getAllPosts(
  locale: Locale = defaultLocale,
  root = CONTENT_ROOT,
): PostMeta[] {
  const sources = getPostSources(root);
  const metas: PostMeta[] = [];
  for (const entry of sources.values()) {
    const src = pickSource(entry, locale);
    if (src) metas.push(toMeta(src));
  }
  return sortPosts(metas);
}

/** 정적 경로 생성을 위한 전체 슬러그. */
export function getAllSlugs(root = CONTENT_ROOT): string[] {
  return [...getPostSources(root).keys()];
}

/** 슬러그 + 로케일로 렌더된 포스트를 반환(없으면 null). */
export async function getPostBySlug(
  slug: string,
  locale: Locale = defaultLocale,
  root = CONTENT_ROOT,
): Promise<Post | null> {
  const entry = getPostSources(root).get(slug);
  if (!entry) return null;
  const src = pickSource(entry, locale);
  if (!src) return null;
  const meta = toMeta(src);
  const { html, headings } = await renderMarkdown(src.body, src.relDir);
  return { ...meta, html, headings };
}

/** 렌더 없이 메타데이터만 (generateMetadata에서 shiki 재실행을 피함). */
export function getPostMeta(
  slug: string,
  locale: Locale = defaultLocale,
  root = CONTENT_ROOT,
): PostMeta | null {
  const entry = getPostSources(root).get(slug);
  if (!entry) return null;
  const src = pickSource(entry, locale);
  return src ? toMeta(src) : null;
}

/** 이전(더 과거) / 다음(더 최근) 글. */
export function getAdjacentPosts(
  slug: string,
  locale: Locale = defaultLocale,
  root = CONTENT_ROOT,
): PostAdjacency {
  const posts = getAllPosts(locale, root);
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };
  const older = posts[index + 1];
  const newer = posts[index - 1];
  return {
    previous: older ? { slug: older.slug, title: older.title } : null,
    next: newer ? { slug: newer.slug, title: newer.title } : null,
  };
}

/** 카테고리별 그룹(글 수 내림차순). */
export function groupByCategory(posts: PostMeta[]): CategoryGroup[] {
  const map = new Map<string, PostMeta[]>();
  for (const post of posts) {
    const arr = map.get(post.category) ?? [];
    arr.push(post);
    map.set(post.category, arr);
  }
  return [...map.entries()]
    .map(([category, categoryPosts]) => ({ category, posts: categoryPosts }))
    .sort(
      (a, b) =>
        b.posts.length - a.posts.length || a.category.localeCompare(b.category),
    );
}

export function getCategoryCounts(posts: PostMeta[]): CategoryCount[] {
  return groupByCategory(posts).map((group) => ({
    category: group.category,
    count: group.posts.length,
  }));
}

/** 태그 사용 빈도(내림차순, 동률은 이름순). */
export function getTagCounts(posts: PostMeta[]): TagCount[] {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * 인기 글 Top N. 조회수 데이터가 없는 정적 사이트라 현재는 최신순 근사치.
 * (다음 라운드에서 GA/큐레이션 데이터로 교체 예정)
 */
export function getPopularPosts(posts: PostMeta[], count = 5): PostMeta[] {
  return posts.slice(0, count);
}
