import Script from 'next/script';
import { siteConfig } from '@/lib/site';

/** 실제 배포 호스트에서만 히트를 보낸다 — 로컬 `pnpm serve`나 E2E는 집계에서 제외. */
const PROD_HOST = new URL(siteConfig.url).hostname;

/**
 * GA4(gtag.js) 로더.
 *
 * 페이지뷰를 수동으로 쏘지 않는다. GA4 향상된 측정의 "브라우저 기록 이벤트 기반
 * 페이지 변경"이 App Router의 클라이언트 내비게이션(pushState)까지 자동으로 잡기
 * 때문에, 여기서 page_view를 또 보내면 조회수가 두 배로 집계된다.
 * (인기 글 정렬이 이 조회수를 기준으로 삼으므로 중복 집계는 순위를 왜곡한다)
 */
export default function GoogleAnalytics() {
  // 개발 서버에서는 스크립트 자체를 싣지 않는다.
  if (process.env.NODE_ENV !== 'production') return null;

  const [loaderId] = siteConfig.gaIds;
  const configs = siteConfig.gaIds
    .map((id) => `  gtag('config', ${JSON.stringify(id)});`)
    .join('\n');

  return (
    <>
      <Script
        id="ga4-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
window.gtag = function gtag() { window.dataLayer.push(arguments); };
if (location.hostname === ${JSON.stringify(PROD_HOST)}) {
  gtag('js', new Date());
${configs}
}`}
      </Script>
    </>
  );
}
