/* Lab.drag – drag & drop for tool cards (mouse, finger, pen – all through Pointer Events).
   • A card is dragged out of the tray as a "ghost" picture that follows the pointer.
   • Drop zones are rectangles on screen (usually the projected box of a 3D object) with generous padding.
   • Keyboard users can open a list of the accepted zones and call the same drop handler as a pointer drag.
   Nothing is ever punished: a wrong drop just returns the item. */
(function (Lab) {
  'use strict';
  var U = Lab.util;
  var zones = [], zonesRoot = null, handler = null, enabled = true, suspended = 0;
  var pending = null, active = null, keyboard = null, pickerSeq = 0;
  var SLOP = 7;
  var ZONE_NAMES = {
    bench: 'Bàn thí nghiệm', table: 'Bàn thí nghiệm', garden: 'Khu vườn',
    plant: 'Cây', leaf: 'Lá', stem: 'Thân cây', soil: 'Đất', mouse: 'Chuột', near: 'Gần chuột',
    flower: 'Hoa', petal: 'Cánh hoa', ovary: 'Bầu nhụy', style: 'Vòi nhụy',
    anther: 'Bao phấn', stigma: 'Đầu nhụy', eggs: 'Trứng', larva: 'Sâu non', pupa: 'Nhộng',
    male: 'Con đực', female: 'Con cái', sperm: 'Tinh trùng', egg: 'Trứng',
    zygote: 'Hợp tử', embryo: 'Phôi', fetus: 'Thai', kitten: 'Con non'
  };

  function rectOfZone(z, refresh) {
    if (!refresh && z._rectReady) return z._screenRect;
    var r = z.rect();
    var p = z.pad == null ? 18 : z.pad;
    z._screenRect = r ? { x: r.x - p, y: r.y - p, w: r.w + 2 * p, h: r.h + 2 * p } : null;
    z._rectReady = true;
    return z._screenRect;
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
  function zoneAccepts(z, item) {
    if (!z.accepts) return true;
    try { return !!z.accepts(item); } catch (err) { console.error(err); return false; }
  }
  function zoneLabel(z) {
    if (z.label) return z.label;
    var id = String(z.id || ''), m;
    if ((m = /^pot([AB])$/i.exec(id))) return 'Chậu ' + m[1].toUpperCase();
    if ((m = /^pot(\d+)$/i.exec(id))) return 'Chậu ' + (+m[1] + 1);
    if ((m = /^cage(\d+)$/i.exec(id))) return 'Lồng ' + (+m[1]);
    if ((m = /^(?:place|slot)(\d+)$/i.exec(id))) return 'Vị trí ' + (+m[1] + 1);
    if (ZONE_NAMES[id]) return ZONE_NAMES[id];
    id = id.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]+/g, ' ').trim();
    return id ? 'Vị trí ' + id : 'Vị trí thả';
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
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (keyboard) cancelKeyboard(false);
        else if (active) cancelActive();
      });
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) return;
        pending = null;
        if (keyboard) cancelKeyboard(true, false);
        if (active) cancelActive(true);
      });
    },
    setHandler: function (h) { handler = h; },
    setEnabled: function (b) { enabled = !!b; if (!b) { cancelActive(); cancelKeyboard(true); } },
    suspend: function (d) { suspended = Math.max(0, suspended + d); if (suspended) { cancelActive(); cancelKeyboard(true, false); } },
    isDragging: function () { return !!active || !!keyboard; },
    /* zone: {id, rect():{x,y,w,h}|null, accepts(item)→bool, pad, label, priority, cls} */
    addZone: function (z) { z._rectReady = false; zones.push(z); return z; },
    removeZone: function (id) {
      zones = zones.filter(function (z) { if (z.id === id) { if (z.el && z.el.parentNode) z.el.parentNode.removeChild(z.el); return false; } return true; });
    },
    zoneCount: function () { return zones.length; },
    clear: function () {
      cancelActive(true);
      cancelKeyboard(true, false);
      zones.forEach(function (z) { if (z.el && z.el.parentNode) z.el.parentNode.removeChild(z.el); });
      zones = []; handler = null; pending = null; enabled = true; suspended = 0;
    },
    /* make a tray card draggable. cbs: {onClick(item)} */
    bindCard: function (card, item, cbs) {
      cbs = cbs || {};
      function activate() {
        if (!enabled || suspended || card.getAttribute('aria-disabled') === 'true' || card.classList.contains('is-disabled') || card.classList.contains('is-ghost')) return;
        startKeyboard(card, item, cbs);
      }
      card.addEventListener('pointerdown', function (e) {
        if (!enabled || suspended || card.classList.contains('is-disabled') || card.classList.contains('is-ghost')) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        pending = { card: card, item: item, cbs: cbs, sx: e.clientX, sy: e.clientY, id: e.pointerId };
        try { card.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      });
      card.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault(); e.stopPropagation();
        if (!e.repeat) activate();
      });
      card.addEventListener('click', function (e) {
        if (e.detail === 0 && !e.defaultPrevented) { e.preventDefault(); activate(); }
      });
      card.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    },
    keyboardPlace: function (card, item, cbs) { startKeyboard(card, item, cbs || {}); },
    updateZones: function () {
      if (!active && !keyboard) return;
      zones.forEach(function (z) {
        var el = z.el;
        var r = rectOfZone(z, true);
        if (!el) return;
        if (!r) { el.style.display = 'none'; return; }
        el.style.display = '';
        el.style.left = r.x + 'px'; el.style.top = r.y + 'px'; el.style.width = r.w + 'px'; el.style.height = r.h + 'px';
      });
    }
  };

  function startDrag(e) {
    var p = pending; pending = null;
    if (keyboard) cancelKeyboard(true, false);
    var img = p.card.querySelector('img');
    var ghost = U.el('div', { class: 'drag-ghost' });
    if (img) ghost.appendChild(U.el('img', { src: img.src, alt: '' }));
    else ghost.appendChild(U.el('div', { class: 'drag-ghost-fallback', text: p.item.label || '' }));
    document.body.appendChild(ghost);
    active = { p: p, ghost: ghost, over: {}, x: e.clientX, y: e.clientY };
    p.card.classList.add('is-dragging');
    document.body.classList.add('is-dragging-item');
    zones.forEach(function (z) {
      var ok = zoneAccepts(z, p.item);
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
      if (p.cbs.onClick) p.cbs.onClick(p.item);
      return;
    }
    if (!active) return;
    D.updateZones();
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
    if (handler && handler.onEnd) handler.onEnd(a.p.item);
    if (silent) { if (a.ghost.parentNode) a.ghost.parentNode.removeChild(a.ghost); }
    else returnGhost(a);
  }
  function hideZones() { zones.forEach(function (z) { if (z.el) z.el.classList.remove('show', 'hot', 'keyboard-target'); }); }

  function startKeyboard(card, item, cbs) {
    if (keyboard) cancelKeyboard(true, false);
    if (active) cancelActive(true);
    var accepted = zones.filter(function (z) { return zoneAccepts(z, item) && !!rectOfZone(z, true); });
    accepted.sort(function (a, b) { return (b.priority || 0) - (a.priority || 0); });
    if (!accepted.length) {
      if (cbs && cbs.onClick) { cbs.onClick(item); return; }
      dropFromKeyboard(card, item, null);
      return;
    }
    var id = 'keyboard-drop-' + (++pickerSeq);
    var picker = U.el('section', { class: 'keyboard-drop-picker', attrs: { id: id, role: 'region', 'aria-label': 'Chọn vị trí đặt ' + (item.label || 'dụng cụ') } },
      U.el('p', { class: 'keyboard-drop-title', text: 'Chọn vị trí đặt “' + (item.label || 'dụng cụ') + '”' }));
    var list = U.el('ul', { class: 'keyboard-drop-list', attrs: { 'aria-label': 'Các vị trí phù hợp' } });
    accepted.forEach(function (z) {
      var button = U.el('button', { class: 'btn btn-ghost keyboard-drop-option', text: zoneLabel(z), attrs: { type: 'button', 'aria-label': 'Đặt vào ' + zoneLabel(z) } });
      button.addEventListener('click', function () { dropFromKeyboard(card, item, z, picker, id); });
      list.appendChild(U.el('li', {}, button));
    });
    var cancel = U.el('button', { class: 'btn btn-ghost keyboard-drop-cancel', text: 'HỦY', attrs: { type: 'button' } });
    cancel.addEventListener('click', function () { cancelKeyboard(false); });
    picker.appendChild(list);
    picker.appendChild(cancel);
    document.body.appendChild(picker);
    keyboard = { card: card, item: item, zones: accepted, picker: picker, id: id };
    card.setAttribute('aria-expanded', 'true');
    card.setAttribute('aria-controls', id);
    accepted.forEach(function (z) { ensureZoneEl(z).classList.add('show', 'keyboard-target'); });
    zones.forEach(function (z) {
      if (z.el && accepted.indexOf(z) < 0) z.el.classList.remove('show', 'keyboard-target');
    });
    D.updateZones();
    if (handler && handler.onStart) handler.onStart(item);
    Lab.audio.play('click');
    var first = picker.querySelector('button');
    if (first) {
      try { first.focus({ preventScroll: true }); } catch (err) { first.focus(); }
    }
    Lab.loop.wake();
  }

  function dropFromKeyboard(card, item, zone, picker, id) {
    var k = keyboard;
    var point = null;
    if (zone) {
      var r = zoneAccepts(zone, item) ? rectOfZone(zone, true) : null;
      if (r) point = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
      else zone = null;
    }
    if (k && k.picker === picker) {
      keyboard = null;
      removePicker(k);
    } else if (!k && id) {
      var stale = document.getElementById(id); if (stale && stale.parentNode) stale.parentNode.removeChild(stale);
    }
    if (!k && handler && handler.onStart) handler.onStart(item);
    var res = { ok: false, message: '' };
    try { if (handler && handler.onDrop) res = handler.onDrop(item, zone ? [zone.id] : [], point || { x: 0, y: 0 }) || res; } catch (err) { console.error(err); }
    if (handler && handler.onEnd) handler.onEnd(item);
    if (!res.ok) {
      if (res.message) Lab.ui.toast(res.message, { type: 'warn' });
      Lab.audio.play('wrong');
    }
    if (card && card.isConnected) {
      try { card.focus({ preventScroll: true }); } catch (err) { card.focus(); }
    }
  }

  function removePicker(k) {
    if (!k) return;
    if (k.picker && k.picker.parentNode) k.picker.parentNode.removeChild(k.picker);
    k.card.removeAttribute('aria-expanded');
    k.card.removeAttribute('aria-controls');
    hideZones();
  }
  function cancelKeyboard(silent, restoreFocus) {
    var k = keyboard; if (!k) return;
    keyboard = null;
    removePicker(k);
    if (handler && handler.onEnd) handler.onEnd(k.item);
    if (!silent) Lab.audio.play('click');
    if (restoreFocus !== false && k.card && k.card.isConnected) {
      try { k.card.focus({ preventScroll: true }); } catch (err) { k.card.focus(); }
    }
  }
})(window.Lab);
