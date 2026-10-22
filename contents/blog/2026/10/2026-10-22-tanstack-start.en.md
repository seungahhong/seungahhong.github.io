---
layout: post
title: TanStack Start 1.0
date: 2026-10-22
published: 2026-10-22
category: Development
tags: ['tanstack', 'react', 'framework']
comments: true
thumbnail: './assets/22/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# TanStack Start 1.0 Is Stable: Overview, Usage, and Migration Guide

## ✍️ TL;DR

> **TanStack Start is a full-stack React framework that adds SSR, streaming, server functions, and middleware on top of TanStack Router, and it became stable as 1.0 (npm `1.169`) on October 13, 2026.** Its default is "the familiar app that renders on the server and hydrates in the browser," and you hand work to the server only through explicit APIs like `createServerFn`. That is the biggest difference from the Next.js App Router, where Server Components are the default.

### Summary

- **Released**: announced on the TanStack blog on October 13, 2026 ("TanStack Start 1.0 is Stable"). The first stable package is `@tanstack/react-start@1.169.0`, and the latest at the time of writing (2026-10-22) is `1.169.3`. "1.0" is the product version name, so you install `1.169` or later rather than `@tanstack/react-start@1.0` (the package was already on 1.1xx during the RC, so the number alone can't tell you RC from stable).
- **What it is**: routing is handled **entirely by TanStack Router**, and Start adds full-document SSR, streaming, server functions (type-safe RPC), server routes (APIs), middleware/context, client/server builds, and universal deployment on top. According to the official homepage, it supports React and Solid.
- **Build tools**: **Vite 8 or later** or **Rsbuild 2**. Node must be 22.12 or later.
- **Execution model**: all code is **isomorphic** by default (it runs on both server and client). Even a route `loader` runs on the server for the first request and in the browser for later navigations. Secrets and database access have to be fenced off with server functions or `.server.ts` files.
- **Rendering options**: pick per-route `ssr: true | 'data-only' | false` (Selective SSR), an app-wide SPA mode, static prerendering, or ISR driven by HTTP cache headers — all within one framework.
- **RSC**: **experimental and opt-in**. It is not the default component model as in Next.js; instead, a server function returns UI rendered on the server, and the client composes it. Next.js-style `'use server'` actions are **intentionally unsupported**; you use explicit server functions only.
- **Migration**: going from RC to 1.0 is mostly about requiring Vite 8, `.inputValidator()` → `.validator()`, the removal of `useSession`, swapping the Nitro plugin, and changed error/response behavior. For Next.js App Router → Start there is an official guide with a before/after example; the Remix 2 / React Router 7 guide is still "coming soon."
- **Security history**: **CVE-2026-102989**, disclosed September 30, 2026 (a reflected XSS in server-function response handling, CVSS 9.3). Confirm that the `@tanstack/start-server-core` you actually have installed is **1.169.39 or later**, then redeploy. On May 11 there was also an npm supply-chain attack (CVE-2026-45321) that pushed malicious versions of 42 `@tanstack/*` packages.

| Item                      | Details                                                                           |
| ------------------------- | --------------------------------------------------------------------------------- |
| **Version**               | 1.0 = npm `1.169.x` (announced 2026-10-13)                                        |
| **Foundation**            | TanStack Router · Vite 8+ or Rsbuild 2 · Node 22.12+                              |
| **Core APIs**             | `createServerFn` · `createMiddleware` · `createIsomorphicFn` · server routes      |
| **Rendering**             | SSR (default) · data-only · client-only · SPA mode · prerendering · ISR           |
| **Deployment**            | Cloudflare Workers · Netlify · Railway · Vercel · Nitro · Node/Docker · Bun, etc. |
| **Experimental features** | Server Components · Static Server Functions · Deferred Hydration                  |

The details follow below.

---

## 📋 Table of Contents

1. [Overview: What Is TanStack Start?](#overview-what-is-tanstack-start)
2. [The Road to 1.0](#the-road-to-10)
3. [Core Concept: Where Does This Code Run?](#core-concept-where-does-this-code-run)
4. [Usage](#usage)
5. [Choosing a Rendering Mode](#choosing-a-rendering-mode)
6. [Deployment](#deployment)
7. [Migration ① RC → 1.0](#migration--rc--10)
8. [Migration ② Next.js App Router → Start](#migration--nextjs-app-router--start)
9. [Advantages](#advantages)
10. [Drawbacks and Caveats](#drawbacks-and-caveats)
11. [Real-World Adoption and Counter-Examples](#real-world-adoption-and-counter-examples)
12. [Compared with Next.js and React Router](#compared-with-nextjs-and-react-router)
13. [Wrapping Up](#wrapping-up)

## Overview: What Is TanStack Start?

TanStack Start is **a full-stack React framework powered by TanStack Router**. It provides full-document SSR, streaming, server functions, and client/server builds, and because it supports both Vite and Rsbuild, you can deploy it to whatever hosting provider or runtime you want.

It has only two building blocks.

- **TanStack Router** — a router that handles nested routing, search params, and data loading in a type-safe way
- **Vite or Rsbuild** — the build tool responsible for HMR and production builds

### Router alone, or Start?

The official docs say that "90% of a framework is the router." Start leaves routing **entirely** to TanStack Router and layers server features on top. So the question becomes: "Do you need server features?"

| What you need                                       | Router only | Start |
| --------------------------------------------------- | :---------: | :---: |
| Type-safe routing · search params · loaders         |     ✅      |  ✅   |
| Full-document SSR · streaming                       |      △      |  ✅   |
| Server functions (type-safe RPC) · server routes (API) |   —      |  ✅   |
| Request/server-function middleware · context        |      —      |  ✅   |
| Full-stack client + server builds · universal deployment | —      |  ✅   |

△ means TanStack Router does have experimental SSR and streaming APIs, but you have to assemble them yourself; Start packages them as built-ins. The official position is to recommend Router alone (an SPA) **only when you are certain you need none of the above**.

### The philosophy behind it

In the 1.0 announcement, Tanner Linsley is clear about the starting point. He felt the React ecosystem was narrowing its picture of what an application should look like — Next.js betting heavily on RSC and moving toward a server-centric model, React Router and Remix working through their own changes — and he wanted to keep **the way he had built apps for the last ten years** (state management, client-side navigation, data caching) while using new capabilities like server rendering, streaming, and server functions **only where they belong**.

So Start's defaults look like this.

- Components are just components, and routes are just routes. There are no `'use client'` boundaries to draw.
- A route can be rendered on the server, can load only its data on the server while the component renders on the client, or can be handled entirely on the client.
- When you need the server, you cross over through **explicit APIs** (`createServerFn`, middleware).
- RSC also plugs in as an **optional feature** that does not change the app model.

## The Road to 1.0

| When           | What happened                                                                      |
| -------------- | ---------------------------------------------------------------------------------- |
| December 2023  | Server utilities that became the seed of Start appear in the repo                  |
| May 2024       | The `react-router-server` package is renamed to `start`                            |
| June 2025      | `1.121.0` — Vinxi is removed in favor of a Vite plugin ("devinxi")                 |
| September 2025 | `1.132.0` ships alongside the "v1 Release Candidate" announcement (9/23)           |
| April 2026     | React Server Components released as an experimental feature (4/13, "React Server Components Your Way") |
| May 2026       | npm supply-chain attack (CVE-2026-45321) — malicious versions removed the same day (5/11) |
| June 2026      | Rsbuild support made official · `.validator()` restored as the canonical name      |
| September 2026 | Security patch notice for CVE-2026-102989 (9/30)                                   |
| October 2026   | `1.169.0` ships, **1.0 stable announced** (10/13, KST)                             |

Three things in the 1.0 announcement stand out.

- **"Finally dropping the RC caveat"** — teams from small projects to Fortune 500 companies (none are named) were already running Start in production during beta and RC, and 1.0 is the formal commitment to those APIs. The team expected a short stretch of polish after RC, but in practice a lot of compiler, streaming, server-boundary, and hydration work landed.
- **About 5.5x SSR throughput** — maintainers profiled what the server was doing and stripped out work it didn't need to do, reaching roughly 5.5 times the throughput in their own benchmark. It's worth keeping in mind that this is **relative to Start before the optimization work**, not a comparison with other frameworks.
- **Agents and types** — the argument is that designing the router to be type-safe and strict pays off in the agent era as well. When an agent changes a route parameter or a server function's input, **the types point to the places that no longer agree**. In the same vein, TanStack Intent ships agent skills inside the npm packages themselves.

There is also a candid look back at RSC. The team spent a lot of time integrating RSC without changing Start's app model, but on tanstack.com itself, tracking "what ships where" became so complicated that they **took RSC back out**. They point to the fact that removing it did not require rewriting the app as evidence for the opt-in design.

## Core Concept: Where Does This Code Run?

There is one rule to learn first when using Start: **all code is isomorphic by default**. Unless you constrain it, it goes into **both** the server bundle and the client bundle.

In particular, **a route `loader` is not server-only.** It runs on the server for the first request (SSR) and in the browser during subsequent client-side navigation. If you're used to Next.js async Server Components or React Router's server `loader`, this is the biggest trap.

```tsx
// ❌ Works on the first request (SSR), but runs in the browser during client navigation.
//    Browser code can only read variables carrying the build tool's public prefix (VITE_, etc.),
//    so SECRET isn't readable there — and "fixing" it with a VITE_ prefix bakes the secret into the bundle.
export const Route = createFileRoute('/users')({
  loader: async () => {
    const secret = process.env.SECRET;
    const res = await fetch(`https://api.example.com/users?key=${secret}`);
    return res.json();
  },
});

// ✅ Read the secret inside a server function; the loader only calls it
const getUsers = createServerFn().handler(async () => {
  const secret = process.env.SECRET;
  const res = await fetch(`https://api.example.com/users?key=${secret}`);
  return res.json();
});

export const Route = createFileRoute('/users')({
  loader: () => getUsers(),
});
```

The official rule is simple: server code can read unprefixed `process.env`, and client code can only read values carrying the build tool's public prefix (Vite `VITE_`, Rsbuild `PUBLIC_`). So the fix for "a secret read in a loader" isn't to add a prefix — it's to **move it into a server function**.

These are the APIs that control where code runs.

| API                                       | Purpose                              | Behavior in the other environment         |
| ----------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `createServerFn()`                        | RPC, data mutations                  | On the client, a network request to the server |
| `createServerOnlyFn(fn)`                  | Server-only utilities                | Throws if called on the client            |
| `createClientOnlyFn(fn)`                  | Browser-only utilities               | Throws if called on the server            |
| `createIsomorphicFn().server().client()`  | Different implementation per environment | The other side's implementation is removed from each bundle |
| `<ClientOnly fallback>`                   | Components that need browser APIs    | Renders the fallback on the server        |
| `useHydrated()`                           | Branch on hydration                  | `false` during SSR and the first client render |

The `createIsomorphicFn` example from the 1.0 announcement captures this model well. Getting the current origin differs between the server (the request URL) and the browser (`window.location`); put the two implementations side by side and Start strips the other side's implementation from each bundle. Calling it in the browser does not send a request to the server.

```tsx
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

const getOrigin = createIsomorphicFn()
  .server(() => new URL(getRequest().url).origin)
  .client(() => window.location.origin);

// Same call, whether during a server request or in the browser
const absoluteUrl = new URL('/about', getOrigin()).href;
```

You can also draw boundaries per file. Files with a `*.server.*` / `*.client.*` suffix are kept out of the opposite bundle by **Import Protection** (enabled by default), and if you can't rename a file, import a marker at the top.

```ts
// src/lib/secrets.ts — when the filename can't be *.server.ts
import '@tanstack/react-start/server-only';

export function getApiKey() {
  return process.env.API_KEY;
}
```

One more thing: **don't read `process.env` at module scope.** Besides the risk of the value being inlined into the client bundle, edge runtimes such as Cloudflare Workers inject env **per request**, so at module load time it is `undefined` even on the server. Read it inside `.handler()`, middleware `.server()`, or server-route handlers.

## Usage

### 1. Create a project

There are three quick paths.

- **TanStack Builder** — the AI-first setup flow the official docs recommend first (`tanstack.com/builder`)
- **CLI** — scaffold while choosing a package manager and add-ons such as Tailwind CSS and ESLint

```bash
npx @tanstack/cli@latest create
```

- **Start from an official example** — `start-basic`, `start-basic-rsbuild`, `start-basic-auth`, `start-basic-react-query`, `start-clerk-basic`, `start-supabase-basic`, `start-workos`, and more

```bash
npx gitpick TanStack/router/tree/main/examples/react/start-basic start-basic
cd start-basic
npm install
npm run dev
```

### 2. Build it by hand

To understand the structure, it's worth building one by hand at least once. You don't need many files.

```bash
npm i @tanstack/react-start @tanstack/react-router react react-dom
npm i -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/node
```

Keep `package.json` as ESM and use the Vite CLI.

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}
```

In `vite.config.ts`, **the Start plugin must come before the React plugin**.

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
    // The React plugin must come after the Start plugin
    viteReact(),
  ],
});
```

If you use Rsbuild, install `@rsbuild/core` and `@rsbuild/plugin-react`, then register `tanstackStart()` from `@tanstack/react-start/plugin/rsbuild` alongside `pluginReact()`.

For `tsconfig.json`, `jsx: "react-jsx"`, `moduleResolution: "Bundler"`, `module: "ESNext"`, and `target: "ES2022"` are enough. But **don't turn on `verbatimModuleSyntax`** — the official docs warn that it can leak server bundles into client bundles.

The file tree of a minimal setup looks like this.

```text
src/
├── routes/
│   └── __root.tsx
├── router.tsx
└── routeTree.gen.ts   ← generated automatically on first run
vite.config.ts
package.json
tsconfig.json
```

`router.tsx` exports `getRouter`, which **returns a new router every time it's called**, because a router is created for every SSR request.

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

The root route renders the document shell (`<html>`, `<head>`, `<body>`), with `HeadContent` in `<head>` and `Scripts` at the end of `<body>`.

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

### 3. Your first route: a loader and server functions

The counter example from the official tutorial packs Start's basic flow into a single file: **read with a GET server function, write with a POST server function, seed initial data with the loader, and reload with `router.invalidate()` after a change.**

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

The client bundle doesn't break even though this file imports `node:fs`, because the build **swaps the server function implementation for an RPC stub** on the client side. Calling `updateCount()` in the browser becomes a `fetch` request, and the real code stays on the server.

### 4. Using server functions properly

A server function takes a single `data` argument. Because it crosses the network boundary, **runtime validation** is the norm, and you can pass a schema such as Zod directly.

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
    // data is already validated and fully typed
    return `Created user: ${data.name}, age ${data.age}`;
  });
```

Throwing `redirect()` is handled automatically — the navigation happens — both in route lifecycles such as loaders and `beforeLoad` and in `useServerFn()`. `notFound()` leads to the `notFoundComponent` when thrown from a loader or `beforeLoad`. The official docs say `useServerFn()` handles both, but the current `useServerFn` source only handles redirects, so **a `notFound()` from a server function called in an event handler arrives as an ordinary error**.

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

As the app grows, the file convention suggested by the official docs makes things easier.

```text
src/utils/
├── users.functions.ts   # createServerFn wrappers — safe to import anywhere
├── users.server.ts      # Server-only helpers such as DB queries — used only inside server function handlers
└── schemas.ts           # Validation schemas shared with the client
```

Server functions are safe to import statically from anywhere, but the docs advise **avoiding dynamic `import()`, which can cause bundler issues**.

There are also defaults worth knowing.

- **CSRF protection** — server functions are same-origin RPC. If there is no `src/start.ts`, Start installs `createCsrfMiddleware()` automatically, but **once you create `src/start.ts` yourself, you have to add this middleware explicitly.** The middleware checks the origin using the `Sec-Fetch-Site`, `Origin`, and `Referer` headers and rejects requests that carry none of them by default, so check ahead of time if you deploy behind a proxy that strips these headers.
- **Serialization type checks** — TypeScript checks that inputs and return values are serializable (`strict` by default). `FormData` (for POST) and `Response` are allowed.
- **Cache headers** — you can set `Cache-Control` with `setResponseHeaders`, but using `public` on a response that varies by session or cookie **can replay one user's response to another**, so use `private` (plus `Vary`) or `no-store`.

```tsx
// src/start.ts — if you created this file, register the CSRF middleware yourself
import { createStart, createCsrfMiddleware } from '@tanstack/react-start';

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
}));
```

### 5. Middleware

There are two kinds of middleware.

| Aspect            | Request middleware                                 | Server function middleware      |
| ----------------- | -------------------------------------------------- | ------------------------------- |
| Scope             | All server requests (SSR, server routes, server functions) | Server functions only   |
| Methods           | `.server()`                                        | `.client()`, `.server()`        |
| Input validation  | No                                                 | `.validator()`                  |
| Client-side logic | No                                                 | Yes (before and after the RPC)  |

The most common use is authentication. Centralize session lookup in a middleware and attach it to **every** server function that touches private data.

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
    // context.session arrives fully typed
    return db.orders.findMany({ where: { userId: context.session.userId } });
  });
```

There's a sentence the official docs repeat several times: **a route guard (`beforeLoad`) is not a data authorization boundary.** Server functions and server routes are **API endpoints that can be called independently** of the screen that uses them, so authorization belongs in the handler or middleware. A redirect in `beforeLoad` is just UX.

Global middleware that should apply to every request or every server function is registered in `createStart` in `src/start.ts`, via the `requestMiddleware` / `functionMiddleware` arrays. `sendContext`, which carries context from client to server, keeps the types in sync but **does not validate at runtime**, so validate it again in the server middleware. Never take trusted values such as the session from `sendContext`.

### 6. Server routes (API endpoints)

HTTP endpoints meant to be called from outside your app (webhooks, public APIs, file responses, and so on) are built as **server routes**. They live in the same `src/routes` directory as app routes and follow the same file conventions.

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

| When                                                         | Use                     |
| ------------------------------------------------------------ | ----------------------- |
| Called from within the Start app, letting Start handle serialization | Server function |
| Called from outside the app (other services, webhooks, crawlers) | Server route         |
| You need both                                                | `component` and `server` in the same file |

### 7. Using it with TanStack Query

In this combination, Router loaders coordinate navigation and Query owns data freshness and mutation state. Install `@tanstack/react-query` and `@tanstack/react-router-ssr-query`, and **create the `QueryClient` inside `getRouter`.** At module scope, the cache would be shared across SSR requests, and one user's data could end up in another user's HTML.

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

To use `context.queryClient` in child loaders, create the root route with `createRootRouteWithContext<{ queryClient: QueryClient }>()` to declare the context type. The integration package supplies the Query provider and handles SSR dehydration/hydration, so don't add those yourself.

When the loader and the component share **the same `queryOptions`**, the component reads the cache the loader filled, and the integration package hands it over to the browser. The same request isn't sent again after hydration.

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

After a mutation, invalidate **whoever actually owns the data**. `queryClient.invalidateQueries` refreshes the Query cache, and `router.invalidate()` reloads loader data and route context. Neither one purges a CDN or a database cache. The `queryOptions` pattern from my earlier [react-query(v5)](/en/posts/2023-07-23-react-query-v5/) post carries over as is.

## Choosing a Rendering Mode

Start's most practical advantage is that you choose how to render **per route**.

| Mode                      | Setting                                     | What the server does on the first request          | Good fit                                          |
| ------------------------- | ------------------------------------------- | -------------------------------------------------- | ------------------------------------------------- |
| **Full SSR** (default)    | `ssr: true`                                 | Runs `beforeLoad` · `loader` + renders the component | Pages where SEO and the first paint matter      |
| **Data-only**             | `ssr: 'data-only'`                          | Runs only `beforeLoad` · `loader`                  | Data on the server, component depends on browser APIs |
| **Client-only**           | `ssr: false`                                | Runs nothing (renders only a fallback)             | Loaders that depend on `localStorage` and the like |
| **SPA mode**              | `tanstackStart({ spa: { enabled: true } })` | Prerenders the root shell at build time (`/_shell.html`) | Static CDN hosting, apps that don't need SEO |
| **Static prerendering**   | `tanstackStart({ prerender: { enabled: true } })` | Generates HTML at build time                 | Blogs, docs, marketing pages                      |
| **ISR**                   | `Cache-Control` + CDN                       | Regenerates on the next request after the cache expires | Public pages that rarely change              |

### Selective SSR

```tsx
// src/routes/posts/$postId.tsx
export const Route = createFileRoute('/posts/$postId')({
  ssr: 'data-only',
  loader: () => {
    // Server on the first request, client on later navigations
  },
  component: () => <div>This component is rendered on the client</div>,
});
```

`ssr` can also be a function. It receives the validated `params` and `search` and decides per request; the function runs only on the server and is stripped from the client bundle.

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

The **inheritance rule** matters. A child route inherits its parent's setting and can only change it **to something more restrictive** (`true` → `'data-only'` → `false`). If the parent is `ssr: false`, writing `ssr: true` on the child has no effect. To change the default itself, use `createStart(() => ({ defaultSsr: false }))` in `src/start.ts`. And these settings apply only to **the first request**: on later client-side navigations, `beforeLoad` and `loader` run in the browser regardless of the mode.

### SPA mode

No SSR doesn't mean giving up server features. After the build, the root route is prerendered into `/_shell.html` (the pending component fills the spot where matched routes would render), and server functions and server routes keep working. Other routes can be prerendered too, and the official docs recommend prerendering as much as you can. In exchange, your host needs rewrite rules (a Netlify `_redirects` example).

```text
# Pass server functions and APIs through to the server
/_serverFn/* /_serverFn/:splat 200
/api/* /api/:splat 200

# Send every other 404 to the SPA shell
/* /_shell.html 200
```

### Static prerendering

```ts
// vite.config.ts
tanstackStart({
  prerender: {
    enabled: true,
    crawlLinks: true, // follow links in the HTML and prerender them too
    concurrency: 14,
    failOnError: true,
    filter: ({ path }) => !path.startsWith('/do-not-render-me'),
  },
});
```

### Server Components (experimental)

RSC is off by default, and turning it on requires React 19+ and Vite 8+ or Rsbuild 2. With Vite, install `@vitejs/plugin-rsc` and register `tanstackStart({ rsc: { enabled: true } })` together with the `rsc()` plugin. The usage pattern is "a server function renders a Server Component and returns it, and the loader receives it."

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

If you need slots, render a source created with `createCompositeComponent` through `<CompositeComponent src={...}>` and pass client components in as children. Because the client composes UI produced by the server, the owner of the component tree is still the client-side router — that's where it differs from Next.js.

There are constraints to know as well. RSC uses React's Flight protocol as is, so Start's own serialization isn't available inside Server Components yet (primitives, Dates, and React elements work), and caching Server Components with TanStack Query requires `structuralSharing: false`.

The post that introduced RSC ("React Server Components Your Way", 2026-04-13) states that Start **intentionally does not support `'use server'` actions**, citing existing attack vectors and the way they create implicit network boundaries. The same post explains that because Start doesn't parse Flight data coming from the client, recent CVEs that hit other RSC frameworks don't apply — keep in mind that this is TanStack's own assessment, not an independent audit.

The official comparison draws the line explicitly: this feature **should not be presented as production feature parity with Next.js**. If RSC is the center of your app, weigh that first.

## Deployment

Start is designed **to work with any hosting provider**, and its official hosting partners are Cloudflare, Netlify, and Railway. The docs have guides for Cloudflare Workers, Netlify, Railway, Nitro, Vercel, Node.js/Docker, Bun, and Appwrite Sites.

The most general-purpose option is **Nitro**. It integrates natively with the Vite Environment API and lets you deploy to the many hosts Nitro supports (the docs still carry a warning that it's under active development).

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

Cloudflare Workers uses `@cloudflare/vite-plugin` and `wrangler`, and points the SSR environment at Workers.

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

On Netlify, `@netlify/vite-plugin-tanstack-start` handles both the build configuration and local platform emulation. When you build with Rsbuild, client assets go to `dist/client` and a fetch-style server entry goes to `dist/server/index.js`.

For environment variables, server code reads unprefixed values from `process.env`, and only values carrying the build tool's public prefix (Vite `VITE_`, Rsbuild `PUBLIC_`) are exposed to the client.

Before deploying, I recommend running through the official **Production Checklist** once. It includes items such as building with a harmless test secret and searching the client output for it, and calling private endpoints **directly** while signed out and as a different account.

## Migration ① RC → 1.0

If you were on the RC, upgrade to `@tanstack/react-start` 1.169 and clean up the following.

**Vite 8 is required.** If you build with Vite, finish the Vite 8 migration first ([my Vite 8.0 post](/en/posts/2026-07-13-vite8.0/)).

### Removed APIs

| Removed                                              | Use instead                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| `@tanstack/nitro-v2-vite-plugin`                     | `nitro()` from `nitro/vite`                                       |
| `useSession`                                         | A session library such as iron-session                            |
| `.inputValidator()` on server functions and middleware | `.validator()` (pass the same validator as is)                  |

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

There's a catch when replacing `useSession`: the new library **cannot read existing Start session cookies**. Either use a new cookie name and have users sign in again, or test a migration path that reads the old cookie first.

`.validator()` has a backstory. It was originally called `.validator()`, was renamed to `.inputValidator()` in the RC (1.132), and in June 2026 (1.168.25, PR #7566) `.validator()` became the canonical name again, with `.inputValidator()` kept around with a deprecation warning until it was removed in 1.169.0. That's why **RC-era tutorial code breaks on 1.0 as is.** On the flip side, this history lets you split the upgrade into steps.

1. On 1.168.25 or later (the last release supporting Vite 7 is 1.168.61), rename `.inputValidator()` to `.validator()` first
2. On the same version, apply changes that work on both versions, such as replacing `useSession` with a session library and switching `set-cookie` to `setCookie`/`appendResponseHeader`
3. Upgrade to Vite 8 and 1.169.x, then swap the Nitro plugin and go through the behavior-change table below

### Behavior changes

| Area                 | Change                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| Server entry         | A handler returned by `createStartHandler(...)` now **rethrows** the original error. In a custom entry, catch inside the `createServerEntry` callback and `return handleStartError(error)` |
| Error responses      | Uncaught errors produce a **generic JSON body** with a 400–599 status (500 by default), even if a success status was set earlier |
| Server function calls | Reject with whatever was thrown (including a `Response` and falsy values such as `undefined`). Return a `Response` to resolve with it |
| Middleware errors    | Errors thrown by request middleware during a server-function call reach the client with their message, and the status is no longer always 500 |
| Response helpers     | Helpers **override** the response you return or throw. `setResponseStatus(401)` followed by a 200 response sends 401 |
| Cookies              | `setResponseHeader('set-cookie', cookie)` **replaces all** outgoing cookies. Use `setCookie` or `appendResponseHeader` to add one |
| Status codes         | `setResponseStatus` ignores codes outside 200–599 (and warns outside production)                              |
| Serialized replies   | Server-function replies never carry `Location`, `Content-Encoding`, or `Content-Length` set by helpers, and ignore 204/205/304 → use `redirect()` to redirect |
| Request headers      | `getRequestHeader(name)` returns `''` for a header that is present but empty, and `undefined` only when it is missing |
| Malformed paths      | A path with invalid percent-encoding such as `/%E0%A4%A` gets a `400` before your server entry or middleware runs |
| Context              | When no function middleware sends context, `sendContext` is `undefined` instead of `{}`                       |

### What can break quietly

From the list above, here are the ones type checks and builds won't catch (this is my own summary based on the guide).

| Where                                   | Why it's quiet                                                       | How to check                                         |
| --------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| `setResponseHeader('set-cookie', …)`    | Code that set several cookies ends up with **only the last one**     | Count `Set-Cookie` headers on sign-in and session refresh responses |
| Response helpers + a hand-built `Response` | The status code you intended gets replaced by the helper's value  | E2E-check the actual status codes on error and auth-failure paths |
| Destructuring `sendContext`             | Code that assumed `{}` throws at runtime on `undefined`              | Search for `sendContext` usages                      |
| Truthiness checks on `getRequestHeader` | An empty header now arrives as `''`, changing `if (!header)` branches | Check header presence with `=== undefined`          |
| Client-side error parsing               | The body shape of uncaught errors has changed                        | Review code that renders error messages              |

### Coming from an even older version (the Vinxi era)

If you were on a beta from before the RC, there are two big transitions to get through first. Here is a summary of what the official tracking discussion (GitHub Discussion #2863) lays out.

**1.121.0 (June 2025) — Vinxi → Vite plugin**

| Before                                | After                                                                      |
| ------------------------------------- | -------------------------------------------------------------------------- |
| The `@tanstack/start` package         | `@tanstack/react-start` (`@tanstack/solid-start` for Solid)                |
| `vinxi` + `app.config.ts`             | `vite` + the `tanstackStart()` plugin in `vite.config.ts`                  |
| The `app/` directory                  | `src/` (update tsconfig path aliases too)                                  |
| `client.tsx` · `ssr.tsx` entries      | Deleted (move to `server.tsx` if you customized them)                      |
| `createAPIFileRoute` + `src/api.ts`   | Server routes (`createServerFileRoute` back then, `server.handlers` on `createFileRoute` today) |

**1.132 (September 2025, RC) — API renames**

| Before                                        | After the RC                                             |
| --------------------------------------------- | -------------------------------------------------------- |
| `createServerFileRoute(...)`                  | `createFileRoute(...)({ server: { handlers } })`         |
| Exporting `createRouter` from `router.tsx`    | Exporting `getRouter`                                    |
| `getWebRequest` · `getHeaders` · `getHeader`  | `getRequest` · `getRequestHeaders` · `getRequestHeader`  |
| `setHeaders` · `setHeader`                    | `setResponseHeaders` · `setResponseHeader`               |
| `parseCookies`                                | `getCookies`                                             |
| `serverOnly` · `clientOnly`                   | `createServerOnlyFn` · `createClientOnlyFn`              |
| Plugin options `tsr` · `tsr.srcDirectory`     | `router` · top-level `srcDirectory`                      |
| `validator`                                   | `inputValidator` (back to `validator` in 1.0)            |

On top of that, `registerGlobalMiddleware` was removed (today it's `createStart` in `src/start.ts`), Nitro was decoupled from the default setup (`nitroV2Plugin` in the RC, `nitro/vite` in 1.0), and you now add the React plugin (`viteReact()`) yourself. If you can't upgrade right away, the discussion suggests pinning versions with `npx create-start-app@latest pin-versions`.

In short, it's safest to climb one step at a time: **Vinxi era → 1.121 structure → 1.132 names → 1.169 stable.** And since blog posts and tutorials from the RC period are full of `.inputValidator()`, the Nitro v2 plugin, and Vite 7 examples, compare them against the latest docs before following them.

## Migration ② Next.js App Router → Start

For teams moving from Next.js, the official guide provides **a before/after example that implements the same article site in both frameworks** (`examples/react/start-next-migration`), plus Playwright tests that run unchanged against both apps. They check public URLs, server-rendered metadata, query filtering, redirects, 404s, the sitemap, sign-in errors, session persistence, private response caching, mutations, and server-side rejection after sign-out. "Pin the behavior down as a contract and translate only the framework boundaries" is the heart of this guide.

There's one premise to know up front: **Start has no `'use server'`.** Every Server Action has to be rewritten with `createServerFn`, and the `'use client'` directive isn't needed either, so remove it. The `@tanstack/react-start` package also ships an agent skill for migrating from Next.js (`skills/lifecycle/migrate-from-nextjs/SKILL.md`), which is useful reference material when you hand the work to an agent. That skill, however, removes Next.js early in its steps, so running both apps side by side as in the official guide below is the safer approach.

### Step 0: Take inventory before changing anything

- **Observable behavior** — dynamic paths, query parameters, redirects, trailing slashes, locale prefixes, response status, title/description/canonical/robots, and sitemap membership
- **Next.js-specific code** — `next/*` imports, `'use server'`, server-only modules, metadata exports, `generateStaticParams`, `revalidatePath`/`revalidateTag`, cache directives, Proxy/middleware, and image/font configuration

The guide warns that a route can render successfully and still have lost authentication, cache invalidation, or an important search URL.

### Step 1: Stand Start up next to the existing app

Keep the Next.js app **runnable** until the migrated routes pass their checks. You can test Start without removing Next.js or its configuration.

### Step 2: Keep the paths, move the files

| Next.js App Router               | Start route file                              |
| -------------------------------- | --------------------------------------------- |
| `app/layout.tsx`                 | `src/routes/__root.tsx`                       |
| `app/page.tsx`                   | `src/routes/index.tsx`                        |
| `app/posts/page.tsx`             | `src/routes/posts.index.tsx`                  |
| `app/posts/[slug]/page.tsx`      | `src/routes/posts.$slug.tsx`                  |
| `app/docs/[...parts]/page.tsx`   | `src/routes/docs.$.tsx`                       |
| `app/api/hello/route.ts`         | `src/routes/api.hello.ts` (server handlers)   |

`src/routes` is a source directory, not a URL prefix. Nested layouts, route groups, optional parameters, and parallel/intercepting routes should be mapped individually rather than renamed mechanically (the official example doesn't reproduce parallel or intercepting routes either).

### Step 3: API mapping

Grouping the guide's content by API gives the following.

| Next.js                                   | TanStack Start                                                       |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `next/link`                               | Router's `<Link to="/posts/$slug" params={…}>`                       |
| A page's `searchParams`                   | `validateSearch` + `Route.useSearch()`, plus `loaderDeps` when a loader uses them |
| Data reads in an async Server Component   | A server function → called from the loader                           |
| Server Action + `revalidatePath`          | POST server function + `useServerFn` + `router.invalidate()` (+ Query invalidation) |
| `metadata` / `generateMetadata`           | Route `head` + `HeadContent` in the root                             |
| `app/sitemap.ts`, robots                  | Migrated explicitly, e.g. a `/sitemap.xml` server route              |
| Route Handler (`app/api/**/route.ts`)     | Server route (`server.handlers`)                                     |
| `cookies()`                               | `getCookie` / `setCookie` (`@tanstack/react-start/server`)           |
| Proxy (middleware)                        | Request middleware (`src/start.ts`)                                  |
| `next/image`                              | `<img>` or Unpic + an image service (no built-in optimizer)          |
| `next/font`                               | Self-hosted fonts, Fontsource, etc.                                  |
| `generateStaticParams`, cache directives  | Static prerendering / HTTP-cache-based ISR (verify on your host)      |
| `NEXT_PUBLIC_*`                           | `VITE_*` (`PUBLIC_*` on Rsbuild) — re-audit what you expose          |

`searchParams` turns into the following. TypeScript types alone can't validate an incoming URL, so add **runtime validation**.

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

The part that needs the most care is **database reads that lived inside Server Components**. Start's loaders also run in the browser, so don't move a query from an async Server Component straight into a loader. Keep privileged reads inside a server function, have the loader call it, and return only data the browser is allowed to see.

A Server Action becomes a POST server function. Even if the route already checked permissions, a server function **can be called directly without going through the page**, so authorize again inside the function.

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
// Component
function SaveButton({ slug }: { slug: string }) {
  const router = useRouter();
  const save = useServerFn(toggleSaved);

  return (
    <button
      type="button"
      onClick={async () => {
        await save({ data: { slug } });
        await router.invalidate(); // instead of revalidatePath, reload the current route's data
      }}
    >
      Save
    </button>
  );
}
```

There's one easy-to-miss difference here. A Next.js Server Action form works **even without JavaScript**, but a form that calls a server function from an event handler needs JS and doesn't work before hydration. If progressive enhancement is a requirement, use a FormData-compatible server function's `.url`, or a plain form POST to a server route (with validation and CSRF protection). The guide itself says not to treat `createServerFn` as a drop-in replacement for the React form Action protocol.

### Step 4: Auth, metadata, and caching

- **Auth** — Start doesn't provide a session API. The official example keeps `iron-session` and replaces Next.js `cookies()` with a small `getCookie`/`setCookie` adapter. If sessions must survive cutover or rollback, verify cookie names, domains, paths, signing/encryption formats, expiration, key rotation, and logout in both deployments.
- **Caching private pages** — make sure personalized HTML never reaches another user by checking `Cache-Control: private, no-store`, and verify the final response through the CDN. Don't prerender or publicly cache pages that contain private data.
- **Metadata** — compare the HTML response before JS runs and the head after client navigation. Migrate the sitemap, robots.txt, icons, manifests, and social images explicitly, and return real 404s for missing content.
- **Caching** — list browser data, Router loaders, Query, server data, generated pages, and CDN responses **separately**, and define what populates and what invalidates each. Next.js cache directives and revalidation don't carry over automatically.

### Step 5: Cut over with a rollback path in hand

1. Build both apps and run the contract tests against a staging deployment of Start, including real data, authenticated sessions, and the CDN.
2. During the transition, keep the database schema compatible with both versions and separate destructive schema changes from the framework cutover.
3. Preserve the public origin and paths as much as possible, and when paths must change, update redirects, internal links, canonicals, and sitemaps together.
4. Record the previous deployment and routing configuration, and know how to route traffic back — and what happens to sessions and writes when you do.
5. After cutover, monitor error rates, login and mutation failures, response status, indexing signals, and conversion events against the baseline.

Remove Next.js and its leftover configuration only **after** all of this behavior and the rollback plan are verified. Compared with my earlier [Next.js 15 migration](/en/posts/2024-11-23-nextjs-v15-migration/) post, the biggest difference is that, unlike a version bump within the same framework, this work is **"translating an execution model," not "swapping APIs."**

### Coming from Remix / React Router 7

A Start-specific guide is still "coming soon." In the meantime, the TanStack Router docs' **"Migrate from React Router v7"** covers the router-level mapping and recommends Start when you need full-stack features.

| React Router v7                           | TanStack Router / Start                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| `useLoaderData()`                         | `Route.useLoaderData()`                                                     |
| `useParams()`                             | `Route.useParams()`                                                         |
| `useSearchParams()` / `setSearchParams`   | `validateSearch` + `Route.useSearch()` / `navigate({ search: (prev) => … })` |
| `<Link to="/posts/123">`                  | `<Link to="/posts/$postId" params={{ postId: '123' }}>`                     |
| `defer`                                   | No direct equivalent — handle loading states with `pendingComponent` and the like |
| `action`                                  | No direct equivalent — the Router guide recommends mutations or form libraries |

When moving to Start, the biggest conceptual difference is the **loader's execution location** mentioned earlier. A React Router Framework Mode `loader` runs on the server, but Start's `loader` is isomorphic, so server-only code has to move into server functions. On top of that, it's enough as a starting point to move `action` to a POST server function, resource routes to server routes, and `meta` to `head` (these three are my own mapping, not an official one).

## Advantages

1. **End-to-end type safety** — links, path parameters, validated search params, loader data, route context, and server function inputs and outputs are connected in a single type graph. When you change something, your editor (and your agent) immediately finds what it affects.
2. **A familiar app model** — the default is SSR + hydration, so you can write it like the React apps you've been building, without `'use client'` boundaries or a server/client component split. You get server functions and SSR without RSC.
3. **Explicit execution boundaries** — `createServerFn`, `createServerOnlyFn`, `createIsomorphicFn`, and Import Protection make "where does this code run" visible in the code itself.
4. **Per-route rendering control** — Full SSR, data-only, client-only, SPA mode, and prerendering can be mixed within one app.
5. **Middleware that spans client and server** — server function middleware runs on both the client and the server around the RPC, and context flows through with its types.
6. **Freedom of build tool and hosting** — both Vite and Rsbuild are supported, and Nitro plus partner plugins deploy to Cloudflare, Netlify, Railway, Vercel, Node, Bun, and more.
7. **Fits the TanStack ecosystem** — it meshes with the TanStack libraries you may already use, such as Query (data caching), Form, and Table, under the same design philosophy.

## Drawbacks and Caveats

1. **RSC is experimental.** If your app is designed around Server Components, Next.js is more mature there.
2. **No built-in image or font optimization.** You have to pick and configure equivalents of `next/image` and `next/font` yourself.
3. **The isomorphic-loader trap** — putting secrets or database code in a loader can break on client navigation or drag server code into the client bundle. Teams used to thinking "loader = server" need a review rule for this.
4. **Server functions are public endpoints.** A `beforeLoad` guard alone doesn't protect data; every server function that touches private data needs authorization. Once you create `src/start.ts`, you also have to register the CSRF middleware yourself.
5. **There's no session API.** `useSession` was removed in 1.0, so you need a library such as iron-session or a managed service such as Clerk or WorkOS.
6. **A fast release cadence** — according to npm, the 1.168 line alone shipped 61 patches between May 15 and October 10. Commit your lockfile and make a habit of reading the changelog when you upgrade.
7. **Gaps in the docs** — the Remix 2 / React Router 7 migration guide is "coming soon," and the Nitro integration docs still carry an "under active development" warning.
8. **Security history** — CVE-2026-102989 (GHSA-qx66-fv34-fjm8, CVSS 9.3) was a reflected XSS where an unauthenticated, crafted server-function URL could return attacker-controlled HTML from the application's origin. The affected range of `@tanstack/react-start` runs from 1.143.12 up to (but not including) 1.168.60, and updating a local install doesn't patch an app that is already deployed, so you need to **rebuild and redeploy**. It wasn't a framework design issue, but on May 11, 2026 a supply-chain attack exploiting a GitHub Actions misconfiguration (CVE-2026-45321) published 84 credential-stealing malicious versions across 42 packages — including `@tanstack/react-start` 1.167.68 and 1.167.71 — within a few minutes. All of them were deprecated and removed the same day, but if you installed dependencies that day, follow the official postmortem to check for those versions and rotate credentials.
9. **No explicit versioning policy yet.** The 1.0 announcement doesn't spell out how future breaking changes will be handled (major cadence, support windows). That contrasts with [React Router v8](/en/posts/2026-09-19-react-router-v8/), which committed to "one major per year." Given the API's track record of moving — `.validator()` was renamed twice during the RC — budget time for reading the changelog on every upgrade for now.

## Real-World Adoption and Counter-Examples

Docs and announcements are, in the end, the maker's side of the story. For balance, I also looked up records from teams that actually made the move. Versions and timing vary, and none of these are independent benchmarks, so read them with that in mind.

| Case                          | When · version                         | What they did                                                       | Results · lessons                                                                                                                                                  |
| ----------------------------- | -------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Inngest**                   | 2026-01 · RC                           | Moved a Next.js dashboard to Start (also prototyped React Router v7 and Deno Fresh) | First local dev loads went from 10–12s to 2–3s, with one engineer and AI help over a couple of weeks. In exchange, mis-bundled server/client code was hard to trace, dev and the built app behaved differently, and an integration-flow issue once forced an instant rollback |
| **Tightknit**                 | 2026-04                                | Moved a Next.js app to Start on Cloudflare Workers                  | Avoided vendor lock-in and fit their existing Cloudflare ecosystem. The cost: losing `vercel/og` meant building a separate worker on `workers-og` (which they themselves called a hack), and learning a new caching model |
| **LogRocket experiment**      | 2026-06 · Start 1.168.26 vs Next.js 16.2.9 | Built the same dashboard twice with RSC                          | Start led on client JS, 116KB vs 193KB (gzip), and build time, 1.3s vs 5.1s, but setup took 8 min vs 3 min and the code was 345 vs 290 lines. The RSC layer had thin docs and a plugin-order error: "too early to recommend for production" |
| **LLM Gateway** (the other way) | 2025-07 · Vinxi-era alpha            | Left Start for Next.js                                              | Lighthouse performance 85→100, SEO 80→100. Tanner Linsley's analysis attributes most of it to adopting `next/image`, tuning `staleTime` and prefetching, and a config mistake that used `<meta name="title">` instead of `<title>` |

Three common threads stand out.

- **There were reports favoring Start on dev-server speed and bundle size** (Inngest, LogRocket), and the price was setup cost and debugging the server/client boundary.
- **What Next.js gives you by default** (image optimization, OG image generation, metadata conventions) has to be filled in yourself — this repeats across cases. The LLM Gateway case shows less that "Start is slow" and more what happens when you leave that gap unfilled.
- **If RSC is the center of your app, Next.js still; if your app is highly interactive, Start with RSC off** — the LogRocket experiment and the official comparison land on the same conclusion.

The 1.0 announcement also names adopters. Lovable chose Start as the foundation for newly generated apps, Netlify uses it as the default framework for its AI app builder that more than a million people have used, and Unkey adopted Start, Router, and Query in its open-source portal. Keep in mind that all of them are TanStack partners.

## Compared with Next.js and React Router

Here is a summary of the official comparison (as of 2026-09-11, against the Next.js 16.3 App Router and React Router 8.3 Framework Mode). Keep in mind that TanStack wrote it, but it's a fairly restrained document: it doesn't crown a performance winner, and it spells out where Next.js has the advantage. By contrast, the overview page's line about offering "the same capability as Next.js, Remix, etc., with even more features and a more powerful developer experience" is a vendor claim with no evidence attached.

| Aspect                     | TanStack Start                              | Next.js App Router                                 | React Router Framework Mode                  |
| -------------------------- | ------------------------------------------- | -------------------------------------------------- | -------------------------------------------- |
| Server rendering           | SSR + hydration by default                  | Server and Client Components produce the initial HTML | Configurable SSR                          |
| Rendering control          | Per-route full / data-only / off            | `use client` boundaries (initial SSR still happens) | Global SSR setting + route `clientLoader`   |
| RSC                        | Experimental, opt-in                        | The core component model                           | Unstable                                     |
| Server calls · mutations   | Typed server functions (GET/POST)           | Server Actions                                     | Route actions · fetchers                     |
| Middleware                 | Request + server function (client/server)   | Proxy                                              | Server and client route middleware           |
| API endpoints              | Server routes                               | Route Handlers                                     | Resource routes                              |
| Build                      | Vite or Rsbuild                             | Turbopack                                          | Framework tooling (Vite plugin)              |
| Images · fonts             | Your choice                                 | Built-in `next/image` · `next/font`                | Your choice                                  |

The official selection criteria go like this.

- **TanStack Start** — when you want typed route context and URL state, explicit loaders and server functions, and per-route rendering control
- **Next.js** — when you need the Server Component model and the built-in image, font, metadata, and form facilities, or when your team's experience and existing integrations are already built around Next.js
- **React Router Framework Mode** — when loader/action/fetcher-centric, form-driven workflows and progressive enhancement matter

And here's the line I personally agreed with most: **you don't need to rewrite a healthy Next.js app just because the routing model is different.** Instead, the official recommendation is to build **one representative route** in Start — including real data loading, search param validation, a mutation, handling unauthorized access, and deployment — and judge by whether it becomes easier to maintain.

## Wrapping Up

In one sentence, TanStack Start 1.0 is **"the release where building the router properly turned into a full-stack framework, and the team now commits to its APIs."** It's less a feature launch than a milestone that puts a stability guarantee on a design already running in production.

If Next.js treats "the server as the default and the client as the exception," Start does the opposite: **"the familiar app as the default, and the server made explicit."** Which one is right depends on your app, but for teams already comfortable with type-safe routing and TanStack Query, it clearly looks like the full-stack option with the lowest barrier to entry.

**Adoption checklist:**

- ✅ Prepare Vite 8+ (or Rsbuild 2) and Node 22.12+
- ✅ `@tanstack/react-start` 1.169.x, and confirm the installed `@tanstack/start-server-core` is 1.169.39 or later (CVE-2026-102989)
- ✅ No secrets or database code in loaders — move them into server functions if there are
- ✅ `authMiddleware` (or in-handler authorization) on every server function that touches private data
- ✅ If you created `src/start.ts`, register `createCsrfMiddleware()` explicitly
- ✅ Create the `QueryClient` inside `getRouter`
- ✅ `Cache-Control: private` (or `no-store`) on personalized responses
- ✅ (RC users) `.inputValidator` → `.validator`, replace `useSession`, swap the Nitro plugin, review `set-cookie` handling
- ✅ (Moving from Next.js) `'use server'` → `createServerFn`, then behavior inventory → representative-route PoC → contract tests → cutover with a rollback path
- ✅ (Beware of old tutorials) if you see `.inputValidator()`, `nitroV2Plugin`, `createServerFileRoute`, or `app.config.ts`, it's pre-1.0 code — compare it against the latest docs
- ✅ If you installed dependencies on 2026-05-11, check for the supply-chain attack's malicious versions (GHSA-g7cv-rxg3-hmpx)

---

# References

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
- GitHub, [Start BETA - Tracking (#2863)](https://github.com/TanStack/router/discussions/2863) — Vinxi → Vite and RC change notes
- Case studies — Inngest, [Reducing local dev time by 83%: Why we migrated off Next.js](https://inngest.com/blog/migrating-off-nextjs-tanstack-start) · Tightknit, [The Practical Case for TanStack Start on Cloudflare Workers](https://tightknit.ai/blog/nextjs-to-tanstack-start-cloudflare-workers) · LogRocket, [TanStack Start RSC vs. Next.js RSC](https://blog.logrocket.com/tanstack-start-rsc-vs-next-js-rsc-performance-dx-production-readiness/)
- Counter-example — LLM Gateway, [Next.js migration](https://llmgateway.io/changelog/nextjs-migration) · Tanner Linsley, [TanStack Start to Next.js Migration Analysis](https://gist.github.com/tannerlinsley/4f7bde6c8026104f0dc06a122a657621)
- npm, [@tanstack/react-start](https://www.npmjs.com/package/@tanstack/react-start)
- TanStack, [Design System — Logos](https://tanstack.com/ds/logos) — source of the thumbnail logo (the emblem, wordmark, and START lockup from the docs header)
- Earlier posts — [React Router v8](/en/posts/2026-09-19-react-router-v8/) · [Vite 8.0](/en/posts/2026-07-13-vite8.0/) · [react-query(v5)](/en/posts/2023-07-23-react-query-v5/) · [Next.js 15 migration](/en/posts/2024-11-23-nextjs-v15-migration/)
