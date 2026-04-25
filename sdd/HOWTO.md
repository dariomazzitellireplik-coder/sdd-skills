# How to use the SDD workflow

A practical guide to spec-driven development with these skills. For the full system spec (state machine, templates, rules), see [SPEC.md](SPEC.md).

## What is SDD here

A 9-phase workflow that walks you from a vague feature idea to a merged PR, with persistent state in `features/<name>/` and one slash command per phase. Each phase pauses for your approval — nothing auto-advances.

## When to use SDD

- New integrations / connectors / sinks / sources
- Cross-repo features
- New protocol or connectivity mode
- Refactor that changes a contract (trait, public API, RPC)
- Features touching persistence / data integrity
- Anything > 1 day of work

## When NOT to use SDD

- Trivial bug fixes (≤1 file, clear logic)
- Typos / minor docs
- Dependency bumps
- Mechanical refactors with no behavior change
- Config-only changes

## Quick start (happy path)

```
/sdd-init my-new-feature         # create features/<name>/, init state
/sdd-requirement                  # grill-me interview → requirement.md
/sdd-research                     # parallel subagents → research.md
/sdd-plan                         # → execution_plan.md (you approve)
/sdd-execute                      # runs all phases, pausing for approval
/sdd-review                       # tests + review subagents → review.md
/sdd-docs                         # CHANGELOG, README, ADR if needed
/sdd-ship                         # branch + commit + PR
```

Use `/sdd-status` anytime to see active features.

## The 9 commands

| Command | What it does |
|---|---|
| `/sdd-init <name>` | Bootstrap a feature folder and state.md |
| `/sdd-status` | List active features, current phase, next action |
| `/sdd-requirement` | Interview-driven requirement.md (FR/SC IDs) |
| `/sdd-research` | Parallel codebase + external research |
| `/sdd-plan` | Sequenced execution_plan.md with verification + rollback |
| `/sdd-execute` | Runs the plan one phase at a time, pausing for approval |
| `/sdd-review` | Automated checks + parallel review subagents |
| `/sdd-docs` | Update CHANGELOG, README, ADRs (and version manifests if applicable) |
| `/sdd-ship` | Branch, commit, open PR |

## Where things live

- **`<repo>/features/<name>/`** — for single-repo features
- **`<workspace>/features/<name>/`** — for cross-repo features (when you have a workspace dir containing multiple repos as subdirs)
- `features/` should be gitignored. If a decision deserves history, promote to `docs/decisions/`.

## Where to open Claude Code

| Case | Open in |
|---|---|
| Single-repo feature | The repo (`cd <repo>/`) |
| Cross-repo feature | The workspace root (`cd <workspace>/`) |
| Bugfix / docs | The repo |

## Mid-flight changes (when you discover a gap)

Mid-execute and notice the requirement is missing something? See the [Mid-flight changes section in SPEC.md](SPEC.md). TL;DR:

1. Note the gap in `state.md > Open Items`
2. Edit the affected file (manually or via another agent)
3. Re-run only the affected `/sdd-*` command
4. Remove the entry from Open Items

## Tips

- Skills and subagents are listed in [SPEC.md](SPEC.md) — each `sdd-*` composes the right ones automatically.
- `grill-me` interview style: one question at a time, with a recommended answer. The agent explores the code before asking what's findable in code.
- The agent **never auto-advances** to the next phase. You always invoke the next `/sdd-*` explicitly.
- Want to skip a phase? Just don't invoke it — the next phase will refuse until you do (or you bypass it explicitly via state.md).
- `caveman` skill (separate, manual): activate it with `/caveman` for compressed chat replies on long sessions. The files written to disk stay detailed.
