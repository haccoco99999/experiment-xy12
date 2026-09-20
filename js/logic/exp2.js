/* Experiment 2 – pure logic (no 3D, no DOM): what a drop does, which parts are locked or open, and how the two
   topics (gas exchange; water and minerals) can be done in any order. Runs in the browser and in Node (tests). */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.Lab = root.Lab || {}; root.Lab.logic = root.Lab.logic || {}; root.Lab.logic.exp2 = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /* The two gas processes, two moves each (md sections 17–20, 24–27).
     resp  = hô hấp:    O₂ from the environment into the leaf, then CO₂ from the leaf out to the environment.
     photo = quang hợp: CO₂ from the environment into the leaf, then O₂ from the leaf out to the environment. */
  var STEPS = {
    resp: [{ gas: 'o2', from: 'env', to: 'leaf', flag: 'o2In' }, { gas: 'co2', from: 'leaf', to: 'env', flag: 'co2Out' }],
    photo: [{ gas: 'co2', from: 'env', to: 'leaf', flag: 'co2In' }, { gas: 'o2', from: 'leaf', to: 'env', flag: 'o2Out' }]
  };
  var PROCESSES = ['resp', 'photo'];

  function initialState() {
    return {
      placed: false,                                   // plantPlaced
      topic: null,                                     // selectedMainTopic: 'air' | 'water' | null
      process: null,                                   // the gas process being watched: 'resp' | 'photo' | null
      part: null,                                      // the water/mineral part being done: 'water' | 'minerals' | null
      resp: { step: 0, o2In: false, co2Out: false, done: false },
      photo: { step: 0, co2In: false, o2Out: false, done: false },
      water: false, minerals: false,                   // waterCompleted, mineralsCompleted
      airDone: false, wmDone: false, finished: false,  // airExchangeCompleted, waterMineralExchangeCompleted, experimentCompleted
      box: false                                       // the transparent box is over the plant
    };
  }

  /* ---------------- topics and parts ---------------- */
  function topicState(s, topic) {
    if (!s.placed) return 'locked';
    if (topic === 'air' ? s.airDone : s.wmDone) return 'done';
    return s.topic === topic ? 'active' : 'open';
  }
  function selectTopic(s, topic) {
    if (!s.placed || (topic !== 'air' && topic !== 'water')) return false;
    s.topic = topic; s.process = null; s.part = null;
    return true;
  }
  function selectProcess(s, p) {
    if (s.topic !== 'air' || PROCESSES.indexOf(p) < 0 || s[p].done) return false;
    s.process = p; return true;
  }
  function selectPart(s, part) {
    if (s.topic !== 'water' || (part !== 'water' && part !== 'minerals') || s[part]) return false;
    s.part = part; return true;
  }
  /* state of the four small buttons inside the two topics: 'open' | 'active' | 'done' */
  function subState(s, name) {
    var done = name === 'resp' || name === 'photo' ? s[name].done : s[name];
    if (done) return 'done';
    return (name === 'resp' || name === 'photo' ? s.process : s.part) === name ? 'active' : 'open';
  }

  /* ---------------- gas moves ---------------- */
  function currentMove(s) {
    if (!s.process || s[s.process].done) return null;
    return STEPS[s.process][s[s.process].step];
  }
  /* which md sentence to show for the current move (also the task shown to the student) */
  function promptKey(s) {
    if (!s.process) return null;
    return s.process + 'Prompt' + (s[s.process].step + 1);
  }
  /* The student dropped molecule `gas` ('o2' | 'co2') that started in `from` ('env' | 'leaf') at `to` ('env' | 'leaf' | 'off'). */
  function decideGas(s, gas, from, to) {
    if (!s.process) return { ok: false, msg: 'chooseProcess' };
    var move = currentMove(s);
    if (!move || to === 'off') return { ok: false, msg: null };
    if (gas === move.gas && from === move.from && to === move.to) return { ok: true, action: 'gas', move: move };
    if (from === to) return { ok: false, msg: null };                                   // moved around in the same place: nothing to say
    var p = s.process, first = s[p].step === 0;
    if (first && to === 'leaf' && gas !== move.gas) return { ok: false, msg: p + 'WrongIn' };         // the wrong gas into the leaf
    if (!first && from === 'leaf' && to === 'env' && gas !== move.gas) return { ok: false, msg: p + 'WrongOut' };   // the wrong gas out of the leaf
    return { ok: false, msg: promptKey(s) };
  }
  /* records the move; returns what became complete */
  function applyGas(s) {
    var move = currentMove(s), out = { processDone: null, airDone: false, finished: false };
    if (!move) return out;
    var p = s.process, st = s[p];
    st[move.flag] = true; st.step++;
    if (st.step >= 2) {
      st.done = true; out.processDone = p; s.process = null;
      if (s.resp.done && s.photo.done && !s.airDone) { s.airDone = true; out.airDone = true; }
      out.finished = checkFinish(s);
    }
    return out;
  }

  /* ---------------- tools dropped from the tray ---------------- */
  /* zone: 'table' | 'plant' | 'leaf' | 'stem' | 'soil' | null */
  function decideTool(s, tool, zone) {
    if (tool === 'pot') {
      if (s.placed) return { ok: false, msg: null };
      return zone === 'table' || zone === 'plant' ? { ok: true, action: 'place' } : { ok: false, msg: 'potOff' };
    }
    if (!s.placed) return { ok: false, msg: 'potOff' };
    var onPlant = zone === 'plant' || zone === 'leaf' || zone === 'stem' || zone === 'soil';
    if (tool === 'water') {
      if (s.water) return { ok: false, msg: null };
      if (s.topic !== 'water' || s.part !== 'water') return { ok: false, msg: 'waterWhen' };
      return zone === 'soil' ? { ok: true, action: 'water' } : { ok: false, msg: 'waterWrong' };
    }
    if (tool === 'minerals') {
      if (s.minerals) return { ok: false, msg: null };
      if (s.topic !== 'water' || s.part !== 'minerals') return { ok: false, msg: 'mineralsWhen' };
      return zone === 'soil' ? { ok: true, action: 'minerals' } : { ok: false, msg: 'mineralsWrong' };
    }
    if (tool === 'magnifier') return onPlant ? { ok: true, action: 'magnify', target: zone === 'plant' ? 'leaf' : zone } : { ok: false, msg: 'magOff' };
    if (tool === 'box') {
      if (s.box) return { ok: false, msg: null };
      return onPlant ? { ok: true, action: 'box' } : { ok: false, msg: 'boxOff' };
    }
    return { ok: false, msg: null };
  }
  function applyTool(s, action) {
    var out = { airDone: false, wmDone: false, finished: false };
    if (action === 'place') s.placed = true;
    else if (action === 'box') s.box = true;
    else if (action === 'water' || action === 'minerals') {
      s[action] = true; s.part = null;
      if (s.water && s.minerals && !s.wmDone) { s.wmDone = true; out.wmDone = true; }
      out.finished = checkFinish(s);
    }
    return out;
  }
  function liftBox(s) { if (!s.box) return false; s.box = false; return true; }
  function checkFinish(s) {
    if (s.airDone && s.wmDone && !s.finished) { s.finished = true; return true; }
    return false;
  }

  /* ---------------- progress bar: 4 steps, 'locked' | 'open' | 'active' | 'done' (md sections 5, 44–54) ---------------- */
  function stepStates(s) {
    return [s.placed ? 'done' : 'active', topicState(s, 'air'), topicState(s, 'water'), s.finished ? 'done' : 'locked'];
  }
  /* which topic the panel should point at next (after the other one is finished) */
  function nextTopic(s) {
    if (!s.placed || s.finished) return null;
    if (s.airDone && !s.wmDone) return 'water';
    if (s.wmDone && !s.airDone) return 'air';
    return null;
  }
  function canOpenSynthesis(s) { return s.finished; }

  return {
    STEPS: STEPS, PROCESSES: PROCESSES, initialState: initialState,
    topicState: topicState, selectTopic: selectTopic, selectProcess: selectProcess, selectPart: selectPart, subState: subState,
    currentMove: currentMove, promptKey: promptKey, decideGas: decideGas, applyGas: applyGas,
    decideTool: decideTool, applyTool: applyTool, liftBox: liftBox,
    stepStates: stepStates, nextTopic: nextTopic, canOpenSynthesis: canOpenSynthesis
  };
});
