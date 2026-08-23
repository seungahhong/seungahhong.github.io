---
layout: post
title: How the Creator of Claude Code Works — Delete, Overshoot, Verify
date: 2026-08-22
published: 2026-08-22
category: Development
tags: ['AI', 'Claude', 'agent', 'verification', 'harness']
comments: true
thumbnail: './assets/22/thumbnail.png'
github: ''
---

# 1. What is this post about?

In one line:

> **Getting good with agents is not about writing better instructions. It is about deleting the instructions you have and building a grader instead.**

By **grader** I mean a command the agent can run by itself to learn pass or fail — a type check, a test suite, a screenshot diff. The word shows up throughout this post, so let's pin it down first.

At Y Combinator Startup School 2026, Diana Hu interviewed Boris Cherny, the creator of Claude Code. What went viral were the war stories: "a codebase rewritten into another language in 11 days," "a task that has been running alone for two weeks," "thousands of agents spawned."

But **war stories are outcomes, not methods.** This post unpacks the other side — the conditions and habits behind those outcomes — at a size a junior developer can actually copy.

The previous posts came in this order. [FE harness](/en/posts/2026-06-04-fe-harness/) — how to build the tooling → [self-healing harness](/en/posts/2026-07-05-meta-harness/) — how to make it fix itself → [context engineering by subtraction](/en/posts/2026-07-31-context-engineering-claude5/) — what to take out → [choosing a Claude model](/en/posts/2026-08-01-choosing-claude-model/) — where to run it. This one is about **the daily habits of the person using that tooling.**

## The skeleton — three moves

Only three moves run through the whole interview. Everything else is an application of them.

```markdown
① Delete     strip the instructions that now get in this model's way
② Overshoot  hand over work that looks slightly too big, and don't dictate the how
③ Verify     give it a way to find out it is wrong  ← the one most people skip
```

If ③ is missing, ①② are just an accident waiting to happen. Delete your instructions with no grader and you lose control; hand over hard work with no grader and **the longer it runs, the further off course it goes.**

---

# 2. First, coordinates — the model and the harness are different layers

Before the main argument, one layer split. This is where the most common attribution error happens. When results are bad we **blame the model, but the thing that read your files and ran your commands was not the model.**

```markdown
my prompt
    │
    ▼
┌─ harness (Claude Code) ────────────────────────────────
│  system prompt · tool descriptions · CLAUDE.md   re-read every request
│  permission checks · hooks                       run regardless of the model
│           │  all of the above is handed over
│           ▼
│      [ model ]  ← all it does is continue text
│           │
│           └──▶ feed the result back in (the loop)
└────────────────────────────────────────────────────────
    │
    ▼
the answer you see
```

A **harness** is the whole program wrapped around the model. Think of Vitest — you write the test functions, but the runner decides what order they run in and what counts as passing. The model and Claude Code relate exactly that way. It is why the same model can look completely different in ability under a different harness.

And the harness can interfere in two directions. **Hobbling** is when the model could do it but your setup blocks it (permissions refuse an edit, so it keeps printing diffs instead). **Product overhang** is when the model could do it but nobody built a surface to ask for it — like bumping a library version while nobody reads the changelog, so the whole team keeps hand-rolling what already ships. In short: **when results are bad, suspect your harness before the model.**

---

# 3. Move ① — Delete

Claude Code strips a large part of its system prompt every time a new model ships. For Opus 5 they deleted 80% of it. That fact was already covered in [context engineering by subtraction](/en/posts/2026-07-31-context-engineering-claude5/), so here we only look at **how** the deleting is done.

Start with the criterion. You don't delete things because they are long.

> Much of what was in the system prompt was **correcting for behavior the model should have known but didn't.** The current model just does it.

So what you may delete are the **lines written to fix the model**, and what you must keep are the **facts the model cannot know**. Running my own blog repo's `CLAUDE.md` through that criterion splits it like this.

| The line in the file | Verdict | Why |
| --- | --- | --- |
| "Don't delete test code on your own" | ❌ Delete candidate | Written to correct a model defect — today's model won't do it unprompted |
| "Run `pnpm lint` before committing" | ➡️ Move to a hook | This needs **enforcement**, not a request |
| "Deploy path is `develop` → `master` → `gh-pages`" | ✅ Keep | A project fact no amount of reasoning recovers |
| "Tag pages use a query-based filter" | ✅ Keep | **Why** that exception exists is written nowhere in the code |

The **hook** in row two is a command the harness always runs at a fixed point, such as before or after a tool call. A prompt is probabilistic; a hook is deterministic — if "always do X" really has to mean always, move it out of your docs and into a hook (the config format changes between versions, so check hooks in the `claude` docs). And there is exactly one condition for putting a deleted line back.

> Put it back **only when you watch it trip on the same thing repeatedly.** Don't do it too early. That instruction gets re-read **every single time** you use the tool.

## Ablation — deleting is measurement, not tidying

The method has a name. **Ablation** — you remove a component on purpose and measure its contribution by how much worse the result gets. Drop one dependency, and if the build still passes, it wasn't needed. The point is that the goal is **measurement, not tidying.** Deleting, running once, and going "seems fine" is not ablation; it's just deletion.

The interview suggests wiping your `CLAUDE.md`, skills, and hooks every six months. Doing that verbatim on a team repo is an incident. Do it in a personal repo, in a state you can roll back.

```markdown
① branch off          git switch -c ablation/claude-md
② move it all out     mv CLAUDE.md CLAUDE.md.bak
③ use it for a week   don't fix anything, just log to notes/stumbles.md
④ restore one line    only for what tripped twice or more
⑤ compare             diff CLAUDE.md.bak CLAUDE.md
                      → lines you never restored = context wasted this generation
```

For what it's worth, the current version (2.1.241) really does ship experiment switches.

```shell
claude --system-prompt "..."   # swap the whole system prompt
claude --bare                  # CLAUDE_CODE_SIMPLE=1 — also disables hooks, auto-memory, CLAUDE.md discovery
```

Note that `--bare` ignores subscription login and only reads `ANTHROPIC_API_KEY` — if you are on a subscription, the `mv` route above is easier. Flags change between versions, so check `claude --help` first, and **do not build a team workflow on top of them.**

---

# 4. Move ② — Overshoot

The second habit is **handing over work that looks slightly too big, without dictating the method.**

The most common mistake the interview names is over-specification — the textbook form of the **hobbling** described above. And it is called out as a failure mode that gets **worse the more experience you have.** Older systems had to be built that way.

**Before (nailing down the steps):**

> First open `posts.ts` and find `getAllPosts`, add a parameter there, then change the props in `PostCard.tsx`, then…

**Now (three lines):**

> **Task** — fix the bug where the tag filter goes out of sync with the URL query and the back button.
> **Guardrails** — static export must not break. Keep the existing route structure.
> **Exit criteria** — done when `pnpm test && pnpm typecheck && pnpm build` all pass.

Task, the lines not to cross, and what counts as done. Give those three and step back. Which file gets changed in which order is **not yours to decide.** The moment you nail down the sequence, the size of the solution you already know becomes the ceiling.

## Not incapable — just unwired

The most practical moment in the interview isn't the war story but what came before it. That famous two-week task started not with a big prompt but with two yes/no questions. "Can you reach a macOS runner?" → no → wired it up. "Can you reach this repo?" → no → wired it up. The actual instruction came third.

When an agent says it can't, a good share of the time it isn't ability — it's **wiring.** So put one line in front of your big prompt: "First confirm you can actually reach everything you need, report it as a table, and don't start if something is missing."

That said, wiring up access is not the same as handing over anything. Read-only tokens, personal repos, and local runners are what you wire up; production credentials and deploy keys are not. People repeat that "models don't fall for prompt injection anymore," but the interview's own phrasing is **"we can no longer demonstrate it"** — an empirical statement, and one that describes three stacked layers (alignment training + an injection classifier on all traffic + an auto-mode classifier), not the model alone. **Failing to reproduce something is not proof it's impossible.**

---

# 5. Move ③ — Verify

This is the real core of the interview. Asked what people get wrong, the single most important item named is not the prompt.

> **Verification is probably the single most important thing that people do not get right.**
>
> "The verification is probably the single most important thing that people do not get right, largely."

What matters here is that the purpose of a verification tool isn't quality. The purpose is **not getting stuck.** With a way to check itself, it keeps going without anyone watching.

| | No grader | With a grader |
| --- | --- | --- |
| 5 minutes in | nobody knows yet whether it's right | the first failure is already recorded |
| 1 hour in | a human has to stay attached | it proceeds alone |
| A day in | too far gone to unwind | the direction converges |

**The gap widens with time** — that's the whole point.

## Why 11 days was actually possible

Start with the story everyone quotes. Bun (a JavaScript runtime used instead of Node.js) had its codebase moved wholesale from Zig to Rust in 11 days, and it's in production now. A human would have needed over a year.

But what the interview stresses isn't the model.

> The nice thing about Bun is that **it is very, very well tested.** There is a big test suite in Bun, and a big test suite in Node.js. So it is easy to know if you did the right thing.

Because Bun targets Node compatibility, **Node's test suite could be borrowed as a grader too.** It worked because the grader existed first — throw the same prompt at a codebase you can't verify and this result does not appear. It also wasn't one shot; he corrects himself immediately to say there was steering along the way.

The second example is even more on the nose. Here is the instruction given for rewriting the Electron desktop app in Swift.

```markdown
rewrite the Electron app in Swift → run it in a Mac VM
  → take a screenshot → compare it to the Swift version pixel by pixel
  → don't stop until you're done
```

Here, **run → screenshot → pixel compare** is the grader, whole. Notice that half the prompt is spent not on "what to build" but on "what to judge it with." And note that at the time of the interview this task was **still running**, past the two-week mark.

## The one question to answer before writing the prompt

So the practical guidance gets very simple. Before writing a prompt, answer this.

> **What can the agent run to find out it is wrong?**

If there's no answer, building one is today's work. Remember three, cheapest first. **① types and lint** (start here if you have none) → **② a failing test** (nail down what must change as a red light first) → **③ output comparison** (screenshots, snapshots, benchmarks — let the machine look at what you would have eyeballed).

Then bake the loop into the prompt.

```markdown
work → run the verify command ─┬─ pass → next step
                               └─ fail → fix the cause → run again
                                          │
                     same failure 3× ─────┘→ stop and report
```

That last line matters. **If you don't set a stopping rule before you start,** a verification loop only grows the bill. And one thing to leave honestly open — a verification loop catches **functional regressions only.** No green light adjudicates design debt or security, and how a human should review a large agent-authored change went unanswered in the interview.

---

# 6. Multiplying the three moves — repetition and orchestration

That covers the individual habits; the machinery that multiplies them shows up later in the interview. Knowing the names is enough.

| Machinery | What it does | Familiar analogy |
| --- | --- | --- |
| **Dynamic workflow** | splits **one** big job into stages and fans agents out per stage | a CI matrix job that fans out and regroups at the next stage |
| **loop** | repeats the same job **on a schedule** (on your machine) | a local cron |
| **routine** | repeats the same job **on a schedule** (in the cloud) | a nightly GitHub Actions schedule |

Each repeated run starts with a fresh conversation context (memory may be shared, per the interview). So anything that truly has to carry over is safer **left outside** — in files, issues, or PRs.

Anthropic reportedly runs 20–30 of these routines a day just to maintain its own codebases: finding dead code and opening deletion PRs, cleaning up experiments already at 100%, adding tests where coverage is thin, deleting tests that stopped being useful, and unifying near-duplicate abstractions scattered across the code (the routine he thinks they "called abstraction police").

The size a junior should take from that is **one, in a personal repo.**

```markdown
prompt — "Find code in this repo that nothing references, delete it, and open a PR
          if tests and typecheck pass. For anything you're unsure about, don't
          delete it — just list it in the PR body."

rules  — ① PRs only (never commit straight to the default branch)
           ② read every PR yourself the first week and track the false-positive rate
           ③ add a second routine only once that's boring
```

20–30 is **the number you get with a team to absorb the reviews and internal infrastructure.** Push bot PRs into a team repo without agreement and you've moved the time you saved onto your colleagues' review queue — technically a success, socially a failure. And a cron that runs daily bills daily.

---

# 7. Easy things to get wrong

## Misreading 1 — "11 days, thousands of agents… am I supposed to do that?"

No. The 11-day rewrite wasn't one shot — a human steered it along the way, and the decision to try the rewrite and define the test suite came from an engineer on the Bun team. "Thousands" isn't a confirmed number either; it's his own guess. **Agent count is not a performance metric, it's an invoice.** On a personal plan, scale 11 days down to a few hours and set your stopping rule first.

## Misreading 2 — "Coding is solved"

"Coding is solved" is something the host brings in as **a past remark of his**, and he answers the question by leading with a caveat.

> Coding is solved **for the kind of coding I do.** It is not solved for everyone.

The unsolved areas he names are deep systems codebases, distributed systems, and pixel-level UI verification. A good share of junior work overlaps exactly those.

## Misreading 3 — "So I should just delete everything"

Deleting is only step one. The whole procedure is **delete → use → restore only what repeatedly trips it.** And the observation that the model looks slightly smarter with all prompts removed comes with an immediate caveat — as a product, some prompts are kept on purpose so it **behaves the way a person using it would want.**

## Misreading 4 — "So there's a trick only the pros know"

This is the part the interview rejects most directly.

> Everyone is looking for **the one weird trick.** It doesn't exist.

And that principle applies to the interview itself. It is one company, one stack, one person's observation — not controlled evidence. **Copy the procedure, not the conclusions** — run it, watch where it gets stuck, fix only that.

---

# 8. Wrapping up — what to delete and what to build

Compressed into one table:

| | What | Why |
| --- | --- | --- |
| **Delete** | instructions written to fix the model | they cost you on every request and get in today's model's way |
| **Overshoot** | task, guardrails, exit criteria — not the method | nailing the sequence caps you at the solution you already knew |
| **Verify** | a command that tells it that it's wrong | without it, the longer it runs the further off course it goes |

And this is the next slot in the same story as the earlier posts.

- [FE harness](/en/posts/2026-06-04-fe-harness/) — **building** the harness
- [Self-healing harness](/en/posts/2026-07-05-meta-harness/) — the **loop** that fixes itself
- [Context engineering by subtraction](/en/posts/2026-07-31-context-engineering-claude5/) — **removing** context
- [Choosing a Claude model](/en/posts/2026-08-01-choosing-claude-model/) — **picking** the model
- This post — **measuring** what was actually needed

The core message is one sentence.

> **What you delete are the instructions written to fix the model. What you build is the command that lets the model find out it is wrong.**

One last thing. At the end of the interview, asked what students should still learn by hand, the answer was not 'instead of computer science' but **'in addition to** computer science' — learn to apply it, not just know it: design sense, business sense, data science, talking to users. Handing your code to an agent is fine. But **the moment you hand over the judgment of whether the result is any good**, everything else in this post collapses. Building a grader is itself an act of that judgment.

---

# References

- Y Combinator, [Boris Cherny: We Cut 80% of Claude Code's Prompt](https://www.youtube.com/watch?v=qyPCVqFUyDo) (2026) — video
- Root Access, [Boris Cherny: Building Claude Code](https://www.ycrootaccess.com/p/boris-cherny-building-claude-code) (2026) — full transcript
- Anthropic, [Claude Code documentation](https://docs.claude.com/en/docs/claude-code) — flags and features vary by version; check `claude --help`
- Previous posts — [Context engineering by subtraction](/en/posts/2026-07-31-context-engineering-claude5/) · [Choosing a Claude model](/en/posts/2026-08-01-choosing-claude-model/) · [Self-healing harness](/en/posts/2026-07-05-meta-harness/)
