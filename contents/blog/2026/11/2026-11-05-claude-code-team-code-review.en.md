---
layout: post
title: Why Humans Don't Have to Read Every Line — How the Claude Code Team Does Code Review
date: 2026-11-05
published: 2026-11-05
category: AI Engineering
tags: ['code-quality', 'agents', 'Claude', 'harness']
comments: true
thumbnail: './assets/05/thumbnail.en.png'
github: ''
---

# Code Review on the Claude Code Team: Machines Do the Reading, People Go Where the Risk Is

Notes on [How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/) by Addy Osmani, Morgan Westlee Lunt, and Qing Wang on the claude.dev blog (2026-10-15).

## ✍️ TL;DR

> **They didn't remove review. They moved most of the reading to machines, optimized for human time and attention, and invested heavily in making mistakes fast and easy to undo.** The goal: the minimum amount of human review time that doesn't raise reverts or incidents.

### Summary

- **Background**: Claude writes about 90% of Claude Code's own code. From June to September, merged PRs to the Claude Code codebase **more than doubled**, while the share that had to be reverted fell by **more than 40%**.
- **Change the question**: "Did a human read the code?" is an imprecise proxy. The real question is **"What could go wrong with this change, and which check — automated or human — is the right one to catch it?"**
- **Review moved earlier**: it's no longer a gate at the end of the road; it runs continuously, **like spellcheck while you write**. Most changes have been reviewed and fixed by Claude at least once before a person is asked to look.
- **The target**: most PRs merge with **at most one human in the loop (who can be the author)**, with no increase in reverts or incidents. They track human approvals per PR (median and p95), human comments, and time waiting on a person, with **revert and incident rates as the guardrail**.
- **Seven layers**: pre-PR verification → AI review on every PR → blocking security review → blocking automated checks → **risk-scaled human approval** → merge queue, flags, and gradual release → fast detection and rollback. Each layer has holes in different places.
- **A loop that improves the reviewer**: past incidents become an eval, and every change to the reviewer is scored against it daily. Noise is measured by **what people actually do with the comments**.
- **Review has to converge**: an agent author and an agent reviewer can keep each other busy indefinitely (one PR went 50+ rounds overnight). A round cap, diff-only re-review, flagging the class of bug, and no repeats moved **one-round passes from 65% to 78%**.
- **Where humans stay**: deciding whether to build it, risky code, pattern-setting architecture, reading the evidence, and owning the outcome.

| Layer                         | What it does                                                         | Who                       |
| ----------------------------- | -------------------------------------------------------------------- | ------------------------- |
| **1. Pre-PR verification**    | Show runnable verification output; a fresh-context subagent reviews the diff | Author + Claude    |
| **2. AI review**              | Reads the diff against the whole repo and the PR's intent; other agents vote on findings | Automated   |
| **3. Security review**        | Any open finding blocks the merge                                    | Automated                 |
| **4. Automated checks**       | Lint · types · tests on every platform · build                       | Automated                 |
| **5. Human approval**         | Zero, one, or two people depending on risk tier                      | People (risk-based)       |
| **6. Merge queue · flags**    | Re-check against main, internal use first, `latest` → `stable`       | Automated                 |
| **7. Detection · rollback**   | Flags off without a deploy, weekly on-call, "which layer should have caught it?" | People + dashboards |

Details follow below.

---

## 📋 Table of Contents

1. [Rethinking the Purpose of Code Review](#rethinking-the-purpose-of-code-review)
2. [The Scarce Resource Is Human Time and Attention](#the-scarce-resource-is-human-time-and-attention)
3. [The Life of a Change](#the-life-of-a-change)
4. [Layer by Layer](#layer-by-layer)
5. [Making the Reviewer Better](#making-the-reviewer-better)
6. [Where Humans Stay in the Loop](#where-humans-stay-in-the-loop)
7. [Sharing Context Across the Team](#sharing-context-across-the-team)
8. [You Land It, You Own It](#you-land-it-you-own-it)
9. [When the Direction Changes](#when-the-direction-changes)
10. [Adopting This on Your Team](#adopting-this-on-your-team)
11. [Where This Is Going](#where-this-is-going)
12. [Wrapping Up](#wrapping-up)

## Rethinking the Purpose of Code Review

Anthropic has said before that Claude writes about 90% of Claude Code's own code. So how do you review code at the volume it's produced? Does anyone read code anymore? And if something breaks, who catches it?

When agents write code, the number of changes goes up, fast. In Anthropic's monorepo, changes landing per day went from [about 2,500 in May to more than 30,000 in September](https://www.anthropic.com/engineering/redesigning-source-control). Claude Code lives in its own repository, separate from the monorepo, but it feels the same pressure. At that pace, manual line-by-line review is close to impossible.

Code review does two jobs:

1. Find and fix issues before they ship
2. Build shared context and codebase understanding across the team

The article focuses mostly on the first, and comes back to the second near the end.

The authors argue that **"did a human read the code?"** is an imprecise proxy for the real question:

> What could go wrong with this change, and which check — automated or human — is the right one to catch it?

Asking that question also changed **when** review happens. Review used to be a gate at the end of the road: write the code, open a PR, wait for a colleague. Now it runs continuously, **more like spellcheck while you write**. Most changes have been reviewed and fixed by Claude at least once before a person is asked to look. That catches most routine mistakes and saves the team's attention for higher-level questions and scrutiny.

## The Scarce Resource Is Human Time and Attention

The goal is to spend human time and attention on **issues only humans can solve** and let automated checks catch the rest. Even at the current rate of change, there's still an enormous amount of work for people, and the team runs into new problems almost daily.

"Human time" here covers **both sides** of review's cost:

- the time people spend **reviewing**
- the time people spend **fixing what bad code breaks**

Cutting the first doesn't help if the time just shows up in the second.

So the goal was set like this: **most pull requests in the Claude Code repos (the CLI, the desktop and web apps, and the mobile apps) merge with at most one human in the loop — who can be the author — with no increase in reverts or incidents.**

| Category       | Metric                                                                          |
| -------------- | ------------------------------------------------------------------------------- |
| **Human time** | Human approvals per PR (median · 95th percentile) · human comments · time a PR waits on a person |
| **Guardrail**  | Revert rate · incident rate                                                     |

> If the guardrail numbers rise, you haven't saved human time — you've only **moved** it.

## The Life of a Change

A typical change, starting from an engineer's laptop (or a Claude session in Slack), passes through several layers of code review.

```text
[Before PR]   Work is verified ─────────────────────────── author + Claude
[Every PR]    Required CI → Claude code review → security ─ all automated
              Risk-based approval ──────────────────────── a person decides
[Merge]       Merge queue
[After merge] Internal-first flag → gradual release → watch · fix forward · roll back
```

> Most of the path is automated; a person's attention goes **where the risk is**.

## Layer by Layer

The original draws this as a **Swiss cheese model**: six slices stacked top to bottom — verification, required CI, AI review, security review, human approval, and merge queue plus flags — each with holes **in different places**. A problem that slips through one slice's hole gets caught by a later one. The rare problem that passes through a hole in every slice lands in **fast rollback** at the bottom.

> Each layer catches some problems and misses others. Few get through all of them, and rollback handles the rest.

### 1. The Work Is Verified Before Anyone Else Looks

Most review now happens **before a PR even exists**. Two habits are central, and both come from the [Claude Code best-practices guide](https://code.claude.com/docs/en/best-practices):

- Give Claude **something it can run** — tests, a build, a screenshot to compare against the design — and ask it to **show the output** instead of saying it's done.
- Then have a **fresh-context subagent** review the diff.

Many people on the team also run a few [internal skills](https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/) before opening a PR: one hunts for bugs, one simplifies the diff, and one checks the behavior end to end. UI changes are also checked against the design guidelines.

Boris Cherny, who created Claude Code, has called giving Claude a way to verify its work [probably the most important thing](https://x.com/bcherny/status/2007179861115511237) for getting good results. He estimates it makes the final result **two to three times** better, and writes:

> Verification looks different for each domain. It might be as simple as running a bash command, or running a test suite, or testing the app in a browser or phone simulator.

(I covered this in more depth in [How the Creator of Claude Code Works](/en/posts/2026-08-22-delete-and-verify/).)

**When the automated reviewer keeps flagging the same thing, fix it at the source** — in the skill, with a lint rule, or by updating instruction files.

| File            | Written by   | Role                                                                                       |
| --------------- | ------------ | ------------------------------------------------------------------------------------------ |
| **`CLAUDE.md`** | The team     | What the project is — the stack, conventions, goals, and non-goals. Every review loads it, so in a large codebase it stays **short** and points to other docs. The reviewer also flags code that breaks a convention in it, and **changes that make a line in it out of date**. |
| **`REVIEW.md`** | Code owners  | What matters to the reviewer in their part of the code. Whether the reviewer actually follows it is **checked separately**. |

What good `REVIEW.md` files have in common is concrete, too:

- They're **short**.
- They say **what failure looks like** in that repo — for docs it's "it lies," for config it's "it misroutes."
- They **cap the nits**.
- They list **paths to skip**.
- They ask for **a file and line as evidence** instead of a guess from a name.
- They ask for a summary that **starts with a count** and says **plainly** when there's nothing to fix.

### 2. AI Review on Every Pull Request

Every PR gets a Claude review before a person looks. The reviewer reads the diff against **the whole repo and the PR's stated intent**, and asks: does the change solve its problem, fit the system, or break something else? On a bug fix, it looks for the **root cause**.

The public version, [Code Review for Claude Code](https://code.claude.com/docs/en/code-review), is generally available on Team and Enterprise plans, and `/code-review` runs a lighter version locally.

When the [research preview launched](https://claude.com/resources/articles/code-review), the share of internal PRs getting substantive review comments went from **16% to 54%**. Most PRs over 1,000 lines get findings, and most small ones come back clean. Admins set each repo to **Quick, Standard, or Deep**; Deep is worth it where one missed bug costs more than the extra review time.

**Findings get verified by other agents before humans see them.**

1. Several agents look for bugs **at the same time**.
2. A separate group of agents **votes** on each finding, and it's only posted if enough of them agree it's real.
3. Findings that are only about style, diagnostics, or cleanup are **dropped**. Those filters were **A/B tested** on internal PRs before they were kept.
4. What's left appears as inline comments sorted by severity, each tagged **Important, Nit, or Pre-existing** — so a bug the PR didn't introduce doesn't look like the author's fault.

**Every finding has to be answered.** You either fix it or resolve the thread with a reason. Often an agent picks up the fix overnight, so the author comes back to a PR that's already been through another round.

### 3. Security Review That Can Block

Security gets its own automated review. **A PR can't merge while any finding from the bug review or the security review is still open.** You either fix it or close the thread with a short reason — which is how a false positive gets cleared. If a later commit fixes the issue, the finding clears on its own.

You can set up the same thing with the open-source security review GitHub Action or the `/security-review` command. Setup is covered in [Automated security reviews in Claude Code](https://support.claude.com/en/articles/11932705-automated-security-reviews-in-claude-code).

### 4. Automated Checks That Block

The usual: lint, type checks, tests on every platform, and a build. (There's [a separate write-up](https://claude.com/resources/articles/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic) on scaling CI for this volume.) A typical CLI PR may run **dozens of checks** before anyone looks at it.

The PR template asks **how the change was tested** and **how to undo it**. Claude can fill that in, but **the person who asked for the change** signs off on it.

### 5. Human Approval, Scaled by Risk

A docs fix and an auto-updater change carry different risk, so they get different review.

| Risk       | Examples                                                                                         | Human approvals                                                |
| ---------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| **Low**    | Docs, copy, internal-only features, additive changes behind a flag                                | **None** once automated review and security checks are green   |
| **Medium** | Ordinary product changes, and changes to sensitive areas like caching, the auto-updater, or system prompts | **One person**                                       |
| **High**   | The highest-risk code, plus a small set of paths that always need two people                       | **Two people**                                                 |

Four rules make the table work:

- **The change sets the tier, not the author.** A classifier reads the change and picks its risk tier. A second classifier asks whether **this particular change** needs another person even when its tier says it doesn't. Some paths always need a person — anything owners have listed as sensitive, and **any CI workflow file**.
- **Only trusted authors get the lighter paths.** Only authors on the repo's trusted list (mostly the team that owns it) can use the lighter paths; everyone else needs a second person to approve. And **an agent's approval never counts as a person's.** Automated review can clear a low-risk change, but it can't fill a slot that calls for a human.
- **Whoever prompted the change is on the hook for it.** On an agent-written PR, the person directing the agent counts as one of the required reviewers — the same as if they'd typed the code themselves.
- **An approval covers one specific commit.** If new commits land that the system can't vouch for — an agent's push, or a merge someone resolved by hand — the approval has to be given again.

### 6. Merge Queue, Flags, and a Gradual Release

The merge queue re-runs **every check** against main with the change applied, so two PRs that pass separately can't combine into a broken main.

New behavior usually ships **behind a flag to Anthropic employees first**, and heavy internal use often surfaces regressions before users see them. Public releases go to the `latest` channel first; the `stable` channel trails it.

### 7. Fast Detection, Fast Rollback

Some mistakes will still get through, so the last layer is about **catching them fast**.

- Flags turn off **without a deploy**.
- Claude Code has a **weekly on-call rotation**.
- Incident reviews ask **"which layer should have caught this?"**

The limits are stated plainly, too. Noticing a bad merge still depends on the author and on-call, plus the revert and incident dashboards. There are **no circuit breakers yet** that tighten approval when those numbers move, and engineers want them before more code moves to zero-human merges.

> One colleague said slowing down does lower your error rate, but mostly because **you're doing less of everything**. We'd rather get faster at noticing and fixing problems.

## Making the Reviewer Better

The code review process itself keeps improving in a loop.

**Every incident becomes an eval.** The team collected past PRs that caused incidents, along with their fix-forwards and reverts, and had engineers who know that code confirm each bug and where it lived. The reviewer runs against that set **daily**.

```text
Incident / revert ──▶ expert-checked case ──▶ added to the eval set
                                                    │
Reviewer change ──▶ daily eval run (scored on every case) ◀─┘
                        │
      score up → keep / otherwise → drop ──▶ repeat with the next change
```

> The eval grows with every incident, and every change to the reviewer is scored against all of it.

**Noise is measured by watching what people do with the comments.** It's easy to catch more bugs if you don't mind flagging lots of non-bugs, so there needs to be a check on that. Every comment the reviewer leaves is sorted by how the person on the PR responded:

- they fixed it
- they said it was wrong
- they said the behavior was intentional
- they decided it didn't matter

The team also runs the reviewer on **PRs known to be clean** and counts how often it reports something that would have led someone to make a **harmful change**. The written-down priority is **catching real bugs first, cutting review rounds second**.

Noise costs more when the author is an agent. A person can wave off a nit in seconds. An agent fixes it — which means another commit and another round of review.

### Review Has to Converge

An agent author and an agent reviewer can **keep each other busy indefinitely**. One CLI PR went through **more than fifty rounds** of review and fixes overnight before its author stopped it.

When the team ran `git blame` on what the reviewer kept flagging, about **59%** of it was code that had been there since the reviewer's first pass. The reviewer was rarely finding new bugs — it was finding **a few more old ones each round**.

They'd also made it worse themselves: since each pass catches something new, they'd gotten used to running several rounds by default. That can be worth it on a risky change, but not on every PR. The team now tracks **rounds-to-pass alongside recall**, and changed re-review:

- **A round cap.** After three rounds, the reviewer asks the author to step back and **reconsider the approach**.
- **Diff-only re-review** after the first few passes.
- **Flag the class of bug**, so the author fixes every instance, not one line.
- **No repeats** of findings already posted.

Review agents also run nightly over **existing code**, catching old bugs before they show up somewhere else.

| Metric (internal PRs)                     | Before convergence work | After        |
| ----------------------------------------- | ----------------------- | ------------ |
| PRs passing after one review-and-fix round | 65%                     | **78%**      |
| PRs needing five or more rounds            | 8.9%                    | **1.5%**     |
| Mean reviews to pass                       | 2.08                    | **1.32**     |

## Where Humans Stay in the Loop

Pulling a senior engineer out of deep work to catch a routine mistake costs far more than an automated review. People on the team are still responsible for:

- **Deciding whether to build it.** Direction, taste, and scope. One team that declared its review bottleneck solved still kept human review for **changes from outside the team**, so someone asks "should we even do this?"
- **Reviewing risky code** such as billing, the auto-updater, and CI workflows.
- **Reviewing architecture** that **sets a pattern** others will copy.
- **Reading the evidence.** Test output, the command that ran and what it returned, a screenshot, the reviewer's findings. **If you can't say what the checks would miss**, ask for a real review rather than a quick approval.
- **Owning the outcome.** A person is accountable for every change that ships, whoever typed it.

## Sharing Context Across the Team

Code review's second job has always been to spread codebase understanding. Reading a teammate's diff is how you learn what changed and how the pieces fit. **If machines do most of the reading, how does anyone learn the code?**

The authors say there's no formal process for this. Nobody on the team keeps a complete mental model of Claude Code in their head, and **they don't think anyone needs to**. When someone wants to understand a part of the codebase, they ask Claude to write **an explainer for exactly that slice** — for example, "How does Claude Code retrieve managed settings?" It takes minutes and reflects **the code as it is today**.

Some go a step further and have Claude [build a small artifact](https://claude.dev/blog/using-claude-code-the-unreasonable-effectiveness-of-html/) that visualizes that part of the code and teaches it **the way that person likes to learn**.

If the goal is to spend human attention well, this beats reading trivial diffs line by line:

- **A one-line copy change** teaches you almost nothing.
- **An explainer for the module you're about to change** teaches you a lot.

A culture of defaulting to open Slack channels helps too, since you see what others are building **while they build it**.

## You Land It, You Own It

If you land a small or medium change and something still goes wrong, the team norm is that **you usually fix it**. A few things keep this from going badly:

- **Changes are small**, so they're easy to review, debug, and revert.
- **Everything is reversible.** Flags, reverts, and staged releases undo most mistakes in minutes.
- **Blast radius sets the bar.** Expensive code gets more people and more checks.
- **Regressions surface fast** through telemetry and internal use.
- **It isn't blame.** Owning a fix means you have the most context; incident reviews look at **the system**.

Ownership is also shared. Much of the team works in [open channels](https://claude.com/product/tag) where anyone can see what others are building, pick up a thread, or point a Claude at a gap — and feedback comes from people who don't own the code, too. That openness is a big part of **how quality stays high without a gate on every line**.

## When the Direction Changes

Agents make it cheap to **start** things, so some work shouldn't land. Usually someone in the channel asks why, points at an earlier decision, or suggests a simpler route, and the author closes or reshapes the PR.

Since the code was fast to write, closing the PR doesn't feel like a loss. The trick is to raise a different direction **early, in the thread** — not as a blocking comment on a finished PR.

## Adopting This on Your Team

Most of the pieces exist today.

### Before the Pull Request

- Give your agent **checks it can run**, listed in a short `CLAUDE.md`, plus **hooks** that run formatters and linters.
- Run `/code-review` and `/security-review` locally, or a fresh-context subagent review.
- Add a `REVIEW.md`, and **move repeated review comments into it**.

### On Every Pull Request

- Require CI, and add **"Testing," "Risk," and "How to revert"** to your PR template.
- Add an AI reviewer (Code Review for Claude Code, or the Claude Code GitHub Action) on **one repo**, tune `REVIEW.md` for a few weeks, then widen.
- Add automated security review, and require **every review thread resolved** before merge.
- Match review effort to risk: a quick pass on routine changes, a deep one where a missed bug is expensive (Quick, Standard, or Deep in Code Review).
- **Cap review rounds**; after the first few, re-review **only the new diff**.

### Approval

- Write down risk tiers, set **from the change rather than the author**; **start strict and loosen with evidence**.
- Keep the lighter approval paths for **authors you trust**.
- Use CODEOWNERS and branch protection so auth, billing, CI and release workflows, and installers **always need a person**.
- Never let a bot's approval replace a required human's; **dismiss approvals on new commits**.

### Merge and After

- Use a merge queue, feature flags, internal use first, staged releases, and **one-step rollback**.
- Turn incidents and reverts into an **eval set**, and rescore the reviewer whenever its prompts, tools, or model change.
- Measure **human time**, with revert and incident rates as the guardrail.

## Where This Is Going

The Code Review [announcement](https://claude.com/resources/articles/code-review) said approving a PR is still a human call; the product posts findings, not approvals. The Claude Code team's own repos go further, **letting owners decide which low-risk changes merge on automated checks alone** — and that line keeps moving.

When a review misses something, the team asks **"what didn't the model have in front of it?"** and puts the fix into a `CLAUDE.md`, a skill, or a new check. The goal hasn't changed: **less human time per change, and no more reverts than before.**

## Wrapping Up

If I had to compress this into one sentence: **the unit of review shifted from "did a human read it?" to "is there a right check for this risk?"** Zero-human merges are possible not because review is skipped, but because there are layers from pre-PR verification all the way to rollback, and **the risk call is attached to the change itself, not to the author**.

Three things stuck with me.

First, the observation that **noise costs more when the author is an agent**. A nit a person would shrug off, an agent dutifully fixes — adding a commit and a review round each time. The round cap and "after three rounds, reconsider the approach" are rules any team running agent-on-agent review could adopt today.

Second, the rule that **an approval covers one specific commit**. It closes exactly the gap where a commit an agent pushes after approval slips in unreviewed. On GitHub it's a single branch-protection option — "Dismiss stale pull request approvals when new commits are pushed" — so if agents push to your PRs, it's worth checking whether it's on.

Third, **fixing repeated findings at the source**. It's the same idea as "every repeated correction is a missing piece of the harness" from [Brownfield Agentic Engineering](/en/posts/2026-10-11-brownfield-agentic-engineering/), and it reads like Anthropic's in-house, production version of "at a scale where review doesn't work, constraints protect quality" from [Quality Lives in the Constraints](/en/posts/2026-08-25-agentic-code-quality/).

**A checklist for your team's code review:**

- ✅ Before opening a PR, does the agent show **verification it actually ran** (test output, screenshots)?
- ✅ Is `CLAUDE.md` short, and does `REVIEW.md` say what failure looks like in this repo?
- ✅ Are AI review findings **verified by other agents** before they're posted?
- ✅ Does an open review or security thread **block the merge**?
- ✅ Is the risk tier set **by the change, not the author**, with CI workflows, billing, and auth always needing a person?
- ✅ Does a **bot approval never replace a human one**, and do new commits dismiss approvals?
- ✅ Are review rounds **capped**, with re-review limited to the new diff?
- ✅ Have past incidents and reverts become **the reviewer's eval set**?
- ✅ Are you measuring human review time with **revert and incident rates as the guardrail**?

---

# References

- Addy Osmani, Morgan Westlee Lunt, Qing Wang, [How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/) (2026-10-15)
- Anthropic, [Redesigning source control](https://www.anthropic.com/engineering/redesigning-source-control)
- Claude Code Docs, [Best practices](https://code.claude.com/docs/en/best-practices) · [Code Review](https://code.claude.com/docs/en/code-review)
- Claude Help Center, [Automated security reviews in Claude Code](https://support.claude.com/en/articles/11932705-automated-security-reviews-in-claude-code)
- Anthropic, [Code Review announcement](https://claude.com/resources/articles/code-review) · [Agentic coding is straining CI](https://claude.com/resources/articles/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic)
- Earlier posts — [Brownfield Agentic Engineering](/en/posts/2026-10-11-brownfield-agentic-engineering/) · [Quality Lives in the Constraints](/en/posts/2026-08-25-agentic-code-quality/) · [How the Creator of Claude Code Works](/en/posts/2026-08-22-delete-and-verify/)
