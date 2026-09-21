/* Cat model for Experiment 8, built from simple shapes (1 unit = 10 cm, drawn about half of real size so two cats fit on the table).
   Mo.cat({sex:'male'|'female'|'kitten', age: months, pose:'stand'|'lie'}): the nose points to +x, up is +y, feet on y = 0.
   api.setAge(months) changes the proportions (newborn 0 … 1 year and older = adult): smaller body, bigger head, shorter legs, small ears, closed eyes for a newborn.
   api.update(time) breathes, sways the tail and turns the head a little. api.highlight('eyes'|'ears'|'legs'|'body'|null) makes one region glow. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  function ell(rx, ry, rz, mat) { var m = new T.Mesh(P.ellipsoid(rx, ry, rz, 16), mat); m.castShadow = true; return m; }

  /* age (months), overall scale, head, legs, tail, ears, eyes open — the rows are joined by straight lines */
  var ROWS = [[0, 0.36, 1.45, 0.45, 0.55, 0.6, 0], [0.25, 0.4, 1.4, 0.5, 0.6, 0.7, 0], [0.5, 0.44, 1.35, 0.55, 0.65, 0.85, 1], [1, 0.54, 1.25, 0.7, 0.75, 1, 1],
    [2, 0.66, 1.2, 0.8, 0.85, 1, 1], [6, 0.86, 1.05, 0.95, 0.97, 1, 1], [12, 1, 1, 1, 1, 1, 1]];
  function rowAt(a) {
    a = Math.max(0, Math.min(12, a));
    for (var i = 1; i < ROWS.length; i++) if (a <= ROWS[i][0]) { var r0 = ROWS[i - 1], r1 = ROWS[i], k = (a - r0[0]) / (r1[0] - r0[0]); return r0.map(function (v, j) { return v + (r1[j] - v) * k; }); }
    return ROWS[ROWS.length - 1];
  }
  var LOOK = { male: ['#e8964a', '#c2621f'], female: ['#a4a9b3', '#6b717d'], kitten: ['#f1b878', '#d68a45'] };
  var furCache = {};
  function furTex(sex) {                                             // stripes across the back, a lighter belly; painted once
    if (furCache[sex]) return furCache[sex];
    var W = 256, H = 128, c = document.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d'), R = U.rng(U.hash(sex)), L = LOOK[sex];
    g.fillStyle = L[0]; g.fillRect(0, 0, W, H); g.strokeStyle = L[1]; g.lineCap = 'round';
    for (var i = 0; i < 15; i++) { var x = (i + 0.5) / 15 * W + (R() - 0.5) * 8; g.globalAlpha = 0.5; g.lineWidth = 6 + R() * 7; g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + (R() - 0.5) * 20, H * 0.4, x + (R() - 0.5) * 14, H * 0.74); g.stroke(); }
    g.globalAlpha = 1; var gr = g.createLinearGradient(0, H * 0.7, 0, H); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,248,235,0.75)'); g.fillStyle = gr; g.fillRect(0, H * 0.7, W, H * 0.3);
    var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; t.userData = { shared: true }; return (furCache[sex] = t);
  }

  Mo.cat = function (o) {
    o = o || {};
    var sex = o.sex || 'male', pose = o.pose || 'stand', ph = Math.random() * 6.28, g = new T.Group(); g.name = 'cat-' + sex;
    var root = new T.Group(); g.add(root);
    function fur() { return M.std(0xffffff, { map: furTex(sex), roughness: 0.92 }); }
    var bodyMat = fur(), legMat = fur(), headMat = fur(), earMat = M.std(LOOK[sex][0], { roughness: 0.9 }), eyeMat = M.std(0xd7e05a, { roughness: 0.25 });
    var pink = M.std(0xf2a3b3, { roughness: 0.6 }), dark = M.std(0x1c1a1a, { roughness: 0.5 }), white = M.std(0xf6f2ea, { roughness: 0.85 });

    var bodyG = new T.Group(); root.add(bodyG);
    var rear = ell(0.44, 0.32, 0.29, bodyMat); rear.position.set(-0.2, 0, 0); bodyG.add(rear);
    var chest = ell(0.42, 0.35, 0.3, bodyMat); chest.position.set(0.24, 0.03, 0); bodyG.add(chest);

    var headG = new T.Group(); root.add(headG);
    var skull = ell(0.28, 0.25, 0.26, headMat); headG.add(skull);
    var snout = ell(0.12, 0.085, 0.12, white); snout.position.set(0.2, -0.07, 0); headG.add(snout);
    var nose = ell(0.035, 0.028, 0.045, pink); nose.position.set(0.31, -0.03, 0); headG.add(nose);
    var ears = [], eyes = [], lids = [];
    [-1, 1].forEach(function (s) {
      var ear = new T.Mesh(new T.ConeGeometry(0.11, 0.26, 4), earMat); ear.position.set(-0.02, 0.27, s * 0.15); ear.rotation.x = s * 0.28; ear.castShadow = true; headG.add(ear); ears.push(ear);
      var inner = new T.Mesh(new T.ConeGeometry(0.06, 0.16, 4), pink); inner.position.set(0.02, -0.02, 0); inner.scale.set(1, 1, 0.6); ear.add(inner);
      var lid = ell(0.05, 0.012, 0.055, dark); lid.position.set(0.2, 0.07, s * 0.13); lid.rotation.y = s * 0.5; headG.add(lid); lids.push(lid);
      var eye = new T.Mesh(new T.SphereGeometry(0.058, 14, 10), eyeMat); eye.position.set(0.2, 0.07, s * 0.13); headG.add(eye); eyes.push(eye);
      var pupil = ell(0.012, 0.045, 0.02, dark); pupil.position.set(0.05, 0, 0); eye.add(pupil);
      for (var w = -1; w <= 1; w++) { var wh = new T.Mesh(new T.CylinderGeometry(0.005, 0.005, 0.3, 4), white); wh.position.set(0.26, -0.06 + w * 0.025, s * 0.1); wh.rotation.set(w * 0.2, s * 0.6, Math.PI / 2 + w * 0.1); headG.add(wh); }
    });

    var legs = [];
    [[0.36, 0.16], [0.36, -0.16], [-0.4, 0.17], [-0.4, -0.17]].forEach(function (p) {
      var lg = new T.Group(), cyl = new T.Mesh(new T.CylinderGeometry(0.075, 0.062, 0.5, 10), legMat); cyl.position.y = 0.25; cyl.castShadow = true; lg.add(cyl);
      var paw = ell(0.1, 0.06, 0.085, white); paw.position.set(0.03, 0.04, 0); lg.add(paw); root.add(lg); legs.push({ g: lg, x: p[0], z: p[1] });
    });

    var tailG = new T.Group(); root.add(tailG);
    var tp = new T.CatmullRomCurve3([V(0, 0, 0), V(-0.35, 0.02, 0), V(-0.66, 0.24, 0), V(-0.78, 0.6, 0)]), tube = new P.TubeGeo(12, 8);
    tube.update(tp.getPoints(12), function (t) { return 0.07 - 0.028 * t; });
    var tail = new T.Mesh(tube.geometry, bodyMat); tail.castShadow = true; tailG.add(tail);
    g.traverse(function (m) { m.userData.noPick = m.userData.noPick || false; });

    var api = {
      group: g, age: 12, mats: { body: bodyMat, legs: legMat, ears: earMat, eyes: eyeMat },
      regions: { eyes: eyes.concat(lids), ears: ears, legs: legs.map(function (l) { return l.g; }), body: [rear, chest] },
      setPose: function (p) { pose = p; api.setAge(api.age); },
      setAge: function (a) {
        api.age = a; var r = rowAt(a), S = r[1], H = r[2], Lg = r[3] * (pose === 'lie' ? 0.45 : 1), Tl = r[4], er = r[5], eo = r[6], legH = 0.5 * Lg, by = legH + 0.13;
        root.scale.setScalar(S); bodyG.position.y = by; headG.position.set(0.72, by + 0.3, 0); headG.scale.setScalar(H);
        legs.forEach(function (l) { l.g.scale.y = Lg; l.g.position.set(l.x, 0, l.z); });
        tailG.position.set(-0.62, by + 0.05, 0); tailG.scale.setScalar(Tl);
        ears.forEach(function (e) { e.scale.setScalar(er); });
        eyes.forEach(function (e) { e.scale.setScalar(Math.max(0.001, eo)); e.visible = eo > 0.02; });
        Lab.loop.wake();
      },
      update: function (t) {
        bodyG.scale.y = 1 + 0.018 * Math.sin(t * 2.2 + ph); tailG.rotation.y = Math.sin(t * 1.4 + ph) * 0.3; tailG.rotation.z = 0.12 * Math.sin(t * 0.9 + ph); headG.rotation.y = Math.sin(t * 0.6 + ph) * 0.14;
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
