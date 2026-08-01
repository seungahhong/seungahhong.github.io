import type { MetadataRoute } from 'next';
import { getAllPosts, getAllSlugs, getPostMeta } from '@/lib/posts';
import { locales } from '@/i18n/config';
import { absoluteUrl } from '@/lib/jsonld';
import { localePath, postPath } from '@/lib/routes';

export const dynamic = 'force-static';

/**
 * `trailingSlash: true`라 실제 서빙 URL과 canonical은 모두 끝에 `/`가 붙는다.
 * 사이트맵도 `absoluteUrl`로 같은 형태를 써야 리다이렉트/중복 URL로 보이지 않는다.
 */
function alternatesFor(
  sub: string,
): MetadataRoute.Sitemap[number]['alternates'] {
  return {
    languages: {
      ko: absoluteUrl(localePath('ko', sub)),
      en: absoluteUrl(localePath('en', sub)),
      'x-default': absoluteUrl(localePath('ko', sub)),
    },
  };
}

const SECTIONS = [
  { sub: '', priority: 1, changeFrequency: 'daily' },
  { sub: '/posts', priority: 0.9, changeFrequency: 'daily' },
  { sub: '/tags', priority: 0.7, changeFrequency: 'weekly' },
  { sub: '/about', priority: 0.5, changeFrequency: 'monthly' },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  // 목록/홈은 새 글이 올라올 때 바뀌므로 최신 글 날짜를 갱신일로 쓴다.
  const latest = getAllPosts()[0]?.date;

  for (const { sub, priority, changeFrequency } of SECTIONS) {
    for (const lang of locales) {
      entries.push({
        url: absoluteUrl(localePath(lang, sub)),
        lastModified: sub === '/about' ? undefined : latest,
        changeFrequency,
        priority,
        alternates: alternatesFor(sub),
      });
    }
  }

  for (const slug of getAllSlugs()) {
    for (const lang of locales) {
      entries.push({
        url: absoluteUrl(postPath(lang, slug)),
        lastModified: getPostMeta(slug, lang)?.date,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: alternatesFor(`/posts/${slug}`),
      });
    }
  }

  return entries;
}
