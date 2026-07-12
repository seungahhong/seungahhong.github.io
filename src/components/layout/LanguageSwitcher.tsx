'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeLabels, type Locale } from '@/i18n/config';
import { swapLocaleInPath } from '@/lib/routes';

export default function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center overflow-hidden rounded-lg border border-line bg-surface font-mono text-[11px]"
    >
      {locales.map((target) => {
        const active = target === locale;
        return (
          <button
            key={target}
            type="button"
            aria-pressed={active}
            onClick={() => {
              if (!active) router.push(swapLocaleInPath(pathname, target));
            }}
            className={
              active
                ? 'bg-ink px-2.5 py-1.5 text-bg'
                : 'px-2.5 py-1.5 text-muted transition-colors hover:text-accent'
            }
          >
            {target.toUpperCase()}
            <span className="sr-only"> — {localeLabels[target]}</span>
          </button>
        );
      })}
    </div>
  );
}
