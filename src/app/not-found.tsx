import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import { defaultLocale } from '@/i18n/config';
import { localePath } from '@/lib/routes';

export default function NotFound() {
  const dict = getDictionary(defaultLocale);
  return (
    <div className="max-w-content mx-auto flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-accent font-mono text-[14px] font-bold tracking-widest">
        404
      </p>
      <h1 className="text-ink mt-3 text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight">
        {dict.notFound.title}
      </h1>
      <p className="text-muted mt-3 max-w-[40ch] text-[15px]">
        {dict.notFound.description}
      </p>
      <Link
        href={localePath(defaultLocale)}
        className="border-line bg-surface text-ink hover:border-accent hover:text-accent mt-6 rounded-lg border px-5 py-2.5 text-[14px] font-semibold transition-colors"
      >
        {dict.notFound.backHome}
      </Link>
    </div>
  );
}
