---
layout: post
title: The New Rules of Context Engineering for Claude 5
date: 2026-07-31
published: 2026-07-31
category: Development
tags: ['AI', 'harness', 'Claude', 'context-engineering']
comments: true
thumbnail: './assets/31/thumbnail.png'
github: ''
---

# 1. What Is This Post About?

Here it is in a single sentence.

> **The conventional wisdom that "the more rules you write for the AI, the better it performs" has been overturned.** Anthropic deleted **more than 80%** of Claude Code's system prompt, and coding evaluation scores did not drop.

In previous posts I covered how to **build a harness well** ([Frontend Harness Engineering](/en/posts/2026-06-04-fe-harness/)) and how to **make it fix itself** ([Self-Healing Harness](/en/posts/2026-07-05-meta-harness/)). This post runs in the opposite direction: **what to take out of a harness.**

## What We've All Been Doing

Anyone who has worked with a harness has walked this path.

```markdown
The AI makes a mistake
   → add one line to CLAUDE.md: "don't do this"
   → it makes the mistake again
   → add the same line to SKILL.md too
   → add it to the tool description as well, just in case
   → ...three months later, CLAUDE.md is 400 lines long
```

Adding rules feels immediately reassuring. "It's written down now, so it won't get it wrong." But as rules accumulate, so do **sentences that contradict each other.** Here is a case Anthropic actually found.

| Where it was written | What it said |
| --- | --- |
| System prompt A | "leave documentation as appropriate" |
| System prompt B | "DO NOT add comments — one short line max" |

Each sentence is reasonable on its own. But **read together**, the model has to compute "which one applies right now?" every single time. That computation is the cost.

## What Changed

The core reason is simple: **the model got better.** The Claude 5 generation (Opus 5, Fable 5) can look at the surrounding context and decide for itself. So spelling out every answer in advance now works against it.

Looking at the actual rewritten sentence makes it click.

**Before (nailed down as a rule):**

> "In code: default to writing no comments. Never write multi-paragraph docstrings or multi-line comment blocks — one short line max."

**After (left to judgment):**

> "Write code that reads like the surrounding code: match its comment density, naming, and idiom."

The second is shorter yet covers more situations. The first can't handle the exception "editing a legacy file that is densely commented"; the second handles it on its own.

---

# 2. Six Rules Got Flipped

Anthropic laid out six shifts. Let's walk through them.

| # | Before (Claude 4 era) | Now (Claude 5 generation) |
| --- | --- | --- |
| 1 | Give explicit rules | Let it apply judgment |
| 2 | Attach usage examples | Design better tool interfaces |
| 3 | Load everything you might need upfront | Progressive disclosure |
| 4 | Repeat important things in several places | Write it in exactly one place |
| 5 | Save what to remember in CLAUDE.md | Rely on auto-memory |
| 6 | Leave markdown plans | Leave rich references (code, HTML) |

## Rule 1 — "Judgment" Instead of "Instruction"

The test for whether to write a rule down is simple.

- **Things the model can infer from its surroundings** → don't write them. (indent width, comment style)
- **Things it cannot infer no matter how much it reads** → write them. (e.g. "this repo is a static export, so server APIs are unavailable")

Writing the former creates noise; omitting the latter creates incidents.

## Rule 2 — "Interfaces" Instead of "Examples"

We used to bolt piles of usage examples onto tool descriptions. Now **naming parameters and describing them well** is more effective — and **enumerating the choices** (an enum) beats ten examples.

```markdown
[ Example-driven ]                 [ Interface-driven ]
"Use it like this:                 depth: 'shallow' | 'medium' | 'deep'
  search(q, 'deep')                      ↳ how deeply to explore
  search(q, 'shallow')
  ... (8 more examples)"           One line, and every valid value is visible
```

Examples leave you asking "but what about this case?" An enumeration doesn't.

## Rule 3 — Don't Load It All; Let It Be Fetched

**Progressive disclosure** is the central idea in this shift. Instead of pushing every piece of information into context from the start, information is **loaded at the moment it becomes relevant.**

| Mechanism | When it loads | Cost |
| --- | --- | --- |
| CLAUDE.md body | **Always**, at session start | Paid on every request |
| Skill | Only for related work | Paid only when used |
| Deferred tools | Only once searched for | Paid only when used |

One practical rule falls right out of this: **keep only what's needed almost every time in CLAUDE.md, and move the occasional stuff into Skills.**

## Rule 4 — Stop Repeating Yourself

We used to write important instructions in the system prompt, in the tool description, *and* in CLAUDE.md. It felt like a safety net. But repetition creates two problems.

1. **You pay for the tokens three times** — the same sentence is read in three places.
2. **You miss one when you update it** → and that's the moment a **contradiction** is born.

The current recommendation is **"put it in the tool description only"** — the one place guaranteed to be read when that tool is used.

## Rule 5 — CLAUDE.md Is Not a Notepad

We used to hit `#` to say "remember this" and have it appended to CLAUDE.md. Now **auto-memory** saves contextually relevant things on its own, which narrows CLAUDE.md's job.

| Nature of the information | Where it belongs |
| --- | --- |
| Gotchas in this repo (why the build breaks) | CLAUDE.md |
| The team's opinions and know-how, per task type | Skill |
| The individual user's preferences and history | Auto-memory |
| Deep supporting material | References (@mentions) |

## Rule 6 — Something Executable Beats a Plan Document

Instead of describing "what to build" in markdown prose, leave it in a **more precise form.**

- A test suite → pass/fail is unambiguous
- A spec written as code (types, signatures) → little room for interpretation
- A rubric → the quality bar is explicit
- An HTML artifact → no need to describe a screen in words

Prose is interpreted differently by every reader. Types and tests are not.

---

# 3. So Where Does Each Thing Go?

Let's put it together. Context is assembled from four places, each with a distinct job.

```markdown
┌─ System prompt ───── The product's own context. Users rarely touch it.
│                      (If you build a custom agent, this is the crux.)
│
├─ CLAUDE.md ───────── Only this repo's "gotchas." Keep it light.
│                      Split long verification procedures into Skills.
│
├─ Skill ───────────── Team opinions and know-how. Loads only when relevant.
│                      If long, apply progressive disclosure inside it too.
│
└─ References ──────── Link deep material via @mentions.
                       Prefer code-based specs over prose descriptions.
```

## A CLAUDE.md Diet Checklist

Re-reading my own blog repo's `CLAUDE.md` against this standard, the deletion candidates jumped out immediately.

| Type of sentence | Verdict | Why |
| --- | --- | --- |
| "`src/components/` holds React components" | ❌ Delete | The directory name already says it |
| "We use TypeScript strict mode" | ❌ Delete | Open `tsconfig.json` and you know |
| "Static export means tag pages use query-based filtering" | ✅ Keep | **Not knowing this causes bugs** |
| "Without `public/.nojekyll`, `_next` gets ignored" | ✅ Keep | A textbook repo gotcha |
| "Commit messages should be written like this, and..." (20 lines) | ➡️ Move to Skill | Only needed when committing |

The criterion collapses into one question: **"If I don't write this, will the AI get it wrong?"** If not, it can go.

## Getting Diagnosed Automatically — `/doctor`

If judging this yourself feels like a burden, there's a tool for it. Claude Code's **`/doctor`** (`claude doctor` from the CLI) inspects the size of your Skills, CLAUDE.md, and system prompt and helps rightsize them. If the [self-healing harness](/en/posts/2026-07-05-meta-harness/) from the previous post was "watch a mistake, then **add** a rule," `/doctor` is the automation of the opposite direction — **taking things out.**

---

# 4. Easy Things to Get Wrong

It would be unfortunate if this post read as **"get rid of your harness."** Let me be precise about a few things.

## Misreading 1 — "So I can delete CLAUDE.md?"

No. **Shrink it, don't scrap it.** Repo-specific traps stay invisible to the model no matter how good it gets. Why `.nojekyll` is necessary won't emerge from reading every file in the project.

## Misreading 2 — "Should things that must be enforced also be left to judgment?"

This is the same distinction I drew in the previous post. **What you leave to judgment and what you block mechanically are different things.**

| Nature | Where it belongs | Effect of this shift |
| --- | --- | --- |
| **Must be blocked, always** (dangerous commands) | hook · permission | None. Still blocked by machinery |
| **Requires judgment** (style, trade-offs) | Guidance in docs | **Shrink it.** The model can judge |
| **Repo-specific facts** (build traps) | CLAUDE.md | Keep |

"Cut your rules" is **not a statement about the third row.** And enforcement never came from documents in the first place — it came from hooks.

## Misreading 3 — "Does this apply to every model?"

No. What Anthropic removed was the system prompt **for advanced models like Claude Opus 5 and Fable 5.** If you're running a smaller model, explicit instructions still earn their keep. **A harness is tuned to the model** — it isn't written once and left forever.

---

# 5. Applying It in Practice

Applied to my own repo, the order would be this.

```markdown
① Find contradictions   Look for sentence pairs that say different things
                        about the same topic → always merge into one (top priority)

② Delete the obvious    Remove facts you'd learn by opening the file

③ Split out the rare    Move procedures needed only at specific moments —
                        deploy, commit, release — into Skills

④ Rules → principles    Replace several "don't do X" lines with one
                        "match the surroundings"

⑤ Verify                Run a few ordinary tasks and check quality holds
                        → if it drops, revert just that item
```

Step ⑤ matters. **Removal needs verification too.** It's the same reason the self-healing harness from the previous post checked consistency, body cost, trigger accuracy, and generalization all at once before adopting a patch. If it got shorter *and* worse, that isn't an improvement.

## Questions to Confirm You Actually Trimmed

| Question | Passing answer |
| --- | --- |
| Is the same instruction in two files? | It shouldn't be |
| If I delete this sentence, does the AI get it wrong? | If "no," delete it |
| Is this procedure needed every session? | If "no," move it to a Skill |
| Can this explanation be replaced by code? | If yes, use code |

---

# 6. Wrapping Up — Where Harnesses Are Headed

Read alongside the previous two posts, the arc becomes visible.

| Stage | Question | Direction | Post |
| --- | --- | --- | --- |
| **Stage 1** Build | What should I write down? | Adding | 2026-06 [FE harness](/en/posts/2026-06-04-fe-harness/) |
| **Stage 2** Self-healing | How do I fold mistakes back in? | Adding (with approval) | 2026-07 [meta-harness](/en/posts/2026-07-05-meta-harness/) |
| **Stage 3** Pruning | What should I take out? | **Subtracting** | This post |
| **Stage 4** Balance | How do I move both ways automatically? | Both | Ahead |

Stages 1 and 2 grew the harness; stage 3 is the first move in the **opposite direction.** And the two aren't contradictory — they're a pair. **A system that only adds will inevitably bloat, and a bloated harness breeds contradictions.** If self-healing adds rules, then periodic pruning of the `/doctor` variety has to take them back out for the thing to stay balanced.

The core message is one sentence.

> **A harness exists not to control the model, but to tell it only what it cannot know.**

As models improve, the scope of "what the model cannot know" shrinks — and the harness should shrink with it. A harness that only ever grows may be holding not the model's limits, but **our own anxiety.**

---

# References

- Anthropic, [The New Rules of Context Engineering for Claude 5 Generation Models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) (2026)
- Anthropic, [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (2025)
- Anthropic, [Agent Skills](https://www.anthropic.com/engineering/agent-skills) (2025)
- Previous posts — [Frontend Harness Engineering](/en/posts/2026-06-04-fe-harness/) · [Self-Healing Harness Engineering](/en/posts/2026-07-05-meta-harness/)
