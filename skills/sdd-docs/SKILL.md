---
name: sdd-docs
description: Phase 6 of SDD — update external documentation after review is approved. Use when user says "/sdd-docs". Updates CHANGELOG, README, ADRs, user docs based on what was implemented. Assumes docstrings and inline comments were already updated during sdd-execute.
---

# sdd-docs — Phase 6: update external documentation

Updates external docs (README, CHANGELOG, ADRs, user-facing docs) based on what was implemented. See `.claude/sdd/SPEC.md`.

## When invoked

1. **Verify preconditions** in `features/<name>/state.md`:
   - `phase: review` and `phase_status: approved`
   - Otherwise abort and tell user to complete `/sdd-review`.

2. **Load context**:
   - `state.md`, `requirement.md`, `execution_plan.md`, `review.md`
   - `Cross-cutting > Documentation` section from `execution_plan.md` (the
     list of docs the plan said would change)
   - Code diff to detect implicit doc impact

3. **Identify docs to touch**:
   - Explicit: from `execution_plan.md > Cross-cutting > Documentation`
   - Implicit: detect from diff (new env vars → env reference, new
     endpoints → API docs, removed flags → migration notes, etc.)

4. **For each doc, propose update with diff-style preview**:
   - Read current content
   - Show proposed change as diff
   - Wait for user approval before writing

5. **Common docs** (when applicable):
   - **`CHANGELOG.md`**: add entry under `[Unreleased]` following Keep a
     Changelog format. Only for user-visible behavior changes.
   - **`README.md`**: only if user-visible behavior changed (new commands,
     env vars, features).
   - **ADR**: if a new architectural decision was made, create
     `docs/decisions/NNN-<title>.md` using
     `.claude/sdd/templates/ADR-FORMAT.md`.
   - Component-specific docs (API docs, internal architecture docs, etc.)

6. **Optional — version bump for releaseable artifacts**:
   - If the repo has an automated release workflow tied to a version
     in a manifest file (e.g. `Cargo.toml`, `package.json`, `pyproject.toml`)
     AND the change has user-visible behavior:
     - Bump per semver (MAJOR/MINOR/PATCH)
     - Regenerate the lockfile if applicable (`cargo build`,
       `npm install`, etc.)
   - Skip this step for libraries/services without a release workflow,
     or when the project's convention is to bump versions at release
     time rather than per-PR.

7. **Show consolidated summary of all proposed changes**, wait for approval.

8. **Update `state.md`**: `phase: docs, phase_status: approved`, append
   History entry.

9. **Suggest next**: `/sdd-ship`.

## Compose with these skills based on context

- Product/domain knowledge (naming, link targets) → any project-specific
  knowledge skill
- ADR template → `.claude/sdd/templates/ADR-FORMAT.md`
- DDD glossary if relevant → `.claude/sdd/templates/LANGUAGE.md`

## Anti-patterns

- Do NOT touch docstrings or code comments here — those belonged in
  `sdd-execute`.
- Do NOT update docs that weren't in `execution_plan.md`'s documentation
  list AND aren't implied by the diff.
- Do NOT skip the version bump if the repo has an automated release
  workflow that depends on it.
- Do NOT auto-write docs without showing diff preview to user.
- Do NOT write CHANGELOG entries for non-user-visible changes (internal
  refactors, test additions, CI changes).
- Do NOT auto-advance to `/sdd-ship`.
