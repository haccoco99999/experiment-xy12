/* Experiment 2, part "dụng cụ": the magnifying glass (md section 14) and the transparent box. The box is in the tray and in the
   reset list of the md, but no step uses it, so it is an optional tool: put over the plant it shows the gases around the plant. */
(Lab.exp2mods = Lab.exp2mods || []).push(function (X) {
  'use strict';
  var T = X.T, U = X.U, APP = X.APP, Mo = X.Mo, L = X.L, state = X.state, scene = X.scene;
  var box = null, boxMols = [], boxTick = null;

  function magnify(target) {
    var plant = X.plant, g = plant.group.position;
    var world = target === 'leaf' ? function () { return plant.leafPoint().add(new T.Vector3(0, 0.15, 0.5)); }
      : target === 'stem' ? function () { return new T.Vector3(g.x, 1.11 + 0.7, g.z + 0.15); }
        : function () { return plant.rootPoint(); };
    Lab.lens.show({ world: world, radius: 122, viewSize: target === 'leaf' ? 1.25 : target === 'stem' ? 0.8 : 1.15, distance: 2.4, onClose: function () { X.refresh(); } });
    X.toast(target === 'leaf' ? APP.magLeaf : target === 'stem' ? APP.magStem : APP.magSoil, { type: 'info', ms: 5200 });
    Lab.fx.ringPulse(scene, new T.Vector3(g.x, 0, g.z), 0x00affe, 1.8);
  }

  function dropBox() {
    var b = box = Mo.clearBox(), p = X.plant.group.position;
    b.position.set(p.x, 6, p.z); scene.add(b);
    X.busy++;
    Lab.tween.to(b.position, { y: 0 }, 0.9, { ease: 'outBounce' }).promise.then(function () {
      X.busy--; Lab.audio.play('ok');
      Lab.fx.ringPulse(scene, new T.Vector3(p.x, 0, p.z), 0x00affe, 2.4);
      X.toast(APP.boxOn, { type: 'info', ms: 5200 });
      /* the gases in the air around the plant, drifting inside the box */
      var R = U.rng(5);
      for (var i = 0; i < 8; i++) {
        var m = Mo.molecule(i % 2 ? 'co2' : 'o2'); m.scale.setScalar(0.6); m.userData.halo.visible = false;
        m.userData.base = new T.Vector3(p.x + (R() - 0.5) * 2.8, 0.7 + R() * 3.0, p.z + (R() - 0.5) * 2.4); m.userData.ph = R() * 6.28;
        m.position.copy(m.userData.base); scene.add(m); boxMols.push(m);
      }
      boxTick = Lab.loop.add(function (dt, time) {
        boxMols.forEach(function (m) { var b0 = m.userData.base, ph = m.userData.ph; m.position.set(b0.x + Math.sin(time * 0.8 + ph) * 0.3, b0.y + Math.cos(time * 0.9 + ph) * 0.25, b0.z + Math.sin(time * 0.6 + ph * 2) * 0.25); m.rotation.y = time * 0.6 + ph; });
      }, { ambient: true });
      X.refresh();
    });
  }
  /* lift the box away (also used when a topic starts, so it never hides the leaves or the roots) */
  function liftBox(quiet) {
    if (!box || !L.liftBox(state)) return;
    var b = box; box = null;
    if (boxTick) { boxTick(); boxTick = null; }
    boxMols.forEach(X.dispose); boxMols = [];
    Lab.audio.play('pop');
    Lab.tween.to(b.position, { y: 6 }, 0.6, { ease: 'inCubic' }).promise.then(function () { X.dispose(b); });
    if (!quiet) X.toast(APP.boxLifted, { type: 'info' });
    X.refresh();
  }

  X.leaveHooks.push(function () { Lab.lens.hide(); });
  X.tools = { magnify: magnify, box: dropBox, liftBox: liftBox };
});
