/* Experiment 2, part "trao đổi nước và chất khoáng": the soil cut open, watering the soil, bringing minerals to the roots,
   and the combined effect at the end (md sections 30–38). */
(Lab.exp2mods = Lab.exp2mods || []).push(function (X) {
  'use strict';
  var T = X.T, U = X.U, L = X.L, MD = X.MD, APP = X.APP, Mo = X.Mo, state = X.state, scene = X.scene;
  var dots = null;                                                        // the mineral grains shown in the soil

  function tipOffset(obj, tilt) { var p = obj.userData.tip.position, c = Math.cos(tilt), s = Math.sin(tilt); return { x: p.x * c - p.y * s, y: p.x * s + p.y * c }; }
  async function flyIn(obj, at, from) {
    obj.position.set(from.x, from.y, from.z); obj.scale.setScalar(0.01); scene.add(obj);
    await Promise.all([Lab.tween.to(obj.position, { x: at.x, y: at.y, z: at.z }, 0.75, { ease: 'outCubic' }).promise, Lab.tween.to(obj.scale, { x: 1, y: 1, z: 1 }, 0.4, { ease: 'outBack' }).promise]);
  }
  async function flyAway(obj, dx, dy) {
    await Promise.all([Lab.tween.to(obj.position, { x: obj.position.x + dx, y: obj.position.y + dy }, 0.5, { ease: 'inCubic' }).promise, Lab.tween.to(obj.scale, { x: 0.01, y: 0.01, z: 0.01 }, 0.5, { ease: 'inCubic' }).promise]);
    X.dispose(obj);
  }
  function setTask(text) { X.task = text ? { text: text } : null; }

  /* the mineral grains: little dots spread over the soil (cut face), so the student can see what the roots will take up */
  function showDots() {
    if (dots) return;
    var p = X.plant.group.position, n = 34, R = U.rng(12);
    var mesh = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff, fog: false }), n);
    var m = new T.Matrix4(), q = new T.Quaternion(), pos = new T.Vector3(), s = new T.Vector3(), c = new T.Color(), cols = [0xffb347, 0xffd166, 0xf7f7f7, 0xff8c42];
    var info = [];
    for (var i = 0; i < n; i++) {
      var x = p.x + (R() - 0.5) * 1.15, y = 0.3 + R() * 0.72;
      info.push({ x: x, y: y, z: p.z + 0.09 });
      c.setHex(cols[(R() * cols.length) | 0]); mesh.setColorAt(i, c);
    }
    mesh.instanceColor.needsUpdate = true; mesh.frustumCulled = false; mesh.renderOrder = 4; mesh.userData.noPick = true;
    scene.add(mesh);
    dots = { mesh: mesh, info: info, k: 0.6, target: null, size: 0.03, stopTick: null };
    function put(time) {
      for (var j = 0; j < n; j++) {
        var d = dots.info[j], tw = 0.8 + 0.25 * Math.sin(time * 3 + j), k = dots.size * dots.k * tw;
        pos.set(d.x, d.y, d.z); s.set(k, k, k); m.compose(pos, q, s); mesh.setMatrixAt(j, m);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
    put(0);
    dots.stopTick = Lab.loop.add(function (dt, time) { put(time); }, { ambient: true });
  }
  function removeDots() { if (!dots) return; dots.stopTick(); X.dispose(dots.mesh); dots = null; }
  /* the grains drift to the root, one after the other, and disappear into it */
  function gatherDots() {
    if (!dots) return Promise.resolve();
    var root = X.plant.rootPoint();
    dots.info.forEach(function (d, i) {
      var x0 = d.x, y0 = d.y, delay = (i % 12) * 0.14;
      Lab.tween.value(2.2, function (k) { d.x = x0 + (root.x - x0) * k; d.y = y0 + (root.y + 0.35 - y0) * k; }, { delay: delay, ease: 'inOutCubic' });
    });
    return Lab.tween.value(1, function (k) { if (dots) dots.k = 1.6 * (1 - Math.max(0, (k - 0.7) / 0.3) * 0.999) + 0.1; }, { delay: 3.0 }).promise.then(removeDots);
  }

  /* ---------------- watering (md sections 32–34) ---------------- */
  async function water(out) {
    var plant = X.plant, pot = plant.pot, can = Mo.wateringCan(), tilt = -0.78, off = tipOffset(can, tilt), soil = pot.soilPoint(), seq = X.seq;
    X.busy++;
    await flyIn(can, { x: soil.x - off.x, y: 2.05 - off.y, z: soil.z + 0.35 }, { x: soil.x - off.x - 3.2, y: 3.8, z: soil.z + 0.35 });
    await Lab.tween.to(can.rotation, { z: tilt }, 0.55, { ease: 'inOutCubic' }).promise;
    Lab.audio.play('water');
    var tip = new T.Vector3(); can.userData.tip.updateMatrixWorld(true); can.userData.tip.getWorldPosition(tip);
    Lab.fx.pour(scene, { from: tip, to: soil, color: 0x59bff2, size: 0.055, count: 46, duration: 1.9, spread: 0.12, opacity: 0.85, flight: 0.5 });
    Lab.tween.wait(0.7).promise.then(function () { plant.setSoil('moist', true); });
    await Lab.tween.wait(2.0).promise;
    await Lab.tween.to(can.rotation, { z: 0 }, 0.35).promise;
    await flyAway(can, 3.4, 3);
    X.busy--;
    if (seq !== X.seq) return;
    X.toast(MD.wm.waterRight, { type: 'ok', ms: 5200 });
    plant.glow('root', 1); Lab.tween.value(3.5, function (k) { plant.glow('root', 1 - k); }, { ease: 'outQuad' });
    X.addFx(Lab.fx.flow(scene, { points: plant.soilPath(0), color: 0x59bff2, size: 0.07, count: 12, speed: 1.3, seeThrough: true }));
    X.tag(MD.wm.arrow, plant.rootPoint().add(new T.Vector3(0.9, 0.6, 0.4)), 'arrow', 6500);
    await Lab.tween.wait(2.4).promise; if (seq !== X.seq) return;
    X.toast(MD.wm.waterText, { type: 'ok', ms: 6500 });
    setTask(MD.wm.waterMark); Lab.audio.play('step');
    await after(out, seq);
  }

  /* ---------------- minerals (md sections 35–37) ---------------- */
  async function minerals(out) {
    var plant = X.plant, pot = plant.pot, bag = Mo.npkBag(), tilt = -2.5, off = tipOffset(bag, tilt), soil = pot.soilPoint(), seq = X.seq;
    X.busy++;
    showDots();
    await flyIn(bag, { x: soil.x - off.x, y: 2.1 - off.y, z: soil.z + 0.35 }, { x: soil.x - off.x - 3, y: 3.9, z: soil.z + 0.35 });
    await Lab.tween.to(bag.rotation, { z: tilt }, 0.6, { ease: 'inOutCubic' }).promise;
    Lab.audio.play('pour');
    var tip = new T.Vector3(); bag.userData.tip.updateMatrixWorld(true); bag.userData.tip.getWorldPosition(tip);
    [0xffb347, 0xf7f7f7, 0xffd166].forEach(function (c) { Lab.fx.pour(scene, { from: tip, to: soil, color: c, size: 0.04, count: 14, duration: 1.4, spread: 0.2, rough: 0.5, flight: 0.5 }); });
    await Lab.tween.wait(1.5).promise;
    await Lab.tween.to(bag.rotation, { z: 0 }, 0.35).promise;
    await flyAway(bag, 3.4, 3);
    X.busy--;
    if (seq !== X.seq) return;
    Lab.tween.value(1.2, function (k) { if (dots) dots.k = 0.6 + 1.1 * k; });           // the grains show up clearly
    X.toast(MD.wm.mineralsRight, { type: 'ok', ms: 5200 });
    gatherDots();
    plant.glow('root', 1); Lab.tween.value(4.2, function (k) { plant.glow('root', 1 - k); }, { ease: 'outQuad', delay: 1.2 });
    X.addFx(Lab.fx.flow(scene, { points: plant.soilPath(0.06), color: 0xffb347, size: 0.07, count: 12, speed: 1.3, seeThrough: true }));
    X.tag(MD.wm.arrow, plant.rootPoint().add(new T.Vector3(-0.9, 0.6, 0.4)), 'arrow', 6500);
    await Lab.tween.wait(3.0).promise; if (seq !== X.seq) return;
    setTask(MD.wm.mineralsMark); Lab.audio.play('step');
    await after(out, seq);
  }

  /* when one part is done: the next hint, or (both done) the combined effect (md section 38) */
  async function after(out, seq) {
    var plant = X.plant;
    if (!out.wmDone) { X.toast(state.water ? APP.waterDoneNext : APP.mineralsDoneNext, { type: 'info', ms: 5200 }); X.refresh(); return; }
    X.shot('overview', 1300);
    X.tag(MD.wm.diagram, plant.leafPoint().add(new T.Vector3(0, 1.2, 0.9)), 'arrow', 8000);
    X.addFx(Lab.fx.flow(scene, { points: plant.soilPath(-0.06), color: 0x59bff2, size: 0.07, count: 12, speed: 1.4, seeThrough: true }));
    X.addFx(Lab.fx.flow(scene, { points: plant.soilPath(0.06), color: 0xffb347, size: 0.07, count: 12, speed: 1.4, seeThrough: true }));
    var v0 = plant.vigor; Lab.tween.value(2.6, function (k) { plant.setVigor(v0 + (1 - v0) * k); });
    plant.pulse();
    await Lab.tween.wait(3.4).promise; if (seq !== X.seq) return;
    X.toast(MD.wm.text, { type: 'ok', ms: 7000 });
    await Lab.tween.wait(1.2).promise; if (seq !== X.seq) return;
    setTask(MD.wm.done); Lab.audio.play('step');
    if (!state.airDone) { X.highlight = 'air'; X.toast(APP.nextAir, { type: 'info', ms: 6000 }); }
    X.refresh();
    if (out.finished) X.finale.begin();
  }

  X.leaveHooks.push(function () { removeDots(); if (X.plant) X.plant.glow('root', 0); });
  X.wm = {
    enter: function () {
      X.go('root'); Lab.tween.wait(0.1).promise.then(function () { X.UI.caption(MD.modes.root, { ms: 1500, cls: 'day' }); });
      X.tag(MD.wm.diagram, X.plant.rootPoint().add(new T.Vector3(0, 1.75, 0.4)), 'arrow', 6000);
      X.toast(MD.wm.intro, { type: 'info', ms: 5200 });
      if (state.part) X.wm.start(state.part, true); else X.refresh();
    },
    start: function (part, quiet) {
      if (!quiet && !L.selectPart(state, part)) { X.toast(APP.alreadyDone, { type: 'info' }); return; }
      if (part === 'minerals') showDots(); else removeDots();
      setTask(part === 'water' ? MD.wm.waterPrompt : MD.wm.mineralsPrompt);
      X.refresh();
    },
    water: water, minerals: minerals
  };
});
