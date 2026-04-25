<!--
TEMPLATE: review.md
Output of phase 5 (sdd-review). Aggregates findings from parallel subagents
(code-reviewer, security-auditor, architect-reviewer, performance-engineer)
plus the output of automated checks (test, lint, format, build) for
whichever language(s) the diff touches.

DO NOT proceed to docs until this file shows no blocking issues OR the user
explicitly accepts non-blocking ones.
-->

# Review: <feature-name>

## Summary

<!--
1-2 sentences: overall verdict. Pass / pass-with-issues / fail.
Total blocking vs non-blocking issues.
-->

## Automated Checks

### Tests

```bash
<command run, e.g. cargo test / go test ./... / npm test / pytest>
```

**Result**: <pass / fail with summary>

<!-- Paste relevant output snippets, not the full log. -->

### Static analysis

```bash
<command run, e.g. cargo clippy -- -D warnings / golangci-lint run / eslint . / ruff check>
```

**Result**: <pass / fail with summary>

### Format

```bash
<command run, e.g. cargo fmt --check / gofmt -l . / prettier --check . / ruff format --check>
```

**Result**: <pass / fail>

### Build

```bash
<command run, e.g. cargo build / go build ./... / npm run build / python -m build>
```

**Result**: <pass / fail>

## Subagent Findings

<!--
Each finding MUST include:
- confidence score: 0 / 25 / 50 / 75 / 100
- file:line citation (no flag-and-forget findings)
- explicit action (fix / accept / defer)

Cutoff rule: only confidence ≥ 75 should block sdd-docs.
Confidence 50 → discuss with user. Confidence ≤ 25 → noise, drop.

Citation format: `file:line` or `file:line-line` for ranges.
-->

### code-reviewer

<!-- Consolidated findings: bugs, design issues, anti-patterns. -->

- **[conf:###]** `<file:line>` — <finding> → <action>
- ...

### security-auditor

- **[conf:###]** `<file:line>` — <finding> → <action>
- ...

### architect-reviewer

<!-- Coherence with system architecture, contract violations, scope creep. -->

- **[conf:###]** `<file:line>` — <finding> → <action>
- ...

### performance-engineer
<!-- Only if perf is in scope. Drop section otherwise. -->

- **[conf:###]** `<file:line>` — <finding> → <action>
- ...

## False Positives Excluded

<!--
Findings the reviewers flagged but we explicitly do NOT act on.
Documenting these prevents re-litigation in the next review cycle.

Common categories to exclude:
- Pre-existing issues not introduced by this feature
- Things a linter would catch (let the linter catch them)
- Style preferences without team consensus
- Findings about code outside the diff
- Speculative future-proofing without current evidence
- Duplicates / aggregations of the same issue from different reviewers
-->

- `<file:line>` — <flagged finding> → <reason rejected>
- ...

## Manual QA

<!--
Checklist of behaviors the human (or agent) must verify by exercise,
not by automated tests. Include happy path + edge cases + failure modes.
-->

- [ ] <happy path scenario>
- [ ] <edge case>
- [ ] <failure mode handled>
- ...

## Open Issues

<!--
Derived from Subagent Findings using the confidence cutoff:
- conf ≥ 75 → blocking
- conf 50  → user decides
- conf ≤ 25 → drop (or move to False Positives)
-->

### Blocking (must fix before sdd-docs)

- **[conf:###]** `<file:line>` — <finding>
- ...

### Non-blocking (acceptable, document in CHANGELOG or backlog)

- **[conf:###]** `<file:line>` — <finding>
- ...

## Decision

<!--
Final verdict and what comes next.
- "Proceed to sdd-docs" if pass or non-blocking only
- "Loop back to sdd-execute phase X" if blocking issues found
- "Replan via sdd-plan" if blocking issues require structural changes
-->

**Verdict**: <proceed | loop-back | replan>

**Next action**: <slash command to run>
