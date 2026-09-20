/* Host plant, leaf and ruler for Experiment 7 (1 unit = 10 cm).
   • Mo.leafPiece(length, {bites}): a leaf lying flat. Its blade starts at the origin and points to +x, the top side faces +y. With bites:true it can be gnawed:
     setBites(k), k = 0 whole … 1 badly eaten (the edge is cut away by an alpha map).
   • Mo.ruler(): natural length 1 along x, so a ruler put inside a scaled caterpillar group is as long as the caterpillar.
   • Mo.hostPlant(): a pot with a stem, a perch branch and four big leaves. leafA (the egg and feeding leaf) is at x 1 … 3.5, y about 1.75. It stands at the origin;
     the experiment moves the whole group. api.branchAt(u) = a point on the perch branch (u 0 … 1, local). */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  /* a tapered branch through the given points; the curve is kept in userData for later use */
  function branch(pts, r0, r1, mat, n) {
    n = n || 14;
    var curve = new T.CatmullRomCurve3(pts), tube = new P.TubeGeo(n, 10);
    tube.update(curve.getPoints(n), function (t) { return r0 + (r1 - r0) * t; });
    var m = new T.Mesh(tube.geometry, mat); m.castShadow = true; m.userData.curve = curve; m.userData.noPick = true; return m;
  }

  Mo.leafPiece = function (length, o) {
    o = o || {};
    var g = new T.Group(), holder = new T.Group(); g.add(holder); holder.rotation.y = -Math.PI / 2;
    var geo = P.leaf({ length: length, width: length * 0.5, cup: 0.14, tip: 0.2, su: 8, sv: 14 });
    var mat = M.std(o.color || 0x5aaa44, { map: M.tex.leaf('bean'), roughness: 0.55, side: T.DoubleSide });
    var W = 128, H = 256, cv, cx, alpha, bites = [], R = U.rng(o.seed || 5);
    if (o.bites) {
      cv = document.createElement('canvas'); cv.width = W; cv.height = H; cx = cv.getContext('2d');
      alpha = new T.CanvasTexture(cv); alpha.userData = { own: true }; mat.alphaMap = alpha; mat.alphaTest = 0.5;
      for (var i = 0; i < 16; i++) bites.push({ side: i % 5 === 4 ? 0 : 1, v: 0.32 + 0.5 * (i / 15) + (R() - 0.5) * 0.06, r: 9 + R() * 7 });
    }
    function paint(k) {
      if (!cx) return;
      cx.fillStyle = '#fff'; cx.fillRect(0, 0, W, H); cx.fillStyle = '#000';
      var n = cl(k) * bites.length;
      for (var i = 0; i < bites.length && i < Math.ceil(n); i++) {
        var b = bites[i], f = Math.min(1, n - i), r = b.r * (0.6 + 0.5 * cl(k)) * f;
        cx.beginPath(); cx.arc(b.side ? W : 0, (1 - b.v) * H, r, 0, 6.283); cx.fill();
      }
      alpha.needsUpdate = true; Lab.loop.wake();
    }
    var blade = new T.Mesh(geo, mat); blade.rotation.x = -Math.PI / 2; blade.castShadow = true; blade.receiveShadow = true; blade.userData.noPick = true; holder.add(blade);
    paint(0);
    return { group: g, length: length, setBites: paint };
  };

  Mo.ruler = function () {
    var g = new T.Group(); g.name = 'ruler';
    var body = new T.Mesh(P.roundedBox(1.0, 0.03, 0.14, 0.012, 2), M.std(0xf2dd8a, { roughness: 0.55 })); body.castShadow = true; g.add(body);
    var im = new T.InstancedMesh(new T.BoxGeometry(0.006, 0.004, 0.05), M.std(0x3a2c1c, { roughness: 0.6 }), 21), m = new T.Matrix4(), q = new T.Quaternion();
    for (var i = 0; i <= 20; i++) { var tall = i % 5 === 0; m.compose(V(-0.48 + i * 0.048, 0.017, tall ? -0.035 : -0.05), q, V(1, 1, tall ? 1 : 0.55)); im.setMatrixAt(i, m); }
    im.instanceMatrix.needsUpdate = true; g.add(im);
    g.traverse(function (o) { o.userData.noPick = true; });
    return g;
  };

  Mo.hostPlant = function () {
    var g = new T.Group(); g.name = 'hostPlant';
    var potMat = M.std(0xc9693f, { map: M.tex.terracotta(), roughness: 0.72, side: T.DoubleSide }), stemMat = M.std(0x5c9a3e, { roughness: 0.7 }), woody = M.std(0x7a5a3a, { roughness: 0.85 });
    var pot = new T.Mesh(P.lathe([[0, 0], [0.62, 0], [0.8, 0.95], [0.9, 0.95], [0.9, 1.1], [0.72, 1.1], [0.66, 0.16], [0, 0.16]], 40), potMat); pot.castShadow = pot.receiveShadow = true; pot.userData.noPick = true; g.add(pot);
    var soil = new T.Mesh(new T.CircleGeometry(0.72, 32), M.std(0x5a3d26, { roughness: 1 })); soil.rotation.x = -Math.PI / 2; soil.position.y = 1.0; soil.userData.noPick = true; g.add(soil);
    g.add(branch([V(0, 1.0, 0), V(0.05, 2.0, 0.02), V(0, 3.0, 0), V(0.12, 3.9, -0.04)], 0.1, 0.05, stemMat, 16));
    var perch = branch([V(0.02, 3.0, 0), V(0.9, 3.22, 0.05), V(1.9, 3.32, 0.1), V(2.9, 3.26, 0.1)], 0.07, 0.03, woody, 14); g.add(perch);
    g.add(branch([V(0.04, 1.55, 0.02), V(0.5, 1.65, 0.12), V(1.0, 1.75, 0.16)], 0.045, 0.03, stemMat, 8));
    g.add(branch([V(-0.02, 1.35, 0), V(-0.5, 1.45, 0.08), V(-0.95, 1.55, 0.12)], 0.045, 0.03, stemMat, 8));
    /* a leaf turned by yaw (around y) and lifted by pitch */
    function place(piece, pos, yaw, pitch) { var a = new T.Group(), b = new T.Group(); a.position.copy(pos); a.rotation.y = yaw; b.rotation.z = pitch; a.add(b); b.add(piece.group); g.add(a); return piece; }
    var leafA = place(Mo.leafPiece(2.5, { seed: 3 }), V(1.0, 1.75, 0.16), 0, 0);
    place(Mo.leafPiece(2.1, { seed: 4, color: 0x63b04a }), V(-0.95, 1.55, 0.12), Math.PI, 0);
    place(Mo.leafPiece(1.7, { seed: 6, color: 0x55a041 }), V(0.1, 3.6, -0.05), 2.5, 0.55);
    place(Mo.leafPiece(1.4, { seed: 8, color: 0x63b04a }), V(1.25, 3.26, 0.0), Math.PI / 2 + 0.2, 0.3);
    return { group: g, leafA: leafA, branchAt: function (u) { return perch.userData.curve.getPoint(cl(u)); } };
  };
})(window.Lab);
