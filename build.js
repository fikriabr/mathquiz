const fs = require('fs');
const order = ['core', 'gen_sd', 'gen_smp', 'gen_sma', 'gen_trig', 'gen_sd2', 'gen_kuliah', 'gen_kuliah2', 'gen_umum', 'gen_extra', 'meta', 'bank', 'mathfmt', 'app'];
const js = order.filter(f => fs.existsSync(`src/${f}.js`)).map(f => fs.readFileSync(`src/${f}.js`, 'utf8').replace(/^'use strict';\n/, '')).join('\n');
const css = fs.readFileSync('src/katex.css', 'utf8') + '\n' + fs.readFileSync('src/style.css', 'utf8');
const html = `<title>Jagoan Matematika</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
${css}
</style>
<div id="app"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script>
'use strict';
${js}
</script>
`;
fs.writeFileSync('index.html', html);
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + html + '</body></html>');
fs.writeFileSync('preview.html', '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + html + '</body></html>');
console.log('index.html', (html.length / 1024).toFixed(0) + ' KB');
