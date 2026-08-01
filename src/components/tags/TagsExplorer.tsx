'use client';

import { X } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import type { PostMeta, TagCount } from '@/types';
import { useQueryParam } from '@/lib/use-query-param';
import PostCard from '@/components/home/PostCard';

export default function TagsExplorer({
  locale,
  dict,
  posts,
  tags,
}: {
  locale: Locale;
  dict: Dictionary;
  posts: PostMeta[];
  tags: TagCount[];
}) {
  const [requested, setTag] = useQueryParam('tag');
  const active =
    requested && tags.some((t) => t.tag === requested) ? requested : null;

  const filtered = active
    ? posts.filter((post) => post.tags.includes(active))
    : posts;

  const selectTag = (tag: string | null) => {
    setTag(tag);
  };

  return (
    <div className="mx-auto max-w-content px-[18px] py-8 md:px-[34px]">
      <header className="mb-6 border-b border-line pb-6">
        <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
          {dict.tags.title}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight text-ink">
            {active ? (
              <>
                <span className="font-mono text-accent">#</span>
                {active}
              </>
            ) : (
              dict.tags.title
            )}
          </h1>
          <span className="font-mono text-[13px] text-muted">
            {filtered.length}
            {dict.tags.postCount}
          </span>
          {active && (
            <button
              type="button"
              onClick={() => selectTag(null)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[12px] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              {dict.tags.clearFilter}
            </button>
          )}
        </div>
        <p className="mt-3 text-[15px] text-muted">{dict.tags.subtitle}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.tag}
              type="button"
              data-active={active === tag.tag}
              aria-pressed={active === tag.tag}
              onClick={() => selectTag(active === tag.tag ? null : tag.tag)}
              className="tag-pill"
            >
              {tag.tag}
              <span className="ml-1 text-faint">{tag.count}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} dict={dict} />
        ))}
      </div>
    </div>
  );
}
