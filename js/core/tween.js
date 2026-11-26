/* Lab.loop + Lab.tween – one animation loop for the whole site.
   • The loop only runs while something needs it (a tween, a ticker, or a pending redraw), so an idle
     screen costs nothing. Frames that only carry ambient motion (leaf sway…) are throttled to ~30 fps.
   • Tweens are time-based, promise-like (`await Lab.tween.to(...)`) and can all be killed at once, which
     is how "LÀM LẠI THÍ NGHIỆM" stops every running effect. */
(function (Lab) {
  'use strict';

  var ease = {
    linear: function (t) { return t; },
    inQuad: function (t) { return t * t; },
    outQuad: function (t) { return t * (2 - t); },
    inOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    inCubic: function (t) { return t * t * t; },
    outCubic: function (t) { var u = 1 - t; return 1 - u * u * u; },
    inOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    inOutSine: function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
    outBack: function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    outBounce: function (t) {
      var n = 7.5625, d = 2.75;
      if (t < 1 / d) return n * t * t;
      if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
      if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
      return n * (t -= 2.625 / d) * t + 0.984375;
    },
    outElastic: function (t) {
      if (t === 0 || t === 1) return t;
      return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
    }
  };

  /* ---------- tweens ---------- */
  var list = [];
  var timeScale = 1;

  /* All public durations are in SECONDS. */
  function make(sec, delay, easing, onUpdate) {
    var h = { t: -(delay || 0) * 1000, ms: Math.max(0, sec) * 1000, ease: easing || ease.inOutCubic, onUpdate: onUpdate, dead: false, started: false };
    h.promise = new Promise(function (res) { h.resolve = res; });
    h.then = function (a, b) { return h.promise.then(a, b); };
    h.cancel = function () { h.dead = true; };
    list.push(h);
    Lab.loop.wake();
    return h;
  }

  var tween = Lab.tween = {
    ease: ease,
    /* to(target, {x:1,y:2}, seconds, {ease, delay, onUpdate}) */
    to: function (target, props, sec, o) {
      o = o || {};
      var keys = Object.keys(props), from = {};
      var h = make(sec, o.delay, typeof o.ease === 'string' ? ease[o.ease] : o.ease, function (k) {
        if (!h.started) { h.started = true; keys.forEach(function (key) { from[key] = target[key]; }); }
        keys.forEach(function (key) { target[key] = from[key] + (props[key] - from[key]) * k; });
        if (o.onUpdate) o.onUpdate(k);
      });
      return h;
    },
    /* value(seconds, fn(k), {ease, delay}) – calls fn with the eased progress 0..1 every frame */
    value: function (sec, fn, o) {
      o = o || {};
      return make(sec, o.delay, typeof o.ease === 'string' ? ease[o.ease] : o.ease, fn);
    },
    wait: function (sec) { return make(sec, 0, ease.linear, null); },
    anticipate: function (target, key, offset, sec) {
      if (reducedMotion) return Promise.resolve();
      var base = target[key], half = Math.max(0.04, (sec || 0.16) / 2);
      return tween.to(target, { [key]: base + offset }, half, { ease: 'outQuad' }).promise
        .then(function () { return tween.to(target, { [key]: base }, half, { ease: 'inOutQuad' }).promise; });
    },
    killAll: function () { list.forEach(function (h) { h.dead = true; }); list.length = 0; },
    count: function () { return list.length; },
    setTimeScale: function (s) { timeScale = s; },
    _update: function (dtSec) {
      var dtMs = dtSec * 1000 * timeScale;
      for (var i = 0; i < list.length; i++) {
        var h = list[i];
        if (h.dead) { list.splice(i--, 1); continue; }
        h.t += dtMs;
        if (h.t < 0) continue;
        var k = h.ms <= 0 ? 1 : Math.min(1, h.t / h.ms);
        if (h.onUpdate) h.onUpdate(h.ease(k), k);
        if (k >= 1) { h.dead = true; list.splice(i--, 1); h.resolve(); }
      }
    }
  };

  /* ---------- frame loop ---------- */
  var tickers = [];
  var running = false, needsRender = false, last = 0, raf = 0, frames = 0;
  var slowFrames = 0;
  var pageHidden = !!(document && document.hidden);
  var userPaused = false;
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reducedMotion = !!(motionQuery && motionQuery.matches);

  function hasRequiredTicker() {
    return tickers.some(function (t) { return !t.ambient; });
  }
  function shouldContinue() {
    return list.length > 0 || (reducedMotion ? hasRequiredTicker() : tickers.length > 0) || loop.keepAlive > 0;
  }
  function setPageHidden(hidden) {
    pageHidden = !!hidden;
    if (document.body) document.body.classList.toggle('is-page-hidden', pageHidden);
    if (pageHidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0; running = false;
    } else {
      last = performance.now();
      loop.wake();
    }
  }
  function setUserPaused(paused) {
    userPaused = !!paused;
    if (document.body) document.body.classList.toggle('is-motion-paused', userPaused);
    if (userPaused) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0; running = false;
    } else {
      last = performance.now();
      loop.wake();
    }
    return userPaused;
  }
  function setReducedMotion(value) {
    reducedMotion = !!value;
    if (document.documentElement) document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    loop.wake();
  }

  function frame(now) {
    raf = 0;
    if (pageHidden) { running = false; return; }
    if (userPaused) {
      if (loop.render) loop.render(0);
      needsRender = false;
      last = now;
      running = false;
      return;
    }
    var elapsed = now - last;
    var busy = list.length > 0 || needsRender || hasRequiredTicker() || loop.keepAlive > 0;
    if (!busy && !reducedMotion && tickers.length && elapsed < 33) { raf = requestAnimationFrame(frame); return; } // ambient-only: ~30 fps
    last = now;
    var dt = Math.min(0.05, elapsed / 1000);
    tween._update(dt);
    for (var i = 0; i < tickers.length; i++) {
      if (!reducedMotion || !tickers[i].ambient) tickers[i].fn(dt, now / 1000);
    }
    if (loop.render) loop.render(dt);
    needsRender = false;
    frames++;
    // slow-device detection (only meaningful while animations are really running)
    if (busy && loop.onSlow) {
      if (elapsed > 38) slowFrames++; else slowFrames = Math.max(0, slowFrames - 2);
      if (slowFrames > 45) { slowFrames = 0; loop.onSlow(); }
    }
    if (shouldContinue()) raf = requestAnimationFrame(frame);
    else running = false;
  }

  var loop = Lab.loop = {
    render: null,      // set by Lab.stage
    onSlow: null,      // set by Lab.stage (switches to "light mode")
    keepAlive: 0,
    wake: function () {
      needsRender = true;
      if (!pageHidden && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    },
    /* add(fn(dt,time), {ambient:true}) → remove() */
    add: function (fn, o) {
      var t = { fn: fn, ambient: !!(o && o.ambient) };
      tickers.push(t);
      loop.wake();
      return function () { var i = tickers.indexOf(t); if (i >= 0) tickers.splice(i, 1); };
    },
    clearTickers: function () { tickers.length = 0; },
    tickerCount: function () { return tickers.length; },
    /* runs every ticker once with a fixed step – used by the test pages, which drive time by hand */
    tickAll: function (dt, time) { for (var i = 0; i < tickers.length; i++) tickers[i].fn(dt, time); },
    frames: function () { return frames; },
    isPageHidden: function () { return pageHidden; },
    prefersReducedMotion: function () { return reducedMotion; },
    isPaused: function () { return userPaused; },
    setPaused: setUserPaused,
    pause: function () { return setUserPaused(true); },
    resume: function () { return setUserPaused(false); }
  };

  document.addEventListener('visibilitychange', function () { setPageHidden(!!document.hidden); });
  if (motionQuery) {
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', function (e) { setReducedMotion(e.matches); });
    else if (motionQuery.addListener) motionQuery.addListener(function (e) { setReducedMotion(e.matches); });
  }
  setReducedMotion(reducedMotion);
  if (pageHidden && document.body) document.body.classList.add('is-page-hidden');
})(window.Lab);
