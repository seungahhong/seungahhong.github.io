'use client';

import type { ReactNode } from 'react';
import { useSearch } from './SearchProvider';

export default function SearchTrigger({
  className,
  children,
  onActivate,
}: {
  className?: string;
  children: ReactNode;
  onActivate?: () => void;
}) {
  const { open } = useSearch();
  return (
    <button
      type="button"
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
