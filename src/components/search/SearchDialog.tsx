'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import type { SearchDoc } from '@/types';
import { postPath } from '@/lib/routes';
import { formatDate } from '@/lib/site';

const MAX_RESULTS = 8;

function scoreDoc(doc: SearchDoc, query: string): number {
  const title = doc.title.toLowerCase();
  let score = 0;
  if (title.includes(query)) score += title.startsWith(query) ? 100 : 50;
  if (doc.tags.some((tag) => tag.toLowerCase().includes(query))) score += 30;
  if (doc.category.toLowerCase().includes(query)) score += 20;
  if (doc.excerpt.toLowerCase().includes(query)) score += 8;
  return score;
}

export default function SearchDialog({
  index,
  locale,
  dict,
  onClose,
}: {
  index: SearchDoc[];
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, MAX_RESULTS);
    return index
      .map((doc) => ({ doc, score: scoreDoc(doc, q) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map((entry) => entry.doc);
  }, [query, index]);

  // 열릴 때 입력에 포커스, 배경 스크롤 잠금, 닫힐 때 이전 포커스 복원
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const goTo = (slug: string) => {
    router.push(postPath(locale, slug));
    onClose();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const chosen = results[active];
      if (chosen) goTo(chosen.slug);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-black/40 md:items-start md:px-4 md:pt-[12vh]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.search}
        className="animate-sheet-up border-line bg-surface shadow-card md:animate-menu-drop flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl border md:max-h-[70vh] md:max-w-xl md:rounded-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 모바일 바텀시트 드래그 핸들(시각 표시) */}
        <div
          className="flex justify-center pt-2.5 md:hidden"
          aria-hidden="true"
        >
          <span className="bg-line h-1 w-9 rounded-full" />
        </div>

        <div className="border-line flex items-center gap-2.5 border-b px-4">
          <Search className="text-muted h-4 w-4 flex-none" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={dict.nav.searchPlaceholder}
            aria-label={dict.nav.search}
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            className="text-ink placeholder:text-faint w-full bg-transparent py-3.5 text-[15px] outline-hidden"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.nav.closeMenu}
            className="border-line text-muted hover:border-accent hover:text-accent grid h-7 w-7 flex-none place-items-center rounded-md border transition-colors"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <ul
          id="search-results"
          role="listbox"
          aria-label={dict.nav.search}
          className="min-h-0 flex-1 scrollbar-thin overflow-y-auto p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:pb-2"
        >
          {results.length === 0 ? (
            <li className="text-muted px-3 py-8 text-center text-[13.5px]">
              {dict.nav.noResults}
            </li>
          ) : (
            results.map((doc, i) => (
              <li key={doc.slug} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => goTo(doc.slug)}
                  className={`flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    i === active ? 'bg-surface-2' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="chip">{doc.category}</span>
                    <span className="meta-mono">
                      {formatDate(doc.date, locale)}
                    </span>
                  </span>
                  <span className="text-ink text-[14.5px] font-semibold">
                    {doc.title}
                  </span>
                  {doc.tags.length > 0 && (
                    <span className="text-faint font-mono text-[11px]">
                      {doc.tags.map((tag) => `#${tag}`).join('  ')}
                    </span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
