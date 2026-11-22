---
layout: post
title: 이번 주 패키지 릴리스 정리 — 2026-11-23
date: 2026-11-23
published: 2026-11-23
category: 주간 릴리스
tags: []
comments: true
thumbnail: './assets/23/thumbnail.png'
github: ''
---

## ✍️ 한 줄 요약

Gradle·Valkey·pnpm·Argo CD가 한 주에 보안 수정을 내보냈고(Gradle은 High 등급 4건, Valkey는 모든 유지보수 라인에 CVE-2026-130822), pnpm 12.23.0은 플랫폼 variants 기능을 없애는 breaking change(기존 코드를 고쳐야 하는 변경)를 담았습니다.

## 이번 주 한눈에 보기

기간은 2026-11-16 ~ 2026-11-23(KST)입니다. 직전 글(2026-11-16)에서 이미 다룬 버전은 다시 넣지 않았습니다. 추적 중인 87개 패키지 가운데 30개의 새 변경점을 확인했습니다.

이번 주도 GitHub 릴리스 페이지를 읽을 수 없어, CHANGELOG나 저장소 안 릴리스 노트가 있는 패키지는 그 파일을 읽었습니다. Zed, Electron, Oxfmt, Nx, Homebrew, Hono, Rspack, Turborepo, Vitest, Argo CD, ollama, React Native Skia, Spring AI, Spring Modulith는 읽을 수 있는 릴리스 노트가 없어 새 태그까지의 변경 이력(커밋 제목)을 읽고 정리했습니다. 이 패키지들은 `릴리스 공지`를 `없음`으로 표시했고, 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. Nuxt UI 4.13.0과 Bazel 8.9.0도 같은 방식으로 읽었습니다.

| 패키지 | 버전 | 릴리스 공지 | 변경점 |
|---|---|---|---|
| astro | 7.4.13 | [있음](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) | 서버 번들 크기·i18n fallback·폰트 preload 버그 수정 |
| ClickHouse | v26.8.44.3-lts (패치 7개) · v26.3.69.4-lts (패치 5개) | [있음](https://github.com/ClickHouse/ClickHouse/tree/master/docs/changelogs) | LTS 라인 백포트: 권한 필터 우회·크래시·`DROP TABLE` 멈춤 수정 |
| Zed | v1.29.3 (패치 3개) | 없음 | Linux Snap 패키지 추가, 프롬프트 캐싱 유지 수정 |
| pnpm | 12.23.0 · 12.22.0 · 11.29.0 · 11.28.13 | [있음](https://github.com/pnpm/pnpm/blob/v12.23.0/.changeset/changelogs/pacquet%4012.23.0.md) | 보안 수정 다수, 플랫폼 variants 제거, `pnpm edit`·`catalog migrate` 추가 |
| 🔺 메이저 Electron | 45.4.1 · 45.3.4 · 44.11.5 (패치 2개) · 43.8.12 (패치 2개) | 없음 | Chromium 계열 수정 대량 반영, 프록시·webRequest 버그 수정 |
| Oxfmt | 0.79.0 | 없음 | 괄호로 감싼 TypeScript 인스턴스화 식 포맷 수정 |
| Oxlint | 1.94.0 | [있음](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/CHANGELOG.md) | `no-misused-promises`에 `flagUnions` 옵션, `typeCheck` 실험 딱지 제거 |
| Nuxt UI | 4.13.0 · 4.12.2 (패치 2개) | [있음](https://github.com/nuxt/ui/blob/v4/CHANGELOG.md) | `Toggle`·`ToggleGroup`·`ChatAttachment` 컴포넌트, `useToast().promise` 추가 |
| Nx | 23.3.3 | 없음 | pnpm-workspace.yaml overrides를 affected 계산에 반영 |
| FastAPI | 0.165.0 · 0.164.0 · 0.163.2 | [있음](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md) | 요청 본문 크기·폼 파싱 한도 설정 추가 |
| Homebrew | 7.0.15 (패치 2개) | 없음 | 설치 계획에 bottle 크기·소스 빌드 표시, `brew uses` 속도 개선 |
| Angular | 22.3.0 · 22.2.7 | [있음](https://github.com/angular/angular/blob/main/CHANGELOG.md) | `HttpClient.query()`, 라우트 에러 경계, View Transitions 안정화 |
| Hono | 4.13.20 (패치 2개) | 없음 | JWT `typ` 검증 옵션, 쿠키·압축·JSX 버그 수정 |
| React Router | 8.5.2 · 7.18.6 | [있음](https://github.com/remix-run/react-router/blob/main/packages/react-router/CHANGELOG.md) | 스트리밍 `<Suspense>` 하이드레이션, `HEAD` 응답 누수, `redirect()` 수정 |
| Rspack | 2.3.3 | 없음 | 캐시 무효화·트리 셰이킹 수정, HMR·stats 성능 개선 |
| Turborepo | 2.11.13 (패치 2개) | 없음 | 실험적 `turbo trace`, pnpm v13 lockfile 지원 |
| Vitest | 5.1.1 | 없음 | 워커 풀·커버리지·재시도 관련 버그 수정 다수 |
| Argo CD | v3.6.2 · v3.5.8 · v3.4.14 | 없음 | CVE-2026-77299(regexp2 의존성) 대응, AppProject deny 규칙 수정 |
| 🔺 메이저 Bazel | 9.3.3 · 8.9.0 · 7.7.3 | [있음](https://github.com/bazelbuild/bazel/blob/9.3.3/CHANGELOG.md) | 내장 JDK 갱신, 8.9.0은 원격 캐시 개선·`repository_ctx.patch(directory)` |
| Flutter | 3.50.1 | [있음](https://github.com/flutter/flutter/blob/3.50.1/CHANGELOG.md) | 3.50.0의 Android 빌드·에셋 누락·웹 문제 핫픽스 |
| Gradle | 9.9.2 · 8.14.8 | [있음](https://github.com/gradle/gradle/blob/v9.9.2/platforms/documentation/docs/src/docs/release/notes.md) | High 등급 보안 취약점 4건 수정 |
| ollama | v0.40.17 | 없음 | MLX 러너 동시 생성·메모리 기반 병렬 수 결정 |
| Optique | 1.4.0 · 1.3.7 · 1.2.14 · 1.1.14 · 1.0.16 | [있음](https://github.com/dahlia/optique/blob/main/CHANGES.md) | `-n5` 같은 붙여 쓴 값, 도움말에 별칭·환경변수 표시 |
| React Native Skia | v3.11.0 | 없음 | macOS 최소 지원 14.0으로 상향, Android 바이너리 다운로드 방식 변경 |
| Rolldown | 1.3.3 | [있음](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md) | 플러그인 실행 시간 표, 청크 순서·inline-const 버그 수정 |
| Spring AI | v2.1.0 · v2.0.3 | 없음 | 벡터 스토어 필터 값 이스케이프 강화, 최신 MCP 클라이언트 연결 지원 |
| Spring Modulith | 2.2.0 · 2.1.3 · 2.0.10 | 없음 | 이벤트 발행 완료 처리 기본값 변경(2.2.0), Spring Boot 4.2.0 대응 |
| Storybook | 10.6.8 | [있음](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md) | 스토리 프리로드 성능 개선 |
| Upyo | 0.6.1 · 0.5.7 | [있음](https://github.com/dahlia/upyo/blob/main/CHANGES.md) | 쉼표가 든 표시 이름이 여러 수신자로 읽히던 문제 수정 |
| Valkey | 9.2.0 · 9.1.4 · 9.0.8 · 8.1.12 · 8.0.13 · 7.2.16 | [있음](https://github.com/valkey-io/valkey/blob/9.2.0/00-RELEASENOTES) | 9.2 첫 안정판, 전 라인 CVE-2026-130822 수정 |

## 패키지별 변경 내용

### astro 7.4.13

JavaScript 웹 프레임워크입니다.

**무엇이 바뀌었나** — 서버에서 `render()`를 호출하는 라우트가 없는데도 콘텐츠 컬렉션의 모든 항목이 서버 번들에 들어가던 문제가 고쳐졌습니다. `i18n.fallback`이 `i18nNoLocaleFoundInPath` 오류로 실패하던 경우, `<Font preload>`가 가변 폰트 안의 굵기 범위(`"400 700"`)를 요청했을 때 preload 링크를 내보내지 않던 문제, 희소 배열(중간이 빈 배열)을 props로 받은 프레임워크 컴포넌트의 하이드레이션도 수정됐습니다. `fonts`를 설정하지 않은 프로젝트는 모든 `astro` 명령의 시작 시간이 줄었습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

### ClickHouse v26.8.44.3-lts · v26.3.69.4-lts

컬럼형 데이터베이스입니다.

**무엇이 바뀌었나** — LTS(장기 지원) 두 라인에 백포트 패치가 거의 매일 나왔습니다. 26.8 라인(v26.8.42.13)에서는 `GRANT WRITE ON S3('https://bucket/allowed/.*')`처럼 경로를 제한한 권한이 `.`·`..`가 든 경로로 필터 밖 위치까지 허용하던 문제, `ALTER UPDATE` 등으로 프로젝션을 다시 만든 뒤 경량 `DELETE`로 지운 행이 다시 조회되던 문제, 상수 키로 `COMPLEX_KEY_DIRECT` 딕셔너리에 `JOIN`할 때의 서버 크래시가 고쳐졌습니다. 26.3 라인(v26.3.69.4)에서는 materialized CTE를 쓴 쿼리가 실패한 뒤 `DROP TABLE`이 서버 재시작 전까지 멈추던 문제와 메모리 한도로 할당이 실패했을 때의 double free 크래시가 수정됐습니다. 12개 패치 가운데 3개의 변경 기록만 읽고 정리한 내용입니다.

**업그레이드할 때 확인할 점** — S3·URL 소스에 경로 필터가 걸린 권한을 쓰고 있다면 26.8 라인 최신 패치로 올리는 것을 권합니다. 나머지는 버그 수정이라 같은 LTS 라인 안에서 그대로 올릴 수 있습니다.

릴리스 공지: [docs/changelogs](https://github.com/ClickHouse/ClickHouse/tree/master/docs/changelogs)

### Zed v1.29.3

코드 에디터입니다.

**무엇이 바뀌었나** — 1.29 안정 채널의 패치 릴리스들입니다. Linux용 공식 Snap 패키지가 추가됐고, OpenAI Responses API를 쓸 때 프롬프트 캐싱이 유지되지 않던 문제와 대화 도중 바뀐 시스템 프롬프트가 반영되지 않던 문제가 고쳐졌습니다. 검색 결과가 없을 때 텍스트 찾기 표시가 지워지지 않던 문제, 분할 diff가 있는 프로젝트를 새 창으로 옮긴 뒤의 크래시도 수정됐습니다. 1.29.0 자체의 새 기능은 변경 이력으로는 정리할 수 없어 여기에 넣지 않았습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. 설치 프로그램의 약관 안내 문구가 바뀌었다는 커밋이 있으니 조직 정책상 약관 검토가 필요하면 확인하세요.

릴리스 공지: 없음

### pnpm 12.23.0 · 12.22.0 · 11.29.0 · 11.28.13

Node.js 패키지 매니저입니다.

**무엇이 바뀌었나** — 네 버전 모두 보안 수정을 담았습니다. `otp`(2단계 인증 일회용 코드)를 더 이상 설정 파일에서 읽지 않습니다. 저장소가 `otp: ${NPM_TOKEN}`을 자체 `registry:`와 함께 적어 두면 `pnpm publish`가 그 환경 변수를 해당 레지스트리로 보내 비밀 값이 새어 나갈 수 있었기 때문입니다. 레지스트리 패키지가 `file:`·`link:` 같은 로컬 경로 의존성을 선언하면 `ERR_PNPM_LOCAL_SUBDEP_NOT_ALLOWED`로 거부하고, 레지스트리 자격 증명은 HTTPS나 루프백 HTTP로만 보내며, `pnpm dlx`·`pnpm create`와 전역 명령(`-g`)은 현재 디렉토리의 `.pnpmfile.cjs`·`.npmrc` 설정을 읽지 않습니다. 12.22.0과 11.28.13은 레지스트리를 바꾼 뒤 `pnpm install`이 `minimumReleaseAge`·`trustPolicy` 검사를 건너뛸 수 있던 문제를 고쳤습니다.

새 기능으로 12.23.0은 설치된 패키지를 편집기로 여는 `pnpm edit`, 의존성 버전을 카탈로그로 옮기는 `pnpm catalog migrate`, `pnpm link --hard`, `pnpm update --tag`, `pnpm publish --new-version`을 추가했습니다. 12.22.0은 전역 패키지에만 적용되는 `globalPackagesConfig` 설정과 `pnpm why --ranges`를 추가했고, 11.29.0은 TTY가 없는 환경(Docker 빌드 등)에서도 호환되지 않는 `node_modules`를 다시 만들 수 있게 했습니다.

**업그레이드할 때 확인할 점** — 12.23.0은 플랫폼 variants를 없앴습니다. `publishConfig.variants`와 `pnpm pack --variant`, `pnpm publish`의 variant 관련 옵션이 사라졌으니, 플랫폼별 빌드는 각각 별도 패키지로 내고 `optionalDependencies`에 나열해야 합니다. variants가 기록된 lockfile의 frozen 설치는 `ERR_PNPM_BROKEN_LOCKFILE`로 실패하므로 `pnpm install`로 다시 해석해야 합니다. 또 private이 아닌 패키지가 private 워크스페이스 패키지를 `dependencies`에 두면 `pnpm pack`·`pnpm publish`가 실패합니다. 설정 파일에 `otp`를 적어 둔 CI는 `--otp`나 `PNPM_CONFIG_OTP`로 바꾸세요.

릴리스 공지: [12.23.0](https://github.com/pnpm/pnpm/blob/v12.23.0/.changeset/changelogs/pacquet%4012.23.0.md) · [12.22.0](https://github.com/pnpm/pnpm/blob/v12.22.0/.changeset/changelogs/pacquet%4012.22.0.md) · [11.29.0](https://github.com/pnpm/pnpm/blob/v11.29.0/.changeset/changelogs/pnpm%4011.29.0.md) · [11.28.13](https://github.com/pnpm/pnpm/blob/v11.28.13/.changeset/changelogs/pnpm%4011.28.13.md)

### 🔺 Electron 45.4.1 · 45.3.4 · 44.11.5 · 43.8.12

데스크톱 앱 플랫폼입니다. 기준 버전(v44)보다 메이저가 오른 45 라인이 계속 갱신되고 있습니다.

**무엇이 바뀌었나** — 세 라인 모두 Chromium·V8·ANGLE·ffmpeg 등에서 가져온 수정을 80~100건 가까이 한꺼번에 반영했습니다. 커밋 제목에는 건수만 있어 각 수정의 내용과 보안 관련 여부, CVE 번호는 확인하지 못했습니다. 45·44 라인에서는 네트워크 서비스가 다시 시작돼도 `ses.setProxy()` 설정이 유지되고, 리다이렉트에서도 webRequest의 헤더 제거가 적용되며, Windows에서 탐색기가 재시작된 뒤 트레이 툴팁이 복구됩니다. 45 라인에는 `Extension`에 `dynamicId`가 추가됐고 `webContents.centerSelection()`이 Windows·Linux에서 동작합니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. Chromium 계열 수정이 대량으로 들어갔으니 쓰는 라인의 최신 패치로 올리는 것을 권합니다.

릴리스 공지: 없음

### Oxfmt 0.79.0

JS/TS 포매터입니다.

**무엇이 바뀌었나** — 괄호로 감싼 `TSInstantiationExpression`(제네릭 인자만 붙인 `fn<string>` 형태의 TypeScript 식)을 포맷할 때의 문제가 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### Oxlint 1.94.0

JS/TS 린터입니다.

**무엇이 바뀌었나** — `typescript/no-misused-promises` 규칙에 `flagUnions` 옵션이 추가됐습니다. 문서에서 `typeCheck`(타입 정보를 쓰는 린트)의 실험적 표시가 제거됐습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/CHANGELOG.md)

### Nuxt UI 4.13.0 · 4.12.2

Nuxt·Vue용 UI 라이브러리입니다.

**무엇이 바뀌었나** — 4.13.0에는 `Toggle`·`ToggleGroup`과 `ChatAttachment` 컴포넌트가 새로 들어왔습니다. `useToast`에 `promise` 메서드가, `ChatPrompt`에 `v-model:queue`가, 모듈에 `@nuxt/ui/eslint` 설정이 추가됐고 세르비아어 로케일이 생겼습니다. 테마 계산 결과를 컴포넌트끼리 공유하고 파일이 바뀔 때마다 템플릿을 다시 컴파일하지 않도록 하는 성능 개선과, `Table`·`Calendar`·`SelectMenu`의 접근성·포커스 버그 수정도 포함됩니다. 4.12.1·4.12.2는 템플릿 문자열로 컴파일된 컴포넌트 처리와 `ContentSearch` 결과 텍스트가 두 번 이스케이프되던 문제를 고친 패치입니다.

**업그레이드할 때 확인할 점** — 4.12.2 이후 릴리스는 CHANGELOG에 실리지 않아 4.13.0은 변경 이력(커밋 제목)으로 정리했고, breaking change 여부는 확인하지 못했습니다. `compare` 유틸이 `null`을 `null`하고만 같다고 보도록 바뀌었으니 선택 컴포넌트에서 `null`·`undefined`를 섞어 쓰는 곳이 있으면 확인하세요.

릴리스 공지: [CHANGELOG](https://github.com/nuxt/ui/blob/v4/CHANGELOG.md)

### Nx 23.3.3

모노레포 빌드 시스템입니다.

**무엇이 바뀌었나** — affected(변경 영향 범위) 계산이 `pnpm-workspace.yaml`의 overrides를 읽도록 고쳐졌고, Angular 플러그인이 architect의 node host를 공개된 하위 경로로 불러오도록 수정됐습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### FastAPI 0.165.0 · 0.164.0 · 0.163.2

Python 웹 프레임워크입니다.

**무엇이 바뀌었나** — 0.164.0은 요청 본문 크기 한도를, 0.165.0은 폼 파싱 한도를 설정할 수 있게 했습니다. 지나치게 큰 요청이나 폼으로 서버 자원이 소모되는 것을 프레임워크 수준에서 막을 수 있습니다. 0.163.2는 쿼리·헤더·폼 파라미터 추출 코드를 리팩터링한 릴리스입니다.

**업그레이드할 때 확인할 점** — 릴리스 노트에는 한도의 기본값이 적혀 있지 않습니다. 큰 파일 업로드나 필드가 많은 폼을 받는 엔드포인트가 있다면 올린 뒤 동작을 확인하세요.

릴리스 공지: [release-notes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md)

### Homebrew 7.0.15

macOS·Linux 패키지 매니저입니다.

**무엇이 바뀌었나** — `brew install`이 설치 계획에 bottle(미리 빌드된 바이너리) 크기와 소스 빌드 여부를 보여 줍니다. `brew uses`는 불러오는 formula 수를 줄여 빨라졌고, 별칭이나 옛 이름으로 설치한 패키지도 pin이 걸립니다. Sigstore 번들 검증이 번들된 gem 없이 동작하도록 바뀌었고, `brew fetch --all-platforms`가 플랫폼 전용 cask에서 실패하던 문제가 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### Angular 22.3.0 · 22.2.7

JavaScript 프레임워크입니다.

**무엇이 바뀌었나** — 22.3.0은 HTTP QUERY 요청을 보내는 `HttpClient.query()`를 추가했습니다. 라우터에는 라우트 에러 경계와 리다이렉트 처리가 들어왔고, 라우트 리소스가 반응형이 되어 서로 의존하는 리소스를 병렬로 불러오며, `RouterLink`에 `scroll` 입력이, 내비게이션 옵션에 `focusReset`이 추가됐습니다. View Transitions는 안정 기능이 됐습니다. 코어에서는 `@defer` 뷰포트 옵션에 `scrollMargin`이 추가되고 템플릿 식에서 증감 연산자(`++`, `--`)를 쓸 수 있습니다. 컴파일러는 단위가 필요한 숫자형 CSS 속성과 `ng-template`의 알 수 없는 속성 바인딩을 진단합니다. 22.2.7은 하이드레이션 주석·텍스트 노드가 없을 때 TypeError 대신 NG0502·NG0512 오류를 내도록 고친 패치입니다.

**업그레이드할 때 확인할 점** — 22.3.0에는 compiler-cli 수정이 180건 가까이 들어 있고 진단이 늘었습니다. 올린 뒤 빌드에서 새 경고·오류(특히 CSS 단위, `@for`에 반복할 수 없는 값을 넘긴 경우)가 나오는지 확인하세요.

릴리스 공지: [CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md)

### Hono 4.13.20

엣지 환경용 웹 프레임워크입니다.

**무엇이 바뀌었나** — 4.13.19는 JWT 미들웨어에 토큰 헤더의 `typ`을 검증하는 옵션을, secure-headers에 `overwrite` 옵션을 추가했습니다. 4.13.20은 큰따옴표 하나만 있는 값을 쿠키 값으로 받아들이던 문제, `HEAD` 요청에 압축 응답 헤더를 보내지 않던 문제, 비동기 Provider의 값이 서로 섞이던 JSX 문제, `JSONParsed` 타입에서 optional 속성이 유지되지 않던 문제를 고쳤습니다. AWS Lambda 어댑터는 텍스트 본문 앞의 UTF-8 BOM을 지우지 않습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### React Router 8.5.2 · 7.18.6

React 라우팅 라이브러리입니다.

**무엇이 바뀌었나** — 8.5.2는 개발 모드에서 스트리밍된 `<Suspense>` 경계가 하이드레이션 중에 버려지고 클라이언트에서 다시 그려지던 문제를 고쳤습니다. `HEAD` 요청에서 버려지는 응답 본문을 취소해, 파일을 스트리밍하는 리소스 라우트가 파일 디스크립터를 흘리지 않습니다. `redirect()`·`replace()`가 넘겨받은 `ResponseInit`에 `status: 302`를 써 넣던 동작이 사라졌고, `basename`이 설정된 상태에서 검색 파라미터가 있는 루트 폼 액션 제출, `sessionStorage`를 쓸 수 없을 때 `<ScrollRestoration>`이 던지던 오류, `<Activity>`로 숨겼다 보인 뒤 남아 있던 `useBlocker`도 수정됐습니다. 7.18.6은 같은 종류의 하이드레이션·`HEAD` 처리 수정을 7 라인에 반영했습니다.

**업그레이드할 때 확인할 점** — `href()`가 필수 파라미터에 `null`을 받으면 이제 오류를 던집니다(`undefined`와 같은 동작). 같은 init 객체를 `redirect()`에 넘긴 뒤 재사용하면서 302가 들어가는 데 기대던 코드가 있다면 확인하세요.

릴리스 공지: [CHANGELOG](https://github.com/remix-run/react-router/blob/main/packages/react-router/CHANGELOG.md)

### Rspack 2.3.3

웹 번들러입니다.

**무엇이 바뀌었나** — 캐시 쪽 수정이 많습니다. 설정한 빌드 의존성이 바뀌면 캐시를 무효화하고, 로더 설정과 버전을 캐시 키에 포함하며, 모듈을 찾지 못한 해석 결과도 캐시합니다. CommonJS 기본 재내보내기의 트리 셰이킹, 식별자 치환 시 축약 속성 키가 사라지던 문제, CSS에 포함된 소스맵이 `devtool` 설정을 따르지 않던 문제가 고쳐졌고, HMR 청크 해석과 stats 출력 성능이 개선됐습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 전부 확인하지 못했습니다. 다만 `fix!`로 표시된 커밋이 하나 있습니다. HTTP 모듈(URL로 가져오는 모듈)의 lockfile 형식을 webpack과 맞췄다는 내용이니, 이 기능을 쓰고 있다면 lockfile이 다시 만들어지는지 확인하세요.

릴리스 공지: 없음

### Turborepo 2.11.13

JS/TS 빌드 시스템입니다.

**무엇이 바뀌었나** — 실험적 명령 `turbo trace`가 추가됐고 pnpm v13 lockfile을 지원합니다. `turbo setup`은 의존성 설치를 병렬로 실행하며 `--verbose` 옵션이 생겼습니다. 파일 감시가 다시 스캔된 뒤 모든 watch 태스크가 재실행되던 문제, `--no-color`·`NO_COLOR`에서도 태스크 출력에 색이 남던 문제, affected 판정에서 lockfile 변경 범위와 `globalDependencies` 확인 순서가 수정됐습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### Vitest 5.1.1

Vite 기반 유닛 테스트 프레임워크입니다.

**무엇이 바뀌었나** — 타임아웃이 일반 `Error` 대신 전용 오류 클래스로 던져지고, 재시도마다 새 `signal`이 주어집니다. 시작에 실패한 워커를 `isolate: false`에서 재사용하지 않고, 멈춘 forks 워커를 종료하도록 워커 풀이 고쳐졌습니다. `--bail`과 `--shard` 처리, 크래시한 테스트 파일이 JSON 리포터에서 실패로 표시되지 않던 문제, v8 커버리지의 하위 프로세스 처리도 수정됐고, 브라우저 모드에서 캐시된 모듈을 재사용해 실행이 빨라졌습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. 타임아웃 오류를 메시지 문자열로 구분하던 코드가 있다면 동작을 확인하세요.

릴리스 공지: 없음

### Argo CD v3.6.2 · v3.5.8 · v3.4.14

Kubernetes 배포 도구입니다.

**무엇이 바뀌었나** — 세 라인 모두 CVE-2026-77299에 대응해 `dlclark/regexp2` 의존성을 v2.13.0으로 올렸습니다. 커밋 제목에는 번호만 있어 무엇이 위험했는지는 확인하지 못했습니다. AppProject의 destination 거부 규칙(`!name`, `!server`)이 일치하면 확실히 거부하도록 고쳐졌고, 클러스터마다 디코딩된 OpenAPI 문서를 붙잡고 있던 메모리 사용이 줄었습니다. 3.6.2·3.5.8은 ApplicationSet을 새로 고칠 때 전체를 다시 쓰지 않고 refresh 애너테이션만 패치합니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. AppProject에서 거부 규칙을 쓰고 있다면 올린 뒤 의도한 대상이 계속 허용·거부되는지 확인하세요.

릴리스 공지: 없음

### 🔺 Bazel 9.3.3 · 8.9.0 · 7.7.3

빌드 도구입니다. 기준 버전(v8.7.0)보다 메이저가 오른 9 라인이 포함됩니다.

**무엇이 바뀌었나** — 9.3.3은 내장 JDK를 25.0.5.1로, 7.7.3은 21.0.13.1로 올린 릴리스입니다. 8.9.0은 CHANGELOG의 릴리스 노트가 비어 있어 변경 이력으로 읽었습니다. `repository_ctx.patch(directory)`가 추가되고, 원격 캐시 청크 함수로 RepMaxCDC를 고를 수 있으며, `module()`에서 레지스트리 모듈의 버전을 생략하면 추론합니다. 디스크 캐시 항목이 없을 때 캐시 미스로 처리하고, 빌드 취소 시 액션 출력 핸들이 새던 문제와 Windows에서 테스트 출력 끝이 잘리던 문제가 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 9.3.3·7.7.3은 그대로 올려도 되는 릴리스입니다. 8.9.0은 변경 이력만 읽어 breaking change 여부를 확인하지 못했습니다.

릴리스 공지: [CHANGELOG](https://github.com/bazelbuild/bazel/blob/9.3.3/CHANGELOG.md)

### Flutter 3.50.1

네이티브 앱 프레임워크입니다.

**무엇이 바뀌었나** — 3.50.0의 문제를 고친 핫픽스입니다. 플러그인과 사용자 정의 `buildType`을 함께 쓰는 Android 앱의 Gradle 설정 실패, 이름이 점으로 시작하는 에셋(`.env` 등)이나 밑줄 폴더가 APK·AAB에서 조용히 빠져 실행 중 오류가 나던 문제, `--split-per-abi` 빌드에서 모든 분할 APK가 같은 `versionCode`를 갖던 문제가 수정됐습니다. 웹에서는 `--wasm`과 cross-origin isolation을 함께 쓸 때 동적 텍스트 렌더링에서 앱이 멈추던 문제와, `--web-content-hash` 빌드 뒤 일반 빌드를 하면 `build/web/index.html`이 지워지던 문제가 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 3.50.0으로 Android 릴리스를 만들었다면 `.env` 같은 에셋이 빠졌을 수 있으니 3.50.1로 다시 빌드하세요.

릴리스 공지: [CHANGELOG](https://github.com/flutter/flutter/blob/3.50.1/CHANGELOG.md)

### Gradle 9.9.2 · 8.14.8

Java 빌드 도구입니다.

**무엇이 바뀌었나** — 두 버전 모두 보안 취약점 4건을 고쳤습니다. SFTP 저장소가 호스트 키를 검증하지 않던 문제(8.9 High), 전이 스냅샷 의존성이 의존성 검증을 건너뛰던 문제(8.8 High), TestKit이 시스템 임시 디렉토리에 예측 가능한 경로를 쓰던 문제(7.0 High), 데몬 레지스트리가 만들어질 때 잠깐 다른 로컬 사용자에게 읽히던 문제(7.0 High)입니다. 릴리스 노트에는 GitHub 보안 권고 링크만 있고 CVE 번호는 적혀 있지 않습니다. 9.9.2는 9.8.0부터 포함 빌드에서 누락 의존성 검사가 느려진 회귀와, 저장소가 플러그인 마커 jar 요청에 401로 답하면(GitLab 그룹 레지스트리) 플러그인 해석이 실패하던 9.9.0의 문제도 고쳤습니다.

**업그레이드할 때 확인할 점** — SFTP 저장소를 쓰거나 스냅샷 의존성에 의존성 검증을 걸어 둔 빌드는 빨리 올리는 것을 권합니다. 호스트 키 검증이 켜지므로 SFTP 저장소의 호스트 키가 등록돼 있는지 확인하세요.

릴리스 공지: [9.9.2 notes](https://github.com/gradle/gradle/blob/v9.9.2/platforms/documentation/docs/src/docs/release/notes.md) · [8.14.8 notes](https://github.com/gradle/gradle/blob/v8.14.8/platforms/documentation/docs/src/docs/release/notes.md)

### ollama v0.40.17

로컬에서 오픈 모델을 실행하는 도구입니다.

**무엇이 바뀌었나** — MLX 러너(Apple 실리콘용 실행기)가 동시 생성을 지원하고, 사용 가능한 메모리를 보고 기본 병렬 수를 정하며, 메모리 압박에 맞춰 저장된 대화 이력을 조정합니다. Windows 내장 GPU에서 가중치를 고정(pinned) 메모리에 두지 않도록 바뀌었고, API가 모델링하지 않은 도구 스키마 키워드를 보존합니다. 설치 스크립트는 preview 채널을 지원합니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### Optique 1.4.0 · 1.3.7 · 1.2.14 · 1.1.14 · 1.0.16

TypeScript용 타입 안전 CLI 파서입니다.

**무엇이 바뀌었나** — 1.4.0은 짧은 옵션에 값을 붙여 쓰는 형태를 지원해 `-n5`, `-xn5`가 `-n 5`, `-x -n 5`처럼 동작하고, 셸 자동완성도 따라갑니다. `showAliases: true`로 도움말에 명령 별칭을, `showEnvironment`로 옵션에 연결된 환경 변수를 보여 줄 수 있습니다. `choice()`의 `key` 옵션, 값 파서의 `normalizeInput()`, 파싱 오류 위에 해당 명령의 사용법을 보여 주는 `errorUsage: "command"`, 런타임 콜백을 실행하지 않고 명령 문서를 모으는 `collectDocPages()`도 추가됐습니다. 1.3.7과 이전 라인 패치는 fish 자동완성 스크립트의 백슬래시 처리, 숨긴 명령이 자기 도움말에서 사라지던 문제, `map()`이 `bindEnv()`·`bindConfig()` 대체값을 잃던 문제를 고쳤습니다.

**업그레이드할 때 확인할 점** — 문서 객체를 그대로 스냅샷하거나 키를 정확히 비교하는 테스트는 새 필드 때문에 갱신이 필요할 수 있다고 변경 기록에 적혀 있습니다. `-name`처럼 대시 하나짜리 옵션을 선언했다면 붙여 쓴 값 해석보다 그 옵션이 우선합니다.

릴리스 공지: [CHANGES](https://github.com/dahlia/optique/blob/main/CHANGES.md)

### React Native Skia v3.11.0

React Native용 2D 그래픽 라이브러리입니다.

**무엇이 바뀌었나** — 지원하는 최소 macOS 버전이 14.0으로 올랐고, macOS 14 이상의 ProMotion 기기에서 화면을 최대 주사율로 그립니다. Android 바이너리를 GitHub 릴리스에서 내려받는 방식으로 바뀌었고, 원근 행렬 아래에서 `drawAtlas`로 아틀라스를 그릴 때의 문제가 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 전부 확인하지 못했습니다. macOS 13 이하를 지원해야 하는 앱은 올리기 전에 확인하세요. Android 빌드가 GitHub에서 바이너리를 받아야 하니 외부 접근이 막힌 CI라면 설치 단계가 실패할 수 있습니다.

릴리스 공지: 없음

### Rolldown 1.3.3

JS/TS 번들러입니다.

**무엇이 바뀌었나** — 플러그인별 실행 시간을 표로 보여 주고, `rolldown_plugin_chunk_import_map`에 `include` 옵션이 생겼으며, `import()`로도 불리는 공통 청크를 인라인할 수 있습니다. 엔트리 청크와 외부 import의 순서가 소스 순서를 따르도록 한 수정, import 순환이나 함수 안에서 일찍 읽히는 `var`를 잘못 인라인하던 문제, CommonJS 엔트리의 `module.exports`가 CJS 출력에서 사라지던 문제 등 버그 수정이 30건 넘게 들어 있습니다. `onLog` 훅에서 난 오류가 이제 빌드를 실패시킵니다.

**업그레이드할 때 확인할 점** — 알 수 없는 `output.esModule` 문자열과 `buildStart` 안의 `this.load()` 호출은 이제 거부됩니다. 플러그인이 `onLog`에서 오류를 던지고 있었다면 빌드가 실패로 바뀝니다.

릴리스 공지: [CHANGELOG](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md)

### Spring AI v2.1.0 · v2.0.3

Spring용 AI 애플리케이션 프레임워크입니다.

**무엇이 바뀌었나** — 두 버전 모두 입력 값 처리 강화 커밋이 여럿 들어 있습니다. Redis·Typesense·Coherence 벡터 스토어의 필터 식 값 이스케이프, 필터 파서의 식 깊이 제한, Bedrock Converse의 미디어 URL에 대한 SSRF(서버가 의도하지 않은 주소로 요청을 보내게 하는 공격) 보호 강화, 시맨틱 캐시 항목의 범위별 분리입니다. CVE 번호는 확인하지 못했습니다. 2.1.0에는 최신 MCP 클라이언트 연결과 비동기 클라이언트 타입, 제공자와 무관하게 종료 사유를 정규화하는 `FinishReasonCategory`, `JdbcSessionRepository`의 SQL Server 방언, MongoDB Atlas 벡터 스토어의 선택적 대량 upsert, OpenAI용 `ConnectionDetails`가 추가됐습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. 사용자 입력이 벡터 스토어 필터 식에 들어가는 서비스라면 2.0.3 이상으로 올리는 것을 권합니다. 2.0.3은 Spring Boot 4.1.3 기준입니다.

릴리스 공지: 없음

### Spring Modulith 2.2.0 · 2.1.3 · 2.0.10

모듈형 Spring Boot 애플리케이션 도구입니다.

**무엇이 바뀌었나** — 2.2.0은 Spring Boot 4.2.0에 맞춘 릴리스로, 이벤트 발행 완료 처리를 기본으로 트랜잭션 안에서 하도록 바꿨습니다. 세 버전 공통으로 `WeekHasPassed.getStartDate()`가 로케일별 주의 첫 요일을 따르고, TimeMachine이 켜져 있으면 자동 스케줄링 활성화를 끄며, PlantUML 다이어그램의 관계가 항상 같은 순서로 쓰입니다. 2.1.3은 Spring Boot 4.1.3, 2.0.10은 4.0.10 기준입니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. 2.2.0으로 올릴 때는 이벤트 발행 완료 처리 기본값이 바뀐 점을 이벤트 리스너의 트랜잭션 동작과 함께 확인하세요.

릴리스 공지: 없음

### Storybook 10.6.8

UI 컴포넌트 개발 도구입니다.

**무엇이 바뀌었나** — 매니저의 스토리 프리로드 성능이 개선됐고, Vite 빌더가 번들러 그래프 전체를 `preview-stats.json`에 기록합니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md)

### Upyo 0.6.1 · 0.5.7

Node.js·Deno·Bun용 이메일 라이브러리입니다.

**무엇이 바뀌었나** — `Doe, John`처럼 쉼표나 마침표가 든 표시 이름이 주소 헤더에서 따옴표 없이 쓰여 여러 수신자로 읽히던 문제가 고쳐졌습니다. `formatAddress()`가 이런 이름을 따옴표로 감싸고 따옴표·백슬래시를 이스케이프하며, `parseAddress()`는 따옴표 안의 꺾쇠를 주소 구분자로 착각하지 않습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다. 받는 사람 이름에 쉼표가 들어갈 수 있는 서비스(성, 이름 순 표기 등)라면 올리는 것을 권합니다.

릴리스 공지: [CHANGES](https://github.com/dahlia/upyo/blob/main/CHANGES.md)

### Valkey 9.2.0 · 9.1.4 · 9.0.8 · 8.1.12 · 8.0.13 · 7.2.16

키/밸류 스토어입니다.

**무엇이 바뀌었나** — 9.1.4부터 7.2.16까지 다섯 유지보수 라인이 모두 CVE-2026-130822를 고쳤습니다. `maxmemory-clients`를 켠 상태에서 클라이언트 축출 중 해제된 메모리를 다시 쓰는(use-after-free) 크래시입니다. 키 이름이 2GiB 이상일 때의 크래시와 Lua 스크립트 관련 서버 패닉도 함께 수정됐습니다.

9.2.0은 9.2의 첫 안정판입니다. 값이 일치할 때만 지우는 `DELEX`, 증가와 만료 설정을 한 번에 하는 `INCREX`, 스트림용 `XACKDEL`·`XDELEX`가 추가됐습니다. 이름 붙여 재사용하는 ACL 역할(`ACL SETROLE`), 기수 트리 기반의 새 자료형 Path Hash(`PH*` 명령), 서버 측 핫 키 탐지(`HOTKEYS`), fork 없이 하는 RDB 스냅샷과 전체 동기화, RDB의 Zstd·LZ4 스트림 압축, 보조 TLS 인증서 설정도 들어왔습니다.

**업그레이드할 때 확인할 점** — `maxmemory-clients`를 쓰고 있다면 해당 라인의 보안 패치로 바로 올리세요. 9.2.0에는 동작 변경이 있습니다. `ZRANGEBYSCORE`·`ZCOUNT` 등이 `(`만 있거나 빈 문자열인 점수 경계를 0으로 보지 않고 거부하고, 키와 해시 필드의 능동 만료가 dirty 카운터를 올려 `BGSAVE`가 더 자주 일어날 수 있으며, 큰 sorted set의 `OBJECT ENCODING`이 `skiplist` 대신 `btree`로 나옵니다.

릴리스 공지: [9.2.0 RELEASENOTES](https://github.com/valkey-io/valkey/blob/9.2.0/00-RELEASENOTES) · [9.1.4](https://github.com/valkey-io/valkey/blob/9.1.4/00-RELEASENOTES) · [8.1.12](https://github.com/valkey-io/valkey/blob/8.1.12/00-RELEASENOTES)

## 마무리

변경점을 읽지 못해 본문에서 뺀 릴리스 4건(생략)은 Visual Studio Code 1.147.0, vLLM 0.34.0, KubeVirt v1.10.0, Spring Vault 4.1.2 · 4.0.5입니다. 앞의 셋은 저장소 안에 읽을 수 있는 릴리스 노트가 없고 변경 이력이 수백~천여 건이라 정리할 수 없었고, Spring Vault는 변경 이력이 의존성 갱신 위주라 무엇이 바뀌었는지 알 수 없었습니다.

확인 실패 11개는 세션 네트워크에서 호스트가 막혀 읽지 못한 공식 사이트 기반 소스입니다. Expo SDK, GraalVM, JDK, Android, Boundary, Cursor, GitButler, Manus, Swift, Ubuntu, Xcode입니다.

확인 방식: npm/PyPI/git 태그 기반 (GitHub 릴리스 본문 미접근)
