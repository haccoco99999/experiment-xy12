/* Lab.models.sproutPot(kind) – one pot of Experiment 6: the half-cut flower pot of Experiment 1 (roots show on the cut face) with one sample on the soil
   that turns into a small plant and then a grown plant. kind: 0 bean seed, 1 sweet potato root, 2 potato tuber with eyes, 3 kalanchoe leaf.
   setLife(t): t = 0 the sample as it was put in, t = 1 the plantlet has formed (day 14), t = 2 the grown plant. 1 unit = 10 cm. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;
  var CREAM = 0xf4ecd6, GREEN = 0x4da43e, LIGHT = 0x8dc63f;
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  function cl(x) { return Math.max(0, Math.min(1, x)); }
  function ss(a, b, x) { var k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k); }

  /* the specimen at t = 0, and how each kind behaves; positions are local to the soil surface (y = 0), z < 0 is the back half of the pot */
  Mo.sproutPot = function (kind) {
    var pot = Mo.beanPot(), g = pot.group, soil = pot.soilTopY, root = new T.Group(); root.position.y = soil; g.add(root);
    pot.plantGroup.visible = false; pot.rootsGroup.visible = false;             // the mung bean of Experiment 1 is not used here
    var mat = function (c, o) { return M.std(c, Object.assign({ roughness: 0.6 }, o || {})); };
    var live = new T.Group(); root.add(live);                                    // everything that changes with t is rebuilt into this group
    var spec = new T.Group(); root.add(spec);
    var cut = 0.012;                                                             // roots are drawn on the cut face, just in front of the soil

    /* ---- the sample ---- */
    var seed, tuber, eyes = [], leafBase, notches = [], bud = null;
    if (kind === 0) { seed = new T.Mesh(P.ellipsoid(0.17, 0.11, 0.11, 16), mat(0x6fa84a, { roughness: 0.4 })); seed.position.set(0, 0.03, -0.22); spec.add(seed); }
    if (kind === 1) {
      tuber = new T.Mesh(P.ellipsoid(0.62, 0.15, 0.15, 20), mat(0xb8642e)); tuber.position.set(0, 0.03, -0.22); tuber.rotation.z = 0.06; spec.add(tuber);
      [-0.55, 0.55].forEach(function (x, i) { var t2 = new T.Mesh(new T.CylinderGeometry(0.02, 0.008, 0.28, 6), mat(0xd9a070)); t2.position.set(x * 0.9, -0.09, -0.15); t2.rotation.z = x > 0 ? -0.5 : 0.5; spec.add(t2); });
    }
    if (kind === 2) {
      tuber = new T.Mesh(P.ellipsoid(0.42, 0.3, 0.34, 22), mat(0xd6b98a, { roughness: 0.8 })); tuber.position.set(0, 0.06, -0.24); spec.add(tuber);
      [[-0.2, 0.28, -0.3], [0.1, 0.32, -0.15], [0.26, 0.2, -0.32], [-0.05, 0.3, -0.42], [0.18, 0.12, -0.05]].forEach(function (p) {
        var e = new T.Mesh(P.ellipsoid(0.045, 0.03, 0.045, 8), mat(0x6e5a3a)); e.position.set(p[0], p[1], p[2]); spec.add(e); eyes.push(e);
      });
    }
    if (kind === 3) {
      leafBase = new T.Mesh(P.ellipsoid(0.78, 0.07, 0.46, 24), mat(0x6aa64a, { roughness: 0.45 })); leafBase.position.set(0, 0.06, -0.3); spec.add(leafBase);
      for (var i = 0; i < 7; i++) {                                              // the notches on the leaf edge, where the plantlets will grow
        var a = -0.85 + i * 0.283, nx = Math.sin(a * 1.9) * 0.7, nz = -0.3 + Math.cos(a * 1.9) * 0.42;
        var n = new T.Mesh(P.ellipsoid(0.05, 0.03, 0.04, 8), mat(0x2f6e2a)); n.position.set(nx, 0.11, nz); spec.add(n); notches.push({ x: nx, z: nz });
      }
    }
    spec.children.forEach(function (o) { o.castShadow = true; });

    /* ---- growth ---- */
    var stemMat = mat(kind === 2 ? 0x9bb35a : 0x8fc460), rootMat = mat(CREAM, { roughness: 0.55 }), leafMat = mat(kind === 3 ? 0x5f9d45 : GREEN, { side: T.DoubleSide, roughness: 0.5 });
    function tube(pts, r0, r1, m) {
      var c = new T.CatmullRomCurve3(pts), geo = new T.TubeGeometry(c, Math.max(4, pts.length * 3), r0, 6, false);
      if (r1 != null && r1 !== r0) { var pos = geo.attributes.position, n = Math.max(4, pts.length * 3) + 1, ring = 7; for (var i = 0; i < n; i++) { var k = 1 - (1 - r1 / r0) * (i / (n - 1)), cc = c.getPointAt(i / (n - 1)); for (var j = 0; j < ring; j++) { var idx = i * ring + j; pos.setXYZ(idx, cc.x + (pos.getX(idx) - cc.x) * k, cc.y + (pos.getY(idx) - cc.y) * k, cc.z + (pos.getZ(idx) - cc.z) * k); } } }
      var m2 = new T.Mesh(geo, m); m2.castShadow = false; live.add(m2); return m2;
    }
    function leaf(p, w, l, rotY, tilt, m) { var lf = new T.Mesh(P.ellipsoid(w * 1.5, 0.014, l * 1.5, 10), m || leafMat); lf.position.copy(p); lf.rotation.set(tilt, rotY, 0); lf.castShadow = true; live.add(lf); return lf; }
    function clear() { while (live.children.length) { var o = live.children[0]; live.remove(o); o.geometry && o.geometry.dispose(); } }

    function roots(len, lat, x0, z0) {                                            // on the cut face: a main root going down and branches
      if (len <= 0.01) return;
      var top = V(x0, -0.03, cut), pts = [top, V(x0 + 0.03, -len * 0.35, cut), V(x0 - 0.02, -len * 0.7, cut), V(x0 + 0.02, -len, cut)];
      tube(pts, 0.024, 0.008, rootMat);
      for (var i = 0; i < lat; i++) {
        var y = -0.12 - (i / Math.max(1, lat)) * (len - 0.15), s = i % 2 ? 1 : -1, sn = Math.sin((i + 1) * 1.3), L = (0.2 + 0.25 * sn * sn) * (0.6 + 0.4 * cl(len)), b = [V(x0, y, cut), V(x0 + s * L * 0.5, y - 0.08, cut), V(x0 + s * L, y - 0.2, cut)];
        tube(b, 0.012, 0.004, rootMat);
      }
    }
    function shoot(base, H, sway, r) {                                            // returns the tip
      if (H <= 0.01) return base.clone();
      var pts = [base.clone()], n = 6;
      for (var i = 1; i <= n; i++) { var k = i / n; pts.push(V(base.x + sway * k * k * H, base.y + H * k, base.z + 0.03 * Math.sin(k * 3))); }
      tube(pts, r, r * 0.6, stemMat); return pts[n];
    }

    function life(t) {
      clear();
      var e1 = ss(0, 1, t), e2 = ss(1, 2, t);
      if (kind === 0) {                                                           // seed → crack → root → shoot → bean plant
        seed.scale.setScalar(1 + 0.35 * ss(0, 0.3, t)); seed.visible = t < 0.95; seed.rotation.z = 0.25 * ss(0.15, 0.3, t);
        var rl = t < 0.25 ? 0 : Math.min(0.95, 0.06 + (t - 0.25) * 0.75);
        roots(rl, Math.floor(cl((t - 0.5) * 10) * 8), 0, -0.22);
        var H = t < 0.5 ? 0 : t < 1 ? (t - 0.5) * 1.4 : 0.7 + (t - 1) * 1.9, tip = shoot(V(0, 0.05, -0.22), H, 0.05, 0.03);
        var pairs = t < 0.75 ? 0 : 1 + Math.floor(cl(t - 1) * 5), sc = 0.3 + 0.7 * cl(t / 2);
        for (var i = 0; i < pairs; i++) { var y = 0.15 + (H * (0.3 + 0.7 * i / Math.max(1, pairs))); [-1, 1].forEach(function (s, j) { leaf(V(s * 0.16 * sc, y, -0.22), 0.16 * sc, 0.2 * sc, s * 0.6, -0.3 + i * 0.1, null); }); }
        if (t > 0.7 && H > 0) leaf(tip.clone().add(V(0, 0.03, 0)), 0.1 * sc, 0.13 * sc, 0.2, -0.6, null);
        if (t >= 0.2 && t < 0.5 && kind === 0) { var sprout = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), mat(0xf1ecc8)); sprout.position.set(0.14 * sc, 0.02, -0.14); live.add(sprout); }
      } else if (kind === 1) {                                                    // root piece → bud → vine
        var rl1 = t < 0.2 ? 0.08 * ss(0, 0.2, t) : 0.08 + 0.75 * ss(0.2, 1.4, t);
        roots(rl1, Math.floor(cl((t - 0.3) * 6) * 6), 0.42, -0.22);
        var H1 = t < 0.35 ? 0 : 0.25 * ss(0.35, 1, t) + 1.4 * ss(1, 2, t), sway = 0.2 + 1.1 * e2, base = V(-0.5, 0.1, -0.22), pts1 = [base.clone()];
        for (var k = 1; k <= 8; k++) { var f = k / 8, hh = H1 * Math.sin(f * 1.35); pts1.push(V(base.x + sway * H1 * f * 1.2, base.y + hh * 0.7, base.z + 0.04 * Math.sin(f * 4))); }
        if (H1 > 0.02) { tube(pts1, 0.026, 0.012, stemMat); var nl = Math.floor(1 + cl(t - 0.4) * 2 + e2 * 6), ls = 0.3 + 0.7 * cl(t / 2); for (var q = 1; q <= nl; q++) { var pk = pts1[Math.min(8, Math.floor(q * 8 / (nl + 1)) + 1)]; leaf(pk.clone().add(V(0, 0.05, 0.02)), 0.17 * ls, 0.15 * ls, q % 2 ? 0.5 : -0.5, -0.2, null); } }
      } else if (kind === 2) {                                                    // tuber with eyes → sprout from one eye → potato plant
        var eyeK = ss(0.1, 0.5, t); eyes.forEach(function (e, i) { e.scale.setScalar(1 + eyeK * (i === 1 ? 1.4 : 0.5)); });
        roots(t < 0.4 ? 0 : 0.1 + 0.8 * ss(0.4, 1.7, t), Math.floor(cl((t - 0.5) * 6) * 7), 0.1, -0.15);
        var H2 = t < 0.3 ? 0.04 * ss(0.1, 0.3, t) : 0.55 * ss(0.3, 1, t) + 1.6 * ss(1, 2, t), b2 = V(0.1, 0.36, -0.15), tip2 = shoot(b2, H2, 0.08, 0.022);
        var nl2 = t < 0.6 ? 0 : 2 + Math.floor(cl(t - 1) * 8), sc2 = 0.35 + 0.65 * cl(t / 2);
        for (var m2 = 0; m2 < nl2; m2++) { var yy = b2.y + H2 * (0.25 + 0.75 * m2 / Math.max(1, nl2)), s2 = m2 % 2 ? 1 : -1; [0, 1, 2].forEach(function (lf) { leaf(V(b2.x + s2 * (0.12 + 0.08 * lf) * sc2, yy + 0.02 * lf, b2.z), 0.09 * sc2, 0.13 * sc2, s2 * 0.4, -0.35, null); }); }
        if (H2 > 0.1) leaf(tip2.clone().add(V(0, 0.03, 0)), 0.09 * sc2, 0.12 * sc2, 0.1, -0.5, null);
      } else {                                                                    // leaf → tiny plantlets on its edge → small plants → grown plants
        var ps = ss(0.25, 1, t), grow = ss(1, 2, t);
        leafBase.scale.set(1 - 0.35 * grow, 1, 1 - 0.35 * grow); leafBase.material.color.setHex(0x6aa64a).lerp(new T.Color(0x9a8a4a), 0.7 * grow);
        var nP = Math.round(cl(t / 0.9) * 6);
        for (var pi = 0; pi < nP; pi++) {
          var nt = notches[pi], sz = (0.05 + 0.3 * ps + 0.4 * grow) * (0.8 + 0.2 * Math.sin(pi * 2)), px = nt.x * (1 + 0.15 * grow) + (pi % 2 ? 0.05 : -0.05) * grow;
          var base3 = V(px, 0.13, nt.z + 0.05);
          for (var lf3 = 0; lf3 < 3; lf3++) { var ang = lf3 * 2.1 + pi; leaf(V(base3.x + Math.cos(ang) * sz * 0.35, base3.y + sz * 0.3, base3.z + Math.sin(ang) * sz * 0.2), 0.05 + 0.11 * sz + 0.06 * grow, 0.09 * sz + 0.02, ang, -0.9 + 0.5 * lf3 * 0.4, null); }
          var rlen = 0.05 + 0.3 * ss(0.4, 1.4, t) + 0.35 * grow, side = pi % 3 - 1;
          if (t > 0.35) { tube([V(px, -0.02, cut), V(px + 0.03 * side, -rlen * 0.5, cut), V(px + 0.08 * side, -rlen, cut)], 0.014, 0.005, rootMat); if (t > 0.9) tube([V(px, -0.05, cut), V(px - 0.12, -rlen * 0.6, cut), V(px - 0.2, -rlen * 0.9, cut)], 0.01, 0.004, rootMat); }
        }
      }
      Lab.loop.wake();
    }
    life(0); spec.visible = live.visible = false;                              // the sample appears when the student puts it in the pot

    var api = {
      group: g, kind: kind, soilY: soil, life: 0,
      setLife: function (t) { api.life = t; life(t); },
      showSample: function (b) { spec.visible = !!b; live.visible = !!b; Lab.loop.wake(); },
      world: function (v) { g.updateMatrixWorld(true); return g.localToWorld(v.clone()); },
      /* the point the magnifier looks at, in the pot's local frame */
      lensPoint: function () { return [V(0, soil + 0.1, -0.2), V(0.3, soil + 0.05, -0.2), V(0, soil + 0.3, -0.22), V(0, soil + 0.12, -0.05)][kind]; },
      zoneBox: pot.zoneBox, soilPoint: pot.soilPoint, setSoil: pot.setSoil
    };
    return api;
  };
})(window.Lab);
