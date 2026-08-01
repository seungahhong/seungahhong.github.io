import type { Metadata } from 'next';
import { getDictionary, resolveLocale } from '@/lib/i18n';
import { getAllPosts, getTagCounts } from '@/lib/posts';
import TagsExplorer from '@/components/tags/TagsExplorer';
import JsonLd from '@/components/JsonLd';
import { collectionPageJsonLd, sectionBreadcrumbJsonLd } from '@/lib/jsonld';
import { sectionMetadata } from '@/lib/metadata';

type LangParams = Promise<{ lang: string }>;

export async function generateMetadata({
  params,
}: {
  params: LangParams;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  const tags = getTagCounts(getAllPosts(locale));
  return sectionMetadata({
    locale,
    sub: '/tags',
    title: dict.tags.title,
    description: dict.tags.subtitle,
    keywords: tags.map((tag) => tag.tag),
  });
}

export default async function TagsPage({ params }: { params: LangParams }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  const posts = getAllPosts(locale);
  const tags = getTagCounts(posts);

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: dict.tags.title,
          description: dict.tags.subtitle,
          sub: '/tags',
          posts,
          locale,
          dict,
        })}
      />
      <JsonLd
        data={sectionBreadcrumbJsonLd(locale, dict, {
          name: dict.nav.tags,
          sub: '/tags',
        })}
      />
      <TagsExplorer locale={locale} dict={dict} posts={posts} tags={tags} />
    </>
  );
}
