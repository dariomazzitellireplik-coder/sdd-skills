<!--
TEMPLATE: requirement.md
Output of phase 1 (sdd-requirement). Written AFTER a thorough grill-me
interview. Source of truth for what the feature must do.

DO NOT proceed to research until this file is approved by the user.
-->

# Requirement: <feature-name>

<!--
ID conventions used throughout this doc:
- FR-### → functional requirement / goal (FR-001, FR-002, ...)
- SC-### → success criterion / acceptance criterion (SC-001, SC-002, ...)
- [NEEDS CLARIFICATION: <what>] → use INLINE next to the affected line
  whenever an assumption is uncertain. DO NOT collect them in a separate
  section — inline tags are un-ignorable during review.
-->

## Context & Motivation

<!--
Why are we doing this? What's the trigger? What user/customer/operational
need drives it? Link to the PRD/ticket/incident if it exists.
2-4 paragraphs.
-->

## Goals

<!--
What does this feature DO? Behavior-focused bullets, not implementation.
Each bullet is something a user/operator/system can observe.
Optional: phrase as user story → "As a <role>, I want <X>, so that <Y>".
Use FR-### IDs so tasks/tests can reference them later.
-->

- **FR-001**: ...
- **FR-002**: ...

## Non-Goals

<!--
What is this feature EXPLICITLY NOT doing? This is the most important section
for scope discipline. If something is tempting to add, decide here whether
it's in or out — don't leave it ambiguous.
-->

- ...
- ...

## Acceptance Criteria

<!--
Verifiable criteria. Each one testable: a command run, a metric observed,
a behavior reproduced. If you can't write a test for it, rewrite it until
you can. Use SC-### IDs so review.md can cite them.
-->

- [ ] **SC-001**: ...
- [ ] **SC-002**: ...

## Constraints

<!-- Cover all that apply. Drop sections that don't apply rather than leaving "N/A". -->

### Technical

- ...

### Performance

- ...

### Security & Credentials

- ...

### Backwards Compatibility

- <!-- API/proto/CLI/config changes. Worker N-1 compat? Migration needed? -->

### Time / Effort

- <!-- Hard deadlines, soft targets. Drop if not relevant. -->

## Affected Components

<!--
Which repos / modules / services does this touch? Be specific.
List in order of dependency (the one others depend on first).
-->

- `<repo>/<path>`: <one-line description of change>

## Open Questions

<!--
Questions surfaced during grill-me that DID get answered → move to relevant
section above. Questions still open at end of phase MUST be flagged here
with explicit decision rationale (e.g. "deferred to phase 3 because we need
research findings to decide").
-->

- ...

## Decisions Log

<!--
Key trade-off decisions made during grill-me. Format:
- DECISION: <what was decided>
  - Alternatives considered: <list>
  - Rationale: <why this option won>
-->

- ...
