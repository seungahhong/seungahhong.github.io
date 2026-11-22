---
layout: post
title: From Acceptance Criteria to Layered Tests — test-layering-harness
date: 2026-11-22
published: 2026-11-22
category: Testing
tags: ['harness', 'unit-testing', 'E2E', 'Claude']
comments: true
thumbnail: './assets/22/thumbnail.en.png'
github: 'https://github.com/seungahhong/seungah-claude-plugins/tree/main/plugins/test-layering-harness'
---

# Splitting Acceptance Criteria into Layered Tests, One Approval at a Time

[test-layering-harness](https://github.com/seungahhong/seungah-claude-plugins/tree/main/plugins/test-layering-harness) is a single-skill plugin I published to my Claude Code plugin marketplace (seungah-claude-plugins). It takes acceptance criteria (Given-When-Then), plans **which tests to write, at which layer, and in which CI stage**, and then adds the tests one by one through three approvals: plan → individual → final. The current version is 0.8.0.

If the [product spec harness](/en/posts/2026-11-21-product-spec-harness/) takes you from a planning draft to acceptance criteria, this harness handles the next step: turning those criteria into a test suite that actually runs. It does not depend on any other plugin, so acceptance criteria are all it needs.

## ✍️ TL;DR

> **When AI writes the tests, the risk moves away from "how fast can we write them" to "what do we verify, at which layer, and what do we treat as the right answer."** This harness plans tests along two axes — methodology × layer — has a human approve every step, and actually runs what it writes.

## Why I built it

### Writing *many* tests is already easy

Ask an agent to "write tests" and you get tests quickly. The trouble comes after. The failures I kept seeing fell into three groups.

- **Every acceptance criterion becomes an E2E test.** Acceptance criteria are written from the user's point of view, so a literal translation spins up a browser. You end up with the "ice-cream cone": a heavy top of slow, flaky tests whose failures are hard to trace.
- **Suites exist only as names.** The plan says "3 smoke, 10 regression," but nothing in the code marks them, so there is no way to run just the smoke tests. The harness calls this a phantom suite.
- **Tests lock bugs in as the right answer.** This is the most dangerous of the three.

### The biggest risk is oracle strength

The rule a test uses to decide what counts as success is called its oracle. Research from 2025 onward keeps pointing to weak or wrong oracles as the biggest risk in LLM-generated tests.

LLMs tend to write assertions from **what the current implementation actually returns**, not from the spec. If the code has a bug, you get a test that enshrines the bug as correct, and that test hides it behind a green check. On top of that, LLMs are worse at judging whether their own oracles are right than they are at producing them.

So the harness does three things. It **decomposes** tests along a layer taxonomy, has a **human approve** every application, and **re-checks oracles against the acceptance criteria and actually runs** the result.

## Two axes: methodology × layer

### Four methodologies

- **Smoke** — broad and shallow. The checkpoint right after a deploy that asks, "Is this build worth testing further?"
- **Sanity** — narrow and deep. This harness uses it to run the pages and components related to a change before the PR.
- **Regression** — broad and deep. Confirms existing behavior has not broken.
- **Nightly** — a full run on a schedule. The safety net for what selective runs miss.

The harness goes out of its way to state two things.

First, the ISTQB glossary treats **smoke and sanity as synonyms**. "Smoke is broad and shallow, sanity is narrow and deep" is an industry convention, not a standard.

Second, **nightly is not a test type but an axis of *when* to run**. Neither ISTQB nor ISO defines a nightly test type.

The harness uses the conventional names but always writes these facts into the plan.

### Three layers

- **Unit** — "Is this function or decision logic right?" Fast, cheap, and precise about the cause, but it gives little confidence that parts work together.
- **Integration** — "Do modules, components, and APIs work together?" The balance point between speed and confidence.
- **E2E** — "Does the whole user journey work?" The highest confidence, but slow, expensive, flaky, and hard to diagnose. So it is kept to a few critical journeys.

### Seven cards instead of a 12-cell grid

Four methodologies times three layers gives twelve cells. In an early version (0.2.0) I actually wrote a criteria document for each of the twelve.

But the two axes are independent (orthogonal). ISO/IEC/IEEE 29119-1:2022 defines regression as "a design and execution choice, not a test level." A layer is a fixed property of a single test, while a methodology is a selection on top of it — "which bundle do we pick it into" — so one test can belong to several methodologies at once. The twelve cells are not mutually exclusive buckets, just the points where the two axes cross.

So from 0.3.0 on I replaced them with **seven axis cards: four methodology cards and three layer cards**. Instead of pre-filling twelve cells, the harness combines the two cards it needs at the moment it routes an acceptance criterion. Each card spells out which criteria it includes and excludes, how strong the oracle must be, and how it is separated in real code.

Not every combination is useful, so the harness grades them honestly.

| Layer \ Methodology | Smoke | Sanity | Regression | Nightly |
| --- | --- | --- | --- | --- |
| Unit | Weak | Degenerate | **Strong** (highest oracle risk) | Empty |
| Integration | **Strong** | Degenerate | **Strong** | Fairly strong |
| E2E | Conditionally strong (real API only) | Not created | **Strong** | Strongest by the evidence, but not created |

Weak or degenerate combinations are left empty rather than forced. Unit tests, for example, already run in full at the PR stage, so a nightly-only unit test means nothing. Regression × Unit is the strongest combination and also the one most at risk of "locking a bug in as correct," so its oracle checks are especially strict. E2E nightly fits best by the evidence, but I chose not to create it as an operating decision — more on that below.

### Three presets matched to the repository

The harness reads the repository and recommends one of three presets, with its reasons.

- **Trophy-lean** — frontend and component-heavy. Thick integration, unit only for decision logic, E2E only for essential journeys. Recommended when it sees React, Vue, or Svelte with Testing Library.
- **Google-pipeline** — large codebases and monorepos. Fast, unit-heavy checks before the PR; broader runs after merge. Recommended when it sees workspaces or affected-test selection.
- **Contract-honeycomb** — distributed services. Contract tests between services and integration at the center, E2E close to zero. Recommended when it sees OpenAPI, proto, or contract-testing tools.

None of the presets sets a ratio like "70% unit, 20% integration, 10% E2E." Even Fowler, who popularized the test pyramid, said the numbers themselves don't matter, and the Testing Trophy and Honeycomb are expert rules of thumb rather than experimentally proven optima. A preset only suggests where the weight should sit.

## The flow: five phases and three approval gates

| Phase | What happens | Gate |
| --- | --- | --- |
| Phase 0 Initial inquiry | Ask where the acceptance criteria come from; detect test runners, mock tools, test id conventions, etc. | — |
| Phase 1 Composition | Recommend a preset and let the user pick methodologies and layers with checkboxes | Scope fixed |
| Phase 2 Plan | Route each criterion through card combinations into a layered plan and a CI placement table | **A: plan approval** |
| Phase 3 Individual application | One test at a time: draft → check → approve → write file → run | **B: individual approval** |
| Phase 4 Re-check | Overall summary and full run, then final confirmation | **C: final commit** |

None of the three gates can be skipped. No individual application without plan approval, no file writes without individual approval, no confirmation without final approval. The skill's default tool permissions are read and search only, so file writes and runner executions go through the usual permission prompts every time.

### Phase 0: always ask where the criteria come from

The first live run was on this very blog repository. The most common mistake it exposed was the agent digging through the repository and inventing candidate criteria without asking — even though the user might already have an authoritative criteria document.

So Phase 0 always presents three options and waits: (a) paste them into the chat, (b) give a file or link path, or (c) none. Only on (c) does it look for candidates in the repository's PRDs, stories, and existing test titles, propose them, and confirm again. If the first request already includes the criteria, it does not ask again.

At the same point it reads the repository: which runners exist and which are missing, whether there is a tool that intercepts network requests, whether existing tests call real external APIs, what test id attribute the team uses, and whether there are candidate environments for E2E. For environment variables it reports key names only and never prints their values.

### Phase 1: only build inside what was chosen (scope guard)

The user picks methodologies and layers with checkboxes, pre-checked according to the recommended preset. Layers without a runner are marked "runner needs to be added."

The chosen (methodology × layer) set becomes the fence for every later step. The harness calls this the **scope guard** and treats it as seriously as the three gates. If a criterion would naturally be an E2E test but the user did not choose E2E, the harness either pushes it down to integration or marks it "out of scope — not added" and asks whether to widen the scope. It never adds tests on its own.

### Phase 2: one criterion = several layers

An acceptance criterion is not equated with a single test. The harness slices it, sends calculation and decision logic to unit, collaboration between modules and APIs to integration, and only critical user journeys to E2E. The principle: "every E2E test can be an acceptance test, but not every acceptance test needs to be E2E." Given-When-Then maps directly to Arrange-Act-Assert at any layer, so the layer is decided by "what do we isolate and what do we use for real."

Next, each slice gets methodology memberships. Most are regression; deterministic, critical happy paths are smoke; anything slow, expensive, or flaky is deferred to nightly.

Each row of the plan holds the criterion ID, the layer, the methodology and the command that selects that bundle, combination strength, the API boundary (mock or real, and where the fake responses come from), how screen elements are located, the oracle, the planned test file path, a Given-When-Then summary, and the supporting card. A CI placement table and the list of run scripts to be added are attached, and everything is approved **in one go**. No file is created before approval.

### Phase 3: one test at a time

The approved plan is worked through row by row, not in parallel. Each test follows this order.

1. **Oracle pre-check** — Is the assertion a copy of what the current implementation returns, or does it verify what the acceptance criterion requires? If it copies the implementation, the expectation is re-derived from the criterion; if it is unclear, the harness asks, "Is this expectation correct?" Before the first test, it also looks at existing flaky tests in that area, because feeding flaky tests in as context spreads the flakiness to new ones.
2. **Draft and self-check** — It checks the file location, traces of real API calls, the order used to find screen elements, and whether tags and criterion IDs follow the rules. It does not include assertions that cannot fail, such as reading back a value it just set.
3. **Gate B** — The user chooses "apply / apply after edits / skip this test only / stop here." The file is written only on approval.
4. **Run** — The harness actually runs the applied test and shows the runner output rather than its own claim. If it fails, it separates "the test is wrong" from "the code violates the criterion" and asks what to do next. It also checks that the test passes on correct code (not a false alarm), and runs the selection to confirm the new tags pull this test into its bundle and not into others.

If the user stops midway, only what has been applied so far is kept and the flow moves to the final phase.

### Phase 4: re-check and confirm

The harness summarizes applied, skipped, and failed tests, the distribution across layers and bundles, suspected code defects, and anything still unverified, then asks one last time whether to confirm. If the user asks to roll back a particular test, only that file change is reverted.

## The rules it keeps

### Unit and integration never call real APIs

Unit and integration tests are always mocked, no exceptions. The moment a test goes out to the real network it is no longer a unit or integration test. The harness prefers tools that intercept requests at the network boundary (MSW, nock, and the like); when none exist it falls back to replacing the module itself, and writes down in the plan what that leaves unverified, such as request assembly or error mapping.

Fake responses (fixtures) are sourced in three steps: reuse what the repository already has; otherwise ask the user for a real response sample; otherwise derive one from the schema or types and label it "not captured from a real response." The harness never calls a real API to create a fixture. Copying fixture values straight into the expected values is also forbidden — a fixture is a precondition (Given), not the answer.

After writing, it statically checks for leftover external URLs or un-mocked HTTP calls, while also stating the limit: passing that check does not prove the test never touches the network.

> **A passing mock is not a working integration.** A fixture is a snapshot of the moment it was captured, so the test stays green even after the real API changes. The output always notes that the only thing that confirms integration is an E2E run against the real API.

### E2E is smoke and regression only, and smoke sits inside regression

E2E tests are created only as smoke and regression. No nightly or sanity-only E2E. The cost is written down too: with nowhere to defer cross-browser or large E2E runs, regression E2E itself must be narrowed to critical journeys.

Smoke is a subset of regression. A smoke test carries both the smoke and the regression tag. The same scenario is never duplicated into a mock file and a real-API file; the run mode is expressed only as a tag on the existing test. By default E2E tests carry the mock-mode tag and run deterministically in CI; only scenarios the user points to get the real-API tag as well and are run by hand.

### E2E smoke runs against the real API only — and what that costs

This is where the harness is most opinionated. **E2E smoke runs against the real API only, even if nobody asks.** Passing smoke on mock data cannot answer smoke's actual question: "Is what we deployed really alive?" In exchange, it is not placed in any fixed CI stage (PR, post-deploy, nightly) and lives only as a manual run recipe.

This is an operating decision that directly conflicts with the usual advice that "a gate that blocks deploys must be deterministic and free of external dependencies" (MinimumCD, Fowler). So the harness does not dress it up as evidence-based; it writes it into the output as is. **E2E smoke is not an automated deploy gate but a manual checkpoint a person runs before promotion.** A pass against the real API is also only an observation of "it passed at this time, in this environment," not a permanent guarantee of integration.

In 0.5.0 the rule was the exact opposite: "E2E smoke never gets a real-API mode." When I reversed it in 0.6.0, I changed the rule without hiding the fact that it conflicts with the evidence.

### The only exception for calling a real API, and its conditions

The only time the harness itself calls a real API is when running E2E smoke, and even then three things must all be in place: the target environment URL, test accounts and seed data (or confirmation that none are needed), and **approval to run, given on the spot**. Approving the plan is not treated as approving the run.

- If the target is production, it asks once more.
- Journeys with side effects — payments, sending messages, deletions, billing — are asked about one by one.
- Secret values are never accepted in the chat; only environment variable or secret key names are handled.
- Data created by the tests is not deleted by the harness on its own; it is reported as left behind.
- Failures are split three ways: test defect, code defect, and **environment or external cause** (not deployed, expired auth, rate limits, upstream outage), so that environment problems are not blamed on the code.
- If the conditions are not met and it cannot run, the recipe stays **UNVERIFIED**. "I created a run recipe" is never reported as "I verified it."

### Sanity is a selection lane, not an axis for new tests

In the combination table above, sanity is "degenerate" everywhere. That means "no new sanity-only tests," not "no sanity." In this harness, sanity is **a selection lane that picks existing tests by change scope and runs them before the PR**.

The targets widen in three steps: the changed files, the parent pages and components that import them, and — if E2E was chosen — the mock E2E tests for the related pages. If the mapping is uncertain, the scope widens to everything rather than narrowing. In the PR job, unit and integration failures block, while mock E2E only reports.

No sanity tag is planted in the code. New tests are created only when a changed target has no tests at all, and the CI config file is never edited directly — the harness only proposes what to add. This placement and blocking policy, too, is labeled as an operating decision rather than a standard.

### Find screen elements the way users do

Tests that query the screen try a fixed ladder from the top.

1. **Visible elements and interaction** — role (button, link, …) with name → label → placeholder → visible text → current value
2. **HTML and ARIA attributes** — image alt text → title attribute
3. **Test ID** — only when the above cannot find it
4. **Last resort** — an arbitrary CSS selector

Every step down requires a reason why the step above cannot work. "It's easier to write" is not a reason. A few more details:

- **Runners name things differently.** Testing Library and Playwright use different names for the same concepts, and Playwright has no query that finds by current value at all. The harness never calls an API that doesn't exist; when it needs to pin down a value, it finds the element with a higher-ranked query and checks the value with an assertion.
- **The test id attribute name is the team's call.** The harness does not invent one; it detects it in the repository and asks if there is none or several are mixed. Adding a new test id to product code is a change outside the test files, so it gets separate approval.
- **The last resort is allowed, but its coupling cost is written down.** Locating by an analytics attribute ties the test to a contract made for another purpose; locating by part of a CSS module class name ties it to a build hash, an implementation detail. When their owners change them, the test breaks. The harness flags the risk, and the user decides.

This ladder reflects the design intent of the official Testing Library guide, not experimentally proven superiority. So the harness does not score compliance or claim numbers like "finding by role cuts flakiness by X%." And picking a good selector does not make the oracle stronger; the two are separate checks.

### Always in a \_\_test\_\_ folder next to the target

Unit and integration tests go into a \_\_test\_\_ folder created right in the folder of the file under test. Even if the repository has another convention (a plural folder name, a separate test folder, files right next to the source), this rule applies without exception.

At first there was an exception: "follow the existing convention if there is one." In practice that exception became a loophole, and tests occasionally appeared next to the source with no folder. In 0.4.1 I removed the exception and made the harness check the path three times — before, during, and after writing. E2E has its own runner and folder conventions, so its path is asked for separately when the layer is chosen.

### Criterion IDs in test titles

Every smoke and regression test starts its title with the acceptance criterion ID, so the code itself shows which criterion a test verifies.

Smoke and regression contain only tests grounded in acceptance criteria. Tests needed outside the criteria, such as performance or fuzzing, can live without an ID only in nightly or sanity, and even then the plan records a reason and they are approved separately. If the input criteria have no IDs, the harness first gets approval for a numbered mapping table, and never invents IDs that are not in the input. If there is a test you want in smoke but no matching criterion, the harness does not invent the test; it asks whether to add the criterion (a planning decision).

### Suites must exist in code

Writing "smoke" in a plan does nothing on its own. The harness attaches tags in the code using what the runner provides natively (Playwright and Vitest tags; for Jest, which lacks native tags, title conventions or project separation), adds per-bundle run scripts, and then runs those commands to confirm this test is selected and others are not. A test that the plan places in a bundle but that carries no tag in code is rejected. If the runner cannot do tags, the harness does not pretend; it downgrades the bundle to "a label only, not real run separation."

When E2E is in scope, it confirms six isolation conditions from actual run output. In short: "the smoke and regression lists that run in CI contain no real-API tests," "smoke E2E has no mock tag and does have the regression tag," "nightly has no E2E," and "the same scenario is not duplicated in files that differ only by mode."

## Honesty principles

The part of this harness that took the most work was not a feature but the list of things *not* to say.

- It does not set layer ratios like 70/20/10.
- It does not hide that smoke and sanity are synonyms in the standard.
- It does not cite unsupported effect numbers like "smoke catches 80% of critical bugs early" or "switching to mocks cuts flakiness by N%."
- It does not claim that prioritizing test order reduces CI cost. Only the order changes; the total amount of execution stays the same. What reduces cost is selection, batching, and parallelism.
- It never reports a mock pass as verified integration, or an unexecuted test as passing.
- Things that are operating decisions or design intent rather than evidence — sanity's PR placement, the real-API-only rule for E2E smoke, the selector ladder — are labeled as such.
- Every conclusion carries a confidence level (high, medium, low) and a source.

## How to use it

### Install

```bash
# One-step install (Claude Code 2.1.275+)
/plugin install test-layering-harness --marketplace seungahhong/seungah-claude-plugins

# Or register the marketplace first, then install
/plugin marketplace add seungahhong/seungah-claude-plugins
/plugin install test-layering-harness@seungah-claude-plugins
```

### Invoke

Call it with the slash command, or just ask in natural language and the skill triggers.

```text
/test-layering-harness:test-layering-harness
```

```text
Plan layered tests from these acceptance criteria and add them one at a time with my approval
```

It also triggers on requests like "split these ACs into unit/integration/E2E," "plan smoke and regression tests," or "which tests should go in which CI stage."

### 1. Provide the criteria and the path

Choose whether to paste the criteria, give a file path, or have it search the repository because you have none. If you paste them, this shape is enough:

```text
AC-1.1
Given a signed-in user is on a product detail page
When they press the Wishlist button
Then the button changes to 'Remove from wishlist' and the wishlist count goes up by 1

AC-1.2
Given a signed-out user is on a product detail page
When they press the Wishlist button
Then they are taken to the sign-in page
```

If there are no IDs, the harness builds a mapping table numbered AC-1.1, AC-1.2, and so on, and asks you to approve it. You can skip the target path; it will then detect runners and conventions from the current project path.

### 2. Pick methodologies and layers

Checkboxes appear along with the recommended preset. Keep the defaults or adjust them.

```text
Methodology  [x] Smoke   [ ] Sanity        [x] Regression   [ ] Nightly
Layer        [x] Unit    [x] Integration   [x] E2E
```

Choosing E2E prompts for the path where E2E tests should live. Choosing both Smoke and E2E brings a notice that E2E smoke is real-API only, followed by questions about the target environment URL, the environment variable names holding test accounts, and whether to include journeys with side effects. You don't have to answer now; the plan is built either way, and only the run is left UNVERIFIED.

### 3. Approve the plan (Gate A)

You get a plan table. For the criteria above, it looks roughly like this:

| # | AC-ID | Layer | Methodology | API boundary | Screen element | Oracle |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | AC-1.1 | Integration | smoke, regression | mock · network interception · reused fixture | role (button) named 'Wishlist' | After click the button reads 'Remove from wishlist', count +1 |
| 2 | AC-1.2 | Unit | regression | mock · module double | N/A (non-DOM) | Returns the sign-in route when signed out |
| 3 | AC-1.1 | E2E | smoke, regression | real API only · manual run | role (button) named 'Wishlist' | Detail → wishlist → item appears in the wishlist |

Below it come the CI placement table and the run scripts to be added. Choose full approval, edit or drop specific rows, or readjust the preset.

### 4. Approve one at a time (Gate B)

For each test it shows a draft and asks:

```text
Apply this test? (apply / apply after edits / skip this test only / stop here)
```

On approval it writes the file and runs it immediately. The resulting test has the criterion ID at the start of its title and bundle tags in its options. For row 3 above:

```ts
test(
  '[AC-1.1] a signed-in user adds the product to the wishlist',
  { tag: ['@smoke', '@regression', '@e2e-live'] },
  async ({ page }) => {
    // ...
  },
);
```

When the first test of a bundle is applied, the run scripts are added too. Names and commands follow the repository's conventions — for example:

```bash
pnpm test:smoke            # smoke without E2E — post-deploy CI
pnpm test:regression       # all regression — E2E in mock mode only
pnpm test:e2e:smoke:live   # E2E smoke against the real API — manual only, never in CI
```

### 5. Final confirmation (Gate C)

Review the summary and the full run result (real-API tests excluded), then confirm or roll back specific tests. If you like, the plan and summary can be saved as files:

```text
<target path>/.claude/_docs/test-layering/<slug>/
  test-plan.md        # the plan table
  applied-summary.md  # the application summary
```

## How it changed, version by version

| Version | Date | What changed |
| --- | --- | --- |
| 0.1.0 | 2026-07-05 | Created. Acceptance criteria → methodology × layer plan, three approval gates, oracle re-checks and execution, three presets |
| 0.2.0 | 2026-07-06 | A criteria document for each of the 12 methodology × layer cells, grounded in post-2025 standards and papers |
| 0.3.0 | 2026-07-06 | Replaced the 12 cells with seven axis cards and introduced the scope guard |
| 0.4.x | 2026-07-07, 07-14 | Placement and mock rules, early E2E path question, unconditional \_\_test\_\_ folder |
| 0.5.0 | 2026-08-01 | API boundary axis (mock/real), E2E mode tags, sanity as a change-scope selection lane |
| 0.6.0 | 2026-08-17 | Reversed to real-API-only E2E smoke, with run conditions and three-way failure triage |
| 0.7.x | 2026-08-23, 10-18 | New screen-element ladder; shorter skill description and narrower tool permissions |
| 0.8.0 | 2026-10-18 | E2E is smoke and regression only, smoke ⊆ regression, criterion IDs in test titles |

Looking back, most changes came from "in real use, it slipped out this way": inventing criteria instead of asking, folder rules collapsing through an exception clause, suites that existed in the plan but not in the code. Each time I added a rule, I tried to also write down what it makes us give up.

## Wrapping up

Generating tests is already something agents do well. What is left for people is judging "what does this test treat as the right answer" and "at which layer and at what point should this test run," and this harness is designed to put those judgments in front of a person every time. Three approvals can feel tedious, but I think they are cheap compared with finding a test that enshrined a bug months later.

## References

- [test-layering-harness (GitHub)](https://github.com/seungahhong/seungah-claude-plugins/tree/main/plugins/test-layering-harness)
- Earlier posts — [Ask Before Writing, Doubt After — product-spec-harness](/en/posts/2026-11-21-product-spec-harness/) · [Frontend Harness Engineering](/en/posts/2026-06-04-fe-harness/)
