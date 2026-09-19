/* Lab.models.chick – a toy-style yellow chick built from simple shapes. It faces +z; its origin is on the floor
   between the feet. Its look is driven by a few smooth numbers (`pose`): walking, pecking, panting, stretched
   neck, spread wings, fluffed feathers, shivering, crouching, lying down, blinking. The brain in chick-brain.js
   sets them; `update` eases the real values towards them so nothing ever changes suddenly. 1 unit = 10 cm. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, U = Lab.util, Mo = Lab.models;

  var LEG = 0.27;
  var COL = { body: 0xffd84a, belly: 0xffeb95, wing: 0xf6c63a, tip: 0xe0a02a, pale: 0xf1e9bb, dead: 0xd9d3b8 };
  var SPH = null, UP = new T.Vector3(0, 1, 0);
  var RATE = { walk: 7, headDown: 15, beak: 26, eye: 30, headYaw: 10, shiver: 12 };

  Mo.chick = function () {
    SPH = SPH || new T.SphereGeometry(1, 20, 14);
    var root = new T.Group(); root.name = 'chick';
    var mats = {
      body: M.std(COL.body, { roughness: 0.85 }), belly: M.std(COL.belly, { roughness: 0.9 }), wing: M.std(COL.wing, { roughness: 0.85 }), tip: M.std(COL.tip, { roughness: 0.85 }),
      beak: M.std(0xf29a2e, { roughness: 0.45 }), eye: M.std(0x14110d, { roughness: 0.15 }), cheek: M.std(0xff9fb0, { roughness: 0.9 }), shine: new T.MeshBasicMaterial({ color: 0xffffff })
    };
    function ball(mat, sx, sy, sz, x, y, z, parent) {
      var m = new T.Mesh(SPH, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m;
    }

    /* legs: a pivot at the hip, a thin shin and three toes */
    function leg(x) {
      var pv = new T.Group(); pv.position.set(x, LEG, 0.02); root.add(pv);
      var shin = new T.Mesh(new T.CylinderGeometry(0.03, 0.038, LEG, 8), mats.beak); shin.position.y = -LEG / 2; shin.castShadow = true; pv.add(shin);
      [-1, 0, 1].forEach(function (i) {
        var tg = new T.Group(); tg.position.y = -LEG + 0.02; tg.rotation.y = i * 0.42; pv.add(tg);
        var toe = new T.Mesh(new T.CapsuleGeometry(0.022, 0.12, 3, 6), mats.beak); toe.rotation.x = Math.PI / 2; toe.position.z = 0.07; tg.add(toe);
      });
      return pv;
    }
    var legs = new T.Group(); root.add(legs);
    var legL = leg(-0.13), legR = leg(0.13); legs.add(legL, legR);

    /* body: torso, belly, tail, wings, head */
    var bodyG = new T.Group(); bodyG.position.y = 0.55; root.add(bodyG);
    ball(mats.body, 0.36, 0.33, 0.42, 0, 0, 0, bodyG);
    ball(mats.belly, 0.29, 0.25, 0.3, 0, -0.08, 0.15, bodyG);
    [-1, 0, 1].forEach(function (i) {
      var t = ball(mats.wing, 0.05, 0.03, 0.15, i * 0.06, 0.13, -0.45, bodyG); t.rotation.set(-0.5, i * 0.25, 0);
    });
    function wing(side) {
      var pv = new T.Group(); pv.position.set(side * 0.33, 0.1, 0.02); bodyG.add(pv);
      var w = ball(mats.wing, 0.07, 0.2, 0.27, 0, -0.13, 0, pv);
      var tip = ball(mats.tip, 0.06, 0.05, 0.2, 0, -0.3, -0.02, pv); tip.scale.setScalar(0.001);
      return { pv: pv, w: w, tip: tip };
    }
    var wL = wing(-1), wR = wing(1);

    var headG = new T.Group(); headG.position.set(0, 0.34, 0.3); bodyG.add(headG);
    ball(mats.body, 0.25, 0.24, 0.24, 0, 0.06, 0.02, headG);
    [-1, 1].forEach(function (s) { ball(mats.cheek, 0.05, 0.035, 0.02, s * 0.17, -0.02, 0.15, headG).rotation.y = s * 0.7; });
    var eyes = [-1, 1].map(function (s) {
      var e = ball(mats.eye, 0.045, 0.055, 0.03, s * 0.13, 0.09, 0.19, headG);
      var sh = new T.Mesh(SPH, mats.shine); sh.scale.setScalar(0.3); sh.position.set(0.25 * s, 0.35, 0.75); e.add(sh);
      return e;
    });
    var beakGeo = new T.ConeGeometry(0.075, 0.2, 10); beakGeo.rotateX(Math.PI / 2); beakGeo.translate(0, 0, 0.1);
    var upper = new T.Mesh(beakGeo, mats.beak); upper.position.set(0, 0.06, 0.225); upper.scale.set(1, 0.7, 1); upper.castShadow = true; headG.add(upper);
    var jaw = new T.Group(); jaw.position.set(0, 0.03, 0.225); headG.add(jaw);
    var lowerGeo = new T.ConeGeometry(0.06, 0.15, 8); lowerGeo.rotateX(Math.PI / 2); lowerGeo.translate(0, 0, 0.075);
    var lower = new T.Mesh(lowerGeo, mats.beak); lower.scale.set(1, 0.55, 1); jaw.add(lower);

    /* fluff: little feather tufts on the back and on top of the head, shown when the chick puffs up */
    var tuftGeo = new T.ConeGeometry(0.05, 0.14, 6); tuftGeo.translate(0, 0.07, 0);
    var tufts = [];
    function tuft(parent, x, y, z, rx, ry, rz) {
      var t = new T.Mesh(tuftGeo, mats.body), n = new T.Vector3(x / (rx * rx), y / (ry * ry), z / (rz * rz)).normalize();
      t.position.set(x, y, z); t.quaternion.setFromUnitVectors(UP, n); t.scale.setScalar(0.001); parent.add(t); tufts.push(t);
    }
    [[0, 0.33, -0.05], [-0.17, 0.27, -0.1], [0.17, 0.27, -0.1], [-0.27, 0.16, 0.05], [0.27, 0.16, 0.05], [0, 0.26, -0.3], [-0.12, 0.28, 0.14], [0.12, 0.28, 0.14]]
      .forEach(function (p) { tuft(bodyG, p[0], p[1], p[2], 0.36, 0.33, 0.42); });
    [[0, 0.3, 0.0], [-0.07, 0.28, -0.02], [0.07, 0.28, -0.02]].forEach(function (p) { tuft(headG, p[0], p[1], p[2], 0.25, 0.24, 0.24); });

    /* ---- the eased pose ---- */
    var tgt = { walk: 0, headDown: 0, headYaw: 0, headTilt: 0, neck: 0, beak: 0, wing: 0, flap: 0, fluff: 0, shiver: 0, crouch: 0, lie: 0, eye: 1, breath: 0.012, rate: 12, pale: 0 };
    var st = Object.assign({ ph: 0, size: 1, growth: 0 }, tgt);
    var cBody = new T.Color(), cTmp = new T.Color(), cPale = new T.Color(COL.pale), cDead = new T.Color(COL.dead);

    function draw(time) {
      var lie = st.lie, cr = Math.max(st.crouch, lie), sw = Math.sin(st.ph) * 0.78 * st.walk;
      legL.rotation.x = sw; legR.rotation.x = -sw;
      legs.scale.y = 1 - 0.9 * cr; legs.visible = cr < 0.97;
      var bob = Math.abs(Math.sin(st.ph)) * 0.04 * st.walk;
      var jx = Math.sin(time * 47) * 0.014 * st.shiver, jz = Math.cos(time * 53) * 0.05 * st.shiver;
      bodyG.position.set(jx, 0.55 - 0.22 * cr + bob + 0.03 * lie, 0);
      bodyG.rotation.set(0.22 * st.headDown, 0, lie * 1.45 + jz + Math.sin(st.ph) * 0.05 * st.walk);
      var br = 1 + Math.sin(time * st.rate) * st.breath, f = (1 + 0.17 * st.fluff) * st.size;
      bodyG.scale.set(f * (1 + (br - 1) * 0.5), f * br, f);
      headG.position.set(0, 0.34 + 0.1 * st.neck, 0.3 + 0.08 * st.neck);
      headG.rotation.set(1.05 * st.headDown - 0.6 * st.neck + 0.55 * lie, st.headYaw, st.headTilt);
      jaw.rotation.x = st.beak * 0.8;
      eyes[0].scale.y = eyes[1].scale.y = 0.055 * Math.max(0.1, st.eye);
      var a = 0.14 + 1.2 * st.wing + Math.sin(time * 24) * 0.3 * st.flap * st.wing;
      wR.pv.rotation.z = a; wL.pv.rotation.z = -a;
      var tf = st.fluff * 1.25; tufts.forEach(function (t) { t.scale.setScalar(Math.max(0.001, tf)); });
      cBody.setHex(COL.body).lerp(cPale, st.pale).lerp(cDead, lie * 0.5); mats.body.color.copy(cBody);
      mats.belly.color.setHex(COL.belly).lerp(cPale, st.pale).lerp(cDead, lie * 0.5);
      mats.wing.color.setHex(COL.wing).lerp(cPale, st.pale * 0.8).lerp(cDead, lie * 0.5);
    }

    var api = {
      group: root, pose: tgt, state: st, mats: mats,
      update: function (dt, time) {
        Object.keys(tgt).forEach(function (k) { st[k] += (tgt[k] - st[k]) * (1 - Math.exp(-dt * (RATE[k] || 9))); });
        if (st.walk > 0.03) st.ph += dt * 12 * (0.4 + st.walk);
        draw(time);
      },
      snap: function (time) { Object.keys(tgt).forEach(function (k) { st[k] = tgt[k]; }); draw(time || 0); },
      /* 0 = 7 days old … 1 = grown for another week: rounder, longer two-tone wing feathers */
      setGrowth: function (k) {
        k = U.clamp01(k); st.growth = k; st.size = 1 + 0.13 * k;
        [wL, wR].forEach(function (w) { w.w.scale.set(0.07, 0.2 * (1 + 0.55 * k), 0.27 * (1 + 0.2 * k)); w.w.position.y = -0.13 * (1 + 0.55 * k); w.tip.scale.set(0.06 * k + 0.001, 0.05 * k + 0.001, 0.2 * k + 0.001); w.tip.position.y = -0.3 - 0.11 * k; });
        draw(0);
      }
    };
    api.snap(0);
    return api;
  };
  Mo.CHICK_LEG = LEG;
})(window.Lab);
