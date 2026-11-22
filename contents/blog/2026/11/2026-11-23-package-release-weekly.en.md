---
layout: post
title: Weekly Package Releases — 2026-11-23
date: 2026-11-23
published: 2026-11-23
category: Weekly Releases
tags: []
comments: true
thumbnail: './assets/23/thumbnail.en.png'
github: ''
---

## ✍️ TL;DR

Gradle, Valkey, pnpm and Argo CD all shipped security fixes in the same week (four High-rated issues in Gradle, CVE-2026-130822 across every Valkey maintenance line), and pnpm 12.23.0 carries a breaking change (a change that requires you to modify existing code) by removing platform variants.

## This Week at a Glance

The period is 2026-11-16 to 2026-11-23 (KST). Versions already covered in the previous post (2026-11-16) are not repeated. We confirmed new changes in 30 of the 87 tracked packages.

GitHub release pages were again unreadable this week, so for packages with a CHANGELOG or in-repo release notes we read that file. Zed, Electron, Oxfmt, Nx, Homebrew, Hono, Rspack, Turborepo, Vitest, Argo CD, ollama, React Native Skia, Spring AI and Spring Modulith have no readable release notes, so we summarized them from the commit history (commit titles) up to the new tags. These packages are marked `None` under `Release notice`, and because only the commit history was read, we could not confirm whether they contain breaking changes. Nuxt UI 4.13.0 and Bazel 8.9.0 were read the same way.

| Package | Version | Release notice | Changes |
|---|---|---|---|
| astro | 7.4.13 | [Yes](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) | Fixes for server bundle size, i18n fallback and font preload |
| ClickHouse | v26.8.44.3-lts (7 patches) · v26.3.69.4-lts (5 patches) | [Yes](https://github.com/ClickHouse/ClickHouse/tree/master/docs/changelogs) | LTS backports: grant filter bypass, crashes and a `DROP TABLE` hang fixed |
| Zed | v1.29.3 (3 patches) | None | Linux Snap package added, prompt caching fix |
| pnpm | 12.23.0 · 12.22.0 · 11.29.0 · 11.28.13 | [Yes](https://github.com/pnpm/pnpm/blob/v12.23.0/.changeset/changelogs/pacquet%4012.23.0.md) | Many security fixes, platform variants removed, `pnpm edit` and `catalog migrate` added |
| 🔺 Major Electron | 45.4.1 · 45.3.4 · 44.11.5 (2 patches) · 43.8.12 (2 patches) | None | Large batch of Chromium-family fixes, proxy and webRequest bug fixes |
| Oxfmt | 0.79.0 | None | Formatting fix for parenthesized TypeScript instantiation expressions |
| Oxlint | 1.94.0 | [Yes](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/CHANGELOG.md) | `flagUnions` option for `no-misused-promises`, experimental label dropped from `typeCheck` |
| Nuxt UI | 4.13.0 · 4.12.2 (2 patches) | [Yes](https://github.com/nuxt/ui/blob/v4/CHANGELOG.md) | `Toggle`, `ToggleGroup` and `ChatAttachment` components, `useToast().promise` |
| Nx | 23.3.3 | None | pnpm-workspace.yaml overrides now feed the affected calculation |
| FastAPI | 0.165.0 · 0.164.0 · 0.163.2 | [Yes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md) | Configurable request body size and form parsing limits |
| Homebrew | 7.0.15 (2 patches) | None | Install plans show bottle sizes and source builds, faster `brew uses` |
| Angular | 22.3.0 · 22.2.7 | [Yes](https://github.com/angular/angular/blob/main/CHANGELOG.md) | `HttpClient.query()`, route error boundaries, View Transitions stable |
| Hono | 4.13.20 (2 patches) | None | JWT `typ` verification option, cookie, compression and JSX fixes |
| React Router | 8.5.2 · 7.18.6 | [Yes](https://github.com/remix-run/react-router/blob/main/packages/react-router/CHANGELOG.md) | Streamed `<Suspense>` hydration, `HEAD` response leak and `redirect()` fixes |
| Rspack | 2.3.3 | None | Cache invalidation and tree-shaking fixes, HMR and stats performance |
| Turborepo | 2.11.13 (2 patches) | None | Experimental `turbo trace`, pnpm v13 lockfile support |
| Vitest | 5.1.1 | None | Many fixes around worker pools, coverage and retries |
| Argo CD | v3.6.2 · v3.5.8 · v3.4.14 | None | CVE-2026-77299 (regexp2 dependency) addressed, AppProject deny rule fix |
| 🔺 Major Bazel | 9.3.3 · 8.9.0 · 7.7.3 | [Yes](https://github.com/bazelbuild/bazel/blob/9.3.3/CHANGELOG.md) | Embedded JDK updates; 8.9.0 improves remote caching and adds `repository_ctx.patch(directory)` |
| Flutter | 3.50.1 | [Yes](https://github.com/flutter/flutter/blob/3.50.1/CHANGELOG.md) | Hotfixes for 3.50.0 Android build, missing asset and web issues |
| Gradle | 9.9.2 · 8.14.8 | [Yes](https://github.com/gradle/gradle/blob/v9.9.2/platforms/documentation/docs/src/docs/release/notes.md) | Four High-rated security vulnerabilities fixed |
| ollama | v0.40.17 | None | MLX runner concurrent generation, memory-based default parallelism |
| Optique | 1.4.0 · 1.3.7 · 1.2.14 · 1.1.14 · 1.0.16 | [Yes](https://github.com/dahlia/optique/blob/main/CHANGES.md) | Attached values such as `-n5`, aliases and environment variables in help |
| React Native Skia | v3.11.0 | None | Minimum macOS raised to 14.0, Android binaries downloaded differently |
| Rolldown | 1.3.3 | [Yes](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md) | Plugin timings table, chunk ordering and inline-const fixes |
| Spring AI | v2.1.0 · v2.0.3 | None | Hardened vector store filter escaping, modern MCP client connections |
| Spring Modulith | 2.2.0 · 2.1.3 · 2.0.10 | None | Event publication completion default changed (2.2.0), Spring Boot 4.2.0 |
| Storybook | 10.6.8 | [Yes](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md) | Faster story preloading |
| Upyo | 0.6.1 · 0.5.7 | [Yes](https://github.com/dahlia/upyo/blob/main/CHANGES.md) | Display names with commas no longer read as multiple recipients |
| Valkey | 9.2.0 · 9.1.4 · 9.0.8 · 8.1.12 · 8.0.13 · 7.2.16 | [Yes](https://github.com/valkey-io/valkey/blob/9.2.0/00-RELEASENOTES) | First stable 9.2 release, CVE-2026-130822 fixed on all lines |

## Changes by Package

### astro 7.4.13

A JavaScript web framework.

**What changed** — Server bundles no longer include every content collection entry when no server-rendered route calls `render()`. Also fixed: `i18n.fallback` failing with `i18nNoLocaleFoundInPath`, `<Font preload>` emitting no preload links when a requested weight range (`"400 700"`) sits inside a variable font, and hydration of framework components that receive sparse arrays (arrays with holes) as props. Projects that don't configure `fonts` get faster startup for every `astro` command.

**What to check when upgrading** — This release is safe to upgrade to as is.

Release notice: [CHANGELOG](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

### ClickHouse v26.8.44.3-lts · v26.3.69.4-lts

A columnar database.

**What changed** — Both LTS (long-term support) lines received backport patches almost daily. On the 26.8 line (v26.8.42.13), a path-filtered grant such as `GRANT WRITE ON S3('https://bucket/allowed/.*')` could authorize locations outside the filter through paths containing `.` or `..`; that is fixed, along with projections returning rows removed by a lightweight `DELETE` after `ALTER UPDATE` and similar operations rebuilt them, and a server crash when joining onto a `COMPLEX_KEY_DIRECT` dictionary with a constant key. On the 26.3 line (v26.3.69.4), a `DROP TABLE` that hung until server restart after a query using a materialized CTE failed is fixed, as is a double-free crash when an allocation failed because of the memory limit. This summary is based on reading the change records of 3 of the 12 patches.

**What to check when upgrading** — If you use path-filtered grants on S3 or URL sources, we recommend moving to the latest 26.8 patch. The rest are bug fixes, so you can upgrade within the same LTS line as is.

Release notice: [docs/changelogs](https://github.com/ClickHouse/ClickHouse/tree/master/docs/changelogs)

### Zed v1.29.3

A code editor.

**What changed** — These are patch releases on the 1.29 stable channel. An official Snap package for Linux was added, and two issues were fixed: prompt caching not being preserved with the OpenAI Responses API, and mid-conversation system prompt updates not being applied. The text finder not clearing when a search has no results and a crash after moving a project with a split diff to a new window are also fixed. The new features of 1.29.0 itself could not be summarized from the commit history, so they are not included here.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes. One commit updates the terms shown by the installer, so check it if your organization's policy requires reviewing terms.

Release notice: None

### pnpm 12.23.0 · 12.22.0 · 11.29.0 · 11.28.13

A package manager for Node.js.

**What changed** — All four versions carry security fixes. `otp` (the one-time code for two-factor authentication) is no longer read from any config file. A repository could write `otp: ${NPM_TOKEN}` beside its own `registry:`, and `pnpm publish` would send that environment variable to that registry, leaking a secret. Registry packages that declare local filesystem dependencies such as `file:` or `link:` are now rejected with `ERR_PNPM_LOCAL_SUBDEP_NOT_ALLOWED`, registry credentials are sent only over HTTPS or loopback HTTP, and `pnpm dlx`, `pnpm create` and global commands (`-g`) no longer read `.pnpmfile.cjs` or `.npmrc` settings from the current directory. 12.22.0 and 11.28.13 fix `pnpm install` possibly skipping the `minimumReleaseAge` and `trustPolicy` checks after a registry change.

As new features, 12.23.0 adds `pnpm edit` to open an installed package in an editor, `pnpm catalog migrate` to move dependency specifiers into the catalog, `pnpm link --hard`, `pnpm update --tag` and `pnpm publish --new-version`. 12.22.0 adds a `globalPackagesConfig` section that applies only to global packages and `pnpm why --ranges`, and 11.29.0 can recreate an incompatible `node_modules` without a TTY (for example in a Docker build).

**What to check when upgrading** — 12.23.0 removes platform variants. `publishConfig.variants`, `pnpm pack --variant` and the variant options of `pnpm publish` are gone, so publish each platform build as its own package and list them in `optionalDependencies`. A frozen install of a lockfile that records variants fails with `ERR_PNPM_BROKEN_LOCKFILE`, so resolve it again with `pnpm install`. Also, `pnpm pack` and `pnpm publish` now fail if a non-private package lists a private workspace package in `dependencies`. CI that keeps `otp` in a config file should switch to `--otp` or `PNPM_CONFIG_OTP`.

Release notice: [12.23.0](https://github.com/pnpm/pnpm/blob/v12.23.0/.changeset/changelogs/pacquet%4012.23.0.md) · [12.22.0](https://github.com/pnpm/pnpm/blob/v12.22.0/.changeset/changelogs/pacquet%4012.22.0.md) · [11.29.0](https://github.com/pnpm/pnpm/blob/v11.29.0/.changeset/changelogs/pnpm%4011.29.0.md) · [11.28.13](https://github.com/pnpm/pnpm/blob/v11.28.13/.changeset/changelogs/pnpm%4011.28.13.md)

### 🔺 Electron 45.4.1 · 45.3.4 · 44.11.5 · 43.8.12

A desktop app platform. The 45 line, a major version above the baseline (v44), keeps being updated.

**What changed** — All three lines picked up close to 80–100 fixes at once from Chromium, V8, ANGLE, ffmpeg and others. The commit titles give only the counts, so we could not confirm what each fix does, whether they are security related, or any CVE numbers. On the 45 and 44 lines, the `ses.setProxy()` config now survives a network service restart, webRequest header removals apply on redirects, and the tray tooltip is restored when Explorer restarts on Windows. The 45 line adds `dynamicId` to `Extension` and makes `webContents.centerSelection()` work on Windows and Linux.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes. Given the large batch of Chromium-family fixes, we recommend moving to the latest patch of the line you use.

Release notice: None

### Oxfmt 0.79.0

A JS/TS formatter.

**What changed** — An issue when formatting a parenthesized `TSInstantiationExpression` (a TypeScript expression with only generic arguments attached, like `fn<string>`) was fixed.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes.

Release notice: None

### Oxlint 1.94.0

A JS/TS linter.

**What changed** — The `typescript/no-misused-promises` rule gained a `flagUnions` option. The experimental label was removed from `typeCheck` (linting that uses type information) in the documentation.

**What to check when upgrading** — This release is safe to upgrade to as is.

Release notice: [CHANGELOG](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/CHANGELOG.md)

### Nuxt UI 4.13.0 · 4.12.2

A UI library for Nuxt and Vue.

**What changed** — 4.13.0 brings new `Toggle`, `ToggleGroup` and `ChatAttachment` components. `useToast` gains a `promise` method, `ChatPrompt` gains `v-model:queue`, the module adds an `@nuxt/ui/eslint` config, and a Serbian locale was added. It also includes performance work, such as sharing theme computation results between components and no longer recompiling templates on every file change, plus accessibility and focus fixes in `Table`, `Calendar` and `SelectMenu`. 4.12.1 and 4.12.2 are patches that fix handling of components compiled from a template string and `ContentSearch` escaping result text twice.

**What to check when upgrading** — Releases after 4.12.2 are no longer listed in the CHANGELOG, so 4.13.0 was summarized from the commit history (commit titles) and we could not confirm whether it has breaking changes. The `compare` utility now matches `null` only with `null`, so check any select components where you mix `null` and `undefined`.

Release notice: [CHANGELOG](https://github.com/nuxt/ui/blob/v4/CHANGELOG.md)

### Nx 23.3.3

A monorepo build system.

**What changed** — The affected calculation (which projects a change impacts) now reads overrides from `pnpm-workspace.yaml`, and the Angular plugin loads the architect node host through its exported subpath.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes.

Release notice: None

### FastAPI 0.165.0 · 0.164.0 · 0.163.2

A Python web framework.

**What changed** — 0.164.0 adds configurable request body size limits and 0.165.0 adds configurable form parsing limits. This lets you stop oversized requests or forms from consuming server resources at the framework level. 0.163.2 refactors query, header and form parameter extraction.

**What to check when upgrading** — The release notes do not state the default values of the limits. If you have endpoints that accept large file uploads or forms with many fields, verify their behavior after upgrading.

Release notice: [release-notes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md)

### Homebrew 7.0.15

A package manager for macOS and Linux.

**What changed** — `brew install` now shows bottle (prebuilt binary) sizes and source builds in its install plan. `brew uses` is faster because it loads fewer formulae, and packages installed under an alias or old name can now be pinned. Sigstore bundle verification works without vendored gems, and `brew fetch --all-platforms` failing with platform-specific casks was fixed.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes.

Release notice: None

### Angular 22.3.0 · 22.2.7

A JavaScript framework.

**What changed** — 22.3.0 adds `HttpClient.query()` for HTTP QUERY requests. The router gains route error boundaries and redirect handling, route resources become reactive and load dependent resources in parallel, `RouterLink` gets a `scroll` input and navigation options get `focusReset`. View Transitions are now stable. In core, `@defer` viewport options gain `scrollMargin` and template expressions support increment/decrement operators (`++`, `--`). The compiler now diagnoses numeric CSS properties that require units and unknown property bindings on `ng-template`. 22.2.7 is a patch that throws NG0502 and NG0512 instead of a TypeError when a hydration comment or text node is missing.

**What to check when upgrading** — 22.3.0 contains close to 180 compiler-cli fixes and more diagnostics. After upgrading, check whether your build reports new warnings or errors (especially for CSS units and non-iterable values passed to `@for`).

Release notice: [CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md)

### Hono 4.13.20

A web framework for edge environments.

**What changed** — 4.13.19 adds an option to the JWT middleware to verify the token header's `typ`, and an `overwrite` option to secure-headers. 4.13.20 fixes a lone double quote being accepted as a cookie value, compressed response headers not being sent for `HEAD` requests, a JSX issue where values of async Providers were not isolated from each other, and optional properties not staying optional in the `JSONParsed` type. The AWS Lambda adapters now keep a leading UTF-8 BOM in a text body.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes.

Release notice: None

### React Router 8.5.2 · 7.18.6

A routing library for React.

**What changed** — 8.5.2 fixes streamed `<Suspense>` boundaries being discarded during hydration in development and re-rendered on the client. It cancels the discarded response body for `HEAD` requests, so a resource route streaming a file no longer leaks its file descriptor. `redirect()` and `replace()` no longer set `status: 302` on the `ResponseInit` passed to them. Also fixed: submissions to root form actions with search parameters when a `basename` is configured, `<ScrollRestoration>` throwing when `sessionStorage` is unavailable, and a stale `useBlocker` left behind after its component is hidden and shown again with `<Activity>`. 7.18.6 brings the same kind of hydration and `HEAD` handling fixes to the 7 line.

**What to check when upgrading** — `href()` now throws when a required parameter is `null` (matching the behavior for `undefined`). Check any code that reuses an init object after passing it to `redirect()` and relied on it carrying 302.

Release notice: [CHANGELOG](https://github.com/remix-run/react-router/blob/main/packages/react-router/CHANGELOG.md)

### Rspack 2.3.3

A web bundler.

**What changed** — There are many cache fixes. The cache is invalidated when configured build dependencies change, loader configuration and versions are included in cache keys, and module-not-found resolution results are cached. Tree shaking of CommonJS default re-exports, shorthand property keys being dropped when identifiers are replaced, and embedded CSS source maps not respecting `devtool` were fixed, and HMR chunk resolution and stats output got faster.

**What to check when upgrading** — Only the commit history was read, so we could not fully confirm whether there are breaking changes. One commit is marked `fix!`, however: it aligns the lockfile format of HTTP modules (modules imported by URL) with webpack, so if you use that feature, check whether your lockfile is regenerated.

Release notice: None

### Turborepo 2.11.13

A build system for JS/TS.

**What changed** — An experimental `turbo trace` command was added, and pnpm v13 lockfiles are supported. `turbo setup` runs dependency installs in parallel and gains a `--verbose` option. Fixed: every watch task rerunning after a file watcher rescan, task output keeping color under `--no-color` and `NO_COLOR`, and, in affected detection, the scope of lockfile changes and the order in which `globalDependencies` are checked.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes.

Release notice: None

### Vitest 5.1.1

A unit test framework built on Vite.

**What changed** — Timeouts now throw dedicated error classes instead of a plain `Error`, and each test attempt gets a new `signal`. The worker pool no longer reuses workers that failed to start under `isolate: false` and terminates stuck forks workers. Handling of `--bail` and `--shard`, crashed test files not being reported as failed by the JSON reporter, and v8 coverage for sub-processes were fixed, and browser mode runs faster by reusing cached modules.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes. If you have code that identifies timeout errors by their message string, verify it still works.

Release notice: None

### Argo CD v3.6.2 · v3.5.8 · v3.4.14

A Kubernetes deployment tool.

**What changed** — All three lines upgrade the `dlclark/regexp2` dependency to v2.13.0 in response to CVE-2026-77299. The commit titles give only the number, so we could not confirm what the risk was. AppProject destination deny rules (`!name`, `!server`) now reliably veto when they match, and memory use from retaining a decoded OpenAPI document per cluster was reduced. 3.6.2 and 3.5.8 patch only the refresh annotation when refreshing an ApplicationSet instead of rewriting the whole object.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes. If you use deny rules in AppProjects, check after upgrading that the intended destinations are still allowed and denied.

Release notice: None

### 🔺 Bazel 9.3.3 · 8.9.0 · 7.7.3

A build tool. This includes the 9 line, a major version above the baseline (v8.7.0).

**What changed** — 9.3.3 updates the embedded JDK to 25.0.5.1 and 7.7.3 to 21.0.13.1. The release notes for 8.9.0 in the CHANGELOG are empty, so it was read from the commit history. It adds `repository_ctx.patch(directory)`, lets you select RepMaxCDC as the remote cache chunking function, and infers the version of registry modules when omitted in `module()`. Missing disk-cache entries are treated as cache misses, and an action output handle leak on build cancellation and the end of test output being dropped on Windows were fixed.

**What to check when upgrading** — 9.3.3 and 7.7.3 are safe to upgrade to as is. For 8.9.0 only the commit history was read, so we could not confirm whether there are breaking changes.

Release notice: [CHANGELOG](https://github.com/bazelbuild/bazel/blob/9.3.3/CHANGELOG.md)

### Flutter 3.50.1

A native app framework.

**What changed** — This is a hotfix for issues in 3.50.0. Fixed: Gradle configuration failing for Android apps that combine plugins with custom `buildType` settings, assets whose names start with a dot (such as `.env`) or underscore folders being silently left out of the APK or AAB and causing runtime failures, and every split APK getting the same `versionCode` in `--split-per-abi` builds. On the web, the app freezing when rendering dynamic text with `--wasm` and cross-origin isolation, and `build/web/index.html` being deleted when a normal build follows a `--web-content-hash` build, were fixed.

**What to check when upgrading** — If you built an Android release with 3.50.0, assets like `.env` may be missing, so rebuild with 3.50.1.

Release notice: [CHANGELOG](https://github.com/flutter/flutter/blob/3.50.1/CHANGELOG.md)

### Gradle 9.9.2 · 8.14.8

A Java build tool.

**What changed** — Both versions fix four security vulnerabilities: SFTP repositories not verifying host keys (8.9 High), transitive snapshot dependencies skipping dependency verification (8.8 High), TestKit using a predictable directory in the system temporary directory (7.0 High), and the daemon registry being briefly readable by other local users when it is created (7.0 High). The release notes link only to GitHub security advisories and give no CVE numbers. 9.9.2 also fixes a regression since 9.8.0 that slowed the missing-dependency check for included builds, and a 9.9.0 issue where plugin resolution failed when the repository answered the plugin marker jar request with 401 (GitLab group-level registry).

**What to check when upgrading** — Builds that use SFTP repositories or apply dependency verification to snapshot dependencies should upgrade soon. Host key verification is now enforced, so make sure the host keys of your SFTP repositories are registered.

Release notice: [9.9.2 notes](https://github.com/gradle/gradle/blob/v9.9.2/platforms/documentation/docs/src/docs/release/notes.md) · [8.14.8 notes](https://github.com/gradle/gradle/blob/v8.14.8/platforms/documentation/docs/src/docs/release/notes.md)

### ollama v0.40.17

A tool for running open models locally.

**What changed** — The MLX runner (the runner for Apple silicon) supports concurrent generation, chooses its default parallelism from available memory, and adapts saved history to memory pressure. Weights are kept out of pinned host memory on Windows integrated GPUs, and the API preserves tool schema keywords it does not model. The install script supports a preview channel.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes.

Release notice: None

### Optique 1.4.0 · 1.3.7 · 1.2.14 · 1.1.14 · 1.0.16

A type-safe CLI parser for TypeScript.

**What changed** — 1.4.0 supports attached values for short options, so `-n5` and `-xn5` work like `-n 5` and `-x -n 5`, and shell completion follows. `showAliases: true` shows command aliases in help, and `showEnvironment` lists the environment variables bound to options. Also added: a `key` option for `choice()`, `normalizeInput()` for value parsers, `errorUsage: "command"` to show the matched command's usage above parse errors, and `collectDocPages()` to collect command documentation without evaluating runtime callbacks. 1.3.7 and the patches on older lines fix backslash handling in fish completion scripts, hidden commands disappearing from their own help, and `map()` losing `bindEnv()` and `bindConfig()` fallbacks.

**What to check when upgrading** — The change log notes that tests that snapshot raw documentation objects or assert their exact keys may need updating because of new fields. If you declared a single-dash option such as `-name`, it takes precedence over splitting into attached values.

Release notice: [CHANGES](https://github.com/dahlia/optique/blob/main/CHANGES.md)

### React Native Skia v3.11.0

A 2D graphics library for React Native.

**What changed** — The minimum supported macOS version was raised to 14.0, and rendering now presents at full refresh rate on ProMotion devices running macOS 14 or later. Android binaries are now downloaded from GitHub releases, and drawing an atlas under a perspective matrix with `drawAtlas` was fixed.

**What to check when upgrading** — Only the commit history was read, so we could not fully confirm whether there are breaking changes. Apps that must support macOS 13 or earlier should check before upgrading. Android builds need to fetch binaries from GitHub, so the install step may fail in CI without external access.

Release notice: None

### Rolldown 1.3.3

A JS/TS bundler.

**What changed** — Plugin timings are shown as a table, `rolldown_plugin_chunk_import_map` gains an `include` option, and common chunks that `import()` also loads can be inlined. There are more than 30 bug fixes, including entry chunks and external imports now following source order, a `var` read early through an import cycle or inside a function being wrongly inlined, and a CommonJS entry's `module.exports` disappearing from CJS output. Errors thrown in the `onLog` hook now fail the build.

**What to check when upgrading** — An unknown `output.esModule` string and calling `this.load()` in `buildStart` are now rejected. If a plugin was throwing errors in `onLog`, the build will now fail.

Release notice: [CHANGELOG](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md)

### Spring AI v2.1.0 · v2.0.3

An AI application framework for Spring.

**What changed** — Both versions include several input-hardening commits: escaping of filter expression values in the Redis, Typesense and Coherence vector stores, an expression depth limit in the filter parser, stronger SSRF (an attack that makes the server send requests to unintended addresses) protection for Bedrock Converse media URLs, and isolation of semantic cache entries by scope. We could not confirm any CVE numbers. 2.1.0 adds modern MCP client connections and an async client type, `FinishReasonCategory` for provider-agnostic finish reason normalization, a SQL Server dialect for `JdbcSessionRepository`, opt-in bulk upserts for the MongoDB Atlas vector store, and `ConnectionDetails` for OpenAI.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes. If user input reaches vector store filter expressions in your service, we recommend upgrading to 2.0.3 or later. 2.0.3 is based on Spring Boot 4.1.3.

Release notice: None

### Spring Modulith 2.2.0 · 2.1.3 · 2.0.10

A toolkit for modular Spring Boot applications.

**What changed** — 2.2.0 targets Spring Boot 4.2.0 and switches to in-transaction event publication completion by default. Common to all three versions: `WeekHasPassed.getStartDate()` respects the locale-specific first day of the week, automatic scheduling activation is disabled when TimeMachine is active, and relationships in PlantUML diagrams are written in a deterministic order. 2.1.3 is based on Spring Boot 4.1.3 and 2.0.10 on 4.0.10.

**What to check when upgrading** — Only the commit history was read, so we could not confirm whether there are breaking changes. When moving to 2.2.0, check the changed default for event publication completion together with the transactional behavior of your event listeners.

Release notice: None

### Storybook 10.6.8

A UI component development tool.

**What changed** — Story preloading in the manager is faster, and the Vite builder writes the full bundler graph to `preview-stats.json`.

**What to check when upgrading** — This release is safe to upgrade to as is.

Release notice: [CHANGELOG](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md)

### Upyo 0.6.1 · 0.5.7

An email library for Node.js, Deno and Bun.

**What changed** — Display names containing commas or periods, such as `Doe, John`, were written unquoted in address headers and read as multiple recipients; this is fixed. `formatAddress()` now quotes such names and escapes quotes and backslashes, and `parseAddress()` no longer mistakes an angle bracket inside a quoted name for the address delimiter.

**What to check when upgrading** — This release is safe to upgrade to as is. We recommend it for services where recipient names may contain commas (for example "last name, first name" formats).

Release notice: [CHANGES](https://github.com/dahlia/upyo/blob/main/CHANGES.md)

### Valkey 9.2.0 · 9.1.4 · 9.0.8 · 8.1.12 · 8.0.13 · 7.2.16

A key/value store.

**What changed** — All five maintenance lines from 9.1.4 down to 7.2.16 fix CVE-2026-130822, a use-after-free crash in client eviction when `maxmemory-clients` is enabled. Crashes with key names of 2 GiB or more and server panics related to Lua scripts were fixed alongside it.

9.2.0 is the first stable release of 9.2. It adds `DELEX` to delete a key only when its value matches, `INCREX` to increment and set expiration atomically, and `XACKDEL` and `XDELEX` for streams. It also brings named, reusable ACL roles (`ACL SETROLE`), Path Hash, a new radix-tree-backed data type (`PH*` commands), server-side hot key detection (`HOTKEYS`), forkless RDB snapshots and full synchronization, Zstd and LZ4 stream compression for RDB, and a secondary TLS certificate setting.

**What to check when upgrading** — If you use `maxmemory-clients`, move to the security patch of your line right away. 9.2.0 has behavior changes: `ZRANGEBYSCORE`, `ZCOUNT` and related commands now reject a bare `(` or an empty string as a score bound instead of treating it as 0, active expiration of keys and hash fields increments the dirty counter so `BGSAVE` may trigger more often, and `OBJECT ENCODING` reports `btree` instead of `skiplist` for large sorted sets.

Release notice: [9.2.0 RELEASENOTES](https://github.com/valkey-io/valkey/blob/9.2.0/00-RELEASENOTES) · [9.1.4](https://github.com/valkey-io/valkey/blob/9.1.4/00-RELEASENOTES) · [8.1.12](https://github.com/valkey-io/valkey/blob/8.1.12/00-RELEASENOTES)

## Wrapping Up

The 4 releases left out because we could not read their changes (skipped) are Visual Studio Code 1.147.0, vLLM 0.34.0, KubeVirt v1.10.0 and Spring Vault 4.1.2 · 4.0.5. The first three have no readable release notes inside the repository and hundreds to over a thousand commits, so they could not be summarized; for Spring Vault the commit history is mostly dependency upgrades, so we could not tell what changed.

The 11 failed checks are official-site sources that could not be read because their hosts are blocked by the session network: Expo SDK, GraalVM, JDK, Android, Boundary, Cursor, GitButler, Manus, Swift, Ubuntu and Xcode.

Method: based on npm/PyPI/git tags (GitHub release bodies not accessed)
