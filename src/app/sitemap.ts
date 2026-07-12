import type { MetadataRoute } from 'next';
import { getAllSlugs, getPostMeta } from '@/lib/posts';
import { locales } from '@/i18n/config';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const sections = ['', '/posts', '/tags', '/about'];
  const entries: MetadataRoute.Sitemap = [];

  for (const sub of sections) {
    for (const lang of locales) {
      entries.push({
        url: `${base}/${lang}${sub}`,
        changeFrequency: 'weekly',
        priority: sub === '' ? 1 : 0.7,
        alternates: {
          languages: { ko: `${base}/ko${sub}`, en: `${base}/en${sub}` },
        },
      });
    }
  }

  for (const slug of getAllSlugs()) {
    const meta = getPostMeta(slug, 'ko');
    for (const lang of locales) {
      entries.push({
        url: `${base}/${lang}/posts/${slug}`,
        lastModified: meta?.date,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            ko: `${base}/ko/posts/${slug}`,
            en: `${base}/en/posts/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
