/* Experiment 5, part "quả và hạt": after the fertilization the time runs fast (Ngày 0 → 3 → 7 → 14 → 21 → 30). The petals wilt and fall, the ovary
   swells and becomes a green fruit (day 7, stop), the student opens the green fruit to see the ovules turn into seeds (day 14, stop), the fruit
   grows and turns red (day 30, stop) and the student cuts it in half to see the seeds (md sections 25–34, 42, 49–51). */
(Lab.exp5mods = Lab.exp5mods || []).push(function (X) {
  'use strict';
  var T = X.T, U = X.U, L = X.L, MD = X.MD, APP = X.APP, Mo = X.Mo, state = X.state, scene = X.scene, Y0 = X.Y0, Z = X.POS.z, el = U.el;
  var fruit = null, seedProp = null, stopPulse = null, tags = [];
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  function lift(r) { return Math.max(0, r - 0.6) * 0.75; }              // the fruit rises a little as it grows
  function place(r) { fruit.setSize(r); fruit.group.position.copy(X.flower.world(V(0, Y0 - 0.02 + lift(r), 0))); }
  function tag(text, world) { var t = X.tag(text, world, 'part'); tags.push(t); return t; }
  function clearTags() { tags.forEach(function (t) { t.remove(); }); tags.length = 0; }
  function pulse(on) {
    if (stopPulse) { stopPulse(); stopPulse = null; if (fruit) fruit.glow(0); }
    if (fruit && fruit.group.userData.r) fruit.group.scale.setScalar(fruit.group.userData.r);
    if (on) stopPulse = Lab.loop.add(function (dt, time) {
      var s = Math.sin(time * 4); fruit.glow(0.5 + 0.5 * s); fruit.group.scale.setScalar(fruit.group.userData.r * (1 + 0.025 * s));
    }, { ambient: true });
  }
  function day(d) { state.day = d; X.UI.caption(MD.days[L.DAYS.indexOf(d)].toUpperCase(), { ms: 1100, cls: 'day' }); Lab.audio.play('click'); X.refresh(); }
  X.leaveHooks.push(function () { clearTags(); pulse(false); });

  /* ---------------- Ngày 0 → 7: the flower wilts, the ovary swells into a young fruit ---------------- */
  async function start() {
    if (!L.startLapse(state)) return;
    var fl = X.flower; Lab.audio.play('click'); X.go('fruit', 'fruit', 1100); X.busy++;
    Lab.tween.value(0.9, function (k) { fl.setCut(1 - k); fl.focusPistil(1 - k); }, { ease: 'inOutQuad' });
    fl.setOvaryClear(0); fl.showOvules(false); fl.pollenOnStigma.visible = false; X.refresh();
    await Lab.tween.wait(1.2).promise;
    state.day = 0; X.refresh();
    await Lab.tween.value(2.6, function (k) { fl.wilt(k); fl.swell(0.45 * k); }, { ease: Lab.tween.ease.linear }).promise;       // Ngày 0 → 3
    day(3);
    await Lab.tween.value(2.4, function (k) { fl.dropPetals(k); fl.swell(0.45 + 0.55 * k); }, { ease: Lab.tween.ease.linear }).promise;   // Ngày 3 → 7
    L.arrive(state); day(7);
    /* the ovary is lit, the arrow BẦU NHỤY → QUẢ shows, then the ovary turns into the young green fruit */
    fl.highlight('ovary', 1); Lab.audio.play('step');
    tag(MD.labels.arrow, function () { return fl.world(V(0, Y0 + 0.95, 0.2)); });
    X.toast(MD.right.day7, { type: 'ok', ms: 8000 });
    await Lab.tween.wait(2.6).promise;
    fruit = Mo.tomatoFruit(); fruit.group.userData.pick = 'fruit'; scene.add(fruit.group); place(0.6); fl.highlight('ovary', 0); fl.keepStand();
    Lab.fx.sparkles(scene, fruit.group.position.clone(), 0xfff2a0, 10);
    X.note = MD.right.day7; X.busy--; X.refresh();
  }

  /* the button "TIẾP TỤC TUA NHANH" */
  async function next() {
    var r = L.continueLapse(state); if (!r) return;
    clearTags(); X.busy++; X.note = null; X.refresh(); Lab.audio.play('click');
    if (r.to === 14) {
      await Lab.tween.value(3.4, function (k) { place(0.6 + 0.1 * k); fruit.ripen(0.05 * k); }, { ease: Lab.tween.ease.linear }).promise;
      L.arrive(state); day(14); X.note = MD.right.day14; X.toast(MD.right.day14, { type: 'info', ms: 7000 }); pulse(true); X.busy--; X.refresh();
    } else {
      fruit.setSeeThrough(0); X.shot('fruit', 900);
      await Lab.tween.value(3.4, function (k) { place(0.7 + 0.2 * k); fruit.ripen(0.05 + 0.5 * k); }, { ease: Lab.tween.ease.linear }).promise;       // Ngày 14 → 21
      day(21);
      await Lab.tween.value(3.4, function (k) { place(0.9 + 0.2 * k); fruit.ripen(0.55 + 0.45 * k); }, { ease: Lab.tween.ease.linear }).promise;     // Ngày 21 → 30
      L.arrive(state); day(30); Lab.audio.play('step');
      X.note = MD.right.ripe; X.toast(MD.right.ripe, { type: 'ok', ms: 8000 }); pulse(true); X.busy--; X.refresh();
    }
  }

  function tapFruit() {
    var r = L.decideFruitClick(state); if (!r.ok || X.busy) return;
    L.applyFruitClick(state, r.action); pulse(false); Lab.audio.play('pop');
    if (r.action === 'seeds') seeds(); else cut();
  }
  /* Ngày 14: the green fruit is opened; the ovules grow and turn into seeds */
  async function seeds() {
    X.busy++; X.note = null; X.refresh();
    var pos = fruit.group.position.clone(), r = fruit.group.userData.r;
    X.shot({ cx: pos.x, cy: pos.y, cz: Z, w: 2.2, h: 1.6, pitch: 0.1, fov: 34 }, 1000);
    fruit.setSeeThrough(1); fruit.seedGrow(0);
    var lab = tag(MD.parts.ovule, function () { return fruit.group.position.clone().add(V(0.0, r * 0.95, 0.2)); });
    await Lab.tween.wait(2.4).promise;
    await Lab.tween.value(4.2, function (k) { fruit.seedGrow(k); }, { ease: 'inOutQuad' }).promise;
    lab.remove(); tag(MD.labels.seed, function () { return fruit.group.position.clone().add(V(0.0, r * 0.95, 0.2)); });
    Lab.audio.play('step'); X.toast(MD.right.seeds, { type: 'ok', ms: 8000 }); X.note = MD.right.seeds;
    X.busy--; X.refresh();
  }
  /* Ngày 30: the ripe fruit is cut in half; the seeds and one enlarged seed are shown */
  async function cut() {
    X.busy++; X.note = null; X.refresh();
    X.shot('halves', 1100);
    await Lab.tween.wait(0.6).promise;
    await Lab.tween.value(2.4, function (k) { fruit.cutOpen(k); }, { ease: 'inOutQuad' }).promise;
    var c = fruit.group.position;
    seedProp = Mo.tomatoSeed(); seedProp.scale.setScalar(0.8); seedProp.position.set(c.x, c.y + 0.05, c.z + 0.4); scene.add(seedProp);
    Lab.fx.ringPulse(scene, seedProp.position.clone().setY(c.y - 0.5), 0xfff2a0, 0.5);
    tag(MD.labels.seed, function () { return seedProp.position.clone().add(V(0, 0.75, 0)); });
    X.toast(MD.right.manySeeds, { type: 'ok', ms: 8000 });
    await Lab.tween.wait(1.6).promise;
    X.busy--; X.finale.begin();
  }

  /* ---------------- the end (md sections 49–51) ---------------- */
  X.finale = {
    begin: function () {
      X.UI.panelWide(true); X.UI.caption(MD.finish.title, { ms: 2200, cls: 'day' }); Lab.audio.play('done'); Lab.fx.confetti(3400); X.refresh();
    },
    render: function (stack) {
      var R = MD.result, D = R.diagram;
      stack.appendChild(el('div', { class: 'panel-card done-card' }, el('div', { class: 'done-title', text: MD.finish.title }), el('div', { class: 'done-sub', text: R.title }),
        el('ol', { class: 'done-list numbered' }, R.lines.map(function (t, i) { return el('li', {}, el('span', { class: 'ok', text: String(i + 1) }), el('span', { class: 'tx', text: t })); }))));
      var rows = [];
      D.forEach(function (row, i) {
        rows.push(el('div', { class: 'xd-row' + (row.length > 1 ? ' pair' : '') }, row.map(function (t, j) { return el('span', { class: 'xd-chip', text: t }); }).reduce(function (a, c, j, arr) {
          a.push(c); if (j < arr.length - 1 && i === 0) a.push(el('span', { class: 'xd-arr', text: '→' })); return a;
        }, [])));
        if (i < D.length - 1) rows.push(el('div', { class: 'xd-arrow', text: '↓' }));
      });
      stack.appendChild(el('div', { class: 'panel-card xd' }, el('div', { class: 'obs-head', text: R.diagramTitle }), rows));
      stack.appendChild(el('div', { class: 'panel-card conclusion' }, el('div', { class: 'obs-head', text: APP.results }), el('p', { class: 'result-note', text: MD.finish.chain })));
    }
  };
  X.fruit = { start: start, next: next, tapFruit: tapFruit };
});
