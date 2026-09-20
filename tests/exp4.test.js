// Experiment 4 logic tests (run with:  node --test "tests/*.test.js")
const test = require('node:test');
const assert = require('node:assert');
const E4 = require('../js/logic/exp4.js');

function placed() { const s = E4.initialState(); E4.applyTool(s, E4.decideTool(s, 'mouse', 'table').action); return s; }
function gas(s, g, from, to) { const r = E4.decideGas(s, g, from, to); assert.ok(r.ok, 'expected ok: ' + [g, from, to]); return E4.applyGas(s); }
function doAir(s) { E4.selectTopic(s, 'air'); gas(s, 'o2', 'env', 'body'); return gas(s, 'co2', 'lungs', 'env'); }
function tool(s, t, zone) { const r = E4.decideTool(s, t, zone); assert.ok(r.ok, 'expected ok: ' + [t, zone]); return E4.applyTool(s, r.action); }
function excrete(s, kind) { const r = E4.decideExcrete(s, kind, 'out'); assert.ok(r.ok, 'expected ok: ' + kind); return E4.applyExcrete(s, kind); }
function doWfw(s) { E4.selectTopic(s, 'wfw'); tool(s, 'food', 'near'); tool(s, 'water', 'near'); assert.ok(E4.markDigested(s)); excrete(s, 'waste'); return excrete(s, 'urine'); }

test('start: the mouse is in the tray, both topics locked, only the first step active (md sections 13, 15, 44)', () => {
  const s = E4.initialState();
  assert.deepStrictEqual(E4.stepStates(s), ['active', 'locked', 'locked', 'locked']);
  assert.strictEqual(E4.topicState(s, 'air'), 'locked'); assert.strictEqual(E4.topicState(s, 'wfw'), 'locked');
  assert.strictEqual(E4.selectTopic(s, 'air'), false);
  ['food', 'water', 'magnifier'].forEach((t) => assert.strictEqual(E4.decideTool(s, t, 'near').msg, 'mouseFirst', t));
  assert.strictEqual(E4.decideTool(s, 'mouse', null).msg, 'mouseOff');
  assert.strictEqual(E4.decideTool(s, 'mouse', 'leaf').msg, 'mouseOff');
});

test('placing the mouse opens both topics, in any order (md sections 14 and 44)', () => {
  const s = placed();
  assert.strictEqual(E4.decideTool(s, 'mouse', 'table').ok, false, 'placed once');
  assert.deepStrictEqual(E4.stepStates(s), ['done', 'open', 'locked', 'open']);
  assert.ok(E4.selectTopic(s, 'wfw')); assert.strictEqual(E4.topicState(s, 'wfw'), 'active'); assert.strictEqual(E4.topicState(s, 'air'), 'open');
  assert.ok(E4.selectTopic(s, 'air')); assert.strictEqual(E4.topicState(s, 'air'), 'active');
});

test('breathing: O₂ in first, then CO₂ out; the md wrong-drop cases change nothing', () => {
  const s = placed(); E4.selectTopic(s, 'air');
  assert.deepStrictEqual(E4.promptKeys(s), ['o2Task']);
  assert.strictEqual(E4.decideGas(s, 'o2', 'env', 'env').msg, null, 'not moved away or in: nothing to say');
  assert.strictEqual(E4.decideGas(s, 'co2', 'env', 'body').msg, 'o2Task', 'CO₂ pushed in at the O₂ step repeats the task');
  assert.strictEqual(E4.decideGas(s, 'co2', 'lungs', 'env').ok, false, 'CO₂ is not open before O₂');
  assert.strictEqual(E4.decideGas(s, 'o2', 'env', 'off').msg, null);
  gas(s, 'o2', 'env', 'body');
  assert.strictEqual(s.oxygenIn, true); assert.strictEqual(s.airDone, false);
  assert.deepStrictEqual(E4.promptKeys(s), ['co2Ask', 'co2Task']);
  assert.strictEqual(E4.subState(s, 'o2'), 'done'); assert.strictEqual(E4.subState(s, 'co2'), 'active');
  assert.strictEqual(E4.decideGas(s, 'co2', 'env', 'body').msg, 'co2Wrong');
  assert.strictEqual(E4.decideGas(s, 'o2', 'env', 'body').msg, 'co2Task');
  const out = gas(s, 'co2', 'lungs', 'env');
  assert.strictEqual(out.airDone, true); assert.strictEqual(s.airDone, true);
  assert.strictEqual(E4.topicState(s, 'air'), 'done'); assert.strictEqual(E4.nextTopic(s), 'wfw');
  assert.strictEqual(E4.decideGas(s, 'o2', 'env', 'body').ok, false, 'nothing left to do');
});

test('O₂ dragged far from the body at the O₂ step gets the md message', () => {
  const s = placed(); E4.selectTopic(s, 'air');
  const r = E4.decideGas(s, 'o2', 'env', 'env'); assert.strictEqual(r.ok, false);
  const r2 = E4.decideGas(s, 'o2', 'body', 'env'); assert.deepStrictEqual([r2.ok, r2.msg], [false, 'o2Wrong']);
});

test('food, water, waste, urine: strictly in this order; each wrong drop has its own message (md sections 25–36, 46)', () => {
  const s = placed(); E4.selectTopic(s, 'wfw');
  assert.strictEqual(E4.wfwStep(s), 'food'); assert.deepStrictEqual(E4.promptKeys(s), ['foodTask']);
  assert.strictEqual(E4.decideTool(s, 'water', 'near').msg, 'foodTask', 'water before food repeats the food task');
  assert.strictEqual(E4.decideTool(s, 'food', 'table').msg, 'foodOff'); assert.strictEqual(E4.decideTool(s, 'food', null).msg, 'foodOff');
  tool(s, 'food', 'near'); assert.strictEqual(s.foodIn, true);
  assert.strictEqual(E4.decideTool(s, 'food', 'near').msg, null, 'food is in already');
  assert.strictEqual(E4.wfwStep(s), 'water'); assert.deepStrictEqual(E4.promptKeys(s), ['waterTask']);
  assert.strictEqual(E4.decideTool(s, 'water', 'table').msg, 'waterOff');
  tool(s, 'water', 'mouse'); assert.strictEqual(s.waterIn, true);
  assert.strictEqual(E4.wfwStep(s), 'digest'); assert.deepStrictEqual(E4.promptKeys(s), []);
  assert.strictEqual(E4.decideExcrete(s, 'waste', 'out').ok, false, 'waste waits for the time to pass');
  assert.ok(E4.markDigested(s)); assert.strictEqual(E4.markDigested(s), false, 'only once');
  assert.strictEqual(E4.wfwStep(s), 'waste'); assert.deepStrictEqual(E4.promptKeys(s), ['wasteTask']);
  assert.strictEqual(E4.decideExcrete(s, 'urine', 'out').ok, false, 'urine waits for the waste');
  assert.strictEqual(E4.decideExcrete(s, 'waste', 'in').msg, 'wasteWrong');
  assert.strictEqual(s.wasteOut, false);
  excrete(s, 'waste'); assert.strictEqual(E4.wfwStep(s), 'urine'); assert.deepStrictEqual(E4.promptKeys(s), ['urineTask']);
  assert.strictEqual(E4.decideExcrete(s, 'urine', 'in').msg, 'urineWrong');
  const out = excrete(s, 'urine');
  assert.strictEqual(out.wfwDone, true); assert.strictEqual(s.wfwDone, true); assert.strictEqual(E4.wfwStep(s), null);
  assert.strictEqual(E4.nextTopic(s), 'air');
});

test('the food and the bowl only work inside the water-food-waste topic; the digest step needs both', () => {
  const s = placed();
  assert.strictEqual(E4.decideTool(s, 'food', 'near').msg, 'chooseWfw'); E4.selectTopic(s, 'air');
  assert.strictEqual(E4.decideTool(s, 'water', 'near').msg, 'chooseWfw');
  assert.strictEqual(E4.markDigested(s), false);
  E4.selectTopic(s, 'wfw'); tool(s, 'food', 'near'); assert.strictEqual(E4.markDigested(s), false, 'water is missing');
});

test('the magnifier works on the mouse and what is around it, never before the mouse is placed', () => {
  const s = E4.initialState(); assert.strictEqual(E4.decideTool(s, 'magnifier', 'mouse').msg, 'mouseFirst');
  E4.applyTool(s, 'place');
  ['mouse', 'near', 'table'].forEach((z) => assert.strictEqual(E4.decideTool(s, 'magnifier', z).ok, true, z));
  assert.strictEqual(E4.decideTool(s, 'magnifier', null).msg, 'magOff');
  assert.deepStrictEqual(E4.stepStates(s), ['done', 'open', 'locked', 'open'], 'the magnifier never changes the progress');
});

test('progress bar CHUỘT → LẤY VÀO → SỬ DỤNG → THẢI RA lights up as things are done', () => {
  const s = placed();
  E4.selectTopic(s, 'air'); gas(s, 'o2', 'env', 'body');
  assert.deepStrictEqual(E4.stepStates(s), ['done', 'active', 'locked', 'open']);
  gas(s, 'co2', 'lungs', 'env');
  assert.deepStrictEqual(E4.stepStates(s), ['done', 'active', 'locked', 'active']);
  E4.selectTopic(s, 'wfw'); tool(s, 'food', 'near'); tool(s, 'water', 'near');
  assert.deepStrictEqual(E4.stepStates(s), ['done', 'done', 'active', 'active']);
  E4.markDigested(s);
  assert.deepStrictEqual(E4.stepStates(s), ['done', 'done', 'done', 'active']);
  excrete(s, 'waste'); excrete(s, 'urine');
  assert.deepStrictEqual(E4.stepStates(s), ['done', 'done', 'done', 'done']);
});

test('every order of the two topics finishes the experiment, and only when BOTH are done (md sections 47 and 63)', () => {
  [['air', 'wfw'], ['wfw', 'air']].forEach((order) => {
    const s = placed();
    order.forEach((t, i) => {
      const out = t === 'air' ? doAir(s) : doWfw(s);
      assert.strictEqual(out.finished, i === 1, order.join(' then ') + ' step ' + i);
      assert.strictEqual(s.finished, i === 1);
    });
    assert.strictEqual(E4.nextTopic(s), null);
    assert.deepStrictEqual(E4.stepStates(s), ['done', 'done', 'done', 'done']);
  });
});

test('half-done topics keep their progress when the other topic is chosen', () => {
  const s = placed(); E4.selectTopic(s, 'air'); gas(s, 'o2', 'env', 'body');
  E4.selectTopic(s, 'wfw'); tool(s, 'food', 'near');
  E4.selectTopic(s, 'air');
  assert.strictEqual(s.oxygenIn, true); assert.deepStrictEqual(E4.promptKeys(s), ['co2Ask', 'co2Task']);
  E4.selectTopic(s, 'wfw'); assert.strictEqual(s.foodIn, true); assert.strictEqual(E4.wfwStep(s), 'water');
});
