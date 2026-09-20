/* Lab.sceneDrag – drag things that already live INSIDE the 3D picture (gas molecules…) with mouse, finger or pen.
   (The tool cards in the tray use Lab.drag; this is for objects on the table.)
   • The nearest draggable item within `radius` pixels of the pointer is picked up and follows the pointer on a plane
     facing the camera, so it is easy to grab even when it is small.
   • On release, item.onDrop(item, {client:{x,y}, world, from}) decides: {ok:true} = the experiment takes over, anything
     else = the item flies back to item.home() with a little shake. A tap without moving does nothing. */
(function (Lab) {
  'use strict';
  var T = window.THREE;
  var items = [], drag = null, hover = null, ready = false, enabled = true;
  var dirV = new T.Vector3(), pt = new T.Vector3(), plane = new T.Plane();

  function worldOf(it) { it.object.updateMatrixWorld(true); return it.object.getWorldPosition(new T.Vector3()); }
  function modalOpen() { return !!document.querySelector('#modal-root .modal-back'); }
  function nearest(x, y) {
    var best = null, bd = 1e9;
    items.forEach(function (it) {
      if (it.state !== 'idle' || !it.object.visible || (it.enabled && !it.enabled(it))) return;
      var p = Lab.stage.project(worldOf(it)); if (p.behind) return;
      var d = Math.hypot(p.x - x, p.y - y);
      if (d <= (it.radius || 46) && d < bd) { bd = d; best = it; }
    });
    return best;
  }

  function onDown(e) {
    if (!enabled || drag || modalOpen() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    var it = nearest(e.clientX, e.clientY); if (!it) return;
    e.preventDefault();
    var start = worldOf(it);
    Lab.stage.camera.getWorldDirection(dirV);
    plane.setFromNormalAndCoplanarPoint(dirV, start);
    drag = { it: it, id: e.pointerId, moved: false, from: it.region ? it.region(it) : null };
    it.state = 'drag';
    try { Lab.stage.canvas.setPointerCapture(e.pointerId); } catch (err) { /* synthetic events have no capture */ }
    document.body.classList.add('is-dragging-item');
    if (it.onStart) it.onStart(it);
    Lab.loop.wake();
  }
  function onMove(e) {
    if (!drag) {
      if (e.target !== Lab.stage.canvas) return;
      var h = enabled ? nearest(e.clientX, e.clientY) : null;
      if (h !== hover) { hover = h; Lab.stage.canvas.style.cursor = h ? 'grab' : ''; }
      return;
    }
    if (e.pointerId !== drag.id) return;
    e.preventDefault();
    if (Lab.stage.rayAt(e.clientX, e.clientY).ray.intersectPlane(plane, pt)) {
      var o = drag.it.object;
      o.position.copy(o.parent ? o.parent.worldToLocal(pt.clone()) : pt);
      drag.moved = true; Lab.loop.wake();
    }
  }
  function onUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag; drag = null;
    document.body.classList.remove('is-dragging-item');
    try { Lab.stage.canvas.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    var res = { ok: false };
    if (d.it.onEnd) d.it.onEnd(d.it);
    if (d.moved && d.it.onDrop) {
      try { res = d.it.onDrop(d.it, { client: { x: e.clientX, y: e.clientY }, world: worldOf(d.it), from: d.from }) || res; } catch (err) { console.error(err); }
    }
    if (res.ok) return;                       // the experiment moves the item from here
    if (d.moved) sendHome(d.it); else d.it.state = 'idle';
  }

  /* fly back to where it came from, with a little shake ("rung nhẹ", md section 58) */
  function sendHome(it) {
    var o = it.object, h = it.home(), r0 = o.rotation.z;
    it.state = 'home';
    Lab.tween.value(0.4, function (k) { o.rotation.z = r0 + Math.sin(k * 20) * 0.4 * (1 - k); }, { ease: Lab.tween.ease.linear });
    Lab.tween.to(o.position, { x: h.x, y: h.y, z: h.z }, 0.4, { ease: 'outBack' }).promise.then(function () { it.state = 'idle'; o.rotation.z = r0; });
  }

  function ensureInit() {
    if (ready || !Lab.stage.canvas) return;
    ready = true;
    Lab.stage.canvas.addEventListener('pointerdown', onDown);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', function (e) { if (drag && e.pointerId === drag.id) { var it = drag.it; drag = null; document.body.classList.remove('is-dragging-item'); if (it.onEnd) it.onEnd(it); sendHome(it); } });
  }

  /* item: {id, object, radius, home():{x,y,z} (local), enabled(item), region(item)→'env'|'leaf', onStart(item), onDrop(item, info)→{ok}} */
  Lab.sceneDrag = {
    add: function (it) { ensureInit(); it.state = 'idle'; items.push(it); return it; },
    remove: function (it) { var i = items.indexOf(it); if (i >= 0) items.splice(i, 1); if (drag && drag.it === it) drag = null; },
    clear: function () { items.length = 0; drag = null; hover = null; enabled = true; document.body.classList.remove('is-dragging-item'); if (Lab.stage.canvas) Lab.stage.canvas.style.cursor = ''; },
    setEnabled: function (b) { enabled = !!b; },
    isDragging: function () { return !!drag; },
    count: function () { return items.length; },
    sendHome: sendHome
  };
})(window.Lab);
