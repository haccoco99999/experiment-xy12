/* Experiment 2, part "trao đổi khí": the leaf close-up, respiration in the dark and photosynthesis in the light.
   Gas molecules float around the leaves; the student drags the right one into the leaf, or out of it (md sections 15–29). */
(Lab.exp2mods = Lab.exp2mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, Mo = X.Mo, state = X.state, scene = X.scene, env = X.env;
  var mols = [], beam = null, stopDrift = null;
  /* where the floating gases wait around the leaves: [type, dx, dy] from the middle of the foliage */
  var ENV = [['o2', -2.1, 0.95], ['co2', -2.15, 0.0], ['o2', -2.1, -0.85], ['co2', 2.1, 0.95], ['o2', 2.15, 0.0], ['co2', 2.1, -0.85], ['o2', -0.8, 1.65], ['co2', 0.85, 1.7]];
  var COLOR = { o2: 0xff6a58, co2: 0x8b7b6b };

  /* the drop area "the leaf": an oval around the leaves on the screen (its corners must not reach the floating gases) */
  function leafOval() { var r = Lab.stage.rectOf(X.plant.foliageBox(), 0); return { cx: r.x + r.w / 2, cy: r.y + r.h * 0.4, a: r.w * 0.4, b: r.h * 0.4 }; }
  function regionOf(x, y) {
    var e = leafOval(), dx = (x - e.cx) / e.a, dy = (y - e.cy) / e.b;
    if (dx * dx + dy * dy <= 1) return 'leaf';
    var i = Lab.stage.insets, W = Lab.stage.size.w, H = Lab.stage.size.h;
    return x >= i.l && x <= W - i.r && y >= i.t && y <= H - i.b ? 'env' : 'off';
  }
  var zoneEl = null;
  function hideZone() { if (zoneEl && zoneEl.parentNode) zoneEl.parentNode.removeChild(zoneEl); zoneEl = null; }
  function showZone() {                                                   // a soft oval shows where the gas can be dropped
    hideZone(); var e = leafOval();
    zoneEl = X.U.el('div', { class: 'dropzone show', style: { left: (e.cx - e.a) + 'px', top: (e.cy - e.b) + 'px', width: (2 * e.a) + 'px', height: (2 * e.b) + 'px', borderRadius: '50%' } },
      X.U.el('span', { class: 'dropzone-label', text: MD.parts.leaf.tag }));
    X.UI.el.zones.appendChild(zoneEl);
  }

  /* ---------------- molecules ---------------- */
  function addMol(type, pos, inside) {
    var obj = Mo.molecule(type); obj.position.copy(pos); scene.add(obj);
    var it = {
      object: obj, type: type, inLeaf: !!inside, home0: pos.clone(), radius: 50, ph: Math.random() * 6.28,
      tag: Lab.labels.add({ text: type === 'o2' ? 'O₂' : 'CO₂', cls: 'mol ' + type, world: obj, dy: -18 }),
      home: function () { return it.home0; }, region: function () { return it.inLeaf ? 'leaf' : 'env'; },
      enabled: function () { return !!state.process && !X.busy; }, onStart: showZone, onEnd: hideZone, onDrop: onDrop
    };
    Lab.sceneDrag.add(it); mols.push(it);
    return it;
  }
  function removeMol(it) {
    var i = mols.indexOf(it); if (i >= 0) mols.splice(i, 1);
    Lab.sceneDrag.remove(it); it.tag.remove(); X.dispose(it.object);
  }
  function clearMols() {
    hideZone();
    mols.slice().forEach(removeMol);
    if (stopDrift) { stopDrift(); stopDrift = null; }
    if (beam) { X.dispose(beam); beam = null; }
  }
  function startDrift() {
    if (stopDrift) return;
    stopDrift = Lab.loop.add(function (dt, time) {
      mols.forEach(function (m) {
        var o = m.object, h = m.home0, halo = o.userData.halo;
        if (halo) halo.material.opacity = m.enabled() ? 0.42 + 0.25 * Math.sin(time * 3 + m.ph) : 0.12;
        if (m.state !== 'idle') return;
        o.position.set(h.x + Math.sin(time * 0.9 + m.ph) * 0.09, h.y + Math.cos(time * 1.1 + m.ph * 1.3) * 0.08, h.z + Math.sin(time * 0.7 + m.ph) * 0.05);
        o.rotation.y = time * 0.5 + m.ph;
      });
      if (beam) beam.material.opacity = 0.14 + 0.05 * Math.sin(time * 1.6);
    }, { ambient: true });
  }
  function insideSpot(k) { var lp = X.plant.leafPoint(); return lp.add(new T.Vector3(k ? 0.35 : -0.3, k ? -0.25 : 0.05, 0.6)); }
  /* the molecules for the current state: the floating ones, plus those already in the leaf */
  function layout() {
    clearMols();
    var lp = X.plant.leafPoint();
    ENV.forEach(function (e) { addMol(e[0], new T.Vector3(lp.x + e[1], lp.y + e[2], lp.z + 0.9), false); });
    var p = state.process, st = p && state[p];
    if (st && st.step === 1) {                                              // one gas is already in the leaf, and the leaf gives one back
      var move = L.STEPS[p][0], next = L.STEPS[p][1];
      addMol(move.gas, insideSpot(0), true); addMol(next.gas, insideSpot(1), true);
    }
    startDrift();
  }

  function setTask() {
    var key = L.promptKey(state);
    X.task = key ? { text: MD.prompt[key], legend: [X.U.el('span', { class: 'gas-chip o2', text: MD.gas.o2 }), X.U.el('span', { class: 'gas-chip co2', text: MD.gas.co2 })] } : null;
  }

  /* ---------------- dropping a molecule ---------------- */
  function onDrop(it, info) {
    var to = regionOf(info.client.x, info.client.y), from = it.inLeaf ? 'leaf' : 'env';
    var r = L.decideGas(state, it.type, from, to);
    if (!r.ok) {
      if (r.msg) X.toast(X.msgFor(r.msg), { type: 'warn' });
      Lab.audio.play('wrong');
      return { ok: false };
    }
    accept(it, r.move); return { ok: true };
  }
  /* the right move: the gas travels, an arrow and the md sentence appear, and the next move (or the end) follows */
  async function accept(it, move) {
    var p = state.process, into = move.to === 'leaf', key = p + (into ? 'In' : 'Out'), seq = X.seq, plant = X.plant, lp = plant.leafPoint();
    var res = L.applyGas(state), start = it.object.position.clone();
    X.busy++; it.state = 'busy'; it.tag.setVisible(true);
    Lab.audio.play('ok');
    var target = into ? insideSpot(0) : new T.Vector3(lp.x + (start.x < lp.x ? -2.1 : 2.1), lp.y + 1.25, lp.z + 0.9);
    var via = new T.Vector3().addVectors(start, target).multiplyScalar(0.5); via.z += 0.25;
    var beads = X.addFx(Lab.fx.flow(scene, { points: [start.clone(), via, target.clone()], color: COLOR[it.type], size: 0.085, count: 9, speed: 1.6, spread: 0.1, seeThrough: true }));
    plant.glow('leaf', 0.9);
    X.tag(MD.right[key].arrow, lp.clone().add(new T.Vector3(0, into ? 1.15 : 1.5, 0.9)), 'arrow', 5200);
    X.toast(MD.right[key].text, { type: 'ok', ms: 5600 });
    await Lab.tween.to(it.object.position, { x: target.x, y: target.y, z: target.z }, 0.9, { ease: 'outCubic' }).promise;
    if (into) { it.inLeaf = true; it.home0.copy(target); it.state = 'idle'; }
    else { await Lab.tween.to(it.object.scale, { x: 0.01, y: 0.01, z: 0.01 }, 0.4, { ease: 'inCubic' }).promise; removeMol(it); }
    X.busy--;
    if (seq !== X.seq) return;
    Lab.tween.value(1.4, function (k) { plant.glow('leaf', 0.9 * (1 - k)); }, { ease: 'outQuad' });
    Lab.tween.wait(3.4).promise.then(function () { beads.setActive(false); });
    if (!res.processDone) {                                                 // now the second move: the leaf gives a gas back
      var next = L.STEPS[p][1], born = addMol(next.gas, insideSpot(1), true);
      born.object.scale.setScalar(0.01); Lab.tween.to(born.object.scale, { x: 1, y: 1, z: 1 }, 0.5, { ease: 'outBack' });
      Lab.fx.ringPulse(scene, new T.Vector3(born.home0.x, lp.y - 0.6, born.home0.z), COLOR[next.gas], 1.2);
      setTask(); X.refresh();
    } else await finish(p, res, seq);
  }

  async function finish(p, res, seq) {
    var plant = X.plant, lp = plant.leafPoint();
    if (p === 'resp') {
      X.tag(MD.resp.diagram, lp.clone().add(new T.Vector3(0, -1.5, 0.9)), 'arrow', 7000);
      await Lab.tween.wait(1.6).promise; if (seq !== X.seq) return;
      X.toast(MD.resp.text, { type: 'ok', ms: 6500 });
    } else {                                                                // photosynthesis: light, gases, water and a fresher leaf
      X.toast(MD.photo.running, { type: 'info', emoji: '☀️', ms: 3200 });
      X.tag(MD.photo.diagram, lp.clone().add(new T.Vector3(0, -1.5, 0.9)), 'arrow', 7000);
      plant.glow('leaf', 0.8); var v0 = plant.vigor; Lab.tween.value(2.4, function (k) { plant.setVigor(v0 + (Math.min(1, v0 + 0.22) - v0) * k); plant.glow('leaf', 0.8 * (1 - k * 0.6)); });
      var lp0 = lp.clone(), l = new T.Vector3(lp0.x - 2.0, lp0.y + 0.4, lp0.z + 0.9), r = new T.Vector3(lp0.x + 2.0, lp0.y + 0.9, lp0.z + 0.9);
      X.addFx(Lab.fx.flow(scene, { points: [l, lp0.clone().add(new T.Vector3(0, 0, 0.7)), lp0], color: COLOR.co2, size: 0.09, count: 6, speed: 1.4, seeThrough: true }));
      X.addFx(Lab.fx.flow(scene, { points: [lp0.clone(), lp0.clone().add(new T.Vector3(0.9, 0.6, 0.8)), r], color: COLOR.o2, size: 0.09, count: 6, speed: 1.4, seeThrough: true }));
      await Lab.tween.wait(3.4).promise; if (seq !== X.seq) return;
      X.toast(MD.photo.text, { type: 'ok', ms: 7000 });
      await Lab.tween.wait(1.0).promise; if (seq !== X.seq) return;
    }
    Lab.audio.play('step'); clearMols();
    X.task = { text: MD[p].done }; X.refresh();
    if (res.airDone) {
      X.toast(MD.airDone.text, { type: 'ok', ms: 6500 });
      if (!state.wmDone) { X.highlight = 'water'; X.toast(MD.airDone.next, { type: 'info', ms: 6500 }); }
      X.refresh();
    }
    if (res.finished) X.finale.begin();
  }

  /* ---------------- entering, starting, leaving ---------------- */
  X.leaveHooks.push(function () { clearMols(); if (X.plant) X.plant.glow('leaf', 0); });
  X.gas = {
    region: regionOf,
    enter: function () {
      X.go('leaf'); UI_caption(MD.modes.leaf);
      if (state.process) { layout(); setTask(); }
      X.refresh();
    },
    start: function (p) {
      if (!L.selectProcess(state, p)) { X.toast(APP.alreadyDone, { type: 'info' }); return; }
      X.seq++; X.stopFx(); clearMols();
      if (p === 'resp') { var d0 = 1; Lab.tween.value(1.2, function (k) { env.setDay(d0 - 0.78 * k); }); X.plant.glow('leaf', 0.5); }
      else {
        env.setDay(1); X.plant.glow('leaf', 0);
        beam = new T.Mesh(new T.CylinderGeometry(1.15, 0.4, 3.4, 28, 1, true), new T.MeshBasicMaterial({ color: 0xfff1a8, transparent: true, opacity: 0.16, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false }));
        var lp = X.plant.leafPoint(); beam.position.set(lp.x + 0.2, lp.y + 1.6, lp.z); beam.renderOrder = 2; beam.userData.noPick = true; scene.add(beam);
        X.addFx(Lab.fx.flow(scene, { points: X.plant.soilPath(0).slice(3), color: 0x59bff2, size: 0.06, count: 10, speed: 1.1, seeThrough: true }));    // water on its way up (md section 23)
      }
      layout(); setTask(); X.refresh();
    }
  };
  function UI_caption(text) { X.UI.caption(text, { ms: 1500, cls: 'day' }); }
});
