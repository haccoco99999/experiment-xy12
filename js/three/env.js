/* Lab.env – the garden and the wooden lab table that every experiment stands on.
   Table top surface is at y = 0, centred on x = 0, z = 0; the camera looks at it from +z. 1 unit ≈ 10 cm. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, M = Lab.mat, P = Lab.prim;

  var TABLE = { w: 9.4, d: 4.9, thick: 0.42, height: 6.2 };
  var HAZE = 0xe1f0e4;

  function instanced(geo, mat, n, place) {
    var im = new T.InstancedMesh(geo, mat, n), m = new T.Matrix4(), q = new T.Quaternion(), p = new T.Vector3(), s = new T.Vector3(), col = new T.Color();
    for (var i = 0; i < n; i++) {
      var r = place(i, p, s, col, q);
      m.compose(p, q, s); im.setMatrixAt(i, m);
      if (r !== false && im.setColorAt) im.setColorAt(i, col);
    }
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.castShadow = false; im.receiveShadow = false; im.userData.noPick = true;
    return im;
  }

  function build(scene, opts) {
    opts = opts || {};
    var g = new T.Group(); g.name = 'env'; scene.add(g);
    var groundY = -TABLE.height;

    /* sky + haze */
    scene.background = M.tex.sky();
    scene.backgroundIntensity = 1;
    scene.fog = new T.Fog(HAZE, 34, 96);

    /* lawn */
    var lawn = new T.Mesh(new T.CircleGeometry(120, 64), new T.MeshStandardMaterial({ map: M.tex.grass(), roughness: 1, color: 0xffffff }));
    lawn.rotation.x = -Math.PI / 2; lawn.position.y = groundY; lawn.receiveShadow = true; lawn.userData.noPick = true;
    g.add(lawn);

    /* picket fence */
    var fenceMat = M.std(0xf7f1e3, { roughness: 0.8 });
    var pickets = instanced(new T.BoxGeometry(0.34, 1.7, 0.14), fenceMat, 96, function (i, p, s) {
      p.set(-24 + i * 0.5, groundY + 0.85, -11); s.set(1, 1, 1); return false;
    });
    g.add(pickets);
    [0.55, 1.15].forEach(function (h) {
      var rail = new T.Mesh(new T.BoxGeometry(48, 0.16, 0.12), fenceMat);
      rail.position.set(0, groundY + h, -11.1); rail.userData.noPick = true; g.add(rail);
    });

    /* hedge (a row of leafy blobs) */
    var R = U.rng(5), greens = [0x4f9a3c, 0x5fae45, 0x458a35, 0x6cba4d, 0x3f7f31];
    var hedge = instanced(new T.IcosahedronGeometry(1, 2), M.std(0xffffff, { roughness: 0.95 }), 46, function (i, p, s, col) {
      p.set(-25 + i * 1.12 + R() * 0.4, groundY + 1.6 + R() * 0.5, -14 - R() * 1.2);
      var k = 1.5 + R() * 0.7; s.set(k * 1.25, k, k); col.set(greens[(R() * greens.length) | 0]);
    });
    g.add(hedge);

    /* a few round trees */
    var crowns = [0x58a840, 0x4a9a38, 0x69b84a, 0x3f8a33];
    [[-15, -22, 1.2], [-8, -26, 1.5], [3, -30, 1.7], [12, -24, 1.3], [19, -21, 1.1], [-22, -18, 1.0], [26, -28, 1.6]].forEach(function (t, i) {
      var tree = new T.Group(), k = t[2];
      var trunk = new T.Mesh(new T.CylinderGeometry(0.28 * k, 0.4 * k, 5.2 * k, 10), M.std(0x7a5636, { roughness: 1 }));
      trunk.position.y = 2.6 * k; tree.add(trunk);
      [[0, 6.4, 0, 3.0], [-1.7, 5.4, 0.4, 2.2], [1.8, 5.6, -0.3, 2.3]].forEach(function (c) {
        var cr = new T.Mesh(new T.IcosahedronGeometry(c[3] * k, 2), M.std(crowns[(i + (c[0] > 0 ? 1 : 0)) % crowns.length], { roughness: 0.95 }));
        cr.position.set(c[0] * k, c[1] * k, c[2] * k); tree.add(cr);
      });
      tree.position.set(t[0], groundY, t[1]); tree.traverse(function (o) { o.userData.noPick = true; });
      g.add(tree);
    });

    /* wild flowers scattered on the lawn behind and beside the table */
    var fc = [0xf7a8c4, 0xffe066, 0xffffff, 0xc9a6f5, 0xff9a6b], R2 = U.rng(9);
    g.add(instanced(new T.SphereGeometry(0.13, 8, 6), M.std(0xffffff, { roughness: 0.8 }), 190, function (i, p, s, col) {
      var a = R2() * 6.283, rad = 6 + R2() * 12;
      p.set(Math.cos(a) * rad * 1.5, groundY + 0.13, -4 - Math.abs(Math.sin(a)) * rad * 0.7); s.set(1, 1, 1); col.set(fc[(R2() * fc.length) | 0]);
    }));

    /* the lab table */
    var wood = M.tex.wood();
    var topGeo = P.boxUV(P.roundedBox(TABLE.w, TABLE.thick, TABLE.d, 0.1, 4), TABLE.w, TABLE.thick, TABLE.d);
    var top = new T.Mesh(topGeo, M.std(0xffffff, { map: wood, roughness: 0.72 }));
    top.position.y = -TABLE.thick / 2; top.castShadow = true; top.receiveShadow = true; top.userData.noPick = true; top.name = 'tableTop';
    g.add(top);
    var darkWood = M.std(0xb07a4a, { map: wood, roughness: 0.8 });
    var apron = new T.Mesh(P.boxUV(new T.BoxGeometry(TABLE.w - 0.9, 0.5, TABLE.d - 0.9), 4, 1, 4), darkWood);
    apron.position.y = -TABLE.thick - 0.22; apron.castShadow = true; apron.userData.noPick = true; g.add(apron);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) {
      var leg = new T.Mesh(new T.BoxGeometry(0.55, TABLE.height - TABLE.thick, 0.55), darkWood);
      leg.position.set(c[0] * (TABLE.w / 2 - 0.65), -TABLE.thick - (TABLE.height - TABLE.thick) / 2, c[1] * (TABLE.d / 2 - 0.65));
      leg.castShadow = true; leg.userData.noPick = true; g.add(leg);
    });
    var tableShadow = P.blobShadow(TABLE.w * 0.62, TABLE.d * 0.75, 0.5); tableShadow.position.y = groundY + 0.02; g.add(tableShadow);

    /* lights */
    var hemi = new T.HemisphereLight(0xdff2ff, 0xa08a66, 1.05); scene.add(hemi);
    var sun = new T.DirectionalLight(0xfff0d2, 2.7);
    sun.position.set(6.5, 11, 7.5); sun.target.position.set(0, 0, 0);
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 7, bottom: -7, near: 1, far: 34 });
    sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03;
    scene.add(sun); scene.add(sun.target);
    var fill = new T.DirectionalLight(0xd2e4ff, 0.55); fill.position.set(-7, 4, 6); scene.add(fill);

    var base = { hemi: hemi.intensity, sun: sun.intensity, fill: fill.intensity, env: 0.55, sunColor: sun.color.clone(), hemiSky: hemi.color.clone() };
    var tint = new T.Color();
    var env = {
      group: g, table: TABLE, top: top, sun: sun, hemi: hemi, fill: fill, surfaceY: 0,
      /* 1 = bright day … 0 = night. Also used for the day/night flicker during time-lapse. */
      setDay: function (k) {
        k = U.clamp01(k);
        sun.intensity = base.sun * k; hemi.intensity = base.hemi * (0.28 + 0.72 * k); fill.intensity = base.fill * (0.4 + 0.6 * k);
        scene.environmentIntensity = base.env * (0.25 + 0.75 * k); scene.backgroundIntensity = 0.16 + 0.84 * k;
        scene.fog.color.setHex(HAZE).multiplyScalar(0.18 + 0.82 * k);
        sun.color.copy(base.sunColor).lerp(new T.Color(0xff9a52), (1 - k) * 0.5);
        Lab.loop.wake();
      },
      /* gentle colour cast for very cold / very hot air (amount 0..1) */
      setTint: function (hex, amount) {
        hemi.color.copy(base.hemiSky);
        if (hex != null && amount > 0) hemi.color.lerp(tint.set(hex), amount);
        Lab.loop.wake();
      },
      dispose: function () { /* geometry/materials are freed with the scene */ }
    };
    return env;
  }

  Lab.env = { build: build, TABLE: TABLE };
})(window.Lab);
