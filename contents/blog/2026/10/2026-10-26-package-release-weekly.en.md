---
layout: post
title: Weekly Package Releases — 2026-10-26
date: 2026-10-26
published: 2026-10-26
category: Development
tags: ['release', 'packages', 'weekly']
comments: true
thumbnail: './assets/26/thumbnail.en.png'
github: ''
---

## ✍️ One-line summary

Patches that stop trusting the compromised eMudhra intermediate certificate landed across many tools at once — Electron, Deno, Bazel, Crossplane, Terraform, Argo CD and Turborepo — while Node.js (9 CVEs) and Kyverno (24 security advisories) shipped security releases. Electron 45 and Nx 24 are major releases, and a Bazel 9.x line showed up, so check for breaking changes (changes that require edits to existing code) before upgrading.

## This week at a glance

The period is 2026-10-19 to 2026-10-26 (KST). Of the 87 tracked packages, 35 had a new stable release.

| Package | Version | Release notes | Changes |
|---|---|---|---|
| Node.js | v26.12.1 · v24.22.1 · v22.23.4 | [Yes](https://github.com/nodejs/node/releases/tag/v26.12.1) | Security release fixing 9 CVEs |
| astro | 7.4.2 | [Yes](https://github.com/withastro/astro/releases/tag/astro%407.4.2) | Minimum Node.js 22.23.4, faster content sync |
| Zed | v1.25.3 (3 patches) · v1.24.4 | [Yes](https://github.com/zed-industries/zed/releases/tag/v1.25.3) | Smaller binaries, env-variable exposure fix |
| pnpm | v12.15.0 · v11.28.8 · v10.34.9 | [Yes](https://github.com/pnpm/pnpm/releases/tag/v12.15.0) | `include` setting, stricter registry metadata checks |
| 🔺 Electron | v45.0.0 · v44.9.3 · v43.8.3 · v42.11.18 | [Yes](https://github.com/electron/electron/releases/tag/v45.0.0) | Major: 32-bit removed, sync `safeStorage` methods deprecated |
| Oxfmt | v0.74.0 | [Yes](https://github.com/oxc-project/oxc/releases/tag/oxfmt_v0.74.0) | Formatter bug fixes, JSON errors rejected |
| Oxlint | v1.89.0 | [Yes](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.89.0) | Many rules promoted to recommended |
| Next.js | v16.4.3 | [Yes](https://github.com/vercel/next.js/releases/tag/v16.4.3) | Backported bug fixes |
| 🔺 Nx | 24.0.0 · 24.0.1 · 23.3.1 | [Yes](https://github.com/nrwl/nx/releases/tag/24.0.0) | Major: deprecated features removed, project naming change |
| Deno | v2.9.8 | [Yes](https://github.com/denoland/deno/releases/tag/v2.9.8) | eMudhra CA distrusted, permission check fix |
| FastAPI | 0.162.0 (10 releases) | [Yes](https://github.com/fastapi/fastapi/releases/tag/0.162.0) | Form/parameter model extensions, 2 breaking changes |
| Grafana Tempo | v3.1.1 · v3.0.5 · v2.10.10 (2 patches) | [Yes](https://github.com/grafana/tempo/releases/tag/v3.1.1) | CVEs resolved via Go updates |
| Homebrew | 7.0.11 (2 patches) | [Yes](https://github.com/Homebrew/brew/releases/tag/7.0.11) | Stricter package provenance and checksum checks |
| Vite | v8.3.5 | [Yes](https://github.com/vitejs/vite/releases/tag/v8.3.5) | Bundled dev mode and CSS `url()` bug fixes |
| Falco | 0.45.1 | [Yes](https://github.com/falcosecurity/falco/releases/tag/0.45.1) | Old-kernel install and metrics crash fixes |
| Hono | v4.13.14 | [Yes](https://github.com/honojs/hono/releases/tag/v4.13.14) | `serve-static` and path-parameter behavior fixes |
| Kyverno | v1.19.2 | [Yes](https://github.com/kyverno/kyverno/releases/tag/v1.19.2) | 24 security advisories fixed |
| OpenSearch | 3.9.0 · 2.19.7 | [Yes](https://github.com/opensearch-project/OpenSearch/releases/tag/3.9.0) | New APIs, 2 CVEs fixed |
| Turborepo | v2.11.10 | [Yes](https://github.com/vercel/turborepo/releases/tag/v2.11.10) | Windows hang fix, eMudhra CA distrusted |
| Argo CD | v3.5.6 · v3.4.12 · v3.3.18 (2 patches) | [Yes](https://github.com/argoproj/argo-cd/releases/tag/v3.5.6) | SOCKS5 SSH fetch fix, CA security fix |
| 🔺 Bazel | 9.3.1 · 8.8.2 · 7.7.2 | [Yes](https://github.com/bazelbuild/bazel/releases/tag/9.3.1) | Revoked root CAs removed |
| Biome | v2.6.3 | [Yes](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fbiome%402.6.3) | Many nursery rules added, summary output moved to stderr |
| celld | v0.6.3 | [Yes](https://github.com/denoland/celld/releases/tag/v0.6.3) | rustls security fix, cells with lost ownership records refused |
| Consul | v2.1.0 | [Yes](https://github.com/hashicorp/consul/releases/tag/v2.1.0) | Includes breaking changes such as the nftables switch |
| Crossplane | v2.4.3 · v2.3.7 · v2.2.7 · v1.20.14 | [Yes](https://github.com/crossplane/crossplane/releases/tag/v2.4.3) | Go 1.26.10, eMudhra root removed |
| Gradle | 9.8.2 | [Yes](https://github.com/gradle/gradle/releases/tag/v9.8.2) | Java 27 support and more |
| ollama | v0.40.11 (4 patches) | [Yes](https://github.com/ollama/ollama/releases/tag/v0.40.11) | Speech generation, new models |
| React Native Skia | v3.8.0 · v3.7.4 (5 patches) · v2.15.2 | [Yes](https://github.com/wcandillon/react-native-skia/releases/tag/v3.8.0) | `SkiaPictureView` removed |
| Rolldown | v1.2.15 | [Yes](https://github.com/rolldown/rolldown/releases/tag/v1.2.15) | `isBundled` option, output comment format changed |
| Rstest | v0.12.4 | [Yes](https://github.com/web-infra-dev/rstest/releases/tag/v0.12.4) | Screenshot tests in browser mode |
| Spring AI | v2.0.2 | [Yes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.2) | Observability and MCP improvements, bug fixes |
| Spring Modulith | 2.1.2 · 2.0.9 · 1.4.14 | [Yes](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.2) | Event publication and test bug fixes |
| Spring Vault | 4.1.1 | [Yes](https://github.com/spring-projects/spring-vault/releases/tag/4.1.1) | `RestClientAdapter` POST body loss fixed |
| Storybook | v10.6.4 (2 patches) | [Yes](https://github.com/storybookjs/storybook/releases/tag/v10.6.4) | Vitest 5 support, Jest loader fix |
| Terraform | v1.17.0 · v1.16.7 | [Yes](https://github.com/hashicorp/terraform/releases/tag/v1.17.0) | Variables in provider requirements, Policy GA |

## Changes by package

### Node.js v26.12.1 · v24.22.1 · v22.23.4

The runtime that executes JavaScript on servers.

**What changed** — The Current line v26.12.1 and the LTS line v24.22.1 are security releases fixing 9 CVEs. The High-severity items make TLS reject non-canonical IP address forms and fix an IP normalization regression, validate null bytes in DNS resolve input, and fix Brotli-related issues; Medium covers the HTTP agent data guard and cache randomization reset between snapshots; Low covers the zlib ZIP header cache, fs permission wildcards and the `realpathSync` permission check. Root certificates moved to NSS 3.131.1, c-ares to 1.34.9, and TLS now rejects certificate chains containing blocked public keys. The maintenance line v22.23.4 received the same set of security fixes.

**What to check when upgrading** — The notes list no breaking changes, but connections that were previously accepted may now be rejected (TLS, non-canonical IPs, certificate chains), so verify outbound connections after upgrading. These are security patches, so LTS users should upgrade soon.

Release notes: [v26.12.1](https://github.com/nodejs/node/releases/tag/v26.12.1) · [v24.22.1](https://github.com/nodejs/node/releases/tag/v24.22.1) · [v22.23.4](https://github.com/nodejs/node/releases/tag/v22.23.4)

### astro 7.4.2

A JavaScript web framework.

**What changed** — A patch release that raises the minimum supported Node.js to 22.23.4. With `experimental.collectionStorage: "chunked"`, content sync is much faster — from 60 seconds to under 1 second for about 44,000 entries. Fixes include a node-fetch error with the Cloudflare adapter and `astro dev`, a stale lock file that stopped unrelated processes, i18n types for `defaultLocale`, `fallback` and `domains`, a `server:defer` island error, and invalid JS generated from env values containing `$`.

**What to check when upgrading** — Confirm Node.js is 22.23.4 or later. Otherwise it is safe to upgrade as is.

Release notes: [astro@7.4.2](https://github.com/withastro/astro/releases/tag/astro%407.4.2)

### Zed v1.25.3 · v1.24.4

A fast code editor written in Rust.

**What changed** — v1.25.2 shrank binaries by about 33% on macOS, 28% on Windows and 7% on Linux, added GPT-6 Astra, Claude Fable 5.1 and Claude Opus 5.5 models on Amazon Bedrock, external agent (ACP) session notifications and context compaction, double-click editing of inlay hints, and faster SSH connections. As a security fix, environment variables and secrets passed to external agents and MCP servers on remote projects no longer show up in the local process list. v1.25.3 is a patch containing only dependency updates responding to software-ecosystem vulnerabilities, and v1.24.4 fixes OpenCode models failing to load because of a missing `npm` field.

**What to check when upgrading** — No breaking changes are listed. Safe to upgrade as is.

Release notes: [v1.25.3](https://github.com/zed-industries/zed/releases/tag/v1.25.3) · [v1.24.4](https://github.com/zed-industries/zed/releases/tag/v1.24.4)

### pnpm v12.15.0 · v11.28.8 · v10.34.9

A Node.js package manager.

**What changed** — v12.15.0 adds an `include` field to split configuration across files, `lockfile.integrityTarget: tar` with tar registry support, zstd response handling, and `SOURCE_DATE_EPOCH` support for `deploy` and `install`. It rejects registry metadata for a different package name and speeds up workspace installs and macOS linking. v11.28.8 bundles Node.js 26.12.1 in the standalone build, because the earlier 26.0.0 still trusted an intermediate CA that Node.js had decided to distrust. v11.28.7 applies `trustPolicy` and adds `maxTarballUnpackedSize` (default 4 GiB), and v10.34.9 records the pinned pnpm version from `packageManager` in a new `pnpm-lock.yaml` so later `--frozen-lockfile` installs succeed.

**What to check when upgrading** — No breaking changes are marked, but registry metadata validation is stricter, so if you use a private registry make sure installs still succeed.

Release notes: [v12.15.0](https://github.com/pnpm/pnpm/releases/tag/v12.15.0) · [v11.28.8](https://github.com/pnpm/pnpm/releases/tag/v11.28.8) · [v10.34.9](https://github.com/pnpm/pnpm/releases/tag/v10.34.9)

### 🔺 Major Electron v45.0.0 · v44.9.3 · v43.8.3 · v42.11.18

A platform for building desktop apps with web technology.

**What changed** — v45.0.0 ships Chromium 156.0.8078.48, Node v24.22.0 and V8 15.6. It adds a MenuItem `badge` on macOS 14+, a cross-platform window state save/restore API, `app.configureWebAuthn()` for iCloud Keychain passkeys, and a Windows Error Reporting helper. v44.9.1 is a security fix responding to the compromised eMudhra intermediate certificate (GHSA-jr5w-w6x2-84p9), and v44.9.3 and v43.8.3 are patches backporting ANGLE, Chromium, PDFium, Skia and V8 fixes. The v42.11.18 notes warn that Electron 42 has reached end of support.

**What to check when upgrading** — The breaking changes in v45 are removal of 32-bit builds, deprecation of synchronous `safeStorage` methods (scheduled for removal in v46), and a change in how screen-capture permission is reported. Check whether you support 32-bit, call `safeStorage` synchronously, or rely on screen-capture permission handling. (Only part of the v45.0.0 notes was reviewed.)

Release notes: [v45.0.0](https://github.com/electron/electron/releases/tag/v45.0.0) · [v44.9.3](https://github.com/electron/electron/releases/tag/v44.9.3) · [v43.8.3](https://github.com/electron/electron/releases/tag/v43.8.3) · [v42.11.18](https://github.com/electron/electron/releases/tag/v42.11.18)

### Oxfmt v0.74.0

A JavaScript/TypeScript formatter.

**What changed** — Mostly formatter bug fixes, covering YAML, Markdown, JSDoc, TOML, BOM handling in config files, comment placement, parentheses and Vue bindings. JSON now rejects invalid input with an error instead of silently dropping it, and there are some performance improvements and docs updates.

**What to check when upgrading** — After upgrading, review the formatting diff and check for new JSON errors.

Release notes: [oxfmt v0.74.0](https://github.com/oxc-project/oxc/releases/tag/oxfmt_v0.74.0)

### Oxlint v1.89.0

A JavaScript/TypeScript linter (code checker).

**What changed** — Many rules in the Vue 3, React, Promise, Node, Next.js, JSX a11y, JSDoc, Jest/Vitest, import, unicorn, TypeScript and ESLint plugin families were promoted to recommended. Bugs in some ESLint and unicorn rules were fixed and `react/jsx-key` is faster. There is also a breaking change in how lone surrogates (unpaired Unicode code units) are preserved in static property and member names.

**What to check when upgrading** — The recommended promotions may produce new warnings, so review your lint results.

Release notes: [oxlint v1.89.0](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.89.0)

### Next.js v16.4.3

A server-rendering React application framework.

**What changed** — A backport release containing only bug fixes: handling of Google Font URLs without extensions (in both bundlers), the app-page runtime being loaded in `proxy.ts`, a revert of the Turbopack loader invalidation fix, keeping the OpenTelemetry request trace integration, and avoiding loading standalone React during server bootstrap.

**What to check when upgrading** — Safe to upgrade as is.

Release notes: [v16.4.3](https://github.com/vercel/next.js/releases/tag/v16.4.3)

### 🔺 Major Nx 24.0.0 · 24.0.1 · 23.3.1

A monorepo build system.

**What changed** — 24.0.0 adds Angular 22.2 support and makes the dev server wait for readiness by default. Deprecated features such as the SCAM generator, Module Federation, the Remix generator/executor and Gradle plugin-v1 were removed. 24.0.1 fixes about 24 issues involving the daemon, dev server readiness detection, caching, Rspack, Angular Rspack, Maven and Storybook, and 23.3.1 is a single fix that lets Angular packages declare Vitest 5 as a peer.

**What to check when upgrading** — The breaking changes are the change to inferred project naming, handing typecheck over to `@nx/js/typescript`, and making the dotnet restore target opt-in. Check whether you use removed features, whether task references break because of project renames, and whether your typecheck setup is still correct.

Release notes: [24.0.0](https://github.com/nrwl/nx/releases/tag/24.0.0) · [24.0.1](https://github.com/nrwl/nx/releases/tag/24.0.1) · [23.3.1](https://github.com/nrwl/nx/releases/tag/23.3.1)

### Deno v2.9.8

A TypeScript/JavaScript runtime.

**What changed** — Compiled binaries now check read permission for local files loaded with dynamic import, and bare `deno run` supports zsh completion. hyper and hyper-util were updated to resolve an fetch idle-interval problem, and fixes cover the napi boundary and exception handling, X.509v1 certificate handling aligned with OpenSSL, `mock.reset()` improvements, and npm package link name validation. The compromised eMudhra CA is now distrusted and the rand 0.9.x security update is included.

**What to check when upgrading** — No breaking changes are mentioned. If you use dynamic import in compiled binaries, check that the new read-permission check does not change behavior.

Release notes: [v2.9.8](https://github.com/denoland/deno/releases/tag/v2.9.8)

### FastAPI 0.157.0 to 0.162.0

A Python web framework.

**What changed** — Ten minor releases shipped this week (0.157.0–0.162.0); each has a different minor, so they are not collapsed. Most extend form models and query/header/cookie parameter models — combining them and using them as optional or union types — keep form media types in the OpenAPI output, and fix the schema of nullable form unions.

**What to check when upgrading** — There are two breaking changes. From 0.162.0, omitted `bool` and `bool | None` form fields no longer become `False`; they use the declared default or raise a missing-required error. From 0.160.0, a parameter model's `extra` setting applies to every field submitted in the same location, including fields declared elsewhere.

Release notes: [0.162.0](https://github.com/fastapi/fastapi/releases/tag/0.162.0) · [0.160.0](https://github.com/fastapi/fastapi/releases/tag/0.160.0)

### Grafana Tempo v3.1.1 · v3.0.5 · v2.10.10

A distributed tracing backend.

**What changed** — All three lines are security patches. v3.1.1 updates Go to 1.27.3 and resolves several CVEs; v3.0.5 and v2.10.10 fix CVE-2026-111943 with Go 1.26.10. v2.10.9 (the earlier of the two 2.10 patches) fixed many CVEs through Go 1.26.9 and updates to golang.org/x/net, grpc and OpenTelemetry.

**What to check when upgrading** — These are rebuilt-binary security patches; move to the latest patch of the line you use.

Release notes: [v3.1.1](https://github.com/grafana/tempo/releases/tag/v3.1.1) · [v3.0.5](https://github.com/grafana/tempo/releases/tag/v3.0.5) · [v2.10.10](https://github.com/grafana/tempo/releases/tag/v2.10.10)

### Homebrew 7.0.11

A package manager for macOS/Linux.

**What changed** — 7.0.11 (about 43 changes) centers on security and verification. It verifies API formula patch downloads, makes official formula provenance verification mandatory, and honors checksums declared in casks. New casks need a `zap` stanza, and new casks that require Rosetta are rejected. 7.0.10 (about 50 changes) added trust for tap redirects, stricter bottle attestation (build provenance) verification, vulnerability-aware package management, protection of Brewfile formulae during cleanup, and mandatory livecheck for new packages.

**What to check when upgrading** — If you maintain your own taps or casks, check the `zap` stanza and checksum requirements. Regular users can upgrade as is.

Release notes: [7.0.11](https://github.com/Homebrew/brew/releases/tag/7.0.11) · [7.0.10](https://github.com/Homebrew/brew/releases/tag/7.0.10)

### Vite v8.3.5

A frontend build tool.

**What changed** — Mostly bug fixes. Build (chunk import maps, preload dependencies) and bundled dev mode (server origin in asset URLs, UTF-8 fallback page, `import.meta.env` define, source-map error stacks, HMR propagation) were fixed, as were CSS `url()` handling, optimizer lockfile hashing, subpath imports and socket error handling. Internal cleanups such as source-map performance work and an Oxlint migration are included.

**What to check when upgrading** — No new features or breaking changes. If you use bundled dev mode or CSS `url()`, just verify behavior after upgrading.

Release notes: [v8.3.5](https://github.com/vitejs/vite/releases/tag/v8.3.5)

### Falco 0.45.1

A cloud-native runtime security tool.

**What changed** — On kernels without modern eBPF support (for example kernel 5.4 on Ubuntu 20.04), deb/rpm packages no longer stay half-configured. `file_output`'s `keep_alive` reopens the file at the next alert after a write failure (such as a full disk) and keeps writing. A crash caused by a race between Prometheus metrics scraping and event processing was fixed, and Falco no longer exits when a watched file disappears during a rules reload.

**What to check when upgrading** — Recommended if you run older kernels. Otherwise safe to upgrade as is.

Release notes: [0.45.1](https://github.com/falcosecurity/falco/releases/tag/0.45.1)

### Hono v4.13.14

A web framework for edge environments.

**What changed** — A patch with 17 changes, mostly bug fixes. `serve-static` handles only GET/HEAD and honors `Accept-Encoding` q-values for precompressed files. Regex parameters in `basePath()` now match the router, duplicate path parameters keep the first value, and `getPath` is not allowed when strict is false. JSX `cloneElement` preserves self-closing void elements, Bearer auth's `MessageFunction` can return a `Response`, and the hono peer range allows v5 prereleases.

**What to check when upgrading** — Check the `serve-static` method restriction and the changed path-parameter behavior.

Release notes: [v4.13.14](https://github.com/honojs/hono/releases/tag/v4.13.14)

### Kyverno v1.19.2

A Kubernetes policy engine.

**What changed** — A release fixing 24 published security advisories (9 Critical, 14 High, 1 Moderate). It includes script-injection hardening, API path and namespace restrictions, image verification, CEL cost limits and generate protections. There are also performance, CI and dependency updates; individual CVE numbers could not be confirmed.

**What to check when upgrading** — Given the number of security fixes, upgrading soon is recommended. Policy and RBAC behavior may change, so confirm after upgrading that existing policies still apply as before.

Release notes: [v1.19.2](https://github.com/kyverno/kyverno/releases/tag/v1.19.2)

### OpenSearch 3.9.0 · 2.19.7

A distributed search engine.

**What changed** — 3.9.0 adds a DELETE task API for stored task results, deployment drain/finish APIs for zero-downtime node rollouts, per-action adaptive concurrency limits, virtual thread executor support, a pull-based ingestion payload decoder framework, and automatic remote store restore on node loss. Aggregation, cache and translog performance improved, and it includes a completion suggester fix (CVE-2026-63136) and a Log4j fix (CVE-2026-49844). 2.19.7 adds a hot_threads snapshot cap, a query_string nesting depth limit and a completion suggester regex state cap, disables Mustache partial resolution in search templates, and adds fs repository `base_path` validation.

**What to check when upgrading** — `RestHighLevelClient` is deprecated in 3.9.0, so plan to move to `opensearch-java`. For 2.19.7, check whether queries using search-template partials or deep query_string nesting are affected.

Release notes: [3.9.0](https://github.com/opensearch-project/OpenSearch/releases/tag/3.9.0) · [2.19.7](https://github.com/opensearch-project/OpenSearch/releases/tag/2.19.7)

### Turborepo v2.11.10

A JavaScript/TypeScript monorepo build system.

**What changed** — A patch of about 18 changes. It allows non-recursive Turbo commands in root tasks and fixes a hang at exit on Windows with pnpm batch shims. Tool-managed directories are excluded from local dependency inputs, file hashing now matches git's binary detection, and cached symlinks are restored even when output already exists. It also stops trusting the compromised eMudhra intermediate certificate.

**What to check when upgrading** — The hashing change can cause a one-time increase in cache misses. There are no other breaking changes.

Release notes: [v2.11.10](https://github.com/vercel/turborepo/releases/tag/v2.11.10)

### Argo CD v3.5.6 · v3.4.12 · v3.3.18

A Kubernetes deployment (GitOps) tool.

**What changed** — All three lines fix SSH repository fetch through a SOCKS5 proxy and the reporting of server-side diffs for fields removed by another manager, and update DOMPurify and Go. v3.5.6 also fixes gRPC SRV lookups, and v3.3.18 contains a security fix related to the eMudhra CA certificate (v3.3.17 was released the same week).

**What to check when upgrading** — Move to the latest patch of the line you use. If you fetch SSH repositories behind a proxy, check connectivity once.

Release notes: [v3.5.6](https://github.com/argoproj/argo-cd/releases/tag/v3.5.6) · [v3.4.12](https://github.com/argoproj/argo-cd/releases/tag/v3.4.12) · [v3.3.18](https://github.com/argoproj/argo-cd/releases/tag/v3.3.18)

### 🔺 Major Bazel 9.3.1 · 8.8.2 · 7.7.2

A build tool.

**What changed** — All three LTS lines remove the eMudhra and Sectigo AAA root CA certificates, whose trust was revoked after a private-key leak, from the bundled JDK. 9.3.1 additionally preserves packages of top-level alias chains when the pre-execution cache is discarded, closes the lock file channel when lock acquisition fails, and rewinds and reruns actions whose outputs were lost before download.

**What to check when upgrading** — The 9.x line has a higher major than the version this digest uses as its baseline (8.7.0). The patches themselves are backward compatible with each line (9.3.1 with 9.0.1 and later), with nothing special to check.

Release notes: [9.3.1](https://github.com/bazelbuild/bazel/releases/tag/9.3.1) · [8.8.2](https://github.com/bazelbuild/bazel/releases/tag/8.8.2) · [7.7.2](https://github.com/bazelbuild/bazel/releases/tag/7.7.2)

### Biome v2.6.3

A frontend linter/formatter toolchain.

**What changed** — A large batch of nursery (experimental) lint rules for JavaScript, CSS, Vue, Playwright and TanStack Query was added, and bugs in the JS/TS/Markdown formatters, GraphQL and CSS were fixed. The CLI default reporter's summary is now written to stderr.

**What to check when upgrading** — CI scripts that parse stdout may appear to lose the summary, so check them.

Release notes: [v2.6.3](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fbiome%402.6.3)

### celld v0.6.3

A self-operable distributed durable object.

**What changed** — Outbound TLS no longer trusts emSign ECC Root CA - G3 and the 8 eMudhra intermediate CAs whose keys were exposed. rustls was upgraded to 0.23.46, fixing acceptance of messages at encryption-level boundaries in the TLS 1.3 handshake (GHSA-2mjx-qc3c-rqvc). Nodes refuse to acquire a cell that has no ownership record but still has LTX in the bucket, logging "celld ownership record lost" at most once per 10 seconds per cell.

**What to check when upgrading** — If v0.6.2 nodes are mixed in, a v0.6.2 node may start a cell with lost ownership records as empty, so bring every node to v0.6.3. Recovery steps are in the guarantees document.

Release notes: [v0.6.3](https://github.com/denoland/celld/releases/tag/v0.6.3)

### Consul v2.1.0

A service discovery and configuration tool.

**What changed** — It adds OIDC logout, HTTP2/gRPC support in API Gateway and a feature-gate framework, and upgrades security dependencies. On the other side, Enterprise request bodies now have a default 512 KiB limit, transparent proxy moved from iptables to nftables, and token permissions for leaf certificates and health checks are stricter.

**What to check when upgrading** — This release includes breaking changes. First check that your nodes support nftables, that token ACL permissions are sufficient, and that request bodies stay under 512 KiB.

Release notes: [v2.1.0](https://github.com/hashicorp/consul/releases/tag/v2.1.0)

### Crossplane v2.4.3 · v2.3.7 · v2.2.7 · v1.20.14

A Kubernetes add-on for managing external infrastructure.

**What changed** — v2.4.3 updates Go to 1.26.10 and removes the compromised eMudhra root, stops caching truncated package downloads, fixes Usage label rewriting, and allows XR scaling for crossplane-edit/admin. v2.3.7 has the same fixes plus fail-closed claim handling when XRDs cannot be listed. v2.2.7 has the same Go, download and Usage fixes with dependency updates, and v1.20.14 is a security-only patch with Go 1.26.10 and a new distroless base image.

**What to check when upgrading** — No breaking changes. Move to the latest patch of the line you use.

Release notes: [v2.4.3](https://github.com/crossplane/crossplane/releases/tag/v2.4.3) · [v2.3.7](https://github.com/crossplane/crossplane/releases/tag/v2.3.7) · [v2.2.7](https://github.com/crossplane/crossplane/releases/tag/v2.2.7) · [v1.20.14](https://github.com/crossplane/crossplane/releases/tag/v1.20.14)

### Gradle 9.8.2

A Java build tool.

**What changed** — The release page highlights three things: Java 27 support, reuse of Maven mirror settings, and links to problem locations in build output. It does not list individual fixes and points to the release notes on docs.gradle.org.

**What to check when upgrading** — No breaking changes are visible in the notes. Follow the official release notes for the wrapper upgrade procedure.

Release notes: [9.8.2](https://github.com/gradle/gradle/releases/tag/v9.8.2)

### ollama v0.40.11 (4 patches)

A tool for running open models locally.

**What changed** — v0.40.11 supports speech generation on macOS through `ollama run` and the `/v1/audio/speech` endpoint, and adds the d3 decision model family (2B–27B). v0.40.10 added NVIDIA Nemotron 3.5 Bolt E4B (Gemma 4-based vision-language, 128K context), and v0.40.8 introduced Flint, an MoE coding model (40B total, about 2.5B active, 262K context), starting macOS-only. v0.40.9 extends Flint to Linux and Windows, reports streaming generation failures, and passes cloud model context settings to coding tools.

**What to check when upgrading** — No breaking changes. Safe to upgrade as is.

Release notes: [v0.40.11](https://github.com/ollama/ollama/releases/tag/v0.40.11)

### React Native Skia v3.8.0 · v3.7.4 · v2.15.2

A 2D graphics (Skia) library for React Native.

**What changed** — v3.8.0 fixes factory method names that repeated the namespace and removes `SkiaPictureView`. v3.7.x (5 patches) updates to Skia m157, adds an Android triple-FIFO swapchain, full refresh rate presentation on ProMotion devices, Canvas children rendering via the React 19.2 reconciler, and recorder pooling, and exposes device loss to JS. v2.15.2 is a 2.x backport fixing native view ID handling, Metal device retention and more.

**What to check when upgrading** — If you use `SkiaPictureView`, migrate off it before moving to v3.8.0.

Release notes: [v3.8.0](https://github.com/wcandillon/react-native-skia/releases/tag/v3.8.0) · [v3.7.4](https://github.com/wcandillon/react-native-skia/releases/tag/v3.7.4) · [v2.15.2](https://github.com/wcandillon/react-native-skia/releases/tag/v2.15.2)

### Rolldown v1.2.15

A JavaScript/TypeScript bundler.

**What changed** — A new `isBundled` option selects the browser external stub format, entry modules are marked in the HMR module graph, and module starts are now marked with `// <id>` comments instead of `#region`. Fixes cover `this.resolve` recursion among `skipSelf: true` plugins, external require when ssr.target is webworker, wrapping only static-specifier dynamic imports with `__vitePreload`, and eager module wrapping under strict execution order; oxc was bumped to 0.155.0.

**What to check when upgrading** — The comment format in output changed, so check any tools that depend on bundle output text.

Release notes: [v1.2.15](https://github.com/rolldown/rolldown/releases/tag/v1.2.15)

### Rstest v0.12.4

A testing framework built on Rspack.

**What changed** — Browser mode gained screenshot testing. The `toMatchScreenshot()` matcher compares an element or whole page against a baseline image and saves actual and diff images on mismatch; page screenshots default to the viewport, with a `fullPage` option. Also added: `locator.pressSequentially`, hydration support in browser-react `render`, `--trace` in the programmatic API, host-side merging of raw coverage in coverage-v8, and retries for workers killed by OOM.

**What to check when upgrading** — No breaking changes are mentioned. Safe to upgrade as is.

Release notes: [v0.12.4](https://github.com/web-infra-dev/rstest/releases/tag/v0.12.4)

### Spring AI v2.0.2

Spring's application framework for AI engineering.

**What changed** — It includes Anthropic SDK 2.72.0 and adds observability for TTS, transcription and Stability AI image models, Redis vector store metadata configuration, and a stateless MCP server customizer. Many bugs in the Cassandra, Anthropic, OpenAI, Ollama, Bedrock and Neo4j integrations were fixed, and the OpenAI SDK moved to 4.80.0 and the AWS SDK to 2.55.14.

**What to check when upgrading** — When upgrading from 2.0.1, verify the integrations above still behave correctly if you use them.

Release notes: [v2.0.2](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.2)

### Spring Modulith 2.1.2 · 2.0.9 · 1.4.14

A tool for building modular Spring Boot applications.

**What changed** — 2.1.2 makes `@ApplicationModuleTest` work in nested test classes on Spring Boot 4.2 and fixes about 15 issues including event publication resubmission, MongoDB archive mode, the staleness monitor, event hashing and AOT initializer ordering. 2.0.9 backports the same fixes to the 2.0 line and fixes a shared module listing itself as an allowed target, and 1.4.14 fixes that problem plus `WorkingDirectoryChangesDetector` failing in git submodule work trees.

**What to check when upgrading** — No breaking changes. Move to the latest patch of your line.

Release notes: [2.1.2](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.2) · [2.0.9](https://github.com/spring-projects/spring-modulith/releases/tag/2.0.9) · [1.4.14](https://github.com/spring-projects/spring-modulith/releases/tag/1.4.14)

### Spring Vault 4.1.1

Spring's secrets management library.

**What changed** — Fixes cover `RestClientAdapter` dropping POST bodies, a health status deserialization problem, a `CertificateBundle` type error, and a null value error in `SecretLeaseCreatedEvent`. Dependencies such as Spring Framework, Jackson and Bouncy Castle were also upgraded.

**What to check when upgrading** — Safe to upgrade as is.

Release notes: [4.1.1](https://github.com/spring-projects/spring-vault/releases/tag/4.1.1)

### Storybook v10.6.4 (2 patches)

A UI component development tool.

**What changed** — v10.6.3 adds Vitest 5 support and fixes an app-router mock crash with Next.js 16.4 and the `ArgsStore` return type. v10.6.4 is a single fix that skips registering the TypeScript loader hook in Jest.

**What to check when upgrading** — Safe to upgrade as is.

Release notes: [v10.6.4](https://github.com/storybookjs/storybook/releases/tag/v10.6.4) · [v10.6.3](https://github.com/storybookjs/storybook/releases/tag/v10.6.3)

### Terraform v1.17.0 · v1.16.7

An Infrastructure as Code tool.

**What changed** — v1.17.0 allows variables and locals in provider requirements, adds the `-minimal-refresh` plan option, and makes Terraform Policy generally available (GA). The init log now prints provider versions, mock providers support ephemeral resources, and panics in the `pow` and `log` functions were fixed. v1.16.7 fixes a panic when running `terraform test` against schemas with deprecated values and is built with Go 1.26.10, so it no longer trusts certificates chained through the compromised eMudhra intermediate CA.

**What to check when upgrading** — v1.17.0 adds a `format_version` field to JSON output, so check any tooling that parses it. If you stay on the 1.16 line, move to v1.16.7.

Release notes: [v1.17.0](https://github.com/hashicorp/terraform/releases/tag/v1.17.0) · [v1.16.7](https://github.com/hashicorp/terraform/releases/tag/v1.16.7)

## Wrap-up

Prerelease versions — Storybook 11.0.0 alpha, Prisma 8.0.0 RC (`rc.20`), Vitest 5.1.0 beta, Rspack 2.3.0 beta, Omarchy 4.5.0 RC and podman 6.2.0 RC — are not stable releases and were left out. ClickHouse, LogTape, GitLab, Istio, React Router, Visual Studio Code, Flutter, Go and Obsidian had releases but their notes did not let us confirm what changed, so they were left out of the body; TypeScript, Expo SDK, GraalVM, JDK, PyTorch, Android, Cursor, GitButler, Manus and Xcode were skipped this week because their official pages could not be loaded or could not be verified well enough.
