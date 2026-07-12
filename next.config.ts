import type { NextConfig } from 'next';

/**
 * GitHub Pages(사용자 사이트: https://seungahhong.github.io)는 정적 호스팅이므로
 * 정적 익스포트(`output: 'export'`)로 빌드해 `out/` 디렉토리를 배포한다.
 * - 사용자 사이트라 basePath 불필요(루트 `/`에서 서빙)
 * - GitHub Pages(Jekyll)가 `_next` 디렉토리를 무시하지 않도록 `public/.nojekyll` 포함
 * - 정적 익스포트에서는 이미지 최적화 서버가 없으므로 `images.unoptimized`
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 마크다운 콘텐츠 이미지는 빌드 시 public/blog-assets로 동기화된다.
  // (Next 16은 `next build`에서 ESLint를 실행하지 않는다 — lint는 별도 스텝)
};

export default nextConfig;
