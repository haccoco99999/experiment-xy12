/* Experiment 5, part "thụ tinh": the flower is cut lengthwise again. The student clicks the pollen on the stigma (it germinates), pulls the pollen
   tube down the style, brings its tip to an ovule and drags the male cell into the ovule, where it joins the female cell (md sections 19–24). */
(Lab.exp5mods = Lab.exp5mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, Mo = X.Mo, state = X.state, scene = X.scene, Y0 = X.Y0, Z = X.POS.z;
  var CORRIDOR = 0.34;                                                    // how far (world units) the pointer may wander from the way down the style
  var tube = null, tube2 = null, item1 = null, item2 = null, item3 = null, stop = [], extras = [], tags = [], pollenTag = null, target = -1, prog = 0.07, lastOff = 0;
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  function rmItem(it) { if (it) Lab.sceneDrag.remove(it); }
  function cleanup() {
    rmItem(item1); rmItem(item2); rmItem(item3); item1 = item2 = item3 = null;
    stop.forEach(function (f) { f(); }); stop.length = 0;
    extras.forEach(function (o) { X.dispose(o); }); extras.length = 0;
    if (tube) { tube.dispose(); X.dispose(tube.group); tube = null; } if (tube2) { tube2.dispose(); X.dispose(tube2.group); tube2 = null; }
    if (pollenTag) { pollenTag.remove(); pollenTag = null; }
    tags.forEach(function (t) { t.remove(); }); tags.length = 0;
  }
  X.leaveHooks.push(cleanup);
  function shotAt(cy, w, ms) { X.shot({ cx: 0, cy: cy, cz: Z, w: w, h: w * 0.72, pitch: 0.04, fov: 34 }, ms); }
  function stylePath() { var fl = X.flower; return new T.CatmullRomCurve3([fl.world(V(0, Y0 + 1.5, 0.03)), fl.world(V(0, Y0 + 1.15, 0.03)), fl.world(V(0, Y0 + 0.75, 0.03)), fl.world(V(0, Y0 + 0.36, 0.03))]); }
  /* the nearest place on a curve to a point: {t, d} */
  function closest(curve, p) {
    var best = 0, bd = 1e9;
    for (var i = 0; i <= 80; i++) { var d = curve.getPointAt(i / 80).distanceTo(p); if (d < bd) { bd = d; best = i / 80; } }
    return { t: best, d: bd };
  }
  function sphere(r, color, at) {
    var m = new T.Mesh(new T.SphereGeometry(r, 16, 12), new T.MeshBasicMaterial({ color: color, depthTest: false })); m.renderOrder = 22; m.position.copy(at); m.userData.noPick = true; scene.add(m); extras.push(m); return m;
  }

  /* ---------------- 1. the pollen on the stigma waits for a click ---------------- */
  function enter() {
    X.go('fert', { cx: 0, cy: Y0 + 1.5, cz: Z, w: 1.6, h: 1.15, pitch: 0.04, fov: 34 }); var fl = X.flower;
    Lab.tween.value(0.9, function (k) { fl.setCut(k); fl.focusPistil(k); }, { ease: 'inOutQuad' });
    fl.setOvaryClear(1); fl.showOvules(true); fl.pollenOnStigma.visible = true;
    pollenTag = X.tag(MD.labels.pollen, function () { return fl.world(V(0.05, Y0 + 1.86, 0.1)); }, 'part');
    X.toast(MD.prompt.fertGuide, { type: 'info', ms: 6500 }); X.refresh();
  }
  function tapPollen(exact) {
    var r = L.decideGerminate(state, exact ? 'pollen' : 'other');
    if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } return; }
    germinate();
  }
  async function germinate() {
    var seq = X.seq, fl = X.flower; L.applyGerminate(state); X.busy++;
    if (pollenTag) { pollenTag.remove(); pollenTag = null; }
    X.toast(MD.right.germinated, { type: 'ok', ms: 5600 }); Lab.audio.play('ok');
    try {
      Lab.tween.to(fl.pollenOnStigma.scale, { x: 1.6, y: 1.6, z: 1.6 }, 0.7, { ease: 'outBack' });
      await Lab.tween.wait(0.9).promise; if (seq !== X.seq) return;
      tube = Mo.pollenTube(stylePath(), 0.022); scene.add(tube.group);
      await Lab.tween.value(1.2, function (k) { tube.setProgress(0.07 * k); }, { ease: 'outQuad' }).promise; if (seq !== X.seq) return;
      X.tag(MD.labels.tube, function () { return tube ? tube.tip.getWorldPosition(new T.Vector3()).add(V(0.3, 0.08, 0)) : V(0, -9, 0); }, 'part', 4500);
      shotAt(Y0 + 1.15, 2.3, 800);
    } finally { X.busy--; }
    if (seq === X.seq) { startTube(); X.refresh(); }
  }

  /* ---------------- 2. the tube goes down the style (the tip follows the pointer along the way down) ---------------- */
  function startTube() {
    var curve = stylePath(), cam = 0; prog = 0.07; lastOff = 0;
    item1 = {
      object: tube.tip, radius: 80, home: function () { return tube.pointAt(prog); }, region: function () { return 'path'; },
      enabled: function () { return !X.busy && state.germinated && !state.tubeAtOvary; },
      onDrop: function (it) {
        var r = L.decideTubeRelease(state, prog, lastOff > CORRIDOR);
        if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } return { ok: false }; }
        it.state = 'idle'; return { ok: true };
      }
    };
    Lab.sceneDrag.add(item1);
    stop.push(Lab.loop.add(function () {
      if (!item1 || item1.state !== 'drag') return;
      var c = closest(curve, tube.tip.position); lastOff = c.d;
      if (c.d <= CORRIDOR && c.t > prog) {
        prog = c.t; L.applyTube(state, prog);
        if (prog > 0.35 && cam < 1) { cam = 1; shotAt(Y0 + 0.85, 2.2, 700); } else if (prog > 0.7 && cam < 2) { cam = 2; shotAt(Y0 + 0.45, 1.9, 700); }
      }
      tube.setProgress(prog);
      if (state.tubeAtOvary) tubeArrived();
    }, { ambient: true }));
  }
  function tubeArrived() {
    rmItem(item1); item1 = null; tube.setProgress(1); Lab.audio.play('step');
    document.body.classList.remove('is-dragging-item');
    shotAt(Y0 - 0.02, 1.5, 900);
    Lab.tween.wait(0.7).promise.then(startOvule); X.toast(MD.prompt.ovuleTask, { type: 'info', ms: 6000 }); X.refresh();
  }

  /* ---------------- 3. the tip goes to an ovule ---------------- */
  function bend(a, b) { return new T.QuadraticBezierCurve3(a, a.clone().lerp(b, 0.5).add(V(0, -0.12, 0)), b); }
  function startOvule() {
    if (state.tubeAtOvule) return;
    var fl = X.flower, S = tube.pointAt(1).clone();
    tube2 = Mo.pollenTube(new T.LineCurve3(S, S.clone().add(V(0, -0.03, 0))), 0.022); scene.add(tube2.group); tube2.setProgress(1);
    item2 = {
      object: tube2.tip, radius: 80, home: function () { return S; }, region: function () { return 'ovary'; },
      enabled: function () { return !X.busy && state.tubeAtOvary && !state.tubeAtOvule; },
      onDrop: function (it, info) {
        var best = -1, bd = 1e9;
        fl.ovulePos.forEach(function (p, i) { var s = Lab.stage.project(fl.world(p)), d = Math.hypot(s.x - info.client.x, s.y - info.client.y); if (d < bd) { bd = d; best = i; } });
        var r = L.decideOvule(state, bd < 48);
        if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } return { ok: false }; }
        it.state = 'idle'; connect(best); return { ok: true };
      }
    };
    Lab.sceneDrag.add(item2);
    stop.push(Lab.loop.add(function () {
      if (!item2 || !tube2 || (item2.state !== 'drag' && item2.state !== 'home')) return;
      tube2.setCurve(bend(S, tube2.tip.position.clone()), 1);
    }, { ambient: true }));
  }
  async function connect(i) {
    var seq = X.seq, fl = X.flower, ov = fl.ovules[i], S = tube.pointAt(1), top = fl.world(fl.ovulePos[i].clone().add(V(0, 0.2, 0)));
    target = i; L.applyOvule(state); X.busy++; rmItem(item2); item2 = null;
    tube2.setCurve(bend(S, top), 1); ov.material.emissive.setHex(0xffe27a); ov.material.emissiveIntensity = 0.9; Lab.tween.to(ov.scale, { x: 2.2, y: 2.2, z: 2.2 }, 0.6, { ease: 'outBack' });   // the chosen ovule is drawn bigger so that we can look inside
    fl.ovules.forEach(function (o, j) { if (j !== i) { o.material.transparent = true; o.material.opacity = 0.16; o.material.depthWrite = false; o.material.needsUpdate = true; } });   // the others fade so that this one can be seen
    Lab.audio.play('ok'); X.toast(MD.right.ovuleReached, { type: 'ok', ms: 5000 });
    try { await Lab.tween.wait(1.4).promise; if (seq !== X.seq) return; } finally { X.busy--; }
    startMale(top);
  }

  /* ---------------- 4. the male cell goes into the ovule and meets the female cell ---------------- */
  function startMale(top) {
    var fl = X.flower, ov = fl.ovules[target], c = fl.world(fl.ovulePos[target]);
    ov.material.transparent = true; ov.material.opacity = 0.42; ov.material.depthWrite = false; ov.material.needsUpdate = true;
    X.shot({ cx: c.x, cy: c.y, cz: Z, w: 0.62, h: 0.45, pitch: 0.04, fov: 34 }, 900);
    var male = sphere(0.04, 0x66e0ff, top); tags.push(X.tag(MD.labels.male, function () { return male.position.clone().add(V(0.13, 0.09, 0)); }, 'part'));
    X.toast(MD.prompt.maleTask, { type: 'info', ms: 6000 }); X.refresh();
    item3 = {
      object: male, radius: 70, home: function () { return top; }, region: function () { return 'tube'; },
      enabled: function () { return !X.busy && state.tubeAtOvule && !state.maleIn; },
      onDrop: function (it, info) {
        var p = Lab.stage.project(c), q = Lab.stage.project(c.clone().add(V(0.17, 0, 0))), rpx = Math.hypot(q.x - p.x, q.y - p.y);
        var inside = Math.hypot(info.client.x - p.x, info.client.y - p.y) < rpx * 0.7;
        var r = L.decideMale(state, inside);
        if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } return { ok: false }; }
        it.state = 'idle'; fertilize(male, c); return { ok: true };
      }
    };
    Lab.sceneDrag.add(item3);
  }
  async function fertilize(male, c) {
    var seq = X.seq; X.busy++; L.applyMale(state); rmItem(item3); item3 = null;
    try {
      await Lab.tween.to(male.position, { x: c.x + 0.06, y: c.y + 0.04, z: c.z }, 0.9, { ease: 'inOutQuad' }).promise; if (seq !== X.seq) return;
      var female = sphere(0.055, 0xff8fb0, V(c.x - 0.05, c.y - 0.03, c.z)); female.scale.setScalar(0.01);
      X.tag(MD.labels.female, function () { return V(c.x - 0.2, c.y - 0.2, c.z); }, 'part', 3800);
      await Lab.tween.to(female.scale, { x: 1, y: 1, z: 1 }, 0.6, { ease: 'outBack' }).promise; if (seq !== X.seq) return;
      await Promise.all([Lab.tween.to(male.position, { x: c.x, y: c.y, z: c.z }, 0.9, { ease: 'inOutQuad' }).promise, Lab.tween.to(female.position, { x: c.x, y: c.y, z: c.z }, 0.9, { ease: 'inOutQuad' }).promise]);
      if (seq !== X.seq) return;
      male.visible = false; tags.forEach(function (t) { t.remove(); }); tags.length = 0; female.material.color.setHex(0xffe9a0); Lab.tween.to(female.scale, { x: 1.4, y: 1.4, z: 1.4 }, 0.5, { ease: 'outBack' });
      Lab.fx.ringPulse(scene, V(c.x, c.y - 0.1, c.z), 0xfff2a0, 0.6); Lab.fx.sparkles(scene, c, 0xfff2a0, 12); Lab.audio.play('done');
      await Lab.tween.wait(2.0).promise; if (seq !== X.seq) return;                      // everything stops for about two seconds (md section 24)
      X.UI.caption(MD.right.fertBig, { ms: 2400, cls: 'day' });
      X.toast(MD.right.fertWhy, { type: 'ok', ms: 7500 }); Lab.audio.play('step');
      shotAt(Y0 + 0.5, 2.4, 1100);
    } finally { X.busy--; }
    X.refresh();
  }

  X.fert = { enter: enter, tapPollen: tapPollen, debug: function () { return { prog: prog, lastOff: lastOff, target: target }; } };
});
