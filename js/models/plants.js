/* Lab.models.beanPot – a half-cut flower pot (so the roots can be seen), soil that changes state, and a
   mung-bean plant that is fully parametric: height, leaf size/colour, droop, wilt, falling leaves, rot and
   the root system can all be set (and animated) from numbers. 1 unit = 10 cm. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, C = M.C;

  var PAL = {
    green: 0x4da43e, lightGreen: 0x8dc63f, yellowGreen: 0x9dbf45, yellowGreen2: 0xb0b83c, paleGreen: 0x9ccf6a,
    paleYellow: 0xd9dc78, white: 0xe9edc4, brownYellow: 0xb69f38, brownGreen: 0x788838, brown: 0x8a6a2e,
    bruised: 0x5b5d66, black: 0x2a2a25, rotRoot: 0x3f3a2c, cream: 0xf4ecd6, shrivel: 0xa58a5c, dark: 0x4a3d33, stemGreen: 0x5cab4a
  };
  function col(v) { return typeof v === 'string' ? PAL[v] : v; }

  var POT = { Rt: 0.85, Rb: 0.6, H: 1.25, wall: 0.07, rimO: 0.07, rimH: 0.16, base: 0.09, soilTop: 1.11 };
  POT.Rit = POT.Rt - POT.wall; POT.Rib = POT.Rb - POT.wall;
  function ri(y) { return POT.Rib + (POT.Rit - POT.Rib) * (y - POT.base) / (POT.H - POT.base); }

  function poly(points, mat, z) {
    var g = new T.ShapeGeometry(new T.Shape(points.map(function (p) { return new T.Vector2(p[0], p[1]); })));
    var m = new T.Mesh(g, mat); m.position.z = z || 0; m.receiveShadow = true; m.castShadow = false; return m;
  }

  /* ---------------- roots ---------------- */
  function makeRootDefs() {
    var R = U.rng(1234), defs = [], i, tapWob = [];
    for (i = 0; i <= 10; i++) tapWob.push((R() - 0.5) * 0.12);
    defs.push({ kind: 'tap', wob: tapWob, r0: 0.03, r1: 0.008, nSeg: 10 });
    var nLat = 9;
    for (i = 0; i < nLat; i++) {
      var t = 0.10 + (i / (nLat - 1)) * 0.78;
      defs.push({ kind: 'lat', side: i % 2 ? 1 : -1, t: t, ang: 0.3 + R() * 0.5, len: (0.36 + 0.3 * Math.sin(Math.PI * (t * 0.9 + 0.05))) * (0.75 + R() * 0.5), ph: R() * 6.28, r0: 0.017, r1: 0.005, nSeg: 6, idx: i });
      defs.push({ kind: 'sub', parent: defs.length - 1, s: 0.35 + R() * 0.3, ang: 0.9 + R() * 0.5, len: 0.15 + R() * 0.12, ph: R() * 6.28, r0: 0.009, r1: 0.003, nSeg: 4, idx: i });
    }
    return defs;
  }

  function beanPot() {
    var g = new T.Group(); g.name = 'beanPot';
    var soilTop = POT.soilTop;

    /* --- pot shell (back half) + cut surfaces facing the camera --- */
    var prof = [[0, 0], [POT.Rb, 0], [POT.Rt, POT.H - POT.rimH], [POT.Rt + POT.rimO, POT.H - POT.rimH], [POT.Rt + POT.rimO, POT.H], [POT.Rit, POT.H], [POT.Rib, POT.base], [0, POT.base]];
    var potMat = M.std(C.terracotta, { map: M.tex.terracotta(), roughness: 0.72, side: T.DoubleSide });
    var shell = new T.Mesh(P.lathe(prof, 60, Math.PI / 2, Math.PI), potMat);
    shell.castShadow = true; shell.receiveShadow = true; g.add(shell);
    var cutMat = M.std(0xe4a87c, { roughness: 0.9 });
    var lw = [[-POT.Rb, 0], [-POT.Rt, POT.H - POT.rimH], [-POT.Rt - POT.rimO, POT.H - POT.rimH], [-POT.Rt - POT.rimO, POT.H], [-POT.Rit, POT.H], [-POT.Rib, POT.base]];
    var rw = lw.map(function (p) { return [-p[0], p[1]]; }).reverse();
    g.add(poly(lw, cutMat, 0.001), poly(rw, cutMat, 0.001), poly([[-POT.Rb, 0], [POT.Rb, 0], [POT.Rib, POT.base], [-POT.Rib, POT.base]], cutMat, 0.001));

    /* --- soil: the cut face + the top surface; two layers each so the state can cross-fade --- */
    var faceShape = [[-ri(POT.base), POT.base], [ri(POT.base), POT.base], [ri(soilTop), soilTop], [-ri(soilTop), soilTop]];
    function faceMesh(mat) {
      var m = poly(faceShape, mat, 0.006), uv = m.geometry.attributes.uv, pos = m.geometry.attributes.position;
      for (var i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + POT.Rit) / (2 * POT.Rit), (pos.getY(i) - POT.base) / (soilTop - POT.base));
      return m;
    }
    function topMesh(mat) {
      var geo = new T.CircleGeometry(ri(soilTop) - 0.004, 56, 0, Math.PI); geo.rotateX(-Math.PI / 2);
      var m = new T.Mesh(geo, mat); m.position.y = soilTop; m.receiveShadow = true; return m;
    }
    var state = 'rich';
    var faceBase = faceMesh(M.std(0xffffff, { map: M.tex.soil(state, 'face'), roughness: 0.95 }));
    var faceOver = faceMesh(M.std(0xffffff, { map: M.tex.soil(state, 'face'), roughness: 0.95, transparent: true, opacity: 0 }));
    faceOver.position.z = 0.008; faceOver.visible = false;
    var topBase = topMesh(M.std(0xffffff, { map: M.tex.soil(state, 'top'), roughness: 0.95 }));
    var topOver = topMesh(M.std(0xffffff, { map: M.tex.soil(state, 'top'), roughness: 0.95, transparent: true, opacity: 0 }));
    topOver.position.y = soilTop + 0.003; topOver.visible = false;
    g.add(faceBase, faceOver, topBase, topOver);
    var contact = P.blobShadow(1.15, 1.05, 0.9); contact.position.set(0, 0.006, -0.25); g.add(contact);

    var fade = null;
    function setSoil(key, animate) {
      if (key === state) return;
      var fT = M.tex.soil(key, 'face'), tT = M.tex.soil(key, 'top');
      state = key;
      if (fade) { fade.cancel(); faceBase.material.map = faceOver.material.map; topBase.material.map = topOver.material.map; }
      if (!animate) { faceBase.material.map = fT; topBase.material.map = tT; faceOver.visible = topOver.visible = false; Lab.loop.wake(); return; }
      faceOver.material.map = fT; topOver.material.map = tT; faceOver.material.needsUpdate = topOver.material.needsUpdate = true;
      faceOver.visible = topOver.visible = true;
      fade = Lab.tween.value(0.9, function (k) { faceOver.material.opacity = topOver.material.opacity = k; });
      fade.promise.then(function () {
        faceBase.material.map = fT; topBase.material.map = tT; faceOver.visible = topOver.visible = false; faceOver.material.opacity = topOver.material.opacity = 0; fade = null;
      });
    }

    /* --- roots drawn on the cut face --- */
    var rootsG = new T.Group(); rootsG.position.set(0, soilTop, 0.02); g.add(rootsG);
    var rootMat = M.std(PAL.cream, { roughness: 0.55, emissive: 0x2a2114, emissiveIntensity: 0.5 });
    var defs = makeRootDefs();
    defs.forEach(function (d) {
      d.tube = new P.TubeGeo(d.nSeg, 5);
      d.mesh = new T.Mesh(d.tube.geometry, rootMat); d.mesh.castShadow = false;
      d.pts = []; for (var i = 0; i <= d.nSeg; i++) d.pts.push({ x: 0, y: 0, z: 0 });
      rootsG.add(d.mesh);
    });
    var rootParams = { len: 0.62, spread: 1, thick: 1, sparse: 0, wave: 0, color: 'cream' };
    var maxDepth = soilTop - POT.base - 0.07;
    function clampX(x, y) { var lim = ri(soilTop + y) - 0.07; return Math.max(-lim, Math.min(lim, x)); }
    function updateRoots(p) {
      Object.assign(rootParams, p || {});
      var len = rootParams.len, sp = rootParams.spread, th = rootParams.thick, wv = rootParams.wave;
      rootMat.color.setHex(col(rootParams.color));
      var latVisible = Math.round(9 * (1 - rootParams.sparse));
      var tapD = maxDepth * len, tap = defs[0], latPts = {};
      defs.forEach(function (d, di) {
        var pts = d.pts, n = d.nSeg, i, hide = false, base;
        if (d.kind === 'tap') {
          for (i = 0; i <= n; i++) { var s = i / n; pts[i].x = tap.wob[i] * tapD * s * 1.5 + Math.sin(s * 22 + 1) * wv * 0.03; pts[i].y = -s * tapD; }
        } else {
          var owner = d.kind === 'lat' ? d : defs[d.parent];
          hide = owner.idx >= latVisible || len < 0.06;
          var bx, by, sideDir = owner.side;
          if (d.kind === 'lat') { bx = tap.wob[Math.round(d.t * 10)] * tapD * d.t * 1.5; by = -d.t * tapD; }
          else { var op = defs[d.parent].pts, f = d.s * defs[d.parent].nSeg, i0 = Math.floor(f), fr = f - i0, i1 = Math.min(i0 + 1, defs[d.parent].nSeg); bx = op[i0].x + (op[i1].x - op[i0].x) * fr; by = op[i0].y + (op[i1].y - op[i0].y) * fr; }
          var Ll = d.len * len * (d.kind === 'lat' ? sp : sp * 0.9) * 1.05, ang0 = d.ang;
          for (i = 0; i <= n; i++) {
            var u = i / n, a = ang0 + 0.55 * u * (d.kind === 'lat' ? 1 : 0.6);
            var wx = Math.sin(u * 9 + d.ph) * wv * 0.035, wy = Math.cos(u * 8 + d.ph) * wv * 0.025;
            pts[i].x = clampX(bx + sideDir * u * Ll * Math.cos(a) + wx, by - u * Ll * Math.sin(a));
            pts[i].y = Math.max(-maxDepth, by - u * Ll * Math.sin(a) + wy);
          }
        }
        d.mesh.visible = !hide;
        if (!hide) {
          var r0 = d.r0 * th * (0.55 + 0.45 * Math.min(1, len + 0.25)), r1 = d.r1 * th;
          d.tube.update(pts, function (t) { return (r0 + (r1 - r0) * t) * (1 - 0.4 * wv * Math.abs(Math.sin(t * 7))); });   // shrivelled roots get uneven
        }
      });
      Lab.loop.wake();
    }

    /* --- the plant --- */
    var plantG = new T.Group(); plantG.position.set(0, soilTop, 0); g.add(plantG);
    var stemMat = M.std(PAL.stemGreen, { roughness: 0.55 });
    var stemTube = new P.TubeGeo(14, 8);
    var stem = new T.Mesh(stemTube.geometry, stemMat); stem.castShadow = true; plantG.add(stem);
    var bud = new T.Mesh(new T.SphereGeometry(1, 10, 8), M.std(PAL.lightGreen, { roughness: 0.6 })); bud.castShadow = true; plantG.add(bud);
    var leafGeo = P.leaf({ length: 1, width: 1.16, cup: 0.3, tip: 0.26, shape: 'ovate' });
    var petGeo = new T.CylinderGeometry(0.013, 0.02, 1, 6); petGeo.translate(0, 0.5, 0);
    var LEAF_T = [0.30, 0.46, 0.62, 0.78, 0.94];
    var Rl = U.rng(77), leaves = [];
    for (var k = 0; k < 5; k++) {
      var yaw = new T.Group(), arm = new T.Group();
      var pet = new T.Mesh(petGeo, stemMat); pet.castShadow = true;
      var lm = M.std(0xffffff, { map: M.tex.leaf('bean'), color: PAL.green, roughness: 0.55, side: T.DoubleSide });
      var blade = new T.Mesh(leafGeo, lm); blade.castShadow = true; blade.receiveShadow = true;
      blade.rotation.y = -Math.PI / 2;
      arm.add(pet, blade); yaw.add(arm); plantG.add(yaw);
      leaves.push({ yaw: yaw, arm: arm, pet: pet, blade: blade, mat: lm, tone: 0.9 + Rl() * 0.14, yawAng: k * 2.4 + 0.35, fx: (Rl() - 0.5) * 0.9, fz: -0.08 - Rl() * 0.5, drop: 0.12 + k * 0.15 });
    }

    var P0 = { height: 10, leafScale: 1, leafColor: 'green', stemColor: 'stemGreen', stem: 1, droop: 0, wilt: 0, leafDrop: 0, rot: 0 };
    var cur = Object.assign({}, P0), stemPts = [], i0;
    for (i0 = 0; i0 <= 14; i0++) stemPts.push({ x: 0, y: 0, z: 0 });
    var tmpC = new T.Color(), tmpC2 = new T.Color(), time = 0;

    function stemAt(t) {
      var f = t * 14, i = Math.min(13, Math.floor(f)), fr = f - i, a = stemPts[i], b = stemPts[i + 1];
      return { x: a.x + (b.x - a.x) * fr, y: a.y + (b.y - a.y) * fr, z: a.z + (b.z - a.z) * fr };
    }
    function layoutStem() {
      var H = cur.height * 0.1, N = 14, x = 0, y = 0, lean = 0.05, dir = 1, i, t, a;
      stemPts[0].x = 0; stemPts[0].y = 0; stemPts[0].z = 0;
      for (i = 0; i < N; i++) {
        t = (i + 0.5) / N; a = lean + dir * cur.droop * (0.1 + 1.55 * t * t) + Math.sin(time * 1.1 + t * 2) * 0.012 * (1 - cur.droop);
        x += Math.sin(a) * H / N; y += Math.cos(a) * H / N;
        stemPts[i + 1].x = x; stemPts[i + 1].y = y; stemPts[i + 1].z = 0;
      }
      var r0 = 0.05 * cur.stem;
      stemTube.update(stemPts, function (tt) { return r0 * (1 - 0.4 * tt) + 0.004; });
      var tip = stemPts[N]; bud.position.set(tip.x, tip.y, 0); bud.scale.setScalar(0.05 * cur.stem + 0.02);
      bud.visible = cur.droop < 0.9;
    }
    function layoutLeaves() {
      var ls = cur.leafScale, wilt = cur.wilt, droop = cur.droop;
      leaves.forEach(function (L, k) {
        var t = LEAF_T[k], pt = stemAt(t), sz = (1.06 - 0.24 * t) * ls;
        var f = U.clamp01((cur.leafDrop - L.drop) / 0.18);                    // fallen amount 0..1
        var petLen = 0.28 * Math.max(0.6, ls) * (1 - 0.25 * t) + 0.05;
        var el = U.lerp(0.5, -1.3, U.clamp01(droop * (0.75 + 0.25 * t) + wilt * 0.2));
        el += Math.sin(time * 1.3 + k * 1.7) * 0.03 * (1 - droop);
        L.yaw.position.set(U.lerp(pt.x, L.fx, f), U.lerp(pt.y, 0.03 + k * 0.004, f), U.lerp(pt.z, L.fz, f));
        L.yaw.rotation.y = L.yawAng + f * 1.5;
        L.arm.rotation.z = U.lerp(el - Math.PI / 2, -Math.PI / 2 + 0.08, f);
        L.pet.scale.set(1, petLen * (1 - 0.75 * f), 1);
        L.blade.position.y = petLen * (1 - 0.75 * f);
        L.blade.scale.setScalar(0.76 * sz * (1 - 0.15 * f));
        L.blade.morphTargetInfluences[0] = U.clamp01(wilt + f * 0.6);
        L.yaw.visible = true;
      });
    }
    function layoutColors() {
      var lc = col(cur.leafColor), sc = col(cur.stemColor);
      leaves.forEach(function (L) { tmpC.setHex(lc).multiplyScalar(L.tone); L.mat.color.copy(tmpC); });
      tmpC.setHex(sc); if (cur.rot > 0) tmpC.lerp(tmpC2.setHex(PAL.black), U.clamp01(cur.rot)); stemMat.color.copy(tmpC);
      bud.material.color.setHex(lc).multiplyScalar(1.1);
    }

    var api = {
      group: g, PAL: PAL, soilTopY: soilTop, plantGroup: plantG, rootMat: rootMat, rootsGroup: rootsG,
      get soilState() { return state; },
      setSoil: setSoil,
      /* p: {height(cm), leafScale, leafColor, stemColor, stem, droop, wilt, leafDrop, rot, root:{len,spread,thick,sparse,wave,color}} */
      set: function (p) {
        p = p || {};
        Object.keys(p).forEach(function (k) { if (k !== 'root') cur[k] = p[k]; });
        layoutStem(); layoutLeaves(); layoutColors();
        if (p.root) updateRoots(p.root);
        Lab.loop.wake();
      },
      /* blend two parameter sets a→b by k (0..1); colours are mixed in RGB */
      blend: function (a, b, k) {
        var out = {}, keys = ['height', 'leafScale', 'stem', 'droop', 'wilt', 'leafDrop', 'rot'];
        keys.forEach(function (n) { out[n] = U.lerp(a[n], b[n], k); });
        out.leafColor = new T.Color(col(a.leafColor)).lerp(new T.Color(col(b.leafColor)), k).getHex();
        out.stemColor = new T.Color(col(a.stemColor)).lerp(new T.Color(col(b.stemColor)), k).getHex();
        out.root = {};
        ['len', 'spread', 'thick', 'sparse', 'wave'].forEach(function (n) { out.root[n] = U.lerp(a.root[n], b.root[n], k); });
        out.root.color = new T.Color(col(a.root.color)).lerp(new T.Color(col(b.root.color)), k).getHex();
        return out;
      },
      idle: function (t) { time = t; layoutStem(); layoutLeaves(); },
      /* fixed generous box around pot + plant, used for drop zones */
      zoneBox: function () {
        var p = g.position; return new T.Box3(new T.Vector3(p.x - 1.15, 0, p.z - 1.05), new T.Vector3(p.x + 1.15, 2.7, p.z + 1.1));
      },
      /* where things poured into the pot should land (world) */
      soilPoint: function () { return new T.Vector3(g.position.x, soilTop + 0.05, g.position.z - 0.1); }
    };
    api.set(Object.assign({}, P0, { root: { len: 0.62, spread: 1, thick: 1, sparse: 0, wave: 0, color: 'cream' } }));
    return api;
  }

  Lab.models.beanPot = beanPot;
  Lab.models.PAL = PAL;
  Lab.models.POT = POT;
})(window.Lab);
