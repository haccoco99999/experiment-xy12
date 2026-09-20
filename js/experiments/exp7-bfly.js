/* Experiment 7, part "bướm": the two butterflies are dragged from the tray into the garden (md sections 6.1–6.3); the male is dragged next to the female
   and they mate (7); a diagram screen shows the fertilization (8–9); the female is dragged from the tray to the leaf, hangs under it and lays the eggs (10–11). */
(Lab.exp7mods = Lab.exp7mods || []).push(function (X) {
  'use strict';
  var T = X.T, U = X.U, L = X.L, MD = X.MD, APP = X.APP, UI = X.UI, state = X.state, V = X.V, el = U.el;
  var male = null, female = null, tags = {};
  function mid() { return male.group.position.clone().lerp(female.group.position, 0.5); }

  /* ---------------- the tray cards BƯỚM ĐỰC and BƯỚM CÁI ---------------- */
  X.drops.male = X.drops.female = function (id, zid) {
    if (X.busy || X.growing) return { ok: false, message: APP.busy };
    var r = L.decideButterfly(state, id, zid === 'leaf' ? 'leaf' : zid ? 'area' : null);
    if (!r.ok) return { ok: false, message: X.msgFor(r.msg) };
    if (r.action === 'layEggs') { layEggs(); return { ok: true }; }
    var res = L.applyButterfly(state, r.action);
    place(id, res.ready); X.refresh(); return { ok: true };
  };

  /* the butterfly flies in from the left and lands on the branch */
  async function place(sex, ready) {
    X.busy++; Lab.audio.play('pop');
    var b = X.newButterfly(sex), spot = X.spot.perch(sex === 'male' ? 0.3 : 0.86);
    b.group.position.copy(X.spot.from); b.group.rotation.y = sex === 'male' ? 0 : Math.PI; b.home = spot.clone();
    if (sex === 'male') male = b; else female = b;
    await X.fly(b, [X.spot.from.clone(), X.spot.from.clone().lerp(spot, 0.55).add(V(0, 0.9, 0.8)), spot.clone().add(V(0, 0.35, 0.15)), spot], 1.9, 'perch');
    tags[sex] = X.tag(MD.labels[sex], function () { return b.group.position.clone().add(V(0, 0.62, 0)); }, 'place');
    Lab.audio.play('ok'); if (sex === 'male') X.toast(MD.right.male, { type: 'ok', ms: 5200 });
    X.busy--; if (ready) await pair(); X.refresh();
  }

  /* both are there: they fly close together on the same branch, the camera comes nearer, the male can now be dragged (md 6.3) */
  async function pair() {
    X.busy++; X.shot('pair', 1000);
    var mu = X.spot.perch(0.44), fu = X.spot.perch(0.9);
    male.home = mu.clone(); female.home = fu.clone();
    await Promise.all([X.fly(male, [male.group.position.clone(), male.group.position.clone().lerp(mu, 0.5).add(V(0, 0.4, 0.2)), mu], 1.5, 'perch'),
      X.fly(female, [female.group.position.clone(), female.group.position.clone().lerp(fu, 0.5).add(V(0, 0.4, 0.2)), fu], 1.5, 'perch')]);
    X.turn(male, 0, 0.4); X.turn(female, Math.PI, 0.4);
    tags.male.setVisible(false); tags.female.setVisible(false);
    tags.pair = X.tag(MD.labels.pair, function () { return mid().add(V(0, 0.8, 0)); }, 'place');
    Lab.audio.play('step'); X.toast(MD.right.pair, { type: 'ok', ms: 5200 });
    Lab.sceneDrag.add({
      id: 'male', object: male.group, radius: 90, home: function () { return male.home; },
      enabled: function () { return L.bothPlaced(state) && !state.mated && !X.busy; },
      onStart: function () { male.mode = 'fly'; X.touch(); }, onEnd: function () { male.mode = 'perch'; },
      onDrop: function (it, info) {
        var r = L.decideMating(state, info.world.distanceTo(female.group.position) < 1.05);
        if (!r.ok) { if (r.msg) { X.toast(X.msgFor(r.msg), { type: 'warn' }); Lab.audio.play('wrong'); } return { ok: false }; }
        mate(); return { ok: true };
      }
    });
    X.busy--; X.refresh();
  }

  /* ---------------- mating (md 7): the male comes close, they face each other, a short animation with a heart between them ---------------- */
  async function mate() {
    X.busy++; X.touch(); L.applyMating(state); X.refresh();
    var target = female.group.position.clone().add(V(-0.65, 0.02, 0));
    await Promise.all([X.fly(male, [male.group.position.clone(), target.clone().add(V(-0.3, 0.35, 0.2)), target], 1.1, 'perch'), X.turn(female, Math.PI, 0.5)]);
    X.turn(male, 0, 0.3); male.mode = female.mode = 'tremble';
    tags.pair.setVisible(false);
    X.tag(MD.labels.mating, function () { return mid().add(V(0, 1.0, 0)); }, 'place', 3600); X.tag('💞', function () { return mid().add(V(0, 0.6, 0)); }, 'love', 3600);
    Lab.fx.sparkles(X.scene, mid().add(V(0, 0.3, 0)), 0xff8fb8, 14); Lab.audio.play('ok'); X.toast(MD.right.mate, { type: 'ok', ms: 5600 });
    await X.wait(3.6);
    male.mode = female.mode = 'perch'; X.busy--; fertilization();
  }

  /* ---------------- the fertilization screen (md 8–9): a diagram, the sperm swims to the egg, they join ---------------- */
  function fertilization() {
    X.busy++;
    var F = MD.fert, sperm = el('div', { class: 'fert-sperm' }, el('span', { class: 'fert-tail' }), el('span', { class: 'fert-head' })), egg = el('div', { class: 'fert-egg' }, el('span', { class: 'fert-nucleus' }));
    var result = el('div', { class: 'fert-result', text: MD.labels.zygote }), msg = el('p', { class: 'fert-msg', text: MD.right.fert }), m;
    var btn = X.button(MD.buttons.go, 'btn-orange', function () { m.close(); afterFert(); }); btn.hidden = true;
    m = UI.modal(el('div', { class: 'fert' },
      el('div', { class: 'fert-top' }, el('div', { class: 'fert-box male', text: F.sperm }), el('span', { class: 'fert-plus', text: '+' }), el('div', { class: 'fert-box female', text: F.egg })),
      el('div', { class: 'fert-arrow', text: '↓' }), el('div', { class: 'fert-step', text: F.step }), el('div', { class: 'fert-arena' }, sperm, egg), result, msg, btn), { wide: true, static: true });
    Lab.tween.wait(0.7).promise.then(function () {
      return Lab.tween.value(2.8, function (k) { sperm.style.left = (4 + k * 50) + '%'; sperm.style.transform = 'translateY(' + (Math.sin(k * 16) * 9).toFixed(1) + 'px)'; }, { ease: Lab.tween.ease.inOutSine }).promise;
    }).then(function () {
      sperm.classList.add('gone'); egg.classList.add('joined'); result.classList.add('show'); msg.classList.add('show'); L.applyFertilization(state);
      Lab.audio.play('ok'); Lab.fx.sparkles(X.scene, mid(), 0xffe066, 8); X.refresh(); btn.hidden = false;
    });
  }
  function afterFert() {                                             // back to the garden, the camera looks at the leaves (md 9)
    L.applyContinue(state); X.busy--; X.shot('leaf', 1200); tags.pair.setVisible(true);
    X.toast(MD.right.afterFert, { type: 'info', ms: 6500 }); UI.setCard('female', { pulse: true }); X.refresh();
  }

  /* ---------------- egg laying (md 10–11): the female flies under the leaf, her wings tremble, a cluster of eggs appears, she flies away ---------------- */
  async function layEggs() {
    X.busy++; UI.setCard('female', { ghost: true }); tags.pair.setVisible(false); X.touch();
    var b = female, from = b.group.position.clone(), egg = X.spot.egg, under = V(egg.x - 0.05, egg.y - 0.3, egg.z + 0.08);
    X.shot('under', 1300); X.toast(MD.right.layStart, { type: 'info', ms: 5600 });
    await X.fly(b, [from, from.clone().lerp(under, 0.5).add(V(0.5, 0.4, 1.0)), under.clone().add(V(0.4, -0.15, 1.0)), under], 2.6, 'tremble');
    await Lab.tween.to(b.group.rotation, { x: Math.PI, z: 0 }, 0.5, { ease: 'inOutCubic' }).promise;
    await X.wait(0.8);
    X.eggs = X.Mo.eggs(); X.eggs.group.position.copy(egg); X.eggs.group.scale.setScalar(0.01); X.scene.add(X.eggs.group);
    Lab.tween.value(0.9, function (k) { b.group.rotation.z = 0.14 * Math.sin(k * 20); }, { ease: Lab.tween.ease.linear });
    await Lab.tween.to(X.eggs.group.scale, { x: 1, y: 1, z: 1 }, 1.8, { ease: 'outBack' }).promise;
    Lab.audio.play('ok'); X.tag(MD.labels.eggs, function () { return egg.clone().add(V(0, -0.5, 0.35)); }, 'part', 4200); X.toast(MD.right.laid, { type: 'ok', ms: 5600 });
    await X.wait(1.6);
    await X.fly(b, [b.group.position.clone(), b.group.position.clone().add(V(0.3, 0.3, 1.1)), X.spot.away.clone()], 2.4, 'fly');
    X.bf.splice(X.bf.indexOf(b), 1); X.dispose(b.group); tags.male.remove(); tags.female.remove(); tags.pair.remove();
    await X.fly(male, [male.group.position.clone(), male.group.position.clone().add(V(-0.6, 0.7, 1.0)), X.spot.away.clone().add(V(0.4, -0.3, 0))], 2.6, 'fly');   // the male flies away too
    X.bf.splice(X.bf.indexOf(male), 1); X.dispose(male.group);
    L.applyButterfly(state, 'layEggs'); X.busy--; X.refresh(); if (X.afterLaid) X.afterLaid();
  }
});
