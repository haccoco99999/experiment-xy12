/* Experiment 6 – "Tìm hiểu sự hình thành cây con từ hạt, rễ, thân và lá của thực vật".
   This file: the table with four fixed places, the tool tray (four samples, four pots, soil, watering can, magnifier), the side panel, the drops
   (pots, samples, water, magnifier) and the cameras. exp6-lapse.js (time, zooming into a pot, classification, growing up, the end) adds the rest
   through Lab.exp6mods and shares the object `X`. Index 0..3 = bean, sweet potato, potato, kalanchoe (pot i takes sample i). */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, UI = Lab.ui, L = Lab.logic.exp6, Mo = Lab.models;
  var CT = Lab.content.exp6, MD = CT.md, APP = CT.app;
  var PX = [-3.3, -1.1, 1.1, 3.3], PZ = 0.3;
  var CARDS = ['s0', 's1', 's2', 's3', 'p0', 'p1', 'p2', 'p3', 'soil', 'can', 'lens'];
  var SHOTS = {
    table: { cx: 0, cy: 1.3, cz: PZ, w: 9.4, h: 4.4, pitch: 0.4, fov: 34 },
    pot: function (i) { return { cx: PX[i], cy: 1.5, cz: PZ, w: 3.4, h: 2.6, pitch: 0.16, fov: 34 }; }
  };
  function V(x, y, z) { return new T.Vector3(x, y, z); }

  Lab.experiments.exp6 = { id: 'exp6', number: 6, title: APP.titlePrefix + MD.title, help: APP.help, create: create };

  function create(ctx) {
    var scene = ctx.scene, env = Lab.env.build(scene), state = L.initialState(), el = U.el;
    var X = {
      T: T, U: U, UI: UI, L: L, Mo: Mo, MD: MD, APP: APP, scene: scene, env: env, state: state, PX: PX, PZ: PZ, SHOTS: SHOTS, V: V,
      pots: [null, null, null, null], mode: 'table', zoomed: -1, busy: 0, seq: 0, fx: [], leaveHooks: [], lastAction: performance.now(), note: null
    };
    var hintTimer = null, timed = [], rings = [];

    /* ------------------------------------------------------------------ helpers shared with the other file */
    X.esc = function (s) { return U.esc(s); };
    X.touch = function () { X.lastAction = performance.now(); CARDS.forEach(function (id) { UI.setCard(id, { pulse: false }); }); };
    X.toast = function (text, o) { if (text) UI.toast(text, o); };
    X.msgFor = function (key) { return (key && (MD.msg[key] || APP[key])) || ''; };
    X.tag = function (text, world, cls, ms) {
      var h = Lab.labels.add({ text: text, cls: cls || 'part', world: world, anchor: 'center' });
      if (ms) { timed.push(h); Lab.tween.wait(ms / 1000).promise.then(function () { h.remove(); var i = timed.indexOf(h); if (i >= 0) timed.splice(i, 1); }); }
      return h;
    };
    X.dispose = function (o) { if (o.parent) o.parent.remove(o); Lab.prim.disposeTree(o); };
    X.shot = function (name, ms) { var s = typeof name === 'function' ? name() : typeof name === 'string' ? SHOTS[name] : name; return Lab.stage.shot(s, ms == null ? 900 : ms); };
    X.clearTimed = function () { timed.forEach(function (h) { h.remove(); }); timed.length = 0; };
    Lab.stage.shot(SHOTS.table, 0);
    UI.fitStage();

    /* ------------------------------------------------------------------ the four places on the table */
    for (var i = 0; i < 4; i++) {
      (function (i) {
        var disc = new T.Mesh(new T.RingGeometry(0.86, 0.98, 48), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false, fog: false }));
        disc.rotation.x = -Math.PI / 2; disc.position.set(PX[i], 0.012, PZ); disc.userData.noPick = true; scene.add(disc); rings.push(disc);
        X.tag(MD.places[i], V(PX[i], 0.0, PZ + 1.25), 'place');
      })(i);
    }
    function ringGlow(i, on) { rings[i].material.color.setHex(on ? 0x6fe07a : 0xffffff); rings[i].material.opacity = on ? 0.9 : 0.55; Lab.loop.wake(); }

    /* ------------------------------------------------------------------ tray */
    function thumb(fn, o) { return Lab.stage.bakeThumb(function (h) { h.add(fn()); }, o); }
    function sample(k) {
      var g = new T.Group(), M = Lab.mat, P = Lab.prim;
      if (k === 0) g.add(new T.Mesh(P.ellipsoid(0.4, 0.26, 0.26, 16), M.std(0x6fa84a, { roughness: 0.4 })));
      if (k === 1) { var r = new T.Mesh(P.ellipsoid(0.7, 0.2, 0.2, 18), M.std(0xb8642e)); r.rotation.z = 0.3; g.add(r); }
      if (k === 2) { g.add(new T.Mesh(P.ellipsoid(0.5, 0.36, 0.4, 20), M.std(0xd6b98a))); [[-0.2, 0.32, 0.2], [0.15, 0.3, 0.3], [0.3, 0.1, 0.34]].forEach(function (p) { var e = new T.Mesh(P.ellipsoid(0.07, 0.05, 0.07, 8), M.std(0x6e5a3a)); e.position.set(p[0], p[1], p[2]); g.add(e); }); }
      if (k === 3) { var l = new T.Mesh(P.ellipsoid(0.8, 0.1, 0.5, 20), M.std(0x6aa64a)); l.rotation.x = 0.5; g.add(l); }
      return g;
    }
    var th = {};
    for (var k = 0; k < 4; k++) (function (k) { th['s' + k] = thumb(function () { return sample(k); }, { yaw: 0.4, pitch: 0.4 }); })(k);
    var potThumb = thumb(function () { var p = Mo.sproutPot(0).group; return p; }, { yaw: -0.3, pitch: 0.25 });
    for (k = 0; k < 4; k++) th['p' + k] = potThumb;
    th.soil = thumb(function () { var m = new T.Mesh(Lab.prim.ellipsoid(0.7, 0.32, 0.6, 20), Lab.mat.std(0x5a3d26, { roughness: 0.95 })); return m; }, { yaw: 0.3, pitch: 0.5 });
    th.can = thumb(function () { return Mo.wateringCan(); }, { yaw: -0.45, pitch: 0.2 });
    th.lens = thumb(function () { return Mo.magnifier(); }, { yaw: 0.3, pitch: 0.3 });
    var labels = {}; for (k = 0; k < 4; k++) { labels['s' + k] = MD.samples[k]; labels['p' + k] = MD.pots[k]; }
    labels.soil = MD.tools.soil; labels.can = MD.tools.can; labels.lens = MD.tools.lens;
    X.trayItems = function (ids) { return ids.map(function (id) { return { id: id, label: labels[id], thumb: th[id] }; }); };
    UI.setTray(X.trayItems(CARDS), { onClick: function () { } });

    /* ------------------------------------------------------------------ side panel */
    function button(text, cls, fn, off) {
      return el('button', { class: 'btn ' + (cls || 'btn-orange') + ' panel-btn', text: text, attrs: off ? { disabled: 'disabled' } : {}, on: { click: function () { X.touch(); fn(); } } });
    }
    X.button = button;
    function renderPanel() {
      var stack = el('div', { class: 'panel-stack' }), key = L.promptKey(state);
      if (state.complete && X.finale) X.finale.render(stack);
      else {
        if (key && !X.busy) stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: APP[key] }), key === 'startTask' ? button(MD.start, 'btn-orange', function () { X.lapse.start(); }) : null,
          key === 'growTask' ? button(APP.keepGoing, 'btn-orange', function () { X.lapse.grow(); }) : null));
        if (state.started) stack.appendChild(X.timeCard());
        if (X.note && state.started) stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: X.note })));
        if (state.started && !X.busy && X.zoomed < 0 && L.plantletsFormed(state) === false) stack.appendChild(el('div', { class: 'panel-card' }, el('p', { class: 'task-text', text: APP.tapPot })));
      }
      UI.setPanel(stack);
    }
    X.timeCard = function () {
      var ds = L.dayStates(state);
      return el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.timeTitle }), el('div', { class: 'timeline t5' }, MD.days.map(function (d, i) {
        return el('div', { class: 'tl-item ' + ds[i] }, el('span', { class: 'tl-dot' }), el('span', { class: 'tl-text', text: d.replace('NGÀY ', '') }));
      })), state.lapse === 'run2' || state.lapse === 'done' ? el('div', { class: 'stage-line', text: X.stageName || MD.stages.young }) : null);
    };
    X.refresh = function () {
      UI.setProgress(MD.steps, L.stepStates(state));
      for (var i = 0; i < 4; i++) { UI.setCard('p' + i, { ghost: state.pots[i] }); UI.setCard('s' + i, { ghost: state.samples[i] }); }
      UI.setCard('lens', { ghost: Lab.lens.active() });
      renderPanel(); Lab.loop.wake();
    };

    /* ------------------------------------------------------------------ drop areas */
    var benchBox = new T.Box3(new T.Vector3(-4.6, 0, -2.0), new T.Vector3(4.6, 0.05, 2.35));
    Lab.drag.addZone({ id: 'bench', label: 'BÀN QUAN SÁT', pad: 0, priority: 0, rect: function () { return Lab.stage.rectOf(benchBox, 0); }, accepts: function () { return true; } });
    for (i = 0; i < 4; i++) (function (i) {
      Lab.drag.addZone({
        id: 'place' + i, label: '', pad: 6, priority: 5,
        rect: function () { return Lab.stage.rectOf(new T.Box3(V(PX[i] - 1, 0, PZ - 1), V(PX[i] + 1, 0.06, PZ + 1)), 0); },
        accepts: function (item) { var m = /^p(\d)$/.exec(item.id); return !!m && L.decidePot(state, +m[1], i).ok; }
      });
      Lab.drag.addZone({
        id: 'pot' + i, label: '', pad: 8, priority: 8,
        rect: function () { return state.pots[i] && X.pots[i] ? Lab.stage.rectOf(X.pots[i].zoneBox(), 0) : null; },
        accepts: function (item) {
          var s = /^s(\d)$/.exec(item.id); if (s) return L.decideSample(state, +s[1], i).ok;
          var c = /^c(\d)$/.exec(item.id); if (c) return L.decideClass(state, +c[1], i).ok;
          if (item.id === 'can') return L.decideWater(state, i).ok; if (item.id === 'lens') return L.decideLens(state, i).ok; return item.id === 'soil';
        }
      });
    })(i);
    Lab.drag.setHandler({ onStart: X.touch, onDrop: function (item, hits) { X.touch(); return handleDrop(item.id, hits[0] || null); } });

    function handleDrop(id, zid) {
      if (X.busy || X.zoomed >= 0) return { ok: false, message: APP.busy };
      var pm = /^p(\d)$/.exec(id), sm = /^s(\d)$/.exec(id), cm = /^c(\d)$/.exec(id), zp = zid && /^pot(\d)$/.exec(zid), zl = zid && /^place(\d)$/.exec(zid), r;
      if (pm) {
        r = L.decidePot(state, +pm[1], zl ? +zl[1] : null);
        if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
        L.applyPot(state, r.pot); Lab.audio.play('pop'); placePot(r.pot); X.refresh(); return { ok: true };
      }
      if (sm) {
        r = L.decideSample(state, +sm[1], zp ? +zp[1] : null);
        if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
        var a = L.applySample(state, r.sample); Lab.audio.play('pop'); putSample(r.sample, a.msg); X.refresh(); return { ok: true };
      }
      if (cm) {
        r = L.decideClass(state, +cm[1], zp ? +zp[1] : null);
        if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
        L.applyClass(state, r.card); X.lapse.classified(r.card); return { ok: true };
      }
      if (id === 'can') {
        r = L.decideWater(state, zp ? +zp[1] : null);
        if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
        L.applyWater(state, r.pot); doWater(r.pot); X.refresh(); return { ok: true };
      }
      if (id === 'lens') {
        r = L.decideLens(state, zp ? +zp[1] : null);
        if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
        Lab.audio.play('pop'); showLens(r.pot); X.refresh(); return { ok: true };
      }
      if (id === 'soil') return { ok: false, message: zp ? APP.soilHave : '' };
      return { ok: false };
    }
    X.handleDrop = handleDrop;

    /* ------------------------------------------------------------------ pots, samples, water, magnifier */
    function placePot(i) {
      var pot = X.pots[i] = Mo.sproutPot(i); pot.group.position.set(PX[i], 4.4, PZ); pot.group.userData.pick = 'pot' + i; scene.add(pot.group); X.busy++;
      Lab.tween.to(pot.group.position, { y: 0 }, 0.8, { ease: 'outBounce' }).promise.then(function () {
        X.busy--; ringGlow(i, true); Lab.fx.ringPulse(scene, V(PX[i], 0, PZ), 0x4caf50, 1.6); Lab.audio.play('ok'); X.toast(MD.right.pot, { type: 'ok', ms: 4200 }); X.refresh();
      });
    }
    function putSample(i, key) {
      var pot = X.pots[i]; pot.showSample(true); pot.group.userData.sample = true;
      Lab.fx.sparkles(scene, V(PX[i], 1.3, PZ - 0.2), 0xffe066, 8); Lab.audio.play('ok'); X.toast(MD.right[key.replace('right', 'sample')], { type: 'ok', ms: 6500 });
    }
    function tipOffset(obj, tilt) { var t = obj.userData.tip.position; return { x: t.x * Math.cos(tilt) - t.y * Math.sin(tilt), y: t.x * Math.sin(tilt) + t.y * Math.cos(tilt) }; }
    function worldOf(o) { var v = new T.Vector3(); o.updateMatrixWorld(true); return o.getWorldPosition(v); }
    async function doWater(i) {
      X.busy++; UI.setCard('can', { ghost: true });
      var pot = X.pots[i], can = Mo.wateringCan(), tilt = -0.78, off = tipOffset(can, tilt), soil = pot.soilPoint();
      can.position.set(soil.x - off.x - 3.2, 5.6, soil.z + 0.2); scene.add(can);
      await Lab.tween.to(can.position, { x: soil.x - off.x, y: 2.6 - off.y, z: soil.z + 0.2 }, 0.8, { ease: 'outCubic' }).promise;
      await Lab.tween.to(can.rotation, { z: tilt }, 0.55, { ease: 'inOutCubic' }).promise;
      Lab.audio.play('water');
      Lab.fx.pour(scene, { from: worldOf(can.userData.tip), to: soil, color: 0x59bff2, size: 0.055, count: 46, duration: 1.9, spread: 0.12, opacity: 0.85, flight: 0.5 });
      Lab.tween.wait(0.7).promise.then(function () { pot.setSoil('moist', true); });
      X.toast(MD.right.water, { type: 'ok', ms: 4200 });
      await Lab.tween.wait(2.0).promise;
      await Lab.tween.to(can.rotation, { z: 0 }, 0.35).promise;
      await Lab.tween.to(can.position, { x: can.position.x + 3.4, y: can.position.y + 3 }, 0.7, { ease: 'inCubic' }).promise;
      X.dispose(can); UI.setCard('can', { ghost: false }); X.busy--; X.refresh();
    }
    function showLens(i) {
      var pot = X.pots[i];
      Lab.lens.show({ world: function () { return pot.world(pot.lensPoint()); }, radius: 125, viewSize: 1.6, distance: 3.2, onClose: function () { X.refresh(); } });
      X.tag(MD.lens[i], function () { return pot.world(pot.lensPoint().clone().add(V(0, 1.0, 0.3))); }, 'part', 5200);
      X.toast(APP.lensOn, { type: 'info', ms: 4600 });
    }

    /* ------------------------------------------------------------------ clicking a pot (zoom) is done in exp6-lapse.js */
    Lab.stage.onPick(function (hit) { X.touch(); var m = /^pot(\d)$/.exec(hit.id); if (m && X.lapse) X.lapse.tapPot(+m[1]); });

    (Lab.exp6mods || []).forEach(function (m) { m(X); });

    hintTimer = setInterval(function () {
      if (X.busy || performance.now() - X.lastAction < 10000 || state.complete) return;
      var i2; if (!L.allPots(state)) { for (i2 = 0; i2 < 4; i2++) if (!state.pots[i2]) { UI.setCard('p' + i2, { pulse: true }); return; } }
      else if (!L.allSamples(state)) { for (i2 = 0; i2 < 4; i2++) if (!state.samples[i2]) { UI.setCard('s' + i2, { pulse: true }); return; } }
      else if (!L.allWatered(state)) UI.setCard('can', { pulse: true });
    }, 1000);

    X.refresh(); Lab.loop.wake();
    return {
      dispose: function () { clearInterval(hintTimer); Lab.stage.onPick(null); Lab.stage.afterRender = null; },
      api: { state: function () { return state; }, X: X, drop: handleDrop, busy: function () { return X.busy; } }
    };
  }
})(window.Lab);
