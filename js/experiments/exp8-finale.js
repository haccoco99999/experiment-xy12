/* Experiment 8, the end (md sections XXII–XXIV, XXXVII, XLVI): eight cards are dragged into eight numbered slots on the table (a wrong card goes back and shakes, the right ones stay);
   when all eight are right, arrows light up between the slots one after another, and the side panel shows HOÀN THÀNH THÍ NGHIỆM!, the diagram, the conclusion and the buttons
   to look at any stage again (a read-only review: it never changes the progress). */
(Lab.exp8mods = Lab.exp8mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, UI = X.UI, state = X.state, V = X.V, PH = X.PH, el = X.U.el;
  var ORDER = [3, 6, 0, 7, 2, 5, 1, 4];                              // the cards lie in the tray shuffled (card i belongs to slot i)
  var SPOT = [[-3.3, 0.6], [-1.1, 0.6], [1.1, 0.6], [3.3, 0.6], [3.3, 2.0], [1.1, 2.0], [-1.1, 2.0], [-3.3, 2.0]];       // slots 1–4 left to right, 5–8 right to left
  var pads = [], padTags = [], arrows = [];
  X.dgCount = 0;

  X.enter[PH.sort] = function () {
    var b = X.born; [b.mother(), b.kit()].forEach(function (c) { if (c) c.group.visible = false; });
    if (X.tl) X.tlEnd(); X.info = null; X.shot('sort', 1200);
    UI.setTray(ORDER.map(function (i) { return { id: 'c' + i, label: MD.sort.cards[i] }; }), { title: APP.cardsTitle, onClick: function () { } });
    SPOT.forEach(function (p, i) {
      var pad = new T.Mesh(new T.BoxGeometry(1.75, 0.06, 1.1), Lab.mat.std(0xf3ecd8, { roughness: 0.7 })); pad.position.set(p[0], 0.03, p[1]); pad.receiveShadow = true; pad.userData.noPick = true; X.scene.add(pad); pads.push(pad);
      padTags.push(X.tag(String(i + 1), V(p[0], 0.4, p[1]), 'place'));
      Lab.drag.addZone({
        id: 'slot' + i, label: '', pad: 8, priority: 9, rect: function () { return Lab.stage.rectOf(new T.Box3(V(p[0] - 0.9, 0, p[1] - 0.6), V(p[0] + 0.9, 0.4, p[1] + 0.6)), 0); },
        accepts: function (it) { return /^c\d$/.test(it.id) && !state.sorted[+it.id[1]]; }
      });
    });
    X.toast(MD.msg.sortTask, { type: 'info', ms: 7000 }); X.refresh();
  };
  X.drops.card = function (id, zid) {
    var card = +id[1], m = zid && /^slot(\d)$/.exec(zid), r = L.decideSort(state, card, m ? +m[1] : null);
    if (!r.ok) return r.msg ? { ok: false, message: X.msgFor(r.msg) } : { ok: false };
    var res = L.applySort(state, card);
    UI.setCard('c' + card, { ghost: true, used: true }); Lab.audio.play('ok'); Lab.fx.sparkles(X.scene, V(SPOT[card][0], 0.6, SPOT[card][1]), 0xffe066, 8);
    pads[card].material.color.setHex(0xbfe8b0); padTags[card].el.textContent = MD.sort.cards[card] + ' ✓'; padTags[card].el.classList.add('ok');
    if (res.done) complete();
    X.refresh(); return { ok: true };
  };
  function arrow(i) {
    var s = new T.Shape(); s.moveTo(-0.22, -0.08); s.lineTo(0.04, -0.08); s.lineTo(0.04, -0.18); s.lineTo(0.26, 0); s.lineTo(0.04, 0.18); s.lineTo(0.04, 0.08); s.lineTo(-0.22, 0.08); s.closePath();
    var g = new T.ShapeGeometry(s); g.rotateX(-Math.PI / 2);
    var m = new T.Mesh(g, new T.MeshBasicMaterial({ color: 0xffe066, side: T.DoubleSide, transparent: true, opacity: 0.95, depthWrite: false, fog: false })), a = SPOT[i], b = SPOT[i + 1];
    m.position.set((a[0] + b[0]) / 2, 0.09, (a[1] + b[1]) / 2); m.rotation.y = Math.atan2(-(b[1] - a[1]), b[0] - a[0]); m.scale.setScalar(0.001); m.userData.noPick = true; X.scene.add(m); return m;
  }
  function complete() {
    UI.panelWide(true); Lab.audio.play('done'); Lab.fx.confetti(3400); X.toast(MD.sort.right, { type: 'ok', ms: 7000 }); UI.caption(MD.finish.title, { ms: 2400, cls: 'day' });
    for (var i = 0; i < 7; i++) (function (i) {
      var a = arrow(i); arrows.push(a);
      X.wait(0.5 + i * 0.5).then(function () { X.tween(0.4, function (k) { a.scale.setScalar(Math.max(0.001, k)); }, 'outCubic').then(function () { a.material.color.setHex(0x7bd88f); }); });
    })(i);
    for (var j = 0; j < 8; j++) (function (j) { X.wait(1.2 + j * 0.6).then(function () { X.dgCount = j + 1; var n = document.querySelectorAll('.dg-item')[j]; if (n) n.classList.add('show'); }); })(j);
  }

  /* ---------------- the final panel ---------------- */
  X.finale = {
    render: function (stack) {
      var F = MD.finish;
      stack.appendChild(el('div', { class: 'panel-card done-card' }, el('div', { class: 'done-title', text: F.title }), el('p', { class: 'result-note', text: F.line })));
      var items = MD.sort.cards.map(function (t, i) { return el('div', { class: 'dg-item' + (i < X.dgCount ? ' show' : '') }, i ? el('span', { class: 'xd-arrow', text: '↓' }) : null, el('span', { class: 'xd-chip' + (i === 0 || i === 7 ? ' mid' : '') }, [document.createTextNode(t)])); });
      stack.appendChild(el('div', { class: 'panel-card xd' }, el('div', { class: 'obs-head', text: APP.diagramTitle }), el('div', { class: 'dg' }, items)));
      stack.appendChild(el('div', { class: 'panel-card conclusion' }, el('div', { class: 'obs-head', text: F.conclusionTitle }), el('p', { class: 'result-note', text: F.conclusion }),
        el('div', { class: 'obs-head', text: F.end }), el('div', { class: 'stage-line', text: F.endTick }), el('p', { class: 'result-note strong', text: F.endLine })));
      stack.appendChild(X.button(MD.buttons.review, 'btn-blue', function () { X.review = 'list'; X.refresh(); }));
    }
  };

  /* ---------------- the read-only review (md XXXVII): text of a stage; nothing in the progress changes ---------------- */
  function reviewLines(i) {
    var R = MD.right, I = MD.markInfo, marks = function (tl) { return I[tl].map(function (m) { return MD.marks[tl][I[tl].indexOf(m)] + ': ' + m.msg; }); };
    return [[R.intro, R.maleId, R.femaleId], [MD.labels.sperm + ': ' + R.spermInfo, MD.labels.egg + ': ' + R.eggInfo], [R.fertilized], [R.zygote], marks('embryo'), marks('fetus'),
      [R.kittenBorn, R.kittenLens].concat(MD.newborn), marks('growth').concat([R.compareAll]), marks('adult').concat([R.adultAll])][i];
  }
  X.reviewRender = function (stack) {
    var list = X.review === 'list';
    stack.appendChild(el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: MD.buttons.reviewStage }), el('p', { class: 'result-note', text: APP.reviewNote })));
    if (list) stack.appendChild(el('div', { class: 'panel-card' }, MD.steps.map(function (name, i) { return X.button(name, 'btn-blue', function () { X.review = i; X.refresh(); }); })));
    else stack.appendChild(el('div', { class: 'panel-card' }, el('div', { class: 'info-title', text: MD.stageTitles[X.review] }), el('ul', { class: 'obs-list' }, reviewLines(X.review).map(function (t) { return el('li', { text: t }); }))));
    stack.appendChild(X.button(list ? APP.reviewClose : APP.reviewBack, 'btn-orange', function () { X.review = list ? null : 'list'; X.refresh(); }));
  };
});
