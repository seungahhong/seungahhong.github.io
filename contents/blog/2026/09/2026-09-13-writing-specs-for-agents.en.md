---
layout: post
title: More Instructions, Less Compliance — Writing Specs Agents Actually Follow
date: 2026-09-13
published: 2026-09-13
category: Development
tags: ['AI', 'agents', 'spec', 'context engineering', 'PRD']
comments: true
thumbnail: './assets/13/thumbnail.en.png'
github: ''
---

# 1. What Is This Post About?

Notes on Addy Osmani's [How to write a good spec for AI agents](https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents).

The piece opens with a question the author received:

> "I've heard a lot about writing good specs for AI agents, but **haven't found a solid framework yet.**"

That question is exactly right. Advice to "write a good spec" is everywhere; material that tells you **what to write and how much** is rare. And the answer here runs against intuition.

> **Don't write a big spec.** Context window limits and the model's **attention budget** get in the way.

If the [context engineering post](/en/posts/2026-07-31-context-engineering-claude5/) was about **removing rules**, this one sits right next to it: **what's left, and what shape should it take.** Removal is subtraction; spec-writing is **choosing what survives.**

---

# 2. Vision First, Details From the Agent

The first principle is about order: **don't write the full detailed spec yourself before starting.**

```markdown
❌ Human writes 50-page spec → feed it to the agent
✅ Human writes short product brief → agent drafts detailed spec → human corrects → execute
```

The reasoning is practical. **Elaboration is what models are good at**; **direction is what only humans can set.** Mix the two and do both yourself, and you spend time on what you're worse at while the model never uses what it's best at.

The example brief in the article is this short:

```markdown
"Build a to-do app with user accounts and persistent storage."
```

The agent expands that into schema, routing, error cases, and a test strategy — and the human **reads it and fixes only what's wrong.** Faster than a blank page, and more importantly, **the gaps become visible.**

## Why Plan Mode Belongs Here

The article recommends **Plan Mode (read-only)** for this stage — refining the spec while the agent cannot touch files.

This matters because **once spec correction and code writing are mixed, code appears before correction finishes.** The moment code exists, the cost of changing the spec jumps. Read-only pins that cost at zero.

And the refined result gets **saved** — as something like `SPEC.md`. Why it has to be a file rather than a conversation comes back in sections 3 and 6.

---

# 3. What 2,500 Agent Config Files Say — Six Areas

The most concrete part of the article. GitHub analyzed **over 2,500 agent configuration files**, and six areas showed up consistently in the good ones.

| Area | What belongs there | Common failure |
| --- | --- | --- |
| **Commands** | **Full executable commands** including flags (`pnpm test`, `pytest -v`) | Written as "run the tests" |
| **Testing** | Framework · test locations · coverage expectations | The runner is never named |
| **Project structure** | Where source, tests, and docs each live | The agent creates files in the wrong place |
| **Code style** | Conventions shown as **real code examples** | Written as adjectives only ("keep it clean") |
| **Git workflow** | Branch naming · commit format · PR requirements | A human fixes it every time |
| **Boundaries** | Hard constraints · **what must never be touched** | Missing entirely |

Of the six, the one most often empty in practice is **boundaries.** The other five are descriptive, so they fill in as you write. Boundaries are the entries **you only think of after an incident.**

One line from the article sums it up:

> **"Never commit secrets"** was the single most common — and most helpful — constraint.

## The Recommended Skeleton

```markdown
# Project Spec: [Name]

## Objective
[One clear goal statement]

## Tech Stack
[Specific versions and dependencies]

## Commands
- Build: `npm run build`
- Test: `npm test`

## Project Structure
- `src/` – Application code
- `tests/` – Unit/integration tests

## Boundaries
- ✅ Always: [Safe actions]
- ⚠️ Ask first: [High-impact changes]
- 🚫 Never: [Hard stops]
```

What to notice is **the shape, not the length.** Every entry is **one fact per line**, and it's a **command, a path, or a name** — not an adjective. That's the only shape a model can actually comply with.

---

# 4. The Curse of Instructions — Bigger Specs Get Followed Less

This is the theoretical spine of the article: the phenomenon research calls **"the curse of instructions."**

> As instructions and data in a prompt increase, **the rate at which each individual requirement is satisfied drops noticeably.** Even GPT-4 and Claude struggle to satisfy many requirements simultaneously.

This is the line that stayed with me longest. Our motive for growing a spec is usually **"I can't afford to leave this out"** — and the document that motive produces **degrades the entries already in it.**

```markdown
Intuition: write 20 rules and 20 rules get followed
Reality:   write 20 rules and per-rule compliance falls below a 5-rule document
```

So writing a spec is **budget allocation, not addition.** Adding a rule isn't free — you **buy it by shaving a little compliance probability off every existing rule.** This meets [context engineering by subtraction](/en/posts/2026-07-31-context-engineering-claude5/) at exactly the same point.

## Four Ways to Split

Every remedy in the article is a form of dividing.

| Method | What it means |
| --- | --- |
| **Split by component** | Separate backend and frontend specs; feed **only what's contextually relevant** |
| **Extended TOC with summaries** | A condensed outline referencing detailed sections, **expanded only when needed** |
| **Sub-agents / skills** | Domain-specialized agents carry **only their portion** of the spec |
| **Sequential focus** | One task per prompt, refreshing context in between |

The third connects to the [skills governance post](/en/posts/2026-09-06-skills-governance/). There, sub-agents were characterized as **"mostly existing to protect the context window"** — and this article supplies **the reason that defense matters.** Protecting context isn't a capacity problem; it's a **compliance** problem.

## The Caveat on Parallel Agents

The article also mentions running agents concurrently for independent features — **"one codes, one tests, one reviews."** But with conditions: **start with 2–3**, keep task separation clear, and use orchestration to coordinate shared context.

I'd argue the caveat matters more than the headline. Parallel agents are **a device for splitting context and a device for creating conflicts at the same time.** Scale them up with fuzzy task boundaries and you dodge the curse of instructions by buying **merge conflicts and agents overwriting each other.**

---

# 5. Three-Tier Boundaries — ✅ / ⚠️ / 🚫

The concrete shape of the area section 3 called most often empty.

| Tier | Meaning | Example |
| --- | --- | --- |
| **✅ Always** | Do it without asking | "Always run tests before commits" |
| **⚠️ Ask first** | Expensive to undo | "Ask before modifying database schemas" |
| **🚫 Never** | Hard stop, no exceptions | "Never commit secrets" |

The split into three is the point. Write boundaries as **a single prohibition list** and two things break at once.

```markdown
Prohibitions only: everything ambiguous drifts into "not prohibited" and just runs
Prohibitions only: or you put everything in to be safe, and the agent can't act at all
```

**The ⚠️ tier is the valve that hands a decision back to a human.** Without it every judgment becomes binary — and the decisions that matter in real development are mostly gray, so a valveless spec always fails toward one extreme or the other.

## Embedding Self-Checks in the Spec

Beyond boundaries, the article suggests three more:

- **Verify against the spec** — after writing code, have the agent **check its own output against the spec's requirements**
- **LLM-as-a-Judge** — a judging model for items that need subjective evaluation
- **Conformance tests** — tests **derived directly from the spec**

The third carries the most value. When a spec sentence becomes a test, the spec shifts from **a document you hope gets read** to **a device that turns red when it isn't followed.** That's exactly the shape described in [code quality lives in the constraints](/en/posts/2026-08-25-agentic-code-quality/).

---

# 6. The Spec Is a Living Artifact

The final principle: not a write-once document.

> Specs become the **shared source of truth** — **living, executable artifacts that evolve with the project.**

| Practice | What it means |
| --- | --- |
| **Test at every milestone** | Catch spec/implementation drift **early** |
| **Update the spec** | When you find a missing requirement, **fix the document** (don't patch it in chat) |
| **Version the spec** | Put the spec itself under source control |
| **Log agent actions** | Trace back how instructions were misread |
| **Context management tooling** | For large specs, pull **only the relevant sections** via RAG, MCP, vector DBs |

The last item is the same remedy as section 4. If you can't stop a spec from growing, at least stop **all of it from entering at once.**

## Model Selection and Cost

One practical note: **capable models for planning and critical steps, cheaper ones for routine expansion** — and throttle context sizes appropriately.

> **More tokens don't guarantee better outcomes. Context quality matters more than length.**

The same conclusion as [choosing a Claude model](/en/posts/2026-08-01-choosing-claude-model/). Each stage needs something different, and using the top model everywhere is **laziness paid for in tokens.**

---

# 7. Anti-Patterns the GitHub Study Found

| Anti-pattern | Why it fails |
| --- | --- |
| **Vague prompts** | "Build something cool" gives **nothing to anchor to** |
| **Overlong context without summarization** | Dumping 50 pages fails (section 4) |
| **Skipping human review** | **Passing tests ≠ correct** |
| **Conflating prototyping with production** | The spec has to say **where rigor applies** |
| **Missing some of the six areas** | An empty area becomes a gap |
| **Ignoring speed, non-determinism, cost** | **Verification has to keep pace with agent velocity** |

The fourth shows up constantly. A single repo holds both **throwaway prototypes** and **code that will live a year** — and if the spec doesn't make that distinction, the agent treats both identically. Both outcomes are bad: the prototype gets over-built, and production code gets prototype treatment.

The last one is worth a second pass too. Agents produce code faster than humans do, while review speed stays fixed. As that gap widens you accumulate **an inventory of unreviewed code** — which isn't speed, it's **accruing debt faster.**

---

# 8. Applied to This Repo — Four of Six Areas Are Empty

Reading without applying leaves nothing behind, so I measured this blog's `CLAUDE.md` against the six areas from section 3.

| Area | Current state | Verdict |
| --- | --- | --- |
| **Commands** | Delegates to "see `package.json` scripts" + spells out only `pnpm fetch:popular` | ⚠️ |
| **Testing** | Absent — no mention of vitest vs. playwright, or where tests live | ❌ |
| **Project structure** | The `contents/blog/YYYY/MM/*.md` convention exists. The `src/` layout doesn't | ⚠️ |
| **Code style** | Absent | ❌ |
| **Git workflow** | The deploy path (`develop` → `master` → `gh-pages`) is detailed | ✅ |
| **Boundaries** | Absent — no ✅/⚠️/🚫 distinction anywhere | ❌ |

What made this interesting is that **the empty areas overlap with the areas where things have actually gone wrong.**

Adding a single post to this repo breaks **four hardcoded test expectations** (post count, category count, latest post date, the count rendered on the About page). `CLAUDE.md` says nothing about any of it. **The testing area is empty, so the lesson arrives as a red build every time.**

Boundaries are the same. This repo already has obvious 🚫 and ⚠️ entries.

```markdown
🚫 Don't run `pnpm format` over existing posts — it rewrites every table's alignment
🚫 Don't commit `public/blog-assets/` — it's a gitignored derived artifact
⚠️ Running `pnpm fetch:popular` on `develop` and committing it can conflict at merge time
```

The third one *is* in `CLAUDE.md` — as prose, **not marked ⚠️.** A warning buried in a paragraph and a line tagged `⚠️` are **not the same information.** The first hopes to be read; the second has been **classified.**

So the actual work here narrows to:

1. **Add a boundaries section and move the 🚫/⚠️ we already know into it** — this isn't discovery, it's **classifying what's already scattered through prose**
2. **Fill the testing area** — runner, locations, and "the four places to update when adding a post"
3. **Don't grow it** — given section 4, leave code style empty until an incident actually costs something

Writing down #3 matters. Seeing six areas makes you **want to fill all six** — and that's precisely the direction this article warns against. An empty area isn't a defect; it may just be an area **that hasn't cost anything yet.**

---

# 9. Easy Things to Misread

## Misreading 1 — "Writing specs means going back to waterfall"

The claim is the opposite. A spec isn't **fixed and frozen once**; it's the **living artifact** of section 6. And the draft is written by the agent, not the human (section 2). Waterfall's essence is "finalize a phase and move on" — here you **return to the spec at every milestone.**

If anything this is closer to **treat the spec like code**: versioned, tested, changed through commits.

## Misreading 2 — "Longer-context models will solve this"

Section 4 is the answer to that hope. The curse of instructions is **an attention problem, not a capacity problem.** Widen the window and **satisfying 20 simultaneous instructions** remains exactly as hard.

```markdown
Context window: how much fits         → solved by hardware/models
Attention budget: how much is obeyed  → solved by whoever writes it
```

## Misreading 3 — "Filling all six areas makes a good spec"

This is where section 8 caught me. The six areas are **a diagnostic, not a checklist.** Filling an area by guesswork, where nothing has ever gone wrong, produces exactly the **compliance-shaving instructions** section 4 describes. When an area is empty, ask **why** first — nothing has gone wrong, or something went wrong and nobody wrote it down?

## Misreading 4 — "With self-checks in place we can cut human review"

The anti-pattern list settles this: **passing tests is not correctness.** And every self-check in section 5 is **the agent measuring its own work against its own spec**, which means **they all pass when the spec itself is wrong.** Whether the spec is wrong cannot be determined from inside the spec — that seat belongs to a human.

---

# 10. Summary

| | Point | Why |
| --- | --- | --- |
| **1. Vision from humans, detail from agents** | Short brief → agent draft → human correction | Only humans set direction; models elaborate better |
| **2. Diagnose with the six areas** | Commands · Testing · Structure · Style · Git · **Boundaries** | The axes common to 2,500 files |
| **3. Boundaries in three tiers** | ✅ Always / ⚠️ Ask first / 🚫 Never | Without ⚠️, every judgment turns binary |
| **4. More instructions, less compliance** | The curse of instructions | New rules are bought by shaving existing ones |
| **5. So you split** | By component · TOC · sub-agents · sequential | Splitting context is a compliance device, not a capacity one |
| **6. Turn spec sentences into tests** | Conformance tests · verify-against-spec | From a document you hope gets read to one that turns red |
| **7. Verification must keep pace** | Passing tests ≠ correct | Otherwise you stockpile unreviewed code |

Overlaid on the thread this blog has been following, the position is clear:

- [Product spec harness](/en/posts/2026-07-12-product-spec-harness/) — the **procedure for producing** a spec, as a harness
- [Context engineering](/en/posts/2026-07-31-context-engineering-claude5/) — verify when you **remove** rules
- [Choosing a Claude model](/en/posts/2026-08-01-choosing-claude-model/) — **each stage needs a different model**
- [Code quality lives in the constraints](/en/posts/2026-08-25-agentic-code-quality/) — verify by what **surrounds** the agent
- [Skills governance](/en/posts/2026-09-06-skills-governance/) — what those rules need once they **pass through many hands**
- This post — **what shape, and how much** to write them in

Back to the original question: the "solid framework" turns out to be **six areas, three tiers of boundaries, and the discipline not to grow it.** The first two are lists you can apply today. The third is the hard one — a spec is a document that always wants to get longer, and **the moment it does, the entries already in it start going unfollowed.**

---

# References

- Addy Osmani, [How to write a good spec for AI agents](https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents)
- GitHub, [Spec-driven development](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) · [Spec Kit](https://github.com/github/spec-kit)
- Anthropic, [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- Previous posts — [Skills Governance](/en/posts/2026-09-06-skills-governance/) · [Code Quality Lives in the Constraints](/en/posts/2026-08-25-agentic-code-quality/) · [Context Engineering](/en/posts/2026-07-31-context-engineering-claude5/)
