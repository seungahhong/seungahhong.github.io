---
layout: post
title: Building a Claude Code Plugin Marketplace
date: 2026-06-03
published: 2026-06-03
category: Development
tags: ['Claude', 'AI', 'Plugin']
comments: true
thumbnail: './assets/03/thumbnail.png'
github: 'https://github.com/seungahhong/seungah-claude-plugins'
---

# Overview

This document describes how to register, install, and use the Claude Code plugin marketplace.

Plugins are shared through the **seungah-claude-plugins** marketplace. It currently consists of the following four team-specific plugins.

Marketplace version: **1.4.0** · Repository: [https://github.com/seungahhong/seungah-claude-plugins](https://github.com/seungahhong/seungah-claude-plugins)

| Plugin | Description | Version |
| --- | --- | --- |
| frontend-harness | A collection of multi-agent skills, commands, and hooks that support the entire frontend development process (Research → PRD → Develop → Review → Verify). Includes parallel execution of user-selected items among 5 static analysis perspectives (simplification, PR review, security, performance, consistency) plus a re-review loop, along with E2E and type/build verification | 1.3.0 |
| harness-generator | A meta-plugin that automatically generates a domain-agnostic harness (agent team + skills + orchestrator) through a 7-step meta process | 0.1.0 |
| git-harness | Git workflow — writing Korean commit messages (`issue-number type: subject`) and multi-perspective PR reviews (review → commit → PR, all in one) | 0.2.0 |
| meta-harness | Meta-harness engineering based on a full-trace experience store. Causal diagnosis + 4-axis Pareto non-regression patches, with a user approval gate (based on arXiv 2603.28052v1) | 0.1.0 |

---

# Installation

Installation supports three methods. For sharing within a team, Method A (install after registering the marketplace) is recommended.

## Method A - Install after registering the marketplace (recommended)

This proceeds in two steps.

### Step 1. Add the marketplace

Register the marketplace registry in your local environment. This step only registers the list of available plugins; it does not activate any skills.

```shell
# seugnah-claude-plugins
/plugin marketplace add https://github.com/seungahhong/seungah-claude-plugins
```

(Note) If the marketplace cannot be added because the github clone fails,

```shell
gh auth login
```

### Step 2. Install a plugin

Select and install the plugin you want from the registered marketplace.

```shell
# Plugins in seugnah-claude-plugins
/plugin install frontend-harness@seungah-claude-plugins
```

```shell
/plugin install frontend-harness
```

You can choose from the following three installation scopes.

| Scope | Description |
| --- | --- |
| user scope | Installs globally for the user |
| project scope | Installs for all collaborators of the current repository |
| local scope | Installs only for yourself in the current repository |

## Method B - Install directly from GitHub

This method adds the marketplace directly from the GitHub repository via the CLI.

```shell
claude plugin add seungahhong/seungah-claude-plugins
```

## Method C - Install from a local path

This method installs by specifying the path of a repository cloned locally. It is useful during development and debugging.

```shell
claude --plugin-dir /path/to/frontend-harness
```

---

# Marketplace Registration Screens

Below is the process of registering the seungah-claude-plugins marketplace and installing plugins.

**Step 1. Enter the /plugin command**

Launch Claude Code and enter the /plugin command.

> /plugin command autocomplete screen

**Step 2. Add Marketplace - Enter the marketplace URL**

Select Add Marketplace and enter the marketplace repository URL.

> seungah-claude-plugins URL input screen

**Step 3. Discover - Check the list of installable plugins**

Check the list of installable plugins in the Discover tab.

> - Discover tab plugin list
> - Press space to select → press enter to proceed with installation

**Step 4. Plugin Details - Plugin details and scope selection**

When you select a plugin to install, its details are displayed. Choose the installation scope (user/project/local scope).

> frontend-harness Plugin Details screen

**Step 5. Confirm installation - settings.local.json**

Once installation is complete, the enabledPlugins setting is added to .claude/settings.local.json.

> settings.local.json confirmation screen

**Step 6. Run a skill**

Run a skill from the installed plugin using the /skill-name format.

> - /a11y skill execution screen
> - If it does not appear, run /reload-plugins and retry the /(slash) command

---

# Plugin Components

Each team plugin is used by combining the components below.

| Component | Format | How to run | Description |
| --- | --- | --- | --- |
| skills | skills/\<name\>/SKILL.md | /\<plugin\>:\<skill\> | Performs tasks based on specific domain knowledge |
| commands | commands/\<name\>.md | /\<plugin\>:\<command\> | Tasks run via slash commands |
| agents | agents/\<name\>.md | Automatic execution | Complex multi-step workflows |
| hooks | hooks.json | Event trigger | Automation that reacts to Claude Code events |

There is no need to modify marketplace.json when adding components. Since paths are declared in plugin.json, you only need to add files to the corresponding directory.

---

# Skill Configuration

## frontend-harness plugin (12 skills)

| Skill | Command | Description | Trigger keywords |
| --- | --- | --- | --- |
| Planner | /planner | 4-step PRD creation: interview → research → plan → approval | 계획 세워줘, plan, PRD 작성, 구현 계획 |
| Architecture | /architecture | Designs system structure, APIs, data flow, and technology choices | 설계해줘, 아키텍처, API 설계, 시스템 설계 |
| Critic | /critic | Analyzes design weaknesses, risks, and omissions | 검토해줘, 비평, 리스크 분석, 약점 분석 |
| Grill Me | /grill-me | Persistent questioning to clarify requirements | 질문해줘, grill me, 인터뷰, 요구사항 정리 |
| TDD | /tdd | Test-driven development based on the Red-Green-Refactor loop | TDD, 테스트 주도 개발, 테스트 먼저 |
| A11y | /a11y | WAI-ARIA-based web accessibility inspection and improvement | 웹접근성, a11y, aria, 스크린리더, WCAG |
| Semantic HTML | /semantic-html | Inspects and improves semantic tag usage and heading hierarchy | 시맨틱, semantic, HTML 구조, heading |
| SEO/GEO Optimizer | /seo-geo-optimizer | Optimization for traditional search + AI search (GEO), JSON-LD | SEO, GEO, 검색 최적화, 메타태그, JSON-LD |
| E2E Verifier | /e2e-verifier | Browser verification based on Chrome MCP / Playwright MCP / Agent-Browser | E2E 검증, 브라우저 검증, 화면 테스트, 동작 확인 |
| Lighthouse Performance | /lighthouse-performance | Measures and improves Core Web Vitals (LCP·CLS·INP·TTFB·FCP) | 성능 검사, lighthouse, Core Web Vitals, 로딩 속도 |
| QA Inspector | /qa-inspector | Detects interface mismatches by cross-comparing API↔hook types, routing, and state transitions | QA, 정합성 검사, 경계면 검증, 버그 찾기 |
| Security Audit | /security-audit | OWASP Top 10 code analysis, npm audit, security header and secret detection | 보안 감사, OWASP, XSS, 취약점 스캔, CVE |

**Commands (7)**

| Command | Description |
| --- | --- |
| /orchestrator | Sequentially runs the 6 stages research → prd → develop → review → verify, then produces an integrated report. Finishes static analysis first and runs the expensive E2E last |
| /research | Analyzes requirements and derives specifications using the grill-me sub-agent |
| /prd | Creates a PRD via the planner → architecture → critic loop |
| /frontend-guidelines | Guideline-based development (Develop) via parallel spawning of a11y · semantic-html · seo-geo · tdd |
| /review | Runs only user-selected items among the 5 perspectives /simplify · /review · security-audit · lighthouse · qa-inspector in parallel → fix and re-review loop (up to 3 times) |
| /verifier | E2E browser verification based on PRD acceptance criteria via the e2e-verifier skill |
| /verify | Integrates E2E browser verification + type/build checks (`tsc --noEmit`, `npm run build`) |

**Hooks (1)**

| Hook | Trigger | Description |
| --- | --- | --- |
| stop-lint | Stop | Automatically runs eslint --fix → stylelint --fix → prettier --write on git-changed files when a response completes (monorepo support, skips uninstalled tools) |

## harness-generator plugin (1 skill)

| Skill | Command | Description | Trigger keywords |
| --- | --- | --- | --- |
| Harness Generator | /harness-generator | Generates a domain-specific harness as a single bundle through a 7-step meta process (audit → domain analysis → architecture → agent definition → skill authoring → orchestration → verification/evolution) | 하네스 만들어줘, 오케스트레이터 작성, 워크플로우 자동화, 에이전트 팀 구성 |

## git-harness plugin (2 skills)

| Skill | Command | Description | Trigger keywords |
| --- | --- | --- | --- |
| Commit | /commit | Writes Korean commit messages in the `issue-number type: subject` format (imperative subject; summary/impact/test body; secrets and protected-branch checks) | 커밋, commit, 커밋 메시지 |
| Review to PR | /review-to-pr | All-in-one review → commit → PR creation. Automatically runs and applies /simplify + /review at each stage | PR 생성, PR 리뷰, 리뷰 후 커밋 |

## meta-harness plugin (4 skills + 4 agents)

| Skill | Command | Description |
| --- | --- | --- |
| Meta-Harness | /meta-harness | Entry orchestrator. R1 current-session redirect/reinforcement · R2 plugin improvement · R3 external .md back-tracing trigger. Phase 0~8 + R4 reporting, with a user approval gate (no automatic application) |
| Session Signal Capture | /session-signal-capture | Captures R1 utterances, the immediately preceding artifact, the active skill, and R3 external .md as a raw trace without summarization. R3 uses a 3-tier source fallback for back-tracing |
| Causal Diagnosis | /causal-diagnosis | Directly queries the experience-store raw trace via grep/cat to isolate confounds → single-factor verification → why-first root cause diagnosis |
| Pareto Refinement | /pareto-refinement | Generates 4-axis (behavior-alignment · rule-body-cost · trigger-precision · generalization) Pareto non-regression patches via additive-first → compose → transfer |

Four agents (all `model: opus`): `trace-capturer` (raw trace normalization) · `failure-diagnostician` (parallel root cause diagnosis per defect) · `pareto-refiner` (patch generation) · `experience-historian` (experience-store curation).

---

# Using the GitHub Repository

Repository: [https://github.com/seungahhong/seungah-claude-plugins](https://github.com/seungahhong/seungah-claude-plugins)

## How users use it

1. **Register the marketplace** — In Claude Code, run `/plugin marketplace add https://github.com/seungahhong/seungah-claude-plugins` (or the CLI `claude plugin add seungahhong/seungah-claude-plugins`)
2. **Install plugins** — Install only the plugins you want, such as `/plugin install frontend-harness@seungah-claude-plugins` (choose user / project / local scope)
3. **Run skills** — After installation, invoke them via slash commands like `/planner`, `/review`, `/commit`, or trigger them with natural language. If the list does not appear, retry after running `/reload-plugins`
4. **Update** — When changes are reflected in the repository, update to the latest with `/plugin marketplace update seungah-claude-plugins`

## Contributing and local development

```shell
git clone https://github.com/seungahhong/seungah-claude-plugins.git
cd seungah-claude-plugins
# Load directly from a local path for debugging
claude --plugin-dir ./plugins/frontend-harness
```

For components (skills / commands / agents / hooks), you only need to add files to each plugin directory; there is no need to modify `marketplace.json` (paths are declared in `plugin.json`).

---

# Usage Examples

After installation is complete, you can trigger skills with natural language or slash commands in the Claude Code chat window.

## Skill-by-skill execution flow

```javascript
/grill-me            // 1. 요구사항 명확화
/planner             // 2. 구현 계획(PRD)
/architecture        // 3. 기술 아키텍처 설계
/critic              // 4. 설계 검증·리스크 분석
/tdd                 // 5. 테스트 주도 구현
/a11y /semantic-html /seo-geo-optimizer   // 6. 품질·접근성·SEO 점검
/review              // 7. 통합 리뷰(5개 관점 중 선택 병렬 + 재리뷰 루프)
/verify              // 8. 동작·빌드 검증(E2E + tsc + build)
/commit              // 9. 커밋 메시지 작성(git-harness)
```

## Full automation with the orchestrator

```javascript
/orchestrator        // research → prd → develop → review → verify 전체 파이프라인 자동 실행
```

## Meta workflow — handling the harness itself

```javascript
/harness-generator   // 신규 도메인용 하네스(에이전트+스킬+오케스트레이터) 한 묶음 생성
/meta-harness        // 사용 중인 하네스를 full-trace로 캡처·진단·개선(사용자 승인 게이트)
```

## Natural language trigger examples

- "Check this component's web accessibility" → `/a11y`
- "Run a security audit and performance check before deployment" → `/review` (selecting security-audit + lighthouse)
- "Commit these changes in Korean" → `/commit`
- "Develop the payment feature from start to finish" → `/orchestrator`
