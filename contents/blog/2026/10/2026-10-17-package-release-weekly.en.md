---
layout: post
title: Weekly Package Releases — 2026-10-17
date: 2026-10-17
published: 2026-10-17
category: Development
tags: ['release', 'packages', 'weekly']
comments: true
thumbnail: './assets/17/thumbnail.en.png'
github: ''
---

## ✍️ Summary

Next.js 16.4.1 and 15.5.28 are security releases fixing a critical unauthenticated remote code execution flaw in the image optimization API, and more security patches followed in Grafana (4 CVEs), Storybook (10 hardening changes) and podman (CVE-2026-107935). React Native 0.88.0 ships several breaking changes (changes that require updating existing code), so check before upgrading.

## This Week at a Glance

The period is 2026-10-10 to 2026-10-17 (KST). Of the 87 tracked packages, 31 had a new stable release.

| Package | Version | Release notes | Changes |
|---|---|---|---|
| Node.js | v26.12.0 (Current) · v24.22.0 (LTS) | [Yes](https://github.com/nodejs/node/releases/tag/v26.12.0) | Synchronous ES module loading, config file stabilized / new crypto APIs |
| Zed | v1.24.2 · v1.23.3 | [Yes](https://github.com/zed-industries/zed/releases/tag/v1.24.2) | Git tag creation, binary about 23% smaller |
| pnpm | v12.14.0 · v11.28.6 · v10.34.7 | [Yes](https://github.com/pnpm/pnpm/releases/tag/v12.14.0) | Remote cache and other features, publish token security fix |
| Electron | v44.9.0 · v44.8.0 · v43.8.0 · v42.11.15 | [Yes](https://github.com/electron/electron/releases/tag/v44.9.0) | Linux notification buttons, stability fixes |
| Oxfmt | v0.73.0 | [Yes](https://github.com/oxc-project/oxc/releases/tag/oxfmt_v0.73.0) | `associations` setting, Astro support |
| Oxlint | v1.88.0 | [Yes](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.88.0) | LSP config error display, new rule option |
| Next.js | v16.4.2 · v15.5.28 | [Yes](https://github.com/vercel/next.js/releases/tag/v16.4.1) | Critical RCE fix |
| Nuxt UI | v4.12.0 | [Yes](https://github.com/nuxt/ui/releases/tag/v4.12.0) | New `Chart` component |
| FastAPI | 0.143.3 (3 patches) | [Yes](https://github.com/fastapi/fastapi/releases/tag/0.143.3) | Stream serialization and other bug fixes |
| Grafana | 13.2.4 · 13.1.8 · 13.0.11 · 12.4.13 | [Yes](https://github.com/grafana/grafana/releases/tag/v13.2.4) | Security patch for 4 CVEs |
| Grafana Tempo | v3.0.4 | [Yes](https://github.com/grafana/tempo/releases/tag/v3.0.4) | CVEs fixed via Go update, panic fix |
| React Native | 0.88.0 | [Yes](https://github.com/react/react-native/releases/tag/v0.88.0) | Variable fonts, many breaking changes |
| Angular | 22.2.3 · 20.3.34 | [Yes](https://github.com/angular/angular/releases/tag/v22.2.3) | Prototype pollution defenses, wider XSRF coverage |
| ESLint | v10.13.0 | [Yes](https://github.com/eslint/eslint/releases/tag/v10.13.0) | Three rules check more code |
| Nuxt | v4.6.2 (2 patches) | [Yes](https://github.com/nuxt/nuxt/releases/tag/v4.6.2) | Server route rules ignore case |
| Prettier | 3.9.10 | [Yes](https://github.com/prettier/prettier/releases/tag/3.9.10) | Faster Markdown table parsing |
| Rspack | v2.2.9 | [Yes](https://github.com/web-infra-dev/rspack/releases/tag/v2.2.9) | Better chunk splitting, smaller binary |
| Turborepo | v2.11.9 (2 patches) | [Yes](https://github.com/vercel/turborepo/releases/tag/v2.11.9) | Adds `turbo setup` and `turbo exec` |
| Visual Studio Code | 1.141.1 | None | MCP sandbox approval isolation fix |
| Vitest | v5.0.5 (2 patches) · v4.1.12 | [Yes](https://github.com/vitest-dev/vitest/releases/tag/v5.0.5) | Cache dir marker, browser instance changes |
| Argo CD | v3.5.5 · v3.4.11 · v3.3.16 | [Yes](https://github.com/argoproj/argo-cd/releases/tag/v3.5.5) | CMP and hydrator bug fixes |
| KubeVirt | v1.9.1 | [Yes](https://github.com/kubevirt/kubevirt/releases/tag/v1.9.1) | Hotplug restriction, alert config change |
| ollama | v0.40.6 (3 patches) | [Yes](https://github.com/ollama/ollama/releases/tag/v0.40.6) | Decision models, new models |
| podman | v6.1.4 · v5.8.9 | [Yes](https://github.com/podman-container-tools/podman/releases/tag/v6.1.4) | gvproxy CVE fixed, WSL 3 fix |
| React Native Skia | v3.6.1 · v3.5.0 · v3.4.4 | [Yes](https://github.com/wcandillon/react-native-skia/releases/tag/v3.6.1) | Snapshot view API removed, `onSize` deprecated |
| Rolldown | v1.2.14 | [Yes](https://github.com/rolldown/rolldown/releases/tag/v1.2.14) | `output.charset`, re-export fixes |
| Rust | 1.99.1 | [Yes](https://github.com/rust-lang/rust/releases/tag/1.99.1) | FFI `bool` return and other fixes |
| Storybook | v10.6.2 · v9.1.21 · v8.6.19 | [Yes](https://github.com/storybookjs/storybook/releases/tag/v10.6.2) | 10 security hardening changes, Preact 11 support |
| Terraform | v1.16.6 | [Yes](https://github.com/hashicorp/terraform/releases/tag/v1.16.6) | CVE-2026-78669 fixed |
| Ubuntu | 26.10 Stonking Stingray | [Yes](https://ubuntu.com/blog/canonical-releases-ubuntu-26-10-stonking-stingray) | GNOME 51, kernel 7.3, Sequoia PGP |
| React | 19.3.1 · 19.2.9 · 19.1.10 · 19.0.9 | [Yes](https://github.com/react/react/releases/tag/v19.3.1) | RSC transport protocol improvements |

## Changes by Package

### Node.js v26.12.0 (Current) · v24.22.0 (LTS)

The JavaScript runtime for servers.

**What changed** — The Current line's v26.12.0 adds `websocketMask()`/`websocketUnmask()` to HTTP, loads most ES modules synchronously, moves `process.finalization` to RC stage and the config file feature to stable. SQLite now throws an exception instead of crashing on oversized strings, and bugs in `AbortSignal.any()` leaks and querystring decoding are fixed. The LTS v24.22.0 adds `crypto.parsePKCS12()`, a general MAC API, SIV/GCM-SIV cipher modes, `util.throttle`/`util.debounce` and SQLite `StatementSync.close()`, and fixes an HTTP/2 write deadlock and a Windows `rmSync` issue. npm is bumped to 11.19.1. Neither release note lists a CVE.

**What to check when upgrading** — v26.12.0 now throws an exception in environments without WebAssembly or RX support (a semver-minor item), so check any service running in such an environment. In v24.22.0, non-FIPS WebCrypto paths are disabled in FIPS mode (the US government cryptography certification standard), and `Server.prototype._listen2` in `net` and the HTTP/2 `aborted` property are marked deprecated (scheduled for removal).

Release notes: [v26.12.0](https://github.com/nodejs/node/releases/tag/v26.12.0) · [v24.22.0](https://github.com/nodejs/node/releases/tag/v24.22.0)

### Zed v1.24.2 · v1.23.3

A fast code editor written in Rust.

**What changed** — v1.24.2 adds a Git tag creation command, dragging terminal tabs into the Agent Panel, `file_finder.prefill_query_from_selection` to prefill the file finder from selected text, a Go test button, Markdown/Mermaid font settings, Gerrit/Gitiles permalinks and custom Amazon Bedrock model configuration. The Linux x86_64 binary is about 23% smaller and starts faster, and a crash while editing inlay hints, broken Linux emoji fonts and a hang in remote project search are fixed. v1.23.3 is a patch for the previous stable line that fixes the Markdown preview font, worktree handling in edit predictions and the Threads Sidebar transparent background, updates Node.js to the latest v24 LTS, and adds opt-in telemetry for the agent checkpoint feature that runs only with consent.

**What to check when upgrading** — No breaking changes are listed. This release is fine to upgrade to as is.

Release notes: [v1.24.2](https://github.com/zed-industries/zed/releases/tag/v1.24.2) · [v1.23.3](https://github.com/zed-industries/zed/releases/tag/v1.23.3)

### pnpm v12.14.0 · v11.28.6 · v10.34.7

A Node.js package manager.

**What changed** — The 12.x line had four minor releases this week. v12.14.0 adds a `sideEffectsCache.exclude` setting to drop packages from the build cache when their cache key can't be built because they depend on system libraries, and `pnpm install` skips the daily update check if it finishes first. v12.13.0 adds the `pnpm profile` and `pnpm token` commands and a `storeIndexFormat: files` setting for network file systems, and v12.12.x adds a remote cache for task results and dependency builds, an `addMissingPeerTypes` setting, `pnpm dist-tag` with OIDC authentication and a `tool:` protocol for download tools. v11.28.6 is a security fix: `pnpm publish` now uses a CI identity token only when its audience (the target the token is meant for) matches the destination registry. v10.34.7 is a patch that makes switching to the pnpm version named in `packageManager` work even when a mirror strips or re-signs npm signatures.

**What to check when upgrading** — The notes mark no breaking change, but since 12.12.x `pnpm publish` checks the token audience against the registry, so if you publish from CI with a token, confirm publishing still works after upgrading.

Release notes: [v12.14.0](https://github.com/pnpm/pnpm/releases/tag/v12.14.0) · [v11.28.6](https://github.com/pnpm/pnpm/releases/tag/v11.28.6) · [v10.34.7](https://github.com/pnpm/pnpm/releases/tag/v10.34.7)

### Electron v44.9.0 · v44.8.0 · v43.8.0 · v42.11.15

A platform for building desktop apps with web technology.

**What changed** — v44.9.0 adds an app shim on macOS to show a window under another app's Dock icon, makes windows opened via a link use the opener's session and `webPreferences`, and makes `setCertificateVerifyProc` apply to requests sent at the same time as the first one. v44.8.0 adds Linux notification action buttons and fixes `net.fetch` failing after a Network Service restart, lost `utilityProcess` messages and `win.isFullScreen()` returning a stale value on Windows, and updates to Chromium 152.0.7977.167 and Node.js v24.22.0. v43.8.0 and v42.11.15 are backport patches fixing Linux GTK crashes, missed background clicks on macOS, `net.fetch` failures and lost `utilityProcess` messages.

**What to check when upgrading** — There are no breaking changes. Apps that use certificate verification (`setCertificateVerifyProc`) should check its behavior once.

Release notes: [v44.9.0](https://github.com/electron/electron/releases/tag/v44.9.0) · [v44.8.0](https://github.com/electron/electron/releases/tag/v44.8.0) · [v43.8.0](https://github.com/electron/electron/releases/tag/v43.8.0) · [v42.11.15](https://github.com/electron/electron/releases/tag/v42.11.15)

### Oxfmt v0.73.0

A JavaScript/TypeScript formatter.

**What changed** — The `associations` setting lets you specify a language per file path, and Astro support (LSP, `prettier-plugin-astro`, `--migrate prettier`) and display of LSP root config errors are added. A new TOML formatter crate is included, and symlinked config file discovery, CSS-in-JS placeholder handling and `export default` line breaks are fixed.

**What to check when upgrading** — The behavior of `--migrate prettier` (the feature that moves your Prettier config over) changed and is marked breaking, so recheck the result if you have already migrated a config.

Release notes: [oxfmt_v0.73.0](https://github.com/oxc-project/oxc/releases/tag/oxfmt_v0.73.0)

### Oxlint v1.88.0

A JavaScript/TypeScript linter.

**What changed** — The LSP now shows config errors to the client, and the `prefer-query-selector` rule gains an `allowWithVariables` option. `sort-keys` now uses the same natural sort as ESLint, and `prefer-bigint-literals` no longer auto-fixes when precision would be lost. Fixes also make it follow symlinked configs and set stderr to blocking.

**What to check when upgrading** — Two changes to how comment positions are stored (the AST) are marked breaking, but they affect users who use the parser API directly. If you only use the linter, just check whether `sort-keys` results change.

Release notes: [oxlint_v1.88.0](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.88.0)

### Next.js v16.4.2 · v15.5.28

A server-rendered React framework.

**What changed** — v16.4.1 (10-14) is a security-only release that fixes two critical unauthenticated remote code execution flaws: one when a `use cache` function returns a typed array (GHSA-673q-mjm6-r5xr), the other in the Image Optimization API with SVG (GHSA-2464-fhr4-w9xw). It also fixes a denial of service in App Router Server Actions (High, GHSA-p3m5-59mp-jv5r). v15.5.28 is also a security release fixing the SVG image optimization RCE and the Server Actions denial of service. v16.4.2 (10-15) is a Turbopack-focused backport that fixes turbo-tasks snapshot consistency, lazy dynamic import chunk conflicts, ignoring realpath errors in module resolution (same as Node.js) and a GC path.

**What to check when upgrading** — If you use `use cache` return values, the image optimization API (SVG) or Server Actions, upgrade immediately. There are no breaking changes.

Release notes: [v16.4.1](https://github.com/vercel/next.js/releases/tag/v16.4.1) · [v16.4.2](https://github.com/vercel/next.js/releases/tag/v16.4.2) · [v15.5.28](https://github.com/vercel/next.js/releases/tag/v15.5.28)

### Nuxt UI v4.12.0

A UI component library for Nuxt/Vue.

**What changed** — A new `Chart` component based on TanStack Charts (line, area, bar, donut, server-rendered SVG) is added. `@tanstack/charts` is an optional peer dependency, so install it only if you use charts. With `@nuxtjs/i18n`, `App` follows the locale automatically, several components gain props and events, page JS shrinks by up to 27% and overlays load lazily. Bugs in SelectMenu, Table, Drawer and others and accessibility labels are also fixed.

**What to check when upgrading** — No breaking changes are listed. Following the i18n integration guide, it is better to remove `import * as locales` and the manual `:locale` binding on `UApp`.

Release notes: [v4.12.0](https://github.com/nuxt/ui/releases/tag/v4.12.0)

### FastAPI 0.143.3 (3 patches)

A Python web framework.

**What changed** — 0.143.1 through 0.143.3 are all bug fixes. 0.143.3 fixes problems serializing non-finite floating-point values such as NaN and Infinity in JSONL and SSE streams, 0.143.2 fixes frontend fallback file checks being blocked, and 0.143.1 fixes route metadata missing from `iter_route_contexts()`. 0.143.2 also includes translation updates and dependency updates.

**What to check when upgrading** — There are no new features, breaking changes or deprecations. If you emit float values in streaming responses or use frontend fallback files, just verify behavior after upgrading.

Release notes: [0.143.3](https://github.com/fastapi/fastapi/releases/tag/0.143.3)

### Grafana 13.2.4 · 13.1.8 · 13.0.11 · 12.4.13

A metrics dashboard tool.

**What changed** — Security patches across four lines. 13.2.4, 13.1.8 and 13.0.11 fix CVE-2026-15577, CVE-2026-33374, CVE-2026-93294 and CVE-2026-95502, and 12.4.13 fixes the same except CVE-2026-95502. All four versions also fix CVE-2026-92539 in Enterprise SCIM provisioning (automatic account sync). Alerting now strips sensitive headers on cross-host OAuth2 redirects, and dashboards fall back when collection deletion isn't supported. 13.2.4 also includes Git Sync and provisioning improvements (previews for unsynced folders allowed, invalid resource names rejected early, fork PR previews skipped).

**What to check when upgrading** — There are no breaking changes or deprecations. Because these are security patches, we recommend moving running instances to the latest patch of their line.

Release notes: [13.2.4](https://github.com/grafana/grafana/releases/tag/v13.2.4) · [13.1.8](https://github.com/grafana/grafana/releases/tag/v13.1.8) · [13.0.11](https://github.com/grafana/grafana/releases/tag/v13.0.11) · [12.4.13](https://github.com/grafana/grafana/releases/tag/v12.4.13)

### Grafana Tempo v3.0.4

A distributed tracing backend.

**What changed** — Go is updated to 1.26.9, resolving several CVEs, and dependencies such as grpc, thrift, x/net, x/text, x/crypto and the OpenTelemetry log module are updated. Bug fixes include a panic (abnormal termination) in `FindTraceByID` when new spans arrive for the same trace in the live-store, and a rare cache collision between instant queries and range metrics queries in the query-frontend.

**What to check when upgrading** — There are no breaking changes or deprecations. This release is fine for 3.0.x operators to upgrade to as is.

Release notes: [v3.0.4](https://github.com/grafana/tempo/releases/tag/v3.0.4)

### React Native 0.88.0

A framework for building mobile apps with React.

**What changed** — On Android it supports `fontVariationSettings` (variable font axis control) for `Text` and `TextInput`, and `ArrayBuffer` in Java TurboModules. iOS gains SceneDelegate lifecycle support and asset catalog images, it is synced to React 19.3.0 and Metro 0.87.0, and Hermes is updated. On security, `shell-quote` is bumped to 1.8.4, resolving CVE-2026-9277.

**What to check when upgrading** — There are several breaking changes. Inlining `Platform.OS` and `Platform.select` in Babel now needs the extra `inlinePlatform` option, and the minimum Metro version is 0.87.1. Android `ArrayBuffer` is valid only during a synchronous call, so copy it if you need it longer. The `experimental_` prefix is removed from `backgroundSize`, `backgroundPosition` and `backgroundRepeat`, `RCT`-prefixed names are dropped from some core component view configs, and the C++ `UIManager::startSurface` signature changed. Deprecated items include Android `InputAccessoryView`, `react-native/Libraries/Core/InitializeCore` (use `react-native/setup-env`) and `fabricEnabled` on `ReactFragment`.

Release notes: [v0.88.0](https://github.com/react/react-native/releases/tag/v0.88.0)

### Angular 22.2.3 · 20.3.34

A JavaScript framework.

**What changed** — 22.2.3 strengthens defenses against prototype pollution (an attack that tampers with an object's base properties) in common's parameter encoding and the compiler's JIT compilation. The compiler adds dot support in class binding names and popover attribute binding and fixes comment scope handling and an equality comparison error, and core fixes event replay conflicts when two apps share an `APP_ID` and an error destroying embedded views mid-animation. Forms reduces unnecessary change detection on blur. 20.3.34 fixes an i18n flag leak on errors and applies XSRF protection to same-origin absolute URL requests.

**What to check when upgrading** — 22.2.3 is fine to upgrade to as is. With 20.3.34, requests to the same server by absolute URL will now carry the XSRF header, so check that your server-side XSRF validation matches.

Release notes: [v22.2.3](https://github.com/angular/angular/releases/tag/v22.2.3) · [v20.3.34](https://github.com/angular/angular/releases/tag/v20.3.34)

### ESLint v10.13.0

A JavaScript code analysis tool.

**What changed** — Three rules now check more code. `no-use-before-define` also reports references inside IIFEs (immediately invoked function expressions), `no-obj-calls` catches `globalThis` used like a callable object, and `no-unsafe-optional-chaining` also checks `yield*` expressions. A bug where `let` was declared twice when `no-var` and `one-var` autofixes were combined is fixed, and `no-redeclare` skips scanning variables with a single declaration, making it faster.

**What to check when upgrading** — There are no breaking changes, but because the checks cover more code, existing code may produce new warnings, so check your lint results after upgrading.

Release notes: [v10.13.0](https://github.com/eslint/eslint/releases/tag/v10.13.0)

### Nuxt v4.6.2 (2 patches)

A server-rendered Vue.js framework.

**What changed** — Two patches focused on bug fixes with no new features. v4.6.1 includes a performance improvement where Nitro (Nuxt's server engine) builds the web-standard view of the request event only on first access. v4.6.2 makes server island (partial components rendered on the server) head output follow `useHeadSafe` rules, makes server route rules match case-insensitively by default, and fixes page transition and navigation error state handling.

**What to check when upgrading** — There are no breaking changes, deprecations or security items. Server route rule case matching changed and the dev server error overlay behavior also changed, so check just those.

Release notes: [v4.6.2](https://github.com/nuxt/nuxt/releases/tag/v4.6.2) · [v4.6.1](https://github.com/nuxt/nuxt/releases/tag/v4.6.1)

### Prettier 3.9.10

A code formatter.

**What changed** — The library that parses Markdown tables (micromark-extension-gfm-table) is updated, fixing a table parsing performance problem. If formatting was slow on documents with many large tables, it improves.

**What to check when upgrading** — There are no new features, breaking changes or deprecations. This release is fine to upgrade to as is.

Release notes: [3.9.10](https://github.com/prettier/prettier/releases/tag/3.9.10)

### Rspack v2.2.9

A web bundler written in Rust.

**What changed** — The chunk splitting algorithm (splitting code into multiple files) is improved, reducing modules duplicated across chunks, so bundles may get smaller. Compressing browser list data shrank the native binary by 2.13MB (3.08%), and many performance optimizations and fixes for CSS, lazy compilation, the file watcher and types are included. Bumping `xxhash-rust` to v0.8.16 is marked as a security fix.

**What to check when upgrading** — There are no breaking changes or deprecations, but since chunk splitting changed, check the structure and size of your build output.

Release notes: [v2.2.9](https://github.com/web-infra-dev/rspack/releases/tag/v2.2.9)

### Turborepo v2.11.9 (2 patches)

A build system for JavaScript/TypeScript monorepos.

**What changed** — `turbo setup` is greatly expanded to install and verify tools such as Node, pnpm, Yarn, Bun, npm, uv/Python, Rust and Go, and a new `turbo exec` runs commands in a managed environment. Shell hooks for bash, zsh, fish and PowerShell, a root-only setup policy in `turbo.json`, `turbo.lock` entries and Windows x64 support come with it. Task output is preserved after a non-zero exit, a crash caused by non-UTF-8 arguments and blocked Git metadata writes during cache restore are fixed, and performance improves.

**What to check when upgrading** — No breaking change is marked, but Unix shell hooks are no longer installed automatically and the option controlling setup lifecycle scripts was removed. Teams using `turbo setup` should check the behavior change.

Release notes: [v2.11.9](https://github.com/vercel/turborepo/releases/tag/v2.11.9)

### Visual Studio Code 1.141.1

Microsoft's code editor.

**What changed** — The only change confirmed in 1.141.1 is an MCP (AI tool integration protocol) sandbox permission approval isolation fix, referencing MSRC (Microsoft Security Response Center) case 138669. Root sandbox settings are limited to shared deny rules and approvals are scoped to the requesting server. For 1.142.0 and 1.141.2, released in the same period, no change details could be confirmed from the GitHub release body.

**What to check when upgrading** — If you use MCP servers, update to 1.141.1 or later. The GitHub release body has no notes, so release notes are shown as none.

Release notes: None (tag: [1.141.1](https://github.com/microsoft/vscode/releases/tag/1.141.1))

### Vitest v5.0.5 (2 patches) · v4.1.12

A unit test framework built on Vite.

**What changed** — v5.0.4 marks the cache directory with `CACHEDIR.TAG` (experimental) and adds a `test.ui.theme` option, zoom/fit controls in the trace view and a count of affected tests with `--changed`. Running browser instances like workers reduced the default instance count, and `fsModuleCache` is now enabled by default. v5.0.5 fixes keeping Vite's default `fs.deny` rules, quoted filename handling in `--changed` and running hook cleanup even when a later hook fails. v4.1.12 backports one fix that makes manual mocks and redirect mocks more robust.

**What to check when upgrading** — There is a warning that a custom `maxWorkers` can hurt performance, so check environments using browser mode and `maxWorkers` after upgrading. There is no security advisory. If you stay on v4, just check tests that use mocks.

Release notes: [v5.0.5](https://github.com/vitest-dev/vitest/releases/tag/v5.0.5) · [v4.1.12](https://github.com/vitest-dev/vitest/releases/tag/v4.1.12)

### Argo CD v3.5.5 · v3.4.11 · v3.3.16

A Kubernetes deployment (GitOps) tool.

**What changed** — All three lines are collections of backported bug fixes. They fix stale manifests and goroutine leaks in the Reposerver after a CMP (config management plugin) failure, hydrator ref lock error retries and reporting of permanent note-push failures, the OCI tag list cache, the untar check on symlink target paths, the CronWorkflow schedule time format and URL routing for the write repo (creds) endpoint. Dependencies such as go-git, grpc 1.84.0, oras-go 2.6.2 and Go 1.26.9 are updated.

**What to check when upgrading** — There are no new features, breaking changes or security items. Check after upgrading only if you use CMP or OCI sources, the Git hydrator or repo creds routing.

Release notes: [v3.5.5](https://github.com/argoproj/argo-cd/releases/tag/v3.5.5) · [v3.4.11](https://github.com/argoproj/argo-cd/releases/tag/v3.4.11) · [v3.3.16](https://github.com/argoproj/argo-cd/releases/tag/v3.3.16)

### KubeVirt v1.9.1

An add-on for managing virtual machines on Kubernetes.

**What changed** — A bug-fix-focused patch with 83 changes. It stops guests from unplugging core PCI devices such as disks, memory balloon, RNG and watchdog via hotplug, recognizes the Vera Rubin GPU (10de:3041) as a Grace GPU to support passthrough, and bumps libvirt to 11.10.0-19.el9. It lets Windows VMs with a hyperv panic device finish the memory dump and reboot after a crash, and fixes a PCI passthrough regression on kernels without the VFIO CDEV option and VM restore failures.

**What to check when upgrading** — The OrphanedVirtualMachineInstances and VirtLauncherPodsStuckFailed alerts now require cluster-scoped namespace labels, so check your alert configuration. The backend storage PVC for VMs with CBT enabled also grows by 1Gi.

Release notes: [v1.9.1](https://github.com/kubevirt/kubevirt/releases/tag/v1.9.1)

### ollama v0.40.6 (3 patches)

A tool for running open models locally.

**What changed** — v0.40.4 lets `ollama run` run decision models (models for yes/no questions, classification and scoring), for example `ollama run nimble --ask ...`. v0.40.5 adds the Nemotron 3.5 Super (120B) and Bolt (74B) models, and v0.40.6 fixes orphaned Windows runner processes, adds GGUF q2_0 tensor type support and adds cloud clef execution. `ollama launch` now works on usage credits without a paid plan, Responses API custom tool call errors and a multimodal embedding problem are fixed, and MLX runner stability improves.

**What to check when upgrading** — There are no breaking changes or security (CVE) items. The question key in `--ask` mode changed to an identifier style, so check any scripts that use this mode. (There was conflicting information that the v0.40.6 release page shows as a prerelease, but the feed lists it as a stable release, so it is included.)

Release notes: [v0.40.6](https://github.com/ollama/ollama/releases/tag/v0.40.6)

### podman v6.1.4 · v5.8.9

A container engine.

**What changed** — Both versions fix Podman not working on WSL 3 (#29749) and resolve CVE-2026-107935 by bumping gvproxy (a network proxy component) to v0.9.0. v6.1.4 updates to Buildah v1.45.2 and Storage v1.64.2, and v5.8.9 updates to Buildah v1.43.5 and Storage v1.62.2; v5.8.9 also fixes a bug where `podman machine start` interrupted by a signal left the VM in an inconsistent state on Mac.

**What to check when upgrading** — There are no new features or breaking changes. It contains a security patch, so we recommend upgrading.

Release notes: [v6.1.4](https://github.com/podman-container-tools/podman/releases/tag/v6.1.4) · [v5.8.9](https://github.com/podman-container-tools/podman/releases/tag/v5.8.9)

### React Native Skia v3.6.1 · v3.5.0 · v3.4.4

A library that brings the Skia graphics engine to React Native.

**What changed** — v3.6.1 (including 3.6.0) now requests the display refresh rate when drawing a SurfaceView canvas. v3.5.0 bumps canvaskit-wasm to 0.41.1 so the new path builder adds shapes in linear time, and on Apple platforms it pauses rendering in the background and catches up on returning to the foreground. The v3.4.x releases (3.4.0 to 3.4.4) add Skia Graphite and Dawn support for tvOS and fix font family style matching and a context registration error (the notes for 3.4.1 to 3.4.3 were not checked).

**What to check when upgrading** — v3.6.0 removed the snapshot view API (#4249), so apps that use it should audit usage first. v3.5.0 deprecated the `onSize` prop (#4244), so check for a replacement too.

Release notes: [v3.6.1](https://github.com/wcandillon/react-native-skia/releases/tag/v3.6.1) · [v3.5.0](https://github.com/wcandillon/react-native-skia/releases/tag/v3.5.0) · [v3.4.4](https://github.com/wcandillon/react-native-skia/releases/tag/v3.4.4)

### Rolldown v1.2.14

A JavaScript/TypeScript bundler written in Rust.

**What changed** — An `output.charset` option is added, and with code splitting, independent ESM re-exports are routed separately per consumer. It fixes initialization preservation for wrapped ESM re-exports, eager loading in strict execution order mode, deep reads and name collisions in namespace shims, source map boundary preservation, dev-mode HMR file watching and CommonJS top-level `this` handling. Writing to a re-exported namespace member now reports an error, and calling `close()` repeatedly does nothing. oxc is bumped to 0.154.0.

**What to check when upgrading** — Bundle output may change, so check your build results after upgrading.

Release notes: [v1.2.14](https://github.com/rolldown/rolldown/releases/tag/v1.2.14)

### Rust 1.99.1

A programming language.

**What changed** — A patch containing only bug fixes. It fixes the missing `wcslen` symbol on UEFI and embedded targets, FFI (the feature for interfacing with other languages) `bool` return values being miscompiled on x86_64, and the rust-lld linker on macOS not adding the `libLLVM` search path (rpath).

**What to check when upgrading** — There are no new features, breaking changes or deprecations. If you build x86_64 code that uses FFI `bool` return values, UEFI/embedded targets or macOS, upgrade to 1.99.1 and rebuild.

Release notes: [1.99.1](https://github.com/rust-lang/rust/releases/tag/1.99.1)

### Storybook v10.6.2 · v9.1.21 · v8.6.19

A UI component development tool.

**What changed** — v9.1.21 and v8.6.19 bundle 10 security hardening changes. They separate manager and preview roles on the dev server channel, stop menu items from sending arbitrary channel events, limit postMessage to known manager origins and block iframe embedding from non-localhost origins. Component search requests outside the project are rejected, MCP gains host warnings and origin validation, story save paths are limited to inside the project root and names and argument keys are validated as identifiers. Browser file writes and command execution in Addon Vitest are disabled. v10.6.2 supports Preact 11, fixes CLI output being hidden on Yarn 1 and the TypeScript type of `enhanceArgTypes`, and patches security advisories GHSA-f2ph-cmg5-wxc8 and GHSA-px85-f4q5-jh77.

**What to check when upgrading** — If you expose the dev server externally or use Addon Vitest, check that nothing you rely on is now blocked. With Angular-Vite on v10.6.2, `@analogjs/vite-plugin-angular` 2.7.3 or later is required.

Release notes: [v10.6.2](https://github.com/storybookjs/storybook/releases/tag/v10.6.2) · [v9.1.21](https://github.com/storybookjs/storybook/releases/tag/v9.1.21) · [v8.6.19](https://github.com/storybookjs/storybook/releases/tag/v8.6.19)

### Terraform v1.16.6

An Infrastructure as Code tool.

**What changed** — `terraform init` now correctly finds a cloud workspace selected by a tag key with mixed case, and tests can use a deprecated output of the module under test. It also fixes an HTTP/2 resource exhaustion issue (CVE-2026-78669); exploiting it requires a compromised registry, and the release notes describe it as outside Terraform core's security guarantees.

**What to check when upgrading** — There are no breaking changes. It is safe for users of the 1.16 line to upgrade.

Release notes: [v1.16.6](https://github.com/hashicorp/terraform/releases/tag/v1.16.6)

### Ubuntu 26.10 Stonking Stingray

A Linux distribution (an interim release, not LTS).

**What changed** — It brings GNOME 51, a redesigned App Center, dbus-broker (the default D-Bus implementation), Linux kernel 7.3 (Intel Xe3P, AMD Zen 6 and NVIDIA 615 support), the optional offline on-device speech recognition agent Myna, and Microsoft Entra ID integration. The toolchain is updated to ROCm 10.0, LLVM 22.1.6, GCC 15.2.0, Python 3.14.7, Rust 1.97.1 and Go 1.27. On security it adds Sequoia PGP-based APT repository signature verification (preparing for post-quantum signatures), openCryptoki integration with ML-DSA and ML-KEM, and TPM-based full-disk encryption (with an optional PIN/passphrase) usable on devices without a hardware root of trust.

**What to check when upgrading** — The post lists no breaking changes or deprecations. However, existing components are being replaced, such as GnuPG by Sequoia PGP and the completed move to Rust-based coreutils, so check the impact of those.

Release notes: [Canonical releases Ubuntu 26.10](https://ubuntu.com/blog/canonical-releases-ubuntu-26-10-stonking-stingray)

### React 19.3.1 · 19.2.9 · 19.1.10 · 19.0.9

A JavaScript UI library.

**What changed** — For all four versions the release body is a single line: "transport protocol improvements" for React Server Components. That means the communication protocol the server and client use to exchange component data has been improved; nothing beyond that can be confirmed from the source.

**What to check when upgrading** — There is no mention of security/CVEs, breaking changes or new features. If you use RSC, upgrade to the patch matching the minor line you use.

Release notes: [19.3.1](https://github.com/react/react/releases/tag/v19.3.1) · [19.2.9](https://github.com/react/react/releases/tag/v19.2.9) · [19.1.10](https://github.com/react/react/releases/tag/v19.1.10) · [19.0.9](https://github.com/react/react/releases/tag/v19.0.9)

## Wrap-up

Items whose release notes could not be confirmed (GitLab, Istio, Prisma, ClickHouse, LogTape, Optique, VS Code 1.142.0 and 1.141.2, Zed v1.24.3) are left out of the body, and TypeScript, Expo SDK, GraalVM, JDK, PyTorch, Android, Cursor, GitButler, Manus and Xcode were missed in this week's check because their official pages could not be loaded.
