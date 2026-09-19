---
layout: post
title: React Router v8
date: 2026-09-19
published: 2026-09-19
category: Development
tags: ['react-router', 'react']
comments: true
thumbnail: './assets/19/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# React Router v8: The "Boring Major" and the v7 → v8 Upgrade Guide

## ✍️ TL;DR

> **React Router v8 isn't a release that ships new features — it locks in, as defaults, the changes v7 already exposed behind future flags, and raises the minimum versions.** If you turned every flag on while on v7, the upgrade is essentially one line: `pnpm i react-router@latest`.

### Summary

- **Released**: June 17, 2026, announced on the Remix blog. The team itself calls it their most "boring" major yet.
- **Minimum versions**: Node **22.22.0+** · React **19.2.7+** · Vite **7+** (Framework mode). The package is now **ESM-only**, and tsconfig target/lib moved to ES2022.
- **Five future flags became defaults**: `v8_middleware` · `v8_splitRouteModules` (moved to top-level `splitRouteModules`) · `v8_viteEnvironmentApi` · `v8_passThroughRequests` · `v8_trailingSlashAwareDataRequests`
- **Four removals**: the `react-router-dom` package · `data` in `meta`/`matches` (→ `loaderData`) · the Cloudflare dev proxy (→ `@cloudflare/vite-plugin`) · the `useRequestContextDomainName` option in `@react-router/architect`
- **Upgrade order**: latest v7 → turn flags on one at a time and commit → clean up removed APIs → install v8. The key point is that **every change can be made on v7 first.**
- **What can break quietly**: server/CDN/cache rules that handle `.data` URLs directly (`/_root.data` → `/_.data`), loaders comparing paths via `request.url`, and Vite configs relying on `isSsrBuild`.
- **Going forward**: a **yearly major** cadence. v6 and Remix v2 are **EOL** (no more security updates); v7 keeps getting security fixes. v9 (expected mid-2027) will require **Node 24+**, and RSC support is still unstable.

| Item                  | Details                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| **Runtime baseline**  | Node 22.22.0+ · React 19.2.7+ · Vite 7+ · ESM-only                      |
| **New defaults**      | Middleware · split route modules · Vite Environment API · pass-through requests · trailing-slash awareness |
| **Removed**           | `react-router-dom` · `data` param · Cloudflare dev proxy · architect option |
| **Support policy**    | v6 & Remix v2 EOL · v7 security patches continue · one major per year  |

The details follow below.

---

## 📋 Table of Contents

1. [Why a "Boring Major"](#why-a-boring-major)
2. [What Piled Up Since v7](#what-piled-up-since-v7)
3. [What's Changing](#whats-changing)
4. [The v7 → v8 Upgrade Guide](#the-v7--v8-upgrade-guide)
5. [Where Things Break Quietly](#where-things-break-quietly)
6. [A Peek at v9](#a-peek-at-v9)
7. [React Router Going Forward, and Remix](#react-router-going-forward-and-remix)
8. [Wrapping Up](#wrapping-up)

## Why a "Boring Major"

React Router has changed shape many times over its 12 years, and long-time users remember "major = major surgery." Back in [v6](/en/posts/2022-03-12-react-router-v6/), `Switch` became `Routes` and `useHistory` became `useNavigate`.

Since v7, the team's strategy has been **future flags**. Behavior that will change in the next major ships behind a flag in the current one, and you turn each on whenever you're ready. On release day the flags simply become defaults, so **there's almost nothing left to fix the day you upgrade.**

As the announcement's author (Brooks Lybrand) puts it, the only downside is that it's hard to hype up in a blog post. And the team is institutionalizing that boredom: **from now on, there will be one major per year.**

## What Piled Up Since v7

The headline of v7 was **Framework mode**: a single Vite plugin that adds a type-safe Route Module API, code splitting, SPA/SSR/static rendering, and data loading and mutations. At the same time it still supports a plain client-side router (Declarative mode) and Data mode for building your own framework. The commitment to **keep all three modes** carries over into v8.

Here's what landed across the 40+ releases since v7 (per the announcement; not exhaustive).

| Area              | Additions                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------- |
| **Data/server**   | Middleware & better context · Pass-through Requests · Call-site revalidation · `fetcher.reset` |
| **Bundling/build** | Split Route Modules · Vite Environment API support · object-based `route.lazy` · configurable Lazy Route Discovery |
| **Rendering**     | SPA mode improvements · pre-rendering improvements · (unstable) RSC support                 |
| **APIs**          | Type-safe `href` · `useRoute`/`useRouterState` (unstable) · `useTransitions` router prop · RouterProvider `onError` · Link masking |
| **Operations**    | Instrumentation API · Subresource integrity · many performance improvements · Agent Skills |

That's why v8 looks light on "new" features. The features already shipped in v7 minors; v8 is where some of them get **locked in as defaults**.

## What's Changing

### 1. Minimum supported versions

| Target    | Minimum     | Notes                                                        |
| --------- | ----------- | ------------------------------------------------------------ |
| **Node**  | 22.22.0+    | Only the latest minor line of Maintenance LTS is supported   |
| **React** | 19.2.7+     | Both `react` and `react-dom`                                 |
| **Vite**  | 7+          | Framework mode only. Check that custom Vite plugins are Vite 7 compatible |

Two more come with it:

- **ESM-only publishing** — the CommonJS build is gone.
- **tsconfig target/lib bumped to ES2022** across the board.

The Node support policy is now explicit too: **all versions of Active LTS**, and **only the latest minor line of Maintenance LTS**. As of the announcement:

- Node 24 is Active LTS → all 24.x supported
- Node 22 is Maintenance LTS → **only 22.22.x** supported
- If Node 22.23.x ships, React Router raises its minimum to 22.23.x in a **minor release**
- When Node 22 hits EOL, support is dropped in a **major release**

The goal is to quickly adopt Node versions that carry security patches as the baseline. Put differently, teams on Node 22 **may need to bump Node even for a React Router minor update**, so it's safer not to leave the Node version loose in CI and deploy images.

### 2. Future flags that became defaults

Five v8 future flags from v7 are removed, and their behavior is now the default.

| Flag                                       | Status in v8                                          | Modes              |
| ------------------------------------------ | ----------------------------------------------------- | ------------------ |
| `future.v8_middleware`                     | Default                                               | Framework · Data   |
| `future.v8_splitRouteModules`              | Moved to top-level `splitRouteModules`, on by default | Framework          |
| `future.v8_viteEnvironmentApi`             | Default                                               | Framework          |
| `future.v8_passThroughRequests`            | Default                                               | Framework          |
| `future.v8_trailingSlashAwareDataRequests` | Default                                               | Framework          |

### 3. Removed APIs

- **The `react-router-dom` package** — a mirror of `react-router` kept around to smooth the v6 → v7 upgrade. Use `react-router` and `react-router/dom`.
- **The `data` parameter in `meta` APIs** — replaced by `loaderData`.
- **The Cloudflare dev proxy** (`@react-router/dev/vite/cloudflare`) — replaced by Cloudflare's official `@cloudflare/vite-plugin`.
- **The `useRequestContextDomainName` option in `@react-router/architect`** — its behavior is now the default, so the option itself is gone.

## The v7 → v8 Upgrade Guide

The official guide's main advice: **don't do it all at once — commit after each step.** Most flags can be adopted in any order; exceptions are noted below.

### Step 0: Minimum versions first

Align the runtime **before** touching React Router.

- `node@22.22+`
- `react@19.2.7+` / `react-dom@19.2.7+`
- In Framework mode, `vite@7+` — and make sure custom Vite plugins and config work with Vite 7

### Step 1: Update to the latest v7

```bash
npm install react-router@7 @react-router/{dev,node,etc.}@7
```

### Step 2: Turn on future flags one at a time

In Framework mode, flags go in `react-router.config.ts`; in Data mode, in the `createBrowserRouter` options.

#### `v8_middleware` (Framework · Data)

Middleware lets you run code before and after the Response is generated for matched routes — for auth, logging, error handling, and other cross-cutting logic.

```ts
// Framework mode: react-router.config.ts
import type { Config } from '@react-router/dev/config';

export default {
  future: {
    v8_middleware: true,
  },
} satisfies Config;
```

```ts
// Data mode
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter(routes, {
  future: {
    v8_middleware: true,
  },
});
```

- With `react-router-serve`: no code changes
- With a **custom server**: review the `getLoadContext`/`AppLoadContext` changes
- In **Data mode**: add the `Future` module augmentation so `context` is typed correctly

#### `v8_splitRouteModules` (Framework)

Splits a route module's client-only exports (`clientLoader`, `clientAction`, `clientMiddleware`, `HydrateFallback`) into separate chunks so they load independently of the component. `true` splits where possible; `"enforce"` **fails the build unless every route is splittable.**

```ts
export default {
  future: {
    v8_splitRouteModules: true, // or "enforce"
  },
} satisfies Config;
```

No code changes needed. In v8 the option moves out of `future` to the top-level `splitRouteModules`.

#### `v8_viteEnvironmentApi` (Framework)

Enables Vite Environment API support. (The flag itself works on Vite 6+, but **v8 requires Vite 7+**, so this is a natural point to move to Vite 7.)

```ts
export default {
  future: {
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
```

Vite configs that branch on `isSsrBuild` need to move to **per-environment (`environments`) config.**

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

Passes the **raw HTTP `request`** to `loader`, `action`, and `middleware` instead of a normalized one. That cuts the overhead of creating multiple `new Request()` objects on the server, and lets you tell document requests from data requests via the `.data` suffix — useful for observability.

```ts
export default {
  future: {
    v8_passThroughRequests: true,
  },
} satisfies Config;
```

The catch: **`request.url`'s pathname may now carry a `.data` suffix**, so routing decisions should use the new normalized `url` argument.

```ts
// Before — comparison can fail when the pathname has a .data suffix
export async function loader({ request }: Route.LoaderArgs) {
  let url = new URL(request.url);
  if (url.pathname === '/path') {
    // ...
  }
}
```

```ts
// After — route on the normalized url, classify on the raw request
export async function loader({ request, url }: Route.LoaderArgs) {
  if (url.pathname === '/path') {
    // normalized path, no .data suffix
  }

  let isDataRequest = new URL(request.url).pathname.endsWith('.data');
}
```

#### `v8_trailingSlashAwareDataRequests` (Framework)

Preserves trailing-slash semantics in data request URLs so `/path` and `/path/` no longer collapse into the same data URL.

| Route                  | Data request URL                         |
| ---------------------- | ---------------------------------------- |
| No trailing slash      | `/path.data` (unchanged)                 |
| Trailing slash         | `/path/_.data` (**new format**)          |
| Root                   | `/_.data` (changed from `/_root.data`)   |

```ts
export default {
  future: {
    v8_trailingSlashAwareDataRequests: true,
  },
} satisfies Config;
```

This affects **CDN, cache, and rewrite rules outside the app** more than app code. If any config handles `/_root.data` or `*.data` patterns, update it for the new format.

### Step 3: Clean up APIs being removed

#### `data` → `loaderData` in `meta`/`matches` (Framework)

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

Code that reads parent route data from `matches`, and `useMatches()`, change the same way.

```ts
// Referencing a parent match inside meta
let rootMatch = matches.find((match) => match.id === 'root');
let rootData = rootMatch?.loaderData; // was: rootMatch?.data

// In a component
let matches = useMatches();
const rootLoaderData = matches[0].loaderData; // was: matches[0].data
```

#### Removing `react-router-dom` (all modes)

```bash
npm uninstall react-router-dom
```

```ts
// Before
import { Link, useLocation } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';

// After
import { Link, useLocation } from 'react-router';
import { RouterProvider } from 'react-router/dom'; // DOM-specific APIs
```

It's a mechanical import-path change, well suited to a single codebase-wide replace.

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

#### Domain detection in `@react-router/architect` (Framework)

In v8 the architect adapter uses `event.requestContext.domainName` by default instead of `X-Forwarded-Host`, falling back to the `Host` header. To try it on v7:

```ts
import { createRequestHandler } from '@react-router/architect';
import * as build from './build/server';

export const handler = createRequestHandler({
  build,
  useRequestContextDomainName: true,
});
```

Remove the option after moving to v8 (the option itself no longer exists).

### Step 4: Install v8

```bash
# Data / Declarative mode
npm install react-router@latest

# Framework mode
npm install react-router@latest @react-router/{dev,node,etc.}@latest
```

If you finished steps 1–3 on v7, there's almost nothing left to fix here. The announcement even suggests you could "throw [the upgrade guide] at your AI agent" — and with clear before/after pairs for each step, it really is a good shape for handing to an agent.

## Where Things Break Quietly

Comparing where the official docs say "no changes" versus "update needed," the risky spots are the ones **type-checking and the build won't catch.** The following is my own synthesis based on the guide.

| Spot                                       | Why it's quiet                                                               | How to check                                             |
| ------------------------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| Loaders comparing paths via `request.url`  | Passes on document requests, fails **only on data requests during client navigation** | Search for `new URL(request.url)` and switch to the `url` arg |
| CDN / cache / rewrite rules                | Lives outside the app repo, so code review never sees it                     | Search infra config for `_root.data` and `.data` patterns |
| Vite config branching on `isSsrBuild`      | If the config is ignored, the build may succeed with a different server entry | After moving to `environments.ssr`, verify the server bundle entry |
| Load context in custom servers             | Middleware on by default changes how context is passed                       | Review `getLoadContext` return values and `context` types |
| Node version pins                          | Easy to assume "any 22.x" (e.g. 22.12) is fine                                | Set `.nvmrc`, CI images, and `engines` to 22.22+         |

## A Peek at v9

The "Future Changes" doc that pairs with the v8 upgrade guide is already pointed at **v9 (expected mid-2027)**.

- **Minimum version**: `node@24+` — you can move to it while still on v8.
- **Future flags**: none yet
- **Planned breaking changes**: none yet

What it does have are three **unstable flags**, not recommended for production.

| Flag                                  | Mode        | What it does                                                                           |
| ------------------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `unstable_enableNodeReadableStream`   | Framework   | Uses Node 22+'s stable Web Streams so Node also uses `renderToReadableStream` instead of `renderToPipeableStream` |
| `unstable_optimizeDeps`               | Framework   | Feeds client entry and route module files to Vite's dependency optimizer for better dev optimization |
| `unstable_routePatternMatching`       | Data Router | Swaps in a new matcher powered by `@remix-run/route-pattern`                           |

The last one is the most interesting. The new matcher ranks by **positional specificity** (longer static prefixes win) rather than an aggregate segment score.

```ts
import { createBrowserRouter } from 'react-router';
import { unstable_preloadRoutePattern } from 'react-router/route-pattern';

unstable_preloadRoutePattern(); // must run before router creation, or creation throws

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
// New matcher: /products/one/two/three → 'products'
// (the static 'products' segment is more specific than dynamic ':first' in the same position)
```

Some caveats: standalone APIs like `matchRoutes`, `matchPath`, and `useMatch` **still use the legacy matcher**, and case-sensitive routes aren't supported with this flag yet. If your app has overlapping route patterns, it's worth tidying them up before this flag stabilizes.

## React Router Going Forward, and Remix

- **One major per year** — making major versions regular, predictable, and therefore boring.
- **End of life** — with v8, **React Router v6 and Remix v2 are EOL** and no longer receive security updates. v7 continues to get security updates. If you're still on v6, now is the time to move to v7.
- **Server Components / Server Actions** — work is in progress but still unstable while the APIs settle. It's an opt-in architecture, and the team plans to **stabilize it in a minor version.**
- **Open Governance** — development priorities continue to come from community Proposals.
- **Design goals** — Less is More · Routing and Data Focused · Simple Migration Paths · Lowest Common Mode

The relationship with Remix is clearer now too. Remix v0–v2 was effectively a **feature branch** of React Router, and its matured ideas and APIs were merged back into React Router. That frees Remix to go its own way as a **"truly full-stack, zero-dependency JavaScript web framework"** (the Remix 3 beta).

The team's answer to "which should I use?" is simple: **React Router if you need something battle-tested, Remix 3 if new approaches appeal to you.**

## Wrapping Up

In one sentence, v8 is **"a release that turns what you could already do on v7 into what you now must do."** The feature list shipped across v7 minors; v8 just raised the defaults and the floor (the minimum versions).

So the upgrade's difficulty depends on **how many flags you turned on in v7.** All of them, and it's one line; none of them, and you walk steps 2–3 of this post on top of v7. Either way, installing v8 should be the last step.

**Upgrade checklist:**

- ✅ Node 22.22+ · React/React DOM 19.2.7+ · (Framework) Vite 7+ — including `.nvmrc`, CI, and deploy images
- ✅ Update to the latest v7
- ✅ `v8_middleware` — `getLoadContext` for custom servers, `Future` type augmentation in Data mode
- ✅ `v8_splitRouteModules` — top-level `splitRouteModules` in v8
- ✅ `v8_viteEnvironmentApi` — move `isSsrBuild` branches to `environments.ssr`
- ✅ `v8_passThroughRequests` — replace `new URL(request.url)` path checks with the `url` arg
- ✅ `v8_trailingSlashAwareDataRequests` — CDN/cache/rewrite rules: `/_root.data` → `/_.data`
- ✅ `data` → `loaderData` in `meta`/`matches`/`useMatches()`
- ✅ Remove `react-router-dom`; import from `react-router` / `react-router/dom`
- ✅ Cloudflare dev proxy → `@cloudflare/vite-plugin`; clean up the architect option
- ✅ Finally, install `react-router@latest`
- ✅ (Optional) Evaluate Node 24 ahead of v9

---

# References

- Remix, [React Router v8](https://remix.run/blog/react-router-v8)
- React Router, [Updating from v7](https://reactrouter.com/upgrading/v7)
- React Router, [Future Changes](https://reactrouter.com/upgrading/future)
- React Router, [Brand Assets](https://reactrouter.com/brand) — source of the thumbnail logo
- Earlier posts — [React Router v6](/en/posts/2022-03-12-react-router-v6/) · [Vitest 5.0](/en/posts/2026-09-15-vitest5/)
