import Link from 'next/link';
import { getDictionary, resolveLocale } from '@/lib/i18n';
import {
  getAllPosts,
  getCategoryCounts,
  getPopularPosts,
  getTagCounts,
} from '@/lib/posts';
import { siteConfig } from '@/lib/site';
import { localePath } from '@/lib/routes';
import Hero from '@/components/home/Hero';
import PostCard from '@/components/home/PostCard';
import Sidebar from '@/components/home/Sidebar';

type LangParams = Promise<{ lang: string }>;

export default async function HomePage({ params }: { params: LangParams }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);

  const posts = getAllPosts(locale);
  const recent = posts.slice(0, 6);
  const categories = getCategoryCounts(posts);
  const tags = getTagCounts(posts).slice(0, 14);
  const popular = getPopularPosts(posts, 5);

  return (
    <>
      <Hero
        dict={dict}
        stats={{
          posts: posts.length,
          categories: categories.length,
          since: siteConfig.since,
        }}
      />
      <div className="mx-auto grid max-w-deck grid-cols-1 gap-10 px-[18px] py-8 md:px-[34px] lg:grid-cols-[1fr_300px]">
        <section aria-labelledby="recent-heading">
          <div className="mb-1.5 flex items-baseline justify-between">
            <h2
              id="recent-heading"
              className="font-mono text-[14px] font-semibold uppercase tracking-wide text-muted"
            >
              {dict.home.recentPosts}
            </h2>
            <Link
              href={localePath(locale, '/posts')}
              className="font-mono text-[12px] text-accent hover:underline"
            >
              {dict.home.viewAll}
            </Link>
          </div>
          <div className="flex flex-col">
            {recent.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>
        </section>

        <Sidebar
          locale={locale}
          dict={dict}
          popular={popular}
          categories={categories}
          tags={tags}
        />
      </div>
    </>
  );
}
