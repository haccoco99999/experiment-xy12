// The files that several AI assistants share must stay in step:
//   AGENTS.md is the single rule file (CLAUDE.md imports it, GEMINI.md is a copy),
//   .agents/skills is a copy of .claude/skills.
// If a test here fails, run:  node tools/sync-skills.mjs
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8').replace(/\r\n/g, '\n');
function files(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(path.join(dir, e.name), base) : [path.relative(base, path.join(dir, e.name))]));
}
const isText = (f) => /\.(md|txt|json|js|mjs|css|html)$/i.test(f);

test('AGENTS.md has the five rules and stays under the 12,000-character limit of Antigravity rule files', () => {
  const t = read('AGENTS.md');
  assert.ok(t.length > 1000 && t.length < 12000, 'AGENTS.md has ' + t.length + ' characters');
  ['Answer clear and direct', 'Use maximum caution', 'Keep HUONG-DAN.txt up to date', 'Conventional Commits format, in Vietnamese', 'Stop when usage reaches 90%']
    .forEach((rule) => assert.ok(t.includes(rule), 'missing rule: ' + rule));
});

test('AGENTS.md stays tool-neutral (no Claude-only tool names)', () => {
  assert.ok(!/get_usage|ToolSearch|mcp__/.test(read('AGENTS.md')));
});

test('CLAUDE.md imports AGENTS.md', () => {
  assert.ok(/^@AGENTS\.md\s*$/m.test(read('CLAUDE.md')), 'CLAUDE.md needs a line with only: @AGENTS.md');
});

test('GEMINI.md is an exact copy of AGENTS.md', { skip: fs.existsSync(path.join(root, 'GEMINI.md')) ? false : 'GEMINI.md does not exist' }, () => {
  assert.strictEqual(read('GEMINI.md'), read('AGENTS.md'));
});

test('.agents/skills has the same files as .claude/skills', () => {
  const master = files(path.join(root, '.claude', 'skills')).sort(), copy = files(path.join(root, '.agents', 'skills')).sort();
  assert.ok(master.length >= 3, 'the master folder has skills');
  assert.deepStrictEqual(copy, master);
});

test('.agents/skills files are identical to the masters', () => {
  files(path.join(root, '.claude', 'skills')).forEach((f) => {
    const a = fs.readFileSync(path.join(root, '.claude', 'skills', f)), b = fs.readFileSync(path.join(root, '.agents', 'skills', f));
    if (isText(f)) assert.strictEqual(b.toString('utf8').replace(/\r\n/g, '\n'), a.toString('utf8').replace(/\r\n/g, '\n'), f);
    else assert.ok(a.equals(b), f);
  });
});

test('HANDOFF.md exists and points to AGENTS.md', () => {
  const t = read('HANDOFF.md');
  assert.ok(t.includes('AGENTS.md') && /log/i.test(t));
});
