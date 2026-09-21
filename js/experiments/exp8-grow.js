/* Experiment 8, inside the mother cat (md sections XV and XVI): the button "THEO DÕI HỢP TỬ PHÁT TRIỂN" swaps the zygote for the embryo and opens the timeline
   Ngày 0 → 15 → 30 → 45 (the cells divide, the body shows); the magnifier looks at the embryo. Then the fetus: Ngày 45 → 60 → gần ngày sinh, the student clicks
   its head, body, legs and tail (the ears too) and looks at it with the magnifier. A mark opens when the one before it has been seen. */
(Lab.exp8mods = Lab.exp8mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, UI = X.UI, state = X.state, V = X.V, Mo = X.Mo, PH = X.PH, el = X.U.el;
  var CENTER = V(0, 1.5, 0), embryo = null, fetus = null, womb = null, embTag = null, partTag = null, hl = 0;
  function boxAt(p, r) { return new T.Box3(V(p.x - r, p.y - r, p.z - r), V(p.x + r, p.y + r, p.z + r)); }
  X.ticks.push(function (dt, time) {
    if (embryo && embryo.group.visible) embryo.group.rotation.y = Math.sin(time * 0.5) * 0.35;
    if (fetus && fetus.group.visible) { fetus.group.rotation.y = Math.sin(time * 0.45) * 0.3; fetus.group.position.y = CENTER.y + Math.sin(time * 0.9) * 0.06; }
  });
  function markInfo(tl, i) {                                         // what a mark shows: the day, the sentence, the extra lines
    var m = MD.markInfo[tl][i]; UI.caption(MD.marks[tl][i], { ms: 1100, cls: 'day' });
    X.setInfo({ title: MD.marks[tl][i], msg: m.msg, lines: m.lines }); X.toast(m.msg, { type: 'info', ms: 6200 });
  }

  /* ---------------- phase 5: zygote → embryo (md 15) ---------------- */
  X.enter[PH.embryo] = function () {
    X.busy++; var egg = X.zygote(); embryo = X.embryo = Mo.embryo(); embryo.group.position.copy(CENTER); embryo.group.visible = false; X.scene.add(embryo.group);
    X.shot('close', 1000);
    X.tween(0.9, function (k) { egg.group.scale.setScalar(1.35 * (1 - k) + 0.001); }, 'inCubic').then(function () {
      egg.group.visible = false; embryo.group.visible = true; Lab.audio.play('pop'); Lab.fx.sparkles(X.scene, CENTER.clone(), 0xffe066, 10);
      X.busy--; X.tlBegin('embryo', { t0: 0, apply: function (t) { embryo.setT(t); }, arrive: function (i) { markInfo('embryo', i); if (i === 3 && !embTag) embTag = X.tag(MD.labels.embryo, V(0, 3.4, 0), 'place'); } });
      X.tlGo(0);
    });
  };
  X.targets.embryo = function () { return embryo && embryo.group.visible && state.phase === PH.embryo ? boxAt(CENTER, 1.5) : null; };
  X.lensPoint.embryo = function () { return CENTER.clone(); }; X.lensSize.embryo = 2.4;
  X.lensHooks.embryo = function (credit) {
    if (!credit) return;
    Lab.audio.play('ok'); Lab.fx.sparkles(X.scene, CENTER.clone(), 0xffe066, 12); X.toast(MD.markInfo.embryo[3].msg, { type: 'ok', ms: 6000 });
  };

  /* ---------------- phase 6: embryo → fetus inside the mother (md 16) ---------------- */
  function makeWomb() {
    var g = new T.Group(), k = [2.9, 2.2, 2.0];
    var back = new T.Mesh(new T.SphereGeometry(1, 32, 20), Lab.mat.clearPlastic({ color: 0xff9db8, opacity: 0, side: T.BackSide })); back.scale.set(k[0], k[1], k[2]); back.renderOrder = 2;
    var front = new T.Mesh(new T.SphereGeometry(1, 32, 20), Lab.mat.clearPlastic({ color: 0xffd0dc, opacity: 0, side: T.FrontSide })); front.scale.set(k[0], k[1], k[2]); front.renderOrder = 6;
    back.userData.noPick = front.userData.noPick = true; g.add(back); g.add(front); g.position.copy(CENTER); g.userData.mats = [back.material, front.material]; return g;
  }
  X.enter[PH.fetus] = function () {
    X.busy++; if (embTag) { embTag.remove(); embTag = null; }
    fetus = X.fetus = Mo.fetus(); fetus.group.position.copy(CENTER); fetus.group.visible = false; X.scene.add(fetus.group);
    womb = makeWomb(); X.scene.add(womb);
    X.tween(1.4, function (k) { embryo.group.scale.setScalar(Math.max(0.001, 1 - k)); womb.userData.mats[0].opacity = 0.3 * k; womb.userData.mats[1].opacity = 0.16 * k; }, 'inOutQuad').then(function () {
      embryo.group.visible = false; fetus.group.visible = true; Lab.audio.play('pop');
      return X.tween(0.9, function (k) { fetus.group.scale.setScalar(Math.max(0.001, 0.6 * k)); }, 'outCubic');
    }).then(function () {
      X.busy--; X.tlBegin('fetus', { t0: 0, apply: function (t) { fetus.setStage(t); }, arrive: function (i) { markInfo('fetus', i); } }); X.tlGo(0);
    });
  };
  X.targets.fetus = function () { return fetus && fetus.group.visible && state.phase === PH.fetus ? boxAt(CENTER, 1.7) : null; };
  X.lensPoint.fetus = function () { return CENTER.clone(); }; X.lensSize.fetus = 2.8;
  X.lensHooks.fetus = function (credit) {
    if (!credit) return;
    Lab.audio.play('ok'); Lab.fx.sparkles(X.scene, CENTER.clone(), 0xffe066, 12); X.toast(MD.markInfo.fetus[2].msg, { type: 'ok', ms: 6500 });
  };
  X.clicks.push(function (hit) {                                     // clicking the parts of the fetus (md 16.4)
    var id = hit && hit.id; if (state.phase !== PH.fetus || !id || id.indexOf('fetus:') !== 0) return false;
    var part = id.slice(6), r = L.decidePart(state, part); if (!r.ok) return true;
    Lab.audio.play('click'); fetus.highlight(part); var seq = ++hl; X.wait(3.2).then(function () { if (seq === hl && fetus) fetus.highlight(null); });
    if (partTag) partTag.remove(); var name = MD.parts[part].toUpperCase();
    partTag = X.tag(name, function () { return hit.point.clone().add(V(0, 0.6, 0.4)); }, 'part', 3200);
    X.toast(MD.right.fetusPart, { type: 'info', ms: 5200 }); L.applyPart(state, part); X.refresh(); return true;
  });
  X.panelHooks.push(function (stack) {                               // which parts have been seen
    if (state.phase !== PH.fetus) return;
    stack.appendChild(el('div', { class: 'panel-card' }, el('div', { class: 'marks' }, L.PARTS.map(function (p) { return el('span', { class: 'mark-chip ' + (state.fetusParts[p] ? 'done' : 'locked'), text: MD.parts[p].toUpperCase() + (state.fetusParts[p] ? ' ✓' : '') }); }))));
  });
  X.grow = { womb: function () { return womb; }, fetus: function () { return fetus; } };
});
