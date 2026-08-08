import { describe, expect, it } from 'vitest';
import { getDictionary } from '@/lib/i18n';
import {
  blogJsonLd,
  blogPostingJsonLd,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  faqPageJsonLd,
  profilePageJsonLd,
  sectionBreadcrumbJsonLd,
  websiteJsonLd,
} from '@/lib/jsonld';
import { makePostMeta } from './fixtures/post-meta';

/**
 * AC-10.6 — JSON-LD 최상위 @type 7종.
 *
 * "7종"의 계수 기준이 문서마다 갈리던 항목이다(적대적 검증 D19).
 * 최상위 @type만 세고 중첩 타입(Person·ItemList·ListItem·WebPage·Question·Answer)은
 * 제외한다는 규약을 여기서 실행 가능한 형태로 못박는다.
 */

const dict = getDictionary('ko');
const posts = [
  makePostMeta({ slug: 'a', title: 'A', tags: ['React'] }),
  makePostMeta({ slug: 'b', title: 'B', tags: ['Next.js'] }),
];

/** 각 빌더가 내는 최상위 노드 — 페이지에 실제로 심기는 단위. */
function topLevelNodes(): Record<string, unknown>[] {
  return [
    websiteJsonLd('ko', dict),
    blogJsonLd(posts, 'ko', dict),
    collectionPageJsonLd({
      name: '포스트',
      description: '목록',
      sub: '/posts',
      posts,
      locale: 'ko',
      dict,
    }),
    profilePageJsonLd('ko', dict),
    faqPageJsonLd('ko', [{ question: 'Q', answer: 'A' }]),
    blogPostingJsonLd(posts[0], 'ko', dict),
    breadcrumbJsonLd(posts[0], 'ko', dict),
    sectionBreadcrumbJsonLd('ko', dict, { name: '포스트', sub: '/posts' }),
  ];
}

describe('JSON-LD 최상위 @type @regression', () => {
  it('AC-10.6 최상위 @type이 정확히 7종이다 @smoke', () => {
    const types = new Set(topLevelNodes().map((node) => node['@type']));
    expect([...types].sort()).toEqual([
      'Blog',
      'BlogPosting',
      'BreadcrumbList',
      'CollectionPage',
      'FAQPage',
      'ProfilePage',
      'WebSite',
    ]);
    expect(types.size).toBe(7);
  });

  it('AC-10.6 중첩 타입은 최상위 계수에 들어가지 않는다', () => {
    const topTypes = new Set(topLevelNodes().map((node) => node['@type']));
    // 이 6종은 노드 안에 존재하지만 "7종" 계수 대상이 아니다.
    for (const nested of [
      'Person',
      'ItemList',
      'ListItem',
      'WebPage',
      'Question',
      'Answer',
    ]) {
      expect(topTypes.has(nested)).toBe(false);
    }
  });

  it('모든 최상위 노드가 @context를 가진다', () => {
    // @context가 없으면 크롤러가 스키마를 해석하지 못해 노드 자체가 무시된다.
    for (const node of topLevelNodes()) {
      expect(node['@context']).toBe('https://schema.org');
    }
  });
});

describe('JSON-LD 노드 내용 @regression', () => {
  it('WebSite/Blog/CollectionPage의 url이 절대 URL이다', () => {
    for (const node of [
      websiteJsonLd('ko', dict),
      blogJsonLd(posts, 'ko', dict),
      collectionPageJsonLd({
        name: 'n',
        description: 'd',
        sub: '/posts',
        posts,
        locale: 'ko',
        dict,
      }),
    ]) {
      expect(node.url).toMatch(/^https:\/\/seungahhong\.github\.io\//);
    }
  });

  it('Blog의 blogPost가 목록 순서를 그대로 보존한다', () => {
    const node = blogJsonLd(posts, 'ko', dict) as {
      blogPost: { headline: string }[];
    };
    expect(node.blogPost.map((p) => p.headline)).toEqual(['A', 'B']);
  });

  it('CollectionPage의 ItemList position이 1부터 오름차순이다', () => {
    const node = collectionPageJsonLd({
      name: 'n',
      description: 'd',
      sub: '/posts',
      posts,
      locale: 'ko',
      dict,
    }) as {
      mainEntity: {
        numberOfItems: number;
        itemListElement: { position: number }[];
      };
    };
    expect(node.mainEntity.numberOfItems).toBe(2);
    expect(node.mainEntity.itemListElement.map((i) => i.position)).toEqual([
      1, 2,
    ]);
  });

  it('썸네일이 없는 글은 로케일 기본 OG 이미지를 절대 URL로 쓴다', () => {
    const node = blogPostingJsonLd(
      makePostMeta({ thumbnail: null }),
      'ko',
      dict,
    );
    expect(node.image).toBe('https://seungahhong.github.io/og/ko.png');
  });

  it('외부 URL 썸네일은 그대로 두고, 상대 경로만 절대화한다', () => {
    expect(
      blogPostingJsonLd(
        makePostMeta({ thumbnail: 'https://cdn.example.com/a.png' }),
        'ko',
        dict,
      ).image,
    ).toBe('https://cdn.example.com/a.png');

    expect(
      blogPostingJsonLd(
        makePostMeta({ thumbnail: 'blog-assets/a.png' }),
        'ko',
        dict,
      ).image,
    ).toBe('https://seungahhong.github.io/blog-assets/a.png');
  });

  it('BreadcrumbList가 홈 → 포스트 → 글 순서로 3단계다', () => {
    const node = breadcrumbJsonLd(posts[0], 'ko', dict) as {
      itemListElement: { position: number; name: string }[];
    };
    expect(node.itemListElement).toHaveLength(3);
    expect(node.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(node.itemListElement[2].name).toBe('A');
  });

  it('섹션 BreadcrumbList는 홈 → 섹션 2단계다', () => {
    const node = sectionBreadcrumbJsonLd('ko', dict, {
      name: '포스트',
      sub: '/posts',
    }) as { itemListElement: { name: string }[] };
    expect(node.itemListElement).toHaveLength(2);
    expect(node.itemListElement[1].name).toBe('포스트');
  });

  it('FAQPage가 받은 항목을 그대로 Question/Answer로 옮긴다', () => {
    // 구조화 데이터 정책상 화면에 보이는 것과 같아야 하므로 가공하지 않아야 한다.
    const node = faqPageJsonLd('ko', [
      { question: '질문1', answer: '답변1' },
    ]) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(node.mainEntity[0].name).toBe('질문1');
    expect(node.mainEntity[0].acceptedAnswer.text).toBe('답변1');
  });
});
