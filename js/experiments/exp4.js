/* Experiment 4 – "Tìm hiểu sự trao đổi nước, không khí và thức ăn của động vật với môi trường" (chuột bạch).
   This file: the scene, the tool tray, the side panel, placing the rat, its information table, the cameras and the magnifier.
   exp4-air.js, exp4-wfw.js and exp4-finale.js add the rest through Lab.exp4mods and share the object `X`. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, UI = Lab.ui, L = Lab.logic.exp4, Mo = Lab.models;
  var CT = Lab.content.exp4, MD = CT.md, APP = CT.app;
  var POS = { x: 0, z: 0.3 }, HEADING = -1.1;
  var CARDS = ['mouse', 'food', 'water', 'magnifier'];
  var SHOTS = {
    overview: { cx: 0, cy: 1.0, cz: 0.3, w: 6.8, h: 3.7, pitch: 0.3, fov: 34 },
    air: { cx: 0, cy: 0.95, cz: 0.3, w: 4.6, h: 2.65, pitch: 0.06, fov: 34 },
    waste: { cx: 0.95, cy: 0.7, cz: 0.6, w: 5.6, h: 3.2, pitch: 0.25, fov: 34 },
    result: { cx: 0.2, cy: 0.95, cz: 0.5, w: 5.5, h: 3.4, pitch: 0.2, fov: 34 }
  };

  Lab.experiments.exp4 = { id: 'exp4', number: 4, title: APP.titlePrefix + MD.title, help: APP.help, create: create };

  function create(ctx) {
    var scene = ctx.scene, env = Lab.env.build(scene), state = L.initialState();
    var X = {
      T: T, U: U, UI: UI, L: L, Mo: Mo, MD: MD, APP: APP, scene: scene, env: env, state: state, POS: POS, HEADING: HEADING,
      rat: null, mode: 'overview', highlight: null, busy: 0, seq: 0, fx: [], leaveHooks: [], lastAction: performance.now(), finaleShown: false
    };
    var hintTimer = null, back;

    /* ------------------------------------------------------------------ helpers shared with the other files */
    X.esc = function (s) { return U.esc(s); };
    X.touch = function () { X.lastAction = performance.now(); CARDS.forEach(function (id) { UI.setCard(id, { pulse: false }); }); };
    X.toast = function (text, o) { if (text) UI.toast(text, o); };
    X.msgFor = function (key) { return (key && (MD.msg[key] || MD.prompt[key] || APP[key])) || ''; };
    X.addFx = function (h) { X.fx.push(h); return h; };
    X.stopFx = function () { X.fx.forEach(function (f) { f.stop(); }); X.fx.length = 0; };
    var timed = [];                                                         // labels that go away by themselves (or when the view changes)
    X.tag = function (text, world, cls, ms) {
      var h = Lab.labels.add({ text: text, cls: cls || 'part', world: world, anchor: 'center' });
      if (ms) {
        timed.push(h);
        Lab.tween.wait(ms / 1000).promise.then(function () { h.remove(); var i = timed.indexOf(h); if (i >= 0) timed.splice(i, 1); });
      }
      return h;
    };
    X.dispose = function (o) { if (o.parent) o.parent.remove(o); Lab.prim.disposeTree(o); };
    X.near = function (cur, target) { return cur + Math.atan2(Math.sin(target - cur), Math.cos(target - cur)); };   // the short way round

    X.shot = function (name, ms) { return Lab.stage.shot(SHOTS[name], ms == null ? 900 : ms); };
    X.leave = function () {
      X.seq++; X.stopFx(); timed.forEach(function (h) { h.remove(); }); timed.length = 0;
      X.leaveHooks.forEach(function (fn) { fn(); }); env.setDay(1);
    };
    X.go = function (mode, ms) {
      X.leave(); X.mode = mode; back.hidden = mode === 'overview'; X.shot(SHOTS[mode] ? mode : 'overview', ms); X.refresh();
    };
    Lab.stage.shot(SHOTS.overview, 0);
    UI.fitStage();

    /* the rat walks to a spot and turns to face something (md sections 7–8, 25–28) */
    X.ratGoto = async function (to, face, secs) {
      var g = X.rat.group, dx = to.x - g.position.x, dz = to.z - g.position.z, dist = Math.hypot(dx, dz), seq = X.seq;
      X.rat.pose.walk = 1;
      if (dist > 0.05) {
        await Lab.tween.to(g.rotation, { y: X.near(g.rotation.y, Math.atan2(dx, dz)) }, 0.35).promise;
        await Lab.tween.to(g.position, { x: to.x, z: to.z }, secs || Math.max(0.5, dist / 1.5), { ease: 'inOutQuad' }).promise;
      }
      await Lab.tween.to(g.rotation, { y: X.near(g.rotation.y, Math.atan2(face.x - to.x, face.z - to.z)) }, 0.4).promise;
      X.rat.pose.walk = 0;
      return seq === X.seq;
    };

    /* ------------------------------------------------------------------ tray */
    function thumb(fn, o) { return Lab.stage.bakeThumb(function (h) { h.add(fn()); }, o); }
    var th = {
      mouse: thumb(function () { return Mo.rat().group; }, { yaw: -0.75, pitch: 0.25 }),
      food: thumb(function () { return Mo.foodTray(); }, { yaw: 0.4, pitch: 0.5 }),
      water: thumb(function () { return Mo.waterBowl(); }, { yaw: 0.4, pitch: 0.5 }),
      magnifier: thumb(function () { return Mo.magnifier(); }, { yaw: 0.3, pitch: 0.3 })
    };
    UI.setTray(CARDS.map(function (id) { return { id: id, label: MD.tray[id], thumb: th[id] }; }), { onClick: function (item) { if (item.id === 'mouse') showInfo(); } });

    /* ------------------------------------------------------------------ side panel */
    function topicButton(k) {
      var st = L.topicState(state, k);
      var b = U.el('button', { class: 'btn topic-btn ' + st + (X.highlight === k ? ' pulse' : ''), attrs: { 'data-topic': k } }, U.el('span', { class: 'ico', text: st === 'locked' ? '🔒' : st === 'done' ? '✓' : '' }), MD.topics[k]);
      b.addEventListener('click', function () { X.touch(); onTopic(k); });
      return b;
    }
    function marks(names) {
      return U.el('div', { class: 'marks' }, names.map(function (n) {
        var st = L.subState(state, n), R = MD.right[n];
        return U.el('span', { class: 'mark-chip ' + st, text: st === 'done' ? R.mark : R.mark.replace(' ✓', '') });
      }));
    }
    function renderPanel() {
      var stack = U.el('div', { class: 'panel-stack' });
      if (X.finaleShown && X.finale) X.finale.render(stack);
      stack.appendChild(U.el('div', { class: 'panel-card' }, U.el('div', { class: 'panel-title', text: APP.chooseTopic }), topicButton('air'), topicButton('wfw')));
      if (state.topic) stack.appendChild(U.el('div', { class: 'panel-card' }, marks(state.topic === 'air' ? ['o2', 'co2'] : ['food', 'water', 'waste', 'urine'])));
      var keys = L.promptKeys(state);
      if (state.placed && keys.length && !X.finaleShown && !X.busy) stack.appendChild(U.el('div', { class: 'panel-card task-card' }, keys.map(function (k) { return U.el('p', { class: 'task-text', text: MD.prompt[k] }); }), X.extra || null));
      else if (!state.placed) stack.appendChild(U.el('div', { class: 'panel-card task-card' }, U.el('p', { class: 'task-text', text: MD.msg.mouseFirst })));
      else if (X.note && !X.finaleShown) stack.appendChild(U.el('div', { class: 'panel-card task-card' }, U.el('p', { class: 'task-text', text: X.note })));
      UI.setPanel(stack);
    }
    X.refresh = function () {
      UI.setProgress(MD.steps, L.stepStates(state));
      UI.setCard('mouse', { ghost: state.placed });
      UI.setCard('food', { ghost: state.foodIn, used: state.foodIn });
      UI.setCard('water', { ghost: state.waterIn, used: state.waterIn });
      UI.setCard('magnifier', { ghost: Lab.lens.active() });
      renderPanel(); Lab.loop.wake();
    };
    function onTopic(k) {
      if (X.busy) return;
      if (!state.placed) { X.toast(MD.msg.mouseFirst, { type: 'warn' }); Lab.audio.play('wrong'); return; }
      L.selectTopic(state, k); if (X.highlight === k) X.highlight = null;
      Lab.audio.play('click');
      if (k === 'air') X.air.enter(); else X.wfw.enter();
    }

    /* ------------------------------------------------------------------ zones (tools from the tray) */
    var benchBox = new T.Box3(new T.Vector3(-4.3, 0, -2.0), new T.Vector3(4.3, 0.05, 2.35));
    X.nearBox = function () { var p = X.rat.group.position; return new T.Box3(new T.Vector3(p.x - 3.4, 0, p.z - 1.9), new T.Vector3(p.x + 1.8, 1.6, p.z + 1.9)); };
    function zone(id, label, priority, pad, rectFn) {
      Lab.drag.addZone({ id: id, label: label, pad: pad, priority: priority, rect: rectFn, accepts: function (item) { return L.decideTool(state, item.id, id === 'bench' ? 'table' : id).ok; } });
    }
    zone('bench', 'BÀN QUAN SÁT', 0, 0, function () { return Lab.stage.rectOf(benchBox, 0); });
    zone('near', '', 3, 0, function () { return X.rat ? Lab.stage.rectOf(X.nearBox(), 0) : null; });
    zone('mouse', '', 6, 6, function () { return X.rat ? Lab.stage.rectOf(X.rat.bodyBox(), 0) : null; });
    Lab.drag.setHandler({ onStart: X.touch, onDrop: function (item, hits, pt) { X.touch(); return handleDrop(item.id, hits[0] || null, pt); } });

    function handleDrop(tool, zoneId, pt) {
      if (X.busy) return { ok: false, message: APP.busy };                  // the rat is still walking, eating or drinking
      var r = L.decideTool(state, tool, zoneId === 'bench' ? 'table' : zoneId);
      if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
      L.applyTool(state, r.action);
      Lab.audio.play('pop');
      if (r.action === 'place') placeRat();
      else if (r.action === 'food') X.wfw.food();
      else if (r.action === 'water') X.wfw.water();
      else if (r.action === 'magnify') magnify(pt);
      X.refresh();
      return { ok: true };
    }
    X.handleDrop = handleDrop;

    /* ------------------------------------------------------------------ placing the rat (md section 14) */
    function placeRat() {
      var rat = X.rat = Mo.rat();
      rat.group.position.set(POS.x, 4.4, POS.z); rat.group.rotation.y = HEADING; rat.group.userData.pick = 'rat'; scene.add(rat.group);
      X.busy++;
      Lab.tween.to(rat.group.position, { y: 0 }, 0.85, { ease: 'outBounce' }).promise.then(function () {
        X.busy--;
        Lab.fx.ringPulse(scene, new T.Vector3(POS.x, 0, POS.z), 0x4caf50, 2.2); Lab.fx.sparkles(scene, new T.Vector3(POS.x, 0.9, POS.z + 0.5), 0xffe066, 10);
        Lab.audio.play('ok'); X.toast(MD.placed, { type: 'ok', ms: 5200 }); X.refresh();
      });
    }

    /* ------------------------------------------------------------------ information table and magnifier */
    function showInfo() {
      var t = MD.info;
      var html = '<table class="info-table"><thead><tr>' + t.head.map(function (h) { return '<th>' + X.esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        t.rows.map(function (r) { return '<tr><th>' + X.esc(r[0]) + '</th><td>' + X.esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table>';
      var m = UI.modal(U.el('div', {}, U.el('div', { html: html }), U.el('div', { class: 'confirm-actions', style: { marginTop: '18px' } },
        U.el('button', { class: 'btn', text: t.close, attrs: { 'data-autofocus': '1' }, on: { click: function () { m.close(); } } }))), { wide: false });
    }
    /* the magnifier looks at the food tray or the bowl when it is dropped on one, otherwise at the rat (its lungs when it is see-through) */
    function lensSubject(pt) {
      var best = null, bd = 130;
      ['food', 'water'].forEach(function (k) {
        var it = X.items && X.items[k]; if (!it || !pt) return;
        var p = Lab.stage.project(it.position.clone().add(new T.Vector3(0, 0.2, 0))), d = Math.hypot(p.x - pt.x, p.y - pt.y);
        if (d < bd) { bd = d; best = k; }
      });
      return best;
    }
    function magnify(pt) {
      var rat = X.rat, see = rat.xray > 0.5, what = see ? null : lensSubject(pt), item = what && X.items[what], label = see ? MD.labels.lungs : what ? MD.labels[what] : null;
      var world = function () { return item ? item.position.clone().add(new T.Vector3(0, 0.25, 0)) : see ? rat.lungsWorld() : rat.world(new T.Vector3(0, 0.55, 1.1)); };
      var handle = Lab.lens.show({ world: world, radius: 120, viewSize: 1.3, distance: 2.4, onClose: function () { X.refresh(); } });
      if (label) X.tag(label, function () { return world().add(new T.Vector3(0, 0.95, 0)); }, 'part', 4200);
      X.toast(APP.magOn, { type: 'info', ms: 4600 });
      return handle;
    }
    X.leaveHooks.push(function () { Lab.lens.hide(); });
    Lab.stage.onPick(function (hit) {
      if (!state.placed || X.busy) return; X.touch();
      if (hit.id === 'waste' || hit.id === 'urine') X.wfw.excrete(hit.id, 'out');
      else if (hit.id === 'rat') {
        var kind = X.wfw.pending();                                         // the fur is hit first: a tap over the belly means the waste or urine inside
        if (kind && X.wfw.isNear(kind, hit.point)) X.wfw.excrete(kind, 'out');
        else if (X.rat.xray < 0.3) showInfo();
      }
    });

    back = U.el('button', { class: 'btn btn-blue mode-back', text: '↩ ' + APP.backToTable, hidden: true });
    back.addEventListener('click', function () { X.touch(); X.go('overview'); });
    UI.el.hud.appendChild(back);

    /* ------------------------------------------------------------------ the other files add their parts */
    (Lab.exp4mods || []).forEach(function (m) { m(X); });

    Lab.loop.add(function (dt, time) { if (X.rat) X.rat.update(dt, time); }, { ambient: true });
    hintTimer = setInterval(function () {
      if (X.busy || performance.now() - X.lastAction < 10000 || state.finished) return;
      if (!state.placed) UI.setCard('mouse', { pulse: true });
      else if (!state.topic) { X.highlight = X.highlight || 'air'; X.refresh(); }
    }, 1000);

    X.refresh(); Lab.loop.wake();
    return {
      dispose: function () { clearInterval(hintTimer); Lab.stage.onPick(null); X.stopFx(); Lab.stage.afterRender = null; if (back.parentNode) back.parentNode.removeChild(back); },
      api: { state: function () { return state; }, X: X, drop: handleDrop, busy: function () { return X.busy; } }
    };
  }
})(window.Lab);
