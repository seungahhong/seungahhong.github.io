---
layout: post
title: What Agents Skip Is Always the Senior Work — What Agent Skills Enforces
date: 2026-08-26
published: 2026-08-26
category: Development
tags: ['AI', 'agents', 'skills', 'harness', 'dev-process']
comments: true
thumbnail: './assets/26/thumbnail.png'
github: ''
---

# 1. What Is This Post About?

Notes on Addy Osmani's [Agent Skills](https://addyosmani.com/blog/agent-skills). In one sentence:

> **Most of a senior engineer's job never shows up in the diff.** Specs, tests, reviews, scope discipline, refusing to ship what can't be verified. And **agents skip exactly that part by default.** Agent Skills is an attempt to make those parts non-optional.

If the [last post](/en/posts/2026-08-25-agentic-code-quality/) was about **constraints around the agent**, this one is about **process pushed into it**. Opposite directions, same destination.

## Why They Skip

The diagnosis is unsentimental. An agent's default behavior is to take **the shortest path to "done."** Ask for a feature and it writes the feature. It doesn't ask whether a spec exists, doesn't write a test before the implementation, doesn't consider whether the change crosses a trust boundary, doesn't check what the PR will look like to a reviewer. It produces code, declares victory, moves on.

But this isn't a new failure mode. It's **the same one every senior engineer has spent a career learning to avoid.**

Agents skip these steps for the same reason any junior would: **they're invisible.** The reward signal points at "task complete," not "task complete and the design doc exists."

```markdown
Rewarded:     code that runs
Not rewarded: surfacing assumptions · the spec · splitting into reviewable chunks
              choosing the boring design · leaving evidence the result is correct
```

Every item on that second list is **what makes a senior a senior**, and every one of them sits outside the reward. Hence the conclusion: **you have to bolt the senior-engineer scaffolding back on.**

---

# 2. A Skill Is a Workflow, Not a Document

The most important distinction in the piece — and the one most "AI rules" repos fail.

The definition given: a skill is **not reference documentation but a workflow** — a sequence of steps the agent follows, checkpoints that produce evidence, and a defined exit criterion. Not "everything you should know about testing."

Why that distinction is the whole game:

| What you put in | What the agent does |
| --- | --- |
| **A 2,000-word essay on testing best practices** | Reads it, generates plausible-looking text, **and skips the actual testing** |
| **A workflow** (write the failing test first → run it → watch it fail → write the minimum code to pass → watch it pass → refactor) | **Has something to do**, and you **have something to verify** |

> **Process over prose. Workflows over reference. Steps with exit criteria over essays without them.**

And the line that stings:

> That also explains why so many "AI rules" repos end up doing nothing in practice. **The rules are essays.**

Writing "please write good tests" into `CLAUDE.md` and expecting compliance — that's an essay. With no artifact to check, you can't even tell whether it was followed.

---

# 3. Five Principles Doing the Work

Five design decisions are described as load-bearing; the rest follows from them.

## 3-1. Process Over Prose

Covered above. It's applied to human teams too — **a 200-page handbook goes unread under time pressure, while a small set of workflows with checkpoints actually gets run.**

## 3-2. Anti-Rationalization Tables — The Thing Most Worth Stealing

Called out as the pattern the author most wants other teams to take.

Each skill carries **a table of excuses an agent (or a tired engineer) might use to skip the workflow**, each paired with **a pre-written rebuttal**. Roughly, in the article's examples:

| Excuse | Rebuttal |
| --- | --- |
| "This task is too simple to need a spec" | Acceptance criteria still apply. **Five lines is fine. Zero lines is not** |
| "I'll write tests later" | **"Later" is the load-bearing word.** There is no later. Write the failing test first |
| "Tests pass, ship it" | **Passing tests are evidence, not proof.** Did you check the runtime? The user-visible behavior? Did a human read the diff? |

Why it works:

> **LLMs are excellent at rationalization.** They will produce a plausible-sounding paragraph explaining why *this particular* task doesn't need a spec, or why *this particular* change is fine to merge unreviewed.

So the table is **a pre-written rebuttal to a lie the agent hasn't told yet**. Rebutting afterward requires a human in the room; writing it down beforehand puts it in context already.

And the observation about human teams is the good part:

> Most engineering decay isn't anyone **choosing to do bad work.** It's people **accepting plausible-sounding justifications for skipping the parts they don't feel like doing.**

## 3-3. Verification Is Non-Negotiable

Every skill terminates in **concrete evidence**. Tests pass. Clean build output. A runtime trace showing expected behavior. A reviewer signs off. **"Seems right" is never sufficient.**

The framing: **the agent is a generator, and you need a separate signal that the work is done.** Exactly the constraints from [the last post](/en/posts/2026-08-25-agentic-code-quality/) and the evals from [the one before](/en/posts/2026-08-23-ai-native-sdlc-playbook/).

## 3-4. Progressive Disclosure

Don't load twenty skills into context at session start. **Activate by phase**, with a small meta-skill acting as a **router** that decides which skill fits the current task.

The reasoning is simple: every token loaded into context degrades performance somewhere, so you load what's relevant and leave the rest on disk.

It's [context engineering by subtraction](/en/posts/2026-07-31-context-engineering-claude5/) applied **at skill granularity**. Routing is how a twenty-skill library fits into a 5K-token slot.

## 3-5. Scope Discipline

The meta-skill's non-negotiable — **"touch only what you're asked to touch."** Don't refactor adjacent systems. Don't remove code you don't fully understand. Don't brush against a TODO and decide to rewrite the file.

It sounds obvious until you watch an agent decide that fixing one bug requires **modernizing three unrelated files**. Scope discipline is named the single biggest determinant of whether an agent's PR is **mergeable or has to be unwound**.

---

# 4. The Google DNA — Public Already, Just Not Built In

The skills being saturated with practices from *Software Engineering at Google* is deliberate, and the reason is exact: **most of what makes Google-scale software work is already documented and public, and it is precisely the part agents are most likely to skip.**

| Practice | Where it lands |
| --- | --- |
| **Hyrum's Law** | API/interface design — every observable behavior eventually becomes someone's dependency |
| **Test pyramid · the Beyoncé Rule** | TDD — *"if you liked it, you should have put a test on it"* |
| **DAMP over DRY** | Test code should read like a specification, even at some cost in duplication |
| **~100-line PRs · Critical/Nit/Optional/FYI labels** | Code review — **big PRs don't get reviewed, they get rubber-stamped** |
| **Chesterton's Fence** | Simplification — don't remove it until you know why it was put there |
| **Trunk-based development · atomic commits** | Git workflow |
| **Shift Left · feature flags** | CI/CD — decouple deploy from release |
| **Code as liability** | Deprecation/migration — every line you keep, you maintain forever |

And then the key sentence of the section:

> A frontier model has read the phrase "Hyrum's Law" in its training data, but **it does not apply Hyrum's Law when it's designing your API at 3am.**

**The gap between knowing and applying** — that's what a skill closes. It isn't teaching the model something it doesn't know; it's making it **reach for what it knows at the moment that matters.**

---

# 5. Where Skills Sit in the Harness — and the Limit That Matters Most

Skills are positioned as **one layer** of the harness.

| Layer | Job |
| --- | --- |
| **AGENTS.md / CLAUDE.md** | The rolling rulebook |
| **Skills** | Reusable workflow chunks, progressively disclosed |
| **Hooks** | **The deterministic enforcement layer** |
| **Tools** | The actions the agent can take |
| **Session log** | Durable memory |

Overlay the **enforcement** axis from the [SDLC playbook post](/en/posts/2026-08-23-ai-native-sdlc-playbook/) on top of that:

```markdown
CLAUDE.md · skills  → things you hope the model follows
hooks · evals       → things that hold even if the model doesn't cooperate
```

**Skills sit on the non-enforcing side.** However well written, a workflow is still text in context, and an agent can read it and skip it anyway. The very existence of anti-rationalization tables is proof that **the skipping actually happens.**

So here's how I read the piece: **skills define what to do; hooks make it impossible to pass without doing it.** You need both, and confusing them is costly. (Section 7 has a live example from this repo.)

One more good point, about long runs: skills matter **more for long-running agents than chat-style ones**, because long runs amplify every shortcut.

An agent that skips the test in a 10-minute session produces one bug. An agent that skips it in a 30-hour session produces **a debugging archaeology project at the end of the run, when nobody remembers the original intent.** The longer the run, the more the scaffolding has to be **enforced rather than suggested**.

---

# 6. What to Take Even Without Installing Anything

The article lists patterns worth stealing even if you never touch an AI agent. I think this is where its real value is.

**① Anti-rationalization as a team practice.** Write down the lies your team tells itself. "We'll fix the tests after launch." "This change is too small for a design doc." "It's fine, we have monitoring." Pair each with a rebuttal, put it in the wiki or `AGENTS.md`, and it will **catch the next Friday-afternoon shortcut.**

**② Process over prose for internal docs too.** If you're writing a 2,000-word "how we approach X," you've written reference material. Convert it to a workflow with checkpoints and **the doc shrinks to 400 words and people actually run it.** Same for onboarding guides and runbooks.

**③ Verification as a hard exit criterion.** Make "produce evidence" the exit step of every task. A green test run, a screenshot, a log, a review approval — anything that proves the work is done. Without it, the task isn't done.

**④ Progressive disclosure for rulebooks.** Instead of a 50-page handbook, write **a small router pointing to the right small chapter.** True for anything anyone reads under time pressure.

And the **five non-negotiables** lifted from the meta-skill, which the author would put in any `AGENTS.md` tomorrow:

```markdown
1. Surface assumptions before building   ← silently held wrong assumptions are the top failure mode
2. Stop and ask when requirements conflict ← don't guess
3. Push back when warranted              ← not a yes-machine
4. Prefer the boring, obvious solution    ← cleverness is expensive
5. Touch only what you're asked to touch
```

An engineering culture in five lines, and **you don't need to install anything to adopt it.**

---

# 7. Applying It to This Repo — the Skills Were There; the Hook Did the Enforcing

Reading without applying leaves nothing behind, so I mapped it. And this repo happens to hold **a good live example.**

Several harness skills are attached here — `frontend-harness` (a11y, semantics, SEO, TDD, review), `product-spec-harness` (planning), `test-layering-harness` (test layering), `git-harness` (commits). By the article's framing, **the lineup is already in place.**

| The article's six phases | What exists here |
| --- | --- |
| **Define / Plan** | `product-spec-harness`, `frontend-harness:planner` |
| **Build** | `frontend-harness:tdd`, the guideline skills |
| **Verify** | `frontend-harness:verify`, `test-layering-harness` |
| **Review** | `frontend-harness:review`, `/code-review` |
| **Ship** | `git-harness:commit` |

But **what actually happened while committing the previous post** demonstrated section 5 perfectly.

The `git-harness:commit` skill defines its workflow very well — check preconditions, extract the issue number, pick a type, decide whether a body is warranted, run a validation checklist, preview and get approval, then ask about push. A textbook example of **a workflow with checkpoints and exit criteria.**

And yet the thing that actually blocked a dangerous command wasn't the skill.

```markdown
What the skill did:  supplied a good commit-message workflow
What actually blocked: guard.sh exited 2 on `git add -A`
```

`frontend-harness`'s `guard.sh` hook rejected `git add -A`, forcing files to be listed explicitly. **However well written a skill is, it's text; the blocking is done by hooks.** The enforcement axis from section 5, reproduced inside a single session.

The conclusion isn't "skills are useless." It's that **they do different jobs.**

| | Good at | Not able to |
| --- | --- | --- |
| **Skills** | Defining what to do in what order · prompting evidence | **Preventing the skip** |
| **Hooks** | Deterministically blocking a non-negotiable line | **Replacing a procedure that needs judgment** |

And the gap I named in [the last post](/en/posts/2026-08-25-agentic-code-quality/) — **no eval verifying whether a change to a skill or `CLAUDE.md` made things worse** — hurts more from this angle. The more skills accumulate, the wider that gap gets. Twenty files encoding workflows and zero regression tests over them means **the most-used code is the least-verified code.**

---

# 8. Easy Things to Get Wrong

## Misreading 1 — "A skill is just a well-written prompt"

No. The dividing line is **whether there's a verifiable artifact.**

```markdown
Prompt:   "write thorough tests"              → no way to check whether it happened
Workflow: "commit the failing test first"     → it's either in the commit log or it isn't
```

The test is whether each checkpoint leaves **a trace visible from outside**. If it doesn't, it's a well-written prompt.

## Misreading 2 — "More skills installed is better"

Section 3-4 disagrees directly. Load them all and **every token degrades performance somewhere.** Twenty works only because twenty are never loaded at once. Adding skills without a router is just adding context pollution.

## Misreading 3 — "This is an agent thing"

Section 6 is the rebuttal. Anti-rationalization tables, process over prose, evidence-based exit criteria, progressive disclosure — all of it **transfers to human teams unchanged.** That's why the article insists you can adopt it without installing anything.

## Misreading 4 — "We installed the skills, so the process is followed"

That's exactly what section 7 shows. **Skills are what you hope gets followed; hooks are what you can't get past without following.** Writing a must-hold rule into a skill and feeling safe is the most common mistake.

---

# 9. Wrapping Up

| | The point | Why |
| --- | --- | --- |
| **1. What gets skipped is the senior work** | Spec, tests, review, scope | The reward points at "done," not "done + evidence" |
| **2. Write it as a workflow** | Steps, checkpoints, exit criteria — not an essay | With no artifact, you can't tell if it was followed |
| **3. Rebut the excuses in advance** | Anti-rationalization tables | LLMs rationalize well; rebutting later needs a human present |
| **4. Route, don't preload** | Progressive disclosure | Every token degrades performance somewhere |
| **5. Hooks do the enforcing** | Skills define; hooks block | Never leave a must-hold rule in a skill alone |

And this is another axis of the same story the earlier posts have been telling.

- [Self-healing harness](/en/posts/2026-07-05-meta-harness/) — verify when you **add** a rule
- [Context engineering by subtraction](/en/posts/2026-07-31-context-engineering-claude5/) — verify when you **remove** one
- [The AI-native SDLC](/en/posts/2026-08-23-ai-native-sdlc-playbook/) — verify when you **change the process**
- [Quality lives in the constraints](/en/posts/2026-08-25-agentic-code-quality/) — verify with what **surrounds** the agent
- This post — what you **push into** it. That's a skill

The closing framing fits here too: an AI coding agent is **an extremely capable junior with no instinct for the parts of the job that don't show up in the diff** — and that senior work will be skipped right up until skipping becomes impossible.

> **That the work isn't optional doesn't change just because the engineer is a model.**

---

# References

- Addy Osmani, [Agent Skills](https://addyosmani.com/blog/agent-skills) (2026-05-03) · [repo](https://github.com/addyosmani/agent-skills) (MIT)
- Titus Winters et al., *Software Engineering at Google* (2020)
- Earlier posts — [Quality Lives in the Constraints](/en/posts/2026-08-25-agentic-code-quality/) · [The AI-Native SDLC Playbook](/en/posts/2026-08-23-ai-native-sdlc-playbook/) · [Context Engineering by Subtraction](/en/posts/2026-07-31-context-engineering-claude5/)
