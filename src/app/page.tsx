import Link from 'next/link';
import type { Metadata } from 'next';
import { defaultLocale } from '@/i18n/config';
import RedirectClient from '@/components/layout/RedirectClient';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * 루트 `/` → 기본 로케일로 리다이렉트.
 * 정적 익스포트라 서버 리다이렉트를 못 쓰므로 meta refresh(무 JS) + JS replace 병행.
 */
export default function RootPage() {
  const target = `/${defaultLocale}/`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <RedirectClient target={target} />
      <div style={{ padding: 48, fontFamily: 'var(--font-sans)' }}>
        <Link href={target} style={{ color: 'var(--accent)', fontWeight: 700 }}>
          홍승아 기술 블로그 →
        </Link>
      </div>
    </>
  );
}
