---
name: sdd-plan
description: Phase 3 of SDD — produce execution_plan.md with sequenced phases, tasks (T-### IDs), HITL/AFK markers, verification commands, and rollback strategies. Use when user says "/sdd-plan" after research is approved. Composes grill-me partial for trade-off decisions.
---

# sdd-plan — Phase 3: turn research into actionable plan

Builds the `execution_plan.md` that drives `sdd-execute`. See `.claude/sdd/SPEC.md` and `.claude/sdd/templates/execution_plan.md`.

## When invoked

1. **Verify preconditions** in `features/<name>/state.md`:
   - File exists
   - `phase: research` and `phase_status: approved`
   - Otherwise abort and tell user to complete `/sdd-research`.

2. **Load context**:
   - `state.md`, `requirement.md`, `research.md` (full)
   - The "Essential files for next phase" listed in `research.md`
   - CLAUDE.md (workspace + current repo)

3. **Replan handling**: if `execution_plan.md` already exists, back it up
   to `artifacts/execution_plan.v<N>.md` before overwriting. In the new
   plan's Overview section, note what changed vs the prior version.

4. **Architectural validation (optional)**: for architectural features
   (new integration, new contract, cross-repo change, breaking API),
   spawn the **architect-reviewer** subagent to validate the planned
   approach against system patterns. Skip for bugfixes / small refactors.

5. **Grill on trade-offs (partial)**: invoke `grill-me` only for decisions
   the agent cannot resolve from context alone:
   - Order of phases when multiple orderings are viable
   - Whether a phase should be marked `irreversible` (rollback ambiguity)
   - Borderline scope items (in this plan vs deferred)
   - Subagent assignment when multiple fit

6. **Draft `execution_plan.md`** following the template. Apply these
   enforcement rules:
   - Each phase MUST include tests (unit + integration when applicable)
     OR explicitly justify why not (docs-only, mechanical refactor, etc.)
   - Each phase MUST have an executable `Verification` command — never
     "test it works"
   - Each phase MUST have a `Rollback` or be marked `irreversible` with reason
   - Each task uses format `[T-###] [P?] [HITL|AFK] [FR-###?] description`
   - Prefer vertical slices (tracer-bullet, end-to-end thin) over horizontal
   - Traceability check: at least one task per `FR-###` in `requirement.md`
   - "Cross-cutting > Documentation" lists what `sdd-docs` will update later

7. **Show draft, iterate**: present rendered file, wait for approve / edit.
   Iterate until approved.

8. **Update `state.md`**: `phase: plan`, `phase_status: approved`,
   append History entry.

9. **Suggest next**: `/sdd-execute`.

## Compose with these skills based on context

- Trade-off interview → `grill-me` (partial only, if installed)
- Architectural validation → `architect-reviewer` subagent
- Decomposition assistance → `Plan` built-in subagent
- Product/domain knowledge → any project-specific knowledge skill
- Language guidance: whichever language-specific guidelines skill
  applies to the codebase

## Anti-patterns

- Do NOT skip the test enforcement check.
- Do NOT skip the FR-### traceability check (every requirement covered).
- Do NOT plan horizontal slices when verticals are possible.
- Do NOT produce a phase without `Rollback` (or explicit `irreversible` mark).
- Do NOT write `Verification: "test it works"` — must be executable.
- Do NOT auto-advance to `/sdd-execute`.
- Do NOT overwrite a prior `execution_plan.md` without backup to `artifacts/`.
