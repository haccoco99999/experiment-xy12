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
    var list = exp === 'exp3' ? S3 : S;
    try { if (list[scenario]) await list[scenario](api, {}); } catch (e) { console.error(e); document.title = 'ERROR ' + e.message; }
    await adv(0.1);
    document.body.dataset.ready = '1';
  }
  if (!location.hash) location.hash = '#' + exp;
  window.addEventListener('load', function () { setTimeout(go, 400); });
})();
