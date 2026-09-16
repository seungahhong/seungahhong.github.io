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
      className="border-line mt-11 grid grid-cols-1 gap-3.5 border-t pt-7 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={postPath(locale, previous.slug)}
          className="group border-line bg-surface hover:border-accent flex flex-col gap-1.5 rounded-xl border px-[18px] py-4 transition-colors"
          rel="prev"
        >
          <span className="text-accent flex items-center gap-1.5 font-mono text-[12px]">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {dict.post.prev}
          </span>
          <span className="text-ink group-hover:text-accent text-[15px] leading-snug font-bold">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={postPath(locale, next.slug)}
          className="group border-line bg-surface hover:border-accent flex flex-col items-end gap-1.5 rounded-xl border px-[18px] py-4 text-right transition-colors"
          rel="next"
        >
          <span className="text-accent flex items-center gap-1.5 font-mono text-[12px]">
            {dict.post.next}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-ink group-hover:text-accent text-[15px] leading-snug font-bold">
            {next.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
