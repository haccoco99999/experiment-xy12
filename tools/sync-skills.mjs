// Developer helper: keeps the copies in step with their masters.
//   .claude/skills  ->  .agents/skills   (the copy Codex and Antigravity read)
//   AGENTS.md       ->  GEMINI.md
// It copies and overwrites, but it never deletes anything unless you add --prune
// (then files that exist only in .agents/skills are removed).
// Run:  node tools/sync-skills.mjs
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const prune = process.argv.includes('--prune');

function files(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(join(dir, e.name), base) : [relative(base, join(dir, e.name))]));
}

const from = join(root, '.claude', 'skills');
const to = join(root, '.agents', 'skills');
let copied = 0;
for (const f of files(from)) {
  const src = join(from, f), dst = join(to, f);
  if (existsSync(dst) && readFileSync(src).equals(readFileSync(dst))) continue;
  mkdirSync(dirname(dst), { recursive: true });
  copyFileSync(src, dst);
  copied++;
  console.log('copied  ' + join('.agents', 'skills', f));
}
const extra = files(to).filter((f) => !existsSync(join(from, f)));
extra.forEach((f) => {
  if (prune) { rmSync(join(to, f)); console.log('removed ' + join('.agents', 'skills', f)); }
  else console.log('extra   ' + join('.agents', 'skills', f) + '  (only in the copy; add --prune to remove it)');
});

const agents = readFileSync(join(root, 'AGENTS.md'));
const gemini = join(root, 'GEMINI.md');
if (!existsSync(gemini) || !readFileSync(gemini).equals(agents)) {
  writeFileSync(gemini, agents);
  console.log('updated GEMINI.md from AGENTS.md');
}
console.log(copied === 0 && !extra.length ? 'skills already in step' : 'skills: ' + copied + ' file(s) copied, ' + extra.length + ' extra');
