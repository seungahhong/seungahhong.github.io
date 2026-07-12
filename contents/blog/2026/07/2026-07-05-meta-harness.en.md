---
layout: post
title: Self-Healing Harness Engineering (meta-harness)
date: 2026-07-05
published: 2026-07-05
category: Development
tags: ['AI', 'harness', 'Claude', 'self-healing']
comments: true
thumbnail: './assets/05/thumbnail.png'
github: ''
---

# 1. What Is This Post About?

Here it is in a single sentence.

> This is a story about **a tool that, when the AI keeps making the same mistake, fixes the AI's configuration files on its own to prevent that mistake.** With one catch: before it actually changes any file, it always asks a human, "Is it okay to fix it this way?"

## First, What Is a "Harness"?

A **harness** is the collective name for *the configuration and code that surrounds an AI*. Think of it as a bundle of documents and rules that tell the AI, "In our project, work like this." In terms of Claude Code, these are usually the following files.

| File | What it does | Analogy |
| --- | --- | --- |
| CLAUDE.md | Rules for the whole project | Company-wide handbook |
| SKILL.md | Specialized instructions for a specific task (e.g., web accessibility) | Field-specific manual |
| agents/*.md | Definitions of role-specific helper AIs | Team member job descriptions |
| hooks/*.sh | Scripts that run automatically at specific moments | Automatic alert/block device |

The previous post, [Frontend Harness Engineering](/blog/2026/06/2026-06-04-fe-harness/), covered **how to build these harnesses well.** This post goes one step further: **how to make a harness fix itself.**

## The Inconvenience of a Static Harness

Even a well-built harness, once created, just **sits there frozen** in place. Even when the AI repeats the same mistake, the harness cannot learn on its own. So every time, a human has to step in like this.

```markdown
AI: (makes the same mistake again)
Me: "I already told you, don't do it this way..."
Me: (open SKILL.md myself and add a rule)
   → next time, yet another mistake → repeat again...
```

Automating this repetition is the theme of this post.

| Situation | Existing (static) harness | Self-healing harness |
| --- | --- | --- |
| AI makes the same mistake again | A human points it out every time | Records that moment automatically |
| "Why did it happen?" root-cause analysis | A human digs through the logs | The tool digs through the records and diagnoses the cause |
| Editing configuration files | A human edits them directly | The tool proposes an edit |
| Improvement history | Relies on human memory | Accumulates neatly as files |

The core is just one thing: **"a human fixes the harness" → "the harness prepares to fix itself, and a human only gives final approval."**

The tool that actually implements this is the star of this post, **meta-harness**. (Just as the name suggests, it is "a harness that fixes harnesses" — a meta harness.)

---

# 2. Safety First — Three Promises

The phrase "the AI fixes files on its own" sounds a little scary. What if it goes rogue? That is why meta-harness keeps **three promises** it never breaks. Once you understand these three, the rest is easy.

## Promise 1 — Never Fix Anything Without Human Approval

This is the most important one. meta-harness **automates only the root-cause analysis and the "how about fixing it this way?" proposal**, and **the actual file edit happens only after a human says "OK."**

```markdown
Record the mistake  →  Diagnose the cause  →  Draft the fix  ──┐
                                                              │  automated up to here only
        ┌─────────────────────────────────────────────────────┘
        ▼
   [ Ask the human ]   "Fix #1? What about #2?"
        │
        ▼  only the ones approved
   Actual file edit
```

Approval can be given item by item.

- "Apply #1" → applied
- "Don't do #2, I did that on purpose" → rejected
- "I'll look at #3 later" → deferred

For items you do not approve, **not a single character of any file is touched.**

## Promise 2 — Don't Break Other Things While Fixing

There is a common trap: **rules becoming too long and complex in an effort to raise accuracy.** Before adopting a fix, meta-harness **checks four things at once.** If even one of them gets worse, that fix is discarded.

| Check item | Plain explanation |
| --- | --- |
| **Consistency** | Does the AI actually behave the way we want? |
| **Body cost** | Do the rules get needlessly long? (shorter is better) |
| **Trigger accuracy** | Does the rule fire only in exactly the right situations? |
| **Generalization** | Does it also work well in other similar situations? |

And the way it edits is conservative too. It **prefers to "add" only the necessary rules without deleting any existing lines.** (This is called the additive approach.)

## Promise 3 — Keep the Original Instead of Summarizing

It saves the record of the moment the AI made a mistake **whole, without summarizing.** Because the moment you summarize, the clues to the real cause disappear. An experiment in the paper meta-harness draws on backs this up.

> The side that preserved the full original outperformed the summarized version — **56.7 vs. 38.7 points**

So even when diagnosing, instead of a "summary feel," it digs directly through the original records and pinpoints the evidence, saying things like **"the problem occurred at step N, in file X."**

---

# 3. How Does It Actually Work?

You don't need to memorize any special commands for meta-harness. **Just ask in your ordinary tone of voice** and it fires on its own. Internally, it flows like this. Don't be intimidated — the three promises above are simply woven throughout this flow.

```markdown
① Assess situation   Automatically judge whether this is a first run or a continuation
② What to fix        Determine "what kind of request is this?"
③ Record the mistake Save the problem moment (the utterance + the immediately preceding output) verbatim
④ Diagnose the cause "Why did this happen?" — analyze multiple mistakes at once
⑤ Draft the fixes    "Fix it like this" — one per mistake
⑥ Quick check        Filter out obvious problems like typos and broken links in advance
⑦ Confirm with human ★ "Fix #1? What about #2?" (always goes through this)
⑧ Actually apply     Edit only the files approved
⑨ Save the history   Record what was fixed this time
   └─ Finally: report in a table what / why / where was fixed
```

## Helper AIs That Divide Up the Work

meta-harness doesn't do everything alone; it splits up the roles. Just like a small team.

| Role | Name | What it does |
| --- | --- | --- |
| Recording | trace-capturer | Save the problem moment verbatim |
| Diagnosis | failure-diagnostician | Find the true cause of each individual mistake |
| Fixing | pareto-refiner | Draft fixes that match the causes |
| Bookkeeping | experience-historian | Organize and archive the improvement history as files |

**Diagnosis runs several in parallel** (since the mistakes are independent of each other), while **fixes proceed one at a time in sequence.** That's because each fix has to be crafted while watching the result of the previous one.

## Three Ways to Ask (R1 / R2 / R3)

Depending on how you phrase it, the scope of the fix changes.

- **R1 — Prevent this mistake right now**
  > "Redo the last one. Look at why it happened, and fix the rules you were using and CLAUDE.md."
  → Touches the project rules and the manual you were just using.

- **R2 — Fix this plugin itself**
  > "This tool keeps behaving oddly. Go into its internal settings and fix it."
  → Touches all of the plugin's internal files.

- **R3 — Find the culprit that produced this document and fix it**
  > "This spec.md is flimsy — fix the AI/manual that produced it."
  → Traces the document backward and fixes the cause that produced it.

---

# 4. It Remembers on Its Own, Even Without Commands

This is the part that lives up to the name "self-healing." Even without calling the tool directly every time, your **complaints and fix requests accumulate automatically.**

```markdown
[ Today's session ]  "redo this / that's wrong / change direction"
    │
    ▼  auto-detected (silently just recorded to a file, without blocking the flow)
    signals/2026-07-05.jsonl  ← saves your words verbatim
    │
    ┈┈┈┈┈┈┈  (a few days later, a new session)  ┈┈┈┈┈┈┈
    │
[ Next session ]  a one-line notice right at the start:
    "N recent self-heal signals have piled up — want to diagnose now?"
    │
    ▼  if you say "yes"
    pulls out the accumulated records and starts root-cause analysis
```

An important point here: what it does automatically goes only **as far as "recording" and "notifying."** The actual fix still goes through **Promise 1 (human approval).** In other words, *"it remembers and fixes later"* is accurate, but that fix **always happens together with human approval.** It never fixes anything in secret.

## Wait — Why Use an "Automatic Script (hook)" Instead of a "Rule"?

Even to block the same thing, where you put it depends on its nature.

| Nature | Where to put it |
| --- | --- |
| **Must be blocked unconditionally** (e.g., blocking dangerous commands) | In an automatic script (hook) or permission |
| **Only needs to be recorded** | Automatic script (silently records) |
| **Requires judgment** | As guidance text in a document (`CLAUDE.md` / `SKILL.md`) |

The point is this: **if you write down "something that must absolutely be blocked" only as prose in a document, the AI can miss it, so you block it firmly with an automatic script from the start.** Document rules are, at best, "recommendations"; the enforcement comes from hooks and permissions.

---

# 5. A Real Example — It Finds the File on Its Own, Even Without Being Told

The most impressive scene is this: **even without pointing out "fix this file,"** meta-harness finds the place to fix on its own.

**What I said (no file mentioned):**

> "You forgot to attach a name tag (accessibility label) to the icon button again. Please fix this so I stop repeating this mistake."

**What the tool did:**

1. **Record** — Save verbatim the output I just made (the button missing a label) and my complaint.
2. **Find the culprit** — Since I didn't tell it which file, it **searches through the project itself.** It searches the manual files for keywords like icon button and accessibility label.
3. **Verdict** — Concludes that the real culprit is the web accessibility manual (`a11y/SKILL.md`). It **excludes** other seemingly unrelated files **from the candidates,** giving reasons.
4. **Fix → confirm → apply** — Draft the fix, ask the human, and apply if OK.

**The applied fix (existing lines left as-is, only a rule added):**

```diff
+ - **Interactive element name check (required)** — verify that each button, link, and input field has a name tag.
+   - **Why:** an icon-only button has no text, so without a name tag
+     a screen reader cannot read out "what button it is."
```

> In fact, without being told a single file, the tool **scanned 27 manuals and pinpointed test/SKILL.md as the culprit exactly.** On top of that, it identified the cause more precisely — not as "because there was no rule," but as **"there is a rule, but it wasn't enforced at the moment of creation."**

## The Final Report — 'What / Why / Where'

Every job wraps up with a summary table like this. You can see what was done at a glance.

| Request | Where fixed | How | Why it was a problem (evidence) | Decision | Applied |
| --- | --- | --- | --- | --- | --- |
| R1 | test/SKILL.md | Rule added | There was no rule enforcing it at creation time (record step 3) | OK | ✓ |
| R1 | root CLAUDE.md | 1 convention line added | There was no project-wide convention (record step 2) | OK | ✓ |

---

# 6. Where Do the Improvement Records Pile Up?

All work records are organized in the project's .claude/ folder. (It doesn't clutter your working folder.)

```markdown
.claude/experience-store/
├── history.jsonl              # full history of "when what was fixed"
├── signals/2026-07-05.jsonl   # collection of auto-detected complaint utterances
├── patches/                   # copies of the fixes actually applied
└── run-.../traces/*.jsonl     # original records of the problem moments (not summarized)
```

## Fixing the Same Spot 3 Times? — "Rethink the Structure"

When you find yourself fixing the same file over and over, the count goes up, and **from the third time on,** instead of touch-ups it recommends, **"You'd be better off redesigning the structure of this part itself."** It's a signal to stop just applying band-aids. It's also a safeguard that keeps self-improvement from endlessly piling on rules.

---

# 7. Wrap-Up — How Far We've Come, and Where We're Going

The harness is evolving in stages like this.

| Stage | Description | The human's role | Status |
| --- | --- | --- | --- |
| **Stage 1** Static harness | Human designs, AI executes | Design + approval | Previous post (2026-06) |
| **Stage 2** Self-diagnosis | AI finds the cause of mistakes on its own | Approve proposals | **meta-harness** |
| **Stage 3** Self-improvement | AI even drafts the fixes | Set policy and boundaries | **meta-harness** |
| **Stage 4** Autonomous agent | AI redesigns the flow itself | Set only the goal | Ahead |

The core message is just one thing.

> **The AI improves itself, but the key to "whether it may be fixed" is always held by a human.**

What plays the role of that key is the **three promises** we saw earlier — human approval, not breaking other things, and preserving the original. If the static harness helped with *"what to build,"* the self-healing harness automates *"how to make the harness itself better."* The developer sets only the goals and boundaries, and the system rolls the remaining improvements forward on its own, under approval.

---

# References

- *Meta-Harness: End-to-End Optimization of Model Harnesses*, arXiv 2603.28052
- Anthropic, [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (2025)
- Anthropic, [Agent Skills](https://www.anthropic.com/engineering/agent-skills) (2025)
- Reflexion (arXiv 2303.11366) · GEPA (arXiv 2507.19457) — evidence on the limits of self-improvement and its safeguards
