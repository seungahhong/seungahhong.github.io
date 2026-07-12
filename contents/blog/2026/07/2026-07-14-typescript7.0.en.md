---
layout: post
title: TypeScript 7.0
date: 2026-07-14
published: 2026-07-14
category: Development
tags: ['typescript']
comments: true
thumbnail: './assets/14/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# TypeScript 7.0 Release: A Native Compiler Rewritten in Go

TypeScript 7.0 has been officially released. The heart of this major version is a **complete native port of the compiler to Go**. By moving `tsc` — written in JavaScript for over a decade — to native code, it achieves **8–12x faster builds** and **up to 26% lower memory usage** on large projects, while keeping type-checking fully compatible with prior versions.

## 📋 Table of Contents

1. [Background: Why Rewrite in Go](#background-why-rewrite-in-go)
2. [Results: The Benchmarks](#results-the-benchmarks)
3. [Real-World Adoption](#real-world-adoption)
4. [Parallelization Flags](#parallelization-flags)
5. [Language & Behavior Changes](#language--behavior-changes)
6. [TypeScript 6.0 Transition & Config Changes](#typescript-60-transition--config-changes)
7. [Migration Guide](#migration-guide)
8. [Editor & Tooling](#editor--tooling)
9. [Future Roadmap](#future-roadmap)

## Background: Why Rewrite in Go

TypeScript has always been implemented in JavaScript. That choice paid off in portability and ecosystem integration, but on large codebases, type-checking and build times increasingly became a bottleneck. The team decided to natively port the compiler to Go, targeting an **order-of-magnitude performance increase** rather than a small incremental gain.

The port was done "as faithfully as possible" — preserving the structure and logic of the original compiler while gaining the advantages of a native language:

- **Native code speed** — a compiled Go binary runs faster than interpreted JavaScript.
- **Shared-memory multithreading** — type-checking and file processing can run in parallel, free of JavaScript's single-threaded event loop.
- **Cross-platform optimization** — Parcel's C++ file watcher was ported to idiomatic Go for better per-platform file watching.

Despite being a new codebase, results remain consistent and compatible between the Go and original implementations.

## Results: The Benchmarks

### Build Times

Measured against real open-source codebases:

| Project    | TS 6    | TS 7   | Speedup |
| ---------- | ------- | ------ | ------- |
| VSCode     | 125.7s  | 10.6s  | 11.9x   |
| Sentry     | 139.8s  | 15.7s  | 8.9x    |
| Bluesky    | 24.3s   | 2.8s   | 8.7x    |
| Playwright | 12.8s   | 1.47s  | 8.7x    |
| Tldraw     | 11.2s   | 1.46s  | 7.7x    |

Default builds are **8–12x** faster; with `--checkers 8`, some projects reach **up to 16.7x**.

### Memory Usage

Aggregate memory during builds generally decreased as well:

| Project    | TS 6  | TS 7  | Change |
| ---------- | ----- | ----- | ------ |
| VSCode     | 5.2GB | 4.2GB | -18%   |
| Sentry     | 4.9GB | 4.6GB | -6%    |
| Bluesky    | 1.8GB | 1.3GB | -26%   |
| Playwright | 1.0GB | 0.9GB | -11%   |
| Tldraw     | 0.6GB | 0.5GB | -15%   |

### Editor Responsiveness

Opening a file with errors in the VSCode codebase improved from roughly **17.5s to under 1.3s** — a 13x+ acceleration. Language server stability also improved, with an **80% reduction in failing commands** and a **60% reduction in crashes**.

## Real-World Adoption

TypeScript 7.0 was validated against tens of thousands of existing tests accumulated over 10+ years, automated regression checks against top GitHub projects, and production use at major companies.

- **Slack** — 40% reduction in merge queue time; CI type-checking dropped from 7.5 minutes to 1.25 minutes. Previously, local type-checking was described as "almost unusable" due to language server load.
- **Vanta** — up to 9x faster builds on major projects.
- **Microsoft News Services** — saved roughly 400 hours per month waiting on CI builds.
- **Canva** — language service error detection went from ~58s to ~4.8s.
- **PowerBI** — engineers called the editor experience "life-saving."

## Parallelization Flags

One of the biggest wins of the Go port is true multithreading, controlled by new flags.

### `--checkers` — Type-Checker Parallelization

```bash
# Default is 4 type-checking workers
tsc --checkers 8
```

- Default: 4 workers
- Configurable from 1 to N (higher values increase memory usage)
- Substantial speedups on multicore systems

### `--builders` — Project Reference Parallelization

```bash
# Parallelize project-reference builds in a monorepo
tsc --build --checkers 4 --builders 4
```

- Works with `--build` (project references)
- Multiplicative with `--checkers` — the example above allows up to 16 concurrent type-checkers.

### `--singleThreaded` — Single-Threaded Mode

```bash
tsc --singleThreaded
```

Disables all parallelization for debugging, comparing against TypeScript 6, or resource-constrained environments.

### Rebuilt Watch Mode

`--watch` mode was rebuilt on a Go port of Parcel's file watcher. It addresses the limits of cross-platform file watching in Go's standard library and the overhead of pure polling, significantly reducing resource consumption during development cycles.

## Language & Behavior Changes

### Unicode Code Point Preservation

Template literal types now preserve Unicode code points naturally:

```typescript
type HeadTail<S> = S extends `${infer Head}${infer Tail}` ? [Head, Tail] : never;
type Result = HeadTail<'😀abc'>;
// 7.0:      ["😀", "abc"]
// Previously: ["\ud83d", "\ude00abc"]
```

This aligns template literal inference with `for...of` iteration and spread syntax.

### JavaScript Support Reworked

`.js` analysis was streamlined for consistency with `.ts` handling. Key changes:

- Values can no longer stand in for types → use `typeof`
- `@enum` is no longer auto-recognized
- Standalone `?` is no longer a type → use `any`
- `@class` no longer creates a constructor
- Postfix `!` (non-null assertion) unsupported
- Type names require `@typedef` tags (adjacent placement removed)
- Closure-style function syntax and prototype reassignment special-handling removed

## TypeScript 6.0 Transition & Config Changes

### Side-by-Side Execution

TypeScript 7.0 does not ship a public API at launch; API support arrives in **7.1**. In the meantime, the `@typescript/typescript6` compatibility package lets both versions coexist for tools that depend on the programmatic API (typescript-eslint, Volar, etc.).

```json
{
  "devDependencies": {
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

> Nightly builds moved from `@typescript/native-preview` to the standard `typescript@next` tag.

### New Defaults (Inherited from 6.0)

TypeScript 7.0 adopts the new defaults introduced in TypeScript 6.0:

| Option                          | Default                       |
| ------------------------------- | ----------------------------- |
| `strict`                        | `true`                        |
| `module`                        | `esnext`                      |
| `target`                        | current stable ECMAScript     |
| `noUncheckedSideEffectImports`  | `true`                        |
| `stableTypeOrdering`            | `true` (immutable)            |
| `rootDir`                       | `./`                          |
| `types`                         | `[]` (must be explicit)       |

Projects using external `@types` packages must now declare them explicitly in `tsconfig.json`.

### Removed Features (Now Hard Errors)

- `target: es5` unsupported
- `downlevelIteration` removed
- `moduleResolution: node / node10` removed → use `nodenext` or `bundler`
- `moduleResolution: classic` removed
- `module: amd / umd / system / none` removed
- `baseUrl` unsupported → use `paths`
- `esModuleInterop` and `allowSyntheticDefaultImports` must be `true`
- Namespace `module` keyword prohibited
- Import `assert` replaced by the `with` keyword
- `skipDefaultLibCheck` no longer respects `/// <reference no-default-lib />`

## Migration Guide

### Step 1: Install

```bash
npm install -D typescript
npx tsc --version
```

### Step 2: Review tsconfig

Align your config with the new defaults. In particular, since `types: []` is now the default, declare the `@types` packages you relied on globally.

```jsonc
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler", // node/node10 removed
    "esModuleInterop": true,
    "types": ["node"] // now required
    // "baseUrl": "./",   // removed → use paths
    // "target": "es5",   // unsupported
  }
}
```

### Step 3: Prepare Side-by-Side (for Editors/Tooling)

Install 6.0 alongside for tools that depend on the programmatic API (Vue, Astro, Svelte, ...).

```json
{
  "devDependencies": {
    "typescript6": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

This enables a hybrid setup: CLI type-checking (`tsc`) on TypeScript 7, editor support on TypeScript 6.0.

### Step 4: Tune Parallelization

```bash
# Raise worker count on multicore CI
tsc --checkers 8

# Parallelize monorepo project-reference builds
tsc --build --checkers 4 --builders 4
```

## Editor & Tooling

### VS Code

A dedicated **TypeScript 7 extension** is available in the Visual Studio Marketplace. It becomes the default on install and can be toggled via the command palette ("Disable/Enable TypeScript 7 Language Server").

### Visual Studio

Recent versions automatically enable TypeScript 7 for workspaces based on configuration, with no manual step.

### LSP-Based Language Server

The new language server is built on **LSP (Language Server Protocol)**, enabling multi-threaded request handling across editors. Features include auto-imports, expandable hovers, inlay hints, code lenses, go-to-source-definition, JSX linked editing and tag completions, semantic highlighting, sort imports, and remove-unused-imports.

### Embedded Language Limitations

Vue, MDX, Astro, Svelte, and Angular templates can't yet leverage TypeScript 7 because it lacks a stable programmatic API; tools like Volar still depend on TypeScript 6.0. The recommended setup is **TS 7 for the CLI, TS 6.0 for the editor**. This limitation will be resolved by the 7.1 API support.

## Future Roadmap

With 7.0 out, the team returns to feature work:

- **TypeScript 7.1** — a programmatic API for the ecosystem
- Regular releases every 3–4 months
- Continued performance optimization and ergonomic improvements

## Wrap-Up

TypeScript 7.0 isn't just a feature bump — it's a **foundational shift of the compiler's execution engine from JavaScript to Go**. It delivers 8–12x faster builds and lower memory usage while keeping type-checking compatible.

**Key checklist:**

- ✅ Install with `npm install -D typescript`, verify via `npx tsc --version`
- ✅ Declare `@types` explicitly to match the new `types: []` default
- ✅ Clean up removed options (`es5`, `baseUrl`, `node/node10`, `classic`, ...)
- ✅ Install `@typescript/typescript6` side-by-side for editors and embedded-language tooling
- ✅ Tune `--checkers` / `--builders` for parallelization on multicore machines

For full details, see the [official announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).
