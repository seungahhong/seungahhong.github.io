---
layout: post
title: 이번 주 패키지 릴리스 정리 — 2026-11-14
date: 2026-11-14
published: 2026-11-14
category: 주간 릴리스
tags: []
comments: true
thumbnail: './assets/14/thumbnail.png'
github: ''
---

## ✍️ 한 줄 요약

Node.js가 26·24·22 세 LTS 라인에 HTTP/2·TLS 관련 High 등급 CVE 여러 건을 고친 보안 릴리스를 냈고, Grafana(CVE 6건)·Gradle(Critical 등급 포함 보안 권고 3건)·Podman(CVE 3건)도 보안 수정을 냈습니다. Rust 1.100.0은 never 타입(`!`)과 커스텀 할당자(allocator) API를 안정화했고, Kyverno 1.20.0은 변경 이력상 레거시 `kyverno.io` 정책 엔진을 제거하는 커밋이 들어 있어 올리기 전에 꼭 확인해야 합니다.

## 이번 주 한눈에 보기

기간은 2026-11-07 ~ 2026-11-14(KST)이며, 추적 중인 87개 패키지 가운데 35개의 변경점을 확인했습니다. 지난주 글에서 이미 다룬 버전(Angular 22.2.5, Tailwind CSS 4.3.5, Nx 24.0.5, Istio 1.31.4·1.30.8)은 기간 경계에 걸쳐 있어도 다시 넣지 않았습니다.

이번 주도 GitHub 릴리스 페이지를 읽을 수 없어, CHANGELOG나 저장소 안 릴리스 노트가 있는 패키지는 그 파일을, 없는 패키지는 새 태그까지의 변경 이력(커밋 제목)을 읽고 정리했습니다. 변경 이력으로 정리한 패키지는 `릴리스 공지`를 `없음`으로 표시했고, breaking change(기존 코드를 고쳐야 하는 변경) 여부는 확인하지 못했습니다.

| 패키지 | 버전 | 릴리스 공지 | 변경점 |
|---|---|---|---|
| Node.js | v26.13.1 · v24.22.3 · v22.23.5 (모두 LTS) | [있음](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V26.md) | HTTP/2·TLS 보안 수정(CVE 다수, High 포함) |
| astro | 7.4.12 (패치 5개) | [있음](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) | `security.allowedDomains` 헤더 검증 강화, 빌드 메모리 절감 |
| Zed | v1.28.1 · v1.28.0 | 없음 | 에이전트 압축 과금 수정, 워크트리 선택기 브랜치 검색 |
| pnpm | v12.21.0 · v12.20.0 · v12.19.0 · v11.28.12 | 없음 | peer 해석 수정 다수, 위험한 `PNPM_HOME` 거부 |
| 🔺 메이저 Electron | v45.3.2 (패치 3개) · v44.11.3 (패치 4개) · v43.8.10 (패치 3개) | 없음 | 폐지된 eMudhra 중간 인증서 차단, 종료 전 쿠키 저장 |
| Oxfmt | v0.78.0 | 없음 | Less 출력 수정, Astro 안 TS를 TSX로 포맷 |
| Oxlint | v1.93.0 | 없음 | `--fix`로 쓰지 않는 `oxlint-disable` 제거 |
| 🔺 메이저 TinyBase | v10.1.0 | [있음](https://github.com/tinyplex/tinybase/blob/main/site/guides/20_releases.md) | WsServer 클라이언트 권한 부여, 동기화 데이터 절감 |
| Next.js | v16.4.6 | 없음 | 라우트 핸들러 응답 자동 압축, Turbopack GC 수정 |
| 🔺 메이저 Nx | 24.0.6 · 23.3.2 | 없음 | 임시·캐시 디렉토리 권한 축소, 태스크 출력 유실 수정 |
| FastAPI | 0.162.7 (패치 7개) | [있음](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md) | Python 3.10 지원 중단(breaking), 취소 시 의존성 정리 수정 |
| Grafana | 13.3.1 · 13.2.6 · 13.1.10 · 13.0.13 | [있음](https://github.com/grafana/grafana/blob/main/CHANGELOG.md) | 보안 수정 CVE 6건 |
| Homebrew | 7.0.13 | 없음 | `uninstall` dry-run 옵션 추가 |
| Vite | v8.3.8 (패치 2개) · v8.2.6 · v8.1.7 · v7.3.8 · v6.4.6 | [있음](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md) | 가상 모듈 id 이스케이프, CSS·Windows 수정 |
| Angular | 22.2.6 | [있음](https://github.com/angular/angular/blob/main/CHANGELOG.md) | 메모리 누수·hydration·forms·router 수정 |
| ESLint | v10.15.0 | [있음](https://github.com/eslint/eslint/blob/main/CHANGELOG.md) | 규칙 검사 범위 확대, `minimatch` CVE 회피 |
| Hono | v4.13.18 (패치 2개) | 없음 | JSX 속성값 이스케이프, 쿠키 접두사 검사 수정 |
| Kyverno | v1.20.0 | 없음 | 레거시 정책 엔진 제거, OCI CLI 명령 추가 |
| Prettier | 3.10.0 · 3.10.1 | [있음](https://github.com/prettier/prettier/blob/main/website/blog/2026-11-11-3.10.0.md) | 공식 플러그인 `@prettier/plugin-yuku`, Flow 신문법 |
| Rspack | v2.3.2 | 없음 | 사용하지 않는 export의 동적 import 제거, 메모리 절감 |
| Turborepo | v2.11.11 | 없음 | `turbo query`에 태스크 해시·로그 노출, `NO_PROXY` 존중 |
| Visual Studio Code | 1.146.0 · 1.145.3 | 없음 | MCP·워크스페이스 신뢰 보안 강화, `/automate` 스킬 |
| Biome | v2.6.7 | [있음](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md) | nursery 규칙 대거 추가, 플러그인 `semantic()` 제거 |
| Dragonfly | v2.5.4 | 없음 | 매니저 JWT 쿠키 HttpOnly, 프리히트 요청 검증 강화 |
| Go | go1.27.4 · go1.26.11 | 없음 | cgo·링커 플래그 검증 강화, HTTP/1 서버 크래시 수정 |
| Gradle | 9.9.1 · 8.14.7 | [있음](https://github.com/gradle/gradle/blob/v9.9.1/platforms/documentation/docs/src/docs/release/notes.md) | 보안 권고 3건(Critical 9.3 포함) |
| Jotai | v3.0.2 | 없음 | 의존성 제거 시 언마운트, `freezeAtom` 순환 참조 처리 |
| ollama | v0.40.16 | 없음 | Claude Code 연동 수정, Windows ARM64 CUDA 13.5 |
| Podman | v6.2.0 · v5.8.10 | [있음](https://github.com/podman-container-tools/podman/blob/v6.2.0/RELEASE_NOTES.md) | CVE 3건, `push --platform`, WSL systemd |
| React Native Skia | v3.10.1 · v3.10.0 · v3.9.2 | 없음 | Skia m158, `drawShapes` 추가, 렌더 스레드 수정 |
| Rolldown | v1.3.2 (패치 2개) · v1.2.19 · v1.1.8 · v1.0.5 | [있음](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md) | 오류 스텁 이스케이프, CJS `__dirname` 제공 |
| Rust | 1.100.0 | [있음](https://github.com/rust-lang/rust/blob/1.100.0/RELEASES.md) | never 타입·커스텀 할당자 안정화 |
| Storybook | v10.6.7 | [있음](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md) | 프리릴리스 커뮤니티 프레임워크 init 지원 |
| Terraform | v1.17.2 | [있음](https://github.com/hashicorp/terraform/blob/v1.17.2/CHANGELOG.md) | `destroy=false` 순환 참조 수정 |
| Vue Router | 5.5.1 · 5.5.0 · 4.6.5 | [있음](https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md) | 스크롤 위치를 sessionStorage에 저장, 실험 API breaking |

## 패키지별 변경 내용

### Node.js v26.13.1 · v24.22.3 · v22.23.5

자바스크립트 런타임입니다.

**무엇이 바뀌었나** — 세 라인 모두 보안 릴리스입니다. HTTP/2 스트림을 정리할 때 헤더·버퍼를 놓치거나 nghttp2가 버린 스트림을 감지하지 못하던 문제, 빈 쓰기로 HTTP 파서가 중첩 실행되던 문제, TLS 세션 재개·재협상으로 SNI가 바뀌거나 mTLS에서 재개가 허용되던 문제, 원격에서 TLS 서버를 죽일 수 있던 문제(26·24 라인)가 High 등급으로 고쳐졌습니다. Medium·Low 등급으로는 ALTSVC 버퍼 오버플로, 잘못된 프록시 URL 오류 메시지에 자격 증명이 노출되던 문제, 권한 모델에서 재귀 `fs.watch`가 거부된 하위 경로를 드러내던 문제 등이 포함됩니다. 26.13.1은 'Lithium' LTS 라인으로 표기돼 있습니다.

**업그레이드할 때 확인할 점** — HTTP/2나 TLS 서버를 직접 운영한다면 바로 올리는 것이 좋습니다. 같은 패치 버전 안의 보안 수정이라 API 변경은 적혀 있지 않습니다.

릴리스 공지: [CHANGELOG_V26](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V26.md)

### astro 7.4.12

JavaScript 웹 프레임워크입니다.

**무엇이 바뀌었나** — 7.4.11은 `security.allowedDomains`가 `X-Forwarded-Proto`·`X-Forwarded-Host`·`X-Forwarded-Port`를 따로 검사하던 것을 한 항목 안에서 함께 검사하도록 바꾸고, `ftp`·`ws` 같은 HTTP(S)가 아닌 프로토콜 값을 받아들이던 문제를 고쳤습니다. `astro build`가 Vite `build.license` 파일을 지우던 문제, 잘못된 퍼센트 인코딩 경로가 500 대신 400을 돌려주도록 한 수정도 있습니다. 7.4.9는 `strictDynamic` CSP에서 번들 스크립트가 막히던 문제를, 7.4.12는 빌드 중 콘텐츠 컬렉션 메모리 사용을 줄였습니다.

**업그레이드할 때 확인할 점** — 프록시 뒤에서 `security.allowedDomains`를 쓴다면, 포트·프로토콜이 항목에 명시돼 있지 않으면 이제 전달 헤더 값이 적용되지 않을 수 있으니 설정을 확인하세요.

릴리스 공지: [CHANGELOG](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

### Zed v1.28.1 · v1.28.0

Rust로 만든 빠른 코드 에디터입니다.

**무엇이 바뀌었나** — 변경 이력상 에이전트의 대화 압축(compaction)이 캐시되지 않은 입력 토큰으로 과금되던 문제가 고쳐졌고, ACP v2에서 백그라운드 작업을 지원합니다. 워크트리 선택기는 브랜치 이름으로도 검색되고, 하위 메뉴·팝오버는 공간이 있는 쪽으로 열립니다. 기본 셸이 Nushell인 Windows SSH 원격, Vim visual-block 멈춤, 문서 색상 인레이 중복 문제도 수정됐습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### pnpm v12.21.0 · v12.20.0 · v12.19.0 · v11.28.12

Node.js 패키지 매니저입니다.

**무엇이 바뀌었나** — 변경 이력상 이번 주는 peer 의존성 해석 수정이 대부분입니다. 반복 install에서 필요한 peer 고정값이 흔들리던 문제, 의존성 순환·다이아몬드 구조에서 peer 제공자를 잃던 문제, 동일하게 해석된 peer 중복 문제가 고쳐졌습니다. 안전하지 않은 `PNPM_HOME` 값을 거부하고, Linux·macOS에서 PowerShell을 셸로 쓰는 setup을 지원합니다. 레지스트리 서버 `pnpr` 쪽 기능(토큰 수명, 감사 기록 등)도 함께 늘었습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. peer 해석이 바뀌므로 올린 뒤 lockfile 변화를 한 번 살펴보세요.

릴리스 공지: 없음

### 🔺 메이저 Electron v45.3.2 · v44.11.3 · v43.8.10

웹 기술로 데스크톱 앱을 만드는 플랫폼입니다.

**무엇이 바뀌었나** — 변경 이력상 세 라인 모두에 폐지된 eMudhra RSA 중간 인증서를 차단하는 수정과, 로더 재시작 사이 webRequest 리다이렉트를 제한해 크래시를 막는 수정이 들어갔습니다. 45.x는 종료 전 쿠키 저장소를 디스크에 기록하고, 확장 프로그램에서 `chrome.storage.managed`를 지원하며, 업로드 본문 스트림 오류 시 `net.fetch`를 reject합니다. 44.x에는 Windows용 `Menu.setHighlightColors()`가 추가됐습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. 기준(44)보다 메이저가 높은 45 라인으로 넘어가는 경우 공식 안내를 따로 확인하세요.

릴리스 공지: 없음

### Oxfmt v0.78.0

Rust로 만든 JS/TS 포매터입니다.

**무엇이 바뀌었나** — 변경 이력상 Astro 파일 안의 TypeScript를 TSX로 포맷하고, Less의 `~` 이스케이프·`%` 선택자 출력을 바로잡았습니다. JSDoc 기본값의 `*` 접두사와 줄 끝 처리, 공백뿐인 TOML·빈 GraphQL 문서 처리도 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. Less·Astro 파일 포맷 결과가 달라질 수 있습니다.

릴리스 공지: 없음

### Oxlint v1.93.0

Rust로 만든 JS/TS Linter입니다.

**무엇이 바뀌었나** — 변경 이력상 `--fix`가 쓰이지 않는 `oxlint-disable` 주석을 지워 주고, `react/exhaustive-deps`가 불필요한 의존성 제거를 제안합니다. `promise/prefer-catch`에 제안 수정이 생겼고, `unicorn/no-useless-undefined`·`eslint/no-lone-blocks` 등 여러 규칙의 오탐·패닉이 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. CI에서 `--fix`를 돌린다면 disable 주석이 지워지는 변경이 생길 수 있습니다.

릴리스 공지: 없음

### 🔺 메이저 TinyBase v10.1.0

로컬 우선 앱용 리액티브 데이터 스토어입니다.

**무엇이 바뀌었나** — `createWsServer`에 `authorize`·`canWriteCell`·`canWriteValue` 함수를 넘겨, 어떤 클라이언트가 어떤 경로를 쓰고 무엇을 쓸 수 있는지 서버가 결정할 수 있게 됐습니다. 동기화가 보내는 데이터 양이 크게 줄었고, 재접속 후 수렴·저장 중 로드 등 안정성 수정이 많이 들어갔습니다. `persister-postgres`는 Postgres.js v4 이상, `schematizer-effect`는 Effect v4 이상을 요구합니다.

**업그레이드할 때 확인할 점** — Postgres.js·Effect를 함께 쓴다면 의존성을 v4로 올려야 하고, 두 라이브러리 자체의 API 변경(`sql.array()` 제거, `Schema.Union` 인자 형태 등)을 확인하세요.

릴리스 공지: [Releases 가이드](https://github.com/tinyplex/tinybase/blob/main/site/guides/20_releases.md)

### Next.js v16.4.6

서버렌더링 React 프레임워크입니다.

**무엇이 바뀌었나** — 변경 이력상 이미 압축되지 않은 라우트 핸들러 응답을 자동으로 압축하고, Turbopack GC 관련 수정이 들어갔습니다. `create-next-app`의 Tailwind 버전은 4.3.3으로 고정됐습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. 라우트 핸들러에서 직접 압축을 다루고 있다면 응답 헤더를 확인하세요.

릴리스 공지: 없음

### 🔺 메이저 Nx 24.0.6 · 23.3.2

모노레포 빌드 시스템입니다.

**무엇이 바뀌었나** — 변경 이력상 임시 설치·캐시·데이터 디렉토리를 현재 사용자만 접근할 수 있게 바꿨고, 명령 종료 직전에 쓴 run-commands 출력이 사라지던 문제를 고쳤습니다(23.3.2도 태스크 출력 flush 수정). 타깃이 자체 입력을 지정할 때 package.json 스크립트 본문을 해시에 넣고, `bun`·`bun:` import를 내장 모듈로 다룹니다. stories·Storybook 설정이 바뀌면 `build-storybook`을 다시 빌드합니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. 해시 계산이 바뀌어 첫 실행에서 캐시가 무효화될 수 있습니다.

릴리스 공지: 없음

### FastAPI 0.162.7

Python 웹 프레임워크입니다.

**무엇이 바뀌었나** — 0.162.6에서 Python 3.10 지원이 중단됐습니다(breaking change). 0.162.3은 Python 3.15 지원을 추가했고, 0.162.4는 런타임에 AnyIO 4.1.0 이상을 요구합니다. 0.162.5·0.162.7은 요청이 취소됐을 때 동기·비동기 `yield` 의존성의 정리 코드가 제대로 실행되지 않던 문제를 고쳤습니다.

**업그레이드할 때 확인할 점** — Python 3.10에서 돌고 있다면 0.162.6 이상으로 올리기 전에 Python부터 올려야 합니다.

릴리스 공지: [release-notes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md)

### Grafana 13.3.1 · 13.2.6 · 13.1.10 · 13.0.13

메트릭 대시보드입니다.

**무엇이 바뀌었나** — 네 라인 모두 CVE-2026-102589, CVE-2026-107509, CVE-2026-110992, CVE-2026-111024, CVE-2026-13721, CVE-2026-14242 보안 수정을 담았습니다. CHANGELOG에는 번호만 있고 무엇이 위험했는지는 적혀 있지 않습니다. 13.3.1은 2026년 시간대 변경 반영과 Provisioning 저장소 URL 변경 허용도 포함합니다.

**업그레이드할 때 확인할 점** — 운영 중인 라인의 최신 패치로 올리세요. 각 CVE의 영향 범위는 공식 보안 공지로 확인해야 합니다.

릴리스 공지: [CHANGELOG](https://github.com/grafana/grafana/blob/main/CHANGELOG.md)

### Homebrew 7.0.13

macOS 패키지 매니저입니다.

**무엇이 바뀌었나** — 변경 이력상 `brew uninstall`에 dry-run 옵션이 생겨, 지우기 전에 unlink·autoremove 대상을 미리 볼 수 있습니다. outdated 보고에서 비활성화된 패키지를 건너뛰고, `bundle`이 탭을 명시한 formula·cask를 존중하며, 잘못된 alias 영수증을 처리합니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### Vite v8.3.8 · v8.2.6 · v8.1.7 · v7.3.8 · v6.4.6

프론트엔드 빌드 도구입니다.

**무엇이 바뀌었나** — 11월 9일에 모든 유지보수 라인이 함께 나왔습니다. 7.3.8·6.4.6은 가상 모듈을 해석할 때 id를 이스케이프하는 수정을, 8.x 라인은 같은 날 나온 Rolldown 패치를 반영했습니다. 8.3.8은 `build.cssCodeSplit: false`일 때 CSS 엔트리를 거부하고, inline worker가 참조한 자산을 번들 dev 모드에서 내보내며, sass를 파일마다가 아니라 한 번만 import해 빨라졌습니다.

**업그레이드할 때 확인할 점** — CHANGELOG에 보안 권고나 CVE 번호는 없지만 여러 라인을 동시에 낸 수정이니, 쓰는 라인의 최신 패치로 올리는 것을 권합니다.

릴리스 공지: [CHANGELOG](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

### Angular 22.2.6

JavaScript 프레임워크입니다.

**무엇이 바뀌었나** — animations 렌더러의 메모리 누수, core의 클로저·참조 유지 누수가 고쳐졌고, hydration 중 맵 접근과 이벤트 재생 후 리스너 정리가 보강됐습니다. forms는 필드가 touched될 때 debounce된 값을 flush하고 중복 `valueChanges`를 막으며, router는 Navigation API에서 URL 복원 시 페이지를 새로고침하지 않습니다. `HttpParams`에서 빈 배열을 빼고 `httpResource` 관련 트리 셰이킹도 개선됐습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md)

### ESLint v10.15.0

JavaScript 코드 분석 도구입니다.

**무엇이 바뀌었나** — `func-names`가 `__proto__`와 할당 대상까지 검사하고, `accessor-pairs`·`no-invalid-this`·`no-shadow`가 더 많은 구문을 인식합니다. `no-useless-rename`·`no-unneeded-ternary` 자동 수정이 타입 수식어와 괄호를 보존하도록 고쳐졌습니다. CVE-2026-118764를 피하려 `minimatch@11.0.1` 이상을 요구합니다.

**업그레이드할 때 확인할 점** — 규칙 검사 범위가 넓어져 새 경고가 나올 수 있습니다.

릴리스 공지: [CHANGELOG](https://github.com/eslint/eslint/blob/main/CHANGELOG.md)

### Hono v4.13.18

엣지용 웹 프레임워크입니다.

**무엇이 바뀌었나** — 변경 이력상 JSX가 요소·객체 속성값을 이스케이프하고 ref 객체를 속성으로 렌더하지 않도록 고쳤으며, ErrorBoundary가 만드는 모든 스크립트에 CSP nonce를 붙입니다. 쿠키의 `__Secure-`·`__Host-` 접두사를 대소문자 구분 없이 검사하고, AWS Lambda API Gateway v2 이벤트의 비 ASCII 헤더 값을 정리합니다. ETag·Server-Timing·Accept 처리 수정도 포함됩니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. JSX 속성 이스케이프는 보안 성격의 수정으로 보이니 Hono JSX를 쓴다면 올리는 것을 권합니다.

릴리스 공지: 없음

### Kyverno v1.20.0

Kubernetes 정책 엔진입니다.

**무엇이 바뀌었나** — 변경 이력상 레거시 `kyverno.io` 정책 엔진과 Go API를 삭제하고, admission·background·reports 컨트롤러에서 레거시 정책 실행을 제거하는 커밋이 포함돼 있습니다. CLI에는 `kyverno oci inspect`·`resolve`·`validate`와 `apply`의 출력 파일 옵션이 추가됐고, MutatingPolicy가 JSON 문서 변경을 지원합니다. globalContext의 jmesPath 프로젝션은 deprecated되고 CEL 표현식 필드가 생겼습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 범위는 확인하지 못했습니다. 레거시 ClusterPolicy·Policy를 쓰고 있다면 올리기 전에 공식 마이그레이션 안내를 반드시 확인하세요.

릴리스 공지: 없음

### Prettier 3.10.0 · 3.10.1

코드 포매터입니다.

**무엇이 바뀌었나** — Zig로 만든 Yuku 툴체인 기반의 공식 플러그인 `@prettier/plugin-yuku`가 추가됐고, Flow 새 문법과 Structs·Import Sync·Deferred re-exports 제안 문법을 지원합니다. 주석 위치가 매번 바뀌던 문제, `TSInstantiationExpression` 괄호 누락, 긴 이항식의 스택 오버플로 등 수정이 많고 주석이 많은 파일의 성능도 개선됐습니다. 3.10.1은 주석만 있는 빈 GraphQL 선택 집합에서 나던 오류를 고쳤습니다.

**업그레이드할 때 확인할 점** — 포맷 결과가 조금씩 달라질 수 있으니 올린 뒤 전체 포맷 diff를 한 번에 커밋하는 것이 좋습니다.

릴리스 공지: [3.10.0 릴리스 글](https://github.com/prettier/prettier/blob/main/website/blog/2026-11-11-3.10.0.md)

### Rspack v2.3.2

Rust로 만든 웹 번들러입니다.

**무엇이 바뀌었나** — 변경 이력상 사용하지 않는 export 안의 동적 import를 트리 셰이킹으로 제거하고, 부수효과 없는 `export *` 중계 모듈을 건너뜁니다. 자산 생성·해시 계산의 source map 메모리를 줄이고 재빌드 때 이전 컴파일 자산을 해제합니다. 순환 tsconfig `extends`에서 크래시 대신 오류를 보고하고, UTF-8 BOM tsconfig, HMR 비동기 그룹, CSS counter style 범위를 고쳤습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### Turborepo v2.11.11

JS/TS 빌드 시스템입니다.

**무엇이 바뀌었나** — 변경 이력상 `turbo query`에서 태스크 해시와 로그 파일을 조회할 수 있고, 예제 다운로드가 `NO_PROXY`를 존중합니다. 입력 해싱이 저장소 밖 심볼릭 링크를 따라가지 않고, strict 환경 모드에서 `TMPDIR`을 보존하며, `turbo.lock` 생성이 약 10배 빨라졌습니다. `turbo gen` 종료 코드 전달과 의존성의 태스크 제외 규칙도 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### Visual Studio Code 1.146.0 · 1.145.3

코드 에디터입니다.

**무엇이 바뀌었나** — 변경 이력상 1.145.3은 보안 강화 패치입니다. MCP 설치 링크 입력과 SSE 엔드포인트를 검증하고, 점으로 이어진 설정 키 확장에서 `__proto__` 세그먼트를 막으며, 노트북 글꼴 크기를 통한 주입을 고치고, 네트워크 워크스페이스에 신뢰를 요구합니다. 1.146.0은 월간 릴리스로 내장 `/automate` 스킬, 창 사이 채팅 고정 상태 공유, `markdownImages.allowedOrigins` 편집기 옵션 등이 들어갔습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. 네트워크 경로의 워크스페이스를 연다면 신뢰 확인 창이 새로 뜰 수 있습니다.

릴리스 공지: 없음

### Biome v2.6.7

프론트엔드 툴체인(포매터·린터)입니다.

**무엇이 바뀌었나** — `noInvalidFetchOptions`, `useGlobalRegexInMatchAll`, `noDisabledAttribute`, `useConsistentBooleanName` 등 nursery 규칙이 20개 넘게 추가됐습니다. JavaScript 플러그인에 GritQL 패턴으로 노드를 고르는 `grit()` 쿼리가 생겼고, 대신 `semantic()` 쿼리 함수는 제거돼 `ast(..., { semantic: true })`로 바꿔야 합니다. Markdown 포매터의 인용·표·작업 목록 처리와 여러 규칙의 오탐이 고쳐졌고, 설정한 플러그인을 쓸 수 없으면 조용히 건너뛰지 않고 오류를 냅니다.

**업그레이드할 때 확인할 점** — 직접 만든 Biome 플러그인에서 `semantic()`을 쓰고 있다면 고쳐야 합니다.

릴리스 공지: [CHANGELOG](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md)

### Dragonfly v2.5.4

P2P 파일 배포·이미지 가속 도구입니다.

**무엇이 바뀌었나** — 변경 이력상 매니저 JWT 인증 쿠키에 HttpOnly를 설정하고, OCI 매니페스트 URL 파싱과 프리히트 요청 처리를 강화했습니다. 프리히트 요청마다 레지스트리 인증을 새로 받고, 멀티 플랫폼 이미지 프리히트의 중복 제거를 개선했으며, Redis 자격 증명을 URL userinfo로 인코딩합니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### Go go1.27.4 · go1.26.11

프로그래밍 언어입니다.

**무엇이 바뀌었나** — 변경 이력상 go1.27.4는 `cmd/go`·링커의 cgo 플래그 검증을 대폭 강화했습니다. `--sysroot`·`-target` 같은 플래그 차단, pkg-config 로컬 `.pc` 경로 차단, `.syso`·링커 입력 파일 검증 등이 들어갔고, `MaxBytesReader` 헤더 경합으로 HTTP/1 서버가 죽던 문제도 고쳤습니다. 커밋 제목상 보안 성격으로 보이지만 CVE 번호는 확인하지 못했습니다. go1.26.11도 같은 날 나왔으나 변경 이력은 1.27.4만 읽었습니다.

**업그레이드할 때 확인할 점** — cgo에서 특이한 링커 플래그를 쓰는 빌드는 이제 거부될 수 있으니 빌드를 한 번 돌려 보세요.

릴리스 공지: 없음

### Gradle 9.9.1 · 8.14.7

Java 빌드 도구입니다.

**무엇이 바뀌었나** — 두 라인 모두 보안 권고 3건을 고친 패치입니다. 버전 카탈로그 값이 생성된 접근자에서 코드로 실행되던 문제(Critical 9.3), Gradle 클라이언트가 데몬 레지스트리 내용을 그대로 믿던 문제(High 8.6), 오래된 레지스트리 항목을 믿어 포트를 가로챌 수 있던 문제(High 7.0)입니다. 9.9.1은 KGP 2.4.21에서도 뜨던 잘못된 deprecation 경고도 고쳤습니다.

**업그레이드할 때 확인할 점** — 신뢰하지 않는 버전 카탈로그를 쓰거나 공유 머신에서 빌드한다면 바로 올리세요. 9.x에 있다면 9.9.1, 8.14 라인이면 8.14.7입니다.

릴리스 공지: [9.9.1 릴리스 노트](https://github.com/gradle/gradle/blob/v9.9.1/platforms/documentation/docs/src/docs/release/notes.md)

### Jotai v3.0.2

React 상태 관리 라이브러리입니다.

**무엇이 바뀌었나** — 변경 이력상 atom의 마지막 의존성이 제거되면 그 의존성을 언마운트하도록 고쳤고, `freezeAtom`이 순환 참조와 typed array를 처리합니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### ollama v0.40.16

로컬에서 오픈 모델을 실행하는 도구입니다.

**무엇이 바뀌었나** — 변경 이력상 `launch`의 Claude Code 연결과 은퇴한 모델 오류 처리를 고쳤고, Windows ARM64에 CUDA 13.5를 추가했습니다. MLX 러너는 ripple preview와 일부 모델의 메모리 효율을 개선했습니다. OpenAI 호환 `/v1/models`는 설치된 모델이 없을 때 빈 배열을 돌려주고, responses 요청의 truncation 옵션을 전달합니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다.

릴리스 공지: 없음

### Podman v6.2.0 · v5.8.10

컨테이너 엔진입니다.

**무엇이 바뀌었나** — 두 라인 모두 CVE 3건을 고쳤습니다. 신뢰할 수 없는 이미지 라벨로 `podman auto-update`가 엉뚱한 systemd 유닛을 재시작하게 만들 수 있던 문제(CVE-2026-121885), 악성 이미지가 digest·서명 검증을 우회할 수 있던 문제(CVE-2026-111361), 기본 seccomp 프로필의 소켓 차단 규칙을 우회할 수 있던 문제(CVE-2026-123876)입니다. 6.2.0은 `podman push --platform`, `kube play`의 `--validate`·`--label`·`--multiple-pods`, Quadlet `Umask` 키, WSL 네이티브 systemd 지원을 추가했습니다.

**업그레이드할 때 확인할 점** — 빌드에 Go 1.26 이상이 필요하고, WSL은 2.5.1 이상이 필요합니다. `kube play`의 어노테이션 기반 seccomp 설정은 deprecated돼 Podman 7.0에서 제거될 예정입니다.

릴리스 공지: [RELEASE_NOTES](https://github.com/podman-container-tools/podman/blob/v6.2.0/RELEASE_NOTES.md)

### React Native Skia v3.10.1 · v3.10.0 · v3.9.2

React Native용 2D 그래픽 라이브러리입니다.

**무엇이 바뀌었나** — 변경 이력상 Skia m158로 올렸고, `SkShapeBlob`과 `canvas.drawShapes`가 추가됐습니다. 렌더 스레드 경합 조건과 프레임 페이싱, Android의 화면 밀도 변경 추적과 TextureView 버퍼 처리, 폐기된 캔버스의 프레임 유지가 고쳐졌고, 녹화 명령 재생의 복사·할당을 줄였습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. Skia 엔진 버전이 바뀌니 렌더링 결과를 한 번 확인하세요.

릴리스 공지: 없음

### Rolldown v1.3.2 · v1.2.19 · v1.1.8 · v1.0.5

Rust 기반 JS/TS 번들러입니다.

**무엇이 바뀌었나** — 11월 9일 모든 유지보수 라인에 Vite resolve 플러그인이 만드는 오류 스텁에서 모듈 이름을 이스케이프하는 수정이 들어갔습니다. 1.3.2는 Node ESM 출력의 CommonJS 모듈에 `__dirname`·`__filename`을 제공하고 magic-string `hires` 옵션을 추가했으며, 모듈 태스크가 패닉하면 멈추지 않고 빌드를 실패시킵니다. 1.3.1은 sticky 정규식 매칭과 상수 인라인 시 부수효과 유지 등 번들 결과 관련 버그를 고쳤습니다.

**업그레이드할 때 확인할 점** — CHANGELOG에 CVE 번호는 없습니다. 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md)

### Rust 1.100.0

프로그래밍 언어입니다.

**무엇이 바뀌었나** — never 타입(`!`)이 안정화되고 `Infallible`이 `!`의 별칭이 됐으며, 모든 에디션에서 never 타입 fallback이 `!`로 바뀌었습니다. `std::alloc::Allocator`와 `Box::new_in`·`Vec::new_in` 등 커스텀 할당자 API가 안정화됐고, `bool::toggle`, `Box::map`·`Arc::map`, `core::mem::DropGuard`도 쓸 수 있습니다. `extern "custom"`과 `-Cprofile-sample-use`가 안정화되고 `wasm32-wasip3`가 Tier 2가 됐습니다.

**업그레이드할 때 확인할 점** — 호환성 노트에 `if let` 클로저 캡처 변경으로 새 오류가 날 수 있다는 점, `box` 패턴 문법 제거, never 타입 fallback 변경이 적혀 있으니 빌드를 먼저 돌려 보세요.

릴리스 공지: [RELEASES.md](https://github.com/rust-lang/rust/blob/1.100.0/RELEASES.md)

### Storybook v10.6.7

UI 컴포넌트 개발 도구입니다.

**무엇이 바뀌었나** — `init`이 프리릴리스 버전의 커뮤니티 프레임워크를 지원하고, MCP가 호스팅된 Storybook이 실제로 제공하는 composition 스키마를 게시합니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md)

### Terraform v1.17.2

Infrastructure as Code 도구입니다.

**무엇이 바뀌었나** — 큰 HCP Terraform 쿼리에서 설정을 생성할 때의 성능과 할당을 개선했습니다. `destroy=false`인 관리 리소스를 참조하는 provider가 순환 참조를 일으키던 문제, `init` 로그에 사용할 수 없는 provider 스키마 경고가 반복되던 문제를 고쳤습니다.

**업그레이드할 때 확인할 점** — 그대로 올려도 되는 릴리스입니다.

릴리스 공지: [CHANGELOG](https://github.com/hashicorp/terraform/blob/v1.17.2/CHANGELOG.md)

### Vue Router 5.5.1 · 5.5.0 · 4.6.5

Vue.js 라우팅 라이브러리입니다.

**무엇이 바뀌었나** — 5.5.0은 스크롤 위치를 `history.state` 대신 sessionStorage에 저장하고(실패하면 메모리에 보관), 스크롤 복원 트리거를 설정할 수 있게 했으며, `.*` 반복 파라미터의 지수적 백트래킹을 막았습니다. unplugin의 `definePage`가 webpack·rspack에서 동작하고 `props: true`일 때 `defineProps()`에 라우트 파라미터 타입이 붙습니다. 5.5.1은 `vue-router/experimental` 사용자에게 breaking change가 있어, 매처가 일치하지 않으면 throw 대신 `null`을 반환하고 `MatchMiss`가 더 이상 `Error`를 상속하지 않습니다. 4.6.5 변경은 읽지 못했습니다.

**업그레이드할 때 확인할 점** — 실험 라우터를 쓴다면 커스텀 매처와 `instanceof Error`·`error.name` 검사 코드를 고쳐야 합니다. 스크롤 위치 저장 위치가 바뀐 점도 확인하세요.

릴리스 공지: [CHANGELOG](https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md)

## 마무리

변경점을 읽지 못해 본문에서 뺀 릴리스 4건(생략)은 ClickHouse v26.10.4.207-stable, Istio 1.32.0, Flutter 3.50.0, Obsidian v1.15.1입니다. 새 버전은 확인했지만 저장소 안에서 읽을 수 있는 변경 설명이 없거나(Flutter는 외부 블로그만 링크), 변경 이력으로는 내용을 정리할 수 없었습니다.

확인 실패 11개는 세션 네트워크에서 호스트가 막혀(`getaddrinfo ENOTFOUND`) 읽지 못한 공식 사이트 기반 소스입니다. Expo SDK, GraalVM, JDK, Android, Boundary, Cursor, GitButler, Manus, Swift, Ubuntu, Xcode입니다.

확인 방식: npm/PyPI/git 태그 기반 (GitHub 릴리스 본문 미접근)
