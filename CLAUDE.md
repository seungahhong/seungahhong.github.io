# CLAUDE.md

이 파일은 이 저장소에서 코드 작업을 할 때 Claude Code(claude.ai/code)에 지침을 제공합니다.

## 프로젝트 개요

Next.js 16(App Router, 정적 익스포트) 기반의 개인 기술 블로그입니다. TypeScript, React 19, Tailwind CSS v3.4를 사용하며, 마크다운 콘텐츠를 unified(remark/rehype) + shiki 파이프라인으로 처리합니다. 한국어/영어 i18n(`/ko`, `/en`)을 지원합니다.

## 개발 명령어

### 필수 명령어

```bash
# 개발 서버 실행 (predev로 콘텐츠 이미지 자동 동기화)
pnpm dev

# 프로덕션 빌드 (prebuild로 콘텐츠 이미지 자동 동기화, out/ 생성)
pnpm build

# 빌드된 정적 사이트 로컬 서빙 (out/ 디렉토리)
pnpm serve

# 캐시/산출물 정리 (.next, out, test-results, public/blog-assets)
pnpm clean

# 콘텐츠 이미지 → public/blog-assets 수동 동기화
pnpm sync:assets
```

### 코드 품질

```bash
# ESLint 실행
pnpm lint
pnpm lint:fix   # 자동 수정 포함

# 타입 체크
pnpm typecheck

# Prettier 포맷팅
pnpm format
```

### 테스트

```bash
# 단위 테스트 (Vitest)
pnpm test         # 1회 실행
pnpm test:watch   # watch 모드

# E2E 테스트 (Playwright + axe 접근성 검사)
pnpm e2e
pnpm e2e:debug    # 디버그 모드
```

### 배포

```bash
# GitHub Pages 배포 (predeploy로 빌드 후 out/을 main 브랜치에 gh-pages 배포)
pnpm deploy
```

## 프로젝트 구조 및 아키텍처

### 핵심 디렉토리

- `contents/` - 블로그 포스트(마크다운) 및 이미지 저장소
  - `blog/YYYY/MM/*.md` - 연/월별로 구성된 블로그 포스트
  - 영문 번역본은 `slug.en.md` 컨벤션. 번역본이 없으면 한국어 원문으로 폴백
- `src/app/` - Next.js App Router 라우트
  - `[lang]/` - 로케일(`ko`/`en`) 세그먼트
  - `[lang]/posts/[slug]/` - 블로그 포스트 상세
  - `[lang]/tags/` - 태그 페이지(`?tag=` 쿼리 클라이언트 필터)
  - `[lang]/about/` - 소개 페이지
- `src/components/` - React 컴포넌트 (`layout`, `home`, `post`, `posts`, `tags`, `search`, `providers`)
- `src/lib/` - 도메인 로직: `posts`, `markdown`, `i18n`, `reading-time`, `routes`, `site`, `jsonld`
- `src/i18n/dictionaries/` - 로케일별 UI 문자열
- `src/types/` - 공용 타입
- `scripts/sync-content-assets.mjs` - `contents/` 이미지를 `public/blog-assets`로 복사

### 데이터 플로우

1. **콘텐츠 처리**: 마크다운 파일 → gray-matter(frontmatter) + unified(remark-parse → remark-gfm → remark-rehype → rehype-pretty-code/shiki → rehype-stringify) → HTML
2. **페이지 생성**: App Router의 `generateStaticParams`로 로케일 × 슬러그 조합의 정적 페이지를 빌드 시 생성
3. **스타일링**: Tailwind CSS v3.4 + `@tailwindcss/typography`. 라이트/다크 테마는 `next-themes`(`data-theme`) 및 amber 계열 CSS 변수 토큰
4. **타입 안전성**: TypeScript strict 모드

### 정적 익스포트 / 배포 특이사항

- `next.config.ts`에서 `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`
- GitHub Pages 사용자 사이트(https://seungahhong.github.io)라 basePath 불필요
- `public/.nojekyll`로 `_next` 디렉토리가 Jekyll에 무시되지 않도록 함
- 정적 익스포트 제약 때문에 태그 페이지는 per-tag 정적 라우트 대신 쿼리 기반 클라이언트 필터 사용(한글 디렉토리명 익스포트 리스크 회피)

### 주요 설정 파일

- `next.config.ts` - Next.js 설정 (정적 익스포트)
- `tailwind.config.ts` - Tailwind 테마/토큰
- `tsconfig.json` - TypeScript 설정 (strict 모드, path alias)
- `eslint.config.mjs` - ESLint (flat config, `eslint-config-next`)
- `vitest.config.ts` / `vitest.setup.ts` - 단위 테스트
- `playwright.config.ts` - E2E 테스트

### Import Alias

```typescript
import Component from '@/components/...'; // src/components/
import { getAllPosts } from '@/lib/posts'; // src/lib/
```

### 배포 환경

- GitHub Pages (https://seungahhong.github.io) — `out/` 정적 익스포트를 `main` 브랜치에 배포
- SEO 최적화 (sitemap, canonical URL, JSON-LD 구조화 데이터: WebSite/BlogPosting/BreadcrumbList)
- 접근성: Playwright + axe로 주요 페이지 WCAG 검증
