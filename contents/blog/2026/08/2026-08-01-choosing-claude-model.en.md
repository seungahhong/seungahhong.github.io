---
layout: post
title: Choosing a Claude Model — Start Smart
date: 2026-08-01
published: 2026-08-01
category: Development
tags: ['AI', 'Claude', 'model-selection', 'LLM']
comments: true
thumbnail: './assets/01/thumbnail.png'
github: ''
---

# 1. What Is This Post About?

Here it is in a single sentence.

> **The order of "try the cheap model first, move up if it falls short" has been inverted.** The recommended order now is to **start with the most intelligent model and dial cost down with the effort parameter.**

Yesterday's post ([Trimming Context Engineering](/en/posts/2026-07-31-context-engineering-claude5/)) ended on this line: "A harness is tuned to the model." Which raises the obvious follow-up — **how do you pick that model?** This post answers it.

## The Arithmetic We Do Out of Habit

Most of us reason about model choice like this.

```markdown
"Haiku is $1 per million tokens and Opus is $5.
 That's 5×. Let's start with Haiku and move up if we have to."
   ↓
 Haiku can't solve it in three tries, so we retry
   ↓
 We keep tuning the prompt until it barely passes
   ↓
 ...and end up burning more tokens, and far more human hours
```

The trap in that arithmetic is that **the unit is wrong.** What we pay for isn't tokens — it's **the cost of finishing one task.** This is exactly the point Anthropic makes.

> **Cost-per-task is often lower for more intelligent models — especially at lower effort levels — even when price-per-token is higher.** More capable models take fewer turns.

If one model finishes in a single pass and another takes three, a 3× price-per-token difference nets out to the same total. Fold in **the time a human spends rewriting prompts** and the calculation flips outright.

---

# 2. The Model Tiers — Four Classes

Claude models are quickest to reason about **as classes, not individual model names.** Generations keep turning over; the character of each class holds.

| Class | Character | Typical use |
| --- | --- | --- |
| **Mythos / Fable** | Frontier. Problems AI hasn't handled reliably before | Hardest coding, long-running agent tasks |
| **Opus** | Reasoning-intensive enterprise work | Complex agentic coding, deep analysis |
| **Sonnet** | Balance of performance, cost, and speed | The widest general-purpose set, high-frequency customer-facing workloads |
| **Haiku** | Lowest cost, fastest | High-frequency work where latency and cost matter |

> Mythos is restricted to trusted organizations handling dual-use cybersecurity and biology work; the generally available counterpart is **Fable**, which ships with additional safeguards. Think of them as siblings in one class.

## The Actual Lineup Right Now

As of August 2026, the main models look like this.

| Model | Context | Input $/1M | Output $/1M |
| --- | --- | --- | --- |
| Claude Fable 5 | 1M | $10 | $50 |
| Claude Opus 5 | 1M | $5 | $25 |
| Claude Sonnet 5 | 1M | $3 | $15 |
| Claude Haiku 4.5 | 200K | $1 | $5 |

- Sonnet 5 carries **introductory pricing of $2 / $10 through 2026-08-31.** Factor that in if you're benchmarking right now.
- Prices and lineups change. **Don't trust the numbers in a blog post — check the official docs.** What matters here isn't the absolute values but the **ratios between classes.**

One detail stands out: **only Haiku is 200K; everything else is 1M.** "We need a long context" is not by itself a reason to reach for the top of the ladder.

---

# 3. What to Ask — Four Questions

Anthropic frames the decision around four questions. Answer them in order and the field narrows.

```markdown
① How hard is this task?      → sets the floor on class
② What are the latency needs? → is someone waiting on a screen, or is it batch?
③ What access constraints?    → restricted to a cloud, region, or compliance regime?
④ What are the unit economics? → ten calls a day, or ten thousand?
```

Here's what each question actually decides.

| Question | Closer to "yes" | Closer to "no" |
| --- | --- | --- |
| **① Hard?** — must it plan multiple steps on its own? | Opus and up | Sonnet and down |
| **② Fast?** — is a person waiting in front of a screen? | Haiku/Sonnet, or lower effort | You can move up a class |
| **③ Constrained?** — must it run on one specific platform? | Limited to models that platform serves | Free choice |
| **④ High volume?** — tens of thousands of calls? | Unit price dominates → consider a lower class | Prioritize quality |

③ trips people up more often than you'd expect. **Not every feature exists on every platform.** Fast mode — running the same model at higher output speed — is supported only on certain models and certain paths, for instance. "We picked the model, then found the feature isn't available where we deploy" is a real failure mode.

---

# 4. The Second Axis — Effort

This is the heart of it. Model selection is **two-dimensional, not one.**

```markdown
         effort →   low    medium   high    xhigh    max
       ┌────────────────────────────────────────────────
Fable  │   ·        ·        ·        ·        ●   ← best possible
Opus   │   ·        ·        ●        ●        ·
Sonnet │   ·        ●        ·        ·        ·
Haiku  │   ●        ·        ·        ·        ·   ← lowest cost
       └────────────────────────────────────────────────
                 ↖ the real choices live on this diagonal
```

**Effort** controls how much reasoning goes into a task (`low` / `medium` / `high` / `xhigh` / `max`). And the conclusion runs against intuition.

> **A higher class at lower effort** can be more efficient than **a lower class at higher effort.**

So the move isn't "Opus is expensive, let's use Sonnet." It's **"what does Opus look like at lower effort?"** — measured first. That is the operational content of "start smart."

## Which Makes the Practical Order

```markdown
① Pick the most intelligent generally available model
② Run it at default effort to establish a quality baseline
③ Step effort down one level at a time → find where quality holds
④ Still too expensive? Now drop a class and redo ② and ③
```

**Step ③ ends it more often than you'd think** — cost comes into range without ever dropping a class. Skip ① and start from the bottom instead, and you have no baseline at all, so you'll never know whether what you've got is the best available.

---

# 5. The Advisor Strategy — Using Two Models Together

One more thing: **you don't have to pick just one model.**

The **advisor strategy** puts a fast, cheap model in the **worker** role and a more capable one in the **advisor** role.

```markdown
  [ Advisor ]  the more capable model
      │  Is the plan sound? / Is the result good enough?
      │  ↕ consulted only when it matters
  [ Worker ]   the fast, cheap model
      │
      └─ generates the bulk of the tokens here
```

The key phrase is **"only when it matters."** Instead of running the expensive model start to finish, you call it at the moments that set direction and judge results.

The effect is measured.

> On SWE-bench Pro, **Sonnet 5 with a Fable 5 advisor** landed **within 10% of Fable 5's score at 63% of the price.**

Over 90% of the quality for 63% of the cost. This pairing doesn't win every time, but the point stands: **stepping outside the "pick exactly one class" dichotomy widens the option space.**

## One Caveat — The Advisor Can't Be Weaker Than the Worker

Obvious in hindsight, easy to get wrong. The advisor model must be **at least as capable** as the worker. Pair it the other way and the request is rejected outright. Advice only flows downhill.

---

# 6. Why Benchmarks Don't Answer This

"Can't we just use whichever scores highest on benchmarks?" Two problems.

## Problem 1 — Saturation

Frontier models solve **nearly all** the questions on standard benchmarks. Nothing distinguishes 98 from 97. It's a ruler whose gradations have run out.

## Problem 2 — It Isn't Your Problem

Benchmarks measure **generic problems.** What you want to know is performance on **your** problem. Those two diverge routinely.

| | Standard benchmarks | Your own evals |
| --- | --- | --- |
| Where problems come from | A public problem set | **Real cases pulled from your production** |
| Success criteria | Predetermined | **Defined by your team** |
| Discrimination among top models | Saturated, so low | Real differences show up |
| Cost to build | Zero | Non-zero (which is why nobody builds them) |

**Building your own evals is the hardest advice in this post to actually act on** — granted. But the starting version can be smaller than you think.

```markdown
① Collect 20 real cases that recently failed
② Write a one-line pass condition for each
   (e.g. "returns a CSV with a numeric `price` column")
③ Run your candidate model × effort combinations against them
④ Record pass rate, total tokens, and wall-clock time together
```

Step ② is the crux. **A criterion like "the result looks good" adjudicates nothing.** It has to be written so a machine could score it.

---

# 7. Easy Things to Get Wrong

## Misreading 1 — "So always use the most expensive model?"

No. **Start at the top; don't stay there.** Half the four-step order (③④) is the walk back down. There is exactly one reason to start high: **to know what the baseline is.**

## Misreading 2 — "Then use the advisor strategy everywhere"

Two models means more architectural complexity and more latency — the consultation round trip is real. **If one model plus effort tuning solves it, that's the better answer.** The advisor is the card you play when a single model can't hit quality and cost at the same time.

## Misreading 3 — "Decide once and you're done?"

No. New models keep shipping and prices keep moving. That's precisely why your own evals matter. **With evals, re-evaluating on a new release takes half a day**; without them, you start over from intuition every single time. Evals are a selection tool and, more importantly, a **re-selection** tool.

---

# 8. Wrapping Up — Two Things, Really

Compress this post and you get two sentences.

| | What | Why |
| --- | --- | --- |
| **1. Start at the top and walk down** | Most intelligent model + effort tuning | Without a baseline you can't find the optimum |
| **2. Build your own evals** | Real workloads, your criteria | Benchmarks are saturated and don't measure your problem |

And this is the same story the previous two posts told.

- [Self-healing harness](/en/posts/2026-07-05-meta-harness/) — verify and get approval even when **adding** rules
- [Trimming context engineering](/en/posts/2026-07-31-context-engineering-claude5/) — verify even when **removing** rules
- This post — verify even when **choosing a model**

The shared structure across all three: **don't decide by intuition; measure against your own workload, then decide.** Harness, prompt, or model — the moment you borrow your criteria from outside, you stop seeing your own problem.

The core message is one sentence.

> **"Which model is best?" has no answer. "Which combination is best for our work?" does — and the only way to get it is to measure.**

---

# References

- Anthropic, [Claude Models Explained: Choosing the Best Model for Your Use Case](https://claude.com/blog/claude-models-explained-choosing-the-best-model-for-your-use-case) (2026)
- Anthropic, [The New Rules of Context Engineering for Claude 5 Generation Models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) (2026)
- Anthropic, [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) — current model IDs, context windows, and pricing
- Previous posts — [Trimming Context Engineering](/en/posts/2026-07-31-context-engineering-claude5/) · [Self-Healing Harness Engineering](/en/posts/2026-07-05-meta-harness/)
