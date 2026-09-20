const test = require('node:test');
const assert = require('node:assert');
const L = require('../js/logic/exp7.js');

function placed() { const s = L.initialState(); L.applyButterfly(s, 'placeMale'); L.applyButterfly(s, 'placeFemale'); return s; }
function fertilized() { const s = placed(); L.applyMating(s); L.applyFertilization(s); return s; }
function laid() { const s = fertilized(); L.applyContinue(s); L.applyButterfly(s, 'layEggs'); return s; }
function larva() { const s = laid(); L.applyLens(s, 'lensEggs'); L.startHatching(s); L.arriveDay(s, 3); L.arriveDay(s, 7); return s; }
function grown() { const s = larva(); L.applyFeed(s); for (let i = 0; i < 3; i++) L.applyMolt(s); L.applyGrown(s); return s; }
function pupa() { const s = grown(); L.applyPupation(s); return s; }
function cut() { const s = pupa(); L.applyLens(s, 'lensPupa'); L.openCutaway(s); L.PARTS.forEach((p) => L.applyPart(s, p)); return s; }
function adult() { const s = cut(); L.startMetamorphosis(s); L.arriveDay(s, 18); L.applyAdult(s); return s; }

test('the two butterflies go into the garden; a drop elsewhere sends them back with the md sentence', () => {
  const s = L.initialState();
  assert.deepStrictEqual(L.decideButterfly(s, 'male', null), { ok: false, msg: 'maleOff' });
  assert.deepStrictEqual(L.decideButterfly(s, 'female', null), { ok: false, msg: 'femaleOff' });
  assert.strictEqual(L.decideButterfly(s, 'male', 'area').action, 'placeMale');
  assert.strictEqual(L.applyButterfly(s, 'placeMale').ready, false);
  assert.strictEqual(L.decideButterfly(s, 'male', 'area').ok, false);              // already placed
  assert.strictEqual(L.applyButterfly(s, 'placeFemale').ready, true);
});

test('mating needs both butterflies and the male let go near the female', () => {
  const s = L.initialState();
  assert.strictEqual(L.decideMating(s, true).ok, false);                          // not both placed
  L.applyButterfly(s, 'placeMale'); L.applyButterfly(s, 'placeFemale');
  assert.deepStrictEqual(L.decideMating(s, false), { ok: false, msg: 'maleFar' });
  assert.strictEqual(L.decideMating(s, true).action, 'mate');
  L.applyMating(s); assert.strictEqual(L.decideMating(s, true).ok, false);
});

test('fertilization needs mating; the button ▶ TIẾP TỤC comes after it; laying only on a leaf afterwards', () => {
  const s = placed();
  assert.strictEqual(L.applyFertilization(s), false);                              // no fertilization before mating
  assert.strictEqual(L.canContinue(s), false);
  L.applyMating(s); assert.strictEqual(L.applyFertilization(s), true);
  assert.strictEqual(L.decideButterfly(s, 'female', 'leaf').ok, false);            // not continued yet: nothing to drag
  assert.strictEqual(L.canContinue(s), true); assert.strictEqual(L.applyContinue(s), true); assert.strictEqual(L.canContinue(s), false);
  assert.deepStrictEqual(L.decideButterfly(s, 'female', 'area'), { ok: false, msg: 'femaleLeaf' });
  assert.strictEqual(L.decideButterfly(s, 'female', 'leaf').action, 'layEggs');
  L.applyButterfly(s, 'layEggs'); assert.strictEqual(s.eggLaid, true);
});

test('the magnifier: eggs first, then the hatching button; wrong places give the md sentences', () => {
  const s = fertilized(); L.applyContinue(s);
  assert.strictEqual(L.decideLens(s, 'eggs').msg, 'lensNothing');                  // no eggs yet
  L.applyButterfly(s, 'layEggs');
  assert.deepStrictEqual(L.decideLens(s, null), { ok: false, msg: 'lensEggsOff' });
  assert.strictEqual(L.canHatch(s), false); assert.strictEqual(L.startHatching(s), false);
  const r = L.decideLens(s, 'eggs'); assert.strictEqual(r.action, 'lensEggs'); L.applyLens(s, r.action);
  assert.strictEqual(L.canHatch(s), true); assert.strictEqual(L.startHatching(s), true); assert.strictEqual(L.canHatch(s), false);
});

test('hatching: day 3 darkens the eggs, day 7 the larva appears, never earlier', () => {
  const s = laid(); L.applyLens(s, 'lensEggs');
  L.arriveDay(s, 3); assert.strictEqual(s.eggsDark, false);                        // not started
  L.startHatching(s);
  L.arriveDay(s, 3); assert.strictEqual(s.eggsDark, true); assert.strictEqual(s.larvaAppeared, false);
  assert.strictEqual(L.arriveDay(s, 2), null);
  L.arriveDay(s, 7); assert.strictEqual(s.larvaAppeared, true);
});

test('feeding the larva: the leaf must be near; growing starts after the first feeding; three moults; then it is big enough', () => {
  const s = larva();
  assert.deepStrictEqual(L.decideLeaf(s, false), { ok: false, msg: 'leafFar' });
  assert.strictEqual(L.canGrow(s), false); assert.strictEqual(L.applyMolt(s), false);
  assert.strictEqual(L.decideLeaf(s, true).action, 'feed');
  assert.strictEqual(L.applyFeed(s).first, true); assert.strictEqual(L.applyFeed(s).first, false);
  assert.strictEqual(L.canPupate(s), false); assert.strictEqual(L.applyGrown(s), false);
  assert.strictEqual(L.applyMolt(s), true); assert.strictEqual(L.applyMolt(s), true); assert.strictEqual(L.applyMolt(s), true); assert.strictEqual(L.applyMolt(s), false);
  assert.strictEqual(L.applyGrown(s), true); assert.strictEqual(L.canPupate(s), true);
  assert.strictEqual(L.applyPupation(s), true); assert.strictEqual(s.day, 14);
  assert.strictEqual(L.decideLeaf(s, true).ok, false);                             // no feeding once it is a pupa
});

test('the ruler follows the larva: the length grows with every moult', () => {
  const s = larva();
  assert.deepStrictEqual(L.decideRuler(s, false), { ok: false, msg: 'rulerFar' });
  const a = L.decideRuler(s, true).mm; L.applyFeed(s); L.applyMolt(s);
  const b = L.decideRuler(s, true).mm; L.applyMolt(s); L.applyMolt(s); L.applyGrown(s);
  const c = L.decideRuler(s, true).mm;
  assert.ok(a < b && b < c);
  assert.strictEqual(L.decideRuler(L.initialState(), true).ok, false);             // no larva yet
});

test('the pupa: magnifier on it, then the 3D cut, then all four parts, then the fast forward', () => {
  const s = pupa();
  assert.strictEqual(L.canCutaway(s), false);                                      // rule 12: the magnifier first
  assert.deepStrictEqual(L.decideLens(s, null), { ok: false, msg: 'lensPupaOff' });
  const r = L.decideLens(s, 'pupa'); assert.strictEqual(r.action, 'lensPupa'); L.applyLens(s, r.action);
  assert.strictEqual(L.decidePart(s, 'wing').ok, false);                           // rule 13: the cut must be open
  assert.strictEqual(L.openCutaway(s), true);
  assert.deepStrictEqual(L.decidePart(s, null), { ok: false, msg: 'partOff' });
  assert.strictEqual(L.canMetamorph(s), false);
  L.applyPart(s, 'wing'); L.applyPart(s, 'eye'); L.applyPart(s, 'leg');
  assert.strictEqual(L.canMetamorph(s), false);
  assert.strictEqual(L.applyPart(s, 'proboscis').done, true);
  assert.strictEqual(L.canMetamorph(s), true); assert.strictEqual(L.startMetamorphosis(s), true);
});

test('the adult appears only after the fast forward; sorting opens after that; cards go to the slot with their number', () => {
  const c = cut();
  assert.strictEqual(L.applyAdult(c), false);
  assert.strictEqual(L.sorting(c), false);
  const s = adult(); assert.strictEqual(s.day, 28); assert.strictEqual(L.sorting(s), true);
  assert.deepStrictEqual(L.decideSort(s, 2, 0), { ok: false, msg: 'sortWrong' });
  assert.deepStrictEqual(L.decideSort(s, 3, null), { ok: false, msg: 'sortWrong' });
  assert.strictEqual(L.decideSort(s, 0, 0).ok, true);
  L.applySort(s, 0); assert.strictEqual(L.decideSort(s, 0, 0).ok, false);
  [1, 2].forEach((i) => L.applySort(s, i)); assert.strictEqual(s.complete, false);
  assert.strictEqual(L.applySort(s, 3).done, true); assert.strictEqual(s.complete, true);
});

test('progress bar, prompts and days follow the story', () => {
  assert.deepStrictEqual(L.stepStates(L.initialState()), ['active', 'locked', 'locked', 'locked', 'locked', 'locked', 'locked', 'locked']);
  assert.deepStrictEqual(L.stepStates(placed()), ['done', 'active', 'locked', 'locked', 'locked', 'locked', 'locked', 'locked']);
  assert.deepStrictEqual(L.stepStates(fertilized()), ['done', 'done', 'done', 'open', 'locked', 'locked', 'locked', 'locked']);
  assert.deepStrictEqual(L.stepStates(laid()), ['done', 'done', 'done', 'done', 'active', 'locked', 'locked', 'locked']);
  assert.deepStrictEqual(L.stepStates(larva()), ['done', 'done', 'done', 'done', 'done', 'active', 'locked', 'locked']);
  assert.deepStrictEqual(L.stepStates(pupa()), ['done', 'done', 'done', 'done', 'done', 'done', 'active', 'locked']);
  assert.deepStrictEqual(L.stepStates(adult()), ['done', 'done', 'done', 'done', 'done', 'done', 'done', 'done']);
  assert.strictEqual(L.promptKey(L.initialState()), 'placeTask');
  assert.strictEqual(L.promptKey(placed()), 'mateTask');
  assert.strictEqual(L.promptKey(fertilized()), null);
  const c = fertilized(); L.applyContinue(c); assert.strictEqual(L.promptKey(c), 'layTask');
  assert.strictEqual(L.promptKey(laid()), 'lensEggsTask');
  assert.strictEqual(L.promptKey(larva()), 'feedTask');
  const p = pupa(); assert.strictEqual(L.promptKey(p), 'lensPupaTask');
  L.applyLens(p, 'lensPupa'); L.openCutaway(p); assert.strictEqual(L.promptKey(p), 'partTask');
  assert.strictEqual(L.promptKey(adult()), 'sortTask');
  const d = laid(); assert.deepStrictEqual(L.dayStates(d), ['active', 'todo', 'todo', 'todo', 'todo', 'todo']);
  L.applyLens(d, 'lensEggs'); L.startHatching(d); L.arriveDay(d, 3);
  assert.deepStrictEqual(L.dayStates(d), ['done', 'active', 'todo', 'todo', 'todo', 'todo']);
});

test('the texts have every sentence the logic can ask for, and the right number of steps, days and cards', () => {
  global.window = global; global.Lab = { content: {} };
  delete require.cache[require.resolve('../js/content/exp7.vi.js')];
  require('../js/content/exp7.vi.js');
  const C = global.Lab.content.exp7, has = (k) => typeof C.md.msg[k] === 'string' || typeof C.app[k] === 'string';
  ['maleOff', 'femaleOff', 'femaleLeaf', 'maleFar', 'lensNothing', 'lensEggsOff', 'lensPupaOff', 'leafFar', 'rulerFar', 'partOff', 'sortWrong', 'locked'].forEach((k) => assert.ok(has(k), 'missing text: ' + k));
  const states = [L.initialState(), placed(), fertilized(), laid(), larva(), grown(), pupa(), cut(), adult()];
  states.forEach((s, i) => { const k = L.promptKey(s); if (k) assert.ok(has(k), 'state ' + i + ' asks for a missing text: ' + k); assert.strictEqual(L.stepStates(s).length, C.md.steps.length); });
  assert.strictEqual(C.md.days.length, L.DAYS.length);
  assert.strictEqual(C.md.sort.cards.length, 4); assert.strictEqual(C.md.sort.slots.length, 4);
  L.PARTS.forEach((p) => assert.ok(C.md.parts[p], 'missing part name: ' + p));
  assert.strictEqual(C.md.labels.moult.length, 3); assert.strictEqual(C.md.diagram.length, 10);
});
