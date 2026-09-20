/* Experiment 4, part "trao đổi nước, thức ăn và chất thải": the food tray and the water bowl (the rat walks over, eats and drinks),
   a short time passes, then the see-through rat shows the waste and the urine, which the student drags out or taps
   (md sections 24–37; strictly in the order food → water → waste → urine). */
(Lab.exp4mods = Lab.exp4mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, Mo = X.Mo, state = X.state, scene = X.scene, env = X.env;
  var SPOT = { food: new T.Vector3(-2.3, 0, 0.95), water: new T.Vector3(-2.3, 0, -0.3) };
  var PATCH = { waste: new T.Vector3(2.4, 0.012, 1.4), urine: new T.Vector3(1.1, 0.012, 1.4) };
  var SIDE = { x: 0.35, z: 0.3 };                                          // where the rat stands when we look inside it
  var excr = { waste: null, urine: null }, patches = [], patched = {};
  X.items = { food: null, water: null };

  /* where the rat stops so that its head is over the tray or the bowl (measured from the rat's own position) */
  function stopPoint(spot, gap) {
    var p = X.rat.group.position, d = new T.Vector3(p.x - spot.x, 0, p.z - spot.z);
    if (d.length() < 0.01) d.set(1, 0, 0);
    d.normalize(); return { x: spot.x + d.x * gap, z: spot.z + d.z * gap };
  }

  /* the tray or the bowl lands next to the rat, the rat walks over and eats or drinks (md sections 25–28, 56–57) */
  async function serve(kind) {
    var rat = X.rat, seq = X.seq, eating = kind === 'food', spot = SPOT[kind];
    var item = X.items[kind] = eating ? Mo.foodTray() : Mo.waterBowl();
    item.position.set(spot.x, 4.2, spot.z); scene.add(item); X.busy++;
    try {
      await Lab.tween.to(item.position, { y: 0 }, 0.7, { ease: 'outBounce' }).promise;
      Lab.audio.play('ok'); Lab.fx.ringPulse(scene, spot, 0x4caf50, 1.4);
      if (!(await X.ratGoto(stopPoint(spot, eating ? 1.6 : 1.45), spot))) return false;
      if (eating) X.tag(MD.right.food.anim, function () { return rat.world(new T.Vector3(0, 1.4, 1.3)); }, 'arrow', 3800);
      rat.pose.head = 1; rat.pose.chew = eating ? 1 : 0.4;
      var part = item.children.filter(function (c) { return eating ? c.isInstancedMesh : c.geometry && c.geometry.type === 'CircleGeometry'; })[0], y0 = part ? part.position.y : 0;
      if (part) Lab.tween.value(3.2, function (k) {                            // the pile gets lower / the water level drops a little
        if (eating) part.scale.y = 1 - 0.75 * k; else { part.position.y = y0 - 0.03 * k; part.scale.set(1 - 0.36 * k, 1 - 0.36 * k, 1); }
      }, { ease: Lab.tween.ease.linear });
      await Lab.tween.wait(3.4).promise;
      if (seq !== X.seq) return false;
      X.toast(MD.right[kind].text, { type: 'ok', ms: 5600 }); Lab.audio.play('step');
      return true;
    } finally { rat.pose.head = 0; rat.pose.chew = 0; X.busy--; }
  }
  async function food() { if (await serve('food')) X.refresh(); }
  async function water() { if (await serve('water')) { X.refresh(); await digest(); } }

  /* "MỘT KHOẢNG THỜI GIAN SAU..." (md section 30): time passes, the light changes, the rat rests, then the waste step opens */
  async function digest() {
    var seq = X.seq; X.busy++;
    try {
      X.UI.caption(MD.wfw.later, { ms: 2800, cls: 'day' });
      Lab.tween.value(3.6, function (k) { env.setDay(1 - 0.5 * Math.abs(Math.sin(k * Math.PI * 3))); }, { ease: Lab.tween.ease.linear });
      var ahead = { x: X.POS.x + Math.sin(X.HEADING) * 3, z: X.POS.z + Math.cos(X.HEADING) * 3 };
      await X.ratGoto({ x: X.POS.x, z: X.POS.z }, ahead, 1.4);
      await Lab.tween.wait(2.4).promise;
      env.setDay(1);
      if (seq !== X.seq) return;
    } finally { X.busy--; }
    L.markDigested(state); X.refresh();
    showExcretion(L.wfwStep(state));
  }

  /* ---------------- waste and urine ---------------- */
  function patch(kind) {
    var p = PATCH[kind], disc = new T.Mesh(new T.CircleGeometry(0.62, 40), new T.MeshBasicMaterial({ color: kind === 'waste' ? 0xd9b38c : 0xfff2a8, transparent: true, opacity: 0.55, depthWrite: false, fog: false }));
    disc.rotation.x = -Math.PI / 2; disc.position.copy(p); disc.renderOrder = 2; disc.userData.noPick = true; scene.add(disc);
    var tag = X.tag(kind === 'waste' ? MD.wfw.wasteArea : MD.wfw.urineLabel, p.clone().add(new T.Vector3(0, 0.5, 0)), 'part');
    patches.push({ remove: function () { X.dispose(disc); tag.remove(); } });
  }
  function ensurePatch(kind) { if (!patched[kind]) { patched[kind] = true; patch(kind); } }         // the area appears when its step opens (md sections 31 and 34)
  function makeObject(kind, at) {
    var g = new T.Group(), R = X.U.rng(3), i;
    if (kind === 'waste') {
      for (i = 0; i < 4; i++) {
        var b = new T.Mesh(new T.SphereGeometry(1, 10, 8), Lab.mat.std(0x6b4a2b, { roughness: 0.7 }));
        b.scale.set(0.17, 0.1, 0.11); b.position.set((R() - 0.5) * 0.36, (R() - 0.5) * 0.1, (R() - 0.5) * 0.3); b.rotation.y = R() * 3; g.add(b);
      }
    } else g.add(new T.Mesh(new T.SphereGeometry(0.17, 16, 12), Lab.mat.std(0xffe066, { roughness: 0.1, transparent: true, opacity: 0.95, emissive: 0xffc800, emissiveIntensity: 0.5 })));
    var halo = new T.Sprite(new T.SpriteMaterial({ map: Lab.mat.tex.glow(), color: kind === 'waste' ? 0xffb066 : 0xffef80, transparent: true, opacity: 0.7, depthWrite: false, fog: false }));
    halo.scale.setScalar(1.8); halo.renderOrder = 9; g.add(halo); g.userData.halo = halo;
    var hit = new T.Mesh(new T.SphereGeometry(0.3, 8, 6), new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));   // a bigger invisible target for a tap
    g.add(hit);
    g.position.copy(at); g.userData.pick = kind; scene.add(g); return g;
  }
  async function showExcretion(kind) {
    if (kind !== 'waste' && kind !== 'urine') return;
    var rat = X.rat, seq;
    if (X.mode !== 'waste') {                                               // turn the rat side on and make it see-through
      X.go('waste'); seq = X.seq;
      Lab.tween.to(rat.group.position, { x: SIDE.x, z: SIDE.z }, 0.9); Lab.tween.to(rat.group.rotation, { y: X.near(rat.group.rotation.y, -Math.PI / 2) }, 0.9);
      Lab.tween.value(1.2, function (k) { rat.setXray(0.85 * k); });
      X.busy++; await Lab.tween.wait(1.0).promise; X.busy--;
      if (seq !== X.seq) return;
    }
    ensurePatch('waste'); if (kind === 'urine') ensurePatch('urine');
    if (excr[kind]) return;
    var obj = makeObject(kind, new T.Vector3(SIDE.x + (kind === 'waste' ? 0.78 : 0.62), kind === 'waste' ? 0.4 : 0.36, SIDE.z));
    obj.scale.setScalar(0.01); Lab.tween.to(obj.scale, { x: 1, y: 1, z: 1 }, 0.5, { ease: 'outBack' });
    var it = excr[kind] = {
      object: obj, radius: 60, home0: obj.position.clone(), out: false, home: function () { return it.home0; }, region: function () { return 'body'; },
      enabled: function () { return L.wfwStep(state) === kind && !X.busy; },
      onStart: X.showBodyZone, onEnd: X.hideBodyZone,
      onDrop: function (item, info) {
        var region = X.regionOf(info.client.x, info.client.y);
        if (region === 'off') return { ok: false };
        if (region === 'body') { var r = L.decideExcrete(state, kind, 'in'); if (r.msg) X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); return { ok: false }; }
        excrete(kind, 'out'); return { ok: true };
      }
    };
    Lab.sceneDrag.add(it);
    it.stopPulse = Lab.loop.add(function (dt, time) { obj.userData.halo.material.opacity = it.state === 'idle' ? 0.55 + 0.3 * Math.sin(time * 4) : 0.3; }, { ambient: true });
    if (kind === 'waste') X.toast(APP.tapWaste, { type: 'info', ms: 5200 });
    X.refresh();
  }
  async function excrete(kind, action) {
    var it = excr[kind]; if (!it || it.out) return false;
    var r = L.decideExcrete(state, kind, action);
    if (!r.ok) { if (r.msg) X.toast(X.msgFor(r.msg), { type: 'warn' }); return false; }
    var res = L.applyExcrete(state, kind), seq = X.seq;
    X.busy++; it.state = 'busy'; Lab.audio.play('pop');
    var from = it.object.position.clone(), to = PATCH[kind].clone(); to.y = 0.12;
    X.tag(kind === 'waste' ? MD.result.outFlows[1] : MD.result.outFlows[2], new T.Vector3(1.9, 1.25, 0.6), 'arrow', 5600);
    X.toast(MD.right[kind].text, { type: 'ok', ms: 5600 });
    await Lab.tween.value(1.4, function (k) { it.object.position.set(from.x + (to.x - from.x) * k, from.y + (to.y - from.y) * k + Math.sin(k * Math.PI) * 0.7, from.z + (to.z - from.z) * k); }, { ease: 'inOutQuad' }).promise;
    Lab.fx.ringPulse(scene, new T.Vector3(to.x, 0.02, to.z), kind === 'waste' ? 0xd9b38c : 0xffd400, 1.2);
    it.out = true; it.object.userData.pick = null; it.object.userData.halo.visible = false;   // it stays on the floor, no longer a target
    if (kind === 'urine') it.object.children[0].scale.set(1.5, 0.28, 1.5);                    // a little puddle
    it.stopPulse(); Lab.sceneDrag.remove(it); X.busy--;
    if (seq !== X.seq) return true;
    if (!res.wfwDone) { showExcretion('urine'); X.refresh(); return true; }
    Lab.audio.play('step'); X.rat.setXray(0); X.note = MD.wfw.done;
    X.toast(MD.wfw.text, { type: 'ok', ms: 7000 });
    if (!state.airDone) { X.highlight = 'air'; X.toast(APP.nextAir, { type: 'info', ms: 6000 }); }
    X.refresh();
    if (res.finished) X.finale.begin();
    return true;
  }

  X.leaveHooks.push(function () {
    ['waste', 'urine'].forEach(function (k) {                               // what was thrown out stays on the floor; the rest goes away
      var it = excr[k]; if (!it || it.out) return;
      it.stopPulse(); Lab.sceneDrag.remove(it); X.dispose(it.object); excr[k] = null;
    });
    patches.forEach(function (p) { p.remove(); }); patches.length = 0; patched = {};
  });
  X.wfw = {
    food: food, water: water, excrete: excrete,
    pending: function () { var s = L.wfwStep(state); return (s === 'waste' || s === 'urine') && excr[s] && !excr[s].out ? s : null; },
    isNear: function (kind, point) { return excr[kind].object.getWorldPosition(new T.Vector3()).distanceTo(point) < 0.8; },
    enter: function () {
      var step = L.wfwStep(state);
      if (state.wfwDone) { X.go('overview'); X.toast(APP.alreadyDone, { type: 'info' }); return; }
      X.toast(MD.wfw.intro, { type: 'info', ms: 6500 });
      if (step === 'waste' || step === 'urine') showExcretion(step);
      else { X.go('overview'); if (step === 'digest') digest(); }
    }
  };
});
