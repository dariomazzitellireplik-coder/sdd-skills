---
name: sdd-review
description: Phase 5 of SDD — review the implementation: run automated checks (tests, linters, formatter, build) then spawn parallel review subagents (code-reviewer, security-auditor, architect-reviewer, optionally performance-engineer), apply confidence scoring, and synthesize into review.md. Use when user says "/sdd-review" after execute is complete.
---

# sdd-review — Phase 5: review the implementation

Combines automated checks (tests, linters, build) with parallel subagent reviews. Synthesizes findings with confidence scoring into `review.md`. See `.claude/sdd/SPEC.md` and `.claude/sdd/templates/review.md`.

## When invoked

1. **Verify preconditions** in `features/<name>/state.md`:
   - `phase: execute` and `phase_status: approved`
   - Otherwise abort and tell user to complete `/sdd-execute`.

2. **Load context**:
   - `state.md`, `requirement.md`, `execution_plan.md`
   - Code diff for the feature (`git diff <base-branch>`)
   - Detect language(s) in the diff to know which checks to run

3. **Run automated checks** (sequentially, fail-fast):
   - Tests: `cargo test` / `go test ./...` / `npm test` / etc.
   - Static analysis: `cargo clippy -- -D warnings` / `golangci-lint` / etc.
   - Format: `cargo fmt --check` / `gofmt -l` / etc.
   - Build: `cargo build` / `go build` / etc.
   - Capture output, summarize pass/fail per check.

4. **If any automated check FAILS**:
   - Show failures
   - Ask user: fix-and-retry / accept-as-known-issue / abandon-review
   - DO NOT spawn subagent reviews until checks pass or user accepts.

5. **Spawn review subagents IN PARALLEL** (single message, multiple Agent calls):
   - `code-reviewer`: bugs, design issues, anti-patterns
   - `security-auditor`: credentials, injection, auth, data leaks
   - `architect-reviewer`: coherence with system architecture, contract
     violations, scope creep
   - `performance-engineer`: ONLY if perf was in scope (check `SC-###`
     in requirement.md)
   - Each receives: feature summary + diff + relevant context
   - Each MUST return findings with confidence score `[0/25/50/75/100]`
     and `file:line` citations

6. **Apply confidence cutoff**:
   - `conf >= 75` → blocking
   - `conf == 50` → user decides
   - `conf <= 25` → drop to "False Positives Excluded"

7. **Optional QA pass**: if requirement has acceptance criteria not covered
   by automated tests, invoke the `qa` skill for conversational verification
   of edge cases.

8. **Synthesize into `review.md`** following the template:
   - Summary (verdict: pass / pass-with-issues / fail)
   - Automated Checks output
   - Subagent Findings (with confidence + `file:line`)
   - False Positives Excluded
   - Manual QA checklist (derived from `requirement.md` SC-###)
   - Open Issues (blocking vs non-blocking)
   - Decision (proceed / loop-back / replan)

9. **Show draft, iterate**: user can disagree with findings, move blocking
   → non-blocking, etc. Wait for explicit approval.

10. **Update `state.md`** based on Decision:
    - `proceed` → `phase: review, phase_status: approved`
    - `loop-back` → `phase: execute, phase_status: in_progress` (note in
      History which phase number to retry)
    - `replan` → `phase: plan, phase_status: in_progress`

11. **Suggest next**:
    - `proceed` → `/sdd-docs`
    - `loop-back` → `/sdd-execute` (resumes from the phase to retry)
    - `replan` → `/sdd-plan`

## Compose with these skills based on context

- Subagents (always): `code-reviewer`, `security-auditor`, `architect-reviewer`
- Subagent (conditional): `performance-engineer` (when perf in scope)
- Conversational QA → `qa` (if installed)
- Product/domain knowledge → any project-specific knowledge skill
- Language guidance based on the diff: whichever language-specific
  guidelines skill applies

## Anti-patterns

- Do NOT spawn review subagents if automated checks failed (and user
  hasn't explicitly accepted them as known issues).
- Do NOT include findings without `file:line` citations.
- Do NOT auto-accept conf=50 findings — user decides.
- Do NOT advance to `/sdd-docs` with blocking issues unresolved.
- Do NOT mix automated check results (pass/fail) with subagent findings
  (confidence). They live in different sections of `review.md`.
- Do NOT spawn subagents sequentially — single message, multiple Agent calls.
