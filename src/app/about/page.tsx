import type { Metadata } from 'next';
import RedirectStub from '@/components/layout/RedirectStub';
import { defaultLocale } from '@/i18n/config';
import { localePath, metadataAlternates } from '@/lib/routes';

/**
 * Gatsby 시절 `/about/`. 마이그레이션으로 `/ko/about/`로 옮겨지면서 404가 됐다.
 * canonical로 새 주소에 합쳐 색인을 넘긴다(`@/lib/legacy-urls`의 글 주소와 같은 이유).
 */
export const metadata: Metadata = {
  alternates: metadataAlternates(defaultLocale, '/about'),
};

export default function LegacyAboutRedirect() {
  return (
    <RedirectStub
      target={`${localePath(defaultLocale, '/about')}/`}
      label="소개 페이지로 이동 →"
    />
  );
}
