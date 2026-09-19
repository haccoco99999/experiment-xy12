/* Lab.drag – drag & drop for tool cards (mouse, finger, pen – all through Pointer Events).
   • A card is dragged out of the tray as a "ghost" picture that follows the pointer.
   • Drop zones are rectangles on screen (usually the projected box of a 3D object) with generous padding.
   • The experiment's `onDrop(item, hits)` decides: {ok:true} keeps the item, {ok:false, message} sends the
     ghost flying back to its card, shows the message and plays the soft "wrong" sound.
   Nothing is ever punished: a wrong drop just returns the item. */
(function (Lab) {
  'use strict';
  var U = Lab.util;
  var zones = [], zonesRoot = null, handler = null, enabled = true, suspended = 0;
  var pending = null, active = null;
  var SLOP = 7;

  function rectOfZone(z) {
    var r = z.rect(); if (!r) return null;
    var p = z.pad == null ? 18 : z.pad;
    return { x: r.x - p, y: r.y - p, w: r.w + 2 * p, h: r.h + 2 * p };
  }
  function hitTest(x, y) {
    var out = [];
    zones.forEach(function (z) {
      var r = rectOfZone(z); if (!r) return;
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
        out.push({ z: z, d: (x - cx) * (x - cx) + (y - cy) * (y - cy) });
      }
    });
    out.sort(function (a, b) { return (b.z.priority || 0) - (a.z.priority || 0) || a.d - b.d; });
    return out.map(function (o) { return o.z.id; });
  }

  function ensureZoneEl(z) {
    if (z.el) return z.el;
    z.el = U.el('div', { class: 'dropzone ' + (z.cls || '') });
    if (z.label) z.el.appendChild(U.el('span', { class: 'dropzone-label', text: z.label }));
    zonesRoot.appendChild(z.el);
    return z.el;
  }

  var D = Lab.drag = {
    init: function (zonesEl) {
      zonesRoot = zonesEl;
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
      document.addEventListener('pointercancel', onCancel);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && active) cancelActive(); });
    },
    setHandler: function (h) { handler = h; },        // {onStart(item), onEnd(item), onDrop(item, hits, pt) → {ok, message}}
    setEnabled: function (b) { enabled = !!b; if (!b) cancelActive(); },     // the experiment locks/unlocks dragging
    suspend: function (d) { suspended = Math.max(0, suspended + d); if (suspended) cancelActive(); },  // dialogs pause dragging
    isDragging: function () { return !!active; },
    /* zone: {id, rect():{x,y,w,h}|null, accepts(item)→bool, pad, label, priority, cls} */
    addZone: function (z) { zones.push(z); return z; },
    removeZone: function (id) {
      zones = zones.filter(function (z) { if (z.id === id) { if (z.el && z.el.parentNode) z.el.parentNode.removeChild(z.el); return false; } return true; });
    },
    zoneCount: function () { return zones.length; },
    clear: function () {
      cancelActive(true);
      zones.forEach(function (z) { if (z.el && z.el.parentNode) z.el.parentNode.removeChild(z.el); });
      zones = []; handler = null; pending = null; enabled = true; suspended = 0;
    },
    /* make a tray card draggable. cbs: {onClick(item)} */
    bindCard: function (card, item, cbs) {
      card.addEventListener('pointerdown', function (e) {
        if (!enabled || suspended || card.classList.contains('is-disabled') || card.classList.contains('is-ghost')) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        pending = { card: card, item: item, cbs: cbs || {}, sx: e.clientX, sy: e.clientY, id: e.pointerId };
        try { card.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      });
      card.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    },
    updateZones: function () {
      if (!active) return;
      zones.forEach(function (z) {
        var el = z.el; if (!el) return;
        var r = rectOfZone(z);
        if (!r) { el.style.display = 'none'; return; }
        el.style.display = '';
        el.style.left = r.x + 'px'; el.style.top = r.y + 'px'; el.style.width = r.w + 'px'; el.style.height = r.h + 'px';
      });
    }
  };

  function startDrag(e) {
    var p = pending; pending = null;
    var img = p.card.querySelector('img');
    var ghost = U.el('div', { class: 'drag-ghost' });
    if (img) ghost.appendChild(U.el('img', { src: img.src, alt: '' }));
    else ghost.appendChild(U.el('div', { class: 'drag-ghost-fallback', text: p.item.label || '' }));
    document.body.appendChild(ghost);
    active = { p: p, ghost: ghost, over: {}, x: e.clientX, y: e.clientY };
    p.card.classList.add('is-dragging');
    document.body.classList.add('is-dragging-item');
    zones.forEach(function (z) {
      var ok = z.accepts ? z.accepts(p.item) : true;
      if (ok) { ensureZoneEl(z).classList.add('show'); } else if (z.el) z.el.classList.remove('show');
    });
    D.updateZones();
    if (handler && handler.onStart) handler.onStart(p.item);
    Lab.audio.play('click');
    moveGhost(e.clientX, e.clientY);
  }
  function moveGhost(x, y) {
    if (!active) return;
    active.x = x; active.y = y;
    active.ghost.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-62%) scale(1.06)';
    var hits = hitTest(x, y);
    zones.forEach(function (z) {
      if (!z.el) return;
      var hot = hits.indexOf(z.id) === 0 && z.el.classList.contains('show');
      z.el.classList.toggle('hot', hot);
    });
  }

  function onMove(e) {
    if (pending && e.pointerId === pending.id) {
      var dx = e.clientX - pending.sx, dy = e.clientY - pending.sy;
      if (dx * dx + dy * dy > SLOP * SLOP) startDrag(e);
    }
    if (active) { e.preventDefault(); moveGhost(e.clientX, e.clientY); }
  }
  function onUp(e) {
    if (pending && e.pointerId === pending.id) {
      var p = pending; pending = null;
      if (p.cbs.onClick) p.cbs.onClick(p.item);   // it was a tap, not a drag
      return;
    }
    if (!active) return;
    var a = active, item = a.p.item, hits = hitTest(e.clientX, e.clientY);
    var res = { ok: false, message: '' };
    try { if (handler && handler.onDrop) res = handler.onDrop(item, hits, { x: e.clientX, y: e.clientY }) || res; } catch (err) { console.error(err); }
    finish(res.ok, res.message);
  }
  function onCancel() { if (active) cancelActive(); pending = null; }

  function finish(ok, message) {
    var a = active; if (!a) return;
    active = null;
    hideZones();
    document.body.classList.remove('is-dragging-item');
    a.p.card.classList.remove('is-dragging');
    if (handler && handler.onEnd) handler.onEnd(a.p.item);
    if (ok) {
      a.ghost.classList.add('vanish');
      setTimeout(function () { if (a.ghost.parentNode) a.ghost.parentNode.removeChild(a.ghost); }, 200);
    } else {
      if (message) Lab.ui.toast(message, { type: 'warn' });
      Lab.audio.play('wrong');
      returnGhost(a);
    }
  }
  function returnGhost(a) {
    var rc = a.p.card.getBoundingClientRect();
    a.ghost.classList.add('returning');
    a.ghost.style.transform = 'translate(' + (rc.left + rc.width / 2) + 'px,' + (rc.top + rc.height / 2) + 'px) translate(-50%,-50%) scale(0.9)';
    a.ghost.style.opacity = '0.2';
    setTimeout(function () { if (a.ghost.parentNode) a.ghost.parentNode.removeChild(a.ghost); }, 340);
  }
  function cancelActive(silent) {
    if (!active) return;
    var a = active; active = null;
    hideZones();
    document.body.classList.remove('is-dragging-item');
    a.p.card.classList.remove('is-dragging');
    if (silent) { if (a.ghost.parentNode) a.ghost.parentNode.removeChild(a.ghost); }
    else returnGhost(a);
  }
  function hideZones() { zones.forEach(function (z) { if (z.el) z.el.classList.remove('show', 'hot'); }); }
})(window.Lab);
