// Every Vietnamese sentence in js/content/*.vi.js under `md` must appear word for word in the md file.
// (The `app` group is text written for the app and is not checked.)
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// The specification file lives OUTSIDE this project folder (one level up). If it is not there (for example
// on a fresh copy of the project) the check is skipped instead of failing.
const mdPath = path.join(__dirname, '..', '..', 'THÍ NGHIỆM 1909.md');
const hasMd = fs.existsSync(mdPath);
const md = !hasMd ? '' : fs.readFileSync(mdPath, 'utf8')
  .replace(/\\([\\`*_{}\[\]()#+\-.!|<>~])/g, '$1')       // Markdown escapes such as "Chính xác\!"
  .replace(/\*\*/g, '')                                   // bold markers are formatting, not text
  .replace(/ /g, ' ');

function strings(obj, trail, out) {
  if (typeof obj === 'string') out.push([trail, obj]);
  else if (Array.isArray(obj)) obj.forEach((v, i) => strings(v, trail + '[' + i + ']', out));
  else if (obj && typeof obj === 'object') Object.keys(obj).forEach((k) => strings(obj[k], trail ? trail + '.' + k : k, out));
  return out;
}

const dir = path.join(__dirname, '..', 'js', 'content');
fs.readdirSync(dir).filter((f) => f.endsWith('.vi.js')).forEach((file) => {
  test(file + ': every "md" string is in the md file', { skip: hasMd ? false : 'the specification file "THÍ NGHIỆM 1909.md" is not next to this folder' }, () => {
    global.window = global; global.Lab = { content: {} };
    delete require.cache[require.resolve(path.join(dir, file))];
    require(path.join(dir, file));
    const key = Object.keys(global.Lab.content)[0];
    const list = strings(global.Lab.content[key].md, key + '.md', []);
    assert.ok(list.length > 20, 'expected many strings');
    const missing = list.filter(([, s]) => !md.includes(s));
    assert.deepStrictEqual(missing.map(([p, s]) => p + ' → ' + s), []);
  });
});
