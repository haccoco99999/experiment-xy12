const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const source = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('scene alternatives are real panel buttons with focus restoration', () => {
  ['exp2.js', 'exp4.js', 'exp5.js'].forEach((file) => {
    const code = source('js/experiments/' + file);
    assert.match(code, /X\.sceneButton = function/);
    assert.match(code, /'data-scene-action': key/);
    assert.match(code, /type: 'button'/);
    assert.match(code, /document\.activeElement/);
    assert.match(code, /focus\(\{ preventScroll: true \}\)/);
  });
});

test('gas buttons and pointer drops use the same decision and animation paths', () => {
  const exp2 = source('js/experiments/exp2-gas.js');
  const exp4 = source('js/experiments/exp4-air.js');

  assert.match(exp2, /return attemptGas\(it, regionOf\(info\.client\.x, info\.client\.y\)\)/);
  assert.match(exp2, /return it \? attemptGas\(it, move\.to\)\.ok : false/);
  assert.match(exp2, /X\.sceneButton\(.+Chuyển .+ vào lá.+Đưa .+ ra khỏi lá/);

  assert.match(exp4, /return attemptGas\(it, regionOf\(info\.client\.x, info\.client\.y\)\)/);
  assert.match(exp4, /return it \? attemptGas\(it, move\.to\)\.ok : false/);
  assert.match(exp4, /X\.sceneButton\(.+Cho .+ đi vào cơ thể.+Thải .+ ra ngoài/);
});

test('Experiment 5 keyboard actions reuse all pointer fertilization helpers', () => {
  const code = source('js/experiments/exp5-fert.js');

  assert.match(code, /X\.sceneButton\('Làm hạt phấn nảy mầm'.+tapPollen\(true\)/);
  assert.match(code, /advanceTube\(c\.t\)/);
  assert.match(code, /advanceTube\(from \+ \(1 - from\) \* k\)/);
  assert.match(code, /return acceptOvule\(it, bd < 48 \? best : -1\)/);
  assert.match(code, /return acceptOvule\(null, 0\)\.ok/);
  assert.match(code, /return acceptMale\(it, male, c, inside\)/);
  assert.match(code, /return acceptMale\(item3, item3\.object, c, true\)\.ok/);
  ['Đưa ống phấn tới buồng nhụy', 'Nối ống phấn với một noãn', 'Đưa tế bào đực vào noãn'].forEach((label) => {
    assert.ok(code.includes(label), label);
  });
});
