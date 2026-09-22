/* Scripted scenarios for screenshots (developer tool). Open tests/shots.html?e=exp1&s=<scenario>.
   Uses a virtual clock so the result never depends on the machine's speed. */
(function () {
  'use strict';
  var q = new URLSearchParams(location.search), scenario = q.get('s') || 'start', exp = q.get('e') || 'exp1';
  function flush() { return new Promise(function (r) { var c = new MessageChannel(); c.port1.onmessage = function () { r(); }; c.port2.postMessage(0); }); }
  var vt = 0;                                    // virtual time in seconds; the tickers (chicks, plant sway) get it too
  async function adv(sec) { var n = Math.ceil(sec * 30); for (var i = 0; i < n; i++) { vt += 1 / 30; Lab.tween._update(1 / 30); Lab.loop.tickAll(1 / 30, vt); await flush(); } Lab.stage.render(0); }
  function press(idx, n) { var b = document.querySelectorAll('.thermo .btn-round')[idx]; for (var i = 0; i < n; i++) { b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); } }

  /* Experiment 3: cages A/B, chicks, food / water / lamp / lid, cage 2's thermostat is the 3rd and 4th round button. */
  var S3 = {
    start: async function () { },
    cages: async function (api) { api.drop('cage1', 'bench'); api.drop('cage2', 'bench'); await adv(3); },
    setup: async function (api) { await S3.cages(api); api.drop('chickA', 'cage1'); api.drop('chickB', 'cage2'); await adv(2.5); },
    run: async function (api, o) {
      await S3.setup(api);
      for (var i = 0; i < (o.tools || []).length; i++) { api.drop(o.tools[i], 'cage2'); await adv(2.4); }
      if (o.temp != null) { var cur = api.state().cage2.temperature; if (o.temp > cur) press(3, o.temp - cur); else press(2, cur - o.temp); }
      api.start(); await adv(o.until || 7 * 2.2 + 6);
    },
    ready: function (api) { return S3.run(api, { tools: ['food', 'water', 'lamp'], temp: 33, until: 0.1 }); },
    healthy: function (api) { return S3.run(api, { tools: ['food', 'water', 'lamp'], temp: 33 }); },
    cold: function (api) { return S3.run(api, { tools: ['food', 'water', 'lamp'], temp: 10 }); },
    hot: function (api) { return S3.run(api, { tools: ['food', 'water', 'lamp'], temp: 45 }); },
    oxygen: function (api) { return S3.run(api, { tools: ['food', 'water', 'lamp', 'lid'], temp: 33 }); },
    food: function (api) { return S3.run(api, { tools: ['water', 'lamp'], temp: 33 }); },
    water: function (api) { return S3.run(api, { tools: ['food', 'lamp'], temp: 33 }); },
    dark: function (api) { return S3.run(api, { tools: ['food', 'water'], temp: 33 }); },
    dead: function (api) { return S3.run(api, { tools: ['lid'], temp: 33 }); },
    default37: function (api) { return S3.run(api, { tools: ['food', 'water', 'lamp'] }); }
  };

  /* Experiment 2: the plant, the gases (dragged with real pointer events), water and minerals. */
  function ev(t, x, y, tg, id) { (tg || document).dispatchEvent(new PointerEvent(t, { bubbles: true, clientX: x, clientY: y, pointerId: id || 7, button: 0, pointerType: 'mouse' })); }
  function mols(type) { var out = []; Lab.stage.scene.traverse(function (o) { if (o.userData && o.userData.type === type && o.parent === Lab.stage.scene) { var p = Lab.stage.project(o.getWorldPosition(new THREE.Vector3())); out.push({ x: p.x, y: p.y }); } }); return out; }
  async function dragMol(from, to) { ev('pointerdown', from.x, from.y, Lab.stage.canvas); ev('pointermove', from.x + 15, from.y + 5); await adv(0.1); ev('pointermove', to.x, to.y); await adv(0.1); ev('pointerup', to.x, to.y); await adv(0.2); }
  async function dragCard(id, to) { var c = document.querySelector('.card[data-id="' + id + '"]'), r = c.getBoundingClientRect(), s = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    ev('pointerdown', s.x, s.y, c, 9); ev('pointermove', s.x + 20, s.y + 20, null, 9); await adv(0.1); ev('pointermove', to.x, to.y, null, 9); await adv(0.1); ev('pointerup', to.x, to.y, null, 9); await adv(0.2); }
  function click(sel) { document.querySelector(sel).click(); }
  var S2 = {
    start: async function () { },
    placed: async function (api) { api.drop('pot', 'bench'); await adv(3.2); },
    resp: async function (api) { await S2.placed(api); click('.topic-btn[data-topic=air]'); await adv(1.5); click('.sub-btn[data-sub=resp]'); await adv(1.8); },
    photo: async function (api) { await S2.placed(api); click('.topic-btn[data-topic=air]'); await adv(1.5); click('.sub-btn[data-sub=photo]'); await adv(1.8); },
    root: async function (api) { await S2.placed(api); click('.topic-btn[data-topic=water]'); await adv(1.8); click('.sub-btn[data-sub=water]'); await adv(0.6); },
    lens: async function (api) { await S2.placed(api); api.drop('magnifier', 'leaf'); await adv(1.2); },
    finale: async function (api) {
      var X = api.X, st = api.state();
      function inLeaf(m) { return X.gas.region(m.x, m.y) === 'leaf'; }
      function env() { return { x: Lab.stage.insets.l + 40, y: Lab.stage.insets.t + 230 }; }
      function leafPt() { var r = Lab.stage.rectOf(X.plant.foliageBox(), 0); return { x: r.x + r.w / 2, y: r.y + r.h * 0.4 }; }
      function soilPt() { var r = Lab.stage.rectOf(X.plant.soilBox(), 0); return { x: r.x + r.w / 2, y: r.y + r.h / 2 }; }
      await S2.placed(api); click('.topic-btn[data-topic=air]'); await adv(1.5);
      click('.sub-btn[data-sub=resp]'); await adv(1.6);
      await dragMol(mols('o2').filter(function (m) { return !inLeaf(m); })[0], leafPt()); await adv(2.2);
      await dragMol(mols('co2').filter(inLeaf)[0], env()); await adv(4.5);
      click('.sub-btn[data-sub=photo]'); await adv(1.6);
      await dragMol(mols('co2').filter(function (m) { return !inLeaf(m); })[0], leafPt()); await adv(2.2);
      await dragMol(mols('o2').filter(inLeaf)[0], env()); await adv(9);
      click('.topic-btn[data-topic=water]'); await adv(1.8);
      click('.sub-btn[data-sub=water]'); await adv(0.4); await dragCard('water', soilPt()); await adv(9.5);
      click('.sub-btn[data-sub=minerals]'); await adv(0.4); await dragCard('minerals', soilPt()); await adv(17);
      document.getElementById('caption').innerHTML = ''; document.getElementById('toasts').innerHTML = '';
    },
    synth: async function (api) { await S2.finale(api); click('.synth-btn'); await adv(3); }
  };

  /* Experiment 4: the lab rat. Gases are dragged with real pointer events; food, water and the waste use the API. */
  var S4 = {
    start: async function () { },
    placed: async function (api) { api.drop('mouse', 'bench'); await adv(3); },
    info: async function (api) { await S4.placed(api); var p = Lab.stage.project(api.X.rat.world(new THREE.Vector3(0, 0.5, 0))); ev('pointerdown', p.x, p.y, Lab.stage.canvas); ev('pointerup', p.x, p.y, Lab.stage.canvas); await adv(0.6); },
    air: async function (api) { await S4.placed(api); click('.topic-btn[data-topic=air]'); await adv(2.6); },
    airGo: async function (api) {
      var X = api.X;
      function body() { var r = Lab.stage.rectOf(X.rat.bodyBox(), 0); return { x: r.x + r.w / 2, y: r.y + r.h / 2 }; }
      await S4.air(api);
      await dragMol(mols('o2')[0], body()); await adv(4.5);
      var b = body(), lung = mols('co2').filter(function (m) { return Math.hypot(m.x - b.x, m.y - b.y) < 90; })[0];
      await dragMol(lung, { x: Lab.stage.insets.l + 60, y: Lab.stage.insets.t + 190 }); await adv(4.5);
    },
    food: async function (api) { await S4.placed(api); click('.topic-btn[data-topic=wfw]'); await adv(1.5); api.drop('food', 'near'); await adv(4.2); },
    water: async function (api) { await S4.food(api); await adv(2.2); api.drop('water', 'near'); await adv(3.6); },
    later: async function (api) { await S4.water(api); await adv(1.2); },
    waste: async function (api) { await S4.water(api); await adv(9); },
    wfwGo: async function (api) {
      await S4.waste(api); api.X.wfw.excrete('waste', 'out'); await adv(4); api.X.wfw.excrete('urine', 'out'); await adv(4);
    },
    finale: async function (api) {
      await S4.airGo(api); click('.topic-btn[data-topic=wfw]'); await adv(1.5);
      api.drop('food', 'near'); await adv(6.5); api.drop('water', 'near'); await adv(24);
      api.X.wfw.excrete('waste', 'out'); await adv(4); api.X.wfw.excrete('urine', 'out'); await adv(14);
      document.getElementById('caption').innerHTML = ''; document.getElementById('toasts').innerHTML = '';
    },
    replay: async function (api) { await S4.finale(api); click('.synth-btn'); await adv(1.5); }
  };

  /* Experiment 5: the tomato flower. Tools use the API, the dots and buttons are clicked, the pollen tube and the male cell are dragged with pointer events. */
  function dots5() { return Array.from(document.querySelectorAll('.tag3d.hot')); }
  function tipAt(X, last) {
    var gs = X.scene.children.filter(function (o) { return o.children && o.children.some(function (c) { return c.userData && c.userData.tip; }); });
    var g = last ? gs[gs.length - 1] : gs[0], t = g.children.filter(function (c) { return c.userData && c.userData.tip; })[0], p = Lab.stage.project(t.getWorldPosition(new THREE.Vector3()));
    return { x: p.x, y: p.y };
  }
  var S5 = {
    start: async function () { },
    placed: async function (api) { api.drop('flower', 'bench'); await adv(3); },
    lens: async function (api) { await S5.placed(api); api.drop('lens', 'flower'); await adv(1.2); },
    cut: async function (api) { await S5.lens(api); click('.panel-btn'); await adv(2.8); },
    look: async function (api) { await S5.cut(api); for (var i = 0; i < 7; i++) { dots5()[i].click(); await adv(1.4); } await adv(8); },
    ready: async function (api) { await S5.cut(api); for (var i = 0; i < 8; i++) { dots5()[i].click(); await adv(1.4); } await adv(9); },
    pollen: async function (api) { await S5.ready(api); click('.panel-btn'); await adv(2.8); },
    loaded: async function (api) { await S5.pollen(api); api.drop('stick', 'anther'); await adv(4.5); },
    fert: async function (api) { await S5.loaded(api); api.drop('stick', 'stigma'); await adv(9); await adv(8); },
    germ: async function (api) {
      await S5.fert(api); var X = api.X, p = Lab.stage.project(X.flower.world(new THREE.Vector3(0, X.Y0 + 1.6, 0)));
      ev('pointerdown', p.x, p.y, Lab.stage.canvas); ev('pointerup', p.x, p.y, Lab.stage.canvas); await adv(9);
    },
    tube: async function (api) {
      await S5.germ(api); var X = api.X, b = Lab.stage.project(X.flower.world(new THREE.Vector3(0, X.Y0 + 0.36, 0.03)));
      await dragMol(tipAt(X, false), { x: b.x, y: b.y + 30 }); await adv(9);
    },
    ovule: async function (api) {
      await S5.tube(api); var X = api.X, s = Lab.stage.project(X.flower.world(X.flower.ovulePos[5]));
      await dragMol(tipAt(X, true), { x: s.x, y: s.y }); await adv(9);
    },
    male: async function (api) {
      await S5.ovule(api); var X = api.X, c = Lab.stage.project(X.flower.world(X.flower.ovulePos[5]));
      var m = X.scene.children.filter(function (o) { return o.isMesh && o.geometry.type === 'SphereGeometry' && o.material.type === 'MeshBasicMaterial' && Math.abs(o.geometry.parameters.radius - 0.04) < 1e-6; })[0];
      var p = Lab.stage.project(m.getWorldPosition(new THREE.Vector3())); await dragMol({ x: p.x, y: p.y }, { x: c.x, y: c.y }); await adv(12);
    },
    d7: async function (api) { await S5.male(api); click('.panel-btn'); await adv(16); },
    d14: async function (api) { await S5.d7(api); click('.panel-btn'); await adv(5); },
    seeds: async function (api) {
      await S5.d14(api); var X = api.X, p = Lab.stage.project(X.scene.children.filter(function (o) { return o.userData && o.userData.pick === 'fruit'; })[0].position);
      ev('pointerdown', p.x, p.y, Lab.stage.canvas); ev('pointerup', p.x, p.y, Lab.stage.canvas); await adv(12);
    },
    d30: async function (api) { await S5.seeds(api); click('.panel-btn'); await adv(9); await adv(4); },
    finale: async function (api) {
      await S5.d30(api); var X = api.X, p = Lab.stage.project(X.scene.children.filter(function (o) { return o.userData && o.userData.pick === 'fruit'; })[0].position);
      ev('pointerdown', p.x, p.y, Lab.stage.canvas); ev('pointerup', p.x, p.y, Lab.stage.canvas); await adv(12);
      document.getElementById('caption').innerHTML = ''; document.getElementById('toasts').innerHTML = '';
    }
  };

  /* Experiment 6: four pots, four samples, water, the days, the classification cards. Everything uses the API (ids as in the tray, zones place0-3 and pot0-3). */
  var S6 = {
    start: async function () { },
    pots: async function (api) { for (var i = 0; i < 4; i++) { api.drop('p' + i, 'place' + i); await adv(1.3); } await adv(1); },
    samples: async function (api) { await S6.pots(api); for (var i = 0; i < 4; i++) { api.drop('s' + i, 'pot' + i); await adv(0.6); } await adv(4); },
    lens: async function (api) { await S6.samples(api); api.drop('lens', 'pot2'); await adv(1.4); },
    water: async function (api) { await S6.samples(api); for (var i = 0; i < 4; i++) { api.drop('can', 'pot' + i); await adv(5.5); } await adv(1); },
    d4: async function (api) { await S6.water(api); click('.panel-btn'); await adv(9); },
    d14: async function (api) { await S6.water(api); click('.panel-btn'); await adv(20); },
    zoom: async function (api) { await S6.d14(api); api.X.lapse.tapPot(1); await adv(1.6); },
    classify: async function (api) { await S6.d14(api); for (var i = 0; i < 4; i++) { api.drop('c' + i, 'pot' + i); await adv(0.8); } await adv(2); },
    finale: async function (api) { await S6.classify(api); click('.panel-btn'); await adv(12); document.getElementById('caption').innerHTML = ''; document.getElementById('toasts').innerHTML = ''; }
  };

  /* ---- helpers for the long playthroughs (Experiments 7 and 8) ---- */
  /* wait (on the virtual clock) until `test` is true; `label` says which step timed out */
  async function until(label, test, max) {
    var t = 0;
    while (!test()) {
      if (t > (max || 90)) throw new Error('timeout: ' + label);
      await adv(1 / 30); t += 1 / 30;
    }
    await adv(0.2);
  }
  function found(id) { var hit = null; Lab.stage.scene.traverse(function (o) { if (!hit && o.userData && o.userData.pick === id && o.visible) hit = o; }); return hit; }
  function at(obj) { var p = Lab.stage.project(new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3())); return { x: p.x, y: p.y }; }
  function world(x, y, z) { var p = Lab.stage.project(new THREE.Vector3(x, y, z)); return { x: p.x, y: p.y }; }
  async function tap(pt) { ev('pointerdown', pt.x, pt.y, Lab.stage.canvas); await adv(0.05); ev('pointerup', pt.x, pt.y, Lab.stage.canvas); await adv(0.6); }
  /* a screen point where a click really lands on the object (its centre can be hidden behind another part) */
  function pickPoint(id) {
    var list = [], fallback = null;
    Lab.stage.scene.traverse(function (o) { if (o.visible && o.userData && o.userData.pick === id) list.push(o); });
    for (var n = 0; n < list.length; n++) {
      var o = list[n], pts = [new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3())];
      o.traverse(function (c) {
        var pos = c.geometry && c.geometry.attributes && c.geometry.attributes.position; if (!pos) return;
        var step = Math.max(1, Math.floor(pos.count / 12));
        for (var i = 0; i < pos.count; i += step) pts.push(c.localToWorld(new THREE.Vector3().fromBufferAttribute(pos, i)));
      });
      for (var k = 0; k < pts.length; k++) {
        var p = Lab.stage.project(pts[k]), hit = Lab.stage.pick(p.x, p.y);
        if (hit && hit.id === id) return { x: p.x, y: p.y };
        if (!fallback && k === 0) fallback = { x: p.x, y: p.y };
      }
    }
    return fallback;
  }
  async function tapPick(id) { var pt = pickPoint(id); if (!pt) throw new Error('cannot click: ' + id); await tap(pt); }
  function panelBtn() { var b = document.querySelectorAll('#panel .panel-btn:not(.locked)'); return b[b.length - 1]; }
  async function pressPanel(api, label) { var b = panelBtn(); if (!b) throw new Error('no panel button: ' + label); b.click(); await adv(0.4); }

  /* Experiment 7: the butterfly, from the two butterflies to the four sorted cards. */
  var S7 = {
    start: async function () { },
    pair: async function (api) {
      api.drop('male', 'garden'); await until('male placed', function () { return api.state().malePlaced && !api.X.busy; }, 30);
      api.drop('female', 'garden'); await until('pair on the branch', function () { return api.state().femalePlaced && !api.X.busy && Lab.sceneDrag.count() > 0; }, 40);
    },
    mated: async function (api) {
      await S7.pair(api);
      var m = api.X.bf[0].group, f = api.X.bf[1].group;
      await dragMol(at(m), world(f.position.x - 0.25, f.position.y, f.position.z));
      await until('mating', function () { return api.state().mated; }, 30);
      await until('the fertilization button', function () { var b = document.querySelector('#modal-root .panel-btn'); return b && !b.hidden; }, 40);
      document.querySelector('#modal-root .panel-btn').click();
      await until('back in the garden', function () { return api.state().continued && !api.X.busy; }, 30);
    },
    laid: async function (api) { await S7.mated(api); api.drop('female', 'leaf'); await until('eggs laid', function () { return api.state().eggLaid && !api.X.busy; }, 90); },
    eggs: async function (api) { await S7.laid(api); api.drop('lens', 'eggs'); await until('eggs under the glass', function () { return api.state().eggObserved; }, 20); },
    larva: async function (api) { await S7.eggs(api); await pressPanel(api, 'hatch'); await until('the caterpillar', function () { return api.state().larvaAppeared && !api.X.busy; }, 90); },
    fed: async function (api) {
      await S7.larva(api);
      api.drop('ruler', 'larva'); await adv(2);
      api.drop('leaf', 'larva'); await until('first meal', function () { return api.state().larvaFed; }, 60);
    },
    pupa: async function (api) {
      await S7.fed(api);
      await until('three moults and the pupa', function () { return api.state().pupaFormed && !api.X.busy && !api.X.growing; }, 180);
      api.drop('lens', 'pupa'); await until('pupa under the glass', function () { return api.state().pupaObserved; }, 20);
    },
    cut: async function (api) {
      await S7.pupa(api); await pressPanel(api, '3D cut');
      await until('the cut is open', function () { return api.state().cutaway && !api.X.busy; }, 30);
      var dots = Array.prototype.slice.call(document.querySelectorAll('.tag3d.hot'));
      for (var i = 0; i < dots.length; i++) { dots[i].click(); await adv(1.4); }
      await until('the four parts', function () { return api.state().cutawayObserved; }, 20);
    },
    adult: async function (api) { await S7.cut(api); await pressPanel(api, 'emerge'); await until('the new butterfly', function () { return api.state().adult && !api.X.busy; }, 180); },
    finale: async function (api) {
      await S7.adult(api);
      for (var i = 0; i < 4; i++) { api.drop('c' + i, 'slot' + i); await adv(1.2); }
      await until('sorted', function () { return api.state().complete; }, 30);
      await adv(9);
      document.getElementById('caption').innerHTML = ''; document.getElementById('toasts').innerHTML = '';
    }
  };

  /* Experiment 8: the cat, from the two cats to the eight sorted cards. */
  async function nextPhase(api, to) {
    await until('the button to phase ' + to, function () { return !api.X.busy && !(api.X.tl && api.X.tl.busy) && !!panelBtn(); }, 40);
    await pressPanel(api, 'phase ' + to);
    await until('phase ' + to, function () { return api.state().phase >= to && !api.X.busy; }, 40);
  }
  async function marks(api, tl, n) {
    for (var i = 0; i < n; i++) {
      await until('mark ' + i + ' of ' + tl, function () { return !api.X.busy && api.X.tl && !api.X.tl.busy; }, 40);
      document.querySelectorAll('#panel .tl-mark')[i].click();
      await until('arrived at mark ' + i + ' of ' + tl, (function (k) { return function () { return api.state().tl[tl][k] && !api.X.tl.busy; }; })(i), 40);
    }
  }
  var S8 = {
    start: async function () { },
    place: async function (api) {
      api.drop('male', 'table'); await until('male cat', function () { return api.state().malePlaced && !api.X.busy; }, 30);
      api.drop('female', 'table'); await until('female cat', function () { return api.state().femalePlaced && !api.X.busy; }, 30);
      await pressPanel(api, 'start'); await until('phase identify', function () { return api.state().phase === 1 && !api.X.busy; }, 30);
    },
    identify: async function (api) {
      await S8.place(api);
      await tapPick('male'); await tapPick('female');
      await until('both named', function () { return api.state().maleIdentified && api.state().femaleIdentified && !api.X.busy; }, 30);
      await nextPhase(api, 2);
    },
    cells: async function (api) {
      await S8.identify(api);
      await until('sperm and egg are there', function () { return !!found('sperm') && !!found('egg') && !api.X.busy; }, 40);
      await tapPick('sperm'); await tapPick('egg');
      await dragMol(at(found('sperm')), world(-3.0, 2.1, 0.3)); await until('sperm in the male area', function () { return api.state().spermPlaced && !api.X.busy; }, 40);
      await dragMol(at(found('egg')), world(3.0, 2.1, 0.3)); await until('egg in the female area', function () { return api.state().eggPlaced && !api.X.busy; }, 40);
      await nextPhase(api, 3);
    },
    fert: async function (api) {
      await S8.cells(api);
      await until('the big egg', function () { return !!found('sperm') && !!found('egg') && !api.X.busy; }, 40);
      await dragMol(at(found('sperm')), at(found('egg')));
      await until('fertilized', function () { return api.state().fertilized; }, 40);
      await until('the zygote phase', function () { return api.state().phase >= 4 && !api.X.busy; }, 60);
    },
    zygote: async function (api) {
      await S8.fert(api);
      api.drop('lens', 'zygote'); await until('zygote under the glass', function () { return api.state().zygoteObserved && !api.X.busy; }, 30);
      api.X.closeLens(); await tapPick('egg');                        // the zygote is the egg after the fertilization
      await until('zygote clicked', function () { return api.state().zygoteClicked; }, 30);
      await nextPhase(api, 5);
    },
    embryo: async function (api) {
      await S8.zygote(api); await marks(api, 'embryo', 4);
      api.drop('lens', 'embryo'); await until('embryo under the glass', function () { return api.state().embryoObserved && !api.X.busy; }, 30);
      api.X.closeLens(); await nextPhase(api, 6);
    },
    fetus: async function (api) {
      await S8.embryo(api); await marks(api, 'fetus', 3);
      var parts = ['fetus:head', 'fetus:body', 'fetus:legs', 'fetus:tail'];
      for (var i = 0; i < parts.length; i++) { await tapPick(parts[i]); }
      await until('the four parts', function () { return api.state().fetusObserved || Lab.logic.exp8.partsDone(api.state()); }, 40);
      api.drop('lens', 'fetus'); await until('fetus under the glass', function () { return api.state().fetusObserved && !api.X.busy; }, 30);
      api.X.closeLens(); await nextPhase(api, 7);
    },
    kitten: async function (api) {
      await S8.fetus(api);
      await until('the newborn kitten', function () { return !!found('kitten') && !api.X.busy; }, 60);
      await tapPick('kitten'); await until('kitten clicked', function () { return api.state().kittenClicked && !api.X.busy; }, 30);
      api.drop('lens', 'kitten'); await until('kitten under the glass', function () { return api.state().kittenObserved && !api.X.busy; }, 30);
      api.X.closeLens(); await nextPhase(api, 8);
    },
    growth: async function (api) {
      await S8.kitten(api); await marks(api, 'growth', 4);
      await until('three kittens', function () { return !!found('kitten0') && !api.X.busy; }, 60);
      for (var i = 0; i < 3; i++) { await tapPick('kitten' + i); await adv(1.2); }
      await until('compared', function () { return api.state().compared.every(Boolean) && !api.X.busy; }, 40);
      await nextPhase(api, 9);
    },
    adultCat: async function (api) { await S8.growth(api); await marks(api, 'adult', 3); await nextPhase(api, 10); },
    finale: async function (api) {
      await S8.adultCat(api);
      for (var i = 0; i < 8; i++) { api.drop('c' + i, 'slot' + i); await adv(1.2); }
      await until('sorted', function () { return api.state().complete; }, 40);
      await adv(10);
      document.getElementById('caption').innerHTML = ''; document.getElementById('toasts').innerHTML = '';
    }
  };

  var S = {
    start: async function () { },
    setup: async function (api) { api.drop('potA', 'bench'); api.drop('potB', 'bench'); await adv(2); api.drop('water', 'potB'); await adv(5); },
    bins: async function (api) { await S.setup(api); api.drop('clearBin', 'potB'); await adv(6); },
    dark: async function (api) { await S.setup(api); api.drop('blackBin', 'potB'); await adv(6); },
    lag: async function (api) { await S.setup(api); api.drop('gravel', 'potB'); await adv(1.9); },
    run: async function (api, o) {
      await S.setup(api);
      for (var i = 0; i < (o.tools || []).length; i++) { api.drop(o.tools[i], 'potB'); await adv(6); }
      if (o.temp != null) { var cur = api.state().B.temperature; if (o.temp > cur) press(1, o.temp - cur); else press(0, cur - o.temp); }
      api.start(); await adv(o.until || 17);
    },
    healthy: function (api) { return S.run(api, { temp: 33 }); },
    dry: async function (api) { api.drop('potA', 'bench'); api.drop('potB', 'bench'); await adv(2); press(1, 5); api.start(); await adv(17); },
    cold: function (api) { return S.run(api, { temp: 10 }); },
    hot: function (api) { return S.run(api, { temp: 45 }); },
    combo: function (api) { return S.run(api, { tools: ['gravel', 'clearBin'], temp: 33 }); },
    night: async function (api) { await S.setup(api); press(1, 5); api.start(); await adv(3.4); }
  };

  async function go() {
    var t0 = Date.now();
    while (!(Lab.app && Lab.app.current && Lab.app.current.inst) && Date.now() - t0 < 8000) await new Promise(function (r) { setTimeout(r, 50); });
    var api = Lab.app.current && Lab.app.current.inst && Lab.app.current.inst.api;
    var list = exp === 'exp8' ? S8 : exp === 'exp7' ? S7 : exp === 'exp6' ? S6 : exp === 'exp5' ? S5 : exp === 'exp4' ? S4 : exp === 'exp3' ? S3 : exp === 'exp2' ? S2 : S;
    try { if (list[scenario]) await list[scenario](api, {}); } catch (e) { console.error(e); document.title = 'ERROR ' + e.message; }
    await adv(0.1);
    document.body.dataset.ready = '1';
  }
  if (!location.hash) location.hash = '#' + exp;
  window.addEventListener('load', function () { setTimeout(go, 400); });
})();
