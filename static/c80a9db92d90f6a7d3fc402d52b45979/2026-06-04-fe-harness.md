---
layout: post
title: Frontend 하네스 엔지니어링
date: 2026-06-04
published: 2026-06-04
category: 개발
tags: ['AI', '하네스', 'Claude']
comments: true
thumbnail: './assets/04/thumbnail.png'
github: ''
---

# 1. 하네스 엔지니어링이란?

AI 모델을 둘러싼 **실행 환경 전체**(도구, 피드백 루프, 안전장치, 승인 게이트)를 설계하여, **신뢰할 수 있는 소프트웨어**로 만들어 가는 기술이다.

## AI 엔지니어링의 진화 (프롬프트 vs 컨텍스트 vs 하네스)

AI를 다루는 방식은 프롬프트 엔지니어링 → 컨텍스트 엔지니어링 → 하네스 엔지니어링으로 진화해 왔다. 단순히 "무엇을 물어볼지"를 넘어, "어떤 컨텍스트를 주입할지", 나아가 "AI가 동작하는 실행 환경 전체를 어떻게 설계할지"로 관심사가 확장되고 있다.

## Anthropic 사례 — Generator-Evaluator 패턴

Anthropic은 장기 실행 애플리케이션 개발에 하네스를 적용하고, 그 결과를 공개했다.

**핵심 발견**

- **자기 평가 실패 문제**

  모델에게 자신의 출력을 평가하게 하면, 평범한 결과를 자신있게 칭찬한다.

  > "생성자와 평가자를 분리하는 것이 훨씬 다루기 쉬운 문제였다." — Anthropic

- **컨텍스트 윈도우(Context Window) 한계**

  세션 안에서 기억할 수 있는 최대 글자 수(토큰 용량)가 정해져 있다. 메인 컨텍스트 오염을 막기 위해 서브 에이전트를 실행한다.

**정량적 결과**

| 항목      | 단독 실행 | 하네스 적용         |
| --------- | --------- | ------------------- |
| 소요 시간 | 20분      | 6시간               |
| 비용      | \$9       | \$200               |
| 핵심 기능 | 고장      | 완성                |
| 품질 판정 | —         | "차이가 즉시 명백"  |

비용 22배 증가 대비, 핵심 기능 자체의 작동 여부가 달랐다. Evaluator는 깨진 API 라우트, 누락된 DB 배선 등 **즉시 행동 가능한 수준의 구체적 피드백**을 제공했다.

---

# 2. Frontend 개발 하네스 도입

## 도입 배경

| 문제          | 상세                                          | 하네스 해결              |
| ------------- | --------------------------------------------- | ----------------------- |
| **맥락 반복** | 매 세션마다 프로젝트 구조, 컨벤션 재설명       | Command + CLAUDE.md로 자동 주입 |
| **품질 편차** | 같은 요청이라도 세션마다 다른 결과            | Skill로 전문 역할 표준화 |
| **위험 동작** | git push --force, 민감 파일 생성              | Hook으로 코드 수준 차단  |
| **일관성 부재** | 분석→설계→개발→리뷰→검증 흐름 관리 불가      | Orchestrator 워크플로우  |

## Workflow Orchestrator

사용 예제

```javascript
/orchestrator 아래 지침을 바탕으로 개발을 진행해 주세요.
* 기획 문서: link
* 피그마 디자인: link
```

## 설계 원칙

1. **"한 번에 하나씩"**
   - grill-me가 질문을 1개씩만 하여 답변 깊이 확보
   - 여러 질문 동시 → 피상적 답변 문제 해결
2. **"순차가 아닌 병렬"**
   - 독립적인 스킬/검증 항목은 항상 동시 병렬 처리
   - 각 서브에이전트가 깨끗한 컨텍스트로 동작 → 품질 저하 없음
3. **"정적 분석 먼저, 비싼 E2E 나중"**
   - Review(정적)가 Verify(E2E)보다 먼저 → 불필요한 E2E 비용 방지
4. **"AI는 실행, 사람은 결정"**
   - 모든 Phase 전환, 스킬 선택, 수정 여부에 사용자 승인 필수
   - AI의 자율 실행 범위를 명확히 제한

**한 줄 설명**: Research → PRD → Develop → Review → Verify 5단계를 순차 실행하고, 각 단계 전환 시 사용자 승인을 받는 전체 개발 워크플로우 지휘자.

| Phase | 이름         | 핵심 동작                     | AI 위임              | 사용자 승인          |
| ----- | ------------ | ---------------------------- | ------------------- | -------------------- |
| 1     | **Research** | grill-me 인터뷰 → 요구사항 명세 | 1개씩 질문, 코드베이스 탐색 | 각 단계 결과 확인    |
| 2     | **PRD**      | planner→architecture→critic 루프 | 3개 서브에이전트  | 루프 반복/확정 결정  |
| 3     | **Develop**  | 스킬 선택 → 병렬 코드 생성    | 선택 스킬 동시 실행  | 스킬 선택, 추가 확인 |
| 4     | **Review**   | 5개 관점 병렬 검증 + 재리뷰   | 5개 Evaluator 동시 실행 | 항목 선택, 수정 결정 |
| 5     | **Verify**   | E2E 브라우저 + 타입/빌드      | 시나리오 생성·실행   | 도구 선택, 시나리오 승인 |

**조기 종료 가능**: "분석까지만", "개발까지만" 등 원하는 단계까지만 실행 가능.

## Phase별 상세

### Phase 1: Research

```markdown
초기 분석 → grill-me 인터뷰(1개씩) → 코드베이스 조사 → 명세 작성 → 확인
 ↓ 승인      ↓ 응답 × N회           ↓ 승인          ↓ 승인    ↓ 승인
```

- **grill-me**: 반드시 1개씩만 질문, 이전 답변과 모순 감지, 코드베이스로 답 가능하면 직접 조사
- **산출물**: 실행 가능한 수준의 요구사항 명세서

### Phase 2: PRD

```markdown
┌→ planner(계획) → architecture(설계) → critic(비평) ─┐
│              심각도 상 리스크 1+ → 루프 반복 (최대 3회) │
└────────────────────────────────────────────────────────┘
              심각도 상 0건 → PRD 확정
```

- **Critic 7가지 관점**: 확장성 / 안정성 / 보안 / 성능 / 호환성 / 운영 / 누락
- **산출물**: 구현 계획 + 기술 아키텍처 + 리스크 매트릭스

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

- **통합 우선순위**: TDD \> semantic-html \> a11y \> seo-geo

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

- **배포 기준**: /review Critical 0건, security Critical/High 0건, lighthouse ≥ 50점

### Phase 5: Verify

```markdown
검증 항목 선택     → E2E 도구 선택      → 시나리오 생성     → 실행        → 판정
(전체/E2E/빌드)  (Chrome/Playwright  (PRD 인수조건    (PASS/WARNING
                  /Agent-Browser)     → 브라우저 동작)  /FAIL)
```

- **E2E 도구 선택은 사용자 필수** (기본값 없음, 환경이 다르기 때문)
- **타입/빌드**: npm run typecheck + npm run build

## Commands / Skills / Hooks 정리

### Commands (9개)

| 커맨드                       | 역할                          |
| ---------------------------- | ----------------------------- |
| workflow/orchestrator        | 전체 5단계 워크플로우 오케스트레이션 |
| workflow/research            | Phase 1: 요구사항 분석        |
| workflow/prd                 | Phase 2: 개발 요구사항 정의서 |
| workflow/frontend-guidelines | Phase 3: 가이드라인 기반 개발 |
| workflow/review              | Phase 4: 5개 관점 통합 리뷰   |
| workflow/verify              | Phase 5: E2E + 타입/빌드 검증 |

### Skills (18개)

| 카테고리          | 스킬                   | 역할                          |
| ----------------- | ---------------------- | ----------------------------- |
| **인터뷰·계획**   | grill-me               | 1개씩 질문으로 모호함 해소     |
|                   | planner                | 구현 계획 수립 (PRD 초안)      |
|                   | architecture           | 기술 아키텍처 설계            |
|                   | critic                 | 7가지 관점 리스크 분석        |
| **FE 개발 가이드** | a11y                   | 웹접근성 (WAI-ARIA, WCAG)     |
|                   | semantic-html          | 시맨틱 HTML 마크업            |
|                   | seo-geo-optimizer      | 검색엔진 + AI 검색 최적화      |
|                   | tdd                    | 테스트 주도 개발 (Red-Green-Refactor) |
| **검증·감사**     | security-audit         | OWASP Top 10, 의존성 취약점   |
|                   | lighthouse-performance | Core Web Vitals (LCP, CLS, INP) |
|                   | qa-inspector           | API↔프론트 경계면 정합성       |
|                   | e2e-verifier           | 브라우저 기반 동작 검증        |
| **유틸리티**      | /simplify              | 코드 간소화 (자동 적용)       |
|                   | /review                | 코드 리뷰 (품질, 버그)        |

### Hooks (5종)

| 훅                    | 시점               | 동작                                  |
| --------------------- | ------------------ | ------------------------------------- |
| **guard.sh**          | Bash 실행 전       | git push --force, rm -rf, DROP TABLE 등 차단 |
| **write-guard.sh**    | 파일 생성 전       | .env, \*.pem, credentials.json 등 차단 |
| **skill-dedup.sh**    | SKILL.md 생성 전   | 동일 이름 스킬 중복 방지              |
| **stop-lint.sh**      | 코드 수정 후       | 자동 린트 실행                        |
| **package-changed.sh** | package.json 변경 시 | 의존성 변경 알림                      |

---

# 3. 향후 개선

## 다양한 개발 환경별 하네스 구축

현재 FE 개발에 특화된 하네스를 **다양한 환경**으로 확장한다.

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

**핵심**: Orchestrator 5단계 흐름은 환경 무관. **스킬만 교체**하면 된다.

## 에이전트 엔지니어링 구축

하네스 → 에이전트 엔지니어링으로의 진화:

```markdown
현재                              미래
──────                            ──────
인간이 하네스를 설계         →    AI가 하네스를 자기 개선
AI가 실행, 인간이 승인       →    인간은 목표와 경계만 설정
스킬이 정적 (SKILL.md 고정)  →    스킬 자동 튜닝 (A/B 테스트)
실패 패턴을 인간이 분석      →    메트릭 기반 자동 진단
```

| 단계                        | 설명                      | 인간의 역할   |
| --------------------------- | ------------------------- | ------------- |
| **Stage 1** 정적 하네스 (현재) | 인간 설계, AI 실행        | 설계 + 승인   |
| **Stage 2** 자기 진단       | 메트릭 수집 → 개선 제안    | 제안 승인     |
| **Stage 3** 자기 개선       | 스킬 자동 튜닝, A/B 테스트 | 정책 설정     |
| **Stage 4** 자율 에이전트   | 워크플로우 자동 재구성     | 목표만 설정   |

**최종 목표**: 개발자가 **"무엇을 만들 것인가"에만 집중**하고, 품질·안전·일관성은 AI 시스템이 자율적으로 보장하는 개발 환경.

---

# 참고 문서

- Anthropic, [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (2025)
- Anthropic, [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) (2025)
- [https://goddaehee.tistory.com/565](https://goddaehee.tistory.com/565)
- [https://news.hada.io/topic?id=28966](https://news.hada.io/topic?id=28966)
