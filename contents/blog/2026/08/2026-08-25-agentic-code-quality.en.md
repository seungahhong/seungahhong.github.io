---
layout: post
title: Quality Lives in the Constraints — Holding the Bar at a Scale Nobody Can Review
date: 2026-08-25
published: 2026-08-25
category: Development
tags: ['AI', 'agents', 'code-quality', 'testing', 'harness']
comments: true
thumbnail: './assets/25/thumbnail.png'
github: ''
---

# 1. What Is This Post About?

Notes on Addy Osmani's [Agentic Code Quality](https://addyosmani.com/blog/agentic-code-quality). In one sentence:

> **Judging quality by reading code breaks down at agent scale.** So the checks have to move out of the diff and into the **harness, environment, and system surrounding the agent**. In the author's words — **"Software quality now depends on the constraints you set around your agents."**

If the [last post](/en/posts/2026-08-23-ai-native-sdlc-playbook/) asked "once code stops being the bottleneck, how do we rebuild the process?", this one zooms into a single cell of that answer: quality. Both share a premise — generation now outruns human capacity to consume it.

## The Premise: Nobody Can Read It All

Until now, code quality was judged one way. **Someone reads it.** Is it clean, thoughtful, fast, understandable, well tested?

That works only when **writing speed and reading speed are comparable**. But agents can produce hundreds of thousands — even millions — of changes a day. There is no one left to read them.

```markdown
When humans wrote it:  1 written : 1 reviewed    → review acts as a gate
With agents:           1000 written : 1 reviewed → review becomes a queue
```

This is where a common misreading splits off. The conclusion isn't "give up on review." It's **change who does the reading — from people to the system.** The article puts it precisely:

> **"An agent can propose anything. Your constraints decide whether a proposal is safe enough."**

---

# 2. There Are Cases Where Skipping Review Is Fine

The article cites Guillermo Rauch's checklist for when you can afford not to read the code, and pulls out one observation: every "yes" on that list is really **a statement about how low the stakes are** — no users, throwaway code, a prototype.

In other words, "ship it unreviewed" is **a judgment about risk, not about code**. Which leads to the conclusion: once the stakes go up, something has to read the code — and if it isn't you on every diff, then **the constraints have to read it**.

That's the axis of the whole piece. The choice isn't "read / don't read" but **"a human reads / the system reads."** The nobody-reads option exists only while the stakes are low.

---

# 3. What a Quality Gate Actually Is

It sounds abstract, but every example given is something you already use.

| Constraint | What it catches | Character |
| --- | --- | --- |
| **Unit, property, acceptance tests** | Does behavior match the spec | The familiar layer |
| **Mutation testing** | If mutating the code doesn't break a test → **the test is weak** | Tests the tests |
| **Code metrics** | Cyclomatic complexity, line length, readability | The maintainability axis |
| **Types / compiler** | Makes the wrong state unrepresentable | The cheapest layer |
| **Security, perf, a11y scans** | What surfaces late | Distinct responsibilities |
| **Architecture rules (ESLint etc.)** | "This layer may not import that one" | **The layer you define yourself** |

Two things stand out.

**① Mutation testing gets named explicitly.** There's a reason it matters again in the agent era. Tell an agent "make the tests pass" and it will make them pass. The question is **what those tests were catching in the first place** — and you can't know that without testing the tests. Coverage says "was this line executed"; mutation testing says **"could this test have failed."**

**② Each check should carry a distinct responsibility.** The advice is to keep a broad but **deliberately chosen** set of checks rather than leaning on unit tests alone. The emphasis is on *deliberately*, not on *broad*. Three tools that check the same thing three times are one constraint, not three.

---

# 4. Two Missing Pieces — Environment, and Trust

Setting constraints isn't the whole job. The article flags two things the model leaves out.

## 4-1. Autonomy — Agents Fail for the Same Reasons People Do

Agents execute intent well but stumble when **information is missing or the task is ambiguous**. What's interesting is the list of causes: **brittle environments** that don't hold up under script-driven stress, **nondeterministic builds**, **missing permissions**, **weak tests**.

Those are all **the same reasons humans fail to ship good code.** Not new problems — old ones that were merely tolerable at human speed. An agent hitting them dozens of times a minute makes them intolerable.

Hence the environment being aimed for:

> **"An agent can do real work, get feedback it can trust, and fail without doing much damage."**

Worth reading each condition separately.

| Condition | What happens without it |
| --- | --- |
| **Can do real work** | Blocked permissions or tools → the agent routes around them or fakes the work |
| **Feedback it can trust** | Flaky tests and nondeterministic builds are noise. The agent edits code to match the noise |
| **Failure without damage** | If failure is expensive you must limit attempts — and then you can't grant autonomy |

The second is the most practical. **A flaky test in an agent environment isn't an annoyance; it's a poisoned oracle.** A human shrugs and says "oh, that one's always flaky." An agent believes the signal and rewrites working code.

## 4-2. Trust — Extended, but Earned

> **"We start with trust, but it has to be hard-earned."**

Instead of the all-or-nothing permission binary, autonomy grows with **track record and the quality of the evidence**. It's the same idea as the 1σ/2σ/3σ authority split from [the last post](/en/posts/2026-08-23-ai-native-sdlc-playbook/). The question shifts from "should the agent have permission" to **"when, and how much."**

---

# 5. Constraints Play Different Roles at Different Moments

The article splits constraints into three moments: some shape the work **before it begins**, some give feedback **while the agent works**, and some decide whether the output **can cross the production boundary at all**.

Even "a test" changes character entirely depending on where you put it.

```markdown
Before   types, schemas, architecture rules, CLAUDE.md  → prevent it up front
During   tests, lint, build, hooks                      → say "wrong way" early
Boundary CI, security scans, approval gates             → stop it from leaving
```

And this **back-pressure** should live throughout the loop rather than existing as a single review after all the work is done — a point the article keeps returning to.

Block only at the end, and here's what happens: the agent is rejected after building the whole thing. What's wasted isn't just tokens — it's **all the context stacked on top of a wrong premise**.

---

# 6. When Verification Runs Out of Room — Only Three Options

The most operationally useful part. What if changes are generated faster than the tooling can consume them?

**You build a queue.** And that queue moves at human speed. Every gain from automation evaporates right there.

The three options offered:

| Option | What it does | The cost |
| --- | --- | --- |
| **① Scale verification** | More checking capacity and parallelism | Infrastructure |
| **② Slow generation** | Reduce the rate agents produce changes | Give up speed |
| **③ Lower the bar** | Let constraints push back less | Accept risk |

And then: **from a scaling perspective, be ready to do all three.** It isn't a pick-one problem.

It goes one step further — in some directions, **un-constraining gets more done.** Rather than tightening everything uniformly, **clamp down hardest where you care most and loosen elsewhere**, and you maximize throughput without sacrificing quality.

Which ultimately means deciding where you want to sit on the spectrum from **innovation-focused to quality-focused**.

Treat constraints as strictly-more-is-better and that dial becomes unusable. You have to admit constraints have a cost before you can decide which to relax.

---

# 7. Where to Spend Human Attention

> **"If you put a human check into a system that otherwise moves at machine speed, don't be surprised if that impacts productivity."**

Painfully accurate. Human attention is **scarce and expensive**, so it can't be dropped anywhere — it has to be **directed deliberately**.

Two placement principles:

- Humans attach to **the nuanced problems that need judgment** — taste, intent, architecture
- Downstream humans are pulled in **only when the automated guardrails break**

Which leads to:

> **"Human 'code review' in the future is going to look very different."**

Same direction as the last post. Review doesn't disappear — **its altitude rises.**

```markdown
Better asked of a machine: Is there a bug in this diff? Does it violate a security rule? Is the style right?
Only a human can answer:   Should this have been built at all? Will this abstraction still hold in six months?
```

---

# 8. Quality Isn't a Single Metric

The last axis. Correctness is **one dimension** of quality, not the whole of it.

> Software quality isn't a single metric. Think of it as a collection of signals of varying importance to you and your team.

| Dimension | Example constraints |
| --- | --- |
| **Correctness** | Unit / property / acceptance tests, mutation testing |
| **Maintainability** | Complexity metrics, architecture rules, review |
| **Performance** | Benchmarks, bundle budgets, Lighthouse |
| **Security** | Scanners, policies, dependency audits |
| **Efficiency** | Resource and cost measurement |
| **Comprehensibility** | Docs, naming, structure — **the weakest cell for automation** |

And something matters more than the count: not **how many** constraints you have, but whether they're **demanding enough to meet your bar**.

If twelve green check badges all pass and production still burns, you don't lack constraints — **your constraints are soft**.

---

# 9. Applying It to This Repo

Reading without applying leaves nothing behind, so here are this blog repo's constraints sorted into the dimensions from section 8.

| Dimension | Constraints in place | Gaps |
| --- | --- | --- |
| **Correctness** | Vitest unit tests, Playwright E2E, 3-stage pre-commit | No mutation testing — **no idea how demanding the tests are** |
| **Maintainability** | ESLint, TypeScript strict | No architecture rules (import boundaries) |
| **Performance** | — | No bundle budget or Lighthouse gate |
| **Security** | — | Personal static blog, small surface |
| **Accessibility** | axe checks, 0 violations across 5 pages | Dark mode unverified ([carried-over TODO](/en/posts/2026-08-23-ai-native-sdlc-playbook/)) |
| **Comprehensibility** | `CLAUDE.md`, content conventions | — |

And there's a real case here of **a constraint catching a human**. Adding a post breaks three tests with hardcoded post counts. It looked like busywork at first, but through section 6's lens it's **feedback during the work**. Add the Korean original and forget the `.en.md`, and `content-conventions.test.ts` fails immediately. That isn't the kind of mistake review catches.

The bigger gap, though, sits upstream of mutation testing. Same conclusion as the last post: nothing verifies whether editing `CLAUDE.md` or a harness skill made agent behavior *worse*. The table in section 8 is effectively **missing a row for "agent configuration."** Application code is checked along six dimensions; the configuration that produces that code is checked along none.

---

# 10. Easy Things to Get Wrong

## Misreading 1 — "More constraints means more quality"

The article explicitly disagrees. Apply strong constraints where they serve **both quality and throughput**, and **remove or relax the ones serving neither**.

A usable test:

```markdown
Has this check caught a real problem lately?        ← if not, it isn't serving quality
Would a human have to do this work without it?      ← if not, it isn't serving throughput
→ Both no? Delete it.
```

A check that only ever passes isn't a safety net — it's **overhead**.

## Misreading 2 — "Constraints belong in CI"

CI is **the constraint at the boundary**. The argument runs the other way: use the signal **as early as possible, through every available path**. CI telling you at the end that you may not deploy is already late feedback.

Why that matters more for agents: **an agent can restart from the point where it got the feedback.** A mistake caught inside a five-minute loop and one caught by CI after the PR is opened have very different recovery costs.

## Misreading 3 — "You don't have to read code anymore"

The author draws that line himself in the first paragraph: he still reads and reviews code, and is very intentional about **where he's comfortable letting constraints be the check**.

You don't stop reading — **you choose where to read.** That choice is exactly the risk judgment from section 2.

---

# 11. Wrapping Up

| | The point | Why |
| --- | --- | --- |
| **1. The reader changes** | Constraints read every diff instead of you | Nobody reading is only safe when stakes are low |
| **2. The environment is the quality** | Trustworthy feedback + damage-free failure | A flaky test is a poisoned oracle for an agent |
| **3. Constraints cost something** | Serve neither goal? Delete it | Not *many* constraints — **demanding, chosen** ones |
| **4. Humans move up** | Taste, intent, architecture | A human check inside a machine-speed loop is the new bottleneck |

And this is another axis of the same story the earlier posts have been telling.

- [Self-healing harness](/en/posts/2026-07-05-meta-harness/) — verify when you **add** a rule
- [Context engineering by subtraction](/en/posts/2026-07-31-context-engineering-claude5/) — verify when you **remove** one
- [Delete, make it earn access, make it verify](/en/posts/2026-08-22-delete-and-verify/) — verify when you **hand an agent work**
- [The AI-native SDLC](/en/posts/2026-08-23-ai-native-sdlc-playbook/) — verify when you **change the process**
- This post — **what you build those verifications out of.** That's constraints

The article closes by handing the reader homework: quality lives in the constraints you set around your agents, so take the problem statement and build your own constraint-driven plan.

At a scale where nobody can read it all, the only way to keep the bar is to **build the system that makes reading unnecessary first**.

---

# References

- Addy Osmani, [Agentic Code Quality](https://addyosmani.com/blog/agentic-code-quality) (2026-08-08)
- Anthropic, [The AI-Native SDLC Playbook](https://claude.com/blog/the-ai-native-sdlc-playbook) (2026)
- Earlier posts — [The AI-Native SDLC Playbook](/en/posts/2026-08-23-ai-native-sdlc-playbook/) · [Delete, Make It Earn Access, Make It Verify](/en/posts/2026-08-22-delete-and-verify/) · [Self-Healing Harness Engineering](/en/posts/2026-07-05-meta-harness/)
