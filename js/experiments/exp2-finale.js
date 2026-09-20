/* Experiment 2, part "kết thúc": when both topics are done: the completion mark, the conclusion, the knowledge table and
   "TƯƠNG TÁC TỔNG HỢP", where every flow runs at the same time (md sections 39–43 and 61). */
(Lab.exp2mods = Lab.exp2mods || []).push(function (X) {
  'use strict';
  var T = X.T, U = X.U, MD = X.MD, APP = X.APP, state = X.state, scene = X.scene, env = X.env;
  var el = U.el, synthShown = false, synthOn = false, beam = null;
  var RED = 0xff6a58, BROWN = 0x8b7b6b, BLUE = 0x59bff2, ORANGE = 0xffb347;

  function stopSynth() {
    synthOn = false;
    if (beam) { X.dispose(beam); beam = null; }
  }
  X.leaveHooks.push(stopSynth);

  /* every flow at once: gases in and out (breathing and photosynthesis), water and minerals up the plant */
  function synthesis() {
    if (!X.plant) return;
    X.touch(); Lab.audio.play('click');
    X.go('synth', 1000); synthShown = synthOn = true;
    var plant = X.plant, lp = plant.leafPoint(), z = lp.z + 0.9, v = function (x, y, zz) { return new T.Vector3(x, y, zz == null ? z : zz); };
    beam = new T.Mesh(new T.CylinderGeometry(1.3, 0.45, 3.6, 28, 1, true), new T.MeshBasicMaterial({ color: 0xfff1a8, transparent: true, opacity: 0.15, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false }));
    beam.position.set(lp.x + 0.2, lp.y + 1.7, lp.z); beam.renderOrder = 2; beam.userData.noPick = true; scene.add(beam);
    function gas(pts, color, count) { X.addFx(Lab.fx.flow(scene, { points: pts, color: color, size: 0.1, count: count || 7, speed: 1.5, spread: 0.12, seeThrough: true })); }
    gas([v(lp.x - 2.6, lp.y - 0.5), v(lp.x - 1.3, lp.y - 0.4), v(lp.x - 0.2, lp.y - 0.35, lp.z + 0.5)], RED);                    // breathing: O₂ in
    gas([v(lp.x + 0.2, lp.y - 0.35, lp.z + 0.5), v(lp.x + 1.4, lp.y - 0.5), v(lp.x + 2.7, lp.y - 0.7)], BROWN);                  // breathing: CO₂ out
    gas([v(lp.x - 2.6, lp.y + 1.0), v(lp.x - 1.3, lp.y + 0.8), v(lp.x - 0.2, lp.y + 0.6, lp.z + 0.5)], BROWN);                   // photosynthesis: CO₂ in
    gas([v(lp.x + 0.2, lp.y + 0.6, lp.z + 0.5), v(lp.x + 1.4, lp.y + 0.9), v(lp.x + 2.7, lp.y + 1.3)], RED);                     // photosynthesis: O₂ out
    X.addFx(Lab.fx.flow(scene, { points: plant.soilPath(-0.06), color: BLUE, size: 0.075, count: 12, speed: 1.4, seeThrough: true }));
    X.addFx(Lab.fx.flow(scene, { points: plant.soilPath(0.06), color: ORANGE, size: 0.075, count: 12, speed: 1.4, seeThrough: true }));
    plant.setVigor(1); plant.pulse();
    X.refresh();
  }

  function flowRow(color, title, text) {
    return el('li', {}, el('span', { class: 'dot', style: { background: color } }), el('div', {}, el('b', { text: title }), el('div', { text: text })));
  }
  function hex(c) { return '#' + ('000000' + c.toString(16)).slice(-6); }

  X.finale = {
    begin: function () {
      if (X.finaleShown) return; X.finaleShown = true;
      X.go('synth', 1100); X.UI.panelWide(true);
      X.plant.setVigor(1);
      X.UI.caption(MD.finish.mark, { ms: 1500, cls: 'day' }).then(function () { return X.UI.caption(MD.finish.title, { ms: 2400, cls: 'day' }); });
      Lab.audio.play('done'); Lab.fx.confetti(3400);
      X.refresh();
    },
    /* the cards of the side panel once everything is done */
    render: function (stack) {
      var C = MD.finish;
      stack.appendChild(el('div', { class: 'panel-card done-card' },
        el('div', { class: 'done-title', text: C.title }),
        el('ul', { class: 'done-list' }, el('li', {}, el('span', { class: 'tx', text: MD.airDone.mark })), el('li', {}, el('span', { class: 'tx', text: MD.topics.water + ' ✓' }))),
        el('button', { class: 'btn btn-orange synth-btn', text: synthShown ? C.review : C.synthesis, on: { click: synthesis } })));
      if (synthOn) {
        var F = MD.flows;
        stack.appendChild(el('div', { class: 'panel-card' }, el('ul', { class: 'flow-list' },
          flowRow(hex(RED), F.air + ' · ' + F.resp, F.respFlow), flowRow(hex(BROWN), F.photo, F.photoFlow),
          flowRow(hex(BLUE), F.water, F.soilFlow), flowRow(hex(ORANGE), F.minerals, F.soilFlow))));
      }
      stack.appendChild(el('div', { class: 'panel-card conclusion' }, el('div', { class: 'obs-head', text: C.conclusionTitle }), el('p', { class: 'result-note', text: MD.conclusion })));
      var S = MD.summary;
      stack.appendChild(el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.tableTitle }), el('div', {
        html: '<table class="result-table summary"><thead><tr>' + S.head.map(function (h) { return '<th>' + X.esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          S.rows.map(function (r) { return '<tr><th>' + X.esc(r[0]) + '</th><td>' + X.esc(r[1]) + '</td><td>' + X.esc(r[2]) + '</td></tr>'; }).join('') + '</tbody></table>'
      })));
      stack.appendChild(el('div', { class: 'panel-card' }, el('div', { class: 'obs-head', text: APP.learnedTitle }),
        el('ul', { class: 'obs-list' }, MD.learned.map(function (t) { return el('li', { text: t }); }))));
    }
  };
});
