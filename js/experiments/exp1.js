/* Experiment 1 – "Tìm hiểu các yếu tố cần thiết cho sự sống và phát triển của thực vật" (cây đậu xanh).
   Wires the pure logic (js/logic/exp1.js) to the 3D models, the tray, the thermostat and the results. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, UI = Lab.ui, L = Lab.logic.exp1, Mo = Lab.models;
  var CT = Lab.content.exp1, MD = CT.md, APP = CT.app;

  var POS = { A: { x: -2.3, z: 0.45 }, B: { x: 2.3, z: 0.45 } };
  var OVERVIEW = { cx: 0, cy: 2.0, cz: 0.4, w: 7.6, h: 5.0, pitch: 0.33, fov: 34 };
  var RESULTS = { cx: 0, cy: 2.0, cz: 0.4, w: 7.2, h: 4.9, pitch: 0.3, fov: 34 };
  var DAY_SECONDS = 2.6;

  Lab.experiments.exp1 = { id: 'exp1', number: 1, title: MD.title, help: APP.help, create: create };

  function create(ctx) {
    var scene = ctx.scene, env = Lab.env.build(scene);
    var state = L.initialState();
    var pots = { A: null, B: null }, bins = { black: null, clear: null };
    var placards = {}, thermo, startBtn, busy = 0, lastAction = performance.now(), hintTimer = null;
    var extraFx = [], coverLight = null, finished = false;

    /* ------------------------------------------------------------------ helpers */
    function touch() { lastAction = performance.now(); UI.setCard('potA', { pulse: false }); UI.setCard('potB', { pulse: false }); startBtn.classList.remove('pulse'); }
    function esc(s) { return U.esc(s); }
    function msgFor(key) {
      if (!key || key === 'locked') return '';
      return MD.msg[key] || APP[key] || '';
    }
    function tipOffset(obj, tilt) {                  // where the "mouth" ends up after tilting an object about z
      var p = obj.userData.tip.position, c = Math.cos(tilt), s = Math.sin(tilt);
      return { x: p.x * c - p.y * s, y: p.x * s + p.y * c };
    }
    function worldOf(o) { var v = new T.Vector3(); o.updateMatrixWorld(true); return o.getWorldPosition(v); }
    function dispose(o) { if (o.parent) o.parent.remove(o); Lab.prim.disposeTree(o); }

    /* ------------------------------------------------------------------ tray */
    var th = {
      pot: Lab.stage.bakeThumb(function (h) { h.add(Mo.beanPot().group); }, { yaw: 0.35, pitch: 0.2 }),
      water: Lab.stage.bakeThumb(function (h) { h.add(Mo.wateringCan()); }, { yaw: -0.45, pitch: 0.2 }),
      gravel: Lab.stage.bakeThumb(function (h) { h.add(Mo.gravelPot()); }, { yaw: 0.3, pitch: 0.42 }),
      npk: Lab.stage.bakeThumb(function (h) { h.add(Mo.npkBag()); }, { yaw: 0.4, pitch: 0.15 }),
      black: Lab.stage.bakeThumb(function (h) { h.add(Mo.blackBin()); }, { yaw: 0.3, pitch: 0.2 }),
      clear: Lab.stage.bakeThumb(function (h) { h.add(Mo.clearBin()); }, { yaw: 0.3, pitch: 0.2 })
    };
    UI.setTray([
      { id: 'potA', label: MD.tray.potA, thumb: th.pot, badge: 'A' },
      { id: 'potB', label: MD.tray.potB, thumb: th.pot, badge: 'B' },
      { id: 'water', label: MD.tray.water, thumb: th.water },
      { id: 'gravel', label: MD.tray.gravel, thumb: th.gravel },
      { id: 'npk', label: MD.tray.npk, thumb: th.npk },
      { id: 'blackBin', label: MD.tray.blackBin, thumb: th.black },
      { id: 'clearBin', label: MD.tray.clearBin, thumb: th.clear }
    ], { onClick: function (item) { if (item.id === 'potA' || item.id === 'potB') showInfo(); } });

    /* ------------------------------------------------------------------ side panel: thermostat + start */
    thermo = UI.thermostat({
      label: MD.thermoTitle, value: L.DEFAULT_TEMP, min: 0, max: 60,
      onChange: function (v) { state.B.temperature = v; renderPlacard('B'); touch(); }
    });
    startBtn = U.el('button', { class: 'btn btn-orange btn-start is-locked' }, U.el('span', { class: 'lock', text: '🔒' }), MD.startButton);
    startBtn.addEventListener('click', onStartClick);
    UI.setPanel(U.el('div', { class: 'panel-stack' },
      U.el('div', { class: 'panel-card' }, thermo.el),
      U.el('div', { class: 'panel-card' }, startBtn)));

    Lab.stage.shot(OVERVIEW, 0);
    UI.fitStage();

    /* ------------------------------------------------------------------ zones + drag handler */
    var benchBox = new T.Box3(new T.Vector3(-4.3, 0, -2.0), new T.Vector3(4.3, 0.05, 2.35));
    Lab.drag.addZone({
      id: 'bench', label: 'BÀN THÍ NGHIỆM', pad: 0, priority: 0,
      rect: function () { return Lab.stage.rectOf(benchBox, 0); },
      accepts: function (item) { return (item.id === 'potA' && !state.placed.A) || (item.id === 'potB' && !state.placed.B); }
    });
    ['A', 'B'].forEach(function (w) {
      Lab.drag.addZone({
        id: 'pot' + w, label: w === 'B' ? 'CHẬU B' : '', pad: 12, priority: 5,
        rect: function () { return pots[w] ? Lab.stage.rectOf(pots[w].zoneBox(), 0) : null; },
        accepts: function (item) { return w === 'B' && item.id !== 'potA' && item.id !== 'potB' && state.placed.A && state.placed.B && state.phase === 'conditionSetup'; }
      });
    });
    Lab.drag.setHandler({
      onStart: touch,
      onDrop: function (item, hits) { touch(); return handleDrop(item.id, hits[0] || null); }
    });
    Lab.stage.onPick(function (hit) { if (hit.id === 'potA' || hit.id === 'potB') { touch(); showInfo(); } });

    /* one function decides everything that a drop does (drag & drop, and the tests, both use it) */
    function handleDrop(itemId, zone) {
      var r = L.decideDrop(state, itemId, zone);
      if (!r.ok) return { ok: false, message: msgFor(r.msg) };
      L.apply(state, r.action);
      Lab.audio.play('pop');
      switch (r.action) {
        case 'placeA': placePot('A'); break;
        case 'placeB': placePot('B'); break;
        case 'water': doWater(); break;
        case 'gravel': doGravel(); break;
        case 'npk': doNpk(r.note); break;
        case 'blackBin': doBin('black'); break;
        case 'clearBin': doBin('clear'); break;
      }
      refreshUI();
      return { ok: true };
    }

    /* ------------------------------------------------------------------ UI refresh */
    function refreshUI() {
      UI.setProgress(MD.steps, L.stepStates(state));
      thermo.setLocked(!L.canChangeTemperature(state), MD.msg.placePotsFirst);
      var canStart = L.canStart(state) && busy === 0;
      startBtn.classList.toggle('is-locked', !canStart);
      startBtn.firstChild.textContent = canStart ? '▶' : '🔒';
      UI.setCard('potA', { ghost: state.placed.A }); UI.setCard('potB', { ghost: state.placed.B });
      UI.setCard('blackBin', { ghost: state.tools.blackBin }); UI.setCard('clearBin', { ghost: state.tools.clearBin });
      UI.setCard('water', { used: state.tools.watered }); UI.setCard('gravel', { used: state.tools.gravelUsed }); UI.setCard('npk', { used: state.tools.npkUsed });
      renderPlacard('B');
      Lab.loop.wake();
    }

    /* name cards under each pot: A = the md's ✓ list, B = live status */
    function row(text, ok) { return '<li class="cond-row ' + (ok ? 'yes' : 'no') + '"><span>' + esc(text) + '</span><span class="mark">' + (ok ? '✓' : '✕') + '</span></li>'; }
    function numRow(label, val) { return '<li class="cond-row num"><span>' + esc(label) + '</span><span class="mark">' + esc(val) + '</span></li>'; }
    function renderPlacard(w) {
      var h = placards[w]; if (!h) return;
      var rows;
      if (finished) rows = [numRow(APP.heightNow, placards['h' + w] || '')];     // results: the table on the right has the details
      else if (w === 'A') rows = MD.rowA.map(function (t) { return row(t, true); });
      else {
        var B = state.B, S = MD.status;
        rows = [row(S.water[B.water ? 0 : 1], B.water), row(S.minerals[B.minerals ? 0 : 1], B.minerals), row(S.air[B.air ? 0 : 1], B.air), row(S.light[B.light ? 0 : 1], B.light),
          numRow(MD.rowB.temperature, B.temperature + '°C')];
      }
      h.setHtml('<div class="ct">' + esc(MD.placard[w]) + '</div><ul class="cond-list">' + rows.join('') + '</ul>');
    }
    function makePlacard(w) {
      placards[w] = Lab.labels.add({ html: '', cls: 'card-tag ' + (w === 'B' ? 'b' : ''), world: new T.Vector3(POS[w].x, 0, POS[w].z + 0.72), anchor: 'top', dy: 2 });
      renderPlacard(w);
    }

    /* ------------------------------------------------------------------ placing pots */
    function placePot(w) {
      var pot = Mo.beanPot(); pot.group.userData.pick = 'pot' + w;
      pot.group.position.set(POS[w].x, 4.2, POS[w].z);
      pot.setSoil(w === 'A' ? 'moist' : L.setupSoil(state.B), false);
      pots[w] = pot; scene.add(pot.group);
      busy++;
      Lab.tween.to(pot.group.position, { y: 0 }, 0.8, { ease: 'outBounce' }).promise.then(function () {
        busy--;
        Lab.fx.ringPulse(scene, pot.group.position, 0x4caf50, 1.4);
        Lab.fx.sparkles(scene, new T.Vector3(POS[w].x, 0.7, POS[w].z), 0xffe066, 10);
        Lab.audio.play('ok');
        makePlacard(w);
        if (w === 'A' && !state.placed.B) UI.toast(APP.placedA, { type: 'ok' });
        if (state.placed.A && state.placed.B) UI.toast(APP.placedBoth, { type: 'ok', ms: 5200 });
        refreshUI();
      });
    }

    /* ------------------------------------------------------------------ tools (each one plays a small animation) */
    async function flyIn(obj, at, from) {
      obj.position.set(from.x, from.y, from.z); obj.scale.setScalar(0.01); scene.add(obj);
      await Promise.all([
        Lab.tween.to(obj.position, { x: at.x, y: at.y, z: at.z }, 0.75, { ease: 'outCubic' }).promise,
        Lab.tween.to(obj.scale, { x: 1, y: 1, z: 1 }, 0.4, { ease: 'outBack' }).promise
      ]);
    }
    async function flyAway(obj, dx, dy) {
      await Promise.all([
        Lab.tween.to(obj.position, { x: obj.position.x + dx, y: obj.position.y + dy }, 0.5, { ease: 'inCubic' }).promise,
        Lab.tween.to(obj.scale, { x: 0.01, y: 0.01, z: 0.01 }, 0.5, { ease: 'inCubic' }).promise
      ]);
      dispose(obj);
    }
    function toolStart(id) { busy++; UI.setCard(id, { ghost: true }); refreshUI(); }
    function toolEnd(id) { busy--; UI.setCard(id, { ghost: false }); refreshUI(); }

    async function doWater() {
      toolStart('water');
      var pot = pots.B, can = Mo.wateringCan(), tilt = -0.78, off = tipOffset(can, tilt), soil = pot.soilPoint();
      await flyIn(can, { x: soil.x - off.x, y: 2.6 - off.y, z: soil.z + 0.2 }, { x: soil.x - off.x - 3.2, y: 5.6, z: soil.z + 0.2 });
      await Lab.tween.to(can.rotation, { z: tilt }, 0.55, { ease: 'inOutCubic' }).promise;
      Lab.audio.play('water');
      Lab.fx.pour(scene, { from: worldOf(can.userData.tip), to: soil, color: 0x59bff2, size: 0.055, count: 46, duration: 1.9, spread: 0.12, opacity: 0.85, flight: 0.5 });
      Lab.tween.wait(0.7).promise.then(function () { pot.setSoil(L.setupSoil(state.B), true); });
      await Lab.tween.wait(2.0).promise;
      await Lab.tween.to(can.rotation, { z: 0 }, 0.35).promise;
      await flyAway(can, 3.4, 3);
      UI.toast(MD.status.water[0], { type: 'ok' });
      toolEnd('water');
    }

    async function doGravel() {
      toolStart('gravel');
      var pot = pots.B, gp = Mo.gravelPot(), tilt = -2.0, off = tipOffset(gp, tilt), soil = pot.soilPoint();
      gp.userData.tip.position.set(0, 0.84, 0);
      off = tipOffset(gp, tilt);
      await flyIn(gp, { x: soil.x - off.x, y: 2.7 - off.y, z: soil.z + 0.1 }, { x: soil.x - 3, y: 5.6, z: soil.z + 0.1 });
      await Lab.tween.to(gp.rotation, { z: tilt }, 0.6, { ease: 'inOutCubic' }).promise;
      gp.userData.pebbles.visible = false;
      Lab.audio.play('pour');
      Lab.fx.pour(scene, { from: worldOf(gp.userData.tip), to: soil, color: 0xbdb6a6, size: 0.075, count: 52, duration: 1.5, spread: 0.3, rough: 0.8, flight: 0.45 });
      Lab.tween.wait(0.6).promise.then(function () { pot.setSoil(L.setupSoil(state.B), true); });
      await Lab.tween.wait(1.7).promise;
      await Lab.tween.to(gp.rotation, { z: 0 }, 0.35).promise;
      await flyAway(gp, -3, 3);
      UI.toast(MD.status.minerals[1], { type: 'warn', emoji: '🪨' });
      toolEnd('gravel');
    }

    async function doNpk(note) {
      toolStart('npk');
      var pot = pots.B, bag = Mo.npkBag(), tilt = -2.5, off = tipOffset(bag, tilt), soil = pot.soilPoint();
      await flyIn(bag, { x: soil.x - off.x, y: 2.6 - off.y, z: soil.z + 0.15 }, { x: soil.x - off.x - 3, y: 6.2, z: soil.z + 0.15 });
      await Lab.tween.to(bag.rotation, { z: tilt }, 0.6, { ease: 'inOutCubic' }).promise;
      Lab.audio.play('pour');
      var from = worldOf(bag.userData.tip);
      [0x4aa3ff, 0xff9f43, 0xffffff].forEach(function (c) { Lab.fx.pour(scene, { from: from, to: soil, color: c, size: 0.045, count: 16, duration: 1.4, spread: 0.22, rough: 0.5, flight: 0.5 }); });
      Lab.tween.wait(0.6).promise.then(function () { pot.setSoil(L.setupSoil(state.B), true); });
      await Lab.tween.wait(1.6).promise;
      await Lab.tween.to(bag.rotation, { z: 0 }, 0.35).promise;
      await flyAway(bag, 3.4, 3);
      if (note === 'alreadyRich') UI.toast(APP.alreadyRich, { type: 'info' }); else UI.toast(MD.status.minerals[0], { type: 'ok' });
      toolEnd('npk');
    }

    async function doBin(which) {
      var id = which === 'black' ? 'blackBin' : 'clearBin';
      busy++; refreshUI();
      var bin = which === 'black' ? Mo.blackBin() : Mo.clearBin(), x = POS.B.x, z = POS.B.z;
      bin.position.set(x, 8.5, z); scene.add(bin);
      bins[which] = bin;
      var other = bins.black;
      if (which === 'clear' && other) await Lab.tween.to(other.position, { y: 1.6 }, 0.35, { ease: 'outCubic' }).promise;   // the black bin goes over the clear one
      await Lab.tween.to(bin.position, { y: 0 }, 0.95, { ease: 'outBounce' }).promise;
      Lab.audio.play('pop');
      Lab.fx.ringPulse(scene, new T.Vector3(x, 0, z), which === 'black' ? 0x555555 : 0x00affe, 1.9);
      if (which === 'clear' && other) await Lab.tween.to(other.position, { y: 0 }, 0.4, { ease: 'outBounce' }).promise;
      if (which === 'clear') Lab.tween.value(3.5, function (k) { bin.userData.setMist(0.35 + 0.35 * k); }, { ease: 'outQuad' });
      UI.toast(which === 'black' ? MD.status.light[1] : MD.status.air[1], { type: 'warn', emoji: which === 'black' ? '🌑' : '🫧' });
      busy--; refreshUI();
      void id;
    }

    /* ------------------------------------------------------------------ start → 14-day time-lapse → results */
    function onStartClick() {
      touch();
      if (busy > 0) return;
      if (!L.canStart(state)) { UI.toast(MD.msg.placePotsFirst, { type: 'warn' }); Lab.audio.play('wrong'); return; }
      L.start(state);
      Lab.drag.setEnabled(false);
      ['potA', 'potB', 'water', 'gravel', 'npk', 'blackBin', 'clearBin'].forEach(function (id) { UI.setCard(id, { disabled: true }); });
      thermo.setLocked(true);
      startBtn.classList.add('is-locked'); startBtn.firstChild.textContent = '🔒';
      UI.setProgress(MD.steps, L.stepStates(state));
      Lab.audio.play('step');
      runTimelapse(L.evaluate(state.B));
    }

    function heightText(cm) { return Math.round(cm) + ' cm'; }

    async function runTimelapse(outcome) {
      var INIT = L.INITIAL_VISUAL, healthy = L.FX.healthy, A = pots.A, B = pots.B, days = [0, 1, 3, 7, 14], soilSwitched = false;
      if (outcome.env.cold) {
        extraFx.push(Lab.fx.ambient(scene, 'snow', { x0: POS.B.x - 1.6, x1: POS.B.x + 1.6, z0: POS.B.z - 1, z1: POS.B.z + 1.4, y0: 0.2, y1: 4.6 }));
        coverLight = new T.PointLight(0x7fb2ff, 32, 9, 2);
      } else if (outcome.env.hot) {
        extraFx.push(Lab.fx.ambient(scene, 'heat', { x0: POS.B.x - 1.4, x1: POS.B.x + 1.4, z0: POS.B.z - 0.6, z1: POS.B.z + 1.2, y0: 0.2, y1: 4.2 }));
        coverLight = new T.PointLight(0xff9a4a, 32, 9, 2);
      }
      if (coverLight) { coverLight.position.set(POS.B.x, 2.6, POS.B.z + 1.4); scene.add(coverLight); }

      for (var i = 1; i < days.length; i++) {
        var d0 = days[i - 1], d1 = days[i];
        UI.caption(MD.days[i - 1], { cls: 'day', ms: 0 });
        Lab.audio.play('tick');
        await Lab.tween.value(DAY_SECONDS, function (k) {
          var day = U.lerp(d0, d1, k);
          A.set(A.blend(INIT, healthy, L.progressAt(day, { deadDay: null })));
          B.set(B.blend(INIT, outcome.visual, L.progressAt(day, outcome)));
          if (!soilSwitched && day >= 4) { soilSwitched = true; B.setSoil(outcome.soil, true); }
          if (bins.clear) bins.clear.userData.setMist(0.7 + 0.3 * (day / 14));
          env.setDay(1 - 0.45 * Math.sin(k * Math.PI));
        }, { ease: 'linear' }).promise;
      }
      env.setDay(1);

      /* "14 NGÀY SAU": lift the bins away so both plants can be seen */
      var lifts = [];
      ['black', 'clear'].forEach(function (k) {
        var b = bins[k]; if (!b) return;
        lifts.push(Lab.tween.to(b.position, { y: 9 }, 1.3, { ease: 'inCubic', delay: 0.5 }).promise.then(function () { dispose(b); bins[k] = null; }));
      });
      await Promise.all([UI.caption(MD.after, { ms: 2400 }), Promise.all(lifts)]);

      L.finish(state); finished = true;
      placards.hA = heightText(healthy.height); placards.hB = heightText(outcome.visual.height);
      renderPlacard('A'); renderPlacard('B');
      UI.setProgress(MD.steps, L.stepStates(state));
      Lab.stage.shot(RESULTS, 1000);
      showResults(outcome);
      if (outcome.level === 'healthy') { Lab.audio.play('done'); Lab.fx.confetti(3200); } else Lab.audio.play('step');
    }

    /* ------------------------------------------------------------------ results panel (md sections 22–27, 32) */
    function resultText(o) {
      if (o.key === 'healthy') return MD.compare.healthy;
      if (o.key === 'combo') return o.level === 'dead' ? APP.comboDead : APP.comboWeak;
      if (MD.obs[o.key]) return MD.obs[o.key].result;
      return MD.temp[o.key].result;
    }
    function obsBlocks(o) {
      var html = '';
      if (o.key === 'healthy') {
        html += '<div class="obs-head">' + esc(MD.areas.stem + ' & ' + MD.areas.leaf.toLowerCase()) + '</div><ul class="obs-list">' + MD.healthy.stemLeaf.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
        html += '<div class="obs-head">' + esc(MD.areas.root) + '</div><ul class="obs-list">' + MD.healthy.roots.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
        return html;
      }
      o.causes.forEach(function (c) {
        if (MD.obs[c]) {
          var ob = MD.obs[c];
          html += '<div class="obs-head">' + esc(ob.title) + '</div><ul class="obs-list">';
          ['env', 'bin', 'soil', 'stem', 'leaf', 'root'].forEach(function (a) { if (ob[a]) html += '<li><b>' + esc(MD.areas[a]) + ':</b> ' + esc(ob[a].join(' ')) + '</li>'; });
          html += '</ul>';
        } else {
          var tp = MD.temp[c];
          html += '<div class="obs-head">' + esc(tp.range + ' – ' + tp.result) + '</div><ul class="obs-list"><li>' + esc(tp.look) + '</li></ul>';
        }
      });
      return html;
    }
    function showResults(o) {
      var Bc = state.B, C = MD.compare;
      function cell(ok, yes, no) { return '<td class="' + (ok ? 'good' : 'bad') + '">' + esc(ok ? yes : no) + '</td>'; }
      var table = '<table class="result-table"><thead><tr>' + C.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        ['water', 'minerals', 'air', 'light'].map(function (k) { return '<tr><th>' + esc(C.rows[k]) + '</th><td class="good">' + esc(C.yes) + '</td>' + cell(Bc[k], C.yes, C.lack) + '</tr>'; }).join('') +
        '<tr><th>' + esc(C.rows.temperature) + '</th><td class="good">' + esc(C.tempA) + '</td><td>' + esc(Bc.temperature + '°C') + '</td></tr>' +
        '<tr class="final"><th>' + esc(C.rows.result) + '</th><td class="good">' + esc(C.healthy) + '</td><td class="' + (o.level === 'healthy' ? 'good' : 'bad') + '">' + esc(resultText(o)) + '</td></tr></tbody></table>';
      var pane1 = U.el('div', { class: 'panel-card' }, U.el('div', { html: table }));
      var pane2 = U.el('div', { class: 'panel-card', hidden: true }, U.el('div', { html: obsBlocks(o) }));
      var tab1 = U.el('button', { class: 'tab active', text: '📊 ' + APP.compareTitle }), tab2 = U.el('button', { class: 'tab', text: '🔍 ' + APP.observeTitle });
      function pick(i) { pane1.hidden = i !== 0; pane2.hidden = i !== 1; tab1.classList.toggle('active', i === 0); tab2.classList.toggle('active', i === 1); Lab.audio.play('click'); }
      tab1.addEventListener('click', function () { pick(0); }); tab2.addEventListener('click', function () { pick(1); });
      var panel = U.el('div', { class: 'panel-stack' },
        U.el('div', { class: 'tabs' }, tab1, tab2), pane1, pane2,
        U.el('div', { class: 'panel-card conclusion' }, U.el('p', { class: 'result-note', text: APP.conclusion })));
      UI.panelWide(true);
      UI.setPanel(panel);
    }

    /* ------------------------------------------------------------------ pot information (md section 8) */
    function showInfo() {
      var t = MD.info;
      var html = '<table class="info-table"><thead><tr>' + t.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        t.rows.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') + '</tbody></table>';
      var m = UI.modal(U.el('div', {}, U.el('div', { html: html }),
        U.el('div', { class: 'confirm-actions', style: { marginTop: '18px' } }, U.el('button', { class: 'btn', text: 'ĐÓNG', attrs: { 'data-autofocus': '1' }, on: { click: function () { m.close(); } } }))), { wide: true });
    }

    /* ------------------------------------------------------------------ idle sway + gentle hints */
    Lab.loop.add(function (dt, time) { if (pots.A) pots.A.idle(time); if (pots.B) pots.B.idle(time + 1.3); }, { ambient: true });
    hintTimer = setInterval(function () {
      if (busy > 0 || performance.now() - lastAction < 10000) return;
      if (!state.placed.A) UI.setCard('potA', { pulse: true });
      else if (!state.placed.B) UI.setCard('potB', { pulse: true });
      else if (state.phase === 'conditionSetup' && L.canStart(state)) startBtn.classList.add('pulse');
    }, 1000);

    refreshUI();
    Lab.loop.wake();

    return {
      dispose: function () { clearInterval(hintTimer); Lab.stage.onPick(null); extraFx.forEach(function (f) { if (f && f.stop) f.stop(); }); },
      /* small handle for automated tests */
      api: {
        state: function () { return state; }, pots: pots, bins: bins, drop: handleDrop, start: onStartClick,
        busy: function () { return busy; }, evaluate: function () { return L.evaluate(state.B); }
      }
    };
  }
})(window.Lab);
