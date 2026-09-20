/* Lab.fx – small visual effects: pouring (water, granules, pebbles), ring pulses, sparkles,
   drifting snow / heat haze, and confetti. Everything is driven by Lab.tween / Lab.loop so that
   "LÀM LẠI THÍ NGHIỆM" can stop all of it at once. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, M = Lab.mat;
  var sphereGeo = null;
  function sphere() { return sphereGeo || (sphereGeo = new T.SphereGeometry(1, 10, 8)); }

  /* Particles fall from `from` to `to`. o: {color, size, count, duration, spread, opacity, rough, flight, gravityCurve} */
  function pour(scene, o) {
    var R = U.rng((Math.random() * 1e6) | 0), group = new T.Group(), parts = [], i;
    var mat = M.std(o.color, { roughness: o.rough == null ? 0.25 : o.rough, transparent: (o.opacity || 1) < 1, opacity: o.opacity || 1 });
    var emit = o.duration * 0.72, flight = o.flight || 0.42, spread = o.spread == null ? 0.14 : o.spread;
    for (i = 0; i < o.count; i++) {
      var m = new T.Mesh(sphere(), mat); m.visible = false; m.castShadow = false;
      m.scale.setScalar(o.size * (0.65 + R() * 0.7)); group.add(m);
      parts.push({
        m: m, t0: (i / o.count) * emit,
        sx: (R() - 0.5) * spread * 0.4, sz: (R() - 0.5) * spread * 0.4,
        ex: (R() - 0.5) * spread * 2, ez: (R() - 0.5) * spread * 2
      });
    }
    scene.add(group);
    return Lab.tween.value(o.duration, function (k, raw) {
      var t = raw * o.duration;
      parts.forEach(function (p) {
        var u = (t - p.t0) / flight;
        if (u < 0 || u > 1) { p.m.visible = false; return; }
        p.m.visible = true;
        var fall = o.arc ? Math.sin(u * Math.PI * 0.5) : u * u;
        p.m.position.set(o.from.x + p.sx + (o.to.x - o.from.x) * u + p.ex * u, o.from.y + (o.to.y - o.from.y) * fall, o.from.z + p.sz + (o.to.z - o.from.z) * u + p.ez * u);
      });
    }, { ease: Lab.tween.ease.linear }).promise.then(function () { scene.remove(group); mat.dispose(); });
  }

  /* expanding ring on the table (used for "placed correctly") */
  function ringPulse(scene, pos, color, maxR) {
    var mat = new T.MeshBasicMaterial({ color: color || 0x4caf50, transparent: true, opacity: 0.9, depthWrite: false, side: T.DoubleSide, fog: false });
    var m = new T.Mesh(Lab.prim.ring(0.86, 1, 56), mat); m.position.copy(pos); m.position.y += 0.02; m.renderOrder = 3; m.userData.noPick = true;
    scene.add(m);
    return Lab.tween.value(0.75, function (k) {
      var s = (0.35 + 1.05 * k) * (maxR || 1.4); m.scale.set(s, 1, s); mat.opacity = 0.9 * (1 - k);
    }, { ease: Lab.tween.ease.outCubic }).promise.then(function () { scene.remove(m); m.geometry.dispose(); mat.dispose(); });
  }

  /* little stars flying outwards */
  function sparkles(scene, pos, color, n) {
    var R = U.rng((Math.random() * 1e6) | 0), group = new T.Group(), items = [], geo = new T.OctahedronGeometry(1, 0);
    var mat = new T.MeshBasicMaterial({ color: color || 0xffe066, transparent: true, opacity: 1, fog: false });
    for (var i = 0; i < (n || 12); i++) {
      var m = new T.Mesh(geo, mat); m.scale.setScalar(0.05 + R() * 0.07); m.userData.noPick = true; group.add(m);
      var a = R() * 6.283, up = 0.5 + R() * 1.2, sp = 0.5 + R() * 1.1;
      items.push({ m: m, vx: Math.cos(a) * sp, vy: up, vz: Math.sin(a) * sp * 0.6 });
    }
    group.position.copy(pos); scene.add(group);
    return Lab.tween.value(0.9, function (k) {
      items.forEach(function (it) { it.m.position.set(it.vx * k, it.vy * k - 1.3 * k * k, it.vz * k); it.m.rotation.y = k * 8; });
      mat.opacity = 1 - k * k;
    }, { ease: Lab.tween.ease.outQuad }).promise.then(function () { scene.remove(group); geo.dispose(); mat.dispose(); });
  }

  /* drifting snow (cold) or rising haze (hot) inside a box. Returns {stop()} */
  function ambient(scene, kind, box) {
    var R = U.rng(kind === 'snow' ? 3 : 4), group = new T.Group(), parts = [];
    var geo = kind === 'snow' ? new T.SphereGeometry(0.05, 6, 5) : new T.CircleGeometry(0.22, 12);
    var mat = new T.MeshBasicMaterial({ color: kind === 'snow' ? 0xffffff : 0xffa14a, transparent: true, opacity: kind === 'snow' ? 0.9 : 0.16, depthWrite: false, fog: false, side: T.DoubleSide });
    var n = kind === 'snow' ? 70 : 26;
    for (var i = 0; i < n; i++) {
      var m = new T.Mesh(geo, mat); m.userData.noPick = true;
      var p = { m: m, x: box.x0 + R() * (box.x1 - box.x0), z: box.z0 + R() * (box.z1 - box.z0), y: box.y0 + R() * (box.y1 - box.y0), s: 0.25 + R() * 0.6, ph: R() * 6.28 };
      parts.push(p); group.add(m);
    }
    scene.add(group);
    var remove = Lab.loop.add(function (dt, time) {
      parts.forEach(function (p) {
        p.y += (kind === 'snow' ? -1 : 1) * p.s * dt * 0.8;
        if (p.y > box.y1) p.y = box.y0; if (p.y < box.y0) p.y = box.y1;
        p.m.position.set(p.x + Math.sin(time * 0.8 + p.ph) * 0.15, p.y, p.z);
        if (kind === 'heat') { p.m.scale.setScalar(1 + Math.sin(time * 2 + p.ph) * 0.25); p.m.rotation.x = -0.6; }
      });
    }, { ambient: true });
    return { stop: function () { remove(); scene.remove(group); geo.dispose(); mat.dispose(); } };
  }

  /* Little beads travelling again and again along a path (water and minerals up the plant, gases in and out).
     o: {points:[Vector3…] in world space, color, size, count, speed (units per second), spread, opacity, seeThrough (drawn on top of solid things)}
     Returns {setActive(bool), stop()}. It keeps the screen redrawing while it runs, so stop() it when it is not needed. */
  function flow(scene, o) {
    var curve = new T.CatmullRomCurve3(o.points, false, 'centripetal'), len = curve.getLength() || 1;
    var n = o.count || 14, size = o.size || 0.07, spread = o.spread == null ? 0.08 : o.spread, R = U.rng((Math.random() * 1e6) | 0);
    var geo = new T.SphereGeometry(1, 10, 8);
    var mat = new T.MeshBasicMaterial({ color: o.color || 0x59bff2, transparent: true, opacity: o.opacity == null ? 0.95 : o.opacity, depthTest: !o.seeThrough, depthWrite: false, fog: false });
    var im = new T.InstancedMesh(geo, mat, n); im.frustumCulled = false; im.renderOrder = o.seeThrough ? 12 : 3; im.userData.noPick = true;
    var ph = [], sp = [], off = [], i;
    for (i = 0; i < n; i++) { ph.push(i / n + R() * 0.03); sp.push(0.85 + R() * 0.3); off.push([(R() - 0.5) * spread, (R() - 0.5) * spread, (R() - 0.5) * spread]); }
    scene.add(im);
    var m = new T.Matrix4(), q = new T.Quaternion(), p = new T.Vector3(), s = new T.Vector3(), t0 = R() * 10, active = true, fade = 0;
    var remove = Lab.loop.add(function (dt) {
      t0 += dt; fade += ((active ? 1 : 0) - fade) * Math.min(1, dt * 4);
      for (var j = 0; j < n; j++) {
        var u = (ph[j] + t0 * (o.speed || 1) * sp[j] / len) % 1;
        curve.getPointAt(u, p); p.x += off[j][0]; p.y += off[j][1]; p.z += off[j][2];
        var k = size * fade * Math.min(1, u * 8, (1 - u) * 8) * (0.8 + 0.2 * Math.sin(t0 * 6 + j));
        s.set(k, k, k); m.compose(p, q, s); im.setMatrixAt(j, m);
      }
      im.instanceMatrix.needsUpdate = true;
    });
    return {
      setActive: function (b) { active = !!b; Lab.loop.wake(); },
      stop: function () { remove(); scene.remove(im); geo.dispose(); mat.dispose(); }
    };
  }

  /* celebration confetti on a full-screen 2D canvas (removed by Lab.fx.clearAll or when finished) */
  function confetti(ms) {
    var cv = document.createElement('canvas'); cv.className = 'confetti';
    cv.width = window.innerWidth; cv.height = window.innerHeight; document.body.appendChild(cv);
    var g = cv.getContext('2d'), cols = ['#4caf50', '#00affe', '#e18500', '#ffd24a', '#f06292', '#8e6cf0'], R = U.rng(31), ps = [];
    for (var i = 0; i < 150; i++) ps.push({ x: R() * cv.width, y: -20 - R() * cv.height * 0.6, vx: (R() - 0.5) * 2, vy: 2 + R() * 4, w: 6 + R() * 8, h: 4 + R() * 6, r: R() * 6, vr: (R() - 0.5) * 0.3, c: cols[(R() * cols.length) | 0] });
    return Lab.tween.value((ms || 3200) / 1000, function (k) {
      g.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.globalAlpha = 1 - k * k; g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore();
      });
    }, { ease: Lab.tween.ease.linear }).promise.then(function () { if (cv.parentNode) cv.parentNode.removeChild(cv); });
  }
  function clearAll() { U.qsa('canvas.confetti').forEach(function (c) { c.parentNode.removeChild(c); }); }

  Lab.fx = { pour: pour, ringPulse: ringPulse, sparkles: sparkles, ambient: ambient, flow: flow, confetti: confetti, clearAll: clearAll };
})(window.Lab);
