---
layout: post
title: 이번 주 패키지 릴리스 정리 — 2026-11-07
date: 2026-11-07
published: 2026-11-07
category: 개발
tags: ['릴리스', '패키지', '주간정리']
comments: true
github: ''
---

## ✍️ 한 줄 요약

Next.js(16.4.5·15.5.29)가 엣지 응답의 내부 쿠키 헤더 제거 등 보안성 수정을 낸 데 이어, Nuxt 4.6.4는 개발 서버 Host 헤더 검증과 `x-forwarded-proto` 신뢰 범위 제한을, Hono 4.13.16은 JWT 서명 검증 강화와 라우터·`mount` 경로 처리 수정을 냈습니다. Rolldown 1.3.0은 CLI에서 `--input`과 위치 인자를 같이 쓰면 거부하는 breaking change(기존 코드를 고쳐야 하는 변경)가 있고, Omarchy는 4.5.0(🔺 메이저 라인)이 나왔습니다.

## 이번 주 한눈에 보기

기간은 2026-10-31 ~ 2026-11-07(KST)이며, 추적 중인 87개 패키지 가운데 28개의 변경점을 확인했습니다. 변경점을 읽지 못해 뺀 패키지는 마무리 섹션에 적었습니다.

이번 주는 GitHub 릴리스 페이지를 읽을 수 없어, CHANGELOG 파일이 있는 패키지는 그 파일을, 없는 패키지는 새 태그까지의 변경 이력(커밋 제목)을 읽고 정리했습니다. 이 경우 `릴리스 공지`는 `없음`으로 표시했습니다.

| 패키지 | 버전 | 릴리스 공지 | 변경점 |
|---|---|---|---|
| astro | 7.4.7 (패치 3개) | [있음](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) | 이미지 엔드포인트 경로 검사, `astro check`, i18n fallback 버그 수정 |
| pnpm | v12.18.0 · v11.28.11 (패치 1개) | 없음 | 플랫폼별 변형 패키지 게시·설치, peer 경로 해석 수정 |
| Electron | v45.2.3 (패치 3개) · v44.10.2 (패치 2개) · v43.8.7 (패치 3개) | 없음 | Chromium 변경 반영, `removeInsertedCSS()` 수정 |
| Oxfmt | v0.76.0 · v0.77.0 | 없음 | Vue 템플릿 포맷 지원 확대 (`parser:vue` 처리 변경) |
| Oxlint | v1.91.0 · v1.92.0 | [있음](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/CHANGELOG.md) | 규칙 옵션 추가 |
| Next.js | v16.4.5 · v16.4.4 · v15.5.29 | 없음 | 내부 쿠키 헤더 제거, `'use cache'` 키 수정 등 |
| Nx | 24.0.5 (패치 3개) | 없음 | 보안 하드닝과 캐시·데몬 수정 다수 |
| Homebrew | 7.0.12 | 없음 | `info`·attestation 조회 개선 |
| 🔺 메이저 Omarchy | v4.5.0 | 없음 | 클립보드·이모지 패널, Notion 설치 항목 |
| Vite | v8.3.6 | [있음](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md) | 번들 dev 모드·CSS 의존성 수집 버그 수정 |
| Angular | 22.2.5 · 21.2.26 · 20.3.35 | [있음](https://github.com/angular/angular/blob/main/CHANGELOG.md) | `rxResource` `debugName`, forms·router 수정 |
| Hono | v4.13.16 (패치 2개) | 없음 | JWT 서명 검증 강화, 라우터·`mount` 경로 수정 |
| Istio | 1.31.4 · 1.30.8 | 없음 | istiod 크래시·인증 정책 매칭 수정 |
| Nuxt | v4.6.4 | 없음 | 개발 서버 Host 검증, 라우트 규칙 수정 |
| Rspack | v2.3.1 | 없음 | HMR·CSS·source map 수정 |
| Visual Studio Code | 1.145.0 · 1.145.1 · 1.145.2 | 없음 | 에이전트 호스트·채팅 관련 수정 |
| Vitest | v5.1.0 | 없음 | 실패 스냅샷 대화형 검토, `vi.waitFor` 옵션 |
| Argo CD | v3.6.0 · v3.6.1 · v3.5.7 · v3.4.13 · v3.3.19 | 없음 | 3.6 라인 UI·컨트롤러 수정 |
| Bazel | 9.3.2 | [있음](https://github.com/bazelbuild/bazel/blob/9.3.2/CHANGELOG.md) | linux-sandbox 조기 종료 수정 |
| Biome | v2.6.5 · v2.6.6 | [있음](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md) | nursery 규칙 대거 추가 |
| Gradle | 9.9.0 | [있음](https://github.com/gradle/gradle/blob/v9.9.0/platforms/documentation/docs/src/docs/release/notes.md) | Kotlin DSL 증분 컴파일, `--tests` 필터 확대 |
| Lima | v2.3.0 | 없음 | WSL2 마운트 지원, sudoers 매칭 수정 |
| ollama | v0.40.15 (패치 2개) | 없음 | 모델 런처·MLX 지원 확대 |
| React Native Skia | v3.9.1 · v3.9.0 | 없음 | iOS·Android 렌더링 스레드 수정 |
| Rolldown | v1.3.0 | [있음](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md) | CLI breaking change, import attributes 지원 |
| Rstest | v0.12.6 | 없음 | `sequence.setupFiles`, 병렬 라이프사이클 훅 |
| Storybook | v10.6.6 | [있음](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md) | StackBlitz embed 복구 |
| Tailwind CSS | v4.3.5 · v4.3.4 | [있음](https://github.com/tailwindlabs/tailwindcss/blob/main/CHANGELOG.md) | Turbopack 로더 추가, `@scope`·`color-mix()` 수정 |

## 패키지별 변경 내용

### astro 7.4.7

JavaScript 웹 프레임워크입니다.

**무엇이 바뀌었나** — 패치 릴리스 3개가 이어졌습니다. 7.4.7은 이미지 엔드포인트가 대소문자만 다른 디렉토리를 빌드 폴더 안에 있는 것으로 잘못 취급하던 문제를 고쳤습니다. 7.4.6은 `astro check`가 오류가 있어도 종료 코드 0을 반환하던 문제, `glob()` 로더의 파일 처리, 첫 로드 때 불필요한 페이지 새로고침, 온디맨드 렌더링 페이지의 i18n fallback을 고쳤습니다. 7.4.5는 `astro dev status` 같은 백그라운드 명령과 `import.meta.env` 값 처리, 잘못된 퍼센트 인코딩 경로 요청을 다뤘습니다.

**업그레이드할 때 확인할 점** — CI에서 `astro check`를 쓴다면 이전에는 통과하던 오류가 이제 실패로 잡힐 수 있으니 한 번 돌려 보세요. 그 외에는 그대로 올려도 됩니다.

릴리스 공지: [CHANGELOG](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

### pnpm v12.18.0 · v11.28.11

Node.js 패키지 매니저입니다.

**무엇이 바뀌었나** — 변경 이력상 12.18.0의 중심은 패키지를 플랫폼별 변형(variants)과 함께 게시하고 설치하는 기능입니다. 여러 머신에서 올린 변형을 한 버전으로 묶어 게시하고, 변형만 있는 버전도 설치할 수 있습니다. `supportedArchitectures`가 플랫폼 태그로 읽히고, `pack --json`에 아카이브별 무결성 값과 크기가 출력됩니다. 정의되지 않은 필수 peer 제공자에 대한 경고가 추가됐고, 상대 경로 `file:` peer·루트 override·catalog 경로 해석 버그가 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. 11.x 라인은 11.28.11로 올리는 패치이니, 12로 넘어가는 경우에만 공식 마이그레이션 안내를 따로 확인하세요.

릴리스 공지: 없음

### Electron v45.2.3 · v44.10.2 · v43.8.7

웹 기술로 데스크톱 앱을 만드는 플랫폼입니다.

**무엇이 바뀌었나** — 45.x는 2.0부터 2.3까지 패치가 이어졌고, 최신 45.2.3은 angle·chromium·dawn·ffmpeg·pdfium·skia·v8에서 120개 변경을 가져왔습니다. 앱 코드에 영향을 주는 수정으로는 `removeInsertedCSS()`가 사용자 출처 스타일시트까지 지우던 문제가 있습니다. 44.x와 43.x에도 같은 계열의 Chromium 패치가 이어졌습니다. 문서에서는 deprecated된 BrowserView API의 Experimental 표기가 빠졌습니다.

**업그레이드할 때 확인할 점** — Chromium 패치가 대량으로 들어가므로 올린 뒤 렌더링과 PDF 보기를 확인하세요. API 변경 공지는 읽지 못했습니다.

릴리스 공지: 없음

### Oxfmt v0.76.0 · v0.77.0

JS/TS 포매터입니다.

**무엇이 바뀌었나** — 0.77.0 변경 이력에는 `parser:vue` 파일을 새 HTML 계열 포매터로 처리하도록 바꾼 항목이 `!`(호환성 깨짐 표시)와 함께 있고, Vue 템플릿의 식과 핸들러를 JS로 포맷하는 기능이 들어왔습니다. 그 밖에 임베디드 `doctype` 대소문자 보존, Vite+ 설정 루트 해석 수정이 있습니다.

**업그레이드할 때 확인할 점** — Vue 파일을 포맷한다면 올린 뒤 변경 diff가 생기는지 확인하세요. 0.x 버전이라 마이너 올림에서도 출력이 바뀔 수 있습니다.

릴리스 공지: 없음

### Oxlint v1.91.0 · v1.92.0

JS/TS Linter입니다.

**무엇이 바뀌었나** — 1.91.0은 `react/capitalized-calls`에 `allow`·`allowPattern` 옵션을 추가했고, 1.92.0은 `eslint/no-redeclare`에 `ignoreDeclarationMerge` 옵션을 추가했습니다. 둘 다 기존 규칙에 예외를 주는 옵션입니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/CHANGELOG.md)

### Next.js v16.4.5 · v16.4.4 · v15.5.29

서버 렌더링 React 프레임워크입니다.

**무엇이 바뀌었나** — 16.4.5는 엣지 응답에서 내부 미들웨어 쿠키 헤더를 제거하고, 프록시로 전달한 fetch 응답의 압축 프레임 문제를 고쳤습니다. 요청이 보낸 placeholder 파라미터로 공유 셸이 오염되는 문제, `'use cache'`에 바이너리 인자를 쓸 때 캐시 키 문제, 루트 파라미터가 다를 때 캐시가 재사용되는 문제도 수정했습니다. `next/image`는 AVIF/HEIC를 잘못 판별하던 문제가 고쳐졌습니다. 16.4.4는 `jsonwebtoken` 대신 `fast-jwt`를 쓰도록 바꿨습니다. 15.5.29는 같은 수정 중 쿠키 헤더·fetch 프레임·이미지 판별을 가져왔습니다.

**업그레이드할 때 확인할 점** — 캐시나 미들웨어를 쓰는 앱은 가급적 올리는 것이 좋습니다. 변경 이력만 읽어 CVE 번호는 확인하지 못했습니다.

릴리스 공지: 없음

### Nx 24.0.5 (패치 3개)

모노레포 빌드 시스템입니다.

**무엇이 바뀌었나** — 24.0.3~24.0.5에서 보안 하드닝 성격의 수정이 많았습니다. 그래프 서버를 같은 출처의 로컬 요청에만 응답하게 하고, Nx Cloud 자격 증명과 태스크 인자가 분석 데이터·URL에 들어가지 않게 했으며, `nx import`의 git 처리와 `nx release`에서 git·커밋 입력을 데이터로만 다루도록 강화했습니다. 캐시 복원이 태스크 출력 안에만 머물게 하고, 연속 태스크가 0이 아닌 코드로 끝나면 실행을 실패시키며, `nx migrate`가 받은 메타데이터를 검증합니다.

**업그레이드할 때 확인할 점** — 연속 태스크(예: 서버 실행)의 비정상 종료가 이제 실행 실패로 잡히므로 CI를 확인하세요.

릴리스 공지: 없음

### Homebrew 7.0.12

macOS 패키지 매니저입니다.

**무엇이 바뀌었나** — `brew info`가 의존성 없이도 빠진 라이브러리를 보여 주고 최신 런타임 의존성을 먼저 확인하게 바뀌었습니다. 속도 제한에 걸린 attestation(출처 증명) 조회를 재시도하지 않고, 변경 없는 생성 파일을 오류로 보고하지 않습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: 없음

### 🔺 메이저 Omarchy v4.5.0

Arch Linux에 Hyprland 설정을 입힌 배포용 구성입니다. 이번 정리의 기준 버전(v3.8.0)보다 메이저 숫자가 커서 표시했습니다.

**무엇이 바뀌었나** — 설치 메뉴에 Notion이 추가되고, 에이전트·지문 인식 설정 안내가 첫 업데이트 뒤가 아니라 온라인이 된 뒤에 나옵니다. 클립보드 패널과 이모지 선택기의 빈 결과·긴 메시지 표시가 고쳐졌고, 업데이트가 교체한 Hyprland가 새 설정을 다시 읽지 못하던 문제가 수정됐습니다. 2017년형 iMac 5K 지원이 추가됐습니다.

**업그레이드할 때 확인할 점** — 마이그레이션이 실행되므로 업데이트 전에 설정을 백업해 두세요.

릴리스 공지: 없음

### Vite v8.3.6

프론트엔드 빌드 도구입니다.

**무엇이 바뀌었나** — 플러그인 컨테이너 종료가 겹쳐 호출될 때의 처리, 쿼리가 붙은 동적 import의 CSS 의존성 수집, 청크 import map 해시의 안정성을 고쳤습니다. 실험적 bundled-dev 모드에서는 Node 내장 모듈의 named import를 허용하고, 엔트리를 다시 실행하지 못할 때 리로드합니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

### Angular 22.2.5 · 21.2.26 · 20.3.35

JavaScript 프레임워크입니다.

**무엇이 바뀌었나** — 22.2.5는 `rxResource`에 `debugName` 옵션을 추가하고, img/video의 `src`가 null이면 속성을 제거하며, 주석 표시 문자를 이스케이프합니다. forms는 호환 필드에서 required 검증을 반영하고 `FormValueControl`의 `updateOn` blur·submit을 지원합니다. router는 navigation extras의 `focusReset`을 읽습니다. 21.x와 20.x는 다운그레이드된 컴포넌트의 템플릿 내용만 컴파일하는 수정 하나입니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md)

### Hono v4.13.16 (패치 2개)

엣지 환경용 웹 프레임워크입니다.

**무엇이 바뀌었나** — JWT 서명 구간이 base64url 문자 범위를 벗어나거나 헤더에 `crit`가 있으면 거부합니다. 비공개 보안 권고에서 병합된 수정으로 보이는 항목이 여럿 있으며, `mount`가 전달 경로를 만드는 방식, RegExpRouter의 줄바꿈 처리와 와일드카드 미들웨어 범위, CSS 헬퍼의 닫는 태그 이스케이프가 바뀌었습니다.

**업그레이드할 때 확인할 점** — 권고 번호는 읽지 못했습니다. JWT 미들웨어나 `mount`, 와일드카드 라우트를 쓴다면 가급적 올리는 것이 좋습니다.

릴리스 공지: 없음

### Istio 1.31.4 · 1.30.8

서비스 메시입니다.

**무엇이 바뀌었나** — 1.31.4는 잘못된 형식의 디버그 리소스 이름 때문에 istiod가 죽던 문제, ambient 인증 정책의 nil to/from 항목 때문에 istiod가 죽던 문제를 고쳤습니다. 인증 정책의 authority와 Host 헤더 매칭을 대소문자 구분 없이 바꾸고, xDS 프록시 cluster ID를 인증된 클러스터에 묶었으며, HBONE 내부 리스너의 소스 IP 매칭을 고쳤습니다. 1.30.8은 같은 계열의 백포트 릴리스로 보이지만 항목별 확인은 하지 못했습니다.

**업그레이드할 때 확인할 점** — 인증 정책에서 Host 매칭이 대소문자 구분 없이 바뀌므로 정책 의도와 맞는지 확인하세요.

릴리스 공지: 없음

### Nuxt v4.6.4

서버 렌더링 Vue.js 프레임워크입니다.

**무엇이 바뀌었나** — 개발 서버가 예상치 못한 Host 헤더를 거부하고 `devServer.allowedHosts` 설정이 생겼습니다. `x-forwarded-proto`는 허용하도록 설정한 경우에만 신뢰하고, 신뢰할 수 없는 오류의 세부 정보를 노출하지 않습니다. 대소문자를 구분하지 않는 라우트 규칙의 와일드카드 꼬리, 인코딩된 슬래시 경로, 섬(island) 해시 인코딩이 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 개발 서버를 별도 도메인이나 터널로 열어 쓴다면 `devServer.allowedHosts`를 설정해야 할 수 있습니다.

릴리스 공지: 없음

### Rspack v2.3.1

Rust 기반 웹 번들러입니다.

**무엇이 바뀌었나** — Module Federation 런타임의 비동기 시작 핸들러, HMR 청크 버전 검증, CSS 런타임에 공유 초기 청크 포함, source map에서 매핑되지 않은 소스 내용을 `null`로 보존하는 문제를 고쳤습니다. `split-chunks`는 타입·레이어 필터를 네이티브 경로에 유지해 성능이 개선됐습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: 없음

### Visual Studio Code 1.145.0 · 1.145.1 · 1.145.2

에디터입니다.

**무엇이 바뀌었나** — 1.145.2의 변경 이력은 에이전트 호스트(파일 승인 범위, 엔진 스냅샷, 로그인 전 에이전트 창 시작)와 채팅 성능, 검색에서 서러게이트 페어를 쪼개던 문제에 집중돼 있습니다. 1.145.0 본문 기능 목록은 읽지 못했습니다.

**업그레이드할 때 확인할 점** — 자동 업데이트를 쓰면 별도 조치는 필요 없습니다.

릴리스 공지: 없음

### Vitest v5.1.0

Vite 기반 유닛 테스트 프레임워크입니다.

**무엇이 바뀌었나** — 실패한 스냅샷을 대화형으로 검토하며 갱신하는 기능이 들어왔습니다. 실험 기능으로 `vi.waitFor`와 `vi.waitUntil`의 `message` 옵션, Node 테스트의 트레이스 타임라인이 추가됐습니다. 프로젝트 경로에서 `rootDir`가 보존되고, 브라우저 모드는 테스터가 연결하지 못하면 실행을 실패시킵니다.

**업그레이드할 때 확인할 점** — 브라우저 모드가 조용히 넘어가던 연결 실패를 이제 실패로 처리하니 CI를 확인하세요.

릴리스 공지: 없음

### Argo CD v3.6.0 · v3.6.1 · v3.5.7 · v3.4.13 · v3.3.19

Kubernetes 배포 도구입니다.

**무엇이 바뀌었나** — 3.6.1은 서버 측 diff 적용이 실패할 때 컨트롤러가 패닉하던 문제, Rollout에 status가 없을 때 액션 목록이 비던 문제, `--rootpath/--basehref`가 동작하지 않던 UI 문제를 고쳤습니다. CronJob의 마지막 예약·성공 시각이 요약 패널에 표시됩니다. 3.5.7·3.4.13·3.3.19는 같은 날 나온 이전 라인 패치로 내용은 읽지 못했습니다.

**업그레이드할 때 확인할 점** — 3.6.0 마이그레이션 안내는 읽지 못했으니 3.5에서 올린다면 공식 업그레이드 문서를 확인하세요.

릴리스 공지: 없음

### Bazel 9.3.2

빌드 도구입니다.

**무엇이 바뀌었나** — linux-sandbox 액션이 중간에 종료되던 문제를 고쳤고, 원격 실행 액션 salt에서 원격 엔드포인트·인스턴스 플래그를 뺐으며, Java 규칙의 서버 JAR 재압축을 되살렸습니다.

**업그레이드할 때 확인할 점** — 원격 실행 salt가 바뀌어 첫 빌드에서 캐시가 한 번 새로 채워질 수 있습니다.

릴리스 공지: [CHANGELOG](https://github.com/bazelbuild/bazel/blob/9.3.2/CHANGELOG.md)

### Biome v2.6.5 · v2.6.6

프론트엔드 툴체인입니다.

**무엇이 바뀌었나** — 두 릴리스 모두 nursery(실험 단계) 린트 규칙을 대거 추가했습니다. 2.6.5는 배열 `forEach` 사용이나 `Promise.all` 안의 `await` 같은 패턴을 잡는 규칙 등을, 2.6.6은 `noArrayMethodsOnArguments`, `noConstantComparisons`, `noErasingOperation`, `noNegatedArrayPredicate`, `noNumberArgumentOutOfRange`, `noSharedBranchCode` 등을 추가했습니다.

**업그레이드할 때 확인할 점** — nursery 규칙은 직접 켜지 않으면 동작하지 않으므로 그대로 올려도 됩니다.

릴리스 공지: [CHANGELOG](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md)

### Gradle 9.9.0

Java 빌드 도구입니다.

**무엇이 바뀌었나** — Kotlin DSL 스크립트가 Kotlin Build Tools API로 컴파일돼 `buildSrc`나 included build를 바꾼 뒤 재컴파일이 큰 멀티 프로젝트 빌드에서 최대 65% 빨라졌습니다. `--tests` 필터가 ArchUnit 규칙 같은 메서드가 아닌 JUnit Platform 테스트에도 적용되고, wrapper 태스크는 사용자가 바꾼 속성을 업그레이드 뒤에도 유지합니다. Problems API가 문제를 영역별로 묶고, Windows Terminal 작업표시줄에 빌드 진행률이 표시됩니다. 사용자 매뉴얼이 Markdown으로 제공되고 빌드 보안 장이 추가됐습니다.

**업그레이드할 때 확인할 점** — 9.x 업그레이드 가이드의 deprecation과 breaking change 항목을 확인하세요. 호환 JDK·Groovy 범위는 공식 호환성 문서를 보세요.

릴리스 공지: [릴리스 노트](https://github.com/gradle/gradle/blob/v9.9.0/platforms/documentation/docs/src/docs/release/notes.md)

### Lima v2.3.0

리눅스 가상 머신을 쉽게 띄우는 도구입니다.

**무엇이 바뀌었나** — WSL2 네이티브 마운트를 경로 변환과 부팅 시 bind mount로 지원합니다. sudoers 항목이 합쳐진 인자로 만족되던 문제를 막았고, QEMU를 현재 디렉토리가 아니라 인스턴스 디렉토리에서 실행하며, 기존 인스턴스의 VM 유형을 바꾸면 경고합니다. 겹치는 마운트는 지원하지 않는다는 점이 문서에 명시됐습니다.

**업그레이드할 때 확인할 점** — 겹치는 마운트를 쓰고 있다면 점검하세요.

릴리스 공지: 없음

### ollama v0.40.15 (패치 2개)

로컬에서 오픈 모델을 실행하는 도구입니다.

**무엇이 바뀌었나** — `ollama launch`에 Kimi Code CLI 지원이 추가됐고 Claude Desktop 모델 선택기에 게이트웨이 모델 이름이 표시됩니다. MLX 러너는 Qwen3 계열 YaRN 스케일링을 지원하고 지원하지 않는 CUDA 장치를 거부합니다. llama-server는 순환 구조·비전 모델의 병렬 요청을 허용합니다. 클라우드 웹 검색 응답 디코딩과 OpenAI 호환 API가 모델 기본 샘플러 값을 덮어쓰던 문제가 수정됐습니다.

**업그레이드할 때 확인할 점** — OpenAI 호환 API로 샘플링 파라미터를 지정하지 않았다면 이제 모델 기본값이 쓰입니다.

릴리스 공지: 없음

### React Native Skia v3.9.1 · v3.9.0

React Native용 2D 그래픽 라이브러리입니다.

**무엇이 바뀌었나** — 3.9.1은 iOS에서 뷰의 네이티브 뷰가 상위 뷰 밖으로 새지 않도록 하고, 앱이 백그라운드일 때 GPU 작업을 멈추며, vsync마다 기록 하나만 표시하도록 고쳤습니다. Android는 메인 스레드 작업 전달에서 Java 호출을 줄였고, Imagination GPU에서 TransientAttachments를 요청하지 않습니다. 3.9.0 변경은 읽지 못했습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: 없음

### Rolldown v1.3.0

Rust 기반 JS/TS 번들러입니다.

**무엇이 바뀌었나** — CLI가 `--input`과 위치 인자 엔트리를 함께 쓰면 Rollup처럼 거부합니다. 플러그인 훅(`resolveId`, `load`, `transform` 등)에 import attributes를 전달하는 실험 기능이 들어왔고 `notify` API가 노출됩니다. `NO_COLOR` 존중, 출력 디렉토리 심볼릭 링크를 따르지 않는 `output.cleanDir`, 트리 셰이킹 수정이 포함됩니다.

**업그레이드할 때 확인할 점** — 스크립트가 `--input`과 엔트리 인자를 같이 넘기고 있지 않은지 확인하세요.

릴리스 공지: [CHANGELOG](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md)

### Rstest v0.12.6

Rspack 기반 테스트 프레임워크입니다.

**무엇이 바뀌었나** — `sequence.setupFiles` 옵션과 병렬 라이프사이클 훅을 지원하고, `passWithNoTests` 출력을 간결하게 했으며, 테스트 파일 스케줄링에 모듈 로딩 시간을 포함하고, V8 커버리지의 CJS 래퍼 오프셋을 보정했습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: 없음

### Storybook v10.6.6

UI 컴포넌트 개발 도구입니다.

**무엇이 바뀌었나** — StackBlitz가 dev 서버를 다시 embed할 수 있게 고쳤고, 텔레메트리에 VRT 패키지를 추가했습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md)

### Tailwind CSS v4.3.5 · v4.3.4

CSS 프레임워크입니다.

**무엇이 바뀌었나** — 4.3.4는 Next.js용 Turbopack 로더 `@tailwindcss/turbopack`을 추가하고, `@scope` variant가 유틸리티를 감싸도록 고쳤으며, Vite `bundledDev`에서 편집 때마다 죽던 문제와 네이티브 바인딩이 없는 플랫폼에서 WASM으로 폴백하는 문제를 고쳤습니다. 4.3.5는 많은 variant 값에서 canonicalization 성능을 개선하고, 보간 방식이 없는 `color-mix()` 크래시를 고쳤습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/tailwindlabs/tailwindcss/blob/main/CHANGELOG.md)

## 마무리

변경점을 읽지 못해 본문에서 뺀 릴리스 3건(생략)은 Zed v1.27.0, vLLM v0.33.0, Obsidian v1.15.0입니다. 모두 새 정식 버전이 확인됐지만 읽을 수 있는 변경 설명이 없었습니다.

확인 실패 14개는 호스트가 세션 네트워크에서 막혀 읽지 못한 공식 사이트 기반 소스입니다. TypeScript(devblogs.microsoft.com), Expo SDK, GraalVM, JDK, Android, Boundary, Cursor, GitButler, Manus, Swift, Ubuntu, Xcode, PyTorch 블로그, Go 릴리스 페이지입니다.

확인 방식: npm/PyPI/git 태그 기반 (GitHub 릴리스 본문 미접근)
