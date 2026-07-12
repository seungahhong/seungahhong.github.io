---
layout: post
title: 제품 스펙 하네스 (product-spec-harness)
date: 2026-07-12
published: 2026-07-12
category: 개발
tags: ['AI', '하네스', 'PRD', '기획', 'Claude']
comments: true
thumbnail: './assets/12/thumbnail.png'
github: ''
---

## 소개

`product-spec-harness`는 기획자(PM)가 요구·문제 또는 기획안 초안으로부터 제품 기획문서(PRD)와 사용자 스토리를 단계별로 작성·검증하는 도메인 무관 인터랙티브 멀티 에이전트 하네스다. 개발 착수 *전* 단계의 제품 기획 산출물(문제 정의 → 기획 완성도 점검(DoR) → PRD → 사용자 스토리 → 적대적 검증)에 특화한다. 다른 마켓플레이스 플러그인에 의존하지 않는 독립 플러그인이다(현재 버전 0.3.0).

매 Phase 산출물을 사용자에게 보여주고 승인을 받은 뒤에만 다음 단계로 넘어간다. 한 번에 한 가지씩 인터뷰하듯 질문하며, 어려운 용어에는 쉬운 말 1줄 정의를 곁들인다.

두 가지 입력 모드를 지원한다.

- **(A) 기획안 입력 모드** — 기획안(초안)을 인자/대화로 주면 그 내용에서 문제 정의를 추출한다. 이어 생성 *전*에 원본 기획안의 기획 완성도 점검(DoR)을 먼저 평가(사용자 동의 시)해 보강점을 도출하고, 그 보강점을 반영해 PRD·사용자 스토리를 반드시 생성한 뒤 마지막에 산출물을 적대적으로 검증한다.
- **(B) 대화형 인터뷰 모드** — 기획안이 없으면 한 번에 한 질문으로 문제를 정의한 뒤 PRD·스토리를 만든다. 평가할 입력 기획안이 없으므로 Phase 1(기획 완성도 점검)은 건너뛴다.

## 배경

### 왜 단계별·인터랙티브인가

제품 기획은 한 번에 정답이 나오지 않으며, 잘못된 문제 정의 위에 쌓은 PRD·스토리는 전부 폐기된다. 그래서 이 하네스는 매 Phase 종료 시 핵심 산출물을 보여주고 사용자 승인을 받은 뒤에만 다음으로 넘어간다. 승인 게이트는 비용이 가장 싼 시점(아직 한 Phase 산출물만 있을 때)에 방향 오류를 잡는 장치다.

### 기획 완성도 점검(DoR)을 생성 전에 두는 이유

루브릭(`references/dor-review-rubric.md`)에 정리된 근거는 다음과 같다.

- **모호한 요구사항은 곧 다운스트림 재작업이다.** "빠르게", "쉽게", "적절히" 같은 표현은 구현자와 QA에게 서로 다른 해석을 남기고, 그 차이는 QA 막바지나 릴리스 후 재작업으로 청구된다. 불완전·은닉 요구사항은 요구공학에서 가장 많이 지목되는 문제이며(NaPiRE 설문 228명 중 109명=48%, Méndez Fernández et al. 2017), 회피 가능한 재작업은 프로젝트 노력의 상당 부분을 차지한다(Boehm & Basili 2001).
- **인수조건은 테스트 가능해야 하고 정상 경로만으로는 부족하다.** 모든 인수조건은 조건·행동·결과(Given-When-Then)로 표현 가능해야 하며, 정상 흐름뿐 아니라 경계·에러·빈 상태·권한 흐름을 포함해야 한다.
- **자동 탐지(LLM)는 사람 검토를 보조하지, 그 자체로 게이트를 통과시키지 않는다.** LLM·NLP는 유저스토리 결함·모호성 탐지를 돕지만(in-context 예시로 모호 요구 분류가 0-shot 대비 평균 20.2% 향상 — Bashir/Ferrari et al., ICSME 2025), 이상적 템플릿에서 벗어났다는 이유로 과대탐지·환각을 보일 수 있어(GPT-5; 룰 기반 AQUSA 정밀도 0.61 — Perkusich et al. 2025), 평가 결과는 확정 판정이 아니라 보강 후보로 제시하고 도메인·맥락 판정은 사람이 한다.

### 독립 플러그인으로 내재화한 이유

기획 완성도 점검(DoR) 방법론(기획 완성도 게이트·좋은 스토리 6가지 기준(INVEST) 점수표·조건·행동·결과 완결성·모호성 점검·의존성 참조)을 외부 플러그인 참조 없이 이 플러그인 안(`references/dor-review-rubric.md`)에 내재화했다. 이 플러그인만 설치해도 단독으로 동작한다.

### 범위 밖 (경계)

트리거 충돌을 막기 위해 다음은 명시적으로 범위 밖이며, 이 경계는 `plugin.json` description과 `evals/trigger-eval.json`에 명시되어 있다.

- 프론트엔드 화면 구현·컴포넌트·기술 설계용 PRD·구현 요구사항·코드 작성
- 코드 리뷰·커밋 메시지·PR 리뷰, 하네스 자체를 생성·진단·개선하는 작업
- 이미 완성된 PRD/유저스토리/디자인/계약/인수조건을 (작성이 아니라) 핸드오프 시점에 독립 게이트로 검수만 하는 작업

## 설계

### 5단계 Phase 구성

| Phase | 이름 | 호출 에이전트 | 핵심 산출물 | 게이트 |
| --- | --- | --- | --- | --- |
| 0 | 요구/문제 정의 (Discovery) | requirements-analyst | 문제 정의 카드 (problem / target_users / goals / constraints / success_metrics) | 기획안 있으면 추출, 없으면 한 번에 1질문 인터뷰 → 승인 |
| 1 | 기획 완성도 점검(DoR) (모드 A·진입질문 필수·생성 전 선행) | dor-evaluator | `# 기획 완성도 점검 결과(DoR Review)` • 보완할 점 점검표 (채팅 제시, 즉시 저장 안 함) | 진입질문 필수 제시, 평가 실행만 예/아니오, 결과를 PRD/스토리에 반영 |
| 2 | 기획문서(PRD) 작성 | prd-writer | 배경·문제 / 목표·성공지표 / 범위 In·Out / 핵심 요구사항(기능·비기능) / 가정·리스크 / 마일스톤 (Phase 1 보강점 반영) | 쓰기 전 미리보기 승인 |
| 3 | 사용자 스토리 도출 | story-writer | 스토리("…로서 …하고 싶다, 왜냐하면 …") + 수용기준(Given/When/Then) + INVEST 자가점검 (Phase 1 보강점 반영) | 승인 |
| 4 | 적대적 검증 | spec-reviewer | 요구↔스토리 추적 매트릭스 / INVEST / 수용기준 관찰성 / 일관성 / 모호·판정불가 색출 (채팅 제시 + 동의 시 `adversarial-review.md` 저장) | 리포트 + 저장 확인 + 승인, 보완 시 additive-first |
| 마무리 | 기획 완성도 점검(DoR) 결과 저장 (opt-in) | (오케스트레이터) | Phase 1 평가 결과 → `product-spec-review.md` | PRD·스토리 생성 후 사용자가 저장을 선택할 때만 저장 |

매 Phase 종료 시 보고 형식: `[Phase N] {핵심결정} — 다음: {다음}. 진행할까요?`

### 에이전트 팀

5개 에이전트가 협업하는 하네스이며, 오케스트레이터의 모든 Agent 호출에 `model: "opus"`를 명시한다(추론 품질이 기획 산출물 품질을 좌우한다는 규약).

- **requirements-analyst** (Phase 0) — 요구/문제/사용자 정의. 기획안이 있으면 고정 5필드 카드를 추출하고, 추출 불가·모호한 필드만 한 번에 한 질문으로 보강한다. 판정 불가한 목표·성공지표는 거부한다.
- **dor-evaluator** (Phase 1) — 원본 기획안을 기획 완성도 점검(DoR) 관점에서 평가한다. INVEST의 Testable/Independent가 0이면 착수 차단. 기획안을 직접 고치지 않고 보강 후보만 제시하며, 결과는 채팅으로만 제시(즉시 저장 안 함)한다.
- **prd-writer** (Phase 2) — 문제 정의 카드와 Phase 1 보강점을 입력받아 표준 구조 PRD를 작성한다. 범위 Out 명시와 관찰형 성공지표가 필수.
- **story-writer** (Phase 3) — PRD 핵심 요구를 사용자 스토리 + 수용기준으로 전개하고, 각 스토리에 INVEST 자가점검과 커버 요구(R#) 태깅을 붙여 요구↔스토리 추적을 가능하게 한다.
- **spec-reviewer** (Phase 4) — PRD·스토리를 적대적으로 검증한다. 칭찬형 코멘트 금지, 약점·심각도·처리를 담은 리포트 산출. 보완 권고는 additive-first를 따른다.

### 입력 모드 판별과 Phase 1 vs 4의 차이

- 시작 시 입력 모드를 1회 판별해 채팅에 1줄로 선언한다. 문제·목표·기능·대상·제약 중 둘 이상을 서술한 사용자 제공 텍스트/파일이면 기획안(모드 A)으로 간주하고, 경계가 모호하면 모드 A로 안전 디폴트한다(모드 미정인 채 PRD 직행 금지). 모드 A에서 Phase 1 진입 질문 제시는 필수이며, 평가 *실행* 여부만 사용자 동의(예/아니오) 대상이다.
- **Phase 1 vs Phase 4** — 대상이 다르다. Phase 1은 *입력 원본 기획안*을 생성 *전*에 기획 완성도 점검(DoR)으로 평가해 보강점을 PRD·스토리에 반영(채팅 제시). Phase 4는 *생성 산출물*(PRD·스토리)을 적대적으로 검증(채팅 제시 + 동의 시 저장).

### 승인 게이트·저장 정책 (모든 Phase 공통 원칙)

- **승인 게이트** — 매 Phase 종료 시 핵심 산출물 + 1줄 보고를 제시하고 승인을 받는다. 파일을 쓰기 전 전체 내용을 미리보기로 보여준다.
- **관찰형 수용기준** — 수용기준과 성공지표는 제3자가 관찰로 판정 가능한 조건·행동·결과(Given/When/Then)로 작성하며, "좋다/만족/직관적" 같은 판정 불가 문장은 금지한다.
- **완전성·추적** — 모든 PRD 핵심 요구가 ≥1개 스토리로 커버되는지 요구↔스토리 매트릭스로 추적한다.
- **additive-first** — 합의된 PRD/스토리를 보완할 때 기존 항목을 뒤엎기 전에 비파괴 추가·완화를 먼저 제안한다.
- **저장 정책 (opt-in)** — 산출물은 `.claude/_docs/<기획서 슬러그>/`에 모은다. `PRD.md`·`user-stories.md`는 미리보기 승인 시 저장하고, `product-spec-review.md`(Phase 1 결과)와 `adversarial-review.md`(Phase 4 리포트)는 저장 여부를 물어 동의할 때만 기록한다.

## 구현내용

### 디렉토리 구조

```javascript
product-spec-harness/
├── .claude-plugin/
│   └── plugin.json                # 플러그인 메타 + 트리거 경계 description
├── CLAUDE.md                      # 하네스 포인터 + 5단계 요약 + 변경 이력
├── README.md                      # 사용자용 개요·사용법·도구 경계·입력 모드
├── agents/
│   ├── requirements-analyst.md    # Phase 0 요구/문제/사용자 정의 (카드 추출)
│   ├── dor-evaluator.md           # Phase 1 원본 기획안 기획 완성도 점검(DoR)
│   ├── prd-writer.md              # Phase 2 기획문서(PRD) 작성
│   ├── story-writer.md            # Phase 3 사용자 스토리 + 수용기준
│   └── spec-reviewer.md           # Phase 4 적대적 검증
├── skills/
│   └── product-spec/
│       ├── SKILL.md               # 오케스트레이터(진입점, 5 Phase, 입력 모드 A/B)
│       └── references/
│           ├── prd-template.md        # PRD 표준 6섹션 구조 + 작성기준
│           ├── user-story-guide.md    # As a/I want/so that + Gherkin + INVEST
│           └── dor-review-rubric.md   # DoR 루브릭 내재화 + 점검표 + 근거
└── evals/
    └── trigger-eval.json          # should-trigger / should-not-trigger 트리거 점검
```

### 핵심 구현 요소

- **오케스트레이터 (`skills/product-spec/SKILL.md`)** — 진입점 스킬. 입력 모드 판별 → Phase 0\~4 순차 진행 → 마무리(저장 opt-in)를 정의한다. 각 Phase에서 전용 에이전트를 `Agent(subagent_type=..., model="opus", prompt=...)` 형태로 호출하며, 각 호출의 역할·입력·규칙·출력을 프롬프트로 명시한다.
- **참조 문서 3종** — `prd-template.md`(고정 6섹션: 배경·문제 / 목표·성공지표 / 범위 In·Out / 핵심 요구사항 / 가정·리스크 / 마일스톤), `user-story-guide.md`(스토리 형식 + Gherkin 수용기준 + INVEST), `dor-review-rubric.md`(DoR 게이트·INVEST 스코어카드·Given-When-Then 완결성·모호성 점검·의존성 + `# 기획 완성도 점검 결과(DoR Review)` 템플릿 + 8개 섹션 점검표 + Honesty Guardrail·근거).
- **보완할 점 점검표 형식** — 충족 항목은 `[O]`, 미충족 항목은 `[ ]` + 바로 아래 `↳ 이렇게 보강:`(Before→After 예시)로 표기한다.
- **정직성 가드(Honesty Guardrail)** — 정량 수치는 검증된 등급·출처와 함께만 인용하며, '개선 N%' 약속을 금지한다.
- **트리거 점검(`evals/trigger-eval.json`)** — 발동해야 하는 경우(should-trigger, 예: "PRD 작성", "사용자 스토리 도출")와 발동하면 안 되는 경우(should-not-trigger, 예: 프론트엔드 개발 PRD·코드·커밋)를 정의해 트리거 정확도를 점검한다.

### 산출물 배치

별도 지정이 없으면 `.claude/_docs/<기획서 슬러그>/` 폴더(기획서별 폴더 하나)에 다음을 만든다. 슬러그는 기획서/제품명에서 영문 소문자로 생성하며, 모든 문서 언어는 한국어다.

```javascript
.claude/_docs/<기획서 슬러그>/        # 예: .claude/_docs/email-signup/
  PRD.md                   # Phase 2 산출 — 미리보기 승인 후 저장
  user-stories.md          # Phase 3 산출 — 미리보기 승인 후 저장
  product-spec-review.md   # Phase 1 DoR 결과 — 마무리에서 저장을 선택할 때만
  adversarial-review.md    # Phase 4 검증 리포트 — 저장을 선택할 때만
```

### 변경 이력

| 날짜 | 변경 | 내용 |
| --- | --- | --- |
| 2026-06-13 | 플러그인 신설 | 기획자용 기획문서·사용자스토리 4단계 인터랙티브 하네스 |
| 2026-06-17 | 기획안 입력 + DoR 평가 내재화 | 기획안 인자 → 카드 추출 후 PRD·스토리 생성. `dor-evaluator` • `dor-review-rubric.md` 신설(Phase 1 생성 전 선행 평가). 4→5단계, v0.2.0 |
| 2026-06-17 | Phase 1 0→2 스킵 결함 수정 | 모드 판별 강화·Phase 0 게이트 모드별 분리·Phase 1 진입 질문 필수화로 모드 A에서 Phase 1을 건너뛰는 원인 3종 비파괴 보강. v0.2.1 |
| 2026-06-21 | 기획자용 용어 순화 + 저장 정책 변경 | 어려운 용어(DoR/INVEST/Gherkin 등)를 쉬운 문구로 풀고 원어 병기. 점검표 형식 변경(\[O\]/\[ \]+보강 예시). 산출물 위치를 `.claude/_docs/<슬러그>/`로 이동, 적대적 검증 리포트 저장 opt-in화 |
