/* Lab.fx – small visual effects: pouring (water, granules, pebbles), ring pulses, sparkles,
   drifting snow / heat haze, and confetti. Everything is driven by Lab.tween / Lab.loop so that
   "LÀM LẠI THÍ NGHIỆM" can stop all of it at once. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util, M = Lab.mat;
  var shared = {};

  function sharedGeometry(key, make) {
    if (!shared[key]) {
      var geo = make();
      geo.name = 'fx-shared-' + key;
      geo.userData.shared = true;
      shared[key] = geo;
    }
    return shared[key];
  }
  function sphere() { return sharedGeometry('sphere', function () { return new T.SphereGeometry(1, 10, 8); }); }
  function hidden() { return typeof document !== 'undefined' && document.hidden === true; }
  function reducedMotion() { return !!(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function effectCount(n) {
    var factor = reducedMotion() ? 0.55 : 1;
    if (Lab.stage && Lab.stage.quality === 'light') factor *= 0.72;
    return Math.max(1, Math.round(n * factor));
  }
  function remove(mesh, scene) {
    if (mesh && mesh.isInstancedMesh && mesh.dispose) mesh.dispose();
    if (mesh && mesh.parent === scene) scene.remove(mesh);
  }
  function waterColor(color) { return [M.C.water, 0x59bff2, 0x9be2ff].indexOf(color) >= 0; }

  /* Particles fall from `from` to `to`. o: {color, size, count, duration, spread, opacity, rough, flight, gravityCurve} */
  function pour(scene, o) {
    var R = U.rng((Math.random() * 1e6) | 0), parts = [], i;
    var count = effectCount(o.count || 1), duration = o.duration || 1, flight = o.flight || 0.42;
    var spread = o.spread == null ? 0.14 : o.spread, emit = duration * 0.72;
    var opacity = o.opacity == null ? 1 : o.opacity;
    var mat = M.std(o.color, { roughness: o.rough == null ? 0.25 : o.rough, transparent: opacity < 1, opacity: opacity });
    var im = new T.InstancedMesh(sphere(), mat, count);
    im.frustumCulled = false; im.castShadow = false; im.receiveShadow = false; im.userData.noPick = true;
    for (i = 0; i < count; i++) {
      parts.push({
        t0: (i / count) * emit,
        size: o.size * (0.65 + R() * 0.7),
        sx: (R() - 0.5) * spread * 0.4, sz: (R() - 0.5) * spread * 0.4,
        ex: (R() - 0.5) * spread * 2, ez: (R() - 0.5) * spread * 2
      });
    }
    scene.add(im);
    var matrix = new T.Matrix4(), q = new T.Quaternion(), p = new T.Vector3(), s = new T.Vector3();
    return Lab.tween.value(duration, function (k, raw) {
      var t = raw * duration;
      for (var j = 0; j < count; j++) {
        var part = parts[j], u = (t - part.t0) / flight, scale = 0;
        if (u >= 0 && u <= 1) {
          var fall = o.arc ? Math.sin(u * Math.PI * 0.5) : Math.pow(u, o.gravityCurve || 2);
          p.set(o.from.x + part.sx + (o.to.x - o.from.x) * u + part.ex * u,
            o.from.y + (o.to.y - o.from.y) * fall,
            o.from.z + part.sz + (o.to.z - o.from.z) * u + part.ez * u);
          scale = part.size;
        } else p.set(0, 0, 0);
        s.setScalar(scale); matrix.compose(p, q, s); im.setMatrixAt(j, matrix);
      }
      im.instanceMatrix.needsUpdate = true;
    }, { ease: Lab.tween.ease.linear }).promise.then(function () {
      remove(im, scene); mat.dispose();
    });
  }

  /* expanding ring on the table (used for "placed correctly") */
  function ringPulse(scene, pos, color, maxR) {
    var mat = new T.MeshBasicMaterial({ color: color || 0x4caf50, transparent: true, opacity: 0.9, depthWrite: false, side: T.DoubleSide, fog: false });
    var geo = sharedGeometry('ring', function () { return Lab.prim.ring(0.86, 1, 48); });
    var m = new T.Mesh(geo, mat); m.position.copy(pos); m.position.y += 0.02; m.renderOrder = 3; m.userData.noPick = true;
    scene.add(m);
    return Lab.tween.value(0.75, function (k) {
      var scale = (0.35 + 1.05 * k) * (maxR || 1.4); m.scale.set(scale, 1, scale); mat.opacity = 0.9 * (1 - k);
    }, { ease: Lab.tween.ease.outCubic }).promise.then(function () {
      remove(m, scene); mat.dispose();
    });
  }

  /* little stars flying outwards */
  function sparkles(scene, pos, color, n) {
    var R = U.rng((Math.random() * 1e6) | 0), items = [];
    var count = effectCount(n || 12), geo = sharedGeometry('sparkle', function () { return new T.OctahedronGeometry(1, 0); });
    var mat = new T.MeshBasicMaterial({ color: color || 0xffe066, transparent: true, opacity: 1, fog: false });
    for (var i = 0; i < count; i++) {
      var a = R() * 6.283, up = 0.5 + R() * 1.2, speed = 0.5 + R() * 1.1;
      items.push({ size: 0.05 + R() * 0.07, vx: Math.cos(a) * speed, vy: up, vz: Math.sin(a) * speed * 0.6, spin: 5 + R() * 6 });
    }
    var im = new T.InstancedMesh(geo, mat, count); im.frustumCulled = false; im.position.copy(pos); im.userData.noPick = true; scene.add(im);
    var matrix = new T.Matrix4(), q = new T.Quaternion(), p = new T.Vector3(), s = new T.Vector3(), axis = new T.Vector3(0, 1, 0);
    return Lab.tween.value(0.9, function (k) {
      for (var j = 0; j < count; j++) {
        var it = items[j]; p.set(it.vx * k, it.vy * k - 1.3 * k * k, it.vz * k);
        s.setScalar(it.size * (1 - k * 0.25)); q.setFromAxisAngle(axis, k * it.spin);
        matrix.compose(p, q, s); im.setMatrixAt(j, matrix);
      }
      im.instanceMatrix.needsUpdate = true; mat.opacity = 1 - k * k;
    }, { ease: Lab.tween.ease.outQuad }).promise.then(function () {
      remove(im, scene); mat.dispose();
    });
  }

  /* drifting snow (cold) or rising haze (hot) inside a box. Returns {stop()} */
  function ambient(scene, kind, box) {
    var R = U.rng(kind === 'snow' ? 3 : 4), parts = [];
    var n = effectCount(kind === 'snow' ? 70 : 26);
    var geo = kind === 'snow' ? sphere() : sharedGeometry('heatDisc', function () { return new T.CircleGeometry(1, 12); });
    var mat = new T.MeshBasicMaterial({
      color: kind === 'snow' ? 0xffffff : 0xffa14a, transparent: true,
      opacity: kind === 'snow' ? 0.9 : 0.16, depthWrite: false, fog: false, side: T.DoubleSide
    });
    var im = new T.InstancedMesh(geo, mat, n); im.frustumCulled = false; im.userData.noPick = true;
    for (var i = 0; i < n; i++) {
      parts.push({
        x: box.x0 + R() * (box.x1 - box.x0), z: box.z0 + R() * (box.z1 - box.z0),
        y: box.y0 + R() * (box.y1 - box.y0), speed: 0.25 + R() * 0.6, phase: R() * 6.28,
        radius: kind === 'snow' ? 0.038 + R() * 0.018 : 0.18 + R() * 0.08
      });
    }
    scene.add(im);
    var matrix = new T.Matrix4(), q = new T.Quaternion(), heatQ = new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), -0.6);
    var p = new T.Vector3(), s = new T.Vector3(), removeTicker, stopped = false;
    function tick(dt, time, force) {
      if (!force && hidden()) return;
      for (var j = 0; j < n; j++) {
        var part = parts[j];
        part.y += (kind === 'snow' ? -1 : 1) * part.speed * dt * 0.8;
        if (part.y > box.y1) part.y = box.y0; if (part.y < box.y0) part.y = box.y1;
        p.set(part.x + Math.sin(time * 0.8 + part.phase) * 0.15, part.y, part.z);
        var k = part.radius * (kind === 'heat' ? 1 + Math.sin(time * 2 + part.phase) * 0.25 : 1);
        s.setScalar(k); matrix.compose(p, kind === 'heat' ? heatQ : q, s); im.setMatrixAt(j, matrix);
      }
      im.instanceMatrix.needsUpdate = true;
    }
    tick(0, 0, true);
    removeTicker = Lab.loop.add(tick, { ambient: true });
    return {
      stop: function () {
        if (stopped) return; stopped = true; removeTicker();
        remove(im, scene); mat.dispose();
      }
    };
  }

  /* Little beads travelling again and again along a path (water and minerals up the plant, gases in and out).
     o: {points:[Vector3…] in world space, color, size, count, speed (units per second), spread, opacity, seeThrough (drawn on top of solid things)}
     Returns {setActive(bool), stop()}. It keeps the screen redrawing while it runs, so stop() it when it is not needed. */
  function flow(scene, o) {
    var curve = new T.CatmullRomCurve3(o.points, false, 'centripetal'), len = curve.getLength() || 1;
    var n = effectCount(o.count || 14), size = o.size || 0.07, spread = o.spread == null ? 0.08 : o.spread;
    var R = U.rng((Math.random() * 1e6) | 0), color = o.color == null ? M.C.water : o.color;
    var mat = new T.MeshBasicMaterial({
      color: color, map: waterColor(color) ? M.tex.water() : null, transparent: true,
      opacity: o.opacity == null ? 0.95 : o.opacity, depthTest: !o.seeThrough, depthWrite: false, fog: false
    });
    var im = new T.InstancedMesh(sphere(), mat, n); im.frustumCulled = false; im.renderOrder = o.seeThrough ? 12 : 3; im.userData.noPick = true;
    var phases = [], speeds = [], offsets = [], i;
    for (i = 0; i < n; i++) {
      phases.push(i / n + R() * 0.03); speeds.push(0.85 + R() * 0.3);
      offsets.push(new T.Vector3((R() - 0.5) * spread, (R() - 0.5) * spread, (R() - 0.5) * spread));
    }
    scene.add(im);
    var matrix = new T.Matrix4(), q = new T.Quaternion(), p = new T.Vector3(), s = new T.Vector3();
    var elapsed = R() * 10, active = true, fade = 0, removeTicker = null, stopped = false;
    function draw(dt) {
      if (hidden()) return;
      elapsed += dt; fade += ((active ? 1 : 0) - fade) * Math.min(1, dt * 4);
      for (var j = 0; j < n; j++) {
        var u = (phases[j] + elapsed * (o.speed || 1) * speeds[j] / len) % 1;
        curve.getPointAt(u, p); p.add(offsets[j]);
        var k = size * fade * Math.min(1, u * 8, (1 - u) * 8) * (0.8 + 0.2 * Math.sin(elapsed * 6 + j));
        s.setScalar(k); matrix.compose(p, q, s); im.setMatrixAt(j, matrix);
      }
      im.instanceMatrix.needsUpdate = true;
      if (!active && fade < 0.002 && removeTicker) {
        fade = 0; im.visible = false;
        var stop = removeTicker; removeTicker = null;
        Promise.resolve().then(stop);
      }
    }
    function start() { if (!removeTicker && !stopped) removeTicker = Lab.loop.add(draw); }
    start();
    return {
      setActive: function (b) {
        if (stopped) return;
        active = !!b;
        if (active) { im.visible = true; start(); }
        Lab.loop.wake();
      },
      stop: function () {
        if (stopped) return; stopped = true;
        if (removeTicker) { removeTicker(); removeTicker = null; }
        remove(im, scene); mat.dispose();
      }
    };
  }

  /* celebration confetti on a full-screen 2D canvas (removed by Lab.fx.clearAll or when finished) */
  function confetti(ms) {
    var cv = document.createElement('canvas'); cv.className = 'confetti';
    cv.width = window.innerWidth; cv.height = window.innerHeight; document.body.appendChild(cv);
    var g = cv.getContext('2d'), colors = ['#4caf50', '#00affe', '#e18500', '#ffd24a', '#f06292', '#8e6cf0'];
    var R = U.rng(31), particles = [], count = effectCount(150);
    for (var i = 0; i < count; i++) {
      particles.push({
        x: R() * cv.width, y: -20 - R() * cv.height * 0.6, vx: (R() - 0.5) * 120, vy: 100 + R() * 180,
        width: 6 + R() * 8, height: 4 + R() * 6, rotation: R() * 6, spin: (R() - 0.5) * 8,
        gravity: 75 + R() * 65, color: colors[(R() * colors.length) | 0]
      });
    }
    var duration = (ms || 3200) / 1000;
    return Lab.tween.value(duration, function (k, raw) {
      var elapsed = raw * duration;
      g.clearRect(0, 0, cv.width, cv.height);
      particles.forEach(function (p) {
        var x = p.x + p.vx * elapsed, y = p.y + p.vy * elapsed + p.gravity * elapsed * elapsed;
        g.save(); g.translate(x, y); g.rotate(p.rotation + p.spin * elapsed); g.globalAlpha = 1 - k * k;
        g.fillStyle = p.color; g.fillRect(-p.width / 2, -p.height / 2, p.width, p.height); g.restore();
      });
    }, { ease: Lab.tween.ease.linear }).promise.then(function () {
      if (cv.parentNode) cv.parentNode.removeChild(cv);
    });
  }
  function clearAll() { U.qsa('canvas.confetti').forEach(function (c) { if (c.parentNode) c.parentNode.removeChild(c); }); }

  Lab.fx = { pour: pour, ringPulse: ringPulse, sparkles: sparkles, ambient: ambient, flow: flow, confetti: confetti, clearAll: clearAll };
})(window.Lab);
