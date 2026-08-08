import type { SearchDoc } from '@/types';

/**
 * SearchDoc 픽스처.
 * [스키마 유도 — 실측 캡처 아님] 외부 API 응답이 아니라 빌드타임에
 * 저장소 마크다운에서 만들어지는 내부 구조라 실측 캡처가 존재하지 않는다.
 *
 * 스코어링 순위를 검증할 수 있도록 매칭 위치가 서로 다른 문서를 배치했다.
 */
export function makeSearchDoc(overrides: Partial<SearchDoc> = {}): SearchDoc {
  return {
    slug: 'doc',
    title: 'Doc',
    category: '개발',
    tags: [],
    excerpt: '',
    date: '2024-01-01',
    ...overrides,
  };
}

/** 검색어 `react` 기준으로 점수가 100 / 50 / 30 / 20 / 8 순이 되도록 구성. */
export const scoringDocs: SearchDoc[] = [
  makeSearchDoc({ slug: 'excerpt-hit', title: 'Zeta', excerpt: 'about react' }), // 8
  makeSearchDoc({ slug: 'category-hit', title: 'Yankee', category: 'React' }), // 20
  makeSearchDoc({ slug: 'tag-hit', title: 'Xray', tags: ['React'] }), // 30
  makeSearchDoc({ slug: 'title-contains', title: 'Learning React' }), // 50
  makeSearchDoc({ slug: 'title-starts', title: 'React basics' }), // 100
];

/** 결과 상한(8) 검증용 — 전부 제목이 검색어로 시작한다. */
export const manyDocs: SearchDoc[] = Array.from({ length: 12 }, (_, i) =>
  makeSearchDoc({ slug: `post-${i}`, title: `React item ${i}` }),
);
