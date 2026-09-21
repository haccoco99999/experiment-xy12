/* Experiment 8, outside the mother (md sections XVII–XXI): the camera moves back and the garden appears with the mother cat and a newborn kitten (md 17); the student clicks the
   kitten and looks at it with the glass, which lights the eyes, ears, legs and body one after another (18); the timeline 1 tuần → 2 tuần → 1 tháng → 2 tháng grows the kitten
   (19); then three kittens (newborn, 1 month, 2 months) stand side by side and are clicked one by one (20); the last timeline 2 tháng → 6 tháng → 1 năm makes it an adult (21). */
(Lab.exp8mods = Lab.exp8mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, UI = X.UI, state = X.state, V = X.V, Mo = X.Mo, PH = X.PH;
  var AGES = { growth: [0.25, 0.5, 1, 2], adult: [2, 6, 12] }, BASE = V(-0.4, 0, 1.15);
  var mother = null, kit = null, kitTag = null, markTag = null, cmp = [], cmpTags = [], outline = null, cmpStarted = false, standing = false, wander = { speed: 0 };
  function boxAt(p, r) { return new T.Box3(V(p.x - r, p.y - r, p.z - r), V(p.x + r, p.y + r, p.z + r)); }
  function ageOf(key, t) {
    var A = AGES[key]; if (t <= 0) return key === 'growth' ? Math.max(0, A[0] + t * 0.3) : A[0]; if (t >= A.length - 1) return A[A.length - 1];
    var i = Math.floor(t); return A[i] + (A[i + 1] - A[i]) * (t - i);
  }
  function addProxy(g, r, y) { var m = new T.Mesh(new T.SphereGeometry(r, 8, 6), new T.MeshBasicMaterial({ visible: false })); m.position.y = y; g.add(m); }   // a bigger, invisible thing to click on
  X.ticks.push(function (dt, time) {
    if (mother && mother.group.visible) mother.update(time);
    if (kit && kit.group.visible) {
      kit.update(time);
      if (wander.speed > 0 && (state.phase === PH.growth || state.phase === PH.adult) && !cmpStarted) { kit.group.position.x = BASE.x + Math.sin(time * 0.5 * wander.speed) * 0.9; kit.group.rotation.y = -1.0 + Math.cos(time * 0.5 * wander.speed) * 0.5; }
    }
    cmp.forEach(function (c) { if (c.cat.group.visible) c.cat.update(time); });
  });

  /* ---------------- phase 7: the birth (md 17): the camera leaves the inside, the garden appears ---------------- */
  X.enter[PH.kitten] = function () {
    X.busy++; X.shot({ cx: 0, cy: 1.5, cz: 0, w: 16, h: 9, pitch: 0.05, fov: 34 }, 2800);
    X.wait(1.3).then(function () {
      return X.fade(function () {
        [X.grow.womb(), X.fetus && X.fetus.group, X.embryo && X.embryo.group, X.zygote() && X.zygote().group].forEach(function (o) { if (o) X.dispose(o); });
        X.setSet('garden'); X.shot('yard', 0);
        mother = Mo.cat({ sex: 'female', pose: 'lie' }); mother.group.position.set(-2.4, 0, 0.3); mother.group.rotation.y = -0.35; X.scene.add(mother.group);
        kit = Mo.cat({ sex: 'kitten', age: 0, pose: 'lie' }); kit.group.position.copy(BASE); kit.group.rotation.y = -1.0; kit.group.userData.pick = 'kitten'; addProxy(kit.group, 0.7, 0.4);
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
  X.targets.kitten = function () { return kit && kit.group.visible && !cmpStarted && (state.phase === PH.kitten || state.phase === PH.growth || state.phase === PH.adult) ? boxAt(kitCenter(), 0.9) : null; };
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

  /* ---------------- phase 8: the kitten grows (md 19), then three kittens are compared (md 20) ---------------- */
  X.enter[PH.growth] = function () {
    kit.glow(false); if (kitTag) { kitTag.remove(); kitTag = null; } X.shot('yard', 1000);
    X.tlBegin('growth', {
      t0: -0.8,
      apply: function (t) { kit.setAge(ageOf('growth', t)); if (t >= 0.5 && !standing) { standing = true; kit.setPose('stand'); } },
      arrive: function (i, again, res) {
        wander.speed = [0.5, 0.8, 1.1, 1.4][i]; var m = MD.markInfo.growth[i], name = 'MỐC ' + MD.marks.growth[i].toUpperCase();
        UI.caption(MD.marks.growth[i], { ms: 1100, cls: 'day' }); X.setInfo({ title: name, msg: m.msg, lines: m.lines }); X.toast(m.msg, { type: 'info', ms: 6200 });
        if (markTag) markTag.remove(); markTag = X.tag(name, function () { return kitCenter().add(V(0, 0.8, 0)); }, 'place');
        if (res.done) X.wait(3.2).then(startCompare);
      }
    });
    X.tlGo(0);
  };
  function startCompare() {
    if (cmpStarted || state.phase !== PH.growth) return;
    cmpStarted = true; X.busy++; X.tlEnd(); X.closeLens(); if (markTag) { markTag.remove(); markTag = null; } kit.group.visible = false;
    [0, 1, 2].forEach(function (i) {
      var c = Mo.cat({ sex: 'kitten', age: [0, 1, 2][i], pose: i === 0 ? 'lie' : 'stand' }), x = -1.9 + 2.1 * i, g = c.group;
      g.position.set(x, 0, 1.1); g.rotation.y = -0.9; g.userData.pick = 'kitten' + i; addProxy(g, 0.75, 0.4); g.scale.setScalar(0.001); X.scene.add(g);
      cmp.push({ cat: c, x: x }); cmpTags.push(X.tag(MD.labels.compare[i], function () { return V(x, 1.35, 1.1); }, 'place'));
      X.targets['kitten' + i] = function () { return state.phase === PH.growth && cmpStarted ? boxAt(V(x, 0.45, 1.1), 0.85) : null; }; X.lensPoint['kitten' + i] = function () { return V(x, 0.4, 1.1); }; X.lensSize['kitten' + i] = 1.8;
      X.tween(1.0, function (k) { g.scale.setScalar(Math.max(0.001, k)); }, 'outCubic');
    });
    X.shot({ cx: 0.2, cy: 0.8, cz: 1.0, w: 6.4, h: 3.3, pitch: 0.3, fov: 34 }, 1200);
    X.wait(1.2).then(function () { X.busy--; X.toast(APP.compareTask, { type: 'info', ms: 6000 }); X.refresh(); });
  }
  X.clicks.push(function (hit) {
    var m = hit && /^kitten(\d)$/.exec(hit.id); if (!m || state.phase !== PH.growth || !cmpStarted) return false;
    var i = +m[1], res = L.applyCompare(state, i); Lab.audio.play('ok');
    cmp.forEach(function (c, j) { var s0 = c.cat.group.scale.x; X.tween(0.5, function (k) { c.cat.group.scale.setScalar(s0 + ((j === i ? 1.3 : 1) - s0) * k); }); });
    if (outline) { X.dispose(outline); outline = null; }
    X.wait(0.6).then(function () {                                    // the outline shows how big it is
      var b = new T.Box3().setFromObject(cmp[i].cat.group), size = b.getSize(new T.Vector3()), ctr = b.getCenter(new T.Vector3());
      outline = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(size.x, size.y, size.z)), new T.LineBasicMaterial({ color: 0xffe066 })); outline.position.copy(ctr); outline.userData.noPick = true; X.scene.add(outline);
    });
    var msg = i === 2 ? MD.right.compareInfo : APP.compareInfo[i];
    X.setInfo({ title: MD.labels.compare[i], msg: msg }); X.toast(msg, { type: 'info', ms: 5600 });
    if (res.done) X.wait(1.2).then(function () { X.toast(MD.right.compareAll, { type: 'ok', ms: 7000 }); Lab.audio.play('step'); });
    return true;
  });

  /* ---------------- phase 9: the adult (md 21) ---------------- */
  X.enter[PH.adult] = function () {
    if (outline) { X.dispose(outline); outline = null; }
    cmp.forEach(function (c) { X.dispose(c.cat.group); }); cmp = []; cmpTags.forEach(function (t) { t.remove(); }); cmpTags = []; cmpStarted = false; ['kitten0', 'kitten1', 'kitten2'].forEach(function (k) { delete X.targets[k]; });
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
  X.born = { mother: function () { return mother; }, kit: function () { return kit; } };
});
