import { localeHtmlLang, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import type { PostMeta } from '@/types';
import { ogImagePath, siteConfig } from '@/lib/site';
import { absoluteUrl, localePath, postPath } from '@/lib/routes';

type JsonLdObject = Record<string, unknown>;

/** 이미지 경로를 절대 URL로 변환한다(외부 URL은 그대로, 없으면 로케일 기본 OG 이미지). */
function absoluteImage(thumbnail: string | null, locale: Locale): string {
  if (!thumbnail) return `${siteConfig.url}${ogImagePath[locale]}`;
  if (/^https?:\/\//.test(thumbnail)) return thumbnail;
  return `${siteConfig.url}${thumbnail.startsWith('/') ? '' : '/'}${thumbnail}`;
}

/** 노드 식별자 — 페이지별 JSON-LD가 같은 사이트/블로그/저자를 가리키게 묶는다. */
const personId = `${siteConfig.url}/#person`;
const websiteId = `${siteConfig.url}/#website`;
const blogId = (locale: Locale) => `${absoluteUrl(localePath(locale))}#blog`;

/** 저자(Person) 노드 — 사이트 전역 공통. */
function personNode(dict: Dictionary): JsonLdObject {
  return {
    '@type': 'Person',
    '@id': personId,
    name: dict.meta.author,
    url: siteConfig.social.portfolio,
    jobTitle: dict.home.eyebrow,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.portfolio,
      siteConfig.social.notion,
    ],
  };
}

/** 글 목록을 ItemList로 표현한다(목록 페이지가 실제로 보여주는 순서 그대로). */
function itemListNode(posts: PostMeta[], locale: Locale): JsonLdObject {
  return {
    '@type': 'ItemList',
    numberOfItems: posts.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(postPath(locale, post.slug)),
      name: post.title,
    })),
  };
}

function breadcrumbNode(trail: { name: string; url: string }[]): JsonLdObject {
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

/** 홈 페이지: WebSite(저자 = author/publisher). */
export function websiteJsonLd(locale: Locale, dict: Dictionary): JsonLdObject {
  const person = personNode(dict);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: dict.meta.siteTitle,
    alternateName: siteConfig.url.replace(/^https?:\/\//, ''),
    description: dict.meta.siteDescription,
    url: absoluteUrl(localePath(locale)),
    inLanguage: localeHtmlLang[locale],
    image: `${siteConfig.url}${ogImagePath[locale]}`,
    author: person,
    publisher: person,
  };
}

/** 홈 페이지: Blog + 글 목록. "이 사이트가 어떤 주제를 다루는가"의 근거가 된다. */
export function blogJsonLd(
  posts: PostMeta[],
  locale: Locale,
  dict: Dictionary,
): JsonLdObject {
  const topics = [...new Set(posts.flatMap((post) => post.tags))].slice(0, 30);
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': blogId(locale),
    name: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    url: absoluteUrl(localePath(locale)),
    inLanguage: localeHtmlLang[locale],
    keywords: topics,
    isPartOf: { '@id': websiteId },
    author: personNode(dict),
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: absoluteUrl(postPath(locale, post.slug)),
      keywords: post.tags,
    })),
  };
}

/** 포스트/태그 같은 목록 페이지: CollectionPage + ItemList. */
export function collectionPageJsonLd({
  name,
  description,
  sub,
  posts,
  locale,
  dict,
}: {
  name: string;
  description: string;
  sub: string;
  posts: PostMeta[];
  locale: Locale;
  dict: Dictionary;
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(localePath(locale, sub)),
    inLanguage: localeHtmlLang[locale],
    isPartOf: { '@id': websiteId },
    about: { '@id': blogId(locale) },
    author: personNode(dict),
    mainEntity: itemListNode(posts, locale),
  };
}

/** 소개 페이지: ProfilePage + 상세 Person(엔티티 정의). */
export function profilePageJsonLd(
  locale: Locale,
  dict: Dictionary,
): JsonLdObject {
  const url = absoluteUrl(localePath(locale, '/about'));
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url,
    inLanguage: localeHtmlLang[locale],
    isPartOf: { '@id': websiteId },
    mainEntity: {
      ...personNode(dict),
      description: dict.about.subtitle,
      image: `${siteConfig.url}/profile.webp`,
      email: `mailto:${siteConfig.social.email}`,
      knowsAbout: dict.about.skills.flatMap((group) => group.items),
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
  };
}

/**
 * 소개 페이지: FAQPage.
 * 구조화 데이터 정책상 질문/답변이 화면에 실제로 보여야 하므로,
 * 렌더에 쓰는 것과 완전히 같은(치환까지 끝난) 항목을 그대로 받는다.
 */
export function faqPageJsonLd(
  locale: Locale,
  items: readonly { question: string; answer: string }[],
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: localeHtmlLang[locale],
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
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
    image: absoluteImage(post.thumbnail, locale),
    keywords: post.tags,
    articleSection: post.category,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTime}M`,
    isPartOf: { '@id': blogId(locale) },
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
  return breadcrumbNode([
    { name: dict.nav.home, url: absoluteUrl(localePath(locale)) },
    { name: dict.nav.posts, url: absoluteUrl(localePath(locale, '/posts')) },
    { name: post.title, url: absoluteUrl(postPath(locale, post.slug)) },
  ]);
}

/** 섹션 페이지(포스트/태그/소개): BreadcrumbList (홈 → 현재 섹션). */
export function sectionBreadcrumbJsonLd(
  locale: Locale,
  dict: Dictionary,
  section: { name: string; sub: string },
): JsonLdObject {
  return breadcrumbNode([
    { name: dict.nav.home, url: absoluteUrl(localePath(locale)) },
    { name: section.name, url: absoluteUrl(localePath(locale, section.sub)) },
  ]);
}
