<!--
TEMPLATE: execution_plan.md
Output of phase 3 (sdd-plan). Sequenced, atomic phases with checkpoints,
verification commands, and rollback strategies. Each phase implementable
and testable in isolation.

DO NOT proceed to execute until this file is approved by the user.
Re-runs of sdd-plan create artifacts/execution_plan.v<N>.md backup.
-->

# Execution Plan: <feature-name>

<!--
Conventions used throughout this plan:
- Phases are flexible (use as many as needed). Number them 1, 2, 3...
- Tasks within a phase use IDs: T-001, T-002, ... (unique across the plan)
- [P] marker on a task = safe to run in parallel with other [P] tasks
  in the same phase (different files, no shared state)
- [HITL] = needs human-in-the-loop checkpoint (review/decision/credentials)
- [AFK] = safe to run unattended
- Each task SHOULD reference the FR-###/SC-### it satisfies (when applicable)
- Prefer vertical slices (tracer-bullet: end-to-end thin) over horizontal
  (file-by-file). A failing slice surfaces integration issues earlier.
-->

## Overview

<!--
1-2 paragraphs: high-level approach, why phases are ordered this way,
what depends on what.
-->

## Total estimated effort

<!-- Sum of phase efforts. Be honest. -->

- ...

## Cross-cutting concerns

<!-- Things that apply across multiple phases. -->

### Testing strategy
<!-- Unit tests where, integration tests where, E2E if any. -->

### Observability
<!-- New metrics, logs, alerts. Where they go. -->

### Security
<!-- Credentials, encryption, IAM changes, secrets management. -->

### Documentation
<!-- What docs need updating. Handled in phase 6 (sdd-docs) but listed here. -->

## Out of scope

<!-- Explicitly deferred. Each item with reason. -->

- ...

---

## Phase 1: <descriptive name>

### Objective
<!-- 1 sentence: what is true at the end of this phase that wasn't before. -->

### Tasks

<!--
Format: [T-###] [P?] [HITL|AFK] [FR-###?] Description
- T-### → unique task ID
- [P]   → parallel-safe (omit if sequential)
- [HITL]/[AFK] → human checkpoint or unattended
- [FR-###] → traceability to requirement (when applicable)
-->

- [ ] [T-001] [AFK] [FR-001] <description>
- [ ] [T-002] [P] [AFK] [FR-002] <description>
- [ ] [T-003] [HITL] <description requiring human decision>

### Files to change

- `<path>`: <what changes>
- ...

### Verification
<!--
Executable command(s) that prove this phase is complete.
Not "test it works" — a literal command and its expected output.
-->

```bash
<command>
# Expected: <output or behavior>
```

### Rollback
<!--
How to undo this phase if subsequent phases fail.
If rollback is non-trivial or impossible, mark as `irreversible`
and require explicit user confirmation before sdd-execute proceeds.
-->

- ...

### Estimated effort

- <S / M / L — and rough hours>

### Subagent / skill to use

<!-- Which subagent (rust-engineer, golang-pro, junior-dev, infra-dev) and
which knowledge skill (rust-guidelines, terraform-guidelines, etc.) -->

- Subagent: ...
- Skills: ...

---

## Phase 2: <descriptive name>

### Objective
- ...

### Files to change
- ...

### Verification
```bash
...
```

### Rollback
- ...

### Estimated effort
- ...

### Subagent / skill to use
- ...

---

<!-- Repeat for additional phases. -->

## Dependencies between phases

<!--
ASCII or list of which phase blocks which. Helps when a phase fails and
we need to figure out what's still safe to do.
-->

```
1 ─→ 2 ─→ 3
       └─→ 4 (parallel after 2)
```

## Confirmed irreversible phases

<!-- List any phase marked `irreversible` in Rollback. These need user
confirmation in sdd-execute before running. -->

- Phase X: <reason>
