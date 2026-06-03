---
layout: post
title: Claude Code 플러그인 마켓플레이스 구축
date: 2026-06-03
published: 2026-06-03
category: 개발
tags: ['Claude', 'AI', 'Plugin']
comments: true
thumbnail: './assets/03/thumbnail.png'
github: 'https://github.com/seungahhong/seungah-claude-plugins'
---

# 개요

본 문서는 Claude Code 플러그인 마켓플레이스의 등록, 설치 및 사용 방법을 기술합니다.

**seungah-claude-plugins** 마켓플레이스를 통해 플러그인을 공유하고 있습니다. 현재 다음 4개의 팀별 플러그인으로 구성되어 있습니다.

마켓플레이스 버전: **1.4.0** · 저장소: [https://github.com/seungahhong/seungah-claude-plugins](https://github.com/seungahhong/seungah-claude-plugins)

| 플러그인 | 설명 | 버전 |
| --- | --- | --- |
| frontend-harness | 프론트엔드 개발 전 과정(Research → PRD → Develop → Review → Verify)을 지원하는 멀티 에이전트 스킬·커맨드·훅 모음. 정적 분석 5개 관점(간소화·PR 리뷰·보안·성능·정합성) 중 사용자 선택 항목 병렬 + 재리뷰 루프, E2E·타입/빌드 검증 포함 | 1.3.0 |
| harness-generator | 도메인 무관 하네스(에이전트 팀 + 스킬 + 오케스트레이터)를 7단계 메타 프로세스로 자동 생성하는 메타 플러그인 | 0.1.0 |
| git-harness | Git 워크플로우 — 한국어 커밋 메시지(`이슈번호 type: 제목`) 작성과 다각도 PR 리뷰(리뷰 → 커밋 → PR 올인원) | 0.2.0 |
| meta-harness | full-trace experience store 기반 메타 하네스 엔지니어링. causal 진단 + 4축 Pareto 비후퇴 패치, 사용자 승인 게이트(arXiv 2603.28052v1 기반) | 0.1.0 |

---

# 설치 방법

설치는 3가지 방법을 지원합니다. 팀 내 공유 시에는 방법 A(마켓플레이스 등록 후 설치)를 권장합니다.

## 방법 A - 마켓플레이스 등록 후 설치 (권장)

2단계로 진행됩니다.

### Step 1. 마켓플레이스 추가

마켓플레이스 레지스트리를 로컬 환경에 등록합니다. 이 단계에서는 사용 가능한 플러그인 목록만 등록되며, 스킬이 활성화되지는 않습니다.

```shell
# seugnah-claude-plugins
/plugin marketplace add https://github.com/seungahhong/seungah-claude-plugins
```

(참고) github clone이 안되어 마켓플레이스 추가가 안된다면

```shell
gh auth login
```

### Step 2. 플러그인 설치

등록된 마켓플레이스에서 원하는 플러그인을 선택하여 설치합니다.

```shell
# seugnah-claude-plugins 내 플러그인
/plugin install frontend-harness@seungah-claude-plugins
```

```shell
/plugin install frontend-harness
```

설치 범위는 다음 3가지 중 선택할 수 있습니다.

| 범위 | 설명 |
| --- | --- |
| user scope | 사용자 전역에 설치 |
| project scope | 현재 저장소의 모든 협업자에게 설치 |
| local scope | 현재 저장소의 본인에게만 설치 |

## 방법 B - GitHub에서 직접 설치

GitHub 저장소에서 CLI로 마켓플레이스를 직접 추가하는 방법입니다.

```shell
claude plugin add seungahhong/seungah-claude-plugins
```

## 방법 C - 로컬 경로로 설치

로컬에 클론된 저장소 경로를 지정하여 설치하는 방법입니다. 개발 및 디버깅 시 유용합니다.

```shell
claude --plugin-dir /path/to/frontend-harness
```

---

# 마켓플레이스 등록 화면

아래는 seungah-claude-plugins 마켓플레이스 등록 및 플러그인 설치 과정입니다.

**1단계. /plugin 명령어 입력**

Claude Code 실행 후 /plugin 명령어를 입력합니다.

> /plugin 명령어 자동완성 화면

**2단계. Add Marketplace - 마켓플레이스 URL 입력**

Add Marketplace를 선택하고, 마켓플레이스 저장소 URL을 입력합니다.

> seungah-claude-plugins URL 입력 화면

**3단계. Discover - 설치 가능한 플러그인 목록 확인**

Discover 탭에서 설치 가능한 플러그인 목록을 확인합니다.

> - Discover 탭 플러그인 목록
> - space 클릭 해서 선택 → enter 설치 진행

**4단계. Plugin Details - 플러그인 상세 및 설치 범위 선택**

설치할 플러그인을 선택하면 상세 정보가 표시됩니다. 설치 범위(user/project/local scope)를 선택합니다.

> frontend-harness Plugin Details 화면

**5단계. 설치 확인 - settings.local.json**

설치가 완료되면 .claude/settings.local.json에 enabledPlugins 설정이 추가됩니다.

> settings.local.json 확인 화면

**6단계. 스킬 실행**

설치된 플러그인의 스킬을 /스킬명 형식으로 실행합니다.

> - /a11y 스킬 실행 화면
> - 나오지 않을 경우 /reload-plugins 실행 후 /(슬러시) 명령어 재시도

---

# 플러그인 구성 요소

각 팀 플러그인은 아래 구성 요소를 조합하여 사용합니다.

| 구성 요소 | 형식 | 실행 방법 | 설명 |
| --- | --- | --- | --- |
| skills | skills/\<name\>/SKILL.md | /\<plugin\>:\<skill\> | 특정 도메인 지식 기반 작업 수행 |
| commands | commands/\<name\>.md | /\<plugin\>:\<command\> | 슬래시 커맨드로 실행되는 작업 |
| agents | agents/\<name\>.md | 자동 실행 | 복잡한 멀티스텝 워크플로우 |
| hooks | hooks.json | 이벤트 트리거 | Claude Code 이벤트에 반응하는 자동화 |

구성 요소 추가 시 marketplace.json 수정은 불필요합니다. plugin.json에 경로가 선언되어 있으므로, 해당 디렉토리에 파일만 추가하면 됩니다.

---

# 스킬 구성

## frontend-harness 플러그인 (12개 스킬)

| 스킬명 | 커맨드 | 설명 | 트리거 키워드 |
| --- | --- | --- | --- |
| Planner | /planner | 인터뷰 → 조사 → 계획 → 승인 4단계 PRD 작성 | 계획 세워줘, plan, PRD 작성, 구현 계획 |
| Architecture | /architecture | 시스템 구조·API·데이터 흐름·기술 선택 설계 | 설계해줘, 아키텍처, API 설계, 시스템 설계 |
| Critic | /critic | 설계의 약점·리스크·누락 분석 | 검토해줘, 비평, 리스크 분석, 약점 분석 |
| Grill Me | /grill-me | 요구사항 명확화를 위한 집요한 질문 | 질문해줘, grill me, 인터뷰, 요구사항 정리 |
| TDD | /tdd | Red-Green-Refactor 루프 기반 테스트 주도 개발 | TDD, 테스트 주도 개발, 테스트 먼저 |
| A11y | /a11y | WAI-ARIA 기반 웹접근성 점검·개선 | 웹접근성, a11y, aria, 스크린리더, WCAG |
| Semantic HTML | /semantic-html | 시맨틱 태그 사용·제목 계층 점검·개선 | 시맨틱, semantic, HTML 구조, heading |
| SEO/GEO Optimizer | /seo-geo-optimizer | 전통 검색 + AI 검색(GEO) 최적화, JSON-LD | SEO, GEO, 검색 최적화, 메타태그, JSON-LD |
| E2E Verifier | /e2e-verifier | Chrome MCP / Playwright MCP / Agent-Browser 기반 브라우저 검증 | E2E 검증, 브라우저 검증, 화면 테스트, 동작 확인 |
| Lighthouse Performance | /lighthouse-performance | Core Web Vitals(LCP·CLS·INP·TTFB·FCP) 측정·개선 | 성능 검사, lighthouse, Core Web Vitals, 로딩 속도 |
| QA Inspector | /qa-inspector | API↔훅 타입·라우팅·상태 전이 교차 비교로 경계면 불일치 탐지 | QA, 정합성 검사, 경계면 검증, 버그 찾기 |
| Security Audit | /security-audit | OWASP Top 10 코드 분석, npm audit, 보안 헤더·시크릿 탐지 | 보안 감사, OWASP, XSS, 취약점 스캔, CVE |

**커맨드 (7개)**

| 커맨드 | 설명 |
| --- | --- |
| /orchestrator | research → prd → develop → review → verify 6단계 순차 실행 후 통합 리포트. 정적 분석을 먼저 끝낸 뒤 비싼 E2E를 마지막에 실행 |
| /research | grill-me 서브에이전트로 요구사항 분석·명세 도출 |
| /prd | planner → architecture → critic 루프로 PRD 작성 |
| /frontend-guidelines | a11y · semantic-html · seo-geo · tdd 병렬 spawn으로 가이드라인 기반 개발(Develop) |
| /review | /simplify · /review · security-audit · lighthouse · qa-inspector 5개 관점 중 사용자 선택 항목만 병렬 → 수정·재리뷰 루프(최대 3회) |
| /verifier | e2e-verifier 스킬로 PRD 인수 조건 기반 E2E 브라우저 검증 |
| /verify | E2E 브라우저 검증 + 타입/빌드 검사(`tsc --noEmit`, `npm run build`) 통합 |

**훅 (1개)**

| 훅 | 트리거 | 설명 |
| --- | --- | --- |
| stop-lint | Stop | 응답 완료 시 git 변경 파일에 eslint --fix → stylelint --fix → prettier --write 자동 실행(모노레포 지원, 미설치 도구 건너뜀) |

## harness-generator 플러그인 (1개 스킬)

| 스킬명 | 커맨드 | 설명 | 트리거 키워드 |
| --- | --- | --- | --- |
| Harness Generator | /harness-generator | 7단계 메타 프로세스(감사 → 도메인 분석 → 아키텍처 → 에이전트 정의 → 스킬 작성 → 오케스트레이션 → 검증/진화)로 도메인용 하네스를 한 묶음으로 생성 | 하네스 만들어줘, 오케스트레이터 작성, 워크플로우 자동화, 에이전트 팀 구성 |

## git-harness 플러그인 (2개 스킬)

| 스킬명 | 커맨드 | 설명 | 트리거 키워드 |
| --- | --- | --- | --- |
| Commit | /commit | `이슈번호 type: 제목` 형식 한국어 커밋 메시지 작성(명령형 제목, 요약/영향/테스트 본문, secrets·보호 브랜치 검사) | 커밋, commit, 커밋 메시지 |
| Review to PR | /review-to-pr | 리뷰 → 커밋 → PR 생성 올인원. 각 단계에서 /simplify + /review 자동 수행 후 적용 | PR 생성, PR 리뷰, 리뷰 후 커밋 |

## meta-harness 플러그인 (4개 스킬 + 4개 에이전트)

| 스킬명 | 커맨드 | 설명 |
| --- | --- | --- |
| Meta-Harness | /meta-harness | 진입 오케스트레이터. R1 현세션 redirect/보강 · R2 plugin 개선 · R3 외부 .md 역추적 트리거. Phase 0~8 + R4 보고, 사용자 승인 게이트(자동 적용 금지) |
| Session Signal Capture | /session-signal-capture | R1 발화·직전 산출물·active skill + R3 외부 .md를 요약 없이 원형 trace로 캡처. R3는 출처 3단 폴백 역추적 |
| Causal Diagnosis | /causal-diagnosis | experience-store raw trace를 grep/cat로 직접 조회해 confound 격리 → 단독검증 → why-first root cause 진단 |
| Pareto Refinement | /pareto-refinement | additive-first → compose → transfer로 4축(behavior-alignment·rule-body-cost·trigger-precision·generalization) Pareto 비후퇴 패치 생성 |

에이전트 4종(모두 `model: opus`): `trace-capturer`(원형 trace 정규화) · `failure-diagnostician`(결함별 root cause 병렬 진단) · `pareto-refiner`(패치 생성) · `experience-historian`(experience-store 큐레이션).

---

# GitHub 저장소 활용

저장소: [https://github.com/seungahhong/seungah-claude-plugins](https://github.com/seungahhong/seungah-claude-plugins)

## 사용자가 사용하는 방법

1. **마켓플레이스 등록** — Claude Code에서 `/plugin marketplace add https://github.com/seungahhong/seungah-claude-plugins` (또는 CLI `claude plugin add seungahhong/seungah-claude-plugins`)
2. **플러그인 설치** — `/plugin install frontend-harness@seungah-claude-plugins` 처럼 원하는 플러그인만 골라 설치 (user / project / local scope 선택)
3. **스킬 실행** — 설치 후 `/planner`, `/review`, `/commit` 등 슬래시 커맨드로 호출하거나 자연어로 트리거. 목록이 안 보이면 `/reload-plugins` 후 재시도
4. **업데이트** — 저장소에 변경이 반영되면 `/plugin marketplace update seungah-claude-plugins` 로 최신화

## 기여·로컬 개발

```shell
git clone https://github.com/seungahhong/seungah-claude-plugins.git
cd seungah-claude-plugins
# 로컬 경로로 바로 로드하여 디버깅
claude --plugin-dir ./plugins/frontend-harness
```

구성 요소(skills / commands / agents / hooks)는 각 플러그인 디렉토리에 파일만 추가하면 되고, `marketplace.json` 수정은 불필요합니다(`plugin.json`에 경로가 선언되어 있음).

---

# 사용 예시

설치 완료 후, Claude Code 대화창에서 자연어 또는 슬래시 커맨드로 스킬을 트리거할 수 있습니다.

## 스킬 단위 실행 흐름

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

## 오케스트레이터로 전체 자동화

```javascript
/orchestrator        // research → prd → develop → review → verify 전체 파이프라인 자동 실행
```

## 메타 워크플로우 — 하네스 자체 다루기

```javascript
/harness-generator   // 신규 도메인용 하네스(에이전트+스킬+오케스트레이터) 한 묶음 생성
/meta-harness        // 사용 중인 하네스를 full-trace로 캡처·진단·개선(사용자 승인 게이트)
```

## 자연어 트리거 예시

- "이 컴포넌트 웹접근성 점검해줘" → `/a11y`
- "배포 전 보안 감사랑 성능 검사 해줘" → `/review`(security-audit + lighthouse 선택)
- "이 변경사항 한국어로 커밋해줘" → `/commit`
- "결제 기능 처음부터 끝까지 개발해줘" → `/orchestrator`
</content>
</invoke>
