---
layout: post
title: Your Org's Know-How Now Lives in Skills — Ungoverned, It Becomes Technical Debt
date: 2026-09-06
published: 2026-09-06
category: Development
tags: ['AI', 'agents', 'skills', 'governance', 'harness']
comments: true
thumbnail: './assets/06/thumbnail.png'
github: ''
---

# 1. What Is This Post About?

Notes on [AI-Native Organisations Run on Skills: How to Structure and Scale Them](https://www.youtube.com/watch?v=M05vON8i0aI), a talk by Imad Touil of QuantumBlack (AI by McKinsey) at the AI Engineer World's Fair.

It opens with three show-of-hands questions. The **order in which the hands drop** is the entire talk.

```markdown
"Who has built and is using skills?"          → most of the room
"Who shares them with their team?"            → fewer
"Who governs and maintains them org-wide?"    → a handful
```

If the [last post](/en/posts/2026-08-26-agent-skills/) was about **how to use a skill inside my own repo**, this one is a level up: **who owns the organization's skills, how they get distributed, and what verifies them.** The moment a personal habit becomes an asset, it turns into a completely different problem.

The claim, in one line:

> **Skills have become where an organization's know-how actually lives.** And if you don't govern them now, they become **a new class of technical debt.**

---

# 2. Of the Four Pieces in a Workflow, Why Only Skills Are Left

The talk splits the agentic stack into two loops.

| Loop | Components |
| --- | --- |
| **Inner loop** (coding agent harness) | context manager · tools/MCP · memory & state · **skills loader** |
| **Outer loop** (workflows) | **skills** · sub-agents · MCP servers · hooks |

Then it eliminates the four outer-loop pieces one by one. This subtraction is the sharpest part of the talk.

| Piece | The diagnosis |
| --- | --- |
| **Hooks** | They only fire on events |
| **MCP servers** | Almost nobody builds their own. We consume what the tools we already use provide |
| **Sub-agents** | Mostly exist to **protect the context window** — delegating a specific task |
| **Skills** | **This is what's left** |

> All of your know-how ends up **at the skills level.** And if your skills aren't properly structured, then your workflow was never deterministic to begin with.

That last sentence is the crux. "Our workflow is deterministic" is only true when the skills are structured. If skills are a pile of text each person wrote differently, the workflow is a workflow in name only.

The talk also defines workflows as **harness blueprints** — the design that shapes a harness's runtime behavior. That definition returns later as "put whole workflows in the catalog too."

---

# 3. What We Call a Workflow Is One Cell of the Whole

This section was the most valuable part of the talk for me.

The development workflow we know is usually four steps:

```markdown
specify → design/plan → tasks → implement
```

Most coding agents are shaped exactly like this. But the observation is: **at organizational scale, all four steps are one cell in the journey** — the cell that builds a single product increment.

The real end-to-end lifecycle, from a business defining value to shipping it to a client, looks like this:

| Stage | What happens |
| --- | --- |
| **Product strategy** | What to build and why · define success metrics · break down the roadmap (market research, competitive analysis, customer interviews as input) |
| **Discovery** | Problem statements · find a solution · validate · experiment · user stories |
| **Data preparation** | Clean up the data catalog · adjust endpoint integrations to core systems |
| **Data product delivery** | Build pipelines · validate data quality · make catalogued data assets ready |
| **Product increment** | ← **the four steps we call "the workflow" live here** |
| **Platform engineering / ops** | Provision infrastructure · IaC modules · launch |
| **Operate & optimize** | Performance optimization · incident resolution → loop again |

And a second point matters even more. **An organization doesn't run just one of these.** Across an 18-year career, every organization had several SDLCs scattered across it — one for mobile, others per department or per platform, some internal for employees, others customer-facing. **There is no single workflow that builds anything you want.**

My conclusion: **the coding-agent industry has been optimizing the innermost 10%.** The specify→implement stretch is drowning in tooling, while the six stages around it mostly live in people's heads and Confluence pages. And that outer region is exactly where organizations differ from one another — which is to say, **where the know-how is concentrated.**

---

# 4. Design Skills Like Microservices

The talk doesn't treat skill design as a new problem. It's **a problem we already solved during the microservices era.**

| Principle | What it means for skills |
| --- | --- |
| **Reusable** | Not written once and thrown away |
| **Modular** | Clear boundaries |
| **Discoverable** | Another team can find it automatically when they need it |
| **Portable** | Across workflows — and **across harnesses** |
| **Specialized** | Not one monolithic skill. **One task per skill** |
| **Composable** | Stack without duplication. No conflicts between them |
| **Consistent** | Determinism is the whole reason skills exist |
| **Cost-efficient** | **Progressive disclosure** — the right skills, the right amount, at the right time |

Portability is a big practical deal. Because the standard is shared, **a skill you wrote for Claude Code just works when you move it to Cursor.** Skills aren't vendor-locked, which is what qualifies them to be an organizational asset.

The summarizing line:

> Skills define a new unit that makes your organization's know-how **executable, portable, and cheap.**

## A Composition Example — Regulatory Compliance

The example given is concrete enough to repeat. Skill catalog on the left, harness in the middle, output on the right.

```markdown
[skill catalog]                    [runtime]                       [output]
data retention policy        ┐
disclosure standards         ├→ regulatory disclosure review →  audit report (storable)
GDPR rules                   │   workflow (pulls at runtime)    identified improvements
fill-in templates            ┘                                  → feedback loop to codebase
```

This is how you make every feature — web, mobile, whatever application it was built in — respect the same rules. And it matters that the output is an audit report: it's the **"does a verifiable artifact remain?"** test from the [last post](/en/posts/2026-08-26-agent-skills/), raised to organizational scale.

---

# 5. What Happens Without Governance — A New Class of Technical Debt

The list from the talk. Every item is something we lived through in the microservices era.

| Debt | How it forms |
| --- | --- |
| **Duplication** | Teams on the same stack and infra **build the same skill over and over** |
| **Quality decay** | Unless you retest skills **against new models, not just against the original task**, they rot |
| **Undiscoverable** | Without governance you can't find them at all |
| **No ownership** | The exact problem Backstage-style IDPs solved — with no known **owner**, nobody maintains it |
| **Not composable** | Composability isn't a default. It comes from **deliberately drawn boundaries**, like domain-driven design |
| **Security** | Public skills can carry prompt injection, and **skills contain scripts** |
| **Permissions** | Not everyone in the org needs access to a skill holding sensitive business logic |

## The Single Most Important Sentence in the Talk

The logic on security is especially sharp.

> **Skills have scripts. That's the deterministic part of them.**

The fact that these two sentences sit together is the point. Skills are deterministic **because they actually run a specific script for a specific task** — and that is also exactly what makes a skill a **supply chain**. They're two faces of the same property; you can't take only one.

So: **pulling a public skill without a checking pipeline is a supply-chain decision.** It's the same lesson we learned about `npm install`, except this time it arrives as **a markdown file with no compile step and no type signature** — which means it arrives more quietly.

## Quality Decay — Skills Rot Differently Than Code

**"Validate against the latest models, not just the task"** is worth chewing on.

Skills are usually written **against a model's failure modes.** "This model skips tests, so tell it explicitly." "This model overruns scope, so nail it down." But models ship a new version every few weeks. At that point part of your skill becomes **an instruction that's no longer needed** (pure token waste), and part becomes **an anti-pattern suppressing the new model's better defaults.**

```markdown
Ordinary code:  if the runtime is unchanged, what was right yesterday is right today
Skills:         the execution environment (the model) turns over every few weeks
```

**A skill is code whose assumed environment keeps changing.** Which is why "write it well once and you're done" simply doesn't hold for this kind of asset.

---

# 6. The Maturity Ladder — Individual → Team → Central Platform

The adoption path has three rungs.

| Stage | What you do |
| --- | --- |
| **① Individual** | Create, test, improve, and use skills — **in a structured way, not randomly** |
| **② Team** | Share them. Same stack, same products, so they **evolve fast** |
| **③ Central platform** | Catalog · dependencies · versioning · access control · evaluation & observability |

The central platform requirements are specific:

- **A catalog with metadata** — it must be searchable
- **An MCP plugged into the catalog, plus a CLI** — the path to **pull** a skill into your IDE or sandbox
- **Dependencies** — you need to know how skills depend on each other
- **Versioning and lifecycle** — the agent **notices a newer version exists and pulls it**
- **Access control** — who accesses what
- **Evaluation and observability**

And then the most honest line in the talk:

> All of this runs on governance. And **this is where technology stops solving the problem.**

You can build the entire catalog and **"so who governs it?"** still remains. The answer given: architects, engineering leads, infra leads, and security leads each owning a domain and keeping skills aligned with policy. It's refreshing that the talk doesn't hide that this is **an org-chart problem.**

## A 15-Team, Six-Month Simulation

The talk simulates 15 teams (5–12 engineers each) with skill contribution per engineer, average daily skill utilization, cross-team duplication ratio, and quality & security ratios, run over six months.

The ungoverned observation rings true:

> Without a skill for the regulation, someone is **vibe-coding back and forth trying to steer the agent** into implementing it properly. That burns more tokens on the cost side, and on the productivity side you spend time to get an answer that could have come in one shot.

Quality and security follow the same shape. When skills aren't defined and maintained, **every judgment falls back on the human**, and differences in team maturity show up directly as variance in output.

And with governance? The talk doesn't oversell it — **it doesn't become perfect, and some teams still diverge.** But common ground appears. Publish one skill, and when the next engineer starts building a new one, **the harness spots the existing skill and pulls it.**

---

# 7. What Comes Next — and Why the Order Matters

Three things the talk points at:

| Next | Status |
| --- | --- |
| **Skills registry** | The IDP (internal developer portal) vendors have already started centralizing this capability |
| **Skills evaluation** | Still unsettled. The most valuable approach so far: **statically evaluate skills against Anthropic's best practices** — a skill that isn't invoked properly or isn't structured properly is likely low quality |
| **Auto-evolving skills** | A closed loop that evolves skills automatically. **The current next hype** |

With a warning attached:

> Turn on auto-evolution without governance acting as guardrails, and **the impact is far larger than it is today.**

I read this ordering as the talk's real conclusion. **Automation is an amplifier.** Switch on auto-evolution while duplication, decay, and ownerlessness are present, and all three propagate automatically. It's the same argument as the [self-healing harness post](/en/posts/2026-07-05-meta-harness/) — **before you build the machine that adds rules automatically, you need the machine that checks whether the added rules made things worse.**

---

# 8. Applied to This Repo — I'm on Rung 2, and I Don't Need Rung 3

Reading without applying leaves nothing, so I measured this blog repo against the ladder.

This repo has several harness skills attached: `frontend-harness`, `product-spec-harness`, `test-layering-harness`, `git-harness`.

| Stage | This repo | Verdict |
| --- | --- | --- |
| **① Individual** | Skills are built and used | ✅ |
| **② Team** | Bundled as plugins, reusable | ✅ (a team of one, effectively) |
| **③ Central platform** | Catalog ❌ · versioning ❌ · access control ❌ · **eval ❌** | ❌ |

Here's the honest split: **I don't need all of rung 3.** The talk's audience is an organization with 15 teams; this is one blog. A catalog, an MCP search layer, and access control are plainly over-engineering here.

But **two things are needed regardless of team size.**

```markdown
Scales with org size:  catalog · search MCP · access control · named owners · duplicate detection
Independent of size:   versioning (when and why a skill changed) · eval (did the change make it worse)
```

And this repo has **neither.** I flagged the same gap in the [last post](/en/posts/2026-08-26-agent-skills/) and in the [one before](/en/posts/2026-08-25-agentic-code-quality/), but this talk adds a new reason: **skills rot quietly every time the model changes.** That's section 5. Quality drops when the environment turns over even if I never touch the skill — and I have zero instruments that would notice.

So the actual to-do for this repo narrows to two lines:

1. **Make skill changes traceable per commit** — you can only roll back if there's a record of what changed when and why
2. **A handful of regression tests for skills** — run a few representative tasks with and without the skill, across model versions, and compare

That's worth far more than building a catalog. And the order is the same at organizational scale, because **a catalog without evaluation is a machine for distributing rotten skills more efficiently.**

---

# 9. Easy Things to Get Wrong

## Misconception 1 — "A catalog is governance"

The talk nails this directly. Build the catalog, versioning, and access control, and **"this is where technology stops solving the problem."** A catalog solves **discovery**; governance solves **ownership and policy.** A catalog with no owner names on it is just a well-organized warehouse.

## Misconception 2 — "We did this with microservices, so we're safe"

The prescription borrows microservices governance wholesale. It's a good prescription, but I'd add a caveat: **microservices governance mostly didn't work.** And skills drift faster.

| | Microservices | Skills |
| --- | --- | --- |
| **Cost to copy** | Requires a deploy pipeline | **One file copy** |
| **Interface contract** | Schemas and types enforce it | None. It's natural language |
| **When it breaks** | Builds and health checks catch it | **You get a plausible-looking result** |

Replicates fast, has no contract, and looks fine when wrong — that means governance is **more urgent**, not that we can relax because we've seen this movie.

## Misconception 3 — "Skills are just text, so they're safe"

Section 5, again. **Skills contain scripts, and that's the source of their determinism.** Pulling a public skill without inspection carries the same weight as adding a dependency.

## Misconception 4 — "Auto-pulling the latest version is good"

The talk presents an agent noticing and pulling the newest skill version as an upside. As convenience, sure. But **auto-pull-latest with no signing or checking** is a failure pattern we already know. Convenience and supply-chain safety pull in opposite directions, and what bridges them is the **checking pipeline** from section 6. Adopting only one of the two is the mistake.

---

# 10. Summary

| | Point | Why |
| --- | --- | --- |
| **1. Know-how collects in skills** | Hooks are events, MCPs are someone else's, sub-agents protect context | Eliminate the rest and skills are what remain |
| **2. Structured skills are what make a workflow deterministic** | Otherwise it's a workflow in name only | Determinism is decided at the skill level |
| **3. The workflow we know is one cell** | Strategy, discovery, data, platform, and ops sit outside it | The industry has optimized the innermost 10% |
| **4. Microservices design principles, unchanged** | Specialized, composable, portable, progressively disclosed | Not a new problem — but it drifts faster |
| **5. A skill is a supply chain** | It's deterministic because it carries scripts | Determinism and supply-chain risk are two faces of one property |
| **6. Skills rot when models change** | Retest against **new models**, not just the task | The execution environment turns over every few weeks |
| **7. Auto-evolution without governance is an amplifier** | Don't get the order wrong | Duplication and decay propagate on their own |

It's also the next cell in a thread running through this blog.

- [Self-healing harness](/en/posts/2026-07-05-meta-harness/) — verify when you **add** a rule
- [Context engineering by subtraction](/en/posts/2026-07-31-context-engineering-claude5/) — verify when you **remove** one
- [AI-native SDLC](/en/posts/2026-08-23-ai-native-sdlc-playbook/) — verify when you **change the process**
- [Code quality lives in the constraints](/en/posts/2026-08-25-agentic-code-quality/) — verify by what **surrounds** the agent
- [What agents skip is the senior work](/en/posts/2026-08-26-agent-skills/) — skills are what you **push into** the agent
- This post — what you need once those skills **start passing through many hands**

Back to the three questions and the dropping hands: raising your hand for the first one is easy now. The third is the hard one. And the honest admission at the center of this talk is that the difficulty isn't technical — it's **who is going to own it.**

---

# References

- Imad Touil (QuantumBlack, AI by McKinsey), [AI-Native Organisations Run on Skills: How to Structure and Scale Them](https://www.youtube.com/watch?v=M05vON8i0aI) — AI Engineer World's Fair
- Previous posts — [What Agents Skip Is Always the Senior Work](/en/posts/2026-08-26-agent-skills/) · [Code Quality Lives in the Constraints](/en/posts/2026-08-25-agentic-code-quality/) · [The AI-Native SDLC Playbook](/en/posts/2026-08-23-ai-native-sdlc-playbook/)
