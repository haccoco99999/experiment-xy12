const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file));

test.before(() => {
  execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
    cwd: root,
    env: Object.assign({}, process.env, { NO_COLOR: '1' }),
    stdio: 'ignore'
  });
});

test('the generated Svelte shell stays within the home-page budget', () => {
  const file = read('dist-modern/lab-modern.js');
  assert.ok(file.length <= 180_000, `modern shell is ${file.length} bytes`);
  assert.ok(zlib.gzipSync(file).length <= 60_000, 'modern shell exceeds 60 KB gzip');
});

test('the offline release has no external source paths or network URLs', () => {
  const html = read('Thi-nghiem-tat-ca-trong-1-file.html').toString('utf8');
  assert.ok(html.length <= 3_500_000, `offline file is ${html.length} bytes`);
  assert.doesNotMatch(html, /(?:src|href)="(?:css|js|vendor|dist-modern)\//i);
  assert.doesNotMatch(html, /(?:src|href)="https?:\/\//i);
});

test('the renderer exposes the three quality modes and an idle render path', () => {
  const stage = read('js/three/stage.js').toString('utf8');
  const loop = read('js/core/tween.js').toString('utf8');
  assert.match(stage, /quality: 'balanced'/);
  assert.match(stage, /q === 'light' \|\| q === 'balanced' \|\| q === 'high'/);
  assert.match(stage, /S\.quality === 'high' \? 1\.5 : S\.quality === 'balanced' \? 1\.25 : 1/);
  assert.match(loop, /elapsed < 33/);
  assert.match(loop, /reducedMotion \? hasRequiredTicker/);
});

test('portrait layout is local and does not require horizontal page scrolling', () => {
  const css = read('css/app.css').toString('utf8');
  assert.match(css, /orientation: portrait/);
  assert.match(css, /#tray[\s\S]*display: flex/);
  assert.match(css, /#panel[\s\S]*bottom: calc\(180px \+ var\(--safe-bottom\)\)/);
  assert.doesNotMatch(css, /body\[data-screen="lab"\] #rotate-hint \{ display: grid/);
});
