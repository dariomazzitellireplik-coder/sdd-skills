<!--
TEMPLATE: state.md
Machine-readable phase tracker for an SDD feature. Read by every sdd-* skill
to validate preconditions before acting. Updated automatically by each phase.

DO NOT delete sections. Update fields in frontmatter and append entries to History.
-->

---
feature: <kebab-case-name>
created: YYYY-MM-DD
repo: <repo-name>
# For cross-repo features use:
# scope: cross-repo
# repos: [<repo-a>, <repo-b>]

input: |
  # Verbatim user prompt that originated this feature. Useful to re-ground
  # the agent mid-session if context drifts.
  <paste original user message here>

spec_path: requirement.md
# Relative path (from this state.md) to the requirement file. Helps when
# multiple features are active and skills need to find the right spec.

phase: init
# Allowed values:
# init | requirement | research | plan | execute | review | docs | ship | done

phase_status: in_progress
# Allowed values:
# in_progress | awaiting_approval | approved

current_step: null
# During execute phase only: integer matching plan phase number (1, 2, 3...)
# null otherwise

bypassed_phases: []
# Phases the user explicitly chose to skip. Each entry MUST include reason.
# Example:
#   bypassed_phases:
#     - phase: docs
#       reason: "trivial bugfix, no user-visible change"
---

## History

<!-- Append one line per state transition. Newest at the bottom. Format:
- YYYY-MM-DD HH:MM → <phase> (<phase_status>) [optional note]
-->

- YYYY-MM-DD HH:MM → init (in_progress)

## Open Items

<!--
Gaps detected mid-flight that may require revisiting earlier phases.
Any skill that detects a missing piece (e.g. /sdd-execute notices a
forgotten validation) appends an entry here instead of silently
abandoning the work.

Format:
- YYYY-MM-DD HH:MM [from <skill>] <gap description>.
  Affects: <which files / phases need updating>.

Resolution is manual: edit the affected files (or invoke the relevant
sdd-* skill if the change is non-trivial), then remove the entry from
this section.
-->

- ...

## Notes

<!-- Free-form. Use for cross-cutting context an SDD skill might need next session:
- key decisions confirmed by user
- links to external resources (Linear ticket, Slack thread)
- anything not captured in History or Open Items
-->
