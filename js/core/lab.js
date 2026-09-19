/* Lab – shared namespace + small utilities. Loaded first. Plain script (no modules) so the site
   opens by double-click. Everything else hangs off the single global `Lab`. */
(function (root) {
  'use strict';
  var Lab = root.Lab = root.Lab || {};
  ['logic', 'content', 'models', 'experiments'].forEach(function (k) { Lab[k] = Lab[k] || {}; });

  var U = Lab.util = {};
  U.debug = /[?&]debug=1/.test((root.location && root.location.search) || '');

  U.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  U.clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  U.lerp = function (a, b, t) { return a + (b - a) * t; };
  U.smoothstep = function (a, b, x) { var t = U.clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  U.map = function (v, a, b, c, d) { return c + (d - c) * ((v - a) / (b - a)); };

  /* Small seeded random generator (mulberry32) so procedural art is identical on every run. */
  U.rng = function (seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  U.hash = function (str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };

  /* Tiny DOM helper: el('div', {class:'x', text:'hi', on:{click:fn}, style:{...}, attrs:{...}}, child, child…) */
  U.el = function (tag, props) {
    var node = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v == null) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'on') Object.keys(v).forEach(function (ev) { node.addEventListener(ev, v[ev]); });
      else if (k === 'style') Object.keys(v).forEach(function (s) { node.style[s] = v[s]; });
      else if (k === 'attrs') Object.keys(v).forEach(function (a) { node.setAttribute(a, v[a]); });
      else node[k] = v;
    });
    function add(c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) { c.forEach(add); return; }          // lists of children are flattened
      node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    }
    for (var i = 2; i < arguments.length; i++) add(arguments[i]);
    return node;
  };
  U.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  U.qs = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  U.qsa = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  U.clear = function (node) { while (node && node.firstChild) node.removeChild(node.firstChild); };
  U.store = {
    get: function (k, d) { try { var v = localStorage.getItem('lab.' + k); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('lab.' + k, v); } catch (e) { /* private mode etc. */ } }
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
