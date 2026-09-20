/* Experiment 7, part "sắp xếp và kết thúc": four cards (BƯỚM TRƯỞNG THÀNH, NHỘNG, TRỨNG, SÂU NON) are dragged into VỊ TRÍ 1 … 4 on the table in front of the plant
   (md 30–34); a wrong card goes back and the hint chain appears; when all four are right the screen shows HOÀN THÀNH THÍ NGHIỆM, the diagram that lights up one step
   after another, and the conclusions (35, 53, 54, 58). */
(Lab.exp7mods = Lab.exp7mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, UI = X.UI, state = X.state, V = X.V, el = X.U.el;
  var ORDER = [3, 2, 0, 1];                                          // the cards lie in the tray in the order the md lists them (card i belongs to VỊ TRÍ i + 1)
  var SX = [-3.3, -1.1, 1.1, 3.3], SZ = 1.55, pads = [], slotTags = [];

  X.startSort = function () {
    X.mode = 'sort'; X.shot('sort', 1200);
    UI.setTray(ORDER.map(function (i) { return { id: 'c' + i, label: MD.sort.cards[i] }; }), { title: APP.cardsTitle, onClick: function () { } });
    for (var i = 0; i < 4; i++) (function (i) {
      var pad = new T.Mesh(new T.BoxGeometry(1.9, 0.06, 1.1), Lab.mat.std(0xf3ecd8, { roughness: 0.7 })); pad.position.set(SX[i], 0.03, SZ); pad.receiveShadow = true; pad.userData.noPick = true;
      X.scene.add(pad); pads.push(pad); slotTags.push(X.tag(MD.sort.slots[i], V(SX[i], 0.4, SZ), 'place'));
      Lab.drag.addZone({
        id: 'slot' + i, label: '', pad: 8, priority: 9, rect: function () { return Lab.stage.rectOf(new T.Box3(V(SX[i] - 0.95, 0, SZ - 0.55), V(SX[i] + 0.95, 0.4, SZ + 0.55)), 0); },
        accepts: function (it) { return /^c\d$/.test(it.id) && !state.sorted[+it.id[1]]; }
      });
    })(i);
    X.toast(MD.msg.sortTask, { type: 'info', ms: 7000 }); X.refresh();
  };

  X.drops.card = function (id, zid) {
    var card = +id[1], m = zid && /^slot(\d)$/.exec(zid), r = L.decideSort(state, card, m ? +m[1] : null);
    if (!r.ok) {
      if (!r.msg) return { ok: false };
      X.sortHint = true; X.refresh(); return { ok: false, message: X.msgFor(r.msg) };                     // the card goes back; the hint chain stays in the panel
    }
    var res = L.applySort(state, card);
    UI.setCard('c' + card, { ghost: true, used: true }); Lab.audio.play('ok'); Lab.fx.sparkles(X.scene, V(SX[card], 0.6, SZ), 0xffe066, 8);
    pads[card].material.color.setHex(0xbfe8b0); slotTags[card].el.textContent = MD.sort.cards[card] + ' ✓'; slotTags[card].el.classList.add('ok');
    if (res.done) complete();
    X.refresh(); return { ok: true };
  };
  function complete() {
    UI.panelWide(true); Lab.audio.play('done'); Lab.fx.confetti(3400); X.toast(MD.sort.right, { type: 'ok', ms: 6500 }); UI.caption(MD.finish.title, { ms: 2200, cls: 'day' });
    for (var i = 0; i < 10; i++) (function (i) { X.wait(1.2 + i * 0.6).then(function () { X.dgCount = i + 1; var n = document.querySelectorAll('.dg-item')[i]; if (n) n.classList.add('show'); }); })(i);
  }

  X.panelHooks.push(function (stack) {
    if (!L.sorting(state)) return;
    stack.appendChild(el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: MD.sort.title }),
      X.sortHint ? el('div', { class: 'stage-line', text: APP.hintChain + ': ' + MD.sort.hint }) : el('p', { class: 'result-note', text: APP.sortHelp })));
  });

  function chain(list) {
    return el('div', { class: 'xd-chain' }, list.map(function (t) { return el('span', { class: 'xd-chip' }, [document.createTextNode(t)]); })
      .reduce(function (a, c, j) { a.push(c); if (j < list.length - 1) a.push(el('span', { class: 'xd-arr', text: '→' })); return a; }, []));
  }
  X.dgCount = 0;
  X.finale = {
    render: function (stack) {
      var F = MD.finish;
      stack.appendChild(el('div', { class: 'panel-card done-card' }, el('div', { class: 'done-title', text: F.title }), el('p', { class: 'result-note', text: F.line }), chain(F.chain), el('p', { class: 'result-note', text: MD.sort.summary })));
      var items = [];
      MD.diagram.forEach(function (t, i) {
        items.push(el('div', { class: 'dg-item' + (i < X.dgCount ? ' show' : '') }, i ? el('span', { class: 'xd-arrow', text: '↓' }) : null, el('span', { class: 'xd-chip' + (i === 0 || i === MD.diagram.length - 1 ? ' mid' : '') }, [document.createTextNode(t)])));
      });
      stack.appendChild(el('div', { class: 'panel-card xd' }, el('div', { class: 'obs-head', text: APP.diagramTitle }), el('div', { class: 'dg' }, items)));
      stack.appendChild(el('div', { class: 'panel-card conclusion' }, el('div', { class: 'obs-head', text: F.conclusionTitle }),
        F.conclusion.map(function (t) { return el('p', { class: 'result-note', text: t }); }), el('p', { class: 'result-note strong', text: F.message }), el('p', { class: 'result-note', text: F.conclusionLast })));
    }
  };
});
