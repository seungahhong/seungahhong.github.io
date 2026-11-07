---
layout: post
title: Weekly Package Releases — 2026-11-07
date: 2026-11-07
published: 2026-11-07
category: Development
tags: ['release', 'packages', 'weekly']
comments: true
thumbnail: './assets/07/thumbnail.en.png'
github: ''
---

## ✍️ One-line summary

Next.js (16.4.5 and 15.5.29) shipped security-minded fixes such as stripping internal cookie headers from edge responses. Nuxt 4.6.4 added dev-server Host header validation and narrowed when `x-forwarded-proto` is trusted, and Hono 4.13.16 tightened JWT signature checks and fixed router and `mount` path handling. Rolldown 1.3.0 carries a breaking change (a change that requires fixing existing code): the CLI now rejects `--input` combined with positional entries. Omarchy reached 4.5.0 (🔺 major line).

## This week at a glance

The period is 2026-10-31 to 2026-11-07 (KST). Of the 87 tracked packages, 28 had changes we could verify. Packages left out because their changes could not be read are listed in the closing section.

GitHub release pages were not readable this week. For packages with a CHANGELOG file we read that file; for the rest we read the change history (commit titles) up to the new tag. For those, the release-notice column says `None`.

| Package | Version | Release notice | Changes |
|---|---|---|---|
| astro | 7.4.7 (3 patches) | [Yes](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) | Image endpoint path check, `astro check`, i18n fallback fixes |
| pnpm | v12.18.0 · v11.28.11 (1 patch) | None | Publish/install packages with per-platform variants, peer path fixes |
| Electron | v45.2.3 (3 patches) · v44.10.2 (2 patches) · v43.8.7 (3 patches) | None | Chromium updates, `removeInsertedCSS()` fix |
| Oxfmt | v0.76.0 · v0.77.0 | None | Broader Vue template formatting (`parser:vue` handling changed) |
| Oxlint | v1.91.0 · v1.92.0 | [Yes](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/CHANGELOG.md) | New rule options |
| Next.js | v16.4.5 · v16.4.4 · v15.5.29 | None | Internal cookie header stripping, `'use cache'` fixes |
| Nx | 24.0.5 (3 patches) | None | Many hardening, cache and daemon fixes |
| Homebrew | 7.0.12 | None | `info` and attestation lookup improvements |
| 🔺 Major Omarchy | v4.5.0 | None | Clipboard/emoji panels, Notion install entry |
| Vite | v8.3.6 | [Yes](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md) | Bundled dev mode and CSS dependency collection fixes |
| Angular | 22.2.5 · 21.2.26 · 20.3.35 | [Yes](https://github.com/angular/angular/blob/main/CHANGELOG.md) | `rxResource` `debugName`, forms and router fixes |
| Hono | v4.13.16 (2 patches) | None | Stricter JWT signature check, router and `mount` path fixes |
| Istio | 1.31.4 · 1.30.8 | None | istiod crash and authorization policy matching fixes |
| Nuxt | v4.6.4 | None | Dev-server Host validation, route rule fixes |
| Rspack | v2.3.1 | None | HMR, CSS and source map fixes |
| Visual Studio Code | 1.145.0 · 1.145.1 · 1.145.2 | None | Agent host and chat fixes |
| Vitest | v5.1.0 | None | Interactive failed-snapshot review, `vi.waitFor` option |
| Argo CD | v3.6.0 · v3.6.1 · v3.5.7 · v3.4.13 · v3.3.19 | None | 3.6 line UI and controller fixes |
| Bazel | 9.3.2 | [Yes](https://github.com/bazelbuild/bazel/blob/9.3.2/CHANGELOG.md) | linux-sandbox premature-kill fix |
| Biome | v2.6.5 · v2.6.6 | [Yes](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md) | Many new nursery rules |
| Gradle | 9.9.0 | [Yes](https://github.com/gradle/gradle/blob/v9.9.0/platforms/documentation/docs/src/docs/release/notes.md) | Kotlin DSL incremental compilation, wider `--tests` filtering |
| Lima | v2.3.0 | None | WSL2 mount support, sudoers matching fix |
| ollama | v0.40.15 (2 patches) | None | Model launcher and MLX support |
| React Native Skia | v3.9.1 · v3.9.0 | None | iOS/Android rendering thread fixes |
| Rolldown | v1.3.0 | [Yes](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md) | CLI breaking change, import attributes support |
| Rstest | v0.12.6 | None | `sequence.setupFiles`, parallel lifecycle hooks |
| Storybook | v10.6.6 | [Yes](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md) | StackBlitz embed restored |
| Tailwind CSS | v4.3.5 · v4.3.4 | [Yes](https://github.com/tailwindlabs/tailwindcss/blob/main/CHANGELOG.md) | Turbopack loader added, `@scope` and `color-mix()` fixes |

## Changes by package

### astro 7.4.7

A JavaScript web framework.

**What changed** — Three patch releases landed. 7.4.7 fixed the image endpoint treating directories whose names differ only by letter case as being inside the build folder. 7.4.6 fixed `astro check` exiting with code 0 despite errors, the `glob()` loader's file handling, an unnecessary page reload on first load, and i18n fallback for on-demand rendered pages. 7.4.5 covered background commands such as `astro dev status`, handling of `import.meta.env` values, and requests with invalid percent-encoded paths.

**What to check when upgrading** — If you run `astro check` in CI, errors that used to pass may now fail, so run it once. Otherwise it is safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

### pnpm v12.18.0 · v11.28.11

A Node.js package manager.

**What changed** — According to the change history, 12.18.0 centers on publishing and installing packages with per-platform variants. Variants uploaded from several machines can be published as one version, and a version made only of variants can be installed. `supportedArchitectures` is read as platform tags, and `pack --json` prints each archive's integrity value and size. A warning for undeclared required peer providers was added, and bugs in resolving relative `file:` peer paths, root overrides and catalog paths were fixed.

**What to check when upgrading** — This summary comes from the change history only, so we could not confirm whether there are breaking changes. The 11.x line is a patch bump to 11.28.11; if you are moving to 12, check the official migration guide separately.

Release notice: None

### Electron v45.2.3 · v44.10.2 · v43.8.7

A platform for building desktop apps with web technologies.

**What changed** — The 45.x line moved from 2.0 through 2.3, and the latest 45.2.3 pulled in 120 changes from angle, chromium, dawn, ffmpeg, pdfium, skia and v8. One fix that affects app code: `removeInsertedCSS()` was also removing user-origin stylesheets. The 44.x and 43.x lines got the same kind of Chromium patches. In the docs, the Experimental label was dropped from the deprecated BrowserView APIs.

**What to check when upgrading** — Because many Chromium patches are included, check rendering and PDF viewing after upgrading. We did not read any API change notice.

Release notice: None

### Oxfmt v0.76.0 · v0.77.0

A JS/TS formatter.

**What changed** — The 0.77.0 history includes an entry marked `!` (breaking) that routes `parser:vue` files through the new HTML-family formatter, plus formatting of Vue template expressions and handlers as JS. It also preserves `doctype` case in embedded content and fixes Vite+ config root resolution.

**What to check when upgrading** — If you format Vue files, check whether the diff changes after upgrading. As a 0.x version, even minor bumps may change output.

Release notice: None

### Oxlint v1.91.0 · v1.92.0

A JS/TS linter.

**What changed** — 1.91.0 added `allow` and `allowPattern` options to `react/capitalized-calls`, and 1.92.0 added an `ignoreDeclarationMerge` option to `eslint/no-redeclare`. Both are options that add exceptions to existing rules.

**What to check when upgrading** — Safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/CHANGELOG.md)

### Next.js v16.4.5 · v16.4.4 · v15.5.29

A server-rendering React framework.

**What changed** — 16.4.5 strips internal middleware cookie headers from edge responses and fixes stale compressed framing on forwarded fetch responses. It also fixes shared-shell poisoning from request-supplied placeholder params, the cache key when `'use cache'` is used with binary arguments, and cache reuse across different root params. `next/image` no longer misdetects AVIF/HEIC. 16.4.4 switched from `jsonwebtoken` to `fast-jwt`. 15.5.29 carries the cookie header, fetch framing and image detection fixes.

**What to check when upgrading** — Apps that use caching or middleware should upgrade soon. We read only the change history, so we could not confirm CVE numbers.

Release notice: None

### Nx 24.0.5 (3 patches)

A monorepo build system.

**What changed** — 24.0.3 through 24.0.5 contain many hardening-style fixes. The graph server now answers only local same-origin requests, Nx Cloud credentials and task arguments are kept out of analytics and URLs, and git handling in `nx import` and git/commit-derived input in `nx release` were hardened. Cache restores stay inside task outputs, a run now fails when a continuous task exits non-zero, and `nx migrate` validates the metadata it fetches.

**What to check when upgrading** — Abnormal exits of continuous tasks (for example, a running server) now fail the run, so check your CI.

Release notice: None

### Homebrew 7.0.12

A macOS package manager.

**What changed** — `brew info` now shows missing libraries even without dependencies and checks the latest runtime dependencies first. Rate-limited attestation lookups are not retried, and unchanged generated files are no longer reported as errors.

**What to check when upgrading** — Safe to upgrade as is.

Release notice: None

### 🔺 Major Omarchy v4.5.0

An Arch Linux setup that layers a Hyprland configuration on top. It is marked because its major number is higher than this report's baseline (v3.8.0).

**What changed** — Notion was added to the install menu, and agent and fingerprint setup prompts now appear once the machine is online rather than after the first update. Empty-result and long-message display in the clipboard panel and emoji picker was fixed, as was a problem where a Hyprland replaced by an update would not reload the new config. Support for the 2017 iMac 5K was added.

**What to check when upgrading** — Migrations run during the update, so back up your settings first.

Release notice: None

### Vite v8.3.6

A frontend build tool.

**What changed** — Fixed handling when plugin container close calls overlap, CSS dependency collection for dynamic imports with queries, and the stability of chunk import map hashes. In the experimental bundled-dev mode it now allows named imports from Node built-ins and reloads when an entry cannot be re-run.

**What to check when upgrading** — Safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

### Angular 22.2.5 · 21.2.26 · 20.3.35

A JavaScript framework.

**What changed** — 22.2.5 adds a `debugName` option to `rxResource`, removes the attribute when an img/video `src` is null, and escapes comment markers. In forms, compat fields now reflect required validators and `FormValueControl` supports `updateOn` blur and submit. The router reads `focusReset` from navigation extras. 21.x and 20.x have one fix: compile only the template contents of a downgraded component.

**What to check when upgrading** — Safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md)

### Hono v4.13.16 (2 patches)

A web framework for edge environments.

**What changed** — JWT now rejects a signature segment outside the base64url alphabet and a header containing `crit`. Several entries appear to be fixes merged from private security advisories; they change how `mount` builds the forwarded path, how RegExpRouter handles line terminators and wildcard middleware coverage, and how the CSS helper escapes closing tags.

**What to check when upgrading** — We did not read the advisory numbers. If you use the JWT middleware, `mount` or wildcard routes, upgrading soon is advisable.

Release notice: None

### Istio 1.31.4 · 1.30.8

A service mesh.

**What changed** — 1.31.4 fixed istiod crashing on malformed debug resource names and on nil to/from entries in an ambient authorization policy. It makes authority and Host header matching in authorization policies case-insensitive, binds the xDS proxy cluster ID to the authenticated cluster, and fixes source IP matching on HBONE internal listeners. 1.30.8 appears to be a backport release in the same family, but we did not confirm it item by item.

**What to check when upgrading** — Host matching in authorization policies is now case-insensitive, so confirm it matches your policy intent.

Release notice: None

### Nuxt v4.6.4

A server-rendering Vue.js framework.

**What changed** — The dev server now rejects unexpected Host headers and a `devServer.allowedHosts` setting was added. `x-forwarded-proto` is trusted only when opted in, and details of untrusted thrown errors are no longer exposed. Wildcard tails in case-insensitive route rules, paths with encoded slashes and the island hash encoding were fixed.

**What to check when upgrading** — If you open the dev server through another domain or a tunnel, you may need to set `devServer.allowedHosts`.

Release notice: None

### Rspack v2.3.1

A Rust-based web bundler.

**What changed** — Fixed the Module Federation runtime's async startup handlers, HMR chunk version validation, inclusion of shared initial chunks in the CSS runtime, and source maps now preserve missing source contents as `null`. `split-chunks` keeps type and layer filters on the native path, improving performance.

**What to check when upgrading** — Safe to upgrade as is.

Release notice: None

### Visual Studio Code 1.145.0 · 1.145.1 · 1.145.2

A code editor.

**What changed** — The 1.145.2 history concentrates on the agent host (file approval scopes, engine snapshots, signed-out Agents window startup), chat performance, and a search bug that split surrogate pairs. We did not read the 1.145.0 feature list.

**What to check when upgrading** — With auto-update there is nothing to do.

Release notice: None

### Vitest v5.1.0

A Vite-based unit test framework.

**What changed** — You can now interactively review and update failed snapshots. Experimental additions are a `message` option for `vi.waitFor` and `vi.waitUntil` and a trace timeline for Node tests. `rootDir` is preserved in project paths, and browser mode fails the run when a tester cannot connect.

**What to check when upgrading** — Browser mode now fails on connection errors it used to skip silently, so check your CI.

Release notice: None

### Argo CD v3.6.0 · v3.6.1 · v3.5.7 · v3.4.13 · v3.3.19

A Kubernetes deployment tool.

**What changed** — 3.6.1 fixed the controller panicking when the server-side diff applier fails, an empty action list for Rollouts without status, and the UI ignoring `--rootpath/--basehref`. The summary panel now shows a CronJob's last scheduled and successful times. 3.5.7, 3.4.13 and 3.3.19 are older-line patches released the same day; we did not read their contents.

**What to check when upgrading** — We did not read the 3.6.0 migration notes, so if you are coming from 3.5, check the official upgrade documentation.

Release notice: None

### Bazel 9.3.2

A build tool.

**What changed** — Fixed linux-sandbox actions being killed prematurely, removed the remote endpoint and instance flags from the action execution salt, and restored server JAR recompression in the Java rules.

**What to check when upgrading** — The execution salt changed, so the cache may be repopulated once on the first build.

Release notice: [CHANGELOG](https://github.com/bazelbuild/bazel/blob/9.3.2/CHANGELOG.md)

### Biome v2.6.5 · v2.6.6

A frontend toolchain.

**What changed** — Both releases added many nursery (experimental) lint rules. 2.6.5 added rules that catch patterns such as array `forEach` and `await` inside `Promise.all`, and 2.6.6 added `noArrayMethodsOnArguments`, `noConstantComparisons`, `noErasingOperation`, `noNegatedArrayPredicate`, `noNumberArgumentOutOfRange`, `noSharedBranchCode` and more.

**What to check when upgrading** — Nursery rules do nothing unless you enable them, so it is safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md)

### Gradle 9.9.0

A Java build tool.

**What changed** — Kotlin DSL scripts are now compiled with the Kotlin Build Tools API, making recompilation after changing `buildSrc` or an included build up to 65% faster in large multi-project builds. The `--tests` filter now applies to JUnit Platform tests that are not declared as methods, such as ArchUnit rules, and the wrapper task keeps your customized properties across upgrades. The Problems API groups problems by area, and Windows Terminal shows build progress on the taskbar. The User Manual is now available as Markdown and has a new chapter on securing builds.

**What to check when upgrading** — Check the deprecations and breaking changes in the Gradle 9.x upgrade guide. For compatible JDK and Groovy ranges, see the official compatibility notes.

Release notice: [Release notes](https://github.com/gradle/gradle/blob/v9.9.0/platforms/documentation/docs/src/docs/release/notes.md)

### Lima v2.3.0

A tool for easily running Linux virtual machines.

**What changed** — Native WSL2 mounts are supported through path translation and boot-time bind mounting. A problem where sudoers entries could be satisfied by merged arguments was closed, QEMU now runs in the instance directory instead of the current directory, and changing the VM type of an existing instance prints a warning. The docs now state that overlapping mounts are not supported.

**What to check when upgrading** — If you use overlapping mounts, review them.

Release notice: None

### ollama v0.40.15 (2 patches)

A tool for running open models locally.

**What changed** — `ollama launch` gained Kimi Code CLI support, and gateway model names show up in Claude Desktop's model picker. The MLX runner supports YaRN scaling for Qwen3 models and rejects unsupported CUDA devices, and llama-server allows parallel requests for recurrent and vision models. Cloud web-search response decoding was fixed, along with the OpenAI-compatible API overriding model sampler defaults.

**What to check when upgrading** — If you did not set sampling parameters through the OpenAI-compatible API, the model defaults are now used.

Release notice: None

### React Native Skia v3.9.1 · v3.9.0

A 2D graphics library for React Native.

**What changed** — 3.9.1 keeps a view's native view from leaking out of its superview on iOS, holds GPU work while the app is in the background, and presents one recording per vsync. On Android it reduces Java calls when posting main-thread tasks and no longer requests TransientAttachments on Imagination GPUs. We did not read the 3.9.0 changes.

**What to check when upgrading** — Safe to upgrade as is.

Release notice: None

### Rolldown v1.3.0

A Rust-based JS/TS bundler.

**What changed** — The CLI now rejects `--input` combined with positional entries, like Rollup. An experimental feature passes import attributes to plugin hooks (`resolveId`, `load`, `transform` and others), and the `notify` APIs are exposed. It also honors `NO_COLOR`, `output.cleanDir` no longer follows output directory symlinks, and tree-shaking fixes are included.

**What to check when upgrading** — Check that your scripts do not pass `--input` together with entry arguments.

Release notice: [CHANGELOG](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md)

### Rstest v0.12.6

A testing framework built on Rspack.

**What changed** — It supports the `sequence.setupFiles` option and parallel lifecycle hooks, simplifies output with `passWithNoTests`, includes module loading time in test file scheduling, and corrects CJS wrapper offsets in V8 coverage.

**What to check when upgrading** — Safe to upgrade as is.

Release notice: None

### Storybook v10.6.6

A UI component development tool.

**What changed** — StackBlitz can embed the dev server again, and VRT packages were added to telemetry.

**What to check when upgrading** — Safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md)

### Tailwind CSS v4.3.5 · v4.3.4

A CSS framework.

**What changed** — 4.3.4 added `@tailwindcss/turbopack`, a Turbopack loader for Next.js, made `@scope` variants wrap utilities, and fixed a crash on every edit under Vite `bundledDev` and the fallback to WASM on platforms without native bindings. 4.3.5 improved canonicalization performance with many variant values and fixed a crash on `color-mix()` without an interpolation method.

**What to check when upgrading** — Safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/tailwindlabs/tailwindcss/blob/main/CHANGELOG.md)

## Wrap-up

Three releases were left out of the body (skipped) because no readable change description was available: Zed v1.27.0, vLLM v0.33.0 and Obsidian v1.15.0. A new stable version was confirmed for each.

Fourteen sources failed to check because their hosts were blocked from this session's network: TypeScript (devblogs.microsoft.com), Expo SDK, GraalVM, JDK, Android, Boundary, Cursor, GitButler, Manus, Swift, Ubuntu, Xcode, the PyTorch blog and the Go release page.

How we checked: npm/PyPI/git tag based (GitHub release bodies not accessible)
