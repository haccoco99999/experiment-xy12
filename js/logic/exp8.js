/* Experiment 8 – pure logic (no 3D, no DOM): reproduction and life cycle of the cat (md sections VIII–XXXVIII, "THÍ NGHIỆM 8").
   Strictly in order: place the male and the female → start → identify them → sperm and egg (observe, drag to the right cat) → fertilization (drag one sperm to the egg)
   → zygote (magnifier, click) → embryo (timeline day 0/15/30/45, magnifier) → fetus (day 45/60/near birth, click the parts, magnifier) → kitten (click, magnifier)
   → kitten grows (1 week/2 weeks/1 month/2 months, then compare three kittens) → adult (2 months/6 months/1 year) → sort 8 cards.
   `phase` says where the student is; each phase ends when `phaseDone`, and `advance` moves on. Runs in the browser and in Node (tests). */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.Lab = root.Lab || {}; root.Lab.logic = root.Lab.logic || {}; root.Lab.logic.exp8 = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var PH = { place: 0, identify: 1, cells: 2, fertilize: 3, zygote: 4, embryo: 5, fetus: 6, kitten: 7, growth: 8, adult: 9, sort: 10, done: 11 };
  var TL = { embryo: 4, fetus: 3, growth: 4, adult: 3 };                // marks on each timeline
  var TL_PHASE = { embryo: PH.embryo, fetus: PH.fetus, growth: PH.growth, adult: PH.adult };
  var PARTS = ['head', 'body', 'legs', 'tail'];                          // the parts of the fetus the student must click (md 16.4); the ears may be clicked too
  var CARDS = 8;                                                         // sorting cards: card i belongs to slot i (md 22.3)

  function flags(n) { var a = []; for (var i = 0; i < n; i++) a.push(false); return a; }
  function initialState() {
    return {
      phase: PH.place, malePlaced: false, femalePlaced: false, maleIdentified: false, femaleIdentified: false,
      spermObserved: false, eggObserved: false, spermPlaced: false, eggPlaced: false,
      fertilized: false, zygoteObserved: false, zygoteClicked: false,
      tl: { embryo: flags(4), fetus: flags(3), growth: flags(4), adult: flags(3) },
      embryoObserved: false, fetusParts: { head: false, body: false, legs: false, tail: false }, fetusObserved: false,
      kittenClicked: false, kittenObserved: false, compared: flags(3), sorted: flags(CARDS), complete: false
    };
  }
  function marksDone(s, tl) { return s.tl[tl].every(Boolean); }
  function partsDone(s) { return PARTS.every(function (p) { return s.fetusParts[p]; }); }
  function cellsDone(s) { return s.spermObserved && s.eggObserved && s.spermPlaced && s.eggPlaced; }

  /* ---------------- where the student is and when a phase is over ---------------- */
  function phaseDone(s) {
    switch (s.phase) {
      case PH.place: return s.malePlaced && s.femalePlaced;
      case PH.identify: return s.maleIdentified && s.femaleIdentified;
      case PH.cells: return cellsDone(s);
      case PH.fertilize: return s.fertilized;
      case PH.zygote: return s.zygoteObserved && s.zygoteClicked;
      case PH.embryo: return marksDone(s, 'embryo') && s.embryoObserved;
      case PH.fetus: return marksDone(s, 'fetus') && partsDone(s) && s.fetusObserved;
      case PH.kitten: return s.kittenClicked && s.kittenObserved;
      case PH.growth: return marksDone(s, 'growth') && s.compared.every(Boolean);
      case PH.adult: return marksDone(s, 'adult');
      case PH.sort: return s.sorted.every(Boolean);
    }
    return false;
  }
  function canAdvance(s) { return s.phase < PH.sort && phaseDone(s); }
  function advance(s) { if (!canAdvance(s)) return false; s.phase++; return true; }

  /* ---------------- the two cats (md 4.1, 4.2, 8, 9) ---------------- */
  /* sex: 'male' | 'female'; zone: 'table' (the observation table) or null */
  function decideCat(s, sex, zone) {
    if (s.phase !== PH.place) return { ok: false, msg: null };
    if (sex === 'male') {
      if (s.malePlaced) return { ok: false, msg: null };
      return zone === 'table' ? { ok: true, action: 'placeMale' } : { ok: false, msg: 'maleOff' };
    }
    if (s.femalePlaced) return { ok: false, msg: null };
    return zone === 'table' ? { ok: true, action: 'placeFemale' } : { ok: false, msg: 'femaleOff' };
  }
  function applyCat(s, action) { if (action === 'placeMale') s.malePlaced = true; else if (action === 'placeFemale') s.femalePlaced = true; return { ready: s.malePlaced && s.femalePlaced }; }
  function canStart(s) { return s.phase === PH.place && s.malePlaced && s.femalePlaced; }

  /* ---------------- phase 1: identify (md 11) ---------------- */
  /* target: 'male' | 'female' | null (a click on something else) */
  function decideIdentify(s, target) {
    if (s.phase !== PH.identify) return { ok: false, msg: null };
    if (target !== 'male' && target !== 'female') return { ok: false, msg: 'identifyWrong' };
    return { ok: true, action: 'identify', target: target, again: target === 'male' ? s.maleIdentified : s.femaleIdentified };
  }
  function applyIdentify(s, target) { if (target === 'male') s.maleIdentified = true; else s.femaleIdentified = true; return { done: s.maleIdentified && s.femaleIdentified }; }

  /* ---------------- phase 2: sperm and egg (md 12) ---------------- */
  function observeCell(s, cell) {                                      // a click on the sperm or on the egg
    if (s.phase !== PH.cells) return { ok: false };
    var again = cell === 'sperm' ? s.spermObserved : s.eggObserved;
    if (cell === 'sperm') s.spermObserved = true; else s.eggObserved = true;
    return { ok: true, again: again };
  }
  /* cell: 'sperm' | 'egg'; area: 'male' | 'female' | null (the area it was let go in) */
  function decideCell(s, cell, area) {
    if (s.phase !== PH.cells) return { ok: false, msg: null };
    if (cell === 'sperm') {
      if (s.spermPlaced) return { ok: false, msg: null };
      return area === 'male' ? { ok: true, action: 'sperm' } : { ok: false, msg: 'spermWrong' };
    }
    if (s.eggPlaced) return { ok: false, msg: null };
    return area === 'female' ? { ok: true, action: 'egg' } : { ok: false, msg: 'eggWrong' };
  }
  function applyCell(s, cell) { if (cell === 'sperm') s.spermPlaced = true; else s.eggPlaced = true; return { done: cellsDone(s) }; }

  /* ---------------- phase 3: fertilization (md 13) ---------------- */
  /* near: a sperm was let go close to the egg */
  function decideFertilize(s, near) {
    if (s.phase !== PH.fertilize || s.fertilized) return { ok: false, msg: null };
    return near ? { ok: true, action: 'fertilize' } : { ok: false, msg: 'spermFar' };
  }
  function applyFertilize(s) { s.fertilized = true; return {}; }
  function clickEgg(s) { return s.phase === PH.fertilize && !s.fertilized ? { msg: 'eggClick' } : { msg: null }; }

  /* ---------------- the magnifier (md 4.3, 14.1, 15.5, 16.5, 18) ---------------- */
  /* target: 'male' | 'female' | 'sperm' | 'egg' | 'zygote' | 'embryo' | 'fetus' | 'kitten' | null (nothing under the glass) */
  function decideLens(s, target) {
    if (!target) return { ok: false, msg: s.phase === PH.zygote && !s.zygoteObserved ? 'lensZygoteOff' : 'lensOff' };
    return { ok: true, action: 'lens', target: target };
  }
  /* the glass counts as "observed" only for the main object of the phase and only when the phase allows it */
  function applyLens(s, target) {
    var credit = null;
    if (target === 'zygote' && s.phase === PH.zygote && s.fertilized && !s.zygoteObserved) { s.zygoteObserved = true; credit = 'zygote'; }
    else if (target === 'embryo' && s.phase === PH.embryo && s.tl.embryo[3] && !s.embryoObserved) { s.embryoObserved = true; credit = 'embryo'; }
    else if (target === 'fetus' && s.phase === PH.fetus && s.tl.fetus[2] && !s.fetusObserved) { s.fetusObserved = true; credit = 'fetus'; }
    else if (target === 'kitten' && s.phase === PH.kitten && s.kittenClicked && !s.kittenObserved) { s.kittenObserved = true; credit = 'kitten'; }
    return { credit: credit };
  }
  /* a lens on the main object before the phase allows it: which sentence to show */
  function lensEarly(s, target) {
    if (target === 'embryo' && s.phase === PH.embryo && !s.tl.embryo[3]) return 'lensEmbryoEarly';
    if (target === 'fetus' && s.phase === PH.fetus && !s.tl.fetus[2]) return 'lensFetusEarly';
    if (target === 'kitten' && s.phase === PH.kitten && !s.kittenClicked) return 'kittenFirst';
    return null;
  }

  /* ---------------- phase 4: zygote (md 14.2) ---------------- */
  function applyZygoteClick(s) { if (s.phase !== PH.zygote || !s.zygoteObserved) return false; s.zygoteClicked = true; return true; }

  /* ---------------- the timelines (md 15, 16, 19, 21, XXIX) ---------------- */
  /* tl: 'embryo' | 'fetus' | 'growth' | 'adult'; i: the mark (0 …). A mark opens when the one before it has been viewed. */
  function decideMark(s, tl, i) {
    if (s.phase !== TL_PHASE[tl] || i < 0 || i >= TL[tl]) return { ok: false, msg: null };
    if (i > 0 && !s.tl[tl][i - 1]) return { ok: false, msg: 'markLocked' };
    return { ok: true, action: 'mark', tl: tl, i: i, again: s.tl[tl][i] };
  }
  function applyMark(s, tl, i) { s.tl[tl][i] = true; return { done: marksDone(s, tl) }; }
  /* the marks as the bar shows them: 'done' (seen) | 'open' (can be visited) | 'locked' */
  function markStates(s, tl) { return s.tl[tl].map(function (v, i) { return v ? 'done' : i === 0 || s.tl[tl][i - 1] ? 'open' : 'locked'; }); }
  function maxOpenMark(s, tl) { var m = markStates(s, tl), k = 0; m.forEach(function (x, i) { if (x !== 'locked') k = i; }); return k; }

  /* ---------------- phase 6: the parts of the fetus (md 16.4) ---------------- */
  /* part: 'head' | 'body' | 'legs' | 'tail' | 'ears' */
  function decidePart(s, part) {
    if (s.phase !== PH.fetus) return { ok: false };
    var known = PARTS.indexOf(part) >= 0 || part === 'ears';
    return known ? { ok: true, part: part, again: !!s.fetusParts[part] } : { ok: false };
  }
  function applyPart(s, part) { if (PARTS.indexOf(part) >= 0) s.fetusParts[part] = true; return { done: partsDone(s) }; }

  /* ---------------- phase 7: the newborn kitten (md 18) ---------------- */
  /* hit: the click was on the kitten */
  function decideKitten(s, hit) {
    if (s.phase !== PH.kitten || s.kittenClicked) return { ok: false, msg: null };
    return hit ? { ok: true, action: 'kitten' } : { ok: false, msg: 'kittenOff' };
  }
  function applyKitten(s) { s.kittenClicked = true; return {}; }

  /* ---------------- phase 8: comparing the three kittens (md 20) ---------------- */
  function canCompare(s) { return s.phase === PH.growth && marksDone(s, 'growth'); }
  function applyCompare(s, i) { s.compared[i] = true; return { done: s.compared.every(Boolean) }; }

  /* ---------------- phase 10: sorting the eight cards (md 22) ---------------- */
  function sorting(s) { return s.phase === PH.sort; }
  /* card: 0 … 7 (the right order is card i in slot i); slot: 0 … 7 or null */
  function decideSort(s, card, slot) {
    if (!sorting(s) || s.sorted[card]) return { ok: false, msg: null };
    return slot === card ? { ok: true, action: 'sort', card: card } : { ok: false, msg: 'sortWrong' };
  }
  function applySort(s, card) {
    s.sorted[card] = true;
    if (s.sorted.every(Boolean)) { s.complete = true; s.phase = PH.done; }
    return { done: s.complete };
  }

  /* ---------------- the progress bar and the sentence to show ---------------- */
  /* MÈO ĐỰC + MÈO CÁI → TINH TRÙNG + TRỨNG → THỤ TINH → HỢP TỬ → PHÔI → THAI → MÈO CON → MÈO CON LỚN DẦN → MÈO TRƯỞNG THÀNH */
  function stepDone(s, i) {
    switch (i) {
      case 0: return s.maleIdentified && s.femaleIdentified;
      case 1: return cellsDone(s);
      case 2: return s.fertilized;
      case 3: return s.zygoteObserved;
      case 4: return marksDone(s, 'embryo') && s.embryoObserved;
      case 5: return marksDone(s, 'fetus') && partsDone(s) && s.fetusObserved;
      case 6: return s.kittenClicked && s.kittenObserved;
      case 7: return marksDone(s, 'growth') && s.compared.every(Boolean);
      case 8: return marksDone(s, 'adult');
    }
    return false;
  }
  function stepStates(s) {
    var out = [], found = false;
    for (var i = 0; i < 9; i++) { if (stepDone(s, i)) out.push('done'); else if (!found) { out.push('active'); found = true; } else out.push('locked'); }
    return out;
  }
  /* the task to show now: a key of MD.msg / APP, or null */
  function promptKey(s) {
    switch (s.phase) {
      case PH.place: return !s.malePlaced ? 'placeMaleTask' : !s.femalePlaced ? 'placeFemaleTask' : 'startTask';
      case PH.identify: return s.maleIdentified && s.femaleIdentified ? null : 'identifyTask';
      case PH.cells: return cellsDone(s) ? null : 'cellsTask';
      case PH.fertilize: return s.fertilized ? null : 'fertilizeTask';
      case PH.zygote: return !s.zygoteObserved ? 'zygoteLensTask' : !s.zygoteClicked ? 'zygoteClickTask' : null;
      case PH.embryo: return !marksDone(s, 'embryo') ? 'markTask' : !s.embryoObserved ? 'embryoLensTask' : null;
      case PH.fetus: return !marksDone(s, 'fetus') ? 'markTask' : !partsDone(s) ? 'fetusPartsTask' : !s.fetusObserved ? 'fetusLensTask' : null;
      case PH.kitten: return !s.kittenClicked ? 'kittenTask' : !s.kittenObserved ? 'kittenLensTask' : null;
      case PH.growth: return !marksDone(s, 'growth') ? 'markTask' : !s.compared.every(Boolean) ? 'compareTask' : null;
      case PH.adult: return marksDone(s, 'adult') ? null : 'markTask';
      case PH.sort: return 'sortTask';
    }
    return null;
  }

  return {
    PH: PH, TL: TL, PARTS: PARTS, CARDS: CARDS, initialState: initialState, phaseDone: phaseDone, canAdvance: canAdvance, advance: advance,
    decideCat: decideCat, applyCat: applyCat, canStart: canStart, decideIdentify: decideIdentify, applyIdentify: applyIdentify,
    observeCell: observeCell, decideCell: decideCell, applyCell: applyCell, cellsDone: cellsDone,
    decideFertilize: decideFertilize, applyFertilize: applyFertilize, clickEgg: clickEgg,
    decideLens: decideLens, applyLens: applyLens, lensEarly: lensEarly, applyZygoteClick: applyZygoteClick,
    decideMark: decideMark, applyMark: applyMark, markStates: markStates, maxOpenMark: maxOpenMark, marksDone: marksDone,
    decidePart: decidePart, applyPart: applyPart, partsDone: partsDone, decideKitten: decideKitten, applyKitten: applyKitten,
    canCompare: canCompare, applyCompare: applyCompare, sorting: sorting, decideSort: decideSort, applySort: applySort,
    stepStates: stepStates, promptKey: promptKey
  };
});
