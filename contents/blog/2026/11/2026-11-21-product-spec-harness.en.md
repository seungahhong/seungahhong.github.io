---
layout: post
title: Ask Before Writing, Doubt After — product-spec-harness
date: 2026-11-21
published: 2026-11-21
category: AI Engineering
tags: ['harness', 'spec', 'agents', 'Claude']
comments: true
thumbnail: './assets/21/thumbnail.en.png'
github: 'https://github.com/seungahhong/seungah-claude-plugins/tree/main/plugins/product-spec-harness'
---

# From Planning Draft to Acceptance Criteria: product-spec-harness

[product-spec-harness](https://github.com/seungahhong/seungah-claude-plugins/tree/main/plugins/product-spec-harness) is a Claude Code plugin that helps product managers go from a problem statement or a rough planning draft to **a product requirements document (PRD) → user stories → acceptance criteria**, writing and verifying each step in turn. It focuses only on planning artifacts *before* development starts, is not tied to any domain, and works on its own without other plugins.

When I [first introduced it in July](/en/posts/2026-07-12-product-spec-harness/), it was a five-phase harness that produced a PRD and user stories. A lot has changed since.

- Instead of one agent writing the PRD in a single pass, the PRD now goes through a **plan → design → critique loop**.
- An **acceptance criteria (Given-When-Then)** phase and a second verification were added after the user stories, taking it from five phases to seven.
- Where it used to show a review and stop, it now runs a **gap-filling Q&A before any document is written**.
- If the planning draft changes after the documents exist, a **regeneration path** updates only the parts the change touches.
- It now produces **exactly four files**.

This post walks through the current version from the start.

## ✍️ TL;DR

> **The moment an agent fills a blank in a planning document with a plausible number or policy, that invention becomes a requirement nobody agreed to — and it flows all the way into the code.** This harness asks about the blanks before writing, demands sources while writing, and doubts the links between documents twice after writing. Blanks that remain are not filled in; they are exposed as "needs confirmation."

## Why it ended up this way

### Ambiguity comes back as rework

Words like "fast," "easy," and "appropriately" leave implementers and QA with different interpretations, and the gap gets billed as rework late in QA or after release. In requirements engineering research, incomplete or hidden requirements are the most frequently cited problem (109 of 228 respondents in the NaPiRE survey, Méndez Fernández et al. 2017). So this harness spends more of its steps on **exposing what is missing before writing** than on writing.

### Agents don't leave blanks alone

Planning drafts rarely contain exception flows. Few of them answer questions like "What if the email is already registered?" or "What if the network drops?" Ask an agent to write a PRD, though, and it fills those spots with perfectly natural sentences: "If the email is a duplicate, guide the user to the sign-in screen." It reads well, but it is a product policy nobody agreed to. That sentence becomes a story, then an acceptance criterion, and finally code.

So the rule that runs through the whole harness is **no invention**. Numbers and policies that are not in the draft or in the user's answers are not filled in; they are left marked "needs confirmation." Showing the blanks is the harness's job. Deciding what goes in them is the product manager's.

## The overall flow

| Phase | What happens | Agent |
| --- | --- | --- |
| Phase 0 Problem definition | Build a five-field problem card: problem, target users, goals, constraints, success metrics | requirements-analyst |
| Phase 1 Readiness review | Diagnose whether the original draft is ready to start and produce a gap checklist | dor-evaluator |
| Phase 1.1 Gap-filling Q&A | Ask about unmet items one at a time before any document is written | (orchestrator) |
| Phase 2 PRD write-up | Run the plan → design → critique loop and finalize the PRD | prd-planner, prd-designer, prd-critic |
| Phase 3 User stories | Turn requirements into stories with a requirement coverage table | story-writer |
| Phase 4 First verification | Adversarially verify the link between PRD and stories | spec-reviewer |
| Phase 5 Acceptance criteria | Write Given-When-Then scenarios for each story (the final artifact) | acceptance-writer |
| Phase 6 Second verification | Adversarially verify the link between stories and acceptance criteria | spec-reviewer |
| Wrap-up | Regeneration path, saving the review, artifact summary | (orchestrator) |

Eight agents split the work and an orchestrator skill keeps the order. Every phase shows its output and moves on only after approval, and every file is previewed in full before it is written. It asks one thing at a time, interview-style, and attaches a plain one-line definition to jargon. DoR becomes "readiness review," INVEST becomes "six criteria of a good story," and Given-When-Then becomes "condition · action · result," each with the original term alongside — because product managers are the ones reading these documents.

### Three ways to start

At the start it looks at the input, picks one mode, and announces it in the chat.

- **Regeneration mode** — If documents already exist and you say "I've updated the draft, refresh the documents," it skips the full run and goes straight to the regeneration path. This is checked first.
- **Draft mode** — Given a planning draft, it extracts the problem definition from it and runs a readiness review before writing any document.
- **Interview mode** — Without a draft, it defines the problem one question at a time. With no original to evaluate, it skips the readiness review.

When the boundary is unclear it defaults to draft mode. An early version had a bug where it skipped the readiness review and went straight to the PRD even when a draft was provided, so in draft mode it now never skips the question "Shall I run a readiness review first?" The user only decides whether to *run* it.

## Before writing: readiness review and gap-filling Q&A

### Readiness review

The original draft is examined from five angles: a readiness gate that judges item by item whether work can start, a scorecard against the six criteria of a good story (INVEST), whether it can be written as condition · action · result, ambiguous wording, and whether the external contracts and dependencies it needs are named. Every failed item quotes the sentence in the draft it comes from.

Among the six criteria, **if Testable or Independent scores 0, the start is blocked regardless of the total.** A story you can't test has no definition of done, and a story that isn't independent can't even begin while it is tied to other undecided items. The overall verdict has three levels: ready, ready after fixes, or on hold.

The core of the result is the **gap checklist**. Met items are checked; under each unmet item is a "how to strengthen it" before → after example. For "fast and easy," for instance: "turn it into an observable criterion such as the number of input steps or a conversion rate — the threshold is for the planner to decide." The example shows the shape, never the value.

This review is the only place in the whole harness that assigns a score, and that score is valid only once, at the first evaluation. Re-scoring after the draft improves would make the difference between two scores read like a "maturity" level, and this harness does not produce such levels.

### Gap-filling Q&A: one at a time, skippable any time

Until early September, it showed the checklist and stopped there. Pointing out what to strengthen without giving the planner a place to answer meant the agent ended up guessing those blanks in the next phase anyway. So now, right after showing the checklist and **before writing any of the PRD, stories, or acceptance criteria**, it offers three choices.

1. **Answer one at a time** — It asks about each unmet item in turn, offering "skip" and "skip all" with every question.
2. **Proceed without filling gaps** — All unmet items are recorded as skipped and it moves on to the PRD.
3. **Fill gaps later** — Write the documents first, then fold changes in later through the regeneration path.

This question *replaces* the phase's original closing approval, so the number of approvals does not grow.

Answers are handled in exactly five ways. A real answer is stored verbatim as "answered" and it moves straight on — no interim summary, no "shall I continue?" "Skip," "don't know," or "later" is recorded as skipped without asking again. "Skip all" marks every remaining item as skipped. An ambiguous answer that doesn't pin down a value — "whatever you think," "same as the example" — gets exactly one clarifying question; if it is still ambiguous, it is recorded as skipped and the Q&A moves on. It never asks endlessly.

The key rule is that **a skipped item is never promoted to "addressed."** Skipped items flow into the PRD and acceptance criteria as "needs confirmation." Progress is shown only as counts: so many answered, so many skipped.

If even one item was skipped, it asks **right then** whether to save the review as a file. The skip record lives only in that file, so if saving were deferred to the end and then declined, the record would be lost. With no skips, it asks at wrap-up as before.

## The PRD: a plan → design → critique loop

The PRD is not written in one pass; three agents each own a set of sections.

### Plan: what, why, and how far

The planning agent writes the first three sections: background and problem, goals and success metrics, and scope (in/out). Two things are mandatory. First, **scope-out must be filled in.** An empty out-of-scope list makes everything look in scope, so neighboring features that could be confused with this scope are pinned there. Second, **success metrics must be observable.** Two different people looking at the same data must reach the same true/false conclusion, which requires a baseline, a target, and a measurement point. If those values are unknown, they are not invented; they go back as candidate questions.

### Design: product design, not technical design

The design agent writes the remaining three sections: core requirements, assumptions and risks, and milestones. "Design" here means **product design**, not technical design. Each of its twelve checklist items pairs "what to write" with "what not to write."

- Requirements are split one per sentence and numbered FR or NFR. These numbers become addresses later phases refer to.
- Non-functional requirements state an observable threshold for "how well," not *how* to achieve it (caching, indexing, async processing).
- States and transitions say "what is true for the user in each state," not which state library or implementation to use.
- Required information says "what we collect and what we show," not tables, columns, or types.
- Permissions are a roles × allowed actions table, not an authentication method or tokens.
- Exceptions cover at least five kinds: duplicate input, ineligibility, no permission, no data, and external delay or failure. Exception flows are almost never in the original, which makes them the easiest place for invention, so a missing rule is written as "not applicable — needs planning confirmation."

Each assumption is linked to the requirement numbers that would shake if it broke, and each milestone lists the requirements it contains along with an observable completion criterion.

### Critique: no power to edit, no power to block

The critique agent receives the current draft read-only and sweeps it through seven lenses: does the problem lead to the goals, is the scope boundary clear, are the metrics observable, are requirements fully and atomically broken down, are there gaps in exceptions, **does every number and policy have a source**, and were the readiness review's gaps and the Q&A answers actually absorbed. It raises nothing outside the lenses, drops findings that don't quote the original text, and caps each round at 12 findings. Dropped or truncated counts are always reported, because a silent cut reads as "everything was checked."

Each finding is classified by **how it can be resolved**.

- **A — resolvable inside the document.** Structure, duplication, numbering, wording. The owner of that section fixes it next round.
- **B — needs a fact only the user knows.** Numbers, policies, deadlines. It is not fixed; it stays "needs confirmation" and goes to the question queue.
- **C — out of this scope.** It suggests moving the item to assumptions and risks, and stops there.

**Treating a B as an A is exactly what invention is.** Without this classification, someone fills the blank with a plausible number in the next round.

The "blocking" grade can be given in only four cases: scope-out is empty, an unjudgeable success metric remains, requirement numbers are missing or duplicated or an in-scope item was never turned into a requirement, or an unsourced number or fact remains. All four can be judged yes/no from the document alone. The critique cannot invent new blocking reasons.

Closing this list has a cost. A critic, by its nature, rarely reports "zero defects," so if new blocks appeared every round the loop would never end. Closing the list guarantees termination, but in exchange **a serious defect that needs subjective judgment — like goals and requirements contradicting each other — tops out at "recommended fix."** It trades defect-catching power for a guarantee that the loop ends, and such items are pushed into the "top three recommendations" so they stand out.

And the critique has **no veto.** It cannot edit the document, and even with blocking findings left, if the user chooses to finalize, it finalizes immediately. Remaining findings are recorded under "known limitations" in a PRD appendix; they are never used to hold up progress or to ask for confirmation again and again. It flags the risk; the user decides whether to accept it.

After each round the user picks one of three: finalize as is, refine once more, or fix only specified items. The harness shows its recommendation along with the cost of each choice (how many agents get called again). If every remaining block is class B, it advises resolving them by questions or finalizing knowingly, since another round won't resolve them. When the same finding repeats in the same place, it stops recommending more rounds; if the user still asks for one more, it adds a single line of warning and complies.

The harness does not claim that this loop "improves PRD quality," because the drafter and the critic read the same context. The one thing it can honestly claim is this: **findings and how they were handled (applied, asked, accepted) are recorded in the document.** The round history is a record of change, not proof of improvement.

## Stories and acceptance criteria: each sentence in one place

### Stories don't contain acceptance criteria

User stories follow the "As a …, I want …, so that …" form, each with a self-check against the six criteria and a note of which requirements it covers. An important change here: stories used to carry their own acceptance criteria (Given-When-Then), but now **the stories document contains no condition · action · result sentences.** Instead it leaves a hand-off note such as "this story must cover the duplicate email, invalid format, and network failure flows."

The reason is simple. If the same sentence lives in two documents, there are two "definitions of done," and the moment only one gets edited, nobody can tell which is right. So acceptance criteria sentences live only in the acceptance criteria document.

### Acceptance criteria are the final artifact

The acceptance criteria agent writes scenarios for each story. Each criterion carries one concern, and its Then must let a third party judge pass or fail by observation. Sentences like "it works well" or "it guides the user appropriately" are forbidden.

Criteria that cover only the happy path are treated as incomplete. Each story is checked against six flows: happy path; edge (min/max, concurrent requests, duplicate submission); error (external failure, validation failure); empty state (zero items); permission (signed out, no permission, expired session); and state transition (reprocessing something already done, double clicks). Flows that don't apply are written as "not applicable — reason," making them deliberate exclusions rather than omissions. Here too, policies are not invented to fill the flows. Most bugs leak through exception flows, but deciding the right answer for them is a planning decision.

## Four checks, four different questions

Four phases of checking sounds like the same findings would repeat, but four checks doing the same job would be a failed design, so each has its own target and question.

| Phase | What it reads | Question it asks |
| --- | --- | --- |
| Phase 1 Readiness review | The original draft from the user | Is what we received ready to start? |
| Phase 2 Critique | This round's PRD draft | Is the plan we wrote sound on its own terms? |
| Phase 4 First verification | Between the finalized PRD and the stories | Do the requirements and stories match? |
| Phase 6 Second verification | Between the stories and the acceptance criteria | Can we judge each story as done? |

The first verification uses a requirement ↔ story table to find requirements without stories, plus violations of the six criteria, inconsistencies among goals, requirements, and stories, and sentences that can't be judged. It does not check whether acceptance criteria are observable — they don't exist yet. The second verification looks at the story ↔ criteria link for missing items and orphans without a source, checks observability, single concern, and flow coverage, and mines for missing scenarios.

Neither verification offers compliments, and when recommending fixes both **prefer adding before overturning existing items.** Filling gaps while keeping what was already agreed is cheaper. Findings an earlier phase already raised are not brought up again without new evidence.

## After writing: refreshing only what a change touches

If you skipped items in the Q&A or chose "fill gaps later," the draft will eventually get filled in. Re-running everything from scratch at that point would change sentences already agreed on. So I added a regeneration path. It doesn't add new phases; it calls the existing ones again **only on a specified scope**.

### Decide what to re-run first

Each change gets one of four labels, and the user approves the re-run scope before anything happens.

- **R-A** — Requirements are added, removed, or change meaning; scope in/out changes; goals or metrics change; stories must be added, split, or removed. It revisits PRD → stories → acceptance criteria.
- **R-B** — An exception-flow policy or number is newly decided or changed. Only the PRD's exception rule rows and the acceptance criteria are updated.
- **R-C** — Only the wording of background, assumptions and risks, or milestones changes. Only the PRD is updated.
- **R-0** — Something like an owner or schedule note with no place in the documents. It is only logged.

When the boundary is unclear it **moves up a label.** Misjudging low leaves omissions silently; misjudging high only costs effort.

### Get back only the changed blocks

When called again, the story and acceptance criteria agents run in "delta mode." They receive the full existing document, the scope to change, and the original wording of the update, and return **only the changed blocks**. Asking for a full rewrite would silently change sentences outside the scope. The orchestrator splices the returned blocks into the existing document at the right places, and before writing it shows a full preview again with a change summary on top. If an agent decides stories need to be reorganized, it doesn't do so on its own; it returns a proposal for approval.

### Numbers are addresses

Requirement, story, and acceptance criteria numbers (FR, US, AC) are **addresses** other documents and tickets point to, so they are never renumbered during regeneration. New items get numbers after the largest ever used (including deleted ones), and deleted numbers stay empty and are never reused. This has a cost. When a story is split or removed, the leading digit of an acceptance criterion's number may no longer match its current source story. So the current source is read from the source note on each criterion and the link table, not from the number. It gives up the convenience of guessing the source from a number in exchange for addresses that never move, and the regeneration report says so.

### Verify in pairs, and make repetition end

After an update, it mechanically cross-checks numbers to make sure no requirement lost its story and no criterion lost its source. But that is only the orchestrator's self-report, not verification, so it never replaces the first or second verification. Instead, **if either side of a pair changed, that pair's verification runs again.** If the PRD or the stories changed, the first runs; if the stories or the criteria changed, the second runs. The scope narrows to what changed and what it knocked out of alignment, but widens to everything if a requirement was deleted, scope in/out changed, or the user asks.

Endless loops are blocked too. The harness proposes a regeneration on its own only once per session, and if an update is identical to the previous regeneration or doesn't differ from what was already recorded, it doesn't run and just reports "this input won't change anything further." Conversely, **there is no limit on regenerations the user asks for.** What gets blocked is the harness repeating itself, not the user's requests.

## Only four files

The harness produces four files: the PRD, the user stories, the acceptance criteria, and — if you choose to save it — the readiness review. Regenerating many times doesn't add more.

It used to be possible to save the adversarial verification reports as files too. But as reports piled up, it became unclear **which file was the agreed artifact.** Verification is feedback for refining the artifacts, not an artifact in itself, so the reports are now shown only in the chat and their findings are absorbed into the relevant documents. Critique and regeneration history is kept in a PRD appendix.

## Honesty principles

- **No scores, percentages, or maturity levels.** The only exception is the six-criteria scorecard and three-level readiness verdict for the original draft, and even those are not re-scored after fixes. Instead of a coverage rate it writes counts, like "k of n requirements uncovered."
- **No promised effects.** It never claims things like "the critique loop cuts rework by N%," because that was never measured.
- **No invented numbers or examples.** When it cites evidence, it includes the source grade and counter-evidence.
- **No overstated absorption.** In a session where the user declined to fill gaps, it does not write that "feedback was absorbed into the documents."
- **Known limits are not hidden.** Because the review file is saved only on request, declining to save loses the item-level skip history; and because numbers are frozen, acceptance criteria numbers can drift from their current source. Both are written down.

## How to use it

### Install

```bash
# One-step install (Claude Code 2.1.275+)
/plugin install product-spec-harness --marketplace seungahhong/seungah-claude-plugins

# Or register the marketplace first, then install
/plugin marketplace add seungahhong/seungah-claude-plugins
/plugin install product-spec-harness@seungah-claude-plugins
```

### Invoke

Call it with the slash command or ask in natural language.

```text
/product-spec-harness:product-spec
```

```text
Let new users sign up with email. Signup should be quick and easy,
and they should be able to look around the service right after. Make a PRD and user stories from this.
```

It also triggers on requests like "write a PRD," "derive user stories," "turn the acceptance criteria into Given/When/Then," or "I've updated the draft, refresh the documents." It does not trigger for UI implementation, technical design, writing code, or requests to only review documents that are already finished.

### 1. Check the problem card

It extracts the five fields from the draft and asks only about the empty ones.

```text
## Problem definition card
- problem: Signup is tedious, so new users drop off before their first experience
- target_users: New visitors who want to look around before paying
- goals: (business) higher signup conversion / (user) quick, low-effort signup
- constraints: (undecided — needs confirmation)
- success_metrics: (undecided — needs an observable definition)
```

### 2. Readiness review and gap-filling Q&A

After showing the checklist, it asks how to fill the gaps before writing anything.

```text
The PRD, user stories, and acceptance criteria have not been written yet. Do you want to fill gaps in the draft first?
(1) I'll answer one at a time (recommended)
(2) Proceed as is, without filling gaps
(3) Fill gaps later
```

Choosing (1) brings one question per unmet item, like this:

```text
[Gap 1/3] Checklist item: "Edge, error, empty-screen, and permission flows are described beyond the happy path"
  Current: not described
  ↳ Example: one line each on what to show for "email already registered / invalid format / network failure"
If you've decided anything, please write it here. ('skip' / 'skip all')
```

### 3. Choose at each PRD round

The critique results come with options.

```text
[Phase 2 · Round 1] Findings {blocking 1 / recommended 1 / note 0}
Recommended: (1) — every remaining block needs a value only you know, so more rounds won't resolve it
(1) Finalize as is  (2) Refine once more  (3) Fix only specified items
```

On finalizing, it shows a full preview and then writes the PRD file. Stories → first verification → acceptance criteria → second verification proceed the same way, with approval at each step.

### 4. The output

```text
.claude/_docs/<plan slug>/
  PRD.md
  user-stories.md
  acceptance-criteria.md   # the final artifact
  product-spec-review.md   # only if you choose to save it
```

### 5. If you fill the gaps later

In the same session or a later one, saying something like this enters the regeneration path:

```text
I've updated the draft, refresh the documents. Duplicate emails go to the sign-in screen, and network failures show a retry button.
```

The harness shows a table of labels and re-run scopes for each change, gets approval, and updates only the documents it touches.

## How it changed over time

| Date | What changed |
| --- | --- |
| 2026-06-13 | Created — A four-phase interactive harness producing a PRD and user stories |
| 2026-06-17 | Draft input, built-in pre-writing readiness review, fix for the review being skipped |
| 2026-06-21 | Plain-language terms for planners, new checklist format, outputs moved to a per-plan folder |
| 2026-09-02 | PRD via the plan → design → critique loop; unified requirement and story numbering |
| 2026-09-02, 09-03 | Acceptance criteria phase and second verification (seven phases), single home for criteria sentences, output fixed at four files |
| 2026-09-04 | Pre-writing gap-filling Q&A, post-writing regeneration path, frozen numbers |
| 2026-10-18 | Shorter skill description; regeneration path split into its own reference doc |

Looking back, most changes went in two directions. One was **blocking the paths by which blanks get filled with inventions** (resolution classes, keeping skips as skips, source audits, delta mode). The other was **making sure every loop ends** (a closed list of blocking reasons, no veto, stall guards, regeneration end conditions). The two often collided, and each time I chose to write down what was given up.

## Wrapping up

Letting an agent write planning documents is fast and smooth. The trouble is that the smoothness hides the blanks. This harness actually makes documents less smooth: "needs confirmation" shows up here and there, critique findings stay in an appendix, skipped items stay on record. But I think facing the blanks at the planning stage is far cheaper than hearing "who decided this policy?" after development has started.

The acceptance criteria produced here are what [test-layering-harness](/en/posts/2026-11-22-test-layering-harness/) takes and turns into layered tests. Criterion numbers go straight into test titles, so the decision to freeze numbers as addresses carries all the way into the tests.

## References

- [product-spec-harness (GitHub)](https://github.com/seungahhong/seungah-claude-plugins/tree/main/plugins/product-spec-harness)
- Earlier posts — [Product Spec Harness (product-spec-harness)](/en/posts/2026-07-12-product-spec-harness/) · [From Acceptance Criteria to Layered Tests — test-layering-harness](/en/posts/2026-11-22-test-layering-harness/)
