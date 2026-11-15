---
layout: post
title: Weekly Package Releases — 2026-11-16
date: 2026-11-16
published: 2026-11-16
category: Weekly Releases
tags: []
comments: true
thumbnail: './assets/16/thumbnail.en.png'
github: ''
---

## ✍️ TL;DR

Grafana 12.4.15 shipped 8 CVE security fixes for an older maintenance line, and FastAPI 0.163.0 added `Depends(max_concurrency=...)` to cap how many instances of a dependency run at once.

## This Week at a Glance

The period is 2026-11-09 to 2026-11-16 (KST). Because it mostly overlaps with the previous post (2026-11-14), versions already covered there are not repeated; only releases newly confirmed since then are included. As a result, we confirmed new changes in 4 of the 87 tracked packages.

GitHub release pages were again unreadable this week, so for packages with a CHANGELOG or in-repo release notes we read that file. React Native Skia has no release notes, so we summarized it from the commit history (commit titles) up to the new tags; it is marked `None` under `Release notice`, and we could not confirm whether it contains breaking changes (changes that require you to modify existing code).

| Package | Version | Release notice | Changes |
|---|---|---|---|
| FastAPI | 0.163.1 · 0.163.0 | [Yes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md) | `Depends(max_concurrency=...)` added, OpenAPI computed field fix |
| Grafana | 12.4.15 | [Yes](https://github.com/grafana/grafana/blob/main/CHANGELOG.md) | 8 CVE security fixes on the 12.4 line |
| Biome | v2.6.8 | [Yes](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md) | Many new nursery rules, type inference and lint performance improvements |
| React Native Skia | v3.10.2 · v2.15.5 · v2.15.4 · v2.15.3 | None | Frame pacing and `<Text>` rendering improvements, 2.x backports |

## Changes by Package

### FastAPI 0.163.1 · 0.163.0

A Python web framework.

**What changed** — 0.163.0 adds `Depends(max_concurrency=...)`, which lets you limit how many instances of a given dependency can run at the same time. If you wrap resources that should not be hit all at once, such as an external API or database connections, in a dependency, you can now cap their concurrency without writing your own semaphore code. 0.163.1 fixes the OpenAPI document being generated incorrectly when a response model contains a nested computed field.

**What to check when upgrading** — The new option is an addition that only affects places where you use it. The Python 3.10 support drop in 0.162.6, covered in the previous post, still applies, so if you are on 3.10 you need to upgrade Python first.

Release notice: [release-notes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md)

### Grafana 12.4.15

A metrics dashboard.

**What changed** — This is a release on the 12.4 maintenance line, published the same day as the 13.x releases covered in the previous post. It contains 8 security fixes: CVE-2026-102589, CVE-2026-106472, CVE-2026-106475, CVE-2026-107365, CVE-2026-107509, CVE-2026-111000, CVE-2026-81843 and CVE-2026-82014. The CHANGELOG lists only the numbers and does not say what was at risk. moment-timezone was also bumped to reflect the 2026 time zone changes.

**What to check when upgrading** — If you still run the 12.4 line, upgrade to 12.4.15. Check the official security advisories for the impact of each CVE.

Release notice: [CHANGELOG](https://github.com/grafana/grafana/blob/main/CHANGELOG.md)

### Biome v2.6.8

A frontend toolchain (formatter and linter).

**What changed** — A large batch of nursery (experimental) rules was added, including `noBufferConstructor`, `noDynamicRequire`, `noMisusedSpread`, `useSpyOn`, `noTailwindRestrictedClasses`, and rules for Vue and YAML. Type inference now narrows types after `typeof` and equality checks and evaluates conditional types such as `T extends U ? X : Y`, reducing false positives in type-aware rules. Linting files without suppression comments is up to 61% faster, and several bugs were fixed, such as the HTML formatter printing a comment twice or deleting comments after Svelte block delimiters.

**What to check when upgrading** — The new rules are nursery rules, so they have no effect unless you enable them. However, Biome now reports an error when a GritQL plugin file name contains invalid characters, so check your file names if you use plugins.

Release notice: [CHANGELOG](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md)

### React Native Skia v3.10.2 · v2.15.5 · v2.15.4 · v2.15.3

A 2D graphics library for React Native.

**What changed** — According to the commit history, v3.10.2 paces a canvas's frames with a single scheduler and holds a present for the GPU on Android, draws `<Text>` with a cached text blob, and moves CAMetalLayer color space tagging on iOS to the main thread. The 2.x line (v2.15.3 to v2.15.5) backports fixes from 3.x, including web improvements, rounding the iOS canvas size to the pixel grid, Android TextureView buffer handling, and keeping the frame of a disposed canvas.

**What to check when upgrading** — This summary is based on commit history only, so we could not confirm whether there are breaking changes. If you are still on 2.x, you can get these fixes by upgrading to v2.15.5 within the same major version.

Release notice: None

## Wrapping Up

The 3 releases left out because we could not read their changes (skipped) are Istio 1.32.0, Flutter 3.50.0 and Obsidian v1.15.1, for the same reasons as in the previous post (no change description readable inside the repository, or the commit history was not enough to summarize them).

The 11 failed checks are official-site sources that could not be read because their hosts are blocked by the session network (`getaddrinfo ENOTFOUND`): Expo SDK, GraalVM, JDK, Android, Boundary, Cursor, GitButler, Manus, Swift, Ubuntu and Xcode.

Method: based on npm/PyPI/git tags (GitHub release bodies not accessed)
