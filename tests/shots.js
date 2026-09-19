/* Scripted scenarios for screenshots (developer tool). Open tests/shots.html?e=exp1&s=<scenario>.
   Uses a virtual clock so the result never depends on the machine's speed. */
(function () {
  'use strict';
  var q = new URLSearchParams(location.search), scenario = q.get('s') || 'start', exp = q.get('e') || 'exp1';
  function flush() { return new Promise(function (r) { var c = new MessageChannel(); c.port1.onmessage = function () { r(); }; c.port2.postMessage(0); }); }
  async function adv(sec) { var n = Math.ceil(sec * 30); for (var i = 0; i < n; i++) { Lab.tween._update(1 / 30); await flush(); } Lab.stage.render(0); }
  function press(idx, n) { var b = document.querySelectorAll('.thermo .btn-round')[idx]; for (var i = 0; i < n; i++) { b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); } }

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
    try { if (S[scenario]) await S[scenario](api, {}); } catch (e) { console.error(e); document.title = 'ERROR ' + e.message; }
    await adv(0.1);
    document.body.dataset.ready = '1';
  }
  if (!location.hash) location.hash = '#' + exp;
  window.addEventListener('load', function () { setTimeout(go, 400); });
})();
