/* Experiment 7 – "Tìm hiểu sự sinh sản và vòng đời của động vật đẻ trứng – Bướm".
   This file: the garden with the host plant, the tool tray (male, female, magnifier, leaf, ruler), the side panel, the drop areas and the shared helpers
   (flying, walking, name tags, cameras). The other files add the stages through Lab.exp7mods and share the object `X`:
   exp7-bfly.js (two butterflies, mating, fertilization, egg laying), exp7-egg.js (magnifier, hatching), exp7-larva.js (feeding, moults, ruler, pupation),
   exp7-pupa.js (the pupa, the 3D cut, emergence), exp7-finale.js (sorting the four stages, the end). Logic: js/logic/exp7.js. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, UI = Lab.ui, L = Lab.logic.exp7, Mo = Lab.models;
  var CT = Lab.content.exp7, MD = CT.md, APP = CT.app;
  var PZ = -0.4;                                                     // the plant stands this far behind the middle of the table
  var CARDS = ['male', 'female', 'lens', 'leaf', 'ruler'];
  var SHOTS = {
    garden: { cx: 0.35, cy: 2.15, cz: PZ, w: 8.6, h: 5.0, pitch: 0.28, fov: 34 },
    pair: { cx: 1.9, cy: 3.75, cz: PZ, w: 4.6, h: 3.0, pitch: 0.18, fov: 34 },
    leaf: { cx: 2.3, cy: 1.9, cz: PZ + 0.2, w: 4.6, h: 2.8, pitch: 0.34, fov: 34 },
    under: { cx: 2.4, cy: 1.55, cz: PZ + 0.25, w: 3.8, h: 2.3, pitch: -0.46, fov: 34 },
    sort: { cx: 0.3, cy: 1.9, cz: 0.2, w: 9.4, h: 5.6, pitch: 0.42, fov: 34 }
  };
  function V(x, y, z) { return new T.Vector3(x, y, z); }

  Lab.experiments.exp7 = { id: 'exp7', number: 7, title: APP.titlePrefix + MD.title, help: APP.help, create: create };

  function create(ctx) {
    var scene = ctx.scene, env = Lab.env.build(scene), state = L.initialState(), el = U.el;
    var hp = Mo.hostPlant(); hp.group.position.set(0, 0, PZ); scene.add(hp.group);
    var X = {
      T: T, U: U, UI: UI, L: L, Mo: Mo, MD: MD, APP: APP, scene: scene, env: env, state: state, PZ: PZ, SHOTS: SHOTS, V: V, plant: hp,
      bf: [], busy: 0, growing: false, mode: 'garden', drops: {}, panelHooks: [], targets: {}, ticks: [], lensHooks: {}, disposers: [], lastAction: performance.now(), note: null, lensTag: null
    };
    var timed = [], hintTimer = null;
    X.spot = {                                                       // places in the garden (world coordinates)
      perch: function (u) { return hp.branchAt(u).add(V(0, 0.16, PZ)); },
      hang: function (u) { return hp.branchAt(u).add(V(0, -0.03, PZ)); },
      leafTop: function (s, w) { return V(1.0 + s * 2.5, 1.75 - 0.225 * s * s + 0.01, PZ + 0.16 + w); },
      egg: V(2.55, 1.655, PZ + 0.3),
      from: V(-4.4, 4.7, 1.4), away: V(-4.6, 5.4, 2.0)
    };

    /* ------------------------------------------------------------------ helpers shared with the other files */
    X.touch = function () { X.lastAction = performance.now(); CARDS.forEach(function (id) { UI.setCard(id, { pulse: false }); }); };
    X.toast = function (text, o) { if (text) UI.toast(text, o); };
    X.msgFor = function (key) { return (key && (MD.msg[key] || APP[key])) || ''; };
    X.tag = function (text, world, cls, ms, extra) {
      var h = Lab.labels.add(Object.assign({ text: text, cls: cls || 'part', world: world, anchor: 'center' }, extra || {}));
      if (ms) { timed.push(h); Lab.tween.wait(ms / 1000).promise.then(function () { h.remove(); var i = timed.indexOf(h); if (i >= 0) timed.splice(i, 1); }); }
      return h;
    };
    X.clearTimed = function () { timed.forEach(function (h) { h.remove(); }); timed.length = 0; };
    X.dispose = function (o) { if (o.parent) o.parent.remove(o); Lab.prim.disposeTree(o); };
    X.shot = function (name, ms) { var s = typeof name === 'string' ? SHOTS[name] : name; X.mode = typeof name === 'string' ? name : 'custom'; return Lab.stage.shot(s, ms == null ? 900 : ms); };
    X.wait = function (s) { return Lab.tween.wait(s).promise; };
    X.day = function (d) { UI.caption(MD.days[L.DAYS.indexOf(d)], { ms: 1100, cls: 'day' }); Lab.audio.play('click'); X.refresh(); };
    X.stageName = function () { var st = L.stepStates(state), i = 0; while (i < st.length - 1 && st[i] === 'done') i++; return MD.steps[i]; };
    /* a butterfly flies through the points (a smooth curve), looks the way it goes and bobs a little; it ends in `endMode` */
    X.fly = function (b, pts, secs, endMode) {
      var curve = new T.CatmullRomCurve3(pts, false, 'centripetal'), g = b.group; b.mode = 'fly';
      return Lab.tween.value(secs, function (k) {
        var p = curve.getPoint(k), t = curve.getTangent(k);
        g.position.copy(p); g.position.y += 0.07 * Math.sin(k * secs * 8) * Math.sin(k * Math.PI);
        if (Math.abs(t.x) + Math.abs(t.z) > 0.05) g.rotation.y = Math.atan2(-t.z, t.x);
        g.rotation.z = 0.3 * Math.max(-1, Math.min(1, t.y * 2));
      }, { ease: Lab.tween.ease.inOutSine }).promise.then(function () { b.mode = endMode || 'perch'; g.rotation.z = 0; });
    };
    X.turn = function (b, yaw, secs) {                                // the shortest way round
      var g = b.group, d = ((yaw - g.rotation.y + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
      return Lab.tween.to(g.rotation, { y: g.rotation.y + d }, secs || 0.5, { ease: 'inOutCubic' }).promise;
    };
    X.newButterfly = function (sex) { var b = Mo.butterfly(sex); b.group.rotation.order = 'YXZ'; scene.add(b.group); X.bf.push(b); return b; };
    X.button = function (text, cls, fn, locked) {
      return el('button', { class: 'btn ' + (cls || 'btn-orange') + ' panel-btn' + (locked ? ' locked' : ''), text: text, attrs: locked ? { title: MD.msg.locked } : {},
        on: { click: function () { X.touch(); if (locked) { X.toast(MD.msg.locked, { type: 'warn' }); Lab.audio.play('wrong'); } else fn(); } } });
    };
    Lab.stage.shot(SHOTS.garden, 0);
    UI.fitStage();

    /* ------------------------------------------------------------------ tray */
    function thumb(fn, o) { return Lab.stage.bakeThumb(function (h) { h.add(fn()); }, o); }
    function butterflyThumb(sex) { var b = Mo.butterfly(sex); b.mode = 'hold'; b.hold = 0.4; b.update(0); return b.group; }
    var th = {
      male: thumb(function () { return butterflyThumb('male'); }, { yaw: 0.5, pitch: 0.75 }),
      female: thumb(function () { return butterflyThumb('female'); }, { yaw: 0.5, pitch: 0.75 }),
      lens: thumb(function () { return Mo.magnifier(); }, { yaw: 0.3, pitch: 0.3 }),
      leaf: thumb(function () { return Mo.leafPiece(1.3).group; }, { yaw: 0.4, pitch: 0.7 }),
      ruler: thumb(function () { return Mo.ruler(); }, { yaw: 0.3, pitch: 0.6 })
    };
    X.trayItems = function (ids) { return ids.map(function (id) { return { id: id, label: MD.tools[id], thumb: th[id] }; }); };
    UI.setTray(X.trayItems(CARDS), { onClick: function () { } });

    /* ------------------------------------------------------------------ side panel */
    function renderPanel() {
      var stack = el('div', { class: 'panel-stack' }), key = L.promptKey(state);
      if (state.complete && X.finale) X.finale.render(stack);
      else {
        if (key && !X.busy) stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: X.msgFor(key) })));
        stack.appendChild(el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.stageTitle }), el('div', { class: 'stage-line', text: X.stageName() })));
        if (state.eggLaid) stack.appendChild(X.timeCard());
        var marks = [[state.eggObserved, MD.marks.eggs], [state.larvaFed, MD.marks.fed], [state.pupaObserved, MD.marks.pupa], [state.cutawayObserved, MD.marks.inside]].filter(function (m) { return m[0]; });
        if (marks.length) stack.appendChild(el('div', { class: 'panel-card' }, el('div', { class: 'marks' }, marks.map(function (m) { return el('span', { class: 'mark-chip done', text: m[1] }); }))));
        if (X.note) stack.appendChild(el('div', { class: 'panel-card task-card' }, el('p', { class: 'task-text', text: X.note })));
        X.panelHooks.forEach(function (fn) { fn(stack); });
      }
      UI.setPanel(stack);
    }
    X.timeCard = function () {
      var ds = L.dayStates(state);
      return el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.timeTitle }), el('div', { class: 'timeline' }, MD.days.map(function (d, i) {
        return el('div', { class: 'tl-item ' + ds[i] }, el('span', { class: 'tl-dot' }), el('span', { class: 'tl-text', text: d.replace('NGÀY ', '') }));
      })));
    };
    X.refresh = function () {
      UI.setProgress(MD.steps, L.stepStates(state), { locked: MD.msg.locked });
      UI.setCard('male', { ghost: state.malePlaced }); UI.setCard('lens', { ghost: Lab.lens.active() });
      UI.setCard('female', { ghost: state.femalePlaced && !(state.continued && !state.eggLaid && !X.busy) });
      UI.setCard('ruler', { ghost: !!X.rulerOn }); UI.setCard('leaf', { ghost: !!X.leafBusy });
      renderPanel(); Lab.loop.wake();
    };

    /* ------------------------------------------------------------------ drop areas */
    var gardenBox = new T.Box3(V(-4.6, 0, -2.2), V(4.6, 4.6, 2.35)), leafBox = new T.Box3(V(1.0, 1.45, PZ - 0.5), V(3.6, 2.15, PZ + 0.85));
    Lab.drag.addZone({ id: 'garden', label: APP.zone, pad: 0, priority: 0, rect: function () { return Lab.stage.rectOf(gardenBox, 0); }, accepts: function (it) { return (it.id === 'male' || it.id === 'female') && !(it.id === 'female' && state.continued); } });
    Lab.drag.addZone({ id: 'leaf', label: MD.tools.leaf, pad: 8, priority: 5, rect: function () { return Lab.stage.rectOf(leafBox, 0); }, accepts: function (it) { return it.id === 'female' && state.continued && !state.eggLaid; } });
    ['eggs', 'larva', 'pupa'].forEach(function (name) {
      Lab.drag.addZone({
        id: name, label: '', pad: 12, priority: 8, rect: function () { var b = X.targets[name] && X.targets[name](); return b ? Lab.stage.rectOf(b, 0) : null; },
        accepts: function (it) { return it.id === 'lens' || (name === 'larva' && (it.id === 'leaf' || it.id === 'ruler')); }
      });
    });
    Lab.drag.setHandler({ onStart: X.touch, onDrop: function (item, hits) { X.touch(); return handleDrop(item.id, hits[0] || null); } });
    function handleDrop(id, zid) {
      var f = X.drops[id] || (/^c\d$/.test(id) && X.drops.card);
      return f ? f(id, zid) : { ok: false };
    }
    X.handleDrop = handleDrop;

    /* the little hint: a card pulses when the student waits for a while */
    hintTimer = setInterval(function () {
      if (X.busy || X.growing || performance.now() - X.lastAction < 10000 || state.complete) return;
      var k = L.promptKey(state), id = k === 'placeTask' ? (state.malePlaced ? 'female' : 'male') : k === 'layTask' ? 'female' : k === 'lensEggsTask' || k === 'lensPupaTask' ? 'lens' : k === 'feedTask' ? 'leaf' : null;
      if (id) UI.setCard(id, { pulse: true });
    }, 1000);
    var stopTick = Lab.loop.add(function (dt, time) { X.bf.forEach(function (b) { b.update(time); }); X.ticks.forEach(function (f) { f(dt, time); }); }, { ambient: true });

    (Lab.exp7mods || []).forEach(function (m) { m(X); });
    X.refresh(); Lab.loop.wake();
    return {
      dispose: function () { clearInterval(hintTimer); stopTick(); X.disposers.forEach(function (f) { f(); }); Lab.stage.afterRender = null; },
      api: { state: function () { return state; }, X: X, drop: handleDrop, busy: function () { return X.busy; } }
    };
  }
})(window.Lab);
