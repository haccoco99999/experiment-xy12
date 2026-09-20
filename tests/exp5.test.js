const test = require('node:test');
const assert = require('node:assert');
const L = require('../js/logic/exp5.js');

function placed() { const s = L.initialState(); L.applyTool(s, 'place'); return s; }
function observedAll() {
  const s = placed(); s.lens = true; assert.ok(L.openStructure(s));
  L.OBS.forEach((p) => { assert.ok(L.decideObserve(s, p).ok); L.applyObserve(s, p); });
  return s;
}
function pollinated() {
  const s = observedAll(); L.startPollination(s);
  L.applyTool(s, 'collect'); L.applyTool(s, 'pollinate'); return s;
}
function fertilized() {
  const s = pollinated();
  L.applyGerminate(s); L.applyTube(s, 1); L.applyOvule(s); L.applyMale(s); return s;
}

test('flower first: tools before the flower are refused with the md sentence', () => {
  const s = L.initialState();
  assert.deepStrictEqual(L.decideTool(s, 'lens', 'flower'), { ok: false, msg: 'placeFirst' });
  assert.deepStrictEqual(L.decideTool(s, 'stick', 'anther'), { ok: false, msg: 'placeFirst' });
  assert.strictEqual(L.decideTool(s, 'flower', 'bench').action, 'place');
  assert.strictEqual(L.decideTool(s, 'flower', null).msg, 'flowerOff');
  L.applyTool(s, 'place');
  assert.strictEqual(L.decideTool(s, 'flower', 'bench').ok, false);
});

test('the magnifier must be over the flower before the structure view can open', () => {
  const s = placed();
  assert.strictEqual(L.decideTool(s, 'lens', 'bench').msg, 'lensOff');
  assert.strictEqual(L.canOpenStructure(s), false);
  L.applyTool(s, L.decideTool(s, 'lens', 'petal').action);
  assert.strictEqual(L.canOpenStructure(s), true);
  assert.strictEqual(L.openStructure(s), true);
  assert.strictEqual(L.canOpenStructure(s), false);
});

test('parts are looked at in order; another order gets a hint and changes nothing', () => {
  const s = placed(); s.lens = true; L.openStructure(s);
  assert.deepStrictEqual(L.decideObserve(s, 'pistil'), { ok: false, msg: 'obsOrder', want: 'stamen' });
  L.applyObserve(s, 'stamen');
  assert.strictEqual(L.decideObserve(s, 'anther').ok, false);
  assert.strictEqual(L.decideObserve(s, 'filament').ok, true);
  L.applyObserve(s, 'filament');
  assert.strictEqual(L.decideObserve(s, 'stamen').again, true);         // looking again is fine
  assert.strictEqual(L.nextObs(s), 'anther');
});

test('pollination is unlocked only after every part has been seen', () => {
  const s = placed(); s.lens = true; L.openStructure(s);
  assert.strictEqual(L.canStartPollination(s), false);
  let last;
  L.OBS.forEach((p) => { last = L.applyObserve(s, p); });
  assert.strictEqual(last.unlocked, true);
  assert.strictEqual(L.canStartPollination(s), true);
  assert.ok(L.startPollination(s));
  assert.strictEqual(L.canStartPollination(s), false);
});

test('the stick: locked, then anther collects pollen, only the stigma takes it', () => {
  const s = observedAll();
  assert.strictEqual(L.decideTool(s, 'stick', 'anther').msg, 'stickLocked');
  L.startPollination(s);
  assert.strictEqual(L.decideTool(s, 'stick', 'stigma').msg, 'collectWrong');       // no pollen yet
  assert.strictEqual(L.decideTool(s, 'stick', 'petal').msg, 'collectWrong');
  const r = L.decideTool(s, 'stick', 'anther'); assert.strictEqual(r.action, 'collect'); L.applyTool(s, r.action);
  assert.strictEqual(s.hasPollen, true);
  const petal = L.decideTool(s, 'stick', 'petal'); assert.strictEqual(petal.msg, 'pollenWrong'); assert.strictEqual(petal.fall, true);
  assert.strictEqual(L.decideTool(s, 'stick', 'style').msg, 'pollenWrong');
  assert.strictEqual(L.decideTool(s, 'stick', 'ovary').msg, 'pollenWrong');
  assert.strictEqual(L.decideTool(s, 'stick', 'anther').ok, false);
  assert.strictEqual(s.pollinated, false);                                           // wrong drops change nothing
  L.applyTool(s, L.decideTool(s, 'stick', 'stigma').action);
  assert.strictEqual(s.pollinated, true); assert.strictEqual(s.hasPollen, false);
  assert.strictEqual(L.decideTool(s, 'stick', 'anther').msg, 'stickDone');
});

test('germination: only a click on the pollen counts', () => {
  const s = pollinated();
  assert.deepStrictEqual(L.decideGerminate(s, 'other'), { ok: false, msg: 'clickPollen' });
  assert.strictEqual(L.decideGerminate(s, 'pollen').action, 'germinate');
  L.applyGerminate(s);
  assert.strictEqual(L.decideGerminate(s, 'pollen').ok, false);
  const early = L.initialState(); assert.strictEqual(L.decideGerminate(early, 'pollen').ok, false);
});

test('pollen tube: must go down the style, must reach an ovule, then the male cell goes inside', () => {
  const s = pollinated();
  assert.strictEqual(L.decideTubeRelease(s, 0.5, false).ok, false);                   // not germinated yet
  L.applyGerminate(s);
  assert.deepStrictEqual(L.decideTubeRelease(s, 0.5, true), { ok: false, msg: 'tubeWrong' });
  assert.deepStrictEqual(L.decideTubeRelease(s, 0.5, false), { ok: true, reached: false });
  L.applyTube(s, 0.5); assert.strictEqual(s.tubeAtOvary, false);
  L.applyTube(s, 0.3); assert.strictEqual(s.tube, 0.5);                               // never shrinks
  assert.strictEqual(L.decideOvule(s, true).ok, false);                               // not at the ovary yet
  L.applyTube(s, 0.98); assert.strictEqual(s.tubeAtOvary, true); assert.strictEqual(s.tube, 1);
  assert.deepStrictEqual(L.decideOvule(s, false), { ok: false, msg: 'ovuleWrong' });
  assert.strictEqual(L.decideMale(s, true).ok, false);                                // not at an ovule yet
  L.applyOvule(s);
  assert.deepStrictEqual(L.decideMale(s, false), { ok: false, msg: 'maleWrong' });
  assert.strictEqual(L.decideMale(s, true).ok, true);
  L.applyMale(s); assert.strictEqual(s.fertilized, true);
});

test('fast forward: 0 → 7 → 14 → seeds → 30 → cut, each stop waits for the student', () => {
  const s = fertilized();
  assert.strictEqual(L.canStartLapse(s), true);
  assert.deepStrictEqual(L.stepStates(s), ['done', 'done', 'done', 'open', 'open', 'locked']);
  L.startLapse(s); assert.strictEqual(L.canStartLapse(s), false);
  assert.strictEqual(L.decideFruitClick(s).ok, false);                                // nothing to click while it runs
  assert.deepStrictEqual(L.arrive(s), { day: 7 }); assert.strictEqual(s.fruitFormed, true);
  assert.strictEqual(L.canContinue(s), true);
  assert.strictEqual(L.decideFruitClick(s).ok, false);
  L.continueLapse(s); assert.strictEqual(L.canContinue(s), false);
  assert.deepStrictEqual(L.arrive(s), { day: 14 }); assert.strictEqual(s.ripe, false);
  assert.strictEqual(L.canContinue(s), false);                                        // the fruit must be clicked first
  const c = L.decideFruitClick(s); assert.strictEqual(c.action, 'seeds'); L.applyFruitClick(s, c.action);
  assert.strictEqual(s.seedsFormed, true); assert.strictEqual(L.canContinue(s), true);
  L.continueLapse(s);
  assert.deepStrictEqual(L.arrive(s), { day: 30 }); assert.strictEqual(s.ripe, true);
  const cut = L.decideFruitClick(s); assert.strictEqual(cut.action, 'cut');
  assert.strictEqual(L.applyFruitClick(s, cut.action).finished, true);
  assert.deepStrictEqual(L.stepStates(s), ['done', 'done', 'done', 'done', 'done', 'locked']);
});

test('progress bar follows the story and the last step stays locked', () => {
  const s = L.initialState();
  assert.deepStrictEqual(L.stepStates(s), ['locked', 'locked', 'locked', 'locked', 'locked', 'locked']);
  L.applyTool(s, 'place');
  assert.deepStrictEqual(L.stepStates(s), ['active', 'locked', 'locked', 'locked', 'locked', 'locked']);
  const o = observedAll();
  assert.deepStrictEqual(L.stepStates(o), ['done', 'open', 'locked', 'locked', 'locked', 'locked']);
  L.startPollination(o);
  assert.deepStrictEqual(L.stepStates(o), ['done', 'active', 'locked', 'locked', 'locked', 'locked']);
  const p = pollinated();
  assert.deepStrictEqual(L.stepStates(p), ['done', 'done', 'active', 'locked', 'locked', 'locked']);
});

test('day bar and prompts', () => {
  const s = fertilized();
  assert.deepStrictEqual(L.dayStates(s), ['todo', 'todo', 'todo', 'todo', 'todo', 'todo']);
  L.startLapse(s); L.arrive(s);
  assert.deepStrictEqual(L.dayStates(s), ['done', 'done', 'active', 'todo', 'todo', 'todo']);
  assert.strictEqual(L.promptKey(L.initialState()), null);
  const a = observedAll(); assert.strictEqual(L.promptKey(a), null);
  L.startPollination(a); assert.strictEqual(L.promptKey(a), 'toAnther');
  L.applyTool(a, 'collect'); assert.strictEqual(L.promptKey(a), 'toStigma');
  L.applyTool(a, 'pollinate'); assert.strictEqual(L.promptKey(a), 'clickPollen');
  L.applyGerminate(a); assert.strictEqual(L.promptKey(a), 'tubeTask');
  L.applyTube(a, 1); assert.strictEqual(L.promptKey(a), 'ovuleTask');
  L.applyOvule(a); assert.strictEqual(L.promptKey(a), 'maleTask');
  L.applyMale(a); assert.strictEqual(L.promptKey(a), null);
});
