import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, resolveLocale } from '@/lib/i18n';
import {
  getAdjacentPosts,
  getAllSlugs,
  getPostBySlug,
  getPostMeta,
} from '@/lib/posts';
import { locales, localeHtmlLang } from '@/i18n/config';
import { ogImagePath, siteConfig } from '@/lib/site';
import { postPath } from '@/lib/routes';
import { blogPostingJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
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
  const dict = getDictionary(locale);
  // 썸네일이 없는 글은 로케일 기본 OG 이미지로 떨어뜨린다(공유 시 빈 카드 방지).
  const image = meta.thumbnail ?? ogImagePath[locale];
  return {
    title: meta.title,
    description: meta.excerpt,
    keywords: meta.tags,
    authors: [{ name: dict.meta.author, url: siteConfig.social.portfolio }],
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
      locale: localeHtmlLang[locale],
      url: postPath(locale, slug),
      publishedTime: meta.date,
      modifiedTime: meta.date,
      authors: [siteConfig.social.portfolio],
      section: meta.category,
      tags: meta.tags,
      images: [{ url: image, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.excerpt,
      images: [image],
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
      <JsonLd data={blogPostingJsonLd(post, locale, dict)} />
      <JsonLd data={breadcrumbJsonLd(post, locale, dict)} />
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
