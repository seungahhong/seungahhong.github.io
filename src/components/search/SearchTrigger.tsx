'use client';

import type { ReactNode } from 'react';
import { useSearch } from './SearchProvider';

export default function SearchTrigger({
  className,
  ariaLabel,
  children,
  onActivate,
}: {
  className?: string;
  ariaLabel: string;
  children: ReactNode;
  onActivate?: () => void;
}) {
  const { open } = useSearch();
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        onActivate?.();
        open();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
