import { localeHtmlLang, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import type { PostMeta } from '@/types';
import { siteConfig } from '@/lib/site';
import { localePath, postPath } from '@/lib/routes';

type JsonLdObject = Record<string, unknown>;

/** siteConfig.url 기준 절대 URL (trailingSlash: true에 맞춰 끝에 `/` 보장). */
export function absoluteUrl(pathname: string): string {
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withSlash =
    clean === '/' ? '/' : clean.endsWith('/') ? clean : `${clean}/`;
  return `${siteConfig.url}${withSlash}`;
}

/** 이미지 경로를 절대 URL로 변환한다(외부 URL은 그대로, 없으면 프로필 이미지). */
function absoluteImage(thumbnail: string | null): string {
  if (!thumbnail) return `${siteConfig.url}/profile.webp`;
  if (/^https?:\/\//.test(thumbnail)) return thumbnail;
  return `${siteConfig.url}${thumbnail.startsWith('/') ? '' : '/'}${thumbnail}`;
}

/** 저자(Person) 노드 — 사이트 전역 공통. */
function personNode(dict: Dictionary): JsonLdObject {
  return {
    '@type': 'Person',
    name: dict.meta.author,
    url: siteConfig.social.portfolio,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.portfolio,
      siteConfig.social.notion,
    ],
  };
}

/** 홈 페이지: WebSite(저자 = author/publisher). */
export function websiteJsonLd(locale: Locale, dict: Dictionary): JsonLdObject {
  const person = personNode(dict);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    url: absoluteUrl(localePath(locale)),
    inLanguage: localeHtmlLang[locale],
    author: person,
    publisher: person,
  };
}

/** 포스트 상세: BlogPosting. */
export function blogPostingJsonLd(
  post: PostMeta,
  locale: Locale,
  dict: Dictionary,
): JsonLdObject {
  const url = absoluteUrl(postPath(locale, post.slug));
  const person = personNode(dict);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: localeHtmlLang[locale],
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: absoluteImage(post.thumbnail),
    keywords: post.tags,
    articleSection: post.category,
    author: person,
    publisher: person,
  };
}

/** 포스트 상세: BreadcrumbList (홈 → 포스트 목록 → 현재 글). */
export function breadcrumbJsonLd(
  post: PostMeta,
  locale: Locale,
  dict: Dictionary,
): JsonLdObject {
  const trail = [
    { name: dict.nav.home, url: absoluteUrl(localePath(locale)) },
    { name: dict.nav.posts, url: absoluteUrl(localePath(locale, '/posts')) },
    { name: post.title, url: absoluteUrl(postPath(locale, post.slug)) },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
