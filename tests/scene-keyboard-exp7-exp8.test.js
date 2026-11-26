const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const source = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('experiment 7 scene actions keep their shared flows and expose semantic controls', () => {
  const base = source('js/experiments/exp7.js');
  const butterfly = source('js/experiments/exp7-bfly.js');
  const larva = source('js/experiments/exp7-larva.js');
  const pupa = source('js/experiments/exp7-pupa.js');

  assert.match(base, /var attrs = \{ type: 'button' \}/);
  assert.match(base, /attrs\.disabled = 'disabled'/);
  assert.match(butterfly, /return tryMate\(info\.world\.distanceTo/);
  assert.match(butterfly, /X\.panelHooks\.push[\s\S]*L\.decideMating\(state, true\)\.ok[\s\S]*tryMate\(true\)/);
  assert.match(larva, /ariaLabel: APP\.rulerAway/);
  assert.match(pupa, /ariaLabel: 'Quan sát ' \+ MD\.parts\[p\]\.toLowerCase\(\)/);
});

test('experiment 8 identify and cell controls call the existing scene logic', () => {
  const cells = source('js/experiments/exp8-cells.js');

  assert.match(cells, /function identify\(sex\)[\s\S]*L\.decideIdentify\(state, sex\)[\s\S]*L\.applyIdentify\(state, sex\)/);
  assert.match(cells, /state\.phase !== PH\.identify/);
  assert.match(cells, /XÁC ĐỊNH ' \+ MD\.tools\[sex\][\s\S]*identify\(sex\)/);
  assert.match(cells, /dropCell\('sperm', \{ world: AREA\.male \}, sperm\)/);
  assert.match(cells, /dropCell\('egg', \{ world: AREA\.female \}\)/);
  assert.match(cells, /!state\.spermObserved \? 'Hãy quan sát tinh trùng trước\.'/);
  assert.match(cells, /!state\.eggObserved \? 'Hãy quan sát trứng trước\.'/);
});

test('experiment 8 fertilization, zygote and newborn buttons reuse click and drop feedback', () => {
  const base = source('js/experiments/exp8.js');
  const cells = source('js/experiments/exp8-cells.js');
  const born = source('js/experiments/exp8-born.js');

  assert.match(base, /var attrs = \{ type: 'button' \}/);
  assert.match(base, /attrs\.disabled = 'disabled'/);
  assert.match(cells, /dropSperm\(chosen, \{ world: cell\.egg\.group\.position\.clone\(\) \}\)/);
  assert.match(cells, /function clickZygote\(\)[\s\S]*L\.applyZygoteClick\(state\)[\s\S]*Lab\.fx\.sparkles/);
  assert.match(cells, /X\.button\('NHẤP VÀO HỢP TỬ', 'btn-blue', clickZygote/);
  assert.match(born, /function clickKitten\(onKitten\)[\s\S]*L\.decideKitten\(state, onKitten\)[\s\S]*L\.applyKitten\(state\)/);
  assert.match(born, /X\.button\('NHẤP VÀO HEO CON'[\s\S]*clickKitten\(true\)/);
});
