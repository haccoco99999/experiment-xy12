const test = require('node:test');
const assert = require('node:assert');
const L = require('../js/logic/exp8.js');
const PH = L.PH;

/* helpers: the state at the START of each phase */
function placed() { const s = L.initialState(); L.applyCat(s, 'placeMale'); L.applyCat(s, 'placeFemale'); return s; }
function identify() { const s = placed(); assert.ok(L.advance(s)); return s; }
function cells() { const s = identify(); L.applyIdentify(s, 'male'); L.applyIdentify(s, 'female'); assert.ok(L.advance(s)); return s; }
function fertilize() { const s = cells(); L.observeCell(s, 'sperm'); L.observeCell(s, 'egg'); L.applyCell(s, 'sperm'); L.applyCell(s, 'egg'); assert.ok(L.advance(s)); return s; }
function zygote() { const s = fertilize(); L.applyFertilize(s); assert.ok(L.advance(s)); return s; }
function marks(s, tl) { for (let i = 0; i < L.TL[tl]; i++) L.applyMark(s, tl, i); }
function embryo() { const s = zygote(); L.applyLens(s, 'zygote'); L.applyZygoteClick(s); assert.ok(L.advance(s)); return s; }
function fetus() { const s = embryo(); marks(s, 'embryo'); L.applyLens(s, 'embryo'); assert.ok(L.advance(s)); return s; }
function kitten() { const s = fetus(); marks(s, 'fetus'); L.PARTS.forEach((p) => L.applyPart(s, p)); L.applyLens(s, 'fetus'); assert.ok(L.advance(s)); return s; }
function growth() { const s = kitten(); L.applyKitten(s); L.applyLens(s, 'kitten'); assert.ok(L.advance(s)); return s; }
function adult() { const s = growth(); marks(s, 'growth'); [0, 1, 2].forEach((i) => L.applyCompare(s, i)); assert.ok(L.advance(s)); return s; }
function sort() { const s = adult(); marks(s, 'adult'); assert.ok(L.advance(s)); return s; }

test('the two cats go on the table; a drop elsewhere sends them back with the md sentence; the start opens with both', () => {
  const s = L.initialState();
  assert.deepStrictEqual(L.decideCat(s, 'male', null), { ok: false, msg: 'maleOff' });
  assert.deepStrictEqual(L.decideCat(s, 'female', null), { ok: false, msg: 'femaleOff' });
  assert.strictEqual(L.canStart(s), false); assert.strictEqual(L.advance(s), false);
  assert.strictEqual(L.decideCat(s, 'male', 'table').action, 'placeMale'); assert.strictEqual(L.applyCat(s, 'placeMale').ready, false);
  assert.strictEqual(L.decideCat(s, 'male', 'table').ok, false);                       // already there
  assert.strictEqual(L.promptKey(s), 'placeFemaleTask'); assert.strictEqual(L.canStart(s), false);
  assert.strictEqual(L.applyCat(s, 'placeFemale').ready, true);
  assert.strictEqual(L.promptKey(s), 'startTask'); assert.strictEqual(L.canStart(s), true);
  assert.strictEqual(L.advance(s), true); assert.strictEqual(s.phase, PH.identify);
});

test('identify: a click on the wrong thing shows the md sentence, both cats open the next phase', () => {
  const s = identify();
  assert.deepStrictEqual(L.decideIdentify(s, null), { ok: false, msg: 'identifyWrong' });
  assert.strictEqual(L.decideIdentify(s, 'male').action, 'identify');
  assert.strictEqual(L.applyIdentify(s, 'male').done, false); assert.strictEqual(L.canAdvance(s), false);
  assert.strictEqual(L.decideIdentify(s, 'male').again, true);
  assert.strictEqual(L.applyIdentify(s, 'female').done, true);
  assert.deepStrictEqual(L.stepStates(s).slice(0, 2), ['done', 'active']);
  assert.strictEqual(L.advance(s), true); assert.strictEqual(s.phase, PH.cells);
});

test('sperm and egg: the right area keeps the cell, the wrong one sends it back; all four things are needed', () => {
  const s = cells();
  assert.deepStrictEqual(L.decideCell(s, 'sperm', 'female'), { ok: false, msg: 'spermWrong' });
  assert.deepStrictEqual(L.decideCell(s, 'egg', 'male'), { ok: false, msg: 'eggWrong' });
  assert.deepStrictEqual(L.decideCell(s, 'egg', null), { ok: false, msg: 'eggWrong' });
  assert.strictEqual(L.applyCell(s, 'sperm').done, false); assert.strictEqual(L.decideCell(s, 'sperm', 'male').ok, false);   // already placed
  assert.strictEqual(L.applyCell(s, 'egg').done, false);                               // placed, but never looked at
  assert.strictEqual(L.canAdvance(s), false);
  L.observeCell(s, 'sperm'); assert.strictEqual(L.canAdvance(s), false);
  assert.strictEqual(L.observeCell(s, 'sperm').again, true);
  L.observeCell(s, 'egg'); assert.strictEqual(L.canAdvance(s), true); assert.strictEqual(L.stepStates(s)[1], 'done');
  assert.strictEqual(L.advance(s), true); assert.strictEqual(s.phase, PH.fertilize);
});

test('fertilization: far shows the md sentence, near works once, a click on the egg guides; then the zygote phase', () => {
  const s = fertilize();
  assert.strictEqual(L.clickEgg(s).msg, 'eggClick');
  assert.deepStrictEqual(L.decideFertilize(s, false), { ok: false, msg: 'spermFar' });
  assert.strictEqual(L.decideFertilize(s, true).action, 'fertilize'); L.applyFertilize(s);
  assert.strictEqual(L.decideFertilize(s, true).ok, false); assert.strictEqual(L.clickEgg(s).msg, null);
  assert.strictEqual(L.stepStates(s)[2], 'done'); assert.strictEqual(L.advance(s), true); assert.strictEqual(s.phase, PH.zygote);
});

test('zygote: the glass must be on it (md sentences), then a click on it opens the development button', () => {
  const s = zygote();
  assert.strictEqual(L.promptKey(s), 'zygoteLensTask');
  assert.deepStrictEqual(L.decideLens(s, null), { ok: false, msg: 'lensZygoteOff' });
  assert.strictEqual(L.applyZygoteClick(s), false);                                    // not looked at yet
  assert.strictEqual(L.decideLens(s, 'zygote').ok, true); assert.strictEqual(L.applyLens(s, 'zygote').credit, 'zygote');
  assert.strictEqual(L.stepStates(s)[3], 'done'); assert.strictEqual(L.promptKey(s), 'zygoteClickTask'); assert.strictEqual(L.canAdvance(s), false);
  assert.strictEqual(L.applyZygoteClick(s), true); assert.strictEqual(L.canAdvance(s), true);
  assert.strictEqual(L.advance(s), true); assert.strictEqual(s.phase, PH.embryo);
});

test('the glass on a cat or a cell shows it but earns nothing; a wrong place shows the general sentence', () => {
  const s = cells();
  assert.deepStrictEqual(L.decideLens(s, null), { ok: false, msg: 'lensOff' });
  assert.strictEqual(L.decideLens(s, 'sperm').ok, true); assert.strictEqual(L.applyLens(s, 'sperm').credit, null);
  const z = zygote(); assert.strictEqual(L.applyLens(z, 'embryo').credit, null);       // wrong object for this phase
});

test('timeline: a mark opens after the one before it was seen; a locked mark gives the md sentence', () => {
  const s = embryo();
  assert.deepStrictEqual(L.markStates(s, 'embryo'), ['open', 'locked', 'locked', 'locked']);
  assert.deepStrictEqual(L.decideMark(s, 'embryo', 2), { ok: false, msg: 'markLocked' });
  assert.strictEqual(L.decideMark(s, 'embryo', 0).ok, true); L.applyMark(s, 'embryo', 0);
  assert.deepStrictEqual(L.markStates(s, 'embryo'), ['done', 'open', 'locked', 'locked']); assert.strictEqual(L.maxOpenMark(s, 'embryo'), 1);
  assert.deepStrictEqual(L.decideMark(s, 'embryo', 3), { ok: false, msg: 'markLocked' });
  assert.strictEqual(L.decideMark(s, 'embryo', 1).again, false); L.applyMark(s, 'embryo', 1);
  assert.strictEqual(L.decideMark(s, 'embryo', 0).again, true);                        // seen marks can be visited again
  assert.strictEqual(L.decideMark(s, 'fetus', 0).ok, false);                           // that timeline belongs to another phase
  assert.strictEqual(L.applyMark(s, 'embryo', 2).done, false); assert.strictEqual(L.applyMark(s, 'embryo', 3).done, true);
});

test('embryo: the glass earns the credit only after day 45; the bar step needs both', () => {
  const s = embryo();
  assert.strictEqual(L.lensEarly(s, 'embryo'), 'lensEmbryoEarly'); assert.strictEqual(L.applyLens(s, 'embryo').credit, null);
  marks(s, 'embryo'); assert.strictEqual(L.lensEarly(s, 'embryo'), null);
  assert.strictEqual(L.promptKey(s), 'embryoLensTask'); assert.strictEqual(L.stepStates(s)[4], 'active');
  assert.strictEqual(L.applyLens(s, 'embryo').credit, 'embryo'); assert.strictEqual(L.stepStates(s)[4], 'done');
  assert.strictEqual(L.advance(s), true); assert.strictEqual(s.phase, PH.fetus);
});

test('fetus: three marks, the four parts (the ears are extra) and the glass after "gần ngày sinh"', () => {
  const s = fetus();
  assert.strictEqual(L.decidePart(s, 'ears').ok, true); L.applyPart(s, 'ears'); assert.strictEqual(L.partsDone(s), false);
  assert.strictEqual(L.decidePart(s, 'wings').ok, false);
  L.PARTS.forEach((p) => { assert.strictEqual(L.decidePart(s, p).ok, true); L.applyPart(s, p); });
  assert.strictEqual(L.partsDone(s), true); assert.strictEqual(L.canAdvance(s), false);
  marks(s, 'fetus'); assert.strictEqual(L.canAdvance(s), false);                       // still no glass
  assert.strictEqual(L.applyLens(s, 'fetus').credit, 'fetus'); assert.strictEqual(L.canAdvance(s), true); assert.strictEqual(L.stepStates(s)[5], 'done');
  assert.strictEqual(L.advance(s), true); assert.strictEqual(s.phase, PH.kitten);
});

test('kitten: a click elsewhere gives the md sentence; the glass counts only after the click', () => {
  const s = kitten();
  assert.deepStrictEqual(L.decideKitten(s, false), { ok: false, msg: 'kittenOff' });
  assert.strictEqual(L.lensEarly(s, 'kitten'), 'kittenFirst'); assert.strictEqual(L.applyLens(s, 'kitten').credit, null);
  assert.strictEqual(L.decideKitten(s, true).action, 'kitten'); L.applyKitten(s);
  assert.strictEqual(L.promptKey(s), 'kittenLensTask'); assert.strictEqual(L.applyLens(s, 'kitten').credit, 'kitten');
  assert.strictEqual(L.advance(s), true); assert.strictEqual(s.phase, PH.growth);
});

test('growth: four marks, then three kittens to compare, then the adult timeline', () => {
  const s = growth();
  assert.strictEqual(L.canCompare(s), false); marks(s, 'growth'); assert.strictEqual(L.canCompare(s), true);
  assert.strictEqual(L.promptKey(s), 'compareTask'); assert.strictEqual(L.canAdvance(s), false);
  assert.strictEqual(L.applyCompare(s, 0).done, false); assert.strictEqual(L.applyCompare(s, 1).done, false); assert.strictEqual(L.applyCompare(s, 2).done, true);
  assert.strictEqual(L.stepStates(s)[7], 'done'); assert.strictEqual(L.advance(s), true); assert.strictEqual(s.phase, PH.adult);
  marks(s, 'adult'); assert.strictEqual(L.stepStates(s)[8], 'done'); assert.strictEqual(L.advance(s), true); assert.strictEqual(s.phase, PH.sort);
});

test('sorting: the card in its own slot stays, any other place sends it back; eight right cards finish', () => {
  const s = sort();
  assert.strictEqual(L.promptKey(s), 'sortTask'); assert.strictEqual(L.sorting(s), true);
  assert.deepStrictEqual(L.decideSort(s, 3, 5), { ok: false, msg: 'sortWrong' }); assert.deepStrictEqual(L.decideSort(s, 3, null), { ok: false, msg: 'sortWrong' });
  for (let i = 0; i < 7; i++) { assert.strictEqual(L.decideSort(s, i, i).action, 'sort'); assert.strictEqual(L.applySort(s, i).done, false); }
  assert.strictEqual(L.decideSort(s, 0, 0).ok, false);                                 // already placed
  assert.strictEqual(L.applySort(s, 7).done, true); assert.strictEqual(s.complete, true); assert.strictEqual(s.phase, PH.done);
  assert.deepStrictEqual(L.stepStates(s), Array(9).fill('done')); assert.strictEqual(L.promptKey(s), null);
});

test('nothing opens too early: a step is locked until the one before it is done', () => {
  const s = L.initialState();
  assert.deepStrictEqual(L.stepStates(s), ['active', 'locked', 'locked', 'locked', 'locked', 'locked', 'locked', 'locked', 'locked']);
  assert.strictEqual(L.decideIdentify(s, 'male').ok, false); assert.strictEqual(L.decideCell(s, 'sperm', 'male').ok, false);
  assert.strictEqual(L.decideFertilize(s, true).ok, false); assert.strictEqual(L.decideMark(s, 'embryo', 0).ok, false);
  assert.strictEqual(L.decidePart(s, 'head').ok, false); assert.strictEqual(L.decideSort(s, 0, 0).ok, false);
  assert.strictEqual(L.advance(s), false); assert.strictEqual(s.phase, PH.place);
});

test('the texts have every sentence the logic can ask for, and the right number of marks, cards and steps', () => {
  global.window = global; global.Lab = { content: {} };
  delete require.cache[require.resolve('../js/content/exp8.vi.js')];
  require('../js/content/exp8.vi.js');
  const C = global.Lab.content.exp8, has = (k) => typeof C.md.msg[k] === 'string' || typeof C.app[k] === 'string';
  ['maleOff', 'femaleOff', 'identifyWrong', 'spermWrong', 'eggWrong', 'spermFar', 'eggClick', 'lensOff', 'lensZygoteOff', 'lensEmbryoEarly', 'lensFetusEarly', 'kittenFirst', 'markLocked', 'kittenOff', 'sortWrong']
    .forEach((k) => assert.ok(has(k), 'missing text: ' + k));
  const states = [L.initialState(), placed(), identify(), cells(), fertilize(), zygote(), embryo(), fetus(), kitten(), growth(), adult(), sort()];
  states.forEach((s, i) => { const k = L.promptKey(s); if (k) assert.ok(has(k), 'state ' + i + ' asks for a missing text: ' + k); assert.strictEqual(L.stepStates(s).length, C.md.steps.length); });
  Object.keys(L.TL).forEach((tl) => { assert.strictEqual(C.md.marks[tl].length, L.TL[tl], tl + ' labels'); assert.strictEqual(C.md.markInfo[tl].length, L.TL[tl], tl + ' texts'); });
  assert.strictEqual(C.md.sort.cards.length, L.CARDS); assert.strictEqual(C.md.sort.cards.length, C.md.steps.length - 1);
  L.PARTS.forEach((p) => assert.ok(C.md.parts[p], 'missing part name: ' + p));
  assert.strictEqual(C.md.stageTitles.length, 9);
});
