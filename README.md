# sdd-skills

> A 9-phase **Spec-Driven Development** workflow for [Claude Code](https://claude.ai/code), distributed as installable skills.

You write the requirement. Claude grills you on it. Then it researches, plans, executes, reviews, documents, and ships — pausing for your approval between phases. State is persisted on disk in `features/<name>/` so any session can pick up where the last one left off.

No magic, no auto-advance. Just a disciplined pipeline that forces depth before code.

```
init ─→ requirement ─→ research ─→ plan ─→ execute ─→ review ─→ docs ─→ ship ─→ done
```

## Install

Pick **one** of the two patterns:

### Global (recommended) — skills available in every project

```bash
npx @dariomazzitelli/sdd-skills install
```

Installs the 9 SDD skills + 5 companion utilities to `~/.claude/skills/` and the SDD reference docs (templates, SPEC, HOWTO) to `./.claude/sdd/` in the current project.

### Local — everything scoped to one project

```bash
npx @dariomazzitelli/sdd-skills install --local
```

Installs both skills and docs under `./.claude/`. Useful when you want a project to be self-contained or pin a specific SDD version per repo.

### Why the split?

Skills are reusable across projects, so they default to your home dir. The `sdd/` directory holds **templates** (`requirement.md`, `execution_plan.md`, `state.md`, etc.) that the skills reference using project-relative paths — those, plus your `features/` working state, naturally belong in the project. `--local` keeps both together if you prefer.

## Quick start

```bash
# 1. Install
npx @dariomazzitelli/sdd-skills install

# 2. Add features/ to your repo's .gitignore
echo "features/" >> .gitignore

# 3. Open Claude Code in your project and run:
/sdd-init my-feature
/sdd-requirement
/sdd-research
/sdd-plan
/sdd-execute
/sdd-review
/sdd-docs
/sdd-ship
```

Each command pauses for your approval before advancing. Run `/sdd-status` anytime to see active features.

## The 9 phases

| Phase | Skill | What it produces |
|---|---|---|
| 0 | `sdd-init` | `features/<name>/` folder + `state.md` tracker |
| 1 | `sdd-requirement` | `requirement.md` (interview-driven, with FR/SC IDs) |
| 2 | `sdd-research` | `research.md` (codebase + external + options evaluated, in parallel) |
| 3 | `sdd-plan` | `execution_plan.md` (sequenced phases with verification + rollback) |
| 4 | `sdd-execute` | Code + tests, one phase at a time, with pauses for approval |
| 5 | `sdd-review` | `review.md` (automated checks + parallel review subagents) |
| 6 | `sdd-docs` | Updates CHANGELOG, README, ADRs, version manifests |
| 7 | `sdd-ship` | Branch + commit + PR (Conventional Commits) |
| — | `sdd-status` | Read-only dashboard of active features |

Full system spec: [`sdd/SPEC.md`](sdd/SPEC.md). Practical how-to: [`sdd/HOWTO.md`](sdd/HOWTO.md).

## Why SDD

Most coding agents either over-execute (build before understanding) or over-discuss (talk forever, never ship). SDD splits the difference: front-load the depth in phases 1-3, then execute mechanically with verification gates.

It's particularly useful for:
- Features that span multiple modules or repos
- Refactors that change a public API or contract
- Anything that introduces new persistence or schema migrations
- Features with non-trivial state, concurrency, or correctness requirements
- Anything > 1 day of work

It's **not** the right tool for trivial bug fixes, dependency bumps, typos, or mechanical refactors.

## Companion utilities (bundled)

The CLI also installs 5 general-purpose skills that the SDD phases lean on. They're useful on their own, but a few SDD skills compose with them directly (e.g. `sdd-requirement` and `sdd-plan` invoke `grill-me`).

| Skill | What it does |
|---|---|
| `grill-me` | Interview pattern — one question at a time, each with a recommended answer |
| `zoom-out` | Codebase exploration helper — go up a layer of abstraction |
| `caveman` | Ultra-compressed output mode (~75% fewer tokens) for long sessions |
| `qa` | Conversational QA — user reports bugs, agent files GitHub issues with codebase context |
| `write-a-skill` | Meta-skill for authoring new skills with proper structure |

The SDD pipeline runs fine without explicitly invoking them; they just enrich specific phases when triggered.

## CLI reference

```
sdd-skills <command> [options]

Commands:
  install               Install skills + sdd/ docs
  update                Re-install over existing files (same as install --force)
  uninstall             Remove skills and docs
  list                  Show installed skills and their location
  help                  Show usage
  version               Show CLI version

Options:
  --local               Install skills to ./.claude/skills/ instead of ~/.claude/skills/
  --skills-only         Only operate on the 9 skill folders
  --docs-only           Only operate on .claude/sdd/
  --force               Overwrite existing files
  --target <path>       Custom skills target dir (advanced)
```

## Updating

```bash
npx @dariomazzitelli/sdd-skills update          # re-install over existing files
# or
npx @dariomazzitelli/sdd-skills@latest install --force
```

## Uninstalling

```bash
npx @dariomazzitelli/sdd-skills uninstall          # global skills + project docs
npx @dariomazzitelli/sdd-skills uninstall --local  # local skills + project docs
```

## Project layout (after install)

```
~/.claude/skills/
  sdd-init/SKILL.md
  sdd-requirement/SKILL.md
  sdd-research/SKILL.md
  sdd-plan/SKILL.md
  sdd-execute/SKILL.md
  sdd-review/SKILL.md
  sdd-docs/SKILL.md
  sdd-ship/SKILL.md
  sdd-status/SKILL.md
  grill-me/SKILL.md
  zoom-out/SKILL.md
  caveman/SKILL.md
  qa/SKILL.md
  write-a-skill/SKILL.md

<your-project>/
  .claude/sdd/
    SPEC.md           # system spec
    HOWTO.md          # user-facing how-to
    templates/        # requirement.md, execution_plan.md, state.md, ...
    references/tdd/   # TDD reference notes
  features/           # gitignored: working state for in-flight features
    <feature-name>/
      state.md
      requirement.md
      research.md
      execution_plan.md
      review.md
      artifacts/
```

## Contributing

Issues and PRs welcome. The skills themselves live under `skills/` and the system docs under `sdd/`. Edits to either are picked up the next time someone runs `npx @dariomazzitelli/sdd-skills install --force`.

## Credits

The 9 SDD skills (`skills/sdd-*`) and CLI are original to this project.

The 5 companion skills under `skills/{grill-me,zoom-out,caveman,qa,write-a-skill}/` are copied verbatim from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT). The "caveman mode" concept that `skills/caveman` implements originated in [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) (MIT) — credit for the underlying idea belongs to Julius Brussee.

Several reference materials in `sdd/templates/` and `sdd/references/tdd/` are also adapted from Matt Pocock's work.

See [NOTICES.md](NOTICES.md) for the full third-party license texts.

## License

MIT — see [LICENSE](LICENSE). Bundled third-party content retains its own MIT terms; see [NOTICES.md](NOTICES.md).
