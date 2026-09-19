// Experiment 3 logic tests (run with:  node --test "tests/*.test.js")
const test = require('node:test');
const assert = require('node:assert');
const E3 = require('../js/logic/exp3.js');

function cagesOnly() { const s = E3.initialState(); E3.apply(s, 'placeCage1'); E3.apply(s, 'placeCage2'); return s; }
function ready(fn) { const s = cagesOnly(); E3.apply(s, 'placeChickA'); E3.apply(s, 'placeChickB'); if (fn) fn(s); return s; }
function drop(s, item, zone) { const r = E3.decideDrop(s, item, zone); if (r.ok) E3.apply(s, r.action); return r; }
const FULL = { food: true, water: true, oxygen: true, light: true, temperature: 33 };

test('initial state matches the md (empty table, cage 2 at 37 °C, nothing installed, lid off)', () => {
  const s = E3.initialState();
  assert.strictEqual(s.phase, 'initial');
  assert.deepStrictEqual(s.cages, { 1: false, 2: false });
  assert.deepStrictEqual(s.chicks, { A: false, B: false });
  assert.deepStrictEqual(s.cage2, { food: false, water: false, oxygen: true, light: false, temperature: 37 });
  assert.deepStrictEqual(E3.stepStates(s), ['active', 'locked', 'locked', 'locked']);
  assert.strictEqual(E3.canStart(s), false);
  assert.strictEqual(E3.lockedKey(s), 'placeCages');
});

test('cages: either one may go first, anywhere on the table; off the table is refused', () => {
  const s = E3.initialState();
  assert.strictEqual(E3.decideDrop(s, 'cage1', null).msg, 'placeCages');
  assert.ok(drop(s, 'cage2', 'bench').ok);
  assert.strictEqual(s.phase, 'initial', 'one cage is not enough');
  assert.strictEqual(drop(s, 'cage2', 'bench').ok, false, 'a placed cage cannot be placed twice');
  assert.ok(drop(s, 'cage1', 'bench').ok);
  assert.strictEqual(s.phase, 'cagesPlaced');
  assert.strictEqual(E3.lockedKey(s), 'placeChicks');
});

test('chicks are locked until BOTH cages are on the table (md section 12)', () => {
  const s = E3.initialState();
  assert.strictEqual(E3.decideDrop(s, 'chickA', 'cage1').msg, 'placeCages');
  drop(s, 'cage1', 'bench');
  const r = E3.decideDrop(s, 'chickA', 'cage1');
  assert.strictEqual(r.ok, false); assert.strictEqual(r.msg, 'placeCages');
  assert.deepStrictEqual(s.chicks, { A: false, B: false });
});

test('chick A → cage 1 and chick B → cage 2 only; every other drop returns the chick with the md message', () => {
  const s = cagesOnly();
  ['cage2', 'bench', null].forEach((z) => assert.strictEqual(E3.decideDrop(s, 'chickA', z).msg, 'chickWrong', 'A on ' + z));
  ['cage1', 'bench', null].forEach((z) => assert.strictEqual(E3.decideDrop(s, 'chickB', z).msg, 'chickWrong', 'B on ' + z));
  assert.ok(drop(s, 'chickA', 'cage1').ok);
  assert.strictEqual(s.phase, 'cagesPlaced');
  assert.ok(drop(s, 'chickB', 'cage2').ok);
  assert.strictEqual(s.phase, 'setup');
  assert.deepStrictEqual(E3.stepStates(s), ['done', 'active', 'locked', 'locked']);
  assert.strictEqual(E3.canStart(s), true);
  assert.strictEqual(E3.lockedKey(s), null);
});

test('food, water, lamp and lid are locked until both chicks are in', () => {
  const s = cagesOnly(); drop(s, 'chickA', 'cage1');
  ['food', 'water', 'lamp', 'lid'].forEach((t) => { assert.strictEqual(E3.decideDrop(s, t, 'cage2').msg, 'placeChicks', t); });
});

test('tools go to cage 2 only: wrong place → the md message; cage 1 is never changed', () => {
  const s = ready();
  assert.strictEqual(E3.decideDrop(s, 'food', 'bench').msg, 'food');
  assert.strictEqual(E3.decideDrop(s, 'water', null).msg, 'water');
  assert.strictEqual(E3.decideDrop(s, 'lamp', 'bench').msg, 'lamp');
  assert.strictEqual(E3.decideDrop(s, 'lid', 'bench').msg, 'lid');
  assert.strictEqual(E3.decideDrop(s, 'lid', 'cage1').msg, 'lidOnly2');
  ['food', 'water', 'lamp'].forEach((t) => { assert.strictEqual(E3.decideDrop(s, t, 'cage1').msg, 'cage1Fixed', t); });
  assert.deepStrictEqual(s, ready(), 'nothing changed');
});

test('conditions follow the md: tray = food, bowl = water, lamp = light, lid = no O₂', () => {
  const s = ready();
  assert.deepStrictEqual(s.cage2, { food: false, water: false, oxygen: true, light: false, temperature: 37 });
  drop(s, 'food', 'cage2'); assert.strictEqual(s.cage2.food, true);
  drop(s, 'water', 'cage2'); assert.strictEqual(s.cage2.water, true);
  drop(s, 'lamp', 'cage2'); assert.strictEqual(s.cage2.light, true);
  drop(s, 'lid', 'cage2'); assert.strictEqual(s.cage2.oxygen, false);
  ['food', 'water', 'lamp', 'lid'].forEach((t) => {
    const r = E3.decideDrop(s, t, 'cage2'); assert.strictEqual(r.ok, false); assert.strictEqual(r.msg, null, t + ' is already in (silent)');
  });
});

test('the lid may be opened again before the start (md section 44), and not after', () => {
  const s = ready(); assert.strictEqual(E3.openLid(s), false, 'no lid yet');
  drop(s, 'lid', 'cage2'); assert.ok(E3.openLid(s));
  assert.strictEqual(s.cage2.oxygen, true); assert.strictEqual(s.items.lid, false);
  drop(s, 'lid', 'cage2'); E3.start(s); assert.strictEqual(E3.openLid(s), false);
});

test('thermostat: locked before both chicks, 1 °C steps from 37, clamped to 0–60, locked after the start', () => {
  const s = cagesOnly(); assert.strictEqual(E3.changeTemperature(s, 1), false);
  const t = ready();
  assert.ok(E3.changeTemperature(t, 1)); assert.strictEqual(t.cage2.temperature, 38);
  assert.ok(E3.changeTemperature(t, -2)); assert.strictEqual(t.cage2.temperature, 36);
  for (let i = 0; i < 100; i++) E3.changeTemperature(t, 1); assert.strictEqual(t.cage2.temperature, 60);
  assert.strictEqual(E3.changeTemperature(t, 1), false);
  for (let i = 0; i < 100; i++) E3.changeTemperature(t, -1); assert.strictEqual(t.cage2.temperature, 0);
  assert.strictEqual(E3.changeTemperature(t, -1), false);
  E3.start(t); assert.strictEqual(E3.changeTemperature(t, 1), false, 'locked once started');
});

test('after START everything is locked; the result screen keeps it locked', () => {
  const s = ready(); assert.ok(E3.start(s));
  assert.strictEqual(s.phase, 'running');
  ['chickA', 'chickB', 'cage1', 'cage2', 'food', 'water', 'lamp', 'lid'].forEach((t) => assert.strictEqual(E3.decideDrop(s, t, 'cage2').msg, 'locked', t));
  assert.deepStrictEqual(E3.stepStates(s), ['done', 'done', 'active', 'locked']);
  assert.strictEqual(E3.start(s), false, 'cannot start twice');
  assert.ok(E3.finish(s)); assert.deepStrictEqual(E3.stepStates(s), ['done', 'done', 'done', 'active']);
  assert.strictEqual(E3.decideDrop(s, 'food', 'cage2').msg, 'locked');
});

test('START is refused before both cages and both chicks are in', () => {
  assert.strictEqual(E3.start(E3.initialState()), false);
  assert.strictEqual(E3.start(cagesOnly()), false);
  const s = cagesOnly(); drop(s, 'chickA', 'cage1'); assert.strictEqual(E3.start(s), false);
});

/* --- outcomes --- */
test('cage 1 result: healthy, 65 g → 75 g (md section 25)', () => {
  const o = E3.healthyOutcome();
  assert.strictEqual(o.level, 'healthy'); assert.strictEqual(o.key, 'healthy'); assert.strictEqual(o.weight, 75);
  assert.strictEqual(E3.START_WEIGHT, 65); assert.strictEqual(E3.CAGE1_TEMP, 37);
});

test('temperature table: every degree 0–60 gives the md result for a cage that is otherwise complete', () => {
  for (let t = 0; t <= 60; t++) {
    const o = E3.evaluate(Object.assign({}, FULL, { temperature: t }));
    if (t <= 27) { assert.strictEqual(o.key, 'cold'); assert.strictEqual(o.level, 'dead'); }
    else if (t <= 31) { assert.strictEqual(o.key, 'cool'); assert.strictEqual(o.level, 'abnormal'); }
    else if (t <= 35) { assert.strictEqual(o.key, 'healthy'); assert.strictEqual(o.level, 'healthy'); }
    else if (t <= 39) { assert.strictEqual(o.key, 'warm'); assert.strictEqual(o.level, 'abnormal'); }
    else { assert.strictEqual(o.key, 'hot'); assert.strictEqual(o.level, 'dead'); }
  }
});

test('the default 37 °C is only "abnormal" even if the cage is complete (md table, as chosen)', () => {
  const o = E3.evaluate(Object.assign({}, FULL, { temperature: 37 }));
  assert.strictEqual(o.key, 'warm'); assert.strictEqual(o.level, 'abnormal'); assert.strictEqual(o.alive, true);
});

test('single missing factor: it is the only cause, chick stays alive but weak (md sections 27–33)', () => {
  [['food', 'weak'], ['water', 'dying'], ['oxygen', 'dying'], ['light', 'abnormal']].forEach(([f, level]) => {
    const o = E3.evaluate(Object.assign({}, FULL, { [f]: false }));
    assert.strictEqual(o.key, f); assert.deepStrictEqual(o.missing, [f]); assert.strictEqual(o.level, level, f); assert.strictEqual(o.alive, true);
  });
});

test('md example (section 35): no O₂ + no light + unsuitable temperature → dead, every cause listed', () => {
  const o = E3.evaluate({ food: true, water: true, oxygen: false, light: false, temperature: 37 });
  assert.strictEqual(o.key, 'combo'); assert.deepStrictEqual(o.causes, ['oxygen', 'light', 'warm']);
  assert.deepStrictEqual(o.missing, ['oxygen', 'light']); assert.strictEqual(o.level, 'dead'); assert.strictEqual(o.weight, null);
});

test('md example (section 49): no O₂ + no light at 34 °C → still combined, and the cage keeps its food and water', () => {
  const o = E3.evaluate({ food: true, water: true, oxygen: false, light: false, temperature: 34 });
  assert.strictEqual(o.key, 'combo'); assert.deepStrictEqual(o.causes, ['oxygen', 'light']); assert.strictEqual(o.band, 'ideal');
  assert.strictEqual(o.level, 'dying');
  assert.ok(o.profile.pant > 0 && o.profile.sleepy > 0, 'both behaviours are switched on');
  assert.strictEqual(o.profile.seekFood, 0); assert.strictEqual(o.profile.seekWater, 0);
});

test('md example (section 50): no O₂, water, food → all three behaviours combined, never just one', () => {
  const o = E3.evaluate({ food: false, water: false, oxygen: false, light: true, temperature: 34 });
  assert.deepStrictEqual(o.missing, ['food', 'water', 'oxygen']);
  assert.ok(o.profile.seekFood > 0 && o.profile.seekWater > 0 && o.profile.pant > 0 && o.profile.neck > 0);
  assert.strictEqual(o.level, 'dead');
});

test('all 16 combinations × every temperature: valid, consistent, and never healthier than any single cause', () => {
  const rank = { healthy: 0, abnormal: 1, weak: 2, dying: 3, dead: 4 };
  const single = (c) => E3.evaluate(Object.assign({}, FULL, c === 'food' ? { food: false } : c === 'water' ? { water: false } : c === 'oxygen' ? { oxygen: false } :
    c === 'light' ? { light: false } : { temperature: { cold: 10, cool: 29, warm: 37, hot: 45 }[c] }));
  for (let m = 0; m < 16; m++) {
    for (let t = 0; t <= 60; t++) {
      const C = { food: !!(m & 1), water: !!(m & 2), oxygen: !!(m & 4), light: !!(m & 8), temperature: t };
      const o = E3.evaluate(C);
      assert.ok(['healthy', 'abnormal', 'weak', 'dying', 'dead'].includes(o.level));
      assert.strictEqual(o.missing.length, 4 - [C.food, C.water, C.oxygen, C.light].filter(Boolean).length);
      o.causes.forEach((c) => assert.ok(rank[o.level] >= rank[single(c).level], JSON.stringify(C) + ' is at least as bad as ' + c));
      E3.KEYS.forEach((k) => { assert.ok(Number.isFinite(o.profile[k]) && o.profile[k] >= 0 && o.profile[k] <= 1, k + ' in 0..1'); });
      assert.strictEqual(o.alive, o.level !== 'dead');
      assert.strictEqual(o.weight === null, o.level === 'dead');
      if (o.level === 'dead') assert.strictEqual(o.profile.lie, 1); else assert.strictEqual(o.profile.lie, 0);
      assert.strictEqual(o.env.mist, !C.oxygen); assert.strictEqual(o.env.dark, !C.light);
    }
  }
});

test('progress runs 0 → 1 over 7 days; behaviour and surroundings follow it; a chick lies down only at the end', () => {
  const o = E3.evaluate({ food: true, water: true, oxygen: false, light: false, temperature: 37 });
  assert.strictEqual(E3.progressAt(0), 0); assert.ok(Math.abs(E3.progressAt(7) - 1) < 1e-9);
  for (let d = 1; d <= 7; d++) assert.ok(E3.progressAt(d) > E3.progressAt(d - 1), 'day ' + d);
  const p0 = E3.profileAt(o, 0), p7 = E3.profileAt(o, 7);
  assert.deepStrictEqual(p0, E3.BASE);
  E3.KEYS.forEach((k) => assert.ok(Math.abs(p7[k] - o.profile[k]) < 1e-9, k));
  assert.strictEqual(E3.profileAt(o, 3).lie, 0); assert.strictEqual(E3.profileAt(o, 7).lie, 1);
  const e0 = E3.envAt(o, 0), e7 = E3.envAt(o, 7);
  assert.strictEqual(e0.mist, 0.3); assert.ok(Math.abs(e7.mist - 1) < 1e-9); assert.strictEqual(e7.night, 1);
  assert.strictEqual(E3.envAt(E3.healthyOutcome(), 7).mist, 0);
});

test('cold and hot surroundings: strong for the extreme bands, gentle for 28–31 and 36–39 °C', () => {
  const at = (t) => E3.envAt(E3.evaluate(Object.assign({}, FULL, { temperature: t })), 7);
  assert.deepStrictEqual([at(10).tempKind, at(10).temp], ['cold', 1]);
  assert.deepStrictEqual([at(29).tempKind, at(29).temp], ['cold', 0.35]);
  assert.strictEqual(at(33).tempKind, null);
  assert.deepStrictEqual([at(37).tempKind, at(37).temp], ['hot', 0.4]);
  assert.deepStrictEqual([at(50).tempKind, at(50).temp], ['hot', 1]);
});
