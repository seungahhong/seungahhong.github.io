import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import { defaultLocale } from '@/i18n/config';
import { localePath } from '@/lib/routes';

export default function NotFound() {
  const dict = getDictionary(defaultLocale);
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-content flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-mono text-[14px] font-bold tracking-widest text-accent">
        404
      </p>
      <h1 className="mt-3 text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight text-ink">
        {dict.notFound.title}
      </h1>
      <p className="mt-3 max-w-[40ch] text-[15px] text-muted">
        {dict.notFound.description}
      </p>
      <Link
        href={localePath(defaultLocale)}
        className="mt-6 rounded-lg border border-line bg-surface px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
      >
        {dict.notFound.backHome}
      </Link>
    </div>
  );
}
