/* Tomato models for Experiment 5, built from simple shapes. 1 unit = 10 cm (the flower is drawn about three times bigger than real).
   • Mo.tomatoFlower(): a yellow flower on a short stem. The parts (stamens with anthers and pollen, the pistil with stigma, style, ovary and
     ovules) sit where they sit in a real flower. setCut(k) cuts it lengthwise (one half solid, the other half see-through; it needs
     renderer.localClippingEnabled).
   • Mo.pollenStick(), Mo.pollenTube(curve), Mo.tomatoFruit() (grows, ripens, shows its seeds, can be cut open), Mo.tomatoSeed(). */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;
  var Y0 = 1.4;                                                   // the height of the flower's centre above the table
  var YELLOW = 0xffd21f, BROWN = 0x8a6a2a, GREEN = 0x5fae4a;
  var STAMEN_A = [270, 198, 342, 126, 54];                        // angles (degrees, in the x-z plane) of the five stamens: none hides the style from the front
  var PETAL_A = [90, 18, 162, 306, 234];
  function rad(d) { return d * Math.PI / 180; }
  function glow(m, hex, k) { m.emissive.setHex(hex); m.emissiveIntensity = k; }

  /* ---------------------------------------------------------------- the flower */
  Mo.tomatoFlower = function () {
    var g = new T.Group(); g.name = 'tomatoFlower';
    var planeBack = new T.Plane(new T.Vector3(0, 0, -1), 0), planeFront = new T.Plane(new T.Vector3(0, 0, 1), 0);
    var shells = [], parts = { stamen: [], filament: [], anther: [], pistil: [], stigma: [], style: [], ovary: [], ovule: [] }, dim = [], cutK = 0, focusK = 0;
    var V3 = function (x, y, z) { return new T.Vector3(x, y, z); };
    function ghostOf(mat) { var m = mat.clone(); m.transparent = true; m.opacity = 0; m.depthWrite = false; m.clippingPlanes = [planeFront]; return m; }
    /* a part that is cut: a solid copy (its front half is cut away) and a see-through copy (only the front half is kept) */
    function shell(geo, mat, parent, place) {
      var solid = new T.Mesh(geo, mat), ghost = new T.Mesh(geo, ghostOf(mat)); ghost.visible = false; ghost.userData.noPick = true;
      [solid, ghost].forEach(function (m) { m.castShadow = m === solid; if (place) place(m); parent.add(m); });
      shells.push({ solid: solid, ghost: ghost, mat: mat }); return solid;
    }

    /* stand, stem and leaves */
    var base = new T.Mesh(new T.CylinderGeometry(0.6, 0.66, 0.1, 32), M.std(0xb98a52, { roughness: 0.7 })); base.position.y = 0.05; base.castShadow = true; g.add(base);
    var stemMat = M.std(GREEN, { roughness: 0.6 });
    var stem = new T.Mesh(new T.CylinderGeometry(0.05, 0.07, Y0 - 0.25, 12), stemMat); stem.position.y = 0.1 + (Y0 - 0.25) / 2; stem.castShadow = true; g.add(stem);
    [[-1, 0.55], [1, 0.85]].forEach(function (c) {
      var leaf = new T.Mesh(P.ellipsoid(0.5, 0.02, 0.2, 16), M.std(0x4f9c3c, { roughness: 0.6, side: T.DoubleSide })); leaf.position.set(c[0] * 0.5, c[1], 0); leaf.rotation.z = c[0] * 0.35; leaf.castShadow = true; g.add(leaf);
    });
    var shadow = P.blobShadow(1.8, 1.8, 0.5); shadow.position.set(0, 0.006, 0); g.add(shadow);

    /* calyx: five long green sepals under the petals */
    var sepalMat = M.std(GREEN, { roughness: 0.55 }), sepGeo = new T.ConeGeometry(0.075, 0.85, 8); sepGeo.translate(0, 0.425, 0);
    var up = V3(0, 1, 0), q = new T.Quaternion();
    for (var i = 0; i < 5; i++) {
      var a = rad(PETAL_A[i] + 36), d = V3(Math.cos(a) * Math.sin(1.1), Math.cos(1.1), Math.sin(a) * Math.sin(1.1));
      shell(sepGeo, sepalMat, g, function (m) { m.position.set(Math.cos(a) * 0.2, Y0 - 0.32, Math.sin(a) * 0.2); m.quaternion.setFromUnitVectors(up, d); });
    }
    /* ovary with the ovules inside */
    var ovaryMat = M.std(0x8fcf5a, { roughness: 0.4 }), ovaryGeo = P.ellipsoid(0.4, 0.36, 0.4, 26);
    var ovary = shell(ovaryGeo, ovaryMat, g, function (m) { m.position.set(0, Y0 - 0.02, 0); });
    var ovulePos = [], ovules = [], ovG = P.ellipsoid(0.075, 0.095, 0.075, 14);
    [[25, 0.1, 0.2], [115, 0.1, 0.2], [205, 0.1, 0.2], [295, 0.1, 0.2], [70, -0.12, 0.22], [160, -0.12, 0.22], [250, -0.12, 0.22], [340, -0.12, 0.22]].forEach(function (o) {
      var p = V3(Math.cos(rad(o[0])) * o[2], Y0 - 0.02 + o[1], Math.sin(rad(o[0])) * o[2]), m = M.std(0xf6efc1, { roughness: 0.4, emissive: 0x000000 }), ov = new T.Mesh(ovG, m);
      ov.position.copy(p); ov.visible = false; ov.userData.pick = 'ovule'; g.add(ov); ovulePos.push(p); ovules.push(ov); parts.ovule.push(m);
    });
    parts.ovary.push(ovaryMat);
    /* corolla: a short yellow tube and five petals bent back */
    var tubeMat = M.std(0xe8d640, { roughness: 0.55, side: T.DoubleSide });
    shell(P.lathe([[0.25, Y0 + 0.24], [0.28, Y0 + 0.4], [0.31, Y0 + 0.54]], 28), tubeMat, g);
    var petalMat = M.std(YELLOW, { roughness: 0.55, side: T.DoubleSide }), pg = new T.ShapeGeometry((function () {
      var s = new T.Shape(); s.moveTo(0, 0); s.bezierCurveTo(0.26, 0.15, 0.3, 0.75, 0, 1.3); s.bezierCurveTo(-0.3, 0.75, -0.26, 0.15, 0, 0); return s;
    })(), 12), pp = pg.attributes.position;
    for (i = 0; i < pp.count; i++) pp.setZ(i, -0.2 * pp.getY(i) * pp.getY(i));
    pg.computeVertexNormals();
    var petals = [], m4 = new T.Matrix4();
    PETAL_A.forEach(function (deg) {
      var a = rad(deg), holder = new T.Group(), ux = V3(Math.cos(a), 0, Math.sin(a)), xx = V3(-Math.sin(a), 0, Math.cos(a));
      holder.quaternion.setFromRotationMatrix(m4.makeBasis(xx, ux, V3(0, 1, 0)));
      holder.position.set(Math.cos(a) * 0.3, Y0 + 0.52, Math.sin(a) * 0.3); holder.userData.home = holder.position.clone(); g.add(holder);
      var pivot = new T.Group(); holder.add(pivot);
      var solid = new T.Mesh(pg, petalMat), ghost = new T.Mesh(pg, ghostOf(petalMat)); ghost.visible = false; ghost.userData.noPick = true; solid.castShadow = true;
      pivot.add(solid); pivot.add(ghost); shells.push({ solid: solid, ghost: ghost, mat: petalMat }); petals.push({ holder: holder, pivot: pivot, angle: a });
    });
    /* stamens: filaments and anthers, with pollen grains on the anthers */
    var filMat = M.std(0xf2e58a, { roughness: 0.5 }), antMat = M.std(0xffb400, { roughness: 0.45 }), pollenMat = M.std(0xffe14d, { roughness: 0.4, emissive: 0xffcf00, emissiveIntensity: 0.2 });
    var filG = new T.CylinderGeometry(0.02, 0.02, 0.3, 8), antG = new T.CapsuleGeometry(0.058, 0.5, 4, 10), stamens = [], R = U.rng(11);
    var pollen = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), pollenMat, 90), pm = new T.Matrix4(), pq = new T.Quaternion(), ps = new T.Vector3();
    STAMEN_A.forEach(function (deg, si) {
      var a = rad(deg), cx = Math.cos(a), sz = Math.sin(a);
      var f = new T.Mesh(filG, filMat); f.position.set(cx * 0.22, Y0 + 0.66, sz * 0.22); f.castShadow = true; g.add(f); parts.filament.push(filMat);
      var an = new T.Mesh(antG, antMat); an.position.set(cx * 0.2, Y0 + 1.0, sz * 0.2); an.rotation.set(sz * 0.12, 0, -cx * 0.12); an.castShadow = true; g.add(an); stamens.push({ f: f, an: an });
      for (var k = 0; k < 18; k++) {
        var h = (R() - 0.5) * 0.55, t = R() * Math.PI * 2, s = 0.02 + R() * 0.012;
        var p = V3(cx * 0.2 + Math.cos(t) * 0.062 * (cx * 0.5 + 0.7), Y0 + 1.0 + h, sz * 0.2 + Math.sin(t) * 0.062);
        pm.compose(p, pq, ps.set(s, s, s)); pollen.setMatrixAt(si * 18 + k, pm);
      }
    });
    pollen.instanceMatrix.needsUpdate = true; g.add(pollen); pollen.userData.noPick = true;
    parts.anther.push(antMat, pollenMat); parts.stamen.push(filMat, antMat, pollenMat);
    /* pistil: style and stigma */
    var styleMat = M.std(0xb8dd7a, { roughness: 0.4 }), stigMat = M.std(0xf1f7b8, { roughness: 0.3, emissive: 0xe6ff70, emissiveIntensity: 0.15 });
    var style = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 1.1, 12), styleMat); style.position.set(0, Y0 + 0.85, 0); style.castShadow = true; g.add(style);
    var stigma = new T.Mesh(new T.SphereGeometry(0.1, 16, 12), stigMat); stigma.position.set(0, Y0 + 1.44, 0); stigma.castShadow = true; g.add(stigma);
    parts.style.push(styleMat); parts.stigma.push(stigMat);
    parts.pistil.push(styleMat, stigMat, ovaryMat);
    dim.push(sepalMat, tubeMat, petalMat, filMat, antMat, pollenMat);

    /* pollen lying on the stigma after pollination (also the target of the click that makes it germinate) */
    var onStigma = new T.Group(); onStigma.position.set(0, Y0 + 1.56, 0); onStigma.visible = false; g.add(onStigma);
    var spMat = M.std(0xffe14d, { roughness: 0.4, emissive: 0xffcf00, emissiveIntensity: 0.55 });          // not dimmed with the rest of the flower
    for (i = 0; i < 7; i++) { var gr = new T.Mesh(new T.SphereGeometry(0.048, 10, 8), spMat); gr.position.set((R() - 0.5) * 0.16, (R() - 0.2) * 0.05, (R() - 0.5) * 0.16); onStigma.add(gr); }
    var spHalo = new T.Sprite(new T.SpriteMaterial({ map: M.tex.glow(), color: 0xfff2a0, transparent: true, opacity: 0.6, depthWrite: false, fog: false })); spHalo.scale.setScalar(0.6); spHalo.renderOrder = 9; spHalo.position.y = 0.02; onStigma.add(spHalo);
    var hit = new T.Mesh(new T.SphereGeometry(0.2, 8, 6), new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); onStigma.add(hit); onStigma.userData.pick = 'pollen';

    var api = {
      group: g, Y0: Y0, petals: petals, ovules: ovules, ovulePos: ovulePos, pollenOnStigma: onStigma, parts: parts,
      /* local anchors */
      at: {
        stamen: V3(0.9, Y0 + 0.92, 0.3), filament: V3(0.58, Y0 + 0.48, 0.3), anther: V3(0.66, Y0 + 1.28, 0.3), pistil: V3(-0.62, Y0 + 1.05, 0.3), stigma: V3(-0.34, Y0 + 1.64, 0.3),
        style: V3(-0.32, Y0 + 0.66, 0.3), ovary: V3(-0.66, Y0 - 0.1, 0.3), ovule: V3(0.52, Y0 - 0.1, 0.3),
        stigmaTop: V3(0, Y0 + 1.56, 0), styleBottom: V3(0, Y0 + 0.34, 0), antherTip: V3(0.14, Y0 + 1.32, 0.12)
      },
      world: function (v) { g.updateMatrixWorld(true); return g.localToWorld(v.clone()); },
      /* boxes (world) around the parts, used as drop areas */
      box: function (name) {
        var b = { anther: [-0.34, Y0 + 0.62, -0.34, 0.34, Y0 + 1.34, 0.34], stigma: [-0.17, Y0 + 1.3, -0.17, 0.17, Y0 + 1.62, 0.17], style: [-0.07, Y0 + 0.3, -0.07, 0.07, Y0 + 1.3, 0.07],
          ovary: [-0.42, Y0 - 0.4, -0.42, 0.42, Y0 + 0.36, 0.42], petal: [-1.5, Y0 + 0.1, -1.5, 1.5, Y0 + 0.6, 1.5], flower: [-1.5, 0, -1.5, 1.5, Y0 + 1.65, 1.5] }[name];
        g.updateMatrixWorld(true);
        return new T.Box3(V3(b[0], b[1], b[2]), V3(b[3], b[4], b[5])).applyMatrix4(g.matrixWorld);
      },
      /* cut lengthwise (k = 1) or whole (0) */
      setCut: function (k) {
        cutK = k; var z = g.getWorldPosition(V3(0, 0, 0)).z; planeBack.constant = z; planeFront.constant = -z;
        shells.forEach(function (s) {
          s.solid.material.clippingPlanes = k > 0.001 ? [planeBack] : null; s.solid.material.needsUpdate = true;
          s.ghost.visible = k > 0.001; s.ghost.material.opacity = 0.2 * k * (1 - 0.7 * focusK);
        });
        Lab.loop.wake();
      },
      /* the ovary wall becomes clearer so that the ovules show (k = 1) */
      setOvaryClear: function (k) { ovaryMat.transparent = k > 0.01; ovaryMat.opacity = 1 - 0.7 * k; ovaryMat.depthWrite = k < 0.5; ovaryMat.needsUpdate = true; Lab.loop.wake(); },
      /* the ovary gets bigger after fertilization (k = 0 … 1 → 1 … 1.5 times) */
      swell: function (k) { var s = shells.filter(function (x) { return x.solid === ovary; })[0]; [s.solid, s.ghost].forEach(function (o) { o.scale.setScalar(1 + 0.5 * k); }); Lab.loop.wake(); },
      showOvules: function (b) { ovules.forEach(function (o) { o.visible = !!b; }); Lab.loop.wake(); },
      /* soft glow on a part (name of a group in `parts`); k = 0 removes it */
      highlight: function (name, k) { (parts[name] || []).forEach(function (m) { glow(m, 0xfff2a0, 0.9 * k); }); Lab.loop.wake(); },
      clearHighlights: function () { Object.keys(parts).forEach(function (n) { parts[n].forEach(function (m) { glow(m, m === pollenMat ? 0xffcf00 : m === stigMat ? 0xe6ff70 : 0x000000, m === pollenMat ? 0.2 : m === stigMat ? 0.15 : 0); }); }); },
      /* everything but the pistil fades (k = 1) while we follow the pollen tube */
      focusPistil: function (k) {
        focusK = k;
        dim.forEach(function (m) { m.transparent = k > 0.01; m.opacity = 1 - 0.85 * k; m.depthWrite = k < 0.5; m.needsUpdate = true; });
        pollen.visible = k < 0.5; stamens.forEach(function (s) { s.f.visible = s.an.visible = k < 0.5; });
        api.setCut(cutK);
      },
      /* withering after pollination: the petals droop and turn brown (0..1), then fall to the table (0..1) */
      wilt: function (k) {
        petalMat.color.setHex(YELLOW).lerp(new T.Color(BROWN), k);
        petals.forEach(function (p) { p.pivot.rotation.x = -1.1 * k; p.pivot.scale.setScalar(1 - 0.18 * k); });
        stigMat.color.setHex(0xf1f7b8).lerp(new T.Color(0x9a7b3a), k); antMat.color.setHex(0xffb400).lerp(new T.Color(0x8a5a1a), k);
        Lab.loop.wake();
      },
      dropPetals: function (k) {
        petals.forEach(function (p, i) {
          var h = p.holder.userData.home, e = k * k;
          p.holder.position.set(h.x + Math.cos(p.angle) * 0.7 * e, h.y + (0.4 + i * 0.01 - h.y) * e, h.z + Math.sin(p.angle) * 0.7 * e);
          p.pivot.rotation.x = -1.1 + 1.1 * e;
        });
        Lab.loop.wake();
      },
      /* only the stand, the stem and the fallen petals stay once the fruit takes over */
      keepStand: function () {
        [style, stigma, pollen, onStigma].forEach(function (o) { o.visible = false; });
        stamens.forEach(function (s) { s.f.visible = s.an.visible = false; }); ovules.forEach(function (o) { o.visible = false; });
        shells.forEach(function (s) { if (s.mat !== petalMat) { s.solid.visible = false; s.ghost.visible = false; } });      // sepals, tube and ovary go; the petals stay on the table
        Lab.loop.wake();
      },
      /* a little pollen dust on the anthers (0 = none): used by the pollen grains that fall while the stick touches them */
      pollenDust: function (k) { pollenMat.emissiveIntensity = 0.2 + 0.7 * k; }
    };
    return api;
  };

  /* ---------------------------------------------------------------- the pollen stick (tip at the origin, the stick goes up and to the right) */
  Mo.pollenStick = function () {
    var g = new T.Group(); g.name = 'pollenStick';
    var wood = M.std(0xc8965a, { roughness: 0.6 }), len = 2.2, dir = new T.Vector3(0.55, 0.8, 0.25).normalize();
    var rod = new T.Mesh(new T.CylinderGeometry(0.028, 0.034, len, 10), wood); rod.position.copy(dir).multiplyScalar(len / 2 + 0.05); rod.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir); rod.castShadow = true; g.add(rod);
    var tip = new T.Mesh(new T.SphereGeometry(0.065, 12, 10), M.std(0xfff4dc, { roughness: 0.9 })); g.add(tip);
    var dust = new T.Group(); dust.visible = false; g.add(dust);
    var R = U.rng(5); for (var i = 0; i < 9; i++) { var d = new T.Mesh(new T.SphereGeometry(0.026, 8, 6), M.std(0xffe14d, { emissive: 0xffcf00, emissiveIntensity: 0.4 })); d.position.set((R() - 0.5) * 0.14, (R() - 0.5) * 0.14, (R() - 0.5) * 0.14); dust.add(d); }
    var api = { group: g, dir: dir, setLoaded: function (b) { dust.visible = !!b; Lab.loop.wake(); }, tipWorld: function () { g.updateMatrixWorld(true); return g.localToWorld(new T.Vector3(0, 0, 0)); } };
    return api;
  };

  /* ---------------------------------------------------------------- the pollen tube: it grows along a curve (setProgress) or is rebuilt (setCurve) */
  Mo.pollenTube = function (curve, radius) {
    var g = new T.Group(), SEG = 96, RAD = 8, cur = curve, prog = 0, mesh = null, r = radius || 0.02;
    var mat = new T.MeshBasicMaterial({ color: 0xffe27a, transparent: true, opacity: 0.95, depthTest: false });
    var tip = new T.Mesh(new T.SphereGeometry(r * 2.6, 12, 10), new T.MeshBasicMaterial({ color: 0xfff6b0, depthTest: false })); tip.renderOrder = 21; tip.userData.tip = true; g.add(tip);
    function build() {
      if (mesh) { g.remove(mesh); mesh.geometry.dispose(); }
      mesh = new T.Mesh(new T.TubeGeometry(cur, SEG, r, RAD, false), mat); mesh.renderOrder = 20; mesh.userData.noPick = true; mesh.frustumCulled = false; g.add(mesh); apply();
    }
    function apply() {
      var n = Math.max(0, Math.floor(SEG * prog)); mesh.geometry.setDrawRange(0, n * RAD * 6);
      tip.visible = prog > 0.001; if (prog > 0.001) tip.position.copy(cur.getPointAt(Math.min(1, prog)));
    }
    build();
    return {
      group: g, tip: tip, get progress() { return prog; },
      setProgress: function (t) { prog = Math.max(0, Math.min(1, t)); apply(); Lab.loop.wake(); },
      setCurve: function (c, t) { cur = c; prog = t == null ? 1 : t; build(); Lab.loop.wake(); },
      pointAt: function (t) { return cur.getPointAt(Math.max(0, Math.min(1, t))); },
      dispose: function () { if (mesh) mesh.geometry.dispose(); mat.dispose(); }
    };
  };

  /* ---------------------------------------------------------------- a seed */
  Mo.tomatoSeed = function () {
    var g = new T.Group(), s = new T.Mesh(P.ellipsoid(0.42, 0.55, 0.12, 22), M.std(0xf1dc8a, { roughness: 0.6 })); s.rotation.z = 0.5; s.castShadow = true; g.add(s);
    var hairs = [], R = U.rng(9); for (var i = 0; i < 60; i++) { var a = R() * 6.283, x = Math.cos(a) * 0.42, y = Math.sin(a) * 0.55; hairs.push(x, y, 0, x * 1.18, y * 1.18, (R() - 0.5) * 0.1); }
    var hg = new T.BufferGeometry(); hg.setAttribute('position', new T.Float32BufferAttribute(hairs, 3)); var hl = new T.LineSegments(hg, new T.LineBasicMaterial({ color: 0xfff6d0, transparent: true, opacity: 0.8 })); hl.rotation.z = 0.5; g.add(hl);
    return g;
  };

  /* ---------------------------------------------------------------- the fruit (its own radius is 1 before scaling; setSize(r) scales it) */
  Mo.tomatoFruit = function () {
    var g = new T.Group(); g.name = 'tomatoFruit';
    var whole = new T.Group(); g.add(whole);
    var skin = M.std(0x67b83a, { roughness: 0.3 }), body = new T.Mesh(P.ellipsoid(1, 0.9, 1, 44), skin); body.castShadow = true; whole.add(body);
    var calyxMat = M.std(0x4f9c3c, { roughness: 0.55 }), sg = new T.ConeGeometry(0.11, 0.7, 8); sg.translate(0, 0.35, 0);
    for (var i = 0; i < 5; i++) { var a = i * 1.2566, s = new T.Mesh(sg, calyxMat), d = new T.Vector3(Math.cos(a) * 0.9, -0.42, Math.sin(a) * 0.9).normalize(); s.position.set(Math.cos(a) * 0.12, -0.86, Math.sin(a) * 0.12); s.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d); whole.add(s); }
    /* the ovules that turn into seeds (seen through the skin) */
    var N = 16, seedMat = M.std(0xf5f0d0, { roughness: 0.5 }), seeds = new T.InstancedMesh(new T.SphereGeometry(1, 10, 8), seedMat, N), R = U.rng(21), spots = [];
    for (i = 0; i < N; i++) { var t = i / N * 6.283 * 2, rr = 0.3 + 0.18 * (i % 2), y = ((i % 4) - 1.5) * 0.18; spots.push({ p: new T.Vector3(Math.cos(t) * rr, y, Math.sin(t) * rr), r: R() * 3 }); }
    seeds.visible = false; whole.add(seeds);
    var mm = new T.Matrix4(), qq = new T.Quaternion(), eu = new T.Euler(), sc = new T.Vector3(), colA = new T.Color(0xf5f0d0), colB = new T.Color(0xf0dc88);
    function seedGrow(k) {
      seedMat.color.copy(colA).lerp(colB, k);
      spots.forEach(function (s, j) { eu.set(0, s.r, 0.6 * k); qq.setFromEuler(eu); sc.set(0.075 + 0.02 * k, 0.075 + 0.045 * k, 0.075 - 0.045 * k); mm.compose(s.p, qq, sc); seeds.setMatrixAt(j, mm); });
      seeds.instanceMatrix.needsUpdate = true; Lab.loop.wake();
    }
    seedGrow(0);

    /* the two halves of the ripe fruit: a hemisphere of red skin and a flat face showing the flesh, the jelly and the seeds */
    var cv = document.createElement('canvas'); cv.width = cv.height = 512; var c = cv.getContext('2d');
    c.fillStyle = '#e0503c'; c.fillRect(0, 0, 512, 512); c.fillStyle = '#f08a6c'; c.beginPath(); c.arc(256, 256, 226, 0, 6.283); c.fill();
    c.fillStyle = '#fbe4d0'; c.beginPath(); c.arc(256, 256, 34, 0, 6.283); c.fill();
    for (i = 0; i < 3; i++) { var an = i * 2.094 + 0.5, cx = 256 + Math.cos(an) * 106, cy = 256 + Math.sin(an) * 106, gr = c.createRadialGradient(cx, cy, 8, cx, cy, 78); gr.addColorStop(0, '#f6c85a'); gr.addColorStop(1, '#e79a3a'); c.fillStyle = gr; c.beginPath(); c.ellipse(cx, cy, 82, 66, an, 0, 6.283); c.fill(); }
    var faceTex = new T.CanvasTexture(cv); faceTex.colorSpace = T.SRGBColorSpace || faceTex.colorSpace; faceTex.userData.own = true;     // freed with the fruit
    var skinRed = M.std(0xe0301e, { roughness: 0.3 }), faceMat = M.std(0xffffff, { map: faceTex, roughness: 0.6 });
    function half(mirror) {
      var h = new T.Group(), inner = new T.Group(); h.add(inner);
      var shellMesh = new T.Mesh(new T.SphereGeometry(1, 44, 22, 0, Math.PI * 2, 0, Math.PI / 2), skinRed); shellMesh.rotation.x = -Math.PI / 2; shellMesh.scale.set(1, 1, 0.9); shellMesh.material.side = T.DoubleSide; shellMesh.castShadow = true; inner.add(shellMesh);
      var face = new T.Mesh(new T.CircleGeometry(1, 48), faceMat); face.scale.set(1, 0.9, 1); face.position.z = 0.002; inner.add(face);
      var hs = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), M.std(0xf1dc8a, { roughness: 0.5 }), 27), hr = U.rng(mirror ? 3 : 4);
      for (var j = 0; j < 27; j++) {
        var an2 = (j % 3) * 2.094 + 0.5, ch = Math.floor(j / 3), ax = 256 + Math.cos(an2) * 106, ay = 256 + Math.sin(an2) * 106, ux = (ax - 256) / 256 + Math.cos(hr() * 6.283) * 0.13 * hr(), uy = -(ay - 256) / 256 + Math.sin(hr() * 6.283) * 0.1 * hr();
        eu.set(0, 0, hr() * 3); qq.setFromEuler(eu); mm.compose(new T.Vector3(ux, uy * 0.9, 0.025), qq, sc.set(0.05, 0.065, 0.018)); hs.setMatrixAt(j, mm);
      }
      inner.add(hs); h.scale.x = mirror ? -1 : 1; h.visible = false; return h;
    }
    var halves = [half(false), half(true)]; halves.forEach(function (h) { g.add(h); });
    var api = {
      group: g,
      setSize: function (r) { g.scale.setScalar(r); g.userData.r = r; Lab.loop.wake(); },
      /* 0 green … 0.45 yellow-orange … 1 red */
      ripen: function (k) { var a = new T.Color(0x67b83a), b = new T.Color(0xf1b52c), c2 = new T.Color(0xe0301e); skin.color.copy(k < 0.45 ? a.lerp(b, k / 0.45) : b.lerp(c2, (k - 0.45) / 0.55)); Lab.loop.wake(); },
      glow: function (k) { skin.emissive.setHex(0xffb89a); skin.emissiveIntensity = 0.16 * k; Lab.loop.wake(); },
      setSeeThrough: function (k) { skin.transparent = k > 0.01; skin.opacity = 1 - 0.72 * k; skin.depthWrite = k < 0.5; skin.needsUpdate = true; seeds.visible = k > 0.01; Lab.loop.wake(); },
      seedGrow: seedGrow,
      /* k: 0 whole, 1 cut in half with both cut faces showing */
      cutOpen: function (k) {
        var e = k < 0.35 ? 0 : (k - 0.35) / 0.65, s1 = Math.min(1, k / 0.35), ease = e * e * (3 - 2 * e);
        whole.visible = k <= 0.001; halves.forEach(function (h, i) {
          var sg2 = i === 0 ? -1 : 1; h.visible = k > 0.001;
          h.position.x = sg2 * (0.02 + 0.32 * s1 + 0.95 * ease); h.rotation.y = -sg2 * (Math.PI / 2) * (1 - ease);
        });
        Lab.loop.wake();
      },
      world: function (v) { g.updateMatrixWorld(true); return g.localToWorld(v.clone()); }
    };
    api.ripen(0); api.setSize(1);
    return api;
  };
})(window.Lab);
