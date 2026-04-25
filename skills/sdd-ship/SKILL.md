---
name: sdd-ship
description: Phase 7 (final) of SDD — create branch, commits, and open PR. Use when user says "/sdd-ship" after docs is approved. Uses feature branches and conventional commits. Does NOT handle release tagging — that's a separate step.
---

# sdd-ship — Phase 7: open the PR

Final SDD phase. Creates branch (if needed), commits, opens PR. Does NOT handle release tagging — that's a separate manual step (follow your project's release procedure).

## When invoked

1. **Verify preconditions** in `features/<name>/state.md`:
   - `phase: docs` and `phase_status: approved`
   - Otherwise abort and tell user to complete `/sdd-docs`.

2. **Load context**:
   - `state.md`, `requirement.md`, `execution_plan.md`, `review.md`
   - Git status + diff

3. **Branch management**:
   - Check current branch (`git branch --show-current`)
   - If on `main`: create `<type>/<feature-name>` where type ∈
     `feat | fix | refactor | chore | docs | perf | security | test`.
     Pick type based on `requirement.md` and diff content.
   - If on a feature branch: confirm it's the right one for this feature.

4. **Stage + commit**:
   - Show `git status`
   - Stage specific files (NEVER `git add -A` — avoid accidental secrets)
   - Compose commit message following Conventional Commits:
     - `<type>: <description>` (first line < 72 chars)
     - Body for context, separated by blank line
   - Respect any commit-message conventions defined in the project's
     CLAUDE.md (e.g. opting out of `Co-Authored-By` or "Generated with"
     footers). Default to including no automated footers unless the
     project explicitly asks for them.
   - Show user, get approval, then commit.

5. **Push**: `git push -u origin <branch>`

6. **Create PR**:
   - Title: `<type>: <description>` (matches commit format)
   - Body via HEREDOC:
     - Summary (bullets)
     - Test plan (checklist derived from `review.md` Manual QA)
     - Optional: reference to feature folder (e.g., "Spec: features/<name>/")
   - `gh pr create ...`
   - Show PR URL to user.

7. **Update `state.md`**:
   - `phase: done`, `phase_status: approved`
   - Append History entry with PR URL

8. **Final message**:
   - Summary of what was shipped
   - PR URL
   - Reminder: "Merge when ready. If a release is needed, follow your
     project's release procedure."

## Compose with these skills based on context

- Project ops/procedures → any project-specific knowledge skill that
  documents PR/release conventions

## Anti-patterns

- Do NOT commit or push directly to `main` — always feature branch.
- Do NOT add commit footers (`Co-Authored-By`, "Generated with X", etc.)
  unless the project's CLAUDE.md explicitly asks for them.
- Do NOT use `--no-verify` or `--force` without explicit user authorization.
- Do NOT use `git add -A` — stage specific files to avoid secrets.
- Do NOT include `features/<name>/` in the commit (should be gitignored).
- Do NOT handle release tagging here — out of scope for `sdd-ship`.
