import Link from 'next/link';
import RedirectClient from './RedirectClient';

/**
 * 정적 익스포트라 서버 리다이렉트를 못 쓰는 자리에서 쓰는 이동 스텁.
 * meta refresh(무 JS) + JS replace를 함께 두고, 둘 다 막혀도 누를 링크를 남긴다.
 */
export default function RedirectStub({
  target,
  label,
}: {
  target: string;
  label: string;
}) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <RedirectClient target={target} />
      <div style={{ padding: 48, fontFamily: 'var(--font-sans)' }}>
        <Link href={target} style={{ color: 'var(--accent)', fontWeight: 700 }}>
          {label}
        </Link>
      </div>
    </>
  );
}
