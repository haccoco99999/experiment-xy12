/* Experiment 5, part "quả và hạt": after the fertilization the time runs fast (Ngày 0 → 3 → 7 → 14 → 21 → 30). The petals wilt and fall and
   the ovary swells (day 7). Then the picture changes to a whole tomato plant with its roots (the user's request of 2026-11-10, after the
   picture in their Word file): the young green fruit hangs on a branch and the student follows it there. Day 14: a click opens the green
   fruit to show the ovules turning into seeds. Day 30: the fruit is red on the plant; a click picks it and cuts it in half, and the
   magnifier shows the flesh, the jelly and the seeds (md sections 25–34, 42, 49–51). */
(Lab.exp5mods = Lab.exp5mods || []).push(function (X) {
  'use strict';
  var T = X.T, U = X.U, L = X.L, MD = X.MD, APP = X.APP, Mo = X.Mo, state = X.state, scene = X.scene, Y0 = X.Y0, Z = X.POS.z, el = U.el;
  var fruit = null, plant = null, plate = null, hit = null, seedProp = null, stopPulse = null, tags = [], veil = null;
  var ON_PLANT = 0.2;                                                    // a fruit of "size 1" is 2 cm across on the plant (it is drawn bigger in close-ups)
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  /* the fruit hangs under its stalk: r is its growth (0.6 young … 1.1 ripe) */
  function place(r) {
    var sz = r * ON_PLANT, top = plant.world(plant.anchor);
    fruit.setSize(sz); fruit.group.position.set(top.x, top.y - 0.88 * sz, top.z);
  }
  function tag(text, world) { var t = X.tag(text, world, 'part'); tags.push(t); return t; }
  function clearTags() { tags.forEach(function (t) { t.remove(); }); tags.length = 0; }
  function pulse(on) {
    if (stopPulse) { stopPulse(); stopPulse = null; if (fruit) fruit.glow(0); }
    if (fruit && fruit.group.userData.r) fruit.group.scale.setScalar(fruit.group.userData.r);
    if (on) stopPulse = Lab.loop.add(function (dt, time) {
      var s = Math.sin(time * 4); fruit.glow(0.5 + 0.5 * s); fruit.group.scale.setScalar(fruit.group.userData.r * (1 + 0.04 * s));
    }, { ambient: true });
  }
  function day(d) { state.day = d; X.UI.caption(MD.days[L.DAYS.indexOf(d)].toUpperCase(), { ms: 1100, cls: 'day' }); Lab.audio.play('click'); X.refresh(); }
  /* a soft white fade: out, change the picture, in */
  async function fade(mid) {
    if (!veil) { veil = el('div', { class: 'veil' }); X.UI.el.hud.appendChild(veil); X.veil = veil; }
    await Lab.tween.value(0.5, function (k) { veil.style.opacity = k; }).promise;
    mid();
    await Lab.tween.value(0.7, function (k) { veil.style.opacity = 1 - k; }).promise;
  }
  X.leaveHooks.push(function () { clearTags(); pulse(false); });

  /* ---------------- Ngày 0 → 7: the flower wilts, the ovary swells; then the whole plant with its young fruit ---------------- */
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
    /* the ovary is lit, the arrow BẦU NHỤY → QUẢ shows, then we look at the whole plant where the young green fruit hangs */
    fl.highlight('ovary', 1); Lab.audio.play('step');
    tag(MD.labels.arrow, function () { return fl.world(V(0, Y0 + 0.95, 0.2)); });
    X.toast(MD.right.day7, { type: 'ok', ms: 8000 });
    await Lab.tween.wait(2.6).promise;
    await fade(function () {
      clearTags(); fl.highlight('ovary', 0); fl.group.visible = false;
      plant = Mo.tomatoPlant(); plant.group.position.set(X.POS.x, 0, Z); scene.add(plant.group);
      fruit = Mo.tomatoFruit(); fruit.group.rotation.z = Math.PI; fruit.group.userData.pick = 'fruit'; scene.add(fruit.group);   // hanging: the sepals on top
      hit = new T.Mesh(new T.SphereGeometry(1.9, 10, 8), new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); fruit.group.add(hit);   // easier to click
      place(0.6); X.shot('plant', 0);
    });
    Lab.fx.sparkles(scene, fruit.group.position.clone(), 0xfff2a0, 10);
    tag(MD.labels.fruit, function () { return fruit.group.position.clone().add(V(0.42, 0.05, 0.1)); });
    X.note = MD.right.day7; X.busy--; X.refresh();
  }

  /* the button "TIẾP TỤC TUA NHANH" */
  async function next() {
    var r = L.continueLapse(state); if (!r) return;
    clearTags(); Lab.lens.hide(); X.busy++; X.note = null; X.refresh(); Lab.audio.play('click');
    if (r.to === 14) {
      await Lab.tween.value(3.4, function (k) { place(0.6 + 0.1 * k); fruit.ripen(0.05 * k); }, { ease: Lab.tween.ease.linear }).promise;
      L.arrive(state); day(14); X.note = MD.right.day14; X.toast(MD.right.day14, { type: 'info', ms: 7000 }); pulse(true); X.busy--; X.refresh();
    } else {
      fruit.setSeeThrough(0); X.shot('plant', 900);
      await Lab.tween.value(3.4, function (k) { place(0.7 + 0.2 * k); fruit.ripen(0.05 + 0.5 * k); plant.ripenOthers(0.5 * k); }, { ease: Lab.tween.ease.linear }).promise;       // Ngày 14 → 21
      day(21);
      await Lab.tween.value(3.4, function (k) { place(0.9 + 0.2 * k); fruit.ripen(0.55 + 0.45 * k); plant.ripenOthers(0.5 + 0.5 * k); }, { ease: Lab.tween.ease.linear }).promise;     // Ngày 21 → 30
      L.arrive(state); day(30); Lab.audio.play('step');
      X.note = MD.right.ripe; X.toast(MD.right.ripe, { type: 'ok', ms: 8000 }); pulse(true); X.busy--; X.refresh();
    }
  }

  function tapFruit() {
    var r = L.decideFruitClick(state); if (!r.ok || X.busy) return;
    L.applyFruitClick(state, r.action); pulse(false); Lab.audio.play('pop');
    if (r.action === 'seeds') seeds(); else cut();
  }
  /* Ngày 14: the green fruit on the plant is opened; the ovules grow and turn into seeds */
  async function seeds() {
    X.busy++; X.note = null; X.refresh();
    var pos = fruit.group.position.clone(), r = fruit.group.userData.r;
    X.shot({ cx: pos.x - 0.3, cy: pos.y + 0.1, cz: Z, w: 2.8, h: 2.1, pitch: 0.1, fov: 34 }, 1000);
    fruit.setSeeThrough(1); fruit.seedGrow(0);
    await Lab.tween.wait(1.0).promise;
    /* the magnifier looks at the fruit from close by, so the leaves in front do not hide it */
    Lab.lens.show({ world: function () { return fruit.group.position.clone(); }, radius: 118, viewSize: r * 3.4, distance: 0.7, onClose: function () { X.refresh(); } });
    var above = function () { return fruit.group.position.clone().add(V(0, 0.55, 0.1)); };
    var lab = tag(MD.parts.ovule, above);
    await Lab.tween.wait(2.4).promise;
    await Lab.tween.value(4.2, function (k) { fruit.seedGrow(k); }, { ease: 'inOutQuad' }).promise;
    lab.remove(); tag(MD.labels.seed, above);
    Lab.audio.play('step'); X.toast(MD.right.seeds, { type: 'ok', ms: 8000 }); X.note = MD.right.seeds;
    X.busy--; X.refresh();
  }
  /* Ngày 30: the ripe fruit is picked and put on a plate, cut in half, and the magnifier shows the inside; one seed is shown big */
  async function cut() {
    X.busy++; X.note = null; X.refresh();
    var C = V(X.POS.x - 0.5, 1.0, Z + 0.1);                               // a little left of the middle: the result panel opens on the right
    Lab.lens.hide();
    await fade(function () {
      plant.group.visible = false; fruit.group.remove(hit); X.dispose(hit); hit = null;
      plate = new T.Mesh(new T.CylinderGeometry(2.7, 2.4, 0.07, 48), Lab.mat.std(0xf7f3ea, { roughness: 0.35 })); plate.position.set(C.x, 0.035, C.z); plate.receiveShadow = true; plate.userData.noPick = true; scene.add(plate);
      fruit.setSize(1); fruit.group.position.copy(C); X.shot('halves', 0);
    });
    await Lab.tween.wait(0.4).promise;
    await Lab.tween.value(2.4, function (k) { fruit.cutOpen(k); }, { ease: 'inOutQuad' }).promise;
    var right = fruit.facePoint(0, 0, 0).x > fruit.facePoint(1, 0, 0).x ? 0 : 1, left = 1 - right;
    seedProp = Mo.tomatoSeed(); seedProp.scale.setScalar(0.5); seedProp.position.set(C.x - 2.55, 0.8, C.z + 0.3); scene.add(seedProp);
    Lab.fx.ringPulse(scene, seedProp.position.clone().setY(0.08), 0xfff2a0, 0.5);
    tag(MD.labels.seed, function () { return seedProp.position.clone().add(V(0, 0.6, 0)); });
    /* the magnifier sits on one chamber of the right half; the names are written over the enlarged picture, next to the flesh,
       the jelly and a seed. A point d away from the centre of the lens shows k times further out on the screen. */
    var A = fruit.locules[1], LV = 0.95, LR = 118;
    var lensAt = function () { return fruit.facePoint(right, 0.5, A); };
    Lab.lens.show({ world: lensAt, radius: LR, viewSize: LV, distance: 2.4, onClose: function () { X.refresh(); } });
    var seed = fruit.seedSpots.filter(function (sd) { return Math.abs(sd.a - A) < 0.6; }).sort(function (u, w) { return Math.abs(u.r - 0.5) - Math.abs(w.r - 0.5); })[0];
    function inLens(r, a, dy) {
      return function () {
        var c = lensAt(), f = fruit.facePoint(right, r, a), p0 = Lab.stage.project(c), p1 = Lab.stage.project(c.clone().add(V(1, 0, 0)));
        var k = (2 * LR / LV) / Math.max(1, Math.hypot(p1.x - p0.x, p1.y - p0.y));
        return c.add(f.sub(c).multiplyScalar(k)).add(V(0, dy, 0.05));
      };
    }
    tag(MD.labels.flesh, inLens(0.9, A, 0));
    tag(MD.labels.jelly, inLens(0.68, A + 0.32, 0.12));
    tag(MD.labels.seed, inLens(seed.r, seed.a, -0.3));
    X.toast(MD.right.manySeeds, { type: 'ok', ms: 8000 });
    await Lab.tween.wait(1.6).promise;
    X.busy--; X.refresh();
  }

  /* ---------------- the end (md sections 49–51) ---------------- */
  X.finale = {
    begin: function () {
      if (X.finaleShown) return;
      X.finaleShown = true; Lab.lens.hide(); clearTags();
      if (seedProp) tag(MD.labels.seed, function () { return seedProp.position.clone().add(V(0, 0.6, 0)); });
      X.shot('halvesEnd', 900); X.UI.panelWide(true); X.UI.caption(MD.finish.title, { ms: 2200, cls: 'day' }); Lab.audio.play('done'); Lab.fx.confetti(3400); X.refresh();
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
