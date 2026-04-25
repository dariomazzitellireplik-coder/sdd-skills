---
name: sdd-status
description: Show all active SDD features with their current phase and status. Use when the user says "/sdd-status", "list features", "what features are in progress", "show sdd status", or wants an overview of pending SDD work. Supports flags `--all` and `--stale-days <N>`.
---

# sdd-status — At-a-glance feature dashboard

Read-only report of active SDD features, their current phase, and what to do next. See `.claude/sdd/SPEC.md` for the SDD system.

## Flags

- `--all`: if cwd is a workspace root that contains multiple repos as
  subdirectories, scan every subdir's `features/`. Otherwise behaves
  like the default.
- `--stale-days <N>`: threshold (in days since last activity) to flag a feature as stale. Default: 7

## When invoked

1. **Determine scope** to scan:
   - Default: `<cwd>/features/` (current repo or workspace)
   - If cwd contains both a `features/` AND multiple repo
     subdirectories, also scan the workspace-level `features/`
     (cross-repo features index)
   - If `--all`: walk subdirectories of cwd looking for `features/` dirs

2. **For each `state.md` found**:
   - Parse frontmatter: feature, phase, phase_status, current_step, repo,
     created, scope, bypassed_phases
   - Read last History entry (timestamp + transition)

3. **Render a table** sorted by:
   - `done` features at the bottom
   - everything else by last activity descending

   Columns:
   `feature | scope | phase | status | last activity | next action`

4. **Highlight**:
   - `awaiting_approval` → suggest user review/approve
   - `in_progress` and last activity older than `--stale-days` (default 7)
     → flag as **stale**
   - `execute` phase → show `current_step` if available
   - features with `bypassed_phases` → list them with their reason

5. **Print suggested commands** under the table:
   - awaiting_approval → "Run `/sdd-<next-phase>` after approving"
   - stale → "Check state.md Notes for blockers, or resume with the
     appropriate `/sdd-*` command"
   - bypassed phases → list `<phase>: <reason>`

## Compose with these skills based on context

None — pure read-only status reporting.

## Anti-patterns

- Do NOT modify any `state.md`. Read-only operation.
- Do NOT suggest actions for `done` features.
- Do NOT scan paths outside the cwd subtree (avoid scanning all of `~`).
- Do NOT load full state.md History/Notes into context — only frontmatter
  + last History entry, to keep output compact even with many features.
- Do NOT hard-fail if a `state.md` is malformed; log a warning and skip it.
