---
layout: post
title: Running Is Not the Same as Safe — 5 Principles for Securing AI-Generated Code
date: 2026-09-14
published: 2026-09-14
category: Development
tags: ['AI', 'security', 'shift-left', 'DevSecOps', 'agents']
comments: true
thumbnail: './assets/14/thumbnail.en.png'
github: ''
---

# 1. What Is This Post About?

Notes on [How Developers Secure AI-Generated Code: 5 Security Best Practices](https://www.youtube.com/watch?v=X0UI0O8YzJM), a talk by IBM security architect Jeff Crume on the IBM Technology channel. A Korean-subtitled version is [here](https://www.youtube.com/watch?v=xdtHydnLmcU).

It runs eleven minutes, and the argument collapses into one sentence.

> AI changed **how fast code gets written.** It did not change **how fast code gets verified.** The only way to close that gap is to move verification left.

That sounds familiar — shift-left is a decade-old phrase. What this talk actually sharpens is **why it stopped being optional now.** After-the-fact security review was designed around an assumption: **the volume of code a human can produce.** Break the assumption and the practice breaks with it.

If the [previous post](/en/posts/2026-09-13-writing-specs-for-agents/) was about **what to tell an agent to do,** this one is the other side of it — **what to catch what the agent produced with.**

---

# 2. Why "Security Review at the End" Stopped Working

In a traditional pipeline, security sat on the right edge.

```markdown
plan → design → build → test → [security review] → ship
```

That placement worked for a simple reason: **development was slow.** A sprint produced less code than the security team could absorb, so one pass at the end was enough.

AI-assisted development multiplies exactly one term in that equation.

| | When humans wrote it | Now that AI writes it |
| --- | --- | --- |
| **Code produced** | hundreds to thousands of lines per sprint | thousands in a day |
| **Review capacity** | same | **same** |
| **Security checkpoints** | once, before release | once, before release |

If production goes up 10x and verification doesn't, the gate on the right becomes either **a bottleneck or a formality.** A bottleneck gets routed around; a formality catches nothing. Either way the outcome is identical.

Layered on top of that is the cost curve. The later a defect is found, the more expensive it is to fix — an old observation, and the original case for shift-left. Caught while coding, it ends inside the editor. Caught in production, it's an incident.

> The point is not that **AI-generated code is uniquely dangerous.** **Unreviewed code is dangerous**, and AI has simply made unreviewed code extremely easy to produce.

---

# 3. Principle 1 — Verify Outcomes, Not the Generation Process

The first principle is the least intuitive: **stop trying to control "how the AI wrote it."**

Tuning prompts, swapping models, wedging "write it securely" into the system prompt — these are all bets placed on the **generation process.** They can shift the odds, but they **cannot guarantee anything.** The same prompt may emit different code tomorrow, and a model update can change it quietly.

So the thing to hold onto is the artifact.

```markdown
❌ "this model writes safe code" → trust
✅ "I confirmed this code is safe" → verification
```

One misconception deserves its own line:

> **Tests passing ≠ safe**

Tests check **intended behavior.** Security defects are mostly **unintended behavior.** Code vulnerable to SQL injection runs perfectly on well-formed input. An endpoint missing an authorization check returns a clean 200 for a request that happens to be authorized. A green functional suite says nothing at all about either.

The axis the talk emphasizes is **behavior and privileges in the real runtime environment.** Working locally and running with real credentials, real network boundaries, and real data-access rights are different claims.

---

# 4. Principle 2 — Pull the Checks Into the Editor

The second principle is the body of shift-left: make security checks **feedback while editing**, not a stage in a pipeline.

| Before | After |
| --- | --- |
| SAST report just before release | static analysis on every save |
| quarterly vulnerability scan | dependency scan on every PR |
| secret rotation after an incident | secret detection in the commit hook |
| security team files a ticket | the author sees a red squiggle immediately |

What matters here isn't the tool list — it's **who sees it, and when.** The same SAST finding arriving as a ticket two weeks later carries a context-switch cost and usually slips to "later." Surfaced while coding, it just gets fixed. The tool didn't change; **the cost did.**

In an agent-driven setup this goes one step further. Put the checks **inside** the agent's loop and the agent fixes its own defects within its own turn. Forcing lint, typecheck, and tests through hooks or a harness is something this blog has covered before ([Code Quality Lives in the Constraints](/en/posts/2026-08-25-agentic-code-quality/)); the conclusion here is that security scanning belongs on that same list.

---

# 5. Principle 3 — Distrust the Dependencies the AI Dragged In

The third is the one most often missed in practice: **we read the generated code, but not the generated `package.json`.**

Ask an agent to "add image resizing" and you don't just get code. You get packages. And those packages usually arrive **unreviewed** — one line in the diff, the install succeeded, the tests passed.

Three axes to check:

| Axis | Question |
| --- | --- |
| **Reputation / maintenance** | Is it actually used? When was the last commit? Is the name one character off a popular package (typosquatting)? |
| **License** | Is it usable given how we distribute? |
| **Supply-chain risk** | Known CVEs, including transitive deps? Any install scripts attached? |

The first row carries an AI-specific hazard. Models will **invent plausible package names that don't exist**, and attackers are known to claim those hallucinated names and publish real packages under them. Running `pnpm add` on whatever an agent suggested is risky for exactly that reason. **A package name is not code — it's a trust decision.**

The remedy is unglamorous: put the lockfile diff in scope for review, and make adding a dependency a point where a human signs off. Writing "ask before adding a new dependency" into the agent spec at the ⚠️ tier catches most of it on its own.

---

# 6. Principle 4 — Verify Intent, Not Implementation

The fourth is where human judgment is least replaceable.

Static analysis finds **code that was written wrong.** What it can't find is **code that is doing the wrong thing.** The latter isn't a syntax problem, it's a **requirements-interpretation** problem — and it looks perfectly normal to a scanner.

The typical shape:

```markdown
Requirement: "a user must be able to view their own order history"

Agent implementation: GET /orders → returns all orders
  - no injection        ✅
  - authentication      ✅  (login is checked)
  - authorization       ❌  (whose orders is not)
  - tests pass          ✅  (only tested with the user's own orders)
```

What failed isn't the coding — it's the reading of the word **"their own."** The agent satisfied the requirement literally and passed every automated check. Catching this requires someone to ask: **does this code stay inside the boundary the requirement intended?**

Questions worth having on hand:

- Can this code reach **data outside the caller's permissions**?
- Are business rules (limits, state transitions, ownership) actually in the code, or only in the frontend?
- Do the same rules hold on error paths, boundary values, and empty inputs?

This section connects directly to the closing paragraph of the [spec post](/en/posts/2026-09-13-writing-specs-for-agents/). Self-verification is **an agent checking its own work against its own spec**, so **if the spec itself is vague, everything passes.** That's precisely why intent verification stays with people.

---

# 7. Principle 5 — Make It a Habit, Not a Gate

The last principle is about time. Do all four of the above and, if you do them **once**, the result has a short shelf life.

```markdown
build → test → deploy → monitor → build again
   ↑_______________________________________|
       security has to ride the whole loop
```

Code that was clean at deploy time can become vulnerable through several paths.

| Path | What happens |
| --- | --- |
| **A new CVE lands** | the code is unchanged, but a dependency is now vulnerable |
| **Configuration drift** | permissions, secrets, and network rules loosen in production |
| **A later agent change** | the next turn's agent deletes the earlier defense |

The third is the new entry for the AI era. An agent doesn't know **why something was written that way before.** A defensively added validation line that looks like dead code gets refactored away. That's why **guardrails must live outside the code** — as something that turns a test red, blocks at a hook, or gets rejected by policy when removed.

And here Principle 1 comes back around. Instead of trusting the agent's **behavior**, build **boundaries it cannot cross.** A prompt is a request; hooks, tests, and permissions are constraints.

---

# 8. Applying It to This Repository

Here's an honest count of where this blog's repository stands on the five.

| Principle | Current state |
| --- | --- |
| **1. Verify outcomes** | Partial — `pnpm test` and `pnpm e2e` exist, axe accessibility checks run, but all of it is a **functional** oracle |
| **2. Shift left** | Yes — a husky `pre-commit` forces lint → vitest → playwright before any commit |
| **3. Dependency validation** | **Missing** — no automated audit. The recent major upgrade was judged by hand |
| **4. Intent validation** | Human — content-convention tests cover a slice (category vocabulary, 1:1 translations); the rest is review |
| **5. Continuous verification** | Partial — `deploy.yml` runs everything on push, but nothing runs when the code doesn't change |

Read honestly: **#3 is empty, and #5 is event-driven, so it can't catch a new CVE.** The attack surface of a static blog is small, but an empty box is still empty. Two cheap reinforcements:

```yaml
# ① one audit line in pre-commit or CI — Principle 3
pnpm audit --audit-level=high

# ② a check that runs even when nothing changed — Principle 5
#    a schedule trigger, the same way refresh-popular.yml does it
on:
  schedule:
    - cron: '0 0 * * 1'
```

A cron already refreshes the popular-posts snapshot daily (`refresh-popular.yml`), so **the plumbing for scheduled runs is already in place.** #5 is empty not because it's hard, but because nobody did it. That's usually the reason.

---

# 9. Wrapping Up

| | Principle | One line |
| --- | --- | --- |
| **1** | Verify outcomes, not the process | Running and safe are different claims. Tests passing ≠ safe |
| **2** | Pull checks into the editor | You're changing the **cost of discovery**, not the tooling |
| **3** | Distrust generated dependencies | We read the code but not `package.json`. Watch for hallucinated names |
| **4** | Verify intent, not implementation | What scanners miss is a defect in **requirements interpretation** |
| **5** | A habit, not a gate | Clean at deploy time doesn't mean clean today |

Laid alongside the thread this blog has been pulling on, the placement is clear.

- [Code Quality Lives in the Constraints](/en/posts/2026-08-25-agentic-code-quality/) — holding quality with **constraints** at a scale review can't cover
- [The AI-Native SDLC Playbook](/en/posts/2026-08-23-ai-native-sdlc-playbook/) — when code stops being the bottleneck, **verification becomes one**
- [More Instructions, Less Compliance](/en/posts/2026-09-13-writing-specs-for-agents/) — a vague spec makes self-verification pass everything
- This post — what shape **security** takes on that verification list

Look at the five again and none of them are new. Shift-left, dependency checks, intent review — all of it has been standard advice for years. What changed is that **the slack that let you skip them is gone.** Multiply production by ten and the gaps you used to cover with momentum simply show.

---

# References

- IBM Technology, [How Developers Secure AI-Generated Code: 5 Security Best Practices](https://www.youtube.com/watch?v=X0UI0O8YzJM) (Korean subtitles: [Tech Bridge](https://www.youtube.com/watch?v=xdtHydnLmcU))
- IBM, [What Is Shift-Left Security?](https://www.ibm.com/think/topics/shift-left-security)
- OWASP, [Top 10](https://owasp.org/www-project-top-ten/) · [Dependency-Check](https://owasp.org/www-project-dependency-check/)
- Earlier posts — [More Instructions, Less Compliance](/en/posts/2026-09-13-writing-specs-for-agents/) · [Code Quality Lives in the Constraints](/en/posts/2026-08-25-agentic-code-quality/) · [The AI-Native SDLC Playbook](/en/posts/2026-08-23-ai-native-sdlc-playbook/)
