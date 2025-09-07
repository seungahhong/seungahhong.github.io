# CLAUDE.md

이 파일은 이 저장소에서 코드 작업을 할 때 Claude Code(claude.ai/code)에 지침을 제공합니다.

## 프로젝트 개요

Gatsby 기반의 개인 기술 블로그입니다. TypeScript, React, styled-components를 사용하여 구축되었으며, GraphQL을 통해 마크다운 콘텐츠를 처리합니다.

## 개발 명령어

### 필수 명령어
```bash
# 개발 서버 실행
pnpm develop    # 또는 pnpm start

# 프로덕션 빌드
pnpm build

# 빌드된 사이트 로컬 서빙
pnpm serve

# 캐시 정리
pnpm clean
```

### 코드 품질
```bash
# ESLint 실행 (자동 수정 포함)
pnpm lint

# Prettier 포맷팅
pnpm format
```

### 테스트
```bash
# E2E 테스트 (Playwright)
pnpm e2e:run     # 헤드리스 모드
pnpm e2e:debug   # 디버그 모드
pnpm e2e:ci      # CI 환경용
```

### 배포
```bash
# GitHub Pages 배포
pnpm deploy
```

## 프로젝트 구조 및 아키텍처

### 핵심 디렉토리
- `contents/` - 블로그 포스트(마크다운) 및 이미지 저장소
  - `blog/` - 연도별로 구성된 블로그 포스트
  - `images/` - 헤더 및 기타 이미지 리소스
- `src/components/` - React 컴포넌트
  - `Base/` - 레이아웃 컴포넌트 (Header, Footer, Template, GlobalStyle)
  - `Post/` - 블로그 포스트 관련 컴포넌트
  - `templates/` - 페이지 템플릿 (PostTemplate)
- `src/pages/` - 라우팅 페이지 (index, about, 404)

### 데이터 플로우
1. **콘텐츠 처리**: 마크다운 파일 → gatsby-transformer-remark → GraphQL 데이터 레이어
2. **페이지 생성**: gatsby-node.js에서 동적으로 블로그 포스트 페이지 생성
3. **스타일링**: styled-components를 통한 CSS-in-JS
4. **타입 안전성**: TypeScript 엄격 모드 활성화

### 주요 설정 파일
- `gatsby-config.js` - Gatsby 플러그인 및 사이트 메타데이터 설정
- `gatsby-node.js` - 빌드 시 페이지 생성 로직, webpack alias 설정
- `tsconfig.json` - TypeScript 설정 (strict 모드, path alias)
- `.eslintrc.js` - ESLint 설정 (TypeScript 규칙 포함)

### Import Alias
```typescript
import Component from 'components/...'  // src/components/
import util from 'utils/...'           // src/utils/
import hook from 'hooks/...'           // src/hooks/
```

### 배포 환경
- GitHub Pages (https://seungahhong.github.io)
- Google Analytics 및 GTM 통합
- SEO 최적화 (sitemap, robots.txt, canonical URL)