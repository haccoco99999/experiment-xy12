/* Experiment 6 – pure logic (no 3D, no DOM): four new plants from four parts (bean seed, sweet potato root, potato tuber, kalanchoe leaf).
   Strictly in order (md sections 56, 57 and 66): pots → samples → water → look (fast forward to day 14) → classify the four ways → grow up.
   Index 0..3 is the pot and the sample: 0 bean (seed), 1 sweet potato (root), 2 potato (stem), 3 kalanchoe (leaf).
   Runs in the browser and in Node (tests). */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.Lab = root.Lab || {}; root.Lab.logic = root.Lab.logic || {}; root.Lab.logic.exp6 = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var N = 4, DAYS = [0, 2, 4, 7, 14];

  function four() { return [false, false, false, false]; }
  function initialState() {
    return {
      pots: four(), samples: four(), watered: four(),               // pot1Placed…, beanPlaced…, pot1Watered…
      started: false, day: 0, lapse: 'idle',                        // idle | run1 (day 0 → 14) | at14 (four plantlets, classification open) | run2 (growing up) | done
      classified: four(), classDone: false, mature: false, complete: false
    };
  }
  function all(a) { return a.every(function (x) { return x; }); }
  function allPots(s) { return all(s.pots); }
  function allSamples(s) { return all(s.samples); }
  function allWatered(s) { return all(s.watered); }

  /* ---------------- pots, samples, water, magnifier ---------------- */
  /* pot: 0..3; target: the position it was dropped on (0..3) or null (anywhere else) */
  function decidePot(s, pot, target) {
    if (s.pots[pot]) return { ok: false, msg: null };
    return target === pot ? { ok: true, action: 'pot', pot: pot } : { ok: false, msg: 'potWrong' };
  }
  function applyPot(s, pot) { s.pots[pot] = true; return { all: allPots(s) }; }
  function decideSample(s, sample, target) {
    if (!allPots(s)) return { ok: false, msg: 'potsFirst' };
    if (s.samples[sample]) return { ok: false, msg: null };
    return target === sample ? { ok: true, action: 'sample', sample: sample } : { ok: false, msg: 'wrong' + sample };
  }
  function applySample(s, sample) { s.samples[sample] = true; return { all: allSamples(s), msg: 'right' + sample }; }
  function decideWater(s, target) {
    if (!allSamples(s)) return { ok: false, msg: 'samplesFirst' };
    if (target === null || target === undefined) return { ok: false, msg: 'waterOff' };
    if (s.watered[target]) return { ok: false, msg: null };
    return { ok: true, action: 'water', pot: target };
  }
  function applyWater(s, pot) { s.watered[pot] = true; return { all: allWatered(s) }; }
  /* the magnifier only looks; it never changes the plants (md section 59) */
  function decideLens(s, target) {
    if (target === null || target === undefined) return { ok: false, msg: 'lensOff' };
    if (!s.samples[target]) return { ok: false, msg: 'lensEmpty' };
    return { ok: true, action: 'lens', pot: target };
  }

  /* ---------------- the fast forward ---------------- */
  function canStart(s) { return allWatered(s) && !s.started; }
  function start(s) { if (!canStart(s)) return false; s.started = true; s.lapse = 'run1'; s.day = 0; return true; }
  /* the picture reached a day of the time bar; day 14 stops with four plantlets and opens the classification */
  function arrive(s, day) {
    if (s.lapse !== 'run1' || DAYS.indexOf(day) < 0 || day < s.day) return null;
    s.day = day;
    if (day === 14) { s.lapse = 'at14'; return { plantlets: true }; }
    return { plantlets: false };
  }
  function plantletsFormed(s) { return s.lapse === 'at14' || s.lapse === 'run2' || s.lapse === 'done'; }

  /* ---------------- classification: card i (HẠT, RỄ, THÂN, LÁ) goes onto plant j ---------------- */
  function classifying(s) { return s.lapse === 'at14' && !s.classDone; }
  function decideClass(s, card, target) {
    if (!classifying(s) || s.classified[card]) return { ok: false, msg: null };
    return target === card ? { ok: true, action: 'class', card: card } : { ok: false, msg: 'classWrong' };
  }
  function applyClass(s, card) { s.classified[card] = true; if (all(s.classified)) s.classDone = true; return { done: s.classDone }; }

  /* ---------------- growing up ---------------- */
  function canGrow(s) { return s.classDone && s.lapse === 'at14'; }
  function grow(s) { if (!canGrow(s)) return false; s.lapse = 'run2'; return true; }
  function finish(s) { if (s.lapse !== 'run2') return false; s.lapse = 'done'; s.mature = true; s.complete = true; return true; }

  /* ---------------- prompts and the progress bar ---------------- */
  /* CHUẨN BỊ → ĐẶT MẪU → TƯỚI NƯỚC → QUAN SÁT → CÂY CON → PHÂN LOẠI → CÂY TRƯỞNG THÀNH → HOÀN THÀNH */
  function stepStates(s) {
    var pots = allPots(s), samples = allSamples(s), water = allWatered(s), plantlets = plantletsFormed(s);
    return [
      pots ? 'done' : 'active',
      !pots ? 'locked' : samples ? 'done' : 'active',
      !samples ? 'locked' : water ? 'done' : 'active',
      !water ? 'locked' : !s.started ? 'open' : plantlets ? 'done' : 'active',
      !s.started ? 'locked' : plantlets ? 'done' : 'active',
      !plantlets ? 'locked' : s.classDone ? 'done' : 'active',
      !s.classDone ? 'locked' : s.mature ? 'done' : 'active',
      s.complete ? 'done' : 'locked'
    ];
  }
  /* which sentence to show now: 'potsTask' | 'sampleTask' | 'waterTask' | 'startTask' | 'classTask' | 'growTask' | null */
  function promptKey(s) {
    if (s.complete) return null;
    if (!allPots(s)) return 'potsTask';
    if (!allSamples(s)) return 'sampleTask';
    if (!allWatered(s)) return 'waterTask';
    if (!s.started) return 'startTask';
    if (classifying(s)) return 'classTask';
    if (canGrow(s)) return 'growTask';
    return null;
  }
  /* the days on the time bar: 'done' | 'active' | 'todo' */
  function dayStates(s) { return DAYS.map(function (d) { return !s.started ? 'todo' : d < s.day ? 'done' : d === s.day ? 'active' : 'todo'; }); }

  return {
    N: N, DAYS: DAYS, initialState: initialState, allPots: allPots, allSamples: allSamples, allWatered: allWatered,
    decidePot: decidePot, applyPot: applyPot, decideSample: decideSample, applySample: applySample,
    decideWater: decideWater, applyWater: applyWater, decideLens: decideLens,
    canStart: canStart, start: start, arrive: arrive, plantletsFormed: plantletsFormed,
    classifying: classifying, decideClass: decideClass, applyClass: applyClass,
    canGrow: canGrow, grow: grow, finish: finish, stepStates: stepStates, promptKey: promptKey, dayStates: dayStates
  };
});
