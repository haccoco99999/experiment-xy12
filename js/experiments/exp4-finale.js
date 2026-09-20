/* Experiment 4, part "kết quả": when both topics are done the rat is healthy again and all six exchanges run at the same time
   (md sections 38–43 and 59). "XEM LẠI TƯƠNG TÁC" plays them one by one; DỪNG / TIẾP TỤC / XEM LẠI control that replay (section 60). */
(Lab.exp4mods = Lab.exp4mods || []).push(function (X) {
  'use strict';
  var T = X.T, U = X.U, MD = X.MD, APP = X.APP, el = U.el, R = MD.result, C = MD.finish, LB = MD.labels;
  var SIDE = { x: 0.35, z: 0.3 };                                          // the rat stands side-on, nose to the left
  var TOP = new T.Vector3(-0.1, 2.35, 0.6);                                // where the long arrow text floats while one exchange plays alone
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  function hex(c) { return '#' + ('000000' + c.toString(16)).slice(-6); }

  /* the six exchanges in the replay order of md section 60. `pts` follow the way the matter travels, `at` is where the short name floats,
     `line` is its place in the six ticked lines of the panel (in first, then out). */
  var FLOWS = [
    { id: 'o2', color: 0xff6a58, line: 0, text: R.inFlows[0], short: LB.o2, at: V(-2.6, 1.55, 0.75), pts: [V(-2.6, 1.2, 0.75), V(-2.15, 0.98, 0.65), V(-1.8, 0.75, 0.5), V(-1.55, 0.58, 0.32)] },
    { id: 'co2', color: 0x8b7b6b, line: 3, text: R.outFlows[0], short: LB.co2, at: V(-1.5, 2.3, 0.6), pts: [V(-1.45, 0.72, 0.34), V(-1.55, 1.25, 0.5), V(-1.75, 1.75, 0.6), V(-2.0, 2.1, 0.6)] },
    { id: 'water', color: 0x59bff2, line: 1, text: R.inFlows[1], short: LB.water, at: V(-2.3, 0.85, -0.3), pts: [V(-2.3, 0.36, -0.3), V(-2.0, 0.6, -0.05), V(-1.7, 0.55, 0.15), V(-1.45, 0.42, 0.28)] },
    { id: 'food', color: 0xffb347, line: 2, text: R.inFlows[2], short: LB.food, at: V(-2.3, -0.12, 1.05), pts: [V(-2.3, 0.42, 0.95), V(-2.0, 0.62, 0.75), V(-1.7, 0.55, 0.5), V(-1.45, 0.4, 0.33)] },
    { id: 'waste', color: 0x6b4a2b, line: 4, text: R.outFlows[1], short: LB.waste, at: V(2.4, 0.65, 1.4), pts: [V(1.35, 0.4, 0.3), V(1.7, 0.3, 0.8), V(2.05, 0.2, 1.2), V(2.4, 0.14, 1.4)] },
    { id: 'urine', color: 0xffd400, line: 5, text: R.outFlows[2], short: LB.urine, at: V(1.1, -0.12, 1.5), pts: [V(0.97, 0.34, 0.32), V(1.03, 0.28, 0.8), V(1.07, 0.2, 1.15), V(1.1, 0.14, 1.4)] }
  ];
  var handles = [], tags = [], starting = false, replaying = false, paused = false, idx = -1, run = 0;

  /* alone = true: only this exchange is drawn, with its long arrow text on top; otherwise the six are drawn together with short names */
  function addFlow(f, alone) {
    handles.push(Lab.fx.flow(X.scene, { points: f.pts.map(function (p) { return p.clone(); }), color: f.color, size: 0.085, count: 10, speed: 1.3, spread: 0.05, seeThrough: true }));
    tags.push(X.tag(alone ? f.text : f.short, alone ? TOP : f.at, alone ? 'arrow long' : 'mol fl-' + f.id));
  }
  function clearFlows() { handles.forEach(function (h) { h.stop(); }); handles.length = 0; tags.forEach(function (t) { t.remove(); }); tags.length = 0; }
  function showAll() { clearFlows(); FLOWS.forEach(function (f) { addFlow(f, false); }); }
  function cancelReplay() { run++; replaying = false; paused = false; idx = -1; }

  X.leaveHooks.push(function () {
    cancelReplay(); clearFlows();
    if (X.mode === 'result' && X.rat) {                                     // leaving the result view: the rat goes back to its place
      Lab.tween.to(X.rat.group.position, { x: X.POS.x, z: X.POS.z }, 0.7);
      Lab.tween.to(X.rat.group.rotation, { y: X.near(X.rat.group.rotation.y, X.HEADING) }, 0.7);
    }
  });

  /* the healthy rat hops a little, so it is clear that it is well and active (md section 38) */
  async function hop(n) {
    var seq = X.seq, g = X.rat.group;
    for (var i = 0; i < n; i++) {
      await Lab.tween.to(g.position, { y: 0.22 }, 0.16, { ease: 'outQuad' }).promise;
      await Lab.tween.to(g.position, { y: 0 }, 0.16, { ease: 'inQuad' }).promise;
      if (seq !== X.seq) return;
    }
  }
  function showResultView() {
    X.go('result', 1000); X.UI.panelWide(true);
    var g = X.rat.group; X.rat.pose.walk = 0;
    Lab.tween.to(g.position, { x: SIDE.x, z: SIDE.z }, 0.9); Lab.tween.to(g.rotation, { y: X.near(g.rotation.y, -Math.PI / 2) }, 0.9);
  }

  /* ---------------- the replay ---------------- */
  async function replay() {
    X.touch(); Lab.audio.play('click');
    if (X.mode !== 'result') showResultView();
    var my = ++run; replaying = true; paused = false; clearFlows();
    for (var i = 0; i < FLOWS.length; i++) {
      if (my !== run) return;
      idx = i; clearFlows(); addFlow(FLOWS[i], true); X.refresh(); Lab.audio.play('pop');
      for (var t = 0; t < 3.4;) {
        await Lab.tween.wait(0.1).promise;
        if (my !== run) return;
        if (!paused) t += 0.1;
      }
    }
    if (my !== run) return;
    replaying = false; idx = -1; showAll(); X.refresh();
  }
  function pause() { if (!replaying || paused) return; X.touch(); paused = true; handles.forEach(function (h) { h.setActive(false); }); X.refresh(); }
  function resume() { if (!replaying || !paused) return; X.touch(); paused = false; handles.forEach(function (h) { h.setActive(true); }); X.refresh(); }

  /* ---------------- the side panel ---------------- */
  function button(text, off, fn, cls) {
    return el('button', { class: 'btn ' + (cls || 'btn-blue'), text: text, attrs: off ? { disabled: 'disabled' } : {}, on: { click: fn } });
  }
  function replayBox() {
    if (!replaying) return el('button', { class: 'btn btn-orange synth-btn', text: C.replay, on: { click: replay } });
    return el('div', { class: 'replay-box' },
      el('div', { class: 'replay-now', text: (idx + 1) + '/' + FLOWS.length + ' · ' + FLOWS[idx].text }),
      el('div', { class: 'replay-btns' }, button(C.controls[0], paused, pause), button(C.controls[1], !paused, resume), button(C.controls[2], false, replay, 'btn-orange')));
  }
  /* the six arrows (md sections 39 and 40), then the central diagram (section 41) */
  function resultCard() {
    var D = R.diagram, playing = replaying && idx >= 0 ? FLOWS[idx].id : '';
    var row = function (s, cls) { return el('div', { class: 'xd-row ' + cls }, s.split(' + ').map(function (t) { return el('span', { class: 'xd-chip', text: t }); })); };
    var arrow = function () { return el('div', { class: 'xd-arrow', text: '↓' }); };
    var flows = el('ul', { class: 'flow-list xd-flows' }, FLOWS.slice().sort(function (a, b) { return a.line - b.line; }).map(function (f) {
      return el('li', { class: playing === f.id ? 'playing' : '' }, el('span', { class: 'dot', style: { background: hex(f.color) } }), el('span', { class: 'xd-text', text: f.text }));
    }));
    return el('div', { class: 'panel-card xd' }, el('div', { class: 'obs-head', text: R.title }), flows,
      el('div', { class: 'xd-gap' }),
      el('div', { class: 'xd-box env', text: D[0] }), arrow(), row(D[1], 'in'), arrow(), el('div', { class: 'xd-box rat', text: D[2] }), arrow(), row(D[3], 'out'), arrow(), el('div', { class: 'xd-box env', text: D[4] }));
  }
  function summaryCard() {
    var S = MD.summary;
    return el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.learnedTitle }), el('div', {
      html: '<table class="result-table summary"><thead><tr>' + S.head.map(function (h) { return '<th>' + X.esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        S.rows.map(function (r) { return '<tr><th>' + X.esc(r[0]) + '</th><td>' + X.esc(r[1]) + '</td><td>' + X.esc(r[2]) + '</td></tr>'; }).join('') + '</tbody></table>'
    }));
  }

  X.finale = {
    begin: function () {
      if (X.finaleShown || starting) return; starting = true;
      Lab.tween.wait(1.6).promise.then(function () {                        // let the student read the last message first
        starting = false; if (X.finaleShown) return;
        X.finaleShown = true; showResultView(); showAll();
        X.UI.caption(R.title, { ms: 1500, cls: 'day' }).then(function () { return X.UI.caption(C.title, { ms: 2400, cls: 'day' }); });
        Lab.audio.play('done'); Lab.fx.confetti(3400);
        Lab.tween.wait(1.0).promise.then(function () { if (X.mode === 'result') hop(2); });
        X.refresh();
      });
    },
    /* the cards of the side panel once everything is done */
    render: function (stack) {
      var playing = replaying && idx >= 0 ? FLOWS[idx].line : -1;
      var lines = C.lines.map(function (t, i) {
        var f = FLOWS.filter(function (x) { return x.line === i; })[0];
        return el('li', { class: playing === i ? 'playing' : '' }, el('span', { class: 'ok', text: '✓', style: { background: hex(f.color) } }), el('span', { class: 'tx', text: t }));
      });
      stack.appendChild(el('div', { class: 'panel-card done-card' }, el('div', { class: 'done-title', text: C.title }), el('div', { class: 'done-sub', text: C.sub }),
        el('ul', { class: 'done-list' }, lines), replayBox()));
      stack.appendChild(resultCard());
      stack.appendChild(el('div', { class: 'panel-card conclusion' }, el('div', { class: 'obs-head', text: APP.conclusionTitle }), el('p', { class: 'result-note', text: MD.conclusion }),
        el('div', { class: 'kw-row' }, el('span', { class: 'kw in', text: MD.keywords[0] }), el('span', { class: 'kw out', text: MD.keywords[1] }))));
      stack.appendChild(summaryCard());
    }
  };
});
