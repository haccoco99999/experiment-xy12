/* Lab.ui – everything around the 3D picture: top bar, progress bar, tool tray, side panel, toasts, big
   captions, dialogs, and the thermostat widget. Plain DOM, styled by css/app.css. */
(function (Lab) {
  'use strict';
  var U = Lab.util;
  var els = {}, modalStack = [], modalSeq = 0, inertState = [];

  var TOAST_EMOJI = { ok: '✅', warn: '💡', info: '💬' };

  function focusable(root) {
    return Array.prototype.slice.call(root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(function (el) {
      return !el.hidden && !el.closest('[hidden],[aria-hidden="true"]');
    });
  }
  function focusNode(node) {
    if (!node) return;
    try { node.focus({ preventScroll: true }); } catch (err) { try { node.focus(); } catch (ignored) { /* ignore */ } }
  }
  function lockPage() {
    if (inertState.length) return;
    var root = els['modal-root'] && els['modal-root'].parentNode;
    if (!root) root = document.body;
    Array.prototype.slice.call(root.children).forEach(function (node) {
      if (node === els['modal-root']) return;
      inertState.push({ node: node, inert: node.inert, hadInert: node.hasAttribute('inert'), ariaHidden: node.getAttribute('aria-hidden') });
      try { node.inert = true; } catch (err) { node.setAttribute('inert', ''); }
      node.setAttribute('aria-hidden', 'true');
    });
    document.body.classList.add('has-modal');
  }
  function unlockPage() {
    if (modalStack.length) return;
    inertState.forEach(function (s) {
      try { s.node.inert = !!s.inert; } catch (err) { /* ignore */ }
      if (!s.hadInert) s.node.removeAttribute('inert'); else s.node.setAttribute('inert', '');
      if (s.ariaHidden == null) s.node.removeAttribute('aria-hidden'); else s.node.setAttribute('aria-hidden', s.ariaHidden);
    });
    inertState = [];
    document.body.classList.remove('has-modal');
  }
  function topModal() { return modalStack[modalStack.length - 1] || null; }
  function trapModal(entry, e) {
    if (topModal() !== entry) return;
    if (e.key === 'Escape') { e.preventDefault(); entry.close(); return; }
    if (e.key !== 'Tab') return;
    var list = focusable(entry.card);
    if (!list.length) { e.preventDefault(); focusNode(entry.card); return; }
    var first = list[0], last = list[list.length - 1], current = document.activeElement;
    var currentIsControl = list.indexOf(current) >= 0;
    if (e.shiftKey && (current === first || !currentIsControl)) { e.preventDefault(); focusNode(last); }
    else if (!e.shiftKey && (current === last || !currentIsControl)) { e.preventDefault(); focusNode(first); }
  }

  var UI = Lab.ui = {
    el: els,
    bottomInset: 136,
    onReset: null, onHelp: null, onHome: null,

    init: function () {
      ['home', 'lab', 'stage', 'hud', 'topbar', 'lab-title', 'progress', 'tray', 'panel', 'labels', 'zones', 'toasts', 'caption',
        'btn-reset', 'btn-home', 'btn-motion', 'btn-help', 'btn-sound', 'quality-select', 'modal-root'].forEach(function (id) { els[id] = document.getElementById(id); });
      els['btn-reset'].addEventListener('click', function () { if (UI.onReset) UI.onReset(); });
      els['btn-home'].addEventListener('click', function () { if (UI.onHome) UI.onHome(); });
      els['btn-motion'].addEventListener('click', function () {
        var paused = !Lab.loop.isPaused();
        Lab.loop.setPaused(paused);
        U.store.set('motion', paused ? 'paused' : 'running');
        UI.refreshMotion(paused);
        UI.toast(paused ? 'Đã tạm dừng hoạt cảnh.' : 'Hoạt cảnh đã tiếp tục.', { type: 'info' });
      });
      els['btn-help'].addEventListener('click', function () { if (UI.onHelp) UI.onHelp(); });
      els['btn-sound'].addEventListener('click', function () { UI.refreshSound(Lab.audio.toggle()); if (!Lab.audio.isMuted()) Lab.audio.play('ok'); });
      var savedQuality = U.store.get('quality', 'balanced');
      savedQuality = savedQuality === 'light' || savedQuality === 'balanced' || savedQuality === 'high' ? savedQuality : 'balanced';
      els['quality-select'].value = savedQuality;
      if (Lab.stage && Lab.stage.setQuality) Lab.stage.setQuality(savedQuality, true);
      var paused = U.store.get('motion', 'running') === 'paused';
      Lab.loop.setPaused(paused);
      UI.refreshMotion(paused);
      els['quality-select'].addEventListener('change', function () {
        var q = els['quality-select'].value;
        U.store.set('quality', q);
        if (Lab.stage && Lab.stage.setQuality) Lab.stage.setQuality(q);
      });
      UI.refreshSound(Lab.audio.isMuted());
      window.addEventListener('resize', function () { UI.fitStage(); });
    },
    refreshSound: function (muted) {
      els['btn-sound'].textContent = muted ? '🔇' : '🔊';
      els['btn-sound'].setAttribute('aria-label', muted ? 'Bật âm thanh' : 'Tắt âm thanh');
    },
    refreshMotion: function (paused) {
      var button = els['btn-motion'], label = paused ? 'Tiếp tục hoạt cảnh' : 'Tạm dừng hoạt cảnh';
      button.textContent = paused ? '▶️' : '⏸️';
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', paused ? 'true' : 'false');
      button.title = label;
    },

    setExperiment: function (exp, displayTitle, displayLocale) {
      var title = displayTitle || exp.title;
      els['lab-title'].textContent = title;
      els['lab-title'].title = title;
      els['lab-title'].lang = displayLocale || 'vi';
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
        var card = U.el('button', { class: 'card', attrs: { type: 'button', 'data-id': it.id } });
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
      var unavailable = c.classList.contains('is-disabled') || c.classList.contains('is-ghost');
      c.setAttribute('aria-disabled', unavailable ? 'true' : 'false');
    },
    hideTray: function () { els.tray.classList.add('hidden'); UI.fitStage(); },

    /* ----- side panel (thermostat, start button, results…) ----- */
    setPanel: function (node) {
      var active = document.activeElement;
      var savedFocus = active && els.panel.contains(active) ? {
        tag: active.tagName,
        id: active.id || '',
        action: active.getAttribute && active.getAttribute('data-scene-action') || '',
        label: active.getAttribute && active.getAttribute('aria-label') || '',
        name: active.getAttribute && active.getAttribute('name') || '',
        text: active.textContent ? active.textContent.trim() : ''
      } : null;
      U.clear(els.panel);
      if (node) { els.panel.appendChild(node); els.panel.classList.remove('hidden'); }
      else els.panel.classList.add('hidden');
      UI.fitStage();
      if (savedFocus) {
        var candidates = Array.prototype.slice.call(els.panel.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]'));
        var target = candidates.filter(function (candidate) {
          return savedFocus.id && candidate.id === savedFocus.id;
        })[0] || candidates.filter(function (candidate) {
          return savedFocus.action && candidate.getAttribute('data-scene-action') === savedFocus.action;
        })[0] || candidates.filter(function (candidate) {
          return savedFocus.label && candidate.getAttribute('aria-label') === savedFocus.label;
        })[0] || candidates.filter(function (candidate) {
          return savedFocus.name && candidate.getAttribute('name') === savedFocus.name;
        })[0] || candidates.filter(function (candidate) {
          return candidate.tagName === savedFocus.tag && candidate.textContent.trim() === savedFocus.text;
        })[0] || candidates[0];
        target = target || els.panel;
        if (!target.hasAttribute('tabindex') && target === els.panel) target.setAttribute('tabindex', '-1');
        try { target.focus({ preventScroll: true }); } catch (err) { target.focus(); }
      }
    },
    panelWide: function (wide) { els.panel.classList.toggle('wide', !!wide); UI.fitStage(); },

    /* keep the 3D picture centred in the free space between the tray and the side panel */
    fitStage: function () {
      if (!Lab.stage || !Lab.stage.ok) return;
      var vw = window.innerWidth, vh = window.innerHeight, hudTop = els.progress.getBoundingClientRect().bottom;
      var portrait = vw <= 820 && vh > vw;
      var trayRect = els.tray.getBoundingClientRect();
      var panelRect = els.panel.getBoundingClientRect();
      var trayVisible = !els.tray.classList.contains('hidden') && trayRect.width > 0 && trayRect.height > 0;
      var panelVisible = !els.panel.classList.contains('hidden') && !!els.panel.firstChild && panelRect.width > 0 && panelRect.height > 0;
      var tray = !portrait && trayVisible ? trayRect.right : 0;
      var panel = !portrait && panelVisible ? vw - panelRect.left : 0;
      var bottom = portrait ? Math.max(0, vh - Math.min(trayVisible ? trayRect.top : vh, panelVisible ? panelRect.top : vh)) : UI.bottomInset;
      var fitKey = [vw, vh, hudTop, tray, panel, bottom, portrait].join('|');
      if (fitKey === UI._fitKey) return;
      UI._fitKey = fitKey;
      // keep a strip along the bottom free for the name cards under the pots and the reset button
      var changed = Lab.stage.setInsets(tray, hudTop, panel, bottom);
      // messages and big captions are centred on the free area, not on the whole screen
      if (portrait) {
        els.toasts.style.left = '50%';
        els.toasts.style.width = Math.max(260, Math.min(600, vw - 24)) + 'px';
        els.caption.style.left = '8px'; els.caption.style.right = '8px';
        els.caption.style.bottom = Math.max(0, bottom) + 'px';
      } else {
        var free = vw - tray - panel;
        els.toasts.style.left = (tray + free / 2) + 'px';
        els.toasts.style.width = Math.max(260, Math.min(600, free - 24)) + 'px';
        els.caption.style.left = tray + 'px'; els.caption.style.right = panel + 'px';
        els.caption.style.bottom = '0';
      }
      if (changed) Lab.stage.refit();
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
      var titleId = 'modal-title-' + (++modalSeq);
      var card = U.el('div', { class: 'modal-card' + (o.wide ? ' wide' : ''), attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId, tabindex: '-1' } });
      card.appendChild(U.el('h2', { class: 'modal-title' + (o.title ? '' : ' visually-hidden'), attrs: { id: titleId }, text: o.title || o.ariaLabel || 'Thông báo' }));
      card.appendChild(content);
      back.appendChild(card);
      var entry = { back: back, card: card, previousFocus: document.activeElement, close: null };
      function close() {
        var i = modalStack.indexOf(entry); if (i < 0) return;
        modalStack.splice(i, 1);
        document.removeEventListener('keydown', entry.onKeydown, true);
        document.removeEventListener('focusin', entry.onFocusIn, true);
        if (back.parentNode) back.parentNode.removeChild(back);
        Lab.drag.suspend(-1);
        unlockPage();
        if (o.onClose) o.onClose();
        var next = topModal();
        focusNode(next ? next.card : (entry.previousFocus && entry.previousFocus.isConnected ? entry.previousFocus : null));
      }
      entry.close = close;
      entry.onKeydown = function (e) { trapModal(entry, e); };
      entry.onFocusIn = function (e) {
        var top = topModal();
        if (top === entry && !card.contains(e.target)) focusNode(focusable(card)[0] || card);
      };
      if (!o.static) back.addEventListener('pointerdown', function (e) { if (e.target === back) close(); });
      Lab.drag.suspend(1);
      modalStack.push(entry);
      els['modal-root'].appendChild(back);
      var available = focusable(card);
      var preferred = card.querySelector('[data-autofocus]');
      var f = preferred && available.indexOf(preferred) >= 0 ? preferred : available[0] || card;
      focusNode(f);
      lockPage();
      document.addEventListener('keydown', entry.onKeydown, true);
      document.addEventListener('focusin', entry.onFocusIn, true);
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
        fill.style.transform = 'scaleX(' + ((val - min) / (max - min)) + ')';
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
      UI._fitKey = '';
      document.body.classList.remove('is-dragging-item');
      Array.prototype.slice.call(document.querySelectorAll('.drag-ghost')).forEach(function (g) { g.parentNode.removeChild(g); });
    }
  };
})(window.Lab);
