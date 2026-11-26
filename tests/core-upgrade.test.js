const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('core controls expose semantic keyboard paths', () => {
  const ui = source('js/core/ui.js');
  const drag = source('js/core/dragdrop.js');
  const labels = source('js/three/labels.js');
  const css = source('css/app.css');
  const html = source('index.html');

  assert.match(ui, /U\.el\('button', \{ class: 'card'.*type: 'button'.*'data-id': it\.id/s);
  assert.match(drag, /startKeyboard\(card, item, cbs\)/);
  assert.match(drag, /handler\.onDrop\(item, zone \? \[zone\.id\] : \[\]/);
  assert.match(drag, /keyboard-drop-list/);
  assert.match(labels, /U\.el\('button'.*aria-label/s);
  assert.match(labels, /e\.key === 'Enter' \|\| e\.key === ' '/);
  assert.match(css, /\.card:focus-visible/);
  assert.match(css, /\.tag3d\.clickable:focus-visible/);
  assert.match(ui, /els\.panel\.contains\(active\)/);
  assert.match(ui, /candidate\.getAttribute\('data-scene-action'\) === savedFocus\.action/);
  assert.match(html, /id="btn-motion"[^>]+aria-label="Tạm dừng hoạt cảnh"[^>]+aria-pressed="false"/);
  assert.match(ui, /Lab\.loop\.setPaused\(paused\)/);
  assert.match(ui, /U\.store\.get\('motion', 'running'\)/);
  assert.match(ui, /refreshMotion: function/);
  assert.match(css, /body\.is-motion-paused .*animation-play-state: paused/s);
  assert.doesNotMatch(css, /\.thermo-fill[^}]*transition: width/s);
});

test('modal contract includes labelling, focus containment and page inertness', () => {
  const ui = source('js/core/ui.js');
  assert.match(ui, /'aria-labelledby': titleId/);
  assert.match(ui, /function trapModal/);
  assert.match(ui, /e\.key === 'Escape'/);
  assert.match(ui, /node\.inert = true/);
  assert.match(ui, /entry\.previousFocus.*previousFocus\.isConnected/s);
  assert.match(ui, /document\.body\.classList\.add\('has-modal'\)/);
});

function loadTween(reduced) {
  let now = 0, nextFrame = 0;
  const frames = new Map(), listeners = {};
  const media = {
    matches: reduced,
    addEventListener(name, fn) { listeners['media:' + name] = fn; },
    addListener(fn) { listeners['media:change'] = fn; }
  };
  const classNames = () => {
    const values = new Set();
    return {
      add(v) { values.add(v); },
      remove(v) { values.delete(v); },
      toggle(v, on) { if (on) values.add(v); else values.delete(v); },
      contains(v) { return values.has(v); }
    };
  };
  const document = {
    hidden: false,
    body: { classList: classNames() },
    documentElement: { classList: classNames() },
    addEventListener(name, fn) { listeners[name] = fn; }
  };
  const Lab = {};
  const sandbox = {
    Lab, window: { Lab, matchMedia: () => media },
    document, console,
    performance: { now: () => now },
    requestAnimationFrame(fn) { const id = ++nextFrame; frames.set(id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    Promise, Math, Object, Array
  };
  vm.runInNewContext(source('js/core/tween.js'), sandbox, { filename: 'tween.js' });
  return {
    Lab, document, media,
    step(ms) {
      now = ms;
      const pending = Array.from(frames.values());
      frames.clear();
      pending.forEach((fn) => fn(now));
    },
    visibility(hidden) { document.hidden = hidden; listeners.visibilitychange(); },
    pending() { return frames.size; }
  };
}

test('reduced motion skips ambient rendering but keeps educational tweens alive', async () => {
  const env = loadTween(true);
  let ambient = 0, renders = 0, progress = -1;
  env.Lab.loop.render = () => { renders++; };
  env.Lab.loop.add(() => { ambient++; }, { ambient: true });
  env.step(16);
  assert.strictEqual(ambient, 0);
  assert.ok(renders > 0, 'one demand render is preserved');
  assert.strictEqual(env.pending(), 0, 'ambient-only loop stops');

  env.Lab.loop.tickAll(1 / 30, 1);
  assert.strictEqual(ambient, 1, 'manual test-page time stepping remains available');

  const tween = env.Lab.tween.value(0.05, (k) => { progress = k; });
  env.step(32);
  env.step(120);
  await tween.promise;
  assert.strictEqual(progress, 1);
});

test('visibility pauses the animation timer and resumes from a safe gap', () => {
  const env = loadTween(false);
  let ambient = 0;
  env.Lab.loop.add(() => { ambient++; }, { ambient: true });
  env.step(40);
  assert.ok(ambient > 0);

  env.visibility(true);
  assert.strictEqual(env.pending(), 0);
  const before = ambient;
  env.Lab.loop.wake();
  assert.strictEqual(env.pending(), 0);
  assert.strictEqual(ambient, before);

  env.visibility(false);
  assert.ok(env.pending() > 0);
  env.step(400);
  assert.ok(ambient > before);
});

test('manual motion pause freezes tweens and can resume in place', () => {
  const env = loadTween(false);
  let ambient = 0, progress = 0, renders = 0;
  env.Lab.loop.render = () => { renders++; };
  env.Lab.loop.add(() => { ambient++; }, { ambient: true });
  env.Lab.tween.value(0.2, (k) => { progress = k; });
  env.step(50);
  assert.ok(progress > 0);
  assert.ok(ambient > 0);

  env.Lab.loop.pause();
  assert.strictEqual(env.Lab.loop.isPaused(), true);
  assert.ok(env.document.body.classList.contains('is-motion-paused'));
  const beforeAmbient = ambient, beforeProgress = progress, beforeRender = renders;
  env.Lab.loop.wake();
  env.step(120);
  assert.strictEqual(ambient, beforeAmbient);
  assert.strictEqual(progress, beforeProgress);
  assert.ok(renders > beforeRender, 'a paused wake still renders the static scene once');

  env.Lab.loop.resume();
  assert.strictEqual(env.Lab.loop.isPaused(), false);
  assert.ok(!env.document.body.classList.contains('is-motion-paused'));
  env.step(170);
  assert.ok(ambient > beforeAmbient);
  assert.ok(progress > beforeProgress);
  env.Lab.tween.killAll();
});

test('anticipation is short and skipped for reduced motion', async () => {
  const normal = loadTween(false);
  const moving = { z: 0 };
  const finished = normal.Lab.tween.anticipate(moving, 'z', 0.08, 0.16);
  normal.step(40);
  assert.ok(moving.z > 0, 'the tool makes a small opposite movement first');
  normal.step(80);
  await Promise.resolve();
  normal.step(120);
  normal.step(160);
  await finished;
  assert.strictEqual(moving.z, 0);

  const reduced = loadTween(true);
  const still = { z: 0 };
  await reduced.Lab.tween.anticipate(still, 'z', 0.08, 0.16);
  assert.strictEqual(still.z, 0);
  reduced.step(16);
  assert.strictEqual(reduced.pending(), 0);
});

test('audio resume failures are caught and logged', async () => {
  const warnings = [];
  const gain = () => ({ gain: { value: 0 }, connect() {} });
  class AudioContext {
    constructor() { this.state = 'suspended'; this.currentTime = 0; this.destination = {}; }
    createGain() { return gain(); }
    resume() { return Promise.reject(new Error('blocked')); }
  }
  const Lab = { util: { store: { get: () => '0', set() {} } } };
  const sandbox = {
    Lab, window: { Lab, AudioContext }, document: { addEventListener() {} },
    console: { warn(...args) { warnings.push(args); }, error() {}, log() {} },
    Promise, Math
  };
  vm.runInNewContext(source('js/core/audio.js'), sandbox, { filename: 'audio.js' });
  await Lab.audio.unlock().catch(() => {});
  await new Promise((resolve) => setImmediate(resolve));
  assert.strictEqual(warnings.length, 1);
});

test('stage limits GPU cost and restores scene resources', () => {
  const stage = source('js/three/stage.js');
  const lens = source('js/three/lens.js');
  const fx = source('js/three/fx.js');
  assert.match(stage, /qualityMode: 'balanced'/);
  assert.match(stage, /S\.quality === 'high' \? 1\.5 : S\.quality === 'balanced' \? 1\.25 : 1/);
  assert.match(stage, /r\.shadowMap\.enabled = S\.quality !== 'light'/);
  assert.match(stage, /PCFShadowMap/);
  assert.match(stage, /webglcontextrestored/);
  assert.match(stage, /rebuildRendererResources\(\)/);
  assert.match(stage, /S\.refit\(true\)/);
  assert.match(stage, /S\.project\(v\.set\(x, y, z\), rc\)/);
  assert.match(lens, /qualityMode === 'light' \? 256 : Lab\.stage\.qualityMode === 'high' \? 512 : 384/);
  assert.match(fx, /function tick\(dt, time, force\)[\s\S]*if \(!force && hidden\(\)\) return;[\s\S]*tick\(0, 0, true\);\s*removeTicker = Lab\.loop\.add\(tick, \{ ambient: true \}\)/);
});

function fakeElement(tag, options, children) {
  const listeners = {};
  const attrs = new Map();
  const classes = new Set();
  const element = {
    tagName: tag.toUpperCase(),
    style: {},
    children: [],
    parentNode: null,
    textContent: options && options.text ? String(options.text) : '',
    isConnected: true,
    classList: {
      add(...names) { names.forEach((name) => name.split(' ').filter(Boolean).forEach((v) => classes.add(v))); },
      remove(...names) { names.forEach((name) => classes.delete(name)); },
      contains(name) { return classes.has(name); },
      toggle(name, on) { if (on) classes.add(name); else classes.delete(name); }
    },
    appendChild(child) {
      if (!child) return child;
      if (child.parentNode && child.parentNode.removeChild) child.parentNode.removeChild(child);
      child.parentNode = element; element.children.push(child); return child;
    },
    removeChild(child) {
      const i = element.children.indexOf(child);
      if (i >= 0) element.children.splice(i, 1);
      if (child) child.parentNode = null;
      return child;
    },
    addEventListener(name, fn) { listeners[name] = fn; },
    click() { if (listeners.click) listeners.click({ detail: 0, defaultPrevented: false }); },
    setAttribute(name, value) { attrs.set(name, String(value)); },
    removeAttribute(name) { attrs.delete(name); },
    getAttribute(name) { return attrs.has(name) ? attrs.get(name) : null; },
    hasAttribute(name) { return attrs.has(name); },
    focus() { documentStub.activeElement = element; },
    querySelector(selector) {
      const match = (node) => node.tagName.toLowerCase() === selector.toLowerCase();
      const visit = (node) => {
        for (const child of node.children) {
          if (match(child)) return child;
          const nested = visit(child);
          if (nested) return nested;
        }
        return null;
      };
      return visit(element);
    }
  };
  const opts = options || {};
  if (opts.class) element.classList.add(opts.class);
  Object.entries(opts.attrs || {}).forEach(([name, value]) => element.setAttribute(name, value));
  (children || []).forEach((child) => element.appendChild(child));
  return element;
}

let documentStub;

function keyboardEnvironment() {
  const body = fakeElement('body', {}, []);
  documentStub = {
    body,
    hidden: false,
    activeElement: body,
    addEventListener() {},
    getElementById() { return null; }
  };
  const Lab = {
    util: {
      el(tag, options, ...children) { return fakeElement(tag, options, children.flat(Infinity)); }
    },
    audio: { play() {} },
    loop: { wake() {} },
    ui: { toast() {} }
  };
  vm.runInNewContext(source('js/core/dragdrop.js'), {
    window: { Lab },
    document: documentStub,
    Lab, console, setTimeout, clearTimeout, Math, Object, Array
  }, { filename: 'dragdrop.js' });
  Lab.drag.init(fakeElement('div', {}, []));
  return { Lab, body };
}

test('keyboard placement refreshes target geometry before listing and dropping', () => {
  const env = keyboardEnvironment();
  let x = 20, reads = 0, dropped = null;
  const zone = env.Lab.drag.addZone({
    id: 'bench',
    pad: 0,
    rect() { reads++; return { x, y: 30, w: 80, h: 40 }; },
    accepts() { return true; }
  });
  zone._rectReady = true;
  zone._screenRect = { x: 4, y: 5, w: 6, h: 7 };
  env.Lab.drag.setHandler({
    onDrop(item, hits, point) { dropped = { item, hits, point }; return { ok: true }; }
  });
  const card = fakeElement('button', {}, []);

  env.Lab.drag.keyboardPlace(card, { id: 'pot', label: 'Chậu' });
  assert.ok(reads >= 2, 'opening the picker refreshes the projected zone for display and acceptance');
  assert.strictEqual(zone.el.style.left, '20px');

  x = 140;
  const picker = env.body.children[0];
  const list = picker.children[1];
  const option = list.children[0].children[0];
  option.click();

  assert.strictEqual(dropped.hits[0], 'bench');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(dropped.point)), { x: 180, y: 50 });
  assert.ok(reads >= 3, 'dropping refreshes the target again');
});

test('Experiment 1 tap placement and staged cues preserve shared controls', () => {
  const exp1 = source('js/experiments/exp1.js');
  const css = source('css/app.css');

  assert.match(exp1, /function tapPlace\(item\)[\s\S]*Lab\.drag\.keyboardPlace\(card, item\)/);
  assert.match(exp1, /onClick: tapPlace/);
  assert.match(exp1, /await beginAction\('water'\)/);
  assert.match(exp1, /await beginAction\('gravel'\)/);
  assert.match(exp1, /await beginAction\(id\)/);
  assert.match(exp1, /Lab\.loop\.prefersReducedMotion\(\)/);
  assert.match(exp1, /Lab\.stage\.shot\(FOCUS_B, 650\)/);
  assert.match(exp1, /Lab\.stage\.shot\(OVERVIEW, Lab\.loop\.prefersReducedMotion\(\) \? 0 : 720\)/);
  assert.match(exp1, /pathLength="1"/);
  assert.match(css, /\.exp1-action-cue-route[^}]*stroke-dashoffset: 1/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.exp1-action-cue-route, \.exp1-action-cue-dot, \.exp1-action-cue-target/);
  assert.match(css, /body\.is-motion-paused \*.*animation-play-state: paused/s);
});
