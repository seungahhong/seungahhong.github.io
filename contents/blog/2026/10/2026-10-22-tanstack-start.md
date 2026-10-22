---
layout: post
title: TanStack Start 1.0
date: 2026-10-22
published: 2026-10-22
category: 개발
tags: ['tanstack', 'react', 'framework']
comments: true
thumbnail: './assets/22/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# TanStack Start 1.0 정식 출시: 개요 · 사용법 · 마이그레이션 가이드

## ✍️ 한 줄 요약

> **TanStack Start는 TanStack Router 위에 SSR · 스트리밍 · 서버 함수 · 미들웨어를 얹은 풀스택 React 프레임워크이고, 2026년 10월 13일 1.0(npm `1.169`)으로 정식 안정화됐습니다.** 기본값은 "서버에서 그리고 브라우저에서 하이드레이션하는 익숙한 앱"이고 서버가 필요한 일만 `createServerFn` 같은 명시적인 API로 넘긴다는 점이, 서버 컴포넌트가 기본인 Next.js App Router와 가장 크게 갈리는 지점입니다.

### 요약

- **출시**: 2026년 10월 13일 TanStack 블로그 공지("TanStack Start 1.0 is Stable"). 첫 안정 패키지는 `@tanstack/react-start@1.169.0`이고, 글을 쓰는 시점(2026-10-22)의 최신은 `1.169.3`입니다. '1.0'은 제품 버전 이름이라 `@tanstack/react-start@1.0`이 아니라 `1.169` 이상을 설치합니다(RC 기간에도 이미 1.1xx였기 때문에 숫자만으로는 RC와 정식을 구분할 수 없습니다).
- **정체성**: 라우팅은 **전부 TanStack Router**가 맡고, Start는 그 위에 풀 도큐먼트 SSR · 스트리밍 · 서버 함수(타입 안전 RPC) · 서버 라우트(API) · 미들웨어/컨텍스트 · 클라이언트/서버 빌드 · 유니버설 배포를 더합니다. 공식 홈페이지 기준으로 React와 Solid를 지원합니다.
- **빌드 도구**: **Vite 8 이상** 또는 **Rsbuild 2**. Node는 22.12 이상입니다.
- **실행 모델**: 모든 코드는 기본이 **isomorphic**(서버·클라이언트 양쪽에서 실행)입니다. 라우트 `loader`도 첫 요청에선 서버에서, 이후 내비게이션에선 브라우저에서 돕니다. 비밀값과 DB 접근은 서버 함수나 `.server.ts` 파일로 경계를 그어야 합니다.
- **렌더링 선택지**: 라우트별 `ssr: true | 'data-only' | false`(Selective SSR), 앱 전체 SPA 모드, 정적 프리렌더링, HTTP 캐시 헤더 기반 ISR을 한 프레임워크 안에서 고릅니다.
- **RSC**: **실험적 · opt-in** 입니다. Next.js처럼 기본 컴포넌트 모델이 아니라, 서버 함수가 서버에서 렌더링한 UI를 돌려주고 클라이언트가 그것을 조합하는 방식입니다. Next.js식 `'use server'` 액션은 **의도적으로 지원하지 않고** 명시적인 서버 함수만 씁니다.
- **마이그레이션**: RC → 1.0은 Vite 8 필수, `.inputValidator()` → `.validator()`, `useSession` 제거, Nitro 플러그인 교체, 에러·응답 동작 변경이 핵심입니다. Next.js App Router → Start는 공식 가이드와 before/after 예제가 있고, Remix 2 / React Router 7 가이드는 아직 "coming soon"입니다.
- **보안 이력**: 2026년 9월 30일 공개된 **CVE-2026-102989**(서버 함수 응답 처리의 반사형 XSS, CVSS 9.3). 실제로 설치된 `@tanstack/start-server-core`가 **1.169.39 이상**인지 확인하고 재배포해야 합니다. 5월 11일에는 42개 `@tanstack/*` 패키지에 악성 버전이 올라간 npm 공급망 공격(CVE-2026-45321)도 있었습니다.

| 항목           | 내용                                                                              |
| -------------- | --------------------------------------------------------------------------------- |
| **버전**       | 1.0 = npm `1.169.x` (2026-10-13 공지)                                             |
| **기반**       | TanStack Router · Vite 8+ 또는 Rsbuild 2 · Node 22.12+                            |
| **핵심 API**   | `createServerFn` · `createMiddleware` · `createIsomorphicFn` · 서버 라우트         |
| **렌더링**     | SSR(기본) · data-only · client-only · SPA 모드 · 프리렌더링 · ISR                  |
| **배포**       | Cloudflare Workers · Netlify · Railway · Vercel · Nitro · Node/Docker · Bun 등    |
| **실험적 기능** | Server Components · Static Server Functions · Deferred Hydration                 |

아래부터는 상세 내용입니다.

---

## 📋 목차

1. [개요: TanStack Start는 무엇인가](#개요-tanstack-start는-무엇인가)
2. [1.0까지 걸어온 길](#10까지-걸어온-길)
3. [핵심 개념: 이 코드는 어디서 실행되는가](#핵심-개념-이-코드는-어디서-실행되는가)
4. [사용법](#사용법)
5. [렌더링 모드 고르기](#렌더링-모드-고르기)
6. [배포](#배포)
7. [마이그레이션 ① RC → 1.0](#마이그레이션--rc--10)
8. [마이그레이션 ② Next.js App Router → Start](#마이그레이션--nextjs-app-router--start)
9. [장점](#장점)
10. [단점과 주의할 점](#단점과-주의할-점)
11. [실제 도입 사례와 반대 사례](#실제-도입-사례와-반대-사례)
12. [Next.js · React Router와 비교](#nextjs--react-router와-비교)
13. [마무리](#마무리)

## 개요: TanStack Start는 무엇인가

TanStack Start는 **TanStack Router로 움직이는 풀스택 React 프레임워크** 입니다. 풀 도큐먼트 SSR, 스트리밍, 서버 함수, 클라이언트/서버 빌드를 제공하고, Vite와 Rsbuild를 지원하기 때문에 원하는 호스팅이나 런타임에 그대로 배포할 수 있습니다.

구성 요소는 두 개뿐입니다.

- **TanStack Router** — 중첩 라우팅, search params, 데이터 로딩을 타입 안전하게 다루는 라우터
- **Vite 또는 Rsbuild** — HMR과 프로덕션 빌드를 담당하는 빌드 도구

### Router만 쓸까, Start를 쓸까

공식 문서는 "프레임워크의 90%는 라우터"라고 말합니다. Start는 라우팅을 **전적으로** TanStack Router에 맡기고, 그 위에 서버 쪽 기능을 얹습니다. 그래서 질문은 "서버 기능이 필요한가"로 바뀝니다.

| 필요한 것                                  | Router만 | Start |
| ------------------------------------------ | :------: | :---: |
| 타입 안전 라우팅 · search params · loader  |    ✅    |  ✅   |
| 풀 도큐먼트 SSR · 스트리밍                 |    △     |  ✅   |
| 서버 함수(타입 안전 RPC) · 서버 라우트(API) |    —     |  ✅   |
| 요청/서버 함수 미들웨어 · 컨텍스트         |    —     |  ✅   |
| 클라이언트+서버 풀스택 빌드 · 유니버설 배포 |    —     |  ✅   |

△는 TanStack Router에도 실험적인 SSR · 스트리밍 API가 있지만 직접 조립해야 한다는 뜻입니다. Start는 이를 기본 제공 형태로 묶어 줍니다. 위 기능이 **하나도 필요 없다고 확신할 때만** Router 단독(SPA)을 권한다는 게 공식 입장입니다.

### 어떤 철학으로 만들었나

1.0 공지에서 Tanner Linsley가 밝힌 출발점은 분명합니다. React 생태계가 "애플리케이션은 이래야 한다"는 상을 한 가지로 좁히고 있다고 느꼈고 — Next.js는 RSC에 크게 베팅하며 서버 중심 모델로, React Router와 Remix는 각자의 변화로 — 자신은 **지난 10년간 만들어 온 방식**(상태 관리, 클라이언트 내비게이션, 데이터 캐싱)을 그대로 유지하면서 서버 렌더링 · 스트리밍 · 서버 함수 같은 새 기능을 **필요한 곳에만** 쓰고 싶었다는 것입니다.

그래서 Start의 기본값은 이렇습니다.

- 컴포넌트는 그냥 컴포넌트, 라우트는 그냥 라우트입니다. `'use client'` 경계를 그릴 필요가 없습니다.
- 라우트는 서버에서 렌더링할 수도, 데이터만 서버에서 불러오고 컴포넌트는 클라이언트에서 그릴 수도, 전부 클라이언트에서 처리할 수도 있습니다.
- 서버가 필요하면 **명시적인 API**(`createServerFn`, 미들웨어)로 넘어갑니다.
- RSC도 앱 모델을 바꾸지 않는 **선택 기능**으로 붙습니다.

## 1.0까지 걸어온 길

| 시점        | 사건                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------- |
| 2023년 12월 | 저장소에 Start의 시초가 되는 서버 유틸리티 작업이 등장                                     |
| 2024년 5월  | `react-router-server` 패키지를 `start`로 이름 변경                                         |
| 2025년 6월  | `1.121.0` — Vinxi를 걷어내고 Vite 플러그인 구조로 전환("devinxi")                          |
| 2025년 9월  | `1.132.0` 배포와 함께 "v1 Release Candidate" 공지(9/23)                                    |
| 2026년 4월  | React Server Components를 실험 기능으로 공개(4/13, "React Server Components Your Way")      |
| 2026년 5월  | npm 공급망 공격(CVE-2026-45321) — 악성 버전은 배포 당일 제거(5/11)                         |
| 2026년 6월  | Rsbuild 지원 공식화 · `.validator()`가 정식 이름으로 복귀                                   |
| 2026년 9월  | CVE-2026-102989 보안 패치 공지(9/30)                                                       |
| 2026년 10월 | `1.169.0` 배포, **1.0 안정 버전 공지**(10/13, KST)                                         |

1.0 공지에서 눈여겨볼 대목은 세 가지입니다.

- **"이제야 RC라는 단서를 뗀다"** — 작은 프로젝트부터 Fortune 500 기업까지(기업명은 밝히지 않았습니다) 베타·RC 단계에서 이미 프로덕션에 쓰고 있었고, 1.0은 그 API들에 대한 공식적인 약속이라는 설명입니다. RC 이후 "짧은 마무리"를 예상했지만 실제로는 컴파일러, 스트리밍, 서버 경계, 하이드레이션 작업이 꽤 많이 들어갔습니다.
- **SSR 처리량 약 5.5배** — 메인테이너들이 서버가 하지 않아도 되는 일을 프로파일링으로 걷어내, 자체 벤치마크에서 처리량을 약 5.5배로 끌어올렸다고 합니다. 다른 프레임워크와의 비교가 아니라 **최적화 이전의 Start 대비** 수치라는 점은 구분해 두는 게 좋습니다.
- **에이전트와 타입** — 라우터를 타입 안전하고 엄격하게 만든 설계가 에이전트 시대에도 그대로 이점이 된다는 주장입니다. 에이전트가 라우트 파라미터나 서버 함수 입력을 바꾸면 **어긋난 곳을 타입이 찾아 준다**는 것이죠. 같은 맥락에서 TanStack Intent로 npm 패키지 안에 에이전트용 스킬을 함께 배포하고 있습니다.

RSC에 대한 솔직한 회고도 있습니다. 팀은 RSC를 Start의 앱 모델을 바꾸지 않는 방식으로 통합하는 데 많은 시간을 들였지만, 정작 tanstack.com에서는 "무엇이 어디로 배포되는지" 추적하기가 너무 복잡해져 **RSC를 다시 걷어냈다**고 합니다. 그리고 그걸 걷어내는 데 앱을 다시 짤 필요가 없었다는 점을 opt-in 설계의 근거로 듭니다.

## 핵심 개념: 이 코드는 어디서 실행되는가

Start를 쓰면서 가장 먼저 익혀야 할 규칙은 하나입니다. **모든 코드는 기본적으로 isomorphic** 입니다. 따로 제한하지 않으면 서버 번들과 클라이언트 번들 **양쪽에** 들어갑니다.

특히 **라우트 `loader`는 서버 전용이 아닙니다.** 첫 요청(SSR)에서는 서버에서, 이후 클라이언트 내비게이션에서는 브라우저에서 실행됩니다. Next.js의 async Server Component나 React Router의 서버 `loader`에 익숙하다면 이 부분이 가장 큰 함정입니다.

```tsx
// ❌ 첫 요청(SSR)에선 동작하지만, 클라이언트 내비게이션 때는 브라우저에서 실행된다.
//    브라우저 코드는 빌드 도구의 공개 접두사(VITE_ 등)가 붙은 변수만 읽을 수 있어서
//    SECRET은 읽히지 않고, 이를 "고치려고" VITE_ 접두사를 붙이면 비밀값이 번들에 박힌다.
export const Route = createFileRoute('/users')({
  loader: async () => {
    const secret = process.env.SECRET;
    const res = await fetch(`https://api.example.com/users?key=${secret}`);
    return res.json();
  },
});

// ✅ 비밀값이 필요한 로직은 서버 함수 안에서 읽고, loader는 그것을 호출만 한다
const getUsers = createServerFn().handler(async () => {
  const secret = process.env.SECRET;
  const res = await fetch(`https://api.example.com/users?key=${secret}`);
  return res.json();
});

export const Route = createFileRoute('/users')({
  loader: () => getUsers(),
});
```

공식 문서의 규칙은 간단합니다. 서버 코드는 접두사 없는 `process.env`를 읽을 수 있고, 클라이언트 코드는 빌드 도구의 공개 접두사(Vite `VITE_`, Rsbuild `PUBLIC_`)가 붙은 값만 읽습니다. 그러니 "loader에서 읽던 비밀값"은 접두사를 붙일 게 아니라 **서버 함수 안으로 옮기는 것**이 정답입니다.

실행 위치를 제어하는 API는 다음과 같습니다.

| API                                       | 용도                         | 반대쪽 환경에서의 동작           |
| ----------------------------------------- | ---------------------------- | -------------------------------- |
| `createServerFn()`                        | RPC, 데이터 변경             | 클라이언트에서는 서버로 네트워크 요청 |
| `createServerOnlyFn(fn)`                  | 서버 전용 유틸               | 클라이언트에서 호출하면 throw    |
| `createClientOnlyFn(fn)`                  | 브라우저 전용 유틸           | 서버에서 호출하면 throw          |
| `createIsomorphicFn().server().client()`  | 환경별로 다른 구현           | 각 번들에서 반대쪽 구현이 제거됨 |
| `<ClientOnly fallback>`                   | 브라우저 API가 필요한 컴포넌트 | 서버에서는 fallback을 렌더       |
| `useHydrated()`                           | 하이드레이션 여부 분기       | SSR과 첫 클라이언트 렌더에선 `false` |

1.0 공지에 실린 `createIsomorphicFn` 예시가 이 모델을 잘 보여줍니다. 현재 origin을 구하는 방법이 서버(요청 URL)와 브라우저(`window.location`)에서 다른데, 두 구현을 나란히 두면 Start가 각 번들에서 반대쪽 구현을 지워 줍니다. 브라우저에서 호출해도 서버로 요청이 가지 않습니다.

```tsx
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

const getOrigin = createIsomorphicFn()
  .server(() => new URL(getRequest().url).origin)
  .client(() => window.location.origin);

// 서버 요청 중이든 브라우저든 같은 호출
const absoluteUrl = new URL('/about', getOrigin()).href;
```

파일 단위로 경계를 그을 수도 있습니다. `*.server.*` / `*.client.*` 접미사가 붙은 파일은 **Import Protection**(기본 활성화)이 반대쪽 번들에 들어가지 못하게 막고, 파일 이름을 바꿀 수 없다면 맨 위에 마커를 import 합니다.

```ts
// src/lib/secrets.ts — 파일명을 *.server.ts로 바꿀 수 없을 때
import '@tanstack/react-start/server-only';

export function getApiKey() {
  return process.env.API_KEY;
}
```

한 가지 더, **모듈 최상위에서 `process.env`를 읽지 마세요.** 클라이언트 번들에 값이 인라인될 수 있을 뿐 아니라, Cloudflare Workers 같은 엣지 런타임은 env를 **요청마다** 주입하기 때문에 모듈 로드 시점에는 서버에서도 `undefined`가 됩니다. `.handler()`, 미들웨어 `.server()`, 서버 라우트 핸들러 안에서 읽어야 합니다.

## 사용법

### 1. 프로젝트 만들기

가장 빠른 길은 세 가지입니다.

- **TanStack Builder** — 공식 문서가 첫 번째로 권하는 AI 기반 셋업 흐름(`tanstack.com/builder`)
- **CLI** — 패키지 매니저와 Tailwind CSS · ESLint 같은 애드온을 고르며 생성

```bash
npx @tanstack/cli@latest create
```

- **공식 예제에서 시작** — `start-basic`, `start-basic-rsbuild`, `start-basic-auth`, `start-basic-react-query`, `start-clerk-basic`, `start-supabase-basic`, `start-workos` 등

```bash
npx gitpick TanStack/router/tree/main/examples/react/start-basic start-basic
cd start-basic
npm install
npm run dev
```

### 2. 직접 구성해 보기

구조를 이해하려면 한 번은 손으로 만들어 보는 게 좋습니다. 필요한 파일은 많지 않습니다.

```bash
npm i @tanstack/react-start @tanstack/react-router react react-dom
npm i -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/node
```

`package.json`은 ESM으로 두고 Vite CLI를 씁니다.

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}
```

`vite.config.ts`에서는 **Start 플러그인이 React 플러그인보다 앞에** 와야 합니다.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart(),
    // React 플러그인은 반드시 Start 플러그인 뒤에
    viteReact(),
  ],
});
```

Rsbuild를 쓴다면 `@rsbuild/core`와 `@rsbuild/plugin-react`를 설치하고 `@tanstack/react-start/plugin/rsbuild`의 `tanstackStart()`를 `pluginReact()`와 함께 등록하면 됩니다.

`tsconfig.json`은 `jsx: "react-jsx"`, `moduleResolution: "Bundler"`, `module: "ESNext"`, `target: "ES2022"` 정도면 충분합니다. 단, **`verbatimModuleSyntax`는 켜지 마세요.** 서버 번들이 클라이언트 번들로 새어 나갈 수 있다고 공식 문서가 경고합니다.

최소 구성의 파일 트리는 이렇습니다.

```text
src/
├── routes/
│   └── __root.tsx
├── router.tsx
└── routeTree.gen.ts   ← 처음 실행할 때 자동 생성
vite.config.ts
package.json
tsconfig.json
```

`router.tsx`는 **호출할 때마다 새 라우터를 돌려주는** `getRouter`를 export 합니다. SSR 요청마다 라우터를 새로 만들기 때문입니다.

```tsx
// src/router.tsx
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}
```

루트 라우트는 문서 셸(`<html>`, `<head>`, `<body>`)을 그리고, `<head>`에는 `HeadContent`를, `<body>` 끝에는 `Scripts`를 둡니다.

```tsx
// src/routes/__root.tsx
import type { ReactNode } from 'react';
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TanStack Start Starter' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

### 3. 첫 라우트: loader와 서버 함수

공식 튜토리얼의 카운터 예제는 Start의 기본 흐름을 한 파일에 담고 있습니다. **GET 서버 함수로 읽고, POST 서버 함수로 쓰고, loader로 초기 데이터를 넣고, 변경 후 `router.invalidate()`로 다시 불러옵니다.**

```tsx
// src/routes/index.tsx
import * as fs from 'node:fs';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

const filePath = 'count.txt';

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'),
  );
}

const getCount = createServerFn({ method: 'GET' }).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <button
      type="button"
      onClick={() => {
        updateCount({ data: 1 }).then(() => {
          router.invalidate();
        });
      }}
    >
      Add 1 to {state}?
    </button>
  );
}
```

`node:fs`를 import 했는데도 클라이언트 번들이 깨지지 않는 이유는, 빌드가 클라이언트 쪽에서 서버 함수 구현을 **RPC 스텁으로 바꿔치기** 하기 때문입니다. 브라우저에서 `updateCount()`를 부르면 `fetch` 요청이 되고, 실제 코드는 서버에만 남습니다.

### 4. 서버 함수 제대로 쓰기

서버 함수는 `data` 인자 하나를 받습니다. 네트워크 경계를 넘으므로 **런타임 검증**이 기본이고, Zod 같은 스키마를 그대로 넘길 수 있습니다.

```tsx
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(0),
});

export const createUser = createServerFn({ method: 'POST' })
  .validator(UserSchema)
  .handler(async ({ data }) => {
    // data는 검증과 타입 추론이 끝난 상태
    return `Created user: ${data.name}, age ${data.age}`;
  });
```

`redirect()`를 throw 하면 loader · beforeLoad 같은 라우트 생명주기와 `useServerFn()` 양쪽에서 자동으로 이동 처리됩니다. `notFound()`는 loader · beforeLoad에서 던질 때 `notFoundComponent`로 이어집니다. 공식 문서는 `useServerFn()`도 둘 다 처리한다고 설명하지만, 현재 `useServerFn` 소스는 redirect만 처리하므로 **이벤트 핸들러에서 부른 서버 함수의 `notFound()`는 일반 에러로 받게** 됩니다.

```tsx
import { createServerFn } from '@tanstack/react-start';
import { notFound } from '@tanstack/react-router';

export const getPost = createServerFn()
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const post = await db.findPost(data.id);
    if (!post) {
      throw notFound();
    }
    return post;
  });
```

규모가 커지면 공식 문서가 제안하는 파일 규칙을 따르는 게 편합니다.

```text
src/utils/
├── users.functions.ts   # createServerFn 래퍼 — 어디서 import 해도 안전
├── users.server.ts      # DB 쿼리 등 서버 전용 헬퍼 — 서버 함수 핸들러 안에서만 사용
└── schemas.ts           # 클라이언트에서도 쓰는 검증 스키마
```

서버 함수는 정적 import 하면 어디서든 안전하지만 **동적 `import()`는 번들러 문제를 일으킬 수 있으니 피하라**고 합니다.

알아 둘 기본값도 있습니다.

- **CSRF 보호** — 서버 함수는 같은 출처(same-origin) RPC입니다. `src/start.ts`가 없으면 Start가 `createCsrfMiddleware()`를 자동으로 설치하지만, **`src/start.ts`를 직접 만들면 이 미들웨어를 명시적으로 추가해야 합니다.** 이 미들웨어는 `Sec-Fetch-Site` · `Origin` · `Referer` 헤더로 출처를 확인하고 세 헤더가 모두 없는 요청은 기본으로 거부하므로, 이런 헤더를 지우는 프록시 뒤에 배포한다면 미리 확인해 두세요.
- **직렬화 타입 검사** — 입력과 반환값이 직렬화 가능한지 TypeScript가 검사합니다(`strict` 기본). `FormData`(POST)와 `Response`는 허용됩니다.
- **캐시 헤더** — `setResponseHeaders`로 `Cache-Control`을 지정할 수 있는데, 세션이나 쿠키에 따라 달라지는 응답에 `public`을 쓰면 **다른 사용자에게 응답이 재생될 수 있으니** `private`(+ `Vary`) 또는 `no-store`를 써야 합니다.

```tsx
// src/start.ts — 이 파일을 만들었다면 CSRF 미들웨어를 직접 등록
import { createStart, createCsrfMiddleware } from '@tanstack/react-start';

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
}));
```

### 5. 미들웨어

미들웨어는 두 종류입니다.

| 구분          | 요청 미들웨어                         | 서버 함수 미들웨어                 |
| ------------- | ------------------------------------- | ---------------------------------- |
| 범위          | 모든 서버 요청(SSR, 서버 라우트, 서버 함수) | 서버 함수만                    |
| 메서드        | `.server()`                           | `.client()`, `.server()`           |
| 입력 검증     | 없음                                  | `.validator()`                     |
| 클라이언트 로직 | 없음                                | 있음(RPC 전후)                     |

가장 흔한 쓰임은 인증입니다. 세션 조회를 미들웨어로 모아 두고, 비공개 데이터를 다루는 **모든** 서버 함수에 붙입니다.

```ts
// src/server/auth-middleware.ts
import { createMiddleware } from '@tanstack/react-start';
import { readSessionToken } from './session';

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const token = readSessionToken();
    const session = token ? await db.sessions.findValid(token) : null;
    if (!session) throw new Error('Unauthorized');
    return next({ context: { session } });
  },
);
```

```ts
import { createServerFn } from '@tanstack/react-start';
import { authMiddleware } from '~/server/auth-middleware';

export const getMyOrders = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // context.session이 타입과 함께 들어온다
    return db.orders.findMany({ where: { userId: context.session.userId } });
  });
```

공식 문서가 여러 번 강조하는 문장이 있습니다. **라우트 가드(`beforeLoad`)는 데이터 인가 경계가 아닙니다.** 서버 함수와 서버 라우트는 그것을 부르는 화면과 무관하게 **독립적으로 호출 가능한 API 엔드포인트**이므로, 인가는 핸들러나 미들웨어에서 해야 합니다. `beforeLoad`의 리다이렉트는 UX일 뿐입니다.

모든 요청이나 모든 서버 함수에 적용할 전역 미들웨어는 `src/start.ts`의 `createStart`에 `requestMiddleware` / `functionMiddleware` 배열로 등록합니다. 클라이언트 → 서버로 컨텍스트를 보내는 `sendContext`는 타입은 맞춰 주지만 **런타임 검증은 하지 않으므로**, 서버 미들웨어에서 다시 검증해야 합니다. 세션처럼 신뢰가 필요한 값은 절대 `sendContext`에서 꺼내면 안 됩니다.

### 6. 서버 라우트(API 엔드포인트)

외부에서 호출할 HTTP 엔드포인트(웹훅, 공개 API, 파일 응답 등)는 **서버 라우트**로 만듭니다. 앱 라우트와 같은 `src/routes` 디렉터리에, 같은 파일 규칙으로 둡니다.

```ts
// src/routes/hello.ts
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/hello')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response('Hello, World! from ' + request.url);
      },
    },
  },
});
```

| 언제                                        | 무엇을                |
| ------------------------------------------- | --------------------- |
| Start 앱 안에서 부르고, 직렬화를 맡기고 싶다 | 서버 함수             |
| 앱 바깥(다른 서비스, 웹훅, 크롤러)에서 부른다 | 서버 라우트           |
| 둘 다 필요하다                              | 같은 파일에 `component`와 `server`를 함께 |

### 7. TanStack Query와 함께 쓰기

Router loader가 내비게이션을 조율하고, Query가 데이터의 신선도와 뮤테이션 상태를 맡는 조합입니다. `@tanstack/react-query`와 `@tanstack/react-router-ssr-query`를 설치하고, **`QueryClient`를 `getRouter` 안에서 만듭니다.** 모듈 최상위에 두면 SSR 요청 사이에 캐시가 공유되어 한 사용자의 데이터가 다른 사용자의 HTML에 섞일 수 있습니다.

```tsx
// src/router.tsx
import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
  });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  });

  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
}
```

자식 라우트의 loader에서 `context.queryClient`를 쓰려면 루트 라우트를 `createRootRouteWithContext<{ queryClient: QueryClient }>()`로 만들어 컨텍스트 타입을 선언합니다. Query Provider와 SSR dehydrate/hydrate는 통합 패키지가 맡으므로 직접 추가하지 않습니다.

loader와 컴포넌트가 **같은 `queryOptions`** 를 공유하면, loader가 채운 캐시를 컴포넌트가 읽고 통합 패키지가 브라우저로 넘겨 줍니다. 하이드레이션 뒤에 같은 요청이 다시 나가지 않습니다.

```tsx
// src/routes/preferences.tsx
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { readerNameOptions } from '../utils/preferences';

export const Route = createFileRoute('/preferences')({
  loader: async ({ context }) => {
    await context.queryClient.query(readerNameOptions);
  },
  component: Preferences,
});

function Preferences() {
  const { data: name } = useSuspenseQuery(readerNameOptions);
  return <p>Hello, {name}</p>;
}
```

뮤테이션 후에는 **데이터의 실제 주인**을 무효화해야 합니다. `queryClient.invalidateQueries`는 Query 캐시를, `router.invalidate()`는 loader 데이터와 라우트 컨텍스트를 다시 불러옵니다. 어느 쪽도 CDN이나 DB 캐시를 비우지는 않습니다. 이전에 정리한 [react-query(v5)](/ko/posts/2023-07-23-react-query-v5/)의 `queryOptions` 패턴이 여기서 그대로 쓰입니다.

## 렌더링 모드 고르기

Start의 가장 실용적인 장점은 렌더링 방식을 **라우트 단위로** 고를 수 있다는 점입니다.

| 모드                  | 설정                                  | 첫 요청 때 서버가 하는 일                     | 어울리는 화면                         |
| --------------------- | ------------------------------------- | --------------------------------------------- | ------------------------------------- |
| **Full SSR**(기본)    | `ssr: true`                           | `beforeLoad` · `loader` 실행 + 컴포넌트 렌더   | SEO와 첫 화면이 중요한 페이지          |
| **Data-only**         | `ssr: 'data-only'`                    | `beforeLoad` · `loader`만 실행                 | 데이터는 서버에서, 컴포넌트는 브라우저 API 의존 |
| **Client-only**       | `ssr: false`                          | 실행하지 않음(fallback만 렌더)                 | loader가 `localStorage` 등에 의존      |
| **SPA 모드**          | `tanstackStart({ spa: { enabled: true } })` | 빌드 때 루트 셸을 프리렌더(`/_shell.html`) | CDN 정적 호스팅, SEO가 필요 없는 앱    |
| **정적 프리렌더링**   | `tanstackStart({ prerender: { enabled: true } })` | 빌드 때 HTML 생성                   | 블로그, 문서, 마케팅 페이지            |
| **ISR**               | `Cache-Control` + CDN                 | 캐시 만료 후 다음 요청에서 재생성              | 자주 바뀌지 않는 공개 페이지           |

### Selective SSR

```tsx
// src/routes/posts/$postId.tsx
export const Route = createFileRoute('/posts/$postId')({
  ssr: 'data-only',
  loader: () => {
    // 첫 요청에서는 서버, 이후 내비게이션에서는 클라이언트
  },
  component: () => <div>이 컴포넌트는 클라이언트에서 렌더링된다</div>,
});
```

`ssr`은 함수로도 줄 수 있습니다. 검증이 끝난 `params`와 `search`를 받아 요청마다 결정하고, 이 함수는 서버에서만 실행되며 클라이언트 번들에서는 제거됩니다.

```tsx
export const Route = createFileRoute('/docs/$docType/$docId')({
  validateSearch: z.object({ details: z.boolean().optional() }),
  ssr: ({ params, search }) => {
    if (params.status === 'success' && params.value.docType === 'sheet') {
      return false;
    }
    if (search.status === 'success' && search.value.details) {
      return 'data-only';
    }
  },
});
```

**상속 규칙**이 중요합니다. 자식 라우트는 부모 설정을 물려받고, **더 엄격한 쪽으로만** 바꿀 수 있습니다(`true` → `'data-only'` → `false`). 부모가 `ssr: false`면 자식에 `ssr: true`를 써도 효과가 없습니다. 기본값 자체를 바꾸려면 `src/start.ts`의 `createStart(() => ({ defaultSsr: false }))`를 씁니다. 그리고 이 설정은 **첫 요청**에만 해당합니다. 이후 클라이언트 내비게이션에서는 모드와 상관없이 `beforeLoad`와 `loader`가 브라우저에서 실행됩니다.

### SPA 모드

SSR이 없다고 서버 기능을 포기하는 건 아닙니다. 빌드 후 루트 라우트를 프리렌더해 `/_shell.html`을 만들고(매칭된 라우트 자리에는 pending 컴포넌트가 들어갑니다), 서버 함수와 서버 라우트는 그대로 쓸 수 있습니다. 다른 라우트도 함께 프리렌더할 수 있고, 공식 문서는 가능한 한 많이 프리렌더하라고 권합니다. 대신 호스팅 쪽에 리라이트 규칙이 필요합니다(Netlify `_redirects` 예).

```text
# 서버 함수와 API는 서버로 통과
/_serverFn/* /_serverFn/:splat 200
/api/* /api/:splat 200

# 나머지 404는 SPA 셸로
/* /_shell.html 200
```

### 정적 프리렌더링

```ts
// vite.config.ts
tanstackStart({
  prerender: {
    enabled: true,
    crawlLinks: true, // HTML에서 링크를 따라가며 함께 프리렌더
    concurrency: 14,
    failOnError: true,
    filter: ({ path }) => !path.startsWith('/do-not-render-me'),
  },
});
```

### Server Components(실험적)

RSC는 기본으로 꺼져 있고, 켜려면 React 19+, Vite 8+ 또는 Rsbuild 2가 필요합니다. Vite에서는 `@vitejs/plugin-rsc`를 설치하고 `tanstackStart({ rsc: { enabled: true } })`와 `rsc()` 플러그인을 함께 등록합니다. 사용 방식은 "서버 함수가 서버 컴포넌트를 렌더링해 돌려주고, loader가 그것을 받는" 형태입니다.

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { renderServerComponent } from '@tanstack/react-start/rsc';

function Greeting() {
  return <h1>Hello from RSC</h1>;
}

const getGreeting = createServerFn().handler(async () => {
  const Renderable = await renderServerComponent(<Greeting />);
  return { Renderable };
});

export const Route = createFileRoute('/')({
  loader: async () => {
    const { Renderable } = await getGreeting();
    return { Greeting: Renderable };
  },
  component: HomePage,
});

function HomePage() {
  const { Greeting } = Route.useLoaderData();
  return <>{Greeting}</>;
}
```

슬롯이 필요하면 `createCompositeComponent`로 만든 소스를 `<CompositeComponent src={...}>`로 렌더링하고, 그 안에 클라이언트 컴포넌트를 children으로 끼워 넣습니다. 서버가 만든 UI를 클라이언트가 조합하는 구조라서, 컴포넌트 트리의 주인이 여전히 클라이언트 쪽 라우터라는 점이 Next.js와 다릅니다.

알아 둘 제약도 있습니다. RSC는 React의 Flight 프로토콜을 그대로 쓰기 때문에 서버 컴포넌트 안에서는 Start 고유의 직렬화를 아직 쓸 수 없고(원시값 · Date · React 요소는 가능), TanStack Query로 서버 컴포넌트를 캐시할 때는 `structuralSharing: false`가 필수입니다.

RSC를 공개한 글("React Server Components Your Way", 2026-04-13)은 **`'use server'` 액션을 의도적으로 지원하지 않는다**고 밝힙니다. 이미 알려진 공격 벡터가 있고, 네트워크 경계를 암묵적으로 만든다는 이유입니다. 같은 글은 Start가 클라이언트에서 온 Flight 데이터를 파싱하지 않기 때문에 다른 RSC 프레임워크를 덮친 최근 CVE가 해당하지 않는다고 설명하는데, 독립 감사가 아니라 TanStack의 자체 평가라는 점은 감안해야 합니다.

공식 비교 문서는 이 기능을 **"Next.js와 동등한 프로덕션 기능처럼 소개하면 안 된다"** 고 직접 선을 긋고 있습니다. RSC가 앱의 중심이라면 이 점을 먼저 고려해야 합니다.

## 배포

Start는 **어떤 호스팅에서도 동작하도록** 설계됐고, 공식 호스팅 파트너는 Cloudflare · Netlify · Railway입니다. 문서에 가이드가 있는 대상은 Cloudflare Workers, Netlify, Railway, Nitro, Vercel, Node.js/Docker, Bun, Appwrite Sites입니다.

가장 범용적인 방법은 **Nitro** 입니다. Vite Environment API와 네이티브로 통합되며, Nitro가 지원하는 수많은 호스팅으로 배포할 수 있습니다(문서에는 아직 활발히 개발 중이라는 경고가 붙어 있습니다).

```ts
// vite.config.ts
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import { nitro } from 'nitro/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tanstackStart(), nitro(), viteReact()],
});
```

Cloudflare Workers는 `@cloudflare/vite-plugin`과 `wrangler`를 쓰고, SSR 환경을 Workers로 지정합니다.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    viteReact(),
  ],
});
```

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "tanstack-start-app",
  "compatibility_date": "2025-09-02",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry"
}
```

Netlify는 `@netlify/vite-plugin-tanstack-start`가 빌드 설정과 로컬 플랫폼 에뮬레이션을 함께 해 줍니다. Rsbuild로 빌드하면 `dist/client`에 클라이언트 자산, `dist/server/index.js`에 fetch 스타일 서버 엔트리가 나옵니다.

환경 변수는 서버 코드에서 접두사 없는 `process.env`를 읽고, 클라이언트에는 빌드 도구의 공개 접두사(Vite `VITE_`, Rsbuild `PUBLIC_`)가 붙은 값만 노출됩니다.

배포 전에는 공식 **Production Checklist** 를 한 번 돌려 보길 권합니다. 무해한 테스트 비밀값으로 빌드한 뒤 클라이언트 산출물에서 그 값을 검색해 보는 것, 로그아웃 상태와 다른 계정으로 비공개 엔드포인트를 **직접** 호출해 보는 것 같은 항목이 들어 있습니다.

## 마이그레이션 ① RC → 1.0

RC를 쓰고 있었다면 `@tanstack/react-start` 1.169로 올리면서 아래를 정리하면 됩니다.

**Vite 8이 필수입니다.** Vite로 빌드한다면 Vite 8 마이그레이션부터 끝내세요([Vite 8.0 정리 글](/ko/posts/2026-07-13-vite8.0/)).

### 제거된 API

| 제거됨                                           | 대체                                                                 |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| `@tanstack/nitro-v2-vite-plugin`                 | `nitro/vite`의 `nitro()`                                             |
| `useSession`                                     | iron-session 같은 세션 라이브러리                                    |
| 서버 함수 · 미들웨어의 `.inputValidator()`       | `.validator()`(같은 validator를 그대로 전달)                         |

```ts
// Before (RC)
export const greetUser = createServerFn({ method: 'GET' })
  .inputValidator((data: { name: string }) => data)
  .handler(async ({ data }) => `Hello, ${data.name}!`);

// After (1.0)
export const greetUser = createServerFn({ method: 'GET' })
  .validator((data: { name: string }) => data)
  .handler(async ({ data }) => `Hello, ${data.name}!`);
```

`useSession`을 대체할 때 주의할 점이 있습니다. 새 라이브러리는 **기존 Start 세션 쿠키를 읽지 못합니다.** 새 쿠키 이름을 쓰고 사용자를 다시 로그인시키거나, 옛 쿠키를 먼저 읽어 옮기는 경로를 테스트해야 합니다.

`.validator()`에는 사연이 있습니다. 원래 이름이 `.validator()`였는데 RC(1.132)에서 `.inputValidator()`로 바뀌었고, 2026년 6월(1.168.25, PR #7566)에 다시 `.validator()`가 정식 이름이 되면서 `.inputValidator()`는 deprecated 경고와 함께 남아 있다가 1.169.0에서 제거됐습니다. 그래서 **RC 시절의 튜토리얼 코드는 1.0에서 그대로 깨집니다.** 반대로 이 이력 덕분에 업그레이드를 쪼갤 수 있습니다.

1. 1.168.25 이상(Vite 7을 지원하는 마지막 버전은 1.168.61)에서 `.inputValidator()`를 `.validator()`로 먼저 바꾼다
2. 같은 버전에서 `useSession`을 세션 라이브러리로 교체하고, `set-cookie`를 `setCookie`/`appendResponseHeader`로 바꾸는 등 두 버전에서 모두 동작하는 변경을 먼저 반영한다
3. Vite 8과 1.169.x로 올린 뒤 Nitro 플러그인을 교체하고, 아래 동작 변경 표를 점검한다

### 동작이 바뀐 곳

| 영역        | 변경 내용                                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| 서버 엔트리 | `createStartHandler(...)`가 돌려준 핸들러가 원래 에러를 **다시 throw**. 커스텀 엔트리라면 `createServerEntry` 콜백 안에서 잡아 `return handleStartError(error)` |
| 에러 응답   | 잡히지 않은 에러는 400\~599(기본 500) 상태의 **일반 JSON 본문**. 앞서 성공 상태를 설정했어도 마찬가지               |
| 서버 함수 호출 | throw 된 값 그대로 reject(`Response`나 `undefined` 같은 falsy 값 포함). `Response`로 resolve 하려면 return       |
| 미들웨어 에러 | 서버 함수 호출 중 요청 미들웨어가 던진 에러가 메시지와 함께 클라이언트로 전달되고, 상태가 항상 500은 아님        |
| 응답 헬퍼   | 헬퍼가 return/throw 한 응답을 **덮어씀**. `setResponseStatus(401)` 후 200 응답을 돌려줘도 401                   |
| 쿠키        | `setResponseHeader('set-cookie', cookie)`는 나가는 쿠키를 **전부 교체**. 추가하려면 `setCookie`나 `appendResponseHeader` |
| 상태 코드   | `setResponseStatus`는 200\~599 밖의 코드를 무시(개발 환경에선 경고)                                              |
| 직렬화 응답 | 서버 함수 응답에는 헬퍼로 넣은 `Location` · `Content-Encoding` · `Content-Length`가 실리지 않고 204/205/304도 무시 → 이동은 `redirect()` |
| 요청 헤더   | `getRequestHeader(name)`은 값이 빈 헤더에 `''`, 헤더가 없을 때만 `undefined`                                     |
| 잘못된 경로 | `/%E0%A4%A` 같은 잘못된 퍼센트 인코딩은 서버 엔트리·미들웨어 전에 `400`                                          |
| 컨텍스트    | 어떤 함수 미들웨어도 컨텍스트를 보내지 않으면 `sendContext`가 `{}`가 아니라 `undefined`                            |

### 조용히 깨질 수 있는 곳

위 목록 중 타입 체크나 빌드가 잡아 주지 못하는 것들을 따로 추리면 이렇습니다(가이드 내용을 바탕으로 한 제 정리입니다).

| 지점                                  | 왜 조용한가                                                   | 확인 방법                                         |
| ------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| `setResponseHeader('set-cookie', …)`  | 쿠키를 여러 개 굽던 코드에서 **마지막 하나만** 남음            | 로그인·세션 갱신 응답의 `Set-Cookie` 개수 확인    |
| 응답 헬퍼 + 직접 만든 `Response`      | 의도한 상태 코드가 헬퍼 값으로 바뀜                            | 에러·인증 실패 경로의 실제 상태 코드 E2E 검증      |
| `sendContext` 구조 분해               | `{}` 가정으로 구조 분해하던 코드가 `undefined`에서 런타임 에러 | `sendContext` 사용처 검색                          |
| `getRequestHeader` 참/거짓 판단        | 빈 헤더가 `''`로 와서 `if (!header)` 분기가 달라짐             | 헤더 존재 여부 판단을 `=== undefined`로            |
| 클라이언트의 에러 파싱                | 잡히지 않은 에러의 본문 형태가 바뀜                            | 에러 메시지를 화면에 그리던 코드 점검              |

### 더 오래된 버전(Vinxi 시절)에서 온다면

RC 이전의 베타를 쓰고 있었다면 두 번의 큰 전환을 먼저 거쳐야 합니다. 공식 추적 토론(GitHub Discussion #2863)에 정리된 내용을 요약하면 이렇습니다.

**1.121.0(2025년 6월) — Vinxi → Vite 플러그인**

| 이전                                  | 이후                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------- |
| `@tanstack/start` 패키지              | `@tanstack/react-start`(Solid는 `@tanstack/solid-start`)                   |
| `vinxi` + `app.config.ts`             | `vite` + `vite.config.ts`의 `tanstackStart()` 플러그인                     |
| `app/` 디렉터리                       | `src/`(tsconfig 경로 별칭도 수정)                                          |
| `client.tsx` · `ssr.tsx` 엔트리       | 삭제(커스텀했다면 `server.tsx`로)                                          |
| `createAPIFileRoute` + `src/api.ts`   | 서버 라우트(당시 `createServerFileRoute`, 지금은 `createFileRoute`의 `server.handlers`) |

**1.132(2025년 9월, RC) — API 이름 정리**

| 이전                                          | RC 이후                                                  |
| --------------------------------------------- | -------------------------------------------------------- |
| `createServerFileRoute(...)`                  | `createFileRoute(...)({ server: { handlers } })`         |
| `router.tsx`의 `createRouter` export          | `getRouter` export                                       |
| `getWebRequest` · `getHeaders` · `getHeader`  | `getRequest` · `getRequestHeaders` · `getRequestHeader`  |
| `setHeaders` · `setHeader`                    | `setResponseHeaders` · `setResponseHeader`               |
| `parseCookies`                                | `getCookies`                                             |
| `serverOnly` · `clientOnly`                   | `createServerOnlyFn` · `createClientOnlyFn`              |
| 플러그인 옵션 `tsr` · `tsr.srcDirectory`      | `router` · 최상위 `srcDirectory`                         |
| `validator`                                   | `inputValidator`(1.0에서 다시 `validator`)               |

그 밖에 `registerGlobalMiddleware`가 제거됐고(지금은 `src/start.ts`의 `createStart`), Nitro가 기본 결합에서 분리됐으며(RC에서는 `nitroV2Plugin`, 1.0에서는 `nitro/vite`), React 플러그인(`viteReact()`)도 직접 추가하게 됐습니다. 당장 올릴 수 없다면 `npx create-start-app@latest pin-versions`로 버전을 고정해 두라는 안내도 있습니다.

정리하면 **Vinxi 시절 → 1.121 구조 → 1.132 이름 → 1.169 정식** 순서로 한 단계씩 올리는 게 안전합니다. 그리고 RC 시기의 블로그 · 튜토리얼에는 `.inputValidator()`나 Nitro v2 플러그인, Vite 7 기반 예제가 많으니 그대로 따라 하기 전에 최신 문서와 대조해 보세요.

## 마이그레이션 ② Next.js App Router → Start

Next.js에서 옮겨 오는 경우를 위해 공식 가이드는 **같은 기사 사이트를 두 프레임워크로 구현한 before/after 예제**(`examples/react/start-next-migration`)와, 두 앱에 똑같이 돌리는 Playwright 테스트를 제공합니다. 공개 URL, 서버 렌더링된 메타데이터, 쿼리 필터링, 리다이렉트, 404, sitemap, 로그인 오류, 세션 유지, 비공개 응답 캐싱, 뮤테이션, 로그아웃 후 서버 거부까지 확인합니다. "동작을 계약으로 고정하고 프레임워크 경계만 번역한다"는 접근이 이 가이드의 핵심입니다.

먼저 알아 둘 전제가 하나 있습니다. **Start에는 `'use server'`가 없습니다.** Server Actions는 전부 `createServerFn`으로 다시 써야 하고, `'use client'` 지시어도 필요 없으니 지웁니다. `@tanstack/react-start` 패키지 안에는 Next.js 이전용 에이전트 스킬(`skills/lifecycle/migrate-from-nextjs/SKILL.md`)도 들어 있어 에이전트에게 작업을 맡길 때 참고 자료가 됩니다. 다만 이 스킬은 초반에 Next.js를 제거하는 순서로 적혀 있으니, 아래 공식 가이드처럼 두 앱을 나란히 돌리는 쪽이 더 안전합니다.

### 0단계: 바꾸기 전에 목록부터

- **관찰 가능한 동작** — 동적 경로, 쿼리 파라미터, 리다이렉트, trailing slash, 로케일 접두사, 응답 상태, title/description/canonical/robots, sitemap 포함 여부
- **Next.js 전용 코드** — `next/*` import, `'use server'`, 서버 전용 모듈, metadata export, `generateStaticParams`, `revalidatePath`/`revalidateTag`, 캐시 지시어, Proxy/middleware, 이미지·폰트 설정

렌더링이 성공해도 인증, 캐시 무효화, 중요한 검색 URL을 잃어버렸을 수 있다는 게 가이드의 경고입니다.

### 1단계: 기존 앱 옆에 Start를 세운다

Next.js 앱은 이전한 라우트가 검증을 통과할 때까지 **계속 실행 가능한 상태로** 둡니다. Next.js와 설정을 지우지 않아도 Start를 테스트할 수 있습니다.

### 2단계: 경로는 지키고 파일만 옮긴다

| Next.js App Router               | Start 라우트 파일                          |
| -------------------------------- | ------------------------------------------ |
| `app/layout.tsx`                 | `src/routes/__root.tsx`                    |
| `app/page.tsx`                   | `src/routes/index.tsx`                     |
| `app/posts/page.tsx`             | `src/routes/posts.index.tsx`               |
| `app/posts/[slug]/page.tsx`      | `src/routes/posts.$slug.tsx`               |
| `app/docs/[...parts]/page.tsx`   | `src/routes/docs.$.tsx`                    |
| `app/api/hello/route.ts`         | `src/routes/api.hello.ts`(서버 핸들러)     |

`src/routes`는 URL 접두사가 아니라 소스 디렉터리입니다. 중첩 레이아웃, 라우트 그룹, 선택적 파라미터, 병렬·인터셉팅 라우트는 파일 이름만 기계적으로 바꾸지 말고 개별로 매핑해야 합니다(공식 예제도 병렬·인터셉팅 라우트는 재현하지 않습니다).

### 3단계: API 대응표

가이드 내용을 API 단위로 묶으면 이렇습니다.

| Next.js                                   | TanStack Start                                                      |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `next/link`                               | Router의 `<Link to="/posts/$slug" params={…}>`                      |
| 페이지의 `searchParams`                   | `validateSearch` + `Route.useSearch()`, loader가 쓰면 `loaderDeps`   |
| async Server Component의 데이터 조회      | 서버 함수 → loader에서 호출                                          |
| Server Action + `revalidatePath`          | POST 서버 함수 + `useServerFn` + `router.invalidate()`(+ Query 무효화) |
| `metadata` / `generateMetadata`           | 라우트 `head` + 루트의 `HeadContent`                                 |
| `app/sitemap.ts`, robots                  | `/sitemap.xml` 서버 라우트 등으로 명시적 이전                         |
| Route Handler(`app/api/**/route.ts`)      | 서버 라우트(`server.handlers`)                                       |
| `cookies()`                               | `getCookie` / `setCookie`(`@tanstack/react-start/server`)           |
| Proxy(middleware)                         | 요청 미들웨어(`src/start.ts`)                                        |
| `next/image`                              | `<img>` 또는 Unpic + 이미지 서비스(내장 최적화기 없음)                |
| `next/font`                               | 셀프 호스팅 폰트, Fontsource 등                                      |
| `generateStaticParams`, 캐시 지시어       | 정적 프리렌더링 / HTTP 캐시 기반 ISR(호스팅에서 동작 검증)            |
| `NEXT_PUBLIC_*`                           | `VITE_*`(Rsbuild는 `PUBLIC_*`) — 공개 범위를 다시 점검              |

`searchParams`는 이렇게 바뀝니다. TypeScript 타입만으로는 들어오는 URL을 검증하지 못하므로 **런타임 검증**을 넣습니다.

```tsx
export const Route = createFileRoute('/')({
  validateSearch: (search) => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  component: Articles,
});

function Articles() {
  const { q } = Route.useSearch();
  return <p>Searching for: {q}</p>;
}
```

가장 신경 써야 할 곳은 **서버 컴포넌트 안에 있던 DB 조회**입니다. Start의 loader는 브라우저에서도 돌기 때문에, async Server Component에 있던 쿼리를 loader로 그대로 옮기면 안 됩니다. 권한이 필요한 조회는 서버 함수 안에 두고 loader는 그것을 호출하며, 브라우저가 봐도 되는 데이터만 돌려줍니다.

Server Action은 POST 서버 함수가 됩니다. 라우트에서 이미 권한을 확인했더라도, 서버 함수는 **페이지를 거치지 않고 직접 호출될 수 있으므로** 함수 안에서 다시 인가해야 합니다.

```tsx
// src/server/account.ts
export const toggleSaved = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { slug: string }) => data)
  .handler(async ({ data, context }) => {
    return saveArticle(context.session.userId, data.slug);
  });
```

```tsx
// 컴포넌트
function SaveButton({ slug }: { slug: string }) {
  const router = useRouter();
  const save = useServerFn(toggleSaved);

  return (
    <button
      type="button"
      onClick={async () => {
        await save({ data: { slug } });
        await router.invalidate(); // revalidatePath 대신 현재 라우트 데이터 재로딩
      }}
    >
      Save
    </button>
  );
}
```

여기서 놓치기 쉬운 차이가 하나 있습니다. Next.js의 Server Action 폼은 **JavaScript 없이도** 동작하지만, 이벤트 핸들러로 서버 함수를 부르는 폼은 JS가 필요하고 하이드레이션 전에는 동작하지 않습니다. 점진적 향상이 요구사항이라면 FormData를 받는 서버 함수의 `.url`이나, 서버 라우트로 보내는 일반 폼 POST(검증 · CSRF 포함)를 써야 합니다. 가이드도 `createServerFn`을 React 폼 Action 프로토콜의 drop-in 대체로 보지 말라고 합니다.

### 4단계: 인증 · 메타데이터 · 캐시

- **인증** — Start는 세션 API를 제공하지 않습니다. 공식 예제는 `iron-session`을 유지하고 Next.js `cookies()`를 `getCookie`/`setCookie` 어댑터로 바꿨습니다. 컷오버나 롤백 중에도 세션이 살아 있어야 한다면 쿠키 이름 · 도메인 · 경로 · 서명/암호화 형식 · 만료 · 키 교체 · 로그아웃을 양쪽 배포에서 모두 검증해야 합니다.
- **비공개 페이지 캐시** — 개인화된 HTML이 다른 사용자에게 가지 않도록 `Cache-Control: private, no-store`를 확인하고, CDN을 거친 최종 응답으로 검증합니다. 비공개 데이터가 있는 페이지는 프리렌더하거나 공개 캐시하지 않습니다.
- **메타데이터** — JS 실행 전 HTML 응답과 클라이언트 내비게이션 후의 head를 모두 비교합니다. sitemap, robots.txt, 아이콘, manifest, 소셜 이미지는 명시적으로 옮기고, 없는 콘텐츠에는 진짜 404를 돌려줍니다.
- **캐시** — 브라우저 데이터, Router loader, Query, 서버 데이터, 생성된 페이지, CDN 응답을 **각각** 나열하고 무엇이 채우고 무엇이 무효화하는지 정의합니다. Next.js의 캐시 지시어와 재검증은 자동으로 옮겨지지 않습니다.

### 5단계: 롤백 경로를 쥐고 전환한다

1. 두 앱을 빌드하고, Start의 스테이징 배포에 실제 데이터 · 인증 세션 · CDN을 포함해 계약 테스트를 돌립니다.
2. 전환 기간에는 DB 스키마를 두 버전 모두와 호환되게 유지하고, 파괴적인 스키마 변경은 프레임워크 전환과 분리합니다.
3. 공개 origin과 경로를 최대한 유지하고, 바뀌는 경로는 리다이렉트 · 내부 링크 · canonical · sitemap을 함께 갱신합니다.
4. 이전 배포와 라우팅 설정을 기록하고, 트래픽을 되돌릴 방법과 그때 세션 · 쓰기가 어떻게 되는지 알아 둡니다.
5. 전환 후에는 에러율, 로그인 · 뮤테이션 실패, 응답 상태, 색인 신호, 전환 이벤트를 기준선과 비교해 모니터링합니다.

Next.js와 남은 설정은 이 모든 동작과 롤백 계획이 검증된 **뒤에** 지웁니다. 이전에 정리한 [Next.js 15 마이그레이션](/ko/posts/2024-11-23-nextjs-v15-migration/)과 비교해 보면, 같은 프레임워크 안의 버전 업과 달리 이 작업은 **"API 치환"이 아니라 "실행 모델 번역"** 이라는 점이 가장 큰 차이입니다.

### Remix / React Router 7에서 온다면

Start 전용 가이드는 아직 "coming soon"입니다. 대신 TanStack Router 문서의 **"Migrate from React Router v7"** 이 라우터 수준의 대응을 정리해 두었고, 풀스택 기능이 필요하면 Start를 쓰라고 안내합니다.

| React Router v7                           | TanStack Router / Start                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| `useLoaderData()`                         | `Route.useLoaderData()`                                                     |
| `useParams()`                             | `Route.useParams()`                                                         |
| `useSearchParams()` / `setSearchParams`   | `validateSearch` + `Route.useSearch()` / `navigate({ search: (prev) => … })` |
| `<Link to="/posts/123">`                  | `<Link to="/posts/$postId" params={{ postId: '123' }}>`                     |
| `defer`                                   | 직접 대응 없음 — `pendingComponent` 등으로 로딩 상태 처리                    |
| `action`                                  | 직접 대응 없음 — Router 가이드는 뮤테이션 · 폼 라이브러리를 권장             |

Start로 넘어올 때 개념상 가장 큰 차이는 앞에서 말한 **loader의 실행 위치**입니다. React Router Framework 모드의 `loader`는 서버에서 실행되지만 Start의 `loader`는 isomorphic이므로, 서버 전용 코드는 서버 함수로 옮겨야 합니다. 그 위에서 `action`은 POST 서버 함수, resource route는 서버 라우트, `meta`는 `head`로 옮긴다고 보면 출발점으로는 충분합니다(이 세 가지는 공식 매핑이 아니라 제 정리입니다).

## 장점

1. **끝까지 이어지는 타입 안전성** — 링크, 경로 파라미터, 검증된 search params, loader 데이터, 라우트 컨텍스트, 서버 함수의 입력과 출력이 하나의 타입 그래프로 연결됩니다. 무언가를 바꾸면 영향받는 곳을 에디터(그리고 에이전트)가 바로 찾습니다.
2. **익숙한 앱 모델** — 기본이 SSR + 하이드레이션이라 `'use client'` 경계나 서버/클라이언트 컴포넌트 구분 없이 지금까지 만들던 React 앱처럼 짤 수 있습니다. RSC 없이도 서버 함수와 SSR을 다 쓸 수 있습니다.
3. **명시적인 실행 경계** — `createServerFn`, `createServerOnlyFn`, `createIsomorphicFn`, Import Protection으로 "이 코드가 어디서 도는가"가 코드에 드러납니다.
4. **라우트 단위 렌더링 제어** — Full SSR, data-only, client-only, SPA 모드, 프리렌더링을 한 앱 안에서 섞어 쓸 수 있습니다.
5. **클라이언트와 서버를 가로지르는 미들웨어** — 서버 함수 미들웨어는 RPC 전후로 클라이언트와 서버 양쪽에서 실행되고, 컨텍스트가 타입과 함께 전달됩니다.
6. **빌드 도구 · 호스팅 선택의 자유** — Vite와 Rsbuild를 모두 지원하고, Nitro와 파트너 플러그인으로 Cloudflare, Netlify, Railway, Vercel, Node, Bun 등에 배포합니다.
7. **TanStack 생태계와의 결합** — Query(데이터 캐시), Form, Table 등 이미 쓰고 있는 TanStack 라이브러리와 같은 설계 철학으로 맞물립니다.

## 단점과 주의할 점

1. **RSC는 실험적입니다.** 서버 컴포넌트 중심으로 설계된 앱이라면 Next.js의 성숙도가 더 높습니다.
2. **이미지 · 폰트 최적화가 내장돼 있지 않습니다.** `next/image`, `next/font`에 해당하는 기능은 직접 고르고 구성해야 합니다.
3. **isomorphic loader의 함정** — loader에 비밀값이나 DB 코드를 넣으면 클라이언트 내비게이션에서 깨지거나, 서버 코드가 클라이언트 번들에 딸려 갈 수 있습니다. 습관적으로 "loader = 서버"라고 생각하던 팀일수록 리뷰 규칙이 필요합니다.
4. **서버 함수는 공개 엔드포인트입니다.** `beforeLoad` 가드만으로는 데이터를 보호할 수 없고, 비공개 데이터를 다루는 서버 함수마다 인가가 필요합니다. `src/start.ts`를 만들면 CSRF 미들웨어도 직접 등록해야 합니다.
5. **세션 API가 없습니다.** 1.0에서 `useSession`이 빠졌으므로 iron-session 같은 라이브러리나 Clerk · WorkOS 같은 관리형 서비스를 써야 합니다.
6. **빠른 릴리스 주기** — npm 기준으로 1.168 라인 한 줄기에서만 5월 15일부터 10월 10일까지 패치가 61번 나왔습니다. 락파일을 커밋하고, 업그레이드 때 변경 로그를 읽는 습관이 필요합니다.
7. **아직 비어 있는 문서** — Remix 2 / React Router 7 마이그레이션 가이드는 "coming soon"이고, Nitro 통합 문서에도 "활발히 개발 중"이라는 경고가 붙어 있습니다.
8. **보안 이력** — CVE-2026-102989(GHSA-qx66-fv34-fjm8, CVSS 9.3)는 인증 없이 조작한 서버 함수 URL로 애플리케이션 origin에서 공격자의 HTML을 돌려줄 수 있는 반사형 XSS였습니다. `@tanstack/react-start` 1.143.12부터 1.168.60 직전까지가 영향 범위이고, 로컬 설치만 올려서는 이미 배포된 앱이 패치되지 않으므로 **재빌드 · 재배포**까지 해야 합니다. 프레임워크 설계 문제는 아니지만, 2026년 5월 11일에는 GitHub Actions 설정의 허점을 이용한 공급망 공격(CVE-2026-45321)으로 `@tanstack/react-start` 1.167.68 · 1.167.71을 포함한 42개 패키지에 자격 증명을 훔치는 악성 버전 84개가 몇 분 사이에 배포됐습니다. 같은 날 모두 deprecated 처리 · 제거됐지만, 그날 설치한 기록이 있다면 공식 포스트모템대로 해당 버전 여부를 확인하고 자격 증명을 교체해야 합니다.
9. **명시적인 버전 정책이 아직 없습니다.** 1.0 공지에는 앞으로 breaking change를 어떻게 다룰지(메이저 주기, 지원 기간) 같은 정책이 따로 적혀 있지 않습니다. [React Router v8](/ko/posts/2026-09-19-react-router-v8/)이 "연 1회 메이저"를 명시한 것과 대비됩니다. RC 기간에 `.validator()` 이름이 두 번 바뀐 것처럼 API가 움직여 온 이력이 있으니, 당분간은 업그레이드마다 변경 로그를 읽는 비용을 잡아 두는 게 좋습니다.

## 실제 도입 사례와 반대 사례

문서와 공지는 결국 만든 쪽의 이야기입니다. 균형을 위해 실제로 옮겨 본 팀들의 기록도 찾아봤습니다. 버전과 시점이 제각각이고 독립 벤치마크가 아니라는 점은 감안해서 읽어 주세요.

| 사례                         | 시점 · 버전                            | 무엇을 했나                                                        | 결과 · 교훈                                                                                                                                                       |
| ---------------------------- | -------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inngest**                  | 2026-01 · RC                           | Next.js 대시보드를 Start로 이전(React Router v7, Deno Fresh도 시제품 비교) | 로컬 개발 첫 로드 10\~12초 → 2\~3초. 엔지니어 1명이 AI 도움으로 몇 주. 대신 잘못 번들된 서버/클라이언트 코드는 원인 추적이 어려웠고, dev와 빌드 결과물의 동작이 달랐으며, 통합 흐름 문제로 즉시 롤백한 적도 한 번 있었음 |
| **Tightknit**                | 2026-04                                | Next.js 앱을 Cloudflare Workers 위 Start로 이전                     | 벤더 종속을 피하고 기존 Cloudflare 생태계에 맞춤. 대가로 `vercel/og`를 잃어 `workers-og` 기반 별도 워커를 만들었고(본인들도 임시방편이라 표현), 캐시 모델을 새로 익혀야 했음 |
| **LogRocket 실험**           | 2026-06 · Start 1.168.26 vs Next.js 16.2.9 | 같은 대시보드를 RSC로 두 번 구현                                 | Start가 클라이언트 JS 116KB vs 193KB(gzip), 빌드 1.3초 vs 5.1초로 앞섰지만 셋업은 8분 vs 3분, 코드는 345줄 vs 290줄. RSC 레이어는 문서 부족 · 플러그인 순서 에러로 "프로덕션 추천은 이르다" |
| **LLM Gateway**(반대 방향)   | 2025-07 · Vinxi 시절 알파              | Start에서 Next.js로 이탈                                           | Lighthouse 성능 85→100, SEO 80→100. Tanner Linsley는 `next/image` 도입, `staleTime` · 프리페치 조정, `<title>` 대신 `<meta name="title">`을 쓴 설정 실수가 주원인이라고 분석 |

여기서 읽히는 공통점은 세 가지입니다.

- **개발 서버 속도와 번들 크기에서는 Start 쪽에 유리한 보고가 있었고**(Inngest, LogRocket), 그 대가는 셋업 비용과 서버/클라이언트 경계 디버깅이었습니다.
- **Next.js가 기본으로 주던 것**(이미지 최적화, OG 이미지 생성, 메타데이터 규칙)을 직접 채워야 한다는 점이 사례마다 반복됩니다. LLM Gateway 사례는 "Start가 느려서"라기보다 이 공백을 채우지 않았을 때 무슨 일이 생기는지를 보여 줍니다.
- **RSC가 앱의 중심이면 아직 Next.js, 상호작용이 많은 앱이면 RSC를 끈 Start**라는 결론이 LogRocket 실험과 공식 비교 문서에서 겹칩니다.

1.0 공지가 꼽은 채택 사례도 있습니다. Lovable은 새로 생성하는 앱의 기반으로 Start를 골랐고, Netlify는 100만 명 이상이 써 본 자사 AI 앱 빌더의 기본 프레임워크로 Start를 쓰며, Unkey는 오픈소스 포털에 Start · Router · Query를 도입했다고 합니다. 모두 TanStack 파트너사라는 점은 함께 감안해야 합니다.

## Next.js · React Router와 비교

공식 비교 문서(2026-09-11 기준, Next.js 16.3 App Router · React Router 8.3 Framework Mode 대상)를 요약하면 다음과 같습니다. TanStack이 작성한 문서라는 점은 감안해야 하지만, 성능 승자를 단정하지 않고 Next.js가 유리한 지점도 명시하는 등 비교적 절제된 문서입니다. 반면 overview 페이지의 "Next.js · Remix와 같은 기능에 더 많은 기능과 더 강력한 개발 경험"이라는 문장은 근거가 제시되지 않은 벤더 주장입니다.

| 항목                 | TanStack Start                          | Next.js App Router                         | React Router Framework Mode               |
| -------------------- | --------------------------------------- | ------------------------------------------ | ----------------------------------------- |
| 서버 렌더링          | 기본 SSR + 하이드레이션                 | Server/Client Components가 초기 HTML 생성  | 설정 가능한 SSR                           |
| 렌더링 제어          | 라우트별 full / data-only / off         | `use client` 경계(초기 SSR은 유지)          | 전역 SSR 설정 + 라우트 `clientLoader`      |
| RSC                  | 실험적, opt-in                          | 핵심 컴포넌트 모델                          | unstable                                  |
| 서버 호출 · 변경     | 타입 서버 함수(GET/POST)                | Server Actions                             | route action · fetcher                    |
| 미들웨어             | 요청 + 서버 함수(클라이언트/서버)       | Proxy                                      | 서버 · 클라이언트 라우트 미들웨어           |
| API 엔드포인트       | 서버 라우트                             | Route Handlers                             | Resource routes                           |
| 빌드                 | Vite 또는 Rsbuild                       | Turbopack                                  | 프레임워크 툴링(Vite 플러그인)             |
| 이미지 · 폰트        | 직접 선택                               | `next/image` · `next/font` 내장             | 직접 선택                                 |

공식 문서가 정리한 선택 기준은 이렇습니다.

- **TanStack Start** — 타입이 붙은 라우트 컨텍스트와 URL 상태, 명시적인 loader와 서버 함수, 라우트별 렌더링 제어가 필요할 때
- **Next.js** — 서버 컴포넌트 모델과 내장 이미지 · 폰트 · 메타데이터 · 폼 기능이 필요하거나, 팀의 경험과 기존 통합이 이미 Next.js에 쌓여 있을 때
- **React Router Framework Mode** — loader · action · fetcher 중심의 폼 기반 워크플로와 점진적 향상이 중요할 때

그리고 개인적으로 가장 공감한 문장은 이것입니다. **멀쩡히 돌아가는 Next.js 앱을, 라우팅 모델이 다르다는 이유만으로 다시 쓸 필요는 없다.** 대신 실제 데이터 로딩, search params 검증, 뮤테이션, 비인가 접근 처리, 배포까지 포함한 **대표 라우트 하나**를 Start로 만들어 보고, 그게 더 유지보수하기 쉬워지는지로 판단하라는 게 공식 권고입니다.

## 마무리

TanStack Start 1.0을 한 문장으로 정리하면 **"라우터를 제대로 만들다 보니 풀스택 프레임워크가 됐고, 이제 그 API를 약속하겠다는 릴리스"** 입니다. 새 기능의 발표라기보다, 이미 프로덕션에서 쓰이던 설계에 안정성 보증을 붙인 이정표에 가깝습니다.

Next.js가 "서버를 기본으로, 클라이언트를 예외로" 둔다면 Start는 반대로 **"익숙한 앱을 기본으로, 서버를 명시적으로"** 둡니다. 어느 쪽이 맞는지는 앱의 성격이 정하지만, 타입 안전한 라우팅과 TanStack Query에 이미 익숙한 팀이라면 진입 비용이 가장 낮은 풀스택 선택지라는 건 분명해 보입니다.

**도입 체크리스트:**

- ✅ Vite 8+(또는 Rsbuild 2) · Node 22.12+ 준비
- ✅ `@tanstack/react-start` 1.169.x, 설치된 `@tanstack/start-server-core`가 1.169.39 이상인지 확인(CVE-2026-102989)
- ✅ loader에 비밀값 · DB 코드가 없는지 — 있으면 서버 함수로
- ✅ 비공개 데이터를 다루는 서버 함수마다 `authMiddleware`(또는 핸들러 내 인가)
- ✅ `src/start.ts`를 만들었다면 `createCsrfMiddleware()` 명시 등록
- ✅ `QueryClient`는 `getRouter` 안에서 생성
- ✅ 개인화 응답은 `Cache-Control: private`(또는 `no-store`)
- ✅ (RC 사용자) `.inputValidator` → `.validator`, `useSession` 대체, Nitro 플러그인 교체, `set-cookie` 처리 점검
- ✅ (Next.js 이전) `'use server'` → `createServerFn`, 동작 목록 → 대표 라우트 PoC → 계약 테스트 → 롤백 경로를 쥔 전환
- ✅ (오래된 튜토리얼 주의) `.inputValidator()` · `nitroV2Plugin` · `createServerFileRoute` · `app.config.ts`가 보이면 1.0 이전 코드이니 최신 문서와 대조
- ✅ 2026-05-11에 의존성을 설치한 기록이 있다면 공급망 공격 악성 버전 여부 확인(GHSA-g7cv-rxg3-hmpx)

---

# 참고 문서

- TanStack, [TanStack Start 1.0 is Stable](https://tanstack.com/blog/tanstack-start-1-0) · [TanStack Start v1 Release Candidate](https://tanstack.com/blog/announcing-tanstack-start-v1)
- TanStack Start, [Overview](https://tanstack.com/start/latest/docs/framework/react/overview)
- TanStack Start, [Getting Started](https://tanstack.com/start/latest/docs/framework/react/getting-started) · [Build a Project from Scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch)
- TanStack Start, [Execution Model](https://tanstack.com/start/latest/docs/framework/react/guide/execution-model) · [Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions) · [Middleware](https://tanstack.com/start/latest/docs/framework/react/guide/middleware) · [Server Routes](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes)
- TanStack Start, [Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr) · [SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode) · [Static Prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) · [Server Components](https://tanstack.com/start/latest/docs/framework/react/guide/server-components)
- TanStack Start, [TanStack Query](https://tanstack.com/start/latest/docs/framework/react/guide/tanstack-query) · [Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) · [Authentication Server Primitives](https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives)
- TanStack Start, [Migrate from the Release Candidate](https://tanstack.com/start/latest/docs/framework/react/migrate-from-release-candidate) · [Migrate from Next.js](https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js)
- TanStack Start, [TanStack Start vs Next.js](https://tanstack.com/start/latest/docs/framework/react/start-vs-nextjs) · [Comparison](https://tanstack.com/start/latest/docs/framework/react/comparison)
- TanStack, [React Server Components Your Way](https://tanstack.com/blog/composite-components)
- TanStack, [TanStack Start security update: CVE-2026-102989](https://tanstack.com/blog/tanstack-start-security-update-cve-2026-102989) · [GHSA-qx66-fv34-fjm8](https://github.com/advisories/GHSA-qx66-fv34-fjm8)
- TanStack, [npm supply-chain compromise postmortem](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem) · [GHSA-g7cv-rxg3-hmpx](https://github.com/TanStack/router/security/advisories/GHSA-g7cv-rxg3-hmpx)
- TanStack Router, [Migrate from React Router v7](https://tanstack.com/router/latest/docs/how-to/migrate-from-react-router)
- GitHub, [Start BETA - Tracking (#2863)](https://github.com/TanStack/router/discussions/2863) — Vinxi → Vite, RC 변경 노트
- 사례 — Inngest, [Reducing local dev time by 83%: Why we migrated off Next.js](https://inngest.com/blog/migrating-off-nextjs-tanstack-start) · Tightknit, [The Practical Case for TanStack Start on Cloudflare Workers](https://tightknit.ai/blog/nextjs-to-tanstack-start-cloudflare-workers) · LogRocket, [TanStack Start RSC vs. Next.js RSC](https://blog.logrocket.com/tanstack-start-rsc-vs-next-js-rsc-performance-dx-production-readiness/)
- 반대 사례 — LLM Gateway, [Next.js migration](https://llmgateway.io/changelog/nextjs-migration) · Tanner Linsley, [TanStack Start to Next.js Migration Analysis](https://gist.github.com/tannerlinsley/4f7bde6c8026104f0dc06a122a657621)
- npm, [@tanstack/react-start](https://www.npmjs.com/package/@tanstack/react-start)
- TanStack, [Design System — Logos](https://tanstack.com/ds/logos) — 썸네일 로고 출처(문서 헤더의 엠블럼 · 워드마크 · START 조합)
- 이전 글 — [React Router v8](/ko/posts/2026-09-19-react-router-v8/) · [Vite 8.0](/ko/posts/2026-07-13-vite8.0/) · [react-query(v5)](/ko/posts/2023-07-23-react-query-v5/) · [Next.js 15 마이그레이션](/ko/posts/2024-11-23-nextjs-v15-migration/)
