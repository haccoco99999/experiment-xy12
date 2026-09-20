/* Experiment 7, part "nhộng": the magnifier on the pupa (md 21–22), the button "[ MẶT CẮT 3D ]" (23): the case turns see-through and four glowing dots show the
   parts forming inside (24–26); the button "TUA NHANH THỜI GIAN VŨ HÓA" runs day 18 → 28: the case darkens, turns clear, cracks, and the new butterfly crawls out,
   pumps up its wings, dries them and flies to the branch (27–29). Then the sorting starts (exp7-finale.js). */
(Lab.exp7mods = Lab.exp7mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, UI = X.UI, state = X.state, V = X.V, Mo = X.Mo;
  var DOT = { wing: V(0.32, -0.3, 0.12), eye: V(0.24, -0.82, 0.2), leg: V(0.22, -0.56, 0.22), proboscis: V(-0.22, -0.68, 0.25) };        // where the glowing dots sit (spread apart)
  var dots = {}, partTag = null, cutTag = null, hl = 0, downAt = null;

  function pupaShot(w) { var p = X.pupa.group.position; return { cx: p.x, cy: p.y - 0.55, cz: p.z, w: w, h: w * 0.72, pitch: 0.1, fov: 34 }; }
  X.targets.pupa = function () { if (!X.pupa) return null; var p = X.pupa.group.position; return new T.Box3(V(p.x - 0.5, p.y - 1.2, p.z - 0.5), V(p.x + 0.5, p.y + 0.2, p.z + 0.5)); };

  /* ---------------- the magnifier on the pupa ---------------- */
  X.lensHooks.pupa = function (action) {
    if (action !== 'lensPupa') return;
    X.shot(pupaShot(2.4), 1000); Lab.fx.sparkles(X.scene, X.pupaPoint(), 0xc8f08a, 10);
    L.arriveDay(state, 18); X.day(18); Lab.audio.play('ok'); X.toast(MD.right.pupaStill, { type: 'info', ms: 6500 });
  };

  /* ---------------- the buttons ---------------- */
  X.panelHooks.push(function (stack) {
    if (state.pupaFormed && !state.cutaway) stack.appendChild(X.button(MD.buttons.cut, 'btn-blue', cut, !L.canCutaway(state)));
    if (state.cutaway && !state.metamorphosis) stack.appendChild(X.button(MD.buttons.emerge, 'btn-orange', emerge, !L.canMetamorph(state)));
  });

  /* ---------------- the 3D cut (md 23–26) ---------------- */
  async function cut() {
    if (!L.openCutaway(state)) return;
    X.closeLens(); Lab.audio.play('click'); X.busy++; X.refresh(); X.shot(pupaShot(1.7), 1000);
    await Lab.tween.value(1.0, function (k) { X.pupa.setGlass(k); }, { ease: 'inOutQuad' }).promise;
    cutTag = X.tag(MD.labels.cut, function () { return X.pupa.world(V(0, 0.45, 0.35)); }, 'part');
    L.PARTS.forEach(function (p) {
      dots[p] = X.tag('', function () { return X.pupa.world(DOT[p]); }, 'hot next', 0, { html: '<span class="hotdot"></span>', onClick: function () { X.touch(); tapPart(p); } });
    });
    X.toast(APP.tapDots, { type: 'info', ms: 6000 }); X.busy--; X.refresh();
  }
  function tapPart(p) {
    if (X.busy) return;
    var r = L.decidePart(state, p);
    if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } return; }
    Lab.audio.play('click'); X.pupa.highlight(p);
    if (partTag) partTag.remove(); partTag = X.tag(MD.parts[p], function () { return X.pupa.world(X.pupa.at[p]).add(V(0, 0.32, 0.25)); }, 'part');
    var seq = ++hl; X.wait(3.2).then(function () { if (seq === hl && !state.metamorphosis) X.pupa.highlight(null); });
    if (!r.again) {
      var res = L.applyPart(state, p); dots[p].el.classList.remove('next'); dots[p].el.classList.add('done');
      if (res.done) { Lab.audio.play('step'); Lab.fx.sparkles(X.scene, X.pupaPoint(), 0xffe066, 12); }
    }
    X.refresh();
  }
  function onCanvasDown(e) { downAt = { x: e.clientX, y: e.clientY }; }
  function onCanvasUp(e) {                                           // a click elsewhere: the md sentence
    if (!state.cutaway || state.cutawayObserved || X.busy || !downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8) return;
    tapPart(null);
  }
  Lab.stage.canvas.addEventListener('pointerdown', onCanvasDown); Lab.stage.canvas.addEventListener('pointerup', onCanvasUp);
  X.disposers.push(function () { Lab.stage.canvas.removeEventListener('pointerdown', onCanvasDown); Lab.stage.canvas.removeEventListener('pointerup', onCanvasUp); });
  function clearDots() { Object.keys(dots).forEach(function (p) { dots[p].remove(); }); dots = {}; if (partTag) { partTag.remove(); partTag = null; } if (cutTag) { cutTag.remove(); cutTag = null; } }

  /* ---------------- emergence: day 18 → 28 (md 27–29) ---------------- */
  async function emerge() {
    if (!L.startMetamorphosis(state)) return;
    clearDots(); X.pupa.highlight(null); Lab.audio.play('click'); X.busy++; X.refresh(); X.shot(pupaShot(2.2), 900);
    var pu = X.pupa, hang = pu.group.position.clone();
    await Lab.tween.value(0.8, function (k) { pu.setGlass(1 - k); }, { ease: 'inOutQuad' }).promise;              // the pupa closes again
    Lab.tween.value(3.2, function (k) { pu.setLook(k); }, { ease: Lab.tween.ease.linear });                           // the case turns dark
    X.toast(MD.right.emerging, { type: 'info', ms: 6500 }); await X.wait(2.6);
    pu.parts.wing.meshes.forEach(function (m) { m.scale.set(1.7, 1.25, 1); m.material.color.setHex(0xff8a1f); });
    await Lab.tween.value(1.6, function (k) { pu.setGlass(k); }, { ease: 'inOutQuad' }).promise;                    // it turns clear: the butterfly shows inside
    await X.wait(1.2); X.day(28);
    await Lab.tween.value(1.3, function (k) { pu.setCrack(k); pu.group.rotation.z = Math.sin(k * 40) * 0.03 * k; }, { ease: Lab.tween.ease.linear }).promise;    // the case cracks
    pu.group.rotation.z = 0; pu.setEmpty(true); Lab.audio.play('pop');
    var b = X.newButterfly('male'), g = b.group, spot = V(hang.x + 0.3, hang.y - 0.85, hang.z + 0.2);
    g.rotation.set(0, Math.PI / 2, Math.PI / 2); g.position.set(hang.x, hang.y - 0.8, hang.z + 0.15); b.mode = 'hold'; b.hold = 1.15; b.setWingSize(0.28);         // wet and crumpled, it cannot fly yet
    await Lab.tween.to(g.position, { x: spot.x, y: spot.y, z: spot.z }, 1.6, { ease: 'inOutCubic' }).promise;
    X.tag(MD.labels.adult, function () { return g.position.clone().add(V(0, 0.9, 0.2)); }, 'part', 6800);
    await Lab.tween.value(3.6, function (k) { b.setWingSize(0.28 + 0.72 * k); b.hold = 1.15 - 0.6 * k; }, { ease: 'inOutQuad' }).promise;                    // the wings expand
    await X.wait(0.9); await Lab.tween.value(1.2, function (k) { b.hold = 0.55 - 0.45 * k; }, { ease: 'inOutQuad' }).promise;                                  // dry, then spread wide
    X.toast(MD.right.adult, { type: 'ok', ms: 8000 }); Lab.audio.play('step'); Lab.fx.sparkles(X.scene, g.position.clone(), 0xffe066, 14);
    await X.wait(2.2);
    L.applyAdult(state); b.mode = 'fly';
    await X.fly(b, [g.position.clone(), g.position.clone().add(V(-1.2, 0.5, 0.8)), X.spot.perch(0.9).add(V(0, 0.2, 0.3)), X.spot.perch(0.9)], 3.2, 'perch');
    g.rotation.set(0, Math.PI, 0); X.busy--; X.refresh(); if (X.startSort) X.startSort();
  }
});
