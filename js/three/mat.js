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
    if (o.name) t.name = o.name;
    t.userData = { shared: true, role: o.role || 'surface' };
    return t;
  }
  function once(key, fn) { return cache[key] || (cache[key] = fn()); }

  /* ---------- garden-lab palette: sunlit, friendly and easy to separate at a glance ---------- */
  var C = {
    terracotta: 0xc86f49, terracottaDark: 0xa24f31, stem: 0x55a646, leaf: 0x4a9f40, leafLight: 0x8bc75a,
    water: 0x4fb8e8, wood: 0xc58e59, black: 0x25282d, plasticBlue: 0x2f83d8, plasticGreen: 0x36ad71,
    yellow: 0xffd45a, orange: 0xf09a37, red: 0xe55743, cream: 0xf5ecd9, white: 0xffffff, pink: 0xf29ab7,
    root: 0xf3ead2, sky: 0x6eb5ec
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
    var W = 512, H = 256, c = mk(W, H), g = c.getContext('2d'), R = U.rng(7), planks = 5, ph = H / planks;
    for (var p = 0; p < planks; p++) {
      var y0 = p * ph;
      var board = g.createLinearGradient(0, y0, 0, y0 + ph);
      board.addColorStop(0, 'hsl(' + (28 + R() * 4) + ',' + (49 + R() * 7) + '%,' + (61 + R() * 4) + '%)');
      board.addColorStop(0.55, 'hsl(' + (26 + R() * 4) + ',' + (46 + R() * 8) + '%,' + (54 + R() * 5) + '%)');
      board.addColorStop(1, 'hsl(' + (24 + R() * 4) + ',' + (44 + R() * 8) + '%,' + (48 + R() * 5) + '%)');
      g.fillStyle = board;
      g.fillRect(0, y0, W, ph);
      for (var i = 0; i < 44; i++) {
        var yy = y0 + R() * ph, amp = 0.4 + R() * 2.2, ph0 = R() * 6.28, fr = 0.008 + R() * 0.022;
        g.strokeStyle = 'rgba(' + ((105 + R() * 24) | 0) + ',' + ((61 + R() * 18) | 0) + ',28,' + (0.055 + R() * 0.13) + ')';
        g.lineWidth = 0.45 + R() * 1.15;
        g.beginPath();
        for (var x = 0; x <= W; x += 10) { var y = yy + Math.sin(x * fr + ph0) * amp; if (x === 0) g.moveTo(x, y); else g.lineTo(x, y); }
        g.stroke();
      }
      if (R() < 0.62) {
        var kx = 55 + R() * (W - 110), ky = y0 + ph * (0.3 + R() * 0.4);
        for (var r = 4; r > 0; r--) {
          g.strokeStyle = 'rgba(82,43,19,' + (0.09 + (4 - r) * 0.055) + ')'; g.lineWidth = 1.1;
          g.beginPath(); g.ellipse(kx, ky, 5 * r + 3, 1.8 * r + 1.5, 0, 0, 6.283); g.stroke();
        }
      }
      g.fillStyle = 'rgba(73,39,17,0.48)'; g.fillRect(0, y0, W, 2);
      g.fillStyle = 'rgba(255,235,200,0.22)'; g.fillRect(0, y0 + 2, W, 1.5);
    }
    return tex(c, { name: 'garden-wood', role: 'wood' });
  }

  function drawGrass() {
    var S = 512, c = mk(S, S), g = c.getContext('2d'), R = U.rng(11);
    g.fillStyle = '#7eae4d'; g.fillRect(0, 0, S, S);
    for (var i = 0; i < 22; i++) {
      var x = R() * S, y = R() * S, rr = 55 + R() * 105, dark = R() < 0.52;
      var gr = g.createRadialGradient(x, y, 2, x, y, rr);
      gr.addColorStop(0, dark ? 'rgba(64,112,44,0.27)' : 'rgba(181,213,107,0.28)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
    }
    var cols = ['#5d963c', '#6ba344', '#91bf58', '#a5c969', '#4f8736'];
    for (i = 0; i < 3600; i++) {
      var bx = R() * S, by = R() * S, len = 4 + R() * 8, ang = -1.57 + (R() - 0.5) * 0.72;
      g.strokeStyle = cols[(R() * cols.length) | 0]; g.globalAlpha = 0.4 + R() * 0.38; g.lineWidth = 0.7 + R() * 1.05;
      g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(ang) * len, by + Math.sin(ang) * len); g.stroke();
    }
    g.globalAlpha = 1;
    return tex(c, { repeat: [19, 19], name: 'garden-grass', role: 'grass' });
  }

  function drawSky() {
    var c = mk(64, 512), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, '#58a9e7'); gr.addColorStop(0.34, '#93cbef'); gr.addColorStop(0.63, '#d3ecf6');
    gr.addColorStop(0.83, '#eef7e9'); gr.addColorStop(1, '#e7efd8');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 512);
    g.fillStyle = 'rgba(255,255,255,0.22)';
    g.beginPath(); g.ellipse(9, 255, 28, 13, -0.08, 0, 6.283); g.ellipse(39, 274, 39, 16, 0.04, 0, 6.283); g.fill();
    var haze = g.createLinearGradient(0, 330, 0, 512);
    haze.addColorStop(0, 'rgba(255,248,215,0)'); haze.addColorStop(1, 'rgba(255,245,211,0.22)');
    g.fillStyle = haze; g.fillRect(0, 330, 64, 182);
    return tex(c, { name: 'garden-sky', role: 'sky' });
  }

  function drawBlob() {
    var c = mk(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    gr.addColorStop(0, 'rgba(36,30,20,0.58)'); gr.addColorStop(0.32, 'rgba(36,30,20,0.34)');
    gr.addColorStop(0.68, 'rgba(36,30,20,0.12)'); gr.addColorStop(1, 'rgba(36,30,20,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return tex(c, { name: 'soft-contact-shadow', role: 'shadow' });
  }

  function drawGlow() {
    var c = mk(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 2, 64, 64, 62);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return tex(c, { name: 'soft-glow', role: 'glow' });
  }

  /* Grey-scale leaf shading + veins. The real colour comes from material.color, so a leaf can turn from
     green to yellow to brown just by tinting. Base of the leaf is at the bottom of the canvas (v = 0). */
  function drawLeaf(kind) {
    var W = 128, H = 256, c = mk(W, H), g = c.getContext('2d'), R = U.rng(U.hash('leaf' + kind));
    var gr = g.createLinearGradient(0, 0, W, 0);
    gr.addColorStop(0, '#aeb0aa'); gr.addColorStop(0.17, '#d9dbd6'); gr.addColorStop(0.5, '#ffffff');
    gr.addColorStop(0.83, '#d9dbd6'); gr.addColorStop(1, '#aeb0aa');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    var gv = g.createLinearGradient(0, 0, 0, H);
    gv.addColorStop(0, 'rgba(255,255,255,0.21)'); gv.addColorStop(0.58, 'rgba(255,255,255,0.04)'); gv.addColorStop(1, 'rgba(0,0,0,0.18)');
    g.fillStyle = gv; g.fillRect(0, 0, W, H);
    noiseSpeckles(g, W, H, R, 360, ['#edf0e9', '#c4c9c0', '#f9faf7', '#b3baaf'], 0.45, 1.7, 0.2);
    var veins = kind === 'cabbage' ? 9 : 6;
    g.lineCap = 'round';
    for (var side = -1; side <= 1; side += 2) {
      for (var i = 1; i <= veins; i++) {
        var y0 = H - (i / (veins + 1)) * H * 0.95, x1 = W / 2 + side * (W * (0.36 + R() * 0.08)), y1 = y0 - H * 0.11;
        g.strokeStyle = 'rgba(255,255,255,0.64)'; g.lineWidth = kind === 'cabbage' ? 3.2 : 2.1;
        g.beginPath(); g.moveTo(W / 2, y0); g.quadraticCurveTo(W / 2 + side * W * 0.2, y0 - H * 0.02, x1, y1); g.stroke();
        g.strokeStyle = 'rgba(36,45,32,0.14)'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(W / 2 + 1, y0 + 1); g.quadraticCurveTo(W / 2 + side * W * 0.2, y0 - H * 0.02 + 1, x1, y1 + 1); g.stroke();
      }
    }
    g.strokeStyle = 'rgba(255,255,255,0.88)'; g.lineWidth = kind === 'cabbage' ? 7 : 4.5;
    g.beginPath(); g.moveTo(W / 2, H); g.lineTo(W / 2, 6); g.stroke();
    return tex(c, { name: 'leaf-' + kind, role: 'leaf' });
  }

  function drawNoise(seed, base, spread) {
    var c = mk(128, 128), g = c.getContext('2d'), R = U.rng(seed);
    g.fillStyle = base; g.fillRect(0, 0, 128, 128);
    noiseSpeckles(g, 128, 128, R, 900, ['#ffffff', '#000000', '#888888'], 0.5, 2.6, spread);
    return tex(c, { repeat: [2, 2], name: 'surface-noise-' + seed, role: 'surface' });
  }

  function drawWater() {
    var W = 128, H = 64, c = mk(W, H), g = c.getContext('2d'), R = U.rng(73);
    var wash = g.createLinearGradient(0, 0, 0, H);
    wash.addColorStop(0, '#f4fcff'); wash.addColorStop(0.55, '#dceff6'); wash.addColorStop(1, '#edf9fd');
    g.fillStyle = wash; g.fillRect(0, 0, W, H);
    g.lineCap = 'round';
    for (var i = 0; i < 18; i++) {
      var y = 4 + R() * (H - 8), x = R() * W, len = 12 + R() * 34;
      g.strokeStyle = i % 3 ? 'rgba(255,255,255,0.34)' : 'rgba(111,181,210,0.18)';
      g.lineWidth = 0.7 + R() * 1.8; g.beginPath(); g.moveTo(x, y);
      g.bezierCurveTo(x + len * 0.25, y - 2, x + len * 0.7, y + 2, x + len, y); g.stroke();
    }
    return tex(c, { repeat: [2, 2], name: 'water-highlights', role: 'water' });
  }

  /* Soil / gravel, painted per state. kind: 'face' (the cut side of the pot, darker at the bottom) or 'top'. */
  var SOIL = {
    rich:        { base: '#5e3922', bits: ['#2a170b', '#815a36', '#c7aa7b', '#3b2415', '#9a7550'] },
    moist:       { base: '#3d2518', bits: ['#190d07', '#704b30', '#a58d70', '#2b190f', '#526044'] },
    dry:         { base: '#b98d5e', bits: ['#795334', '#e5c89a', '#a67446', '#d3ad79', '#8c6a4b'] },
    gravel:      { base: '#4a4540' },
    gravelMoist: { base: '#383732' },
    soggy:       { base: '#47321e', bits: ['#1c1209', '#706d43', '#8e9b58', '#30200f', '#a39b68'] },
    frozen:      { base: '#6c7380', bits: ['#e7f0f8', '#aac1d8', '#4b5666', '#f6fbff', '#8799ad'] }
  };
  function drawSoil(state, kind) {
    var S = 256, c = mk(S, S), g = c.getContext('2d'), R = U.rng(U.hash('soil' + state + kind)), d = SOIL[state] || SOIL.rich;
    g.fillStyle = d.base; g.fillRect(0, 0, S, S);
    if (state === 'gravel' || state === 'gravelMoist') {
      var wet = state === 'gravelMoist', cols = wet
        ? ['#77746c', '#8a8378', '#6a675f', '#9a8f7d', '#5d5b56']
        : ['#c7c2b6', '#b3ac9c', '#d9d2c2', '#a49c8c', '#8f8a80', '#cbb79a'];
      var pebbles = [];
      for (var i = 0; i < 330; i++) pebbles.push({ x: R() * S, y: R() * S, r: 7 + R() * 11, c: cols[(R() * cols.length) | 0], a: R() * 3 });
      pebbles.sort(function (a, b) { return a.y - b.y; });
      pebbles.forEach(function (p) {
        var gr = g.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.35, 1, p.x, p.y, p.r * 1.05);
        gr.addColorStop(0, wet ? '#b5aa98' : '#f1ece0'); gr.addColorStop(0.55, p.c); gr.addColorStop(1, wet ? '#39372f' : '#5f5a50');
        g.fillStyle = gr; g.beginPath(); g.ellipse(p.x, p.y, p.r, p.r * (0.7 + R() * 0.25), p.a, 0, 6.283); g.fill();
      });
    } else {
      noiseSpeckles(g, S, S, R, 1250, d.bits, 0.55, 2.7, 0.72);
      noiseSpeckles(g, S, S, R, 56, ['#f5ecda'], 1.0, 2.3, 0.58);
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
    return tex(c, { name: 'soil-' + state + '-' + kind, role: 'soil' });
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

  /* Wood shavings for the chick cage floor. */
  function drawBedding() {
    var S = 256, c = mk(S, S), g = c.getContext('2d'), R = U.rng(41);
    g.fillStyle = '#e3c789'; g.fillRect(0, 0, S, S);
    var cols = ['#f3dfa8', '#cfae6a', '#ecd396', '#b9964f', '#f7e8be'];
    g.lineCap = 'round';
    for (var i = 0; i < 620; i++) {
      var x = R() * S, y = R() * S, len = 10 + R() * 22, a = R() * 6.283;
      g.strokeStyle = cols[(R() * cols.length) | 0]; g.globalAlpha = 0.55 + R() * 0.4; g.lineWidth = 1.2 + R() * 2.2;
      g.beginPath(); g.moveTo(x, y);
      g.quadraticCurveTo(x + Math.cos(a) * len * 0.5 + (R() - 0.5) * 8, y + Math.sin(a) * len * 0.5 + (R() - 0.5) * 8, x + Math.cos(a) * len, y + Math.sin(a) * len);
      g.stroke();
    }
    g.globalAlpha = 1;
    return tex(c, { repeat: [2, 2], name: 'wood-bedding', role: 'bedding' });
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
      var p = Object.assign({ color: color, roughness: 0.66, metalness: 0.0, envMapIntensity: 0.78 }, o);
      if (!Object.prototype.hasOwnProperty.call(o, 'map') && [C.water, 0x59bff2, 0x9be2ff].indexOf(color) >= 0) p.map = drawWaterCached();
      return new T.MeshStandardMaterial(p);
    },
    basic: function (color, o) { return new T.MeshBasicMaterial(Object.assign({ color: color }, o || {})); },
    clearPlastic: function (o) {
      return new T.MeshStandardMaterial(Object.assign({
        color: 0xe6f6ff, transparent: true, opacity: 0.2, roughness: 0.1, metalness: 0.0,
        side: T.DoubleSide, depthWrite: false, envMapIntensity: 1.35
      }, o || {}));
    },
    textTexture: textTexture,
    tex: {
      wood: function () { return once('wood', drawWood); },
      grass: function () { return once('grass', drawGrass); },
      sky: function () { return once('sky', drawSky); },
      water: drawWaterCached,
      blob: function () { return once('blob', drawBlob); },
      glow: function () { return once('glow', drawGlow); },
      leaf: function (kind) { return once('leaf' + (kind || 'bean'), function () { return drawLeaf(kind || 'bean'); }); },
      soil: function (state, kind) { return once('soil' + state + (kind || 'face'), function () { return drawSoil(state, kind || 'face'); }); },
      terracotta: function () { return once('terra', function () { return drawNoise(21, '#e9e9e9', 0.5); }); },
      plastic: function () { return once('plastic', function () { return drawNoise(33, '#f2f2f2', 0.25); }); },
      condensation: function () { return once('cond', drawCondensation); },
      bedding: function () { return once('bedding', drawBedding); }
    }
  };

  function drawWaterCached() { return once('water', drawWater); }
})(window.Lab);
