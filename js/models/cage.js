/* Lab.models – the chick cage (clear plastic, open top, control panel in the base), food tray, water bowl,
   lamp and lid. Everything is built from simple shapes; 1 unit = 10 cm. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;

  var CAGE = { W: 3.8, D: 2.7, H: 2.6, base: 0.42 };
  CAGE.floorY = CAGE.base + 0.05;                       // top of the wood shavings
  CAGE.topY = CAGE.base + CAGE.H;                       // where the lid sits
  var TRIM = { 1: 0x2fb36a, 2: 0xf29a2e };              // green = cage 1 (control), orange = cage 2 (the student's), like the name cards

  function shadowed(m) { m.castShadow = true; m.receiveShadow = true; return m; }
  function box(w, h, d, mat, x, y, z) { var m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return shadowed(m); }
  function overlay(geo, color, order) {
    var m = new T.Mesh(geo, new T.MeshBasicMaterial({ color: color, transparent: true, opacity: 0, depthWrite: false, fog: false }));
    m.renderOrder = order; m.userData.noPick = true; m.visible = false; return m;
  }

  /* ---------- the cage ---------- */
  Mo.cage = function (n) {
    var g = new T.Group(); g.name = 'cage' + n;
    var W = CAGE.W, D = CAGE.D, H = CAGE.H, B = CAGE.base, post = 0.11;
    var trim = M.std(TRIM[n], { roughness: 0.4 }), white = M.std(0xf4f7f9, { roughness: 0.45 });
    var base = shadowed(new T.Mesh(P.roundedBox(W + 0.24, B, D + 0.24, 0.08, 3), white)); base.position.y = B / 2; g.add(base);
    var bed = new T.Mesh(new T.BoxGeometry(W - 0.06, 0.06, D - 0.06), M.std(0xffffff, { map: M.tex.bedding(), roughness: 1 }));
    bed.position.y = B + 0.02; bed.receiveShadow = true; g.add(bed);

    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) { g.add(box(post, H, post, trim, c[0] * (W / 2 - post / 2), B + H / 2, c[1] * (D / 2 - post / 2))); });
    [-1, 1].forEach(function (s) {
      g.add(box(W, 0.09, 0.1, trim, 0, B + H - 0.045, s * (D / 2 - 0.05)));
      g.add(box(0.1, 0.09, D - 0.2, trim, s * (W / 2 - 0.05), B + H - 0.045, 0));
    });

    /* clear walls: glass has no shadow and does not hide the chick */
    var glassMats = [];
    function glass(w, h, d, x, z) {
      var mat = M.clearPlastic({ opacity: 0.16 }); glassMats.push(mat);
      var m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, B + H / 2, z); m.renderOrder = 4; m.userData.noPick = false; g.add(m);
    }
    glass(W - 0.1, H - 0.1, 0.03, 0, D / 2 - 0.02); glass(W - 0.1, H - 0.1, 0.03, 0, -D / 2 + 0.02);
    glass(0.03, H - 0.1, D - 0.1, W / 2 - 0.02, 0); glass(0.03, H - 0.1, D - 0.1, -W / 2 + 0.02, 0);
    [[-W / 2 + 0.55, 0.16, 0.3], [-W / 2 + 0.85, 0.07, 0.22]].forEach(function (s) {
      var st = new T.Mesh(new T.PlaneGeometry(s[1], H - 0.6), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: s[2], depthWrite: false, fog: false }));
      st.position.set(s[0], B + H / 2, D / 2 + 0.004); st.renderOrder = 6; st.userData.noPick = true; g.add(st);
    });

    /* fogged glass (closed cage), darkness (no lamp) and hot / cold air – all only visible while > 0 */
    var mist = new T.Mesh(new T.BoxGeometry(W - 0.14, H - 0.16, D - 0.14),
      new T.MeshBasicMaterial({ map: M.tex.condensation(), transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide, fog: false }));
    mist.position.y = B + H / 2; mist.renderOrder = 5; mist.userData.noPick = true; mist.visible = false; g.add(mist);
    var tintGeo = new T.BoxGeometry(W - 0.12, H - 0.12, D - 0.12);
    var tint = overlay(tintGeo, 0x8fc4ff, 6), night = overlay(tintGeo, 0x080c2a, 7);
    tint.position.y = night.position.y = B + H / 2; g.add(tint, night);

    /* control panel in the front of the base: an electronic display that shows the temperature */
    var cv = document.createElement('canvas'); cv.width = 256; cv.height = 96;
    var lcdTex = new T.CanvasTexture(cv); lcdTex.colorSpace = T.SRGBColorSpace; lcdTex.userData = { own: true };
    var housing = shadowed(new T.Mesh(P.roundedBox(1.0, 0.34, 0.1, 0.04, 2), M.std(0x2b3038, { roughness: 0.4 })));
    housing.position.set(0, B / 2, D / 2 + 0.16); g.add(housing);
    var lcd = new T.Mesh(new T.PlaneGeometry(0.8, 0.3), new T.MeshBasicMaterial({ map: lcdTex, fog: false }));
    lcd.position.set(0, B / 2, D / 2 + 0.215); lcd.userData.noPick = true; g.add(lcd);
    function setDisplay(text, fixed) {
      var c = cv.getContext('2d');
      c.fillStyle = '#0e2417'; c.fillRect(0, 0, 256, 96);
      c.fillStyle = '#a8ff92'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = "800 62px Quicksand, 'Segoe UI', sans-serif";
      c.fillText(text, 128, 50);
      if (fixed) { c.font = '26px sans-serif'; c.textAlign = 'left'; c.fillText('🔒', 8, 22); }
      lcdTex.needsUpdate = true; Lab.loop.wake();
    }
    setDisplay('--°C', false);

    /* open-top cage: the lid is a separate model */
    g.userData.thumbBoost = function () { glassMats.forEach(function (m) { m.opacity = 0.4; }); };
    function setOverlay(m, hex, a, max) { m.visible = a > 0.001; if (hex != null) m.material.color.setHex(hex); m.material.opacity = max * U.clamp01(a); Lab.loop.wake(); }
    var api = {
      group: g, n: n, dims: CAGE, floorY: CAGE.floorY, topY: CAGE.topY,
      slots: { food: new T.Vector3(-1.05, CAGE.floorY, 0.45), water: new T.Vector3(1.05, CAGE.floorY, 0.45), lamp: new T.Vector3(0, CAGE.floorY, -1.0) },
      /* where a chick may walk (local x, z), keeping a little away from the glass */
      bounds: { x0: -W / 2 + 0.6, x1: W / 2 - 0.6, z0: -D / 2 + 0.55, z1: D / 2 - 0.4 },
      setMist: function (k) { mist.visible = k > 0.001; mist.material.opacity = 0.8 * U.clamp01(k); Lab.loop.wake(); },
      setNight: function (k) { setOverlay(night, null, k, 0.46); },
      setTint: function (hex, k) { setOverlay(tint, hex, k, 0.24); },
      setDisplay: setDisplay,
      /* the frame glows softly for a moment (md section 13: "chuồng sáng nhẹ") */
      flash: function () {
        trim.emissive.setHex(TRIM[n]);
        Lab.tween.value(0.9, function (k) { trim.emissiveIntensity = 0.9 * Math.sin(Math.PI * k); }, { ease: Lab.tween.ease.linear });
      },
      zoneBox: function () {
        var p = g.position; return new T.Box3(new T.Vector3(p.x - W / 2 - 0.2, 0, p.z - D / 2 - 0.2), new T.Vector3(p.x + W / 2 + 0.2, CAGE.topY + 0.6, p.z + D / 2 + 0.3));
      }
    };
    return api;
  };

  /* ---------- food tray (origin: centre of the bottom) ---------- */
  Mo.foodTray = function () {
    var g = new T.Group(); g.name = 'foodTray';
    var mat = M.std(0x3d8fe0, { roughness: 0.4 });
    var tray = shadowed(new T.Mesh(P.roundedBox(1.05, 0.16, 0.62, 0.06, 3), mat)); tray.position.y = 0.08; g.add(tray);
    var R = U.rng(17), n = 90, cols = [0xe0b04a, 0xc88a2e, 0xf0cf7a, 0xd9a441];
    var im = new T.InstancedMesh(new T.SphereGeometry(1, 7, 6), M.std(0xffffff, { roughness: 0.8 }), n);
    var m = new T.Matrix4(), q = new T.Quaternion(), p = new T.Vector3(), s = new T.Vector3(), c = new T.Color();
    for (var i = 0; i < n; i++) {
      var a = R() * 6.283, r = Math.sqrt(R()), k = 0.03 + R() * 0.02;
      p.set(Math.cos(a) * r * 0.42, 0.17 + (1 - r) * 0.06 + R() * 0.02, Math.sin(a) * r * 0.2); s.set(k * 1.3, k, k); m.compose(p, q, s); im.setMatrixAt(i, m);
      c.setHex(cols[(R() * cols.length) | 0]); im.setColorAt(i, c);
    }
    im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; im.castShadow = true; g.add(im);
    var rim = new T.Mesh(P.roundedBox(1.09, 0.03, 0.66, 0.012, 2), M.std(0x2a72c4, { roughness: 0.4 })); rim.position.y = 0.165; g.add(rim);
    g.userData.mouth = new T.Vector3(0, 0.2, 0.05);
    return g;
  };

  /* ---------- water bowl ---------- */
  Mo.waterBowl = function () {
    var g = new T.Group(); g.name = 'waterBowl';
    g.add(shadowed(new T.Mesh(P.lathe([[0, 0], [0.26, 0], [0.34, 0.14], [0.37, 0.17], [0.33, 0.18], [0.3, 0.14], [0, 0.04]], 40),
      M.std(0x59bff2, { roughness: 0.3, side: T.DoubleSide }))));
    var water = new T.Mesh(new T.CircleGeometry(0.315, 32), M.std(0x9be2ff, { roughness: 0.05, transparent: true, opacity: 0.88 }));
    water.rotation.x = -Math.PI / 2; water.position.y = 0.135; g.add(water);
    g.userData.mouth = new T.Vector3(0, 0.2, 0.02);
    return g;
  };

  /* ---------- lamp (origin: centre of its foot, standing on the floor; the shade points forward, +z) ---------- */
  Mo.lamp = function () {
    var g = new T.Group(); g.name = 'lamp';
    var metal = M.std(0x3a3f47, { roughness: 0.4, metalness: 0.3 }), shade = M.std(0xf2b632, { roughness: 0.35, metalness: 0.15, side: T.DoubleSide });
    var foot = shadowed(new T.Mesh(new T.CylinderGeometry(0.26, 0.3, 0.07, 28), metal)); foot.position.y = 0.035; g.add(foot);
    var pole = shadowed(new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 1.95, 10), metal)); pole.position.y = 1.02; g.add(pole);
    var arm = shadowed(new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.85, 10), metal)); arm.rotation.x = Math.PI / 2; arm.position.set(0, 2.0, 0.42); g.add(arm);
    var elbow = shadowed(new T.Mesh(new T.SphereGeometry(0.06, 12, 10), metal)); elbow.position.set(0, 2.0, 0); g.add(elbow);
    var hood = shadowed(new T.Mesh(P.lathe([[0.02, 0.32], [0.12, 0.29], [0.26, 0.17], [0.36, 0]], 30), shade)); hood.position.set(0, 1.86, 0.85); g.add(hood);
    var bulbMat = M.std(0xfff6d0, { roughness: 0.3, emissive: 0xffd66b, emissiveIntensity: 0 });
    var bulb = new T.Mesh(new T.SphereGeometry(0.13, 16, 12), bulbMat); bulb.position.set(0, 1.9, 0.85); g.add(bulb);
    var halo = new T.Sprite(new T.SpriteMaterial({ map: M.tex.glow(), color: 0xffd66b, transparent: true, opacity: 0, depthWrite: false, fog: false }));
    halo.scale.setScalar(1.7); halo.position.copy(bulb.position); halo.renderOrder = 8; g.add(halo);
    g.userData.bulb = bulb.position.clone();
    g.userData.setOn = function (k) { bulbMat.emissiveIntensity = 2.6 * U.clamp01(k); halo.material.opacity = 0.85 * U.clamp01(k); Lab.loop.wake(); };
    return g;
  };

  /* ---------- lid (origin: the underside of its lip, centred) ---------- */
  Mo.cageLid = function () {
    var g = new T.Group(); g.name = 'cageLid';
    var W = CAGE.W + 0.16, D = CAGE.D + 0.16, trim = M.std(TRIM[2], { roughness: 0.4 });
    [-1, 1].forEach(function (s) {
      g.add(box(W, 0.16, 0.05, trim, 0, 0.08, s * (D / 2 - 0.025)));
      g.add(box(0.05, 0.16, D - 0.1, trim, s * (W / 2 - 0.025), 0.08, 0));
    });
    var panelMat = M.clearPlastic({ opacity: 0.26, color: 0xd9efff });
    var panel = new T.Mesh(new T.BoxGeometry(W - 0.08, 0.04, D - 0.08), panelMat); panel.position.y = 0.15; panel.renderOrder = 4; g.add(panel);
    var handle = shadowed(new T.Mesh(P.roundedBox(0.8, 0.13, 0.22, 0.05, 2), trim)); handle.position.y = 0.24; g.add(handle);
    g.userData.pick = 'lid';
    g.userData.height = 0.3; g.userData.seatY = CAGE.topY - 0.09;
    g.userData.thumbBoost = function () { panelMat.opacity = 0.5; };
    return g;
  };

  Mo.CAGE = CAGE;
})(window.Lab);
