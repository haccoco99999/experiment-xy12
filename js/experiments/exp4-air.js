/* Experiment 4, part "trao đổi khí": the see-through rat seen from the side. O₂ floats around; the student drags it in through the
   nose, down the airway to the lungs; then a CO₂ appears in the lungs and is dragged out (md sections 16–23; no photosynthesis). */
(Lab.exp4mods = Lab.exp4mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, Mo = X.Mo, state = X.state, scene = X.scene;
  var mols = [], stopDrift = null, zoneEl = null;
  var COLOR = { o2: 0xff6a58, co2: 0x8b7b6b };
  /* [type, x, y]: where the floating gases wait around the rat (z = 0.75, in front of its side) */
  var ENV = [['o2', -2.05, 1.3], ['co2', -1.7, 1.9], ['o2', -2.1, 0.85], ['co2', 2.0, 1.4], ['o2', 2.1, 0.8], ['co2', 1.55, 1.9], ['o2', -0.75, 1.9], ['co2', 0.6, 2.05]];

  /* the drop area "the body": an oval around the rat on the screen */
  function bodyOval() { var r = Lab.stage.rectOf(X.rat.bodyBox(), 0); return { cx: r.x + r.w / 2, cy: r.y + r.h / 2, a: r.w * 0.58, b: r.h * 0.62 }; }
  function regionOf(x, y) {
    var e = bodyOval(), dx = (x - e.cx) / e.a, dy = (y - e.cy) / e.b;
    if (dx * dx + dy * dy <= 1) return 'body';
    var i = Lab.stage.insets, W = Lab.stage.size.w, H = Lab.stage.size.h;
    return x >= i.l && x <= W - i.r && y >= i.t && y <= H - i.b ? 'env' : 'off';
  }
  X.regionOf = regionOf;
  function hideZone() { if (zoneEl && zoneEl.parentNode) zoneEl.parentNode.removeChild(zoneEl); zoneEl = null; }
  function showZone() {
    hideZone(); var e = bodyOval();
    zoneEl = X.U.el('div', { class: 'dropzone show', style: { left: (e.cx - e.a) + 'px', top: (e.cy - e.b) + 'px', width: (2 * e.a) + 'px', height: (2 * e.b) + 'px', borderRadius: '50%' } }, X.U.el('span', { class: 'dropzone-label', text: MD.tray.mouse }));
    X.UI.el.zones.appendChild(zoneEl);
  }
  X.showBodyZone = showZone; X.hideBodyZone = hideZone;

  /* ---------------- molecules ---------------- */
  function addMol(type, pos, inside) {
    var obj = Mo.molecule(type); obj.position.copy(pos); scene.add(obj);
    var it = {
      object: obj, type: type, inBody: !!inside, home0: pos.clone(), radius: 50, ph: Math.random() * 6.28,
      tag: Lab.labels.add({ text: type === 'o2' ? MD.labels.o2 : MD.labels.co2, cls: 'mol ' + type, world: obj, dy: -18 }),
      home: function () { return it.home0; }, region: function () { return it.inBody ? 'lungs' : 'env'; },
      enabled: function () { return state.topic === 'air' && !state.airDone && !X.busy; }, onStart: showZone, onEnd: hideZone, onDrop: onDrop
    };
    Lab.sceneDrag.add(it); mols.push(it);
    return it;
  }
  function removeMol(it) { var i = mols.indexOf(it); if (i >= 0) mols.splice(i, 1); Lab.sceneDrag.remove(it); it.tag.remove(); X.dispose(it.object); }
  function clearMols() { hideZone(); mols.slice().forEach(removeMol); if (stopDrift) { stopDrift(); stopDrift = null; } }
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
    }, { ambient: true });
  }
  function lungSpot() { return X.rat.lungsWorld().add(new T.Vector3(0.05, 0.12, 0.4)); }
  function layout() {
    clearMols();
    ENV.forEach(function (e) { addMol(e[0], new T.Vector3(e[1], e[2], 0.75), false); });
    if (state.oxygenIn && !state.carbonDioxideOut) addMol('co2', lungSpot(), true);
    startDrift();
  }

  /* ---------------- dropping a molecule ---------------- */
  function onDrop(it, info) {
    var to = regionOf(info.client.x, info.client.y), from = it.inBody ? 'lungs' : 'env';
    var r = L.decideGas(state, it.type, from, to);
    if (!r.ok) { if (r.msg) X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); return { ok: false }; }
    accept(it, r.move); return { ok: true };
  }
  async function accept(it, move) {
    var into = move.to === 'body', rat = X.rat, seq = X.seq, key = into ? 'o2' : 'co2';
    var res = L.applyGas(state);
    X.busy++; it.state = 'busy'; Lab.audio.play('ok');
    var pts = rat.airPath(); if (!into) pts.reverse();
    pts[0] = it.object.position.clone();                                    // start where the student let go
    var curve = new T.CatmullRomCurve3(pts, false, 'centripetal');
    X.addFx(Lab.fx.flow(scene, { points: pts.map(function (p) { return p.clone(); }), color: COLOR[it.type], size: 0.07, count: 8, speed: 1.5, spread: 0.05, seeThrough: true }));
    X.tag(into ? MD.resp.o2Path : MD.resp.co2Path, function () { return rat.world(new T.Vector3(0, 1.3, 1.2)); }, 'arrow', 5600);
    X.toast(MD.right[key].text, { type: 'ok', ms: 5600 });
    rat.airMat.emissiveIntensity = 1.2; rat.breathFast = 1;
    await Lab.tween.value(2.2, function (k) { it.object.position.copy(curve.getPointAt(k)); }, { ease: 'inOutQuad' }).promise;
    if (into) { Lab.fx.ringPulse(scene, new T.Vector3(rat.lungsWorld().x, 0.05, rat.lungsWorld().z), 0xff8fa3, 1.2); rat.lungMat.emissiveIntensity = 1.4; }
    await Lab.tween.to(it.object.scale, { x: 0.01, y: 0.01, z: 0.01 }, 0.4, { ease: 'inCubic' }).promise;
    removeMol(it); X.busy--;
    if (seq !== X.seq) return;
    rat.airMat.emissiveIntensity = 0.3; Lab.tween.wait(2.5).promise.then(function () { rat.breathFast = 0; });
    if (!res.airDone) {                                                     // the CO₂ that the lungs give back
      var born = addMol('co2', lungSpot(), true); born.object.scale.setScalar(0.01); Lab.tween.to(born.object.scale, { x: 1, y: 1, z: 1 }, 0.5, { ease: 'outBack' });
      X.refresh(); return;
    }
    Lab.audio.play('step'); mols.slice().forEach(removeMol);
    X.tag(MD.airDone.in, function () { return rat.world(new T.Vector3(0, 1.5, 1.4)); }, 'arrow', 7000);
    X.tag(MD.airDone.out, function () { return rat.world(new T.Vector3(0, 1.1, -0.2)); }, 'arrow', 7000);
    X.toast(MD.airDone.text, { type: 'ok', ms: 7000 });
    if (!state.wfwDone) { X.highlight = 'wfw'; X.toast(APP.nextWfw, { type: 'info', ms: 6000 }); }
    X.refresh();
    if (res.finished) X.finale.begin();
  }

  /* ---------------- entering and leaving ---------------- */
  X.leaveHooks.push(function () {
    clearMols();
    if (X.rat && X.rat.xray > 0) {
      X.rat.setXray(0); X.rat.breathFast = 0;
      Lab.tween.to(X.rat.group.rotation, { y: X.near(X.rat.group.rotation.y, X.HEADING) }, 0.6);
      Lab.tween.to(X.rat.group.position, { x: X.POS.x, z: X.POS.z }, 0.6);
    }
  });
  X.air = {
    enter: function () {
      X.go('air'); var rat = X.rat;
      X.UI.caption(MD.resp.mode, { ms: 1500, cls: 'day' });
      Lab.tween.to(rat.group.position, { x: 0.35, z: 0.3 }, 0.9); Lab.tween.to(rat.group.rotation, { y: X.near(rat.group.rotation.y, -Math.PI / 2) }, 0.9);
      Lab.tween.value(1.2, function (k) { rat.setXray(k); });
      X.toast(MD.resp.info, { type: 'info', ms: 6500 });
      X.tag(MD.resp.view, function () { return rat.world(new T.Vector3(0, 1.35, 1.0)); }, 'arrow', 6500);
      if (!state.airDone) layout();
      X.refresh();
    }
  };
});
