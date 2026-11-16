/* Experiment 8, outside the mother (md sections XVII–XXI): a newborn piglet appears on the table (md 17); the student observes it, follows one piglet through the growth
   timeline (19), then follows that same pig through the adult timeline (21). */
(Lab.exp8mods = Lab.exp8mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, UI = X.UI, state = X.state, V = X.V, Mo = X.Mo, PH = X.PH;
  var AGES = { growth: [0.25, 0.5, 1, 2], adult: [2, 6, 12] }, BASE = V(-0.4, 0, 1.15);
  var kit = null, kitTag = null, markTag = null, standing = false, wander = { speed: 0 };
  function boxAt(p, r) { return new T.Box3(V(p.x - r, p.y - r, p.z - r), V(p.x + r, p.y + r, p.z + r)); }
  function ageOf(key, t) {
    var A = AGES[key]; if (t <= 0) return key === 'growth' ? Math.max(0, A[0] + t * 0.3) : A[0]; if (t >= A.length - 1) return A[A.length - 1];
    var i = Math.floor(t); return A[i] + (A[i + 1] - A[i]) * (t - i);
  }
  function addProxy(g, r, y) { var m = new T.Mesh(new T.SphereGeometry(r, 8, 6), new T.MeshBasicMaterial({ visible: false })); m.position.y = y; g.add(m); }   // a bigger, invisible thing to click on
  X.ticks.push(function (dt, time) {
    if (kit && kit.group.visible) {
      kit.update(time);
      if (wander.speed > 0 && (state.phase === PH.growth || state.phase === PH.adult)) { kit.group.position.x = BASE.x + Math.sin(time * 0.5 * wander.speed) * 0.9; kit.group.rotation.y = -1.0 + Math.cos(time * 0.5 * wander.speed) * 0.5; }
    }
  });

  /* ---------------- phase 7: the birth (md 17): the camera leaves the inside, the garden appears ---------------- */
  X.enter[PH.kitten] = function () {
    X.busy++; X.shot({ cx: 0, cy: 1.5, cz: 0, w: 16, h: 9, pitch: 0.05, fov: 34 }, 2800);
    X.wait(1.3).then(function () {
      return X.fade(function () {
        [X.fetus && X.fetus.group, X.embryo && X.embryo.group, X.zygote() && X.zygote().group].forEach(function (o) { if (o) X.dispose(o); });
        X.setSet('garden'); X.shot('yard', 0);
        kit = Mo.pig({ sex: 'kitten', age: 0, pose: 'lie' }); kit.group.position.copy(BASE); kit.group.rotation.y = -1.0; kit.group.userData.pick = 'kitten'; addProxy(kit.group, 0.7, 0.4);
        kit.group.scale.setScalar(0.001); X.scene.add(kit.group);
      });
    }).then(function () {
      Lab.audio.play('pop'); Lab.fx.sparkles(X.scene, BASE.clone().add(V(0, 0.4, 0)), 0xffe066, 12);
      return X.tween(1.0, function (k) { kit.group.scale.setScalar(Math.max(0.001, k)); }, 'outCubic');
    }).then(function () {
      X.busy--; X.toast(MD.right.kittenBorn, { type: 'info', ms: 7000 }); X.setInfo({ title: MD.labels.kittenNew, msg: MD.right.kittenBorn, lines: MD.newborn });
    });
  };
  X.clicks.push(function (hit) {
    if (state.phase !== PH.kitten) return false;
    var r = L.decideKitten(state, !!(hit && hit.id === 'kitten'));
    if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } return true; }
    L.applyKitten(state); Lab.audio.play('ok'); kit.glow(true); Lab.fx.sparkles(X.scene, BASE.clone().add(V(0, 0.5, 0)), 0xffe066, 10);
    X.shot({ cx: BASE.x, cy: 0.45, cz: BASE.z, w: 2.8, h: 1.7, pitch: 0.2, fov: 34 }, 1000);
    if (!kitTag) kitTag = X.tag(MD.labels.kittenNew, function () { return kit.group.position.clone().add(V(0, 1.0, 0)); }, 'place');
    X.setInfo({ title: MD.labels.kittenNew, msg: MD.right.kittenBorn, lines: MD.newborn }); X.refresh(); return true;
  });
  function kitCenter() { return kit.group.position.clone().add(V(0, 0.25 + 0.5 * Math.min(1, kit.age / 6), 0)); }
  X.targets.kitten = function () { return kit && kit.group.visible && (state.phase === PH.kitten || state.phase === PH.growth || state.phase === PH.adult) ? boxAt(kitCenter(), 0.9) : null; };
  X.lensPoint.kitten = kitCenter; X.lensSize.kitten = 1.5;
  X.lensHooks.kitten = function (credit) {
    if (!credit) return;
    X.busy++; var names = ['eyes', 'ears', 'legs', 'body'];
    (function step(i) {
      if (i >= names.length) { kit.highlight(null); X.toast(MD.right.kittenLens, { type: 'ok', ms: 6500 }); Lab.audio.play('step'); X.busy--; X.refresh(); return; }
      kit.highlight(names[i]); Lab.audio.play('click'); var t = X.tag(MD.regions[i].toUpperCase(), function () { return kitCenter().add(V(0, 0.7, 0.3)); }, 'part');
      X.wait(1.3).then(function () { t.remove(); step(i + 1); });
    })(0);
  };

  /* ---------------- phase 8: the same piglet grows (md 19) ---------------- */
  X.enter[PH.growth] = function () {
    kit.glow(false); if (kitTag) { kitTag.remove(); kitTag = null; } X.shot('yard', 1000);
    X.tlBegin('growth', {
      t0: -0.8,
      apply: function (t) { kit.setAge(ageOf('growth', t)); if (t >= 0.5 && !standing) { standing = true; kit.setPose('stand'); } },
      arrive: function (i, again, res) {
        wander.speed = [0.5, 0.8, 1.1, 1.4][i]; var m = MD.markInfo.growth[i], name = 'MỐC ' + MD.marks.growth[i].toUpperCase();
        UI.caption(MD.marks.growth[i], { ms: 1100, cls: 'day' }); X.setInfo({ title: name, msg: m.msg, lines: m.lines }); X.toast(m.msg, { type: 'info', ms: 6200 });
        if (markTag) markTag.remove(); markTag = X.tag(name, function () { return kitCenter().add(V(0, 0.8, 0)); }, 'place');
      }
    });
    X.tlGo(0);
  };

  /* ---------------- phase 9: the pig becomes an adult (md 21) ---------------- */
  X.enter[PH.adult] = function () {
    kit.group.visible = true; kit.group.position.copy(BASE); kit.setPose('stand'); wander.speed = 0.6; kit.setAge(2);
    X.shot('yard', 1000);
    X.tlBegin('adult', {
      t0: 0, apply: function (t) { kit.setAge(ageOf('adult', t)); },
      arrive: function (i, again, res) {
        var m = MD.markInfo.adult[i], name = 'MỐC ' + MD.marks.adult[i].toUpperCase();
        UI.caption(MD.marks.adult[i], { ms: 1100, cls: 'day' }); X.setInfo({ title: name, msg: m.msg.charAt(0).toUpperCase() + m.msg.slice(1), lines: m.lines });
        if (markTag) markTag.remove(); markTag = X.tag(name, function () { return kitCenter().add(V(0, 0.9, 0)); }, 'place');
        if (res.done) { X.toast(MD.right.adultAll, { type: 'ok', ms: 7500 }); Lab.audio.play('step'); }
      }
    });
    X.tlGo(0);
  };
  X.born = { kit: function () { return kit; } };
});
