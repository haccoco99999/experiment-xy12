/* Butterfly models for Experiment 7, built from simple shapes (1 unit = 10 cm, everything is drawn bigger than life).
   • Mo.butterfly(sex): 'male' (orange) or 'female' (blue). Nose points to +x, up is +y, the wings spread along ±z. api.mode = 'fly' | 'perch' | 'tremble' | 'hold',
     api.update(time) moves the wings, api.setWingSize(k) makes them small and crumpled (0.3) or full size (1).
   • Mo.eggs(): a small cluster hanging under a leaf (setDark, setCrack, setHatched).
   • Mo.larva(): the caterpillar. Natural length 1 (setSize scales it); pose(time, moving, jk) crawls it or bends it into a J (jk = 1); skin() copies the old skin.
   • Mo.pupa(): the chrysalis hanging from its top. setGlass(k) makes the case see-through and shows four parts inside (wing, eye, leg, proboscis); setLook, setCrack, setEmpty. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ball(r, mat, x, y, z) { var m = new T.Mesh(new T.SphereGeometry(1, 14, 10), mat); m.scale.setScalar(r); m.position.set(x, y, z); return m; }
  function rod(a, b, r, mat) {                                       // a thin cylinder between two points
    var d = b.clone().sub(a), m = new T.Mesh(new T.CylinderGeometry(r, r, d.length(), 6), mat);
    m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); return m;
  }

  /* ---------------------------------------------------------------- wings */
  var WING = {
    fore: function (s) { s.moveTo(0.08, 0); s.bezierCurveTo(0.3, 0.2, 0.44, 0.62, 0.22, 0.88); s.bezierCurveTo(0.02, 0.94, -0.32, 0.68, -0.38, 0.3); s.bezierCurveTo(-0.38, 0.08, -0.18, 0, 0.08, 0); },
    hind: function (s) { s.moveTo(0.02, 0); s.bezierCurveTo(0.0, 0.36, -0.14, 0.62, -0.42, 0.64); s.bezierCurveTo(-0.68, 0.62, -0.68, 0.2, -0.44, 0.02); s.bezierCurveTo(-0.3, -0.03, -0.12, -0.03, 0.02, 0); }
  };
  var LOOK = { male: { a: '#ffc247', b: '#ff7d1a', edge: '#2a1810', dot: '#fff6d8', body: 0x4a3526 }, female: { a: '#cfeeff', b: '#4f9fea', edge: '#1c2d5c', dot: '#ffffff', body: 0x3a3848 } };
  var wingCache = {};
  function wingParts(kind, sex) {                                    // geometry (uv normalised to 0..1) + a painted texture, made once
    var key = kind + sex; if (wingCache[key]) return wingCache[key];
    var shape = new T.Shape(); WING[kind](shape);
    var pts = shape.getPoints(24), box = { x: 1e9, y: 1e9, X: -1e9, Y: -1e9 };
    pts.forEach(function (p) { box.x = Math.min(box.x, p.x); box.y = Math.min(box.y, p.y); box.X = Math.max(box.X, p.x); box.Y = Math.max(box.Y, p.y); });
    var bw = box.X - box.x, bh = box.Y - box.y, geo = new T.ShapeGeometry(shape, 24), pos = geo.attributes.position, uv = geo.attributes.uv;
    for (var i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - box.x) / bw, (pos.getY(i) - box.y) / bh);
    var W = 192, c = document.createElement('canvas'); c.width = c.height = W; var g = c.getContext('2d'), L = LOOK[sex];
    function px(p) { return [(p.x - box.x) / bw * W, (1 - (p.y - box.y) / bh) * W]; }
    var b = px({ x: 0, y: 0 }), R = U.rng(U.hash(key));
    g.beginPath(); pts.forEach(function (p, j) { var q = px(p); if (j) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.closePath(); g.save(); g.clip();
    var gr = g.createRadialGradient(b[0], b[1], 4, b[0], b[1], W * 1.05); gr.addColorStop(0, L.a); gr.addColorStop(1, L.b); g.fillStyle = gr; g.fillRect(0, 0, W, W);
    g.strokeStyle = L.edge; g.globalAlpha = 0.6; g.lineWidth = 3;
    for (var k = 0; k < 8; k++) { var an = -0.15 - k * 0.24 + (kind === 'hind' ? 0.3 : 0); g.beginPath(); g.moveTo(b[0], b[1]); g.lineTo(b[0] + Math.cos(an - 1.1) * W * 1.2, b[1] + Math.sin(an - 1.1) * W * 1.2); g.stroke(); }
    g.globalAlpha = 1; g.lineWidth = 22; g.beginPath(); pts.forEach(function (p, j) { var q = px(p); if (j) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.closePath(); g.stroke();
    g.fillStyle = L.dot; pts.forEach(function (p, j) { if (j % 3 || p.y < 0.2 * bh) return; var q = px(p); g.beginPath(); g.arc(q[0] + (b[0] - q[0]) * 0.1, q[1] + (b[1] - q[1]) * 0.1, 2.6 + R() * 1.6, 0, 6.283); g.fill(); });
    g.restore();
    var tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4; tex.userData = { shared: true };
    return (wingCache[key] = { geo: geo, tex: tex });
  }

  Mo.butterfly = function (sex) {
    var g = new T.Group(); g.name = 'butterfly-' + sex; g.userData.pick = null;
    var L = LOOK[sex], dark = M.std(0x1e1814, { roughness: 0.6 }), fur = M.std(L.body, { roughness: 0.9 });
    var thorax = new T.Mesh(P.ellipsoid(0.17, 0.1, 0.1, 14), fur); thorax.position.set(0.07, 0.03, 0); g.add(thorax);
    var abd = new T.Mesh(P.ellipsoid(sex === 'female' ? 0.4 : 0.36, sex === 'female' ? 0.085 : 0.07, sex === 'female' ? 0.085 : 0.07, 14), fur); abd.position.set(-0.32, 0.0, 0); g.add(abd);
    g.add(ball(0.085, fur, 0.29, 0.04, 0));
    [-1, 1].forEach(function (s) {
      g.add(ball(0.032, M.std(0x0f1420, { roughness: 0.25 }), 0.34, 0.07, s * 0.055));
      var base = V(0.33, 0.1, s * 0.03), tip = V(0.62, 0.36, s * 0.2);                       // antennae with a small club
      g.add(rod(base, tip, 0.008, dark)); g.add(ball(0.026, dark, tip.x, tip.y, tip.z));
      [0.16, 0.06, -0.06].forEach(function (x, i) { var a = V(x, -0.04, s * 0.05), b = V(x + (i - 1) * 0.1, -0.3, s * (0.15 + i * 0.03)); g.add(rod(a, b, 0.009, dark)); });   // legs
    });
    function wing(side) {
      var w = new T.Group(); w.position.set(0.09, 0.09, side * 0.05); if (side < 0) w.scale.z = -1;
      ['fore', 'hind'].forEach(function (kind, i) {
        var p = wingParts(kind, sex), m = new T.Mesh(p.geo, new T.MeshStandardMaterial({ map: p.tex, side: T.DoubleSide, roughness: 0.6, transparent: false }));
        m.rotation.x = Math.PI / 2; m.position.x = i ? -0.12 : 0.02; m.position.y = i ? -0.006 : 0; m.castShadow = true; w.add(m);
      });
      g.add(w); return w;
    }
    var wingR = wing(1), wingL = wing(-1);
    g.traverse(function (o) { o.userData.noPick = true; });
    var api = {
      group: g, sex: sex, mode: 'perch', hold: 0.15, phase: Math.random() * 6.28, size: 1,
      setWingSize: function (k) { api.size = k; wingR.scale.set(k, k, k); wingL.scale.set(k, k, -k); },
      angle: function (time) {
        return api.mode === 'fly' ? 0.65 + 0.6 * Math.sin(time * 22 + api.phase) : api.mode === 'perch' ? 0.85 + 0.4 * Math.sin(time * 1.6 + api.phase)
          : api.mode === 'tremble' ? 0.14 + 0.1 * Math.sin(time * 36 + api.phase) : api.hold;
      },
      update: function (time) { var a = api.angle(time); wingR.rotation.x = -a; wingL.rotation.x = a; }
    };
    api.update(0);
    return api;
  };

  /* ---------------------------------------------------------------- eggs (hang below a surface at y = 0) */
  Mo.eggs = function () {
    var g = new T.Group(); g.name = 'eggs';
    var mat = M.std(0xf6f1dc, { roughness: 0.4 }), geo = new T.SphereGeometry(1, 12, 9), eggs = [], R = U.rng(17);
    [[0, 0], [0.11, 0.02], [-0.11, 0.03], [0.05, 0.11], [-0.06, 0.12], [0.17, -0.09], [-0.17, -0.07], [0.02, -0.12], [0.13, 0.14], [-0.14, 0.15], [0.21, 0.05], [-0.22, 0.02]].forEach(function (p) {
      var m = new T.Mesh(geo, mat); m.scale.set(0.055, 0.062, 0.055); m.position.set(p[0], -0.05, p[1]); m.userData.r = R(); g.add(m); eggs.push(m);
    });
    var pale = new T.Color(0xf6f1dc), dark = new T.Color(0x4d4d55), shell = new T.Color(0xe6e0c8);
    var api = {
      group: g, eggs: eggs,
      setDark: function (k) { mat.color.copy(pale).lerp(dark, cl(k)); Lab.loop.wake(); },
      setCrack: function (k) { eggs.forEach(function (m) { m.rotation.z = Math.sin(m.userData.r * 20) * 0.35 * k; m.scale.set(0.055 * (1 + 0.1 * k), 0.062 * (1 + 0.1 * k), 0.055); }); Lab.loop.wake(); },
      setHatched: function (b) { mat.color.copy(b ? shell : dark); eggs.forEach(function (m) { m.scale.y = b ? 0.03 : 0.062; m.position.y = b ? -0.02 : -0.05; }); Lab.loop.wake(); }
    };
    return api;
  };

  /* ---------------------------------------------------------------- the caterpillar */
  var N_SEG = 12;
  Mo.larva = function () {
    var g = new T.Group(); g.name = 'larva';
    var geo = new T.SphereGeometry(1, 14, 10), segs = [], rad = [], i;
    var bands = [M.std(0xf4f0dc, { roughness: 0.5 }), M.std(0xf2cf3a, { roughness: 0.5 }), M.std(0x25221e, { roughness: 0.5 })], headMat = M.std(0x2a2622, { roughness: 0.45 });
    for (i = 0; i < N_SEG; i++) {
      var r = i === 0 ? 0.095 : 0.088 * (1 - 0.4 * Math.pow(i / (N_SEG - 1), 2.2)), m = new T.Mesh(geo, i === 0 ? headMat : bands[(i - 1) % 3]);
      m.scale.setScalar(r); m.castShadow = true; g.add(m); segs.push(m); rad.push(r);
    }
    [-1, 1].forEach(function (s) { var e = new T.Mesh(geo, M.std(0xffffff, { roughness: 0.2 })); e.scale.setScalar(0.24); e.position.set(0.8, 0.3, s * 0.55); segs[0].add(e); });   // in head-radius units
    var jpos = [];                                                    // the J shape: the tail hangs from the origin, the head curls up (the tail sits at x = -0.5)
    for (i = 0; i < N_SEG; i++) {
      var u = (N_SEG - 1 - i) / (N_SEG - 1), x, y;
      if (u <= 0.65) { x = 0; y = -u; } else { var ph = (u - 0.65) / 0.35 * 1.75; x = 0.2 * (1 - Math.cos(ph)); y = -0.65 - 0.2 * Math.sin(ph); }
      jpos.push(V(x - 0.5, y, 0));
    }
    var api = {
      group: g, size: 1, segs: segs,
      setSize: function (s) { api.size = s; g.scale.setScalar(s); },
      /* moving: crawl along +x with an arching wave; jk: 0 straight … 1 hanging J */
      pose: function (time, moving, jk) {
        for (var i = 0; i < N_SEG; i++) {
          var sx = 0.5 - i / (N_SEG - 1), arch = moving ? 0.05 * Math.max(0, Math.sin(time * 6 - i * 0.8)) : 0, sy = rad[i] + arch;
          var p = segs[i].position; jk = jk || 0;
          p.set(sx + (jpos[i].x - sx) * jk, sy + (jpos[i].y - sy) * jk, 0);
        }
        Lab.loop.wake();
      },
      /* the pale old skin left behind after a moult (a copy of the body as it is now, same place and size) */
      skin: function () {
        var s = new T.Group(), mat = M.std(0xe9e4cf, { roughness: 0.85, transparent: true, opacity: 0.55 });
        segs.forEach(function (m) { var c = new T.Mesh(geo, mat); c.position.copy(m.position); c.scale.copy(m.scale); c.userData.noPick = true; s.add(c); });
        g.updateMatrix(); s.position.copy(g.position); s.quaternion.copy(g.quaternion); s.scale.copy(g.scale); return s;
      }
    };
    api.pose(0, false, 0);
    return api;
  };

  /* ---------------------------------------------------------------- the chrysalis (hangs from the origin) */
  Mo.pupa = function () {
    var g = new T.Group(); g.name = 'pupa';
    var profile = [[0.0, -1.0], [0.05, -0.97], [0.14, -0.86], [0.22, -0.66], [0.25, -0.46], [0.22, -0.28], [0.13, -0.14], [0.06, -0.06], [0.035, 0]];
    var caseMat = M.std(0x86c85c, { roughness: 0.32, transparent: true, opacity: 1 }), shell = new T.Mesh(P.lathe(profile, 28), caseMat); shell.castShadow = true; shell.userData.pick = 'pupa'; g.add(shell);
    var gold = M.std(0xe8c14a, { roughness: 0.25, metalness: 0.6 });
    [[0.2, -0.62, 0.12], [-0.21, -0.56, 0.1], [0.05, -0.42, 0.25], [-0.16, -0.36, 0.17], [0.16, -0.78, 0.11]].forEach(function (p) { var d = ball(0.028, gold, p[0], p[1], p[2]); d.userData.noPick = true; g.add(d); });
    var pad = new T.Mesh(new T.CylinderGeometry(0.16, 0.13, 0.03, 16), M.std(0xf4f1e6, { roughness: 0.9 })); pad.position.y = 0.03; pad.userData.noPick = true; g.add(pad);
    /* four parts inside; each has its own material so it can glow */
    var inner = new T.Group(); inner.visible = false; g.add(inner);
    function part(name, mats, meshes) { meshes.forEach(function (m) { m.userData.noPick = true; inner.add(m); }); return { mat: mats, meshes: meshes }; }
    var mw = M.std(0xff9a2e, { roughness: 0.5 }), me = M.std(0x1d2a52, { roughness: 0.3 }), ml = M.std(0x7a5aa0, { roughness: 0.5 }), mp = M.std(0xe870a0, { roughness: 0.4 });
    var parts = {
      wing: part('wing', mw, [-1, 1].map(function (s) { var w = new T.Mesh(P.ellipsoid(0.085, 0.27, 0.05, 14), mw); w.position.set(s * 0.13, -0.42, 0.03); w.rotation.z = -s * 0.1; return w; })),
      eye: part('eye', me, [-1, 1].map(function (s) { return ball(0.05, me, s * 0.075, -0.78, 0.13); })),
      leg: part('leg', ml, [-1, 1].map(function (s) { return rod(V(s * 0.06, -0.48, 0.19), V(s * 0.09, -0.7, 0.16), 0.014, ml); })),
      proboscis: part('proboscis', mp, [(function () { var t = new T.Mesh(new T.TorusGeometry(0.05, 0.014, 8, 20, Math.PI * 1.6), mp); t.position.set(0, -0.68, 0.2); return t; })()])
    };
    var at = { wing: V(0.13, -0.42, 0.06), eye: V(0.075, -0.78, 0.16), leg: V(0.08, -0.6, 0.19), proboscis: V(0, -0.68, 0.24) };
    var crack = new T.Mesh(new T.BoxGeometry(0.012, 0.5, 0.012), M.std(0x1a1410, { roughness: 0.6 })); crack.position.set(0, -0.5, 0.245); crack.scale.y = 0.001; crack.userData.noPick = true; g.add(crack);
    var jade = new T.Color(0x86c85c), aged = new T.Color(0x6f7a3a), pale = new T.Color(0xe8f0d8);
    var api = {
      group: g, parts: parts, at: at, shell: shell,
      setLook: function (k) { caseMat.color.copy(jade).lerp(aged, cl(k)); Lab.loop.wake(); },
      setGlass: function (k) { caseMat.opacity = 1 - 0.7 * cl(k); caseMat.depthWrite = k < 0.05; inner.visible = k > 0.02; Lab.loop.wake(); },
      setCrack: function (k) { crack.scale.y = Math.max(0.001, k); Lab.loop.wake(); },
      setEmpty: function (b) { caseMat.color.copy(b ? pale : jade); caseMat.opacity = b ? 0.35 : 1; caseMat.depthWrite = !b; inner.visible = false; Lab.loop.wake(); },
      /* the four inner parts glow: name = 'wing' | 'eye' | 'leg' | 'proboscis' or null for none */
      highlight: function (name) {
        Object.keys(parts).forEach(function (n) { var on = n === name; parts[n].mat.emissive.setHex(on ? 0xffe066 : 0x000000); parts[n].mat.emissiveIntensity = on ? 0.9 : 0; parts[n].meshes.forEach(function (m) { m.scale.setScalar(on ? 1.15 : 1); }); });
        Lab.loop.wake();
      },
      world: function (v) { g.updateMatrixWorld(true); return g.localToWorld(v.clone()); }
    };
    return api;
  };
})(window.Lab);
