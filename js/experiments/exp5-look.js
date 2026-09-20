/* Experiment 5, part "cấu tạo hoa": the magnifier opens the lengthwise cut of the flower. Small glowing dots sit next to the parts; the student
   clicks them in order (nhị → chỉ nhị → bao phấn → nhụy → đầu nhụy → vòi nhụy → bầu nhụy → noãn). Each click lights the part, zooms in and
   writes its name (md sections 9–13 and 35). When every part has been seen the button "THỰC HIỆN THỤ PHẤN" opens. */
(Lab.exp5mods = Lab.exp5mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, state = X.state, Y0 = X.Y0;
  var dots = {}, label = null, glowTimer = 0;
  /* where the camera goes for each part: centre (x, y) and the width it should show */
  var VIEW = { stamen: [0.1, 2.35, 2.6], filament: [0.2, 2.1, 1.8], anther: [0.15, 2.5, 1.6], pistil: [0, 2.2, 2.6], stigma: [0, 2.85, 1.5], style: [0, 2.3, 1.7], ovary: [0, 1.45, 1.7], ovule: [0, 1.4, 1.4] };
  function view(part, ms) { var v = VIEW[part]; X.shot({ cx: v[0], cy: v[1], cz: X.POS.z, w: v[2], h: v[2] * 0.72, pitch: 0.06, fov: 34 }, ms); }

  function clearLabel() { if (label) { label.remove(); label = null; } }
  function clearDots() { Object.keys(dots).forEach(function (k) { dots[k].remove(); }); dots = {}; clearLabel(); }
  X.leaveHooks.push(function () { clearDots(); if (X.flower) X.flower.clearHighlights(); });

  function markDots() {
    var next = L.nextObs(state);
    Object.keys(dots).forEach(function (p) {
      var el = dots[p].el; if (!el) return;
      el.classList.toggle('done', !!state.observed[p]); el.classList.toggle('next', p === next);
    });
  }
  function makeDots() {
    L.OBS.forEach(function (p) {
      dots[p] = X.tag('', function () { return X.flower.world(X.flower.at[p]); }, 'hot', 0, { html: '<span class="hotdot"></span>', onClick: function () { X.touch(); tapPart(p); } });
    });
    markDots();
  }

  /* the light on a part for a moment, and its name next to it */
  function show(part) {
    var fl = X.flower, group = part === 'pistil' ? 'pistil' : part;
    fl.clearHighlights(); fl.highlight(group, 1);
    var seq = ++glowTimer; Lab.tween.wait(3.2).promise.then(function () { if (seq === glowTimer && X.mode === 'cut') fl.clearHighlights(); });
    clearLabel(); label = X.tag(MD.parts[part], function () { return fl.world(fl.at[part]).add(new T.Vector3(0.0, 0.34, 0.1)); }, 'part');
    view(part, 800);
    if (MD.desc[part]) X.toast(MD.desc[part], { type: 'info', ms: 5200 });
    if (part === 'anther') X.toast(MD.right.anther, { type: 'ok', ms: 5200 });
    if (part === 'ovary') { fl.setOvaryClear(1); fl.showOvules(true); Lab.fx.ringPulse(X.scene, fl.world(new T.Vector3(0, Y0 - 0.02, 0)), 0xfff2a0, 0.9); }
    if (part === 'pistil') pathLight();
  }
  /* "Đầu nhụy → Vòi nhụy → Bầu nhụy": the way from the top of the pistil to its bottom lights up part by part */
  function pathLight() {
    var fl = X.flower, seq = ++glowTimer;
    ['stigma', 'style', 'ovary'].forEach(function (p, i) {
      Lab.tween.wait(i * 0.7).promise.then(function () { if (seq !== glowTimer || X.mode !== 'cut') return; fl.clearHighlights(); fl.highlight(p, 1); });
    });
    Lab.tween.wait(2.4).promise.then(function () { if (seq === glowTimer && X.mode === 'cut') fl.clearHighlights(); });
  }

  function tapPart(part) {
    if (X.busy || X.mode !== 'cut') return;
    var r = L.decideObserve(state, part);
    if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg, r), { type: 'warn' }); Lab.audio.play('wrong'); } markDots(); return; }
    Lab.audio.play('click'); show(part);
    if (!r.again) {
      var res = L.applyObserve(state, part);
      if (res.unlocked) {
        Lab.audio.play('step'); X.toast(APP.obsDone, { type: 'ok', ms: 6500 });
        Lab.tween.wait(3.2).promise.then(function () { if (X.mode === 'cut') { clearLabel(); X.shot('cut', 900); } });
      }
    }
    markDots(); X.refresh();
  }

  X.look = {
    /* the button "QUAN SÁT CẤU TẠO HOA" */
    open: function () {
      if (!L.openStructure(state)) return;
      Lab.lens.hide(); Lab.audio.play('click');
      X.go('cut'); var fl = X.flower;
      Lab.tween.value(0.9, function (k) { fl.setCut(k); }, { ease: 'inOutQuad' });
      X.toast(APP.tapDots, { type: 'info', ms: 6000 });
      Lab.tween.wait(0.9).promise.then(function () { if (X.mode === 'cut') makeDots(); });
      X.refresh();
    },
    tapOvule: function (obj) {                                        // clicking an ovule itself is the same as its dot
      if (X.mode === 'cut' && state.observed.ovary) tapPart('ovule');
    },
    redraw: markDots
  };
});
