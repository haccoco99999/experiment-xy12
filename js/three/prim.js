/* Lab.prim – shape building blocks: tapered tubes (stems, roots, tails), bendable leaves with a "wilt"
   morph, lathe profiles (pots, bowls), rounded boxes, soft blob shadows, and clean-up helpers. */
(function (Lab) {
  'use strict';
  var T = window.THREE;

  /* ---------- Tube that can be updated in place every frame (cheap: no new arrays) ---------- */
  function TubeGeo(nSeg, nRad) {
    var vc = (nSeg + 1) * (nRad + 1), i, j;
    this.nSeg = nSeg; this.nRad = nRad;
    this.pos = new Float32Array(vc * 3);
    this.nor = new Float32Array(vc * 3);
    var uv = new Float32Array(vc * 2), idx = [];
    for (i = 0; i <= nSeg; i++) for (j = 0; j <= nRad; j++) { var k = i * (nRad + 1) + j; uv[k * 2] = j / nRad; uv[k * 2 + 1] = i / nSeg; }
    for (i = 0; i < nSeg; i++) for (j = 0; j < nRad; j++) {
      var a = i * (nRad + 1) + j, b = (i + 1) * (nRad + 1) + j, c = b + 1, d = a + 1;
      idx.push(a, d, b, b, d, c);
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new T.BufferAttribute(this.nor, 3));
    g.setAttribute('uv', new T.BufferAttribute(uv, 2));
    g.setIndex(idx);
    this.geometry = g;
  }
  /* pts: array of nSeg+1 points {x,y,z}; radius: number or function(t 0..1) */
  TubeGeo.prototype.update = function (pts, radius) {
    var n = this.nSeg, R = this.nRad, P = this.pos, N = this.nor;
    var nx = 0, ny = 0, nz = 0;
    for (var i = 0; i <= n; i++) {
      var p0 = pts[i > 0 ? i - 1 : 0], p1 = pts[i < n ? i + 1 : n], p = pts[i];
      var tx = p1.x - p0.x, ty = p1.y - p0.y, tz = p1.z - p0.z, tl = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;
      tx /= tl; ty /= tl; tz /= tl;
      if (i === 0) {
        var ax = Math.abs(tx), ay = Math.abs(ty), az = Math.abs(tz), ux = 0, uy = 0, uz = 0;
        if (ax <= ay && ax <= az) ux = 1; else if (ay <= az) uy = 1; else uz = 1;
        var d0 = ux * tx + uy * ty + uz * tz;
        nx = ux - d0 * tx; ny = uy - d0 * ty; nz = uz - d0 * tz;
      } else {
        var d1 = nx * tx + ny * ty + nz * tz;
        nx -= d1 * tx; ny -= d1 * ty; nz -= d1 * tz;
      }
      var nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      var bx = ty * nz - tz * ny, by = tz * nx - tx * nz, bz = tx * ny - ty * nx;
      var r = typeof radius === 'function' ? radius(i / n) : radius;
      for (var j = 0; j <= R; j++) {
        var a = (j / R) * 6.283185307, c = Math.cos(a), s = Math.sin(a);
        var ox = nx * c + bx * s, oy = ny * c + by * s, oz = nz * c + bz * s, k = (i * (R + 1) + j) * 3;
        P[k] = p.x + ox * r; P[k + 1] = p.y + oy * r; P[k + 2] = p.z + oz * r;
        N[k] = ox; N[k + 1] = oy; N[k + 2] = oz;
      }
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.normal.needsUpdate = true;
    this.geometry.computeBoundingSphere();
  };

  /* ---------- Leaf: a grid that is cupped and drooped, plus a "wilt" morph target (influence 0..1) ---------- */
  function leaf(o) {
    o = Object.assign({ length: 1, width: 0.7, su: 8, sv: 14, cup: 0.35, tip: 0.3, shape: 'ovate', wiltCup: 1.5, wiltTip: 1.25, wiltNarrow: 0.6 }, o || {});
    var su = o.su, sv = o.sv;
    function halfW(s) {
      var w = o.width * 0.5;
      if (o.shape === 'oval') return w * Math.pow(Math.sin(Math.PI * s), 0.75);
      if (o.shape === 'round') return w * Math.sqrt(Math.max(0, 1 - Math.pow(2 * s - 1, 2)));
      if (o.shape === 'spoon') return w * Math.pow(Math.sin(Math.PI * Math.pow(s, 1.45)), 0.9);
      return w * Math.pow(Math.sin(Math.PI * Math.pow(s, 0.72)), 0.85);
    }
    function positions(cup, tip, narrow) {
      var arr = new Float32Array((su + 1) * (sv + 1) * 3), k = 0;
      for (var i = 0; i <= sv; i++) {
        var s = i / sv, hw = halfW(s) * narrow, y = s * o.length;
        for (var j = 0; j <= su; j++) {
          var u = (j / su) * 2 - 1;
          arr[k++] = u * hw; arr[k++] = y;
          arr[k++] = cup * u * u * hw * 0.9 - tip * s * s * o.length * 0.45;
        }
      }
      return arr;
    }
    var base = positions(o.cup, o.tip, 1), wilt = positions(o.wiltCup, o.wiltTip, o.wiltNarrow);
    var uv = new Float32Array((su + 1) * (sv + 1) * 2), idx = [], i, j, k = 0;
    for (i = 0; i <= sv; i++) for (j = 0; j <= su; j++) { uv[k++] = j / su; uv[k++] = i / sv; }
    for (i = 0; i < sv; i++) for (j = 0; j < su; j++) {
      var a = i * (su + 1) + j, b = a + 1, c = a + su + 1, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
    function build(pos) {
      var g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(pos, 3));
      g.setAttribute('uv', new T.BufferAttribute(uv, 2));
      g.setIndex(idx); g.computeVertexNormals();
      return g;
    }
    var geo = build(base), wgeo = build(wilt);
    var dp = new Float32Array(base.length), dn = new Float32Array(base.length);
    var bn = geo.attributes.normal.array, wn = wgeo.attributes.normal.array;
    for (i = 0; i < base.length; i++) { dp[i] = wilt[i] - base[i]; dn[i] = wn[i] - bn[i]; }
    geo.morphAttributes.position = [new T.BufferAttribute(dp, 3)];
    geo.morphAttributes.normal = [new T.BufferAttribute(dn, 3)];
    geo.morphTargetsRelative = true;
    wgeo.dispose();
    return geo;
  }

  function mesh(geo, mat, o) {
    var m = new T.Mesh(geo, mat);
    o = o || {};
    m.castShadow = o.cast !== false;
    m.receiveShadow = !!o.receive;
    return m;
  }

  /* profile: array of [radius, y] pairs, bottom to top */
  function lathe(profile, seg, phiStart, phiLen) {
    var pts = profile.map(function (p) { return new T.Vector2(p[0], p[1]); });
    return new T.LatheGeometry(pts, seg || 40, phiStart || 0, phiLen == null ? Math.PI * 2 : phiLen);
  }

  /* Rounded box (soft edges), centred on the origin. */
  function roundedBox(w, h, d, r, seg) {
    r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    var iw = w - 2 * r, ih = h - 2 * r, s = new T.Shape(), x = -iw / 2, y = -ih / 2, cr = Math.min(r * 0.5, iw / 2, ih / 2);
    s.moveTo(x + cr, y); s.lineTo(x + iw - cr, y); s.quadraticCurveTo(x + iw, y, x + iw, y + cr);
    s.lineTo(x + iw, y + ih - cr); s.quadraticCurveTo(x + iw, y + ih, x + iw - cr, y + ih);
    s.lineTo(x + cr, y + ih); s.quadraticCurveTo(x, y + ih, x, y + ih - cr);
    s.lineTo(x, y + cr); s.quadraticCurveTo(x, y, x + cr, y);
    var g = new T.ExtrudeGeometry(s, { depth: Math.max(0.001, d - 2 * r), bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: seg || 3, curveSegments: 5 });
    g.center();
    return g;
  }

  /* Re-maps a geometry's UVs by "box projection" so a texture tiles evenly (sx/sy/sz = world size of one tile). */
  function boxUV(geo, sx, sy, sz) {
    var p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
    for (var i = 0; i < p.count; i++) {
      var ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i)), x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (ay >= ax && ay >= az) uv.setXY(i, x / sx + 0.5, z / sz + 0.5);
      else if (ax >= az) uv.setXY(i, z / sz + 0.5, y / sy + 0.5);
      else uv.setXY(i, x / sx + 0.5, y / sy + 0.5);
    }
    uv.needsUpdate = true;
    return geo;
  }

  /* Squashed sphere. */
  function ellipsoid(rx, ry, rz, seg) {
    var g = new T.SphereGeometry(1, seg || 24, Math.max(10, (seg || 24) / 2));
    g.scale(rx, ry, rz);
    return g;
  }

  /* Flat soft shadow decal lying on a surface (cheap "contact shadow"). */
  function blobShadow(rx, rz, opacity) {
    var m = new T.Mesh(new T.PlaneGeometry(1, 1),
      new T.MeshBasicMaterial({ map: Lab.mat.tex.blob(), transparent: true, depthWrite: false, opacity: opacity == null ? 1 : opacity, fog: false }));
    m.rotation.x = -Math.PI / 2;
    m.scale.set(rx * 2, rz * 2, 1);
    m.position.y = 0.006;
    m.renderOrder = 1;
    m.userData.noPick = true;
    return m;
  }

  function ring(inner, outer, seg) {
    var g = new T.RingGeometry(inner, outer, seg || 48);
    g.rotateX(-Math.PI / 2);
    return g;
  }

  /* Frees GPU memory of an object tree (shared textures/materials flagged userData.shared are kept). */
  function disposeTree(root) {
    if (!root) return;
    root.traverse(function (o) {
      if (o.isLight && o.dispose) o.dispose();          // frees the light's shadow map (a big GPU texture)
      if (o.geometry) o.geometry.dispose();
      var mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      mats.forEach(function (m) {
        if (m.userData && m.userData.shared) return;
        ['map', 'alphaMap', 'normalMap', 'emissiveMap'].forEach(function (k) {
          if (m[k] && m[k].userData && m[k].userData.own) m[k].dispose();
        });
        m.dispose();
      });
    });
  }

  Lab.prim = { TubeGeo: TubeGeo, leaf: leaf, mesh: mesh, lathe: lathe, roundedBox: roundedBox, boxUV: boxUV, ellipsoid: ellipsoid, blobShadow: blobShadow, ring: ring, disposeTree: disposeTree };
})(window.Lab);
