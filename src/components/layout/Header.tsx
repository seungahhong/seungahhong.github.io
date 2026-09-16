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
    <header className="border-line bg-bg sticky top-0 z-50 border-b">
      <nav
        aria-label={dict.nav.home}
        className="max-w-deck mx-auto flex items-center justify-between px-[18px] py-[14px] md:px-[34px] md:py-[18px]"
      >
        {/* Brand */}
        <Link
          href={localePath(locale)}
          className="flex items-baseline gap-2.5"
          aria-label={dict.brand.name}
        >
          <span className="text-ink text-[19px] font-extrabold tracking-tight">
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
                  className={`hover:text-accent text-sm font-medium transition-colors ${
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
            className="border-line bg-surface-2 text-faint hover:border-accent hidden items-center gap-2 rounded-lg border px-3 py-[7px] text-[13px] transition-colors md:flex"
            aria-label={dict.nav.search}
          >
            <Search className="h-[15px] w-[15px]" aria-hidden="true" />
            <span>{dict.nav.search}</span>
            <kbd className="border-line bg-bg text-faint ml-2 rounded-sm border px-[5px] font-mono text-[10px]">
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
            className="border-line bg-surface text-ink hover:border-accent grid h-[34px] w-[34px] place-items-center rounded-lg border transition-colors md:hidden"
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
          className="animate-menu-drop border-line bg-surface border-t px-[18px] py-4 md:hidden"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openSearch();
            }}
            className="border-line bg-bg text-faint mb-3 flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[13.5px]"
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
                    className={`border-line flex items-center justify-between border-b py-3 text-base font-semibold ${
                      active ? 'text-accent' : 'text-ink'
                    }`}
                  >
                    {dict.nav[item.key]}
                    <span
                      aria-hidden="true"
                      className="text-faint font-mono text-[13px]"
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
