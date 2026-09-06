---
layout: post
title: The Tool Was Not the Variable — Where 50 Teams Using the Same Tool Split
date: 2026-09-05
published: 2026-09-05
category: Development
tags: ['AI', 'agents', 'dev-process', 'productivity', 'teams']
comments: true
thumbnail: './assets/05/thumbnail.png'
github: ''
---

# 1. What Is This Post About?

Notes on Clare Liguori's talk [From AI-Assisted to AI-Native: Building a Frontier Development Team](https://www.youtube.com/watch?v=pqlWNihgdjI). In one sentence:

> **Ninety percent of the 50 teams used the same coding assistant. Half saw under 3x. The other half saw a median of 4.5x, sometimes past 10x.** The tool was the same — so **the tool was not the variable.**

If the [AI-Native SDLC Playbook](/en/posts/2026-08-23-ai-native-sdlc-playbook/) was a proposal for how to rebuild the process, this talk is **what happened when roughly a year of real teams were actually watched.** Proposal and observation are different things.

## Why This Talk Is Different

Most AI productivity stories come in two flavors: blow up **one success story**, or blow up **the skepticism**. This talk is interesting because it's neither.

```markdown
Studied:    50 ordinary teams (normal seniority mixes, existing codebases)
Duration:   the better part of a year
Same:       90% used the same coding assistant
Different:  how they worked
Result:     half under 3x · half a median of 4.5x
```

Not greenfield, not a hand-picked all-star squad, not a two-week pilot. **Ordinary teams watched for a long time** — which is why the conclusion lands on something other than tooling.

---

# 2. What the Pilots Actually Measured

The talk leads with the flashy numbers, then discounts them itself. That order matters.

## The Flashy Side

| Case | Original estimate | Actual |
| --- | --- | --- |
| **Bedrock team** | 30 people · 12–18 months | **6 people · 76 days** |
| **Prime Video** | 90 weeks | **24 weeks** |

Per-engineer that's close to 20x. Stop here and you have great marketing collateral.

## Except It Doesn't Reproduce

The talk immediately explains **why that team is not a reproducible case.** Selected people, a fresh codebase, a tight scope, full organizational backing — the conditions themselves were special. The ten-day-sprint story gets a similar asterisk.

That's where the talk earned my trust. **A talk that annotates the number it just showed you is rare.** And because it does, the 50-team section that follows carries weight.

> Pilots show you **what's possible.** Fifty teams show you **what reproduces.** Organizations need the second one.

---

# 3. The Real Split Was Outside the Tool

Line up the 50 teams and it looks like this:

```markdown
   ┌─ half ───────────────────────────────┐
   │ under 3x deployment velocity          │  ← agents sprinkled on the old way
   └───────────────────────────────────────┘
   ┌─ other half ─────────────────────────┐
   │ median 4.5x · sometimes past 10x      │  ← changed how they worked
   └───────────────────────────────────────┘
             ↑ 90% used the same tool
```

The talk's phrasing is precise. The trailing half had **sprinkled agents on top of the way they already worked;** the leading half had **deliberately changed how they worked.**

## What "Sprinkled" Means

A familiar picture:

- Sprint structure unchanged, ticket sizing unchanged, review queue unchanged
- An assistant bolted onto the editor
- The agent writes what a person used to write, and **every other stage stays as it was**

One stage gets faster. This is exactly the point from the [last post](/en/posts/2026-08-23-ai-native-sdlc-playbook/), now confirmed with measurements — **speed up one stage and the whole doesn't speed up; the bottleneck just moves.** "Under 3x" is the size of that relocated bottleneck.

---

# 4. Frontier Development Is Behavior, Not Attitude

The talk doesn't define "frontier development" as a mindset. It defines it by **observable behavior.**

| Metric | Frontier team's value |
| --- | --- |
| Share of code the engineer **types themselves** | **1–2%** |
| How long agents run **uninterrupted** | **hours** |
| Agents running **at once** | **several** |

This framing is good because **you can immediately tell where your own team sits.** "We're using AI well" can't be adjudicated; those three lines can.

And the three interlock:

```markdown
For hand-written code to be 1–2%
   → agents have to run alone for hours
   → to run alone for hours, you can't be sitting next to them
   → and only then can you run several at once
```

The reverse holds too. **If you're in a conversation with the agent, none of the three lines happens.** That's the basis for habit three.

---

# 5. The Five Habits

The main body — and none of the five is glamorous.

## Habit 1 — Write Down What Lives in Your Head (and Keep Pruning It)

Treat the agent's context as an asset: conventions, coding standards, testing patterns, repository layout. The Bedrock team used a monorepo and **kept the agent's own comments as a persistent memory** rather than deleting them.

Then the talk goes a layer deeper:

> **Prune context as models improve.** Guidance written to work around an old model's weakness stays behind and bloats the context.

Same argument as [Context Engineering by Subtraction](/en/posts/2026-07-31-context-engineering-claude5/) — except here the **trigger** is named: a model upgrade is a context audit. Most teams only ever add guidance; nobody deletes.

## Habit 2 — Expect to Get Slower First

The least-quoted and most decisive habit.

```markdown
Put agents into a brownfield codebase
   → it gets slower first
   → teams that quit here never see the acceleration
   → only teams that push through see it compound
```

What matters is **what you do during the slow stretch.** The examples are concrete: **improve error messages, build tools that didn't exist, restructure the repository outright.**

What's interesting is that all of it is **work you should have done anyway, not agent-specific work.** The agent just surfaces the cost of skipping it more honestly than a person does. A human routes around a bad error message from experience; an agent simply gets stuck.

## Habit 3 — Feed Them, Don't Babysit Them

The sharpest diagnosis in the talk:

> **A running conversation keeps you in the loop, and being in the loop makes parallelism impossible.**

The back-and-forth feels like collaboration, but what it actually is, is **a human acting as the scheduler.** So the leading teams change shape: **keep a backlog of well-scoped tasks, run several agents at once, review asynchronously.** Some run them overnight.

| | Babysitting | Feeding |
| --- | --- | --- |
| Human role | real-time response | **queue management + async review** |
| Concurrency | 1 | **several** |
| Requires | contiguous focus time | **well-defined units of work** |

One engineer shipped a complete change with only **"a couple of hours of contiguous time."** Contiguous time didn't shrink — **the work was restructured so it wasn't needed.**

## Habit 4 — Fix Intent in a Document Before Arguing With Code

Iterating on generated code with "no, not like that…" is **the most expensive mode there is.** Leading teams pin intent down in structured specs and requirements before code exists.

```markdown
Slow:  prompt → code → "not that" → code → "not that either" → ...
Fast:  intent doc settled → code → (checked against the doc)
```

The difference is **what you argue with.** Argue with code and you re-read it from scratch every round; argue with a document and the agreement persists. Same axis as the "verifiable artifact" idea from the [Agent Skills post](/en/posts/2026-08-26-agent-skills/).

## Habit 5 — Shift Testing Left

The feedback loop has to be fast enough for **the agent to correct itself.** So leading teams make integration tests runnable locally against deterministic mocks. If results come back twenty minutes later from a pipeline, self-correction never happens.

There's a side effect: **code review moves from style to architecture,** because style was already filtered locally.

---

# 6. Why 4.5x — the Multiplication

The AWS write-up decomposes the number like this:

```markdown
1.5x  acceleration of low-judgment work
  ×
1.5x  focus on high-judgment work (no context switching)
  ×
1.5x  instant access to domain expertise captured in agents
  =
~3.4x → measured median 4.5x
```

The decomposition is useful because **you can check which term is empty.**

| Term | If it isn't happening |
| --- | --- |
| Low-judgment acceleration | you use agents but have no scoped tasks (habit 3) |
| High-judgment focus | you're babysitting, so you keep getting interrupted (habit 3) |
| Domain expertise access | it's in your head, not written down (habit 1) |

Because it's multiplication, **a term stuck at 1 caps the whole thing.** Finding the term that equals 1 comes before raising all three.

---

# 7. Holding It Against This Blog's Repository

As usual, not leaving it as someone else's story.

| Habit | State of this repo |
| --- | --- |
| **1. Write down context** | `CLAUDE.md`, 35 lines, plus `.claude/commands`. Exists — but **has never been pruned** |
| **2. Get slower first** | tests, E2E, typecheck are in place. This one roughly passes |
| **3. Feed, don't babysit** | **barely happening.** Mostly one interactive session, zero parallelism |
| **4. Fix intent first** | `.claude/_docs` gives artifacts somewhere to accumulate |
| **5. Shift testing left** | `pnpm test` / `test:smoke` / `e2e:mock` run locally — passes |

Honestly: **habit 3 is completely empty.** And by section 6's multiplication, the moment habit 3 is 1, both low-judgment acceleration and high-judgment focus are capped with it. If I'm looking for why productivity here doesn't rise as much as expected, it's this, not the tooling.

Habit 1 is weak too, honestly. `CLAUDE.md` records the deployment quirks and content conventions, but **I have never re-read and deleted from it when the model changed.** The second half of habit 1 — the pruning — simply isn't happening.

One thing does work well. Adding a post breaks four hardcoded test expectations, and those **fail locally and immediately.** Annoying, but it's exactly the structure habit 5 describes: the agent can fix itself without waiting on a pipeline.

---

# 8. Easy Things to Get Wrong

## 1 — "4.5x isn't about teams like ours"

Half true. But **the under-3x half was the same company, the same tool, ordinary codebases too.** The point of the study is that the conditions weren't different — **the way of working was.**

## 2 — "The 20x case is the target"

The talk denies this directly. Bedrock's conditions were special and don't reproduce. **The reproducible target is 4.5x, and it's the result of the five habits.**

## 3 — "Writing 1–2% of your own code means skill stops mattering"

The opposite. Habits 4 and 5 demand **the ability to state intent precisely and to design verification.** Judgment moves into the space typing vacated. The talk's closing line nails it:

> **The new bottleneck is decision speed.**

## 4 — "You can skip the slow stretch"

Habit 2 exists precisely to stop that. For agents to succeed in a brownfield codebase, the codebase has to be prepared first. **The teams that quit during that stretch are the under-3x group.**

## 5 — "This is a tool adoption problem"

The whole talk refutes it. Ninety percent used the same tool. **Adopting a tool is what everyone already did; the split came after.**

---

# 9. Summary

| | Point | Why |
| --- | --- | --- |
| **1. The tool is not the variable** | 90% same assistant, results split in half | adoption is finished; the method isn't |
| **2. Frontier is defined by behavior** | 1–2% own code · hours uninterrupted · several at once | only adjudicable metrics tell you where you stand |
| **3. You get slower first** | fix error messages, tooling, structure first | quit here and the acceleration never arrives |
| **4. Feed, don't babysit** | a running conversation makes parallelism impossible | when the human is the scheduler, concurrency is 1 |
| **5. It multiplies, so one term caps it** | 1.5 × 1.5 × 1.5 | find the term stuck at 1 before raising all three |

Read against the earlier posts, this adds one more axis:

- [AI-Native SDLC](/en/posts/2026-08-23-ai-native-sdlc-playbook/) — **how to rebuild the process** (proposal)
- [Code Quality Lives in Constraints](/en/posts/2026-08-25-agentic-code-quality/) — what goes **around** the agent
- [Agent Skills](/en/posts/2026-08-26-agent-skills/) — what goes **into** the agent
- This post — **what actually split, in practice** (observation)

The first three were all arguments that something is the right way to work. This talk is **a report after watching 50 ordinary teams for a year,** which is a different kind of claim. That the report points the same direction as the arguments is the most practically useful confirmation this series has produced.

> The tools are already the same. **The only variable left is how you work.**

---

# References

- Clare Liguori, [From AI-Assisted to AI-Native: Building a Frontier Development Team](https://www.youtube.com/watch?v=pqlWNihgdjI) — AI Engineer World's Fair 2026
- AWS, [How frontier teams are reinventing AI-native development](https://aws.amazon.com/blogs/machine-learning/how-frontier-teams-are-reinventing-ai-native-development/)
- Kiro, [Frontier teams & spec-driven development](https://kiro.dev/topics/frontier-teams/)
- Earlier posts — [Agent Skills](/en/posts/2026-08-26-agent-skills/) · [Code Quality Lives in Constraints](/en/posts/2026-08-25-agentic-code-quality/) · [AI-Native SDLC Playbook](/en/posts/2026-08-23-ai-native-sdlc-playbook/)
