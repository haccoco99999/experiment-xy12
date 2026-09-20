/* Experiment 5 – "Tìm hiểu cơ quan sinh sản của thực vật có hoa và quá trình tạo quả, hạt ở cây cà chua".
   This file: the scene, the tool tray, the side panel, placing the flower, its information table, the magnifier, the cameras and the small
   helpers. exp5-look.js (parts of the flower), exp5-pollen.js (stick and pollination), exp5-fert.js (pollen tube and fertilization) and
   exp5-fruit.js (fast forward, fruit, seeds, the end) add the rest through Lab.exp5mods and share the object `X`. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, UI = Lab.ui, L = Lab.logic.exp5, Mo = Lab.models;
  var CT = Lab.content.exp5, MD = CT.md, APP = CT.app;
  var POS = { x: 0, z: 0.3 }, Y0 = 1.4;
  var CARDS = ['flower', 'lens', 'stick'];
  var SHOTS = {
    table: { cx: 0, cy: 1.2, cz: 0.3, w: 6.8, h: 3.7, pitch: 0.4, fov: 34 },
    flower: { cx: 0, cy: 1.75, cz: 0.3, w: 4.4, h: 3.2, pitch: 0.55, fov: 34 },
    cut: { cx: 0, cy: 2.1, cz: 0.3, w: 3.4, h: 2.4, pitch: 0.06, fov: 34 },
    pollen: { cx: 0, cy: 2.45, cz: 0.3, w: 2.8, h: 2.0, pitch: 0.4, fov: 34 },
    fert: { cx: 0, cy: 2.35, cz: 0.3, w: 2.5, h: 1.8, pitch: 0.04, fov: 34 },
    fruit: { cx: 0, cy: 1.8, cz: 0.3, w: 4.4, h: 3.2, pitch: 0.3, fov: 34 },
    halves: { cx: 0, cy: 1.9, cz: 0.3, w: 5.8, h: 3.4, pitch: 0.02, fov: 34 }
  };

  Lab.experiments.exp5 = { id: 'exp5', number: 5, title: APP.titlePrefix + MD.title, help: APP.help, create: create };

  function create(ctx) {
    var scene = ctx.scene, env = Lab.env.build(scene), state = L.initialState();
    if (Lab.stage.renderer) Lab.stage.renderer.localClippingEnabled = true;          // the flower is cut with clipping planes
    var X = {
      T: T, U: U, UI: UI, L: L, Mo: Mo, MD: MD, APP: APP, scene: scene, env: env, state: state, POS: POS, Y0: Y0, SHOTS: SHOTS,
      flower: null, fruit: null, mode: 'table', busy: 0, seq: 0, fx: [], leaveHooks: [], lastAction: performance.now(), note: null
    };
    var hintTimer = null, timed = [];

    /* ------------------------------------------------------------------ helpers shared with the other files */
    X.esc = function (s) { return U.esc(s); };
    X.touch = function () { X.lastAction = performance.now(); CARDS.forEach(function (id) { UI.setCard(id, { pulse: false }); }); };
    X.toast = function (text, o) { if (text) UI.toast(text, o); };
    X.msgFor = function (key, r) {
      var t = (key && (MD.msg[key] || APP[key])) || '';
      return key === 'obsOrder' && r ? t.replace('{0}', MD.parts[r.want]) : t;
    };
    X.addFx = function (h) { X.fx.push(h); return h; };
    X.stopFx = function () { X.fx.forEach(function (f) { f.stop(); }); X.fx.length = 0; };
    X.tag = function (text, world, cls, ms, extra) {
      var o = { text: text, cls: cls || 'part', world: world, anchor: 'center' }; if (extra) Object.keys(extra).forEach(function (k) { o[k] = extra[k]; });
      var h = Lab.labels.add(o);
      if (ms) { timed.push(h); Lab.tween.wait(ms / 1000).promise.then(function () { h.remove(); var i = timed.indexOf(h); if (i >= 0) timed.splice(i, 1); }); }
      return h;
    };
    X.dispose = function (o) { if (o.parent) o.parent.remove(o); Lab.prim.disposeTree(o); };
    X.shot = function (name, ms) { var s = typeof name === 'string' ? SHOTS[name] : name; return Lab.stage.shot(s, ms == null ? 900 : ms); };
    X.wpos = function (v) { return X.flower.world(v); };
    X.leave = function () {
      X.seq++; X.stopFx(); timed.forEach(function (h) { h.remove(); }); timed.length = 0;
      X.leaveHooks.forEach(function (fn) { fn(); });
    };
    X.go = function (mode, shotName, ms) { X.leave(); X.mode = mode; X.shot(shotName || mode, ms); X.refresh(); };
    Lab.stage.shot(SHOTS.table, 0);
    UI.fitStage();

    /* ------------------------------------------------------------------ tray */
    function thumb(fn, o) { return Lab.stage.bakeThumb(function (h) { h.add(fn()); }, o); }
    var th = {
      flower: thumb(function () { return Mo.tomatoFlower().group; }, { yaw: 0.3, pitch: 0.5 }),
      lens: thumb(function () { return Mo.magnifier(); }, { yaw: 0.3, pitch: 0.3 }),
      stick: thumb(function () { var s = Mo.pollenStick().group; s.rotation.z = -0.6; return s; }, { yaw: 0.2, pitch: 0.3 })
    };
    UI.setTray(CARDS.map(function (id) { return { id: id, label: MD.tray[id], thumb: th[id] }; }), { onClick: function (item) { if (item.id === 'flower' && !state.placed) return; } });

    /* ------------------------------------------------------------------ side panel */
    var el = U.el;
    function button(text, cls, fn, off) {
      return el('button', { class: 'btn ' + (cls || 'btn-orange') + ' panel-btn', text: text, attrs: off ? { disabled: 'disabled' } : {}, on: { click: function () { X.touch(); fn(); } } });
    }
    X.button = button;
    function partsCard() {
      var next = L.nextObs(state);
      return el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.partsTitle }), el('div', { class: 'marks' }, L.OBS.map(function (p) {
        var st = state.observed[p] ? 'done' : p === next ? 'active' : 'locked';
        return el('span', { class: 'mark-chip ' + st, text: MD.parts[p] + (st === 'done' ? ' ✓' : '') });
      })));
    }
    function timeCard() {
      var ds = L.dayStates(state);
      return el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.timeTitle }), el('div', { class: 'timeline' }, MD.days.map(function (d, i) {
        return el('div', { class: 'tl-item ' + ds[i] }, el('span', { class: 'tl-dot' }), el('span', { class: 'tl-text', text: d }));
      })));
    }
    function renderPanel() {
      var stack = el('div', { class: 'panel-stack' }), key = L.promptKey(state);
      if (state.finished && X.finale) X.finale.render(stack);
      else {
        if (!state.placed) stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: APP.dragFlower })));
        else if (!state.cut) {
          var canOpen = L.canOpenStructure(state);
          stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: canOpen ? APP.lensHint : APP.dragLens }),
            canOpen ? button(MD.buttons.structure, 'btn-orange', function () { X.look.open(); }, !!X.busy) : null));
        } else {
          if (state.obsDone && !state.pollStarted) stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: APP.obsDone }), button(MD.buttons.pollinate, 'btn-orange', function () { X.pollen.start(); }, !!X.busy)));
          else if (!state.obsDone) stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: APP.tapDots })));
          if (!state.obsDone || !state.pollStarted) stack.appendChild(partsCard());
        }
        if (state.pollStarted && key && !X.busy) stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: MD.prompt[key] || APP[key] })));
        if (state.fertilized && state.lapse === 'idle' && !X.busy) stack.appendChild(el('div', { class: 'panel-card task-card' }, button(MD.buttons.lapse, 'btn-orange', function () { X.fruit.start(); })));
        if (state.lapse !== 'idle') stack.appendChild(timeCard());
        if (L.canContinue(state) && !X.busy) stack.appendChild(el('div', { class: 'panel-card task-card' }, X.note ? el('p', { class: 'task-text', text: X.note }) : null, button(APP.keepGoing, 'btn-orange', function () { X.fruit.next(); })));
        else if (X.note && state.lapse !== 'idle') stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: X.note })));
      }
      UI.setPanel(stack);
    }
    X.refresh = function () {
      UI.setProgress(MD.steps, L.stepStates(state));
      UI.setCard('flower', { ghost: state.placed });
      UI.setCard('lens', { ghost: Lab.lens.active() });
      var c = UI.card('stick'); if (c) { c.classList.toggle('is-loaded', state.hasPollen); var lb = c.querySelector('.card-label'); if (lb) lb.textContent = state.hasPollen ? APP.loaded + ' · ' + MD.tray.stick : MD.tray.stick; }
      renderPanel(); Lab.loop.wake();
    };

    /* ------------------------------------------------------------------ drop areas for the tools from the tray */
    var benchBox = new T.Box3(new T.Vector3(-4.3, 0, -2.0), new T.Vector3(4.3, 0.05, 2.35));
    var ZONES = [['bench', 0, 0], ['flower', 2, 6], ['petal', 3, 0], ['ovary', 6, 6], ['style', 7, 10], ['anther', 9, 6], ['stigma', 10, 8]];
    ZONES.forEach(function (z) {
      Lab.drag.addZone({
        id: z[0], label: z[0] === 'bench' ? 'BÀN QUAN SÁT' : '', pad: z[2], priority: z[1],
        rect: function () { return z[0] === 'bench' ? Lab.stage.rectOf(benchBox, 0) : X.flower && X.flower.group.visible && X.mode !== 'fruit' && X.mode !== 'halves' ? Lab.stage.rectOf(X.flower.box(z[0]), 0) : null; },
        accepts: function (item) { return L.decideTool(state, item.id, z[0]).ok; }
      });
    });
    Lab.drag.setHandler({ onStart: X.touch, onDrop: function (item, hits, pt) { X.touch(); return handleDrop(item.id, hits[0] || null, pt); } });

    function handleDrop(tool, zoneId, pt) {
      if (X.busy) return { ok: false, message: APP.busy };
      var r = L.decideTool(state, tool, zoneId);
      if (!r.ok) {
        if (r.msg === 'pollenWrong' && X.pollen) X.pollen.spill(r.fall);
        return { ok: false, message: X.msgFor(r.msg, r) };
      }
      L.applyTool(state, r.action);
      Lab.audio.play('pop');
      if (r.action === 'place') placeFlower();
      else if (r.action === 'lens') showLens();
      else if (r.action === 'collect') X.pollen.collect();
      else if (r.action === 'pollinate') X.pollen.pollinate();
      X.refresh();
      return { ok: true };
    }
    X.handleDrop = handleDrop;

    /* ------------------------------------------------------------------ placing the flower (md section 6) */
    function placeFlower() {
      var fl = X.flower = Mo.tomatoFlower();
      fl.group.position.set(POS.x, 4.6, POS.z); fl.group.userData.pick = 'flower'; scene.add(fl.group);
      X.busy++;
      Lab.tween.to(fl.group.position, { y: 0 }, 0.9, { ease: 'outBounce' }).promise.then(function () {
        X.busy--; X.mode = 'flower'; X.shot('flower', 900);
        Lab.fx.ringPulse(scene, new T.Vector3(POS.x, 0, POS.z), 0x4caf50, 2.2); Lab.fx.sparkles(scene, new T.Vector3(POS.x, Y0 + 0.8, POS.z), 0xffe066, 10);
        Lab.audio.play('ok'); X.toast(APP.placed, { type: 'ok', ms: 5200 }); X.refresh();
      });
    }

    /* ------------------------------------------------------------------ information table (md section 7) and the magnifier (section 8) */
    function showInfo() {
      var t = MD.info;
      var html = '<table class="info-table"><thead><tr>' + t.head.map(function (h) { return '<th>' + X.esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        t.rows.map(function (r) { return '<tr><th>' + X.esc(r[0]) + '</th><td>' + X.esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table>';
      var m = UI.modal(el('div', {}, el('div', { html: html }), el('div', { class: 'confirm-actions', style: { marginTop: '18px' } },
        el('button', { class: 'btn', text: t.close, attrs: { 'data-autofocus': '1', 'aria-label': 'Đóng' }, on: { click: function () { m.close(); } } }))), { wide: false });
    }
    function showLens() {
      var fl = X.flower;
      Lab.lens.show({ world: function () { return fl.world(new T.Vector3(0, Y0 + 0.75, 0)); }, radius: 125, viewSize: 1.7, distance: 3.2, onClose: function () { X.refresh(); } });
      X.toast(APP.lensOn, { type: 'info', ms: 5000 });
    }
    Lab.stage.onPick(function (hit) {
      if (!state.placed || X.busy) return; X.touch();
      if (hit.id === 'pollen') X.fert.tapPollen(true);
      else if (hit.id === 'ovule') X.look.tapOvule(hit.object);
      else if (hit.id === 'fruit') X.fruit.tapFruit();
      else if (hit.id === 'flower') {
        if (state.pollinated && !state.germinated) X.fert.tapPollen(false);         // a click anywhere else on the flower
        else if (X.mode === 'flower' || X.mode === 'cut') showInfo();
      }
    });

    /* ------------------------------------------------------------------ the other files add their parts */
    (Lab.exp5mods || []).forEach(function (m) { m(X); });

    Lab.loop.add(function (dt, time) { if (X.flower && X.flower.update) X.flower.update(dt, time); }, { ambient: true });
    hintTimer = setInterval(function () {
      if (X.busy || performance.now() - X.lastAction < 10000 || state.finished) return;
      if (!state.placed) UI.setCard('flower', { pulse: true });
      else if (!state.lens && !state.cut) UI.setCard('lens', { pulse: true });
    }, 1000);

    X.refresh(); Lab.loop.wake();
    return {
      dispose: function () { clearInterval(hintTimer); Lab.stage.onPick(null); X.stopFx(); Lab.stage.afterRender = null; },
      api: { state: function () { return state; }, X: X, drop: handleDrop, busy: function () { return X.busy; } }
    };
  }
})(window.Lab);
