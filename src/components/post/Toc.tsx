'use client';

import { useEffect, useState } from 'react';
import type { TocHeading } from '@/types';

export default function Toc({
  headings,
  title,
}: {
  headings: TocHeading[];
  title: string;
}) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-84px 0px -70% 0px', threshold: [0, 1] },
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label={title} className="sticky top-20 border-l border-line pl-5">
      <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
        {title}
      </p>
      <ol className="toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            data-depth={heading.depth}
            data-active={activeId === heading.id}
          >
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
