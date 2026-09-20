/* Lab.ui – everything around the 3D picture: top bar, progress bar, tool tray, side panel, toasts, big
   captions, dialogs, and the thermostat widget. Plain DOM, styled by css/app.css. */
(function (Lab) {
  'use strict';
  var U = Lab.util;
  var els = {}, modalStack = [];

  var TOAST_EMOJI = { ok: '✅', warn: '💡', info: '💬' };

  var UI = Lab.ui = {
    el: els,
    bottomInset: 136,
    onReset: null, onHelp: null, onHome: null,

    init: function () {
      ['home', 'lab', 'stage', 'hud', 'topbar', 'lab-title', 'progress', 'tray', 'panel', 'labels', 'zones', 'toasts', 'caption',
        'btn-reset', 'btn-home', 'btn-help', 'btn-sound', 'modal-root'].forEach(function (id) { els[id] = document.getElementById(id); });
      els['btn-reset'].addEventListener('click', function () { if (UI.onReset) UI.onReset(); });
      els['btn-home'].addEventListener('click', function () { if (UI.onHome) UI.onHome(); });
      els['btn-help'].addEventListener('click', function () { if (UI.onHelp) UI.onHelp(); });
      els['btn-sound'].addEventListener('click', function () { UI.refreshSound(Lab.audio.toggle()); if (!Lab.audio.isMuted()) Lab.audio.play('ok'); });
      UI.refreshSound(Lab.audio.isMuted());
      window.addEventListener('resize', function () { UI.fitStage(); });
    },
    refreshSound: function (muted) {
      els['btn-sound'].textContent = muted ? '🔇' : '🔊';
      els['btn-sound'].setAttribute('aria-label', muted ? 'Bật âm thanh' : 'Tắt âm thanh');
    },

    setExperiment: function (exp) {
      els['lab-title'].textContent = exp.title;
      els['lab-title'].title = exp.title;
    },

    /* ----- progress bar: labels ['Đặt cây', …], states ['done'|'active'|'locked', …] ----- */
    /* states: 'done' | 'active' | 'locked', or 'open' (can be started, not started yet). titles: optional {state: tooltip text} */
    setProgress: function (labels, states, titles) {
      var ol = els.progress.firstChild;
      if (!ol || ol.children.length !== labels.length) {
        U.clear(els.progress);
        ol = U.el('ol', { class: 'steps' });
        labels.forEach(function (l, i) {
          ol.appendChild(U.el('li', { class: 'step locked' }, U.el('span', { class: 'dot', text: String(i + 1) }), U.el('span', { class: 'lbl', text: l })));
        });
        els.progress.appendChild(ol);
      }
      states.forEach(function (s, i) {
        var li = ol.children[i], dot = li.firstChild, was = li.className;
        li.className = 'step ' + s;
        dot.textContent = s === 'done' ? '✓' : s === 'locked' ? '🔒' : String(i + 1);
        if (was.indexOf(s) < 0 && s === 'done') li.classList.add('just-done');
        li.setAttribute('aria-current', s === 'active' ? 'step' : 'false');
        if (titles) li.title = s === 'open' ? '' : (titles[s] || '');
      });
    },

    /* ----- tool tray: items [{id,label,thumb,badge}] ----- */
    setTray: function (items, o) {
      o = o || {};
      U.clear(els.tray);
      els.tray.classList.remove('hidden');
      els.tray.appendChild(U.el('div', { class: 'tray-head' }, U.el('span', { class: 'tray-ico', text: '🧰' }), U.el('span', { text: o.title || 'KHAY DỤNG CỤ' })));
      var grid = U.el('div', { class: 'tray-grid' + (items.length > 8 ? ' dense' : '') });
      items.forEach(function (it) {
        var card = U.el('div', { class: 'card', attrs: { 'data-id': it.id, role: 'button', tabindex: '0', 'aria-label': it.label } });
        if (it.badge) card.appendChild(U.el('span', { class: 'card-badge', text: it.badge }));
        if (it.thumb) card.appendChild(U.el('img', { src: it.thumb, alt: '', draggable: false }));
        card.appendChild(U.el('span', { class: 'card-label', text: it.label }));
        card.appendChild(U.el('span', { class: 'card-check', text: '✓' }));
        grid.appendChild(card);
        Lab.drag.bindCard(card, it, { onClick: o.onClick });
      });
      els.tray.appendChild(grid);
      UI.fitStage();
    },
    card: function (id) { return els.tray.querySelector('.card[data-id="' + id + '"]'); },
    /* state: {ghost: item is on the table, used: show ✓, disabled} */
    setCard: function (id, st) {
      var c = UI.card(id); if (!c) return;
      if ('ghost' in st) c.classList.toggle('is-ghost', !!st.ghost);
      if ('used' in st) c.classList.toggle('is-used', !!st.used);
      if ('disabled' in st) c.classList.toggle('is-disabled', !!st.disabled);
      if ('pulse' in st) c.classList.toggle('pulse', !!st.pulse);
    },
    hideTray: function () { els.tray.classList.add('hidden'); UI.fitStage(); },

    /* ----- side panel (thermostat, start button, results…) ----- */
    setPanel: function (node) {
      U.clear(els.panel);
      if (node) { els.panel.appendChild(node); els.panel.classList.remove('hidden'); }
      else els.panel.classList.add('hidden');
      UI.fitStage();
    },
    panelWide: function (wide) { els.panel.classList.toggle('wide', !!wide); UI.fitStage(); },

    /* keep the 3D picture centred in the free space between the tray and the side panel */
    fitStage: function () {
      if (!Lab.stage || !Lab.stage.ok) return;
      var vw = window.innerWidth, hudTop = els.progress.getBoundingClientRect().bottom;
      var tray = els.tray.classList.contains('hidden') ? 0 : els.tray.getBoundingClientRect().right;
      var panelRect = els.panel.getBoundingClientRect();
      var panel = els.panel.classList.contains('hidden') || !els.panel.firstChild ? 0 : vw - panelRect.left;
      // keep a strip along the bottom free for the name cards under the pots and the reset button
      Lab.stage.setInsets(tray, hudTop, panel, UI.bottomInset);
      // messages and big captions are centred on the free area, not on the whole screen
      var free = vw - tray - panel;
      els.toasts.style.left = (tray + free / 2) + 'px';
      els.toasts.style.width = Math.max(260, Math.min(600, free - 24)) + 'px';
      els.caption.style.left = tray + 'px'; els.caption.style.right = panel + 'px';
      Lab.stage.refit();
    },

    /* ----- toasts ----- */
    toast: function (text, o) {
      o = o || {};
      var type = o.type || 'info';
      var last = els.toasts.lastChild;
      if (last && last.dataset.text === text) { clearTimeout(last._t); last._t = setTimeout(function () { drop(last); }, o.ms || 3800); return last; }
      var t = U.el('div', { class: 'toast ' + type, attrs: { 'data-text': text, role: 'status' } },
        U.el('span', { class: 'toast-emoji', text: o.emoji || TOAST_EMOJI[type] || '💬' }), U.el('span', { class: 'toast-text', text: text }));
      els.toasts.appendChild(t);
      while (els.toasts.children.length > 3) els.toasts.removeChild(els.toasts.firstChild);
      t._t = setTimeout(function () { drop(t); }, o.ms || 3800);
      function drop(n) { n.classList.add('leaving'); setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 300); }
      return t;
    },

    /* ----- big centre caption ("14 NGÀY SAU") ----- */
    caption: function (text, o) {
      o = o || {};
      U.clear(els.caption);
      var c = U.el('div', { class: 'caption-card ' + (o.cls || '') }, U.el('div', { class: 'caption-text', text: text }));
      if (o.sub) c.appendChild(U.el('div', { class: 'caption-sub', text: o.sub }));
      els.caption.appendChild(c);
      var ms = o.ms == null ? 1800 : o.ms;
      if (!ms) return Promise.resolve();
      return Lab.tween.wait(ms / 1000).promise.then(function () { c.classList.add('leaving'); return Lab.tween.wait(0.35).promise; }).then(function () { if (c.parentNode) c.parentNode.removeChild(c); });
    },
    clearCaption: function () { U.clear(els.caption); },

    /* ----- dialogs ----- */
    modal: function (content, o) {
      o = o || {};
      var back = U.el('div', { class: 'modal-back' });
      var card = U.el('div', { class: 'modal-card' + (o.wide ? ' wide' : ''), attrs: { role: 'dialog', 'aria-modal': 'true' } });
      if (o.title) card.appendChild(U.el('h2', { class: 'modal-title', text: o.title }));
      card.appendChild(content);
      back.appendChild(card);
      var entry = { back: back, close: null };
      function close() {
        var i = modalStack.indexOf(entry); if (i < 0) return;
        modalStack.splice(i, 1);
        if (back.parentNode) back.parentNode.removeChild(back);
        Lab.drag.suspend(-1);
        if (o.onClose) o.onClose();
      }
      entry.close = close;
      if (!o.static) back.addEventListener('pointerdown', function (e) { if (e.target === back) close(); });
      Lab.drag.suspend(1);
      modalStack.push(entry);
      els['modal-root'].appendChild(back);
      var f = card.querySelector('[data-autofocus]') || card.querySelector('button');
      if (f) setTimeout(function () { f.focus(); }, 30);
      return { close: close, card: card };
    },
    /* confirm({text, okLabel, cancelLabel}) → Promise<boolean>. Cancel is the safe default. */
    confirm: function (o) {
      return new Promise(function (resolve) {
        var done = false, m;
        function end(v) { if (done) return; done = true; m.close(); resolve(v); }
        var body = U.el('div', { class: 'confirm-body' },
          U.el('p', { class: 'confirm-text', text: o.text }),
          U.el('div', { class: 'confirm-actions' },
            U.el('button', { class: 'btn btn-ghost', text: o.cancelLabel || 'HỦY', attrs: { 'data-autofocus': '1' }, on: { click: function () { end(false); } } }),
            U.el('button', { class: 'btn btn-orange', text: o.okLabel || 'ĐỒNG Ý', on: { click: function () { end(true); } } })));
        m = UI.modal(body, { static: false, onClose: function () { end(false); } });
        m.card.addEventListener('keydown', function (e) { if (e.key === 'Escape') end(false); });
      });
    },
    closeModals: function () { modalStack.slice().forEach(function (m) { m.close(); }); modalStack.length = 0; },

    /* ----- thermostat: [−] 28°C [+] with press-and-hold. o:{value,min,max,step,label,fixedNote,onChange} ----- */
    thermostat: function (o) {
      var min = o.min == null ? 0 : o.min, max = o.max == null ? 60 : o.max, val = o.value, locked = false, fixed = false, lockedMsg = '', noteTimer = null;
      var lcd = U.el('div', { class: 'lcd-value', text: val + '°C' });
      var fill = U.el('div', { class: 'thermo-fill' });
      var minus = U.el('button', { class: 'btn btn-round', text: '−', attrs: { 'aria-label': 'Giảm nhiệt độ' } });
      var plus = U.el('button', { class: 'btn btn-round', text: '+', attrs: { 'aria-label': 'Tăng nhiệt độ' } });
      var note = U.el('div', { class: 'thermo-note' });
      var root = U.el('div', { class: 'thermo' },
        o.label ? U.el('div', { class: 'thermo-title', text: o.label }) : null,
        U.el('div', { class: 'thermo-row' }, minus,
          U.el('div', { class: 'lcd' }, lcd, U.el('div', { class: 'thermo-bar' }, fill)), plus),
        note);
      function paint() {
        lcd.textContent = val + '°C';
        fill.style.width = ((val - min) / (max - min) * 100) + '%';
        var hue = 215 - (val - min) / (max - min) * 215;      // blue (cold) → red (hot); purely decorative
        fill.style.background = 'hsl(' + hue + ',85%,55%)';
        minus.classList.toggle('is-locked', locked || val <= min); plus.classList.toggle('is-locked', locked || val >= max);
        root.classList.toggle('locked', locked || fixed);
      }
      function showNote(msg) {
        note.textContent = msg; note.classList.add('show'); Lab.audio.play('wrong');
        clearTimeout(noteTimer); noteTimer = setTimeout(function () { note.classList.remove('show'); }, 3200);
      }
      function bump(d) {
        if (locked) { if (lockedMsg) showNote(lockedMsg); return; }
        if (fixed) { if (o.fixedNote) showNote(o.fixedNote); return; }
        var nv = U.clamp(val + d, min, max);
        if (nv === val) return;
        val = nv; paint(); Lab.audio.play('tick');
        if (o.onChange) o.onChange(val);
      }
      function hold(btn, d) {
        var t1, t2;
        function stop() { clearTimeout(t1); clearInterval(t2); }
        btn.addEventListener('pointerdown', function (e) {
          e.preventDefault(); bump(d);
          t1 = setTimeout(function () { var n = 0; t2 = setInterval(function () { n++; bump(d * (n > 12 ? 3 : 1)); }, 85); }, 380);
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { btn.addEventListener(ev, stop); });
        btn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bump(d); } });
      }
      hold(minus, -(o.step || 1)); hold(plus, (o.step || 1));
      paint();
      return {
        el: root,
        get value() { return val; },
        setValue: function (v) { val = U.clamp(v, min, max); paint(); },
        setLocked: function (b, msg) { locked = !!b; lockedMsg = locked ? (msg || '') : ''; if (!locked) note.classList.remove('show'); paint(); },
        setFixed: function (b) { fixed = !!b; paint(); }
      };
    },

    /* remove everything that belongs to the previous experiment */
    clearDynamic: function () {
      UI.bottomInset = 136;
      U.clear(els.toasts); U.clear(els.caption); U.clear(els.tray); U.clear(els.progress); U.clear(els.panel);
      els.panel.classList.add('hidden'); els.panel.classList.remove('wide');
      UI.closeModals();
      document.body.classList.remove('is-dragging-item');
      Array.prototype.slice.call(document.querySelectorAll('.drag-ghost')).forEach(function (g) { g.parentNode.removeChild(g); });
    }
  };
})(window.Lab);
