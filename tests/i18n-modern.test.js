const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function loadTypeScript(file) {
  const source = read(file);
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports, require, console, Math, Array, Number }, { filename: file });
  return module.exports;
}

test('title statistics are calculated from the Vietnamese catalog', () => {
  const { summarizeCatalogTitles, SUPPORTED_LOCALES } = loadTypeScript('src/catalog.ts');
  assert.strictEqual(JSON.stringify(SUPPORTED_LOCALES), '["vi"]');
  const catalog = Array.from({ length: 8 }, (_, index) => ({
    n: index + 1,
    id: 'exp' + (index + 1),
    group: index < 4 ? 'plant' : 'animal',
    emoji: '',
    title: index === 7 ? 'Tiêu đề dài nhất trong tám bài' : 'Tiêu đề',
    sub: '',
    available: index !== 0 ? true : false
  }));

  const result = summarizeCatalogTitles(catalog);
  assert.strictEqual(result.total, 8);
  assert.strictEqual(result.available, 7);
  assert.strictEqual(result.plant, 4);
  assert.strictEqual(result.animal, 4);
  assert.strictEqual(result.longest.id, 'exp8');
  assert.strictEqual(result.longest.length, Array.from(catalog[7].title).length);
  assert.ok(result.averageLength > 0);
});

test('the modern shell keeps every visible Svelte title in Vietnamese', () => {
  const i18n = read('src/i18n.ts');
  const home = read('src/ModernHome.svelte');
  const card = read('src/ExperimentCard.svelte');
  const bridge = read('src/lab-modern.ts');
  const app = read('js/core/app.js');
  const ui = read('js/core/ui.js');

  assert.match(i18n, /from '@sveltia\/i18n'/);
  assert.match(i18n, /addMessages\('vi', viMessages\)/);
  assert.strictEqual((i18n.match(/'catalog\.exp\d\.title'/g) || []).length, 8);
  assert.match(i18n, /initialLocale: 'vi'/);
  assert.doesNotMatch(i18n, /addMessages\('en'/);
  assert.doesNotMatch(i18n, /Garden Science Lab|Start exploring|Title language|EXPERIMENT \{/);
  assert.doesNotMatch(i18n, /readSavedLocale|setLocale|addMessages\('en'/);
  assert.match(i18n, /localStorage\.removeItem\('lab\.locale'\)/);
  assert.doesNotMatch(home, /modern-title-language|changeLocale|SUPPORTED_LOCALES|setLocale/);
  assert.doesNotMatch(bridge, /setLocale/);
  assert.match(home, /summarizeCatalogTitles\(localizedCatalog\)/);
  assert.match(home, /class="lm-shell" lang="vi"/);
  assert.match(card, /card\.startLabel/);
  assert.match(bridge, /getExperimentTitle/);
  assert.match(app, /UI\.setExperiment\(exp, modernText\('getExperimentTitle'/);
  assert.match(app, /document\.documentElement\.lang = 'vi'/);
  assert.match(app, /console\.error\('Không mở được trang chủ Svelte; dùng giao diện cũ\.', e\);[\s\S]*document\.documentElement\.lang = 'vi'/);
  assert.match(ui, /var title = displayTitle \|\| exp\.title/);
  assert.match(ui, /els\['lab-title'\]\.lang = displayLocale \|\| 'vi'/);
});

test('Svelte template checking uses the native TypeScript 7 checker', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.match(pkg.scripts['check:modern'], /^svelte-check-native /);
  assert.strictEqual(pkg.devDependencies['@typescript/native-preview'], '7.0.0-dev.20260707.2');
  assert.strictEqual(pkg.devDependencies['svelte-check-native'], '1.12.2');
  assert.match(pkg.scripts['check:typescript'], /tsc --noEmit/);
});
