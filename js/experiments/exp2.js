/* Experiment 2 – "Tìm hiểu sự trao đổi khí, nước và chất khoáng của thực vật với môi trường" (cây rau cải).
   This file: the scene, the tool tray, the side panel, placing the plant, clicking its parts and the cameras.
   The rest lives in exp2-gas.js, exp2-water.js, exp2-tools.js and exp2-finale.js; each adds itself to Lab.exp2mods and
   receives the shared object `X` (state, helpers, the plant) when the experiment is created. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, UI = Lab.ui, L = Lab.logic.exp2, Mo = Lab.models;
  var CT = Lab.content.exp2, MD = CT.md, APP = CT.app;
  var POS = { x: 0, z: 0.3 };
  var CARDS = ['pot', 'water', 'minerals', 'magnifier', 'box'];

  Lab.experiments.exp2 = { id: 'exp2', number: 2, title: APP.titlePrefix + MD.title, help: APP.help, create: create };

  function create(ctx) {
    var scene = ctx.scene, env = Lab.env.build(scene), state = L.initialState();
    var X = {
      T: T, U: U, UI: UI, L: L, Mo: Mo, MD: MD, APP: APP, scene: scene, env: env, state: state, POS: POS,
      plant: null, mode: 'overview', task: null, highlight: null, busy: 0, seq: 0, fx: [], lastAction: performance.now(), leaveHooks: []
    };
    var hintTimer = null, back;

    /* ------------------------------------------------------------------ helpers shared with the other files */
    X.esc = function (s) { return U.esc(s); };
    X.touch = function () { X.lastAction = performance.now(); CARDS.forEach(function (id) { UI.setCard(id, { pulse: false }); }); };
    X.toast = function (text, o) { if (text) UI.toast(text, o); };
    X.msgFor = function (key) { return (key && (MD.msg[key] || APP[key] || MD.prompt[key])) || ''; };
    X.addFx = function (h) { X.fx.push(h); return h; };
    X.stopFx = function () { X.fx.forEach(function (f) { f.stop(); }); X.fx.length = 0; };
    X.tag = function (text, world, cls, ms) {                                  // a small name tag that follows a point of the scene
      var h = Lab.labels.add({ text: text, cls: cls || 'part', world: world, anchor: 'center' });
      if (ms) Lab.tween.wait(ms / 1000).promise.then(function () { h.remove(); });
      return h;
    };
    X.dispose = function (o) { if (o.parent) o.parent.remove(o); Lab.prim.disposeTree(o); };
    X.worldOf = function (o) { var v = new T.Vector3(); o.updateMatrixWorld(true); return o.getWorldPosition(v); };

    /* cameras: the whole plant, close to the leaves, the soil cut open, and the wide view for the finale */
    var SHOTS = {
      overview: { cx: 0, cy: 1.75, cz: 0.3, w: 5.4, h: 4.5, pitch: 0.24, fov: 34 },
      synth: { cx: 0, cy: 1.8, cz: 0.3, w: 6.0, h: 4.9, pitch: 0.2, fov: 34 },
      root: { cx: 0, cy: 0.8, cz: 0.3, w: 3.2, h: 2.6, pitch: 0.05, fov: 34 }
    };
    X.shotSpec = function (name) { if (name === 'leaf') { var lp = X.plant.leafPoint(); return { cx: lp.x, cy: lp.y - 0.05, cz: 0.4, w: 4.8, h: 3.6, pitch: 0.1, fov: 34 }; } return SHOTS[name]; };
    X.shot = function (name, ms) { return Lab.stage.shot(X.shotSpec(name), ms == null ? 900 : ms); };
    /* leave what the current mode showed (molecules, flows, tags…) and look at another view */
    X.leave = function () { X.seq++; X.stopFx(); X.leaveHooks.forEach(function (fn) { fn(); }); env.setDay(1); };
    X.go = function (mode, ms) {
      if (mode !== 'overview' && X.tools) X.tools.liftBox(true);              // the box must not hide the leaves or the roots
      X.leave(); X.mode = mode; X.task = null; back.hidden = mode === 'overview' || mode === 'synth'; X.shot(mode, ms); X.refresh();
    };

    Lab.stage.shot(SHOTS.overview, 0);
    UI.fitStage();

    /* ------------------------------------------------------------------ tray */
    function thumb(fn, o) { return Lab.stage.bakeThumb(function (h) { h.add(fn()); }, o); }
    var th = {
      pot: thumb(function () { return Mo.cabbagePot().group; }, { yaw: 0.35, pitch: 0.18 }),
      water: thumb(function () { return Mo.wateringCan(); }, { yaw: -0.45, pitch: 0.2 }),
      minerals: thumb(function () { return Mo.npkBag(); }, { yaw: 0.4, pitch: 0.15 }),
      magnifier: thumb(function () { return Mo.magnifier(); }, { yaw: 0.3, pitch: 0.3 }),
      box: thumb(function () { return Mo.clearBox(); }, { yaw: 0.35, pitch: 0.22 })
    };
    UI.setTray(CARDS.map(function (id) { return { id: id, label: MD.tray[id], thumb: th[id] }; }));

    /* ------------------------------------------------------------------ side panel (rebuilt whenever something changes) */
    function topicButton(k) {
      var st = L.topicState(state, k);
      var b = U.el('button', { class: 'btn topic-btn ' + st + (X.highlight === k ? ' pulse' : ''), attrs: { 'data-topic': k } },
        U.el('span', { class: 'ico', text: st === 'locked' ? '🔒' : st === 'done' ? '✓' : '' }), MD.topics[k]);
      b.addEventListener('click', function () { X.touch(); onTopic(k); });
      return b;
    }
    function subButtons(names) {
      return U.el('div', { class: 'sub-row' }, names.map(function (n) {
        var st = L.subState(state, n);
        var b = U.el('button', { class: 'btn btn-blue sub-btn ' + st, attrs: { 'data-sub': n } }, U.el('span', { class: 'ico', text: st === 'done' ? '✓' : '' }), MD.subs[n]);
        b.addEventListener('click', function () { X.touch(); onSub(n); });
        return b;
      }));
    }
    function renderPanel() {
      var stack = U.el('div', { class: 'panel-stack' });
      if (X.finaleShown && X.finale) X.finale.render(stack);                  // the completion cards come first
      stack.appendChild(U.el('div', { class: 'panel-card' }, U.el('div', { class: 'panel-title', text: APP.chooseTopic }), topicButton('air'), topicButton('water')));
      if (state.topic === 'air') stack.appendChild(U.el('div', { class: 'panel-card' }, U.el('div', { class: 'panel-title', text: APP.chooseGas }), subButtons(['resp', 'photo'])));
      else if (state.topic === 'water') stack.appendChild(U.el('div', { class: 'panel-card' }, U.el('div', { class: 'panel-title', text: APP.choosePart }), subButtons(['water', 'minerals'])));
      if (X.task) stack.appendChild(U.el('div', { class: 'panel-card task-card' }, U.el('p', { class: 'task-text', text: X.task.text }), X.task.legend ? U.el('div', { class: 'legend' }, X.task.legend) : null));
      else if (state.placed && !state.topic && !state.finished) stack.appendChild(U.el('div', { class: 'panel-card task-card' }, U.el('p', { class: 'task-text', text: APP.tapParts })));
      UI.setPanel(stack);
    }
    X.refresh = function () {
      var steps = L.stepStates(state);
      if (!X.finaleShown) steps[3] = 'locked';                                // "HOÀN THÀNH" only once the last effect has played
      UI.setProgress(MD.steps, steps, MD.stateNames);
      UI.setCard('pot', { ghost: state.placed });
      UI.setCard('water', { ghost: state.water, used: state.water });
      UI.setCard('minerals', { ghost: state.minerals, used: state.minerals });
      UI.setCard('box', { ghost: state.box });
      UI.setCard('magnifier', { ghost: Lab.lens.active() });
      renderPanel();
      Lab.loop.wake();
    };

    /* ------------------------------------------------------------------ topic and sub buttons */
    function onTopic(k) {
      if (X.busy) return;
      if (!state.placed) { X.toast(MD.msg.potOff, { type: 'warn' }); Lab.audio.play('wrong'); return; }
      if (X.tools) X.tools.liftBox(true);
      L.selectTopic(state, k);
      if (X.highlight === k) X.highlight = null;
      Lab.audio.play('click');
      if (k === 'air') X.gas.enter(); else X.wm.enter();
    }
    function onSub(n) {
      if (X.busy) return;
      Lab.audio.play('click');
      if (n === 'resp' || n === 'photo') X.gas.start(n); else X.wm.start(n);
    }

    /* ------------------------------------------------------------------ zones + drag handler (tools from the tray) */
    var benchBox = new T.Box3(new T.Vector3(-4.3, 0, -2.0), new T.Vector3(4.3, 0.05, 2.35));
    function zone(id, label, priority, pad, box) {
      Lab.drag.addZone({
        id: id, label: label, pad: pad, priority: priority,
        rect: function () { return id === 'bench' ? Lab.stage.rectOf(benchBox, 0) : X.plant ? Lab.stage.rectOf(X.plant[box](), 0) : null; },
        accepts: function (item) { return L.decideTool(state, item.id, id === 'bench' ? 'table' : id).ok; }
      });
    }
    zone('bench', 'BÀN QUAN SÁT', 0, 0); zone('plant', '', 3, 6, 'wholeBox');
    zone('leaf', MD.parts.leaf.tag, 6, 4, 'foliageBox'); zone('stem', MD.parts.stem.tag, 6, 6, 'stemBox'); zone('soil', APP.zoneSoil, 6, 4, 'soilBox');
    Lab.drag.setHandler({ onStart: X.touch, onDrop: function (item, hits) { X.touch(); return handleDrop(item.id, hits[0] || null); } });

    /* one function decides everything that a drop does (drag & drop, and the tests, both use it) */
    function handleDrop(tool, zoneId) {
      var r = L.decideTool(state, tool, zoneId === 'bench' ? 'table' : zoneId);
      if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
      var out = L.applyTool(state, r.action);
      Lab.audio.play('pop');
      if (r.action === 'place') placePlant();
      else if (r.action === 'water') X.wm.water(out);
      else if (r.action === 'minerals') X.wm.minerals(out);
      else if (r.action === 'magnify') X.tools.magnify(r.target);
      else if (r.action === 'box') X.tools.box();
      X.refresh();
      return { ok: true };
    }
    X.handleDrop = handleDrop;

    /* ------------------------------------------------------------------ placing the plant (md sections 7–9) */
    function placePlant() {
      var plant = X.plant = Mo.cabbagePot();
      plant.group.position.set(POS.x, 4.6, POS.z); scene.add(plant.group);
      X.busy++;
      Lab.tween.to(plant.group.position, { y: 0 }, 0.9, { ease: 'outBounce' }).promise.then(function () {
        X.busy--;
        Lab.fx.ringPulse(scene, new T.Vector3(POS.x, 0, POS.z), 0x4caf50, 2.2);
        Lab.fx.sparkles(scene, new T.Vector3(POS.x, 1.2, POS.z + 0.6), 0xffe066, 12);
        Lab.audio.play('ok');
        plant.glow('leaf', 1); Lab.tween.value(1.4, function (k) { plant.glow('leaf', 1 - k); }, { ease: 'outQuad' });
        X.toast(MD.placed, { type: 'ok', ms: 5200 });
        X.refresh();
      });
    }

    /* ------------------------------------------------------------------ clicking a part of the plant (md sections 10–13) */
    var tagNow = null;
    X.showPart = function (part) {
      var info = MD.parts[part], plant = X.plant;
      if (tagNow) { tagNow.remove(); tagNow = null; }
      if (part === 'leaf') { plant.glow('leaf', 1); Lab.tween.value(1.6, function (k) { plant.glow('leaf', 1 - k); }, { ease: 'outQuad' }); }
      else if (part === 'stem') { plant.glow('stem', 1); Lab.tween.value(1.6, function (k) { plant.glow('stem', 1 - k); }, { ease: 'outQuad' }); }
      var at = part === 'leaf' ? plant.leafPoint().add(new T.Vector3(0, 0.9, 0.3)) : part === 'stem' ? plant.leafPoint().setX(0.5).setY(1.9) : plant.rootPoint().add(new T.Vector3(0, -0.7, 0.3));
      tagNow = X.tag(info.tag, at.clone(), 'part', 3200);
      X.toast(info.text, { type: 'info', ms: 5200 });
      if (part === 'soil') { if (X.mode !== 'root') X.go('root'); }
      else if (part === 'leaf' && X.mode === 'overview') {                    // a light zoom on the leaves, then back
        Lab.stage.shot({ cx: 0.1, cy: 2.3, cz: 0.4, w: 4.0, h: 3.4, pitch: 0.16, fov: 34 }, 700);
        Lab.tween.wait(3.2).promise.then(function () { if (X.mode === 'overview') X.shot('overview', 800); });
      }
    };
    Lab.stage.onPick(function (hit) {
      if (!state.placed || X.busy) return;
      X.touch();
      if (hit.id === 'leaf' || hit.id === 'stem' || hit.id === 'soil') X.showPart(hit.id);
      else if (hit.id === 'box' && X.tools) X.tools.liftBox();
    });

    back = U.el('button', { class: 'btn btn-blue mode-back', text: '↩ ' + APP.backToTable, hidden: true });
    back.addEventListener('click', function () { X.touch(); X.go('overview'); });
    UI.el.hud.appendChild(back);

    /* ------------------------------------------------------------------ the other files add their parts */
    (Lab.exp2mods || []).forEach(function (m) { m(X); });

    Lab.loop.add(function (dt, time) { if (X.plant) X.plant.idle(time); }, { ambient: true });
    hintTimer = setInterval(function () {
      if (X.busy || performance.now() - X.lastAction < 10000 || state.finished) return;
      if (!state.placed) UI.setCard('pot', { pulse: true });
      else if (!state.topic) { X.highlight = X.highlight || 'air'; X.refresh(); }
    }, 1000);

    X.refresh();
    Lab.loop.wake();

    return {
      dispose: function () {
        clearInterval(hintTimer); Lab.stage.onPick(null); X.stopFx(); Lab.stage.afterRender = null;
        if (back.parentNode) back.parentNode.removeChild(back);
      },
      /* small handle for automated tests */
      api: { state: function () { return state; }, X: X, drop: handleDrop, busy: function () { return X.busy; } }
    };
  }
})(window.Lab);
