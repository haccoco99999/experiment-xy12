/* Lab.models.molecule – a gas molecule made of balls: O₂ (two red oxygen atoms) and CO₂ (a grey carbon atom between two
   red oxygen atoms). A soft halo shows that it can be dragged. 1 unit = 10 cm, so a molecule is drawn far bigger than life. */
(function (Lab) {
  'use strict';
  var T = window.THREE, M = Lab.mat, U = Lab.util, Mo = Lab.models;
  var SPH = null;

  Mo.molecule = function (type) {
    SPH = SPH || new T.SphereGeometry(1, 16, 12);
    var g = new T.Group(); g.name = 'molecule-' + type; g.userData.type = type;
    var red = M.std(0xe5533d, { roughness: 0.3 }), grey = M.std(0x59636e, { roughness: 0.4 });
    function ball(mat, r, x) { var m = new T.Mesh(SPH, mat); m.scale.setScalar(r); m.position.x = x; m.userData.noPick = true; g.add(m); return m; }
    if (type === 'o2') { ball(red, 0.12, -0.11); ball(red, 0.12, 0.11); }
    else { ball(grey, 0.14, 0); ball(red, 0.115, -0.25); ball(red, 0.115, 0.25); }
    var halo = new T.Sprite(new T.SpriteMaterial({ map: M.tex.glow(), color: type === 'o2' ? 0x8fd0ff : 0xffe28a, transparent: true, opacity: 0.55, depthWrite: false, fog: false }));
    halo.scale.setScalar(type === 'o2' ? 0.85 : 1.1); halo.renderOrder = 9; halo.userData.noPick = true; g.add(halo);
    g.userData.halo = halo;
    return g;
  };

  /* the magnifying glass in the tray (a brass ring, a glass disc and a wooden handle; it faces +z) */
  Mo.magnifier = function () {
    var g = new T.Group(); g.name = 'magnifier';
    var ring = new T.Mesh(new T.TorusGeometry(0.6, 0.07, 12, 40), M.std(0xd9a441, { roughness: 0.3, metalness: 0.5 })); ring.castShadow = true; g.add(ring);
    var glass = new T.Mesh(new T.CircleGeometry(0.58, 40), M.clearPlastic({ opacity: 0.34, color: 0xcfeaff })); glass.renderOrder = 4; g.add(glass);
    var handle = new T.Mesh(new T.CylinderGeometry(0.075, 0.09, 0.95, 12), M.std(0x8a5a33, { roughness: 0.7 }));
    handle.position.set(-0.76, -0.76, 0); handle.rotation.z = 3 * Math.PI / 4; handle.castShadow = true; g.add(handle);
    g.userData.thumbBoost = function () { glass.material.opacity = 0.55; };
    return g;
  };
})(window.Lab);
