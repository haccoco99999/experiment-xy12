/* Lab.models – lab tools: watering can, gravel pot, NPK fertiliser bag, black light-blocking bin, and the
   sealed clear bin. Everything is built from simple shapes; 1 unit = 10 cm. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, C = M.C;
  var Mo = Lab.models;

  function shadowed(m) { m.castShadow = true; m.receiveShadow = true; return m; }

  /* ---------- watering can (spout points to +X) ---------- */
  Mo.wateringCan = function () {
    var g = new T.Group(); g.name = 'wateringCan';
    var pl = M.std(C.plasticBlue, { roughness: 0.3 }), dk = M.std(0x1c5aa3, { roughness: 0.4, side: T.DoubleSide });
    var body = shadowed(new T.Mesh(P.lathe([[0, 0], [0.62, 0], [0.69, 0.07], [0.73, 0.6], [0.69, 1.06], [0.65, 1.11], [0.58, 1.11], [0.58, 1.02]], 44), pl));
    body.material.side = T.DoubleSide; g.add(body);
    var top = new T.Mesh(new T.CircleGeometry(0.58, 32), dk); top.rotation.x = -Math.PI / 2; top.position.y = 1.02; g.add(top);
    var band = new T.Mesh(new T.TorusGeometry(0.715, 0.035, 8, 40), M.std(0x9fd0ff, { roughness: 0.4 })); band.rotation.x = Math.PI / 2; band.position.y = 0.55; g.add(band);
    // spout
    var pts = new T.CatmullRomCurve3([new T.Vector3(0.55, 0.26, 0), new T.Vector3(1.0, 0.44, 0), new T.Vector3(1.45, 0.86, 0), new T.Vector3(1.86, 1.2, 0)]).getPoints(12);
    var spout = new P.TubeGeo(12, 12); spout.update(pts, function (t) { return 0.135 - 0.05 * t; });
    g.add(shadowed(new T.Mesh(spout.geometry, pl)));
    var rose = shadowed(new T.Mesh(new T.CylinderGeometry(0.2, 0.1, 0.17, 20), M.std(0x2f86de, { roughness: 0.35 })));
    rose.position.set(1.94, 1.27, 0); rose.rotation.z = 0.69 - Math.PI / 2; g.add(rose);
    var holes = new T.Mesh(new T.CircleGeometry(0.16, 20), M.std(0x0f2b52, { roughness: 0.6 })); holes.position.set(2.02, 1.34, 0); holes.rotation.y = Math.PI / 2; holes.rotation.z = 0; g.add(holes);
    // handle
    var handle = shadowed(new T.Mesh(new T.TorusGeometry(0.5, 0.06, 10, 30, Math.PI * 1.02), pl));
    handle.rotation.z = Math.PI / 2 - 0.05; handle.position.set(-0.58, 0.6, 0); handle.scale.set(0.9, 1, 1); g.add(handle);
    var tip = new T.Object3D(); tip.position.set(2.05, 1.34, 0); g.add(tip); g.userData.tip = tip;
    return g;
  };

  /* ---------- pebbles ---------- */
  function pebbles(n, seed, place, colors) {
    var R = U.rng(seed), im = new T.InstancedMesh(new T.SphereGeometry(1, 9, 7), M.std(0xffffff, { roughness: 0.75 }), n);
    var m = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), p = new T.Vector3(), s = new T.Vector3(), c = new T.Color();
    for (var i = 0; i < n; i++) {
      place(R, p, s); e.set(R() * 3, R() * 3, R() * 3); q.setFromEuler(e); m.compose(p, q, s); im.setMatrixAt(i, m);
      c.setHex(colors[(R() * colors.length) | 0]).multiplyScalar(0.9 + R() * 0.2); im.setColorAt(i, c);
    }
    im.castShadow = true; im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true;
    return im;
  }

  /* ---------- gravel pot ("chậu đất sỏi rửa sạch") ---------- */
  Mo.gravelPot = function () {
    var g = new T.Group(); g.name = 'gravelPot';
    var mat = M.std(C.terracotta, { map: M.tex.terracotta(), roughness: 0.72, side: T.DoubleSide });
    g.add(shadowed(new T.Mesh(P.lathe([[0, 0], [0.5, 0], [0.63, 0.72], [0.7, 0.72], [0.7, 0.84], [0.58, 0.84], [0.52, 0.12], [0, 0.12]], 44), mat)));
    var peb = pebbles(80, 5, function (R, p, s) {
      var a = R() * 6.283, r = Math.sqrt(R()) * 0.56, k = 0.07 + R() * 0.06;
      p.set(Math.cos(a) * r, 0.7 + (1 - r / 0.62) * 0.2 + R() * 0.05, Math.sin(a) * r); s.set(k * 1.2, k * 0.85, k);
    }, [0xc9c4b8, 0xb1aa9a, 0xd8d0be, 0x9d968a, 0xcdb896]);
    g.add(peb); g.userData.pebbles = peb;
    var mouth = new T.Object3D(); mouth.position.set(0.3, 0.9, 0); g.add(mouth); g.userData.tip = mouth;
    return g;
  };

  /* ---------- NPK fertiliser bag ---------- */
  function npkLabel() {
    var c = document.createElement('canvas'); c.width = 256; c.height = 260; var g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 260);
    g.fillStyle = '#1f9d5a'; g.fillRect(0, 0, 256, 62);
    g.fillStyle = '#fff'; g.font = "800 34px Quicksand, 'Segoe UI', sans-serif"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PHÂN BÓN', 128, 33);
    g.fillStyle = '#1b6b40'; g.font = "800 84px Quicksand, 'Segoe UI', sans-serif"; g.fillText('NPK', 128, 138);
    g.fillStyle = '#e18500'; g.font = "800 34px Quicksand, 'Segoe UI', sans-serif"; g.fillText('N · P · K', 128, 206);
    var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; t.userData = { own: true };
    return t;
  }
  Mo.npkBag = function () {
    var g = new T.Group(); g.name = 'npkBag';
    var body = shadowed(new T.Mesh(P.roundedBox(1.0, 1.38, 0.46, 0.17, 4), M.std(0x2fb36a, { roughness: 0.5 })));
    body.position.y = 0.72; g.add(body);
    var label = new T.Mesh(new T.PlaneGeometry(0.8, 0.81), M.std(0xffffff, { map: npkLabel(), roughness: 0.55 }));
    label.position.set(0, 0.7, 0.238); g.add(label);
    var seal = shadowed(new T.Mesh(P.roundedBox(1.02, 0.14, 0.4, 0.05, 2), M.std(0x1c8a4e, { roughness: 0.6 })));
    seal.position.y = 1.44; g.add(seal);
    for (var i = -3; i <= 3; i++) { var r = new T.Mesh(new T.BoxGeometry(0.03, 0.12, 0.42), M.std(0x167a44, { roughness: 0.6 })); r.position.set(i * 0.14, 1.44, 0); g.add(r); }
    var tip = new T.Object3D(); tip.position.set(-0.05, 1.5, 0); g.add(tip); g.userData.tip = tip;
    return g;
  };

  /* ---------- bins (open at the bottom, stand on the table with their rim at y = 0) ---------- */
  function binProfile(Rb, Rt, H) {
    return [[Rb, 0], [Rb - 0.01, 0.08], [Rt, H - 0.28], [Rt - 0.06, H - 0.1], [Rt - 0.28, H - 0.02], [Rt - 0.7, H], [0, H]];
  }
  Mo.blackBin = function () {
    var g = new T.Group(); g.name = 'blackBin';
    var H = 4.4, Rb = 1.34, Rt = 1.2;
    var mat = M.std(C.black, { roughness: 0.42, side: T.DoubleSide });
    g.add(shadowed(new T.Mesh(P.lathe(binProfile(Rb, Rt, H), 56), mat)));
    var rim = shadowed(new T.Mesh(new T.TorusGeometry(Rb, 0.07, 10, 56), mat)); rim.rotation.x = Math.PI / 2; rim.position.y = 0.06; g.add(rim);
    [1.0, 2.05, 3.1].forEach(function (y) {
      var r = Rb + (Rt - Rb) * (y / H) + 0.012;
      var t = new T.Mesh(new T.TorusGeometry(r, 0.03, 8, 56), M.std(0x2e3138, { roughness: 0.4 })); t.rotation.x = Math.PI / 2; t.position.y = y; g.add(t);
    });
    var knob = shadowed(new T.Mesh(P.roundedBox(0.7, 0.16, 0.32, 0.07, 3), M.std(0x33363d, { roughness: 0.4 }))); knob.position.y = H + 0.05; g.add(knob);
    g.userData.height = H; g.userData.radius = Rb;
    return g;
  };
  Mo.clearBin = function () {
    var g = new T.Group(); g.name = 'clearBin';
    var H = 4.2, Rb = 1.16, Rt = 1.05;
    // glass look: a tinted back shell, a lighter front shell, and two shine streaks
    var back = new T.Mesh(P.lathe(binProfile(Rb, Rt, H), 56), M.clearPlastic({ color: 0x9fcdf0, opacity: 0.2, side: T.BackSide })); back.renderOrder = 3; g.add(back);
    var shell = new T.Mesh(P.lathe(binProfile(Rb, Rt, H), 56), M.clearPlastic({ color: 0xe4f4ff, opacity: 0.16, side: T.FrontSide })); shell.renderOrder = 4; g.add(shell);
    [[0.55, 0.16], [1.05, 0.08]].forEach(function (s) {
      var streak = new T.Mesh(P.lathe([[Rb + 0.012, 0.5], [Rt + 0.012, H - 0.45]], 4, s[0], s[1]),
        new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.32, side: T.DoubleSide, depthWrite: false, fog: false }));
      streak.renderOrder = 6; streak.userData.noPick = true; g.add(streak);
    });
    var mist = new T.Mesh(P.lathe(binProfile(Rb - 0.02, Rt - 0.02, H - 0.02), 56),
      new T.MeshBasicMaterial({ map: M.tex.condensation(), transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide, fog: false }));
    mist.renderOrder = 5; mist.userData.noPick = true; g.add(mist);
    var tape = shadowed(new T.Mesh(P.lathe([[Rb + 0.012, 0], [Rb + 0.012, 0.3], [Rb - 0.03, 0.3], [Rb - 0.03, 0]], 56), M.std(0x8cc8ff, { roughness: 0.55, side: T.DoubleSide })));
    g.add(tape);
    var lidRing = new T.Mesh(new T.TorusGeometry(Rt - 0.3, 0.05, 8, 48), M.std(0xdff3ff, { roughness: 0.3, transparent: true, opacity: 0.6 })); lidRing.rotation.x = Math.PI / 2; lidRing.position.y = H - 0.02; g.add(lidRing);
    g.userData.height = H; g.userData.radius = Rb;
    g.userData.setMist = function (k) { mist.material.opacity = 0.85 * U.clamp01(k); Lab.loop.wake(); };
    // the tray picture needs more contrast than the real thing (clear glass on a white card is hard to see)
    g.userData.thumbBoost = function () { back.material.opacity = 0.5; shell.material.opacity = 0.32; mist.material.opacity = 0.7; };
    return g;
  };
})(window.Lab);
