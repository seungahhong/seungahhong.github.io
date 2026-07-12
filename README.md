# seungahhong.github.io

홍승아 기술 블로그 — **Next.js 16 · React 19 · Tailwind CSS · TypeScript**로 구축한 정적 사이트입니다. 마크다운 콘텐츠를 unified(remark/rehype) + shiki로 렌더링하며, GitHub Pages로 배포됩니다.

🔗 https://seungahhong.github.io

## Key Features

- **정적 익스포트** — Next.js App Router(`output: 'export'`)로 완전 정적 사이트 생성
- **다국어(i18n)** — 한국어(`/ko`) · 영어(`/en`) 지원, 번역본이 없으면 한국어로 폴백
- **마크다운 블로그** — gray-matter + remark/rehype + shiki 코드 하이라이팅
- **라이트/다크 테마** — `next-themes` 기반 테마 토글
- **검색** — ⌘K 커맨드 팔레트로 제목·태그·카테고리·발췌 클라이언트 검색
- **SEO** — sitemap, canonical URL, JSON-LD 구조화 데이터(WebSite/BlogPosting/BreadcrumbList)
- **접근성** — Playwright + axe로 주요 페이지 WCAG 검증

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, 정적 익스포트)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v3.4](https://tailwindcss.com/) + [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography)
- [unified](https://unified.js.org/) · [remark](https://remark.js.org/) · [rehype](https://github.com/rehypejs/rehype) · [shiki](https://shiki.style/)
- [Vitest](https://vitest.dev/) · [Playwright](https://playwright.dev/)

## Getting Started

이 프로젝트를 클론하고 실행하려면 [Git](https://git-scm.com)과 [Node.js](https://nodejs.org/en/download/) (>= 20.9), [pnpm](https://pnpm.io/)이 필요합니다.

```bash
# 저장소 클론
git clone https://github.com/seungahhong/seungahhong.github.io.git
cd seungahhong.github.io

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드 (out/ 생성)
pnpm build

# 빌드된 정적 사이트 로컬 서빙
pnpm serve

# GitHub Pages 배포
pnpm deploy
```

## Scripts

| 명령어           | 설명                                            |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | 개발 서버 실행                                   |
| `pnpm build`     | 프로덕션 빌드 (`out/` 정적 익스포트)            |
| `pnpm serve`     | 빌드된 사이트 로컬 서빙                          |
| `pnpm lint`      | ESLint 실행 (`lint:fix`로 자동 수정)           |
| `pnpm typecheck` | TypeScript 타입 체크                             |
| `pnpm format`    | Prettier 포맷팅                                 |
| `pnpm test`      | 단위 테스트 (Vitest, `test:watch`로 watch)     |
| `pnpm e2e`       | E2E 테스트 (Playwright + axe)                   |
| `pnpm deploy`    | GitHub Pages 배포                               |

## Project Structure

```
contents/blog/YYYY/MM/*.md   # 블로그 포스트 (영문은 slug.en.md)
src/app/[lang]/              # App Router 라우트 (ko/en 로케일)
src/components/              # React 컴포넌트
src/lib/                     # posts, markdown, i18n, jsonld 등 도메인 로직
src/i18n/dictionaries/       # 로케일별 UI 문자열
scripts/                     # 콘텐츠 이미지 동기화 스크립트
```

## Contact

블로그나 코드에 대해 하고 싶은 말이 있다면 <gmm117@naver.com>로 이메일 주세요!

## License

Copyright (c) 2022 Hong SeungAh. Released under the [MIT license](https://opensource.org/licenses/MIT).
