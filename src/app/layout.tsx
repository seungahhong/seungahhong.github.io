import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ogImagePath, siteConfig } from '@/lib/site';
import { getDictionary } from '@/lib/i18n';
import { defaultLocale } from '@/i18n/config';
import './globals.css';

const dict = getDictionary(defaultLocale);

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: '홍승아 기술 블로그',
  description:
    '프론트엔드와 AI 하네스 엔지니어링 사이의 기록. React·성능·RAG·하네스에 대해 만들면서 배운 것을 정리합니다.',
  authors: [{ name: dict.meta.author, url: siteConfig.social.portfolio }],
  creator: dict.meta.author,
  publisher: dict.meta.author,
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  // 검색·AI 크롤러가 요약과 미리보기를 잘라내지 않도록 상한만 풀어 준다.
  // index/follow는 기본값이라 굳이 선언하지 않는다 — 선언하면 404의 noindex와
  // 충돌하는 robots 태그가 같이 나간다.
  robots: {
    googleBot: {
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    images: [{ url: ogImagePath[defaultLocale], width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  // 루트 레이아웃에 두어 `/`를 포함한 모든 페이지에 실린다.
  // (서치 콘솔은 속성 루트 URL에서 이 태그를 확인한다)
  verification: {
    google: siteConfig.verification.google,
    other: {
      'naver-site-verification': siteConfig.verification.naver,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
