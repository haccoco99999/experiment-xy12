// Developer helper: builds tests/shots.html from index.html (same scripts, plus tests/shots.js) so that
// headless Edge/Chrome can screenshot scripted states straight from file:// – which is also the real
// "double-click" test of the site.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let html = readFileSync(join(root, 'index.html'), 'utf8');
html = html.replace(/(src|href)="(css|js|vendor)\//g, '$1="../$2/');
html = html.replace('</body>', '<script src="shots.js"></script>\n</body>');
writeFileSync(join(root, 'tests', 'shots.html'), html);
console.log('tests/shots.html written');
