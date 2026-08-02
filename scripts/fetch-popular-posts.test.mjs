import { describe, expect, it } from 'vitest';
import { aggregateViews, slugFromPagePath } from './fetch-popular-posts.mjs';

describe('slugFromPagePath', () => {
  it('로케일 프리픽스와 트레일링 슬래시를 흡수한다', () => {
    expect(slugFromPagePath('/ko/posts/2024-03-18-pnpm/')).toBe(
      '2024-03-18-pnpm',
    );
    expect(slugFromPagePath('/en/posts/2024-03-18-pnpm')).toBe(
      '2024-03-18-pnpm',
    );
  });

  it('쿼리스트링과 해시를 잘라낸다', () => {
    expect(slugFromPagePath('/ko/posts/2024-03-18-pnpm/?utm_source=x')).toBe(
      '2024-03-18-pnpm',
    );
    expect(slugFromPagePath('/ko/posts/2024-03-18-pnpm/#intro')).toBe(
      '2024-03-18-pnpm',
    );
  });

  it('퍼센트 인코딩된 슬러그를 복원한다', () => {
    expect(slugFromPagePath('/ko/posts/2024-03-18-pnpm%20test/')).toBe(
      '2024-03-18-pnpm test',
    );
  });

  it('글 상세가 아닌 경로는 null', () => {
    expect(slugFromPagePath('/ko/posts/')).toBeNull();
    expect(slugFromPagePath('/ko/')).toBeNull();
    expect(slugFromPagePath('/ko/tags/?tag=react')).toBeNull();
    expect(slugFromPagePath('/posts/2024-03-18-pnpm/')).toBeNull();
    expect(slugFromPagePath(undefined)).toBeNull();
  });
});

describe('aggregateViews', () => {
  const known = new Set(['a-post', 'b-post']);

  it('ko/en 조회수를 슬러그 기준으로 합산한다', () => {
    const rows = [
      { pagePath: '/ko/posts/a-post/', views: '10' },
      { pagePath: '/en/posts/a-post/', views: '5' },
      { pagePath: '/ko/posts/b-post/', views: '12' },
    ];
    expect(aggregateViews(rows, known)).toEqual([
      { slug: 'a-post', views: 15 },
      { slug: 'b-post', views: 12 },
    ]);
  });

  it('콘텐츠에 없는 슬러그와 글 목록 경로는 버린다', () => {
    const rows = [
      { pagePath: '/ko/posts/deleted-post/', views: '999' },
      { pagePath: '/ko/posts/', views: '999' },
      { pagePath: '/ko/posts/a-post/', views: '3' },
    ];
    expect(aggregateViews(rows, known)).toEqual([{ slug: 'a-post', views: 3 }]);
  });

  it('조회수가 0이거나 숫자가 아니면 제외한다', () => {
    const rows = [
      { pagePath: '/ko/posts/a-post/', views: '0' },
      { pagePath: '/ko/posts/b-post/', views: 'n/a' },
    ];
    expect(aggregateViews(rows, known)).toEqual([]);
  });

  it('동률이면 슬러그 이름순으로 안정 정렬한다', () => {
    const rows = [
      { pagePath: '/ko/posts/b-post/', views: '7' },
      { pagePath: '/ko/posts/a-post/', views: '7' },
    ];
    expect(aggregateViews(rows, known).map((item) => item.slug)).toEqual([
      'a-post',
      'b-post',
    ]);
  });
});
