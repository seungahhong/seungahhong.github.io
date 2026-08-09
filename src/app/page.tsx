import type { Metadata } from 'next';
import RedirectStub from '@/components/layout/RedirectStub';
import { defaultLocale } from '@/i18n/config';
import { localePath, metadataAlternates } from '@/lib/routes';

/**
 * 루트 `/`에는 띄울 내용이 없지만, 외부 백링크와 서치 콘솔 속성 루트가 모두 이 주소다.
 * 예전처럼 noindex를 걸면 Google이 이 URL을 그냥 버려서 그 신호가 `/ko/`로 넘어가지
 * 않는다(noindex와 canonical을 같이 주면 noindex가 이겨 합치기가 무산된다).
 * 그래서 canonical로 `/ko/`에 합치도록 선언한다.
 */
export const metadata: Metadata = {
  alternates: metadataAlternates(defaultLocale),
};

/**
 * 루트 `/` → 기본 로케일로 리다이렉트.
 * 정적 익스포트라 서버 리다이렉트를 못 쓰므로 meta refresh(무 JS) + JS replace 병행.
 */
export default function RootPage() {
  return (
    <RedirectStub
      target={`${localePath(defaultLocale)}/`}
      label="홍승아 기술 블로그 →"
    />
  );
}
