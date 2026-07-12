import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import { localePath } from '@/lib/routes';

export default function Breadcrumb({
  locale,
  dict,
  category,
  title,
}: {
  locale: Locale;
  dict: Dictionary;
  category: string;
  title: string;
}) {
  return (
    <nav aria-label="breadcrumb" className="font-mono text-[12px] text-faint">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link
            href={localePath(locale)}
            className="text-muted hover:text-accent"
          >
            {dict.nav.home}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            href={localePath(locale, '/posts')}
            className="text-muted hover:text-accent"
          >
            {dict.nav.posts}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span className="text-accent">{category}</span>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="max-w-[40ch] truncate text-muted">
          {title}
        </li>
      </ol>
    </nav>
  );
}
