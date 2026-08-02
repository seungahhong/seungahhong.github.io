import Link from 'next/link';
import { Search } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import type { CategoryCount, TagCount } from '@/types';
import type { PopularPost } from '@/lib/popular';
import { categoryPath, postPath, tagPath } from '@/lib/routes';
import { formatViews } from '@/lib/site';
import SearchTrigger from '@/components/search/SearchTrigger';

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3.5 flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-muted">
      <span className="h-0.5 w-3.5 bg-signal" aria-hidden="true" />
      {children}
    </h2>
  );
}

export default function Sidebar({
  locale,
  dict,
  popular,
  categories,
  tags,
  activeCategory,
}: {
  locale: Locale;
  dict: Dictionary;
  popular: PopularPost[];
  categories: CategoryCount[];
  tags: TagCount[];
  activeCategory?: string;
}) {
  const maxPopularRank = popular.length || 1;
  const topViews = Math.max(0, ...popular.map((post) => post.views ?? 0));
  const barWidth = (post: PopularPost, rank: number) => {
    // 조회수 데이터 자체가 없으면(계측 전) 예전처럼 순위로 막대를 그린다.
    if (topViews <= 0) return 100 - (rank / maxPopularRank) * 60;
    // 조회수가 아직 안 잡혀 최신순으로 채운 자리 — 실제 수치가 있는 글보다 항상 짧게.
    if (post.views === null) return 12;
    return Math.max(20, Math.round((post.views / topViews) * 100));
  };

  return (
    <aside className="flex flex-col gap-7 lg:sticky lg:top-20">
      <SearchTrigger
        ariaLabel={dict.nav.search}
        className="flex w-full items-center gap-2.5 rounded-[10px] border border-line bg-surface px-3.5 py-3 text-left text-[13.5px] text-faint transition-colors hover:border-accent"
      >
        <Search className="h-4 w-4 text-muted" aria-hidden="true" />
        <span>{dict.nav.searchPlaceholder}</span>
      </SearchTrigger>

      {popular.length > 0 && (
        <section className="rounded-xl border border-line bg-surface p-[18px]">
          <WidgetTitle>{dict.home.popular}</WidgetTitle>
          <ol className="flex flex-col gap-3.5">
            {popular.map((post, i) => (
              <li
                key={post.slug}
                className="grid grid-cols-[20px_1fr] items-baseline gap-3"
              >
                <span
                  className={`font-mono text-[13px] font-bold ${i === 0 ? 'text-accent' : 'text-faint'}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Link
                  href={postPath(locale, post.slug)}
                  className="group block"
                >
                  <p className="mb-1.5 text-[13.5px] font-semibold leading-snug text-ink group-hover:text-accent">
                    {post.title}
                  </p>
                  <div className="signal-track" aria-hidden="true">
                    <i style={{ width: `${barWidth(post, i)}%` }} />
                  </div>
                  <p className="mt-1.5 font-mono text-[10.5px] text-faint">
                    {post.category}
                    {post.tags[0] ? ` · ${post.tags[0]}` : ''}
                    {post.views !== null
                      ? ` · ${formatViews(post.views, locale)} ${dict.home.views}`
                      : ''}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="rounded-xl border border-line bg-surface p-[18px]">
        <WidgetTitle>{dict.home.categories}</WidgetTitle>
        <ul className="flex flex-col">
          {categories.map((cat) => {
            const active = cat.category === activeCategory;
            return (
              <li key={cat.category}>
                <Link
                  href={categoryPath(locale, cat.category)}
                  aria-current={active ? 'true' : undefined}
                  className={`flex items-center justify-between border-b border-dashed border-line py-[7px] text-sm last:border-0 hover:text-accent ${
                    active ? 'text-accent' : 'text-ink'
                  }`}
                >
                  <span>{cat.category}</span>
                  <span className="font-mono text-[12px] text-faint">
                    {cat.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-line bg-surface p-[18px]">
        <WidgetTitle>{dict.home.tags}</WidgetTitle>
        <div className="flex flex-wrap gap-[7px]">
          {tags.map((tag) => (
            <Link
              key={tag.tag}
              href={tagPath(locale, tag.tag)}
              className="tag-pill"
            >
              {tag.tag}
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}
