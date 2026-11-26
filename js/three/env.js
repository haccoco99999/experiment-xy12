/* Lab.env – the garden and the wooden lab table that every experiment stands on.
   Table top surface is at y = 0, centred on x = 0, z = 0; the camera looks at it from +z. 1 unit ≈ 10 cm. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, M = Lab.mat, P = Lab.prim;

  var TABLE = { w: 9.4, d: 4.9, thick: 0.42, height: 6.2 };
  var HAZE = 0xe4efe0;
  var GEO = {};

  function sharedGeometry(key, make) {
    if (!GEO[key]) {
      var geo = make();
      geo.name = 'env-shared-' + key;
      geo.userData.shared = true;
      GEO[key] = geo;
    }
    return GEO[key];
  }

  function instanced(geo, mat, n, place) {
    var im = new T.InstancedMesh(geo, mat, n), matrix = new T.Matrix4(), q = new T.Quaternion();
    var p = new T.Vector3(), s = new T.Vector3(), col = new T.Color();
    for (var i = 0; i < n; i++) {
      p.set(0, 0, 0); s.set(1, 1, 1); q.identity(); col.setRGB(1, 1, 1);
      var useColor = place(i, p, s, col, q) !== false;
      matrix.compose(p, q, s); im.setMatrixAt(i, matrix);
      if (useColor && im.setColorAt) im.setColorAt(i, col);
    }
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    im.castShadow = false; im.receiveShadow = false; im.userData.noPick = true;
    return im;
  }

  function build(scene, opts) {
    opts = opts || {};
    var g = new T.Group(); g.name = 'env'; scene.add(g);
    var groundY = -TABLE.height;

    /* crisp daylight and a quiet horizon behind the experiment */
    scene.background = M.tex.sky();
    scene.backgroundIntensity = 1;
    scene.fog = new T.Fog(HAZE, 34, 96);

    /* lawn: broad tonal patches with finer blades, all in one shared texture */
    var lawnGeo = sharedGeometry('lawn', function () { return new T.CircleGeometry(120, 64); });
    var lawn = new T.Mesh(lawnGeo, M.std(0xffffff, { map: M.tex.grass(), roughness: 1, envMapIntensity: 0.2 }));
    lawn.rotation.x = -Math.PI / 2; lawn.position.y = groundY; lawn.receiveShadow = true; lawn.userData.noPick = true;
    g.add(lawn);

    /* fence: one instanced picket draw, two instanced rails */
    var fenceMat = M.std(0xffffff, { roughness: 0.84, envMapIntensity: 0.38 });
    var fenceR = U.rng(12), fenceColors = [0xf6efdf, 0xfff8e9, 0xece2ce, 0xf2ead8];
    var picketGeo = sharedGeometry('picket', function () { return new T.BoxGeometry(0.34, 1.7, 0.14); });
    var pickets = instanced(picketGeo, fenceMat, 96, function (i, p, s, col, q) {
      p.set(-24 + i * 0.5, groundY + 0.85 + (fenceR() - 0.5) * 0.025, -11);
      s.y = 0.97 + fenceR() * 0.06;
      q.setFromAxisAngle(new T.Vector3(0, 0, 1), (fenceR() - 0.5) * 0.012);
      col.setHex(fenceColors[(fenceR() * fenceColors.length) | 0]);
    });
    pickets.name = 'fencePickets'; g.add(pickets);
    var rails = instanced(sharedGeometry('fenceRail', function () { return new T.BoxGeometry(48, 0.16, 0.12); }), fenceMat, 2, function (i, p, s) {
      p.set(0, groundY + (i ? 1.15 : 0.55), -11.1); return false;
    });
    rails.name = 'fenceRails'; g.add(rails);

    /* hedge has a near row and a dimmer row behind it; both are one instanced draw */
    var hedgeR = U.rng(5), greens = [0x4b9139, 0x589f3d, 0x438532, 0x64aa43, 0x38752e];
    var hedge = instanced(sharedGeometry('softFoliage', function () { return new T.IcosahedronGeometry(1, 1); }), M.std(0xffffff, { roughness: 0.94, envMapIntensity: 0.22 }), 64, function (i, p, s, col) {
      if (i < 46) {
        p.set(-25 + i * 1.12 + hedgeR() * 0.4, groundY + 1.6 + hedgeR() * 0.5, -14 - hedgeR() * 1.2);
        var k = 1.45 + hedgeR() * 0.7; s.set(k * 1.2, k, k);
      } else {
        var j = i - 46;
        p.set(-24 + j * 3 + hedgeR() * 0.8, groundY + 1.15 + hedgeR() * 0.45, -20 - hedgeR() * 2.2);
        k = 1.7 + hedgeR() * 0.7; s.set(k * 1.2, k * 0.9, k);
        col.setHex(greens[(hedgeR() * greens.length) | 0]).multiplyScalar(0.78);
        return true;
      }
      col.setHex(greens[(hedgeR() * greens.length) | 0]);
    });
    hedge.name = 'layeredHedge'; g.add(hedge);

    /* round trees are two draws instead of 28, with the same positions and a lighter triangle budget */
    var trees = [[-15, -22, 1.2], [-8, -26, 1.5], [3, -30, 1.7], [12, -24, 1.3], [19, -21, 1.1], [-22, -18, 1.0], [26, -28, 1.6]];
    var trunks = instanced(sharedGeometry('treeTrunk', function () { return new T.CylinderGeometry(0.28, 0.4, 5.2, 8); }), M.std(0xffffff, { roughness: 0.95, envMapIntensity: 0.2 }), trees.length, function (i, p, s, col) {
      var t = trees[i], k = t[2]; p.set(t[0], groundY + 2.6 * k, t[1]); s.set(k, k, k); col.setHex(i % 2 ? 0x755136 : 0x805c39);
    });
    trunks.name = 'treeTrunks'; g.add(trunks);
    var crowns = [0x579c3c, 0x489337, 0x62a845, 0x3e8432];
    var crownParts = [[0, 6.4, 0, 3.0], [-1.7, 5.4, 0.4, 2.2], [1.8, 5.6, -0.3, 2.3]];
    var canopy = instanced(sharedGeometry('treeCanopy', function () { return new T.IcosahedronGeometry(1, 1); }), M.std(0xffffff, { roughness: 0.93, envMapIntensity: 0.2 }), trees.length * crownParts.length, function (i, p, s, col, q) {
      var ti = (i / crownParts.length) | 0, ci = i % crownParts.length, t = trees[ti], c = crownParts[ci], k = t[2];
      p.set(t[0] + c[0] * k, groundY + c[1] * k, t[1] + c[2] * k); s.setScalar(c[3] * k);
      q.setFromAxisAngle(new T.Vector3(0, 1, 0), (ti * 1.1 + ci * 0.7));
      col.setHex(crowns[(ti + ci) % crowns.length]);
    });
    canopy.name = 'treeCanopies'; g.add(canopy);

    /* three quiet clay pots at the fence line keep the garden legible without competing with the table */
    var potMat = M.std(0xc56f47, { roughness: 0.82, envMapIntensity: 0.32 });
    var propPots = instanced(sharedGeometry('gardenPot', function () { return new T.CylinderGeometry(0.42, 0.29, 0.58, 10, 1, false); }), potMat, 3, function (i, p, s, col) {
      p.set(9.6 + i * 1.28, groundY + 0.29, -8.9 - (i % 2) * 0.35);
      var k = 0.8 + i * 0.08; s.set(k, k, k); col.setHex([0xc86f47, 0xb9623f, 0xd07c50][i]);
    });
    propPots.name = 'gardenPots'; g.add(propPots);
    var propR = U.rng(31);
    var potLeaves = instanced(sharedGeometry('softFoliage'), M.std(0xffffff, { roughness: 0.88, envMapIntensity: 0.2 }), 7, function (i, p, s, col) {
      var pot = i % 3, branch = (i / 3) | 0;
      p.set(9.6 + pot * 1.28 + (propR() - 0.5) * 0.36, groundY + 0.72 + branch * 0.25 + propR() * 0.18, -8.9 - (pot % 2) * 0.35);
      var k = 0.28 + propR() * 0.16; s.set(k * 1.1, k, k);
      col.setHex([0x4f963d, 0x64a846, 0x3f8334][i % 3]);
    });
    potLeaves.name = 'gardenPotLeaves'; g.add(potLeaves);

    /* tiny low-poly blooms stay soft and cheap around the focal table */
    var flowerColors = [0xf2a7bd, 0xffdd68, 0xfff9e7, 0xc6a4e5, 0xf4a06d], flowerR = U.rng(9);
    var flowers = instanced(sharedGeometry('gardenFlower', function () { return new T.OctahedronGeometry(0.12, 0); }), M.std(0xffffff, { roughness: 0.78, envMapIntensity: 0.25 }), 164, function (i, p, s, col, q) {
      var a = flowerR() * 6.283, rad = 6 + flowerR() * 12, k = 0.85 + flowerR() * 0.45;
      p.set(Math.cos(a) * rad * 1.5, groundY + 0.14, -4 - Math.abs(Math.sin(a)) * rad * 0.7);
      s.setScalar(k); q.setFromAxisAngle(new T.Vector3(0, 1, 0), a); col.setHex(flowerColors[(flowerR() * flowerColors.length) | 0]);
    });
    flowers.name = 'gardenFlowers'; g.add(flowers);

    /* the lab table keeps warm, broad planes so models read clearly in daylight */
    var wood = M.tex.wood();
    var topGeo = sharedGeometry('tableTop', function () {
      return P.boxUV(P.roundedBox(TABLE.w, TABLE.thick, TABLE.d, 0.1, 4), TABLE.w, TABLE.thick, TABLE.d);
    });
    var top = new T.Mesh(topGeo, M.std(0xffffff, { map: wood, roughness: 0.7, envMapIntensity: 0.38 }));
    top.position.y = -TABLE.thick / 2; top.castShadow = true; top.receiveShadow = true; top.userData.noPick = true; top.name = 'tableTop';
    g.add(top);

    var darkWood = M.std(0xb17b4d, { map: wood, roughness: 0.78, envMapIntensity: 0.3 });
    var apronGeo = sharedGeometry('tableApron', function () { return P.boxUV(new T.BoxGeometry(TABLE.w - 0.9, 0.5, TABLE.d - 0.9), 4, 1, 4); });
    var apron = new T.Mesh(apronGeo, darkWood);
    apron.position.y = -TABLE.thick - 0.22; apron.castShadow = true; apron.receiveShadow = true; apron.userData.noPick = true; apron.name = 'tableApron'; g.add(apron);

    var legs = instanced(sharedGeometry('tableLeg', function () { return new T.BoxGeometry(0.55, TABLE.height - TABLE.thick, 0.55); }), darkWood, 4, function (i, p) {
      var c = [[-1, -1], [1, -1], [-1, 1], [1, 1]][i];
      p.set(c[0] * (TABLE.w / 2 - 0.65), -TABLE.thick - (TABLE.height - TABLE.thick) / 2, c[1] * (TABLE.d / 2 - 0.65));
      return false;
    });
    legs.castShadow = true; legs.receiveShadow = true; legs.name = 'tableLegs'; g.add(legs);

    var tableShadow = P.blobShadow(TABLE.w * 0.66, TABLE.d * 0.78, 0.48);
    tableShadow.position.y = groundY + 0.02; tableShadow.name = 'tableContactShadow'; g.add(tableShadow);

    /* daylight is deliberately crisp, while blob shadows remain useful in light mode */
    var hemi = new T.HemisphereLight(0xe7f4ff, 0x9b8060, 1.1); scene.add(hemi);
    var sun = new T.DirectionalLight(0xfff0d0, 2.35);
    sun.position.set(6.5, 11, 7.5); sun.target.position.set(0, 0, 0);
    sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.radius = 2.6;
    Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 7, bottom: -7, near: 1, far: 34 });
    sun.shadow.bias = -0.00045; sun.shadow.normalBias = 0.035;
    scene.add(sun); scene.add(sun.target);
    var fill = new T.DirectionalLight(0xd1e7ff, 0.5); fill.position.set(-7, 4, 6); scene.add(fill);

    var base = { hemi: hemi.intensity, sun: sun.intensity, fill: fill.intensity, env: 0.55, sunColor: sun.color.clone(), hemiSky: hemi.color.clone() };
    var tint = new T.Color(), eveningSun = new T.Color(0xffaa60);
    var env = {
      group: g, table: TABLE, top: top, sun: sun, hemi: hemi, fill: fill, surfaceY: 0,
      /* 1 = bright day … 0 = night. Also used for the day/night flicker during time-lapse. */
      setDay: function (k) {
        k = U.clamp01(k);
        sun.intensity = base.sun * k; hemi.intensity = base.hemi * (0.28 + 0.72 * k); fill.intensity = base.fill * (0.4 + 0.6 * k);
        scene.environmentIntensity = base.env * (0.25 + 0.75 * k); scene.backgroundIntensity = 0.16 + 0.84 * k;
        scene.fog.color.setHex(HAZE).multiplyScalar(0.18 + 0.82 * k);
        sun.color.copy(base.sunColor).lerp(eveningSun, (1 - k) * 0.52);
        Lab.loop.wake();
      },
      /* gentle colour cast for very cold / very hot air (amount 0..1) */
      setTint: function (hex, amount) {
        hemi.color.copy(base.hemiSky);
        if (hex != null && amount > 0) hemi.color.lerp(tint.set(hex), U.clamp01(amount));
        Lab.loop.wake();
      },
      dispose: function () { /* geometry/materials are freed by P.disposeTree; shared caches stay by design */ }
    };
    return env;
  }

  Lab.env = { build: build, TABLE: TABLE };
})(window.Lab);
