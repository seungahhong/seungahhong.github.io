---
layout: post
title: More Tokens Won't Make It Smarter — 76 to 89 on the Same Budget
date: 2026-09-16
published: 2026-09-16
category: Development
tags: ['AI', 'Claude', 'agents', 'context-engineering', 'cost']
comments: true
thumbnail: './assets/16/thumbnail.png'
github: ''
---

# 1. What This Post Is About

Notes on a talk by Katelyn Lesse (platform engineering lead) and Angela Jiang (platform product lead) at Anthropic — [Every Token Needs a Role — How Anthropic Designs Agents](https://www.youtube.com/watch?v=ULhklk4PCO4). One line:

> **Raising the token budget is not a strategy. Giving tokens different roles inside a fixed budget is.**

The measured result: a **fixed 600,000-token budget**, a financial-analysis benchmark, the same model. **76 points to 89.** Not one extra token.

Placed against the thread this blog has been pulling on:

- [Context Engineering for Claude 5](/en/posts/2026-07-31-context-engineering-claude5/) — what to **remove** from context
- [Choosing a Claude Model](/en/posts/2026-08-01-choosing-claude-model/) — **which model** gets your spend
- This post — **where the tokens go** inside a budget you can't raise

The first two are about total volume. This talk is about **allocation.**

---

# 2. Tokens Are Not Fungible

The talk opens by breaking a familiar intuition.

```markdown
Common assumption:  performance is short → give it more tokens → performance rises
                    (tokens are a uniform resource; more is better)

Reality:            performance is short → give it more tokens
                    → it makes the same mistake for longer
```

Anyone who has run agents knows what brute-forcing the budget looks like. **A run that starts in the wrong direction travels further when the budget is large.** Reasoning longer does not self-correct a bad premise set at the beginning. It just piles more tokens on top of that premise, which makes it harder to reverse.

So the framing is exact — **not all tokens are the same token.** The same 1,000 tokens spent on

- executing,
- steering before and during execution,
- grading the artifact that came out

have different expected returns. If the budget is fixed, that **ratio is the design.**

---

# 3. Three Roles — Advising, Grading, Dreaming

Beyond execution, the talk proposes three roles.

| Role | What it does | Where the tokens sit |
| --- | --- | --- |
| **Advising** | Steers direction before and during execution | **In front of** execution |
| **Grading** | Scores the artifact against explicit criteria | **Behind** execution |
| **Dreaming** | Captures what this run learned | **Outside** execution |

Each one blocks waste at a different point.

## Advising — kills waste at the front

The most expensive failure is **a run that went all the way in the wrong direction.** Advising tokens intervene before execution gets long. The executor can be a cheap, fast model that consults something stronger only at the forks that need judgment.

## Grading — kills waste at the back

An agent saying "done" and **an artifact that actually cleared the bar** are different things. Grading tokens put a separate grader against a rubric, scoring criterion by criterion and handing the gaps back. The key detail: **the grader does not share the executor's context.** Grade your own answer and you grade it generously.

## Dreaming — kills waste in the next run

The third is the unfamiliar one. Dreaming tokens produce **not this run's artifact but the next run's input** — where it got stuck, what worked, which assumption was wrong. Pure cost this session; recovered from the next one on.

Tied together:

```markdown
Advising = fewer tokens spent going the wrong way    (recovered this run)
Grading  = fewer tokens spent finishing wrong        (recovered this run)
Dreaming = fewer tokens spent repeating a mistake    (recovered next run)
```

---

# 4. The Fixed-Budget Experiment

The important design choice in the talk is that **the budget was held constant.**

```markdown
Benchmark:  practical financial analysis
Budget:     600,000 tokens (identical on both sides)

A. Everything into execution                     →  76
B. Execution + advising + grading + dreaming     →  89
```

The comparison is fair, and that's what makes it persuasive. "We added an advisor and it got better" usually means more tokens were spent, so of course it got better. Fixing the budget changes the question to: **did the advising tokens earn more than the execution tokens they took?**

The answer is yes, and 13 points is the size of it.

> One caveat. Thirteen points is a number for **this benchmark, this budget, this split.** The right ratio depends on the shape of the work, and the talk doesn't hand out a fixed recipe. What transfers is not the number but the **method: fix the budget, change the allocation, measure.**

---

# 5. Why 80% Accuracy Is Useless in Production

The middle of the talk is, to me, the most important part.

On a benchmark, 80% is a decent score. In production it isn't.

```markdown
Benchmark view:   80 of 100 correct → 80 points → "pretty good"

Production view:  20 of 100 are wrong
                  → you don't know which 20
                  → all 100 need human review
                  → 0 were actually automated
```

**If you don't know where the wrong answers are, you can't trust the right ones either.** In a domain like financial analysis, where one number moves a decision, this is harsher still. An 80% artifact is not "80% of a job done" — it's **a job with 100% of the review still attached.**

Which changes the unit you measure in.

| | Wrong unit | Right unit |
| --- | --- | --- |
| What you measure | Tokens per request | **Tokens per completed correct answer** |
| What 80% means | Respectable performance | 100% human review required |
| A cheap executor | Low unit price | Expensive once retries and review are counted |

Under that unit, grading tokens change character. Grading isn't overhead — it's **moving review cost off humans and onto the model.** Instead of a person reading all 100, they read the items the grader flagged.

The "verify" half of [Delete, Make It Hard, Verify](/en/posts/2026-08-22-delete-and-verify/) meets cost accounting right here. Verification is a quality mechanism, but it is also **a token-efficiency mechanism.**

---

# 6. Mapping to Primitives — Claude Managed Agents

The talk's closing axis: don't build these strategies from scratch, compose them from primitives that already exist. Claude Managed Agents runs the agent loop and the execution sandbox server-side, and each of the three roles has something it maps onto.

> The mapping below is **my reading**, not something the talk stated verbatim. Check the official docs for parameter names and constraints.

## Advising → Advisor

Pair an executor model with an advisor model: the cheap one does the bulk of the generation and calls the stronger one only when judgment is required. On the Messages API it's the `advisor` tool; on Managed Agents it's an advisor entry in the multiagent roster.

One hard constraint — **the advisor must be at least as capable as the executor.** Pair them the other way and the request is rejected.

```json
{
  "type": "advisor_20260301",
  "name": "advisor",
  "model": "claude-opus-5"
}
```

A caution as well. Advisor wins on cost when **the capability gap is wide and the executor actually consults often.** Let the consult rate fall and the pairing can score below the executor alone. Measure before you wire it in.

## Grading → Outcomes

Give the session a rubric defining what "done" means, and **a grader with its own context window** scores each iteration and hands the shortfalls back — looping until the bar is cleared or the iteration cap is hit.

The rule for rubrics is explicit: **"the data looks good" is not a criterion.** "The CSV has a numeric `price` column" is — each item has to be independently decidable. Vague criteria make noisy scores, and noisy scores turn the revision loop into waste.

Same axis as [Writing Specs Agents Actually Follow](/en/posts/2026-09-13-writing-specs-for-agents/). If it isn't written as a decidable statement, neither a human nor a grader can decide it.

## Dreaming → Memory Stores

Sessions are ephemeral by default. A memory store is a set of small text documents that outlives the session; attach it and it mounts into the container as a directory the agent reads and writes with ordinary file tools. That's where dreaming tokens put their output.

Worth nailing down: **never put credentials there.** Memories are replayed verbatim into later contexts, so a key written once keeps coming back.

## Fan-out → Multiagent

When reading-heavy work splits into independent pieces, the coordinator hands them to sub-threads. Each gets its own context window, and only **the report** comes back. Same spirit as advising and grading — **managing context pollution by choosing where tokens live.**

---

# 7. Against This Blog's Repository

As usual, not leaving it as someone else's story. What an agent does in this repo is mostly "add one post and fix the tests that break."

| Role | State of this repo |
| --- | --- |
| **Execution** | Almost everything. One interactive session |
| **Advising** | None. A wrong direction stays wrong to the end |
| **Grading** | **Present.** `pnpm test` / `e2e` / `typecheck` act as the rubric |
| **Dreaming** | Partial. `CLAUDE.md` plus three memory files |

Honestly:

**Grading works here by accident.** Adding a post breaks four hardcoded test expectations — annoying, but it means **the completion condition is written down in machine-decidable form.** In the unit from section 5, "one completed correct answer" is not ambiguous in this repo.

**Dreaming is half there.** `CLAUDE.md` records the deployment quirks, and separate memory files record "the four tests that break when you add a post" and "there is no thumbnail generation script." Both are **one session's dig handed to the next** — dreaming tokens that got recovered.

**Advising is completely empty.** And the most expensive failure in this repo has exactly that shape: getting a post's structure wrong, writing it to the end, then deleting it and starting over. It burns the most execution tokens of anything here, and there is nothing in front of it.

One reservation, on scale. The work here isn't a 600,000-token job, so whether an advisor pays for itself **is unknown until measured.** Exactly the caution from section 6.

---

# 8. Easy Misreadings

## 1 — "So don't spend more tokens"

No. What the talk rejects is **the idea that adding tokens is itself a strategy.** Raise the budget if you can. But a raised budget still has to be allocated, and a bad allocation wastes the increase at the same rate.

## 2 — "You need all three"

The three block waste at different points. Start by finding **where your work actually leaks.** Direction goes wrong often → advising. "Done" is often false → grading. Same dig, repeatedly → dreaming. A mechanism bolted where nothing leaks is pure cost.

## 3 — "A grader guarantees quality"

A vague rubric grades vaguely. The grader only decides the rubric; **writing the rubric is still a human job.** Most of the cost of grading is not tokens — it's the time spent writing criteria.

## 4 — "89 is good enough to ship"

Apply section 5 and 89 has the same problem. If you don't know where the 11 are, you read all 100. The point isn't "89 is enough" — it's **"there were 13 points available on the same budget."** What to do about the remaining 11 is a separate design question.

## 5 — "This is only for big agent systems"

Allocation doesn't care about scale. But **the mechanisms have fixed setup costs, so small work may never recover them.** That's the reservation in section 7. The criterion is recoverability, not size.

---

# 9. Summary

| | What | Why |
| --- | --- | --- |
| **1. Tokens are not uniform** | Execution, advising, grading, dreaming pay differently | With a fixed budget, the ratio is the design |
| **2. Fix the budget, change the split** | 600K held constant, 76 → 89 | Adding tokens is not a fair comparison |
| **3. Each role blocks a different waste** | Front · back · next run | Bolted where nothing leaks, it's pure cost |
| **4. Change the unit** | Not tokens per request — **tokens per completed correct answer** | 80% means 100% review |
| **5. Compose, don't build** | Advisor · Outcomes · Memory · Multiagent | This is not a loop you should hand-roll |

Lined up with the rest of the thread:

- [Context Engineering](/en/posts/2026-07-31-context-engineering-claude5/) — **subtraction**: what not to leave in context
- [Choosing a Model](/en/posts/2026-08-01-choosing-claude-model/) — **selection**: which model gets the spend
- [Delete, Make It Hard, Verify](/en/posts/2026-08-22-delete-and-verify/) — **verification**: how you believe "done"
- This post — **allocation**: where tokens go inside the budget you have

All four are about **getting more without raising the total.** This talk adds a measurable method to that list: fix the budget, change the allocation, and measure.

> When you can't raise the budget, one question remains. **What role is this token playing?**

---

# References

- Katelyn Lesse · Angela Jiang, [Every Token Needs a Role — How Anthropic Designs Agents](https://www.youtube.com/watch?v=ULhklk4PCO4)
- Anthropic, [Managed Agents overview](https://docs.claude.com/en/api/agent-sdk/overview)
- Anthropic, [Tool use — Advisor](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)
- Earlier posts — [Writing Specs Agents Actually Follow](/en/posts/2026-09-13-writing-specs-for-agents/) · [Delete, Make It Hard, Verify](/en/posts/2026-08-22-delete-and-verify/) · [Choosing a Claude Model](/en/posts/2026-08-01-choosing-claude-model/) · [Context Engineering for Claude 5](/en/posts/2026-07-31-context-engineering-claude5/)
