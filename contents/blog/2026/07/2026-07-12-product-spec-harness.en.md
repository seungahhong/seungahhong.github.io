---
layout: post
title: Product Spec Harness (product-spec-harness)
date: 2026-07-12
published: 2026-07-12
category: Development
tags: ['AI', 'Harness', 'PRD', 'Product Spec', 'Claude']
comments: true
thumbnail: './assets/12/thumbnail.png'
github: ''
---

## Introduction

`product-spec-harness` is a domain-agnostic, interactive multi-agent harness with which a product manager (PM) drafts and validates a Product Requirements Document (PRD) and user stories step by step, starting from a need/problem or a draft plan. It specializes in the product-planning artifacts of the stage *before* development begins (problem definition → Definition of Ready check (DoR) → PRD → user stories → adversarial verification). It is a standalone plugin that does not depend on any other marketplace plugin (current version 0.3.0).

At the end of every Phase it shows the artifact to the user and moves to the next step only after approval. It asks one thing at a time as if interviewing, and adds a one-line plain-language definition for difficult terms.

It supports two input modes.

- **(A) Draft-input mode** — If you provide a draft plan via argument/conversation, it extracts the problem definition from that content. Then, *before* generation, it first evaluates the original draft's Definition of Ready (DoR) (with the user's consent) to derive improvement points, and it then must generate the PRD and user stories reflecting those points, finally verifying the artifacts adversarially.
- **(B) Conversational interview mode** — If there is no draft plan, it defines the problem one question at a time and then produces the PRD and stories. Since there is no input draft to evaluate, it skips Phase 1 (Definition of Ready check).

## Background

### Why step-by-step and interactive

Product planning does not yield the right answer in one shot, and any PRD and stories built on a wrong problem definition are entirely discarded. That is why this harness shows the key artifact at the end of every Phase and moves on only after the user approves. The approval gate is a mechanism to catch a wrong direction at the cheapest possible moment (when there is still only one Phase's artifact).

### Why the Definition of Ready check (DoR) comes before generation

The rationale organized in the rubric (`references/dor-review-rubric.md`) is as follows.

- **Ambiguous requirements are downstream rework.** Expressions like "fast," "easy," and "appropriately" leave implementers and QA with different interpretations, and that gap gets billed as rework near the end of QA or after release. Incomplete/hidden requirements are the most frequently cited problem in requirements engineering (NaPiRE survey: 109 of 228 respondents = 48%, Méndez Fernández et al. 2017), and avoidable rework accounts for a substantial share of project effort (Boehm & Basili 2001).
- **Acceptance criteria must be testable, and the happy path alone is not enough.** Every acceptance criterion must be expressible as condition-action-result (Given-When-Then), and must cover not only the happy flow but also boundary, error, empty-state, and permission flows.
- **Automatic detection (LLM) assists human review; it does not pass the gate on its own.** LLMs/NLP help detect defects and ambiguity in user stories (in-context examples improved ambiguous-requirement classification by an average of 20.2% over 0-shot — Bashir/Ferrari et al., ICSME 2025), but they can over-detect or hallucinate simply because something deviates from an ideal template (GPT-5; rule-based AQUSA precision 0.61 — Perkusich et al. 2025). Therefore evaluation results are presented as improvement candidates rather than as final verdicts, and a human makes the domain/context judgment.

### Why it internalizes everything as a standalone plugin

The Definition of Ready (DoR) methodology (readiness gate, a scorecard for the six criteria of a good story (INVEST), condition-action-result completeness, ambiguity check, dependency reference) is internalized inside this plugin (`references/dor-review-rubric.md`) without referencing an external plugin. It works standalone with only this plugin installed.

### Out of scope (boundaries)

To avoid trigger conflicts, the following are explicitly out of scope, and this boundary is stated in the `plugin.json` description and in `evals/trigger-eval.json`.

- Frontend screen implementation, components, a PRD for technical design, implementation requirements, or writing code
- Code review, commit messages, PR review, and work that creates/diagnoses/improves the harness itself
- Merely inspecting an already-completed PRD/user stories/design/contract/acceptance criteria as an independent gate at handoff time (rather than authoring them)

## Design

### The 5-Phase structure

| Phase | Name | Invoked agent | Key artifact | Gate |
| --- | --- | --- | --- | --- |
| 0 | Need/problem definition (Discovery) | requirements-analyst | Problem-definition card (problem / target_users / goals / constraints / success_metrics) | Extract if a draft exists; otherwise interview one question at a time → approve |
| 1 | Definition of Ready check (DoR) (mode A · entry question required · precedes generation) | dor-evaluator | `# Definition of Ready Review (DoR Review)` • checklist of points to improve (shown in chat, not saved immediately) | Entry question required; only whether to *run* the evaluation is yes/no; results reflected into PRD/stories |
| 2 | PRD authoring | prd-writer | Background·problem / goals·success metrics / scope In·Out / core requirements (functional·non-functional) / assumptions·risks / milestones (reflecting Phase 1 improvements) | Preview approval before writing |
| 3 | User story derivation | story-writer | Stories ("As …, I want …, because …") + acceptance criteria (Given/When/Then) + INVEST self-check (reflecting Phase 1 improvements) | Approval |
| 4 | Adversarial verification | spec-reviewer | Requirement↔story traceability matrix / INVEST / acceptance-criteria observability / consistency / hunting for ambiguity·undecidability (shown in chat + saved to `adversarial-review.md` on consent) | Report + save confirmation + approval; additive-first when supplementing |
| Wrap-up | Save the Definition of Ready (DoR) result (opt-in) | (orchestrator) | Phase 1 evaluation result → `product-spec-review.md` | Saved only when the user chooses to save, after the PRD·stories are generated |

Report format at the end of every Phase: `[Phase N] {key decision} — next: {next}. Shall we proceed?`

### The agent team

It is a harness in which 5 agents collaborate, and the orchestrator specifies `model: "opus"` on every Agent call (the convention being that reasoning quality determines the quality of the planning artifacts).

- **requirements-analyst** (Phase 0) — Defines the need/problem/user. If a draft exists it extracts a fixed 5-field card, and it supplements only the fields that cannot be extracted or are ambiguous, one question at a time. It rejects undecidable goals and success metrics.
- **dor-evaluator** (Phase 1) — Evaluates the original draft from the Definition of Ready (DoR) perspective. If INVEST's Testable/Independent is 0, it blocks kickoff. It does not edit the draft directly but only presents improvement candidates, and it presents the result in chat only (does not save immediately).
- **prd-writer** (Phase 2) — Takes the problem-definition card and Phase 1 improvement points and writes a standard-structure PRD. Explicit scope-Out and observable success metrics are mandatory.
- **story-writer** (Phase 3) — Develops the PRD's core requirements into user stories + acceptance criteria, attaching an INVEST self-check and covered-requirement (R#) tagging to each story to enable requirement↔story traceability.
- **spec-reviewer** (Phase 4) — Verifies the PRD·stories adversarially. Praise-style comments are banned; it produces a report containing weaknesses, severity, and disposition. Supplementary recommendations follow additive-first.

### Input-mode discrimination and the difference between Phase 1 and 4

- At the start it discriminates the input mode once and declares it in one line in chat. User-provided text/files that describe two or more of problem/goal/feature/target/constraint are treated as a draft (mode A), and when the boundary is ambiguous it safely defaults to mode A (going straight to the PRD with the mode undetermined is forbidden). In mode A, presenting the Phase 1 entry question is mandatory, and only whether to *run* the evaluation is subject to user consent (yes/no).
- **Phase 1 vs Phase 4** — Their targets differ. Phase 1 evaluates the *input original draft* with the Definition of Ready (DoR) *before* generation and reflects improvement points into the PRD·stories (shown in chat). Phase 4 verifies the *generated artifacts* (PRD·stories) adversarially (shown in chat + saved on consent).

### Approval gate·save policy (principles common to all Phases)

- **Approval gate** — At the end of every Phase it presents the key artifact + a one-line report and obtains approval. Before writing a file it shows the full content as a preview.
- **Observable acceptance criteria** — Acceptance criteria and success metrics are written as condition-action-result (Given/When/Then) that a third party can judge by observation, and undecidable sentences like "good/satisfying/intuitive" are banned.
- **Completeness·traceability** — A requirement↔story matrix tracks whether every core PRD requirement is covered by ≥1 story.
- **additive-first** — When supplementing an agreed PRD/stories, it proposes non-destructive additions·relaxations before overturning existing items.
- **Save policy (opt-in)** — Artifacts are gathered under `.claude/_docs/<plan slug>/`. `PRD.md`·`user-stories.md` are saved upon preview approval, while `product-spec-review.md` (Phase 1 result) and `adversarial-review.md` (Phase 4 report) are recorded only when it asks whether to save and the user consents.

## Implementation

### Directory structure

```javascript
product-spec-harness/
├── .claude-plugin/
│   └── plugin.json                # Plugin meta + trigger-boundary description
├── CLAUDE.md                      # Harness pointer + 5-phase summary + change history
├── README.md                      # User overview·usage·tool boundaries·input modes
├── agents/
│   ├── requirements-analyst.md    # Phase 0 need/problem/user definition (card extraction)
│   ├── dor-evaluator.md           # Phase 1 original-draft Definition of Ready check (DoR)
│   ├── prd-writer.md              # Phase 2 PRD authoring
│   ├── story-writer.md            # Phase 3 user stories + acceptance criteria
│   └── spec-reviewer.md           # Phase 4 adversarial verification
├── skills/
│   └── product-spec/
│       ├── SKILL.md               # Orchestrator (entry point, 5 phases, input modes A/B)
│       └── references/
│           ├── prd-template.md        # PRD standard 6-section structure + authoring criteria
│           ├── user-story-guide.md    # As a/I want/so that + Gherkin + INVEST
│           └── dor-review-rubric.md   # DoR rubric internalized + checklist + rationale
└── evals/
    └── trigger-eval.json          # should-trigger / should-not-trigger trigger check
```

### Core implementation elements

- **Orchestrator (`skills/product-spec/SKILL.md`)** — The entry-point skill. It defines input-mode discrimination → sequential progression through Phase 0\~4 → wrap-up (opt-in save). In each Phase it invokes a dedicated agent as `Agent(subagent_type=..., model="opus", prompt=...)`, specifying each call's role·input·rules·output in the prompt.
- **Three reference documents** — `prd-template.md` (fixed 6 sections: background·problem / goals·success metrics / scope In·Out / core requirements / assumptions·risks / milestones), `user-story-guide.md` (story format + Gherkin acceptance criteria + INVEST), `dor-review-rubric.md` (DoR gate·INVEST scorecard·Given-When-Then completeness·ambiguity check·dependencies + the `# Definition of Ready Review (DoR Review)` template + an 8-section checklist + Honesty Guardrail·rationale).
- **Format of the points-to-improve checklist** — Met items are marked `[O]`, unmet items are marked `[ ]` followed immediately below by `↳ Improve like this:` (a Before→After example).
- **Honesty Guardrail** — Quantitative figures are cited only with a verified grade·source, and promises of "N% improvement" are forbidden.
- **Trigger check (`evals/trigger-eval.json`)** — It defines cases that should trigger (should-trigger, e.g., "write a PRD," "derive user stories") and cases that should not (should-not-trigger, e.g., a frontend-development PRD·code·commit) to check trigger accuracy.

### Artifact placement

Unless otherwise specified, it creates the following under a `.claude/_docs/<plan slug>/` folder (one folder per plan). The slug is generated in lowercase English from the plan/product name, and every document's language is Korean.

```javascript
.claude/_docs/<plan slug>/          # e.g., .claude/_docs/email-signup/
  PRD.md                   # Phase 2 output — saved after preview approval
  user-stories.md          # Phase 3 output — saved after preview approval
  product-spec-review.md   # Phase 1 DoR result — only when chosen to save at wrap-up
  adversarial-review.md    # Phase 4 verification report — only when chosen to save
```

### Change history

| Date | Change | Content |
| --- | --- | --- |
| 2026-06-13 | Plugin created | A 4-phase interactive harness for a PM's planning document·user stories |
| 2026-06-17 | Draft input + DoR evaluation internalized | Draft argument → card extraction, then PRD·story generation. Newly added `dor-evaluator` • `dor-review-rubric.md` (Phase 1 pre-generation evaluation). 4→5 phases, v0.2.0 |
| 2026-06-17 | Fix for the Phase 1 0→2 skip defect | Non-destructive supplements for 3 causes of skipping Phase 1 in mode A: strengthened mode discrimination, per-mode separation of the Phase 0 gate, and making the Phase 1 entry question mandatory. v0.2.1 |
| 2026-06-21 | Softened PM terminology + changed save policy | Difficult terms (DoR/INVEST/Gherkin, etc.) explained in plain wording with the original term alongside. Changed the checklist format (\[O\]/\[ \] + improvement example). Moved artifact location to `.claude/_docs/<slug>/`, made the adversarial-review report save opt-in |
