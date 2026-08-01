import type { Metadata } from 'next';
import { getDictionary, resolveLocale } from '@/lib/i18n';
import { getAllPosts, getCategoryCounts } from '@/lib/posts';
import PostsExplorer from '@/components/posts/PostsExplorer';
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
  return sectionMetadata({
    locale,
    sub: '/posts',
    title: dict.posts.title,
    description: dict.posts.subtitle,
  });
}

export default async function PostsPage({ params }: { params: LangParams }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  const posts = getAllPosts(locale);
  const categories = getCategoryCounts(posts);

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: dict.posts.title,
          description: dict.posts.subtitle,
          sub: '/posts',
          posts,
          locale,
          dict,
        })}
      />
      <JsonLd
        data={sectionBreadcrumbJsonLd(locale, dict, {
          name: dict.nav.posts,
          sub: '/posts',
        })}
      />
      <PostsExplorer
        locale={locale}
        dict={dict}
        posts={posts}
        categories={categories}
      />
    </>
  );
}
