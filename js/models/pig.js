/* Pig model for Experiment 8 (the user asked on 2026-11-10 to change the cat into a pig), built from simple shapes (1 unit = 10 cm, drawn much smaller than
   real size so two pigs fit on the table). Mo.pig({sex:'male'|'female'|'kitten', age: months, pose:'stand'|'lie'}): 'kitten' is a piglet (the program keeps the
   old id). The snout points to +x, up is +y, feet on y = 0.
   api.setAge(months) changes the proportions (newborn 0 … 1 year and older = adult): smaller body, bigger head, shorter legs. Piglets are born with open eyes.
   api.update(time) breathes, wags the curly tail and turns the head a little. api.highlight('eyes'|'ears'|'legs'|'body'|null) makes one region glow. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  function ell(rx, ry, rz, mat) { var m = new T.Mesh(P.ellipsoid(rx, ry, rz, 16), mat); m.castShadow = true; return m; }

  /* age (months), overall scale, head, legs, tail, ears; the rows are joined by straight lines */
  var ROWS = [[0, 0.36, 1.4, 0.6, 0.6, 0.8], [0.25, 0.4, 1.35, 0.62, 0.65, 0.85], [0.5, 0.44, 1.3, 0.66, 0.7, 0.9], [1, 0.54, 1.22, 0.75, 0.8, 0.95],
    [2, 0.66, 1.15, 0.82, 0.88, 1], [6, 0.86, 1.04, 0.95, 0.97, 1], [12, 1, 1, 1, 1, 1]];
  function rowAt(a) {
    a = Math.max(0, Math.min(12, a));
    for (var i = 1; i < ROWS.length; i++) if (a <= ROWS[i][0]) { var r0 = ROWS[i - 1], r1 = ROWS[i], k = (a - r0[0]) / (r1[0] - r0[0]); return r0.map(function (v, j) { return v + (r1[j] - v) * k; }); }
    return ROWS[ROWS.length - 1];
  }
  /* skin colour, darker shade, spots: the boar is plain pink, the sow pink with dark patches, the piglet light pink */
  var LOOK = { male: ['#f0a9a2', '#d98a86', 0], female: ['#f3c0ae', '#4a3a3a', 7], kitten: ['#f7bdb8', '#e39b98', 0] };
  var skinCache = {};
  function skinTex(sex) {                                            // soft pink skin with a few bristle strokes, a lighter belly; painted once
    if (skinCache[sex]) return skinCache[sex];
    var W = 256, H = 128, c = document.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d'), R = U.rng(U.hash('pig-' + sex)), L = LOOK[sex];
    g.fillStyle = L[0]; g.fillRect(0, 0, W, H);
    g.strokeStyle = L[1]; g.globalAlpha = 0.18; g.lineWidth = 1;
    for (var i = 0; i < 260; i++) { var x = R() * W, y = R() * H * 0.8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 2 + R() * 3, y + 3 + R() * 3); g.stroke(); }
    g.fillStyle = L[1]; g.globalAlpha = 0.85;
    for (var s = 0; s < L[2]; s++) { var cx = (s + 0.3 + R() * 0.4) / L[2] * W, cy = H * (0.15 + R() * 0.45), rx = 12 + R() * 14, ry = 10 + R() * 12; g.beginPath(); g.ellipse(cx, cy, rx, ry, R() * 3, 0, 6.29); g.fill(); }
    g.globalAlpha = 1; var gr = g.createLinearGradient(0, H * 0.7, 0, H); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,236,232,0.7)'); g.fillStyle = gr; g.fillRect(0, H * 0.7, W, H * 0.3);
    var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; t.userData = { shared: true }; return (skinCache[sex] = t);
  }

  Mo.pig = function (o) {
    o = o || {};
    var sex = o.sex || 'male', pose = o.pose || 'stand', ph = Math.random() * 6.28, g = new T.Group(); g.name = 'pig-' + sex;
    var root = new T.Group(); g.add(root);
    function skin() { return M.std(0xffffff, { map: skinTex(sex), roughness: 0.8 }); }
    var plain = LOOK[sex === 'female' ? 'female' : sex][0];
    var bodyMat = skin(), legMat = M.std(plain, { roughness: 0.8 }), headMat = M.std(plain, { roughness: 0.8 }), earMat = M.std(plain, { roughness: 0.8, side: T.DoubleSide });
    var eyeMat = M.std(0x2a1d1d, { roughness: 0.25 }), snoutMat = M.std(0xe58f94, { roughness: 0.6 }), dark = M.std(0x5a3434, { roughness: 0.6 }), hoof = M.std(0x6b5048, { roughness: 0.7 });

    var bodyG = new T.Group(); root.add(bodyG);                      // a round barrel of a body
    var rear = ell(0.42, 0.38, 0.36, bodyMat); rear.position.set(-0.28, 0, 0); bodyG.add(rear);
    var chest = ell(0.44, 0.39, 0.36, bodyMat); chest.position.set(0.16, 0.01, 0); bodyG.add(chest);

    var headG = new T.Group(); root.add(headG);
    var skull = ell(0.27, 0.25, 0.26, headMat); headG.add(skull);
    var cheek = ell(0.2, 0.17, 0.22, headMat); cheek.position.set(0.14, -0.06, 0); headG.add(cheek);
    var snout = new T.Mesh(new T.CylinderGeometry(0.11, 0.13, 0.16, 18), snoutMat); snout.rotation.z = -Math.PI / 2; snout.position.set(0.32, -0.07, 0); snout.castShadow = true; headG.add(snout);
    [-1, 1].forEach(function (s) { var n = ell(0.012, 0.03, 0.02, dark); n.position.set(0.405, -0.07, s * 0.045); headG.add(n); });
    var ears = [], eyes = [];
    [-1, 1].forEach(function (s) {
      var ear = new T.Mesh(new T.ConeGeometry(0.12, 0.24, 3), earMat); ear.position.set(0.0, 0.25, s * 0.15); ear.rotation.set(s * 0.45, 0, -0.55); ear.scale.set(1, 1, 0.35); ear.castShadow = true; headG.add(ear); ears.push(ear);
      var eye = new T.Mesh(new T.SphereGeometry(0.04, 12, 8), eyeMat); eye.position.set(0.2, 0.08, s * 0.15); headG.add(eye); eyes.push(eye);
      var shine = new T.Mesh(new T.SphereGeometry(0.012, 6, 4), M.std(0xffffff, { roughness: 0.2 })); shine.position.set(0.03, 0.015, 0); eye.add(shine);
    });

    var legs = [];
    [[0.32, 0.18], [0.32, -0.18], [-0.42, 0.18], [-0.42, -0.18]].forEach(function (p) {
      var lg = new T.Group(), cyl = new T.Mesh(new T.CylinderGeometry(0.085, 0.07, 0.32, 10), legMat); cyl.position.y = 0.2; cyl.castShadow = true; lg.add(cyl);
      var foot = new T.Mesh(new T.CylinderGeometry(0.07, 0.075, 0.06, 10), hoof); foot.position.set(0.0, 0.03, 0); lg.add(foot); root.add(lg); legs.push({ g: lg, x: p[0], z: p[1] });
    });

    var tailG = new T.Group(); root.add(tailG);                      // a short curly tail
    var pts = []; for (var i = 0; i <= 16; i++) { var a = i / 16 * Math.PI * 3.2, r = 0.07 * (1 - i / 22); pts.push(V(-0.04 - i * 0.012 - Math.sin(a) * r * 0.2, 0.02 + Math.sin(a) * r + i * 0.006, Math.cos(a) * r - r)); }
    var tube = new P.TubeGeo(16, 6); tube.update(pts, function (t) { return 0.022 - 0.01 * t; });
    var tail = new T.Mesh(tube.geometry, M.std(plain, { roughness: 0.8 })); tail.castShadow = true; tailG.add(tail);

    var api = {
      group: g, age: 12, mats: { body: bodyMat, legs: legMat, ears: earMat, eyes: eyeMat },
      regions: { eyes: eyes, ears: ears, legs: legs.map(function (l) { return l.g; }), body: [rear, chest] },
      setPose: function (p) { pose = p; api.setAge(api.age); },
      setAge: function (a) {
        api.age = a; var r = rowAt(a), S = r[1], H = r[2], Lg = r[3] * (pose === 'lie' ? 0.35 : 1), Tl = r[4], er = r[5], legH = 0.36 * Lg, by = legH + 0.3;
        root.scale.setScalar(S); bodyG.position.y = by; headG.position.set(0.72, by + 0.06, 0); headG.scale.setScalar(H);
        legs.forEach(function (l) { l.g.scale.y = Lg; l.g.position.set(l.x, 0, l.z); });
        tailG.position.set(-0.68, by + 0.12, 0); tailG.scale.setScalar(Tl * 1.4);
        ears.forEach(function (e) { e.scale.set(er, er, 0.35 * er); });
        Lab.loop.wake();
      },
      update: function (t) {
        bodyG.scale.y = 1 + 0.018 * Math.sin(t * 2.2 + ph); tailG.rotation.x = Math.sin(t * 3.1 + ph) * 0.35; headG.rotation.y = Math.sin(t * 0.6 + ph) * 0.12;
        headG.rotation.z = 0.05 * Math.sin(t * 1.3 + ph);
      },
      /* one region glows (a soft yellow); null puts the light out */
      highlight: function (name) {
        ['body', 'legs', 'ears', 'eyes'].forEach(function (n) { var m = api.mats[n], on = n === name; m.emissive.setHex(on ? 0xffd84a : 0x000000); m.emissiveIntensity = on ? 0.75 : 0; });
        Lab.loop.wake();
      },
      /* a soft outline for "this one is chosen" */
      glow: function (on) { [bodyMat, headMat].forEach(function (m) { m.emissive.setHex(on ? 0xffe27a : 0x000000); m.emissiveIntensity = on ? 0.35 : 0; }); Lab.loop.wake(); }
    };
    api.setAge(o.age == null ? 12 : o.age);
    return api;
  };
})(window.Lab);
