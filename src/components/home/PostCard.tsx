import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import type { PostMeta } from '@/types';
import { postPath, tagPath } from '@/lib/routes';
import { coverGlyph, coverVariant, formatDate } from '@/lib/site';

export default function PostCard({
  post,
  locale,
  dict,
}: {
  post: PostMeta;
  locale: Locale;
  dict: Dictionary;
}) {
  const href = postPath(locale, post.slug);
  const cover = `cover cover${coverVariant(post.slug)}`;

  return (
    <article className="group relative flex flex-col gap-3 border-b border-line py-5 last:border-0 sm:flex-row sm:gap-[18px]">
      <div
        className={`relative aspect-[16/9] w-full flex-none overflow-hidden rounded-[10px] border border-line sm:w-[176px] ${
          post.thumbnail ? 'bg-surface-2' : cover
        }`}
        aria-hidden="true"
      >
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-cover"
          />
        ) : (
          <span className="cover-glyph">{coverGlyph(post.slug)}</span>
        )}
        <span className="absolute left-2.5 top-2.5 z-[2] rounded-[5px] border border-line bg-bg px-2 py-0.5 font-mono text-[10px] text-accent">
          {post.category}
        </span>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <span className="chip">{post.category}</span>
          <time dateTime={post.date} className="meta-mono">
            {formatDate(post.date, locale)}
          </time>
        </div>

        <h3 className="text-[18px] font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-accent">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-[13.5px] leading-[1.55] text-muted">
          {post.excerpt}
        </p>

        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-0.5">
          {post.tags.slice(0, 3).map((tag) => (
            <Link key={tag} href={tagPath(locale, tag)} className="tag-pill">
              {tag}
            </Link>
          ))}
          <span className="text-line" aria-hidden="true">
            ·
          </span>
          <span className="meta-mono">
            {post.readingTime}
            {dict.units.minutesRead}
          </span>
        </div>
      </div>
    </article>
  );
}
