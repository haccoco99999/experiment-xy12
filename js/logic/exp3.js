/* Experiment 3 – pure logic (no 3D, no DOM): what a drop does, when steps unlock, and how the chick in
   cage 2 behaves over 7 days. Written to run both in the browser and in Node (tests). */
(function (root, factory) {
  var deps = (typeof module === 'object' && module.exports)
    ? { bands: require('./temperature-bands.js') }
    : { bands: root.Lab.logic.temperatureBands };
  var api = factory(deps);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Lab.logic.exp3 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (deps) {
  'use strict';
  var bands = deps.bands;

  var CAGE1_TEMP = 37;                       // md section 6.1: cage 1 is always 37 °C
  var DEFAULT_TEMP = 37;                     // md section 6.2: cage 2 starts at 37 °C (37 → 38 → 39 …)
  var DAYS = 7;
  var SCORE = { healthy: 0, abnormal: 1, weak: 2, dying: 3, dead: 5 };

  /* How serious each single cause is. The md only says "sống nhưng không bình thường" or "không sống được"
     for temperature (section 32); for the other four it says "may die if it lasts" (sections 27–33), so a
     single missing factor is weak or dying, and several together add up (see evaluate). */
  var LEVEL_OF = { light: 'abnormal', food: 'weak', water: 'dying', oxygen: 'dying', cool: 'abnormal', warm: 'abnormal', cold: 'dead', hot: 'dead' };

  /* Estimated weight (g) after 7 days, by level. The md gives only cage 1: 65 g → 75 g. */
  var WEIGHT_AFTER = { healthy: 75, abnormal: 72, weak: 68, dying: 62, dead: null };
  var START_WEIGHT = 65;

  /* Behaviour numbers (0..1). The words for each behaviour live in content/exp3.vi.js.
     activity 1 = normal walking; seekFood / seekWater = searching; pant = beak open + fast breathing;
     neck = stretched neck; wings = spread wings; shiver, fluff, huddle = cold behaviour; weak = lethargic;
     sleepy = eyes half shut; chirp = calls a lot; growth = share of normal growth; pale = paler colour. */
  var KEYS = ['activity', 'seekFood', 'seekWater', 'pant', 'neck', 'wings', 'shiver', 'fluff', 'huddle', 'weak', 'lie', 'sleepy', 'chirp', 'growth', 'pale'];
  var BASE = { activity: 1, seekFood: 0, seekWater: 0, pant: 0, neck: 0, wings: 0, shiver: 0, fluff: 0, huddle: 0, weak: 0, lie: 0, sleepy: 0, chirp: 0, growth: 1, pale: 0 };
  var FX = {
    food: { activity: 0.7, seekFood: 1, weak: 0.55, growth: 0.35, pale: 0.2 },
    water: { activity: 0.6, seekWater: 1, chirp: 1, weak: 0.7, growth: 0.3, pale: 0.25 },
    oxygen: { activity: 0.5, pant: 0.9, neck: 1, weak: 0.65, growth: 0.3 },
    light: { activity: 0.5, sleepy: 0.9, weak: 0.1, growth: 0.7 },
    cool: { activity: 0.75, shiver: 0.35, huddle: 0.5, fluff: 0.55, growth: 0.8 },
    warm: { activity: 0.75, pant: 0.6, wings: 0.7, growth: 0.8 },
    cold: { activity: 0.25, shiver: 1, huddle: 1, fluff: 1, weak: 0.9, growth: 0, pale: 0.4 },
    hot: { activity: 0.2, pant: 1, wings: 1, weak: 0.95, growth: 0, pale: 0.3 }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(a, b, x) { var t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }

  /* ---------------- state ---------------- */
  function initialState() {
    return {
      phase: 'initial',                       // initial → cagesPlaced → setup → running → result
      cages: { 1: false, 2: false },
      chicks: { A: false, B: false },
      items: { food: false, water: false, lamp: false, lid: false },
      cage2: { food: false, water: false, oxygen: true, light: false, temperature: DEFAULT_TEMP }
    };
  }
  function bothCages(s) { return s.cages[1] && s.cages[2]; }
  function bothChicks(s) { return s.chicks.A && s.chicks.B; }

  var TOOL_MSG = { food: 'food', water: 'water', lamp: 'lamp', lid: 'lid' };

  /* Decides what dropping `item` on `zone` ('bench' | 'cage1' | 'cage2' | null) does. Never changes the state. */
  function decideDrop(state, item, zone) {
    if (state.phase === 'running' || state.phase === 'result') return { ok: false, msg: 'locked' };
    if (item === 'cage1' || item === 'cage2') {
      var n = item === 'cage1' ? 1 : 2;
      if (state.cages[n]) return { ok: false, msg: null };
      if (zone === 'bench' || zone === 'cage1' || zone === 'cage2') return { ok: true, action: 'placeCage' + n };
      return { ok: false, msg: 'placeCages' };
    }
    if (!bothCages(state)) return { ok: false, msg: 'placeCages' };
    if (item === 'chickA' || item === 'chickB') {
      var w = item === 'chickA' ? 'A' : 'B';
      if (state.chicks[w]) return { ok: false, msg: null };
      if (zone === (w === 'A' ? 'cage1' : 'cage2')) return { ok: true, action: 'placeChick' + w };
      return { ok: false, msg: 'chickWrong' };
    }
    if (!bothChicks(state)) return { ok: false, msg: 'placeChicks' };
    if (zone === 'cage1') return { ok: false, msg: item === 'lid' ? 'lidOnly2' : 'cage1Fixed' };
    if (zone !== 'cage2') return { ok: false, msg: TOOL_MSG[item] || 'food' };
    if (state.items[item]) return { ok: false, msg: null };
    return { ok: true, action: item };
  }

  function apply(state, action) {
    var s = state;
    switch (action) {
      case 'placeCage1': s.cages[1] = true; break;
      case 'placeCage2': s.cages[2] = true; break;
      case 'placeChickA': s.chicks.A = true; break;
      case 'placeChickB': s.chicks.B = true; break;
      case 'food': s.items.food = true; s.cage2.food = true; break;
      case 'water': s.items.water = true; s.cage2.water = true; break;
      case 'lamp': s.items.lamp = true; s.cage2.light = true; break;
      case 'lid': s.items.lid = true; s.cage2.oxygen = false; break;     // md section 44: lid on → no O₂
      case 'openLid': s.items.lid = false; s.cage2.oxygen = true; break; // md section 44: the lid may be opened before the start
      default: break;
    }
    if (bothCages(s) && bothChicks(s)) s.phase = 'setup';
    else if (bothCages(s)) s.phase = 'cagesPlaced';
    else s.phase = 'initial';
    return s;
  }

  function canOpenLid(state) { return state.phase === 'setup' && state.items.lid; }
  function openLid(state) { if (!canOpenLid(state)) return false; apply(state, 'openLid'); return true; }

  /* [-] / [+] of cage 2. Cage 1 never changes. Locked until both chicks are in, and after the start. */
  function canChangeTemperature(state) { return state.phase === 'setup'; }
  function changeTemperature(state, delta) {
    if (!canChangeTemperature(state)) return false;
    var t = Math.max(bands.MIN, Math.min(bands.MAX, state.cage2.temperature + delta));
    if (t === state.cage2.temperature) return false;
    state.cage2.temperature = t; return true;
  }
  /* which md sentence explains why the controls are still locked (null = not locked) */
  function lockedKey(state) {
    if (state.phase === 'setup') return null;
    if (!bothCages(state)) return 'placeCages';
    if (!bothChicks(state)) return 'placeChicks';
    return null;
  }

  function canStart(state) { return state.phase === 'setup'; }
  function start(state) { if (!canStart(state)) return false; state.phase = 'running'; return true; }
  function finish(state) { if (state.phase !== 'running') return false; state.phase = 'result'; return true; }

  /* 4 steps of the progress bar → 'done' | 'active' | 'locked' */
  function stepStates(state) {
    switch (state.phase) {
      case 'setup': return ['done', 'active', 'locked', 'locked'];
      case 'running': return ['done', 'done', 'active', 'locked'];
      case 'result': return ['done', 'done', 'done', 'active'];
      default: return ['active', 'locked', 'locked', 'locked'];
    }
  }

  /* ---------------- outcome ---------------- */
  function mergeProfile(causes, level) {
    var p = clone(BASE), stay = 1;
    causes.forEach(function (c) {
      var f = FX[c];
      KEYS.forEach(function (k) {
        if (f[k] == null) return;
        if (k === 'activity' || k === 'growth') p[k] = Math.min(p[k], f[k]);
        else if (k === 'weak') stay *= 1 - f[k];                 // weakness adds up, never above 1
        else p[k] = Math.max(p[k], f[k]);
      });
    });
    p.weak = 1 - stay;
    if (level === 'dead') { p.lie = 1; p.weak = 1; p.activity = 0; p.growth = 0; }
    else if (level === 'dying') { p.weak = Math.max(p.weak, 0.8); p.activity = Math.min(p.activity, 0.25); }
    else if (level === 'weak') p.weak = Math.max(p.weak, 0.5);
    return p;
  }

  /* Reads ALL five conditions (never just one) and returns what happens to the chick over 7 days. */
  function evaluate(C) {
    var band = bands.bandOf(C.temperature).id, causes = [], missing = [];
    if (!C.food) missing.push('food');
    if (!C.water) missing.push('water');
    if (!C.oxygen) missing.push('oxygen');
    if (!C.light) missing.push('light');
    causes = missing.slice();
    if (band !== 'ideal') causes.push(band);
    var score = causes.reduce(function (s, c) { return s + SCORE[LEVEL_OF[c]]; }, 0);
    var level = score >= 5 ? 'dead' : score >= 3 ? 'dying' : score >= 2 ? 'weak' : score >= 1 ? 'abnormal' : 'healthy';
    var profile = causes.length === 0 ? clone(BASE) : mergeProfile(causes, level);
    var temp = { kind: null, amount: 0 };
    if (band === 'cold') temp = { kind: 'cold', amount: 1 };
    else if (band === 'cool') temp = { kind: 'cold', amount: 0.35 };
    else if (band === 'hot') temp = { kind: 'hot', amount: 1 };
    else if (band === 'warm') temp = { kind: 'hot', amount: 0.4 };
    return {
      band: band, causes: causes, missing: missing, score: score, level: level,
      key: causes.length === 0 ? 'healthy' : causes.length === 1 ? causes[0] : 'combo',
      profile: profile,
      weight: WEIGHT_AFTER[level], alive: level !== 'dead',
      env: { mist: !C.oxygen, dark: !C.light, temp: temp },
      temperature: C.temperature
    };
  }

  /* how far the change has come after `day` days (0..1): a gentle S-curve mixed with a straight line */
  function progressAt(day) {
    var k = clamp01(day / DAYS);
    return k * k * (3 - 2 * k) * 0.35 + k * 0.65;
  }
  /* the behaviour numbers on a given day (0 = as healthy as cage 1, 7 = the final outcome) */
  function profileAt(outcome, day) {
    var k = progressAt(day), out = {};
    KEYS.forEach(function (key) { out[key] = BASE[key] + (outcome.profile[key] - BASE[key]) * k; });
    out.lie = outcome.profile.lie * smooth(0.8, 1, clamp01(day / DAYS));   // a chick only lies down at the very end
    return out;
  }
  /* the surroundings on a given day: fogged glass, darkness, hot or cold air (each 0..1) */
  function envAt(outcome, day) {
    var k = progressAt(day);
    return {
      mist: outcome.env.mist ? 0.3 + 0.7 * k : 0,
      night: outcome.env.dark ? Math.min(1, k * 2.2) : 0,
      tempKind: outcome.env.temp.kind,
      temp: outcome.env.temp.amount * Math.min(1, k * 2.2)
    };
  }
  /* cage 1 never changes: a healthy chick, 65 g → 75 g */
  function healthyOutcome() { return evaluate({ food: true, water: true, oxygen: true, light: true, temperature: 33 }); }

  return {
    CAGE1_TEMP: CAGE1_TEMP, DEFAULT_TEMP: DEFAULT_TEMP, DAYS: DAYS, START_WEIGHT: START_WEIGHT,
    SCORE: SCORE, LEVEL_OF: LEVEL_OF, WEIGHT_AFTER: WEIGHT_AFTER, KEYS: KEYS, BASE: BASE, FX: FX,
    initialState: initialState, decideDrop: decideDrop, apply: apply, canOpenLid: canOpenLid, openLid: openLid,
    canChangeTemperature: canChangeTemperature, changeTemperature: changeTemperature, lockedKey: lockedKey,
    canStart: canStart, start: start, finish: finish, stepStates: stepStates,
    evaluate: evaluate, progressAt: progressAt, profileAt: profileAt, envAt: envAt, healthyOutcome: healthyOutcome
  };
});
