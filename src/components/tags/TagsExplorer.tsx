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
    <div className="max-w-content mx-auto px-[18px] py-8 md:px-[34px]">
      <header className="border-line mb-6 border-b pb-6">
        <p className="text-accent mb-3 font-mono text-[12px] tracking-[0.16em] uppercase">
          {dict.tags.title}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-ink text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight">
            {active ? (
              <>
                <span className="text-accent font-mono">#</span>
                {active}
              </>
            ) : (
              dict.tags.title
            )}
          </h1>
          <span className="text-muted font-mono text-[13px]">
            {filtered.length}
            {dict.tags.postCount}
          </span>
          {active && (
            <button
              type="button"
              onClick={() => selectTag(null)}
              className="border-line bg-surface text-muted hover:border-accent hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[12px] transition-colors"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              {dict.tags.clearFilter}
            </button>
          )}
        </div>
        <p className="text-muted mt-3 text-[15px]">{dict.tags.subtitle}</p>

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
              <span className="text-faint ml-1">{tag.count}</span>
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
