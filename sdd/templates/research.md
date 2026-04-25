<!--
TEMPLATE: research.md
Output of phase 2 (sdd-research). Synthesizes findings from parallel subagents
(Explore for codebase, research-analyst for external, architect-reviewer for
technical options).

DO NOT proceed to plan until this file is approved by the user.
-->

# Research: <feature-name>

## Summary

<!--
2-3 sentence executive summary. What is the headline finding?
What are we recommending and why?
-->

## Codebase Findings

<!--
What already exists that's relevant? File paths with line numbers.
What patterns are in use? What conventions to follow?
What would need to change?

Source: Explore subagent output, condensed.
-->

### Existing patterns

<!--
EVERY entry below MUST include a `file:line` reference. Findings without
file:line are not actionable in later phases.
-->

- `<repo>/<path>:<line>` — <what's there, why it matters>

### Conventions in use

- ...

### What would need to change

- ...

### What we can reuse as-is

- ...

## External Findings

<!--
Papers, library docs, open-source examples, prior art.
Each finding with a link.

Source: research-analyst subagent output, condensed.
-->

- **<title>** ([link](url)) — <one-line takeaway>
- ...

## Options Evaluated

<!--
At least 2 options. Each with pros, cons, and effort estimate.
This is the core of the research — don't skip even if the answer
seems obvious.

Source: architect-reviewer subagent + synthesis.
-->

<!--
Tag each option with its lens to force diversity:
- Minimal: smallest change that satisfies the requirement
- Clean: most idiomatic / "right" architecturally, ignoring effort
- Pragmatic: balance of effort vs longevity for this team
At least 2 options. Pick lenses that make sense for the case.
-->

### Option A: <name> [Minimal|Clean|Pragmatic]

**Description**: <2-3 lines>

**Pros**:
- ...

**Cons**:
- ...

**Effort**: <low / medium / high — and why>

**Risks**: <list>

---

### Option B: <name> [Minimal|Clean|Pragmatic]

**Description**: <2-3 lines>

**Pros**:
- ...

**Cons**:
- ...

**Effort**: <low / medium / high>

**Risks**: <list>

## Recommendation

<!--
Which option wins, and why. Be specific. Reference the trade-offs from above.
If the answer depends on a constraint we should validate with the user, say so.
-->

**Recommended**: Option <X>

**Rationale**: ...

**Open trade-offs surfaced**: <list anything the user must explicitly decide
before sdd-plan>

## Risks Identified

<!--
Beyond per-option risks. Cross-cutting risks: security, data integrity,
ops complexity, dependencies that could shift. Each risk with mitigation
or "to be addressed in plan".
-->

- **<risk>**: <mitigation or "address in plan phase X">
- ...

## Essential files for next phase

<!--
Short list of files the planning/execution agent MUST read before acting.
Keeps context focused. ~5-10 files max.
-->

- `<repo>/<path>` — <one-line why>
- ...

## References

<!-- All sources cited above, plus anything else worth keeping. -->

- [<title>](url)
- ...
