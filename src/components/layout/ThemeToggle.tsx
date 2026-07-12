'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

/**
 * 아이콘은 CSS(data-theme)로 전환해 하이드레이션 불일치를 피한다.
 * 클릭 시 실제 <html data-theme> 값을 읽어 반전한다.
 */
export default function ThemeToggle({ label }: { label: string }) {
  const { setTheme } = useTheme();

  const toggle = () => {
    const current =
      document.documentElement.getAttribute('data-theme') ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggle}
      className="grid h-[34px] w-[34px] place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <Moon className="theme-icon-light h-4 w-4" aria-hidden="true" />
      <Sun className="theme-icon-dark h-4 w-4" aria-hidden="true" />
    </button>
  );
}
