import { describe, expect, it } from 'vitest';
import { localeHtmlLang } from '@/i18n/config';
import { sectionMetadata } from '@/lib/metadata';

/**
 * AC-10.5 — OG 이미지·트위터 카드.
 *
 * AC-10.3/AC-10.4(canonical 절대 URL·hreflang·후행 슬래시)는 이미
 * `routes.test.ts`의 metadataAlternates 테스트가 커버하므로 여기서 중복하지 않는다.
 * 여기서는 "하위 라우트가 openGraph/twitter를 선언하면 상위 값이 병합되지 않고
 * 통째로 대체된다"는 제약 때문에 매번 같이 넘겨야 하는 값들을 지킨다.
 */

function meta(locale: 'ko' | 'en' = 'ko') {
  return sectionMetadata({
    locale,
    sub: '/posts',
    title: '포스트',
    description: '글 목록',
  });
}

describe('sectionMetadata OG 이미지 @regression', () => {
  it('AC-10.5 og:image가 로케일별 경로이고 1200×630이다 @smoke', () => {
    const ko = meta('ko').openGraph as {
      images: { url: string; width: number; height: number }[];
    };
    expect(ko.images[0].url).toBe('/og/ko.png');
    expect(ko.images[0].width).toBe(1200);
    expect(ko.images[0].height).toBe(630);

    const en = meta('en').openGraph as { images: { url: string }[] };
    expect(en.images[0].url).toBe('/og/en.png');
  });

  it('AC-10.5 twitter 카드가 summary_large_image이고 같은 이미지를 쓴다 @smoke', () => {
    const m = meta('ko');
    const twitter = m.twitter as {
      card: string;
      images: { url: string }[];
    };
    const og = m.openGraph as { images: { url: string }[] };
    expect(twitter.card).toBe('summary_large_image');
    // og와 twitter가 다른 이미지를 가리키면 공유처마다 다른 카드가 뜬다.
    expect(twitter.images[0].url).toBe(og.images[0].url);
  });

  it('og:image alt가 페이지 제목과 같다', () => {
    const og = meta('ko').openGraph as { images: { alt: string }[] };
    expect(og.images[0].alt).toBe('포스트');
  });
});

describe('sectionMetadata 공통 필드 @regression', () => {
  it('openGraph.url이 해당 섹션의 절대 URL이다', () => {
    const og = meta('ko').openGraph as { url: string };
    expect(og.url).toBe('https://seungahhong.github.io/ko/posts/');
  });

  it('openGraph.locale이 문서 html lang과 같은 값을 쓴다', () => {
    // 값을 하드코딩하지 않고 두 모듈의 일치를 본다 — sectionMetadata가 제 나름의
    // 표기('en-US' 등)를 따로 박아 넣으면 문서 lang과 어긋나는데, 그 어긋남이
    // 이 테스트가 잡으려는 것이다. (현재 config는 ko: 'ko-KR', en: 'en')
    expect((meta('ko').openGraph as { locale: string }).locale).toBe(
      localeHtmlLang.ko,
    );
    expect((meta('en').openGraph as { locale: string }).locale).toBe(
      localeHtmlLang.en,
    );
  });

  it('alternates가 canonical과 언어별 대체 URL을 함께 낸다', () => {
    // 값 형태의 상세 검증은 routes.test.ts(metadataAlternates) 소관.
    // 여기서는 sectionMetadata가 그 결과를 빠뜨리지 않고 싣는지만 본다.
    const alternates = meta('ko').alternates as {
      canonical: string;
      languages: Record<string, string>;
    };
    expect(alternates.canonical).toBeTruthy();
    expect(Object.keys(alternates.languages).sort()).toEqual([
      'en',
      'ko',
      'x-default',
    ]);
  });

  it('type 기본값이 website이고 profile로 바꿀 수 있다', () => {
    expect((meta('ko').openGraph as { type: string }).type).toBe('website');
    const profile = sectionMetadata({
      locale: 'ko',
      sub: '/about',
      title: '소개',
      description: 'd',
      type: 'profile',
    });
    expect((profile.openGraph as { type: string }).type).toBe('profile');
  });
});
