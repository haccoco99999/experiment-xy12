// One-time helper (already run – the result, vendor/three.classic.js, is included, so nobody needs to run this;
// it only works next to the original "v1" folder that holds three.js in node_modules).
// Wraps the official three.js r185 CommonJS build so it can be
// loaded with a plain <script> tag (no modules, no server) and defines window.THREE.
// three.js is MIT licensed — the licence text is copied next to the output file.
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..', '..', 'v1', 'node_modules', '.pnpm', 'three@0.185.1', 'node_modules', 'three', 'build', 'three.cjs');
const licenceSrc = join(here, '..', '..', 'v1', 'vendor', 'LICENSE.three.txt');
const outDir = join(here, '..', 'vendor');

const body = readFileSync(src, 'utf8');
const wrapped =
  '/*! three.js r185 - MIT License - wrapped as a classic <script> (defines window.THREE) */\n' +
  '(function (global) {\n\'use strict\';\nvar module = { exports: {} };\nvar exports = module.exports;\n' +
  body +
  '\nglobal.THREE = exports;\n})(typeof window !== \'undefined\' ? window : globalThis);\n';

writeFileSync(join(outDir, 'three.classic.js'), wrapped);
copyFileSync(licenceSrc, join(outDir, 'LICENSE.three.txt'));
console.log('three.classic.js written:', (wrapped.length / 1024 / 1024).toFixed(2), 'MB');
