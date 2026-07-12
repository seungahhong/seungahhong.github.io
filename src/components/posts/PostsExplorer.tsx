'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import type { CategoryCount, PostMeta } from '@/types';
import PostCard from '@/components/home/PostCard';

export default function PostsExplorer({
  locale,
  dict,
  posts,
  categories,
}: {
  locale: Locale;
  dict: Dictionary;
  posts: PostMeta[];
  categories: CategoryCount[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get('category');
  const active =
    requested && categories.some((c) => c.category === requested)
      ? requested
      : 'all';
  const filtered =
    active === 'all' ? posts : posts.filter((post) => post.category === active);

  const selectCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') params.delete('category');
    else params.set('category', category);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const renderPill = (
    key: string,
    label: string,
    count: number,
    isActive: boolean,
  ) => (
    <button
      key={key}
      type="button"
      aria-pressed={isActive}
      onClick={() => selectCategory(key)}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
        isActive
          ? 'border-ink bg-ink text-bg'
          : 'border-line bg-surface text-muted hover:border-accent hover:text-ink'
      }`}
    >
      {label}
      <span
        className={`font-mono text-[11px] ${isActive ? 'text-bg/70' : 'text-faint'}`}
      >
        {count}
      </span>
    </button>
  );

  return (
    <div className="mx-auto max-w-content px-[18px] py-8 md:px-[34px]">
      <header className="mb-6">
        <p className="mb-2 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
          {dict.posts.title}
        </p>
        <h1 className="text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight text-ink">
          {dict.posts.title}
        </h1>
        <p className="mt-2 text-[15px] text-muted">{dict.posts.subtitle}</p>
      </header>

      <div
        role="group"
        aria-label={dict.posts.filterByCategory}
        className="mb-4 flex flex-wrap gap-2"
      >
        {renderPill('all', dict.posts.all, posts.length, active === 'all')}
        {categories.map((cat) =>
          renderPill(
            cat.category,
            cat.category,
            cat.count,
            active === cat.category,
          ),
        )}
      </div>

      <div className="flex flex-col">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} dict={dict} />
        ))}
      </div>
    </div>
  );
}
