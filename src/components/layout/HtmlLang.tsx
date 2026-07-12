'use client';

import { useEffect } from 'react';

/**
 * 정적 익스포트에서 루트 레이아웃의 <html lang>은 기본 로케일로 고정되므로,
 * 현재 로케일에 맞춰 클라이언트에서 lang 속성을 보정한다.
 * (SEO 신호는 hreflang alternates가 담당한다)
 */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
