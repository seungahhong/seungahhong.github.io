import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, resolveLocale } from '@/lib/i18n';
import {
  getAdjacentPosts,
  getAllSlugs,
  getPostBySlug,
  getPostMeta,
} from '@/lib/posts';
import { locales } from '@/i18n/config';
import { postPath } from '@/lib/routes';
import PostHeader from '@/components/post/PostHeader';
import ProseContent from '@/components/post/ProseContent';
import Toc from '@/components/post/Toc';
import ReadingProgress from '@/components/post/ReadingProgress';
import PostNav from '@/components/post/PostNav';

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

type PostParams = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: PostParams;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = resolveLocale(lang);
  const meta = getPostMeta(slug, locale);
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: {
      canonical: postPath(locale, slug),
      languages: {
        ko: postPath('ko', slug),
        en: postPath('en', slug),
        'x-default': postPath('ko', slug),
      },
    },
    openGraph: {
      type: 'article',
      title: meta.title,
      description: meta.excerpt,
      publishedTime: meta.date,
      tags: meta.tags,
      images: meta.thumbnail ? [meta.thumbnail] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: PostParams }) {
  const { lang, slug } = await params;
  const locale = resolveLocale(lang);
  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const adjacency = getAdjacentPosts(slug, locale);
  const dict = getDictionary(locale);

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-deck px-[18px] pb-10 md:px-[34px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_236px]">
          <article className="min-w-0 max-w-prose">
            <PostHeader post={post} locale={locale} dict={dict} />
            <div className="pt-6">
              <ProseContent html={post.html} />
            </div>
            <PostNav adjacency={adjacency} locale={locale} dict={dict} />
          </article>
          <div className="hidden lg:block">
            <Toc headings={post.headings} title={dict.post.tableOfContents} />
          </div>
        </div>
      </div>
    </>
  );
}
