/* Lab.labels – HTML name tags that follow a point in the 3D scene ("CHẬU A – ĐỐI CHỨNG", "LÁ CÂY"…).
   Crisp text, easy to style, and they are removed with everything else on reset. */
(function (Lab) {
  'use strict';
  var T = window.THREE, U = Lab.util;
  var items = [], root = null, tmp = new T.Vector3();

  function worldOf(item) {
    var w = item.world;
    if (typeof w === 'function') return w();
    if (w && w.isObject3D) { w.getWorldPosition(tmp); return tmp; }
    return w;
  }

  var L = Lab.labels = {
    init: function (el) { root = el; },
    /* add({html|text, cls, world: Vector3 | Object3D | fn, dx, dy, onClick}) → handle */
    add: function (o) {
      var el = U.el('div', { class: 'tag3d ' + (o.cls || '') });
      if (o.html) el.innerHTML = o.html; else el.textContent = o.text || '';
      if (o.onClick) { el.classList.add('clickable'); el.addEventListener('click', o.onClick); }
      root.appendChild(el);
      var item = { el: el, world: o.world, dx: o.dx || 0, dy: o.dy || 0, hidden: false, anchor: o.anchor || 'bottom' };
      items.push(item);
      Lab.loop.wake();
      return {
        el: el,
        setHtml: function (h) { el.innerHTML = h; },
        setVisible: function (v) { item.hidden = !v; el.style.display = v ? '' : 'none'; Lab.loop.wake(); },
        setWorld: function (w) { item.world = w; Lab.loop.wake(); },
        remove: function () { var i = items.indexOf(item); if (i >= 0) items.splice(i, 1); if (el.parentNode) el.parentNode.removeChild(el); }
      };
    },
    update: function () {
      if (!root || !items.length) return;
      var rc = root.getBoundingClientRect();
      for (var i = 0; i < items.length; i++) {
        var it = items[i]; if (it.hidden) continue;
        var w = worldOf(it); if (!w) continue;
        var p = Lab.stage.project(w);
        it.el.style.transform = 'translate(' + (p.x - rc.left + it.dx).toFixed(1) + 'px,' + (p.y - rc.top + it.dy).toFixed(1) + 'px) translate(-50%,' + (it.anchor === 'top' ? '0' : it.anchor === 'center' ? '-50%' : '-100%') + ')';
        it.el.style.opacity = p.behind ? '0' : '';
      }
    },
    clear: function () { items.forEach(function (it) { if (it.el.parentNode) it.el.parentNode.removeChild(it.el); }); items.length = 0; },
    count: function () { return items.length; }
  };
})(window.Lab);
