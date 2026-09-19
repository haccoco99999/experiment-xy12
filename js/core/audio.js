/* Lab.audio – tiny synthesized sound effects (no audio files). The md calls sound "optional and gentle":
   right, wrong, step done, all done, plus a few small feedback sounds. Muted state is remembered. */
(function (Lab) {
  'use strict';
  var ctx = null, master = null, noiseBuf = null;
  var muted = Lab.util.store.get('muted', '0') === '1';

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }
    master = ctx.createGain();
    master.gain.value = 0.45;
    master.connect(ctx.destination);
    return ctx;
  }

  function tone(freq, t0, dur, type, gain, slideTo) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  function noise(t0, dur, gain, lo, hi) {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = (lo + hi) / 2; f.Q.value = 0.7;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.12);
    g.gain.setValueAtTime(gain, t0 + Math.max(0.13, dur - 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t0); s.stop(t0 + dur + 0.05);
  }

  var sounds = {
    ok: function (t) { tone(660, t, 0.16, 'sine', 0.22); tone(880, t + 0.09, 0.22, 'sine', 0.2); },
    wrong: function (t) { tone(260, t, 0.22, 'triangle', 0.16, 190); },
    click: function (t) { tone(520, t, 0.05, 'sine', 0.12); },
    pop: function (t) { tone(380, t, 0.12, 'sine', 0.2, 720); },
    tick: function (t) { tone(300, t, 0.07, 'triangle', 0.14, 240); },
    water: function (t) { noise(t, 1.6, 0.16, 1400, 4200); },
    pour: function (t) { noise(t, 1.1, 0.12, 600, 2200); },
    step: function (t) { tone(523, t, 0.14, 'sine', 0.2); tone(659, t + 0.1, 0.14, 'sine', 0.2); tone(784, t + 0.2, 0.24, 'sine', 0.2); },
    done: function (t) {
      [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, t + i * 0.13, 0.32, 'sine', 0.2); });
      tone(1568, t + 0.7, 0.5, 'triangle', 0.1);
    }
  };

  Lab.audio = {
    play: function (name) {
      if (muted) return;
      var c = ensure(); if (!c) return;
      if (c.state === 'suspended') c.resume();
      var fn = sounds[name]; if (fn) fn(c.currentTime + 0.01);
    },
    unlock: function () { var c = ensure(); if (c && c.state === 'suspended') c.resume(); },
    isMuted: function () { return muted; },
    setMuted: function (m) { muted = !!m; Lab.util.store.set('muted', muted ? '1' : '0'); },
    toggle: function () { Lab.audio.setMuted(!muted); return muted; }
  };
  // Browsers only allow sound after the first tap/click.
  document.addEventListener('pointerdown', function () { Lab.audio.unlock(); }, { once: true, capture: true });
})(window.Lab);
