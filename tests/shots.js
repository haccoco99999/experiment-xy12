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
    var list = exp === 'exp6' ? S6 : exp === 'exp5' ? S5 : exp === 'exp4' ? S4 : exp === 'exp3' ? S3 : exp === 'exp2' ? S2 : S;
    try { if (list[scenario]) await list[scenario](api, {}); } catch (e) { console.error(e); document.title = 'ERROR ' + e.message; }
    await adv(0.1);
    document.body.dataset.ready = '1';
  }
  if (!location.hash) location.hash = '#' + exp;
  window.addEventListener('load', function () { setTimeout(go, 400); });
})();
