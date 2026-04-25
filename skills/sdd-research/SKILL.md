---
name: sdd-research
description: Phase 2 of SDD — deep research on codebase + external sources + technical options. Use when user says "/sdd-research" after requirement is approved. Spawns parallel subagents (Explore, research-analyst, optionally architect-reviewer) and synthesizes findings into research.md.
---

# sdd-research — Phase 2: investigate

Parallel research across codebase, external sources, and architectural options. Synthesizes into `research.md` as input for `sdd-plan`. See `.claude/sdd/SPEC.md` and `.claude/sdd/templates/research.md`.

## When invoked

1. **Verify preconditions** in `features/<name>/state.md`:
   - File exists
   - `phase: requirement` and `phase_status: approved`
   - Otherwise abort and tell user to complete `/sdd-requirement`.

2. **Block on unresolved ambiguity**: if `requirement.md` contains any
   `[NEEDS CLARIFICATION: ...]` markers → push back to `/sdd-requirement`.
   Do not start research with open questions.

3. **Load context**:
   - Read `state.md` (input + spec_path)
   - Read `requirement.md` fully (the brief)
   - Read CLAUDE.md (workspace + current repo)

4. **Brief subagents**: prepare a self-contained prompt for each. At minimum:
   - **Explore** subagent: "Map all files relevant to [requirement summary].
     Report `file:line` refs for each finding. Identify reusable patterns
     and what would need to change."
   - **research-analyst** subagent: "Investigate how others solve [X].
     Cite sources with URLs. Surface alternatives we should consider."
   - Optional 3rd — **architect-reviewer**: include when the feature is
     architectural in nature (new integration, new contract, cross-repo
     change, breaking API). Skip for bugfixes / small refactors / docs.
     Brief: "Given [requirement] and codebase findings, propose 2-3
     technical options labeled [Minimal|Clean|Pragmatic] with
     pros/cons/effort/risks."

5. **Spawn subagents IN PARALLEL** — single message with multiple `Agent`
   tool calls. Wait for all to complete.

6. **Refine on empty results**: if any subagent returns "no findings",
   refine the query once and re-spawn. Second empty pass → document the
   gap explicitly in `research.md`.

7. **Synthesize into `research.md`** following the template:
   - Codebase Findings: `file:line` refs mandatory
   - External Findings: with links
   - Options Evaluated: at least 2, meaningfully different,
     tagged [Minimal|Clean|Pragmatic]
   - Recommendation with rationale
   - Risks Identified
   - Essential files for next phase (5-10 max)
   - References

8. **Show draft, iterate**: present rendered file. Wait for approve / edit.

9. **Update `state.md`**: `phase: research`, `phase_status: approved`,
   append History entry.

10. **Suggest next**: `/sdd-plan`.

## Compose with these skills based on context

- Codebase exploration when context is foggy → `zoom-out` (if installed)
- Product/domain knowledge → any project-specific knowledge skill
- Long research sessions where context grows → `caveman` (if installed)
- Language guidance: whichever language-specific guidelines skill
  applies to the codebase

## Anti-patterns

- Do NOT spawn subagents sequentially — defeats the purpose. Single
  message, multiple `Agent` calls.
- Do NOT include raw subagent output in `research.md` — synthesize and condense.
- Do NOT skip the "Essential files for next phase" section — `sdd-plan` needs it.
- Do NOT propose a single option in Options Evaluated — at least 2.
- Do NOT proceed if `requirement.md` has unresolved
  `[NEEDS CLARIFICATION: ...]` markers — push back to `/sdd-requirement`.
- Do NOT auto-advance to `/sdd-plan`.
