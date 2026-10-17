---
layout: post
title: 이번 주 패키지 릴리스 정리 — 2026-10-17
date: 2026-10-17
published: 2026-10-17
category: 개발
tags: ['릴리스', '패키지', '주간정리']
comments: true
github: ''
---

## ✍️ 한 줄 요약

Next.js 16.4.1·15.5.28은 인증 없이 원격 코드를 실행할 수 있는 치명적 취약점(이미지 최적화 API)을 고친 보안 릴리스이고, Grafana(CVE 4건)·Storybook(보안 강화 10건)·podman(CVE-2026-107935)도 보안 패치가 이어졌습니다. React Native 0.88.0은 기존 코드를 고쳐야 하는 변경(breaking change)이 여럿 들어 있어 올리기 전 점검이 필요합니다.

## 이번 주 한눈에 보기

기간은 2026-10-10 ~ 2026-10-17(KST)이며, 추적 중인 87개 패키지 가운데 31개에 새 정식 릴리스가 있었습니다.

| 패키지 | 버전 | 릴리스 공지 | 변경점 |
|---|---|---|---|
| Node.js | v26.12.0 (Current) · v24.22.0 (LTS) | [있음](https://github.com/nodejs/node/releases/tag/v26.12.0) | ES 모듈 동기 로딩, 설정 파일 안정화 / 암호화 API 추가 |
| Zed | v1.24.2 · v1.23.3 | [있음](https://github.com/zed-industries/zed/releases/tag/v1.24.2) | Git 태그 생성, 바이너리 약 23% 축소 |
| pnpm | v12.14.0 · v11.28.6 · v10.34.7 | [있음](https://github.com/pnpm/pnpm/releases/tag/v12.14.0) | 원격 캐시 등 신규 기능, publish 토큰 검증 보안 수정 |
| Electron | v44.9.0 · v44.8.0 · v43.8.0 · v42.11.15 | [있음](https://github.com/electron/electron/releases/tag/v44.9.0) | Linux 알림 버튼, 안정성 수정 |
| Oxfmt | v0.73.0 | [있음](https://github.com/oxc-project/oxc/releases/tag/oxfmt_v0.73.0) | `associations` 설정, Astro 지원 |
| Oxlint | v1.88.0 | [있음](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.88.0) | LSP 설정 오류 표시, 규칙 옵션 추가 |
| Next.js | v16.4.2 · v15.5.28 | [있음](https://github.com/vercel/next.js/releases/tag/v16.4.1) | 치명적 RCE 취약점 수정 |
| Nuxt UI | v4.12.0 | [있음](https://github.com/nuxt/ui/releases/tag/v4.12.0) | 새 `Chart` 컴포넌트 |
| FastAPI | 0.143.3 (패치 3개) | [있음](https://github.com/fastapi/fastapi/releases/tag/0.143.3) | 스트림 직렬화 등 버그 수정 |
| Grafana | 13.2.4 · 13.1.8 · 13.0.11 · 12.4.13 | [있음](https://github.com/grafana/grafana/releases/tag/v13.2.4) | CVE 4건 보안 패치 |
| Grafana Tempo | v3.0.4 | [있음](https://github.com/grafana/tempo/releases/tag/v3.0.4) | Go 업데이트로 CVE 해소, 패닉 수정 |
| React Native | 0.88.0 | [있음](https://github.com/react/react-native/releases/tag/v0.88.0) | 가변 글꼴, breaking change 다수 |
| Angular | 22.2.3 · 20.3.34 | [있음](https://github.com/angular/angular/releases/tag/v22.2.3) | 프로토타입 오염 방어, XSRF 적용 범위 확대 |
| ESLint | v10.13.0 | [있음](https://github.com/eslint/eslint/releases/tag/v10.13.0) | 규칙 3개의 검사 범위 확대 |
| Nuxt | v4.6.2 (패치 2개) | [있음](https://github.com/nuxt/nuxt/releases/tag/v4.6.2) | 서버 라우트 규칙 대소문자 무시 |
| Prettier | 3.9.10 | [있음](https://github.com/prettier/prettier/releases/tag/3.9.10) | Markdown 표 파싱 성능 개선 |
| Rspack | v2.2.9 | [있음](https://github.com/web-infra-dev/rspack/releases/tag/v2.2.9) | 청크 분할 개선, 바이너리 축소 |
| Turborepo | v2.11.9 (패치 2개) | [있음](https://github.com/vercel/turborepo/releases/tag/v2.11.9) | `turbo setup`·`turbo exec` 추가 |
| Visual Studio Code | 1.141.1 | 없음 | MCP 샌드박스 승인 격리 수정 |
| Vitest | v5.0.5 (패치 2개) · v4.1.12 | [있음](https://github.com/vitest-dev/vitest/releases/tag/v5.0.5) | 캐시 디렉터리 표시, 브라우저 인스턴스 변경 |
| Argo CD | v3.5.5 · v3.4.11 · v3.3.16 | [있음](https://github.com/argoproj/argo-cd/releases/tag/v3.5.5) | CMP·하이드레이터 버그 수정 |
| KubeVirt | v1.9.1 | [있음](https://github.com/kubevirt/kubevirt/releases/tag/v1.9.1) | 핫플러그 제한, 알림 설정 변경 |
| ollama | v0.40.6 (패치 3개) | [있음](https://github.com/ollama/ollama/releases/tag/v0.40.6) | decision model 실행, 신규 모델 |
| podman | v6.1.4 · v5.8.9 | [있음](https://github.com/podman-container-tools/podman/releases/tag/v6.1.4) | gvproxy CVE 해소, WSL 3 수정 |
| React Native Skia | v3.6.1 · v3.5.0 · v3.4.4 | [있음](https://github.com/wcandillon/react-native-skia/releases/tag/v3.6.1) | snapshot view API 제거, `onSize` 폐기 |
| Rolldown | v1.2.14 | [있음](https://github.com/rolldown/rolldown/releases/tag/v1.2.14) | `output.charset`, re-export 처리 수정 |
| Rust | 1.99.1 | [있음](https://github.com/rust-lang/rust/releases/tag/1.99.1) | FFI `bool` 반환 등 버그 수정 |
| Storybook | v10.6.2 · v9.1.21 · v8.6.19 | [있음](https://github.com/storybookjs/storybook/releases/tag/v10.6.2) | 보안 강화 10건, Preact 11 지원 |
| Terraform | v1.16.6 | [있음](https://github.com/hashicorp/terraform/releases/tag/v1.16.6) | CVE-2026-78669 수정 |
| Ubuntu | 26.10 Stonking Stingray | [있음](https://ubuntu.com/blog/canonical-releases-ubuntu-26-10-stonking-stingray) | GNOME 51, 커널 7.3, Sequoia PGP |
| React | 19.3.1 · 19.2.9 · 19.1.10 · 19.0.9 | [있음](https://github.com/react/react/releases/tag/v19.3.1) | RSC 전송 규약 개선 |

## 패키지별 변경 내용

### Node.js v26.12.0 (Current) · v24.22.0 (LTS)

서버에서 자바스크립트를 실행하는 런타임입니다.

**무엇이 바뀌었나** — Current 라인인 v26.12.0에는 HTTP에 `websocketMask()`/`websocketUnmask()`가 추가됐고, 대부분의 ES 모듈이 동기 방식으로 로드되며, `process.finalization`이 RC 단계로, 설정 파일(config file) 기능이 안정(stable) 단계로 올라갔습니다. SQLite는 너무 큰 문자열을 만나면 비정상 종료 대신 예외를 던지고, `AbortSignal.any()` 누수와 querystring 디코딩 버그도 고쳐졌습니다. LTS인 v24.22.0에는 `crypto.parsePKCS12()`, 범용 MAC API, SIV/GCM-SIV 암호 모드, `util.throttle`/`util.debounce`, SQLite `StatementSync.close()`가 추가됐고 HTTP/2 쓰기 교착과 Windows `rmSync` 문제가 고쳐졌습니다. npm은 11.19.1로 올랐습니다. 두 릴리스 노트 모두 CVE는 없습니다.

**업그레이드할 때 확인할 점** — v26.12.0은 WebAssembly나 RX 지원이 없는 환경에서 이제 예외를 던지도록 바뀌었으니(semver-minor 항목), 그런 환경에서 돌리던 서비스라면 확인하세요. v24.22.0은 FIPS 모드(미국 정부 암호 인증 규격)에서 비 FIPS WebCrypto 경로가 비활성화되고, `net`의 `Server.prototype._listen2`와 HTTP/2의 `aborted` 속성이 deprecated(향후 제거 예정)로 표시됐습니다.

릴리스 공지: [v26.12.0](https://github.com/nodejs/node/releases/tag/v26.12.0) · [v24.22.0](https://github.com/nodejs/node/releases/tag/v24.22.0)

### Zed v1.24.2 · v1.23.3

Rust로 만든 빠른 코드 에디터입니다.

**무엇이 바뀌었나** — v1.24.2에는 Git 태그 생성 명령, 터미널 탭을 Agent Panel로 끌어다 놓는 기능, 선택한 텍스트로 파일 찾기를 미리 채우는 `file_finder.prefill_query_from_selection`, Go 테스트 버튼, Markdown/Mermaid 글꼴 설정, Gerrit/Gitiles 퍼머링크, 사용자 지정 Amazon Bedrock 모델 설정이 들어 있습니다. Linux x86_64 바이너리가 약 23% 작아져 시작도 빨라졌고, 인레이 힌트 편집 중 크래시, Linux 이모지 글꼴 깨짐, 원격 프로젝트 검색 멈춤이 고쳐졌습니다. v1.23.3은 이전 안정 라인의 패치로 Markdown 미리보기 글꼴, 편집 예측(edit predictions)의 워크트리 처리, Threads Sidebar 투명 배경 등을 고치고 Node.js를 v24 LTS 최신으로 올렸으며, 에이전트 체크포인트 기능에 동의한 경우에만 동작하는 텔레메트리가 추가됐습니다.

**업그레이드할 때 확인할 점** — 명시된 breaking change는 없습니다. 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [v1.24.2](https://github.com/zed-industries/zed/releases/tag/v1.24.2) · [v1.23.3](https://github.com/zed-industries/zed/releases/tag/v1.23.3)

### pnpm v12.14.0 · v11.28.6 · v10.34.7

Node.js 패키지 매니저입니다.

**무엇이 바뀌었나** — 12.x 라인에서는 이번 주에 네 번의 마이너 릴리스가 나왔습니다. v12.14.0은 `sideEffectsCache.exclude` 설정을 더해 시스템 라이브러리에 의존해 캐시 키를 만들 수 없는 패키지를 빌드 캐시에서 뺄 수 있게 했고, `pnpm install`이 일일 업데이트 확인보다 먼저 끝나면 확인을 건너뜁니다. v12.13.0은 `pnpm profile`·`pnpm token` 명령과 네트워크 파일시스템용 `storeIndexFormat: files` 설정을, v12.12.x는 작업 결과·의존성 빌드의 원격 캐시, `addMissingPeerTypes` 설정, OIDC 인증을 쓰는 `pnpm dist-tag`, 다운로드 도구용 `tool:` 프로토콜을 추가했습니다. v11.28.6은 보안 수정으로, `pnpm publish`가 CI 신원 토큰을 대상 레지스트리와 audience(토큰이 쓰일 대상)가 일치할 때만 쓰도록 했습니다. v10.34.7은 미러가 npm 서명을 제거하거나 다시 서명해도 `packageManager`에 지정한 pnpm 버전으로 전환되게 고친 패치입니다.

**업그레이드할 때 확인할 점** — 노트에 breaking change 표시는 없지만, 12.12.x부터 `pnpm publish`가 토큰 audience를 레지스트리와 대조하므로 CI에서 토큰으로 배포한다면 올린 뒤 publish가 정상 동작하는지 확인하세요.

릴리스 공지: [v12.14.0](https://github.com/pnpm/pnpm/releases/tag/v12.14.0) · [v11.28.6](https://github.com/pnpm/pnpm/releases/tag/v11.28.6) · [v10.34.7](https://github.com/pnpm/pnpm/releases/tag/v10.34.7)

### Electron v44.9.0 · v44.8.0 · v43.8.0 · v42.11.15

웹 기술로 데스크톱 앱을 만드는 플랫폼입니다.

**무엇이 바뀌었나** — v44.9.0은 macOS에서 다른 앱의 Dock 아이콘 아래에 창을 표시하는 앱 shim을 추가했고, 링크로 연 창이 오프너(연 쪽 창)의 세션과 `webPreferences`를 쓰도록 고쳤으며, `setCertificateVerifyProc`이 첫 요청과 동시에 들어간 요청에도 적용되게 했습니다. v44.8.0은 Linux 알림 액션 버튼을 추가했고 `net.fetch`가 Network Service 재시작 후 실패하던 문제, `utilityProcess` 메시지 유실, Windows에서 `win.isFullScreen()`이 낡은 값을 돌려주던 문제를 고쳤으며 Chromium 152.0.7977.167, Node.js v24.22.0으로 올랐습니다. v43.8.0과 v42.11.15는 Linux GTK 크래시, macOS 배경 클릭 누락, `net.fetch` 실패, `utilityProcess` 메시지 유실을 고친 백포트 패치입니다.

**업그레이드할 때 확인할 점** — breaking change는 없습니다. 인증서 검증 로직(`setCertificateVerifyProc`)을 쓰는 앱은 동작을 한 번 확인하세요.

릴리스 공지: [v44.9.0](https://github.com/electron/electron/releases/tag/v44.9.0) · [v44.8.0](https://github.com/electron/electron/releases/tag/v44.8.0) · [v43.8.0](https://github.com/electron/electron/releases/tag/v43.8.0) · [v42.11.15](https://github.com/electron/electron/releases/tag/v42.11.15)

### Oxfmt v0.73.0

JavaScript/TypeScript 포매터입니다.

**무엇이 바뀌었나** — `associations` 설정으로 파일 경로별 언어를 지정할 수 있게 됐고, Astro 지원(LSP, `prettier-plugin-astro`, `--migrate prettier`)과 LSP 루트 설정 오류 표시가 추가됐습니다. 새 TOML 포매터 crate도 들어갔고, 심볼릭 링크 설정 파일 탐색, CSS-in-JS 자리표시자 처리, `export default` 줄바꿈 문제가 고쳐졌습니다.

**업그레이드할 때 확인할 점** — `--migrate prettier`(Prettier 설정을 옮겨 주는 기능)의 동작이 바뀌어 breaking으로 표시돼 있으니, 이미 이전한 설정이 있다면 결과를 다시 확인하세요.

릴리스 공지: [oxfmt_v0.73.0](https://github.com/oxc-project/oxc/releases/tag/oxfmt_v0.73.0)

### Oxlint v1.88.0

JavaScript/TypeScript 린터입니다.

**무엇이 바뀌었나** — LSP가 설정 오류를 클라이언트에 보여 주고, `prefer-query-selector` 규칙에 `allowWithVariables` 옵션이 추가됐습니다. `sort-keys`는 ESLint와 같은 자연 정렬을 쓰게 됐고, `prefer-bigint-literals`는 정밀도가 손실되는 경우 자동 수정을 하지 않습니다. 심볼릭 링크 설정을 따라가고 stderr를 blocking으로 설정하는 수정도 들어갔습니다.

**업그레이드할 때 확인할 점** — 주석 위치를 저장하는 방식(AST) 변경 2건이 breaking으로 표시됐지만 파서 API를 직접 쓰는 사용자에게 해당하는 변경입니다. 린터만 쓴다면 `sort-keys` 결과가 달라지는지 정도만 보면 됩니다.

릴리스 공지: [oxlint_v1.88.0](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.88.0)

### Next.js v16.4.2 · v15.5.28

서버 렌더링 React 프레임워크입니다.

**무엇이 바뀌었나** — v16.4.1(10-14)은 보안 전용 릴리스로, 치명적(Critical)인 인증 없는 원격 코드 실행 2건을 고쳤습니다. 하나는 `use cache` 함수가 typed array를 반환할 때(GHSA-673q-mjm6-r5xr), 다른 하나는 SVG를 쓰는 Image Optimization API(GHSA-2464-fhr4-w9xw)에서 발생합니다. App Router Server Actions의 서비스 거부(High, GHSA-p3m5-59mp-jv5r)도 함께 고쳤습니다. v15.5.28도 SVG 이미지 최적화 RCE와 Server Actions 서비스 거부를 고친 보안 릴리스입니다. v16.4.2(10-15)는 Turbopack 중심의 백포트로, turbo-tasks 스냅샷 일관성, 지연 dynamic import 청크 충돌, 모듈 해석 시 realpath 오류 무시(Node.js와 동일), GC 경로를 고쳤습니다.

**업그레이드할 때 확인할 점** — `use cache` 반환값, 이미지 최적화 API(SVG), Server Actions 중 하나라도 쓴다면 즉시 올리세요. breaking change는 없습니다.

릴리스 공지: [v16.4.1](https://github.com/vercel/next.js/releases/tag/v16.4.1) · [v16.4.2](https://github.com/vercel/next.js/releases/tag/v16.4.2) · [v15.5.28](https://github.com/vercel/next.js/releases/tag/v15.5.28)

### Nuxt UI v4.12.0

Nuxt/Vue용 UI 컴포넌트 라이브러리입니다.

**무엇이 바뀌었나** — TanStack Charts 기반의 새 `Chart` 컴포넌트(라인·영역·막대·도넛, 서버 렌더 SVG)가 추가됐습니다. `@tanstack/charts`는 선택적 peer 의존성이라 차트를 쓸 때만 설치하면 됩니다. `@nuxtjs/i18n`을 쓰면 `App`이 로케일을 자동으로 따르고, 여러 컴포넌트에 props와 이벤트가 늘었으며, 페이지 JS가 최대 27% 줄고 오버레이를 지연 로딩합니다. SelectMenu, Table, Drawer 등의 버그와 접근성 라벨도 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 명시된 breaking은 없습니다. i18n 연동 안내에 따라 `import * as locales`와 `UApp`의 수동 `:locale` 바인딩은 제거하는 편이 좋습니다.

릴리스 공지: [v4.12.0](https://github.com/nuxt/ui/releases/tag/v4.12.0)

### FastAPI 0.143.3 (패치 3개)

Python 웹 프레임워크입니다.

**무엇이 바뀌었나** — 0.143.1~0.143.3 모두 버그 수정입니다. 0.143.3은 JSONL·SSE 스트림에서 NaN·Infinity 같은 유한하지 않은 실수 값을 직렬화할 때 생기던 문제를, 0.143.2는 프론트엔드 폴백 파일 확인이 막히던 문제를, 0.143.1은 `iter_route_contexts()`에 라우트 메타데이터가 빠지던 문제를 고쳤습니다. 0.143.2에는 번역 갱신과 의존성 업데이트도 포함됩니다.

**업그레이드할 때 확인할 점** — 새 기능, 파괴적 변경, 지원 중단은 없습니다. 스트리밍 응답으로 실수 값을 내보내거나 프론트엔드 폴백 파일을 쓴다면 올린 뒤 동작만 확인하세요.

릴리스 공지: [0.143.3](https://github.com/fastapi/fastapi/releases/tag/0.143.3)

### Grafana 13.2.4 · 13.1.8 · 13.0.11 · 12.4.13

메트릭 대시보드 도구입니다.

**무엇이 바뀌었나** — 네 라인에 걸친 보안 패치입니다. 13.2.4·13.1.8·13.0.11은 CVE-2026-15577, CVE-2026-33374, CVE-2026-93294, CVE-2026-95502를 고쳤고, 12.4.13은 CVE-2026-95502를 제외한 세 건을 고쳤습니다. 네 버전 모두 Enterprise의 SCIM 프로비저닝(계정 자동 연동) 관련 CVE-2026-92539도 수정합니다. 알림(Alerting)에서 다른 호스트로 OAuth2 리다이렉트할 때 민감한 헤더를 제거하고, 대시보드는 컬렉션 삭제가 지원되지 않을 때 대체 동작을 합니다. 13.2.4에는 Git Sync·프로비저닝 개선(미동기화 폴더 미리보기 허용, 잘못된 리소스 이름 사전 거부, 포크 PR 미리보기 건너뛰기)도 들어 있습니다.

**업그레이드할 때 확인할 점** — 파괴적 변경과 지원 중단은 없습니다. 운영 중인 인스턴스는 보안 패치이므로 각 라인의 최신 패치로 올리는 것을 권합니다.

릴리스 공지: [13.2.4](https://github.com/grafana/grafana/releases/tag/v13.2.4) · [13.1.8](https://github.com/grafana/grafana/releases/tag/v13.1.8) · [13.0.11](https://github.com/grafana/grafana/releases/tag/v13.0.11) · [12.4.13](https://github.com/grafana/grafana/releases/tag/v12.4.13)

### Grafana Tempo v3.0.4

분산 트레이싱 백엔드입니다.

**무엇이 바뀌었나** — Go를 1.26.9로 올려 여러 CVE를 해소했고 grpc, thrift, x/net, x/text, x/crypto, OpenTelemetry 로그 모듈 등 의존성을 갱신했습니다. 버그 수정으로는 live-store에서 같은 트레이스에 새 스팬이 들어올 때 `FindTraceByID`에서 나던 패닉(비정상 종료)과, query-frontend에서 인스턴트 쿼리와 범위 메트릭 쿼리 사이에 드물게 생기던 캐시 충돌이 있습니다.

**업그레이드할 때 확인할 점** — 파괴적 변경과 지원 중단은 없습니다. 3.0.x 운영자는 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [v3.0.4](https://github.com/grafana/tempo/releases/tag/v3.0.4)

### React Native 0.88.0

React로 모바일 앱을 만드는 프레임워크입니다.

**무엇이 바뀌었나** — Android에서 `Text`·`TextInput`의 `fontVariationSettings`(가변 글꼴 축 조절)와 Java TurboModule의 `ArrayBuffer`를 지원합니다. iOS에는 SceneDelegate 수명주기 지원과 에셋 카탈로그 이미지가 추가됐고, React 19.3.0과 Metro 0.87.0으로 맞춰졌으며 Hermes도 올라갔습니다. 보안으로는 `shell-quote`를 1.8.4로 올려 CVE-2026-9277을 해소했습니다.

**업그레이드할 때 확인할 점** — breaking change가 여럿입니다. Babel에서 `Platform.OS`·`Platform.select`를 인라인하려면 `inlinePlatform` 옵션이 추가로 필요하고, 최소 Metro 버전은 0.87.1입니다. Android `ArrayBuffer`는 동기 호출 중에만 유효하므로 오래 쓰려면 복사해야 합니다. `backgroundSize`·`backgroundPosition`·`backgroundRepeat`의 `experimental_` 접두사가 제거됐고, 일부 핵심 컴포넌트 뷰 설정에서 `RCT` 접두사 이름이 빠졌으며, C++ `UIManager::startSurface` 시그니처가 바뀌었습니다. 지원 중단 대상은 Android `InputAccessoryView`, `react-native/Libraries/Core/InitializeCore`(대체: `react-native/setup-env`), `ReactFragment`의 `fabricEnabled` 등입니다.

릴리스 공지: [v0.88.0](https://github.com/react/react-native/releases/tag/v0.88.0)

### Angular 22.2.3 · 20.3.34

JavaScript 프레임워크입니다.

**무엇이 바뀌었나** — 22.2.3은 common의 파라미터 인코딩과 compiler의 JIT 컴파일에서 프로토타입 오염(객체 기본 속성을 조작하는 공격) 방어를 강화했습니다. compiler는 클래스 바인딩 이름의 점 지원과 popover 속성 바인딩 지원이 추가되고 주석 스코프 처리와 동등성 비교 오류가 고쳐졌으며, core는 두 앱이 `APP_ID`를 공유할 때 이벤트 리플레이가 충돌하던 문제와 애니메이션 중인 임베디드 뷰 파괴 오류가 고쳐졌습니다. forms는 blur 시 불필요한 변경 감지를 줄였습니다. 20.3.34는 오류 시 i18n 플래그가 누수되던 문제를 고치고, 같은 출처(same-origin)의 절대 URL 요청에도 XSRF 보호가 적용되게 했습니다.

**업그레이드할 때 확인할 점** — 22.2.3은 그대로 올려도 됩니다. 20.3.34는 절대 URL로 같은 서버를 부르던 요청에 XSRF 헤더가 붙게 되므로 서버 쪽 XSRF 검증과 맞는지 확인하세요.

릴리스 공지: [v22.2.3](https://github.com/angular/angular/releases/tag/v22.2.3) · [v20.3.34](https://github.com/angular/angular/releases/tag/v20.3.34)

### ESLint v10.13.0

JavaScript 코드 분석 도구입니다.

**무엇이 바뀌었나** — 규칙 세 가지의 검사 범위가 넓어졌습니다. `no-use-before-define`은 IIFE(즉시 실행 함수) 안의 참조도 보고하고, `no-obj-calls`는 `globalThis`를 호출 가능한 객체처럼 쓰는 경우를 잡으며, `no-unsafe-optional-chaining`은 `yield*` 표현식도 검사합니다. `no-var`와 `one-var` 자동 수정을 함께 쓸 때 `let`이 중복 선언되던 문제가 고쳐졌고, `no-redeclare`는 선언이 하나뿐인 변수 스캔을 건너뛰어 빨라졌습니다.

**업그레이드할 때 확인할 점** — 파괴적 변경은 없지만 검사 범위가 넓어진 만큼 기존 코드에서 새 경고가 나올 수 있으니, 올린 뒤 lint 결과를 확인하세요.

릴리스 공지: [v10.13.0](https://github.com/eslint/eslint/releases/tag/v10.13.0)

### Nuxt v4.6.2 (패치 2개)

서버 렌더링 Vue.js 프레임워크입니다.

**무엇이 바뀌었나** — 새 기능 없이 버그 수정 중심의 패치 두 개입니다. v4.6.1은 Nitro(Nuxt의 서버 엔진)가 요청 이벤트의 웹 표준 뷰를 처음 접근할 때 만들도록 바꾸는 성능 개선을 넣었습니다. v4.6.2는 서버 아일랜드(서버에서 렌더링하는 부분 컴포넌트)의 head 출력이 `useHeadSafe` 규칙을 따르게 하고, 서버 라우트 규칙을 기본적으로 대소문자 구분 없이 매칭하게 했으며, 페이지 전환과 내비게이션 오류 상태 처리를 고쳤습니다.

**업그레이드할 때 확인할 점** — breaking change·지원 중단·보안 항목은 없습니다. 서버 라우트 규칙의 대소문자 매칭이 달라졌고 개발 서버 오류 오버레이 동작도 바뀌었으니 해당 부분만 확인하세요.

릴리스 공지: [v4.6.2](https://github.com/nuxt/nuxt/releases/tag/v4.6.2) · [v4.6.1](https://github.com/nuxt/nuxt/releases/tag/v4.6.1)

### Prettier 3.9.10

코드 포매터입니다.

**무엇이 바뀌었나** — Markdown 표를 해석하는 라이브러리(micromark-extension-gfm-table)를 업데이트해 표 파싱 성능 문제를 고쳤습니다. 큰 표가 많은 문서에서 포맷이 느렸다면 개선됩니다.

**업그레이드할 때 확인할 점** — 새 기능·breaking change·지원 중단은 없습니다. 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [3.9.10](https://github.com/prettier/prettier/releases/tag/3.9.10)

### Rspack v2.2.9

Rust로 만든 웹 번들러입니다.

**무엇이 바뀌었나** — 청크 분할(코드를 여러 파일로 나누는 작업) 알고리즘을 개선해 청크 사이에 중복되는 모듈이 줄고 번들이 작아질 수 있습니다. 브라우저 목록 데이터를 압축해 네이티브 바이너리가 2.13MB(3.08%) 줄었고, 성능 최적화와 CSS, 지연 컴파일(lazy compilation), 파일 감시(watcher), 타입 관련 버그 수정이 많이 들어갔습니다. `xxhash-rust`를 v0.8.16으로 올린 항목은 보안 수정으로 표시돼 있습니다.

**업그레이드할 때 확인할 점** — breaking change와 지원 중단은 없지만 청크 분할이 바뀐 만큼 빌드 산출물의 구성과 크기를 확인하세요.

릴리스 공지: [v2.2.9](https://github.com/web-infra-dev/rspack/releases/tag/v2.2.9)

### Turborepo v2.11.9 (패치 2개)

JavaScript/TypeScript 모노레포 빌드 시스템입니다.

**무엇이 바뀌었나** — `turbo setup`이 대폭 추가돼 Node, pnpm, Yarn, Bun, npm, uv/Python, Rust, Go 같은 도구를 설치·검증하고, 관리되는 환경에서 명령을 실행하는 `turbo exec`도 새로 생겼습니다. bash, zsh, fish, PowerShell용 셸 훅, `turbo.json`의 루트 전용 setup 정책, `turbo.lock` 항목, Windows x64 지원이 함께 들어갔습니다. 0이 아닌 종료 코드 뒤에도 태스크 출력을 보존하고, 비 UTF-8 인자로 인한 크래시와 캐시 복원 시 Git 메타데이터 쓰기 차단 문제를 고쳤으며 성능도 개선됐습니다.

**업그레이드할 때 확인할 점** — breaking change 표시는 없지만, 유닉스 셸 훅을 자동 설치하지 않도록 바뀌었고 setup 라이프사이클 스크립트 제어 옵션이 제거됐습니다. `turbo setup`을 쓰는 팀은 동작 변화를 확인하세요.

릴리스 공지: [v2.11.9](https://github.com/vercel/turborepo/releases/tag/v2.11.9)

### Visual Studio Code 1.141.1

Microsoft의 코드 에디터입니다.

**무엇이 바뀌었나** — 1.141.1에서 확인되는 변경은 MCP(AI 도구 연동 프로토콜) 샌드박스 권한 승인 격리 수정 하나로, MSRC(Microsoft 보안 대응 센터) 케이스 138669를 참조합니다. 루트 샌드박스 설정은 공유 deny 규칙으로 제한하고 승인은 요청한 서버 범위로 한정하는 내용입니다. 같은 기간 나온 1.142.0과 1.141.2는 GitHub 릴리스 본문에서 변경점을 확인하지 못했습니다.

**업그레이드할 때 확인할 점** — MCP 서버를 쓴다면 1.141.1 이상으로 업데이트하세요. GitHub 릴리스 본문에는 노트가 없어 릴리스 공지는 없음으로 표기합니다.

릴리스 공지: 없음 (태그: [1.141.1](https://github.com/microsoft/vscode/releases/tag/1.141.1))

### Vitest v5.0.5 (패치 2개) · v4.1.12

Vite 기반 유닛 테스트 프레임워크입니다.

**무엇이 바뀌었나** — v5.0.4에서 `CACHEDIR.TAG`로 캐시 디렉터리를 표시(experimental)하고, `test.ui.theme` 옵션, 트레이스 뷰 확대/맞춤 조작, `--changed` 실행 시 영향받은 테스트 수 출력이 추가됐습니다. 브라우저 인스턴스를 워커처럼 실행하게 되면서 기본 인스턴스 수가 줄었고, `fsModuleCache`는 기본 활성화됐습니다. v5.0.5는 Vite 기본 `fs.deny` 규칙 유지, `--changed`의 따옴표 파일명 처리, 뒤 훅이 실패해도 훅 정리를 실행하는 버그 수정입니다. v4.1.12는 수동 목(mock)과 리다이렉트 목을 견고하게 하는 수정 1건을 백포트했습니다.

**업그레이드할 때 확인할 점** — 커스텀 `maxWorkers`를 쓰면 성능이 떨어질 수 있다는 경고가 있으니 브라우저 모드와 `maxWorkers`를 쓰는 환경은 올린 뒤 확인하세요. 보안 권고는 없습니다. v4를 유지 중이라면 목을 쓰는 테스트만 확인하면 됩니다.

릴리스 공지: [v5.0.5](https://github.com/vitest-dev/vitest/releases/tag/v5.0.5) · [v4.1.12](https://github.com/vitest-dev/vitest/releases/tag/v4.1.12)

### Argo CD v3.5.5 · v3.4.11 · v3.3.16

Kubernetes 배포(GitOps) 도구입니다.

**무엇이 바뀌었나** — 세 라인 모두 백포트 버그 수정 모음입니다. Reposerver에서 CMP(설정 관리 플러그인) 실패 후 오래된 매니페스트와 고루틴 누수가 생기던 문제, 하이드레이터의 ref lock 오류 재시도와 영구 노트 푸시 실패 보고, OCI 태그 목록 캐시, 심볼릭 링크 대상 경로의 untar 검사, CronWorkflow 예약 시간 형식, 쓰기 repo(creds) 엔드포인트의 URL 라우팅이 고쳐졌습니다. 의존성은 go-git, grpc 1.84.0, oras-go 2.6.2, Go 1.26.9 등으로 갱신됐습니다.

**업그레이드할 때 확인할 점** — 새 기능, breaking change, 보안 항목은 없습니다. CMP나 OCI 소스, Git 하이드레이터, repo creds 라우팅을 쓰는 경우에만 올린 뒤 확인하세요.

릴리스 공지: [v3.5.5](https://github.com/argoproj/argo-cd/releases/tag/v3.5.5) · [v3.4.11](https://github.com/argoproj/argo-cd/releases/tag/v3.4.11) · [v3.3.16](https://github.com/argoproj/argo-cd/releases/tag/v3.3.16)

### KubeVirt v1.9.1

Kubernetes 위에서 가상 머신을 관리하는 애드온입니다.

**무엇이 바뀌었나** — 83개 변경이 담긴 버그 수정 중심 패치입니다. 게스트가 디스크, 메모리 balloon, RNG, watchdog 같은 핵심 PCI 장치를 핫플러그 방식으로 분리하지 못하게 막았고, Vera Rubin GPU(10de:3041)를 Grace GPU로 인식해 패스스루를 지원하며 libvirt를 11.10.0-19.el9로 올렸습니다. hyperv panic 장치를 쓰는 Windows VM이 크래시 후 메모리 덤프를 마치고 재부팅할 수 있게 고쳤고, VFIO CDEV 커널 옵션이 없는 커널에서의 PCI 패스스루 회귀와 VM 복원 실패도 고쳤습니다.

**업그레이드할 때 확인할 점** — OrphanedVirtualMachineInstances와 VirtLauncherPodsStuckFailed 알림이 이제 클러스터 범위 네임스페이스 레이블을 요구하므로 알림 설정을 확인하세요. CBT를 켠 VM의 백엔드 스토리지 PVC도 1Gi 커집니다.

릴리스 공지: [v1.9.1](https://github.com/kubevirt/kubevirt/releases/tag/v1.9.1)

### ollama v0.40.6 (패치 3개)

오픈 모델을 로컬에서 실행하는 도구입니다.

**무엇이 바뀌었나** — v0.40.4에서 `ollama run`으로 decision model(예/아니오 질문, 분류, 점수화용 모델)을 실행할 수 있게 됐습니다(예: `ollama run nimble --ask ...`). v0.40.5는 Nemotron 3.5 Super(120B)와 Bolt(74B) 모델을 추가했고, v0.40.6은 Windows 러너 프로세스 고아 문제 수정, GGUF q2_0 텐서 타입 지원, 클라우드 clef 실행을 넣었습니다. `ollama launch`가 유료 플랜 없이 사용량 크레딧으로 동작하고, Responses API 커스텀 툴 콜 오류와 멀티모달 임베딩 문제가 고쳐졌으며 MLX 러너 안정성이 개선됐습니다.

**업그레이드할 때 확인할 점** — breaking change와 보안(CVE) 항목은 없습니다. `--ask` 모드의 질문 키가 식별자 방식으로 바뀌었으니 이 모드를 쓰는 스크립트가 있다면 확인하세요. (v0.40.6의 릴리스 페이지가 프리릴리스로 표시된다는 상반된 정보가 있었으나, 피드에는 정식 릴리스로 올라와 있어 포함했습니다.)

릴리스 공지: [v0.40.6](https://github.com/ollama/ollama/releases/tag/v0.40.6)

### podman v6.1.4 · v5.8.9

컨테이너 엔진입니다.

**무엇이 바뀌었나** — 두 버전 모두 WSL 3에서 Podman이 동작하지 않던 문제(#29749)를 고쳤고, gvproxy(네트워크 프록시 구성요소)를 v0.9.0으로 올려 CVE-2026-107935를 해결했습니다. v6.1.4는 Buildah v1.45.2와 Storage v1.64.2로, v5.8.9는 Buildah v1.43.5와 Storage v1.62.2로 갱신됐고, v5.8.9에서는 `podman machine start`가 시그널로 중단될 때 Mac에서 VM이 불일치 상태로 남던 버그도 고쳤습니다.

**업그레이드할 때 확인할 점** — 새 기능과 호환성을 깨는 변경은 없습니다. 보안 패치가 들어 있으니 올리는 것을 권합니다.

릴리스 공지: [v6.1.4](https://github.com/podman-container-tools/podman/releases/tag/v6.1.4) · [v5.8.9](https://github.com/podman-container-tools/podman/releases/tag/v5.8.9)

### React Native Skia v3.6.1 · v3.5.0 · v3.4.4

React Native에서 Skia 그래픽 엔진을 쓰게 해 주는 라이브러리입니다.

**무엇이 바뀌었나** — v3.6.1(3.6.0 포함)은 SurfaceView 캔버스를 그릴 때 디스플레이 주사율을 요청하도록 고쳤습니다. v3.5.0은 canvaskit-wasm을 0.41.1로 올려 새 path builder가 도형을 선형 시간에 추가하게 했고, Apple 플랫폼에서 백그라운드일 때 렌더링을 멈췄다가 포그라운드 복귀 시 따라잡습니다. v3.4.x(3.4.0~3.4.4)에서는 tvOS용 Skia Graphite와 Dawn 지원이 추가됐고 폰트 family style 매칭과 컨텍스트 등록 오류가 고쳐졌습니다(3.4.1~3.4.3 노트는 확인하지 못했습니다).

**업그레이드할 때 확인할 점** — v3.6.0에서 snapshot view API가 제거됐으니(#4249) 쓰는 앱은 사용처를 먼저 점검하세요. v3.5.0에서 `onSize` prop이 deprecated됐으므로(#4244) 대체 방법도 확인해야 합니다.

릴리스 공지: [v3.6.1](https://github.com/wcandillon/react-native-skia/releases/tag/v3.6.1) · [v3.5.0](https://github.com/wcandillon/react-native-skia/releases/tag/v3.5.0) · [v3.4.4](https://github.com/wcandillon/react-native-skia/releases/tag/v3.4.4)

### Rolldown v1.2.14

Rust로 만든 JavaScript/TypeScript 번들러입니다.

**무엇이 바뀌었나** — `output.charset` 옵션이 추가됐고, 코드 스플리팅 시 서로 독립적인 ESM re-export를 소비자별로 따로 라우팅합니다. 래핑된 ESM re-export의 초기화 보존, strict 실행 순서 모드의 eager 로딩, 네임스페이스 shim의 깊은 읽기와 이름 충돌, 소스맵 경계 보존, dev 모드 HMR 파일 감시, CommonJS 최상위 `this` 처리가 고쳐졌습니다. re-export된 네임스페이스 멤버에 쓰면 이제 에러를 보고하고, `close()`를 반복 호출해도 아무 일도 일어나지 않습니다. oxc는 0.154.0으로 올랐습니다.

**업그레이드할 때 확인할 점** — 번들 결과가 달라질 수 있으니 올린 뒤 빌드 결과를 확인하세요.

릴리스 공지: [v1.2.14](https://github.com/rolldown/rolldown/releases/tag/v1.2.14)

### Rust 1.99.1

프로그래밍 언어입니다.

**무엇이 바뀌었나** — 버그 수정만 담긴 패치입니다. UEFI와 임베디드 대상에서 `wcslen` 심볼이 빠져 있던 문제, x86_64에서 FFI(다른 언어와 연결하는 기능)의 `bool` 반환값이 잘못 컴파일되던 문제, macOS에서 rust-lld 링커가 `libLLVM` 검색 경로(rpath)를 추가하지 않던 문제를 고쳤습니다.

**업그레이드할 때 확인할 점** — 새 기능, 호환성 깨짐, 폐기 항목은 없습니다. FFI `bool` 반환값을 쓰는 x86_64 코드, UEFI/임베디드, macOS 빌드를 쓴다면 1.99.1로 올려 다시 빌드하세요.

릴리스 공지: [1.99.1](https://github.com/rust-lang/rust/releases/tag/1.99.1)

### Storybook v10.6.2 · v9.1.21 · v8.6.19

UI 컴포넌트 개발 도구입니다.

**무엇이 바뀌었나** — v9.1.21과 v8.6.19는 보안 강화 10건을 묶은 릴리스입니다. 개발 서버 채널에서 매니저와 프리뷰의 역할을 분리하고, 메뉴 항목이 임의 채널 이벤트를 보내지 못하게 막았으며, postMessage를 알려진 매니저 출처로 제한하고 localhost가 아닌 출처의 iframe 삽입을 차단했습니다. 프로젝트 밖 컴포넌트 검색 요청은 거부하고, MCP에는 호스트 경고와 출처 검증을 더했으며, 스토리 저장 경로는 프로젝트 루트 안으로 제한하고 이름과 인자 키를 식별자로 검증합니다. Addon Vitest의 브라우저 파일 쓰기와 명령 실행은 비활성화됐습니다. v10.6.2는 Preact 11을 지원하고, Yarn 1에서 CLI 출력이 숨겨지던 문제와 `enhanceArgTypes`의 TypeScript 타입을 고쳤으며 보안 권고 GHSA-f2ph-cmg5-wxc8, GHSA-px85-f4q5-jh77을 패치했습니다.

**업그레이드할 때 확인할 점** — 개발 서버를 외부에 노출하거나 Addon Vitest를 쓴다면 동작이 막히지 않는지 확인하세요. v10.6.2에서 Angular-Vite를 쓴다면 `@analogjs/vite-plugin-angular` 2.7.3 이상이 필요합니다.

릴리스 공지: [v10.6.2](https://github.com/storybookjs/storybook/releases/tag/v10.6.2) · [v9.1.21](https://github.com/storybookjs/storybook/releases/tag/v9.1.21) · [v8.6.19](https://github.com/storybookjs/storybook/releases/tag/v8.6.19)

### Terraform v1.16.6

Infrastructure as Code 도구입니다.

**무엇이 바뀌었나** — `terraform init`이 대소문자가 섞인 태그 키로 선택한 클라우드 워크스페이스를 제대로 찾도록 고쳤고, 테스트에서 대상 모듈이 폐기(deprecated)된 출력을 쓸 수 있게 했습니다. HTTP/2 자원 고갈 문제(CVE-2026-78669)도 수정했는데, 악용하려면 침해된 레지스트리가 필요하고 릴리스 노트는 이를 Terraform 코어 보안 보장 범위 밖으로 설명합니다.

**업그레이드할 때 확인할 점** — 파괴적 변경은 없습니다. 1.16 라인 사용자는 올리는 것이 안전합니다.

릴리스 공지: [v1.16.6](https://github.com/hashicorp/terraform/releases/tag/v1.16.6)

### Ubuntu 26.10 Stonking Stingray

Linux 배포판입니다(LTS가 아닌 중간 릴리스).

**무엇이 바뀌었나** — GNOME 51, 개편된 App Center, dbus-broker(기본 D-Bus 구현), Linux 커널 7.3(Intel Xe3P, AMD Zen 6, NVIDIA 615 지원), 오프라인 온디바이스 음성 인식 에이전트 Myna(선택 사용), Microsoft Entra ID 연동이 들어왔습니다. 툴체인은 ROCm 10.0, LLVM 22.1.6, GCC 15.2.0, Python 3.14.7, Rust 1.97.1, Go 1.27로 갱신됐습니다. 보안 면에서는 Sequoia PGP 기반 APT 저장소 서명 검증(양자내성 서명 대비), openCryptoki의 ML-DSA·ML-KEM 연동, 신뢰 루트 하드웨어가 없는 장치에서도 쓸 수 있는 TPM 기반 전체 디스크 암호화(선택적 PIN/암호)가 추가됐습니다.

**업그레이드할 때 확인할 점** — 글에는 호환성을 깨는 변경이나 지원 중단이 명시돼 있지 않습니다. 다만 GnuPG가 Sequoia PGP로 대체되고 Rust 기반 coreutils 전환이 완료되는 등 기존 구성 요소가 교체되므로 이 부분의 영향을 확인하세요.

릴리스 공지: [Canonical releases Ubuntu 26.10](https://ubuntu.com/blog/canonical-releases-ubuntu-26-10-stonking-stingray)

### React 19.3.1 · 19.2.9 · 19.1.10 · 19.0.9

자바스크립트 UI 라이브러리입니다.

**무엇이 바뀌었나** — 네 버전 모두 릴리스 본문이 React Server Components의 "transport protocol 개선" 한 줄뿐입니다. 서버와 클라이언트가 컴포넌트 데이터를 주고받는 통신 규약이 개선됐다는 뜻이며, 그 이상은 원문에서 확인할 수 없습니다.

**업그레이드할 때 확인할 점** — 보안·CVE, 호환성 깨짐, 새 기능 언급은 없습니다. RSC를 쓴다면 자신이 쓰는 마이너 라인에 맞는 패치로 올리면 됩니다.

릴리스 공지: [19.3.1](https://github.com/react/react/releases/tag/v19.3.1) · [19.2.9](https://github.com/react/react/releases/tag/v19.2.9) · [19.1.10](https://github.com/react/react/releases/tag/v19.1.10) · [19.0.9](https://github.com/react/react/releases/tag/v19.0.9)

## 마무리

릴리스 노트를 확인하지 못한 항목(GitLab, Istio, Prisma, ClickHouse, LogTape, Optique, VS Code 1.142.0·1.141.2, Zed v1.24.3)은 본문에서 뺐고, TypeScript·Expo SDK·GraalVM·JDK·PyTorch·Android·Cursor·GitButler·Manus·Xcode는 공식 페이지를 불러오지 못해 이번 주 확인에서 빠졌습니다.
