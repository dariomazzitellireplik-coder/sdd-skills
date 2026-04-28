# SDD — System Spec

Source of truth for the Spec-Driven Development workflow.

## Principles

1. **On-demand, not automatic.** The flow is triggered with `/sdd-*` slash commands. Small tasks should not use SDD.
2. **Force depth before coding.** Phases 1-3 (requirement, research, plan) prioritize questions and exploration over speed. Each skill blocks advancement until the current phase is approved.
3. **State on disk, not in memory.** Each feature lives in `features/<name>/` with versioned files. Any new session can resume from the last state.
4. **Composition over monolith.** Each SDD skill invokes subagents (parallel, isolated work) and knowledge skills (language, domain, etc.) as needed.
5. **Traceability.** Every decision is recorded in files, not in ephemeral chat.

## Where features live

| Case | Location of `features/<name>/` |
|---|---|
| Touches a single repo | `<repo>/features/<name>/` |
| Touches multiple repos | `<workspace-root>/features/<name>/` (cross-repo index) + `<repo>/features/<name>/` in each affected repo |

`features/` should be in `.gitignore` for each repo and at the workspace root. If a feature produces decisions worth keeping (architectural, critical contracts), they should be promoted manually to `docs/decisions/` (or your repo's equivalent).

## Where to open Claude Code

| Case | Where to open Claude Code |
|---|---|
| Single-repo feature | In the repo (`cd <repo>/`) |
| Cross-repo feature | At the workspace root (`cd <workspace>/`) |
| Cross-repo architectural discussion | At the workspace root |
| Local bugfix / refactor / docs | In the repo |

`sdd-init` validates scope: if you declare cross-repo from a single repo subdir, it warns and suggests reopening Claude at the workspace root.

## `features/<name>/` structure

```
features/<feature-name>/
  state.md              ← phase tracker (machine-readable)
  requirement.md        ← what + why + acceptance criteria
  research.md           ← codebase + external + options evaluated
  execution_plan.md     ← phases with checkpoints
  review.md             ← test/QA/code-review results
  artifacts/            ← logs, captures, command output, plan backups
```

Naming: `<feature-name>` in kebab-case, descriptive, no type prefix.

## State machine

```
init ─→ requirement ─→ research ─→ plan ─→ execute ─→ review ─→ docs ─→ ship ─→ done
              ↑             ↑         ↑        │
              └─────────────┴─────────┴────────┘  (any phase can loop back)
```

`sdd-plan` may be invoked multiple times (replan); it rewrites `execution_plan.md` after backing up the previous version to `artifacts/execution_plan.v<N>.md`.

## `state.md` format

```markdown
---
feature: <feature-name>
created: 2026-04-25
repo: <repo-name>             # or "scope: cross-repo" + "repos: [<a>, <b>]"
phase: research               # init | requirement | research | plan | execute | review | docs | ship | done
phase_status: in_progress     # in_progress | awaiting_approval | approved
current_step: 3               # only during execute: phase number from the plan
---

## History
- 2026-04-25 14:10 → init
- 2026-04-25 14:12 → requirement (in_progress)
- 2026-04-25 15:30 → requirement (approved)
- 2026-04-25 15:31 → research (in_progress)
```

Each skill reads `state.md` to validate preconditions and writes the resulting transition.

## Pipeline skills (9)

| Skill | Input | Output | Subagents | Composed skills |
|---|---|---|---|---|
| `sdd-init` | name + scope (single/cross-repo) | creates `features/<name>/` + `state.md` with `phase: requirement` | — | — |
| `sdd-requirement` | interactive conversation | `requirement.md` with mandatory sections | optional `product-manager` | **`grill-me`** (embed + invoke) |
| `sdd-research` | approved `requirement.md` | synthesized `research.md` | **`Explore`** + **`research-analyst`** + **`architect-reviewer`** in parallel | optional knowledge / language skills |
| `sdd-plan` | `requirement.md` + `research.md` | `execution_plan.md` with phases + checkpoints + success criteria | `architect-reviewer` validates; `Plan` decomposes | partial `grill-me` (trade-offs); language guidelines |
| `sdd-execute` | approved `execution_plan.md` + phase number | updates `state.md`, makes changes, pauses at end of each phase | per-phase: `rust-engineer` / `golang-pro` / `junior-dev` / `infra-dev` (whichever fits) | language / domain skills as applicable |
| `sdd-review` | feature with execute completed | `review.md` with aggregated findings | `code-reviewer` + `security-auditor` + `architect-reviewer` + `performance-engineer` in parallel; runs language test/lint/format commands | `qa` (conversational QA) |
| `sdd-docs` | approved review | updates `CHANGELOG.md`, `README.md`, `docs/` | — | optional documentation skills |
| `sdd-ship` | approved docs | branch + commits + PR (release is separate) | — | project-specific ops/PR conventions |
| `sdd-status` | (none) | lists active features with their current phase | — | — |

## Mandatory artifact sections

**`requirement.md`** — minimum sections:
- Context & motivation
- Goals (what it does)
- Non-goals (what it does NOT do)
- Acceptance criteria (verifiable)
- Constraints (technical, time, compatibility)
- Open questions (resolved in grill-me, or flagged)

**`research.md`** — minimum sections:
- Codebase findings (what already exists, file:line references)
- External findings (papers, docs, alternatives, with links)
- Options evaluated (pros/cons matrix, at least 2 options)
- Recommendation (with justification)
- Risks identified

**`execution_plan.md`** — minimum sections:
- Overview
- Numbered phases, each with: `objective`, `files_to_change`, `verification` (executable command, never "test it works"), `rollback`, `estimated_effort`
- Cross-cutting concerns (testing strategy, observability, security)
- Out-of-scope

**`review.md`** — minimum sections:
- Test results (command output)
- Static analysis (lint, format)
- Subagent findings (consolidated from code-reviewer / security / architect / perf)
- Manual QA checklist
- Open issues (blocking vs non-blocking)

## Mid-flight changes (iterating backwards)

If at any phase you discover that something is missing in an earlier phase (typical: during `sdd-execute` you realize the `requirement.md` doesn't cover an edge case), follow this pattern — **there is no automatic "iteration mode"**:

1. **Record the gap in `state.md > Open Items`** with timestamp, the skill that detected it, what's missing, which files/phases are affected. This is the only structured part of the loop-back flow.

2. **Decide the scope of the change**:
   - **Small change** (add an FR, tweak a test, edge case): edit the affected file (`requirement.md`, `execution_plan.md`, etc.) directly — yourself or via a non-SDD agent invocation. Then continue normally.
   - **Large change** (rethink, new research needed, materially different scope): re-invoke the appropriate SDD skill (`/sdd-requirement`, `/sdd-research`, `/sdd-plan`). It will detect that you're going backwards and record the regression in History.

3. **Re-run only the affected skills**, not everything from scratch. E.g. if only the plan changes, you don't need to re-run `sdd-requirement` or `sdd-research`.

4. **Remove the entry from `Open Items`** once resolved.

Why this pattern instead of something automatic: no SDD framework on the market (spec-kit, Kiro, BMAD, OpenSpec) has a working "iteration mode" yet — it's an open community problem. For a small team, manual edits + selective re-runs is more reliable than delta-aware automatic logic.

## Anti-rush rules

**`sdd-requirement`**: applies `grill-me` (one question at a time, recommendation included with each, explore code before asking). Does NOT write `requirement.md` until the user explicitly says "approved". Covers at minimum: intent & scope, acceptance criteria, data model, error handling, observability, rollback, security, performance, backwards compat, out-of-scope.

**`sdd-research`**: spawn at least 2 subagents (codebase + external) in parallel. If research returns "nothing relevant", force a second pass with refined queries.

**`sdd-plan`**: every phase with executable `verification` and a defined `rollback`. If a phase has no clear rollback → mark as `irreversible` and require extra human confirmation.

**`sdd-execute`**: pause at the end of each phase. Show diff summary + verification result. Does not advance without explicit OK.

## Bypass rules

**Do NOT use SDD for:**
- Trivial bug fixes (≤1 file, clear logic)
- Typos / minor docs
- Dependency bumps
- Mechanical refactors with no behavior change
- Config / env-var changes without code

**Use SDD for:**
- Features that span multiple modules or repos
- Refactors that change a public API or contract (trait, RPC, schema)
- Anything that introduces new persistence or schema migrations
- Features with non-trivial state, concurrency, or correctness requirements
- Anything bigger than ~1 day of work

## Composition with knowledge skills

Each SDD `SKILL.md` ends with a standardized section `## Compose with these skills based on context`, listing which optional skills (language guidelines, domain knowledge, interview patterns, etc.) to load when relevant. The main Claude session reads that section and loads skills as applicable.

This package only ships the 9 SDD pipeline skills + the `sdd/` reference docs. The skills reference utilities like `grill-me`, `zoom-out`, `caveman`, `qa`, `write-a-skill` — those are independent and can be installed separately. SDD works without them; they just enrich specific phases.

## File layout (after install)

```
.claude/
  skills/
    sdd-init/SKILL.md
    sdd-requirement/SKILL.md
    sdd-research/SKILL.md
    sdd-plan/SKILL.md
    sdd-execute/SKILL.md
    sdd-review/SKILL.md
    sdd-docs/SKILL.md
    sdd-ship/SKILL.md
    sdd-status/SKILL.md
  sdd/
    SPEC.md                          ← this document
    HOWTO.md                         ← user-facing how-to
    templates/
      state.md
      requirement.md
      research.md
      execution_plan.md
      review.md
      ADR-FORMAT.md
      LANGUAGE.md
      CONTEXT-FORMAT.md
    references/
      tdd/                           ← TDD reference notes
        tests.md
        mocking.md
        refactoring.md
        deep-modules.md
        interface-design.md
```

When skills are installed globally (in `~/.claude/skills/`), the `.claude/sdd/` directory is still expected to live at the project root, because templates are referenced project-relative and `features/` lives in the project too.

## Credits

Templates `LANGUAGE.md`, `CONTEXT-FORMAT.md`, `ADR-FORMAT.md`, and the TDD reference notes under `references/tdd/` are adapted from Matt Pocock's work — see his materials for the canonical versions.
