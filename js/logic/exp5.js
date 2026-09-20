/* Experiment 5 – pure logic (no 3D, no DOM): the tomato flower, pollination, fertilization, fruit and seeds.
   Everything is strictly in order (md sections 35, 36 and 44): place the flower → look at its parts → pollinate → fertilize → fast forward.
   Runs in the browser and in Node (tests). */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.Lab = root.Lab || {}; root.Lab.logic = root.Lab.logic || {}; root.Lab.logic.exp5 = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /* the parts to look at, in the order of md section 35: stamen, its filament and anther, then the pistil, its stigma, style, ovary and the ovules */
  var OBS = ['stamen', 'filament', 'anther', 'pistil', 'stigma', 'style', 'ovary', 'ovule'];
  var DAYS = [0, 3, 7, 14, 21, 30];
  var FLOWER_ZONES = ['flower', 'anther', 'stigma', 'style', 'ovary', 'petal'];

  function initialState() {
    var o = {}; OBS.forEach(function (k) { o[k] = false; });
    return {
      placed: false, lens: false, cut: false,                       // flowerPlaced, the magnifier is over the flower, the structure view is open
      observed: o, obsDone: false,                                  // stamenObserved … ovuleObserved → pollinationUnlocked
      pollStarted: false, hasPollen: false, pollinated: false,      // "THỰC HIỆN THỤ PHẤN" pressed, the stick carries pollen, pollen is on the stigma
      germinated: false, tube: 0, tubeAtOvary: false, tubeAtOvule: false, maleIn: false, fertilized: false,
      lapse: 'idle', day: 0,                                        // fast forward: idle | run1 | at7 | run2 | at14 | seeds | run3 | at30 | cut | done
      fruitFormed: false, seedsFormed: false, ripe: false, fruitCut: false, finished: false
    };
  }

  /* ---------------- looking at the flower ---------------- */
  function nextObs(s) { for (var i = 0; i < OBS.length; i++) if (!s.observed[OBS[i]]) return OBS[i]; return null; }
  /* part: one of OBS. Parts must be looked at in order; looking again at one already seen is fine. */
  function decideObserve(s, part) {
    if (!s.cut || OBS.indexOf(part) < 0) return { ok: false, msg: null };
    if (s.observed[part]) return { ok: true, again: true, part: part };
    var want = nextObs(s);
    return part === want ? { ok: true, part: part } : { ok: false, msg: 'obsOrder', want: want };
  }
  function applyObserve(s, part) {
    var first = !s.observed[part]; s.observed[part] = true;
    var done = !nextObs(s); if (done && !s.obsDone) { s.obsDone = true; return { first: first, unlocked: true }; }
    return { first: first, unlocked: false };
  }

  /* ---------------- tools from the tray ---------------- */
  /* tool: 'flower' | 'lens' | 'stick'; zone: 'bench' | 'flower' | 'anther' | 'stigma' | 'style' | 'ovary' | 'petal' | null */
  function decideTool(s, tool, zone) {
    if (tool === 'flower') {
      if (s.placed) return { ok: false, msg: null };
      return zone === 'bench' || FLOWER_ZONES.indexOf(zone) >= 0 ? { ok: true, action: 'place' } : { ok: false, msg: 'flowerOff' };
    }
    if (!s.placed) return { ok: false, msg: 'placeFirst' };
    if (tool === 'lens') return FLOWER_ZONES.indexOf(zone) >= 0 ? { ok: true, action: 'lens' } : { ok: false, msg: 'lensOff' };
    if (tool !== 'stick') return { ok: false, msg: null };
    if (!s.pollStarted) return { ok: false, msg: 'stickLocked' };
    if (s.pollinated) return { ok: false, msg: 'stickDone' };
    if (!s.hasPollen) return zone === 'anther' ? { ok: true, action: 'collect' } : { ok: false, msg: 'collectWrong' };
    if (zone === 'stigma') return { ok: true, action: 'pollinate' };
    if (zone === 'anther') return { ok: false, msg: null };          // already loaded: nothing to do
    return { ok: false, msg: 'pollenWrong', fall: zone === 'petal' };     // petals, style, ovary, elsewhere; over a petal a few grains fall
  }
  function applyTool(s, action) {
    if (action === 'place') s.placed = true;
    else if (action === 'lens') s.lens = true;
    else if (action === 'collect') s.hasPollen = true;
    else if (action === 'pollinate') { s.pollinated = true; s.hasPollen = false; }
    return {};
  }
  /* the button "QUAN SÁT CẤU TẠO HOA" (after the magnifier is over the flower) and "THỰC HIỆN THỤ PHẤN" (after every part was seen) */
  function canOpenStructure(s) { return s.placed && s.lens && !s.cut; }
  function openStructure(s) { if (!canOpenStructure(s)) return false; s.cut = true; return true; }
  function canStartPollination(s) { return s.obsDone && !s.pollStarted; }
  function startPollination(s) { if (!canStartPollination(s)) return false; s.pollStarted = true; return true; }

  /* ---------------- fertilization ---------------- */
  /* target: 'pollen' when the click hit the pollen on the stigma */
  function decideGerminate(s, target) {
    if (!s.pollinated || s.germinated) return { ok: false, msg: null };
    return target === 'pollen' ? { ok: true, action: 'germinate' } : { ok: false, msg: 'clickPollen' };
  }
  function applyGerminate(s) { s.germinated = true; return {}; }
  /* t: 0 (stigma) … 1 (bottom of the style, inside the ovary); off: the pointer let go away from the way down */
  function decideTubeRelease(s, t, off) {
    if (!s.germinated || s.tubeAtOvary) return { ok: false, msg: null };
    if (off) return { ok: false, msg: 'tubeWrong' };
    return { ok: true, reached: t >= 0.97 };
  }
  function applyTube(s, t) { if (t > s.tube) s.tube = t; if (s.tube >= 0.97) { s.tube = 1; s.tubeAtOvary = true; } return { atOvary: s.tubeAtOvary }; }
  /* hit: the tip was let go on an ovule */
  function decideOvule(s, hit) {
    if (!s.tubeAtOvary || s.tubeAtOvule) return { ok: false, msg: null };
    return hit ? { ok: true } : { ok: false, msg: 'ovuleWrong' };
  }
  function applyOvule(s) { s.tubeAtOvule = true; return {}; }
  /* inside: the male cell was let go inside the ovule */
  function decideMale(s, inside) {
    if (!s.tubeAtOvule || s.maleIn) return { ok: false, msg: null };
    return inside ? { ok: true } : { ok: false, msg: 'maleWrong' };
  }
  function applyMale(s) { s.maleIn = true; s.fertilized = true; return { fertilized: true }; }

  /* ---------------- fast forward (md sections 25–33) ---------------- */
  function canStartLapse(s) { return s.fertilized && s.lapse === 'idle'; }
  function startLapse(s) { if (!canStartLapse(s)) return false; s.lapse = 'run1'; return true; }
  /* the picture reached the day it was heading to: 7, 14 or 30 */
  function arrive(s) {
    if (s.lapse === 'run1') { s.lapse = 'at7'; s.day = 7; s.fruitFormed = true; return { day: 7 }; }
    if (s.lapse === 'run2') { s.lapse = 'at14'; s.day = 14; return { day: 14 }; }
    if (s.lapse === 'run3') { s.lapse = 'at30'; s.day = 30; s.ripe = true; return { day: 30 }; }
    return null;
  }
  function canContinue(s) { return s.lapse === 'at7' || s.lapse === 'seeds'; }
  function continueLapse(s) {
    if (s.lapse === 'at7') { s.lapse = 'run2'; return { to: 14 }; }
    if (s.lapse === 'seeds') { s.lapse = 'run3'; return { to: 30 }; }
    return null;
  }
  /* the student clicks the fruit: at day 14 the ovules turn into seeds, at day 30 the ripe fruit is cut open */
  function decideFruitClick(s) {
    if (s.lapse === 'at14') return { ok: true, action: 'seeds' };
    if (s.lapse === 'at30') return { ok: true, action: 'cut' };
    return { ok: false, msg: null };
  }
  function applyFruitClick(s, action) {
    if (action === 'seeds') { s.lapse = 'seeds'; s.seedsFormed = true; }
    else if (action === 'cut') { s.lapse = 'done'; s.fruitCut = true; s.finished = true; }
    return { finished: s.finished };
  }
  /* the days shown on the time bar: 'done' | 'active' | 'todo' */
  function dayStates(s) { return DAYS.map(function (d) { return s.lapse === 'idle' ? 'todo' : d < s.day ? 'done' : d === s.day ? 'active' : 'todo'; }); }

  /* ---------------- prompts and the progress bar ---------------- */
  /* Cấu tạo hoa → Thụ phấn → Thụ tinh → Quả → Hạt → Cây con; the last one stays locked (the md has nothing to do there) */
  function stepStates(s) {
    var st = ['locked', 'locked', 'locked', 'locked', 'locked', 'locked'];
    if (!s.placed) return st;
    st[0] = s.obsDone ? 'done' : 'active';
    if (!s.obsDone) return st;
    st[1] = s.pollinated ? 'done' : s.pollStarted ? 'active' : 'open';
    if (!s.pollinated) return st;
    st[2] = s.fertilized ? 'done' : 'active';
    if (!s.fertilized) return st;
    st[3] = s.fruitFormed ? 'done' : s.lapse === 'idle' ? 'open' : 'active';
    st[4] = s.seedsFormed ? 'done' : s.fruitFormed ? 'active' : 'open';
    if (s.finished) st[3] = st[4] = 'done';
    return st;
  }
  /* which md sentence to show as the task now, or null */
  function promptKey(s) {
    if (!s.placed || s.finished) return null;
    if (!s.pollStarted) return null;
    if (!s.pollinated) return s.hasPollen ? 'toStigma' : 'toAnther';
    if (!s.germinated) return 'clickPollen';
    if (!s.tubeAtOvary) return 'tubeTask';
    if (!s.tubeAtOvule) return 'ovuleTask';
    if (!s.maleIn) return 'maleTask';
    return null;
  }

  return {
    OBS: OBS, DAYS: DAYS, initialState: initialState,
    nextObs: nextObs, decideObserve: decideObserve, applyObserve: applyObserve,
    decideTool: decideTool, applyTool: applyTool, canOpenStructure: canOpenStructure, openStructure: openStructure,
    canStartPollination: canStartPollination, startPollination: startPollination,
    decideGerminate: decideGerminate, applyGerminate: applyGerminate, decideTubeRelease: decideTubeRelease, applyTube: applyTube,
    decideOvule: decideOvule, applyOvule: applyOvule, decideMale: decideMale, applyMale: applyMale,
    canStartLapse: canStartLapse, startLapse: startLapse, arrive: arrive, canContinue: canContinue, continueLapse: continueLapse,
    decideFruitClick: decideFruitClick, applyFruitClick: applyFruitClick, dayStates: dayStates,
    stepStates: stepStates, promptKey: promptKey
  };
});
