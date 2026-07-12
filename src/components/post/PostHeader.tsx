import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import type { Post } from '@/types';
import { tagPath } from '@/lib/routes';
import { formatDate } from '@/lib/site';
import Breadcrumb from './Breadcrumb';

export default function PostHeader({
  post,
  locale,
  dict,
}: {
  post: Post;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <header className="border-b border-line pb-7 pt-10">
      <Breadcrumb
        locale={locale}
        dict={dict}
        category={post.category}
        title={post.title}
      />

      <h1 className="my-4 text-[clamp(24px,3vw,34px)] font-extrabold leading-[1.22] tracking-tight text-ink">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-2.5">
        <span
          className="grid h-[26px] w-[26px] place-items-center rounded-full text-[11px] font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, var(--signal), var(--accent))',
          }}
          aria-hidden="true"
        >
          {dict.brand.name.slice(0, 1)}
        </span>
        <span className="text-[13.5px] font-semibold text-ink">
          {dict.meta.author}
        </span>
        <span className="text-line" aria-hidden="true">
          ·
        </span>
        <time dateTime={post.date} className="meta-mono">
          {formatDate(post.date, locale)}
        </time>
        <span className="text-line" aria-hidden="true">
          ·
        </span>
        <span className="meta-mono">
          {post.readingTime}
          {dict.units.minutesRead}
        </span>
      </div>

      {post.contentLocale !== locale && (
        <p className="mt-4 rounded-lg border border-line bg-wash px-3.5 py-2 text-[13px] text-muted">
          {dict.post.translationFallbackNotice}
        </p>
      )}

      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link href={tagPath(locale, tag)} className="tag-pill">
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
