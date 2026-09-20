/* Lab.app – start-up, the home page, moving between the home page and an experiment, and the
   "clean rebuild" that powers LÀM LẠI THÍ NGHIỆM (every timer, effect, label, zone and 3D object is
   thrown away, then the experiment is created again from scratch). */
(function (Lab) {
  'use strict';
  var U = Lab.util, UI = Lab.ui;

  var CATALOG = [
    { n: 1, id: 'exp1', group: 'plant', emoji: '🌱', title: 'Các yếu tố cần thiết cho sự sống và phát triển của thực vật', sub: 'Cây đậu xanh · 5 yếu tố' },
    { n: 2, id: 'exp2', group: 'plant', emoji: '🥬', title: 'Trao đổi khí, nước và chất khoáng của thực vật với môi trường', sub: 'Cây rau cải' },
    { n: 3, id: 'exp3', group: 'animal', emoji: '🐥', title: '5 yếu tố cần thiết cho sự sống của động vật', sub: 'Gà con' },
    { n: 4, id: 'exp4', group: 'animal', emoji: '🐭', title: 'Trao đổi nước, không khí và thức ăn của động vật với môi trường', sub: 'Chuột bạch' },
    { n: 5, id: 'exp5', group: 'plant', emoji: '🍅', title: 'Cơ quan sinh sản của thực vật có hoa và quá trình tạo quả, hạt', sub: 'Hoa cà chua' },
    { n: 6, id: 'exp6', group: 'plant', emoji: '🌿', title: 'Sự hình thành cây con từ hạt, rễ, thân và lá của thực vật', sub: 'Đậu xanh · khoai lang · khoai tây · thuốc bỏng' },
    { n: 7, id: 'exp7', group: 'animal', emoji: '🦋', title: 'Sinh sản và vòng đời của động vật đẻ trứng', sub: 'Bướm' },
    { n: 8, id: 'exp8', group: 'animal', emoji: '🐱', title: 'Sinh sản và vòng đời của mèo', sub: 'Động vật đẻ con' }
  ];

  var app = Lab.app = { current: null, catalog: CATALOG };
  var els = {};

  function renderHome() {
    var wrap = U.el('div', { class: 'home-wrap' });
    wrap.appendChild(U.el('header', { class: 'home-head' },
      U.el('h1', { class: 'home-title', text: 'PHÒNG THÍ NGHIỆM SÂN VƯỜN' }),
      U.el('p', { class: 'home-sub', text: 'Em hãy chọn một thí nghiệm để bắt đầu nhé!' })));
    [['plant', '🌱', 'Thực vật'], ['animal', '🐾', 'Động vật']].forEach(function (g) {
      wrap.appendChild(U.el('h2', { class: 'group-title ' + g[0] }, U.el('span', { class: 'em', text: g[1] }), g[2]));
      var grid = U.el('div', { class: 'exp-grid' });
      CATALOG.filter(function (c) { return c.group === g[0]; }).forEach(function (c) {
        var built = !!Lab.experiments[c.id];
        var btn = built
          ? U.el('a', { class: 'btn', href: '#' + c.id, text: 'Bắt đầu ▶' })
          : U.el('button', { class: 'btn btn-ghost', text: 'Sắp có', disabled: true });
        grid.appendChild(U.el('article', { class: 'exp-card ' + c.group + (built ? '' : ' soon') },
          U.el('span', { class: 'exp-num', text: String(c.n) }),
          U.el('div', { class: 'exp-emoji', text: c.emoji }),
          U.el('h3', { class: 'exp-title', text: c.title }),
          U.el('div', { class: 'exp-sub', text: c.sub }),
          btn));
      });
      wrap.appendChild(grid);
    });
    wrap.appendChild(U.el('p', { class: 'home-foot', text: 'Kéo – thả dụng cụ, quan sát và rút ra kết luận. Không có điểm số, em cứ thoải mái thử nhé!' }));
    U.clear(els.home); els.home.appendChild(wrap);
  }

  function cleanup() {
    if (app.current && app.current.inst && app.current.inst.dispose) { try { app.current.inst.dispose(); } catch (e) { console.error(e); } }
    app.current = null;
    Lab.tween.killAll(); Lab.loop.clearTickers();
    Lab.lens.hide(); Lab.sceneDrag.clear();
    Lab.labels.clear(); Lab.drag.clear(); Lab.fx.clearAll(); UI.clearDynamic();
    if (Lab.stage.ok) Lab.stage.disposeScene();
  }

  function build(id) {
    var exp = Lab.experiments[id];
    cleanup();
    UI.setExperiment(exp);
    var scene = Lab.stage.newScene();
    try {
      var inst = exp.create({ scene: scene });
      app.current = { id: id, exp: exp, inst: inst };
    } catch (e) {
      console.error(e);
      UI.toast('Có lỗi khi mở thí nghiệm. Em hãy bấm LÀM LẠI THÍ NGHIỆM nhé.', { type: 'warn' });
    }
    Lab.loop.wake();
  }

  function showHome() {
    cleanup();
    document.body.dataset.screen = 'home';
    els.home.hidden = false; els.lab.hidden = true;
    els.fallback.hidden = true;
    document.title = 'Phòng thí nghiệm sân vườn';
  }

  function enterLab(id) {
    document.body.dataset.screen = 'lab';
    els.home.hidden = true; els.lab.hidden = false;
    if (!Lab.stage.ok) {
      if (!Lab.stage.supported() || !Lab.stage.init(UI.el.stage)) { els.fallback.hidden = false; return; }
    }
    els.fallback.hidden = true;
    document.title = Lab.experiments[id].title + ' – Phòng thí nghiệm sân vườn';
    build(id);
  }

  function route() {
    var h = (location.hash || '').replace('#', '');
    if (/^exp\d$/.test(h) && Lab.experiments[h]) enterLab(h); else showHome();
  }

  function askReset() {
    if (!app.current) return;
    UI.confirm({ text: 'Em có chắc muốn làm lại thí nghiệm không?', okLabel: 'LÀM LẠI', cancelLabel: 'HỦY' }).then(function (ok) {
      if (ok && app.current) { build(app.current.id); Lab.audio.play('pop'); }
    });
  }

  function showHelp() {
    if (!app.current) return;
    var lines = app.current.exp.help || ['Kéo dụng cụ từ khay bên trái và thả lên bàn thí nghiệm.', 'Làm theo các thông báo trên màn hình.'];
    var body = U.el('div', {},
      U.el('ol', { class: 'help-list' }, lines.map(function (l) { return U.el('li', { text: l }); })),
      U.el('div', { class: 'confirm-actions' }, U.el('button', { class: 'btn', text: 'ĐÃ HIỂU', attrs: { 'data-autofocus': '1' }, on: { click: function () { m.close(); } } })));
    var m = UI.modal(body, { title: 'Hướng dẫn' });
  }

  /* numbers used by the tests to prove that a reset leaves nothing behind */
  app.snapshot = function () {
    var st = Lab.stage.stats ? Lab.stage.stats() : {};
    return {
      tweens: Lab.tween.count(), tickers: Lab.loop.tickerCount(), labels: Lab.labels.count(), zones: Lab.drag.zoneCount(),
      sceneItems: Lab.sceneDrag.count(), lens: Lab.lens.active() ? 1 : 0,
      sceneChildren: Lab.stage.scene ? Lab.stage.scene.children.length : 0, geometries: st.geometries, textures: st.textures,
      toasts: UI.el.toasts.children.length, modals: UI.el['modal-root'].children.length, ghosts: document.querySelectorAll('.drag-ghost').length
    };
  };
  app.reset = function () { if (app.current) build(app.current.id); };
  app.go = function (id) { location.hash = id ? '#' + id : ''; };

  function boot() {
    ['home', 'lab', 'fallback', 'rotate-hint'].forEach(function (id) { els[id] = document.getElementById(id); });
    UI.init();
    Lab.labels.init(UI.el.labels);
    Lab.drag.init(UI.el.zones);
    UI.onReset = askReset; UI.onHelp = showHelp; UI.onHome = function () { app.go(''); };
    document.getElementById('btn-fallback-home').addEventListener('click', function () { app.go(''); });
    window.addEventListener('hashchange', route);
    window.addEventListener('error', function (e) { console.error(e.error || e.message); });
    renderHome();
    var ready = (document.fonts && document.fonts.load) ? Promise.all([document.fonts.load('800 20px Quicksand'), document.fonts.load('600 20px Quicksand')]).catch(function () { }) : Promise.resolve();
    ready.then(route);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window.Lab);
