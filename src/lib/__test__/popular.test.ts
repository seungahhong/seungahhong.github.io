import { afterEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  clearPopularCache,
  rankPostsByViews,
  readPopularData,
  type PopularData,
} from '@/lib/popular';
import type { PostMeta } from '@/types';

const tmpDirs: string[] = [];

afterEach(() => {
  clearPopularCache();
  for (const dir of tmpDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function writeSnapshot(contents: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'popular-'));
  tmpDirs.push(dir);
  const file = path.join(dir, 'popular.json');
  fs.writeFileSync(file, contents, 'utf-8');
  return file;
}

/** posts는 항상 최신순으로 들어온다(getAllPosts 계약). */
function posts(...slugs: string[]): PostMeta[] {
  return slugs.map((slug, index) => ({
    slug,
    title: slug,
    date: `2024-01-${String(slugs.length - index).padStart(2, '0')}`,
    category: '개발',
    tags: [],
    thumbnail: null,
    github: null,
    excerpt: '',
    readingTime: 1,
    wordCount: 0,
    relDir: '2024/01',
    year: '2024',
    contentLocale: 'ko' as const,
  }));
}

function snapshot(items: PopularData['items']): PopularData {
  return { updatedAt: '2026-08-01', rangeDays: 90, items };
}

describe('rankPostsByViews', () => {
  it('스냅샷에 적힌 순서를 그대로 따른다(재정렬하지 않는다)', () => {
    // 조회수가 오름차순으로 적혀 있어도 손대지 않는다 — items 배열이 곧 순위다.
    const ranked = rankPostsByViews(
      posts('a', 'b', 'c'),
      3,
      snapshot([
        { slug: 'a', views: 10 },
        { slug: 'b', views: 90 },
        { slug: 'c', views: 50 },
      ]),
    );
    expect(ranked.map((post) => [post.slug, post.views])).toEqual([
      ['a', 10],
      ['b', 90],
      ['c', 50],
    ]);
  });

  it('조회수가 같아도 스냅샷 순서가 최신순을 이긴다', () => {
    const ranked = rankPostsByViews(
      posts('newer', 'older'),
      2,
      snapshot([
        { slug: 'older', views: 7 },
        { slug: 'newer', views: 7 },
      ]),
    );
    expect(ranked.map((post) => post.slug)).toEqual(['older', 'newer']);
  });

  it('같은 슬러그가 두 번 적혀 있어도 한 번만 넣는다', () => {
    const ranked = rankPostsByViews(
      posts('a', 'b'),
      2,
      snapshot([
        { slug: 'a', views: 9 },
        { slug: 'a', views: 9 },
        { slug: 'b', views: 4 },
      ]),
    );
    expect(ranked.map((post) => [post.slug, post.views])).toEqual([
      ['a', 9],
      ['b', 4],
    ]);
  });

  it('조회수가 잡힌 글이 모자라면 최신순으로 자리를 채우고 views는 null', () => {
    const ranked = rankPostsByViews(
      posts('a', 'b', 'c'),
      3,
      snapshot([{ slug: 'c', views: 40 }]),
    );
    expect(ranked.map((post) => [post.slug, post.views])).toEqual([
      ['c', 40],
      ['a', null],
      ['b', null],
    ]);
  });

  it('스냅샷에만 있고 실제로는 없는 글은 무시한다', () => {
    const ranked = rankPostsByViews(
      posts('a'),
      5,
      snapshot([
        { slug: 'deleted', views: 999 },
        { slug: 'a', views: 1 },
      ]),
    );
    expect(ranked.map((post) => post.slug)).toEqual(['a']);
  });

  it('데이터가 없거나 비어 있으면 전부 최신순 폴백', () => {
    for (const data of [null, snapshot([])]) {
      const ranked = rankPostsByViews(posts('a', 'b', 'c'), 2, data);
      expect(ranked.map((post) => [post.slug, post.views])).toEqual([
        ['a', null],
        ['b', null],
      ]);
    }
  });

  it('count보다 글이 적어도 있는 만큼만 돌려준다', () => {
    expect(rankPostsByViews(posts('a'), 5, null)).toHaveLength(1);
    expect(rankPostsByViews([], 5, null)).toEqual([]);
  });
});

describe('readPopularData', () => {
  it('정상 스냅샷을 읽는다', () => {
    const file = writeSnapshot(
      JSON.stringify({
        updatedAt: '2026-08-01',
        rangeDays: 90,
        items: [{ slug: 'a', views: 12 }],
      }),
    );
    expect(readPopularData(file)).toEqual({
      updatedAt: '2026-08-01',
      rangeDays: 90,
      items: [{ slug: 'a', views: 12 }],
    });
  });

  it('파일이 없거나 JSON이 깨졌으면 null (최신순 폴백)', () => {
    expect(readPopularData('/nope/popular.json')).toBeNull();
    expect(readPopularData(writeSnapshot('{ 깨진 json'))).toBeNull();
    expect(readPopularData(writeSnapshot('{"items":"배열아님"}'))).toBeNull();
  });

  it('망가진 항목만 걸러 내고 나머지는 살린다', () => {
    const file = writeSnapshot(
      JSON.stringify({
        items: [
          { slug: 'a', views: 5 },
          { slug: 'b', views: '9' },
          { slug: 'c' },
          { views: 3 },
          { slug: 'd', views: 0 },
          null,
        ],
      }),
    );
    expect(readPopularData(file)?.items).toEqual([{ slug: 'a', views: 5 }]);
  });

  it('시드 상태(items: [])는 빈 목록으로 읽힌다', () => {
    const file = writeSnapshot(
      JSON.stringify({ updatedAt: null, rangeDays: 90, items: [] }),
    );
    expect(readPopularData(file)).toEqual({
      updatedAt: null,
      rangeDays: 90,
      items: [],
    });
  });
});
