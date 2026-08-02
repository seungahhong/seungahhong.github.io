import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HtmlLang from '@/components/layout/HtmlLang';
import SearchProvider from '@/components/search/SearchProvider';
import { getAllPosts } from '@/lib/posts';
import { getDictionary } from '@/lib/i18n';
import { isLocale, locales, localeHtmlLang, type Locale } from '@/i18n/config';
import { absoluteUrl, localePath, metadataAlternates } from '@/lib/routes';
import { ogImagePath } from '@/lib/site';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type LangParams = Promise<{ lang: string }>;

export async function generateMetadata({
  params,
}: {
  params: LangParams;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : 'ko';
  const dict = getDictionary(locale);
  const ogImage = {
    url: ogImagePath[locale],
    width: 1200,
    height: 630,
    alt: dict.meta.siteTitle,
  };
  return {
    title: {
      default: dict.meta.siteTitle,
      template: `%s · ${dict.meta.siteTitle}`,
    },
    description: dict.meta.siteDescription,
    // 사이트 전반의 주제 — 글별 태그는 각 포스트의 metadata에서 덧붙인다.
    keywords: [...new Set(getAllPosts(locale).flatMap((post) => post.tags))],
    alternates: metadataAlternates(locale),
    openGraph: {
      type: 'website',
      siteName: dict.meta.siteTitle,
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      locale: localeHtmlLang[locale],
      url: absoluteUrl(localePath(locale)),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      images: [ogImage],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LangParams;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const searchIndex = getAllPosts(locale).map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    tags: post.tags,
    excerpt: post.excerpt,
    date: post.date,
  }));

  return (
    <SearchProvider index={searchIndex} locale={locale} dict={dict}>
      <div className="flex min-h-screen flex-col">
        <HtmlLang lang={localeHtmlLang[locale]} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
        >
          {dict.nav.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
      </div>
    </SearchProvider>
  );
}
