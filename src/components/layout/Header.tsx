'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import { navItems } from '@/lib/site';
import { localePath } from '@/lib/routes';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useSearch } from '@/components/search/SearchProvider';

function isActive(rest: string, sub: string): boolean {
  if (sub === '') return rest === '';
  return rest === sub || rest.startsWith(`${sub}/`);
}

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(ko|en)/, '').replace(/\/$/, '');
  const [open, setOpen] = useState(false);
  const { open: openSearch } = useSearch();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <nav
        aria-label={dict.nav.home}
        className="mx-auto flex max-w-deck items-center justify-between px-[18px] py-[14px] md:px-[34px] md:py-[18px]"
      >
        {/* Brand */}
        <Link
          href={localePath(locale)}
          className="flex items-baseline gap-2.5"
          aria-label={dict.brand.name}
        >
          <span className="text-[19px] font-extrabold tracking-tight text-ink">
            {dict.brand.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-[26px] md:flex">
          {navItems.map((item) => {
            const active = isActive(rest, item.sub);
            return (
              <li key={item.key}>
                <Link
                  href={localePath(locale, item.sub)}
                  aria-current={active ? 'page' : undefined}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    active ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {dict.nav[item.key]}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Tools */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openSearch}
            className="hidden items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-[7px] text-[13px] text-faint transition-colors hover:border-accent md:flex"
            aria-label={dict.nav.search}
          >
            <Search className="h-[15px] w-[15px]" aria-hidden="true" />
            <span>{dict.nav.search}</span>
            <kbd className="ml-2 rounded border border-line bg-bg px-[5px] font-mono text-[10px] text-faint">
              ⌘K
            </kbd>
          </button>

          <LanguageSwitcher locale={locale} label={dict.nav.language} />
          <ThemeToggle label={dict.nav.toggleTheme} />

          <button
            type="button"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-[34px] w-[34px] place-items-center rounded-lg border border-line bg-surface text-ink transition-colors hover:border-accent md:hidden"
          >
            {open ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-menu"
          className="animate-menu-drop border-t border-line bg-surface px-[18px] py-4 md:hidden"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openSearch();
            }}
            className="mb-3 flex w-full items-center gap-2.5 rounded-lg border border-line bg-bg px-3 py-2.5 text-[13.5px] text-faint"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>{dict.nav.searchPlaceholder}</span>
          </button>
          <ul className="flex flex-col">
            {navItems.map((item) => {
              const active = isActive(rest, item.sub);
              return (
                <li key={item.key}>
                  <Link
                    href={localePath(locale, item.sub)}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center justify-between border-b border-line py-3 text-base font-semibold ${
                      active ? 'text-accent' : 'text-ink'
                    }`}
                  >
                    {dict.nav[item.key]}
                    <span
                      aria-hidden="true"
                      className="font-mono text-[13px] text-faint"
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
