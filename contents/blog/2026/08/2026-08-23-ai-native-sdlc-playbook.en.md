---
layout: post
title: The AI-Native SDLC Playbook — Code Is No Longer the Bottleneck
date: 2026-08-23
published: 2026-08-23
category: Development
tags: ['AI', 'Claude', 'SDLC', 'harness', 'dev-process']
comments: true
thumbnail: './assets/23/thumbnail.png'
github: ''
---

# 1. What Is This Post About?

Here it is in a single sentence.

> **As writing code got faster, the bottleneck moved to everything around it.** Planning, design, review, testing, and deployment still run at human speed. The AI-Native SDLC Playbook is Anthropic's answer to **"how do we rebuild the rest?"**

The last few posts have been climbing a ladder. How to build a [harness](/en/posts/2026-06-04-fe-harness/) → how to [trim context](/en/posts/2026-07-31-context-engineering-claude5/) → how to [choose a model](/en/posts/2026-08-01-choosing-claude-model/). This post is one rung higher: **the development process itself.**

## The Premise Broke; the Process Didn't

The playbook's opening line is effectively the whole argument.

> **"Code is no longer the bottleneck."**

The SDLC we use today was designed when **writing code was the most expensive phase**. Backlogs, refinement, sprints, review queues — all optimized around the assumption that implementation dominates. That assumption broke.

```markdown
An agent opens a PR in 30 minutes
   ↓
It waits 3 days in the review queue
   ↓
"We adopted AI — why aren't we faster?"
```

Because only one stage got faster and the rest didn't. **Speeding up a single stage by 10× doesn't make the system 10× faster; it just relocates the bottleneck.**

## The Playbook Really Has One Rule

Six stages and dozens of plays, but one rule runs through all of them.

> **"Each stage commits an artifact the next stage can read."**

That's why it becomes a **loop** rather than a line. Outputs that only humans read (meeting notes, Jira tickets, Confluence pages) become **inputs an agent can consume to start the next stage.**

---

# 2. Six Stages and the Artifact Chain

The whole picture first.

```markdown
Plan     → intent.md      problem · desired outcome · affected systems · constraints · open questions
Design   → spec.md        a spec written with org standards applied as skills + flagged concerns
Build    → plan.md → PR   the plan agreed in plan mode, plus the diff and tests that follow it
Test     → eval results   continuous evals that run whenever config (CLAUDE.md/skills/hooks) changes
Deploy   → deploy record  review findings · approval-gate logs
Maintain → intent.md      an incident diagnosis re-enters in the Stage 1 format
```

The last line is the point. **A problem found in production is written back out as an `intent.md` and re-enters at the front of the pipeline.** That's what makes it a loop instead of a sequence.

## What Actually Changes

| Stage | Traditional | AI-Native |
| --- | --- | --- |
| **Plan** | Committee-driven, hand-written requirements | Claude synthesizes sources into `intent.md` |
| **Design** | Separate analyst and designer phases | Compressed into **one session** guided by skills |
| **Build** | Hand-written code and tests, docs after the fact | Agent generates them; `CLAUDE.md` is version-controlled |
| **Test** | QA gates at phase boundaries | Continuous evals woven through implementation |
| **Deploy** | Line-by-line human review, uneven governance | Agentic review layers + hooks enforcing gates |
| **Maintain** | Humans watch and restart the process manually | Agents monitor; a breach re-enters the loop |

---

# 3. What Changes at Each Stage

## 3-1. Plan — `intent.md` Instead of Meetings

Whoever has the idea brainstorms with Claude **directly** and produces `intent.md` — a human-readable, machine-actionable proto-spec.

What matters here isn't the format but **who writes it.** The infrastructure ask for this stage is Claude access for non-engineers and a shared, version-controlled home for intents.

- **Leading** — time from first conversation to a committed `intent.md` (weeks → hours)
- **Lagging** — survival rate of intents accepted into Stage 2

## 3-2. Design — Requirements and Design Collapse into One Session

Attach the approved `intent.md` to a session **loaded with the org's skills** (brand, security, compliance, UX) and Claude produces `spec.md`, with anything questionable flagged.

> Because standards are **encoded as skills**, policy is applied *while the spec is being written* — not caught at review time.

Flagged concerns route to policy owners **before** engineering ever sees the spec. This is the pattern that recurs later: **enforcement at the moment of action, not inspection afterward.**

## 3-3. Build — Plan Mode as the Default

The thickest stage, with five plays.

| Play | What | Why |
| --- | --- | --- |
| **Plan mode** | Feed `spec.md`, iterate until the plan is right → commit `plan.md`, then implement | Later stages get something to check the diff against |
| **CLAUDE.md** | Commands, conventions, architecture, common mistakes | Knowledge from people's heads becomes **a file read at the top of every session** |
| **Skills** | Institutional knowledge that must apply consistently | When policy changes, you change one place |
| **Hooks** | Allow, block, or ask — deterministically | A guardrail that doesn't depend on the model's judgment |
| **Parallel sessions** | Separate git worktrees, several sessions at once | The ceiling is **how many streams one person can properly review** |

Two of the most practical rules in the whole playbook live here.

> **"When Claude makes a mistake twice, the correction goes into CLAUDE.md."**

> **"For bug fixes, write the failing test first and commit it. Only then ask Claude to make it pass without editing the test."**

The second one matters more than it looks. Ask for tests afterward and the agent writes tests **shaped by its own implementation.** Inverting the order is all it takes to make the oracle independent of the code.

And one more: **the feedback loop.** Claude runs the tests, builds, and takes screenshots to verify its own work *before* an engineer looks at it. Leave verification on the human side and it becomes the new bottleneck.

## 3-4. Test — Evals Become a Thread, Not a Gate

Instead of QA guarding a phase boundary, **the eval suite is woven through implementation.**

The key question is **when it runs**: when `CLAUDE.md`, skills, or hooks change. In other words, **treat the agent's configuration as code and put regression tests on changes to it.** And every production incident becomes a permanent eval.

> Enforce a pass-rate threshold as a merge check; log runs so they can be compared.

This is the same argument as [self-healing harnesses](/en/posts/2026-07-05-meta-harness/): verify rules when you *add* them, too.

## 3-5. Deploy — Review Moves Up a Level

Claude reviews incoming PRs against policy, and addresses review comments on its own PRs. The tech lead writes the **review policy** into `REVIEW.md`: which passes to run (bugs, security, compliance), how severity is graded, the cap on nits, and what's excluded.

> **"All PRs get an identical set of review passes... Human attention moves up a level, to whether the change does what the plan intended."**

Hooks then act as **approval gates**. A production deploy pauses until a named person authorizes it, and allow/block decisions are logged with timestamps.

Deployment itself is exposed via MCP with scoped credentials: agents deploy to dev freely, production requires the gate.

> **"Rollback should be the most rehearsed path in the pipeline."** Before an autonomous agent is allowed to roll back, that path should already be exercised regularly in staging.

## 3-6. Maintain — Closing the Loop

A detection script watches production metrics (test failure rate, post-deploy 5xx, PR cycle time) and judges deviations with **deterministic rules (Western Electric)**. Response authority scales with the size of the breach.

| Breach | Response |
| --- | --- |
| **1σ** | Log only |
| **2σ** | Claude diagnoses (read-only) |
| **3σ** | Claude may act (open a PR or trigger a pre-approved runbook) |

Scaling permission to severity is, to me, the sharpest idea in the playbook. The question stops being **"should the agent have authority?"** and becomes **"how much, and when?"**

The diagnosis is then written as an `intent.md` **in the Stage 1 format** and lands in the triage queue. The loop closes.

The Slack/Teams integration (Claude Tag) works on the same principle: Claude joins the incident channel as a member and gives first response, and **the conversation itself is the audit trail.**

> **"The channel is the audit trail: request, diagnosis, human authorization and fix all stay where the incident was handled."**

---

# 4. Four Controls — and Where Each Belongs

This is what people mix up most in practice. All four "give the agent rules," but they behave completely differently.

| | Nature | Enforcement | Put here | Don't put here |
| --- | --- | --- | --- | --- |
| **CLAUDE.md** | Context for this repo | None (read and considered) | Commands, conventions, structure, repeated mistakes | Org-wide policy |
| **Skills** | Policy applied consistently | None (constrains actions) | Security review procedure, brand rules | Component details |
| **Hooks** | Deterministic gate | **Yes** (block / require approval) | Non-negotiable gates | Rules needing judgment |
| **Evals** | Regression tests for config | **Yes** (merge check) | Cases derived from incidents | One-off checks |

The column to read is **Enforcement**. `CLAUDE.md` and skills are things you *hope* the model follows; hooks and evals **hold even when the model doesn't cooperate.** Writing a must-hold rule into `CLAUDE.md` and feeling safe is the common mistake.

> As the playbook puts it: **blocks should explain themselves.** A hook that blocks without saying why just invites the agent to route around it.

---

# 5. Measure Only Leading Indicators and You Will Regret It

There's a reason every stage in the playbook pairs a leading indicator with a lagging one.

| | What it measures | Examples |
| --- | --- | --- |
| **Leading** | How much faster | Idea→artifact time, time to first review, first-pass CI success |
| **Lagging** | Whether quality held | Spec drift, defects caught pre-merge vs. reaching production, repeat incidents |

**Agents make leading indicators look great with almost no effort.** PRs multiply, time-to-first-review drops to minutes, idea-to-spec takes a day. Whether that's **acceleration with quality intact or debt you'll repay later** is invisible from leading indicators alone.

Two lagging indicators are especially good:

- **How often the merged diff matches the committed `plan.md`** — did we build what we planned?
- **How many `spec.md` commits land after the first `plan.md` for the same change** — did requirements churn?

Committing artifacts makes both of these **measurable automatically.** That's the real payoff of the artifact chain: the audit trail is a side effect, measurability is the substance.

---

# 6. Applying It to This Repo

Reading without applying leaves nothing behind, so I mapped this blog's repo onto the six stages.

| Stage | What exists | What's missing |
| --- | --- | --- |
| **Plan** | — | No `intent.md` |
| **Design** | `product-spec-harness` produces PRDs and stories | Outputs don't form a **committed chain** |
| **Build** | `CLAUDE.md`, several harness skills | `plan.md` never gets committed |
| **Test** | husky pre-commit in 3 steps (lint→vitest→playwright) | **No evals for harness/skill changes** |
| **Deploy** | `deploy.yml` → `gh-pages`, fully automated | No approval gate (barely needed for a personal blog) |
| **Maintain** | One cron that refreshes popular posts | No metric watch, no auto-diagnosis |

Honestly, a personal blog does not need all six stages. Production approval gates and 3σ autonomous response are **overkill at this size.** But two things are worth taking regardless of scale.

**① The missing evals are the biggest hole.** The pre-commit hook runs lint, unit tests, and E2E — all of which check **application code.** There is *nothing* that checks whether editing `CLAUDE.md` or changing a harness skill made the agent behave worse. The playbook's whole point is to treat configuration as code, and configuration is precisely what sits outside my tests.

**② `plan.md` pays off even solo.** Commit the plan and you can trace "why did I do it this way" through intent rather than through a diff. In a one-person repo, **me three months from now is a stranger.**

---

# 7. Easy Things to Misread

## Misread 1 — "So it's just more documents?"

No. `intent.md`, `spec.md`, and `plan.md` are **inputs to the next stage, not reports for humans.** The audience is different.

The test is simple: **delete any artifact nobody reads — human or agent.** If the next stage doesn't actually consume the file to get started, it isn't an artifact in the playbook's sense; it's just a document.

## Misread 2 — "Human review goes away"

The opposite. Review **moves up a level.**

```markdown
Before: "Does this diff have bugs?"          ← a machine answers this better
After:  "Does this change do what plan.md intended?"  ← only a human answers this
```

The bug, security, and compliance passes run **identically on every PR** — more consistently than humans manage (humans skim on Friday afternoons). What's left are the questions that need judgment.

## Misread 3 — "This is enterprise-only"

The full six stages plus Managed Settings plus 3σ autonomy, yes. But **the one artifact rule** you can adopt alone, today. Get a plan in plan mode, commit it, check the merge against it — no infrastructure required.

---

# 8. Wrapping Up

| | What | Why |
| --- | --- | --- |
| **1. The bottleneck moved** | It isn't code; it's everything around it | One fast stage doesn't make a fast system |
| **2. Commit an artifact per stage** | In a form the next stage can read | Audit trail is the side effect; measurability is the point |
| **3. Rules that must hold go in hooks and evals** | `CLAUDE.md` records a hope, not a guarantee | It has to hold when the model doesn't cooperate |

And this is the same story as the earlier posts, on a different axis.

- [Self-healing harness](/en/posts/2026-07-05-meta-harness/) — verify when you **add** a rule
- [Trimming context engineering](/en/posts/2026-07-31-context-engineering-claude5/) — verify when you **remove** one
- [Choosing a model](/en/posts/2026-08-01-choosing-claude-model/) — verify when you **pick a model**
- This post — verify when you **change the process.** That's what evals are

The playbook's closing line works as this post's closing line too.

> **"The loop keeps running. Human judgement stays above it."**

What gets automated is the loop. What doesn't is **deciding where to point it.**

---

# References

- Anthropic, [The AI-Native SDLC Playbook](https://claude.com/blog/the-ai-native-sdlc-playbook) (2026)
- Anthropic, [Claude Code Hooks](https://platform.claude.com/docs/en/claude-code/hooks) · [Agent Skills](https://platform.claude.com/docs/en/claude-code/skills)
- Earlier posts — [Choosing a Claude Model](/en/posts/2026-08-01-choosing-claude-model/) · [Trimming Context Engineering](/en/posts/2026-07-31-context-engineering-claude5/) · [Self-Healing Harness Engineering](/en/posts/2026-07-05-meta-harness/)
