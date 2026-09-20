/* Experiment 4 – pure logic (no 3D, no DOM): the lab rat, two topics in any order.
   Air: O₂ goes in, then CO₂ goes out (breathing only, no photosynthesis, md sections 16–23, 45).
   Water, food and waste: food, then water, then (after a short time) waste, then urine, strictly in this order (sections 24–37, 46).
   Runs in the browser and in Node (tests). */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.Lab = root.Lab || {}; root.Lab.logic = root.Lab.logic || {}; root.Lab.logic.exp4 = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function initialState() {
    return {
      placed: false,                                     // mousePlaced
      topic: null,                                       // airExchangeOpened / waterFoodWasteOpened: 'air' | 'wfw' | null
      oxygenIn: false, carbonDioxideOut: false, airDone: false,
      foodIn: false, waterIn: false, digested: false,    // digested: "MỘT KHOẢNG THỜI GIAN SAU..." has played
      wasteOut: false, urineOut: false, wfwDone: false,
      finished: false                                    // experimentCompleted
    };
  }

  /* ---------------- topics ---------------- */
  function topicState(s, topic) {
    if (!s.placed) return 'locked';
    if (topic === 'air' ? s.airDone : s.wfwDone) return 'done';
    return s.topic === topic ? 'active' : 'open';
  }
  function selectTopic(s, topic) {
    if (!s.placed || (topic !== 'air' && topic !== 'wfw')) return false;
    s.topic = topic; return true;
  }

  /* ---------------- breathing ---------------- */
  /* the move the student has to make now, or null */
  function currentGasMove(s) {
    if (s.topic !== 'air' || s.airDone) return null;
    return !s.oxygenIn ? { gas: 'o2', from: 'env', to: 'body' } : { gas: 'co2', from: 'lungs', to: 'env' };
  }
  /* gas: 'o2' | 'co2'; from: 'env' | 'lungs'; to: 'body' | 'env' | 'off' (dropped outside the picture) */
  function decideGas(s, gas, from, to) {
    var m = currentGasMove(s);
    if (!m || to === 'off') return { ok: false, msg: null };
    if (gas === m.gas && from === m.from && to === m.to) return { ok: true, action: 'gas', move: m };
    if (from === to) return { ok: false, msg: null };
    if (m.gas === 'o2') return { ok: false, msg: gas === 'o2' ? 'o2Wrong' : 'o2Task' };            // O₂ pulled away / CO₂ pushed in at the O₂ step
    return { ok: false, msg: gas === 'co2' && to === 'body' ? 'co2Wrong' : 'co2Task' };             // CO₂ pushed into the body / anything else at the CO₂ step
  }
  function applyGas(s) {
    var m = currentGasMove(s), out = { airDone: false, finished: false };
    if (!m) return out;
    if (m.gas === 'o2') s.oxygenIn = true; else s.carbonDioxideOut = true;
    if (s.oxygenIn && s.carbonDioxideOut && !s.airDone) { s.airDone = true; out.airDone = true; out.finished = checkFinish(s); }
    return out;
  }

  /* ---------------- food, water, waste, urine ---------------- */
  /* the step the student is on: 'food' | 'water' | 'digest' | 'waste' | 'urine' | null */
  function wfwStep(s) {
    if (s.topic !== 'wfw' || s.wfwDone) return null;
    if (!s.foodIn) return 'food';
    if (!s.waterIn) return 'water';
    if (!s.digested) return 'digest';
    if (!s.wasteOut) return 'waste';
    return 'urine';
  }
  /* zone: 'table' | 'near' (next to the mouse) | 'mouse' | null */
  function decideTool(s, tool, zone) {
    if (tool === 'mouse') {
      if (s.placed) return { ok: false, msg: null };
      return zone === 'table' || zone === 'near' || zone === 'mouse' ? { ok: true, action: 'place' } : { ok: false, msg: 'mouseOff' };
    }
    if (!s.placed) return { ok: false, msg: 'mouseFirst' };
    if (tool === 'magnifier') return zone === 'mouse' || zone === 'near' || zone === 'table' ? { ok: true, action: 'magnify', target: zone } : { ok: false, msg: 'magOff' };
    if (tool !== 'food' && tool !== 'water') return { ok: false, msg: null };
    if (s.topic !== 'wfw') return { ok: false, msg: 'chooseWfw' };
    var near = zone === 'near' || zone === 'mouse';
    if (tool === 'food') {
      if (s.foodIn) return { ok: false, msg: null };
      return near ? { ok: true, action: 'food' } : { ok: false, msg: 'foodOff' };
    }
    if (s.waterIn) return { ok: false, msg: null };
    if (!s.foodIn) return { ok: false, msg: 'foodTask' };                                    // water only after the food
    return near ? { ok: true, action: 'water' } : { ok: false, msg: 'waterOff' };
  }
  function applyTool(s, action) {
    if (action === 'place') s.placed = true;
    else if (action === 'food') s.foodIn = true;
    else if (action === 'water') s.waterIn = true;
    return { finished: false };
  }
  /* after eating and drinking a short time passes (md section 30); only then the waste step opens */
  function markDigested(s) { if (!s.foodIn || !s.waterIn || s.digested) return false; s.digested = true; return true; }

  /* what the student did with the waste or the urine: 'out' (dragged to the waste area, or tapped) or 'in' (put back into the body) */
  function decideExcrete(s, kind, action) {
    var step = wfwStep(s);
    if (step !== kind) return { ok: false, msg: null };                                     // not open yet, or already done
    if (action === 'in') return { ok: false, msg: kind + 'Wrong' };
    return action === 'out' ? { ok: true, action: kind } : { ok: false, msg: null };
  }
  function applyExcrete(s, kind) {
    var out = { wfwDone: false, finished: false };
    if (kind === 'waste') s.wasteOut = true;
    else if (kind === 'urine') { s.urineOut = true; s.wfwDone = true; out.wfwDone = true; out.finished = checkFinish(s); }
    return out;
  }

  function checkFinish(s) {
    if (s.airDone && s.wfwDone && !s.finished) { s.finished = true; return true; }
    return false;
  }

  /* ---------------- prompts, sub-steps and the progress bar ---------------- */
  /* the sentences to show now (md keys), one or two */
  function promptKeys(s) {
    if (s.topic === 'air' && !s.airDone) return !s.oxygenIn ? ['o2Task'] : ['co2Ask', 'co2Task'];
    var step = wfwStep(s);
    if (step === 'food') return ['foodTask'];
    if (step === 'water') return ['waterTask'];
    if (step === 'waste') return ['wasteTask'];
    if (step === 'urine') return ['urineTask'];
    return [];
  }
  /* the small marks: 'locked' | 'active' | 'done' for o2, co2, food, water, waste, urine */
  function subState(s, name) {
    var done = { o2: s.oxygenIn, co2: s.carbonDioxideOut, food: s.foodIn, water: s.waterIn, waste: s.wasteOut, urine: s.urineOut }[name];
    if (done) return 'done';
    if (name === 'o2') return s.topic === 'air' ? 'active' : 'locked';
    if (name === 'co2') return s.topic === 'air' && s.oxygenIn ? 'active' : 'locked';
    return wfwStep(s) === name ? 'active' : 'locked';
  }
  /* CHUỘT → LẤY VÀO → SỬ DỤNG → THẢI RA (md section 11): 'locked' | 'open' | 'active' | 'done' */
  function stepStates(s) {
    var intake = s.oxygenIn && s.foodIn && s.waterIn, out = s.carbonDioxideOut && s.wasteOut && s.urineOut;
    var any = s.oxygenIn || s.foodIn || s.waterIn, anyOut = s.carbonDioxideOut || s.wasteOut || s.urineOut;
    return [
      s.placed ? 'done' : 'active',
      !s.placed ? 'locked' : intake ? 'done' : any ? 'active' : 'open',
      !s.placed ? 'locked' : !intake ? 'locked' : s.digested ? 'done' : 'active',
      !s.placed ? 'locked' : out ? 'done' : (anyOut || s.digested) ? 'active' : 'open'
    ];
  }
  function nextTopic(s) {
    if (!s.placed || s.finished) return null;
    if (s.airDone && !s.wfwDone) return 'wfw';
    if (s.wfwDone && !s.airDone) return 'air';
    return null;
  }

  return {
    initialState: initialState, topicState: topicState, selectTopic: selectTopic,
    currentGasMove: currentGasMove, decideGas: decideGas, applyGas: applyGas,
    wfwStep: wfwStep, decideTool: decideTool, applyTool: applyTool, markDigested: markDigested,
    decideExcrete: decideExcrete, applyExcrete: applyExcrete,
    promptKeys: promptKeys, subState: subState, stepStates: stepStates, nextTopic: nextTopic
  };
});
