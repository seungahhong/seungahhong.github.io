import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  decodeSlugParam,
  localePath,
  metadataAlternates,
  postPath,
} from '@/lib/routes';
import { siteConfig } from '@/lib/site';

describe('absoluteUrl', () => {
  it('trailingSlash 설정에 맞춰 끝에 / 를 붙인다', () => {
    expect(absoluteUrl('/ko')).toBe(`${siteConfig.url}/ko/`);
    expect(absoluteUrl('/ko/posts')).toBe(`${siteConfig.url}/ko/posts/`);
  });

  it('이미 / 로 끝나면 중복해서 붙이지 않는다', () => {
    expect(absoluteUrl('/ko/')).toBe(`${siteConfig.url}/ko/`);
    expect(absoluteUrl('/')).toBe(`${siteConfig.url}/`);
  });

  it('마지막 세그먼트에 . 이 있어도 파일로 보지 않고 / 를 붙인다', () => {
    // Next의 상대 URL 해석은 `vite6.0`을 파일 확장자로 보고 / 를 생략한다.
    // 사이트맵 <loc>과 canonical이 어긋나면 리다이렉트되는 URL이 되므로 여기서 형태를 고정한다.
    expect(absoluteUrl(postPath('ko', '2025-06-29-vite6.0'))).toBe(
      `${siteConfig.url}/ko/posts/2025-06-29-vite6.0/`,
    );
  });
});

describe('metadataAlternates', () => {
  it('canonical과 hreflang을 사이트맵과 같은 절대 URL 형태로 만든다', () => {
    const alternates = metadataAlternates('ko', '/posts');
    expect(alternates.canonical).toBe(absoluteUrl(localePath('ko', '/posts')));
    expect(alternates.languages.ko).toBe(`${siteConfig.url}/ko/posts/`);
    expect(alternates.languages.en).toBe(`${siteConfig.url}/en/posts/`);
    expect(alternates.languages['x-default']).toBe(
      `${siteConfig.url}/ko/posts/`,
    );
  });

  it('모든 URL이 / 로 끝난다', () => {
    for (const sub of ['', '/posts', '/tags', '/about']) {
      const { canonical, languages } = metadataAlternates('en', sub);
      for (const url of [canonical, ...Object.values(languages)]) {
        expect(url.endsWith('/')).toBe(true);
      }
    }
  });
});

describe('decodeSlugParam', () => {
  it('퍼센트 인코딩된 라우트 파라미터를 파일 슬러그로 되돌린다', () => {
    // 정적 익스포트에서 페이지 컴포넌트에는 인코딩된 값이 들어온다.
    expect(decodeSlugParam('2020-02-17-c-c%2B%2B')).toBe('2020-02-17-c-c++');
  });

  it('이미 디코딩된 슬러그는 그대로 둔다(generateMetadata 경로)', () => {
    expect(decodeSlugParam('2020-02-17-c-c++')).toBe('2020-02-17-c-c++');
    expect(decodeSlugParam('2025-06-29-vite6.0')).toBe('2025-06-29-vite6.0');
  });

  it('잘못된 퍼센트 시퀀스는 예외 없이 원본을 돌려준다', () => {
    expect(decodeSlugParam('100%-broken')).toBe('100%-broken');
  });
});
