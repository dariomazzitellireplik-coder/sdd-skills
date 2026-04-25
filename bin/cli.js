#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const PKG_ROOT = path.resolve(__dirname, '..');
const SKILLS_SRC = path.join(PKG_ROOT, 'skills');
const SDD_SRC = path.join(PKG_ROOT, 'sdd');

const VERSION = require(path.join(PKG_ROOT, 'package.json')).version;

const SKILL_NAMES = [
  'sdd-init',
  'sdd-requirement',
  'sdd-research',
  'sdd-plan',
  'sdd-execute',
  'sdd-review',
  'sdd-docs',
  'sdd-ship',
  'sdd-status',
];

function parseArgs(argv) {
  const args = { _: [], flags: {} };
  for (const a of argv) {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      args.flags[k] = v === undefined ? true : v;
    } else {
      args._.push(a);
    }
  }
  return args;
}

function help() {
  console.log(`sdd-skills v${VERSION}

A 9-phase Spec-Driven Development workflow for Claude Code.

Usage:
  sdd-skills <command> [options]

Commands:
  install               Install skills (global by default) and sdd/ docs (project-local)
  update                Re-install over existing files (same as install --force)
  uninstall             Remove skills and sdd/ docs
  list                  List installed skills and their location
  help                  Show this help
  version               Show CLI version

Options:
  --local               Install skills to ./.claude/skills/ instead of ~/.claude/skills/
  --skills-only         Only install/update/uninstall the 9 skill folders
  --docs-only           Only install/update/uninstall the .claude/sdd/ docs
  --force               Overwrite existing files
  --target <path>       Custom target dir (overrides --local default; advanced)

Layout produced by 'install' (default):
  ~/.claude/skills/sdd-*/SKILL.md     (skills, global)
  ./.claude/sdd/                       (templates, SPEC, HOWTO — project-local)

Why split: skills are reusable across projects, but sdd/ holds templates and
docs the skills reference project-relative; features/ also lives in the project.

Examples:
  npx @dariomazzitelli/sdd-skills install
  npx @dariomazzitelli/sdd-skills install --local
  npx @dariomazzitelli/sdd-skills update
  npx @dariomazzitelli/sdd-skills install --skills-only --target ~/.claude/skills/
  npx @dariomazzitelli/sdd-skills uninstall --local
`);
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function rmRecursive(target) {
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function resolveSkillsTarget(flags) {
  if (flags.target) return path.resolve(flags.target);
  if (flags.local) return path.resolve(process.cwd(), '.claude/skills');
  return path.join(os.homedir(), '.claude/skills');
}

function resolveDocsTarget() {
  return path.resolve(process.cwd(), '.claude/sdd');
}

function installSkills(target, force) {
  fs.mkdirSync(target, { recursive: true });
  let installed = 0;
  let skipped = 0;
  for (const name of SKILL_NAMES) {
    const src = path.join(SKILLS_SRC, name);
    const dest = path.join(target, name);
    if (exists(dest) && !force) {
      console.log(`  skip  ${name}  (already exists, use --force to overwrite)`);
      skipped++;
      continue;
    }
    if (exists(dest)) rmRecursive(dest);
    copyRecursive(src, dest);
    console.log(`  ok    ${name}`);
    installed++;
  }
  console.log(`Skills: ${installed} installed, ${skipped} skipped → ${target}`);
}

function installDocs(target, force) {
  if (exists(target) && !force) {
    console.log(`  skip  ${target}  (already exists, use --force to overwrite)`);
    console.log(`Docs:  0 installed, 1 skipped`);
    return;
  }
  if (exists(target)) rmRecursive(target);
  copyRecursive(SDD_SRC, target);
  console.log(`  ok    .claude/sdd/`);
  console.log(`Docs:  installed → ${target}`);
}

function uninstallSkills(target) {
  let removed = 0;
  for (const name of SKILL_NAMES) {
    const dest = path.join(target, name);
    if (exists(dest)) {
      rmRecursive(dest);
      console.log(`  rm    ${name}`);
      removed++;
    }
  }
  console.log(`Skills: ${removed} removed from ${target}`);
}

function uninstallDocs(target) {
  if (exists(target)) {
    rmRecursive(target);
    console.log(`  rm    ${target}`);
  } else {
    console.log(`  skip  ${target}  (not present)`);
  }
}

function cmdInstall(args, mode) {
  const force = !!args.flags.force || mode === 'update';
  const skillsOnly = !!args.flags['skills-only'];
  const docsOnly = !!args.flags['docs-only'];

  if (skillsOnly && docsOnly) {
    console.error('Cannot combine --skills-only and --docs-only.');
    process.exit(2);
  }

  const skillsTarget = resolveSkillsTarget(args.flags);
  const docsTarget = resolveDocsTarget();

  console.log(`sdd-skills ${mode} (force=${force ? 'yes' : 'no'})`);
  console.log('');

  if (!docsOnly) {
    console.log('Installing skills...');
    installSkills(skillsTarget, force);
    console.log('');
  }

  if (!skillsOnly) {
    console.log('Installing project docs (.claude/sdd/)...');
    installDocs(docsTarget, force);
    console.log('');
  }

  console.log('Done.');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Make sure your project has features/ in .gitignore');
  console.log('  2. Open Claude Code and run /sdd-init <feature-name>');
  console.log('  3. See .claude/sdd/HOWTO.md for the full workflow');
}

function cmdUninstall(args) {
  const skillsOnly = !!args.flags['skills-only'];
  const docsOnly = !!args.flags['docs-only'];

  if (skillsOnly && docsOnly) {
    console.error('Cannot combine --skills-only and --docs-only.');
    process.exit(2);
  }

  const skillsTarget = resolveSkillsTarget(args.flags);
  const docsTarget = resolveDocsTarget();

  console.log(`sdd-skills uninstall`);
  console.log('');

  if (!docsOnly) {
    console.log('Removing skills...');
    uninstallSkills(skillsTarget);
    console.log('');
  }

  if (!skillsOnly) {
    console.log('Removing project docs (.claude/sdd/)...');
    uninstallDocs(docsTarget);
    console.log('');
  }

  console.log('Done.');
}

function cmdList(args) {
  const skillsTarget = resolveSkillsTarget(args.flags);
  const docsTarget = resolveDocsTarget();

  console.log(`sdd-skills v${VERSION}`);
  console.log('');
  console.log(`Skills directory: ${skillsTarget}`);
  for (const name of SKILL_NAMES) {
    const present = exists(path.join(skillsTarget, name));
    console.log(`  [${present ? 'x' : ' '}] ${name}`);
  }
  console.log('');
  console.log(`Project docs:     ${docsTarget}`);
  console.log(`  [${exists(docsTarget) ? 'x' : ' '}] .claude/sdd/`);
}

function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);
  const cmd = args._[0] || 'help';

  switch (cmd) {
    case 'install':
      return cmdInstall(args, 'install');
    case 'update':
      return cmdInstall(args, 'update');
    case 'uninstall':
      return cmdUninstall(args);
    case 'list':
      return cmdList(args);
    case 'version':
    case '--version':
    case '-v':
      console.log(VERSION);
      return;
    case 'help':
    case '--help':
    case '-h':
      return help();
    default:
      console.error(`Unknown command: ${cmd}`);
      console.error(`Run 'sdd-skills help' for usage.`);
      process.exit(2);
  }
}

main();
