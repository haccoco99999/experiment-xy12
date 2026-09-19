// Logic tests (run with:  node --test tests)
const test = require('node:test');
const assert = require('node:assert');
const bands = require('../js/logic/temperature-bands.js');
const E1 = require('../js/logic/exp1.js');

function setup(fn) { const s = E1.initialState(); E1.apply(s, 'placeA'); E1.apply(s, 'placeB'); if (fn) fn(s); return s; }

test('temperature table is exactly the md table for every degree 0–60', () => {
  const expect = (t) => t <= 27 ? 'cold' : t <= 31 ? 'cool' : t <= 35 ? 'ideal' : t <= 39 ? 'warm' : 'hot';
  for (let t = 0; t <= 60; t++) assert.strictEqual(bands.bandOf(t).id, expect(t), 'temperature ' + t);
  assert.strictEqual(bands.bandOf(-5).id, 'cold');
  assert.strictEqual(bands.bandOf(99).id, 'hot');
});

test('initial state matches the md (28 °C, empty bench, nothing placed, water not given yet)', () => {
  const s = E1.initialState();
  assert.strictEqual(s.phase, 'initial');
  assert.deepStrictEqual(s.placed, { A: false, B: false });
  assert.strictEqual(s.B.temperature, 28);
  assert.deepStrictEqual(E1.stepStates(s), ['active', 'locked', 'locked', 'locked']);
  assert.strictEqual(E1.canStart(s), false);
});

test('other tools before the pots are placed → "placePotsFirst", state untouched', () => {
  const s = E1.initialState();
  ['water', 'gravel', 'npk', 'blackBin', 'clearBin'].forEach((tool) => {
    const r = E1.decideDrop(s, tool, 'potB');
    assert.strictEqual(r.ok, false); assert.strictEqual(r.msg, 'placePotsFirst');
  });
  assert.deepStrictEqual(s, E1.initialState());
});

test('pots: placing anywhere on the bench works; off the table is refused; both placed unlocks step 2', () => {
  const s = E1.initialState();
  assert.strictEqual(E1.decideDrop(s, 'potA', null).ok, false);
  assert.strictEqual(E1.decideDrop(s, 'potA', null).msg, 'potOffTable');
  const a = E1.decideDrop(s, 'potA', 'bench'); assert.ok(a.ok); E1.apply(s, a.action);
  assert.strictEqual(s.phase, 'plantPlacement'); assert.strictEqual(E1.canStart(s), false);
  const b = E1.decideDrop(s, 'potB', 'bench'); assert.ok(b.ok); E1.apply(s, b.action);
  assert.strictEqual(s.phase, 'conditionSetup'); assert.strictEqual(E1.canStart(s), true);
  assert.deepStrictEqual(E1.stepStates(s), ['done', 'active', 'locked', 'locked']);
});

test('tools: wrong place → the md message key; pot A (control) is never changed', () => {
  const s = setup();
  assert.strictEqual(E1.decideDrop(s, 'water', 'bench').msg, 'water');
  assert.strictEqual(E1.decideDrop(s, 'gravel', null).msg, 'gravel');
  assert.strictEqual(E1.decideDrop(s, 'blackBin', null).msg, 'blackBin');
  assert.strictEqual(E1.decideDrop(s, 'clearBin', null).msg, 'clearBin');
  ['water', 'gravel', 'npk', 'blackBin', 'clearBin'].forEach((t) => {
    const r = E1.decideDrop(s, t, 'potA'); assert.strictEqual(r.ok, false); assert.strictEqual(r.msg, 'toolOnControl');
  });
});

test('conditions follow the md: water needs a drop; gravel removes minerals; NPK restores them; bins remove light / air', () => {
  const s = setup();
  assert.deepStrictEqual(s.B, { water: false, minerals: true, air: true, light: true, temperature: 28 });
  E1.apply(s, E1.decideDrop(s, 'water', 'potB').action); assert.strictEqual(s.B.water, true);
  E1.apply(s, E1.decideDrop(s, 'gravel', 'potB').action); assert.strictEqual(s.B.minerals, false);
  E1.apply(s, E1.decideDrop(s, 'npk', 'potB').action); assert.strictEqual(s.B.minerals, true);
  E1.apply(s, E1.decideDrop(s, 'blackBin', 'potB').action); assert.strictEqual(s.B.light, false);
  E1.apply(s, E1.decideDrop(s, 'clearBin', 'potB').action); assert.strictEqual(s.B.air, false);
  assert.strictEqual(E1.decideDrop(s, 'blackBin', 'potB').ok, false, 'the bin is already on');
});

test('NPK on soil that already has minerals is accepted with a friendly note (no state change needed)', () => {
  const s = setup(); const r = E1.decideDrop(s, 'npk', 'potB');
  assert.ok(r.ok); assert.strictEqual(r.note, 'alreadyRich');
});

test('thermostat: locked before both pots, 1 °C steps, clamped to 0–60, locked after start', () => {
  const s = E1.initialState();
  assert.strictEqual(E1.changeTemperature(s, 1), false);
  const t = setup();
  assert.ok(E1.changeTemperature(t, 1)); assert.strictEqual(t.B.temperature, 29);
  for (let i = 0; i < 100; i++) E1.changeTemperature(t, 1); assert.strictEqual(t.B.temperature, 60);
  for (let i = 0; i < 100; i++) E1.changeTemperature(t, -1); assert.strictEqual(t.B.temperature, 0);
  assert.strictEqual(E1.changeTemperature(t, -1), false);
  E1.start(t); assert.strictEqual(E1.changeTemperature(t, 1), false, 'locked once started');
});

test('after START everything is locked; drops are refused with "locked"', () => {
  const s = setup(); assert.ok(E1.start(s));
  assert.strictEqual(s.phase, 'experimentRunning');
  ['water', 'gravel', 'npk', 'blackBin', 'clearBin'].forEach((t) => assert.strictEqual(E1.decideDrop(s, t, 'potB').msg, 'locked'));
  assert.deepStrictEqual(E1.stepStates(s), ['done', 'done', 'active', 'locked']);
  assert.ok(E1.finish(s)); assert.deepStrictEqual(E1.stepStates(s), ['done', 'done', 'done', 'active']);
});

/* --- outcomes: every combination of the four yes/no conditions at every temperature --- */
test('single-cause outcomes match md sections 23–27', () => {
  const ideal = 33;
  const cases = [
    [{ water: true, minerals: true, air: true, light: true, temperature: ideal }, 'healthy', 'healthy', null],
    [{ water: true, minerals: false, air: true, light: true, temperature: ideal }, 'minerals', 'weak', null],
    [{ water: false, minerals: true, air: true, light: true, temperature: ideal }, 'water', 'dead', 14],
    [{ water: true, minerals: true, air: true, light: false, temperature: ideal }, 'light', 'dying', null],
    [{ water: true, minerals: true, air: false, light: true, temperature: ideal }, 'air', 'dead', 14],
    [{ water: true, minerals: true, air: true, light: true, temperature: 10 }, 'cold', 'dead', 14],
    [{ water: true, minerals: true, air: true, light: true, temperature: 29 }, 'cool', 'abnormal', null],
    [{ water: true, minerals: true, air: true, light: true, temperature: 37 }, 'warm', 'abnormal', null],
    [{ water: true, minerals: true, air: true, light: true, temperature: 45 }, 'hot', 'dead', 7]
  ];
  cases.forEach(([B, key, level, dead]) => {
    const o = E1.evaluate(B);
    assert.strictEqual(o.key, key, JSON.stringify(B)); assert.strictEqual(o.level, level, key); assert.strictEqual(o.deadDay, dead, key);
  });
});

test('with the default 28 °C the plant is only "abnormal" even if everything else is fine (md table, as chosen)', () => {
  const o = E1.evaluate({ water: true, minerals: true, air: true, light: true, temperature: 28 });
  assert.strictEqual(o.key, 'cool'); assert.strictEqual(o.level, 'abnormal');
});

test('all 16 condition combinations × every temperature give a valid, consistent outcome', () => {
  const rank = { healthy: 0, abnormal: 1, weak: 2, dying: 3, dead: 4 };
  for (let m = 0; m < 16; m++) {
    for (let t = 0; t <= 60; t++) {
      const B = { water: !!(m & 1), minerals: !!(m & 2), air: !!(m & 4), light: !!(m & 8), temperature: t };
      const o = E1.evaluate(B);
      assert.ok(o.visual && o.visual.root, 'has visuals');
      assert.ok(['healthy', 'abnormal', 'weak', 'dying', 'dead'].includes(o.level));
      // more causes can never make the plant healthier than any single one of them
      o.causes.forEach((c) => {
        const single = E1.evaluate(Object.assign({ water: true, minerals: true, air: true, light: true, temperature: 33 },
          c === 'water' ? { water: false } : c === 'minerals' ? { minerals: false } : c === 'air' ? { air: false } : c === 'light' ? { light: false } :
            { temperature: { cold: 10, cool: 29, warm: 37, hot: 45 }[c] }));
        assert.ok(rank[o.level] >= rank[single.level], 'combination ' + JSON.stringify(B) + ' is at least as bad as ' + c);
      });
      if (o.level === 'dead') assert.ok(o.deadDay === 7 || o.deadDay === 14);
      for (const k of ['height', 'leafScale', 'stem', 'droop', 'wilt', 'leafDrop', 'rot']) assert.ok(Number.isFinite(o.visual[k]), k);
    }
  }
});

test('several missing factors are combined (never just one cause) and reported', () => {
  const o = E1.evaluate({ water: true, minerals: true, air: false, light: false, temperature: 33 });
  assert.strictEqual(o.key, 'combo'); assert.deepStrictEqual(o.causes.sort(), ['air', 'light']); assert.strictEqual(o.level, 'dead');
});

test('progress curve runs 0 → 1 and dies-by-day-7 plants finish sooner', () => {
  const dead7 = E1.evaluate({ water: true, minerals: true, air: true, light: true, temperature: 50 });
  const dead14 = E1.evaluate({ water: false, minerals: true, air: true, light: true, temperature: 33 });
  assert.strictEqual(E1.progressAt(0, dead14), 0); assert.ok(Math.abs(E1.progressAt(14, dead14) - 1) < 1e-9);
  assert.ok(Math.abs(E1.progressAt(7, dead7) - 1) < 1e-9); assert.ok(E1.progressAt(7, dead14) < 0.7);
});

test('soil look follows the conditions', () => {
  assert.strictEqual(E1.setupSoil({ water: false, minerals: true }), 'rich');
  assert.strictEqual(E1.setupSoil({ water: true, minerals: true }), 'moist');
  assert.strictEqual(E1.setupSoil({ water: true, minerals: false }), 'gravelMoist');
  assert.strictEqual(E1.evaluate({ water: false, minerals: true, air: true, light: true, temperature: 33 }).soil, 'dry');
  assert.strictEqual(E1.evaluate({ water: true, minerals: true, air: false, light: true, temperature: 33 }).soil, 'soggy');
});
