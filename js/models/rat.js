/* Lab.models.rat – a friendly white lab rat built from simple shapes. It faces +z; its origin is on the floor between the feet.
   • pose numbers (walk, head, chew) are eased by update(); breathing and the nose twitch run by themselves.
   • setXray(k): 0 = solid fur, 1 = see-through body that shows the lungs, the airway from the nose to the lungs, the stomach and the
     bladder (md sections 16–17). 1 unit = 10 cm. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, P = Lab.prim, U = Lab.util, Mo = Lab.models;
  var FUR = 0xf6f1e7, PINK = 0xf2aeb2;

  Mo.rat = function () {
    var g = new T.Group(); g.name = 'rat';
    var fur = M.std(FUR, { roughness: 0.85 }), belly = M.std(0xfffaf0, { roughness: 0.9 }), pink = M.std(PINK, { roughness: 0.6 });
    function mesh(geo, mat, x, y, z, parent) { var m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; (parent || g).add(m); return m; }

    var bodyG = new T.Group(); g.add(bodyG);                                    // everything that becomes see-through
    var body = mesh(P.ellipsoid(0.42, 0.4, 1.0, 28), fur, 0, 0.52, -0.05, bodyG);
    mesh(P.ellipsoid(0.3, 0.2, 0.62, 20), belly, 0, 0.3, 0.1, bodyG);
    var headG = new T.Group(); headG.position.set(0, 0.55, 1.0); bodyG.add(headG);
    mesh(P.ellipsoid(0.3, 0.29, 0.38, 24), fur, 0, 0, 0.1, headG);
    var snoutGeo = new T.ConeGeometry(0.17, 0.5, 16); snoutGeo.rotateX(Math.PI / 2); snoutGeo.translate(0, 0, 0.25);
    var snout = mesh(snoutGeo, fur, 0, -0.03, 0.3, headG);
    mesh(new T.SphereGeometry(0.065, 12, 10), pink, 0, -0.02, 0.83, headG);        // the nose
    [-1, 1].forEach(function (s) {
      var ear = mesh(P.ellipsoid(0.17, 0.2, 0.05, 16), fur, s * 0.2, 0.27, 0.0, headG); ear.rotation.set(0, s * 0.5, s * 0.3);
      var inner = mesh(P.ellipsoid(0.11, 0.14, 0.03, 14), pink, s * 0.2, 0.27, 0.03, headG); inner.rotation.copy(ear.rotation);
      var eye = mesh(new T.SphereGeometry(0.05, 12, 10), M.std(0x6a1f2c, { roughness: 0.15 }), s * 0.16, 0.08, 0.36, headG);
      mesh(new T.SphereGeometry(0.014, 6, 6), new T.MeshBasicMaterial({ color: 0xffffff }), s * 0.03, 0.03, 0.04, eye);
    });
    var whiskerPts = [];
    [-1, 1].forEach(function (s) { [-0.06, 0, 0.06].forEach(function (dy) { whiskerPts.push(s * 0.06, dy - 0.02, 0.62, s * 0.5, dy * 2.4 - 0.02, 0.78); }); });
    var wg = new T.BufferGeometry(); wg.setAttribute('position', new T.Float32BufferAttribute(whiskerPts, 3));
    headG.add(new T.LineSegments(wg, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })));

    var legs = [];
    [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(function (c, i) {
      var pv = new T.Group(); pv.position.set(c[0] * 0.27, 0.26, c[1] * 0.55); bodyG.add(pv);
      mesh(new T.CapsuleGeometry(0.075, 0.12, 4, 8), fur, 0, -0.08, 0, pv);
      mesh(P.ellipsoid(0.09, 0.05, 0.13, 10), pink, 0, -0.2, 0.05, pv);
      legs.push({ pv: pv, side: i % 2 ? 1 : -1, ph: i === 1 || i === 2 ? 0 : Math.PI });
    });
    var tail = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0, 0.42, -1.0), new T.Vector3(0, 0.36, -1.5), new T.Vector3(0.1, 0.24, -2.0), new T.Vector3(-0.1, 0.16, -2.5)]), 20, 0.04, 8), pink);
    tail.castShadow = true; g.add(tail);
    var shadow = P.blobShadow(1.0, 1.9, 0.8); shadow.position.set(0, 0.006, -0.2); g.add(shadow);

    /* the inside: lungs, the airway from the nose, a stomach and a bladder (only visible when see-through) */
    var organs = new T.Group(); organs.visible = false; g.add(organs);
    var organMats = [];
    function organ(color, emissive) { var m = M.std(color, { roughness: 0.4, transparent: true, opacity: 0, emissive: emissive || 0x000000, emissiveIntensity: 0 }); organMats.push(m); return m; }
    var lungMat = organ(0xff8fa3, 0xff4d6d);
    [-1, 1].forEach(function (s) { mesh(P.ellipsoid(0.17, 0.22, 0.34, 20), lungMat, s * 0.17, 0.55, 0.5, organs); });
    var AIR = [new T.Vector3(0, 0.53, 1.82), new T.Vector3(0, 0.57, 1.5), new T.Vector3(0, 0.56, 1.15), new T.Vector3(0, 0.56, 0.85), new T.Vector3(0, 0.56, 0.62)];
    var airMat = organ(0xff9db0, 0xff6f8c); airMat.emissiveIntensity = 0.3;
    organs.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(AIR), 28, 0.05, 8), airMat));
    var stomachMat = organ(0xffd9a0, 0xffb347), bladderMat = organ(0xffe680, 0xffd400);
    mesh(P.ellipsoid(0.2, 0.17, 0.26, 16), stomachMat, 0, 0.42, -0.05, organs);
    mesh(new T.SphereGeometry(0.13, 14, 12), bladderMat, 0, 0.36, -0.62, organs);

    /* ---- animation ---- */
    var pose = { walk: 0, head: 0, chew: 0 }, st = { walk: 0, head: 0, chew: 0, ph: 0 }, xray = 0, tw = 0;
    function draw(time, breath) {
      var sw = Math.sin(st.ph) * 0.55 * st.walk;
      legs.forEach(function (L) { L.pv.rotation.x = (L.ph === 0 ? sw : -sw); });
      var bob = Math.abs(Math.sin(st.ph)) * 0.03 * st.walk;
      bodyG.position.y = bob; bodyG.scale.set(1, 1 + 0.035 * breath, 1 + 0.015 * breath);
      headG.rotation.x = 0.6 * st.head + Math.sin(time * 5.5) * 0.02;
      snout.scale.y = 1 + Math.sin(time * 26) * 0.12 * st.chew; snout.rotation.x = Math.sin(time * 26) * 0.05 * st.chew;
      snout.rotation.y = Math.sin(time * 11) * 0.03;                                   // the nose twitches
      tail.rotation.y = Math.sin(time * 1.3) * 0.08 + Math.sin(st.ph) * 0.12 * st.walk;
      lungMat.emissiveIntensity = xray * (0.15 + 0.2 * breath);
      organs.scale.set(1, 1 + 0.03 * breath, 1 + 0.02 * breath);
    }
    var api = {
      group: g, pose: pose, organMats: organMats, airMat: airMat, lungMat: lungMat,
      update: function (dt, time) {
        var e = 1 - Math.exp(-dt * 8);
        st.walk += (pose.walk - st.walk) * e; st.head += (pose.head - st.head) * (1 - Math.exp(-dt * 12)); st.chew += (pose.chew - st.chew) * e;
        if (st.walk > 0.03) st.ph += dt * 10 * (0.5 + st.walk);
        draw(time, Math.sin(time * (3.2 + 2.4 * (api.breathFast || 0))));
      },
      /* 0 = fur, 1 = see-through with the inside shown */
      setXray: function (k) {
        k = U.clamp01(k); xray = k;
        fur.transparent = belly.transparent = k > 0.001; fur.opacity = belly.opacity = 1 - 0.8 * k; fur.depthWrite = belly.depthWrite = k < 0.35;
        fur.needsUpdate = belly.needsUpdate = true;
        organs.visible = k > 0.01; organMats.forEach(function (m) { m.opacity = 0.95 * k; });
        Lab.loop.wake();
      },
      get xray() { return xray; },
      /* world-space helpers for the drop areas, the paths and the camera */
      world: function (v) { g.updateMatrixWorld(true); return g.localToWorld(v.clone()); },
      noseWorld: function () { return api.world(AIR[0]); },
      lungsWorld: function () { return api.world(new T.Vector3(0, 0.55, 0.5)); },
      mouthWorld: function () { return api.world(new T.Vector3(0, 0.5, 1.6)); },
      wasteSpot: function () { return api.world(new T.Vector3(0, 0.4, -0.78)); },
      urineSpot: function () { return api.world(new T.Vector3(0, 0.36, -0.62)); },
      bodyBox: function () { bodyG.updateMatrixWorld(true); return new T.Box3().setFromObject(bodyG); },
      forward: function () { g.updateMatrixWorld(true); return new T.Vector3(0, 0, 1).transformDirection(g.matrixWorld); },
      /* the way the air goes, from far in front of the nose to the lungs (world points) */
      airPath: function (from) {
        var f = api.forward(), start = api.noseWorld().addScaledVector(f, from == null ? 1.5 : from);
        return [start, api.noseWorld().addScaledVector(f, 0.3), api.world(AIR[1]), api.world(AIR[2]), api.world(AIR[3]), api.world(AIR[4]), api.world(new T.Vector3(0.05, 0.55, 0.5))];
      }
    };
    api.setXray(0); draw(0, 0);
    return api;
  };
})(window.Lab);
