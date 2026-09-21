/* Experiment 8, first half of the story (md sections VIII–XIV): put the male and the female cat on the table, start, click the right cat, then the picture changes to the
   "inside" backdrop: click the sperm and the egg and drag each to the right cat's area, drag one sperm to the big egg (fertilization), and look at the zygote with the glass. */
(Lab.exp8mods = Lab.exp8mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, UI = X.UI, state = X.state, V = X.V, Mo = X.Mo, PH = X.PH;
  var SPOT = { male: V(-1.9, 0, 0.6), female: V(1.9, 0, 0.6) }, YAW = { male: -0.9, female: -2.24 };           // on the table, facing each other and the student
  var cats = {}, rings = {}, tags = {}, show = {}, cell = { sperms: [], egg: null, items: [], areas: [] };
  var EGG_HOME = V(0.7, 1.15, 0), AREA = { male: V(-3.0, 2.1, 0.3), female: V(3.0, 2.1, 0.3) };
  function boxAt(p, r) { return new T.Box3(V(p.x - r, p.y - r, p.z - r), V(p.x + r, p.y + r, p.z + r)); }

  X.ticks.push(function (dt, time) {
    Object.keys(cats).forEach(function (k) { if (cats[k].group.visible) cats[k].update(time); });
    Object.keys(show).forEach(function (k) { if (show[k].group.visible) show[k].update(time); });
    cell.sperms.forEach(function (s) { if (s.group.visible) s.update(time); if (s.mode === 'swim' && s.item.state === 'idle') swim(s, time); });
  });
  function faceTo(g, from, to) {                                     // the nose (+x) looks at `to`
    var d = to.clone().sub(from), len = d.length() || 1; g.rotation.set(0, Math.atan2(-d.z, d.x), Math.asin(Math.max(-1, Math.min(1, d.y / len))));
  }
  function swim(s, time) {
    var b = s.base, a = s.ph, w = s.wob;
    s.group.position.set(b.x + Math.sin(time * 0.9 + a) * w, b.y + Math.sin(time * 1.3 + a * 2) * w * 0.7, b.z + Math.sin(time * 0.7 + a) * 0.15);
    if (s.target) faceTo(s.group, s.group.position, s.target); else s.group.rotation.set(0, 0, 0.25 * Math.cos(time * 1.3 + a * 2));
  }

  /* ---------------- place the cats (md 8, 9) ---------------- */
  Lab.drag.addZone({
    id: 'table', label: APP.zone, pad: 0, priority: 0, rect: function () { return Lab.stage.rectOf(new T.Box3(V(-4.6, 0, -2.3), V(4.6, 2.6, 2.4)), 0); },
    accepts: function (it) { return (it.id === 'male' && !state.malePlaced) || (it.id === 'female' && !state.femalePlaced); }
  });
  X.drops.male = X.drops.female = function (id, zid) {
    if (X.busy) return { ok: false, message: APP.busy };
    var r = L.decideCat(state, id, zid === 'table' ? 'table' : null);
    if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
    var res = L.applyCat(state, r.action); placeCat(id, res.ready); X.refresh(); return { ok: true };
  };
  function placeCat(sex, both) {
    X.busy++; Lab.audio.play('pop');
    var c = cats[sex] = Mo.cat({ sex: sex }), g = c.group, spot = SPOT[sex], from = V(sex === 'male' ? -6.5 : 6.5, 3.6, 1.6);
    g.position.copy(from); g.rotation.y = YAW[sex]; g.userData.pick = sex; X.scene.add(g);
    var ring = rings[sex] = new T.Mesh(new T.RingGeometry(0.95, 1.1, 40), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false, fog: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(spot.x, 0.012, spot.z); ring.userData.noPick = true; X.scene.add(ring);
    X.tween(1.1, function (k) { g.position.lerpVectors(from, spot, k); g.position.y = spot.y + Math.sin(k * Math.PI) * 1.4 * (1 - k); }, 'inOutQuad').then(function () {
      Lab.fx.ringPulse(X.scene, spot, 0x4caf50, 1.5); ring.material.color.setHex(0x6fe07a); Lab.audio.play('ok');
      X.toast(sex === 'male' ? MD.right.male : both ? MD.right.bothPlaced : MD.right.female, { type: 'ok', ms: 5200 }); X.busy--; X.refresh();
    });
  }
  X.showCatInfo = function (sex) {
    var I = MD.info; X.setInfo({ title: MD.tools[sex], rows: [I.species, [I.sex[0], I.sex[sex === 'male' ? 1 : 2]], I.stage, I.health] });
  };
  X.targets.male = function () { return cats.male && cats.male.group.visible ? boxAt(cats.male.group.position.clone().add(V(0, 0.7, 0)), 1.0) : show.male && show.male.group.visible ? boxAt(show.male.group.position.clone().add(V(0, 0.7, 0)), 1.0) : null; };
  X.targets.female = function () { return cats.female && cats.female.group.visible ? boxAt(cats.female.group.position.clone().add(V(0, 0.7, 0)), 1.0) : show.female && show.female.group.visible ? boxAt(show.female.group.position.clone().add(V(0, 0.7, 0)), 1.0) : null; };
  X.lensPoint.male = function () { var c = (cats.male && cats.male.group.visible ? cats.male : show.male).group; return c.position.clone().add(V(0, 0.75, 0)); };
  X.lensPoint.female = function () { var c = (cats.female && cats.female.group.visible ? cats.female : show.female).group; return c.position.clone().add(V(0, 0.75, 0)); };
  X.lensSize.male = X.lensSize.female = 2.4;

  /* ---------------- phase 1: identify (md 11) ---------------- */
  X.enter[PH.identify] = function () {
    X.shot('table', 900); X.toast(MD.right.intro, { type: 'info', ms: 7000 });
    Object.keys(rings).forEach(function (k) { rings[k].material.color.setHex(0xffffff); });
  };
  X.clicks.push(function (hit) {
    var id = hit && hit.id;
    if (state.phase === PH.identify) {
      var sex = id === 'male' || id === 'female' ? id : null, r = L.decideIdentify(state, sex);
      if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } return true; }
      L.applyIdentify(state, sex); Lab.audio.play('ok'); cats[sex].glow(true); Lab.fx.sparkles(X.scene, cats[sex].group.position.clone().add(V(0, 1.4, 0)), 0xffe066, 8);
      if (!tags[sex]) tags[sex] = X.tag(MD.labels[sex], function () { return cats[sex].group.position.clone().add(V(0, 1.85, 0)); }, 'place');
      X.toast(sex === 'male' ? MD.right.maleId : MD.right.femaleId, { type: 'ok', ms: 5600 }); X.showCatInfo(sex); return true;
    }
    if ((id === 'male' || id === 'female') && cats[id] && cats[id].group.visible) { X.showCatInfo(id); return true; }
    return false;
  });

  /* ---------------- phase 2: sperm and egg in the "inside" picture (md 12) ---------------- */
  function clearTable() {
    Object.keys(cats).forEach(function (k) { cats[k].group.visible = false; rings[k].visible = false; if (tags[k]) tags[k].setVisible(false); });
  }
  function observe(what) {
    var r = L.observeCell(state, what); if (!r.ok) return;
    Lab.audio.play('click'); var sperm = what === 'sperm';
    X.setInfo({ title: MD.labels[what], sub: MD.cellInfo[what], msg: sperm ? MD.right.spermInfo : MD.right.eggInfo });
    X.toast(sperm ? MD.right.spermInfo : MD.right.eggInfo, { type: 'info', ms: 5200 });
  }
  function makeSperm(base, target) {
    var sp = Mo.sperm(); sp.group.scale.setScalar(1.1); sp.group.position.copy(base); sp.group.userData.pick = 'sperm'; X.scene.add(sp.group);
    sp.base = base.clone(); sp.mode = 'swim'; sp.ph = Math.random() * 6.28; sp.wob = 0.3; sp.target = target || null; cell.sperms.push(sp); return sp;
  }
  function bindSperm(sp, o) {
    sp.item = Lab.sceneDrag.add({ id: 'sperm', object: sp.group, radius: 62, home: function () { return sp.base; }, enabled: function () { return o.enabled() && sp.mode === 'swim'; }, onStart: function () { sp.glow(true); if (o.onStart) o.onStart(sp); }, onEnd: function () { sp.glow(false); }, onDrop: function (it, info) { return o.onDrop(sp, info); } });
  }
  X.enter[PH.cells] = function () {
    X.busy++;
    X.fade(function () {
      clearTable(); X.setSet('inside'); X.shot('cells', 0);
      ['male', 'female'].forEach(function (sex) {
        var c = show[sex] = Mo.cat({ sex: sex }), x = sex === 'male' ? -3.7 : 3.7; c.group.position.set(x, 0, 0); c.group.rotation.y = sex === 'male' ? 0 : Math.PI; X.scene.add(c.group);
        var pad = new T.Mesh(new T.CircleGeometry(1.4, 40), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28, depthWrite: false, fog: false })); pad.rotation.x = -Math.PI / 2; pad.position.set(x, 0.01, 0.1); pad.userData.noPick = true; X.scene.add(pad); cell.areas.push(pad);
        cell.areas.push(X.tag(sex === 'male' ? APP.maleArea : APP.femaleArea, V(x, 2.45, 0), 'place'));
      });
      var dish = new T.Mesh(new T.CylinderGeometry(1.9, 1.9, 0.12, 40), M_clear()); dish.position.set(0, 0.06, 0); dish.userData.noPick = true; X.scene.add(dish); cell.areas.push(dish);
      var egg = cell.egg = Mo.egg(); egg.group.scale.setScalar(1.0); egg.group.position.copy(EGG_HOME); egg.group.userData.pick = 'egg'; X.scene.add(egg.group);
      egg.item = Lab.sceneDrag.add({
        id: 'egg', object: egg.group, radius: 80, home: function () { return EGG_HOME; }, enabled: function () { return state.phase === PH.cells && !state.eggPlaced && !X.busy; },
        onStart: function () { observe('egg'); }, onDrop: function (it, info) { return dropCell('egg', info); }
      });
      [[-1.1, 2.0], [-0.3, 2.4], [-1.4, 1.35], [-0.6, 1.4], [0.0, 1.85], [-1.2, 2.7]].forEach(function (p, i) {
        var sp = makeSperm(V(p[0], p[1], (i % 2 ? 0.5 : -0.4)), EGG_HOME);
        bindSperm(sp, { enabled: function () { return state.phase === PH.cells && !state.spermPlaced && !X.busy; }, onStart: function () { observe('sperm'); }, onDrop: function (s, info) { return dropCell('sperm', info, s); } });
      });
    }).then(function () { X.busy--; X.toast(MD.msg.cellsTask, { type: 'info', ms: 7000 }); X.refresh(); });
  };
  function M_clear() { return Lab.mat.clearPlastic({ color: 0xe6f6ff, opacity: 0.22 }); }
  function dropCell(what, info, sp) {
    var x = info.world.x, area = x < -1.9 ? 'male' : x > 2.0 ? 'female' : null, r = L.decideCell(state, what, area);
    if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } return { ok: false }; }
    var obj = what === 'sperm' ? sp.group : cell.egg.group, to = AREA[area];
    if (what === 'sperm') { sp.mode = 'placed'; sp.target = null; } L.applyCell(state, what);
    var from = obj.position.clone(); X.tween(0.6, function (k) { obj.position.lerpVectors(from, to, k); }, 'outCubic');
    Lab.audio.play('ok'); Lab.fx.sparkles(X.scene, to, 0xffe066, 10); X.toast(what === 'sperm' ? MD.right.spermPlaced : MD.right.eggPlaced, { type: 'ok', ms: 5200 });
    if (what === 'sperm') cell.sperms.forEach(function (s) { if (s !== sp && s.mode === 'swim') { s.mode = 'gone'; X.tween(0.9, function (k) { s.group.scale.setScalar(1.1 * (1 - k) + 0.001); }).then(function () { s.group.visible = false; }); } });
    X.refresh(); return { ok: true };
  }
  X.targets.sperm = function () { var s = cell.sperms.filter(function (q) { return q.group.visible && q.mode !== 'gone'; })[0]; return s && state.phase <= PH.cells ? boxAt(s.group.position, 0.8) : null; };
  X.lensPoint.sperm = function () { var s = cell.sperms.filter(function (q) { return q.group.visible; })[0]; return s.group.position.clone(); };
  X.lensSize.sperm = 1.6;
  X.targets.egg = function () { return cell.egg && state.phase >= PH.cells && state.phase < PH.zygote ? boxAt(cell.egg.group.position, 1.2 * cell.egg.group.scale.x) : null; };
  X.lensPoint.egg = function () { return cell.egg.group.position.clone(); }; X.lensSize.egg = 2.6;
  X.clicks.push(function (hit) {
    var id = hit && hit.id;
    if (state.phase === PH.fertilize && id === 'egg') { var c = L.clickEgg(state); if (c.msg) { X.toast(X.msgFor(c.msg), { type: 'info', ms: 5200 }); Lab.audio.play('click'); } return true; }
    if (state.phase === PH.zygote && id === 'egg') {
      if (!state.zygoteObserved) { X.toast(MD.msg.zygoteLensTask, { type: 'info', ms: 5200 }); return true; }
      if (L.applyZygoteClick(state)) { Lab.audio.play('ok'); Lab.fx.sparkles(X.scene, cell.egg.group.position.clone(), 0xffe066, 10); X.refresh(); }
      return true;
    }
    return false;
  });

  /* ---------------- phase 3: fertilization (md 13) ---------------- */
  X.enter[PH.fertilize] = function () {
    X.busy++; var egg = cell.egg, center = V(0, 1.5, 0);
    cell.sperms.forEach(function (s) { Lab.sceneDrag.remove(s.item); X.dispose(s.group); }); cell.sperms = []; Lab.sceneDrag.remove(egg.item);
    ['male', 'female'].forEach(function (sex) { show[sex].group.visible = false; }); cell.areas.forEach(function (a) { if (a.isObject3D) a.visible = false; else a.remove(); });
    var from = egg.group.position.clone(), s0 = egg.group.scale.x; egg.setZygote(0);
    X.shot('egg', 1000);
    X.tween(1.2, function (k) { egg.group.position.lerpVectors(from, center, k); egg.group.scale.setScalar(s0 + (1.35 - s0) * k); }, 'inOutCubic').then(function () {
      for (var i = 0; i < 10; i++) {
        var a = i / 10 * 6.283 + 0.3, base = V(Math.cos(a) * 3.3, 1.5 + Math.sin(a) * 1.8, (i % 2 ? 0.5 : -0.5)), sp = makeSperm(base, center); sp.group.scale.setScalar(0.001); sp.wob = 0.4; sp.group.userData.pick = 'sperm';
        bindSperm(sp, { enabled: function () { return state.phase === PH.fertilize && !state.fertilized && !X.busy; }, onDrop: function (s, info) { return dropSperm(s, info); } });
        (function (s) { X.tween(0.8, function (k) { s.group.scale.setScalar(1.1 * k + 0.001); }); })(sp);
      }
      X.busy--; X.toast(MD.msg.fertilizeTask, { type: 'info', ms: 7000 }); X.refresh();
    });
  };
  function dropSperm(sp, info) {
    var egg = cell.egg, near = info.world.distanceTo(egg.group.position) < 2.4, r = L.decideFertilize(state, near);
    if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } return { ok: false }; }
    sp.mode = 'busy'; fertilize(sp); return { ok: true };
  }
  async function fertilize(sp) {
    X.busy++; var egg = cell.egg, ep = egg.group.position, g = sp.group;
    sp.glow(true); faceTo(g, g.position, ep);
    var p0 = g.position.clone(), p1 = ep.clone().add(V(-1.7, 0.2, 0.2));
    await X.tween(0.9, function (k) { g.position.lerpVectors(p0, p1, k); faceTo(g, g.position, ep); }, 'inOutCubic');
    await X.tween(0.8, function (k) { egg.setGlow(k); });
    Lab.audio.play('pop'); var p2 = g.position.clone();
    await X.tween(1.0, function (k) { g.position.lerpVectors(p2, ep, k); g.scale.setScalar(1.1 * (1 - 0.7 * k)); }, 'inCubic');
    g.visible = false; Lab.audio.play('ok'); Lab.fx.sparkles(X.scene, ep.clone(), 0xffe066, 16);
    cell.sperms.forEach(function (s) { if (s !== sp) { s.mode = 'gone'; X.tween(1.4, function (k) { s.group.scale.setScalar(1.1 * (1 - k) + 0.001); }).then(function () { s.group.visible = false; }); } });
    await X.tween(1.3, function (k) { egg.setZygote(k); });
    L.applyFertilize(state); UI.caption(MD.labels.zygoteTitle, { ms: 2600, cls: 'day' }); X.toast(MD.right.fertilized, { type: 'ok', ms: 7000 }); X.refresh();
    await X.wait(2.6); egg.setGlow(0.35); X.busy--; X.advance();
  }

  /* ---------------- phase 4: the zygote (md 14) ---------------- */
  X.enter[PH.zygote] = function () { X.toast(MD.right.zygote, { type: 'info', ms: 6500 }); X.setInfo({ title: MD.steps[3], msg: MD.right.zygote }); };
  X.targets.zygote = function () { return cell.egg && state.phase === PH.zygote ? boxAt(cell.egg.group.position, 1.6) : null; };
  X.lensPoint.zygote = function () { return cell.egg.group.position.clone(); }; X.lensSize.zygote = 2.8;
  X.lensHooks.zygote = function () { cell.egg.setGlow(1); Lab.fx.sparkles(X.scene, cell.egg.group.position.clone(), 0xffe066, 12); Lab.audio.play('ok'); X.toast(MD.right.zygote, { type: 'ok', ms: 6000 }); X.setInfo({ title: MD.steps[3], msg: MD.right.zygote }); };
  X.zygote = function () { return cell.egg; };
});
