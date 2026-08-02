import type { Metadata } from 'next';
import { localeHtmlLang, type Locale } from '@/i18n/config';
import { getDictionary } from '@/lib/i18n';
import { absoluteUrl, localePath, metadataAlternates } from '@/lib/routes';
import { ogImagePath } from '@/lib/site';

/**
 * 섹션 페이지(포스트·태그·소개) 공통 메타데이터.
 *
 * 하위 라우트가 `openGraph`/`twitter`를 선언하면 상위 레이아웃 값이 병합되지 않고
 * 통째로 대체된다. 그래서 og:image와 카드 제목까지 매번 같이 넘겨야 하고,
 * 그 반복을 여기 한 곳으로 모은다.
 */
export function sectionMetadata({
  locale,
  sub,
  title,
  description,
  type = 'website',
  keywords,
}: {
  locale: Locale;
  sub: string;
  title: string;
  description: string;
  type?: 'website' | 'profile';
  keywords?: string[];
}): Metadata {
  const dict = getDictionary(locale);
  const image = {
    url: ogImagePath[locale],
    width: 1200,
    height: 630,
    alt: title,
  };
  return {
    title,
    description,
    keywords,
    alternates: metadataAlternates(locale, sub),
    openGraph: {
      type,
      siteName: dict.meta.siteTitle,
      title,
      description,
      locale: localeHtmlLang[locale],
      url: absoluteUrl(localePath(locale, sub)),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
