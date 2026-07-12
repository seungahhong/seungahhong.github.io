---
layout: post
title: Frontend Harness Engineering
date: 2026-06-04
published: 2026-06-04
category: Development
tags: ['AI', 'Harness', 'Claude']
comments: true
thumbnail: './assets/04/thumbnail.png'
github: ''
---

# 1. What Is Harness Engineering?

It is the discipline of designing the **entire execution environment** surrounding an AI model (tools, feedback loops, safeguards, approval gates) to turn it into **reliable software**.

## The Evolution of AI Engineering (Prompt vs. Context vs. Harness)

The way we work with AI has evolved from prompt engineering to context engineering to harness engineering. The focus has expanded beyond simply "what to ask," to "what context to inject," and ultimately to "how to design the entire execution environment in which the AI operates."

## The Anthropic Case — the Generator-Evaluator Pattern

Anthropic applied a harness to long-running application development and published the results.

**Key findings**

- **The self-evaluation failure problem**

  When a model is asked to evaluate its own output, it confidently praises mediocre results.

  > "Separating the generator from the evaluator turned it into a far more tractable problem." — Anthropic

- **Context Window limits**

  There is a fixed maximum number of characters (token capacity) that can be held in memory within a session. Sub-agents are spawned to keep the main context from being polluted.

**Quantitative results**

| Item             | Standalone Run | With Harness         |
| ---------------- | -------------- | -------------------- |
| Time elapsed     | 20 min         | 6 hours              |
| Cost             | \$9            | \$200                |
| Core feature     | Broken         | Complete             |
| Quality verdict  | —              | "The difference was immediately obvious" |

For a 22x increase in cost, whether the core feature actually worked was fundamentally different. The Evaluator provided **concrete, immediately actionable feedback**, such as broken API routes and missing DB wiring.

---

# 2. Adopting a Harness for Frontend Development

## Motivation

| Problem            | Details                                        | Harness Solution         |
| ------------------ | ---------------------------------------------- | ------------------------ |
| **Repeated context** | Re-explaining project structure and conventions every session | Auto-injected via Command + CLAUDE.md |
| **Quality variance** | The same request yields different results each session | Standardized expert roles via Skills |
| **Risky actions**  | git push --force, creating sensitive files     | Blocked at the code level via Hooks |
| **No consistency** | Unable to manage the analysis→design→develop→review→verify flow | Orchestrator workflow    |

## Workflow Orchestrator

Example usage

```javascript
/orchestrator 아래 지침을 바탕으로 개발을 진행해 주세요.
* 기획 문서: link
* 피그마 디자인: link
```

## Design Principles

1. **"One at a time"**
   - grill-me asks only one question at a time to secure depth in the answers
   - Solves the shallow-answer problem caused by asking many questions at once
2. **"Parallel, not sequential"**
   - Independent skills/verification items are always processed concurrently in parallel
   - Each sub-agent operates with a clean context → no quality degradation
3. **"Static analysis first, expensive E2E later"**
   - Review (static) runs before Verify (E2E) → prevents unnecessary E2E costs
4. **"AI executes, humans decide"**
   - User approval is required for every Phase transition, skill selection, and fix decision
   - Clearly limits the scope of AI's autonomous execution

**In one line**: An orchestrator for the entire development workflow that runs the five stages Research → PRD → Develop → Review → Verify in sequence and obtains user approval at each stage transition.

| Phase | Name         | Core Action                    | Delegated to AI          | User Approval          |
| ----- | ------------ | ------------------------------ | ------------------------ | ---------------------- |
| 1     | **Research** | grill-me interview → requirements spec | One question at a time, codebase exploration | Confirm each step's result |
| 2     | **PRD**      | planner→architecture→critic loop | 3 sub-agents           | Decide loop repeat/finalize |
| 3     | **Develop**  | Skill selection → parallel code generation | Selected skills run concurrently | Skill selection, additional confirmation |
| 4     | **Review**   | 5-perspective parallel verification + re-review | 5 Evaluators run concurrently | Item selection, fix decision |
| 5     | **Verify**   | E2E browser + type/build       | Scenario generation & execution | Tool selection, scenario approval |

**Early termination allowed**: You can run only up to the desired stage, such as "just through analysis" or "just through development."

## Phase-by-Phase Details

### Phase 1: Research

```markdown
초기 분석 → grill-me 인터뷰(1개씩) → 코드베이스 조사 → 명세 작성 → 확인
 ↓ 승인      ↓ 응답 × N회           ↓ 승인          ↓ 승인    ↓ 승인
```

- **grill-me**: Asks strictly one question at a time, detects contradictions with previous answers, and investigates directly when the codebase can answer the question
- **Deliverable**: A requirements specification at an actionable level

### Phase 2: PRD

```markdown
┌→ planner(계획) → architecture(설계) → critic(비평) ─┐
│              심각도 상 리스크 1+ → 루프 반복 (최대 3회) │
└────────────────────────────────────────────────────────┘
              심각도 상 0건 → PRD 확정
```

- **Critic's 7 perspectives**: Scalability / Stability / Security / Performance / Compatibility / Operations / Omissions
- **Deliverable**: Implementation plan + technical architecture + risk matrix

### Phase 3: Develop

```markdown
Step 1: 스킬 선택 (멀티체크)        Step 2: 추가 스킬 확인
□ a11y (웹접근성)                    "추가로 적용할 스킬 있나요?"
□ semantic-html                      → 명시적 응답 필수
□ seo-geo (SEO/GEO)
□ tdd (테스트 주도)
           ↓
    선택 스킬 전부 동시 병렬 실행
```

- **Integration priority**: TDD \> semantic-html \> a11y \> seo-geo

### Phase 4: Review

```markdown
5개 관점 동시 실행:
┌──────────┬──────────┬──────────┬───────────┬────────────┐
│/simplify │ /review  │ security │lighthouse │qa-inspector│
│ 코드간소    │ 품질리뷰   │ 보안감사   │ 성능측정    │ 경계면검증    │
└──────────┴──────────┴──────────┴───────────┴────────────┘
                    ↓ 결과 통합
         수정 필요 → 재리뷰 루프 (최대 3회)
         수정 없음 → 배포 가능 판정
```

- **Deployment criteria**: /review Critical 0, security Critical/High 0, lighthouse ≥ 50

### Phase 5: Verify

```markdown
검증 항목 선택     → E2E 도구 선택      → 시나리오 생성     → 실행        → 판정
(전체/E2E/빌드)  (Chrome/Playwright  (PRD 인수조건    (PASS/WARNING
                  /Agent-Browser)     → 브라우저 동작)  /FAIL)
```

- **E2E tool selection is mandatory for the user** (no default, because environments differ)
- **Type/build**: npm run typecheck + npm run build

## Overview of Commands / Skills / Hooks

### Commands (9)

| Command                      | Role                          |
| ---------------------------- | ----------------------------- |
| workflow/orchestrator        | Orchestrates the full 5-stage workflow |
| workflow/research            | Phase 1: Requirements analysis |
| workflow/prd                 | Phase 2: Development requirements spec |
| workflow/frontend-guidelines | Phase 3: Guideline-based development |
| workflow/review              | Phase 4: 5-perspective integrated review |
| workflow/verify              | Phase 5: E2E + type/build verification |

### Skills (18)

| Category           | Skill                  | Role                          |
| ------------------ | ---------------------- | ----------------------------- |
| **Interview·Plan** | grill-me               | Resolves ambiguity by asking one question at a time |
|                    | planner                | Builds the implementation plan (PRD draft) |
|                    | architecture           | Designs the technical architecture |
|                    | critic                 | 7-perspective risk analysis   |
| **FE Dev Guides**  | a11y                   | Web accessibility (WAI-ARIA, WCAG) |
|                    | semantic-html          | Semantic HTML markup          |
|                    | seo-geo-optimizer      | Search engine + AI search optimization |
|                    | tdd                    | Test-driven development (Red-Green-Refactor) |
| **Verify·Audit**   | security-audit         | OWASP Top 10, dependency vulnerabilities |
|                    | lighthouse-performance | Core Web Vitals (LCP, CLS, INP) |
|                    | qa-inspector           | API↔frontend boundary consistency |
|                    | e2e-verifier           | Browser-based behavior verification |
| **Utilities**      | /simplify              | Code simplification (auto-applied) |
|                    | /review                | Code review (quality, bugs)   |

### Hooks (5 types)

| Hook                  | Trigger Point      | Action                                |
| --------------------- | ------------------ | ------------------------------------- |
| **guard.sh**          | Before Bash runs   | Blocks git push --force, rm -rf, DROP TABLE, etc. |
| **write-guard.sh**    | Before file creation | Blocks .env, \*.pem, credentials.json, etc. |
| **skill-dedup.sh**    | Before SKILL.md creation | Prevents duplicate skills with the same name |
| **stop-lint.sh**      | After code changes | Runs lint automatically               |
| **package-changed.sh** | When package.json changes | Notifies of dependency changes        |

---

# 3. Future Improvements

## Building Harnesses for Various Development Environments

We are expanding the current FE-focused harness to a **variety of environments**.

```markdown
┌─────────────────────────────────────────────────────┐
│          Orchestrator (환경 무관 범용 엔진)             │
│    Research → PRD → Develop(선택) → Review(선택) → Verify(선택)│
├─────────────┬──────────────┬────────────────────────┤
│  FE 스킬 팩   │ 문서 스킬 팩    │   PRD 생성 스킬          │
│  a11y       │ 기술 보고서 작성  │   요구사항 정의          │
│  semantic   │ Wiki 자동 업로드 │   아키텍처 설계          │
│  lighthouse │ 발표 자료 생성    │   리스크 분석           │
└─────────────┴──────────────┴────────────────────────┘
```

**Key point**: The Orchestrator's 5-stage flow is environment-agnostic. You only need to **swap out the skills**.

## Building Toward Agent Engineering

The evolution from harness to agent engineering:

```markdown
현재                              미래
──────                            ──────
인간이 하네스를 설계         →    AI가 하네스를 자기 개선
AI가 실행, 인간이 승인       →    인간은 목표와 경계만 설정
스킬이 정적 (SKILL.md 고정)  →    스킬 자동 튜닝 (A/B 테스트)
실패 패턴을 인간이 분석      →    메트릭 기반 자동 진단
```

| Stage                         | Description               | Human's Role  |
| ----------------------------- | ------------------------- | ------------- |
| **Stage 1** Static harness (current) | Human designs, AI executes | Design + approval |
| **Stage 2** Self-diagnosis    | Metric collection → improvement proposals | Approve proposals |
| **Stage 3** Self-improvement  | Automatic skill tuning, A/B testing | Set policy |
| **Stage 4** Autonomous agent  | Automatically reconfigures the workflow | Set goals only |

**Ultimate goal**: A development environment where developers focus **solely on "what to build,"** while the AI system autonomously guarantees quality, safety, and consistency.

---

# References

- Anthropic, [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (2025)
- Anthropic, [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) (2025)
- [https://goddaehee.tistory.com/565](https://goddaehee.tistory.com/565)
- [https://news.hada.io/topic?id=28966](https://news.hada.io/topic?id=28966)
