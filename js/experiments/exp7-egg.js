/* Experiment 7, part "trứng": the magnifier (eggs, larva and pupa all use it, md 12–13, 15, 21), the button "CHUYỂN SANG GIAI ĐOẠN NỞ" (14):
   day 3 the eggs turn dark grey, day 7 the shells crack and the caterpillar crawls round the leaf edge to the top of the leaf.
   Also here: the caterpillar object `X.larva` and `X.walk`, which moves it along a path (used by exp7-larva.js too). */
(Lab.exp7mods = Lab.exp7mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, UI = X.UI, state = X.state, V = X.V, Mo = X.Mo;
  X.LEN = [0.3, 0.55, 0.85, 1.2, 1.55];                              // how long the caterpillar looks after hatching, each moult and when it is big enough (L.LENGTH_MM has the real numbers)
  X.larva = null;

  /* ---------------- where the magnifier and the leaf and the ruler can be dropped ---------------- */
  X.targets.eggs = function () { var e = X.spot.egg; return X.eggs ? new T.Box3(V(e.x - 0.5, e.y - 0.55, e.z - 0.5), V(e.x + 0.5, e.y + 0.2, e.z + 0.5)) : null; };
  X.targets.larva = function () {
    if (!X.larva || state.pupaFormed) return null;
    var p = X.larva.g.position, s = X.larva.size; return new T.Box3(V(p.x - 0.45 - 0.5 * s, p.y - 0.3, p.z - 0.45 - 0.2 * s), V(p.x + 0.45 + 0.5 * s, p.y + 0.5, p.z + 0.45 + 0.2 * s));
  };
  X.ticks.push(function (dt, time) { var lv = X.larva; if (lv && lv.g.visible) lv.api.pose(time, lv.moving, lv.jk); });

  /* ---------------- the caterpillar walks along a path; `upFn(k)` says which way its back points ---------------- */
  var m4 = new T.Matrix4(), ax = new T.Vector3(), ay = new T.Vector3(), az = new T.Vector3(), au = new T.Vector3();
  X.walk = function (pts, secs, upFn, ease) {
    var lv = X.larva, clean = [pts[0]];
    for (var i = 1; i < pts.length; i++) if (pts[i].distanceTo(clean[clean.length - 1]) > 0.03) clean.push(pts[i]);     // points that (nearly) coincide would break the curve
    if (clean.length < 2) clean.push(clean[0].clone().add(V(0.05, 0, 0)));
    var curve = new T.CatmullRomCurve3(clean, false, 'centripetal'); lv.moving = true;
    return Lab.tween.value(secs, function (k) {
      var p = curve.getPoint(k), t = curve.getTangent(k);
      au.copy(upFn ? upFn(k) : V(0, 1, 0)); if (Math.abs(t.dot(au)) > 0.95) au.set(0, 0, 1);
      ay.copy(au).addScaledVector(t, -t.dot(au)).normalize(); az.crossVectors(t, ay); ax.copy(t);
      m4.makeBasis(ax, ay, az); lv.g.quaternion.setFromRotationMatrix(m4); lv.g.position.copy(p);
    }, { ease: ease || Lab.tween.ease.inOutSine }).promise.then(function () { lv.moving = false; });
  };
  X.newLarva = function (size) {
    var lv = X.larva = { api: Mo.larva(), size: size, moving: false, jk: 0 }; lv.g = lv.api.group; lv.api.setSize(size); X.scene.add(lv.g); return lv;
  };

  /* ---------------- the magnifier ---------------- */
  function clearLensTag() { if (X.lensTag) { X.lensTag.remove(); X.lensTag = null; } }
  X.closeLens = function () { Lab.lens.hide(); clearLensTag(); };
  X.pupaPoint = function () { return X.pupa ? X.pupa.world(V(0, -0.5, 0)) : V(0, 0, 0); };
  X.drops.lens = function (id, zid) {
    if (X.busy) return { ok: false, message: APP.busy };
    var t = zid === 'eggs' || zid === 'larva' || zid === 'pupa' ? zid : null, r = L.decideLens(state, t);
    if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
    L.applyLens(state, r.action); showLens(r.target, r.action); return { ok: true };
  };
  function showLens(target, action) {
    var pt = target === 'eggs' ? function () { return X.spot.egg.clone().add(V(0, -0.1, 0)); } : target === 'larva' ? function () { return X.larva.g.position.clone().add(V(0, 0.1 * X.larva.size, 0)); } : X.pupaPoint;
    var name = MD.labels[target === 'eggs' ? 'eggsLens' : target];
    Lab.audio.play('pop'); clearLensTag();
    Lab.lens.show({ world: pt, radius: 130, viewSize: target === 'eggs' ? 0.7 : target === 'larva' ? 0.9 + X.larva.size : 1.3, distance: 2.6, onClose: function () { clearLensTag(); X.refresh(); } });
    X.lensTag = X.tag(name, function () { return pt().add(V(0, 0.8, 0.3)); }, 'part');
    if (action === 'lensEggs') { Lab.audio.play('ok'); X.toast(MD.right.eggsLens, { type: 'ok', ms: 5600 }); } else X.toast(APP.lensOn, { type: 'info', ms: 3600 });
    if (X.lensHooks[target]) X.lensHooks[target](action);
    X.refresh();
  }

  /* ---------------- the button "▶ CHUYỂN SANG GIAI ĐOẠN NỞ": day 3 → day 7 ---------------- */
  X.panelHooks.push(function (stack) {
    if (state.eggLaid && !state.hatching && !state.larvaAppeared) stack.appendChild(X.button(MD.buttons.hatch, 'btn-orange', hatch, !L.canHatch(state)));
  });
  async function hatch() {
    if (!L.startHatching(state)) return;
    X.closeLens(); Lab.audio.play('click'); X.busy++; X.note = null; X.refresh(); X.shot('under', 900); X.day(3);
    await Lab.tween.value(2.2, function (k) { X.eggs.setDark(k); }, { ease: 'inOutQuad' }).promise;
    L.arriveDay(state, 3); X.toast(MD.right.eggsGrow, { type: 'info', ms: 5600 }); X.refresh();
    await X.wait(1.8); X.day(7);
    await Lab.tween.value(1.5, function (k) { X.eggs.setCrack(k); }, { ease: 'inOutQuad' }).promise;
    hatchOut();
  }
  async function hatchOut() {
    var e = X.spot.egg, lv = X.newLarva(X.LEN[0]), under = function (k) { var a = Math.PI * Math.min(1, Math.max(0, (k - 0.3) / 0.3)); return V(0, -Math.cos(a), Math.sin(a)); };
    lv.g.position.set(e.x + 0.05, e.y - 0.09, e.z); X.eggs.setHatched(true); Lab.audio.play('pop');
    Lab.fx.sparkles(X.scene, V(e.x, e.y - 0.2, e.z), 0xfff2a0, 8);
    var rest = X.spot.leafTop(0.42, 0.0);
    X.wait(2.6).then(function () { X.shot('leaf', 1800); });
    await X.walk([V(e.x + 0.05, e.y - 0.09, e.z), V(e.x + 0.07, e.y - 0.08, e.z + 0.12), V(e.x + 0.09, e.y - 0.05, 0.26), V(e.x + 0.08, e.y + 0.03, 0.31), V(e.x + 0.02, e.y + 0.1, 0.24), V(2.35, 1.72, 0.1), rest], 5.2, under);
    L.arriveDay(state, 7); Lab.audio.play('step');
    X.tag(MD.labels.larva, function () { return lv.g.position.clone().add(V(0, 0.55, 0.1)); }, 'part', 5200); X.toast(MD.right.larva, { type: 'info', ms: 7000 });
    X.busy--; X.refresh();
  }
});
