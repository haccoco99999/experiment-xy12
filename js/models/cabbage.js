/* Lab.models.cabbagePot – the mustard-greens plant (cây rau cải) in the half-cut pot. It reuses the pot, soil and roots of the
   bean pot (Mo.beanPot) and swaps the bean plant for a leafy one. Leaf, stem and soil can be picked (userData.pick), parts can
   glow, and leaf colour and size follow one "vigor" number (0 = a little pale, 1 = fresh and full). 1 unit = 10 cm.
   Lab.models.clearBox – the transparent box the student can put over the plant. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;

  var STEM_H = 1.3;
  /* [height on the stem 0..1, yaw (rad), elevation above horizontal (rad), size] */
  var LEAF_SPEC = [
    [0.10, 0.2, 0.35, 1.0], [0.12, 2.3, 0.4, 0.96], [0.14, 4.4, 0.3, 1.02],
    [0.36, 1.2, 0.55, 0.92], [0.38, 3.3, 0.6, 0.9], [0.40, 5.3, 0.5, 0.94],
    [0.62, 0.5, 0.85, 0.78], [0.64, 2.7, 0.8, 0.76], [0.66, 4.8, 0.9, 0.74],
    [0.90, 1.6, 1.15, 0.55], [0.92, 4.2, 1.2, 0.52]
  ];
  var PALE = new T.Color(0xb9cf7c), RICH = new T.Color(0x47a23a);

  Mo.cabbagePot = function () {
    var pot = Mo.beanPot(), g = pot.group, top = pot.soilTopY;
    g.remove(pot.plantGroup); P.disposeTree(pot.plantGroup);              // no bean plant: a ghost would be picked
    pot.set({ root: { len: 1, spread: 1.1, thick: 1.25, sparse: 0, wave: 0, color: 'cream' } });
    pot.setSoil('dry', false);
    g.userData.pick = 'soil';                                              // the pot, the soil and the roots

    var foliage = new T.Group(); foliage.position.set(0, top, 0); g.add(foliage);
    var stemMat = M.std(0xa9d47c, { roughness: 0.55 }), petMat = M.std(0xcfe6a3, { roughness: 0.55 });
    var stemGeo = new T.CylinderGeometry(0.075, 0.115, STEM_H, 12); stemGeo.translate(0, STEM_H / 2, 0);
    var stem = new T.Mesh(stemGeo, stemMat); stem.castShadow = true; stem.userData.pick = 'stem'; foliage.add(stem);
    var leafGeo = P.leaf({ length: 1, width: 0.95, su: 8, sv: 14, cup: 0.38, tip: 0.32, shape: 'spoon' });
    var petGeo = new T.CylinderGeometry(0.02, 0.032, 1, 8); petGeo.translate(0, 0.5, 0);
    var leaves = LEAF_SPEC.map(function (d) {
      var yaw = new T.Group(), arm = new T.Group();
      var mat = M.std(0xffffff, { map: M.tex.leaf('cabbage'), color: 0x47a23a, roughness: 0.55, side: T.DoubleSide, emissive: 0x000000 });
      var pet = new T.Mesh(petGeo, petMat); pet.castShadow = true; pet.userData.pick = 'leaf';
      var blade = new T.Mesh(leafGeo, mat); blade.castShadow = true; blade.receiveShadow = true; blade.rotation.y = -Math.PI / 2; blade.userData.pick = 'leaf';
      arm.add(pet, blade); yaw.add(arm); foliage.add(yaw);
      return { yaw: yaw, arm: arm, pet: pet, blade: blade, mat: mat, d: d };
    });

    var vigor = 0.5, time = 0, bump = 1, tmpC = new T.Color();
    function layout() {
      leaves.forEach(function (L, i) {
        var d = L.d, size = d[3] * (0.9 + 0.15 * vigor) * bump, sway = Math.sin(time * 1.1 + i * 1.7) * 0.03;
        var el = d[2] + 0.28 * vigor - 0.14 + sway;                           // tired plants droop a little
        L.yaw.position.y = d[0] * STEM_H; L.yaw.rotation.y = d[1] + Math.sin(time * 0.7 + i) * 0.02;
        L.arm.rotation.z = el - Math.PI / 2;
        var petLen = 0.2 * size + 0.04; L.pet.scale.set(1, petLen, 1); L.blade.position.y = petLen; L.blade.scale.setScalar(1.3 * size);
      });
    }
    function colour() {
      tmpC.copy(PALE).lerp(RICH, vigor);
      leaves.forEach(function (L) { L.mat.color.copy(tmpC).multiplyScalar(0.94 + (L.d[0] * 0.1)); });
      stemMat.color.setHex(0xb9d68a); stemMat.color.lerp(new T.Color(0x8fcf63), vigor);
    }
    var rootBase = pot.rootMat.emissive.getHex(), rootBaseI = pot.rootMat.emissiveIntensity;

    var api = {
      group: g, pot: pot, foliage: foliage,
      setSoil: pot.setSoil, get soilState() { return pot.soilState; },
      setVigor: function (v) { vigor = U.clamp01(v); colour(); layout(); Lab.loop.wake(); },
      get vigor() { return vigor; },
      /* a little growth spurt ("hiệu ứng sinh trưởng nhẹ") */
      pulse: function () { return Lab.tween.value(1.2, function (k) { bump = 1 + 0.07 * Math.sin(Math.PI * k); layout(); }, { ease: Lab.tween.ease.linear }).promise; },
      idle: function (t) { time = t; layout(); },
      /* part: 'leaf' | 'stem' | 'root', k: 0..1 */
      glow: function (part, k) {
        k = U.clamp01(k);
        if (part === 'leaf') leaves.forEach(function (L) { L.mat.emissive.setHex(0x7dff9a); L.mat.emissiveIntensity = 0.55 * k; });
        else if (part === 'stem') { stemMat.emissive.setHex(0xfff2a8); stemMat.emissiveIntensity = 0.7 * k; }
        else if (part === 'root') { pot.rootMat.emissive.setHex(k > 0.001 ? 0xffe07a : rootBase); pot.rootMat.emissiveIntensity = k > 0.001 ? 0.5 + 1.7 * k : rootBaseI; }
        Lab.loop.wake();
      },
      /* world-space boxes for drop zones and the camera */
      foliageBox: function () { foliage.updateMatrixWorld(true); return new T.Box3().setFromObject(foliage); },
      stemBox: function () { stem.updateMatrixWorld(true); return new T.Box3().setFromObject(stem).expandByVector(new T.Vector3(0.25, 0, 0.25)); },
      soilBox: function () { var p = g.position; return new T.Box3(new T.Vector3(p.x - 0.95, 0.06, p.z - 0.6), new T.Vector3(p.x + 0.95, top + 0.3, p.z + 0.6)); },
      /* the whole plant and pot (the "plant" drop zone) */
      wholeBox: function () { g.updateMatrixWorld(true); return new T.Box3().setFromObject(g); },
      leafPoint: function () { return api.foliageBox().getCenter(new T.Vector3()); },
      /* where things travel: soil → root → stem → leaf (world points), `side` moves the path a little so two flows do not overlap */
      soilPath: function (side) {
        var p = g.position, s = side || 0;
        return [new T.Vector3(p.x - 0.4 + s, top + 0.05, p.z + 0.15), new T.Vector3(p.x - 0.22 + s, top - 0.4, p.z + 0.06), new T.Vector3(p.x + s * 0.4, top - 0.05, p.z + 0.05),
          new T.Vector3(p.x + s * 0.5, top + 0.4, p.z + 0.02), new T.Vector3(p.x + s * 0.5, top + STEM_H * 0.62, p.z + 0.02),
          new T.Vector3(p.x + 0.25 + s, top + STEM_H * 0.98, p.z + 0.2), api.leafPoint().add(new T.Vector3(s * 0.6, -0.1, 0.1))];
      },
      rootPoint: function () { return new T.Vector3(g.position.x, top - 0.55, g.position.z + 0.05); }
    };
    api.setVigor(0.55); layout();
    return api;
  };

  /* the transparent box: open at the bottom, stands on the table */
  Mo.clearBox = function () {
    var g = new T.Group(); g.name = 'clearBox';
    var W = 3.6, H = 3.9, D = 3.2, geo = P.roundedBox(W, H, D, 0.18, 3);
    var front = M.clearPlastic({ opacity: 0.2, side: T.FrontSide }), back = M.clearPlastic({ opacity: 0.13, side: T.BackSide, color: 0xbfe3ff });
    var a = new T.Mesh(geo, back), b = new T.Mesh(geo, front); a.renderOrder = 3; b.renderOrder = 4;
    var edges = new T.LineSegments(new T.EdgesGeometry(geo, 30), new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 }));
    [a, b, edges].forEach(function (m) { m.position.y = H / 2; m.userData.noPick = false; g.add(m); });
    g.userData.pick = 'box'; g.userData.height = H; g.userData.size = { w: W, h: H, d: D };
    g.userData.thumbBoost = function () { front.opacity = 0.42; back.opacity = 0.3; };
    return g;
  };
})(window.Lab);
