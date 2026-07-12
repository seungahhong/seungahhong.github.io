import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import type { PostAdjacency } from '@/types';
import { postPath } from '@/lib/routes';

export default function PostNav({
  adjacency,
  locale,
  dict,
}: {
  adjacency: PostAdjacency;
  locale: Locale;
  dict: Dictionary;
}) {
  const { previous, next } = adjacency;

  return (
    <nav
      aria-label={`${dict.post.prev} / ${dict.post.next}`}
      className="mt-11 grid grid-cols-1 gap-3.5 border-t border-line pt-7 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={postPath(locale, previous.slug)}
          className="group flex flex-col gap-1.5 rounded-xl border border-line bg-surface px-[18px] py-4 transition-colors hover:border-accent"
          rel="prev"
        >
          <span className="flex items-center gap-1.5 font-mono text-[12px] text-accent">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {dict.post.prev}
          </span>
          <span className="text-[15px] font-bold leading-snug text-ink group-hover:text-accent">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={postPath(locale, next.slug)}
          className="group flex flex-col items-end gap-1.5 rounded-xl border border-line bg-surface px-[18px] py-4 text-right transition-colors hover:border-accent"
          rel="next"
        >
          <span className="flex items-center gap-1.5 font-mono text-[12px] text-accent">
            {dict.post.next}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-bold leading-snug text-ink group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
