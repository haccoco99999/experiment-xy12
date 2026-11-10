/* Lab.models.tomatoPlant – a whole tomato plant for Experiment 5, drawn after the picture the user sent on 2026-11-10: an upright stem,
   compound leaves with toothed leaflets, bunches of small yellow flowers at the top, green and red fruits, and the roots in the open
   under the stem (the plant stands on its roots on the table). 1 unit = 10 cm; the plant is about 48 cm tall.
   The fruit the student follows is not part of the plant: the experiment hangs a Mo.tomatoFruit at `anchor` (local) and moves it itself.
   api: group, anchor (Vector3), stalkTop (Vector3), world(v), ripenOthers(k) (0..1: the green fruits of the lower bunch turn red a little). */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;
  function V(x, y, z) { return new T.Vector3(x, y, z); }

  /* a tapered tube along a curve (stems, leaf stalks, roots) */
  function tube(curve, r0, r1, mat, nSeg, nRad) {
    var tg = new P.TubeGeo(nSeg || 16, nRad || 6), pts = [];
    for (var i = 0; i <= tg.nSeg; i++) pts.push(curve.getPointAt(i / tg.nSeg));
    tg.update(pts, function (t) { return r0 + (r1 - r0) * t; });
    var m = new T.Mesh(tg.geometry, mat); m.castShadow = true; return m;
  }

  /* one toothed leaflet, flat in the x-z plane, from the base (origin) along +x, length 1 */
  function leafletGeometry() {
    var s = new T.Shape(), N = 16, i, t, w, pts = [];
    for (i = 0; i <= N; i++) {
      t = i / N; w = 0.44 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.08)), 0.75) * (1 - 0.25 * t);
      pts.push([t, w * (i % 2 ? 1 : 0.8)]);
    }
    s.moveTo(0, 0);
    for (i = 1; i <= N; i++) s.lineTo(pts[i][0], pts[i][1]);
    for (i = N - 1; i >= 1; i--) s.lineTo(pts[i][0], -pts[i][1] * (i % 3 ? 1 : 0.9));
    s.lineTo(0, 0);
    var g = new T.ShapeGeometry(s, 2), p = g.attributes.position;
    for (i = 0; i < p.count; i++) {                                  // bend: the tip droops and the sides cup up a little
      var x = p.getX(i), y = p.getY(i);
      p.setZ(i, -0.16 * x * x + 0.55 * y * y);
    }
    g.rotateX(-Math.PI / 2);                                         // shape y → world -z, shape z (the bend) → world y
    g.computeVertexNormals();
    return g;
  }

  Mo.tomatoPlant = function () {
    var g = new T.Group(); g.name = 'tomatoPlant';
    var R = U.rng(47);
    var stemMat = M.std(0x5f9c3a, { roughness: 0.7 }), stalkMat = M.std(0x6aa843, { roughness: 0.7 });
    var leafMats = [M.std(0x3f8f2f, { roughness: 0.62, side: T.DoubleSide }), M.std(0x4c9c37, { roughness: 0.62, side: T.DoubleSide }), M.std(0x58a83f, { roughness: 0.62, side: T.DoubleSide })];
    var rootMat = M.std(0xcfb48c, { roughness: 0.9 });
    var BASE = 1.05, TOP = 4.75;

    /* ---- the stem: thick at the bottom, thinner at the top, with a slight zigzag like a real tomato stem ---- */
    var stemCurve = new T.CatmullRomCurve3([V(0, BASE - 0.05, 0), V(0.03, 1.7, 0.02), V(-0.04, 2.4, 0), V(0.04, 3.1, -0.02), V(-0.03, 3.8, 0.01), V(0.02, 4.4, 0), V(-0.02, TOP, 0)]);
    g.add(tube(stemCurve, 0.085, 0.035, stemMat, 40, 10));
    function stemAt(y) { return stemCurve.getPointAt(U.clamp01((y - BASE + 0.05) / (TOP - BASE + 0.05))); }
    var hairPts = [];                                                // the fine hairs that make a tomato stem look fuzzy
    for (var h = 0; h < 160; h++) {
      var hy = BASE + R() * (TOP - BASE - 0.1), c = stemAt(hy), ha = R() * 6.283, hr = 0.07 - 0.035 * (hy - BASE) / (TOP - BASE);
      hairPts.push(c.x + Math.cos(ha) * hr, hy, c.z + Math.sin(ha) * hr, c.x + Math.cos(ha) * (hr + 0.035), hy + 0.012, c.z + Math.sin(ha) * (hr + 0.035));
    }
    var hg = new T.BufferGeometry(); hg.setAttribute('position', new T.Float32BufferAttribute(hairPts, 3));
    g.add(new T.LineSegments(hg, new T.LineBasicMaterial({ color: 0xb9d99a, transparent: true, opacity: 0.7 })));

    /* ---- compound leaves: a stalk with pairs of toothed leaflets and one at the end ---- */
    var lg = leafletGeometry();
    function leaf(y, yaw, len, droop, matIdx) {
      var holder = new T.Group(); holder.position.copy(stemAt(y)); g.add(holder);
      holder.rotation.set(0.8 * Math.cos(yaw), yaw, 0, 'YXZ');            // tilted towards the viewer, so the leaf is seen flat as in the picture
      var curve = new T.QuadraticBezierCurve3(V(0, 0, 0), V(len * 0.45, len * 0.3, 0), V(len, len * (0.12 - 0.42 * droop), 0));
      holder.add(tube(curve, 0.022, 0.01, stalkMat, 12, 5));
      var mat = leafMats[matIdx % 3];
      function leaflet(t, side, size, turn) {
        var p = curve.getPointAt(t), tan = curve.getTangentAt(t), m = new T.Mesh(lg, mat);
        m.position.copy(p); m.scale.setScalar(size); m.castShadow = true;
        var base = Math.atan2(-tan.z, tan.x);
        m.rotation.set(side * 0.25, base + side * turn, Math.atan2(tan.y, Math.hypot(tan.x, tan.z)) * 0.6 - 0.15, 'YXZ');
        holder.add(m);
      }
      [[0.3, 0.32], [0.55, 0.42], [0.8, 0.46]].forEach(function (q) { leaflet(q[0], 1, len * q[1], 1.05 + R() * 0.2); leaflet(q[0], -1, len * q[1], 1.05 + R() * 0.2); });
      [0.42, 0.68].forEach(function (t) { leaflet(t, 1, len * 0.11, 1.4); leaflet(t, -1, len * 0.11, 1.4); });   // the tiny leaflets in between
      leaflet(0.98, 0, len * 0.52, 0);
      return holder;
    }
    [
      [1.55, Math.PI + 0.15, 1.25, 0.55, 0], [1.72, -0.2, 1.2, 0.5, 1], [2.1, Math.PI / 2 + 0.35, 0.95, 0.45, 2],
      [2.5, Math.PI - 0.3, 1.1, 0.45, 1], [2.68, 0.32, 1.12, 0.4, 0], [3.25, Math.PI + 0.4, 0.95, 0.4, 2],
      [3.4, -0.42, 0.98, 0.35, 1], [3.7, Math.PI / 2 - 0.3, 0.75, 0.35, 0], [4.02, Math.PI - 0.55, 0.72, 0.25, 2], [4.18, 0.62, 0.66, 0.2, 1]
    ].forEach(function (l) { leaf(l[0], l[1], l[2] * 1.15, l[3], l[4]); });

    /* ---- small yellow flowers in bunches (five pointed petals bent back, and the yellow cone of the anthers) ---- */
    var petalGeo = new T.ConeGeometry(0.045, 0.16, 4); petalGeo.rotateX(Math.PI / 2); petalGeo.translate(0, 0, 0.08); petalGeo.scale(1, 0.25, 1);
    var petalMat = M.std(0xffd21f, { roughness: 0.55, side: T.DoubleSide }), coneMat = M.std(0xf2c200, { roughness: 0.45 }), sepMat = M.std(0x4f9c3c, { roughness: 0.6 });
    function flower(at, tilt) {
      var f = new T.Group(); f.position.copy(at); f.rotation.set(tilt, R() * 6.283, 0); g.add(f);
      for (var i = 0; i < 5; i++) {
        var a = i * 1.2566, pv = new T.Group(); pv.rotation.y = a; f.add(pv);
        var pt = new T.Mesh(petalGeo, petalMat); pt.rotation.x = 0.55; pt.castShadow = true; pv.add(pt);
        var sp = new T.Mesh(petalGeo, sepMat); sp.rotation.x = -0.35; sp.scale.set(0.6, 1, 0.7); pv.add(sp);
      }
      var cone = new T.Mesh(new T.ConeGeometry(0.04, 0.13, 10), coneMat); cone.rotation.x = Math.PI; cone.position.y = -0.05; f.add(cone);
      return f;
    }
    function bunch(y, yaw, n, lift) {
      var s = stemAt(y), dir = V(Math.cos(yaw), 0, -Math.sin(yaw));
      var end = s.clone().addScaledVector(dir, 0.32).add(V(0, lift, 0));
      var curve = new T.QuadraticBezierCurve3(s, s.clone().addScaledVector(dir, 0.12).add(V(0, lift + 0.12, 0)), end);
      g.add(tube(curve, 0.016, 0.011, stalkMat, 10, 5));
      for (var i = 0; i < n; i++) {
        var t = 0.45 + 0.55 * i / Math.max(1, n - 1), p = curve.getPointAt(t), side = i % 2 ? 1 : -1;
        var tip = p.clone().add(V(dir.z * side * 0.1 + dir.x * 0.08, -0.12 - 0.03 * i, -dir.x * side * 0.1 + dir.z * 0.08));
        g.add(tube(new T.LineCurve3(p, tip), 0.008, 0.007, stalkMat, 2, 4));
        flower(tip, Math.PI - 0.5 + R() * 0.4);
      }
      return curve;
    }
    bunch(4.62, 0.5, 4, 0.12);
    bunch(4.42, Math.PI - 0.4, 3, 0.1);

    /* ---- the other fruits, at different ages, each with its star of sepals and a short stalk ---- */
    var others = [];
    function fruit(attachY, at, r, color) {
      var s = stemAt(attachY), mid = s.clone().lerp(at, 0.5).add(V(0, 0.16, 0)), top = at.clone().add(V(0, r * 0.85, 0));
      g.add(tube(new T.QuadraticBezierCurve3(s, mid, top), 0.014, 0.011, stalkMat, 8, 5));
      var mat = M.std(color, { roughness: 0.28 }), body = new T.Mesh(P.ellipsoid(r, r * 0.86, r, 26), mat); body.position.copy(at); body.castShadow = true; g.add(body);
      for (var i = 0; i < 5; i++) {
        var a = i * 1.2566, sp = new T.Mesh(petalGeo, sepMat); sp.scale.setScalar(r * 5.5); sp.position.copy(top).add(V(0, -0.01, 0));
        sp.rotation.set(0.25, a, 0, 'YXZ'); g.add(sp);
      }
      others.push({ mat: mat, start: new T.Color(color) });
    }
    fruit(2.32, V(-0.27, 1.98, 0.24), 0.2, 0xd8261b);               // the pair of red fruits low on the plant
    fruit(2.32, V(0.1, 1.96, 0.3), 0.21, 0xe0301e);
    fruit(3.62, V(0.17, 3.42, 0.24), 0.17, 0xd92a1d);               // a red one under the upper leaves
    fruit(4.35, V(0.24, 4.22, 0.16), 0.13, 0x9ccc62);               // young green ones near the flowers
    fruit(3.95, V(0.5, 3.86, 0.05), 0.12, 0xa8d06a);

    /* ---- the roots: a short tap root and many side roots that spread and reach down to the table, with fine root hairs ---- */
    g.add(tube(new T.CatmullRomCurve3([V(0, BASE, 0), V(0.02, 0.7, 0.01), V(-0.03, 0.38, 0), V(0.02, 0.06, 0.02)]), 0.06, 0.012, rootMat, 14, 7));
    var fine = [];
    for (var k = 0; k < 26; k++) {
      var a = k * 2.399 + R() * 0.3, y0 = BASE - 0.05 - R() * 0.55, reach = 0.35 + R() * 0.65, end = V(Math.cos(a) * reach, 0.02 + R() * 0.12, Math.sin(a) * reach * 0.8);
      var start = V(Math.cos(a) * 0.03, y0, Math.sin(a) * 0.03);
      var midP = V(Math.cos(a) * reach * 0.45, (y0 + end.y) * 0.55 + 0.05, Math.sin(a) * reach * 0.36).add(V((R() - 0.5) * 0.12, 0, (R() - 0.5) * 0.12));
      var rc = new T.CatmullRomCurve3([start, midP, end]);
      g.add(tube(rc, 0.02 - 0.008 * R(), 0.004, rootMat, 10, 4));
      for (var j = 0; j < 7; j++) {                                  // thin branches and hairs along the root
        var p = rc.getPointAt(0.25 + 0.7 * R()), d = V(R() - 0.5, -0.3 - R() * 0.5, R() - 0.5).normalize().multiplyScalar(0.06 + R() * 0.12);
        fine.push(p.x, p.y, p.z, p.x + d.x, Math.max(0.01, p.y + d.y), p.z + d.z);
      }
    }
    var fg = new T.BufferGeometry(); fg.setAttribute('position', new T.Float32BufferAttribute(fine, 3));
    g.add(new T.LineSegments(fg, new T.LineBasicMaterial({ color: 0xc9ab80, transparent: true, opacity: 0.9 })));
    var shadow = P.blobShadow(1.3, 1.1, 0.45); shadow.position.y = 0.006; g.add(shadow);

    /* ---- where the experiment's fruit hangs: a stalk from the stem on the right, the fruit's top at `anchor` ---- */
    var stalkFrom = stemAt(3.02), anchor = V(0.46, 2.84, 0.6);
    g.add(tube(new T.QuadraticBezierCurve3(stalkFrom, V(0.28, 3.12, 0.34), anchor.clone().add(V(0, 0.02, 0))), 0.016, 0.012, stalkMat, 10, 5));

    g.traverse(function (o) { o.userData.noPick = true; });
    return {
      group: g, anchor: anchor,
      world: function (v) { g.updateMatrixWorld(true); return g.localToWorld(v.clone()); },
      ripenOthers: function (k) { others.forEach(function (o, i) { if (i >= 3) o.mat.color.copy(o.start).lerp(new T.Color(0xf1b52c), 0.5 * k); }); Lab.loop.wake(); }
    };
  };
})(window.Lab);
