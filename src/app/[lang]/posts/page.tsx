import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getDictionary, resolveLocale } from '@/lib/i18n';
import { getAllPosts, getCategoryCounts } from '@/lib/posts';
import PostsExplorer from '@/components/posts/PostsExplorer';
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
    title: dict.posts.title,
    description: dict.posts.subtitle,
    alternates: metadataAlternates(locale, '/posts'),
  };
}

export default async function PostsPage({ params }: { params: LangParams }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  const posts = getAllPosts(locale);
  const categories = getCategoryCounts(posts);

  return (
    <Suspense fallback={null}>
      <PostsExplorer
        locale={locale}
        dict={dict}
        posts={posts}
        categories={categories}
      />
    </Suspense>
  );
}
