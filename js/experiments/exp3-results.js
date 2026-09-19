/* Experiment 3 – the result panel: comparison table (md section 37), analysis of cage 2 (sections 38 and 50),
   conclusion (section 39) and the "THÍ NGHIỆM HOÀN THÀNH!" tab (sections 57 and 58). Plain DOM, no 3D. */
(function (Lab) {
  'use strict';
  var U = Lab.util, L = Lab.logic.exp3, CT = Lab.content.exp3, MD = CT.md, APP = CT.app;
  function esc(s) { return U.esc(s); }

  /* how cage 2 ended, in one line (the md's own words wherever it has them) */
  function statusText(o) {
    if (o.level === 'healthy') return MD.temp.ideal.result;
    if (o.level === 'abnormal') return MD.temp.cool.result;
    if (o.level === 'dead') return MD.temp.hot.result;
    return APP.levelText[o.level];
  }
  /* "Gà đồng thời thiếu O₂, nước và thức ăn. Các yếu tố này cùng ảnh hưởng…" – lists every cause (md section 50) */
  function comboSentence(o) {
    var names = [];
    o.causes.forEach(function (c) { var n = APP.factorNames[c]; if (names.indexOf(n) < 0) names.push(n); });
    var list = names.length > 1 ? names.slice(0, -1).join(', ') + ' ' + APP.and + ' ' + names[names.length - 1] : names[0];
    return MD.combo.lead + ' ' + list + '. ' + MD.combo.tail;
  }
  function resultText(o) {
    if (o.key === 'healthy') return MD.compare.healthy;
    if (o.key === 'combo') return o.level === 'dead' ? MD.combo.dead : comboSentence(o);
    if (MD.obs[o.key]) return MD.obs[o.key].result;
    return MD.temp[o.key].result;
  }
  function list(lines) { return '<ul class="obs-list">' + lines.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }

  function compareTable(state, o) {
    var C = state.cage2, T = MD.compare;
    function cell(ok) { return '<td class="' + (ok ? 'good' : 'bad') + '">' + esc(ok ? '✓ ' + T.yes : '✕ ' + T.lack) + '</td>'; }
    var rows = ['food', 'water', 'oxygen', 'light'].map(function (k) { return '<tr><th>' + esc(T.rows[k]) + '</th><td class="good">' + esc('✓ ' + T.yes) + '</td>' + cell(C[k]) + '</tr>'; });
    rows.push('<tr><th>' + esc(T.rows.temperature) + '</th><td class="good">' + esc(T.temp1) + '</td><td>' + esc(C.temperature + '°C') + '</td></tr>');
    rows.push('<tr class="final"><th>' + esc(T.rows.result) + '</th><td class="good">' + esc(T.healthy) + '</td><td class="' + (o.level === 'healthy' ? 'good' : 'bad') + '">' + esc(resultText(o)) + '</td></tr>');
    return '<table class="result-table"><thead><tr>' + T.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  }

  /* "Yếu tố | Trạng thái | Ảnh hưởng" – every factor with what it does to the chick (md section 50) */
  function analysisTable(state, o) {
    var C = state.cage2, A = MD.analysis, others = o.causes.length > 0;
    var rows = ['food', 'water', 'oxygen', 'light'].map(function (k) {
      var have = C[k], eff = have ? ((k === 'food' || k === 'water') && others ? MD.analysis.stillHave[k] : A.effect[k].have) : A.effect[k].lack;
      return '<tr><th>' + esc(MD.factor[k]) + '</th><td class="' + (have ? 'good' : 'bad') + '">' + esc(have ? '✓ ' + A.yes : '✕ ' + A.lack) + '</td><td>' + esc(eff) + '</td></tr>';
    });
    var t = MD.temp[o.band];
    rows.push('<tr><th>' + esc(MD.factor.temperature) + '</th><td class="' + (o.band === 'ideal' ? 'good' : 'bad') + '">' + esc(C.temperature + '°C') + '</td><td>' + esc(o.band === 'ideal' ? A.goodTemp : t.result) + '</td></tr>');
    return '<table class="result-table analysis"><thead><tr>' + A.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  }

  /* what the chick does, one block per cause (md sections 25, 27–32) */
  function behaviourBlocks(o) {
    var html = '';
    if (o.key === 'healthy') return '<div class="obs-head">' + esc(MD.temp.ideal.result) + '</div>' + list(MD.cage1.behaviors.concat(MD.cage1.after));
    o.causes.forEach(function (c) {
      var ob = MD.obs[c];
      if (ob) {
        html += '<div class="obs-head">' + esc(ob.title) + '</div>' + list((ob.env || []).concat(ob.chick, ob.long ? [ob.long] : []));
        html += '<p class="result-note">' + esc(ob.result) + '</p>';
        if (ob.message) html += '<p class="result-note">' + esc(ob.message) + '</p>';
      } else {
        var tp = MD.temp[c];
        html += '<div class="obs-head">' + esc(tp.range + ' – ' + tp.result) + '</div>' + list([tp.look]);
      }
    });
    return html;
  }

  /* onDone() is called the first time the "Hoàn thành" tab is opened (confetti + fanfare) */
  function build(p) {
    var state = p.state, o = p.outcome, opened = false;
    var pane1 = U.el('div', { class: 'panel-card' }, U.el('div', { html: compareTable(state, o) }));
    var conclusion = U.el('div', { class: 'panel-card conclusion' },
      U.el('p', { class: 'result-note', text: MD.conclusion }), U.el('p', { class: 'keywords', text: MD.keywords }));
    var pane2 = U.el('div', { class: 'panel-card', hidden: true }, U.el('div', {
      html: '<div class="obs-head">' + esc(MD.analysis.title) + '</div>' + analysisTable(state, o) +
        '<div class="obs-head">' + esc(MD.analysis.after) + '</div>' + behaviourBlocks(o) + '<p class="result-note strong">' + esc(resultText(o)) + '</p>'
    }));
    var chips = MD.done.items.map(function (t, i) {
      return '<li><span class="ic">' + APP.icons[i] + '</span><span class="tx">' + esc(t) + '</span><span class="ok">✓</span></li>';
    }).join('');
    var pane3 = U.el('div', { class: 'panel-card done-card', hidden: true },
      U.el('div', { class: 'done-title', text: MD.done.title }), U.el('div', { class: 'done-sub', text: MD.done.sub }),
      U.el('ul', { class: 'done-list', html: chips }), U.el('p', { class: 'result-note strong', text: MD.done.conclusion }));
    var tabs = [[APP.compareTitle, '📊'], [APP.analysisTitle, '🔍'], [APP.doneTitle, '🏁']].map(function (t) { return U.el('button', { class: 'tab', text: t[1] + ' ' + t[0] }); });
    var panes = [pane1, pane2, pane3];
    function pick(i) {
      panes.forEach(function (pn, k) { pn.hidden = k !== i; tabs[k].classList.toggle('active', k === i); });
      conclusion.hidden = i === 2; Lab.audio.play('click');
      if (i === 2 && !opened) { opened = true; if (p.onDone) p.onDone(); }
    }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { pick(i); }); });
    tabs[0].classList.add('active');
    return U.el('div', { class: 'panel-stack r3' }, U.el('div', { class: 'tabs three' }, tabs), pane1, pane2, pane3, conclusion);
  }

  Lab.results3 = { build: build, statusText: statusText, resultText: resultText, comboSentence: comboSentence };
})(window.Lab);
