import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = join(root, 'index.html');
const outputPath = join(root, 'Thi-nghiem-tat-ca-trong-1-file.html');

function readLocal(path) {
  if (/^(?:https?:)?\/\//.test(path)) throw new Error(`Không thể nhúng tài nguyên ngoài: ${path}`);
  const clean = path.replace(/^[.\/]+/, '');
  return readFileSync(join(root, clean), 'utf8');
}

function inlineCss(html) {
  return html.replace(/<link\b([^>]*?)href="([^"]+\.css)"([^>]*)>/gi, (tag, before, path, after) => {
    if (path.startsWith('http')) return tag;
    const css = readLocal(path).replace(/<\/style/gi, '<\\/style');
    return `<style data-source="${path}"${before}${after}>\n${css}\n</style>`;
  });
}

function inlineScripts(html) {
  return html.replace(/<script\b([^>]*?)src="([^"]+)"([^>]*)><\/script>/gi, (tag, before, path, after) => {
    if (path.startsWith('http')) return tag;
    const script = readLocal(path).replace(/<\/script/gi, '<\\/script');
    return `<script data-source="${path}"${before}${after}>\n${script}\n</script>`;
  });
}

let html = readFileSync(sourcePath, 'utf8');
html = inlineCss(html);
html = inlineScripts(html);

if (/(?:src|href)="(?:css|js|vendor|dist-modern)\//i.test(html)) {
  throw new Error('Vẫn còn tài nguyên source chưa được nhúng vào bản offline.');
}

html = html.replace(
  '<!doctype html>',
  '<!doctype html>\n<!-- Bản offline được tạo bằng `npm run build`: mở trực tiếp từ ổ đĩa, không cần mạng. -->'
);

writeFileSync(outputPath, html);
console.log(`Đã tạo ${outputPath} (${Buffer.byteLength(html).toLocaleString('vi-VN')} byte)`);
