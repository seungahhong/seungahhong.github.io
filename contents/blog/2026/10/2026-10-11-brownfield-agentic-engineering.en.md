---
layout: post
title: Running Agents in a Codebase Older Than the Team — Brownfield Agentic Engineering
date: 2026-10-11
published: 2026-10-11
category: Development
tags: ['AI', 'agents', 'legacy', 'migration', 'harness']
comments: true
thumbnail: './assets/11/thumbnail.en.png'
github: ''
---

# Brownfield Agentic Engineering: Make Hidden Constraints Visible and Cheap Changes Trustworthy

Notes on Addy Osmani's [Brownfield Agentic Engineering](https://addyo.substack.com/p/brownfield-agentic-engineering) (2026-09-14, subtitled "What it takes to run agents in a codebase older than the team").

## ✍️ TL;DR

> **What makes agents succeed in an old codebase is structure, not supervision.** People draw the risk map, you write down only what the code can't say, repeated corrections move into the harness, today's behavior gets locked by tests, migrations land in complete units, and parallelism comes last.

### Summary

- **What brownfield means**: a codebase whose repository no longer fully describes how the system actually behaves. Institutional knowledge, duct tape, legacy services, and behavior other teams depend on live **outside the tree**.
- **Zones**: green (well tested, isolated → autonomous loop) · yellow (mixed quality → characterization tests first) · red (auth, billing, permissions, payroll → a human pairing on every step). **People draw the map**, and zones only move **when it's earned**.
- **Write down only what the code can't say**: agents infer structure well. Document only business nuance, trade-offs, rules tooling doesn't enforce, domain rules, and the history behind counter-intuitive implementations.
- **Research should outlive the session**: for yellow and red work, a read-only pass first produces a **comprehension memo** (entry points, owners, callers, tests, production signals, open questions — every claim cited).
- **A repeated correction = a missing piece of the harness**: when the same review comment shows up twice, move it into a lint rule, hook, type, test, or skill. Prose is only for constraints that can't be enforced mechanically.
- **Start zero-risk, migrate in complete units**: characterization tests that lock current behavior (ugly parts included) → mechanical transforms → finish one path **all the way to deleting the old dependency**. Don't let one session author both the tests and the implementation.
- **Parallelize last**: parallelism multiplies the bottleneck you already have. Scale out only after one unit has a dependable judge, recovery path, and review format.
- **Agents put a price on ambiguity**: track lead time, review minutes, interventions, escaped defects, rollbacks, remaining old imports, and traffic on the new path — not lines generated.

| Principle                    | Key line                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------ |
| **Zones**                    | Autonomy follows blast radius, observability, and recoverability — not model confidence |
| **Docs**                     | Write down what the code can't say, and nothing else                            |
| **Research**                 | Exploration with no durable artifact makes the next agent redo the archaeology   |
| **Harness**                  | Every repeated correction is a missing piece of the harness                     |
| **Starting**                 | Lock today's behavior before you let anything improve it                        |
| **Migration**                | Complete when the new path works and the old dependency is demonstrably gone    |
| **Lessons from big ones**    | What transfers between companies is the structure around the agents             |
| **What changed**             | The price of trying several implementations changed; the evidence to choose didn't |
| **Parallelism**              | Parallelism multiplies the bottleneck you already have                          |
| **Metrics**                  | Agents put a visible price on ambiguity                                          |

The details follow below.

---

## 📋 Table of Contents

1. [What Brownfield Means](#what-brownfield-means)
2. [Zones](#zones)
3. [Write Down What the Code Can't Say](#write-down-what-the-code-cant-say)
4. [Make the Research Survive the Session](#make-the-research-survive-the-session)
5. [When Instructions Become a Harness](#when-instructions-become-a-harness)
6. [Start with Zero-Risk Work](#start-with-zero-risk-work)
7. [Migrate in Complete Units](#migrate-in-complete-units)
8. [Lessons from Bigger Migrations](#lessons-from-bigger-migrations)
9. [What's Actually Changed](#whats-actually-changed)
10. [Parallelize Last](#parallelize-last)
11. [Agents Put a Price on Ambiguity](#agents-put-a-price-on-ambiguity)
12. [Wrapping Up](#wrapping-up)

## What Brownfield Means

A brownfield system is a codebase where **the repository no longer fully describes how the thing actually behaves**. Institutional knowledge, duct-tape fixes, legacy services, and expectations other teams depend on all live outside the tree. You have to learn those constraints before writing new code, and after a change you have to **prove** you didn't break them.

The author loves coding with agents, but warns that throwing them at an older codebase unsupervised can produce something that "works" yet has **the wrong system design and brittle tests**. Even before AI, modernization had to happen piecemeal, on top of strong tests, keeping things working as intended through real user-journey testing and a barrage of repeatable tests.

Some now argue that the moment an agent drops code you didn't author decision by decision, you're already in brownfield. Either way, the goal is the same — **make cheap changes safe.** Bringing agentic engineering or software-factory patterns into a large codebase without extra mindfulness is signing up for a world of technical debt.

The whole piece rests on one premise: **the code is the source of truth.** Anything layered on top should be what can't easily be inferred from it.

## Zones

Walking into an old codebase, the first thing you want to know is **what you shouldn't touch**. Split it into zones.

| Zone       | Traits                                                        | What agents may do                          |
| ---------- | ------------------------------------------------------------- | ------------------------------------------- |
| 🟢 Green   | Good test coverage · current conventions · well isolated      | Tight autonomous loop                        |
| 🟡 Yellow  | Mixed quality                                                  | Change code **after** characterization tests |
| 🔴 Red     | Auth · billing · permissions · payroll, understood by few     | A human pairing on every step, or not at all |

On commerce sites the author worked on, five or six departments often ran their own microsites behind what felt like a single experience to users. A team that built its area in the last couple of years had solid tests; others didn't. That's why zones split even within one repository.

Three rules turn zones from a metaphor into an operating procedure.

1. **A person draws the map, not the agent.** Left to choose, the agent starts in the scariest file — because the scariest file has the most interesting names.
2. **Zones only move when it's earned.** Yellow becomes green once characterization tests exist and the module's owner has reviewed the agent's first changes.
3. **The zone sets the verbs.** Green is a tight loop, yellow is tests first, red is a human pairing on every step — or the work not happening.

## Write Down What the Code Can't Say

> Autonomy should follow blast radius, observability, and recoverability. A model's confidence is a poor guide.

For a while people turned everything into markdown files and stuffed them into context windows. But agents are actually **pretty good at understanding the map of a system** from code alone. What you should give them is what the code doesn't show.

- Business- or team-specific nuance
- Trade-offs explaining why the system is structured the way it is
- Guidelines not enforced by static analysis or tooling
- Domain-specific rules
- External constraints and the historical context behind counter-intuitive implementations

> **Write down what the code can't say, and nothing else.**

This lines up with "the more instructions, the less they're followed" from [Writing Specs Agents Actually Follow](/en/posts/2026-09-13-writing-specs-for-agents/). The shorter and sharper the doc, the more it actually gets followed.

## Make the Research Survive the Session

> If your agent's exploration produces no durable artifact, the next agent pays for the same archaeology again.

The default loop wastes its research. The agent figures out how the auth flow behaves, finishes the task, and loses that model when the session ends. Chat history isn't a great system of record — **especially after compaction.**

So for yellow and red work, start with **a separate read-only pass** that produces a short **comprehension memo**:

- Entry points and owners
- Callers and existing abstractions
- Tests and production signals
- Relevant history and open questions

Every claim should cite a **file, issue, ownership record, or dashboard**.

After research, keep cutting the context as you go:

1. **Plan in a clean context** — ask which files the plausible approaches touch, which invariants they preserve, and how you'd reverse them.
2. **A human picks the path.**
3. **Implementation stops if it discovers the map was wrong.**
4. **Review starts fresh and works backward from the acceptance criteria.** A clean reviewer is more likely to notice a test that proves the implementation while missing the requirement.

## When Instructions Become a Harness

> Every repeated correction is a missing piece of the harness.

It helps to be precise about where each piece fits.

| Piece               | Role                                                                          |
| ------------------- | ----------------------------------------------------------------------------- |
| **Instructions**    | Record unusual facts about the repository                                     |
| **Skills**          | Package reusable procedures like checking blast radius or verifying a schema change |
| **Plugins**         | Provide governed access to the ownership catalog, incident archive, or dashboards |

The **harness** is the whole working environment around the agent — context, tools, permissions, tests, logs, and recovery. A **factory** schedules many dependable loops, keeps durable state, and hands novel cases back to people.

The practical test is **what happens when the agent gets something wrong**. If you quietly repair the diff, the next session can repeat it. When the same review comment appears again, move it into a lint rule, hook, type, test, or skill, and **keep prose only for constraints that can't be enforced mechanically.**

A deny rule, scoped credential, or CI check **doesn't have to remember.** Over time the harness becomes a record of failures the team has decided not to pay for twice. (The skill packaging covered in [Agent Skills](/en/posts/2026-08-26-agent-skills/) slots in right here.)

## Start with Zero-Risk Work

> Lock today's behavior before you let anything improve it.

Bringing agents into an existing codebase looks a lot like any other modernization effort. Not "let's rewrite the monolith in Rust," but **"first, explain how this works."**

**Characterization tests** are automated tests that document a system's **actual current behavior** so you can safely refactor or change legacy code. The point is to pin down what the module does today **ugly parts included**. In an old system, some of that ugly behavior is what the business runs on — and an agent will happily "fix" it behind a green suite.

The technique is old because the problem is old. Netflix used the same idea at production scale in its GraphQL cutover — **replaying and shadowing traffic** against the old and new paths, diffing the payloads, and promoting only when they matched. When a homepage-class surface has no honest unit suite, that's the promotion path. **Don't guess; run both and compare.**

And one important rule:

- **When an agent is the one making the tests pass, don't let that same session be the only author of the tests.** Pin the behavior first, in a separate pass or by a person; then let the agent work. Otherwise you get a green suite that encodes the implementation you just invented.

Next come **mechanical transforms** — dead-code and unused-export inventories. Avoid the trickiest, hairiest parts at first.

The author adds a story from AOL. On a day off, browsing a comic book store near the office, they got a text from their boss: **the AOL.com homepage was completely broken**, and there weren't enough JavaScript experts around. "How complicated can a homepage be?" — but when dozens of departments own components, criteria, scripts, and A/B tests, the job becomes not breaking the world for everyone else. In the end, anything without its own unit tests had to be **user-tested by hand**.

> That's still the job. Agents don't remove the dozens-of-departments problem; they make it cheaper to attempt a change against it.

A surface that only production traffic really understands is **a red zone by definition**, and until you've built a stand-in for that traffic, the user testing the author did on their day off is still the gate.

## Migrate in Complete Units

> A migration is complete when the new path works and the old dependency is demonstrably gone.

Half-finished migrations are especially confusing to agents. Search returns the old approach in forty files, the replacement in twelve, and a shim that presents both as current. The agent sees **contradictory precedent**.

So the author would rather finish **one route end to end, including removing the old path**, than convert thirty files and leave both patterns alive. If deletion is a future cleanup ticket, the migration unit isn't complete.

Tests can stay green while a replacement still calls the legacy implementation. [SWE Refactor Bench](https://arxiv.org/abs/2608.23564) calls this migration **"Blindness"**: across 520 agent runs, only **28** passed its migration audit, behavioral tests, and independent verification.

If a codemod can make the routine change, use the agent to help **write and check the codemod**, and give agents the **exception queue**. Stripe's migration is a useful example precisely because no agents were involved — the durable artifact was **the migration machine** itself.

## Lessons from Bigger Migrations

| Case                                    | Scale · time                                     | Structure worth copying                                                |
| --------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| [Bun Zig → Rust](https://bun.com/blog/bun-in-rust) | 535K lines, ~50 workflows, 11 days      | Two adversarial reviewers per generated unit · the full existing test suite as merge gate · a Zig→Rust idiom porting guide written **before** any agent ran |
| [Anthropic's migration process](https://claude.com/blog/ai-code-migration) | —                     | Stress-test the rulebook on a disposable mini-migration, throw the output away, then do the broad run |
| [Controlled VB6 → C# study](https://arxiv.org/abs/2608.28972) | —                           | 92% behavioral equivalence on simple features, 47% on complex → **unit size is the lever** |
| [Stripe TypeScript](https://stripe.dev/blog/migrating-to-typescript) | 3.7M lines, one PR   | Months of codemod work, no agents                                       |
| [Google large-scale changes](https://abseil.io/resources/swe-book/html/ch22.html) | —       | Atomic changes shrink as codebases grow                                 |
| Spotify                                 | 650+ agent PRs merged monthly                    | On rails Backstage built years earlier                                  |
| [Asana](https://openai.com/index/asana/) | Multi-year Enzyme backlog, two weeks, ~$12,000 | A narrow mechanical migration · a pre-existing suite · humans reviewing every change |

Asana's $12,000 is a token bill, not a substitute for the five-year staffing estimate on the books. The author is careful to frame it as **a vendor-reported cost of generation**, not a controlled savings study.

> What transfers between companies is the structure around the agents.

## What's Actually Changed

> Agents have changed the price of trying several plausible implementations. They haven't changed the evidence required to choose one.

This year we've been reading more cases of established companies using agents for big rewrites. Some CTOs the author talked to let teams have agents **attempt multiple rewrites in different languages or frameworks** at once, because it's now cheap enough to do.

Shopify rebuilt the Shop consumer app from React Native to native Swift and Kotlin **in twelve weeks** with a small team and **agent-gated, screen-sized checkpoints**. The much larger merchant app is still the brownfield problem — hundreds of screens, deep platform integration, same gates, longer clock.

Where one team used to pick a single option and go all in, you can now have them **implement all the competing options**, check each against your unit tests, performance-profile each, and then decide — in some cases far more cheaply. That's a completely different ball game for teams.

## Parallelize Last

> More generated code should lead to more selective human review, not less human ownership.

Before you think about loops, goals, or parallelism, seriously consider what will set your brownfield project up for success. Software factories can run many changes at once, but the author would copy that part only **after one unit has a dependable judge, a recovery path, and a review format people can absorb.**

**Parallelism multiplies the bottleneck you already have.** Automated verification can handle five checked changes. One senior reading every line gets a queue, fragmented attention, and eventually **ceremonial approval**.

Automated review should lead with:

1. Intent
2. Changed invariants
3. Test results
4. Parity mismatches
5. The rollback route

The complete diff stays available, but human attention goes first to **the largest blast radius and the weakest oracle**.

One more thing: **worktrees isolate changes, not behavior.** They may share Git metadata, credentials, local services, and network access. Trusted work may accept that trade-off; unattended agents consuming untrusted content need stronger sandboxes and scoped credentials.

## Agents Put a Price on Ambiguity

Lines generated don't tell you whether the codebase improved. Here's what the author would track.

| Category        | Metrics                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------- |
| **General**     | Lead time · review minutes · human interventions · escaped defects · rollbacks · oracle mismatches · suppressions left behind |
| **Migration**   | Remaining old imports · traffic served by the new path · parity mismatches · legacy dependencies removed |

A green suite with all traffic still taking the old path is **busywork**.

> Agents put a visible price on ambiguity. Tribal conventions become recurring review comments.

That cost was always there — paid during onboarding, review, and incident recovery. Agents make more of it **countable**, which gives a stronger argument for the maintenance work teams already knew was valuable.

The next time an agent works on a homepage-equivalent, the author wants it to leave behind more than the repair: **a synthetic user journey, an ownership record, and a regression test.** What the next engineer and the next agent inherit matters too.

## Wrapping Up

Boiled down to one sentence: **the structure around the agent decides the outcome more than the agent's capability does.** What Bun, Stripe, Asana, and Shopify share across different languages, scales, and tools is an existing test suite as the gate, narrow units, human review, and a guide written before the agents ran.

Two points hit home for me. One is the rule **"don't let one session write both the tests and the implementation."** Agent-written green tests that prove the implementation just invented rather than the requirement are something I see all the time. The other is the observation that **"a half-finished migration is contradictory precedent for an agent."** The dual patterns that confused humans become training data for the agent as-is.

**Checklist before bringing agents into a brownfield codebase:**

- ✅ Has a person drawn the green/yellow/red zone map?
- ✅ Are zone-promotion criteria (characterization tests + owner review) defined?
- ✅ Do instruction docs contain only what the code can't say?
- ✅ Does yellow/red work start with a cited comprehension memo?
- ✅ Are repeated review comments moving into lint, hooks, types, tests, or skills?
- ✅ Are behavior-locking tests written by a **different** pass (or a person) than the agent doing the work?
- ✅ Does "done" for a migration unit include deleting the old dependency?
- ✅ Do you parallelize only after one unit's judge, recovery, and review format are proven?
- ✅ Are you watching lead time, interventions, rollbacks, and remaining old imports instead of lines generated?

---

# References

- Addy Osmani, [Brownfield Agentic Engineering](https://addyo.substack.com/p/brownfield-agentic-engineering) (2026-09-14)
- Bun, [Bun in Rust](https://bun.com/blog/bun-in-rust)
- Anthropic, [AI code migration](https://claude.com/blog/ai-code-migration)
- Stripe, [Migrating to TypeScript](https://stripe.dev/blog/migrating-to-typescript)
- Google, [Software Engineering at Google — Large-Scale Changes](https://abseil.io/resources/swe-book/html/ch22.html)
- Earlier posts — [Writing Specs Agents Actually Follow](/en/posts/2026-09-13-writing-specs-for-agents/) · [Agentic Code Quality](/en/posts/2026-08-25-agentic-code-quality/) · [Agent Skills](/en/posts/2026-08-26-agent-skills/)
