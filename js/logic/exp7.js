/* Experiment 7 – pure logic (no 3D, no DOM): the life cycle of a butterfly.
   Strictly in order (md sections 36, 49 and 56): male, female → mating → fertilization → egg laying → eggs (magnifier) → hatching (day 7)
   → larva (feed, three moults, ruler) → pupa (magnifier, 3D cut, four parts) → emergence (day 28) → sort the four stages.
   Runs in the browser and in Node (tests). */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.Lab = root.Lab || {}; root.Lab.logic = root.Lab.logic || {}; root.Lab.logic.exp7 = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var DAYS = [0, 3, 7, 14, 18, 28];
  var PARTS = ['wing', 'eye', 'leg', 'proboscis'];                 // the four forming parts inside the pupa (md section 24)
  var STAGES = ['egg', 'larva', 'pupa', 'adult'];                  // sorting cards 0..3 = the right order (md section 31)
  var LENGTH_MM = [3, 8, 16, 28, 42];                              // larva length after hatching, moult 1, 2, 3 and when it is big enough (numbers are ours)

  function initialState() {
    return {
      malePlaced: false, femalePlaced: false, mated: false, fertilized: false, continued: false,   // matingCompleted, fertilizationCompleted, femaleReadyToLay
      eggLaid: false, eggObserved: false, hatching: false, day: 0, eggsDark: false, larvaAppeared: false, larvaFed: false,
      molts: 0, grown: false, pupaFormed: false, pupaObserved: false, cutaway: false, parts: { wing: false, eye: false, leg: false, proboscis: false }, cutawayObserved: false,
      metamorphosis: false, adult: false, sorted: [false, false, false, false], sortedAll: false, complete: false
    };
  }
  function bothPlaced(s) { return s.malePlaced && s.femalePlaced; }

  /* ---------------- the two butterflies ---------------- */
  /* sex: 'male' | 'female'; zone: 'area' (the garden) | 'leaf' | null. At the start both go into the garden; later the female goes onto the leaf. */
  function decideButterfly(s, sex, zone) {
    if (sex === 'male') {
      if (s.malePlaced) return { ok: false, msg: null };
      return zone === 'area' || zone === 'leaf' ? { ok: true, action: 'placeMale' } : { ok: false, msg: 'maleOff' };
    }
    if (!s.femalePlaced) return zone === 'area' || zone === 'leaf' ? { ok: true, action: 'placeFemale' } : { ok: false, msg: 'femaleOff' };
    if (!s.continued || s.eggLaid) return { ok: false, msg: null };
    return zone === 'leaf' ? { ok: true, action: 'layEggs' } : { ok: false, msg: 'femaleLeaf' };      // after the fertilization the female is dragged onto a leaf
  }
  function applyButterfly(s, action) {
    if (action === 'placeMale') s.malePlaced = true;
    else if (action === 'placeFemale') s.femalePlaced = true;
    else if (action === 'layEggs') { s.eggLaid = true; s.day = 0; }
    return { ready: bothPlaced(s) };
  }
  /* the male is dragged towards the female; near = it was let go close to her */
  function decideMating(s, near) {
    if (!bothPlaced(s) || s.mated) return { ok: false, msg: null };
    return near ? { ok: true, action: 'mate' } : { ok: false, msg: 'maleFar' };
  }
  function applyMating(s) { s.mated = true; return {}; }
  function applyFertilization(s) { if (!s.mated) return false; s.fertilized = true; return true; }
  function canContinue(s) { return s.fertilized && !s.continued; }
  function applyContinue(s) { if (!canContinue(s)) return false; s.continued = true; return true; }

  /* ---------------- the magnifier: eggs, larva, pupa ---------------- */
  /* target: 'eggs' | 'larva' | 'pupa' | null */
  function decideLens(s, target) {
    if (target === 'eggs') {
      if (!s.eggLaid) return { ok: false, msg: 'lensNothing' };
      return s.larvaAppeared ? { ok: true, action: 'lens', target: 'eggs' } : { ok: true, action: 'lensEggs', target: 'eggs' };
    }
    if (target === 'larva') return s.larvaAppeared && !s.pupaFormed ? { ok: true, action: 'lens', target: 'larva' } : { ok: false, msg: 'lensNothing' };
    if (target === 'pupa') return s.pupaFormed ? { ok: true, action: s.pupaObserved ? 'lens' : 'lensPupa', target: 'pupa' } : { ok: false, msg: 'lensNothing' };
    if (s.pupaFormed && !s.pupaObserved) return { ok: false, msg: 'lensPupaOff' };
    if (s.eggLaid && !s.larvaAppeared) return { ok: false, msg: 'lensEggsOff' };
    return { ok: false, msg: 'lensNothing' };
  }
  function applyLens(s, action) {
    if (action === 'lensEggs') s.eggObserved = true;
    else if (action === 'lensPupa') s.pupaObserved = true;
    return {};
  }

  /* ---------------- hatching (day 3 → 7) ---------------- */
  function canHatch(s) { return s.eggObserved && !s.hatching; }
  function startHatching(s) { if (!canHatch(s)) return false; s.hatching = true; return true; }
  function arriveDay(s, day) {
    if (DAYS.indexOf(day) < 0 || day < s.day) return null;
    s.day = day;
    if (day === 3 && s.hatching) s.eggsDark = true;
    if (day === 7 && s.hatching) s.larvaAppeared = true;
    return { day: day };
  }

  /* ---------------- the larva: feed, grow, moult, measure ---------------- */
  /* near: the leaf was let go close to the larva */
  function decideLeaf(s, near) {
    if (!s.larvaAppeared || s.pupaFormed) return { ok: false, msg: null };
    return near ? { ok: true, action: 'feed' } : { ok: false, msg: 'leafFar' };
  }
  function applyFeed(s) { var first = !s.larvaFed; s.larvaFed = true; return { first: first }; }
  /* growing only starts after the first feeding (rule 9); every moult makes it bigger; after three it is big enough (rule 10) */
  function canGrow(s) { return s.larvaFed && !s.grown && !s.pupaFormed; }
  function applyMolt(s) { if (!canGrow(s) || s.molts >= 3) return false; s.molts++; return true; }
  function applyGrown(s) { if (s.molts < 3) return false; s.grown = true; return true; }
  function canPupate(s) { return s.grown && !s.pupaFormed; }
  function applyPupation(s) { if (!canPupate(s)) return false; s.pupaFormed = true; s.day = 14; return true; }
  function larvaLengthMm(s) { return LENGTH_MM[s.grown ? 4 : Math.min(3, s.molts)]; }
  /* near: the ruler was let go close to the larva */
  function decideRuler(s, near) {
    if (!s.larvaAppeared || s.pupaFormed) return { ok: false, msg: null };
    return near ? { ok: true, action: 'measure', mm: larvaLengthMm(s) } : { ok: false, msg: 'rulerFar' };
  }

  /* ---------------- the pupa: 3D cut and the four parts ---------------- */
  function canCutaway(s) { return s.pupaObserved && !s.cutaway; }
  function openCutaway(s) { if (!canCutaway(s)) return false; s.cutaway = true; return true; }
  /* part: 'wing' | 'eye' | 'leg' | 'proboscis' or null (a click on something else) */
  function decidePart(s, part) {
    if (!s.cutaway || s.cutawayObserved) return { ok: false, msg: null };
    if (PARTS.indexOf(part) < 0) return { ok: false, msg: 'partOff' };
    return { ok: true, action: 'part', part: part, again: s.parts[part] };
  }
  function applyPart(s, part) {
    s.parts[part] = true;
    var all = PARTS.every(function (p) { return s.parts[p]; });
    if (all && !s.cutawayObserved) { s.cutawayObserved = true; return { done: true }; }
    return { done: false };
  }

  /* ---------------- emergence (day 18 → 28) ---------------- */
  function canMetamorph(s) { return s.cutawayObserved && !s.metamorphosis; }
  function startMetamorphosis(s) { if (!canMetamorph(s)) return false; s.metamorphosis = true; return true; }
  function applyAdult(s) { if (!s.metamorphosis || s.adult) return false; s.adult = true; s.day = 28; return true; }

  /* ---------------- sorting the four stages ---------------- */
  function sorting(s) { return s.adult && !s.sortedAll; }
  /* card: 0 egg, 1 larva, 2 pupa, 3 adult; slot: 0..3 (VỊ TRÍ 1..4) or null; the right order is card i in slot i */
  function decideSort(s, card, slot) {
    if (!sorting(s) || s.sorted[card]) return { ok: false, msg: null };
    return slot === card ? { ok: true, action: 'sort', card: card } : { ok: false, msg: 'sortWrong' };
  }
  function applySort(s, card) {
    s.sorted[card] = true;
    if (s.sorted.every(function (x) { return x; })) { s.sortedAll = true; s.complete = true; }
    return { done: s.complete };
  }

  /* ---------------- prompts and the progress bar ---------------- */
  /* BƯỚM ĐỰC + BƯỚM CÁI → GIAO PHỐI → THỤ TINH → BƯỚM CÁI ĐẺ TRỨNG → TRỨNG → SÂU NON → NHỘNG → BƯỚM TRƯỞNG THÀNH */
  function stepStates(s) {
    return [
      bothPlaced(s) ? 'done' : 'active',
      !bothPlaced(s) ? 'locked' : s.mated ? 'done' : 'active',
      !s.mated ? 'locked' : s.fertilized ? 'done' : 'active',
      !s.fertilized ? 'locked' : s.eggLaid ? 'done' : s.continued ? 'active' : 'open',
      !s.eggLaid ? 'locked' : s.larvaAppeared ? 'done' : 'active',
      !s.larvaAppeared ? 'locked' : s.pupaFormed ? 'done' : 'active',
      !s.pupaFormed ? 'locked' : s.adult ? 'done' : 'active',
      !s.adult ? 'locked' : 'done'
    ];
  }
  /* the sentence to show now: a key of MD.msg / APP, or null */
  function promptKey(s) {
    if (s.complete) return null;
    if (!s.malePlaced || !s.femalePlaced) return 'placeTask';
    if (!s.mated) return 'mateTask';
    if (!s.continued) return null;                                   // the fertilization screen runs, then the button ▶ TIẾP TỤC
    if (!s.eggLaid) return 'layTask';
    if (!s.eggObserved) return 'lensEggsTask';
    if (!s.larvaAppeared) return null;                               // the hatching runs
    if (!s.larvaFed) return 'feedTask';
    if (!s.pupaFormed) return null;                                  // growing and moulting run
    if (!s.pupaObserved) return 'lensPupaTask';
    if (!s.cutawayObserved) return s.cutaway ? 'partTask' : null;
    if (!s.adult) return null;
    return 'sortTask';
  }
  /* the days on the time bar: 'done' | 'active' | 'todo' */
  function dayStates(s) { return DAYS.map(function (d) { return !s.eggLaid ? 'todo' : d < s.day ? 'done' : d === s.day ? 'active' : 'todo'; }); }

  return {
    DAYS: DAYS, PARTS: PARTS, STAGES: STAGES, LENGTH_MM: LENGTH_MM, initialState: initialState, bothPlaced: bothPlaced,
    decideButterfly: decideButterfly, applyButterfly: applyButterfly, decideMating: decideMating, applyMating: applyMating,
    applyFertilization: applyFertilization, canContinue: canContinue, applyContinue: applyContinue,
    decideLens: decideLens, applyLens: applyLens, canHatch: canHatch, startHatching: startHatching, arriveDay: arriveDay,
    decideLeaf: decideLeaf, applyFeed: applyFeed, canGrow: canGrow, applyMolt: applyMolt, applyGrown: applyGrown, canPupate: canPupate, applyPupation: applyPupation,
    larvaLengthMm: larvaLengthMm, decideRuler: decideRuler, canCutaway: canCutaway, openCutaway: openCutaway, decidePart: decidePart, applyPart: applyPart,
    canMetamorph: canMetamorph, startMetamorphosis: startMetamorphosis, applyAdult: applyAdult,
    sorting: sorting, decideSort: decideSort, applySort: applySort, stepStates: stepStates, promptKey: promptKey, dayStates: dayStates
  };
});
