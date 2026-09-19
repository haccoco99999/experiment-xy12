/* Lab.stage – the one WebGL canvas used by every experiment.
   Owns: renderer, current scene, camera rig (named framing + smooth moves), keeping the 3D picture centred
   between the tool tray and the side panel, screen<->world projection, picking, thumbnails and quality. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util;

  var S = Lab.stage = {
    renderer: null, canvas: null, container: null, scene: null, camera: null, envTex: null,
    size: { w: 1, h: 1 }, insets: { l: 0, t: 0, r: 0, b: 0 },
    quality: 'high', ok: false,
    rig: { tx: 0, ty: 1, tz: 0, dist: 12, yaw: 0, pitch: 0.4, fov: 30 },
    fps: 0, _labelsDirty: true
  };
  var ray = new T.Raycaster(), ndc = new T.Vector2(), tmpV = new T.Vector3(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0);
  var pickHandler = null;

  /* ---------- support check ---------- */
  S.supported = function () {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGL2RenderingContext && c.getContext('webgl2')) || !!c.getContext('webgl');
    } catch (e) { return false; }
  };

  /* ---------- setup ---------- */
  S.init = function (container) {
    if (S.ok) return true;
    S.container = container;
    try {
      S.canvas = document.createElement('canvas');
      S.canvas.className = 'stage-canvas';
      container.appendChild(S.canvas);
      S.renderer = new T.WebGLRenderer({ canvas: S.canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { console.error(e); return false; }
    var r = S.renderer;
    r.outputColorSpace = T.SRGBColorSpace;
    r.toneMapping = T.NeutralToneMapping;
    r.toneMappingExposure = 1.0;
    r.shadowMap.enabled = true;
    r.shadowMap.type = T.PCFShadowMap;
    r.setClearColor(0x000000, 0);

    S.camera = new T.PerspectiveCamera(S.rig.fov, 1, 0.1, 400);
    buildEnvMap();

    S.canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      if (Lab.ui && Lab.ui.toast) Lab.ui.toast('Màn hình 3D vừa tạm dừng. Hãy bấm LÀM LẠI THÍ NGHIỆM để tiếp tục.', { type: 'warn' });
    });
    if (window.ResizeObserver) new ResizeObserver(function () { S.resize(); }).observe(container);
    window.addEventListener('resize', S.resize);

    Lab.loop.render = S.render;
    Lab.loop.onSlow = function () { if (S.quality === 'high') { S.setQuality('light'); } };

    S.canvas.addEventListener('pointerup', onCanvasPointerUp);
    S.canvas.addEventListener('pointerdown', function (e) { S._down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    S.ok = true;
    S.resize();
    return true;
  };

  /* soft studio-like environment so shiny things (plastic, glass, pots) pick up gentle reflections */
  function buildEnvMap() {
    var env = new T.Scene();
    var sky = new T.Mesh(new T.SphereGeometry(20, 24, 12), new T.MeshBasicMaterial({ color: 0xcfe8ff, side: T.BackSide }));
    env.add(sky);
    var ground = new T.Mesh(new T.CircleGeometry(20, 24), new T.MeshBasicMaterial({ color: 0xb9a98a, side: T.DoubleSide }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -3; env.add(ground);
    var lamp = new T.Mesh(new T.BoxGeometry(9, 0.3, 9), new T.MeshBasicMaterial({ color: 0xfff6e0 }));
    lamp.position.set(4, 9, 5); env.add(lamp);
    var lamp2 = new T.Mesh(new T.BoxGeometry(3, 5, 0.3), new T.MeshBasicMaterial({ color: 0xffffff }));
    lamp2.position.set(-8, 3, 4); env.add(lamp2);
    var pm = new T.PMREMGenerator(S.renderer);
    S.envTex = pm.fromScene(env, 0.03).texture;
    pm.dispose();
    env.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  }

  /* ---------- scenes ---------- */
  S.newScene = function () {
    S.disposeScene();
    var sc = new T.Scene();
    sc.environment = S.envTex;
    sc.environmentIntensity = 0.55;
    S.scene = sc;
    S.applyRig();
    return sc;
  };
  S.disposeScene = function () {
    if (S.scene) {
      Lab.prim.disposeTree(S.scene);
      // lights are children of the scene; their targets too – detach so nothing keeps them alive
      S.scene.traverse(function (o) { if (o.isLight && o.shadow && o.shadow.map) { o.shadow.map.dispose(); o.shadow.map = null; } });
      S.scene.clear(); S.scene = null;
    }
    if (S.renderer) S.renderer.renderLists.dispose();
  };

  /* ---------- size, quality ---------- */
  S.resize = function () {
    if (!S.ok) return;
    var rc = S.container.getBoundingClientRect();
    var w = Math.max(2, Math.round(rc.width)), h = Math.max(2, Math.round(rc.height));
    S.size.w = w; S.size.h = h;
    S.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, S.quality === 'high' ? 1.75 : 1));
    S.renderer.setSize(w, h, false);
    S.canvas.style.width = '100%'; S.canvas.style.height = '100%';
    S.camera.aspect = w / h;
    S.applyRig();
    S.refit();                       // the window changed size → frame the scene again for the new size
    Lab.loop.wake();
  };
  S.setInsets = function (l, t, r, b) {
    S.insets = { l: l | 0, t: t | 0, r: r | 0, b: b | 0 };
    S.applyRig();
    Lab.loop.wake();
  };
  S.setQuality = function (q) {
    if (S.quality === q) return;
    S.quality = q;
    S.renderer.shadowMap.enabled = q === 'high';
    if (S.scene) S.scene.traverse(function (o) { if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { m.needsUpdate = true; }); } });
    S.resize();
    if (Lab.ui && Lab.ui.toast && q === 'light') Lab.ui.toast('Đã chuyển sang chế độ nhẹ để máy chạy mượt hơn.', { type: 'info', emoji: '⚡' });
  };

  /* ---------- camera rig ---------- */
  S.applyRig = function () {
    if (!S.camera) return;
    var g = S.rig, cam = S.camera;
    var cp = Math.cos(g.pitch);
    cam.position.set(g.tx + g.dist * Math.sin(g.yaw) * cp, g.ty + g.dist * Math.sin(g.pitch), g.tz + g.dist * Math.cos(g.yaw) * cp);
    cam.fov = g.fov;
    cam.lookAt(g.tx, g.ty, g.tz);
    // shift the picture so the world centre sits in the middle of the free area (between tray and side panel)
    var W = S.size.w, H = S.size.h, i = S.insets;
    var dx = (i.l - i.r) / 2, dy = (i.t - i.b) / 2;
    cam.aspect = W / H;
    cam.setViewOffset(W, H, -dx, -dy, W, H);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld(true);
    S._labelsDirty = true;
  };

  /* Where the camera must be so that a world area (w x h, seen at pitch) fits the free part of the screen. */
  S.fit = function (o) {
    var i = S.insets, W = S.size.w, H = S.size.h, fov = o.fov || S.rig.fov;
    var freeW = Math.max(200, W - i.l - i.r), freeH = Math.max(160, H - i.t - i.b), fill = o.fill || 0.9;
    var tanV = Math.tan(fov * Math.PI / 360);
    var dW = o.w * H / (2 * tanV * freeW * fill), dH = o.h * H / (2 * tanV * freeH * fill);
    return { tx: o.cx, ty: o.cy, tz: o.cz || 0, dist: Math.max(dW, dH, 3), yaw: o.yaw || 0, pitch: o.pitch == null ? 0.4 : o.pitch, fov: fov };
  };
  /* shot(spec, ms): spec is either {cx,cy,cz,w,h,pitch,yaw} (auto-fit) or explicit {tx,ty,tz,dist,yaw,pitch} */
  S.shot = function (spec, ms) {
    function targetNow() { return spec.w ? S.fit(spec) : Object.assign({}, S.rig, spec); }
    S._lastSpec = spec;
    if (!ms || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      Object.assign(S.rig, targetNow()); S.applyRig(); Lab.loop.wake(); return Promise.resolve();
    }
    var from = Object.assign({}, S.rig), keys = ['tx', 'ty', 'tz', 'dist', 'yaw', 'pitch', 'fov'];
    return Lab.tween.value(ms / 1000, function (k) {
      var target = targetNow();                                  // recomputed each frame: follows layout changes
      keys.forEach(function (key) { S.rig[key] = from[key] + (target[key] - from[key]) * k; });
      S.applyRig();
    }, { ease: Lab.tween.ease.inOutCubic }).promise;
  };
  /* re-fit the last shot after the layout changed (window resize, panel opened…) */
  S.refit = function () { if (S._lastSpec && S._lastSpec.w) { Object.assign(S.rig, S.fit(S._lastSpec)); S.applyRig(); Lab.loop.wake(); } };

  /* ---------- projection / picking ---------- */
  S.project = function (v3) {
    tmpV.copy(v3).project(S.camera);
    var rc = S.container.getBoundingClientRect();
    return { x: rc.left + (tmpV.x * 0.5 + 0.5) * rc.width, y: rc.top + (-tmpV.y * 0.5 + 0.5) * rc.height, behind: tmpV.z > 1 };
  };
  /* screen rectangle (client px) covering an object or Box3, grown by padPx */
  S.rectOf = function (target, padPx) {
    var box = target.isBox3 ? target : new T.Box3().setFromObject(target);
    var xs = [], ys = [], mn = box.min, mx = box.max, v = new T.Vector3();
    [mn.x, mx.x].forEach(function (x) { [mn.y, mx.y].forEach(function (y) { [mn.z, mx.z].forEach(function (z) {
      var p = S.project(v.set(x, y, z)); xs.push(p.x); ys.push(p.y);
    }); }); });
    var p = padPx || 0, x0 = Math.min.apply(null, xs) - p, x1 = Math.max.apply(null, xs) + p, y0 = Math.min.apply(null, ys) - p, y1 = Math.max.apply(null, ys) + p;
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  };
  S.rayAt = function (cx, cy) {
    var rc = S.container.getBoundingClientRect();
    ndc.set(((cx - rc.left) / rc.width) * 2 - 1, -((cy - rc.top) / rc.height) * 2 + 1);
    ray.setFromCamera(ndc, S.camera);
    return ray;
  };
  /* world point where the screen point hits the horizontal plane y = h */
  S.groundPoint = function (cx, cy, h, out) {
    plane.constant = -(h || 0);
    var r = S.rayAt(cx, cy);
    return r.ray.intersectPlane(plane, out || new T.Vector3());
  };
  S.pick = function (cx, cy, roots) {
    var r = S.rayAt(cx, cy);
    var hits = r.intersectObjects(roots || (S.scene ? S.scene.children : []), true);
    for (var i = 0; i < hits.length; i++) {
      var o = hits[i].object;
      if (!o.visible || o.userData.noPick) continue;
      while (o) { if (o.userData && o.userData.pick) return { id: o.userData.pick, object: o, point: hits[i].point }; o = o.parent; }
    }
    return null;
  };
  S.onPick = function (fn) { pickHandler = fn; };
  function onCanvasPointerUp(e) {
    var d = S._down; S._down = null;
    if (!d || !pickHandler) return;
    if (Math.abs(e.clientX - d.x) > 8 || Math.abs(e.clientY - d.y) > 8) return; // it was a drag, not a click
    var hit = S.pick(e.clientX, e.clientY);
    if (hit) pickHandler(hit);
  }

  /* ---------- render ---------- */
  S.render = function (dt) {
    if (!S.ok || !S.scene) return;
    S.renderer.render(S.scene, S.camera);
    if (Lab.labels) Lab.labels.update();
    if (Lab.drag && Lab.drag.updateZones) Lab.drag.updateZones();
  };

  /* ---------- thumbnails: render a model into a small image (used for the tray cards) ---------- */
  S.bakeThumb = function (build, o) {
    o = o || {};
    var N = o.size || 220, r = S.renderer;
    var sc = new T.Scene();
    sc.environment = S.envTex; sc.environmentIntensity = 0.7;
    sc.add(new T.HemisphereLight(0xeaf5ff, 0xa08c6a, 1.5));
    var sun = new T.DirectionalLight(0xfff0d6, 2.4); sun.position.set(3, 6, 5); sc.add(sun);
    var fill = new T.DirectionalLight(0xcfe3ff, 0.6); fill.position.set(-4, 2, 3); sc.add(fill);
    var holder = new T.Group(); sc.add(holder);
    var obj = build(holder) || holder;
    if (obj !== holder) holder.add(obj);
    holder.traverse(function (o) { if (o.userData && o.userData.thumbBoost) o.userData.thumbBoost(); });
    holder.updateMatrixWorld(true);
    var box = new T.Box3().setFromObject(holder), size = box.getSize(new T.Vector3()), ctr = box.getCenter(new T.Vector3());
    var pad = o.pad || 0.98, fov = 28, yaw = o.yaw == null ? 0.5 : o.yaw, pitch = o.pitch == null ? 0.32 : o.pitch;
    var radius = Math.max(size.x, size.y * 1.0, size.z) * 0.5 * pad;
    var dist = radius / Math.tan(fov * Math.PI / 360) * 1.05 + size.z * 0.3;
    var cam = new T.PerspectiveCamera(fov, 1, 0.1, 200);
    cam.position.set(ctr.x + dist * Math.sin(yaw) * Math.cos(pitch), ctr.y + dist * Math.sin(pitch), ctr.z + dist * Math.cos(yaw) * Math.cos(pitch));
    cam.lookAt(ctr);
    var oldPR = r.getPixelRatio(), oldSize = r.getSize(new T.Vector2());
    r.setPixelRatio(1); r.setSize(N, N, false);
    r.setClearColor(0x000000, 0); r.clear();
    r.render(sc, cam);
    var c2 = document.createElement('canvas'); c2.width = N; c2.height = N;
    c2.getContext('2d').drawImage(S.canvas, 0, 0, N, N);
    var url = c2.toDataURL('image/png');
    r.setPixelRatio(oldPR); r.setSize(oldSize.x, oldSize.y, false);
    Lab.prim.disposeTree(sc); sc.clear();
    S._labelsDirty = true;
    return url;
  };

  S.stats = function () {
    var i = S.renderer ? S.renderer.info : null;
    return i ? { calls: i.render.calls, triangles: i.render.triangles, geometries: i.memory.geometries, textures: i.memory.textures } : {};
  };
})(window.Lab);
