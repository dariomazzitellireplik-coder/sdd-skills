---
name: sdd-execute
description: Phase 4 of SDD — execute the plan, running phases sequentially and pausing for user approval between each. Use when user says "/sdd-execute" or "/sdd-execute <phase-number>" after plan is approved. Spawns the appropriate subagent per phase (rust-engineer, golang-pro, junior-dev, infra-dev), runs verification, updates state.md current_step.
---

# sdd-execute — Phase 4: implement the plan

Runs the `execution_plan.md` end-to-end, pausing after each phase for human approval. A single invocation drives the whole plan; the user does not re-invoke per phase. See `.claude/sdd/SPEC.md`.

## When invoked

1. **Verify preconditions** in `features/<name>/state.md`:
   - File exists
   - `phase: plan` and `phase_status: approved`, OR
     `phase: execute` and `phase_status: in_progress` (resume mode)
   - Otherwise abort and tell user to complete `/sdd-plan`.

2. **Determine starting phase**:
   - Default: `current_step + 1` (or 1 if null)
   - If user passes `/sdd-execute <N>`: jump to phase N, **warn** if
     skipping intermediate phases.

3. **Load context once**:
   - `state.md`, `requirement.md`, `research.md`, `execution_plan.md`
   - On first phase: also load "Essential files for next phase" from `research.md`

4. **Loop over phases** starting from the determined phase:

   For each phase:

   a. **Pre-execution checks**:
      - If marked `irreversible`: REQUIRE explicit user confirmation,
        showing why rollback is impossible.
      - Show the user: phase objective + task list + verification command + rollback.
      - Wait for "go" / "proceed" / "yes" before doing anything.

   b. **Spawn the appropriate subagent**:
      - Rust tasks → `rust-engineer`
      - Go tasks → `golang-pro`
      - Mechanical tasks with clear plan → `junior-dev`
      - Terraform / infra → `infra-dev`
      - Brief: pass the phase block + relevant context only — NOT the full plan
      - Subagent does the work in its own context, returns a summary

   c. **Run verification command** from the phase exactly as written:
      - Pass → record success, capture diff summary
      - Fail → **DO NOT advance**. Show error and ask user:
        fix-and-retry / rollback / abandon-phase / reframe-and-replan

   d. **Update `state.md`**:
      - `current_step: <N>`
      - Append History entry with phase number + result
      - `phase: execute`, `phase_status: awaiting_approval`

   e. **Pause for user validation**: show diff summary, verification result,
      list of files changed. Ask: "Approve this phase? (yes / iterate /
      rollback / stop)".
      - **yes** → set `phase_status: in_progress`, **continue automatically
        to the next phase in the loop** (no need to re-invoke `/sdd-execute`)
      - **iterate** → loop back to subagent (step b) with user feedback
      - **rollback** → run the phase's rollback strategy, ask how to proceed
      - **stop** → exit cleanly. State is preserved; user can resume later
        with `/sdd-execute` (will continue from `current_step + 1`)

5. **After last phase completes**:
   - `phase: execute`, `phase_status: approved`
   - Suggest `/sdd-review`.

## Compose with these skills based on context

- Per-phase subagent: pick one based on the phase's task type — e.g.
  `rust-engineer` / `golang-pro` / `junior-dev` / `infra-dev` /
  `frontend-developer` (use whichever specialized agent your harness
  has available)
- Language skills: whichever language-specific guidelines skill applies
- Product/domain knowledge → any project-specific knowledge skill
- Codebase exploration when stuck → `zoom-out` (if installed)
- Conversational debugging when something is unclear → `qa` (if installed)

## Anti-patterns

- Do NOT skip the user pause between phases — approval is the contract.
- Do NOT skip verification — even if "obvious" the change works.
- Do NOT execute irreversible phases without explicit confirmation.
- Do NOT modify code outside the phase's "Files to change" list without
  flagging it to the user first.
- Do NOT proceed if verification fails — pause and ask.
- Do NOT load the full `execution_plan.md` into subagent context — pass
  only the relevant phase block.
- Do NOT update `state.md` with `phase_status: approved` until user
  explicitly approves the phase.
