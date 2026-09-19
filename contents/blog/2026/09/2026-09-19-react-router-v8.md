---
layout: post
title: React Router v8
date: 2026-09-19
published: 2026-09-19
category: 개발
tags: ['react-router', 'react']
comments: true
thumbnail: './assets/19/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# React Router v8 출시: "지루한 메이저"와 v7 → v8 업그레이드 가이드

## ✍️ 한 줄 요약

> **React Router v8은 새 기능을 싣고 온 릴리스가 아니라, v7에서 future flag로 미리 풀어둔 변경을 기본값으로 굳히고 최소 버전을 올린 릴리스입니다.** v7에서 플래그를 모두 켜두었다면 업그레이드는 사실상 `pnpm i react-router@latest` 한 줄입니다.

### 요약

- **출시**: 2026년 6월 17일, Remix 블로그 공지. 팀 스스로 "가장 지루한(boring) 메이저"라고 부릅니다.
- **최소 버전**: Node **22.22.0+** · React **19.2.7+** · Vite **7+**(Framework 모드). 패키지는 **ESM 전용**이 되었고 tsconfig target/lib는 ES2022로 올라갔습니다.
- **기본값이 된 future flag 5개**: `v8_middleware` · `v8_splitRouteModules`(최상위 `splitRouteModules`로 이동) · `v8_viteEnvironmentApi` · `v8_passThroughRequests` · `v8_trailingSlashAwareDataRequests`
- **제거된 것 4가지**: `react-router-dom` 패키지 · `meta`/`matches`의 `data`(→ `loaderData`) · Cloudflare dev proxy(→ `@cloudflare/vite-plugin`) · `@react-router/architect`의 `useRequestContextDomainName` 옵션
- **업그레이드 순서**: v7 최신 → future flag 하나씩 켜고 커밋 → 제거된 API 정리 → v8 설치. 모든 변경을 **v7에서 미리 적용**할 수 있다는 게 핵심입니다.
- **조용히 깨질 수 있는 곳**: `.data` 요청 URL을 직접 다루는 서버·CDN·캐시 규칙(`/_root.data` → `/_.data`), `request.url`로 경로를 비교하던 loader, `isSsrBuild`에 기대던 Vite 설정.
- **앞으로**: **매년 메이저**를 내는 일정으로 전환. v6와 Remix v2는 **EOL**(보안 업데이트 종료), v7은 보안 업데이트 계속. v9(2027년 중반 예상)는 **Node 24+** 를 요구할 예정이고, RSC 지원은 아직 unstable입니다.

| 항목             | 내용                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| **런타임 기준**  | Node 22.22.0+ · React 19.2.7+ · Vite 7+ · ESM-only                   |
| **기본값 전환**  | 미들웨어 · 라우트 모듈 분할 · Vite Environment API · 원본 요청 전달 · trailing slash 인식 |
| **제거**         | `react-router-dom` · `data` 파라미터 · Cloudflare dev proxy · architect 옵션 |
| **지원 정책**    | v6·Remix v2 EOL · v7 보안 패치 유지 · 연 1회 메이저                     |

아래부터는 상세 내용입니다.

---

## 📋 목차

1. [왜 "지루한 메이저"인가](#왜-지루한-메이저인가)
2. [v7 이후 쌓인 것들](#v7-이후-쌓인-것들)
3. [무엇이 바뀌나](#무엇이-바뀌나)
4. [v7 → v8 업그레이드 가이드](#v7--v8-업그레이드-가이드)
5. [조용히 깨질 수 있는 곳](#조용히-깨질-수-있는-곳)
6. [v9를 미리 보면](#v9를-미리-보면)
7. [앞으로의 React Router, 그리고 Remix](#앞으로의-react-router-그리고-remix)
8. [마무리](#마무리)

## 왜 "지루한 메이저"인가

React Router는 12년 동안 여러 번 모양을 바꿨고, 오래 쓴 사람일수록 "메이저 = 대공사"라는 기억이 있습니다. [v6 때](/ko/posts/2022-03-12-react-router-v6/)만 해도 `Switch`가 `Routes`로, `useHistory`가 `useNavigate`로 바뀌는 식이었죠.

v7부터 팀의 전략은 **future flag** 입니다. 다음 메이저에서 바뀔 동작을 현재 메이저에서 플래그로 먼저 제공하고, 사용자는 원하는 시점에 하나씩 켜서 적응합니다. 메이저가 나오는 날에는 그 플래그들이 기본값이 될 뿐이라, **업그레이드 당일에 새로 고칠 게 거의 없습니다.**

공지문 작성자(Brooks Lybrand)의 표현을 빌리면, 이 방식의 유일한 단점은 "블로그 글로 띄우기 어렵다"는 것입니다. 그리고 팀은 이 지루함을 제도화하기로 했습니다 — **앞으로 메이저는 매년 한 번** 나옵니다.

## v7 이후 쌓인 것들

v7의 헤드라인은 **Framework 모드**였습니다. Vite 플러그인 하나로 타입 안전한 Route Module API, 코드 분할, SPA/SSR/정적 렌더링, 데이터 로딩·뮤테이션을 얹는 구조입니다. 동시에 단순한 클라이언트 라우터(Declarative 모드), 직접 프레임워크를 만드는 Data 모드도 계속 지원합니다. 이 **세 가지 모드를 모두 유지**한다는 방침은 v8에서도 그대로입니다.

v7 이후 40번이 넘는 릴리스에서 추가된 것들은 다음과 같습니다(공지 기준, 전체 목록은 아님).

| 분류           | 추가된 것                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------- |
| **데이터/서버** | 미들웨어·개선된 context · Pass-through Requests · Call-site revalidation · `fetcher.reset` |
| **번들/빌드**   | Split Route Modules · Vite Environment API 지원 · Object 기반 `route.lazy` · 설정 가능한 Lazy Route Discovery |
| **렌더링**      | SPA 모드 개선 · 프리렌더링 개선 · (unstable) RSC 지원                                       |
| **API**         | 타입 안전 `href` · `useRoute`/`useRouterState`(unstable) · `useTransitions` 라우터 prop · RouterProvider `onError` · Link masking |
| **운영**        | Instrumentation API · Subresource integrity · 다수의 성능 개선 · Agent Skills              |

v8에서 "새로 생긴" 기능이 적어 보이는 이유가 여기 있습니다. 새 기능은 이미 v7 마이너 릴리스로 다 나와 있었고, v8은 그중 일부를 **기본값으로 확정**하는 자리입니다.

## 무엇이 바뀌나

### 1. 최소 지원 버전

| 대상      | 최소 버전   | 비고                                             |
| --------- | ----------- | ------------------------------------------------ |
| **Node**  | 22.22.0+    | Maintenance LTS는 최신 마이너 라인만 지원        |
| **React** | 19.2.7+     | `react`, `react-dom` 모두                        |
| **Vite**  | 7+          | Framework 모드만 해당. 커스텀 Vite 플러그인도 Vite 7 호환인지 확인 |

여기에 두 가지가 더 붙습니다.

- **ESM 전용 배포** — CommonJS 빌드가 빠졌습니다.
- **tsconfig target/lib를 ES2022로** 일괄 상향했습니다.

Node 지원 정책도 명문화됐습니다. **Active LTS는 모든 버전**, **Maintenance LTS는 최신 마이너 라인만** 공식 지원합니다. 공지 시점 기준으로:

- Node 24는 Active LTS → 24.x 전부 지원
- Node 22는 Maintenance LTS → **22.22.x만** 지원
- Node 22.23.x가 나오면 React Router의 **마이너 릴리스**에서 최소 버전을 22.23.x로 올림
- Node 22가 EOL이 되면 **메이저 릴리스**에서 지원 중단

보안 패치가 들어간 Node 버전을 빠르게 최소 기준으로 삼기 위한 정책입니다. 뒤집어 말하면, Node 22를 쓰는 팀은 **마이너 업데이트만으로도 Node 버전을 올려야 할 수 있다**는 뜻이니, CI와 배포 이미지의 Node 버전을 느슨하게 두지 않는 편이 안전합니다.

### 2. 기본값이 된 future flag

v7의 v8 future flag 다섯 개가 삭제되고, 그 동작이 기본값이 되었습니다.

| 플래그                                  | v8에서의 상태                                 | 대상 모드          |
| --------------------------------------- | --------------------------------------------- | ------------------ |
| `future.v8_middleware`                  | 기본 동작                                     | Framework · Data   |
| `future.v8_splitRouteModules`           | 최상위 `splitRouteModules` 옵션으로 이동, 기본 활성 | Framework          |
| `future.v8_viteEnvironmentApi`          | 기본 동작                                     | Framework          |
| `future.v8_passThroughRequests`         | 기본 동작                                     | Framework          |
| `future.v8_trailingSlashAwareDataRequests` | 기본 동작                                  | Framework          |

### 3. 제거된 API

- **`react-router-dom` 패키지** — v6 → v7 전환을 부드럽게 하려고 남겨둔 `react-router`의 미러였습니다. `react-router`와 `react-router/dom`을 쓰면 됩니다.
- **`meta` API의 `data` 파라미터** — `loaderData`로 대체.
- **Cloudflare dev proxy**(`@react-router/dev/vite/cloudflare`) — Cloudflare의 공식 `@cloudflare/vite-plugin`으로 대체.
- **`@react-router/architect`의 `useRequestContextDomainName` 옵션** — 그 동작이 기본값이 되어 옵션 자체가 사라짐.

## v7 → v8 업그레이드 가이드

공식 가이드의 권장 사항은 하나입니다. **한 번에 다 하지 말고 단계마다 커밋하라.** 플래그는 대부분 순서와 무관하게 켤 수 있고, 예외는 아래에 표시했습니다.

### 0단계: 최소 버전 먼저

React Router를 올리기 **전에** 런타임부터 맞춥니다.

- `node@22.22+`
- `react@19.2.7+` / `react-dom@19.2.7+`
- Framework 모드라면 `vite@7+` — 그리고 커스텀 Vite 플러그인·설정이 Vite 7과 호환되는지 확인

### 1단계: v7 최신 버전으로

```bash
npm install react-router@7 @react-router/{dev,node,etc.}@7
```

### 2단계: future flag를 하나씩 켜기

Framework 모드는 `react-router.config.ts`에, Data 모드는 `createBrowserRouter`의 옵션에 켭니다.

#### `v8_middleware` (Framework · Data)

라우트가 매칭된 뒤 응답을 만들기 전·후에 코드를 끼워 넣는 미들웨어입니다. 인증, 로깅, 에러 처리 같은 공통 로직에 씁니다.

```ts
// Framework 모드: react-router.config.ts
import type { Config } from '@react-router/dev/config';

export default {
  future: {
    v8_middleware: true,
  },
} satisfies Config;
```

```ts
// Data 모드
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter(routes, {
  future: {
    v8_middleware: true,
  },
});
```

- `react-router-serve`를 쓴다면 코드 변경 없음
- **커스텀 서버**라면 `getLoadContext`/`AppLoadContext` 변경 사항을 확인해야 합니다
- **Data 모드**라면 `context` 타입을 맞추기 위해 `Future` 모듈 augmentation을 추가합니다

#### `v8_splitRouteModules` (Framework)

라우트 모듈의 클라이언트 전용 export(`clientLoader`, `clientAction`, `clientMiddleware`, `HydrateFallback`)를 별도 청크로 쪼개, 컴포넌트와 독립적으로 로드되게 합니다. `true`는 가능한 곳만 분할, `"enforce"`는 **모든 라우트가 분할 가능해야** 빌드가 통과합니다.

```ts
export default {
  future: {
    v8_splitRouteModules: true, // 또는 "enforce"
  },
} satisfies Config;
```

코드 변경은 필요 없습니다. v8에서는 이 옵션이 `future` 밖, 최상위 `splitRouteModules`로 옮겨집니다.

#### `v8_viteEnvironmentApi` (Framework)

Vite Environment API 지원을 켭니다(플래그 자체는 Vite 6+에서 동작하지만, **v8은 Vite 7+를 요구**하므로 이 단계에서 Vite 7로 올려두는 게 자연스럽습니다).

```ts
export default {
  future: {
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
```

`isSsrBuild`로 SSR 빌드를 분기하던 Vite 설정은 **환경별(`environments`) 설정**으로 옮겨야 합니다.

```ts
// Before
export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: './server/app.ts',
        }
      : undefined,
  },
}));
```

```ts
// After
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: './server/app.ts',
        },
      },
    },
  },
  plugins: [reactRouter()],
});
```

#### `v8_passThroughRequests` (Framework)

`loader`·`action`·`middleware`에 정규화된 요청 대신 **원본 HTTP `request`** 를 그대로 넘깁니다. 서버에서 `new Request()`를 여러 번 만들던 오버헤드가 줄고, `.data` 접미사로 문서 요청과 데이터 요청을 구분할 수 있어 관측(observability)에도 유리합니다.

```ts
export default {
  future: {
    v8_passThroughRequests: true,
  },
} satisfies Config;
```

대신 **`request.url`의 pathname에 `.data`가 붙어 올 수 있으므로**, 라우팅 판단에는 새로 제공되는 정규화된 `url` 인자를 써야 합니다.

```ts
// Before — pathname에 .data 접미사가 붙으면 비교가 실패할 수 있음
export async function loader({ request }: Route.LoaderArgs) {
  let url = new URL(request.url);
  if (url.pathname === '/path') {
    // ...
  }
}
```

```ts
// After — 라우팅 판단은 정규화된 url, 요청 종류 판단은 원본 request
export async function loader({ request, url }: Route.LoaderArgs) {
  if (url.pathname === '/path') {
    // .data 접미사가 없는 정규화된 경로
  }

  let isDataRequest = new URL(request.url).pathname.endsWith('.data');
}
```

#### `v8_trailingSlashAwareDataRequests` (Framework)

데이터 요청 URL에서 trailing slash의 의미를 보존해, `/path`와 `/path/`가 같은 데이터 URL로 뭉개지는 모호함을 없앱니다.

| 라우트                 | 데이터 요청 URL                        |
| ---------------------- | -------------------------------------- |
| trailing slash 없음    | `/path.data` (그대로)                  |
| trailing slash 있음    | `/path/_.data` (**새 형식**)           |
| 루트                   | `/_.data` (기존 `/_root.data`에서 변경) |

```ts
export default {
  future: {
    v8_trailingSlashAwareDataRequests: true,
  },
} satisfies Config;
```

앱 코드보다는 **앱 바깥의 CDN·캐시·리라이트 규칙**이 영향을 받습니다. `/_root.data`나 `*.data` 패턴을 다루는 설정이 있다면 새 형식에 맞춰야 합니다.

### 3단계: 제거될 API 정리

#### `meta`/`matches`의 `data` → `loaderData` (Framework)

```ts
// Before
export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.title }];
}

// After
export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData.title }];
}
```

부모 라우트 데이터를 `matches`에서 꺼내던 코드와 `useMatches()`도 같은 방식으로 바꿉니다.

```ts
// meta 안에서 부모 match 참조
let rootMatch = matches.find((match) => match.id === 'root');
let rootData = rootMatch?.loaderData; // 기존: rootMatch?.data

// 컴포넌트에서
let matches = useMatches();
const rootLoaderData = matches[0].loaderData; // 기존: matches[0].data
```

#### `react-router-dom` 제거 (모든 모드)

```bash
npm uninstall react-router-dom
```

```ts
// Before
import { Link, useLocation } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';

// After
import { Link, useLocation } from 'react-router';
import { RouterProvider } from 'react-router/dom'; // DOM 전용 API
```

import 경로만 바꾸면 되는 기계적인 작업이라, 코드베이스 전체를 한 번에 치환하기 좋습니다.

#### Cloudflare dev proxy → `@cloudflare/vite-plugin` (Framework)

```ts
// Before
import { reactRouter } from '@react-router/dev/vite';
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [cloudflareDevProxy(), reactRouter()],
});
```

```ts
// After
import { reactRouter } from '@react-router/dev/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [cloudflare(), reactRouter()],
});
```

#### `@react-router/architect`의 도메인 판별 (Framework)

v8의 architect 어댑터는 `X-Forwarded-Host` 대신 `event.requestContext.domainName`을 기본으로 쓰고, 없으면 `Host` 헤더로 폴백합니다. v7에서 미리 맞춰보려면:

```ts
import { createRequestHandler } from '@react-router/architect';
import * as build from './build/server';

export const handler = createRequestHandler({
  build,
  useRequestContextDomainName: true,
});
```

v8로 올린 뒤에는 이 옵션을 지웁니다(옵션 자체가 제거됨).

### 4단계: v8 설치

```bash
# Data / Declarative 모드
npm install react-router@latest

# Framework 모드
npm install react-router@latest @react-router/{dev,node,etc.}@latest
```

1~3단계를 v7에서 끝냈다면 여기서 추가로 고칠 코드는 거의 없습니다. 공지문에는 업그레이드 가이드를 "솔직히 AI 에이전트한테 던져도 된다"는 말도 있는데, 단계별로 before/after가 명확하게 정리돼 있어 실제로 에이전트에게 맡기기 좋은 형태입니다.

## 조용히 깨질 수 있는 곳

공식 문서가 "변경 없음"이라고 하는 곳과 "업데이트 필요"라고 하는 곳을 나눠 보면, 실제 사고가 나기 쉬운 지점은 **타입 체크나 빌드가 잡아주지 못하는 곳**입니다. 아래는 가이드 내용을 바탕으로 한 제 정리입니다.

| 지점                                   | 왜 조용한가                                                           | 확인 방법                                             |
| -------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------- |
| `request.url`로 경로를 비교하는 loader | 문서 요청에선 통과, **클라이언트 내비게이션의 데이터 요청에서만** 실패 | `new URL(request.url)` 사용처를 검색해 `url` 인자로 교체 |
| CDN·캐시·리라이트 규칙                  | 앱 저장소 밖에 있어 코드 리뷰에 안 걸림                                | `_root.data`, `.data` 패턴을 인프라 설정에서 검색      |
| `isSsrBuild` 분기 Vite 설정             | 설정이 무시되면 서버 엔트리가 바뀌어도 에러 없이 빌드될 수 있음        | `environments.ssr`로 옮긴 뒤 서버 번들 엔트리 확인      |
| 커스텀 서버의 load context              | 미들웨어 기본 활성화로 context 전달 방식이 달라짐                      | `getLoadContext` 반환값과 `context` 타입 점검          |
| Node 버전 핀                           | 22.12 같은 "22 계열"이면 괜찮다고 착각하기 쉬움                        | `.nvmrc`·CI 이미지·`engines`를 22.22+로                |

## v9를 미리 보면

v8 업그레이드 문서와 짝을 이루는 "Future Changes" 문서는 이미 **v9(2027년 중반 예상)** 를 향해 있습니다.

- **최소 버전**: `node@24+` — v8을 쓰는 동안 미리 올려둘 수 있습니다.
- **Future flag**: 아직 없음
- **예정된 breaking change**: 아직 없음

대신 프로덕션 비권장인 **unstable 플래그** 세 개가 있습니다.

| 플래그                                   | 모드        | 내용                                                                                   |
| ---------------------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `unstable_enableNodeReadableStream`      | Framework   | Node 22+의 안정화된 Web Streams를 활용해 Node에서도 `renderToPipeableStream` 대신 `renderToReadableStream` 사용 |
| `unstable_optimizeDeps`                  | Framework   | 클라이언트 엔트리·라우트 모듈을 Vite 의존성 최적화 대상에 넘겨 개발 서버 최적화 개선      |
| `unstable_routePatternMatching`          | Data Router | `@remix-run/route-pattern` 기반의 새 매처로 교체                                        |

가장 눈여겨볼 건 마지막 플래그입니다. 새 매처는 세그먼트 점수 합산이 아니라 **위치별 구체성**(앞쪽 정적 접두사가 길수록 우선)으로 순위를 매깁니다.

```ts
import { createBrowserRouter } from 'react-router';
import { unstable_preloadRoutePattern } from 'react-router/route-pattern';

unstable_preloadRoutePattern(); // 라우터 생성 전에 호출하지 않으면 생성 시 throw

const router = createBrowserRouter(routes, {
  future: {
    unstable_routePatternMatching: true,
  },
});
```

```ts
const routes = [
  { path: '/products/*', id: 'products' },
  { path: '/:first/:second/:third/:fourth', id: 'segments' },
];
// 새 매처: /products/one/two/three → 'products'
// (같은 위치에서 정적 세그먼트 'products'가 동적 ':first'보다 구체적)
```

주의할 점도 있습니다. `matchRoutes`·`matchPath`·`useMatch` 같은 독립 API는 **여전히 기존 매처**를 쓰고, 대소문자 구분 라우트는 이 플래그에서 아직 지원되지 않습니다. 라우트 패턴이 겹치는 앱이라면, 이 플래그가 정식이 되기 전에 겹치는 패턴을 한 번 정리해 두는 게 좋겠습니다.

## 앞으로의 React Router, 그리고 Remix

- **연 1회 메이저** — 메이저 버전을 정기적이고 예측 가능하게, 그래서 지루하게 만들겠다는 방침입니다.
- **지원 종료** — v8 출시와 함께 **React Router v6와 Remix v2가 EOL**이 되어 보안 업데이트도 끊깁니다. v7은 계속 보안 업데이트를 받습니다. 아직 v6에 머물러 있다면 지금이 v7로 올라갈 시점입니다.
- **Server Components / Server Actions** — 작업은 진행 중이지만 API를 확정하기 전이라 unstable로 남아 있습니다. opt-in 아키텍처이며, **마이너 버전에서 안정화**할 계획입니다.
- **Open Governance** — 커뮤니티 제안(Proposals) 기반으로 개발 우선순위를 정하는 모델을 유지합니다.
- **설계 원칙** — Less is More · Routing and Data Focused · Simple Migration Paths · Lowest Common Mode

Remix와의 관계도 정리됐습니다. Remix v0~v2는 사실상 React Router의 **feature branch**였고, 성숙한 아이디어와 API는 React Router로 다시 합쳐졌습니다. 덕분에 Remix는 React Router와 별개로 **"진정한 풀스택, 의존성 없는 JavaScript 웹 프레임워크"**(Remix 3 베타) 방향으로 갑니다.

어느 쪽을 써야 하느냐는 질문에 대한 팀의 답은 간단합니다. **검증된 것이 필요하면 React Router, 새로운 시도에 끌린다면 Remix 3.**

## 마무리

v8을 한 문장으로 정리하면 **"v7에서 이미 할 수 있던 일을, 이제 해야 하는 일로 바꾼 릴리스"** 입니다. 기능 목록은 v7 마이너 릴리스들에서 다 나왔고, v8은 그 기본값과 바닥(최소 버전)을 올렸을 뿐입니다.

그래서 업그레이드 난이도는 **v7에서 플래그를 얼마나 켜두었느냐**에 달려 있습니다. 다 켜두었다면 한 줄이고, 하나도 안 켰다면 이 글의 2~3단계를 v7 위에서 차례로 밟으면 됩니다. 어느 쪽이든 v8 설치는 마지막 단계여야 합니다.

**업그레이드 체크리스트:**

- ✅ Node 22.22+ · React/React DOM 19.2.7+ · (Framework) Vite 7+ — `.nvmrc`·CI·배포 이미지까지
- ✅ v7 최신으로 올리기
- ✅ `v8_middleware` — 커스텀 서버면 `getLoadContext`, Data 모드면 `Future` 타입 augmentation
- ✅ `v8_splitRouteModules` — v8에선 최상위 `splitRouteModules`
- ✅ `v8_viteEnvironmentApi` — `isSsrBuild` 분기를 `environments.ssr`로
- ✅ `v8_passThroughRequests` — `new URL(request.url)` 경로 비교를 `url` 인자로
- ✅ `v8_trailingSlashAwareDataRequests` — CDN·캐시·리라이트의 `/_root.data` → `/_.data`
- ✅ `meta`/`matches`/`useMatches()`의 `data` → `loaderData`
- ✅ `react-router-dom` 제거, import를 `react-router` / `react-router/dom`으로
- ✅ Cloudflare dev proxy → `@cloudflare/vite-plugin`, architect 옵션 정리
- ✅ 마지막에 `react-router@latest` 설치
- ✅ (선택) v9 대비 Node 24 검토

---

# 참고 문서

- Remix, [React Router v8](https://remix.run/blog/react-router-v8)
- React Router, [Updating from v7](https://reactrouter.com/upgrading/v7)
- React Router, [Future Changes](https://reactrouter.com/upgrading/future)
- React Router, [Brand Assets](https://reactrouter.com/brand) — 썸네일 로고 출처
- 이전 글 — [React Router v6](/ko/posts/2022-03-12-react-router-v6/) · [Vitest 5.0](/ko/posts/2026-09-15-vitest5/)
