/* Lab.lens – the magnifying glass. A second camera looks closely at a spot of the scene and its picture is drawn in a
   round window on top of the 3D view, so the close-up is sharp (not a blown-up screenshot). Only one lens at a time.
   show({world: Vector3 | fn, radius (px), viewSize (world units seen across the window), distance, onClose}) → {hide()} */
(function (Lab) {
  'use strict';
  var T = window.THREE;
  var cur = null;
  var dirV = new T.Vector3();

  function hide() {
    if (!cur) return;
    var c = cur; cur = null;
    if (Lab.stage.afterRender === c.render) Lab.stage.afterRender = null;
    c.ring.remove(); c.rt.dispose(); c.disc.geometry.dispose(); c.mat.dispose();
    Lab.loop.wake();
  }

  function show(o) {
    hide();
    var S = Lab.stage, radius = o.radius || 118, dist = o.distance || 2.4, view = o.viewSize || 1.2;
    var rt = new T.WebGLRenderTarget(512, 512, { depthBuffer: true });
    rt.texture.colorSpace = T.SRGBColorSpace;
    var ovScene = new T.Scene(), ovCam = new T.OrthographicCamera(0, 1, 1, 0, -10, 10);
    var mat = new T.MeshBasicMaterial({ map: rt.texture, toneMapped: false, transparent: true });
    var disc = new T.Mesh(new T.CircleGeometry(1, 64), mat); ovScene.add(disc);
    var cam = new T.PerspectiveCamera(20, 1, 0.05, 200);
    var point = function () { return typeof o.world === 'function' ? o.world() : o.world; };
    var ring = Lab.labels.add({ html: '', cls: 'lens-ring', world: point, anchor: 'center', onClick: function () { hide(); if (o.onClose) o.onClose(); } });
    ring.el.style.width = ring.el.style.height = (radius * 2 + 12) + 'px';
    ring.el.title = 'Nhấp để cất kính phóng đại';

    function render(renderer) {
      var wp = point(), rc = S.container.getBoundingClientRect(), p = S.project(wp);
      if (p.behind) return;
      dirV.copy(S.camera.position).sub(wp).normalize();
      cam.position.copy(wp).addScaledVector(dirV, dist); cam.lookAt(wp);
      cam.fov = 2 * Math.atan(view / 2 / dist) * 180 / Math.PI; cam.updateProjectionMatrix();
      var shadowAuto = renderer.shadowMap.autoUpdate, oldRT = renderer.getRenderTarget();
      renderer.shadowMap.autoUpdate = false;                    // the shadows of the main picture are still valid
      renderer.setRenderTarget(rt); renderer.clear(); renderer.render(S.scene, cam); renderer.setRenderTarget(oldRT);
      renderer.shadowMap.autoUpdate = shadowAuto;
      ovCam.right = rc.width; ovCam.top = rc.height; ovCam.updateProjectionMatrix();
      disc.scale.set(radius, radius, 1); disc.position.set(p.x - rc.left, rc.height - (p.y - rc.top), 0);
      var ac = renderer.autoClear; renderer.autoClear = false; renderer.clearDepth(); renderer.render(ovScene, ovCam); renderer.autoClear = ac;
    }
    cur = { ring: ring, rt: rt, disc: disc, mat: mat, render: render };
    S.afterRender = render;
    Lab.loop.wake();
    return { hide: hide };
  }

  Lab.lens = { show: show, hide: hide, active: function () { return !!cur; } };
})(window.Lab);
