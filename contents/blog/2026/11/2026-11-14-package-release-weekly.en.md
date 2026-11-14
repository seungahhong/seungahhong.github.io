---
layout: post
title: Weekly Package Releases — 2026-11-14
date: 2026-11-14
published: 2026-11-14
category: Weekly Releases
tags: []
comments: true
github: ''
---

## ✍️ TL;DR

Node.js shipped security releases on all three LTS lines (26, 24, 22) fixing several High-severity HTTP/2 and TLS CVEs, and Grafana (6 CVEs), Gradle (3 advisories, one rated Critical) and Podman (3 CVEs) also shipped security fixes. Rust 1.100.0 stabilizes the never type (`!`) and the custom allocator API, and Kyverno 1.20.0 contains commits that remove the legacy `kyverno.io` policy engine, so check before upgrading.

## This Week at a Glance

The period is 2026-11-07 to 2026-11-14 (KST). Of the 87 tracked packages, we confirmed changes in 35. Versions already covered in last week's post (Angular 22.2.5, Tailwind CSS 4.3.5, Nx 24.0.5, Istio 1.31.4 and 1.30.8) are not repeated even though they fall on the period boundary.

GitHub release pages were again unreadable this week. For packages with a CHANGELOG or in-repo release notes we read that file; for the rest we read the commit history (commit titles) up to the new tag. Packages summarized from commit history are marked `None` under `Release notice`, and we could not confirm whether they contain breaking changes (changes that require you to modify existing code).

| Package | Version | Release notice | Changes |
|---|---|---|---|
| Node.js | v26.13.1 · v24.22.3 · v22.23.5 (all LTS) | [Yes](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V26.md) | HTTP/2 and TLS security fixes (many CVEs, including High) |
| astro | 7.4.12 (5 patches) | [Yes](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) | Stricter `security.allowedDomains` header validation, lower build memory |
| Zed | v1.28.1 · v1.28.0 | None | Agent compaction billing fix, branch search in worktree picker |
| pnpm | v12.21.0 · v12.20.0 · v12.19.0 · v11.28.12 | None | Many peer resolution fixes, rejects unsafe `PNPM_HOME` |
| 🔺 Major Electron | v45.3.2 (3 patches) · v44.11.3 (4 patches) · v43.8.10 (3 patches) | None | Blocks revoked eMudhra intermediates, flushes cookies before quit |
| Oxfmt | v0.78.0 | None | Less output fixes, TS in Astro formatted as TSX |
| Oxlint | v1.93.0 | None | `--fix` removes unused `oxlint-disable` directives |
| 🔺 Major TinyBase | v10.1.0 | [Yes](https://github.com/tinyplex/tinybase/blob/main/site/guides/20_releases.md) | WsServer client authorization, less sync data |
| Next.js | v16.4.6 | None | Automatic route handler compression, Turbopack GC fixes |
| 🔺 Major Nx | 24.0.6 · 23.3.2 | None | Private temp/cache directories, task output loss fix |
| FastAPI | 0.162.7 (7 patches) | [Yes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md) | Drops Python 3.10 (breaking), dependency cleanup on cancellation |
| Grafana | 13.3.1 · 13.2.6 · 13.1.10 · 13.0.13 | [Yes](https://github.com/grafana/grafana/blob/main/CHANGELOG.md) | 6 CVE security fixes |
| Homebrew | 7.0.13 | None | Adds `uninstall` dry-run option |
| Vite | v8.3.8 (2 patches) · v8.2.6 · v8.1.7 · v7.3.8 · v6.4.6 | [Yes](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md) | Virtual module id escaping, CSS and Windows fixes |
| Angular | 22.2.6 | [Yes](https://github.com/angular/angular/blob/main/CHANGELOG.md) | Memory leak, hydration, forms and router fixes |
| ESLint | v10.15.0 | [Yes](https://github.com/eslint/eslint/blob/main/CHANGELOG.md) | Wider rule coverage, avoids `minimatch` CVE |
| Hono | v4.13.18 (2 patches) | None | JSX attribute escaping, cookie prefix check fix |
| Kyverno | v1.20.0 | None | Legacy policy engine removed, OCI CLI commands |
| Prettier | 3.10.0 · 3.10.1 | [Yes](https://github.com/prettier/prettier/blob/main/website/blog/2026-11-11-3.10.0.md) | Official `@prettier/plugin-yuku`, new Flow syntax |
| Rspack | v2.3.2 | None | Prunes dynamic imports from unused exports, lower memory |
| Turborepo | v2.11.11 | None | Task hash and log in `turbo query`, honors `NO_PROXY` |
| Visual Studio Code | 1.146.0 · 1.145.3 | None | MCP and workspace trust hardening, `/automate` skill |
| Biome | v2.6.7 | [Yes](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md) | Many new nursery rules, plugin `semantic()` removed |
| Dragonfly | v2.5.4 | None | HttpOnly manager JWT cookie, stricter preheat validation |
| Go | go1.27.4 · go1.26.11 | None | Stricter cgo/linker flag validation, HTTP/1 server crash fix |
| Gradle | 9.9.1 · 8.14.7 | [Yes](https://github.com/gradle/gradle/blob/v9.9.1/platforms/documentation/docs/src/docs/release/notes.md) | 3 security advisories (including Critical 9.3) |
| Jotai | v3.0.2 | None | Unmount on dependency removal, `freezeAtom` circular refs |
| ollama | v0.40.16 | None | Claude Code launch fix, CUDA 13.5 on Windows ARM64 |
| Podman | v6.2.0 · v5.8.10 | [Yes](https://github.com/podman-container-tools/podman/blob/v6.2.0/RELEASE_NOTES.md) | 3 CVEs, `push --platform`, WSL systemd |
| React Native Skia | v3.10.1 · v3.10.0 · v3.9.2 | None | Skia m158, `drawShapes`, render thread fixes |
| Rolldown | v1.3.2 (2 patches) · v1.2.19 · v1.1.8 · v1.0.5 | [Yes](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md) | Error stub escaping, CJS `__dirname` |
| Rust | 1.100.0 | [Yes](https://github.com/rust-lang/rust/blob/1.100.0/RELEASES.md) | Never type and custom allocators stabilized |
| Storybook | v10.6.7 | [Yes](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md) | init supports prerelease community frameworks |
| Terraform | v1.17.2 | [Yes](https://github.com/hashicorp/terraform/blob/v1.17.2/CHANGELOG.md) | `destroy=false` cycle fix |
| Vue Router | 5.5.1 · 5.5.0 · 4.6.5 | [Yes](https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md) | Scroll positions in sessionStorage, experimental API breaking |

## Changes by Package

### Node.js v26.13.1 · v24.22.3 · v22.23.5

A JavaScript runtime.

**What changed** — All three lines are security releases. High-severity fixes cover HTTP/2 streams leaking headers and buffers on removal or not detecting streams abandoned by nghttp2, nested HTTP parser execution from empty writes, TLS resumption or renegotiation changing SNI and resumption being allowed for mTLS, and a remotely reachable TLS server crash (26 and 24 lines). Medium and Low fixes include an ALTSVC buffer overflow, proxy credentials appearing in invalid proxy URL errors, and recursive `fs.watch` leaking denied descendants under the permission model. 26.13.1 is labeled as the 'Lithium' LTS line.

**What to check when upgrading** — If you run HTTP/2 or TLS servers directly, upgrade right away. These are security fixes within the same patch series and no API changes are listed.

Release notice: [CHANGELOG_V26](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V26.md)

### astro 7.4.12

A JavaScript web framework.

**What changed** — 7.4.11 changes `security.allowedDomains` to validate `X-Forwarded-Proto`, `X-Forwarded-Host` and `X-Forwarded-Port` together against each entry instead of separately, and fixes accepting non-HTTP(S) protocol values such as `ftp` or `ws`. It also fixes `astro build` deleting the Vite `build.license` file and returns 400 instead of 500 for malformed percent-encoded paths. 7.4.9 fixes bundled scripts being blocked under `strictDynamic` CSP, and 7.4.12 reduces content collection memory use during builds.

**What to check when upgrading** — If you use `security.allowedDomains` behind a proxy, forwarded header values may no longer apply unless the entry lists the port and protocol, so review your configuration.

Release notice: [CHANGELOG](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

### Zed v1.28.1 · v1.28.0

A fast code editor written in Rust.

**What changed** — According to the commit history, agent conversation compaction was being billed as uncached input tokens and is now fixed, and ACP v2 supports background work. The worktree picker also searches by branch name, and submenus and popovers open on the side that has room. Windows SSH remotes with Nushell as the default shell, a Vim visual-block hang and duplicated document color inlays were also fixed.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes.

Release notice: None

### pnpm v12.21.0 · v12.20.0 · v12.19.0 · v11.28.12

A Node.js package manager.

**What changed** — According to the commit history, this week is mostly peer dependency resolution fixes. Required peer pins drifting across repeat installs, peer providers being lost in dependency cycles and diamond structures, and duplicate identically resolved peers were fixed. Unsafe `PNPM_HOME` values are rejected, and setup supports PowerShell as the shell on Linux and macOS. Features for the `pnpr` registry server (token lifetimes, audit records and more) also grew.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes. Peer resolution changed, so look over the lockfile diff after upgrading.

Release notice: None

### 🔺 Major Electron v45.3.2 · v44.11.3 · v43.8.10

A platform for building desktop apps with web technologies.

**What changed** — According to the commit history, all three lines block the revoked eMudhra RSA intermediate certificates and limit webRequest redirects across loader restarts to avoid crashes. 45.x flushes cookie stores to disk before quitting, supports `chrome.storage.managed` in extensions, and rejects `net.fetch` when the upload body stream errors. 44.x adds `Menu.setHighlightColors()` for Windows.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes. If you move to the 45 line, which is a major above the baseline (44), check the official guidance separately.

Release notice: None

### Oxfmt v0.78.0

A JS/TS formatter written in Rust.

**What changed** — According to the commit history, TypeScript inside Astro files is formatted as TSX, and Less `~` escapes and `%` selectors print correctly. Multiline JSDoc default values and line terminators, whitespace-only TOML documents and empty GraphQL documents are also handled.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes. Less and Astro formatting output may change.

Release notice: None

### Oxlint v1.93.0

A JS/TS linter written in Rust.

**What changed** — According to the commit history, `--fix` now removes unused `oxlint-disable` directives, and `react/exhaustive-deps` suggests removing unnecessary dependencies. `promise/prefer-catch` gained a suggested fix, and false positives and panics in several rules such as `unicorn/no-useless-undefined` and `eslint/no-lone-blocks` were fixed.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes. If CI runs `--fix`, it may now delete disable directives.

Release notice: None

### 🔺 Major TinyBase v10.1.0

A reactive data store for local-first apps.

**What changed** — You can pass `authorize`, `canWriteCell` and `canWriteValue` functions to `createWsServer`, so the server decides which clients may use a path and what they may write. Synchronization sends much less data, and many reliability fixes landed, such as convergence after reconnecting and loading while saving. `persister-postgres` now requires Postgres.js v4 or later, and `schematizer-effect` requires Effect v4 or later.

**What to check when upgrading** — If you use Postgres.js or Effect, upgrade those dependencies to v4 and check the API changes in those libraries themselves (such as the removal of `sql.array()` and the new argument shape of `Schema.Union`).

Release notice: [Releases guide](https://github.com/tinyplex/tinybase/blob/main/site/guides/20_releases.md)

### Next.js v16.4.6

A server-rendering React framework.

**What changed** — According to the commit history, route handler responses that are not already compressed are now compressed automatically, and Turbopack GC fixes landed. The Tailwind version in `create-next-app` is pinned to 4.3.3.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes. If your route handlers handle compression themselves, check the response headers.

Release notice: None

### 🔺 Major Nx 24.0.6 · 23.3.2

A monorepo build system.

**What changed** — According to the commit history, temp installs, caches and data directories are now private to the current user, and run-commands output written right before a command exits is no longer lost (23.3.2 also flushes task output before exit). package.json script bodies are hashed when targets set their own inputs, and `bun` and `bun:` imports are treated as builtin modules. `build-storybook` rebuilds when stories or Storybook config change.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes. Hashing changed, so the cache may be invalidated on the first run.

Release notice: None

### FastAPI 0.162.7

A Python web framework.

**What changed** — 0.162.6 drops support for Python 3.10 (a breaking change). 0.162.3 adds Python 3.15 support, and 0.162.4 requires AnyIO 4.1.0 or newer at runtime. 0.162.5 and 0.162.7 fix cleanup code of sync and async `yield` dependencies not running properly when a request is cancelled.

**What to check when upgrading** — If you run on Python 3.10, upgrade Python before moving to 0.162.6 or later.

Release notice: [release-notes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md)

### Grafana 13.3.1 · 13.2.6 · 13.1.10 · 13.0.13

A metrics dashboard.

**What changed** — All four lines fix CVE-2026-102589, CVE-2026-107509, CVE-2026-110992, CVE-2026-111024, CVE-2026-13721 and CVE-2026-14242. The CHANGELOG lists only the numbers, not what was at risk. 13.3.1 also includes 2026 time zone updates and allows same-host URL changes for Provisioning repositories.

**What to check when upgrading** — Move to the latest patch of the line you run. Check the official security advisories for the impact of each CVE.

Release notice: [CHANGELOG](https://github.com/grafana/grafana/blob/main/CHANGELOG.md)

### Homebrew 7.0.13

A macOS package manager.

**What changed** — According to the commit history, `brew uninstall` gains a dry-run option that previews unlink and autoremove targets before removing anything. Outdated reports skip disabled packages, `bundle` honors tap-qualified formulae and casks, and invalid alias receipts are handled.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes.

Release notice: None

### Vite v8.3.8 · v8.2.6 · v8.1.7 · v7.3.8 · v6.4.6

A frontend build tool.

**What changed** — All maintenance lines shipped together on November 9. 7.3.8 and 6.4.6 escape ids when resolving virtual modules, and the 8.x lines pick up the Rolldown patches released the same day. 8.3.8 rejects CSS entrypoints when `build.cssCodeSplit: false`, emits assets referenced by inline workers in bundled dev mode, and imports sass once instead of per file for speed.

**What to check when upgrading** — The CHANGELOG lists no advisory or CVE number, but since the fix shipped on several lines at once, we recommend moving to the latest patch of your line.

Release notice: [CHANGELOG](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

### Angular 22.2.6

A JavaScript framework.

**What changed** — A memory leak in the animations renderer and closure and reference retention leaks in core were fixed, and map access during hydration and listener cleanup after event replay were hardened. Forms flush debounced values when a field is touched and prevent duplicate `valueChanges`, and the router no longer reloads the page when restoring the URL with the Navigation API. Empty arrays are omitted from `HttpParams`, and tree-shaking around `httpResource` improved.

**What to check when upgrading** — This release is safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md)

### ESLint v10.15.0

A JavaScript code analysis tool.

**What changed** — `func-names` now checks `__proto__` and assignment targets, and `accessor-pairs`, `no-invalid-this` and `no-shadow` recognize more syntax. The `no-useless-rename` and `no-unneeded-ternary` autofixes now preserve type modifiers and necessary parentheses. ESLint requires `minimatch@11.0.1` or higher to avoid CVE-2026-118764.

**What to check when upgrading** — Rule coverage is wider, so new warnings may appear.

Release notice: [CHANGELOG](https://github.com/eslint/eslint/blob/main/CHANGELOG.md)

### Hono v4.13.18

A web framework for the edge.

**What changed** — According to the commit history, JSX now escapes element and object attribute values and no longer renders ref objects as attributes, and ErrorBoundary adds the CSP nonce to every script it generates. Cookie `__Secure-` and `__Host-` prefixes are matched case-insensitively, and non-ASCII header values in AWS Lambda API Gateway v2 events are sanitized. ETag, Server-Timing and Accept handling fixes are included too.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes. The JSX attribute escaping looks like a security-related fix, so we recommend upgrading if you use Hono JSX.

Release notice: None

### Kyverno v1.20.0

A Kubernetes policy engine.

**What changed** — According to the commit history, it includes commits that delete the legacy `kyverno.io` policy engine and Go API and remove legacy policy execution from the admission, background and reports controllers. The CLI gains `kyverno oci inspect`, `resolve` and `validate` plus output file options for `apply`, and MutatingPolicy supports JSON document mutation. jmesPath projections in globalContext are deprecated and a CEL expression field was added.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm the scope of breaking changes. If you use legacy ClusterPolicy or Policy resources, be sure to read the official migration guidance before upgrading.

Release notice: None

### Prettier 3.10.0 · 3.10.1

A code formatter.

**What changed** — A new official plugin, `@prettier/plugin-yuku`, built on the Zig-based Yuku toolchain, was added, along with support for new Flow syntax and the Structs, Import Sync and Deferred re-exports proposals. There are many fixes, such as unstable comment placement, missing parentheses around `TSInstantiationExpression` and stack overflows on long binary expressions, and performance on comment-heavy files improved. 3.10.1 fixes an error on empty GraphQL selection sets that contain only comments.

**What to check when upgrading** — Formatting output may shift slightly, so it is best to commit the full formatting diff in one go after upgrading.

Release notice: [3.10.0 release post](https://github.com/prettier/prettier/blob/main/website/blog/2026-11-11-3.10.0.md)

### Rspack v2.3.2

A web bundler written in Rust.

**What changed** — According to the commit history, tree-shaking now prunes dynamic imports inside unused exports and skips side-effect-free `export *` passthrough modules. Source map memory during asset generation and hashing is lower, and the previous compilation's assets are freed during a rebuild. Circular tsconfig `extends` is reported instead of crashing, and UTF-8 BOM tsconfig files, HMR async groups and CSS counter style scoping were fixed.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes.

Release notice: None

### Turborepo v2.11.11

A JS/TS build system.

**What changed** — According to the commit history, `turbo query` exposes a task's hash and log file, and example downloads honor `NO_PROXY`. Input hashing no longer follows symlinks out of the repository, strict environment mode preserves `TMPDIR`, and creating `turbo.lock` is about 10x faster. Exit code propagation from `turbo gen` and task exclusions in dependencies were also fixed.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes.

Release notice: None

### Visual Studio Code 1.146.0 · 1.145.3

A code editor.

**What changed** — According to the commit history, 1.145.3 is a hardening patch. It validates MCP install link inputs and SSE endpoints, blocks `__proto__` segments in dotted-key expansion, fixes injection through the notebook font size, and requires trust for network workspaces. 1.146.0 is the monthly release and adds a built-in `/automate` skill, chat pinning state shared across windows and a `markdownImages.allowedOrigins` editor option, among others.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes. Opening a workspace on a network path may now show a trust prompt.

Release notice: None

### Biome v2.6.7

A frontend toolchain (formatter and linter).

**What changed** — More than 20 nursery rules were added, including `noInvalidFetchOptions`, `useGlobalRegexInMatchAll`, `noDisabledAttribute` and `useConsistentBooleanName`. JavaScript plugins gain a `grit()` query that selects nodes with a GritQL pattern, while the `semantic()` query function was removed in favor of `ast(..., { semantic: true })`. Markdown formatting of block quotes, tables and task lists and false positives in several rules were fixed, and Biome now reports an error instead of silently skipping configured plugins that are unavailable.

**What to check when upgrading** — If your own Biome plugins use `semantic()`, you need to update them.

Release notice: [CHANGELOG](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md)

### Dragonfly v2.5.4

A P2P file distribution and image acceleration tool.

**What changed** — According to the commit history, the manager JWT auth cookie is now HttpOnly, and OCI manifest URL parsing and preheat request handling were hardened. Registry authorization is refreshed per preheat request, multi-platform image preheat deduplication improved, and Redis credentials are encoded in URL userinfo.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes.

Release notice: None

### Go go1.27.4 · go1.26.11

A programming language.

**What changed** — According to the commit history, go1.27.4 greatly tightens cgo flag validation in `cmd/go` and the linker. It blocks flags such as `--sysroot` and `-target`, disallows local pkg-config `.pc` paths, and validates `.syso` and linker input files, and it also fixes an HTTP/1 server crash caused by a `MaxBytesReader` header race. The commit titles suggest security fixes, but we could not confirm CVE numbers. go1.26.11 shipped the same day, but we read the commit history for 1.27.4 only.

**What to check when upgrading** — Builds that pass unusual linker flags through cgo may now be rejected, so run your build once.

Release notice: None

### Gradle 9.9.1 · 8.14.7

A Java build tool.

**What changed** — Both lines are patches fixing three security advisories: version catalog values running as code in generated accessors (Critical 9.3), the Gradle client trusting the content of the daemon registry (High 8.6), and the daemon client trusting stale registry entries, which allowed port squatting (High 7.0). 9.9.1 also fixes a wrong deprecation warning that still appeared with KGP 2.4.21.

**What to check when upgrading** — Upgrade right away if you use untrusted version catalogs or build on shared machines. Use 9.9.1 on 9.x and 8.14.7 on the 8.14 line.

Release notice: [9.9.1 release notes](https://github.com/gradle/gradle/blob/v9.9.1/platforms/documentation/docs/src/docs/release/notes.md)

### Jotai v3.0.2

A React state management library.

**What changed** — According to the commit history, the last dependency of an atom is now unmounted when it is removed, and `freezeAtom` handles circular references and typed arrays.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes.

Release notice: None

### ollama v0.40.16

A tool for running open models locally.

**What changed** — According to the commit history, Claude Code routing in `launch` and retired model errors were fixed, and CUDA 13.5 was added for Windows ARM64. The MLX runner improved ripple preview and memory efficiency for some models. The OpenAI-compatible `/v1/models` returns an empty array when no models are installed, and the truncation option is forwarded in responses requests.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes.

Release notice: None

### Podman v6.2.0 · v5.8.10

A container engine.

**What changed** — Both lines fix three CVEs: untrusted image labels could trick `podman auto-update` into restarting the wrong systemd units (CVE-2026-121885), malicious images could bypass digest and signature validation (CVE-2026-111361), and a malicious container could bypass the socket deny rule in the default seccomp profile (CVE-2026-123876). 6.2.0 adds `podman push --platform`, `--validate`, `--label` and `--multiple-pods` for `kube play`, the Quadlet `Umask` key and native systemd support for WSL.

**What to check when upgrading** — Building now requires Go 1.26 or higher, and WSL requires 2.5.1 or later. Annotation-based seccomp configuration in `kube play` is deprecated and will be removed in Podman 7.0.

Release notice: [RELEASE_NOTES](https://github.com/podman-container-tools/podman/blob/v6.2.0/RELEASE_NOTES.md)

### React Native Skia v3.10.1 · v3.10.0 · v3.9.2

A 2D graphics library for React Native.

**What changed** — According to the commit history, Skia was updated to m158, and `SkShapeBlob` and `canvas.drawShapes` were added. A render thread race condition and frame pacing, Android display density tracking and TextureView buffer handling, and keeping the frame of a disposed canvas still on screen were fixed, and copies and allocations during recorder replay were reduced.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes. The Skia engine version changed, so check your rendering output once.

Release notice: None

### Rolldown v1.3.2 · v1.2.19 · v1.1.8 · v1.0.5

A JS/TS bundler written in Rust.

**What changed** — On November 9 every maintenance line received a fix that escapes module names in the error stubs generated by the Vite resolve plugin. 1.3.2 provides `__dirname` and `__filename` to CommonJS modules in Node ESM output, adds a magic-string `hires` option, and fails the build instead of hanging when a module task panics. 1.3.1 fixes bundle-output bugs such as sticky regex matching and keeping side effects when a constant is inlined.

**What to check when upgrading** — The CHANGELOG lists no CVE number. This release is safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/rolldown/rolldown/blob/main/CHANGELOG.md)

### Rust 1.100.0

A programming language.

**What changed** — The never type (`!`) is stabilized, `Infallible` is now a type alias for `!`, and the never type fallback changed to `!` on all editions. The custom allocator API, including `std::alloc::Allocator`, `Box::new_in` and `Vec::new_in`, is stabilized, along with `bool::toggle`, `Box::map` and `Arc::map`, and `core::mem::DropGuard`. `extern "custom"` and `-Cprofile-sample-use` are stabilized, and `wasm32-wasip3` is now Tier 2.

**What to check when upgrading** — The compatibility notes mention that more precise closure capture in `if let` may cause new errors, that `box` patterns are no longer syntactically allowed, and the never type fallback change, so run your build first.

Release notice: [RELEASES.md](https://github.com/rust-lang/rust/blob/1.100.0/RELEASES.md)

### Storybook v10.6.7

A UI component development tool.

**What changed** — `init` supports prerelease versions of community frameworks, and MCP publishes the composition schema a hosted Storybook actually serves.

**What to check when upgrading** — This release is safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md)

### Terraform v1.17.2

An Infrastructure as Code tool.

**What changed** — Performance and allocations improved when generating configuration from large HCP Terraform queries. A cycle caused by providers referencing a managed resource with `destroy=false` and repeated unavailable-provider schema warnings in `init` logs were fixed.

**What to check when upgrading** — This release is safe to upgrade as is.

Release notice: [CHANGELOG](https://github.com/hashicorp/terraform/blob/v1.17.2/CHANGELOG.md)

### Vue Router 5.5.1 · 5.5.0 · 4.6.5

A routing library for Vue.js.

**What changed** — 5.5.0 stores scroll positions in sessionStorage instead of `history.state` (falling back to memory on failure), makes scroll restoration triggers configurable, and prevents exponential backtracking on `.*` repeatable params. The unplugin's `definePage` works with webpack and rspack, and `defineProps()` gets route param types when `props: true`. 5.5.1 has a breaking change for `vue-router/experimental` users: matchers return `null` instead of throwing on a miss, and `MatchMiss` no longer extends `Error`. We did not read the 4.6.5 changes.

**What to check when upgrading** — If you use the experimental router, update custom matchers and any code that checks `instanceof Error` or `error.name`. Also note that scroll positions are stored in a different place.

Release notice: [CHANGELOG](https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md)

## Wrapping Up

The 4 releases left out because we could not read their changes (skipped) are ClickHouse v26.10.4.207-stable, Istio 1.32.0, Flutter 3.50.0 and Obsidian v1.15.1. New versions were confirmed, but there was no change description readable inside the repository (Flutter only links to an external blog), or the commit history was not enough to summarize them.

The 11 failed checks are official-site sources that could not be read because their hosts are blocked by the session network (`getaddrinfo ENOTFOUND`): Expo SDK, GraalVM, JDK, Android, Boundary, Cursor, GitButler, Manus, Swift, Ubuntu and Xcode.

Method: based on npm/PyPI/git tags (GitHub release bodies not accessed)
