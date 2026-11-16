/* Experiment 8: the zygote develops into an embryo (day 0–35), then a fetus (day 45–110).
   Each timeline mark opens after the preceding mark is seen; the magnifier completes each observation. */
(Lab.exp8mods = Lab.exp8mods || []).push(function (X) {
  'use strict';
  var T = X.T, MD = X.MD, UI = X.UI, state = X.state, V = X.V, Mo = X.Mo, PH = X.PH;
  var CENTER = V(0, 1.5, 0), embryo = null, fetus = null, embTag = null;
  var EMBRYO_DAYS = [0, 21, 28, 35];
  function boxAt(p, r) { return new T.Box3(V(p.x - r, p.y - r, p.z - r), V(p.x + r, p.y + r, p.z + r)); }
  function embryoStage(t) {
    var i = Math.min(EMBRYO_DAYS.length - 2, Math.floor(t)), fraction = t - i;
    var day = EMBRYO_DAYS[i] + (EMBRYO_DAYS[i + 1] - EMBRYO_DAYS[i]) * fraction;
    return 3 * day / 35;
  }
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
      X.busy--; X.tlBegin('embryo', { t0: 0, apply: function (t) { embryo.setT(embryoStage(t)); }, arrive: function (i) { markInfo('embryo', i); if (i === MD.marks.embryo.length - 1 && !embTag) embTag = X.tag(MD.labels.embryo, V(0, 3.4, 0), 'place'); } });
      X.tlGo(0);
    });
  };
  X.targets.embryo = function () { return embryo && embryo.group.visible && state.phase === PH.embryo ? boxAt(CENTER, 1.5) : null; };
  X.lensPoint.embryo = function () { return CENTER.clone(); }; X.lensSize.embryo = 2.4;
  X.lensHooks.embryo = function (credit) {
    if (!credit) return;
    Lab.audio.play('ok'); X.busy++; embryo.setT(0);
    X.tween(2.8, function (k) { embryo.setT(3 * k); }, 'inOutCubic').then(function () {
      embryo.setT(3); Lab.fx.sparkles(X.scene, CENTER.clone(), 0xffe066, 12);
      X.toast(MD.markInfo.embryo[MD.marks.embryo.length - 1].msg, { type: 'ok', ms: 6000 }); X.busy--; X.refresh();
    });
  };

  /* ---------------- phase 6: embryo develops into a whole piglet (md 16) ---------------- */
  X.enter[PH.fetus] = function () {
    X.busy++; if (embTag) { embTag.remove(); embTag = null; }
    fetus = X.fetus = Mo.fetus(); fetus.group.position.copy(CENTER); fetus.group.visible = false; X.scene.add(fetus.group);
    X.tween(1.4, function (k) { embryo.group.scale.setScalar(Math.max(0.001, 1 - k)); }, 'inOutQuad').then(function () {
      embryo.group.visible = false; fetus.group.visible = true; Lab.audio.play('pop');
      return X.tween(0.9, function (k) { fetus.group.scale.setScalar(Math.max(0.001, 0.6 * k)); }, 'outCubic');
    }).then(function () {
      X.busy--; X.tlBegin('fetus', { t0: 0, apply: function (t) { fetus.setStage(2 * t / (MD.marks.fetus.length - 1)); }, arrive: function (i) { markInfo('fetus', i); } }); X.tlGo(0);
    });
  };
  X.targets.fetus = function () { return fetus && fetus.group.visible && state.phase === PH.fetus ? boxAt(CENTER, 1.7) : null; };
  X.lensPoint.fetus = function () { return CENTER.clone(); }; X.lensSize.fetus = 2.8;
  X.lensHooks.fetus = function (credit) {
    if (!credit) return;
    Lab.audio.play('ok'); Lab.fx.sparkles(X.scene, CENTER.clone(), 0xffe066, 12); X.toast(MD.markInfo.fetus[MD.marks.fetus.length - 1].msg, { type: 'ok', ms: 6500 });
  };
  X.grow = { fetus: function () { return fetus; } };
});
