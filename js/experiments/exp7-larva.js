/* Experiment 7, part "sâu non": the fresh leaf dropped near the caterpillar (it turns, crawls to the edge and gnaws; the leaf gets bites) (md 15–16),
   then it grows by itself through three moults, each leaving the old skin behind (17–18), the ruler can be put next to it at any time (19),
   and when it is big enough it stops eating, climbs up the stem to the branch, hangs in a J shape and turns into a pupa (20). */
(Lab.exp7mods = Lab.exp7mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, UI = X.UI, state = X.state, V = X.V, Mo = X.Mo, PZ = X.PZ, el = X.U.el;
  var fresh = null, ruler = null, rulerTag = null, skins = [];
  var BASE = V(2.3, 1.8, PZ + 0.02), YAW = 0.3, LEAF = 1.3;                // the fresh leaf lies on the big leaf, its base here
  X.SHOTS.larva = { cx: 2.6, cy: 1.95, cz: PZ + 0.2, w: 3.8, h: 2.4, pitch: 0.5, fov: 34 };
  function edge(v) {                                                 // a point on the near edge of the fresh leaf (v = 0 base … 1 tip)
    var hw = LEAF * 0.5 * 0.5 * Math.pow(Math.sin(Math.PI * Math.pow(v, 0.72)), 0.85) + 0.03, x = v * LEAF, c = Math.cos(YAW), s = Math.sin(YAW);
    return V(BASE.x + x * c + hw * s, BASE.y + 0.04, BASE.z - x * s + hw * c);
  }
  function chomp(secs) { var h = X.larva.api.segs[0]; return Lab.tween.value(secs, function (k) { h.scale.setScalar(0.095 * (1 + 0.16 * Math.sin(k * secs * 26))); }, { ease: Lab.tween.ease.linear }).promise.then(function () { h.scale.setScalar(0.095); }); }

  /* ---------------- the tray card LÁ CÂY ---------------- */
  X.drops.leaf = function (id, zid) {
    if (X.busy || X.growing) return { ok: false, message: APP.busy };
    var r = L.decideLeaf(state, zid === 'larva');
    if (!r.ok) return { ok: false, message: r.msg ? X.msgFor(r.msg) : MD.msg.locked };
    feed(); return { ok: true };
  };
  async function eat(k1, secs) {                                     // the leaf is eaten up to k1 (0 … 1) while the caterpillar crawls along the edge
    var k0 = fresh.k, v0 = 0.3 + 0.5 * k0, v1 = 0.3 + 0.5 * k1;
    Lab.tween.value(secs, function (t) { fresh.piece.setBites(k0 + (k1 - k0) * t); }, { ease: Lab.tween.ease.linear }); chomp(secs);
    await X.walk([X.larva.g.position.clone(), edge(v0), edge((v0 + v1) / 2), edge(v1)], secs, null, Lab.tween.ease.linear); fresh.k = k1;
  }
  async function feed() {
    X.busy++; X.closeLens(); X.leafBusy = true; X.touch(); X.refresh(); X.shot('larva', 1000);
    var piece = Mo.leafPiece(LEAF, { bites: true, seed: 9 }); fresh = { piece: piece, k: 0 };
    piece.group.position.set(BASE.x, BASE.y + 2.4, BASE.z); piece.group.rotation.y = YAW; X.scene.add(piece.group); Lab.audio.play('pop');
    await Lab.tween.to(piece.group.position, { y: BASE.y }, 0.9, { ease: 'outBounce' }).promise;
    var lv = X.larva; X.toast(MD.right.eating, { type: 'info', ms: 5200 });
    await X.walk([lv.g.position.clone(), lv.g.position.clone().lerp(edge(0.3), 0.5).add(V(0, 0.08, 0)), edge(0.3)], 2.0);      // it turns to the leaf and crawls to it
    await eat(0.34, 3.2);
    L.applyFeed(state); Lab.audio.play('ok'); Lab.fx.sparkles(X.scene, lv.g.position.clone().add(V(0, 0.4, 0)), 0xffe066, 8);
    lv.api.setSize(lv.size = (X.LEN[0] + X.LEN[1]) / 2 * 0.8); X.busy--; X.growing = true; X.refresh(); growth();
  }

  /* ---------------- growing: eat, moult, eat, moult, eat, moult, then pupation ---------------- */
  async function growth() {
    for (var m = 1; m <= 3; m++) {
      await eat(0.34 + 0.15 * m, 1.8); await moult(m); X.refresh();
    }
    L.applyGrown(state); var s0 = X.larva.size;
    Lab.tween.value(1.6, function (k) { X.larva.size = s0 + (X.LEN[4] - s0) * k; X.larva.api.setSize(X.larva.size); }, { ease: 'inOutQuad' });
    await eat(0.95, 1.6); if (ruler) updateRuler(); pupate();
  }
  async function moult(m) {                                          // md 18: it stops, the old skin splits, it crawls out bigger, the old skin stays
    var lv = X.larva, g = lv.g, s0 = lv.size, s1 = X.LEN[m], pos = g.position.clone(), fwd = V(1, 0, 0).applyQuaternion(g.quaternion);
    X.tag(MD.labels.moult[m - 1], function () { return g.position.clone().add(V(0, 0.6 + 0.4 * lv.size, 0.1)); }, 'part', 4600);
    await X.wait(1.0);
    var skin = lv.api.skin(); X.scene.add(skin); skins.push(skin); Lab.audio.play('pop'); Lab.fx.sparkles(X.scene, pos.clone().add(V(0, 0.25, 0)), 0xffffff, 8);
    await Lab.tween.value(1.8, function (k) { lv.size = s0 + (s1 - s0) * k; lv.api.setSize(lv.size); g.position.copy(pos).addScaledVector(fwd, 0.3 * s0 * k); }, { ease: 'inOutCubic' }).promise;
    L.applyMolt(state); if (ruler) updateRuler();                     // the old skin stays where it was
  }

  /* ---------------- the ruler (md 19): it lies along the body and follows it, the length is written next to it ---------------- */
  X.drops.ruler = function (id, zid) {
    if (X.busy) return { ok: false, message: APP.busy };
    var r = L.decideRuler(state, zid === 'larva');
    if (!r.ok) return { ok: false, message: r.msg ? X.msgFor(r.msg) : MD.msg.locked };
    putRuler(); return { ok: true };
  };
  function updateRuler() { rulerTag.el.textContent = L.larvaLengthMm(state) + ' mm'; }
  function putRuler() {
    var lv = X.larva; ruler = Mo.ruler(); lv.g.add(ruler); ruler.position.set(0, 0.9, 0.25); X.rulerOn = true;
    Lab.tween.to(ruler.position, { y: 0.02 }, 0.7, { ease: 'outBounce' });
    rulerTag = X.tag('', function () { return lv.g.position.clone().add(V(0, 0.45 + 0.35 * lv.size, 0.45 * lv.size + 0.15)); }, 'part', 0, { onClick: function () { takeRuler(); X.refresh(); } });
    rulerTag.el.title = APP.rulerAway; updateRuler(); Lab.audio.play('ok'); X.toast(MD.right.length, { type: 'ok', ms: 5200 }); X.refresh();
  }
  function takeRuler() {
    if (!ruler) return; X.dispose(ruler); ruler = null; rulerTag.remove(); rulerTag = null; X.rulerOn = false;
  }
  X.panelHooks.push(function (stack) {
    if (!state.larvaFed || state.pupaFormed) return;
    var chips = MD.moultLine.map(function (t, i) { return el('span', { class: 'mark-chip ' + (i < state.molts ? 'done' : i === state.molts && X.growing ? 'active' : 'locked'), text: t }); });
    var card = el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.moultTitle }), el('div', { class: 'marks' }, chips));
    if (X.rulerOn) card.appendChild(el('div', { class: 'xd-chain' }, MD.growth.map(function (t) { return el('span', { class: 'xd-chip' }, [document.createTextNode(t)]); })
      .reduce(function (a, c, j) { a.push(c); if (j < MD.growth.length - 1) a.push(el('span', { class: 'xd-arr', text: '→' })); return a; }, [])));
    stack.appendChild(card);
  });

  /* ---------------- pupation (md 20) ---------------- */
  async function pupate() {
    var lv = X.larva, g = lv.g, size = X.LEN[4], hang = X.spot.hang(0.62), up = V(0, 1, 0);
    takeRuler(); X.refresh(); X.shot({ cx: 1.0, cy: 2.6, cz: PZ + 0.2, w: 4.6, h: 3.2, pitch: 0.3, fov: 34 }, 1600);
    var br = function (u, dy, dz) { return X.spot.perch(u).add(V(0, dy - 0.16, dz)); };
    await X.walk([g.position.clone(), V(1.1, 1.82, PZ + 0.2), V(0.55, 1.75, PZ + 0.16), V(0.16, 1.85, PZ + 0.22), V(0.1, 2.3, PZ + 0.24), V(0.1, 2.9, PZ + 0.24), V(0.3, 3.2, PZ + 0.16), br(0.3, 0.1, 0.02), br(0.6, 0.1, 0.0)], 8, function () { return up; });
    X.shot({ cx: hang.x, cy: hang.y - 0.4, cz: PZ, w: 3.2, h: 2.4, pitch: 0.14, fov: 34 }, 1200);
    var p0 = g.position.clone(), q0 = g.quaternion.clone(), p1 = V(hang.x + 0.5 * size, hang.y - 0.02, hang.z), q1 = new T.Quaternion();
    await Lab.tween.value(1.2, function (k) { g.position.lerpVectors(p0, p1, k); g.quaternion.copy(q0).slerp(q1, k); }, { ease: 'inOutQuad' }).promise;      // it swings under the branch
    await Lab.tween.value(1.6, function (k) { lv.jk = k; }, { ease: 'inOutCubic' }).promise;              // it hangs in a J shape
    await X.wait(0.6); Lab.audio.play('pop'); Lab.fx.sparkles(X.scene, V(hang.x, hang.y - 0.6, hang.z), 0xc8f08a, 12);
    X.pupa = Mo.pupa(); X.pupa.group.position.copy(hang); X.pupa.group.scale.setScalar(0.05); X.scene.add(X.pupa.group);
    g.visible = false;
    await Lab.tween.to(X.pupa.group.scale, { x: 1, y: 1, z: 1 }, 1.1, { ease: 'outBack' }).promise;
    X.dispose(g); X.larva = null;
    L.applyPupation(state); X.growing = false; X.day(14); Lab.audio.play('step');
    X.tag(MD.labels.pupa, function () { return X.pupa.world(V(0, 0.35, 0.3)); }, 'part', 5200); X.toast(MD.right.pupa, { type: 'ok', ms: 6500 }); X.refresh();
  }
});
