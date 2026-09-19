/* Lab.mat – materials and canvas-generated textures. Nothing is loaded from disk: every texture is
   painted in code, so the site works from a double-click (browsers block image files on file://). */
(function (Lab) {
  'use strict';
  var U = Lab.util, T = window.THREE;
  var cache = {};

  function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tex(c, o) {
    o = o || {};
    var t = new T.CanvasTexture(c);
    t.colorSpace = o.linear ? T.NoColorSpace : T.SRGBColorSpace;
    t.anisotropy = 4;
    if (o.repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(o.repeat[0], o.repeat[1]); }
    t.userData = { shared: true };
    return t;
  }
  function once(key, fn) { return cache[key] || (cache[key] = fn()); }

  /* ---------- palette (from the earlier "Bio-Explorer Lab" design tokens + natural colours) ---------- */
  var C = {
    terracotta: 0xc9693f, terracottaDark: 0xa4502f, stem: 0x5cab4a, leaf: 0x4fa83f, leafLight: 0x8ccb45,
    water: 0x59bff2, wood: 0xc08a57, black: 0x22242a, plasticBlue: 0x2f86de, plasticGreen: 0x2fb36a,
    yellow: 0xffd24a, orange: 0xf29a2e, red: 0xe5533d, cream: 0xf6ecd8, white: 0xffffff, pink: 0xf59bb8,
    root: 0xf3ead2, sky: 0x6fb8ff
  };

  /* ---------- drawing helpers ---------- */
  function noiseSpeckles(g, w, h, R, n, colors, rmin, rmax, alpha) {
    for (var i = 0; i < n; i++) {
      g.globalAlpha = alpha * (0.4 + R() * 0.6);
      g.fillStyle = colors[(R() * colors.length) | 0];
      g.beginPath();
      g.arc(R() * w, R() * h, rmin + R() * (rmax - rmin), 0, 6.283);
      g.fill();
    }
    g.globalAlpha = 1;
  }

  function drawWood() {
    var W = 1024, H = 512, c = mk(W, H), g = c.getContext('2d'), R = U.rng(7), planks = 6, ph = H / planks;
    for (var p = 0; p < planks; p++) {
      var y0 = p * ph;
      g.fillStyle = 'hsl(' + (27 + R() * 6) + ',' + (46 + R() * 8) + '%,' + (52 + R() * 6) + '%)';
      g.fillRect(0, y0, W, ph);
      for (var i = 0; i < 52; i++) {
        var yy = y0 + R() * ph, amp = 1 + R() * 3.2, ph0 = R() * 6.28, fr = 0.004 + R() * 0.011;
        g.strokeStyle = 'rgba(' + ((92 + R() * 30) | 0) + ',' + ((52 + R() * 20) | 0) + ',22,' + (0.05 + R() * 0.17) + ')';
        g.lineWidth = 0.6 + R() * 1.9;
        g.beginPath();
        for (var x = 0; x <= W; x += 16) { var y = yy + Math.sin(x * fr + ph0) * amp; if (x === 0) g.moveTo(x, y); else g.lineTo(x, y); }
        g.stroke();
      }
      if (R() < 0.7) { // a knot with rings
        var kx = 80 + R() * (W - 160), ky = y0 + ph * (0.3 + R() * 0.4);
        for (var r = 4; r > 0; r--) {
          g.strokeStyle = 'rgba(80,42,16,' + (0.12 + (4 - r) * 0.07) + ')'; g.lineWidth = 1.5;
          g.beginPath(); g.ellipse(kx, ky, 8 * r + 4, 3 * r + 2, 0, 0, 6.283); g.stroke();
        }
      }
      g.fillStyle = 'rgba(60,32,12,0.55)'; g.fillRect(0, y0, W, 3);
      g.fillStyle = 'rgba(255,232,190,0.20)'; g.fillRect(0, y0 + 3, W, 2);
    }
    return tex(c);
  }

  function drawGrass() {
    var S = 512, c = mk(S, S), g = c.getContext('2d'), R = U.rng(11);
    g.fillStyle = '#7dbb4c'; g.fillRect(0, 0, S, S);
    for (var i = 0; i < 26; i++) { // soft macro blotches
      var gr = g.createRadialGradient(R() * S, R() * S, 4, R() * S, R() * S, 90 + R() * 80);
      var x = R() * S, y = R() * S, rr = 60 + R() * 110, dark = R() < 0.5;
      gr = g.createRadialGradient(x, y, 2, x, y, rr);
      gr.addColorStop(0, dark ? 'rgba(60,120,40,0.35)' : 'rgba(170,220,100,0.32)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
    }
    var cols = ['#5da33a', '#6db544', '#8fcf58', '#a5d968', '#4f9532'];
    for (i = 0; i < 5200; i++) {
      var bx = R() * S, by = R() * S, len = 5 + R() * 9, ang = -1.57 + (R() - 0.5) * 0.9;
      g.strokeStyle = cols[(R() * cols.length) | 0]; g.globalAlpha = 0.55 + R() * 0.4; g.lineWidth = 1 + R() * 1.4;
      g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(ang) * len, by + Math.sin(ang) * len); g.stroke();
    }
    g.globalAlpha = 1;
    return tex(c, { repeat: [26, 26] });
  }

  function drawSky() {
    var c = mk(2, 512), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, '#4fa6ff'); gr.addColorStop(0.32, '#8fcaff'); gr.addColorStop(0.58, '#cdeaff');
    gr.addColorStop(0.78, '#f2fbff'); gr.addColorStop(1, '#e4f2df');
    g.fillStyle = gr; g.fillRect(0, 0, 2, 512);
    return tex(c);
  }

  function drawBlob() {
    var c = mk(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    gr.addColorStop(0, 'rgba(20,14,8,0.55)'); gr.addColorStop(0.55, 'rgba(20,14,8,0.22)'); gr.addColorStop(1, 'rgba(20,14,8,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return tex(c);
  }

  function drawGlow() {
    var c = mk(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 2, 64, 64, 62);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return tex(c);
  }

  /* Grey-scale leaf shading + veins. The real colour comes from material.color, so a leaf can turn from
     green to yellow to brown just by tinting. Base of the leaf is at the bottom of the canvas (v = 0). */
  function drawLeaf(kind) {
    var W = 128, H = 256, c = mk(W, H), g = c.getContext('2d'), R = U.rng(U.hash('leaf' + kind));
    var gr = g.createLinearGradient(0, 0, W, 0);
    gr.addColorStop(0, '#b9b9b9'); gr.addColorStop(0.5, '#ffffff'); gr.addColorStop(1, '#b9b9b9');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    var gv = g.createLinearGradient(0, 0, 0, H);
    gv.addColorStop(0, 'rgba(255,255,255,0.18)'); gv.addColorStop(1, 'rgba(0,0,0,0.16)');
    g.fillStyle = gv; g.fillRect(0, 0, W, H);
    noiseSpeckles(g, W, H, R, 400, ['#e8e8e8', '#cfcfcf', '#f7f7f7'], 0.6, 2.2, 0.22);
    var veins = kind === 'cabbage' ? 9 : 6;
    g.lineCap = 'round';
    for (var side = -1; side <= 1; side += 2) {
      for (var i = 1; i <= veins; i++) {
        var y0 = H - (i / (veins + 1)) * H * 0.95, x1 = W / 2 + side * (W * (0.36 + R() * 0.08)), y1 = y0 - H * 0.11;
        g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = kind === 'cabbage' ? 3 : 2;
        g.beginPath(); g.moveTo(W / 2, y0); g.quadraticCurveTo(W / 2 + side * W * 0.2, y0 - H * 0.02, x1, y1); g.stroke();
        g.strokeStyle = 'rgba(0,0,0,0.10)'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(W / 2 + 1, y0 + 1); g.quadraticCurveTo(W / 2 + side * W * 0.2, y0 - H * 0.02 + 1, x1, y1 + 1); g.stroke();
      }
    }
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = kind === 'cabbage' ? 7 : 4;
    g.beginPath(); g.moveTo(W / 2, H); g.lineTo(W / 2, 6); g.stroke();
    return tex(c);
  }

  function drawNoise(seed, base, spread) {
    var c = mk(128, 128), g = c.getContext('2d'), R = U.rng(seed);
    g.fillStyle = base; g.fillRect(0, 0, 128, 128);
    noiseSpeckles(g, 128, 128, R, 900, ['#ffffff', '#000000', '#888888'], 0.5, 2.6, spread);
    return tex(c, { repeat: [2, 2] });
  }

  /* Soil / gravel, painted per state. kind: 'face' (the cut side of the pot, darker at the bottom) or 'top'. */
  var SOIL = {
    rich:        { base: '#5b3a24', bits: ['#2b180c', '#8a6a44', '#c9b89b', '#3d2515'] },
    moist:       { base: '#3d2517', bits: ['#1b0f07', '#6b4a2f', '#94836b', '#2c1a0f'] },
    dry:         { base: '#b58e62', bits: ['#7d5d3b', '#e3caa1', '#a37b53', '#cfae82'] },
    gravel:      { base: '#4a4741' },
    gravelMoist: { base: '#3a3833' },
    soggy:       { base: '#4a3620', bits: ['#211a0e', '#74704a', '#8a9a62', '#34260f'] },
    frozen:      { base: '#6b6f7a', bits: ['#dfe9f5', '#a9bdd6', '#4d5563', '#f4f9ff'] }
  };
  function drawSoil(state, kind) {
    var S = 256, c = mk(S, S), g = c.getContext('2d'), R = U.rng(U.hash('soil' + state + kind)), d = SOIL[state] || SOIL.rich;
    g.fillStyle = d.base; g.fillRect(0, 0, S, S);
    if (state === 'gravel' || state === 'gravelMoist') {
      var wet = state === 'gravelMoist', cols = wet
        ? ['#77746c', '#8a8378', '#6a675f', '#9a8f7d', '#5d5b56']
        : ['#c7c2b6', '#b3ac9c', '#d9d2c2', '#a49c8c', '#8f8a80', '#cbb79a'];
      var pebbles = [];
      for (var i = 0; i < 420; i++) pebbles.push({ x: R() * S, y: R() * S, r: 6 + R() * 9, c: cols[(R() * cols.length) | 0], a: R() * 3 });
      pebbles.sort(function (a, b) { return a.y - b.y; });
      pebbles.forEach(function (p) {
        var gr = g.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.35, 1, p.x, p.y, p.r * 1.05);
        gr.addColorStop(0, wet ? '#b5aa98' : '#f1ece0'); gr.addColorStop(0.55, p.c); gr.addColorStop(1, wet ? '#39372f' : '#5f5a50');
        g.fillStyle = gr; g.beginPath(); g.ellipse(p.x, p.y, p.r, p.r * (0.7 + R() * 0.25), p.a, 0, 6.283); g.fill();
      });
    } else {
      noiseSpeckles(g, S, S, R, 1500, d.bits, 0.6, 2.8, 0.7);
      noiseSpeckles(g, S, S, R, 60, ['#f3f0e6'], 1.2, 2.6, 0.55); // perlite dots
      if (state === 'moist' || state === 'soggy') { // glossy wet highlights
        g.fillStyle = 'rgba(255,255,255,0.10)';
        for (var k = 0; k < 40; k++) { g.beginPath(); g.ellipse(R() * S, R() * S, 3 + R() * 6, 1 + R() * 2, R() * 3, 0, 6.283); g.fill(); }
      }
      if (state === 'soggy') { g.fillStyle = 'rgba(120,150,90,0.35)'; for (k = 0; k < 24; k++) { g.beginPath(); g.arc(R() * S, R() * S, 3 + R() * 9, 0, 6.283); g.fill(); } }
      if (state === 'dry') { // cracks
        for (var n = 0; n < 11; n++) {
          var x = R() * S, y = kind === 'face' ? R() * S * 0.25 : R() * S, ang = 1.2 + (R() - 0.5) * 1.2;
          for (var pass = 0; pass < 2; pass++) {
            g.strokeStyle = pass ? 'rgba(235,205,165,0.55)' : 'rgba(58,38,20,0.85)'; g.lineWidth = pass ? 1 : 2.6;
            var cx = x, cy = y, a = ang; g.beginPath(); g.moveTo(cx + pass, cy + pass);
            var rr = U.rng(n * 17 + 5);
            for (var s = 0; s < 14; s++) { a += (rr() - 0.5) * 0.9; cx += Math.cos(a) * 12; cy += Math.sin(a) * 12; g.lineTo(cx + pass, cy + pass); }
            g.stroke();
          }
        }
      }
      if (state === 'frozen') { g.fillStyle = 'rgba(235,245,255,0.35)'; g.fillRect(0, 0, S, S); }
    }
    if (kind === 'face') { // cut face gets a little darker with depth
      var gv = g.createLinearGradient(0, 0, 0, S);
      gv.addColorStop(0, 'rgba(0,0,0,0)'); gv.addColorStop(1, 'rgba(0,0,0,0.30)');
      g.fillStyle = gv; g.fillRect(0, 0, S, S);
    }
    return tex(c);
  }

  function drawCondensation() {
    var S = 512, c = mk(S, S), g = c.getContext('2d'), R = U.rng(99);
    for (var i = 0; i < 210; i++) {                       // droplets of different sizes; a few run down as drips
      var x = R() * S, y = R() * S, big = R() < 0.18, r = big ? 7 + R() * 9 : 3 + R() * 6, len = big ? 1.6 + R() * 1.6 : 1 + R() * 0.4;
      var gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 0.5, x, y, r * len);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.55, 'rgba(205,232,255,0.7)'); gr.addColorStop(1, 'rgba(160,205,240,0.25)');
      g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r, r * len, 0, 0, 6.283); g.fill();
    }
    var t = tex(c); t.wrapS = t.wrapT = T.RepeatWrapping; return t;
  }

  /* Text painted on a texture (labels on bags, etc.). Call after fonts are ready. */
  function textTexture(lines, o) {
    o = o || {};
    var W = o.w || 256, H = o.h || 256, c = mk(W, H), g = c.getContext('2d');
    if (o.bg) { g.fillStyle = o.bg; g.fillRect(0, 0, W, H); }
    g.fillStyle = o.fg || '#222'; g.textAlign = 'center'; g.textBaseline = 'middle';
    var arr = Array.isArray(lines) ? lines : [lines];
    var size = o.size || 64, lh = size * 1.15, y0 = H / 2 - ((arr.length - 1) * lh) / 2;
    g.font = (o.weight || 800) + ' ' + size + "px Quicksand, 'Segoe UI', sans-serif";
    arr.forEach(function (ln, i) { g.fillText(ln, W / 2, y0 + i * lh); });
    return tex(c);
  }

  Lab.mat = {
    C: C,
    std: function (color, o) {
      o = o || {};
      return new T.MeshStandardMaterial(Object.assign({ color: color, roughness: 0.62, metalness: 0.0 }, o));
    },
    basic: function (color, o) { return new T.MeshBasicMaterial(Object.assign({ color: color }, o || {})); },
    clearPlastic: function (o) {
      return new T.MeshStandardMaterial(Object.assign({
        color: 0xe6f6ff, transparent: true, opacity: 0.2, roughness: 0.06, metalness: 0.0,
        side: T.DoubleSide, depthWrite: false, envMapIntensity: 1.6
      }, o || {}));
    },
    textTexture: textTexture,
    tex: {
      wood: function () { return once('wood', drawWood); },
      grass: function () { return once('grass', drawGrass); },
      sky: function () { return once('sky', drawSky); },
      blob: function () { return once('blob', drawBlob); },
      glow: function () { return once('glow', drawGlow); },
      leaf: function (kind) { return once('leaf' + (kind || 'bean'), function () { return drawLeaf(kind || 'bean'); }); },
      soil: function (state, kind) { return once('soil' + state + (kind || 'face'), function () { return drawSoil(state, kind || 'face'); }); },
      terracotta: function () { return once('terra', function () { return drawNoise(21, '#e9e9e9', 0.5); }); },
      plastic: function () { return once('plastic', function () { return drawNoise(33, '#f2f2f2', 0.25); }); },
      condensation: function () { return once('cond', drawCondensation); }
    }
  };
})(window.Lab);
