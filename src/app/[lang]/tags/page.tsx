import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getDictionary, resolveLocale } from '@/lib/i18n';
import { getAllPosts, getTagCounts } from '@/lib/posts';
import TagsExplorer from '@/components/tags/TagsExplorer';
import { metadataAlternates } from '@/lib/routes';

type LangParams = Promise<{ lang: string }>;

export async function generateMetadata({
  params,
}: {
  params: LangParams;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  return {
    title: dict.tags.title,
    description: dict.tags.subtitle,
    alternates: metadataAlternates(locale, '/tags'),
  };
}

export default async function TagsPage({ params }: { params: LangParams }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  const posts = getAllPosts(locale);
  const tags = getTagCounts(posts);

  return (
    <Suspense fallback={null}>
      <TagsExplorer locale={locale} dict={dict} posts={posts} tags={tags} />
    </Suspense>
  );
}
