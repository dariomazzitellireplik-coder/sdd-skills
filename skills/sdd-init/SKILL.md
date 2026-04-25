---
name: sdd-init
description: Initialize a new SDD feature folder and state.md tracker. Use when the user wants to start a new spec-driven feature, says "/sdd-init", "new feature", "start sdd flow", or invokes `/sdd-init <feature-name>`. Creates features/<name>/ with state.md initialized to phase=requirement and prompts to run /sdd-requirement next.
---

# sdd-init — Phase 0: bootstrap a feature

Creates the folder, the state.md tracker, and primes the SDD workflow. See `.claude/sdd/SPEC.md` for the full system spec.

## When invoked

1. **Feature name** (kebab-case): use the argument if provided
   (`/sdd-init add-snowflake-sink`). If missing, ask the user.

2. **Scope**: single-repo (default) or cross-repo. Ask explicitly:
   - "Does this feature touch only this repo, or multiple repos?"
   - If cross-repo, ask which repos.

3. **Sanity check**:
   - If scope is cross-repo AND cwd is inside a single repo (not a
     parent workspace): warn `"This is a cross-repo feature but you're
     in <repo>/. Consider re-opening Claude at the workspace root for
     better context. Continue here anyway?"`. Wait for confirmation.
   - If `features/<name>/` already exists: abort with the path to the
     existing `state.md`. Do NOT overwrite.

4. **Pick destination**:
   - single-repo → `<cwd-repo>/features/<name>/`
   - cross-repo  → `<workspace-root>/features/<name>/`

   Assume `features/` is already gitignored at the destination repo.

5. **Create folder + files**:
   - `features/<name>/state.md` (copy from
     `.claude/sdd/templates/state.md`)
   - `features/<name>/artifacts/` (empty dir — later phases write logs,
     plan backups, etc. here)

6. **Initialize state.md**: replace placeholders:
   - `feature: <name>`
   - `created: <today YYYY-MM-DD>`
   - `repo: <repo>` (or `scope: cross-repo` + `repos: [...]`)
   - `input:` block — capture the user's original invocation verbatim
   - `phase: requirement`, `phase_status: in_progress`
   - First History line: `YYYY-MM-DD HH:MM → init (approved)`

7. **Confirm to user**: print
   - Path created
   - State.md path
   - Next step: "Run `/sdd-requirement` to start phase 1."

## Compose with these skills based on context

None — init is pure setup.

## Anti-patterns

- Do NOT auto-invoke `/sdd-requirement`. User controls phase transitions.
- Do NOT skip the cross-repo sanity check — most common source of confusion.
- Do NOT proceed if `features/<name>/` exists — surface the existing state instead.
- Do NOT touch `.gitignore` (assumed already configured).
