import type { PostMeta } from '@/types';

/**
 * PostMeta 테스트 픽스처.
 *
 * 출처: `src/types/index.ts`의 PostMeta 타입에서 유도했다.
 * [스키마 유도 — 실측 캡처 아님] 다만 이 타입은 외부 API 응답이 아니라
 * 빌드타임에 저장소 마크다운에서 만들어지는 내부 구조라, 실측 캡처가
 * 존재할 수 없는 종류다. 필드 의미가 바뀌면 이 팩토리도 같이 깨진다.
 */
export function makePostMeta(overrides: Partial<PostMeta> = {}): PostMeta {
  return {
    slug: '2024-03-01-sample',
    title: 'Sample Post',
    date: '2024-03-01',
    category: '개발',
    tags: ['React'],
    thumbnail: null,
    github: null,
    excerpt: 'excerpt text',
    readingTime: 3,
    wordCount: 600,
    relDir: '2024/03',
    year: '2024',
    contentLocale: 'ko',
    ...overrides,
  };
}
