---
name: sdd-requirement
description: Phase 1 of SDD — define the requirement through deep interview using grill-me. Use when user says "/sdd-requirement", "start requirement", or after /sdd-init completes phase 0. Produces requirement.md with FR-### and SC-### IDs and inline [NEEDS CLARIFICATION] markers.
---

# sdd-requirement — Phase 1: capture intent

The grilling phase. Produces a `requirement.md` that's the source of truth for what the feature must do. See `.claude/sdd/SPEC.md` and `.claude/sdd/templates/requirement.md`.

## When invoked

1. **Verify preconditions** in `features/<name>/state.md`:
   - File exists (otherwise tell user to run `/sdd-init` first)
   - `phase: requirement`. If something else, abort and explain.

2. **Load context**:
   - Read `state.md` → get the `input:` field (user's original prompt)
   - Read CLAUDE.md (workspace + current repo)
   - Skim related code if the input mentions specific paths

3. **Decide which knowledge skills to load** based on `input` + cwd
   (see Compose section below).

4. **Conduct grill-me interview**:
   - Invoke the `grill-me` skill (full protocol).
   - Embedded essentials (defense in depth, in case grill-me isn't loaded):
     - One question at a time. Wait for the answer.
     - Always include your recommended answer with each question.
     - Explore the codebase before asking — don't ask what lives in code.
   - Walk the decision tree, covering at minimum:
     - Intent & scope
     - Acceptance criteria (verifiable)
     - Data model implications
     - Error handling & failure modes
     - Observability needs
     - Rollback / migration strategy
     - Security & credentials
     - Performance constraints
     - Backwards compatibility
     - Explicit out-of-scope
   - **DO NOT proceed** until user says "approved" / "requirement is ready".

5. **Write `requirement.md`** following
   `.claude/sdd/templates/requirement.md`:
   - `FR-###` IDs for goals
   - `SC-###` IDs for acceptance criteria (each must be verifiable / testable)
   - `[NEEDS CLARIFICATION: <what>]` inline for any remaining ambiguity
   - Drop optional sections rather than leaving them empty

6. **Show draft, iterate**: print the rendered file. Wait for approve / edit
   / changes. Iterate until the user explicitly approves.

7. **Update `state.md`**:
   - `phase: requirement`, `phase_status: approved`
   - Append History entry

8. **Suggest next**: `/sdd-research`.

## Compose with these skills based on context

- Interview pattern → **`grill-me`** (always, if installed)
- Product framing → `product-manager` subagent (optional, for product features)
- Product/domain knowledge → any project-specific knowledge skill the
  user has installed (e.g. an `<your-product>-overview` skill)
- Language guidance (light, mostly for vocabulary): whichever
  language-specific guidelines skill applies to the codebase

## Anti-patterns

- Do NOT batch questions.
- Do NOT skip grilling because "the requirement seems clear" — surface
  the implicit assumptions anyway.
- Do NOT write `requirement.md` before user approves the grill output.
- Do NOT auto-advance to `/sdd-research`.
- Do NOT modify `state.md` before user approves the requirement draft.
