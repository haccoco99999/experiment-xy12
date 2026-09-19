/* Experiment 1 – pure logic (no 3D, no DOM): what a drop does, when steps unlock, and what happens to
   the plant after 14 days. Written to run both in the browser and in Node (tests). */
(function (root, factory) {
  var deps = (typeof module === 'object' && module.exports)
    ? { bands: require('./temperature-bands.js') }
    : { bands: root.Lab.logic.temperatureBands };
  var api = factory(deps);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Lab.logic.exp1 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (deps) {
  'use strict';
  var bands = deps.bands;

  var SCORE = { healthy: 0, abnormal: 1, weak: 2, dying: 3, dead: 5 };
  var DEFAULT_TEMP = 28;                     // md: default 28 °C

  /* What the plant looks like on day 0 (md: 15-day-old bean, 10 cm, 5 green leaves, white roots). */
  var INITIAL_VISUAL = {
    height: 10, leafScale: 1, leafColor: 'green', stemColor: 'stemGreen', stem: 1, droop: 0, wilt: 0, leafDrop: 0, rot: 0,
    root: { len: 0.62, spread: 1, thick: 1, sparse: 0, wave: 0, color: 'cream' }
  };

  /* How each single cause changes the plant after 14 days (numbers only; the words live in content/exp1.vi.js). */
  var FX = {
    healthy: { level: 'healthy', height: 25, leafScale: 1.55, leafColor: 'green', stemColor: 'stemGreen', stem: 1.15, droop: 0, wilt: 0, leafDrop: 0, rot: 0,
      root: { len: 1, spread: 1.15, thick: 1.15, sparse: 0, wave: 0, color: 'cream' } },
    minerals: { level: 'weak', height: 14, leafScale: 0.8, leafColor: 'paleYellow', stemColor: 'paleGreen', stem: 0.5, droop: 0.2, wilt: 0.2, leafDrop: 0, rot: 0,
      root: { len: 0.36, spread: 0.7, thick: 0.5, sparse: 0.65, wave: 0.15, color: 'cream' } },
    water: { level: 'dead', height: 9, leafScale: 0.72, leafColor: 'brownYellow', stemColor: 'brownGreen', stem: 0.55, droop: 1, wilt: 1, leafDrop: 0.25, rot: 0,
      root: { len: 0.3, spread: 0.7, thick: 0.35, sparse: 0.5, wave: 1, color: 'shrivel' } },
    light: { level: 'dying', height: 30, leafScale: 0.75, leafColor: 'white', stemColor: 'paleYellow', stem: 0.45, droop: 0.45, wilt: 0.4, leafDrop: 0.1, rot: 0,
      root: { len: 0.42, spread: 0.7, thick: 0.5, sparse: 0.55, wave: 0.2, color: 'cream' } },
    air: { level: 'dead', height: 12, leafScale: 0.9, leafColor: 'brownGreen', stemColor: 'stemGreen', stem: 0.7, droop: 0.7, wilt: 0.6, leafDrop: 0.92, rot: 0.95,
      root: { len: 0.45, spread: 0.75, thick: 0.65, sparse: 0.3, wave: 0.3, color: 'rotRoot' } },
    cold: { level: 'dead', height: 10, leafScale: 0.95, leafColor: 'bruised', stemColor: 'bruised', stem: 0.85, droop: 0.9, wilt: 0.7, leafDrop: 0.2, rot: 0.1,
      root: { len: 0.4, spread: 0.6, thick: 0.6, sparse: 0.35, wave: 0.1, color: 'dark' } },
    cool: { level: 'abnormal', height: 16, leafScale: 1.15, leafColor: 'yellowGreen', stemColor: 'stemGreen', stem: 0.85, droop: 0.08, wilt: 0.05, leafDrop: 0, rot: 0,
      root: { len: 0.7, spread: 0.85, thick: 0.8, sparse: 0.15, wave: 0, color: 'cream' } },
    warm: { level: 'abnormal', height: 17, leafScale: 1.2, leafColor: 'yellowGreen2', stemColor: 'stemGreen', stem: 0.85, droop: 0.32, wilt: 0.3, leafDrop: 0, rot: 0,
      root: { len: 0.72, spread: 0.9, thick: 0.8, sparse: 0.1, wave: 0.1, color: 'cream' } },
    hot: { level: 'dead', height: 11, leafScale: 0.85, leafColor: 'brown', stemColor: 'brownGreen', stem: 0.55, droop: 1, wilt: 1, leafDrop: 0.3, rot: 0,
      root: { len: 0.3, spread: 0.7, thick: 0.35, sparse: 0.5, wave: 1, color: 'shrivel' } }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------------- state ---------------- */
  function initialState() {
    return {
      phase: 'initial',                                  // initial → plantPlacement → conditionSetup → experimentRunning → observation
      placed: { A: false, B: false },
      B: { water: false, minerals: true, air: true, light: true, temperature: DEFAULT_TEMP },
      tools: { watered: false, gravelUsed: false, npkUsed: false, blackBin: false, clearBin: false }
    };
  }

  var WRONG = { water: 'water', gravel: 'gravel', npk: 'npk', blackBin: 'blackBin', clearBin: 'clearBin' };

  /* Decides what dropping `item` on `zone` ('potA' | 'potB' | 'bench' | null) does. Never changes the state. */
  function decideDrop(state, item, zone) {
    if (state.phase === 'experimentRunning' || state.phase === 'observation') return { ok: false, msg: 'locked' };
    if (item === 'potA' || item === 'potB') {
      var w = item === 'potA' ? 'A' : 'B';
      if (state.placed[w]) return { ok: false, msg: null };
      if (zone === 'bench' || zone === 'potA' || zone === 'potB') return { ok: true, action: 'place' + w };
      return { ok: false, msg: 'potOffTable' };
    }
    if (!(state.placed.A && state.placed.B)) return { ok: false, msg: 'placePotsFirst' };
    if (zone === 'potA') return { ok: false, msg: 'toolOnControl' };
    if (zone !== 'potB') return { ok: false, msg: WRONG[item] || 'water' };
    if (item === 'blackBin' && state.tools.blackBin) return { ok: false, msg: null };
    if (item === 'clearBin' && state.tools.clearBin) return { ok: false, msg: null };
    var res = { ok: true, action: item };
    if (item === 'npk' && state.B.minerals) res.note = 'alreadyRich';
    return res;
  }

  function apply(state, action) {
    var s = state;
    switch (action) {
      case 'placeA': s.placed.A = true; break;
      case 'placeB': s.placed.B = true; break;
      case 'water': s.B.water = true; s.tools.watered = true; break;
      case 'gravel': s.B.minerals = false; s.tools.gravelUsed = true; break;
      case 'npk': s.B.minerals = true; s.tools.npkUsed = true; break;
      case 'blackBin': s.B.light = false; s.tools.blackBin = true; break;
      case 'clearBin': s.B.air = false; s.tools.clearBin = true; break;
      default: break;
    }
    if (s.placed.A && s.placed.B) s.phase = 'conditionSetup';
    else if (s.placed.A || s.placed.B) s.phase = 'plantPlacement';
    return s;
  }

  /* [-] / [+] on the thermostat. Locked until both pots are on the table and after the start. */
  function canChangeTemperature(state) { return state.phase === 'conditionSetup'; }
  function changeTemperature(state, delta) {
    if (!canChangeTemperature(state)) return false;
    var t = Math.max(bands.MIN, Math.min(bands.MAX, state.B.temperature + delta));
    if (t === state.B.temperature) return false;
    state.B.temperature = t; return true;
  }
  function canStart(state) { return state.phase === 'conditionSetup'; }
  function start(state) { if (!canStart(state)) return false; state.phase = 'experimentRunning'; return true; }
  function finish(state) { if (state.phase !== 'experimentRunning') return false; state.phase = 'observation'; return true; }

  /* 4 steps of the progress bar → 'done' | 'active' | 'locked' */
  function stepStates(state) {
    switch (state.phase) {
      case 'conditionSetup': return ['done', 'active', 'locked', 'locked'];
      case 'experimentRunning': return ['done', 'done', 'active', 'locked'];
      case 'observation': return ['done', 'done', 'done', 'active'];
      default: return ['active', 'locked', 'locked', 'locked'];
    }
  }

  /* ---------------- soil look ---------------- */
  function setupSoil(B) {                                 // while the student is setting things up
    if (B.minerals) return B.water ? 'moist' : 'rich';
    return B.water ? 'gravelMoist' : 'gravel';
  }
  function soilAfter(B, band) {                           // after 14 days
    if (band === 'cold') return B.minerals ? 'frozen' : 'gravel';
    if (!B.water) return B.minerals ? 'dry' : 'gravel';
    if (!B.air) return B.minerals ? 'soggy' : 'gravelMoist';
    return B.minerals ? 'moist' : 'gravelMoist';
  }

  /* ---------------- outcome ---------------- */
  function mergeVisual(causes, level) {
    var list = causes.map(function (c) { return FX[c]; });
    var dom = list.slice().sort(function (a, b) { return SCORE[b.level] - SCORE[a.level]; })[0];
    var v = clone(dom);
    function pick(fn, key) { return fn.apply(null, list.map(function (f) { return f[key]; })); }
    function pickRoot(fn, key) { return fn.apply(null, list.map(function (f) { return f.root[key]; })); }
    v.height = pick(Math.min, 'height');
    v.droop = pick(Math.max, 'droop'); v.wilt = pick(Math.max, 'wilt'); v.leafDrop = pick(Math.max, 'leafDrop'); v.rot = pick(Math.max, 'rot');
    v.leafScale = pick(Math.min, 'leafScale'); v.stem = pick(Math.min, 'stem');
    v.root.len = pickRoot(Math.min, 'len'); v.root.thick = pickRoot(Math.min, 'thick'); v.root.spread = pickRoot(Math.min, 'spread');
    v.root.sparse = pickRoot(Math.max, 'sparse'); v.root.wave = pickRoot(Math.max, 'wave');
    if (list.some(function (f) { return f.root.color === 'rotRoot'; })) v.root.color = 'rotRoot';
    if (level === 'dead') {
      v.droop = Math.max(v.droop, 0.9); v.wilt = Math.max(v.wilt, 0.85);
      if (dom.level !== 'dead') { v.leafColor = 'brown'; v.stemColor = 'brownGreen'; }
    } else if (level === 'dying') {
      v.droop = Math.max(v.droop, 0.5); v.wilt = Math.max(v.wilt, 0.45);
    }
    return v;
  }

  /* Reads ALL five conditions (never just one) and returns what the plant looks like after 14 days. */
  function evaluate(B) {
    var band = bands.bandOf(B.temperature).id, causes = [];
    if (!B.water) causes.push('water');
    if (!B.air) causes.push('air');
    if (!B.light) causes.push('light');
    if (!B.minerals) causes.push('minerals');
    if (band !== 'ideal') causes.push(band);
    var score = causes.reduce(function (s, c) { return s + SCORE[FX[c].level]; }, 0);
    var level = score >= 5 ? 'dead' : score >= 3 ? 'dying' : score >= 2 ? 'weak' : score >= 1 ? 'abnormal' : 'healthy';
    var visual = causes.length === 0 ? clone(FX.healthy) : causes.length === 1 ? clone(FX[causes[0]]) : mergeVisual(causes, level);
    return {
      band: band, causes: causes, score: score, level: level,
      key: causes.length === 0 ? 'healthy' : causes.length === 1 ? causes[0] : 'combo',
      visual: visual,
      deadDay: level === 'dead' ? (causes.indexOf('hot') >= 0 ? 7 : 14) : null,
      soil: soilAfter(B, band),
      env: { cold: band === 'cold', hot: band === 'hot' || band === 'warm', dark: !B.light, sealed: !B.air },
      temperature: B.temperature
    };
  }

  /* how far the change has come after `day` days (0..1). Plants that die by day 7 reach full effect by day 7. */
  function progressAt(day, outcome) {
    var span = outcome.deadDay === 7 ? 7 : 14, k = Math.max(0, Math.min(1, day / span));
    return k * k * (3 - 2 * k) * 0.35 + k * 0.65;        // gentle S-curve mixed with a straight line
  }

  return {
    DEFAULT_TEMP: DEFAULT_TEMP, INITIAL_VISUAL: INITIAL_VISUAL, FX: FX, SCORE: SCORE,
    initialState: initialState, decideDrop: decideDrop, apply: apply,
    canChangeTemperature: canChangeTemperature, changeTemperature: changeTemperature,
    canStart: canStart, start: start, finish: finish, stepStates: stepStates,
    setupSoil: setupSoil, evaluate: evaluate, progressAt: progressAt
  };
});
