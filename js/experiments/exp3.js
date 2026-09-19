/* Experiment 3 – "Tìm hiểu 5 yếu tố cần thiết cho sự sống của động vật" (gà con).
   Wires the pure logic (js/logic/exp3.js) to the 3D cages and chicks, the tray, the two thermostats and the results. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, UI = Lab.ui, L = Lab.logic.exp3, Mo = Lab.models;
  var CT = Lab.content.exp3, MD = CT.md, APP = CT.app;

  var POS = { 1: { x: -2.35, z: 0.35 }, 2: { x: 2.35, z: 0.35 } };
  var OVERVIEW = { cx: 0, cy: 1.55, cz: 0.4, w: 9.4, h: 4.7, pitch: 0.3, fov: 34 };
  var DAY_SECONDS = 2.2;
  var CARDS = ['cage1', 'cage2', 'chickA', 'chickB', 'lid', 'food', 'water', 'lamp'];
  var CAGE_COLOR = { 1: 0x2fb36a, 2: 0xf29a2e };

  Lab.experiments.exp3 = { id: 'exp3', number: 3, title: APP.titlePrefix + MD.title, help: MD.help.concat([APP.helpReset]), create: create };

  function create(ctx) {
    var scene = ctx.scene, env = Lab.env.build(scene);
    var state = L.initialState();
    var cages = { 1: null, 2: null }, chicks = { A: null, B: null }, brains = { A: null, B: null };
    var installed = { 1: {}, 2: {} };                        // the food tray, bowl and lamp models standing in each cage
    var spots = { 1: {}, 2: {} };                            // where they stand (cage-local x, z), so the chicks can walk to them
    var landed = { 1: false, 2: false };
    var placards = {}, thermo2, startBtn, busy = 0, lastAction = performance.now(), hintTimer = null, lastChirp = 0;
    var finished = false, resultInfo = {}, extraFx = [], lid = null;
    /* every light is created now, so the number of lights never changes later (no pause while shaders rebuild) */
    var lampLight = { 1: new T.PointLight(0xffd58a, 0, 7, 2), 2: new T.PointLight(0xffd58a, 0, 7, 2) };
    var airLight = new T.PointLight(0xffffff, 0, 10, 2);
    scene.add(lampLight[1], lampLight[2], airLight);

    /* ------------------------------------------------------------------ helpers */
    function touch() { lastAction = performance.now(); CARDS.forEach(function (id) { UI.setCard(id, { pulse: false }); }); startBtn.classList.remove('pulse'); }
    function esc(s) { return U.esc(s); }
    function msgFor(key) { return (!key || key === 'locked') ? '' : (MD.msg[key] || ''); }
    function worldOf(o) { var v = new T.Vector3(); o.updateMatrixWorld(true); return o.getWorldPosition(v); }
    function dispose(o) { if (o.parent) o.parent.remove(o); Lab.prim.disposeTree(o); }
    function chirp() { var now = performance.now(); if (now - lastChirp > 2200) { lastChirp = now; Lab.audio.play('chirp'); } }
    function fall(obj, parent, to, fromY, secs) {           // something drops into place with a little bounce
      parent.add(obj); obj.position.set(to.x, fromY, to.z); obj.scale.setScalar(0.6);
      return Promise.all([Lab.tween.to(obj.position, { y: to.y }, secs || 0.75, { ease: 'outBounce' }).promise, Lab.tween.to(obj.scale, { x: 1, y: 1, z: 1 }, 0.35, { ease: 'outBack' }).promise]);
    }
    function obstaclesOf(n) {
      var s = spots[n], o = [];
      if (s.lamp) o.push({ x: s.lamp.x, z: s.lamp.z, r: 0.34 });
      if (s.food) o.push({ x: s.food.x, z: s.food.z, r: 0.5 });
      if (s.water) o.push({ x: s.water.x, z: s.water.z, r: 0.4 });
      return o;
    }

    /* ------------------------------------------------------------------ tray */
    function thumb(fn, o) { return Lab.stage.bakeThumb(function (h) { h.add(fn()); }, o); }
    var th = {
      cage1: thumb(function () { var c = Mo.cage(1); c.setDisplay(L.CAGE1_TEMP + '°C', true); return c.group; }, { yaw: 0.45, pitch: 0.28 }),
      cage2: thumb(function () { var c = Mo.cage(2); c.setDisplay(L.DEFAULT_TEMP + '°C', false); return c.group; }, { yaw: 0.45, pitch: 0.28 }),
      chick: thumb(function () { return Mo.chick().group; }, { yaw: 0.55, pitch: 0.15 }),
      lid: thumb(function () { return Mo.cageLid(); }, { yaw: 0.4, pitch: 0.5 }),
      food: thumb(function () { return Mo.foodTray(); }, { yaw: 0.4, pitch: 0.5 }),
      water: thumb(function () { return Mo.waterBowl(); }, { yaw: 0.4, pitch: 0.5 }),
      lamp: thumb(function () { return Mo.lamp(); }, { yaw: 0.6, pitch: 0.15 })
    };
    UI.setTray([
      { id: 'cage1', label: MD.tray.cage1, thumb: th.cage1, badge: '1' },
      { id: 'cage2', label: MD.tray.cage2, thumb: th.cage2, badge: '2' },
      { id: 'chickA', label: MD.tray.chickA, thumb: th.chick, badge: 'A' },
      { id: 'chickB', label: MD.tray.chickB, thumb: th.chick, badge: 'B' },
      { id: 'lid', label: MD.tray.lid, thumb: th.lid },
      { id: 'food', label: MD.tray.food, thumb: th.food },
      { id: 'water', label: MD.tray.water, thumb: th.water },
      { id: 'lamp', label: MD.tray.lamp, thumb: th.lamp }
    ], { onClick: function (item) { if (item.id === 'chickA' || item.id === 'chickB') showInfo(); } });

    /* ------------------------------------------------------------------ side panel: the two temperature panels + start */
    var thermo1 = UI.thermostat({ label: MD.cageName[1], value: L.CAGE1_TEMP, min: 0, max: 60, fixedNote: MD.msg.fixedTemp });
    thermo1.setFixed(true);
    thermo2 = UI.thermostat({
      label: MD.cageName[2], value: L.DEFAULT_TEMP, min: 0, max: 60,
      onChange: function (v) { state.cage2.temperature = v; if (cages[2]) cages[2].setDisplay(v + '°C', false); renderPlacard(2); touch(); }
    });
    startBtn = U.el('button', { class: 'btn btn-orange btn-start is-locked' }, U.el('span', { class: 'lock', text: '🔒' }), MD.startButton);
    startBtn.addEventListener('click', onStartClick);
    UI.setPanel(U.el('div', { class: 'panel-stack' },
      U.el('div', { class: 'panel-card' }, U.el('div', { class: 'panel-title', text: MD.thermoTitle }), thermo1.el, U.el('div', { class: 'thermo-gap' }), thermo2.el),
      U.el('div', { class: 'panel-card' }, startBtn)));

    Lab.stage.shot(OVERVIEW, 0);
    UI.fitStage();

    /* ------------------------------------------------------------------ zones + drag handler */
    var benchBox = new T.Box3(new T.Vector3(-4.5, 0, -2.0), new T.Vector3(4.5, 0.05, 2.4));
    Lab.drag.addZone({
      id: 'bench', label: 'BÀN THÍ NGHIỆM', pad: 0, priority: 0,
      rect: function () { return Lab.stage.rectOf(benchBox, 0); },
      accepts: function (item) { return L.decideDrop(state, item.id, 'bench').ok; }
    });
    [1, 2].forEach(function (n) {
      Lab.drag.addZone({
        id: 'cage' + n, label: MD.cageName[n], pad: 10, priority: 5,
        rect: function () { return cages[n] ? Lab.stage.rectOf(cages[n].zoneBox(), 0) : null; },
        accepts: function (item) { return L.decideDrop(state, item.id, 'cage' + n).ok; }
      });
    });
    Lab.drag.setHandler({ onStart: touch, onDrop: function (item, hits) { touch(); return handleDrop(item.id, hits[0] || null); } });
    Lab.stage.onPick(function (hit) {
      touch();
      if (hit.id === 'chickA' || hit.id === 'chickB') showInfo();
      else if (hit.id === 'lid' && L.canOpenLid(state) && busy === 0) openLid();
    });

    /* one function decides everything that a drop does (drag & drop, and the tests, both use it) */
    function handleDrop(itemId, zone) {
      var r = L.decideDrop(state, itemId, zone);
      if (!r.ok) return { ok: false, message: msgFor(r.msg) };
      L.apply(state, r.action);
      Lab.audio.play('pop');
      switch (r.action) {
        case 'placeCage1': placeCage(1); break;
        case 'placeCage2': placeCage(2); break;
        case 'placeChickA': placeChick('A'); break;
        case 'placeChickB': placeChick('B'); break;
        case 'food': addTool('food'); break;
        case 'water': addTool('water'); break;
        case 'lamp': addTool('lamp'); break;
        case 'lid': addLid(); break;
      }
      refreshUI();
      return { ok: true };
    }

    /* ------------------------------------------------------------------ UI refresh */
    function refreshUI() {
      UI.setProgress(MD.steps, L.stepStates(state));
      var lk = L.lockedKey(state);
      thermo2.setLocked(!L.canChangeTemperature(state), lk ? msgFor(lk) : '');
      var canStart = L.canStart(state) && busy === 0;
      startBtn.classList.toggle('is-locked', !canStart);
      startBtn.firstChild.textContent = canStart ? '▶' : '🔒';
      UI.setCard('cage1', { ghost: state.cages[1] }); UI.setCard('cage2', { ghost: state.cages[2] });
      UI.setCard('chickA', { ghost: state.chicks.A }); UI.setCard('chickB', { ghost: state.chicks.B });
      ['food', 'water', 'lamp', 'lid'].forEach(function (k) { UI.setCard(k, { ghost: state.items[k] }); });
      renderPlacard(1); renderPlacard(2);
      Lab.loop.wake();
    }

    /* name cards under the cages: cage 1 = the md's ✓ list, cage 2 = live status; after the 7 days = the outcome */
    function row(text, ok) { return '<li class="cond-row ' + (ok ? 'yes' : 'no') + '"><span>' + esc(text) + '</span><span class="mark">' + (ok ? '✓' : '✕') + '</span></li>'; }
    function numRow(label, val) { return '<li class="cond-row num"><span>' + esc(label) + '</span><span class="mark">' + esc(val) + '</span></li>'; }
    function renderPlacard(n) {
      var h = placards[n]; if (!h) return;
      var S = MD.status, rows;
      if (finished) {
        var o = n === 1 ? resultInfo.a : resultInfo.o, good = o.level === 'healthy';
        rows = [row(n === 1 ? MD.cage1.status : Lab.results3.statusText(o), good),
          numRow(APP.weightLabel, n === 1 ? MD.cage1.weight : (o.weight ? L.START_WEIGHT + 'g → ' + o.weight + 'g' : '—'))];
      } else {
        var C = n === 1 ? { food: true, water: true, oxygen: true, light: true, temperature: L.CAGE1_TEMP } : state.cage2;
        rows = [row(S.food[C.food ? 0 : 1], C.food), row(S.water[C.water ? 0 : 1], C.water), row(S.oxygen[C.oxygen ? 0 : 1], C.oxygen),
          row(S.light[C.light ? 0 : 1], C.light), numRow(MD.factor.temperature, C.temperature + '°C')];
      }
      h.setHtml('<div class="ct">' + esc(MD.placard[n]) + '</div><ul class="cond-list">' + rows.join('') + '</ul>');
    }
    function makePlacard(n) {
      placards[n] = Lab.labels.add({ html: '', cls: 'card-tag ' + (n === 2 ? 'b' : ''), world: new T.Vector3(POS[n].x, 0, POS[n].z + Mo.CAGE.D / 2 + 0.62), anchor: 'top', dy: 2 });
      renderPlacard(n);
    }

    /* ------------------------------------------------------------------ cages */
    function placeCage(n) {
      var cage = Mo.cage(n); cages[n] = cage;
      cage.group.position.set(POS[n].x, 6.4, POS[n].z); scene.add(cage.group);
      cage.setDisplay((n === 1 ? L.CAGE1_TEMP : state.cage2.temperature) + '°C', n === 1);
      busy++;
      Lab.tween.to(cage.group.position, { y: 0 }, 0.85, { ease: 'outBounce' }).promise.then(function () {
        landed[n] = true; busy--;
        Lab.fx.ringPulse(scene, new T.Vector3(POS[n].x, 0, POS[n].z), CAGE_COLOR[n], 2.7);
        Lab.fx.sparkles(scene, new T.Vector3(POS[n].x, 0.9, POS[n].z + 0.8), 0xffe066, 10);
        Lab.audio.play('ok');
        makePlacard(n);
        if (n === 1) installFixed();
        if (landed[1] && landed[2]) UI.toast(MD.msg.placeChicks, { type: 'ok', ms: 5200 }); else UI.toast(n === 1 ? APP.cageOne : APP.cageTwo, { type: 'ok' });
        refreshUI();
      });
    }

    /* cage 1 always comes with food, water and a lit lamp (md sections 9–11 and 15) */
    function installFixed() {
      var c = cages[1];
      [['food', Mo.foodTray()], ['water', Mo.waterBowl()], ['lamp', Mo.lamp()]].forEach(function (p, i) {
        var kind = p[0], m = p[1], s = c.slots[kind];
        installed[1][kind] = m; spots[1][kind] = { x: s.x, z: s.z };
        c.group.add(m); m.position.copy(s); m.scale.setScalar(0.01);
        Lab.tween.to(m.scale, { x: 1, y: 1, z: 1 }, 0.45, { ease: 'outBack', delay: 0.12 * i });
      });
      Lab.tween.wait(0.55).promise.then(function () { lightLamp(1, installed[1].lamp); });
    }
    function lightLamp(n, lamp) {
      var b = lamp.userData.bulb, s = cages[n].slots.lamp;
      lampLight[n].position.set(POS[n].x + s.x + b.x, s.y + b.y, POS[n].z + s.z + b.z);
      return Lab.tween.value(0.7, function (k) { lamp.userData.setOn(k); lampLight[n].intensity = 22 * k; }).promise;
    }

    /* ------------------------------------------------------------------ chicks */
    function placeChick(w) {
      var n = w === 'A' ? 1 : 2, cage = cages[n], chick = Mo.chick();
      chick.group.userData.pick = 'chick' + w; chicks[w] = chick; cage.group.add(chick.group);
      var brain = brains[w] = Mo.chickBrain(chick, {
        bounds: cage.bounds, floorY: cage.floorY, seed: w === 'A' ? 11 : 23, x: 0, z: 0.05,
        food: function () { return spots[n].food || null; }, water: function () { return spots[n].water || null; },
        obstacles: function () { return obstaclesOf(n); }, onChirp: chirp
      });
      brain.state.lift = 2.6; brain.place(0, 0.05, 0);
      busy++;
      Lab.tween.to(brain.state, { lift: 0 }, 0.85, { ease: 'outBounce' }).promise.then(function () {
        busy--;
        cage.flash(); Lab.fx.ringPulse(scene, new T.Vector3(POS[n].x, 0.5, POS[n].z), CAGE_COLOR[n], 1.3); Lab.audio.play('chirp');
        if (state.chicks.A && state.chicks.B) UI.toast(MD.ok.chicksPlaced, { type: 'ok', ms: 5200 }); else UI.toast(w === 'A' ? APP.chickAOnly : APP.chickBOnly, { type: 'ok' });
        refreshUI();
      });
    }

    /* ------------------------------------------------------------------ what the student adds to cage 2 */
    async function addTool(kind) {
      var c = cages[2], slot = c.slots[kind], model = kind === 'food' ? Mo.foodTray() : kind === 'water' ? Mo.waterBowl() : Mo.lamp();
      installed[2][kind] = model; busy++; refreshUI();
      await fall(model, c.group, slot, 4.6, 0.75);
      spots[2][kind] = { x: slot.x, z: slot.z };
      Lab.audio.play('ok');
      Lab.fx.sparkles(scene, new T.Vector3(POS[2].x + slot.x, slot.y + 0.5, POS[2].z + slot.z), kind === 'lamp' ? 0xffe066 : 0x9be2ff, 8);
      if (kind === 'lamp') await lightLamp(2, model);
      UI.toast(kind === 'food' ? APP.foodOk : kind === 'water' ? MD.ok.water : APP.lampOk, { type: 'ok' });
      busy--; refreshUI();
    }
    async function addLid() {
      var c = cages[2]; lid = Mo.cageLid(); lid.position.set(0, 6.4, 0); c.group.add(lid);
      busy++; refreshUI();
      await Lab.tween.to(lid.position, { y: lid.userData.seatY }, 0.9, { ease: 'outBounce' }).promise;
      Lab.audio.play('ok');
      Lab.fx.ringPulse(scene, new T.Vector3(POS[2].x, Mo.CAGE.topY, POS[2].z), 0x00affe, 2.2);
      Lab.tween.value(2.4, function (k) { c.setMist(0.15 + 0.2 * k); }, { ease: 'outQuad' });
      UI.toast(MD.ok.lid, { type: 'warn', emoji: '🫧' });
      Lab.tween.wait(1.2).promise.then(function () { if (state.items.lid) UI.toast(APP.lidHint, { type: 'info' }); });
      busy--; refreshUI();
    }
    async function openLid() {                               // md section 44: before the start the lid may be opened again
      if (!L.openLid(state)) return;
      var c = cages[2], old = lid; lid = null; busy++; refreshUI();
      Lab.audio.play('pop'); c.setMist(0);
      await Promise.all([Lab.tween.to(old.position, { y: 6.4 }, 0.6, { ease: 'inCubic' }).promise, Lab.tween.to(old.scale, { x: 0.5, y: 0.5, z: 0.5 }, 0.6).promise]);
      dispose(old); UI.toast(APP.lidOpened, { type: 'info' });
      busy--; refreshUI();
    }

    /* ------------------------------------------------------------------ start → 7-day time-lapse → results */
    function startNow() { touch(); if (busy > 0 || !L.canStart(state)) return false; begin(); return true; }
    function onStartClick() {
      touch();
      if (busy > 0) return;
      if (!L.canStart(state)) { UI.toast(msgFor(L.lockedKey(state)), { type: 'warn' }); Lab.audio.play('wrong'); return; }
      UI.confirm({ text: MD.confirm.text, okLabel: MD.confirm.ok, cancelLabel: MD.confirm.cancel }).then(function (ok) { if (ok && busy === 0 && L.canStart(state)) begin(); });
    }
    function begin() {
      L.start(state);
      Lab.drag.setEnabled(false);
      CARDS.forEach(function (id) { UI.setCard(id, { disabled: true }); });
      thermo2.setLocked(true);
      startBtn.classList.add('is-locked'); startBtn.firstChild.textContent = '🔒';
      UI.setProgress(MD.steps, L.stepStates(state));
      Lab.audio.play('step');
      runTimelapse(L.evaluate(state.cage2));
    }

    async function runTimelapse(o) {
      var c2 = cages[2], t = o.env.temp, DAYS = L.DAYS, px = POS[2].x, pz = POS[2].z;
      if (t.kind && t.amount >= 0.9) extraFx.push(Lab.fx.ambient(scene, t.kind === 'cold' ? 'snow' : 'heat', { x0: px - 1.8, x1: px + 1.8, z0: pz - 1.2, z1: pz + 1.4, y0: 0.6, y1: 3.6 }));
      airLight.color.setHex(t.kind === 'cold' ? 0x7fb2ff : 0xff9a4a); airLight.position.set(px, 3.4, pz + 1.7);
      brains.A.setProfile(L.BASE);
      for (var day = 1; day <= DAYS; day++) {
        UI.caption(MD.days[day - 1], { cls: 'day', ms: 0 });
        Lab.audio.play('tick');
        await Lab.tween.value(DAY_SECONDS, function (k) {
          var d = day - 1 + k, e = L.envAt(o, d), p = L.profileAt(o, d);
          brains.B.setProfile(p);
          chicks.A.setGrowth(d / DAYS); chicks.B.setGrowth(d / DAYS * p.growth);
          c2.setMist(e.mist); c2.setNight(e.night);
          c2.setTint(e.tempKind === 'cold' ? 0x8fc4ff : 0xff9a4a, e.tempKind ? e.temp : 0);
          airLight.intensity = e.tempKind ? 26 * e.temp : 0;
          env.setDay(1 - 0.3 * Math.sin(k * Math.PI));
        }, { ease: 'linear' }).promise;
      }
      env.setDay(1);
      await UI.caption(MD.after, { ms: 2200 });
      L.finish(state); finished = true;
      resultInfo = { o: o, a: L.healthyOutcome() };
      renderPlacard(1); renderPlacard(2);
      UI.setProgress(MD.steps, L.stepStates(state));
      UI.panelWide(true);
      UI.setPanel(Lab.results3.build({ state: state, outcome: o, onDone: function () { Lab.audio.play('done'); Lab.fx.confetti(3200); } }));
      Lab.stage.shot(OVERVIEW, 900);
      Lab.audio.play(o.level === 'healthy' ? 'done' : 'step');
      if (o.level === 'healthy') Lab.fx.confetti(2600);
    }

    /* ------------------------------------------------------------------ chick information (md section 7.1) */
    function showInfo() {
      var t = MD.info;
      var html = '<table class="info-table"><thead><tr>' + t.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        t.rows.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') + '</tbody></table>';
      var m = UI.modal(U.el('div', {}, U.el('div', { html: html }),
        U.el('div', { class: 'confirm-actions', style: { marginTop: '18px' } }, U.el('button', { class: 'btn', text: 'ĐÓNG', attrs: { 'data-autofocus': '1' }, on: { click: function () { m.close(); } } }))), { wide: true });
    }

    /* ------------------------------------------------------------------ the chicks live (ambient) + gentle hints */
    Lab.loop.add(function (dt, time) { ['A', 'B'].forEach(function (w) { if (brains[w]) brains[w].step(dt, time); }); }, { ambient: true });
    hintTimer = setInterval(function () {
      if (busy > 0 || performance.now() - lastAction < 10000 || state.phase === 'running' || state.phase === 'result') return;
      if (!state.cages[1]) UI.setCard('cage1', { pulse: true });
      else if (!state.cages[2]) UI.setCard('cage2', { pulse: true });
      else if (!state.chicks.A) UI.setCard('chickA', { pulse: true });
      else if (!state.chicks.B) UI.setCard('chickB', { pulse: true });
      else if (L.canStart(state)) startBtn.classList.add('pulse');
    }, 1000);

    refreshUI();
    Lab.loop.wake();

    return {
      dispose: function () { clearInterval(hintTimer); Lab.stage.onPick(null); extraFx.forEach(function (f) { if (f && f.stop) f.stop(); }); },
      /* small handle for automated tests */
      api: {
        state: function () { return state; }, cages: cages, chicks: chicks, brains: brains, drop: handleDrop, start: startNow,
        busy: function () { return busy; }, evaluate: function () { return L.evaluate(state.cage2); }, openLid: openLid
      }
    };
  }
})(window.Lab);
