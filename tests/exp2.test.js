// Experiment 2 logic tests (run with:  node --test "tests/*.test.js")
const test = require('node:test');
const assert = require('node:assert');
const E2 = require('../js/logic/exp2.js');

function placed() { const s = E2.initialState(); E2.applyTool(s, E2.decideTool(s, 'pot', 'table').action); return s; }
function gasMove(s, gas, from, to) { const r = E2.decideGas(s, gas, from, to); assert.ok(r.ok, 'expected ok for ' + [gas, from, to]); return E2.applyGas(s); }
function doResp(s) { E2.selectProcess(s, 'resp'); gasMove(s, 'o2', 'env', 'leaf'); return gasMove(s, 'co2', 'leaf', 'env'); }
function doPhoto(s) { E2.selectProcess(s, 'photo'); gasMove(s, 'co2', 'env', 'leaf'); return gasMove(s, 'o2', 'leaf', 'env'); }
function doWater(s) { E2.selectPart(s, 'water'); return E2.applyTool(s, E2.decideTool(s, 'water', 'soil').action); }
function doMinerals(s) { E2.selectPart(s, 'minerals'); return E2.applyTool(s, E2.decideTool(s, 'minerals', 'soil').action); }

test('initial state: table empty, both topics locked, only the plant step is active (md sections 6 and 44)', () => {
  const s = E2.initialState();
  assert.deepStrictEqual(E2.stepStates(s), ['active', 'locked', 'locked', 'locked']);
  assert.strictEqual(E2.topicState(s, 'air'), 'locked'); assert.strictEqual(E2.topicState(s, 'water'), 'locked');
  assert.strictEqual(E2.selectTopic(s, 'air'), false, 'a topic cannot be chosen before the plant is placed');
  assert.deepStrictEqual(s, E2.initialState());
});

test('the pot goes on the table; off the table returns it with the md message; nothing else works before it', () => {
  const s = E2.initialState();
  assert.strictEqual(E2.decideTool(s, 'pot', null).msg, 'potOff');
  assert.strictEqual(E2.decideTool(s, 'pot', 'leaf').msg, 'potOff');
  ['water', 'minerals', 'magnifier', 'box'].forEach((t) => assert.strictEqual(E2.decideTool(s, t, 'soil').msg, 'potOff', t));
  assert.strictEqual(E2.decideGas(s, 'o2', 'env', 'leaf').msg, 'chooseProcess');
  const r = E2.decideTool(s, 'pot', 'table'); assert.ok(r.ok);
  E2.applyTool(s, r.action);
  assert.strictEqual(s.placed, true);
  assert.deepStrictEqual(E2.stepStates(s), ['done', 'open', 'open', 'locked']);
  assert.strictEqual(E2.decideTool(s, 'pot', 'table').ok, false, 'a placed pot cannot be placed twice');
});

test('after the plant is placed both topics open, in any order; choosing one makes it active', () => {
  const s = placed();
  assert.ok(E2.selectTopic(s, 'water'));
  assert.deepStrictEqual(E2.stepStates(s), ['done', 'open', 'active', 'locked']);
  assert.ok(E2.selectTopic(s, 'air'));
  assert.deepStrictEqual(E2.stepStates(s), ['done', 'active', 'open', 'locked']);
});

test('respiration: O₂ in, then CO₂ out; the md wrong-drop cases give the right message and change nothing', () => {
  const s = placed(); E2.selectTopic(s, 'air'); assert.ok(E2.selectProcess(s, 'resp'));
  assert.strictEqual(E2.promptKey(s), 'respPrompt1');
  const wrong = E2.decideGas(s, 'co2', 'env', 'leaf');
  assert.deepStrictEqual([wrong.ok, wrong.msg], [false, 'respWrongIn']);
  assert.strictEqual(E2.decideGas(s, 'o2', 'env', 'off').msg, null, 'dropped outside the picture: silent');
  assert.strictEqual(E2.decideGas(s, 'o2', 'env', 'env').msg, null, 'moved around in the environment: silent');
  assert.deepStrictEqual(s.resp, { step: 0, o2In: false, co2Out: false, done: false });
  gasMove(s, 'o2', 'env', 'leaf');
  assert.deepStrictEqual([s.resp.step, s.resp.o2In], [1, true]); assert.strictEqual(E2.promptKey(s), 'respPrompt2');
  const wrong2 = E2.decideGas(s, 'o2', 'leaf', 'env');
  assert.deepStrictEqual([wrong2.ok, wrong2.msg], [false, 'respWrongOut']);
  assert.strictEqual(E2.decideGas(s, 'co2', 'env', 'leaf').msg, 'respPrompt2', 'other wrong drops repeat the task');
  const out = gasMove(s, 'co2', 'leaf', 'env');
  assert.strictEqual(out.processDone, 'resp'); assert.strictEqual(out.airDone, false);
  assert.strictEqual(s.resp.done, true); assert.strictEqual(s.process, null);
  assert.strictEqual(E2.subState(s, 'resp'), 'done'); assert.strictEqual(E2.selectProcess(s, 'resp'), false, 'a finished process is not chosen again');
});

test('photosynthesis: CO₂ in, then O₂ out; wrong gases are refused with their own messages', () => {
  const s = placed(); E2.selectTopic(s, 'air'); E2.selectProcess(s, 'photo');
  assert.strictEqual(E2.promptKey(s), 'photoPrompt1');
  assert.strictEqual(E2.decideGas(s, 'o2', 'env', 'leaf').msg, 'photoWrongIn');
  gasMove(s, 'co2', 'env', 'leaf');
  assert.strictEqual(E2.promptKey(s), 'photoPrompt2');
  assert.strictEqual(E2.decideGas(s, 'co2', 'leaf', 'env').msg, 'photoWrongOut');
  const out = gasMove(s, 'o2', 'leaf', 'env');
  assert.strictEqual(out.processDone, 'photo'); assert.strictEqual(s.photo.done, true);
});

test('gas exchange is complete only when BOTH processes are done, in either order', () => {
  [[doResp, doPhoto], [doPhoto, doResp]].forEach(([first, second]) => {
    const s = placed(); E2.selectTopic(s, 'air');
    const a = first(s); assert.strictEqual(a.airDone, false); assert.strictEqual(s.airDone, false);
    const b = second(s); assert.strictEqual(b.airDone, true); assert.strictEqual(s.airDone, true);
    assert.strictEqual(E2.topicState(s, 'air'), 'done'); assert.strictEqual(E2.nextTopic(s), 'water');
    assert.strictEqual(s.finished, false);
  });
});

test('water and minerals: tools only at the right moment, only on the soil, in either order', () => {
  const s = placed();
  assert.strictEqual(E2.decideTool(s, 'water', 'soil').msg, 'waterWhen', 'topic not chosen yet');
  E2.selectTopic(s, 'water');
  assert.strictEqual(E2.decideTool(s, 'water', 'soil').msg, 'waterWhen', 'part not chosen yet');
  assert.strictEqual(E2.decideTool(s, 'minerals', 'soil').msg, 'mineralsWhen');
  assert.ok(E2.selectPart(s, 'water'));
  ['leaf', 'stem', 'plant', 'table', null].forEach((z) => assert.strictEqual(E2.decideTool(s, 'water', z).msg, 'waterWrong', String(z)));
  const a = doWater(s); assert.strictEqual(a.wmDone, false);
  assert.strictEqual(s.water, true); assert.strictEqual(E2.subState(s, 'water'), 'done');
  assert.strictEqual(E2.decideTool(s, 'water', 'soil').msg, null, 'already done: silent');
  E2.selectPart(s, 'minerals');
  ['leaf', 'stem', 'plant', null].forEach((z) => assert.strictEqual(E2.decideTool(s, 'minerals', z).msg, 'mineralsWrong', String(z)));
  const b = doMinerals(s); assert.strictEqual(b.wmDone, true);
  assert.strictEqual(E2.topicState(s, 'water'), 'done'); assert.strictEqual(E2.nextTopic(s), 'air');
});

test('magnifier and transparent box: only on the plant; the box can be lifted', () => {
  const s = placed();
  assert.strictEqual(E2.decideTool(s, 'magnifier', 'table').msg, 'magOff');
  assert.deepStrictEqual([E2.decideTool(s, 'magnifier', 'leaf').ok, E2.decideTool(s, 'magnifier', 'leaf').target], [true, 'leaf']);
  assert.strictEqual(E2.decideTool(s, 'magnifier', 'soil').target, 'soil');
  assert.strictEqual(E2.decideTool(s, 'magnifier', 'plant').target, 'leaf');
  assert.strictEqual(E2.decideTool(s, 'box', 'table').msg, 'boxOff');
  E2.applyTool(s, E2.decideTool(s, 'box', 'plant').action); assert.strictEqual(s.box, true);
  assert.strictEqual(E2.decideTool(s, 'box', 'plant').ok, false);
  assert.ok(E2.liftBox(s)); assert.strictEqual(s.box, false); assert.strictEqual(E2.liftBox(s), false);
  assert.strictEqual(s.airDone || s.wmDone || s.finished, false, 'tools never change the progress');
});

test('every order of the two topics, the two processes and the two parts finishes the experiment (md section 62)', () => {
  for (let t = 0; t < 2; t++) for (let g = 0; g < 2; g++) for (let w = 0; w < 2; w++) {
    const s = placed();
    const air = () => { E2.selectTopic(s, 'air'); return g ? (doPhoto(s), doResp(s)) : (doResp(s), doPhoto(s)); };
    const wm = () => { E2.selectTopic(s, 'water'); return w ? (doMinerals(s), doWater(s)) : (doWater(s), doMinerals(s)); };
    if (t) { wm(); assert.strictEqual(s.finished, false); assert.strictEqual(E2.canOpenSynthesis(s), false); air(); }
    else { air(); assert.strictEqual(s.finished, false); wm(); }
    assert.strictEqual(s.finished, true, 'order ' + [t, g, w]); assert.strictEqual(E2.canOpenSynthesis(s), true);
    assert.deepStrictEqual(E2.stepStates(s), ['done', 'done', 'done', 'done']);
    assert.strictEqual(E2.nextTopic(s), null);
  }
});

test('choosing another topic in the middle keeps the finished parts and clears the unfinished choice', () => {
  const s = placed(); E2.selectTopic(s, 'air'); doResp(s); E2.selectProcess(s, 'photo'); gasMove(s, 'co2', 'env', 'leaf');
  E2.selectTopic(s, 'water');
  assert.strictEqual(s.resp.done, true); assert.strictEqual(s.process, null);
  E2.selectTopic(s, 'air'); E2.selectProcess(s, 'photo');
  assert.strictEqual(s.photo.step, 1, 'the half-done process remembers its first move');
  assert.strictEqual(E2.promptKey(s), 'photoPrompt2');
});
