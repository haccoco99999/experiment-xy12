/* Experiment 5, part "thụ phấn": the whole flower is shown again, the anthers glow softly and the stigma has a ring of light. The student drags the
   pollen stick to an anther (pollen sticks to the tip) and then to the stigma (md sections 14–18 and 36). */
(Lab.exp5mods = Lab.exp5mods || []).push(function (X) {
  'use strict';
  var T = X.T, L = X.L, MD = X.MD, APP = X.APP, Mo = X.Mo, state = X.state, scene = X.scene, Y0 = X.Y0;
  var ring = null, stopRing = null, stick = null;
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  function removeStick() { if (stick) { X.dispose(stick.group); stick = null; } }
  function removeRing() { if (stopRing) { stopRing(); stopRing = null; } if (ring) { X.dispose(ring); ring = null; } }
  X.leaveHooks.push(function () { removeRing(); removeStick(); if (X.flower) { X.flower.highlight('anther', 0); X.flower.pollenDust(0); X.flower.group.rotation.z = 0; } });

  /* the soft ring of light around the stigma (md section 14) */
  function addRing() {
    ring = new T.Mesh(new T.TorusGeometry(0.2, 0.03, 8, 40), new T.MeshBasicMaterial({ color: 0xfff2a0, transparent: true, opacity: 0.8, depthTest: false }));
    ring.rotation.x = Math.PI / 2; ring.renderOrder = 15; ring.userData.noPick = true; ring.position.copy(X.flower.world(V(0, Y0 + 1.46, 0))); scene.add(ring);
    stopRing = Lab.loop.add(function (dt, time) { ring.material.opacity = 0.55 + 0.35 * Math.sin(time * 4); ring.scale.setScalar(1 + 0.08 * Math.sin(time * 4)); }, { ambient: true });
  }
  /* small grains: some stick to the stick's tip, the rest fall to the table */
  function grains(p, n, sticky) {
    for (var i = 0; i < n; i++) {
      (function (i) {
        var m = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), Lab.mat.std(0xffe14d, { emissive: 0xffcf00, emissiveIntensity: 0.4 }));
        m.position.copy(p).add(V((Math.random() - 0.5) * 0.3, 0.1 + Math.random() * 0.2, (Math.random() - 0.5) * 0.3)); scene.add(m);
        var to = sticky && i < 3 ? p.clone() : V(m.position.x + (Math.random() - 0.5) * 0.4, 0.08, m.position.z + (Math.random() - 0.5) * 0.4);
        Lab.tween.to(m.position, { x: to.x, y: to.y, z: to.z }, sticky && i < 3 ? 0.7 : 1.0 + Math.random() * 0.3, { ease: sticky && i < 3 ? 'outQuad' : 'inQuad' }).promise
          .then(function () { return Lab.tween.to(m.scale, { x: 0.01, y: 0.01, z: 0.01 }, 0.3).promise; }).then(function () { X.dispose(m); });
      })(i);
    }
  }
  function shake() { var g = X.flower.group; Lab.tween.value(0.6, function (k) { g.rotation.z = Math.sin(k * 40) * 0.025 * (1 - k); }, { ease: Lab.tween.ease.linear }); }
  function bring(target, loaded) {                                        // the stick comes in from the upper right and touches `target`
    removeStick(); stick = Mo.pollenStick(); stick.setLoaded(loaded); stick.group.position.copy(target).add(V(2.6, 1.1, 0.9)); scene.add(stick.group);
    return Lab.tween.to(stick.group.position, { x: target.x, y: target.y, z: target.z }, 0.8, { ease: 'outQuad' }).promise;
  }
  function takeAway(target) { return Lab.tween.to(stick.group.position, { x: target.x + 2.6, y: target.y + 1.1, z: target.z + 0.9 }, 0.7, { ease: 'inQuad' }).promise; }

  X.pollen = {
    /* the button "THỰC HIỆN THỤ PHẤN" */
    start: function () {
      if (!L.startPollination(state)) return;
      Lab.audio.play('click'); X.go('pollen'); var fl = X.flower;
      Lab.tween.value(0.9, function (k) { fl.setCut(1 - k); }, { ease: 'inOutQuad' });
      fl.setOvaryClear(0); fl.showOvules(false); fl.highlight('anther', 0.35); addRing();
      X.toast(APP.toAnther, { type: 'info', ms: 5600 }); X.refresh();
    },
    /* the stick touches an anther: the flower trembles, pollen falls and some sticks to the tip */
    collect: async function () {
      var seq = X.seq, fl = X.flower, tip = fl.world(fl.at.antherTip); X.busy++;
      try {
        await bring(tip, false); if (seq !== X.seq) return;
        Lab.audio.play('pop'); shake(); fl.pollenDust(1); grains(tip, 9, true);
        await Lab.tween.wait(0.9).promise; if (seq !== X.seq) return;
        stick.setLoaded(true); fl.pollenDust(0); Lab.audio.play('ok'); X.toast(MD.right.collected, { type: 'ok', ms: 5200 });
        await takeAway(tip);
      } finally { removeStick(); X.busy--; X.refresh(); }
    },
    /* pollen dropped in the wrong place: over a petal some grains fall */
    spill: function (fall) { if (fall && X.flower) grains(X.flower.world(V(0, Y0 + 0.9, 0.4)), 5, false); Lab.audio.play('wrong'); },
    /* the loaded stick touches the stigma: pollen stays on it */
    pollinate: async function () {
      var seq = X.seq, fl = X.flower, tip = fl.world(V(0, Y0 + 1.56, 0)); X.busy++;
      try {
        await bring(tip, true); if (seq !== X.seq) return;
        stick.setLoaded(false); var pg = fl.pollenOnStigma; pg.visible = true; pg.scale.setScalar(0.2); Lab.tween.to(pg.scale, { x: 1, y: 1, z: 1 }, 0.5, { ease: 'outBack' });
        fl.highlight('stigma', 1); Lab.audio.play('ok'); Lab.audio.play('step');
        X.toast(MD.right.pollinated, { type: 'ok', ms: 5200 });
        await takeAway(tip); if (seq !== X.seq) return;
        X.toast(MD.right.pollinatedWhy, { type: 'info', ms: 7000 });
        await Lab.tween.wait(3.0).promise; if (seq !== X.seq) return;
      } finally { removeStick(); X.busy--; }
      if (seq === X.seq) { fl.highlight('stigma', 0); X.fert.enter(); }
    }
  };
});
