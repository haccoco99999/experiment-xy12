/* Experiment 8 – "Tìm hiểu sự sinh sản và vòng đời của động vật đẻ con – Mèo".
   This file: the two places the story happens in (the garden table, and a soft "inside" backdrop for the cells and the fetus), the tool tray (male, female, magnifier),
   the side panel, the timeline bar every growing stage uses, the magnifier, click routing and the buttons that start and continue. The stages add themselves through
   Lab.exp8mods and share the object `X`: exp8-cells.js (place, identify, sperm and egg, fertilization, zygote), exp8-grow.js (embryo, fetus),
   exp8-born.js (newborn kitten, growing kitten, adult), exp8-finale.js (sorting, the end, review). Logic: js/logic/exp8.js. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, UI = Lab.ui, L = Lab.logic.exp8, Mo = Lab.models;
  var CT = Lab.content.exp8, MD = CT.md, APP = CT.app, PH = L.PH;
  var CARDS = ['male', 'female', 'lens'];
  var TARGETS = ['male', 'female', 'sperm', 'egg', 'zygote', 'embryo', 'fetus', 'kitten', 'kitten0', 'kitten1', 'kitten2'];      // things the magnifier can be put on
  var SHOTS = {
    table: { cx: 0, cy: 1.0, cz: 0.4, w: 6.8, h: 3.6, pitch: 0.34, fov: 34 },
    cells: { cx: 0, cy: 1.25, cz: 0, w: 9.4, h: 4.8, pitch: 0.05, fov: 34 },
    egg: { cx: 0, cy: 1.45, cz: 0, w: 7.4, h: 4.2, pitch: 0.05, fov: 34 },
    close: { cx: 0, cy: 1.45, cz: 0, w: 5.4, h: 3.2, pitch: 0.05, fov: 34 },
    yard: { cx: -1.0, cy: 0.8, cz: 0.6, w: 6.4, h: 3.3, pitch: 0.3, fov: 34 },
    sort: { cx: 0, cy: 1.1, cz: 0.6, w: 9.6, h: 5.4, pitch: 0.44, fov: 34 }
  };
  function V(x, y, z) { return new T.Vector3(x, y, z); }

  Lab.experiments.exp8 = { id: 'exp8', number: 8, title: APP.titlePrefix + MD.title, help: APP.help, create: create };

  function create(ctx) {
    var scene = ctx.scene, env = Lab.env.build(scene), state = L.initialState(), el = U.el;
    var X = {
      T: T, U: U, UI: UI, L: L, Mo: Mo, MD: MD, APP: APP, PH: PH, scene: scene, env: env, state: state, SHOTS: SHOTS, V: V, busy: 0, drops: {}, enter: {}, clicks: [], ticks: [], targets: {},
      lensHooks: {}, lensPoint: {}, lensSize: {}, panelHooks: [], disposers: [], info: null, tl: null, set: 'garden', lastAction: performance.now(), review: null
    };
    var timed = [], hintTimer = null, dome = null, motes = null, downAt = null;
    var veil = el('div', { class: 'veil' }); UI.el.hud.appendChild(veil);

    /* ------------------------------------------------------------------ helpers shared with the other files */
    X.touch = function () { X.lastAction = performance.now(); CARDS.forEach(function (id) { UI.setCard(id, { pulse: false }); }); };
    X.toast = function (text, o) { if (text) UI.toast(text, o); };
    X.msgFor = function (key) { return (key && (MD.msg[key] || APP[key])) || ''; };
    X.tag = function (text, world, cls, ms, extra) {
      var h = Lab.labels.add(Object.assign({ text: text, cls: cls || 'part', world: world, anchor: 'center' }, extra || {}));
      if (ms) { timed.push(h); Lab.tween.wait(ms / 1000).promise.then(function () { h.remove(); var i = timed.indexOf(h); if (i >= 0) timed.splice(i, 1); }); }
      return h;
    };
    X.dispose = function (o) { if (o && o.parent) o.parent.remove(o); Lab.prim.disposeTree(o); };
    X.shot = function (name, ms) { var s = typeof name === 'string' ? SHOTS[name] : name; return Lab.stage.shot(s, ms == null ? 1000 : ms); };
    X.wait = function (s) { return Lab.tween.wait(s).promise; };
    X.tween = function (secs, fn, ease) { return Lab.tween.value(secs, fn, { ease: ease || 'inOutQuad' }).promise; };
    X.button = function (text, cls, fn, locked) {
      return el('button', { class: 'btn ' + (cls || 'btn-orange') + ' panel-btn' + (locked ? ' locked' : ''), text: text, attrs: locked ? { title: APP.startLocked } : {},
        on: { click: function () { X.touch(); if (locked) { X.toast(APP.startLocked, { type: 'warn' }); Lab.audio.play('wrong'); } else fn(); } } });
    };
    X.fade = function (mid) {                                         // a soft white fade: out, change the picture, in
      return X.tween(0.55, function (k) { veil.style.opacity = k; }).then(function () { mid(); return X.tween(0.7, function (k) { veil.style.opacity = 1 - k; }); });
    };
    X.setInfo = function (o) { X.info = o; X.refresh(); };
    Lab.stage.shot(SHOTS.table, 0);
    UI.fitStage();

    /* ------------------------------------------------------------------ the two places: the garden table, and a soft backdrop inside a bubble */
    function buildInside() {
      var c = document.createElement('canvas'); c.width = 4; c.height = 256; var g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
      gr.addColorStop(0, '#54468c'); gr.addColorStop(0.5, '#a56cae'); gr.addColorStop(1, '#f0b6ca'); g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
      var tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.userData = { own: true };
      dome = new T.Mesh(new T.SphereGeometry(40, 24, 16), new T.MeshBasicMaterial({ map: tex, side: T.BackSide, fog: false, depthWrite: false })); dome.position.set(0, 1.5, 0); dome.userData.noPick = true; scene.add(dome);
      var R = U.rng(8), n = 70, data = [];
      motes = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false, fog: false }), n); motes.frustumCulled = false; motes.userData.noPick = true;
      for (var i = 0; i < n; i++) data.push({ x: (R() - 0.5) * 20, y: R() * 6 - 0.5, z: -6 + R() * 5, s: 0.06 + R() * 0.16, v: 0.05 + R() * 0.12, ph: R() * 6.28 });
      var m = new T.Matrix4(), q = new T.Quaternion(), p = new T.Vector3(), sc = new T.Vector3();
      X.ticks.push(function (dt, time) {
        if (!motes.visible) return;
        data.forEach(function (d, i) { d.y += d.v * dt; if (d.y > 5.5) d.y = -0.5; p.set(d.x + Math.sin(time * 0.4 + d.ph) * 0.3, d.y, d.z); sc.setScalar(d.s); m.compose(p, q, sc); motes.setMatrixAt(i, m); });
        motes.instanceMatrix.needsUpdate = true;
      });
      scene.add(motes);
    }
    X.setSet = function (k) {
      if (k === 'inside' && !dome) buildInside();
      X.set = k; env.group.visible = k === 'garden'; if (dome) dome.visible = motes.visible = k === 'inside'; Lab.loop.wake();
    };

    /* ------------------------------------------------------------------ tray */
    function thumb(fn, o) { return Lab.stage.bakeThumb(function (h) { h.add(fn()); }, o); }
    var th = {
      male: thumb(function () { return Mo.cat({ sex: 'male' }).group; }, { yaw: 0.7, pitch: 0.18 }),
      female: thumb(function () { return Mo.cat({ sex: 'female' }).group; }, { yaw: 0.7, pitch: 0.18 }),
      lens: thumb(function () { return Mo.magnifier(); }, { yaw: 0.3, pitch: 0.3 })
    };
    X.trayItems = function (ids) { return ids.map(function (id) { return { id: id, label: MD.tools[id], thumb: th[id] }; }); };
    UI.setTray(X.trayItems(CARDS), { onClick: function (item) { if (X.showCatInfo && (item.id === 'male' || item.id === 'female')) X.showCatInfo(item.id); } });

    /* ------------------------------------------------------------------ side panel */
    function stageName() {
      var p = state.phase, k = p >= PH.identify && p <= PH.adult ? p - 1 : -1;
      return k >= 0 ? MD.stageTitles[k] : p >= PH.sort ? MD.sort.title : APP.prepTitle;
    }
    function timelineCard() {
      var tl = X.tl, key = tl.key, marks = MD.marks[key], st = L.markStates(state, key), slider;
      slider = el('input', { class: 'tl-range', type: 'range', attrs: { min: 0, max: marks.length - 1, step: 0.01, 'aria-label': APP.timeTitle } });
      slider.value = Math.max(0, tl.t);
      slider.addEventListener('input', function () {
        if (tl.busy || X.busy) { slider.value = Math.max(0, tl.t); return; }
        var v = +slider.value, open = L.maxOpenMark(state, key);
        if (v > open + 0.02) { slider.value = Math.max(0, Math.min(open, tl.cur < 0 ? 0 : tl.cur)); if (performance.now() - tl.warned > 1500) { tl.warned = performance.now(); X.toast(MD.msg.markLocked, { type: 'warn' }); Lab.audio.play('wrong'); } return; }
        tl.t = v; tl.cfg.apply(v);
      });
      slider.addEventListener('change', function () { if (!tl.busy && !X.busy) X.tlGo(Math.round(+slider.value)); });
      return el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.timeTitle }), slider,
        el('div', { class: 'tl-marks' }, marks.map(function (m, i) {
          return el('button', { class: 'tl-mark ' + st[i] + (i === tl.cur ? ' current' : ''), attrs: { title: st[i] === 'locked' ? MD.msg.markLocked : '' }, on: { click: function () { X.touch(); X.tlGo(i); } } },
            el('span', { class: 'tl-dot', text: st[i] === 'done' ? '✓' : st[i] === 'locked' ? '🔒' : '' }), el('span', { class: 'tl-text', text: m }));
        })));
    }
    function infoCard(o) {
      var kids = [];
      if (o.title) kids.push(el('div', { class: 'info-title', text: o.title }));
      if (o.sub) kids.push(el('div', { class: 'info-sub', text: o.sub }));
      if (o.rows) kids.push(el('table', { class: 'info-table' }, el('thead', {}, el('tr', {}, MD.info.head.map(function (h) { return el('th', { text: h }); }))),
        el('tbody', {}, o.rows.map(function (r) { return el('tr', {}, el('th', { text: r[0] }), el('td', { text: r[1] })); }))));
      if (o.msg) kids.push(el('p', { class: 'task-text', text: o.msg }));
      if (o.lines && o.lines.length) kids.push(el('ul', { class: 'obs-list' }, o.lines.map(function (t) { return el('li', { text: t }); })));
      return el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.infoTitle }), kids);
    }
    function renderPanel() {
      var stack = el('div', { class: 'panel-stack' });
      if (X.review !== null && X.reviewRender) X.reviewRender(stack);
      else if (state.complete && X.finale) X.finale.render(stack);
      else {
        var key = L.promptKey(state);
        stack.appendChild(el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.stageTitle }), el('div', { class: 'stage-line', text: stageName() })));
        if (state.phase === PH.place) stack.appendChild(X.button(MD.buttons.start, 'btn-orange', function () { X.advance(); }, !L.canStart(state)));      // the buttons come first so they are never hidden
        else if (L.canAdvance(state) && !X.busy && !(X.tl && X.tl.busy) && state.phase !== PH.fertilize) {
          if (state.phase !== PH.zygote) stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: MD.msg.phaseDone })));
          stack.appendChild(X.button(state.phase === PH.zygote ? MD.buttons.embryo : APP.next, 'btn-orange', function () { X.advance(); }));
        }
        if (key && !X.busy && key !== 'startTask') stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: X.msgFor(key) })));
        if (X.tl) stack.appendChild(timelineCard());
        if (X.info) stack.appendChild(infoCard(X.info));
        X.panelHooks.forEach(function (fn) { fn(stack); });
      }
      UI.setPanel(stack);
    }
    X.refresh = function () {
      UI.setProgress(MD.steps, L.stepStates(state));
      UI.setCard('male', { ghost: state.malePlaced }); UI.setCard('female', { ghost: state.femalePlaced }); UI.setCard('lens', { ghost: Lab.lens.active() });
      renderPanel(); Lab.loop.wake();
    };

    /* ------------------------------------------------------------------ the timeline the growing stages use: cfg = {apply(t), arrive(i, again), t0} */
    X.tlBegin = function (key, cfg) { X.tl = { key: key, cfg: cfg, t: cfg.t0 == null ? 0 : cfg.t0, cur: -1, busy: false, warned: 0 }; cfg.apply(X.tl.t); X.refresh(); };
    X.tlEnd = function () { X.tl = null; X.refresh(); };
    X.tlGo = function (i) {
      var tl = X.tl; if (!tl || tl.busy || X.busy) return Promise.resolve();
      var r = L.decideMark(state, tl.key, i);
      if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } X.refresh(); return Promise.resolve(); }
      tl.busy = true; var from = tl.t, dur = Math.max(0.7, 1.5 * Math.abs(i - from)); X.refresh();
      return X.tween(dur, function (k) { tl.t = from + (i - from) * k; tl.cfg.apply(tl.t); }, 'inOutCubic').then(function () {
        tl.t = i; tl.cur = i; tl.busy = false; tl.cfg.apply(i);
        var res = L.applyMark(state, tl.key, i); Lab.audio.play('click'); if (tl.cfg.arrive) tl.cfg.arrive(i, r.again, res); X.refresh();
      });
    };

    /* ------------------------------------------------------------------ start and continue */
    X.advance = function () {
      if (!L.advance(state)) return;
      Lab.audio.play('step'); X.info = null; if (X.tl) X.tl = null; X.closeLens(); X.refresh();
      var f = X.enter[state.phase]; if (f) f();
      UI.caption(state.phase >= PH.identify && state.phase <= PH.adult ? MD.stageTitles[state.phase - 1] : '', { ms: 1600, cls: 'day' });
    };

    /* ------------------------------------------------------------------ the magnifier */
    function clearLensTag() { if (X.lensTag) { X.lensTag.remove(); X.lensTag = null; } }
    X.closeLens = function () { Lab.lens.hide(); clearLensTag(); };
    X.drops.lens = function (id, zid) {
      if (X.busy) return { ok: false, message: APP.busy };
      var t = zid && X.targets[zid] && X.targets[zid]() ? zid : null, lt = t && /^kitten\d$/.test(t) ? 'kitten' : t, r = L.decideLens(state, lt);
      if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
      var early = L.lensEarly(state, lt), res = L.applyLens(state, lt);
      showLens(t); if (res.credit && X.lensHooks[res.credit]) X.lensHooks[res.credit](res.credit); else if (X.lensHooks[t]) X.lensHooks[t](null, early);
      if (early && !res.credit) X.toast(X.msgFor(early), { type: 'info', ms: 5200 });
      X.refresh(); return { ok: true };
    };
    function showLens(t) {
      var pt = X.lensPoint[t] || function () { var b = X.targets[t](); return b.getCenter(new T.Vector3()); };
      Lab.audio.play('pop'); clearLensTag();
      Lab.lens.show({ world: pt, radius: 130, viewSize: X.lensSize[t] || 1.6, distance: 3.2, onClose: function () { clearLensTag(); X.refresh(); } });
      X.toast(APP.lensOn, { type: 'info', ms: 3200 });
    }
    TARGETS.forEach(function (name) {
      Lab.drag.addZone({ id: name, label: '', pad: 12, priority: 8, rect: function () { var b = X.targets[name] && X.targets[name](); return b ? Lab.stage.rectOf(b, 0) : null; }, accepts: function (it) { return it.id === 'lens'; } });
    });

    /* ------------------------------------------------------------------ drops and clicks are routed to the stage that owns them */
    Lab.drag.setHandler({ onStart: X.touch, onDrop: function (item, hits) { X.touch(); return handleDrop(item.id, hits[0] || null); } });
    function handleDrop(id, zid) {
      if (X.review !== null) return { ok: false };
      var f = X.drops[id] || (/^c\d$/.test(id) && X.drops.card);
      return f ? f(id, zid) : { ok: false };
    }
    X.handleDrop = handleDrop;
    function onDown(e) { downAt = { x: e.clientX, y: e.clientY }; }
    function onUp(e) {                                               // a click (not a drag) on the picture: what was hit, or null for "somewhere else"
      var d = downAt; downAt = null; if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 || X.busy || X.review !== null || document.querySelector('#modal-root .modal-back')) return;
      X.touch(); var hit = Lab.stage.pick(e.clientX, e.clientY);
      for (var i = 0; i < X.clicks.length; i++) if (X.clicks[i](hit)) return;
    }
    Lab.stage.canvas.addEventListener('pointerdown', onDown); Lab.stage.canvas.addEventListener('pointerup', onUp);
    X.disposers.push(function () { Lab.stage.canvas.removeEventListener('pointerdown', onDown); Lab.stage.canvas.removeEventListener('pointerup', onUp); veil.remove(); });

    /* the little hint: a card pulses when the student waits */
    hintTimer = setInterval(function () {
      if (X.busy || performance.now() - X.lastAction < 10000 || state.complete) return;
      var k = L.promptKey(state), id = k === 'placeMaleTask' ? 'male' : k === 'placeFemaleTask' ? 'female' : /LensTask$/.test(k || '') ? 'lens' : null;
      if (id) UI.setCard(id, { pulse: true });
    }, 1000);
    var stopTick = Lab.loop.add(function (dt, time) { X.ticks.forEach(function (f) { f(dt, time); }); }, { ambient: true });

    (Lab.exp8mods || []).forEach(function (m) { m(X); });
    X.refresh(); Lab.loop.wake();
    return {
      dispose: function () { clearInterval(hintTimer); stopTick(); X.disposers.forEach(function (f) { f(); }); Lab.stage.afterRender = null; },
      api: { state: function () { return state; }, X: X, drop: handleDrop, busy: function () { return X.busy; } }
    };
  }
})(window.Lab);
