/* Experiment 4, part "trao đổi nước, thức ăn và chất thải": the food tray and the water bowl (the rat walks over, eats and drinks),
   a short time passes, then four lines about the inside of the body appear and the rat gets rid of its waste and urine by itself
   (md sections 24–37, changed at the user's request on 2026-11-10; strictly in the order food → water → waste → urine). */
(Lab.exp4mods = Lab.exp4mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, Mo = X.Mo, state = X.state, scene = X.scene, env = X.env;
  var SPOT = { food: new T.Vector3(-2.3, 0, 0.95), water: new T.Vector3(-2.3, 0, -0.3) };
  var patches = [];
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
    autoExcrete();
  }

  /* ---------------- waste and urine: they come out by themselves ----------------
     The user asked on 2026-11-10 to drop the see-through belly and the dragging of the waste and the urine. After the time has passed,
     four lines appear one by one (APP.bodyFlows), the rat leaves its droppings behind it, then a little urine. */
  var flowCount = 0;                                                       // how many of the four lines are on screen
  X.bodyFlows = function () { return flowCount; };
  function behind(x, z) { return X.rat.world(new T.Vector3(x, 0, z)); }  // a point on the floor behind the rat (it faces +z)
  function patch(kind, at) {
    var disc = new T.Mesh(new T.CircleGeometry(0.42, 40), new T.MeshBasicMaterial({ color: kind === 'waste' ? 0xd9b38c : 0xfff2a8, transparent: true, opacity: 0.5, depthWrite: false, fog: false }));
    disc.rotation.x = -Math.PI / 2; disc.position.set(at.x, 0.012, at.z); disc.renderOrder = 2; disc.userData.noPick = true; scene.add(disc);
    var tag = X.tag(kind === 'waste' ? MD.wfw.wasteArea : MD.wfw.urineLabel, at.clone().add(new T.Vector3(0, kind === 'waste' ? 0.55 : 1.05, 0)), 'part');
    patches.push({ remove: function () { X.dispose(disc); tag.remove(); } });
  }
  function makeObject(kind, at) {
    var g = new T.Group(), R = X.U.rng(3), i;
    if (kind === 'waste') {
      for (i = 0; i < 4; i++) {
        var b = new T.Mesh(new T.SphereGeometry(1, 10, 8), Lab.mat.std(0x6b4a2b, { roughness: 0.7 }));
        b.scale.set(0.12, 0.07, 0.08); b.position.set((R() - 0.5) * 0.3, 0, (R() - 0.5) * 0.24); b.rotation.y = R() * 3; g.add(b);
      }
    } else g.add(new T.Mesh(new T.SphereGeometry(0.13, 16, 12), Lab.mat.std(0xffe066, { roughness: 0.1, transparent: true, opacity: 0.9, emissive: 0xffc800, emissiveIntensity: 0.35 })));
    g.position.copy(at); scene.add(g); return g;
  }
  async function showLine(i, seq) {
    flowCount = Math.max(flowCount, i + 1); X.refresh(); Lab.audio.play('pop');
    await Lab.tween.wait(2.6).promise;
    return seq === X.seq;
  }
  async function dropOut(kind, seq) {
    var floor = kind === 'waste' ? behind(0.6, -1.25) : behind(-0.6, -1.05), from = X.rat.world(new T.Vector3(0, 0.32, -0.95));
    patch(kind, floor);
    var obj = makeObject(kind, from); obj.scale.setScalar(0.01);
    Lab.tween.to(obj.scale, { x: 1, y: 1, z: 1 }, 0.35, { ease: 'outBack' });
    var to = floor.clone(); to.y = kind === 'waste' ? 0.06 : 0.03;
    await Lab.tween.value(0.9, function (k) { obj.position.set(from.x + (to.x - from.x) * k, from.y + (to.y - from.y) * k, from.z + (to.z - from.z) * k); }, { ease: 'inQuad' }).promise;
    if (kind === 'urine') Lab.tween.to(obj.children[0].scale, { x: 2.4, y: 0.25, z: 2.4 }, 0.6, { ease: 'outQuad' });   // a little puddle
    Lab.fx.ringPulse(scene, new T.Vector3(to.x, 0.02, to.z), kind === 'waste' ? 0xd9b38c : 0xffd400, 1.0);
    X.tag(kind === 'waste' ? MD.result.outFlows[1] : MD.result.outFlows[2], new T.Vector3(0.6, 1.9, 0.6), 'arrow', 5000);
    var r = L.decideExcrete(state, kind, 'out'), res = r.ok ? L.applyExcrete(state, kind) : { wfwDone: false, finished: false };
    X.refresh();
    await Lab.tween.wait(1.6).promise;
    return seq === X.seq ? res : null;
  }
  var running = false;
  async function autoExcrete() {
    if (running) return;
    var seq = X.seq, res = null; running = true; X.busy++;
    try {
      for (var i = 0; i < 3; i++) if (!(await showLine(i, seq))) return;   // food, air, carbon dioxide
      if (!(await dropOut('waste', seq))) return;
      if (!(await showLine(3, seq))) return;                               // kidneys and urine
      res = await dropOut('urine', seq);
    } finally { running = false; X.busy--; }
    if (!res || !res.wfwDone) { X.refresh(); return; }
    Lab.audio.play('step'); X.note = MD.wfw.done;
    X.toast(MD.wfw.text, { type: 'ok', ms: 7000 });
    if (!state.airDone) { X.highlight = 'air'; X.toast(APP.nextAir, { type: 'info', ms: 6000 }); }
    X.refresh();
    if (res.finished) X.finale.begin();
  }

  X.leaveHooks.push(function () { patches.forEach(function (p) { p.remove(); }); patches.length = 0; });
  X.wfw = {
    food: food, water: water,
    enter: function () {
      var step = L.wfwStep(state);
      if (state.wfwDone) { X.go('overview'); X.toast(APP.alreadyDone, { type: 'info' }); return; }
      X.toast(MD.wfw.intro, { type: 'info', ms: 6500 });
      X.go('overview');
      if (step === 'digest') digest(); else if (step === 'waste' || step === 'urine') autoExcrete();
    }
  };
});
