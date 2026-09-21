/* Cell-stage models for Experiment 8 (drawn far bigger than life, in soft colours, nothing scary).
   • Mo.sperm(): a head and a tail that waves; the nose points to +x; api.update(time) waves the tail.
   • Mo.egg(): a big round egg with a clear shell and a nucleus; setGlow(k) lights it, setZygote(k) turns it into the zygote (k = 1): brighter shell, bigger nucleus.
   • Mo.embryo(): setT(t), t = 0 one small cell (day 0), 1 a few cells (day 15), 2 a ball of many cells (day 30), 3 a curled body with a head (day 45).
   • Mo.fetus(): setStage(k), k = 0 (day 45) … 1 (day 60, the parts are clear) … 2 (near birth). The parts (head, body, legs, tail, ears) have userData.pick = 'fetus:<part>';
     highlight(part) makes one glow. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ss(a, b, x) { var k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k); }
  function ell(rx, ry, rz, mat) { return new T.Mesh(P.ellipsoid(rx, ry, rz, 16), mat); }
  function glowSprite(hex, size) { var s = new T.Sprite(new T.SpriteMaterial({ map: M.tex.glow(), color: hex, transparent: true, opacity: 0, depthWrite: false, fog: false })); s.scale.setScalar(size); s.renderOrder = 9; s.userData.noPick = true; return s; }

  /* ---------------------------------------------------------------- sperm */
  Mo.sperm = function () {
    var g = new T.Group(); g.name = 'sperm';
    var mat = M.std(0xa6dcff, { roughness: 0.3, emissive: 0x2a5f8a, emissiveIntensity: 0.55 });
    var head = ell(0.13, 0.085, 0.085, mat); g.add(head);
    var tube = new P.TubeGeo(14, 6), tail = new T.Mesh(tube.geometry, mat); tail.frustumCulled = false; g.add(tail);
    var api = {
      group: g, head: head, mat: mat, phase: Math.random() * 6.28, speed: 1,
      update: function (t) {
        var pts = [];
        for (var i = 0; i <= 14; i++) { var s = i / 14, w = t * 9 * api.speed + api.phase - s * 7; pts.push({ x: -0.09 - s * 0.85, y: Math.sin(w) * 0.075 * (0.25 + s), z: Math.cos(w) * 0.03 * s }); }
        tube.update(pts, function (u) { return 0.05 * (1 - u * 0.8) + 0.01; });
      },
      glow: function (on) { mat.emissiveIntensity = on ? 1.4 : 0.55; Lab.loop.wake(); }
    };
    api.update(0);
    return api;
  };

  /* ---------------------------------------------------------------- egg and zygote */
  Mo.egg = function () {
    var g = new T.Group(); g.name = 'egg';
    var shellMat = M.clearPlastic({ color: 0xffc7d9, opacity: 0.32 }), shell = new T.Mesh(new T.SphereGeometry(1, 32, 24), shellMat); shell.renderOrder = 4; g.add(shell);
    var cytoMat = M.std(0xffe0cc, { roughness: 0.5, transparent: true, opacity: 0.5, depthWrite: false }), cyto = new T.Mesh(new T.SphereGeometry(0.84, 28, 20), cytoMat); cyto.renderOrder = 2; g.add(cyto);
    var R = U.rng(41), grMat = M.std(0xff9f78, { roughness: 0.6 });
    for (var i = 0; i < 18; i++) { var a = R() * 6.283, b = Math.acos(2 * R() - 1), r = 0.78 * Math.cbrt(R()), m = ell(0.07, 0.07, 0.07, grMat); m.position.set(r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a)); g.add(m); }
    var nucMat = M.std(0xc76ba7, { roughness: 0.4 }), nuc = new T.Mesh(new T.SphereGeometry(0.3, 20, 14), nucMat); nuc.position.set(0.15, 0.05, 0.3); g.add(nuc);
    var halo = glowSprite(0xffe9a0, 3.4); g.add(halo);
    var c0 = new T.Color(0xc76ba7), c1 = new T.Color(0x8e4bd0), p0 = V(0.15, 0.05, 0.3);
    var api = {
      group: g, shell: shell,
      setGlow: function (k) { halo.material.opacity = 0.85 * cl(k); halo.scale.setScalar(3.2 + 0.7 * cl(k)); cytoMat.emissive.setHex(0xffe0a0); cytoMat.emissiveIntensity = 0.35 * cl(k); Lab.loop.wake(); },
      setZygote: function (k) {
        k = cl(k); nucMat.color.copy(c0).lerp(c1, k); nuc.scale.setScalar(1 + 0.45 * k); nuc.position.lerpVectors(p0, V(0, 0, 0.3), k); shellMat.opacity = 0.32 + 0.2 * k; Lab.loop.wake();
      }
    };
    return api;
  };

  /* ---------------------------------------------------------------- embryo */
  Mo.embryo = function () {
    var g = new T.Group(); g.name = 'embryo';
    var N = 44, R = U.rng(21), geo = new T.SphereGeometry(1, 14, 10), mat = M.std(0xf7b6c4, { roughness: 0.5 }), cells = [], P1 = [], P2 = [], i;
    var membraneMat = M.clearPlastic({ color: 0xffc7d9, opacity: 0.25 }), membrane = new T.Mesh(new T.SphereGeometry(1, 24, 16), membraneMat); membrane.renderOrder = 4; g.add(membrane);
    for (i = 0; i < N; i++) {
      var y = 1 - (i + 0.5) / N * 2, rad = Math.sqrt(1 - y * y), th = i * 2.399963, rr = 0.72 * (0.8 + 0.2 * R());
      P1.push(V(Math.cos(th) * rad * rr, y * rr, Math.sin(th) * rad * rr));
      var u = i / (N - 1), a = -2.1 + u * 4.4, c = V(Math.cos(a) * 0.85 - 0.2, Math.sin(a) * 0.95, 0), thick = u < 0.15 ? 0.13 : 0.3 + 0.2 * ss(0.6, 1, u);
      P2.push(c.add(V((R() - 0.5) * thick * 1.5, (R() - 0.5) * thick * 1.5, (R() - 0.5) * thick * 1.4)));
      var m = new T.Mesh(geo, mat); m.visible = false; m.userData.noPick = true; g.add(m); cells.push(m);
    }
    var eyeMat = M.std(0x2a1d22, { roughness: 0.3 }), eyes = [-1, 1].map(function (s) { var e = ell(0.06, 0.06, 0.06, eyeMat); e.visible = false; g.add(e); return e; });
    var c0 = new T.Color(0xf7b6c4), c1 = new T.Color(0xf08fa0), tmp = V(0, 0, 0);
    var api = {
      group: g, t: 0,
      setT: function (t) {
        api.t = t; var count = 1 + (N - 1) * ss(0, 2, t), size = 0.28 + 0.72 * ss(0, 2, t), body = ss(2, 3, t), rc = t < 1 ? 0.5 - 0.2 * t : t < 2 ? 0.3 - 0.13 * (t - 1) : 0.17 + 0.16 * (t - 2);
        g.scale.setScalar(0.9 + 0.75 * ss(0, 3, t));
        for (i = 0; i < N; i++) {
          var m = cells[i], k = cl(count - i), u = i / (N - 1), shape = u < 0.2 ? 0.55 + 2.25 * u : u > 0.72 ? 1 + 1.6 * (u - 0.72) : 1, sc = rc * ss(0, 1, k) * (1 + (shape - 1) * body) * (1 + 0.6 * body * (i % 9 === 0 ? 1 : 0));
          m.visible = sc > 0.004; m.scale.setScalar(Math.max(0.001, sc));
          if (i === 0 && t < 0.05) tmp.set(0, 0, 0); else tmp.copy(P1[i]).multiplyScalar(size * (i === 0 ? 0 : 1));
          m.position.copy(tmp).lerp(P2[i], body);
        }
        membrane.scale.setScalar(size + 0.3 - 0.1 * body); membraneMat.opacity = 0.25 * (1 - ss(1.6, 2.4, t)); membrane.visible = membraneMat.opacity > 0.01;
        mat.color.copy(c0).lerp(c1, body);
        var head = P2[N - 1];
        eyes.forEach(function (e, j) { e.visible = t > 2.55; e.position.set(head.x + 0.28, head.y + 0.05, (j ? 1 : -1) * 0.2).multiplyScalar(1); });
        Lab.loop.wake();
      }
    };
    api.setT(0);
    return api;
  };

  /* ---------------------------------------------------------------- fetus */
  Mo.fetus = function () {
    var g = new T.Group(); g.name = 'fetus';
    var names = ['head', 'body', 'legs', 'tail', 'ears'], mats = {}, base = new T.Color(0xf2b5b0), fur = new T.Color(0xe3b9a4);
    names.forEach(function (n) { mats[n] = M.std(0xf2b5b0, { roughness: 0.7 }); });
    function pick(m, part) { m.userData.pick = 'fetus:' + part; m.castShadow = true; return m; }
    var body = pick(ell(0.85, 0.5, 0.5, mats.body), 'body'); body.rotation.z = 0.22; g.add(body);
    var head = pick(new T.Mesh(new T.SphereGeometry(0.46, 20, 14), mats.head), 'head'); head.position.set(0.95, 0.36, 0.04); g.add(head);
    var eyeM = M.std(0x2a1d22, { roughness: 0.4 });
    [-1, 1].forEach(function (s) { var e = ell(0.07, 0.014, 0.05, eyeM); e.position.set(0.4, 0.06, s * 0.19); e.rotation.y = s * 0.5; e.userData.noPick = true; head.add(e); });
    var ears = [-1, 1].map(function (s) { var e = pick(new T.Mesh(new T.ConeGeometry(0.16, 0.34, 4), mats.ears), 'ears'); e.position.set(0.88, 0.84, s * 0.26); e.rotation.x = s * 0.3; g.add(e); return e; });
    var legs = [[0.55, -0.42, 0.3, 0.5], [0.55, -0.42, -0.3, 0.5], [-0.55, -0.4, 0.34, -0.4], [-0.55, -0.4, -0.34, -0.4]].map(function (p) {
      var l = pick(new T.Mesh(new T.CylinderGeometry(0.085, 0.07, 0.5, 8), mats.legs), 'legs'); l.position.set(p[0], p[1], p[2]); l.rotation.z = p[3]; g.add(l); return l;
    });
    var tc = new T.CatmullRomCurve3([V(-0.8, 0.06, 0), V(-1.1, -0.02, 0.05), V(-1.3, -0.3, 0.1), V(-1.2, -0.62, 0.05)]), tube = new P.TubeGeo(10, 8);
    tube.update(tc.getPoints(10), function (t) { return 0.09 - 0.05 * t; });
    var tail = pick(new T.Mesh(tube.geometry, mats.tail), 'tail'); g.add(tail);
    var parts = { head: [head], body: [body], legs: legs, tail: [tail], ears: ears };
    var api = {
      group: g, parts: parts, mats: mats, stage: 0,
      setStage: function (k) {
        api.stage = k; var s = 0.6 + 0.4 * ss(0, 2, k), fine = ss(0, 1, k);
        g.scale.setScalar(s); ears.forEach(function (e) { e.scale.setScalar(0.15 + 0.85 * ss(0.2, 1.1, k)); });
        legs.forEach(function (l) { l.scale.set(1, 0.4 + 0.6 * fine, 1); }); tail.scale.setScalar(0.45 + 0.55 * ss(0, 1.6, k));
        names.forEach(function (n) { mats[n].color.copy(base).lerp(fur, ss(0.8, 2, k)); });
        Lab.loop.wake();
      },
      highlight: function (part) {
        names.forEach(function (n) { var on = n === part; mats[n].emissive.setHex(on ? 0xffd84a : 0x000000); mats[n].emissiveIntensity = on ? 0.8 : 0; });
        Lab.loop.wake();
      }
    };
    api.setStage(0);
    return api;
  };
})(window.Lab);
