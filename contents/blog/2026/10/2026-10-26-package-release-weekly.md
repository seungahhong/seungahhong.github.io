---
layout: post
title: 이번 주 패키지 릴리스 정리 — 2026-10-26
date: 2026-10-26
published: 2026-10-26
category: 개발
tags: ['릴리스', '패키지', '주간정리']
comments: true
thumbnail: './assets/26/thumbnail.png'
github: ''
---

## ✍️ 한 줄 요약

침해된 eMudhra 중간 인증서를 신뢰하지 않도록 바꾸는 패치가 Electron·Deno·Bazel·Crossplane·Terraform·Argo CD·Turborepo 등 여러 도구에 한꺼번에 나왔고, Node.js(CVE 9건)와 Kyverno(보안 권고 24건)도 보안 릴리스를 냈습니다. Electron 45와 Nx 24는 메이저 릴리스이고, Bazel은 9.x 라인이 확인돼 올리기 전 breaking change(기존 코드를 고쳐야 하는 변경) 점검이 필요합니다.

## 이번 주 한눈에 보기

기간은 2026-10-19 ~ 2026-10-26(KST)이며, 추적 중인 87개 패키지 가운데 35개에 새 정식 릴리스가 있었습니다.

| 패키지 | 버전 | 릴리스 공지 | 변경점 |
|---|---|---|---|
| Node.js | v26.12.1 · v24.22.1 · v22.23.4 | [있음](https://github.com/nodejs/node/releases/tag/v26.12.1) | CVE 9건 보안 릴리스 |
| astro | 7.4.2 | [있음](https://github.com/withastro/astro/releases/tag/astro%407.4.2) | 최소 Node.js 22.23.4, content sync 가속 |
| Zed | v1.25.3 (패치 3개) · v1.24.4 | [있음](https://github.com/zed-industries/zed/releases/tag/v1.25.3) | 바이너리 축소, 환경변수 노출 수정 |
| pnpm | v12.15.0 · v11.28.8 · v10.34.9 | [있음](https://github.com/pnpm/pnpm/releases/tag/v12.15.0) | `include` 설정, 레지스트리 메타데이터 검증 강화 |
| 🔺 Electron | v45.0.0 · v44.9.3 · v43.8.3 · v42.11.18 | [있음](https://github.com/electron/electron/releases/tag/v45.0.0) | 메이저: 32비트 제거, `safeStorage` 동기 메서드 deprecated |
| Oxfmt | v0.74.0 | [있음](https://github.com/oxc-project/oxc/releases/tag/oxfmt_v0.74.0) | 포매터 버그 수정, JSON 오류 거부 |
| Oxlint | v1.89.0 | [있음](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.89.0) | 여러 규칙 recommended 승격 |
| Next.js | v16.4.3 | [있음](https://github.com/vercel/next.js/releases/tag/v16.4.3) | 버그 수정 백포트 |
| 🔺 Nx | 24.0.0 · 24.0.1 · 23.3.1 | [있음](https://github.com/nrwl/nx/releases/tag/24.0.0) | 메이저: deprecated 기능 제거, 프로젝트 이름 규칙 변경 |
| Deno | v2.9.8 | [있음](https://github.com/denoland/deno/releases/tag/v2.9.8) | eMudhra CA 불신, 권한 검사 수정 |
| FastAPI | 0.162.0 (10개 릴리스) | [있음](https://github.com/fastapi/fastapi/releases/tag/0.162.0) | 폼·파라미터 모델 확장, breaking 2건 |
| Grafana Tempo | v3.1.1 · v3.0.5 · v2.10.10 (패치 2개) | [있음](https://github.com/grafana/tempo/releases/tag/v3.1.1) | Go 업데이트로 CVE 해소 |
| Homebrew | 7.0.11 (패치 2개) | [있음](https://github.com/Homebrew/brew/releases/tag/7.0.11) | 패키지 출처·체크섬 검증 강화 |
| Vite | v8.3.5 | [있음](https://github.com/vitejs/vite/releases/tag/v8.3.5) | 번들 dev 모드·CSS `url()` 버그 수정 |
| Falco | 0.45.1 | [있음](https://github.com/falcosecurity/falco/releases/tag/0.45.1) | 구형 커널 설치, 메트릭 크래시 수정 |
| Hono | v4.13.14 | [있음](https://github.com/honojs/hono/releases/tag/v4.13.14) | `serve-static`, path 파라미터 동작 수정 |
| Kyverno | v1.19.2 | [있음](https://github.com/kyverno/kyverno/releases/tag/v1.19.2) | 보안 권고 24건 수정 |
| OpenSearch | 3.9.0 · 2.19.7 | [있음](https://github.com/opensearch-project/OpenSearch/releases/tag/3.9.0) | 신규 API, CVE 2건 수정 |
| Turborepo | v2.11.10 | [있음](https://github.com/vercel/turborepo/releases/tag/v2.11.10) | Windows 행 수정, eMudhra CA 불신 |
| Argo CD | v3.5.6 · v3.4.12 · v3.3.18 (패치 2개) | [있음](https://github.com/argoproj/argo-cd/releases/tag/v3.5.6) | SOCKS5 SSH fetch 수정, CA 보안 수정 |
| 🔺 Bazel | 9.3.1 · 8.8.2 · 7.7.2 | [있음](https://github.com/bazelbuild/bazel/releases/tag/9.3.1) | 철회된 루트 CA 제거 |
| Biome | v2.6.3 | [있음](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fbiome%402.6.3) | nursery 규칙 대거 추가, 요약 출력 stderr로 |
| celld | v0.6.3 | [있음](https://github.com/denoland/celld/releases/tag/v0.6.3) | rustls 보안 수정, 소유권 기록 유실 셀 거부 |
| Consul | v2.1.0 | [있음](https://github.com/hashicorp/consul/releases/tag/v2.1.0) | nftables 전환 등 breaking 포함 |
| Crossplane | v2.4.3 · v2.3.7 · v2.2.7 · v1.20.14 | [있음](https://github.com/crossplane/crossplane/releases/tag/v2.4.3) | Go 1.26.10, eMudhra 루트 제거 |
| Gradle | 9.8.2 | [있음](https://github.com/gradle/gradle/releases/tag/v9.8.2) | Java 27 지원 등 |
| ollama | v0.40.11 (패치 4개) | [있음](https://github.com/ollama/ollama/releases/tag/v0.40.11) | 음성 생성, 신규 모델 |
| React Native Skia | v3.8.0 · v3.7.4 (패치 5개) · v2.15.2 | [있음](https://github.com/wcandillon/react-native-skia/releases/tag/v3.8.0) | `SkiaPictureView` 제거 |
| Rolldown | v1.2.15 | [있음](https://github.com/rolldown/rolldown/releases/tag/v1.2.15) | `isBundled` 옵션, 출력 주석 형식 변경 |
| Rstest | v0.12.4 | [있음](https://github.com/web-infra-dev/rstest/releases/tag/v0.12.4) | 브라우저 모드 스크린샷 테스트 |
| Spring AI | v2.0.2 | [있음](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.2) | 관측성·MCP 개선, 버그 수정 |
| Spring Modulith | 2.1.2 · 2.0.9 · 1.4.14 | [있음](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.2) | 이벤트 발행·테스트 버그 수정 |
| Spring Vault | 4.1.1 | [있음](https://github.com/spring-projects/spring-vault/releases/tag/4.1.1) | `RestClientAdapter` POST 본문 유실 수정 |
| Storybook | v10.6.4 (패치 2개) | [있음](https://github.com/storybookjs/storybook/releases/tag/v10.6.4) | Vitest 5 지원, Jest 로더 수정 |
| Terraform | v1.17.0 · v1.16.7 | [있음](https://github.com/hashicorp/terraform/releases/tag/v1.17.0) | provider 요구사항에 변수 사용, Policy GA |

## 패키지별 변경 내용

### Node.js v26.12.1 · v24.22.1 · v22.23.4

서버에서 자바스크립트를 실행하는 런타임입니다.

**무엇이 바뀌었나** — Current 라인 v26.12.1과 LTS 라인 v24.22.1은 CVE 9건을 고친 보안 릴리스입니다. High 등급은 TLS가 비정규 형식의 IP 주소를 거부하도록 하고 IP 정규화 회귀를 바로잡은 것, DNS resolve 입력의 null 바이트 검증, Brotli 관련 수정이며, Medium은 HTTP agent의 데이터 가드와 스냅샷 간 캐시 무작위 리셋, Low는 zlib ZIP 헤더 캐시와 fs 권한 와일드카드, `realpathSync` 권한 검사입니다. 루트 인증서는 NSS 3.131.1로, c-ares는 1.34.9로 갱신됐고 차단된 공개키가 들어 있는 인증서 체인은 TLS에서 거부됩니다. 유지보수 라인 v22.23.4에도 같은 보안 수정 묶음이 들어갔습니다.

**업그레이드할 때 확인할 점** — 릴리스 노트에 breaking change는 없지만 TLS 연결, 비정규 IP 입력, 인증서 체인이 거부되는 경우가 새로 생길 수 있으니 올린 뒤 외부 연결을 확인하세요. 보안 패치이므로 LTS 사용자는 가급적 빨리 올리는 것이 좋습니다.

릴리스 공지: [v26.12.1](https://github.com/nodejs/node/releases/tag/v26.12.1) · [v24.22.1](https://github.com/nodejs/node/releases/tag/v24.22.1) · [v22.23.4](https://github.com/nodejs/node/releases/tag/v22.23.4)

### astro 7.4.2

JavaScript 웹 프레임워크입니다.

**무엇이 바뀌었나** — 패치 릴리스이며 최소 지원 Node.js가 22.23.4로 올랐습니다. `experimental.collectionStorage: "chunked"`를 쓰면 content sync가 크게 빨라져, 약 4.4만 개 항목 기준 60초에서 1초 미만이 됐다고 합니다. Cloudflare 어댑터와 `astro dev`의 node-fetch 오류, 낡은 lock 파일 때문에 무관한 프로세스가 종료되던 문제, i18n의 `defaultLocale`·`fallback`·`domains` 타입, `server:defer` 아일랜드 오류, `$`가 들어간 env 값에서 잘못된 JS가 생성되던 문제 등이 고쳐졌습니다.

**업그레이드할 때 확인할 점** — Node.js가 22.23.4 이상인지 먼저 확인하세요. 그 외에는 그대로 올려도 됩니다.

릴리스 공지: [astro@7.4.2](https://github.com/withastro/astro/releases/tag/astro%407.4.2)

### Zed v1.25.3 · v1.24.4

Rust로 만든 빠른 코드 에디터입니다.

**무엇이 바뀌었나** — v1.25.2에서는 바이너리 크기가 macOS 약 33%, Windows 28%, Linux 7% 줄었고, Amazon Bedrock에 GPT-6 Astra·Claude Fable 5.1·Claude Opus 5.5 모델이 추가됐으며, 외부 에이전트(ACP) 세션 알림과 컨텍스트 압축, inlay hint 더블클릭 편집, SSH 연결 속도 개선이 들어갔습니다. 보안 수정으로, 원격 프로젝트에서 외부 에이전트와 MCP 서버에 넘기는 환경변수·시크릿이 로컬 프로세스 목록에 노출되던 문제가 고쳐졌습니다. v1.25.3은 소프트웨어 생태계 취약점 대응용 의존성 업데이트만 담은 패치이고, v1.24.4는 `npm` 필드가 없어 OpenCode 모델이 로드되지 않던 문제를 고쳤습니다.

**업그레이드할 때 확인할 점** — 명시된 breaking change는 없습니다. 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [v1.25.3](https://github.com/zed-industries/zed/releases/tag/v1.25.3) · [v1.24.4](https://github.com/zed-industries/zed/releases/tag/v1.24.4)

### pnpm v12.15.0 · v11.28.8 · v10.34.9

Node.js 패키지 매니저입니다.

**무엇이 바뀌었나** — v12.15.0은 설정을 여러 파일로 나눌 수 있는 `include` 필드, `lockfile.integrityTarget: tar`와 tar 레지스트리 지원, zstd 응답 처리, `deploy`·`install`의 `SOURCE_DATE_EPOCH` 지원을 추가했습니다. 다른 패키지 이름의 레지스트리 메타데이터는 거부하며, 워크스페이스 install과 macOS 링크 속도도 빨라졌습니다. v11.28.8은 독립 실행 빌드에 Node.js 26.12.1을 내장했는데, 이전 26.0.0은 Node.js가 불신하기로 한 중간 CA를 계속 신뢰하고 있었기 때문입니다. v11.28.7은 `trustPolicy` 적용과 `maxTarballUnpackedSize`(기본 4GiB) 추가를, v10.34.9는 새 `pnpm-lock.yaml`에 `packageManager`로 고정한 pnpm 버전을 기록해 이후 `--frozen-lockfile` install이 성공하게 했습니다.

**업그레이드할 때 확인할 점** — breaking change 표시는 없지만, 레지스트리 메타데이터 검증이 엄격해졌으니 사설 레지스트리를 쓴다면 설치가 실패하지 않는지 확인하세요.

릴리스 공지: [v12.15.0](https://github.com/pnpm/pnpm/releases/tag/v12.15.0) · [v11.28.8](https://github.com/pnpm/pnpm/releases/tag/v11.28.8) · [v10.34.9](https://github.com/pnpm/pnpm/releases/tag/v10.34.9)

### 🔺 메이저 Electron v45.0.0 · v44.9.3 · v43.8.3 · v42.11.18

웹 기술로 데스크톱 앱을 만드는 플랫폼입니다.

**무엇이 바뀌었나** — v45.0.0은 Chromium 156.0.8078.48, Node v24.22.0, V8 15.6을 탑재합니다. macOS 14 이상의 MenuItem `badge`, 플랫폼 공통 창 상태 저장·복원 API, iCloud 키체인 패스키용 `app.configureWebAuthn()`, Windows Error Reporting 도우미가 추가됐습니다. v44.9.1은 침해된 eMudhra 중간 인증서에 대응한 보안 수정(GHSA-jr5w-w6x2-84p9)이며, v44.9.3·v43.8.3은 ANGLE·Chromium·PDFium·Skia·V8 수정을 백포트한 패치입니다. v42.11.18 노트에는 Electron 42가 지원 종료됐다는 경고가 있습니다.

**업그레이드할 때 확인할 점** — v45의 breaking change는 32비트 빌드 제거, 동기 방식 `safeStorage` 메서드의 deprecation(지원 중단 예고, v46에서 제거 예정), 화면 캡처 권한 보고 방식 변경입니다. 32비트 지원 여부, `safeStorage` 동기 호출 여부, 화면 캡처 권한 처리를 확인하세요. (v45.0.0 노트는 일부만 확인했습니다.)

릴리스 공지: [v45.0.0](https://github.com/electron/electron/releases/tag/v45.0.0) · [v44.9.3](https://github.com/electron/electron/releases/tag/v44.9.3) · [v43.8.3](https://github.com/electron/electron/releases/tag/v43.8.3) · [v42.11.18](https://github.com/electron/electron/releases/tag/v42.11.18)

### Oxfmt v0.74.0

JavaScript/TypeScript 포매터입니다.

**무엇이 바뀌었나** — 주로 포매터 버그 수정입니다. YAML, Markdown, JSDoc, TOML, 설정 파일의 BOM 처리, 주석 위치, 괄호, Vue 바인딩이 대상입니다. JSON은 잘못된 입력을 조용히 버리지 않고 오류로 거부하도록 바뀌었고, 일부 성능 개선과 문서 갱신이 있습니다.

**업그레이드할 때 확인할 점** — 올린 뒤 포맷 결과 diff와 JSON 오류 여부를 확인하세요.

릴리스 공지: [oxfmt v0.74.0](https://github.com/oxc-project/oxc/releases/tag/oxfmt_v0.74.0)

### Oxlint v1.89.0

JavaScript/TypeScript 린터(코드 검사 도구)입니다.

**무엇이 바뀌었나** — Vue 3, React, Promise, Node, Next.js, JSX a11y, JSDoc, Jest/Vitest, import, unicorn, TypeScript, ESLint 계열 플러그인의 많은 규칙이 recommended(기본 권장)로 승격됐습니다. 일부 ESLint·unicorn 규칙 버그가 고쳐지고 `react/jsx-key` 성능이 개선됐습니다. 정적 속성·멤버 이름에서 lone surrogate(짝이 맞지 않는 유니코드 글자 조각)를 보존하는 방식이 바뀐 breaking change도 있습니다.

**업그레이드할 때 확인할 점** — recommended 승격으로 새 경고가 늘 수 있으니 린트 결과를 확인하세요.

릴리스 공지: [oxlint v1.89.0](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.89.0)

### Next.js v16.4.3

서버렌더링 React 애플리케이션 프레임워크입니다.

**무엇이 바뀌었나** — 버그 수정만 담은 백포트 릴리스입니다. 확장자 없는 Google 폰트 URL 처리(두 번들러 모두), `proxy.ts`에서 app-page 런타임이 로드되던 문제, Turbopack 로더 변경 무효화 수정 되돌림, OpenTelemetry 요청 트레이스 통합 유지, 서버 부트스트랩에서 standalone React를 불러오지 않도록 하는 변경이 들어갔습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [v16.4.3](https://github.com/vercel/next.js/releases/tag/v16.4.3)

### 🔺 메이저 Nx 24.0.0 · 24.0.1 · 23.3.1

모노레포 빌드 시스템입니다.

**무엇이 바뀌었나** — 24.0.0은 Angular 22.2 지원을 추가했고 dev server가 기본으로 준비 완료를 기다리도록 바꿨습니다. SCAM generator, Module Federation, Remix generator/executor, Gradle plugin-v1 등 deprecated 기능은 제거됐습니다. 24.0.1은 데몬 동작, dev server 준비 감지, 캐시 처리, Rspack, Angular Rspack, Maven, Storybook 등 약 24건을 고쳤고, 23.3.1은 Angular 패키지가 peer로 Vitest 5를 선언해도 허용하도록 한 수정 하나입니다.

**업그레이드할 때 확인할 점** — breaking change는 추론되는 프로젝트 이름 규칙 변경, typecheck를 `@nx/js/typescript`로 넘긴 것, dotnet restore 타깃의 opt-in 전환입니다. 제거된 기능을 쓰는지, 프로젝트 이름 변경에 따라 task 참조가 깨지지 않는지, typecheck 설정이 맞는지 확인하세요.

릴리스 공지: [24.0.0](https://github.com/nrwl/nx/releases/tag/24.0.0) · [24.0.1](https://github.com/nrwl/nx/releases/tag/24.0.1) · [23.3.1](https://github.com/nrwl/nx/releases/tag/23.3.1)

### Deno v2.9.8

TypeScript/JavaScript 런타임입니다.

**무엇이 바뀌었나** — 컴파일된 바이너리에서 동적 import한 로컬 파일의 읽기 권한을 검사하게 됐고, bare `deno run`의 zsh 자동완성을 지원합니다. fetch의 idle-interval 문제 해결을 위해 hyper와 hyper-util을 갱신했고, napi 경계·예외 처리, X.509v1 인증서 처리를 OpenSSL과 맞추는 수정, `mock.reset()` 개선, npm 패키지 링크 이름 검증도 들어갔습니다. 침해된 eMudhra CA를 신뢰하지 않도록 했고 rand 0.9.x 보안 업데이트가 포함됐습니다.

**업그레이드할 때 확인할 점** — breaking change는 언급되지 않았습니다. 컴파일된 바이너리에서 동적 import를 쓴다면 읽기 권한 검사로 동작이 달라지지 않는지 확인하세요.

릴리스 공지: [v2.9.8](https://github.com/denoland/deno/releases/tag/v2.9.8)

### FastAPI 0.157.0 ~ 0.162.0

Python 웹 프레임워크입니다.

**무엇이 바뀌었나** — 이번 주 마이너 릴리스가 10개 나왔고(0.157.0~0.162.0) 마이너가 모두 달라 하나로 합치지 않았습니다. 대체로 폼 모델과 query·header·cookie 파라미터 모델을 결합하거나 optional·union으로 쓸 수 있게 하는 확장이며, 폼 미디어 타입이 OpenAPI 출력에 유지되도록 하고 nullable 폼 union의 스키마도 고쳤습니다.

**업그레이드할 때 확인할 점** — breaking change가 두 건 있습니다. 0.162.0부터 폼에서 생략된 `bool`·`bool | None` 필드는 예전처럼 `False`가 되지 않고 선언된 기본값을 쓰거나 필수 누락 오류를 냅니다. 0.160.0부터는 파라미터 모델의 `extra` 설정이 같은 위치로 제출된 모든 필드(다른 곳에서 선언된 필드 포함)에 적용됩니다.

릴리스 공지: [0.162.0](https://github.com/fastapi/fastapi/releases/tag/0.162.0) · [0.160.0](https://github.com/fastapi/fastapi/releases/tag/0.160.0)

### Grafana Tempo v3.1.1 · v3.0.5 · v2.10.10

분산 트레이싱 백엔드입니다.

**무엇이 바뀌었나** — 세 라인 모두 보안 패치입니다. v3.1.1은 Go를 1.27.3으로 올려 다수의 CVE를 해소했고, v3.0.5와 v2.10.10은 Go 1.26.10으로 CVE-2026-111943을 고쳤습니다. v2.10.9(패치 2개 중 앞의 것)는 Go 1.26.9와 golang.org/x/net, grpc, OpenTelemetry 등 의존성 갱신으로 CVE를 다수 수정했습니다.

**업그레이드할 때 확인할 점** — 바이너리를 다시 빌드한 보안 패치이므로 쓰는 라인의 최신 패치로 올리면 됩니다.

릴리스 공지: [v3.1.1](https://github.com/grafana/tempo/releases/tag/v3.1.1) · [v3.0.5](https://github.com/grafana/tempo/releases/tag/v3.0.5) · [v2.10.10](https://github.com/grafana/tempo/releases/tag/v2.10.10)

### Homebrew 7.0.11

macOS/Linux 패키지 매니저입니다.

**무엇이 바뀌었나** — 7.0.11(약 43건)은 보안과 검증 강화가 중심입니다. API formula 패치 다운로드를 검증하고, 공식 formula 출처 검증을 필수로 하며, cask에 명시된 체크섬을 따릅니다. 새 cask에는 `zap` stanza가 필요하고 Rosetta가 필요한 새 cask는 거부됩니다. 7.0.10(약 50건)은 tap 리다이렉트 신뢰, bottle attestation(빌드 증명) 검증 강화, 취약점 인지 패키지 관리, cleanup 시 Brewfile formula 보호, 새 패키지에 livecheck 필수화를 담았습니다.

**업그레이드할 때 확인할 점** — 자체 tap이나 cask를 관리한다면 `zap` stanza와 체크섬 요건을 확인하세요. 일반 사용자는 그대로 올려도 됩니다.

릴리스 공지: [7.0.11](https://github.com/Homebrew/brew/releases/tag/7.0.11) · [7.0.10](https://github.com/Homebrew/brew/releases/tag/7.0.10)

### Vite v8.3.5

프론트엔드 빌드 도구입니다.

**무엇이 바뀌었나** — 버그 수정 위주입니다. 빌드(청크 import map, preload 의존성)와 번들 dev 모드(에셋 URL의 서버 origin, UTF-8 폴백 페이지, `import.meta.env` define, 소스맵 에러 스택, HMR 전파)가 고쳐졌고, CSS `url()` 처리, optimizer lockfile 해시, subpath imports, 소켓 에러 처리도 수정됐습니다. 소스맵 성능 개선과 Oxlint 마이그레이션 같은 내부 정리도 포함됩니다.

**업그레이드할 때 확인할 점** — 신규 기능이나 breaking change는 없습니다. 번들 dev 모드나 CSS `url()`을 쓴다면 올린 뒤 동작만 확인하세요.

릴리스 공지: [v8.3.5](https://github.com/vitejs/vite/releases/tag/v8.3.5)

### Falco 0.45.1

클라우드 네이티브 런타임 보안 도구입니다.

**무엇이 바뀌었나** — modern eBPF를 쓸 수 없는 커널(예: Ubuntu 20.04의 커널 5.4)에서 deb/rpm 패키지가 반쯤 설정된 채 남던 문제가 고쳐졌습니다. `file_output`의 `keep_alive`는 쓰기 실패(디스크 가득 참 등) 뒤에도 다음 알림에서 파일을 다시 열어 계속 씁니다. Prometheus 메트릭 수집 중 이벤트 처리와 경합해 크래시하던 문제도 수정됐고, 규칙 reload 중 감시 디렉터리의 파일이 사라져도 종료하지 않게 됐습니다.

**업그레이드할 때 확인할 점** — 구형 커널 환경이라면 올리기를 권합니다. 그 외에는 그대로 올려도 됩니다.

릴리스 공지: [0.45.1](https://github.com/falcosecurity/falco/releases/tag/0.45.1)

### Hono v4.13.14

엣지 환경용 웹 프레임워크입니다.

**무엇이 바뀌었나** — 17개 변경이 담긴 패치로 대부분 버그 수정입니다. `serve-static`은 GET/HEAD만 처리하고 미리 압축된 파일에서 `Accept-Encoding`의 q-value를 존중합니다. `basePath()`의 정규식 파라미터가 라우터와 일치하도록 바뀌었고, 중복된 path 파라미터는 첫 값을 유지하며, strict가 false일 때 `getPath` 사용은 허용하지 않습니다. JSX `cloneElement`가 self-closing void 요소를 보존하고, Bearer 인증의 `MessageFunction`이 `Response`를 반환할 수 있으며, hono peer 범위가 v5 프리릴리스를 허용합니다.

**업그레이드할 때 확인할 점** — `serve-static`의 메서드 제한과 path 파라미터 동작 변화를 확인하세요.

릴리스 공지: [v4.13.14](https://github.com/honojs/hono/releases/tag/v4.13.14)

### Kyverno v1.19.2

Kubernetes 정책 엔진입니다.

**무엇이 바뀌었나** — 공개된 보안 권고 24건(Critical 9, High 14, Moderate 1)을 수정한 릴리스입니다. 스크립트 인젝션 하드닝, API 경로·네임스페이스 제한, 이미지 검증, CEL cost 제한, generate 보호 등이 포함됩니다. 성능, CI, 의존성 업데이트도 있으나 개별 CVE 번호는 확인하지 못했습니다.

**업그레이드할 때 확인할 점** — 보안 수정량이 많아 우선 업그레이드를 권합니다. 정책·RBAC 동작이 바뀔 수 있으니 올린 뒤 기존 정책이 그대로 적용되는지 확인하세요.

릴리스 공지: [v1.19.2](https://github.com/kyverno/kyverno/releases/tag/v1.19.2)

### OpenSearch 3.9.0 · 2.19.7

분산형 검색 엔진입니다.

**무엇이 바뀌었나** — 3.9.0에는 저장된 태스크 결과를 지우는 DELETE task API, 무중단 노드 배포를 위한 deployment drain/finish API, 액션별 적응형 동시성 제한, virtual thread executor 지원, pull-based ingestion payload decoder 프레임워크, 노드 손실 시 remote store 자동 복원이 추가됐습니다. 집계·캐시·translog 성능도 개선됐고, completion suggester 수정(CVE-2026-63136)과 Log4j 수정(CVE-2026-49844)이 포함됩니다. 2.19.7은 hot_threads 스냅샷 상한, query_string 중첩 깊이 제한, completion suggester 정규식 상태 수 상한을 추가하고 검색 템플릿의 Mustache partial 해석을 껐으며 fs repository `base_path` 경로 검증을 넣었습니다.

**업그레이드할 때 확인할 점** — 3.9.0에서 `RestHighLevelClient`가 deprecated(지원 중단 예고)이므로 `opensearch-java`로 옮길 계획을 세우세요. 2.19.7은 검색 템플릿의 partial과 query_string 깊이 제한을 쓰는 쿼리가 영향받는지 확인해야 합니다.

릴리스 공지: [3.9.0](https://github.com/opensearch-project/OpenSearch/releases/tag/3.9.0) · [2.19.7](https://github.com/opensearch-project/OpenSearch/releases/tag/2.19.7)

### Turborepo v2.11.10

JavaScript/TypeScript 모노레포 빌드 시스템입니다.

**무엇이 바뀌었나** — 약 18건의 패치입니다. root 태스크에서 비재귀 Turbo 명령을 허용하고, Windows에서 pnpm batch-shim 종료 시 멈추던 문제를 고쳤습니다. 도구가 관리하는 디렉터리를 로컬 의존성 입력에서 빼고, 파일 해시를 git의 바이너리 감지 방식과 맞췄으며, 출력이 이미 있어도 캐시된 심볼릭 링크를 복원합니다. 침해된 eMudhra 중간 인증서를 신뢰하지 않도록 한 변경도 있습니다.

**업그레이드할 때 확인할 점** — 해시 방식이 바뀌어 캐시 미스가 한 번 늘 수 있습니다. 그 외 breaking change는 없습니다.

릴리스 공지: [v2.11.10](https://github.com/vercel/turborepo/releases/tag/v2.11.10)

### Argo CD v3.5.6 · v3.4.12 · v3.3.18

Kubernetes 배포(GitOps) 도구입니다.

**무엇이 바뀌었나** — 세 라인에 공통으로 SOCKS5 프록시를 거치는 SSH 저장소 fetch와 다른 manager가 제거한 필드의 server-side diff 보고를 고쳤고 DOMPurify·Go를 갱신했습니다. v3.5.6은 gRPC SRV 조회 문제도 수정했고, v3.3.18은 eMudhra CA 인증서 관련 보안 수정을 담았습니다(v3.3.17도 같은 주 릴리스).

**업그레이드할 때 확인할 점** — 쓰는 라인의 최신 패치로 올리면 됩니다. 프록시 뒤에서 SSH 저장소를 쓴다면 연결을 한 번 확인하세요.

릴리스 공지: [v3.5.6](https://github.com/argoproj/argo-cd/releases/tag/v3.5.6) · [v3.4.12](https://github.com/argoproj/argo-cd/releases/tag/v3.4.12) · [v3.3.18](https://github.com/argoproj/argo-cd/releases/tag/v3.3.18)

### 🔺 메이저 Bazel 9.3.1 · 8.8.2 · 7.7.2

빌드 도구입니다.

**무엇이 바뀌었나** — 세 LTS 라인 모두 유출된 개인키 문제로 신뢰가 철회된 eMudhra·Sectigo AAA 루트 CA 인증서를 번들 JDK에서 제거했습니다. 9.3.1은 여기에 더해 최상위 alias 체인의 패키지를 사전 실행 캐시 폐기 때도 보존하고, 락 획득 실패 시 락 파일 채널을 닫으며, 다운로드 전에 출력이 유실된 액션을 되감아 다시 실행하도록 고쳤습니다.

**업그레이드할 때 확인할 점** — 9.x는 이 정리가 기준으로 삼는 버전(8.7.0)보다 메이저가 높은 라인입니다. 이번 패치 자체는 각 라인과 하위 호환(9.3.1은 9.0.1 이후)되며 특별한 확인 사항은 없습니다.

릴리스 공지: [9.3.1](https://github.com/bazelbuild/bazel/releases/tag/9.3.1) · [8.8.2](https://github.com/bazelbuild/bazel/releases/tag/8.8.2) · [7.7.2](https://github.com/bazelbuild/bazel/releases/tag/7.7.2)

### Biome v2.6.3

프론트엔드 린터·포매터 툴체인입니다.

**무엇이 바뀌었나** — JavaScript, CSS, Vue, Playwright, TanStack Query용 nursery(실험 단계) 린트 규칙이 대거 추가됐고 JS/TS/Markdown 포매터와 GraphQL, CSS 버그가 고쳐졌습니다. CLI 기본 리포터의 요약이 이제 stderr로 출력됩니다.

**업그레이드할 때 확인할 점** — stdout을 파싱하는 CI 스크립트가 있다면 요약이 사라진 것처럼 보일 수 있으니 확인하세요.

릴리스 공지: [v2.6.3](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fbiome%402.6.3)

### celld v0.6.3

직접 운영할 수 있는 분산 durable object입니다.

**무엇이 바뀌었나** — 아웃바운드 TLS에서 emSign ECC Root CA - G3와 키가 공개된 eMudhra 중간 CA 8개를 신뢰하지 않습니다. rustls를 0.23.46으로 올려 TLS 1.3 핸드셰이크에서 암호화 수준 경계 메시지를 받아들이던 문제(GHSA-2mjx-qc3c-rqvc)를 고쳤습니다. 소유권 기록이 없는데 LTX가 버킷에 남은 셀은 노드가 획득을 거부하고 "celld ownership record lost" 로그를 셀당 10초에 최대 1회 남깁니다.

**업그레이드할 때 확인할 점** — v0.6.2 노드와 섞여 있으면 v0.6.2 노드가 소유권 기록이 유실된 셀을 빈 상태로 시작할 수 있으므로 모든 노드를 v0.6.3으로 맞추세요. 복구 방법은 guarantees 문서에 있습니다.

릴리스 공지: [v0.6.3](https://github.com/denoland/celld/releases/tag/v0.6.3)

### Consul v2.1.0

서비스 디스커버리·설정 도구입니다.

**무엇이 바뀌었나** — OIDC 로그아웃, API Gateway의 HTTP2/gRPC 지원, 기능 게이트 프레임워크가 추가되고 보안 의존성이 업그레이드됐습니다. 한편 Enterprise 요청 본문 크기에 기본 512 KiB 제한이 생겼고, 투명 프록시가 iptables에서 nftables로 바뀌었으며, leaf 인증서와 헬스체크의 토큰 권한이 더 엄격해졌습니다.

**업그레이드할 때 확인할 점** — breaking change가 포함돼 있습니다. 노드가 nftables를 지원하는지, 토큰 ACL 권한이 충분한지, 요청 본문이 512 KiB를 넘지 않는지 먼저 확인하세요.

릴리스 공지: [v2.1.0](https://github.com/hashicorp/consul/releases/tag/v2.1.0)

### Crossplane v2.4.3 · v2.3.7 · v2.2.7 · v1.20.14

외부 인프라를 관리하는 Kubernetes 애드온입니다.

**무엇이 바뀌었나** — v2.4.3은 Go를 1.26.10으로 올려 침해된 eMudhra 루트를 제거했고, 잘린 패키지 다운로드를 캐시하지 않으며, Usage 레이블 재작성 문제를 고치고, crossplane-edit/admin의 XR 스케일링을 허용했습니다. v2.3.7은 같은 수정에 더해 XRD를 나열하지 못하면 claim을 fail-closed(거부 쪽으로 닫힘)로 처리합니다. v2.2.7은 같은 Go·다운로드·Usage 수정과 의존성 갱신이고, v1.20.14는 Go 1.26.10과 새 distroless 베이스 이미지만 담은 보안 전용 패치입니다.

**업그레이드할 때 확인할 점** — breaking change는 없습니다. 쓰는 라인의 최신 패치로 올리면 됩니다.

릴리스 공지: [v2.4.3](https://github.com/crossplane/crossplane/releases/tag/v2.4.3) · [v2.3.7](https://github.com/crossplane/crossplane/releases/tag/v2.3.7) · [v2.2.7](https://github.com/crossplane/crossplane/releases/tag/v2.2.7) · [v1.20.14](https://github.com/crossplane/crossplane/releases/tag/v1.20.14)

### Gradle 9.8.2

Java 빌드 도구입니다.

**무엇이 바뀌었나** — 릴리스 페이지가 꼽은 하이라이트는 Java 27 지원, Maven 미러 설정 재사용, 빌드 출력에서 문제 위치로 이동하는 링크 세 가지입니다. 세부 수정 목록은 페이지에 없고 docs.gradle.org의 릴리스 노트로 안내만 합니다.

**업그레이드할 때 확인할 점** — 노트에서 확인되는 breaking change는 없습니다. wrapper 업그레이드 절차는 공식 릴리스 노트를 따르세요.

릴리스 공지: [9.8.2](https://github.com/gradle/gradle/releases/tag/v9.8.2)

### ollama v0.40.11 (패치 4개)

오픈 모델을 로컬에서 실행하는 도구입니다.

**무엇이 바뀌었나** — v0.40.11은 macOS에서 `ollama run`과 `/v1/audio/speech` 엔드포인트로 음성 생성을 지원하고 d3 decision 모델 계열(2B~27B)을 추가했습니다. v0.40.10은 NVIDIA Nemotron 3.5 Bolt E4B(Gemma 4 기반 비전-언어, 128K 컨텍스트)를, v0.40.8은 MoE 코딩 모델 Flint(총 40B, 활성 약 2.5B, 262K 컨텍스트, macOS 전용으로 시작)를 소개했습니다. v0.40.9는 Flint를 Linux·Windows로 넓히고 스트리밍 생성 실패를 보고하며 클라우드 모델의 컨텍스트 설정을 코딩 도구에 전달합니다.

**업그레이드할 때 확인할 점** — breaking change는 없습니다. 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [v0.40.11](https://github.com/ollama/ollama/releases/tag/v0.40.11)

### React Native Skia v3.8.0 · v3.7.4 · v2.15.2

React Native용 2D 그래픽(Skia) 라이브러리입니다.

**무엇이 바뀌었나** — v3.8.0은 네임스페이스가 반복되던 팩토리 메서드 이름을 고치고 `SkiaPictureView`를 제거했습니다. v3.7.x(패치 5개)는 Skia m157로 업데이트하고 Android 3중 FIFO 스왑체인, ProMotion 기기의 전체 주사율 표시, React 19.2 reconciler 기반 Canvas 자식 렌더링, recorder pooling을 추가했으며 디바이스 손실을 JS에 노출합니다. v2.15.2는 2.x 백포트로 네이티브 뷰 ID 처리와 Metal 디바이스 유지 등을 고쳤습니다.

**업그레이드할 때 확인할 점** — `SkiaPictureView`를 쓰고 있다면 v3.8.0으로 올리기 전에 대체 방법으로 옮겨야 합니다.

릴리스 공지: [v3.8.0](https://github.com/wcandillon/react-native-skia/releases/tag/v3.8.0) · [v3.7.4](https://github.com/wcandillon/react-native-skia/releases/tag/v3.7.4) · [v2.15.2](https://github.com/wcandillon/react-native-skia/releases/tag/v2.15.2)

### Rolldown v1.2.15

JavaScript/TypeScript 번들러입니다.

**무엇이 바뀌었나** — 브라우저 external 스텁 형식을 고르는 `isBundled` 옵션이 생겼고, HMR 모듈 그래프에서 엔트리 모듈을 표시하며 모듈 시작 표시가 `#region` 대신 `// <id>` 주석으로 바뀌었습니다. `skipSelf: true` 플러그인 간 `this.resolve` 재귀, ssr.target이 webworker일 때의 external require, 정적 specifier 동적 import만 `__vitePreload`로 감싸는 처리, 엄격한 실행 순서에서의 eager 모듈 래핑이 고쳐졌고 oxc는 0.155.0으로 올랐습니다.

**업그레이드할 때 확인할 점** — 출력의 주석 형식이 바뀌었으니 번들 출력 문자열에 의존하는 도구가 있다면 확인하세요.

릴리스 공지: [v1.2.15](https://github.com/rolldown/rolldown/releases/tag/v1.2.15)

### Rstest v0.12.4

Rspack 기반 테스트 프레임워크입니다.

**무엇이 바뀌었나** — 브라우저 모드에 스크린샷 테스트가 추가됐습니다. `toMatchScreenshot()` 매처가 요소나 페이지 전체를 기준 이미지와 비교하고 불일치 시 실제·diff 이미지를 저장하며, 페이지 스크린샷은 기본이 뷰포트이고 `fullPage` 옵션이 있습니다. `locator.pressSequentially`, browser-react `render`의 하이드레이션 지원, 프로그래매틱 API의 `--trace`, coverage-v8의 호스트 측 원시 커버리지 병합, OOM으로 죽은 워커 재시도도 들어갔습니다.

**업그레이드할 때 확인할 점** — breaking change는 언급되지 않았습니다. 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [v0.12.4](https://github.com/web-infra-dev/rstest/releases/tag/v0.12.4)

### Spring AI v2.0.2

AI 엔지니어링을 위한 Spring 애플리케이션 프레임워크입니다.

**무엇이 바뀌었나** — Anthropic SDK 2.72.0을 포함하고, TTS·전사·Stability AI 이미지 모델의 관측성(observability)과 Redis 벡터 스토어 메타데이터 설정, stateless MCP 서버 customizer가 추가됐습니다. Cassandra, Anthropic, OpenAI, Ollama, Bedrock, Neo4j 통합의 버그를 다수 고쳤고 OpenAI SDK는 4.80.0, AWS SDK는 2.55.14로 올렸습니다.

**업그레이드할 때 확인할 점** — 2.0.1에서 올릴 때 위 통합을 쓰고 있다면 동작이 정상인지 확인하세요.

릴리스 공지: [v2.0.2](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.2)

### Spring Modulith 2.1.2 · 2.0.9 · 1.4.14

모듈형 Spring Boot 애플리케이션을 만드는 도구입니다.

**무엇이 바뀌었나** — 2.1.2는 Spring Boot 4.2의 중첩 테스트 클래스에서 `@ApplicationModuleTest`가 동작하게 고치고 발행 실패 재제출, MongoDB archive 모드, staleness monitor, 이벤트 해싱, AOT initializer 순서 등 약 15건을 수정했습니다. 2.0.9는 같은 수정을 2.0 라인에 반영했고 공유 모듈이 허용 대상에 자신을 나열하는 문제를 고쳤으며, 1.4.14는 그 문제와 git submodule 작업 트리에서 `WorkingDirectoryChangesDetector`가 실패하던 문제를 고쳤습니다.

**업그레이드할 때 확인할 점** — breaking change는 없습니다. 쓰는 라인의 최신 패치로 올리면 됩니다.

릴리스 공지: [2.1.2](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.2) · [2.0.9](https://github.com/spring-projects/spring-modulith/releases/tag/2.0.9) · [1.4.14](https://github.com/spring-projects/spring-modulith/releases/tag/1.4.14)

### Spring Vault 4.1.1

Spring용 시크릿 관리 라이브러리입니다.

**무엇이 바뀌었나** — `RestClientAdapter`가 POST 본문을 버리던 문제, 헬스 상태 역직렬화 문제, `CertificateBundle` 타입 오류, `SecretLeaseCreatedEvent`의 null 값 오류가 고쳐졌습니다. Spring Framework, Jackson, Bouncy Castle 등 의존성도 올랐습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [4.1.1](https://github.com/spring-projects/spring-vault/releases/tag/4.1.1)

### Storybook v10.6.4 (패치 2개)

UI 컴포넌트 개발 도구입니다.

**무엇이 바뀌었나** — v10.6.3은 Vitest 5 지원을 추가하고 Next.js 16.4의 app-router mock 크래시와 `ArgsStore` 반환 타입을 고쳤습니다. v10.6.4는 Jest에서 TypeScript 로더 훅 등록을 건너뛰도록 하는 단일 수정입니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [v10.6.4](https://github.com/storybookjs/storybook/releases/tag/v10.6.4) · [v10.6.3](https://github.com/storybookjs/storybook/releases/tag/v10.6.3)

### Terraform v1.17.0 · v1.16.7

Infrastructure as Code 도구입니다.

**무엇이 바뀌었나** — v1.17.0은 provider requirements에서 변수와 locals를 쓸 수 있고, 계획 옵션 `-minimal-refresh`가 추가됐으며, Terraform Policy가 GA(정식 출시)됐습니다. init 로그에 provider 버전이 찍히고 ephemeral resource용 mock provider를 지원하며, `pow`·`log` 함수의 panic이 고쳐졌습니다. v1.16.7은 폐기된 값이 있는 스키마를 `terraform test`할 때 나던 panic을 고치고 Go 1.26.10으로 빌드해 침해된 eMudhra 중간 CA를 거친 인증서를 신뢰하지 않습니다.

**업그레이드할 때 확인할 점** — v1.17.0은 JSON 출력에 `format_version` 필드가 추가됐으니 JSON 출력을 파싱한다면 확인하세요. 1.16 라인을 계속 쓴다면 v1.16.7로 올리면 됩니다.

릴리스 공지: [v1.17.0](https://github.com/hashicorp/terraform/releases/tag/v1.17.0) · [v1.16.7](https://github.com/hashicorp/terraform/releases/tag/v1.16.7)

## 마무리

Storybook 11.0.0 alpha, Prisma 8.0.0 RC(`rc.20`), Vitest 5.1.0 beta, Rspack 2.3.0 beta, Omarchy 4.5.0 RC, podman 6.2.0 RC처럼 프리릴리스 단계인 버전은 정식 릴리스가 아니라 이번 정리에서 제외했습니다. 릴리스는 있었지만 노트에서 변경점을 확인하지 못한 ClickHouse, LogTape, GitLab, Istio, React Router, Visual Studio Code, Flutter, Go, Obsidian은 본문에서 뺐고, TypeScript·Expo SDK·GraalVM·JDK·PyTorch·Android·Cursor·GitButler·Manus·Xcode는 공식 페이지를 불러오지 못하거나 확인이 충분하지 않아 이번 주 확인에서 빠졌습니다.
