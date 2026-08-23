import { afterEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  CONTENT_ROOT,
  deriveSlugAndLocale,
  getAdjacentPosts,
  getAllPosts,
  getAllSlugs,
  getCategoryCounts,
  getPostBySlug,
  getTagCounts,
  groupByCategory,
  sortPosts,
} from '@/lib/posts';
import type { PostMeta } from '@/types';

// ---- fixture helpers -------------------------------------------------------

const tmpRoots: string[] = [];

function fm(front: Record<string, unknown>, body = '본문'): string {
  const lines = Object.entries(front).map(
    ([k, v]) => `${k}: ${Array.isArray(v) ? JSON.stringify(v) : v}`,
  );
  return `---\n${lines.join('\n')}\n---\n\n${body}`;
}

function writeMd(root: string, rel: string, content: string): void {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
}

function makeFixture(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'posts-fixture-'));
  tmpRoots.push(root);
  for (const [rel, content] of Object.entries(files))
    writeMd(root, rel, content);
  return root;
}

function meta(partial: Partial<PostMeta>): PostMeta {
  return {
    slug: 'slug',
    title: 'title',
    date: '2024-01-01',
    category: '개발',
    tags: [],
    thumbnail: null,
    github: null,
    excerpt: '',
    readingTime: 1,
    wordCount: 0,
    relDir: '2024/01',
    year: '2024',
    contentLocale: 'ko',
    ...partial,
  };
}

afterEach(() => {
  while (tmpRoots.length) {
    const root = tmpRoots.pop();
    if (root) fs.rmSync(root, { recursive: true, force: true });
  }
});

// ---- pure helpers ----------------------------------------------------------

describe('deriveSlugAndLocale', () => {
  it('defaults to the default locale', () => {
    expect(deriveSlugAndLocale('2024-03-18-pnpm.md')).toEqual({
      base: '2024-03-18-pnpm',
      locale: 'ko',
    });
  });

  it('detects an .en translation variant', () => {
    expect(deriveSlugAndLocale('2024-03-18-pnpm.en.md')).toEqual({
      base: '2024-03-18-pnpm',
      locale: 'en',
    });
  });

  it('does not mistake a version suffix for a locale', () => {
    expect(deriveSlugAndLocale('2025-06-29-vite6.0.md')).toEqual({
      base: '2025-06-29-vite6.0',
      locale: 'ko',
    });
  });
});

describe('sortPosts', () => {
  it('orders by date desc then title asc', () => {
    const sorted = sortPosts([
      meta({ slug: 'b', date: '2024-01-01', title: 'B' }),
      meta({ slug: 'a2', date: '2024-02-01', title: 'A' }),
      meta({ slug: 'a1', date: '2024-01-01', title: 'A' }),
    ]);
    expect(sorted.map((p) => p.slug)).toEqual(['a2', 'a1', 'b']);
  });
});

describe('groupByCategory / counts', () => {
  const posts = [
    meta({ slug: '1', category: '개발', tags: ['react', 'ai'] }),
    meta({ slug: '2', category: '개발', tags: ['react'] }),
    meta({ slug: '3', category: '문서', tags: ['ai'] }),
  ];

  it('groups by category ordered by count desc', () => {
    const groups = groupByCategory(posts);
    expect(groups[0]).toMatchObject({ category: '개발' });
    expect(groups[0].posts).toHaveLength(2);
  });

  it('counts categories and tags', () => {
    expect(getCategoryCounts(posts)).toContainEqual({
      category: '개발',
      count: 2,
    });
    expect(getTagCounts(posts)).toContainEqual({ tag: 'react', count: 2 });
    expect(getTagCounts(posts)).toContainEqual({ tag: 'ai', count: 2 });
  });
});

// ---- dynamic discovery (AC-6.1 / AC-6.3) -----------------------------------

describe('dynamic post discovery', () => {
  it('discovers a new markdown file added to the tree', () => {
    const root = makeFixture({
      '2024/01/2024-01-01-a.md': fm({
        title: 'A',
        date: '2024-01-01',
        category: '개발',
        tags: ['x'],
      }),
      '2024/02/2024-02-01-b.md': fm({
        title: 'B',
        date: '2024-02-01',
        category: '문서',
        tags: ['y'],
      }),
    });
    expect(getAllPosts('ko', root)).toHaveLength(2);
    expect(getAllSlugs(root).sort()).toEqual(['2024-01-01-a', '2024-02-01-b']);

    writeMd(
      root,
      '2024/03/2024-03-01-c.md',
      fm({ title: 'C', date: '2024-03-01', category: '개발', tags: ['z'] }),
    );
    expect(getAllPosts('ko', root)).toHaveLength(3);
  });

  it('computes previous(older)/next(newer) adjacency', () => {
    const root = makeFixture({
      '2024/01/2024-01-01-a.md': fm({
        title: 'A',
        date: '2024-01-01',
        category: '개발',
      }),
      '2024/02/2024-02-01-b.md': fm({
        title: 'B',
        date: '2024-02-01',
        category: '개발',
      }),
      '2024/03/2024-03-01-c.md': fm({
        title: 'C',
        date: '2024-03-01',
        category: '개발',
      }),
    });
    const adjacency = getAdjacentPosts('2024-02-01-b', 'ko', root);
    expect(adjacency.previous?.slug).toBe('2024-01-01-a');
    expect(adjacency.next?.slug).toBe('2024-03-01-c');

    const newest = getAdjacentPosts('2024-03-01-c', 'ko', root);
    expect(newest.next).toBeNull();
    expect(newest.previous?.slug).toBe('2024-02-01-b');
  });
});

// ---- i18n content fallback (AC-7.4) ----------------------------------------

describe('translation fallback', () => {
  it('falls back to ko content when an en translation is missing', () => {
    const root = makeFixture({
      '2024/01/2024-01-01-only-ko.md': fm({
        title: '한글만',
        date: '2024-01-01',
        category: '개발',
      }),
      '2024/01/2024-01-02-both.md': fm({
        title: '한글판',
        date: '2024-01-02',
        category: '개발',
      }),
      '2024/01/2024-01-02-both.en.md': fm(
        { title: 'English', date: '2024-01-02', category: '개발' },
        'body',
      ),
    });
    const en = getAllPosts('en', root);

    const onlyKo = en.find((p) => p.slug === '2024-01-01-only-ko');
    expect(onlyKo?.title).toBe('한글만');
    expect(onlyKo?.contentLocale).toBe('ko');

    const both = en.find((p) => p.slug === '2024-01-02-both');
    expect(both?.title).toBe('English');
    expect(both?.contentLocale).toBe('en');
  });
});

// ---- real content integration (AC-6.1) -------------------------------------

describe('real blog content', () => {
  const all = getAllPosts('ko', CONTENT_ROOT);

  it('discovers all 73 posts with unique slugs', () => {
    expect(all).toHaveLength(73);
    expect(new Set(all.map((p) => p.slug)).size).toBe(73);
  });

  it('parses valid, well-formed metadata for every post', () => {
    for (const post of all) {
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Array.isArray(post.tags)).toBe(true);
      expect(post.readingTime).toBeGreaterThanOrEqual(1);
      expect(post.category.length).toBeGreaterThan(0);
    }
  });

  it('sorts newest-first', () => {
    expect(all[0].date).toBe('2026-08-23');
  });

  it('reflects known category and tag counts', () => {
    expect(getCategoryCounts(all)).toContainEqual({
      category: '개발',
      count: 71,
    });
    expect(getTagCounts(all)).toContainEqual({ tag: '상태관리', count: 12 });
  });

  it('renders a real post and returns null for unknown slugs', async () => {
    const post = await getPostBySlug(all[0].slug, 'ko', CONTENT_ROOT);
    expect(post).not.toBeNull();
    expect(post?.html.length).toBeGreaterThan(0);
    expect(
      await getPostBySlug('___does-not-exist___', 'ko', CONTENT_ROOT),
    ).toBeNull();
  }, 30000);
});
